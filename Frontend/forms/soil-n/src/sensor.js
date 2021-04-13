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
/* A script which records the ammonium and nitrate contents for the soil      */
/* subsample. Generally, the survey that this script is attached to,          */
/* Soil N, should be completed after Soil Step #1.                            */
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

const RequiredQuestions = ['barcode', 'vial_number', 'soil_dry_weight', 'ammonium_content', 'nitrate_content'];
const IntVals = [FormData.SoilData.vial_number, FormData.SoilData.soil_dry_weight, FormData.SoilData.ammonium_content, FormData.SoilData.nitrate_content];
const IntNames = ['Vial number', 'Dry weight of soil ', 'Ammonium content', 'Nitrate content'];

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
        .catch((error) => database.errorHandling(error, 'soil n', ErrorLog).then(app.result(ErrorLog)));
    } else {
      // Need to make a POST request to create a new record
      database.submitForm(FormData.SoilData.farmcode, 'FormSoil', FormData.SoilData)
        .then(() => app.result({
          success: true
        }))
        .catch((error) => database.errorHandling(error, 'soil n', ErrorLog).then(app.result(ErrorLog)));
    }
  })
  .catch((error) => database.errorHandling(error, 'soil n', ErrorLog).then(app.result(ErrorLog)));

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
    var i = 0;
    for (i; i < IntVals.length; i++) {
      // Checks if each of the integer fields are positive
      if (IntVals[i] < 0) {
        error = {};
        error.message = IntNames[i] + ' should not be negative. Please re-enter.';
        console.log(error.message);
        ErrorLog.errors.push(error);
      }
    }

    if (FormData.SoilData.ammonium_content < 0 || FormData.SoilData.ammonium_content > 100) {
      error = {};
      error.message = 'Ammonium content is a percentage, please enter a number between 0 and 100';
      ErrorLog.errors.push(error);
    }

    if (FormData.SoilData.nitrate_content < 0 || FormData.SoilData.nitrate_content > 30) {
      error = {};
      error.message = 'Nitrate content is a percentage, please enter a number between 0 and 100';
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

/* Initializes the keys of the SoilData JSON so that they correspond
 * with the keys in the Sequelize model 'formbag'. It is IMPORTANT
 * that these keys match EXACTLY, or else this data will not be inserted
 * properly in the database */
function initializeFields() {
  return new Promise(function (resolve, reject) {
    FormData.SoilData.barcode = app.getAnswer('barcode');
    FormData.SoilData.vial_number = app.getAnswer('vial_number');
    FormData.SoilData.soil_dry_weight = app.getAnswer('soil_dry_weight');
    FormData.SoilData.ammonium_content = app.getAnswer('ammonium_content');
    FormData.SoilData.nitrate_content = app.getAnswer('nitrate_content');
    FormData.SoilData.farmcode = app.getAnswer('barcode').substring(2, 5);
    resolve();
  })
}