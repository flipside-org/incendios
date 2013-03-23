##Admin area
_Projection: EPSG:900913_
UTF-8

The admin area dataset contains an overview of the administrative areas in Portugal, from level 1 to 3. Besides basic information about the area, it also contains min and max coordinates to be able to zoom to the area, and the center coordinates for label placement.  It contains the following data on each area:

| Property | Example | Description |
| --- | --- | --- |
| _id | 081103 | Unique ID of the admin area. Sometimes called Dicofre. We're using leading zero's |
| name | Portimão | Name of the area |
| type | 3 | Level of area (0, 1, 2, or 3) |
| parent_id | 0811 | ID of the direct parent |
| area_ha | 9115.26 | Area of the administrative area measured in Ha |
| minx | -963445.917197153 | The minimum x coordinate |
| miny | 4473456.86537368 | The minimum y coordinate |
| maxx | -946509.571599409 | The maximum x coordinate |
| maxy | 4496688.75925506 | The maximum y coordinate |
| cntx | -954977.744398281 | The center x coordinate |
| cnty | 4485072.81231437 | The center y coordinate |

For the GeoJSON, 'cntx' and 'cnty' were used as the coordinates.

Step-by-step explanation of how the extent was built:

1. From the original CAOP shapefiles (for every admin level), we generated shapefiles with the extent in QGIS (Polygon from layer extent)
2. We merged the newly generated extent shapefiles with the original ones to make sure that the original attributes of each feature were saved. (including the unique ID)
3. We merged the four levels into one, resulting in a shapefile containing all the districts, municipalities and freguesias.
4. The attributes were saved as a CSV file on Unique ID and Dicofre
5. With ```csvjoin```, we merged the extent shapefile with the original list of admin areas: ```csvjoin admin_areas_pt.csv pt_caop2011_v02-extent-merged.csv -c 1,1 | csvcut -c 1,2,3,4,7,8,9,10,11,12,13 > admin_areas_pt_extent.csv``` In the process, we cut out the obsolete columns using ```csvcut```
6. With ogr2ogr we transformed the CSV into a point geojson. (first creating a VRT for the CSV) ```ogr2ogr -nlt POINT -f GeoJSON admin_areas_pt_extent.json admin_areas_pt_extent.vrt```