# Documentation:
## Cron Documentation
In order to setup cron:
1. Install cron (possibly called cronie) package from respective package manager
    - apt 
    - yum 
    - pacman 
2. Start and enable the service through: 
    1. sudo systemctl start cronie 
    2. sudo systemctl enable cronie 
    3. Locate the absolute path of the sensor parser script (ex. `/home/crown/sensordata/parser.py`)
    4. Edit the cron job 
        - Edit the list of jobs through `crontab -e`
        - Add the line `5 * * * * python3 /home/crown/sensordata/parser.py` at the bottom 
            - Default editor may be vi or vim, so to add the line: 
                1. Press `shift+g `
                2. Press `o`
                3. Insert line from above
                4. Press `control+c`
                5. Press `:wq`
                6. If anything goes wrong, you can restart by pressing `control+c` and pressing `:q!`
            - Other text editors will be more intuitive to use
## Home Page Documentation
1. Farmcode
    - This is where the user will input a farm code to focus the map on the pinpoint containing the farmcode
    - If the farmcode does not exist in the database, nothing will happen
2.  Map Features
    - The map is interactive, so the user can traverse the map by dragging their mouse
    - Each pinpoint will have a set of information that will pop up when clicked 
        1. Farm Code: The farm's respective 3 digit farm code
        2. Year: The year that they are or were active
        3. State: The state in which the farm operates in
        4. Soil: What percentage of soil forms the farm has completed
        5. Biomass: What percentage of biomass forms the farm has completed
        6. Bag: What percentage of bag forms the farm has completed
        7. Yield: What percentage of yield forms the farm has completed
        8. Notes: Any miscellaneous notes that the farm owners wish to display
        9. Google Map: Links to the address of the farm through Google Maps
3.  Error Log Features
    - Displays any errors that may come through technician input or sensor data input
    - Format is as follows: `(Date) farmcode: (FarmCode) (Name of Error) with message: (Message)`
4.  Farms Features
    - Displays all farms with their respective state and year as tags
    - Clicking on the farm name will focus map on the specific farm
    - Farmer dropdown menu associated with every farm will display each farmer on the farm 
        - Clicking on the farmer will create a modal that contains the farmer name, email, and phone number
## Sensor Documentation
1.  Last Updated Table
    1. Each sensor will have a row containing which state and farm it is from and how long it has been since the last update
    2. State 
        - The two letter state code can be filtered through the text box
        - The filtering is case insensitive
    3. Farm Code 
        - I. The three letter farm code can also be filtered
        through the respective text box
        - II. The filtering is case insensitive
    4.  Hours Since Last Update 
        - This signifies the last time the
        sensor has uploaded data to the database
        - Coloring
            - Green for updates under 1 hours
            - Yellow for updates under 1.5 hours
            - Red for upates over 2 hours
2.  Sensor Summary
    - Each sensor will have a row containing a brief summary of
        metrics
    - Metrics: 
        1. State: The state in which the sensor is operating in
        2. Farm Code: The farm code that represents the farm that the sensor is operating in
        3. Total \# of Readings: Total readings that the sensor has made
        4. Total \# of RH: Total readings of sensor data where a relative humidity was recorded V. \# of B Treatments: Total readings of sensor data for bareground treatment
        5.  \# of C Treatments: Total readings of sensor data for cover crop treatment
        6. Last RH: Latest timestamp for a record of sensor data where a relative humidity was recorded
        7. Last B Treatment: Latest timestamp for a record of sensor data for bareground treatment
        8. Last C Treatment: Latest timestamp for a record of sensor data for cover crop treatment
## Form Documentation
1.  Farmcode 
    - This is where the user will input a farm code to get more information on the farm's submitted form.
    - The text field is case sensitive.
    - If there is no matching farm with the farm code, the Farm Percentage table will display 0% completed pie charts.
    - Any input that is not null in this section will automatically change the state of the section below from farms table to specific farm forms. More explanation of the two states in section 4.
2.  State
    - This is where the user will pick a state from a dropdown menu to filter by state.
    - After the user chooses a state, the forms in the Farm Percentage table will show only the farms that are operating in the selected state.
3. Year
    - This is where the user will input a year in which a farm was operational.
    - The farms shown in the table will be the ones that have been operational in the specified year.
    - The format of the year must be in full form (i.e. 2019).
