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
/* A script which is used to enter the location information (farm, subplot,   */
/* subsample) for a particular soil subsample. This is the first form that    */
/* should be completed when entering a new subsample of soil data.            */
/*                                                                            */
/* Author: Abrar Saleh                                                        */
/******************************************************************************/

import app from './lib/app';
import * as database from './lib/database';

// A JSON which holds the questions and answers as key-value pairs
const FormData = {};
// In the result JSON, we'll have another JSON which holds information just 
// about the soil the farmer is reporting
FormData.POSTData = {};
FormData.SoilData = {};

// A list of errors associated with the questions
const ErrorLog = {};
ErrorLog.errors = [];

//A list of the questions that must be answered on the form.
const RequiredQuestions = ['farmcode', 'season', 'treatment', 'subplot', 'subsample', 'total_sample_length', 'depth_one', 'depth_two', 'depth_three', 'gps_coordinates'];

checkAllQuestionsAnswered()
  .then(() => initializeFields())
  .then(() => formattingHandler())
  .then(function () {
    return new Promise(function (resolve, reject) {

      database.updateSoilStep(FormData.POSTData.soil_subsample, 'soilstep', FormData.SoilData)
        .then(() => app.result({
          success: true
        }))
        .catch(function (err) {
          // Data doesn't exist, need to make POST
          database.submitToTable('soilstep', FormData.POSTData)
            .then(() => database.updateSoilStep(FormData.POSTData.soil_subsample, 'soilstep', FormData.SoilData))
            .then(() => app.result({
              success: true
            }))
            .catch((error) => database.errorHandling(error, 'soil step', ErrorLog).then(app.result(ErrorLog)));
        })

    })
  })
  .catch((error) => database.errorHandling(error, 'soil step', ErrorLog).then(app.result(ErrorLog)));

/* Tests if the answers entered are in the correct format as defined by the
 * CROWN data dictionary. If not, this method will log the appropriate error in 
 * the errors object. */
function formattingHandler() {
  return new Promise(function (resolve, reject) {

    var error;

    // Checks farm code format
    if (!(/^[A-Z]{3}$/.test(FormData.POSTData.farmcode))) {
      error = {};
      error.message = 'Farm code should only consist of three uppercase letters. (e.g. ABC)';
      ErrorLog.errors.push(error);
    }
    /**/
    if (!(/^[A-Z]{3}\s[A-Z][0-9]\-[0-9]$/.test(FormData.POSTData.soil_subsample))) {
      error = {};
      error.message = 'Soil Subsample is incorrectly formatted. Please check your inputs again.';
      ErrorLog.errors.push(error);
    }

    if (FormData.SoilData.subplot != 1 && FormData.SoilData.subplot != 2) {
      error = {};
      error.message = 'Subplot can only be 1 or 2';
      ErrorLog.errors.push(error);
    }

    if (FormData.SoilData.subsample != 1 && FormData.SoilData.subsample != 2 && FormData.SoilData.subsample != 3 && FormData.SoilData.subsample != 4) {
      error = {};
      error.message = 'Subsample must be either 1, 2, 3 or 4';
      ErrorLog.errors.push(error);
    }

    if (FormData.SoilData.depth_one < 0 || FormData.SoilData.depth_one > 30) {
      error = {};
      error.message = 'Depth One ranges from 0 to 30 cm. Please enter a number within the range.';
      ErrorLog.errors.push(error);
    }

    if (FormData.SoilData.depth_two < 30 || FormData.SoilData.depth_two > 60) {
      error = {};
      error.message = 'Depth Two ranges from 30 to 60 cm. Please re-enter a number in the range.';
      ErrorLog.errors.push(error);
    }

    if (FormData.SoilData.depth_three < 60 || FormData.SoilData.depth_three > 100) {
      error = {};
      error.message = 'Depth Three ranges from 60 to 100 cm. Please re-enter a number in the range.';
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

/* Initializes the keys of the SoilData JSON so that they correspond
 * with the keys in the Sequelize model 'formbag'. It is IMPORTANT
 * that these keys match EXACTLY, or else this data will not be inserted
 * properly in the database */
function initializeFields() {
  return new Promise(function (resolve, reject) {

    FormData.POSTData.farmcode = app.getAnswer('farmcode');
    FormData.POSTData.soil_subsample = '' + app.getAnswer('farmcode') + " " + app.getAnswer('treatment') + app.getAnswer('subplot') + "-" + app.getAnswer('subsample');

    FormData.SoilData.season = app.getAnswer('season');
    FormData.SoilData.treatment = app.getAnswer('treatment');
    FormData.SoilData.subplot = app.getAnswer('subplot');
    FormData.SoilData.subsample = app.getAnswer('subsample');
    FormData.SoilData.total_sample_length = app.getAnswer('total_sample_length');
    FormData.SoilData.depth_one = app.getAnswer('depth_one');
    FormData.SoilData.depth_two = app.getAnswer('depth_two');
    FormData.SoilData.depth_three = app.getAnswer('depth_three');
    FormData.SoilData.gps_coordinates = app.getAnswer('gps_coordinates');

    if (app.isAnswered('notes')) {
      FormData.SoilData.notes = app.getAnswer('notes');
    }
    resolve();
  })
}