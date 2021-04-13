/* global android */

const DesktopApp = {
  result: (res) => {
    const tmp = JSON.stringify(res, null, 2);
    // DEBUG console.log(`saving result to ./data/result.json:\n${tmp}`);
    const fs = require('fs');
    if (!fs.existsSync('./data')) {
      fs.mkdirSync('./data');
    }
    fs.writeFileSync('./data/result.json', tmp);
    process.exit(0);
  },
  progress: (pct) => {
    // DEBUG    console.log(`progress is ${pct} %`);
  },
  onSerialDataIntercepted: (data) => {
    // DEBUG    console.log(`serial data intercepted: ${data}`);
  },
  csvExport: (key, value) => {
    console.log(`exporting key value pair to csv: ${key} => ${value}`);
  },
  csvExportValue: (value) => {
    console.log(`exporting value to CSV ${value}`);
  },
  getAnswer: (dataName) => {
    // DEBUG    console.log(`get data name ${dataName}`);
    const fs = require('fs');
    if (fs.existsSync('./mock/answers.json')) {
      const content = fs.readFileSync('./mock/answers.json', 'utf-8').toString();
      try {
        return JSON.parse(content)[dataName];
      } catch (error) {
        return undefined;
      }
    }
    return undefined;
  },
  hasQuestion: question => !(typeof DesktopApp.getAnswer(question) === 'undefined'),
  isAnswered: (question) => {
    const answer = DesktopApp.getAnswer(question);
    if (typeof DesktopApp.getAnswer(question) === 'undefined') {
      return false;
    }
    if (answer === '') {
      return false;
    }

    return true;
  },
  save: () =>
    // DEBUG    console.log('saving env');
    null,
  getEnv: (key, defaultValue = null) => {
    // DEBUG    console.log('getting env var');
    try {
      return window.localStorage.getItem(key);
    } catch (error) {
      // DEBUG      console.error('unable to get value from localstorage');
      return null;
    }
  },

  setEnv: (key, value, descrIPtion = '') => {
    // DEBUG    console.log('setting env var');
    try {
      window.localStorage.setItem(key, value);
      return true;
    } catch (error) {
      // DEBUG      console.error('unable to set value');
      return false;
    }
  },
  isAndroid: false,
};

const AndroidApp = {
  result: (res) => {
    const tmp = JSON.stringify(res, null, 2);
    android.result(tmp);
  },
  progress: (pct) => {
    android.progress(pct);
  },
  onSerialDataIntercepted: (data) => {
    android.onSerialDataIntercepted(data);
  },
  csvExport: (key, value) => {
    android.csvExport(key, value);
  },
  csvExportValue: (value) => {
    android.csvExport(value);
  },
  getAnswer: dataName => android.getAnswer(dataName), 
  hasQuestion: question => !(typeof AndroidApp.getAnswer(question) === 'undefined'),
  isAnswered: (question) => {
    const answer = AndroidApp.getAnswer(question);
    if (typeof AndroidApp.getAnswer(question) === 'undefined') {
      return false;
    }
    if (answer === '') {
      return false;
    }
    return true;
  },
  save: () => android.save(),
  getEnv: (key, defaultValue = null) => {
    try {
      return android.getEnvVar(key, defaultValue);
    } catch (error) {
      console.error('unable to get value');
      return null;
    }
  },
  setEnv: (key, value, descrIPtion = '') => {
    try {
      return android.setEnvVar(key, value, descrIPtion);
    } catch (error) {
      console.error('unable to set value');
      return false;
    }
  },
  isAndroid: true,
};

export default (() => {
  if (typeof _ANDROID === 'undefined') {
    return DesktopApp;
  }
  return AndroidApp;
})();
