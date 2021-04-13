'use strict';
module.exports = (sequelize, DataTypes) => {
  var FormBag = sequelize.define('FormBag', {
    barcode: {type: DataTypes.STRING, validate: {is: /^[A-Z]{3}\s[0-9]\s[A-Z]{1}[0-9]{1}$/}},
    bag_date_tid: DataTypes.INTEGER,
    bag_date: DataTypes.DATE,
    bag_date_target: DataTypes.DATE,
    painted_bag_number: DataTypes.INTEGER,
    empty_bag_weight: DataTypes.DECIMAL,
    in_field_bag_fresh_weight: DataTypes.DECIMAL,
    latitude: DataTypes.DECIMAL,
    longitude: DataTypes.DECIMAL,
    actual_recovery_date: DataTypes.DATE,
    total_dwt: DataTypes.DECIMAL,
    crucible_weight: DataTypes.DECIMAL,
    total_weight_65: DataTypes.DECIMAL,
    total_weight_550: DataTypes.DECIMAL,
    oven_dry_weight: DataTypes.DECIMAL,
    ash_weight: DataTypes.DECIMAL,
    ash_one_litter_weight: DataTypes.DECIMAL,
    carbon_concentration_percent: DataTypes.DECIMAL,
    nitrogen_concentration_percent: DataTypes.DECIMAL,
    notes: DataTypes.STRING
  }); 

  FormBag.associate = function (models) {
    models.FormBag.belongsTo(models.FormSubmission, {
      foreignKey: 'formsubmission_id' //formsubmission_id
    });
  };

  return FormBag;
};