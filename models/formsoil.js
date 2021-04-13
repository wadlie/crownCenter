'use strict';
module.exports = (sequelize, DataTypes) => {
  var FormSoil = sequelize.define('FormSoil', {
    barcode: {type: DataTypes.STRING, validate: {is: /^[A-Z]{1}\s[A-Z]{3}\s[A-Z]{1}[0-9]{1}\s[0-9]$/}},
    created_date: DataTypes.DATE,
    empty_bag_weight: DataTypes.DECIMAL,
    total_moist_weight: DataTypes.DECIMAL,
    total_rock_weight: DataTypes.DECIMAL,
    tin_sub_empty_weight: DataTypes.DECIMAL,
    tin_sub_moist_weight: DataTypes.DECIMAL,
    tin_sub_dry_weight: DataTypes.DECIMAL,
    vial_number: DataTypes.INTEGER,
    soil_dry_weight: DataTypes.DECIMAL,
    ammonium_content: DataTypes.DECIMAL,
    nitrate_content: DataTypes.DECIMAL,
    sand: DataTypes.DECIMAL,
    silt: DataTypes.DECIMAL,
    clay: DataTypes.DECIMAL,
    textural_class: {type: DataTypes.ENUM, values: ["Sandy", "Sandy loam", "Loam", "Silty loam", "Clay loam", "Clay", "Heavy Clay"]}, 
    notes: DataTypes.STRING
  }); 

  FormSoil.associate = function (models) {
    models.FormSoil.belongsTo(models.FormSubmission, {
      foreignKey: 'formsubmission_id'
    });
  };

  return FormSoil;
};