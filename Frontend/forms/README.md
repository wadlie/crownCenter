# CROWN Forms Scripts 

This forms folder contains the scripts attached to the [surveys](https://app.our-sci.net/#/survey) on the [our-sci](https://app.our-sci.net/#/) platform. These scripts process the answers provided in the surveys and submit the relevant data to the CROWN SQL database. We'd like to thank Manuel Di Cerbo, author of several our-sci scripts, for helping us write these scripts.

Each folder corresponds to a survey on our-sci (i.e. the "start-sites folder contains the scripts needed in order to successfully run the Start Sites survey). For good style, the folder name should always correspond with the id of the script as defined in their respective `manifest.json` file. This file will be explained in more detail later.

All scripts generally work the same, with only a few small additions and/or modifications for some.

## Directory Structure

```bash
%SCRIPT_NAME% # directory for the script
├── 
├── build # directory for intermediary build files
│   ├── ... [many]
├── data
│   └── result.json # result from running the sensor
├── dist # output directory for uploading the script
│   ├── *script-name*.zip # zip that is uploaded to the device
│   ├── manifest.json # copy of the manifest
│   ├── processor.js # compiled version of the processor script
│   └── sensor.js # compiled version of the sensor script
├── node_modules # nodejs dependencies
│   ├── ... [many]
│
├── mock # contains mock answers for testing
│ 	├── answers.json # json file that contains list of questions (with respect to form) and test answers
│ 
├── package.json # nodejs packages
├── package-lock.json # nodejs packages
├── src # source code of the measurement script
│   ├── css
│   ├── lib
│   ├── manifest.json # manifest file describing the measurement script
│   ├── processor.js # processor script
│   └── sensor.js # sensor script
└── webpack # webpack files for compiling the measurement script
    ├── deploy.js
    ├── pack-processor.js
    ├── pack-project.js
    └── pack-sensor.js
```
	
### Key Components
* %SCRIPT_NAME%/src/sensor.js
* %SCRIPT_NAME%/src/lib/database.js

Most of the script is handled by `src/sensor.js` and `lib/database.js`. The former fetches survey questions, collects answers, and stores them to be submitted by `database.js`.

## sensor.js
The main entry point for all scripts. It is responsible for retrieving survey answers from the user, processing them, and submitting the data to the CROWN database. All `sensor.js` files follow the same key steps:

1. Define required questions (from survey) and verify the survey contains them all.
2. Get answers from the survey this script is attached to. If one is testing the script on a computer, one can use mock answers which are defined in `/mock/answers.json`. The keys in this JSON correspond to the question labels on the our-sci survey while the values represent the answers.
3. Use the function `formattingHandler()` to verify if answers follow the correct format. This function uses JavaScript regular expressions and other verification methods.
4. Check if the farm/bag/sample etc. exists in the database. 
5. If the data exists, then the table will be updated. If not, a new row will be created with the submitted answers.
6. The data will be sent to `database.js` for processing.
7. If at any point there are errors in the formatting or server errors with the REST endpoints, `sensor.js` will catch the error and log the appropriate messages to the console. It will then call `app.result(ErrorLog)` which sends the data 


* `formattingHandler()` => This function uses JavaScript regular expressions and other verification methods to test if the answer provided for a given question is in the required format. If it is not in the right format, an error message is pushed onto the error log. If no errors are found with the formatting of answers, the error log remains empty.


## database.js
**Important**: database.js contains three constants named `IP`, `port`, and `config`. Any changes to where the data will be stored must change these constants.
It contains GET, PUT, and POST methods for retrieving, updating, and inserting data into the CROWN database. We use REST endpoints that rely on [JSON web tokens](https://jwt.io/) which **must be provided** in the header of GET/POST/PUT requests.

* `submitForm(barcode, formname, data)` :
Makes a POST request to a Sequelize endpoint which inserts new data in the database. It will insert new data in the SQL table that corresponds to `formname`, and it will create a new row in the FormSubmissions table in the database. It can only be used for surveys that require a barcode like Bag Dates, Bag Fresh, Bag Pre, BiomassINFIELD, etc. It takes a `barcode`, `formname`, and a `data` JSON as arguments. The keys in `data` **must** match the keys for the corresponding model in Sequelize. **Note: `formname` must be provided as a string in title case. For example, "formfieldhistory" should be provided as "FormFieldHistory".** If there is an error, it will return a rejected Promise.

* `updateForm(barcode, formname, data)` :
Makes a PUT request to a Sequelize endpoint which updates data in the database. It will update data in the SQL table that corresponds to `formname`, and it will create a new row in the FormSubmissions table in the database. It can only be used for surveys that require a barcode like Bag Dates, Bag Fresh, Bag Pre, BiomassINFIELD, etc. It takes a `barcode`, `formname`, and a `data` JSON as arguments. The keys in `data` **must** match the keys for the corresponding model in Sequelize. **Note: `formname` must be provided as a string in title case. For example, "formfieldhistory" should be provided as "FormFieldHistory".** If there is an error, it will return a rejected Promise.

* `errorHandling(err, infoType, ErrorLog)` :
Handles any errors that were created in `sensor.js`. It takes `err` (an error object), `infoType` (a string which tells the user which script threw the error), and `ErrorLog` (a JSON which contains a list of error objects) as arguments. It pushes `err` to `ErrorLog`'s list of errors after logging the error messages to the console. 

* `getFarm(farmcode)` :
Returns a farm object for the farm with the specified farmcode, if it exists. If the farm does not exist or there was some server error, it returns `null` in a resolved [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise).

* `createFarm(data)` :
Creates a farm in the database. `data` is a JSON which contains all the fields which correspond to the `farm` model in Sequelize, including `farmcode`. If there is a server error or the `farmcode` already exists for the farm one is trying to create, it will return an error in a rejected Promise.

* `createFarmer(data)` :
Creates a farmer in the database. `data` is a JSON which contains all the fields which correspond to the `farmer` model in Sequelize. If there is a server error or the farmer's desired username already exists, it will return an error in a rejected Promise. **Note: There is currently no update endpoint for farmers. If one wishes to update a farmer's information (e.g. username, email address, etc.), one will have to do it manually through the SQL database.**

* `addFarmerToFarm(username, farmcode)` :
Adds a farmer with the specified `username` to the farm with the specified `farmcode`. If there is a server error, it will return an error in a rejected Promise.

* `findRecordWithBarcode(barcode, tablename)` :
Uses the given `barcode` to check if the record (bag/soilstep...) already exists in the given SQL table specified by `tablename`. If the record exists, it returns the record. If the record does not exist or there was some server error, it returns `null` in a resolved Promise.

* `getFieldHistory(farmcode)` :
Returns an entire field history object for the farm with the specified `farmcode`, if it exists. If the field history does not exist or there was some server error, it returns `null` in a resolved Promise.

## Other Components

* `%SCRIPT_NAME%/src/lib/app` :
A file provided by our-sci which contains methods for getting survey answers (on desktop or on mobile).
* `%SCRIPT_NAME%/src/processor.js` :
	Processes the results of `sensor.js`. If there are errors, then the error messages will be displayed to the user through `ui.error` which is found in `/src/lib/ui`. If there were no errors, it will display a success message to the user through `ui.success`
* `%SCRIPT_NAME%/src/manifest.json` :
    Specifies the `id` and `name` of the script when it is uploaded to [our-sci](https://app.our-sci.net/#/).   
* `%SCRIPT_NAME%/src/lib/ui` :
	Contains methods to display messages to the UI. Uses functions `error(...)` and `success(...)`.
These functions are called in `processor.js`



## Testing

Inside the `%SCRIPT_NAME%` folder, run:

`npm install` - installs necessary node modules as defined by `package.json`

`npm run sensor` - runs `sensor.js`

This will allow `sensor.js` to pull answers from `./mock/answers.json` and run the script. Results will be stored in `./data/result.json`

`npm run run-processor-dev` - runs `processor.js` and shows its output at `localhost:9091`

## Uploading script to our-sci

Verify npm dependencies are installed. Then run:

`npm run build-project`

This will create/modify the files within `./dist`, which will be the files you upload to our-sci. Inside there is a file named `manifest.json`. Verify that the object inside labeled "id" has a value with the same name as the hint in the media tag on our-sci. A full tutorial on how to upload our-sci scripts can be found [here](https://gitlab.com/our-sci/measurement-scripts/tree/master/hello-world).
E.g. A survey named "HelloWorld" should have the following inside `manifest.json`:

~~~~
{
  "id": "HelloWorld",
  ...
}
~~~~

Then, navigate to the ["upload a script" page on our-sci](https://app.our-sci.net/#/script/create). Upload:
 * `./dist/manifest.json`
 * `./dist/processor.js`
 * `./dist/sensor.js`






