#!/bin/bash
#Script for the IF project, transforming the original ZIP data to geoJSON

#Place all the ZIP files in one folder and run the script on it.
#Make sure to also place the causas.csv in the same folder

#This project depends heavily on CSVKIT. For in2csv, part of CSVKIT, we're using the latest
#dev that's up at Github: https://github.com/onyxfish/csvkit/. Otherwise, the --sheet option
# would not work properly.

start_time=$SECONDS

#Change Internal Field Separator to new line. Otherwise, it will think spaces in filenames are field separators
IFS=$'\n'

folder=${1%/}
count_zip=`ls $folder | grep '\.zip' | wc -l`

#Check if a folder has been specified
if [ -z $folder ]; then
	echo You haven\'t specified a folder. Please specify one by using:  bash transform.sh \[folder\]
	exit
#Check if the folder contains any .zip files
elif [[ $count_zip == 0 ]]; then
	echo The folder doesn\'t contain any .zip
	exit
#The folder should also contain the causas.csv
elif [ `ls $folder | grep 'causas.csv' | wc -l` == 0 ]; then
	echo It seems you dont have the causas.csv present in the folder: $folder
	exit
fi

#Checking if the dependencies are met.
#Some of the tools used are part of csvkit, like in2csv, csvjoin, csvstack, etc
#Based on: http://www.snabelb.net/content/bash_support_function_check_dependencies

deps_ok="yes"
for dep in in2csv ogr2ogr #in2csv is part of csvkit
do
    if ! which $dep &>/dev/null;  then
        if [[ $dep == "in2csv" ]]; then
        	echo -e "\nThis script requires a couple of tools that are provided by csvkit."
        	echo -e "You might be able to install csvkit by using:"
        	echo -e "\t\tpip install csvkit"
        	echo -e "More info: http://csvkit.readthedocs.org/en/0.5.0/index.html#installation"
        elif [[ $dep != "in2csv" ]]; then
            echo -e "\nThis script requires $dep to run but it is not installed."
            echo -e "If you are running ubuntu or debian you could try"
            echo -e "\t\tsudo apt-get install $dep"
    	fi
		deps_ok="no"
    fi
if [[ "$deps_ok" == "no" ]]; then
	echo -e "Aborting!\n"
	exit
fi
done

echo Prepping the environment...

#Giving the final files a nice name
comb_file=IFdata-combined
cd $folder

#Make sure if we didn't accidentily leave files behind
find $comb_file.json -type f -exec rm '{}' \;

#We first need to unzip each folder.
for file in *.zip
do
	unzip -q ${file}
done

#Then do some maintenance to prepare the transformation to CSV
for file in *.xls*
do
	#Extract the years and make sure we don't pass along the file extension
	year_one=`echo $file | cut -d'_' -f 2 | cut -d'.' -f 1`
	year_two=`echo $file | cut -d'_' -f 3 | cut -d'.' -f 1`
	extension=${file##*.}

	#First rename the file to the first year
	mv $file $year_one.$extension
	
	#Check if the file contains 2 years of data. If so, copy the file and rename
	if [[ $file =~ _[0-9]{4}_ ]]; then
		cp $year_one.$extension $year_two.$extension
	fi
done
##In2csv act on sheet alone. Only works in latest csvkit, not 5.0.0 which is the stable one.
echo Generating the CSV files...	

for file in *.xls*
do
	#Clean up the filename, remove extension
	file_name=${file%.*}
	sheet_name=`echo $file_name` 

	#in2csv on the sheet that matters
	in2csv --sheet $sheet_name $file > $file_name.csv
done

echo About to combine all the CSV files into one.

#List all CSVs in the folder, on one line (-L 1)
list_csv=`ls . | grep '^20[0-9]*.csv$' | xargs -L 1 echo`

#Combine all the CSVs in one combined file
csvstack $list_csv > $comb_file.csv

#We need to create a .VRT to let ogr2ogr know how it can extract the spatial information
#http://gis-lab.info/docs/gdal/gdal_ogr_user_docs.html#csv
echo "<OGRVRTDataSource>
	<OGRVRTLayer name=\"$comb_file\">
		<SrcDataSource>$comb_file.csv</SrcDataSource>
    	<GeometryType>wkbPoint</GeometryType>
    	<LayerSRS>EPSG:20790</LayerSRS>
    	<GeometryField encoding=\"PointFromColumns\" x=\"x\" y=\"y\"/>
	</OGRVRTLayer>
</OGRVRTDataSource>" > $comb_file.vrt

echo Reproject the coordinate system

#Reproject the CSV coordinates to a more useful format.
#http://gis-lab.info/docs/gdal/gdal_ogr_user_docs.html#ogrinfo
ogr2ogr -f CSV -nlt POINT tmp IFdata-combined.vrt -lco GEOMETRY=AS_XY -t_srs EPSG:4326

#Housekeeping
rm $comb_file.csv
mv tmp/$comb_file.csv .
rm -r tmp

#Update the VRT to reflect the re-projection
echo "<OGRVRTDataSource>
	<OGRVRTLayer name=\"$comb_file\">
		<SrcDataSource>$comb_file.csv</SrcDataSource>
    	<GeometryType>wkbPoint</GeometryType>
    	<LayerSRS>EPSG:4326</LayerSRS>
    	<GeometryField encoding=\"PointFromColumns\" x=\"X\" y=\"Y\"/>
	</OGRVRTLayer>
</OGRVRTDataSource>" > $comb_file.vrt

echo Add more meaning and cleanup the data.

#We join the CSV with the list of causes to have a more meaningful description at hand
#Then the following columns are being removed:
# - original x & y
# - duplicate cause id (from csvjoin)
csvjoin --left $comb_file.csv causas.csv -c 34,1 | csvcut --not-columns 11,12,36 > $comb_file-tmp.csv

#Create a leaner CSV for mapping purposes.
#...first we're cutting out most columns
csvcut --columns 1,2,3,4,10,23,26 $comb_file-tmp.csv > $comb_file-condensed.csv 
#...then we are removing those rows that are False Alarms
sed -i '/^[^,]*,[^,]*,[^,]*,[^,]*,[^,]*,[^,]*,1/d' $comb_file-condensed.csv

#Replace the original CSV with the cleaned up version
rm $comb_file.csv
mv $comb_file-tmp.csv $comb_file.csv

echo Generating the JSON file...

#Finally convert it to geoJSON.
ogr2ogr -f geoJSON -nlt POINT $comb_file.json $comb_file.vrt

echo Doing some final housekeeping...

#Doing some final housekeeping.
#We're leaving the combined CSV (even though coordinates are not reprojected) for analysis purposes.
find . -type f \( -name "*.xls*" -or -name "20*.csv" -or -name "*.vrt" \) -exec rm '{}' \;

elapsed_time=$(($SECONDS - $start_time))

echo The geoJSON was prepared. The whole process took around $elapsed_time seconds. Enjoy.


#TODO:
# ENHANCEMENT: any cleanup we want to do on the columns

exit
done