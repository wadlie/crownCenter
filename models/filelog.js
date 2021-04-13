'use strict';
module.exports = (sequelize, DataTypes) => {
  var FileLog = sequelize.define('FileLog', {
      farmcode: {type: DataTypes.STRING, validate: {is: /^[A-Z]{3}$/}},
      file_name: DataTypes.STRING,
      last_read_line: DataTypes.INTEGER,
      created_date: DataTypes.DATE
  }); 

  FileLog.associate = function (models) {
  };

  return FileLog;
};