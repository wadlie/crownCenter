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
/* A script which records different aspects of farm's field history like      */
/* their cover crop termination method, cover crop drill spacing, herbicides  */
/* used (if applicable), etc. The full list of questions can be found in the  */ 
/* CROWN Data Dictionary on Google Drive.                                     */
/*                                                                            */
/* Author: Steven Tra                                                         */
/******************************************************************************/

import app from './lib/app';
import * as database from './lib/database';
import { field_history_questions } from './lib/field-history-questions';

// A JSON which holds the questions and answers as key-value pairs
const FormData = {};
/* In the result JSON, we'll have another JSON which holds information just 
 * about the field history */
FormData.FieldHistory = {};

// A list of errors associated with the questions
const ErrorLog = {};
ErrorLog.errors = [];

const RequiredQuestions = ['farmcode', 'cover_crop_planting_date'];

checkAllQuestionsAnswered()
  .then(() => initializeFields())
  .then(() => formattingHandler())
  .then(() => createCoverCrops())
  .then(function(CoverCrops) {
    return new Promise(function(resolve, reject) {
      if (ErrorLog.errors.length != 0) {
        app.result(ErrorLog);
      } else if (CoverCrops.length != 0) {
        FormData.FieldHistory.CoverCrops = CoverCrops;
      }
      resolve();
    })
  })
  .then(() => gatherChemicalInputs())
  .then(function(cover_crop_chemical_inputs){
    return new Promise(function(resolve, reject){
      if (cover_crop_chemical_inputs.length != 0) {
        FormData.FieldHistory.cover_crop_chemical_inputs = cover_crop_chemical_inputs;
      }
      resolve();
    })
  })
  .then(() => database.getFieldHistory(FormData.FieldHistory.farmcode))
  .then(function(fieldhistory){
    if (fieldhistory) {
      // Need to make a PUT request to update the field history for this farm
      database.updateForm(FormData.FieldHistory.farmcode, 'FormFieldHistory', FormData.FieldHistory)
        .then(() => app.result({success: true}))
        .catch((error) => database.errorHandling(error, 'field history', ErrorLog).then(app.result(ErrorLog)));
    } else {
      // Need to make a POST request to create a new field history for this farm
      database.submitForm(FormData.FieldHistory.farmcode, 'FormFieldHistory', FormData.FieldHistory)
        .then(() => app.result({success: true}))
        .catch((error) => database.errorHandling(error, 'field history', ErrorLog).then(app.result(ErrorLog)));
    }
  })
  .catch((error) => database.errorHandling(error, 'field history', ErrorLog).then(app.result(ErrorLog)));

/* Tests if the answers entered are in the correct format as defined by the
 * CROWN data dictionary. If not, this method will log the appropriate error in 
 * the errors object. */
function formattingHandler() {
  return new Promise(function(resolve, reject) {
    let error;
    // Checks farm code format
    if (!(/^[A-Z]{3}$/.test(FormData.FieldHistory.farmcode))) {
      error = {};
      error.message = 'Farm code should only consist of three uppercase letters. (e.g. ABC)';
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
  return new Promise(function(resolve, reject){
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
  });
}

/* Initializes the keys of the BagData JSON so that they correspond
 * with the keys in the Sequelize model 'formbag'. It is IMPORTANT
 * that these keys match EXACTLY, or else this data will not be inserted
 * properly in the database */
function initializeFields() {
  return new Promise(function(resolve, reject){
    // Get all the answered questions
    field_history_questions.forEach(function(question){
      let fieldname;
      if (app.isAnswered(question)) {
        /* If the question is part of a group on our-sci, then we need to remove all characters
         * before the period (the characters before the period correspond to the group name)
         * and use the remaining characters as the field name so that it matches with the model 
         * in Sequelize */
        if (question.includes(".")) {
          fieldname = question.split(".")[1]; // Gets the part after period
        } else {
          fieldname = question;
        }

        FormData.FieldHistory[fieldname] = app.getAnswer(question);
        // If the field contains underscores, then we need to replace with it spaces
        if (typeof app.getAnswer(question) === 'string') {
          FormData.FieldHistory[fieldname] = FormData.FieldHistory[fieldname].replace(/_/g, " ");
          // If the field contains a period, we need to replace it with a /
          FormData.FieldHistory[fieldname] = FormData.FieldHistory[fieldname].replace(/\./g, "/");
        }
      }
    });

    resolve();
  });
}

// Creates cover crop objects for the cover crop info entered by the user
function createCoverCrops() {
  let error;
  let CoverCrops = [];
  let covercrop;

  return new Promise(function(resolve, reject){
    for (let i = 1; i <= 6; i++) {
      // Species is entered but not the rate
      if (FormData.FieldHistory["cc_sp_" + i] && !FormData.FieldHistory["cc_sp_" + i + "_rate"]) {
        error = {};
        error.message = 'Cover Crop Species ' + i + " is missing rate information.";
        console.log(error.message);
        ErrorLog.errors.push(error);
      // Rate is entered by not the species
      } else if (!FormData.FieldHistory["cc_sp_" + i] && FormData.FieldHistory["cc_sp_" + i + "_rate"]) {
        error = {};
        error.message = 'Cover Crop Species ' + i + " is missing species information.";
        console.log(error.message);
        ErrorLog.errors.push(error);
      // Both species and rate are entered
      } else if (FormData.FieldHistory["cc_sp_" + i] && FormData.FieldHistory["cc_sp_" + i + "_rate"]) {
        covercrop = {};
        covercrop.cover_crop_species = FormData.FieldHistory["cc_sp_" + i];
        covercrop.cover_crop_number = i;
        covercrop.rate = FormData.FieldHistory["cc_sp_" + i + "_rate"];
        CoverCrops.push(covercrop);
      }
    }

    resolve(CoverCrops);
  })

}

// Gets the chemical inputs from the user and returns them as an array
function gatherChemicalInputs() {
  let cover_crop_chemical_inputs = [];

  return new Promise(function(resolve, reject){
    if (FormData.FieldHistory.most_targeting_chemical) {
      // The most target chemical will ALWAYS be first in the chemical inputs array
      cover_crop_chemical_inputs.push(FormData.FieldHistory.most_targeting_chemical);
    }

    if (FormData.FieldHistory.additional_chemical_inputs) {
      let additional_inputs = FormData.FieldHistory.additional_chemical_inputs.split(" ");
      let concatenated = cover_crop_chemical_inputs.concat(additional_inputs);
      cover_crop_chemical_inputs = concatenated;
    }

    resolve(cover_crop_chemical_inputs);
  })
}