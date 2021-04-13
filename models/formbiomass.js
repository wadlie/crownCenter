'use strict';
module.exports = (sequelize, DataTypes) => {
  var FormBiomass = sequelize.define('FormBiomass', {
    barcode: {type: DataTypes.STRING, validate: {is: /^[A-Z]\s[A-Z]{3}\s[0-9]$/}},
    drill_line_spacing: DataTypes.DECIMAL,
    subsample_a_weight: DataTypes.DECIMAL,
    subsample_b_weight: DataTypes.DECIMAL,
    empty_bag_weight: DataTypes.DECIMAL,
    average_fresh_biomass_excludes_bag_weight: DataTypes.DECIMAL,
    target_fresh_biomass_per_bag_weight: DataTypes.DECIMAL,
    is_over_40_percent_legume: DataTypes.BOOLEAN
  }); 

  FormBiomass.associate = function (models) {
    models.FormBiomass.belongsTo(models.FormSubmission, {
      foreignKey: 'formsubmission_id'
    });
  };

  return FormBiomass;
};