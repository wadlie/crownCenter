'use strict';
module.exports = (sequelize, DataTypes) => {
  var SoilStep = sequelize.define('SoilStep', {
      season: {type: DataTypes.ENUM, values: ["S", "FS"]},
      farmcode: DataTypes.STRING,
      treatment: {type: DataTypes.ENUM, values: ["B", "C"]},
      subplot: DataTypes.INTEGER,
      subsample: DataTypes.INTEGER,
      soil_subsample:  {type: DataTypes.STRING, validate: {is: /^[A-Z]{3}\s[A-Z][0-9]\-[0-9]$/}},
      total_sample_length: DataTypes.DECIMAL,
      depth_one: DataTypes.DECIMAL,
      depth_two: DataTypes.DECIMAL,
      depth_three: DataTypes.DECIMAL,
      gps_coordinates: DataTypes.STRING,
      notes: DataTypes.STRING
  }); 

  SoilStep.associate = function (models) {
    models.SoilStep.belongsTo(models.FormSoil)
  };

  return SoilStep;
};