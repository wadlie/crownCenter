'use strict';
module.exports = (sequelize, DataTypes) => {
  var FormBulkDensity = sequelize.define('FormBulkDensity', {
    barcode: {type: DataTypes.STRING, validate: {is: /^[A-Z]{2}\s[A-Z]{3}\s[A-Z]\s[A-Z]$/}},
    bag_pre_weight: DataTypes.DECIMAL,
    dry_weight: DataTypes.DECIMAL,
    sample_date: DataTypes.DATE,
    notes: DataTypes.STRING
  }); 

  FormBulkDensity.associate = function (models) {
    models.FormBulkDensity.belongsTo(models.FormSubmission, {
      foreignKey: 'formsubmission_id'
    });
  };

  return FormBulkDensity;
};