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
/* A script which records the number of plants per 10 foot row for the Yield  */
/* data.                                                                      */
/* Author: Cesar Arevalo                                                      */
/**************************************************************************** */
import app from './lib/app';
import * as database from './lib/database';

// A JSON which holds the questions and answers as key-value pairs
const FormData = {};
// In the result JSON, we'll have another JSON which holds information just 
// about the farm the farmer is reporting for
FormData.StandCountsData = {};

// A list of errors associated with the questions
const ErrorLog = {};
ErrorLog.errors = [];

const RequiredQuestions = ['barcode', 'number_of_plants_per_ten_feet_long_row'];

checkAllQuestionsAnswered()
  .then(() => initializeFields())
  .then(() => formattingHandler())
  .then(() => database.findRecordWithBarcode(FormData.StandCountsData.barcode, 'formyield'))
  .then(function (exists) {
    if (exists) {
      database.updateForm(FormData.StandCountsData.barcode, 'FormYield', FormData.StandCountsData)
        .then(() => app.result({ success: true }))
        .catch((error) => database.errorHandling(error, 'StandCountsData', ErrorLog).then(app.result(ErrorLog)));
    }
    else {
      // Need to make a POST request to create a new record
      database.submitForm(FormData.StandCountsData.farmcode, 'FormYield', FormData.StandCountsData)
        .then(() => app.result({ success: true }))
        .catch((error) => database.errorHandling(error, 'StandCountsData', ErrorLog).then(app.result(ErrorLog)));
    }
  })
  .catch((error) => database.errorHandling(error, 'StandCountsData', ErrorLog).then(app.result(ErrorLog)));


function checkAllQuestionsAnswered() {
  return new Promise(function (resolve, reject) {
    RequiredQuestions.forEach(function (question) {
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


function initializeFields() {
  return new Promise(function (resolve, reject) {
    // Because the Barcode contains farmcode, we will be able to extract it
    FormData.StandCountsData.farmcode = app.getAnswer('barcode').substring(2, 5);
    FormData.StandCountsData.barcode = app.getAnswer('barcode');
    FormData.StandCountsData.number_of_plants_per_ten_feet_long_row = app.getAnswer('number_of_plants_per_ten_feet_long_row');
    resolve();
  })
}

function formattingHandler() {
  return new Promise(function (resolve, reject) {
    var error;
    // Checks barcode format
    if (!(/[A-Z]\s[A-Z]{3}\s[A-Z][0-9]\-[A-Z][0-9]/).test(FormData.StandCountsData.barcode)) {
      error = {};
      error.message = 'Barcode is incorrectly formatted. Format should be: "A AAA A1-A1"';
      console.log(error.message);
      ErrorLog.errors.push(error);
    }
    if(FormData.StandCountsData.number_of_plants_per_ten_feet_long_row < 0){
      error = {};
      error.message = 'Number of plants should not be negative. Please re-enter.';
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
