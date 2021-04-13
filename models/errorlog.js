'use strict';
module.exports = (sequelize, DataTypes) => {
  var ErrorLog = sequelize.define('ErrorLog', {
      farmcode: {type: DataTypes.STRING, validate: {is: /[A-Z]{3}/}},
      type: DataTypes.STRING,
      message: DataTypes.STRING
  }); 

  ErrorLog.associate = function (models) {

  };

  return ErrorLog;
};