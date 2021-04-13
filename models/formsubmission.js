'use strict';
module.exports = (sequelize, DataTypes) => {
  var FormSubmission = sequelize.define('FormSubmission', {
      created_date: DataTypes.DATE,
      farmcode: {type: DataTypes.STRING, validate: {is: /^[A-Z]{3}$/}},
  }); 

  FormSubmission.associate = function (models) {
    models.FormSubmission.hasOne(models.FormBag, {
      onDelete: 'CASCADE',
      foreignKey: 'formsubmission_id'
    })
    models.FormSubmission.hasOne(models.FormBiomass, {
      onDelete: 'CASCADE',
      foreignKey: 'formsubmission_id'
    })
    models.FormSubmission.hasOne(models.FormBulkDensity, {
      onDelete: 'CASCADE',
      foreignKey: 'formsubmission_id'
    })
    models.FormSubmission.hasOne(models.FormFieldHistory, {
      onDelete: 'CASCADE',
      foreignKey: 'formsubmission_id'
    })
    models.FormSubmission.hasOne(models.FormSoil, {
      onDelete: 'CASCADE',
      foreignKey: 'formsubmission_id'
    })
    models.FormSubmission.hasOne(models.FormType, {
      onDelete: 'CASCADE',
      foreignKey: 'formsubmission_id'
    })
    models.FormSubmission.hasOne(models.FormYield, {
      onDelete: 'CASCADE',
      foreignKey: 'formsubmission_id'
    })
    models.FormSubmission.belongsTo(models.Farm, {
      foreignKey: 'farm_id'
    })
  };

  return FormSubmission;
};