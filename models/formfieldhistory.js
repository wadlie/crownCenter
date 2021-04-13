'use strict';
module.exports = (sequelize, DataTypes) => {
  var FormFieldHistory = sequelize.define('FormFieldHistory', {
      farmcode: {type: DataTypes.STRING, validate: {is: /^[A-Z]{3}$/}},
      cover_crop_planting_date: DataTypes.DATE,
      cover_crop_drill_spacing: DataTypes.DECIMAL,
      planting_method: {type: DataTypes.ENUM, values: ["Drilled", "Broadcast", "Aerial Seed"]},
      cover_crop_total_rate: DataTypes.DECIMAL,
      previous_cash_crop: {type: DataTypes.ENUM, values: ["Corn", "Soybeans", "Cotton", "Pasture", "Wheat", "Fallow", "Summer Cover Crop", "Sweet Potatoes", "Tobacco", "Other"]},
      is_subsoiler: DataTypes.BOOLEAN,
      kill_before_planting: DataTypes.BOOLEAN,
      strip_tiller: DataTypes.BOOLEAN,
      cover_crop_termination_method: {type: DataTypes.ENUM, values: ["Herbicide", "Combination", "Roller Crimper", "Mower"]},
      cover_crop_termination_date: DataTypes.DATE,
      cover_crop_chemical_inputs: {type: DataTypes.ARRAY(DataTypes.STRING)},
      cash_crop_planting_date: DataTypes.DATE,
      cash_crop_spacing: DataTypes.DECIMAL,
      fall_soil_sample_date: DataTypes.DATE,
      nitrogen_in_previous_cash_crop: DataTypes.STRING, //double check this
      post_harvest_fertilize: DataTypes.BOOLEAN,
      post_harvest_fertility_date: DataTypes.DATE,
      post_harvest_source: DataTypes.STRING,
      post_harvest_rate: DataTypes.DECIMAL,
      spring_soil_sample_date: DataTypes.DATE,
      plant_fertilizer_source: DataTypes.STRING,
      plant_fertilizer_application_method: DataTypes.STRING,
      nitrogen_fertilizer_rate: DataTypes.DECIMAL,
      sidedress_date: DataTypes.DATE,
      sidedress_nitrogen_planned_rate: DataTypes.STRING,
      total_nitrogen_planned_rate: DataTypes.DECIMAL
  }); 

  FormFieldHistory.associate = function (models) {
    models.FormFieldHistory.hasMany(models.CoverCrop, {
      foreignKey: 'formfieldhistory_id'
    })
    models.FormFieldHistory.hasMany(models.ChemicalTerminationMethods)
    models.FormFieldHistory.belongsTo(models.FormSubmission, {
      foreignKey: 'formsubmission_id'
    });
  };

  return FormFieldHistory;
};