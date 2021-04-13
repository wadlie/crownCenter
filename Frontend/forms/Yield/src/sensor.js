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
/* A script which records the Yield data.                                     */
/* Author: Cesar Arevalo                                                      */
/**************************************************************************** */
import app from './lib/app';
import * as database from './lib/database';

// A JSON which holds the questions and answers as key-value pairs
const FormData = {};
// In the result JSON, we'll have another JSON which holds information just 
// about the farm the farmer is reporting for
FormData.Yield = {};

// A list of errors associated with the questions
const ErrorLog = {};
ErrorLog.errors = [];

const RequiredQuestions = ['barcode', 'row_spacing', 'grain_weight_per_ten_feet', 'grain_moisture_one', 'grain_moisture_two',
  'grain_test_weight_one', 'grain_test_weight_two'];

checkAllQuestionsAnswered()
  .then(() => initializeFields())
  .then(() => formattingHandler())
  .then(() => database.findRecordWithBarcode(FormData.Yield.barcode, 'formyield'))
  .then(function (exists) {
    if (exists) {
      database.updateForm(FormData.Yield.barcode, 'FormYield', FormData.Yield)
        .then(() => app.result({ success: true }))
        .catch((error) => database.errorHandling(error, 'Yield', ErrorLog).then(app.result(ErrorLog)));
    }
    else {
      // Need to make a POST request to create a new record
      database.submitForm(FormData.Yield.farmcode, 'FormYield', FormData.Yield)
        .then(() => app.result({ success: true }))
        .catch((error) => database.errorHandling(error, 'Yield', ErrorLog).then(app.result(ErrorLog)));
    }
  })
  .catch((error) => database.errorHandling(error, 'Yield', ErrorLog).then(app.result(ErrorLog)));


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
    FormData.Yield.farmcode = app.getAnswer('barcode').substring(2, 5);
    FormData.Yield.barcode = app.getAnswer('barcode');
    FormData.Yield.row_spacing = app.getAnswer('row_spacing');
    FormData.Yield.grain_weight_per_ten_feet = app.getAnswer('grain_weight_per_ten_feet');
    FormData.Yield.grain_moisture_one = app.getAnswer('grain_moisture_one');
    FormData.Yield.grain_moisture_two = app.getAnswer('grain_moisture_two');
    FormData.Yield.grain_test_weight_one = app.getAnswer('grain_test_weight_one');
    FormData.Yield.grain_test_weight_two = app.getAnswer('grain_test_weight_two');
    if (app.isAnswered('notes')) {
      FormData.Yield.notes = app.getAnswer('notes');
    } else {
      FormData.Yield.notes = "";
    }
    resolve();
  })
}
function formattingHandler() {
  return new Promise(function (resolve, reject) {
    var error;
    // Checks barcode format
    if (!(/[A-Z]\s[A-Z]{3}\s[A-Z][0-9]\-[A-Z][0-9]/).test(FormData.Yield.barcode)) {
      error = {};
      error.message = 'Barcode is incorrectly formatted. Format should be: "A AAA A1-A1"';
      console.log(error.message);
      ErrorLog.errors.push(error);
    }
    if(FormData.Yield.row_spacing < 0){
      error = {};
      error.message = 'Row Spacing should not be negative. Please re-enter.';
      console.log(error.message);
      ErrorLog.errors.push(error);
    }
    if(FormData.Yield.grain_weight_per_ten_feet < 0){
      error = {};
      error.message = 'Grain Weight should not be negative. Please re-enter.';
      console.log(error.message);
      ErrorLog.errors.push(error);
    }
    if(FormData.Yield.grain_moisture_one < 0){
      error = {};
      error.message = 'Grain Moisture 1 should not be negative. Please re-enter.';
      console.log(error.message);
      ErrorLog.errors.push(error);
    }
    if(FormData.Yield.grain_moisture_two < 0){
      error = {};
      error.message = 'Grain Moisture 2 should not be negative. Please re-enter.';
      console.log(error.message);
      ErrorLog.errors.push(error);
    }
    if(FormData.Yield.grain_moisture_one > 100){
      error = {};
      error.message = 'Grain Moisture 1 should not be greater than 100. Please re-enter.';
      console.log(error.message);
      ErrorLog.errors.push(error);
    }
    if(FormData.Yield.grain_moisture_two > 100){
      error = {};
      error.message = 'Grain Moisture 2 should not be greater than 100. Please re-enter.';
      console.log(error.message);
      ErrorLog.errors.push(error);
    }
    if(FormData.Yield.grain_test_weight_one < 0){
      error = {};
      error.message = 'Grain Test Weight 1 should not be negative. Please re-enter.';
      console.log(error.message);
      ErrorLog.errors.push(error);
    }
    if(FormData.Yield.grain_test_weight_two < 0){
      error = {};
      error.message = 'Grain Test Weight 2 should not be negative. Please re-enter.';
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