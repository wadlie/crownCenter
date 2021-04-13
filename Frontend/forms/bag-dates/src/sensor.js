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
/* A script which records the dates when bags are submitted and calculates    */
/* their target dates (when they should be submitted for that deploy period). */
/*                                                                            */
/* Author: Steven Tra                                                         */
/******************************************************************************/

import app from './lib/app';
import * as database from './lib/database';

// A JSON which holds the questions and answers as key-value pairs
const FormData = {};
/* In the result JSON, we'll have another JSON which holds information just 
 * about the bag the farmer is reporting */
FormData.BagData = {};

// A list of errors associated with the questions
const ErrorLog = {};
ErrorLog.errors = [];

const RequiredQuestions = ['barcode', 'bag_date', 'bag_date_tid'];

checkAllQuestionsAnswered()
  .then(() => initializeFields())
  .then(() => formattingHandler())
  .then(() => database.getAllFormBagsFromFarmcode(FormData.BagData.farmcode))
  .then((formbags) => getT0Date(formbags))
  .then(function(t0) {
    return new Promise(function(resolve, reject) {
      if (t0 != null) {
        if (FormData.BagData.bag_date_tid == 1) {
          FormData.BagData.bag_date_target = addDays(t0, 14);
        } else if (FormData.BagData.bag_date_tid == 2) {
          FormData.BagData.bag_date_target = addDays(t0, 30);
        } else if (FormData.BagData.bag_date_tid == 3) {
          FormData.BagData.bag_date_target = addDays(t0, 60);
        } else if (FormData.BagData.bag_date_tid == 4) {
          FormData.BagData.bag_date_target = addDays(t0, 90);
        } else if (FormData.BagData.bag_date_tid == 5) {
          FormData.BagData.bag_date_target = addDays(t0, 120);
        }
        resolve();
      } else {
        resolve();
      }
    })
  })
  .then(() => database.findRecordWithBarcode(FormData.BagData.barcode, 'formbag'))
  .then(function(record) {
      if (record) {

        /* We will forbid users from updating time deploy 0 if it already        
         * exists in the database. If the user really wants to update time       
         * deploy 0, he/she will have to contact a system administrator to do    
         * the update manually. This prevents other records which rely on this   
         * time deploy 0 from becoming stale, perhaps unbeknownst to the user. */ 
        if (record.bag_date_tid === 0) {
          let error = {};
          error.message = 'User tried to update time deploy 0. Updates to time deploy 0 must be handled with a system administrator.';                                                          
          console.log(error.message);
          ErrorLog.errors.push(error);
          app.result(ErrorLog);
        } else {
          // Need to make a PUT request to update the record
          database.updateForm(FormData.BagData.barcode, 'FormBag', FormData.BagData)
            .then(() => app.result({success: true}))
            .catch((error) => database.errorHandling(error, 'bag dates', ErrorLog).then(app.result(ErrorLog)));
        }

      } else {
        // Need to make a POST request to create a new record
        database.submitForm(FormData.BagData.farmcode, 'FormBag',      FormData.BagData)
          .then(() => app.result({success: true}))
          .catch((error) => database.errorHandling(error, 'bag dates', ErrorLog).then(app.result(ErrorLog)));
      }
  })
  .catch((error) => database.errorHandling(error, 'bag dates', ErrorLog).then(app.result(ErrorLog)));
    

function addDays(date, days) {
  var result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

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
    FormData.BagData.barcode = app.getAnswer('barcode');
    FormData.BagData.bag_date_tid = app.getAnswer('bag_date_tid');
    FormData.BagData.bag_date = app.getAnswer('bag_date');
    resolve();
  })
}

/* Retrieves the initial deploy date (i.e. time deploy 0) from one of
 * the bags on this farm. It takes an array of bag objects as a parameter.
 * Bag objects are just JSON representations of the rows in the FormBags
 * table in the Azure Postgres database. This function will get the bag
 * which has the initial deploy date for the farm the user is affiliated
 * with (as specified by the farmcode input).  */
function getT0Date(bags) {
  return new Promise(function(resolve, reject){

    //console.log(bags)
    let error = {};

    /* If the bag_date_tid is greater than 0 (i.e. the user wants to
     * input a time deploy after the initial time deploy), we'll need
     * to check if the initial time deploy, time deploy 0, exists for 
     * one of the bags with the farmcode specified. */
    let t0Found = false;
    let t0;

      if (bags.length != 0) {
          bags.forEach(function(formbag){
            //console.log(typeof formbag.bag_date_tid)
            //console.log(typeof FormData.BagData.bag_date_tid)
            if (formbag.bag_date_tid === FormData.BagData.bag_date_tid && formbag.barcode != FormData.BagData.barcode) {
              // Time has already been entered, BUT the user is trying to overwrite it with a different bag
              let error = {};
              error.message = 'User tried to overwrite time deploy ' + formbag.bag_date_tid + ' for farm ' + FormData.BagData.farmcode 
                  + '. Time deploy ' + formbag.bag_date_tid + ' already exists';
              reject(error);
            } else if (formbag.bag_date_tid < FormData.BagData.bag_date_tid) {
              let prevDate  = new Date(formbag.bag_date);
              let currDate = new Date(FormData.BagData.bag_date);

              if (currDate <= prevDate) {
                error = {};
                error.message = 'The date of Time Deploy ' + FormData.BagData.bag_date_tid + ' should be greater than the date of Time Deploy ' + formbag.bag_date_tid;
                reject(error);
              }

            } else if (formbag.bag_date_tid === 0) {
              t0Found = true;
              t0 = formbag.bag_date;
            }
          });
          resolve(t0)
      } else if (FormData.BagData.bag_date_tid != 0) {
          // No bags were recorded for this farm
          error = {};
          error.message = 'Bag dates time deploy 0 needs to be entered first for farm ' + FormData.BagData.farmcode;
          reject(error);
      } else {
        resolve(null)
      }
  })

}