4.  Farm Percentage
    - There are two states to this section: the farms table and the specific farm forms.
    - Farms Table 
        1. This is a list of farms that meet the requirements from the filters specified by the user in the section above.
        2. Clicking on the blue farm code button or inputting a farm code in the farm code filter will switch the state from Farms Table to Specific Farm Forms
        3. The state specifies where the farm is operaional
        4. Year specifies which year the farm was active 
        5. Soil displays the percentage of the forms that have been filled out. If everything is filled out, there will be a green checkmark next to the 100%. Otherwise, there will be a red X.
        6.  Biomass functions the same way as Soil (part 5) but for biomass forms.
        7. Bag functions the same way as Soil (part 5) but for bag forms.
        8. Yield functions the same way as Soil (part 5) but for yield forms.
    - Specific Farm Forms 
        1. Displays the completion status of each form for a specific farm in the form of a pie chart.
        2. Clicking on a pie chart will display all submissions for the section (i.e. soil).
            - Each submission will have a unique barcode that will contain the farm code of the farm.
            - Any part of the form that does not have a null value will be displayed as a green check.
            - Any part of the form that has a null value will be displayed as a red X.
        3. While in this state, changing any of the filters besides the farm code will have no effect.
## Sensor Api Request
    GET sensordata/treatmentcounts Description: 
Takes no parameters and returns a JSON object that contains all farm codes grouped by treatment type and the number of sensor data lines in the database for each farm code & treatment pair. Query that it executes is the following:  
`select code, trt, count(\*) from "SensorData" group by code, trt Sample Response [ { "code": "ALR", "trt": "b", "count": "3759" }, { "code": "ALR", "trt": "c", "count": "6091" }, { "code": "ASD", "trt": "b", "count": "3" }, { "code": "ASD", "trt": "c", "count": "4" } ]`

    GET sensordata/rhcounts Description: 
Takes no parameters and returns the number of rows in the SensorData table where the relative humidity was recorded. Query that it executes is the following:  
`select code, count(\*) from "SensorData" where rh is not null group by code Sample Response [ { "code": "ALR", "count": "4849" }, { "code": "BGS", "count": "7199" }, { "code": "BRL", "count": "100" }, { "code": "BWA", "count": "160" }, { "code": "BWB", "count": "4" } ]`

    GET sensordata/latesttreatmenttimestamp Description: 
Takes no parameters and returns the latest timestamp for each farm for the b and c. Query that it executes is the following:  
`select code, trt, max(timestamp) from "SensorData" group by code, trt Sample Response [ { "code": "ALR", "trt": "b", "max": "2018-08-24T17:00:17.000Z" }, { "code": "ALR", "trt": "c", "max": "2018-07-14T07:00:15.000Z" }, { "code": "ASD", "trt": "b", "max": "2018-05-04T18:45:18.000Z" }, { "code": "ASD", "trt": "c", "max": "2018-04-27T19:40:04.000Z" } ]`

    GET sensordata/latestrhtimestamp Description: 
Takes no parameters and returns the latest timestamp for each farm where the relative humidity was recorded. Query that it executes is the following:  
`select code, max(timestamp) from "SensorData" where rh is not null group by code Sample Response [ { "code": "ALR", "max": "2018-06-28T19:00:19.000Z" }, { "code": "BGS", "max": "2018-07-29T15:00:20.000Z" }, { "code": "BRL", "max": "2018-06-05T18:20:26.000Z" } ]`
## Frontend Documentation
##### Index.js:
Main file that renders all the components of the dashboard. Uses axios for get requests. React Bootstrap tabs was imported for the tab functionality that calls each component used. This file is used as the highest hierarchical component that calls every other component within it. In this file, we do all the processing needed for Homepage and Formpage. Additionally It calls all the tab components such as HomePage/SensorPage/FormPage/About/Documentation.

TabSection Class:
- ComponentDidMount():  Sets isLoadingForm,isLoadingFarm,formsub,farmsInfo states. 
    - isLoading states are for the loading screen component 
    - Formsub uses axios get request of all formSubmissions 
    - farmsInfo uses axios get request to get all farms
