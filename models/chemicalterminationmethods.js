'use strict';
module.exports = (sequelize, DataTypes) => {
  var ChemicalTerminationMethods = sequelize.define('ChemicalTerminationMethods', {
      chemical_termination_number: DataTypes.INTEGER,
      chemical_termination_method: {type: DataTypes.ENUM, values: ["None", "2-4-D", "Altrazine", "Clopyralid", "Dicamba", "Glyphosate/Roundup", "Imazapyr", "Metalochor/Dual/Lasso", "Paraquat/Gramoxone", "Rimsulfuron/LeadOff", "Prowl", "Liberty", "Pursuit", "Basagran", "Treflan", "Other"]}
  }); 

  ChemicalTerminationMethods.associate = function (models) {

  };

  return ChemicalTerminationMethods;
};