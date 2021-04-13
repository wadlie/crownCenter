import Axios from 'axios';

const IP = '13.72.52.80';
const port = 3000;

const config = {
  headers : { 'token' : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJsb2dpbiI6ImFkbWluIiwiaWQiOjEsInRpbWUiOiIyMDE5LTA0LTI0VDE5OjAyOjE1Ljg1NloiLCJpYXQiOjE1NTYxMzI1MzV9.P9rfjFbYplP85kc1X99Jr5Pig8wtGHkOu2OOTDP7k_o' }
};

export function submitToTable(route, data) {
    return new Promise(function(resolve, reject) {
        Axios.post('http://' + IP + ':' + port + '/api/' + route + '/create', data)
          .then(function(response) {
            console.log(route + " data inserted in database!");
            console.log(response.data);
            resolve();
          }).catch(function(error) {
            reject(error);
          })
      })
}

export function submitForm(farmcode, formname, data) {
    return new Promise(function(resolve, reject){
        
        Axios.post('http://' + IP + ':' + port + '/api/farm/farmcode/' + farmcode + '/formsubmission', 
        {
          created_date : new Date().toISOString(),
          [formname] : data
        }, config)
         .then(function(response) {
           console.log("Form submission successful!");
           console.log(response.data);
           resolve();
         }).catch(function(error){
           reject(error);
         })
   
       })
}

export function findRecordWithBarcode(barcode, tablename) {
  return new Promise(function(resolve, reject){
    Axios.get('http://' + IP + ':' + port + '/api/' + tablename + '/barcode/' + barcode, config)
      .then(function(response){
        console.log('Bag data exists in the database!');
        resolve(response.data);
      }).catch(function(error) {
        console.log('Bag data does not exist in the database!');
        resolve(null);
      })
  })
}

export function checkT0Exists(barcode) {
  return new Promise(function(resolve, reject){
    Axios.get('http://' + IP + ':' + port + '/api/formbag/barcode/' + barcode, config)
      .then(function(response){
        if (response.data) {
          // Check if the T_0 field is not null. If it's not null, then T0 exists and the
          // user presumably already completed bag dates initial.
          if (response.data.T_0) {
            console.log("Bag dates time deploy 0 already exists!");
            resolve(true);
          } else {
            console.log("Bag dates time deploy 0 doesn't exist yet!");
            resolve(false);
          }
        } else {
          // Something went wrong
          reject(response);
        }
      }).catch(function(error) {
        console.log('Bag data does not exist in the database!');
        resolve(false);
      })
  })
}

export function updateForm(barcode, formname, data) {
  return new Promise(function(resolve, reject){
      Axios.put('http://' + IP + ':' + port + '/api/formsubmission/' + formname + '/update/' + barcode, data)
        .then(function(response){
          console.log("Bag data successfully updated!");
          console.log(response.data);
          resolve();
        }).catch(function(error){
          reject(error);
        })
  })
}

export function getFarm(farmcode) {
  return new Promise(function(resolve, reject){
    Axios.get('http://' + IP + ':' + port + '/api/farm/farmcode/' + farmcode, config)
      .then(function(response){
        console.log("Farm data found for " + farmcode);
        resolve(response.data);
      }).catch(function(error){
        resolve(null);
      })
  })
}

export function createFarm(data) {
  return submitToTable('farm', data);
}

export function createFarmer(data) {
  return submitToTable('farmer', data);
}

export function getFarmToFarmers() {
  return new Promise(function(resolve, reject){
    Axios.get('http://' + IP + ':' + port + '/api/farmfarmer', config)
      .then(function(response) {
        resolve(response.data);
      }).catch(function(error) {
        reject(error);
      })
  })
}

export function addFarmerToFarm(username, farmcode) {
  return new Promise(function(resolve, reject){
    Axios.post('http://' + IP + ':' + port + '/api/farmer/' + username + '/to/' + farmcode, 
    {
      is_active : true,
      join_date : new Date().toISOString()
    }, 
    config)
      .then(function(response){
        console.log(username + ' added to farm with farmcode ' + farmcode + '!');
        resolve();
      }).catch(function(error){
        reject(error);
      })
  })
}
export function errorHandling(err, infoType, ErrorLog) {
    return new Promise(function(resolve, reject) {
        console.log("Failed to insert " + infoType + " data.");
        //console.log(err.response)
        var error = {};
        
        if (err.response) {
          error.message = 'Response returned with status code ' + err.response.status;
          error.data = err.response.data;
        } else if (err.request) {
          error.message = "Request could not be made.";
          error.data = err.request;
        } else {
          error.message = err.message;
        }
  
        ErrorLog.errors.push(error);
  
        for (let i = 0; i < ErrorLog.errors.length; i++) {
          if (ErrorLog.errors[i].message) {
            console.log(ErrorLog.errors[i].message);
          }
          if (ErrorLog.errors[i].data) {
            console.log(ErrorLog.errors[i].data);
          }
        }
  
        resolve();
      });
}
