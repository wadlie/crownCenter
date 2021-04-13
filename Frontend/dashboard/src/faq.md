

# FAQ

## Home Page

1. How do I search for my farm?  
Answer: Type the three letter farm code in the search bar at the top in all capital letters. As soon as you do, the interactive map should automatically load the pin associated to your farm.
2. What if I still can't find my farm?  
Answer: Click on the Farm tab next to the Error Logs tab and search for your farm code. If you can find it, click on it and make sure the map loads your farm. If you cannot find your farm in the list, make sure that you have been enrolled into the CROWN Project.
3. How do I read the Error Log?  
Answer: The Error Log contain two types of errors: one for sensor data and another based on validation errors from forms for manual input. The timestamp when the error was written is in UTC time and then a quick message is shown.  
Example: Sensor_Validation error with message: Error(s) contained in ts_up in line 75462: Data is [None, WYE, 1, c, 10.96, 2018-06-12T13:40:30Z, 19.24, 94.63, 19.75, c, 26.1, 19.6, 14.1, 136, 1077, 75]  
Sensor_Validation means that there was an issue with a line of sensor data from a certain farm code.  
Example: database error with message: invalid input value for enum "enum_Farms_state": "NC"  
In this case, there was a database error in which an invalid input for the Farm State was provided and the invalid enum was also given to the user.
## Sensor
1. What do the colors on the left table signify?  
Answer: If the fill is...  
	1. Red: It has been 2 or more hours since a sensor in the farm has sent data to the database  
	2. Yellow: It has been between 1 and 2 hours since a sensor in the farm has sent data to the database  
	3. Green: It has been less than 1 hour since a sensor sent data to the database.  
2. What am I looking at on the right hand table?  
Answer: The columns tell the viewing the following information:  
	1. State: The state in which the sensor is operating in  
    2. Farm Code: The farm code that represents the farm that the sensor is operating in  
    3. Total \# of Readings: Total readings that the sensor has made  
    4. Total \# of RH: Total readings of sensor data where a relative humidity was recorded  
    5. \# of B Treatments: Total readings of sensor data for bareground treatment  
    6. \# of C Treatments: Total readings of sensor data for cover crop treatment  
    7. Last RH: Latest timestamp for a record of sensor data where a relative humidity was recorded  
    8. Last B Treatment: Latest timestamp for a record of sensor data for bareground treatment  
    9. Last C Treatment: Latest timestamp for a record of sensor data for cover crop treatment  
## Form

1. What am I looking at on the Form page?  
Answer: The Form page gives an overview of all the farms and how much progress each farm has made in the manual data collection for the different types of data.  
2. How do I view a more in-depth look at my specific farm?  
Answer: You can either click on the blue button associated to your farm or you can search for your Farm Code in the appropriate filter at the top of the page.  
3. What are these doughnuts that I see once I search for my farm?  
Answer: The doughnuts are a visual representation of how far along your farm is for that subsection of data. Clicking on a doughnut will give you even more detail about the data collected.  
4. Okay. I've clicked on a doughnut and I'm not sure what I'm seeing.  
Answer: Each row of data corresponds to a barcode and that is what is listed on the left most column. From there, if a specific piece of information was submitted and is available in our database for that barcode, then you will see a green check for that column for that barcode. If not, you will see a red X. That means that the data has not been submitted yet for that specific barcode.  
5. Can I see the specific data that I've entered for my barcode?  
Answer: Unfortunately not at this time.