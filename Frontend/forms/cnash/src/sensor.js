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
/* A script which records the filled bag weight and crucible weights          */
/* (if applicable) of the bag subsample. Generally, the survey that           */
/* this script is attached to, C_N_ASH, should be completed after Bag Pre.    */
/*                                                                            */
/* Author: Abrar Saleh                                                        */
/******************************************************************************/

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

const RequiredQuestions = ['barcode', 'crucible_weight', 'oven_dry_weight', 'ash_weight', 'ash_one_litter_weight', 'crucible_weight', 'total_weight_65', 'total_weight_550', 'carbon_concentration_percent', 'nitrogen_concentration_percent'];
const IntVals = [FormData.BagData.crucible_weight, FormData.BagData.oven_dry_weight, FormData.BagData.ash_weight, FormData.BagData.ash_one_litter_weight, FormData.BagData.total_weight_65, FormData.BagData.total_weight_550];
const IntNames = ['Criucible weight', 'Oven dry weight', 'Ash weight', 'Weight of one litter bag of ash', 'Total crucible weight at 65 C', 'Total crucibile weight at 550'];

checkAllQuestionsAnswered()
  .then(() => initializeFields())
  .then(() => formattingHandler())
  .then(() => database.findRecordWithBarcode(FormData.BagData.barcode, 'formbag'))
  .then(function (exists) {
    if (exists) {
      // Need to make a PUT request to update the record
      database.updateForm(FormData.BagData.barcode, 'FormBag', FormData.BagData)
        .then(() => app.result({
          success: true
        }))
        .catch((error) => database.errorHandling(error, 'cnash', ErrorLog).then(app.result(ErrorLog)));
    } else {
      // Need to make a POST request to create a new record
      database.submitForm(FormData.BagData.farmcode, 'FormBag', FormData.BagData)
        .then(() => app.result({
          success: true
        }))
        .catch((error) => database.errorHandling(error, 'cnash', ErrorLog).then(app.result(ErrorLog)));
    }
  })
  .catch((error) => database.errorHandling(error, 'cnash', ErrorLog).then(app.result(ErrorLog)));


/* Tests if the answers entered are in the correct format as defined by the
 * CROWN data dictionary. If not, this method will log the appropriate error in 
 * the errors object. */
function formattingHandler() {
  return new Promise(function (resolve, reject) {
    var error;
    
    // Checks barcode format
    if (!/[A-Z]{3}\s[[0-9]{1}\s[A-Z][0-9]/.test(FormData.BagData.barcode)) {
      error = {};
      error.message = 'Barcode is incorrectly formatted. Barcode should be in the format: AAA 1 A1';
      console.log(error.message);
      ErrorLog.errors.push(error);
    }

    for (var i = 0; i < IntVals.length; i++) {
      // Checks if each of the integer fields are positive
      if (IntVals[i] < 0) {
        error = {};
        error.message = IntNames[i] + ' should not be negative. Please re-enter.';
        console.log(error.message);
        ErrorLog.errors.push(error);
      }
    }

    if(FormData.BagData.nitrogen_concentration_percent < 0 || FormData.BagData.nitrogen_concentration_percent > 100){
      error = {};
      error.message = 'Nitrogen concentration is a percentage, please enter a number between 0 and 100';
      console.log(error.message);
      ErrorLog.errors.push(error);
    }

    if(FormData.BagData.carbon_concentration_percent < 0 || FormData.BagData.carbon_concentration_percent > 100){
      error = {};
      error.message = 'Carbon concentration is a percentage, please enter a number between 0 and 100';
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

/* Initializes the keys of the BagData JSON so that they correspond
 * with the keys in the Sequelize model 'formbag'. It is IMPORTANT
 * that these keys match EXACTLY, or else this data will not be inserted
 * properly in the database */
function initializeFields() {
  return new Promise(function (resolve, reject) {
    FormData.BagData.barcode = app.getAnswer('barcode');
    FormData.BagData.crucible_weight = app.getAnswer('crucible_weight');
    FormData.BagData.oven_dry_weight = app.getAnswer('oven_dry_weight');
    FormData.BagData.ash_weight = app.getAnswer('ash_weight');
    FormData.BagData.ash_one_litter_weight = app.getAnswer('ash_one_litter_weight');
    FormData.BagData.crucible_weight = app.getAnswer('crucible_weight');
    FormData.BagData.total_weight_65 = app.getAnswer('total_weight_65');
    FormData.BagData.total_weight_550 = app.getAnswer('total_weight_550');
    FormData.BagData.carbon_concentration_percent = app.getAnswer('carbon_concentration_percent');
    FormData.BagData.nitrogen_concentration_percent = app.getAnswer('nitrogen_concentration_percent');
    FormData.BagData.farmcode = app.getAnswer('barcode').substring(0, 3);
    resolve();
  })
}