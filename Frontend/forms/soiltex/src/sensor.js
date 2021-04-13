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
/* A script which records the Soil Texture data.                              */
/* Author: Cesar Arevalo                                                      */
/**************************************************************************** */
import app from './lib/app';
import * as database from './lib/database';

// A JSON which holds the questions and answers as key-value pairs
const FormData = {};
// In the result JSON, we'll have another JSON which holds information just 
// about the farm the farmer is reporting for
FormData.SoilTexData = {};

// A list of errors associated with the questions
const ErrorLog = {};
ErrorLog.errors = [];

const RequiredQuestions = ['barcode', 'sand', 'silt',
  'clay', 'textural_class'];

checkAllQuestionsAnswered()
  .then(() => initializeFields())
  .then(() => formattingHandler())
  .then(() => database.findRecordWithBarcode(FormData.SoilTexData.barcode, 'formsoil'))
  .then(function (exists) {
    if (exists) {
      database.updateForm(FormData.SoilTexData.barcode, 'FormSoil', FormData.SoilTexData)
        .then(() => app.result({ success: true }))
        .catch((error) => database.errorHandling(error, 'SoilTexData', ErrorLog).then(app.result(ErrorLog)));
    }
    else {
      // Need to make a POST request to create a new record
      database.submitForm(FormData.SoilTexData.farmcode, 'FormSoil', FormData.SoilTexData)
        .then(() => app.result({ success: true }))
        .catch((error) => database.errorHandling(error, 'SoilTexData', ErrorLog).then(app.result(ErrorLog)));
    }
  })
  .catch((error) => database.errorHandling(error, 'SoilTexData', ErrorLog).then(app.result(ErrorLog)));

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
    FormData.SoilTexData.farmcode = app.getAnswer('barcode').substring(2, 5);
    FormData.SoilTexData.barcode = app.getAnswer('barcode');
    FormData.SoilTexData.sand = app.getAnswer('sand');
    FormData.SoilTexData.silt = app.getAnswer('silt');
    FormData.SoilTexData.clay = app.getAnswer('clay');

    /*
      Textural class is defined as an Upper Case String e.g. Sandy Loam. ODK Build does not allow data to be defined this way,
      so we define it as a lowercase string seperated by an underscore. Here we convert the data from that format into the format
      required by the database.
    */

    let tex_class = app.getAnswer('textural_class');
    let modded_tex = "";
    switch (tex_class) {
      case 'sandy': modded_tex += "Sandy";
        break;
      case 'sandy_loam': modded_tex += "Sandy loam";
        break;
      case 'loam': modded_tex += "Loam";
        break;
      case 'silty_loam': modded_tex += "Silty loam";
        break;
      case 'clay_loam': modded_tex += "Clay loam";
        break;
      case 'clay': modded_tex += "Clay";
        break;
      case 'heavy_clay': modded_tex += "Heavy Clay";
        break;
    }

    FormData.SoilTexData.textural_class = modded_tex;

    if (app.isAnswered('notes')) {
      FormData.SoilTexData.notes = app.getAnswer('notes');
    } else {
      FormData.SoilTexData.notes = "";
    }
    resolve();
  })
}
function formattingHandler() {
  return new Promise(function (resolve, reject) {
    var error;
    // Checks barcode format
    if (!/^[A-Z]{1}\s[A-Z]{3}\s[A-Z]{1}[0-9]{1}\s[0-9]$/.test(FormData.SoilTexData.barcode)) {
      error = {};
      error.message = 'Barcode is incorrectly formatted. Format should be: "A AAA A1 1",';
      console.log(error.message);
      ErrorLog.errors.push(error);
    }
    if(FormData.SoilTexData.sand < 0){
      error = {};
      error.message = 'Sand Amount should not be negative. Please re-enter.';
      console.log(error.message);
      ErrorLog.errors.push(error);
    }
    if(FormData.SoilTexData.silt < 0){
      error = {};
      error.message = 'Silt Amount should not be negative. Please re-enter.';
      console.log(error.message);
      ErrorLog.errors.push(error);
    }
    if(FormData.SoilTexData.clay < 0){
      error = {};
      error.message = 'Clay Amount should not be negative. Please re-enter.';
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