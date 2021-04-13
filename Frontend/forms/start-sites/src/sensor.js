/******************************************************************************/
/* Copyright 2019 Cesar Arevalo, Andrew Bian, Benny Cheng, Krishna Sai        */
/* Kollipara, Abrar Saleh, Steven Tra, Chad Veytsman, Joel Yoo                */
/*                                                                            */
/* Licensed under the Apache License, Version 2.0 (the "License");            */
/* you may not use this file except in compliance with the License.           */
/* You may obtain a copy of the License at                                    */
/*                                                                            */
/*      http://www.apache.org/licenses/LICENSE-2.0                            */
/*                                                                            */
/* Unless required by applicable law or agreed to in writing, software        */
/* distributed under the License is distributed on an "AS IS" BASIS,          */
/* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.   */
/* See the License for the specific language governing permissions and        */
/* limitations under the License.                                             */
/*                                                                            */
/* Description:                                                               */
/* A script which inserts farm and farmer data to the CROWN SQL database.     */
/* A farmer MUST complete the survey attached to this script before           */
/* completing any other surveys because this survey will register their       */
/* contact information in the database.                                       */
/*                                                                            */
/* Note: As of 2019-05-11, there is no update functionality for the farm or   */
/* the farmer REST endpoints. If a farmer wants to update his/her/their       */
/* information in the database, he/she/they will need to contact a system     */
/* administrator who can perform the update manually on the SQL database.     */
/*                                                                            */
/* Author: Steven Tra                                                         */
/******************************************************************************/

import app from './lib/app';
import * as database from './lib/database';

// A JSON which holds the questions and answers as key-value pairs
const FormData = {};
/* In the result JSON, we'll have another JSON which holds information just 
 * about the farm the farmer is reporting for */
FormData.FarmData = {};
/* In the result JSON, we'll have another JSON which holds information just 
 * about the farmer who is completing this form */
FormData.FarmerData = {};

// A list of errors associated with the questions
const ErrorLog = {};
ErrorLog.errors = [];

const RequiredQuestions = ['farmcode', 'year', 'state', 'username', 'lastname', 
'email', 'phone', 'address', 'county', 'latitude_longitude'];

checkAllQuestionsAnswered()
  .then(() => initializeFields())
  .then(() => formattingHandler())
  .then(() => database.createFarmer(FormData.FarmerData))
  .then(() => database.getFarm(FormData.FarmData.farmcode))
  .then(function (farm) {
    if (farm == null) {
      // The farm data doesn't exist in the database yet, so let's
      // create the farm in the database
      database.createFarm(FormData.FarmData)
        .then(() => database.addFarmerToFarm(FormData.FarmerData.username, FormData.FarmData.farmcode))
        .then(() => app.result({success: true}))
        .catch((error) => database.errorHandling(error, 'start sites', ErrorLog).then(app.result(ErrorLog)));
    } else {
        // Don't overwrite the farm data; just add the farmer to the farm and return
      database.addFarmerToFarm(FormData.FarmerData.username, FormData.FarmData.farmcode)
        .then(() => app.result({success: true}))
        .catch((error) => database.errorHandling(error, 'start sites', ErrorLog).then(app.result(ErrorLog)));
    }
  })
  .catch((error) => database.errorHandling(error, 'start sites', ErrorLog).then(app.result(ErrorLog)));

/* Tests if the answers entered are in the correct format as defined by the
 * CROWN data dictionary. If not, this method will log the appropriate error in 
 * the errors object. */
function formattingHandler() {
  return new Promise(function(resolve, reject) {
    var error;
    // Checks farm code format
    if (!(/^[A-Z]{3}$/.test(FormData.FarmData.farmcode))) {
      error = {};
      error.message = 'Farm code should only consist of three uppercase letters. (e.g. ABC)';
      console.log(error.message);
      ErrorLog.errors.push(error);
    }
    if (FormData.FarmData.year < 0 || FormData.FarmData.year > app.currentYear()) {
      error = {};
      error.message = 'Year should be between 0 and ' + app.currentYear();
      console.log(error.message);
      ErrorLog.errors.push(error);
    }
    // Checks email is valid
    if (!/[A-Za-z0-9.-]+@[A-Za-z]+\.[a-z]+/.test(FormData.FarmerData.email)) {
      error = {};
      error.message = 'Email is incorrectly formatted. Email must be in the format: xxx@xxx.xxx';
      console.log(error.message);
      ErrorLog.errors.push(error);
    }
    if (ErrorLog.errors.length != 0) {
      reject();
    } else {
      resolve();
    }
  });
}

/* Checks that all of the required questions for the survey have been
 * answered by the user. */
function checkAllQuestionsAnswered() {
  return new Promise(function(resolve, reject) {
    RequiredQuestions.forEach(function(question){
      if (!app.isAnswered(question)) {
          let error = {};
          error.message = question + ' does not have an answer.';
          console.log(error.message);
          ErrorLog.errors.push(error);
      }    
    });
    if (ErrorLog.errors.length != 0) {
      reject();
    } else {
      resolve();
    }
  })
}

/* Initializes the keys of the BagData JSON so that they correspond
 * with the keys in the Sequelize model 'formbag'. It is IMPORTANT
 * that these keys match EXACTLY, or else this data will not be inserted
 * properly in the database */
function initializeFields() {
  return new Promise(function(resolve, reject){
    FormData.FarmData.farmcode = app.getAnswer('farmcode');
    FormData.FarmData.year = app.getAnswer('year');
    FormData.FarmData.state = app.getAnswer('state');
    FormData.FarmData.address = app.getAnswer('address');
    FormData.FarmData.county = app.getAnswer('county');
    // Splitting the latitude and longitude string
    const [lat, lon] = app.getAnswer('latitude_longitude').split(';');
    FormData.FarmData.latitude = lat;
    FormData.FarmData.longitude = lon;
    // Note and additional contact are not required questions
    if (app.isAnswered('note')) {
      FormData.FarmData.note = app.getAnswer('note');
    } 
    if (app.isAnswered('additional_contact')) {
      FormData.FarmData.additional_contact = app.getAnswer('additional_contact');
    } 
    FormData.FarmerData.lastname = app.getAnswer('lastname');
    FormData.FarmerData.username = app.getAnswer('username');
    FormData.FarmerData.email = app.getAnswer('email');
    let phoneNumber = app.getAnswer('phone');
    let phoneNumberSanitized = phoneNumber.replace(/([^0-9])/g,'');
    if (phoneNumberSanitized.length != 10) {
      let error = {};
      error.message = 'Phone number is not formatted correctly. Phone number should be a ten-digit number which includes area code.';
      reject(error);
    } else {
      FormData.FarmerData.phone = phoneNumberSanitized;
    }

    resolve();
  })
}