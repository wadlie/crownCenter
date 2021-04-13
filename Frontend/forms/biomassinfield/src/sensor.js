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
/* A script which records biomass data like drill line spacing, subsample     */
/* weights, empty bag weights, and whether this biomass is over 40% legume.   */
/*                                                                            */
/* Author: Steven Tra                                                         */
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

const RequiredQuestions = ['barcode'];
const Questions = ['barcode', 'drill_line_spacing', 'subsample_a_weight',
                    'subsample_b_weight', 'empty_bag_weight', 'is_over_40_percent_legume'];
  
checkAllQuestionsAnswered()
  .then(() => initializeFields())
  .then(() => formattingHandler())
  .then(() => database.findRecordWithBarcode(FormData.BagData.barcode, 'formbiomass'))
  .then(function(record){
    if (record) {
      calculateAverageSubsampleWeight(record)
        .then(() => calculateTargetFreshWeight())
        .then(() => database.updateForm(FormData.BagData.barcode, 'FormBiomass', FormData.BagData))
        .then(() => app.result({success: true}))
        .catch((error) => database.errorHandling(error, 'biomass infield', ErrorLog).then(app.result(ErrorLog)));
    } else {
      calculateAverageSubsampleWeight(null)
        .then(() => calculateTargetFreshWeight())
        .then(() => database.submitForm(FormData.BagData.farmcode, 'FormBiomass', FormData.BagData))
        .then(() => app.result({success: true}))
        .catch((error) => database.errorHandling(error, 'biomass infield', ErrorLog).then(app.result(ErrorLog)));
    }
  })
  .catch((error) => database.errorHandling(error, 'biomass infield', ErrorLog).then(app.result(ErrorLog)));

  /* Calculates the average subsample weight of A and B from the values entered from the user, or uses values already stored 
   * in the database for the calculation. */
  function calculateAverageSubsampleWeight(record) {
    let subsample_a_weight;
    let subsample_b_weight;
    let empty_bag_weight;

    return new Promise(function(resolve, reject){
      if (app.isAnswered('subsample_a_weight')) {
        subsample_a_weight = app.getAnswer('subsample_a_weight');
      } else if (record != null && record.subsample_a_weight) {
        subsample_a_weight = record.subsample_a_weight;
      } else {
        // Return since we don't have a required value
        resolve();
      }

      if (app.isAnswered('subsample_b_weight')) {
        subsample_b_weight = app.getAnswer('subsample_b_weight');
      } else if (record != null && record.subsample_b_weight) {
        subsample_b_weight = record.subsample_b_weight;
      } else {
        // Return since we don't have a required value
        resolve();
      }

      if (app.isAnswered('empty_bag_weight')) {
        empty_bag_weight = app.getAnswer('empty_bag_weight');
      } else if (record != null && record.empty_bag_weight) {
        empty_bag_weight = record.empty_bag_weight;
      } else {
        // Return since we don't have a required value
        resolve();
      }
      
      let a_weight_no_bag = subsample_a_weight - empty_bag_weight;
      let b_weight_no_bag = subsample_b_weight - empty_bag_weight;
      let average_weight = (a_weight_no_bag + b_weight_no_bag) / 2;
      FormData.BagData.average_fresh_biomass_excludes_bag_weight = average_weight;

      resolve();
      
    });
  }

  function calculateTargetFreshWeight() {
    return new Promise(function(resolve, reject){
      if (FormData.BagData.average_fresh_biomass_excludes_bag_weight) {
        let target_fresh_weight = FormData.BagData.average_fresh_biomass_excludes_bag_weight / 6;
        FormData.BagData.target_fresh_biomass_per_bag_weight = target_fresh_weight;
        resolve();
      } else {
        resolve();
      }
    });
  }

/* Tests if the answers entered are in the correct format as defined by the
 * CROWN data dictionary. If not, this method will log the appropriate error in 
 * the errors object. */
function formattingHandler() {
  return new Promise(function(resolve, reject) {
    var error; 
    // Check barcode format

    // Gets the farmcode from the barcode
    let regex = /^[A-Z]\s([A-Z]{3})\s[0-9]$/;
    let farmcode = FormData.BagData.barcode.match(regex);

    if (farmcode == null) {
      error = {};
      error.message = 'Barcode is incorrectly formatted. Barcode must be in the format [A-Z] [A-Z]{3} [0-9]';
      console.log(error.message);
      ErrorLog.errors.push(error);
    } else {
      FormData.BagData.farmcode = farmcode[1];
    }

    // Checks that drill line spacing is not negative
    if (FormData.BagData.drill_line_spacing < 0) {
      error = {};
      error.message = 'Drill line spacing should not be negative. Please re-enter.';
      console.log(error.message);
      ErrorLog.errors.push(error);
    }
    // Checks that subsample A weight is not negative
    if (FormData.BagData.subsample_a_weight < 0) {
      error = {};
      error.message = 'Subsample A weight should not be negative. Please re-enter.';
      console.log(error.message);
      ErrorLog.errors.push(error);
    }
    // Checks that subsample B weight is not negative
    if (FormData.BagData.subsample_b_weight < 0) {
      error = {};
      error.message = 'Subsample B weight should not be negative. Please re-enter.';
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
  return new Promise(function(resolve, reject) {
    /* Getting all of the questions that were ACTUALLY answered so we can set their corresponding
     * fields in the FormData.BagData JSON */
    Questions.forEach(function(question) {
      if (app.isAnswered(question)) {
        FormData.BagData[question] = app.getAnswer(question);
    }
    });
    resolve();
  })
}