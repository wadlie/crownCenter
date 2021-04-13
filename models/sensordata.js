'use strict';
module.exports = (sequelize, DataTypes) => {
  var SensorData = sequelize.define('SensorData', {
      ts_up: DataTypes.DATE,
      code: {type: DataTypes.STRING, validate: {is: /^[A-Z]{3}$/}},
      repl: DataTypes.INTEGER,
      trt: DataTypes.STRING,
      batt: DataTypes.DECIMAL,
      timestamp: DataTypes.DATE,
      t_amb: DataTypes.DECIMAL,
      rh: DataTypes.DECIMAL,
      t_lb: DataTypes.DECIMAL,
      address: {type: DataTypes.STRING, validate: {is: /^[A-Ca-c]$/}},
      vwc: DataTypes.DECIMAL,
      temp: DataTypes.DECIMAL,
      permittivity: DataTypes.DECIMAL,
      ec_bulk: DataTypes.DECIMAL,
      ec_corrected: DataTypes.DECIMAL,
      depth: DataTypes.INTEGER,
  },{timestamps: false}); 

  SensorData.associate = function (models) {
  };

  return SensorData;
};