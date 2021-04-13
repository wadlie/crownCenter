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
/* A script which records the empty bag weight and painted bag number         */
/* (if applicable) of the bag. Generally, the survey that this script is      */
/* attached to, Bag Pre, should be completed before Bag Fresh.                */
/*                                                                            */
/* Author: Steven Tra                                                         */
/**************************************************************************** */

import app from './lib/app';
import * as database from './lib/database';

// A JSON which holds the questions and answers as key-value pairs
const FormData = {};
// In the result JSON, we'll have another JSON which holds information just 
// about the bag the farmer is reporting
FormData.BagData = {};

// A list of errors associated with the questions
const ErrorLog = {};
ErrorLog.errors = [];

const RequiredQuestions = ['barcode', 'empty_bag_weight'];
  
checkAllQuestionsAnswered()
  .then(() => initializeFields())
  .then(() => formattingHandler())
  .then(() => database.findRecordWithBarcode(FormData.BagData.barcode, 'formbag'))
  .then(function(exists) {
    if (exists) {
      // Need to make a PUT request to update the record
      database.updateForm(FormData.BagData.barcode, 'FormBag', FormData.BagData)
        .then(() => app.result({success: true}))
        .catch((error) => database.errorHandling(error, 'bag pre', ErrorLog).then(app.result(ErrorLog)));
    } else {
      // Need to make a POST request to create a new record
      database.submitForm(FormData.BagData.farmcode, 'FormBag', FormData.BagData)
        .then(() => app.result({success: true}))
        .catch((error) => database.errorHandling(error, 'bag pre', ErrorLog).then(app.result(ErrorLog)));
    }
  })
  .catch((error) => database.errorHandling(error, 'bag pre', ErrorLog).then(app.result(ErrorLog)));

/* Tests if the answers entered are in the correct format as defined by the
 * CROWN data dictionary. If not, this method will log the appropriate error in 
 * the errors object. */
function formattingHandler() {
  return new Promise(function(resolve, reject) {
    var error;
    // Check barcode format

    // Gets the farmcode from the barcode
    let regex = /([A-Z]{3})\s[0-9]\s[A-Z]{1}[0-9]{1}/;
    let farmcode = FormData.BagData.barcode.match(regex);

    if (farmcode == null) {
      error = {};
      error.message = 'Barcode is incorrectly formatted. Barcode must be in the format [A-Z]{3} [0-9] [A-Z][0-9]';
      console.log(error.message);
      ErrorLog.errors.push(error);
    } else {
      FormData.BagData.farmcode = farmcode[1];
    }

    // Checks that painted bag number is not negative
    if (FormData.BagData.painted_bag_number < 0) {
      error = {};
      error.message = 'Painted bag number should not be negative. Please re-enter.';
      console.log(error.message);
      ErrorLog.errors.push(error);
    }
    // Checks that empty bag weight is not negative
    if (FormData.BagData.empty_bag_weight < 0) {
      error = {};
      error.message = 'Empty bag weight should not be negative. Please re-enter.';
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
    //FormData.BagData.farmcode = app.getAnswer('farmcode');
    FormData.BagData.barcode = app.getAnswer('barcode');
    if (app.isAnswered('painted_bag_number')) {
      FormData.BagData.painted_bag_number = app.getAnswer('painted_bag_number');
    }
    FormData.BagData.empty_bag_weight = app.getAnswer('empty_bag_weight');
    resolve();
  })
}