#!/bin/bash

#This script generates one export for each year of a IF Tilemill project to mbtiles format

#Instructions:
#Run using 'bash tilemill-export.sh [project-name]'

#Assumptions
# - stylesheet = style.mss

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
	sed -i -r -e 's/ano=2[0-9]{3}/ano='$year'/g' ~/Documents/MapBox/project/$project/style.mss
	/usr/share/tilemill/index.js export if_occurrences ~/Documents/if_occurrences-$year.mbtiles --bbox='-10.2063,36.5361,-5.8557,42.4640' --format=mbtiles --minzoom=4 --maxzoom=13 --metatile=2
done