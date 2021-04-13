'use strict';
module.exports = (sequelize, DataTypes) => {
  var FormType = sequelize.define('FormType', {
      form_data_type: DataTypes.STRING,
      is_active: DataTypes.BOOLEAN,
      name: DataTypes.STRING
  }); 

  FormType.associate = function (models) {
    models.FormType.belongsTo(models.FormSubmission, {
      foreignKey: 'formsubmission_id'
    });
  };

  return FormType;
};