- percent(Soil/Biomass/Bag/Yield) - Given an array, iterates through the array to find the amount of nulls total. 
   - Takes ratio of Nulls vs total possible values (Expected \# barcode \* \# of col) 
   - The resulting percentage is 1 - Ratio of nulls, giving us a ratio of non nulls. 
   - Null values were checking for can be found here https://docs.google.com/document/d/1sYBG9xoswHbxLFAQpfREsxxS8oN-RGzs
H5pu2iKiu-A/edit?usp=sharing. (If you want to change to get percentage by expected number of barcodes. Change the "len" variable to the expected number of barcodes. Len normally represents current amount of barcode.)
- render() - Two main variables temp and tempPercent. 
    - Temp holds `{"state":"","year":"","soil":[],"biomass":[],"yield":[],"bag":[]}` with the farmcode as its key. All formsubmissions related toward the farmcode will be appended to its respective group (soil/biomass/yield/bag). 
    - tempPercent holds `{"state":"","year":"","soil":0,"biomass":0,"yield":0,"bag":0}`, storing the percentages for each farmcode that was computed by percent(Soil/Biomass/Bag/Yield) 
    - HTML: The html returned for this page is a single div that contains our tab container. Each of our tabs calls a component used for that specific tabs. Component FormPage and HomePage take in a parameter that holds a list of key value pairs that hold farm code as keys and json of percentages as values.
##### Homepage.js: 
Represents the homepage of the dashboard that shows the leaflet map, Error logs, and farmcode list. Home page uses the react-leaflet api and react-input groups for the farmcode input text. Leaflet relies on a height style defined for it’s css to work. Code after imports is defaults for using leaflet.

- setFarmCode() 
    - Function that is called whenever anything in the input box is changed. Readjusts the leaflet latitude and longitude when a correct farm code is inputted. Percent(Soil/Biomass/Yield/Bag) 
    - Function just adds a string % to the end of the number so it can be viewed better in the marker popup.
##### FormPage.js: 
Form page is the datavisualization for each individual farmcode. The top row holds three input groups for Farm code filter, state filter, and year filter. Second row holds the major table of every farmcode recorded and the percentages they hold. Additionally each farmcode is a button that will turn the second row display to the doughnut display for that specific farmcode. When the farmcode input field is changed, the second row will change to the doughnut specification. When year or state is changed, the table will filter to show only farmcodes that fit their filters. When the doughnuts are clicked, the lower row of the doughnuts will show a table of each barcode corresponding to the doughnut variable clicked. 

- Parameters: this.props.percents, this.props.fullInfo 
    - Percent is for array of percents for each farmcode 
    - Fullinfo is farmcode standard information 
- handleChangeCode() 
    - Function that handles whenever onChange of Farm code text field is changed. 
    - Uses this.props.percent to create new doughnut data so doughnuts update - When input is empty, flip state back to 0 so we no longer show doughnut graph and show table instead
- botRightTable()
    - Based on specShow, it will show the checkerboard for either soil/biomass/bag/yield. This is called whenever one of the doughnuts is clicked 
    - Calls the components that show the checkerboards
- queryPercents() 
    - Functions used for filtering the overall table based state and year. Returns a table row element. Variables initialized as a red cross until farmcode variable equal to "100". Then changes to be a green check. - Multiple if statements to handle logic of filter 
- rightDisplay() 
    - Doughnut display for a farmcode. Data for doughnuts is in the form shown by variable “dataDefault” 
    - When clicked, changes specShow state to a number of its order, 1 for soil, 2 for biomass, 3 for bag, and 4 for yield.
    - When specShow changes, it uses one of the (First/Second/Third/Fourth)graph.js components.
##### FirstGraph/SecondGraph/ThirdGraph/FourthGraph.js 
- Parameters: this.props.farmCode, this.props.fullInfo 
    - farmCode just contains the string of the farmCode selected from form page 
    - fullInfo is farmcode standard information These are the components used whenever a doughnut is clicked. Depending on what state “specShow”, either first/second/third/fourthGraph.js will be used. Returns a bootstrap table with header columns based on https://docs.google.com/document/d/1sYBG9xoswHbxLFAQpfREsxxS8oN-RGzsH5pu2iKiu-A/e dit?usp=sharing. Contents of the table are shown from using displayTable(). 
- DisplayTable() 
    - Returns a map function in order to list a table of all the barcodes 
    - Map function calls eachEntry() that takes in soil/biomass/bag/yield form submission data. ForEach function used to get each index of the array that holds each individual form entry for respective farmCode. 
- EachEntry() 
    - Returns a "table row" element with \# of columns respective to the header 
    - Col variables initially assigned to red crosses that state that the element was null. If variable for the farmcode wasn’t null then it is changed to a green cross.
## Deploy Documentation
##### Dev server: 
Running the backend server on dev is simple. In the route directory, navigate to config/config.js and modify the ‘development’ property to match your needs. For example:

`development: { dialect: "postgres", username: “postgres”, password:
“postgres”, database: “api”, host: “localhost”, saltRounds: 2,
jwtSecret: 'yo-its-a-secret', tokenExpireTime: '6h', }`

Dialect, username, password, and database references your database connection, and the saltRounds, jwtSecret, and tokenExpireTime creates the JSON Web Token layer. In Frontend/dashboard, adjust your “proxy” settings to reflect the localhost that your dev backend server is running on.

##### Production Server:
Setting up the production server is the same (make sure you adjust the “proxy” to match). The current production server is running on an Azure VM in two separate Docker containers. In the VM there is a build\_prod.sh bash script that runs a docker-compose.yml command to build up the docker containers under the same network connection. To start up the docker containers, 1. Run sudo docker build -t crown-prod . in the crownCenter directory 2. Run sudo docker build -t crown-client . in the crownCenter/Frontend/dashboard directory 3. Run ./build\_prodh.sh in the crownCenter directory to start the docker containers On subsequent server side builds, you need to restart the crown-prod docker container for changes to register and update. Changes you make to the UI do not require rebuilds, unless you install a new node module.

 CROWN Forms Protocol
=====================
The CROWN Our-Sci Forms allow technicians to input data in the CROWN SQL database using a survey format. Forms will ask the user a series of questions (some of which may not be required to complete the form), and the user can then click a “Run” button to submit their information to the database. All forms are used to submit data from farms, so it is important that Start Sites be completed prior to completing forms for a farm. Otherwise, the forms will not allow the user to submit the data due to the farm not being defined.

 Getting Started
----------------

CROWN Forms are available on the Our Scikit app on the Google Play Store. Note: The Our Scikit app is only available for Android phones. To download the Our Scikit app:
1.  Navigate to the Google Play Store from the home screen of your Android-compatible phone
2.  In the search bar at the top of the screen, type in “Our Scikit” and hit enter
3.  The Our Scikit app should be listed as one of the first results. To verify that you have found the correct app, you should see a red icon with a fist and magnifying glass and the company name “Oursci LLC”. 
4.  Install the app.
5.  Once it has been installed, navigate to the app on your phone. 
6.  If this is your first time opening the app, there should be a quick tutorial which points out the major features of the app. Swipe through this tutorial. It is important that you allow Our Scikit to access your device’s location, camera, and storage. This will allow you to use the barcode scanner and GPS locator later.
7.  After you’ve finished the tutorial, you should be brought to the home page. 
8.  At the home page, you can register for an Our-Sci account or login if you already have one. However, one does not need to have an account for completing the forms. 
9.  Click on the three white lines in the top left of the top ribbon next to the text “Our Scikit”). This should bring up the sidebar which allows you to access forms, offline forms, surveys, and measurement results, and variables.
10. As of Our Scikit 2.3.5, there is no way to group forms based on the organization that they come from. So, click on the “Forms” tab, and scroll down and find the form that you would like to complete. 

