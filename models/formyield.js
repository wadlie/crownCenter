'use strict';
module.exports = (sequelize, DataTypes) => {
  var FormYield = sequelize.define('FormYield', {
    barcode: {type: DataTypes.STRING, validate: {is: /^[A-Z]\s[A-Z]{3}\s[A-Z][0-9]\-[A-Z][0-9]$/}},
    row_spacing: DataTypes.DECIMAL,
    grain_weight_per_ten_feet: DataTypes.DECIMAL,
    grain_moisture_one: DataTypes.DECIMAL,
    grain_moisture_two: DataTypes.DECIMAL,
    grain_test_weight_one: DataTypes.DECIMAL,
    grain_test_weight_two: DataTypes.DECIMAL,
    number_of_plants_per_ten_feet_long_row: DataTypes.INTEGER,
    notes: DataTypes.STRING
  }); 

  FormYield.associate = function (models) {
    models.FormYield.belongsTo(models.FormSubmission, {
      foreignKey: 'formsubmission_id'
    });
  };

  return FormYield;
};
