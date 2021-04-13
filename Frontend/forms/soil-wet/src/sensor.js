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
/* A script which records the weights for a moist soil data subsample         */
/* Generally, the survey that this script is attached to, Soil Wet, should    */
/* be completed after Soil Step #1, and before Soil Dry.                      */
/*                                                                            */
/* Author: Abrar Saleh                                                        */
/******************************************************************************/

import app from './lib/app';
import * as database from './lib/database';

// A JSON which holds the questions and answers as key-value pairs
const FormData = {};
// In the result JSON, we'll have another JSON which holds information just 
// about the bag the farmer is reporting
FormData.SoilData = {};

// A list of errors associated with the questions
const ErrorLog = {};
ErrorLog.errors = [];

const RequiredQuestions = ['barcode', 'empty_bag_weight', 'total_moist_weight', 'total_rock_weight', 'tin_sub_empty_weight', 'tin_sub_moist_weight'];
const IntVals = [FormData.SoilData.empty_bag_weight, FormData.SoilData.total_moist_weight, FormData.SoilData.total_rock_weight, FormData.SoilData.tin_sub_empty_weight, FormData.SoilData.tin_sub_moist_weight];
const IntNames = ['Weight of empty bag', 'Weight of filled moist bag', 'Weight of rocks', 'Weight of empty subsample tin', 'Weight of filled moist subsample tin'];

checkAllQuestionsAnswered()
  .then(() => initializeFields())
  .then(() => formattingHandler())
  .then(() => database.findRecordWithBarcode(FormData.SoilData.barcode, 'formsoil'))
  .then(function (exists) {
    if (exists) {
      // Need to make a PUT request to update the record
      database.updateForm(FormData.SoilData.barcode, 'FormSoil', FormData.SoilData)
        .then(() => app.result({
          success: true
        }))
        .catch((error) => database.errorHandling(error, 'soil wet', ErrorLog).then(app.result(ErrorLog)));
    } else {
      // Need to make a POST request to create a new record
      database.submitForm(FormData.SoilData.farmcode, 'FormSoil', FormData.SoilData)
        .then(() => app.result({
          success: true
        }))
        .catch((error) => database.errorHandling(error, 'soil wet', ErrorLog).then(app.result(ErrorLog)));
    }
  })
  .catch((error) => database.errorHandling(error, 'soil wet', ErrorLog).then(app.result(ErrorLog)));

/* Tests if the answers entered are in the correct format as defined by the
 * CROWN data dictionary. If not, this method will log the appropriate error in 
 * the errors object. */
function formattingHandler() {
  return new Promise(function (resolve, reject) {
    var error;
 
    // Checks barcode format
    if (!/[A-Z]\s[A-Z]{3}\s[A-Z][0-9]\s[[0-9]{1}/.test(FormData.SoilData.barcode)) {
      error = {};
      error.message = 'Barcode is incorrectly formatted. Barcode should be in the format: S AAA A1 1';
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

/* Initializes the keys of the SoilData JSON so that they correspond
 * with the keys in the Sequelize model 'formbag'. It is IMPORTANT
 * that these keys match EXACTLY, or else this data will not be inserted
 * properly in the database */
function initializeFields() {
  return new Promise(function (resolve, reject) {
    FormData.SoilData.barcode = app.getAnswer('barcode');
    FormData.SoilData.empty_bag_weight = app.getAnswer('empty_bag_weight');
    FormData.SoilData.total_moist_weight = app.getAnswer('total_moist_weight');
    FormData.SoilData.total_rock_weight = app.getAnswer('total_rock_weight');
    FormData.SoilData.tin_sub_empty_weight = app.getAnswer('tin_sub_empty_weight');
    FormData.SoilData.tin_sub_moist_weight = app.getAnswer('tin_sub_moist_weight');
    FormData.SoilData.farmcode = app.getAnswer('barcode').substring(2,5);
    resolve();
  })
}