'use strict';
module.exports = (sequelize, DataTypes) => {
  var Sensor = sequelize.define('Sensor', {
      location: DataTypes.STRING,
      active: DataTypes.BOOLEAN
  }); 

  Sensor.associate = function (models) {
  };

  return Sensor;
};