First Time Completing a Form
-----------------------------

As of 05/12/2019, the first form that every technician must complete is the “CROWN - Start Sites” form. This form allows technicians to put in information about a farm in addition to a farmer’s contact information in the database. Technicians will only need to complete this form once, but it is imperative that they complete this form before completing other forms. All farms need to be registered in the database through this form.

Also, with Our Scikit 2.3.5, all formatting errors in the form will be checked at the end once you click the “Run” button. This will be discussed in more detail later. 

1.  When you first click on the form, you should see the “Start Survey” button at the bottom. Click it to proceed with the form. 
2.  The first question asks for a farmcode. This is the code attributed to the current farm. The farmcode should be inputted as three uppercase letters. To the right of the input text field is a small icon of a QR code. Clicking this will open the camera and will allow the user to scan a barcode. This may be used in other CROWN forms to scan barcodes; however, the icon will appear by default for most questions. In these cases it may be ignored.
3.  The second question asks for the enrollment year for the farm. The year should be between 0 and the current year.
4.  The third question asks for the state which the farm is located in. Currently, there are only three states available: Georgia, Maryland, and Virginia.
5.  Farm Address
6.  Farm county
7.  Farm GPS coordinates. Our Sci allows the user to use the phone's location to choose the current GPS coordinates. 
    - Simply press “PICK GEOLOCATION” and a map will appear. 
    - If the user's phone location is turned on, then the map should appear with a marker on the current location. If not, or if you would like to choose a different location, then you can search for a location in the search bar or drag and drop the map marker. 
    - Once you are satisfied with the location, click “Select this location”. A mini-map will appear to confirm the location. 
    - Press “Select”. The question will then appear again with the chosen GPS coordinates. 
    - If you need to choose the location again, click “REDO”, otherwise, press “Next”.
8.  Farmer last name
9.  Farmer unique username. If you enter a username that already exists in our database, this form will throw an error message at the end.
10. Farmer email
11. Farmer phone number
12. Additional notes (not required)
13. Agent/Technicians additional contact info for the farm (not required)
14. Submit button. In order to submit the data into the database, you need to click “run”. Otherwise, the data will only be sent to the our-sci site. 
15. Success/Error Screen. 
    - If any questions were answered incorrectly then an Error message will appear with the error message. 
    - To quickly get back to the question, click the list icon next to where it says “Our Scikit” near the top. The list of questions will appear. 
    - Click on the question with the incorrect answer to answer it again, adhering to the format it asks for. 
    - Once the changes have been made, click the list icon again and return to the “Submit” question. 
    - If an error was thrown, you must click “REDO” and repeat step 13. 
    - If all questions were answered correctly the “Success” message should appear. 
    - At this point, you may close the app, the form, or your phone. The data will have already been sent to the database.


