#!/bin/bash

#This script generates one export for each year of a IF Tilemill project to mbtiles format

#Instructions:
#Run using 'bash tilemill-export.sh [project-name]'

#Assumptions
# - stylesheet = style.mss
# - selector = ano

project=${1%/}
#Make sure the field separator is a ','
IFS=$','
range=2001,2002,2003,2004,2005,2006,2007,2008,2009,2010,2011

#Check if a project has been specified
if [ -z $project ]; then
	echo You haven\'t specified a project, please specify one by using: bash tilemill-export.sh \[project\]
	exit
fi

for year in $range
do
	#Change the selector to the year we want to export
	sed -i -r -e 's/ano=2[0-9]{3}/ano='$year'/g' ~/Documents/MapBox/project/$project/style.mss
	#Change the project name and description to include indication of year
	sed -i -r -e 's/\"name\": \"IF Occurrences\"/\"name\": \"IF Occurrences '$year'\"/g' ~/Documents/MapBox/project/$project/project.mml
	sed -i -r -e 's/\"description\": \"IF - occurrences per admin area\"/\"description\": \"IF - occurrences per admin area '$year'\"/g' ~/Documents/MapBox/project/$project/project.mml
	
	#Do the actual export
	/usr/share/tilemill/index.js export $project ~/Documents/if_occurrences-$year.mbtiles --bbox='-10.2063,36.5361,-5.8557,42.4640' --format=mbtiles --minzoom=4 --maxzoom=13 --metatile=2

	#and upload it. On project we have to specify a unique name, otherwise MapBox will just overwrite the project each time you upload
	/usr/share/tilemill/index.js export $project-$year ~/Documents/if_occurrences-$year.mbtiles --format=upload --syncAccount="flipside" --syncAccessToken=""

	#Change the project name and description back to original
	sed -i -r -e 's/\"name\": \"IF Occurrences [0-9]{4}\"/\"name\": \"IF Occurrences\"/g' ~/Documents/MapBox/project/$project/project.mml
	sed -i -r -e 's/\"description\": \"IF - occurrences per admin area [0-9]{4}\"/\"description\": \"IF - occurrences per admin area\"/g' ~/Documents/MapBox/project/$project/project.mml  
done