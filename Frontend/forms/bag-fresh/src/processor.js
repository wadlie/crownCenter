/* eslint-disable camelcase */
/* eslint-disable no-unused-vars */
/* eslint-disable no-plusplus */
/* eslint-disable max-len */
/* eslint-disable brace-style */
/* eslint-disable eol-last */
/* eslint-disable prefer-destructuring */
/* eslint-disable object-curly-newline */
/* eslint-disable function-paren-newline */
/* eslint-disable dot-notation */
/* eslint-disable indent */
/* eslint-disable no-param-reassign */

/* global processor */


//import { sprintf } from 'sprintf-js';
import _ from 'lodash';

import app from './lib/app';
import * as ui from './lib/ui';
//import * as MathMore from './lib/math';


(() => {
  
  
  const result = (() => {
    if (typeof processor === 'undefined') {
      return require('../data/result.json');
    }
    return JSON.parse(processor.getResult());
  })();
 
  // Display any errors to the user through pop-up messages
  if (result.errors) {

    result.errors.forEach(function(error) {
      if (error.message) {
        ui.error('Error: ', error.message);
      }
      if (error.data) {
        ui.error('Error: ', error.data.message);
      }
    });
  
  }

  if (result.success) {
    ui.success('Success! ', 'Survey submitted to database!');
  }

  app.save();
  
})();

