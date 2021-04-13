'use strict';
module.exports = (sequelize, DataTypes) => {
  var Farm = sequelize.define('Farm', {
    farmcode: {type: DataTypes.STRING, validate: {is: /^[A-Z]{3}$/}},
    year: DataTypes.INTEGER,
    state: {type: DataTypes.ENUM, values: ["MD", "GA", "VA"]},
	  address: DataTypes.STRING,
    county: DataTypes.STRING,
    latitude: DataTypes.DECIMAL,
    longitude: DataTypes.DECIMAL,
    note: DataTypes.TEXT,
    additional_contact: DataTypes.STRING
  }); 

  Farm.associate = function (models) {
    models.Farm.belongsToMany(models.Farmer, {
      through: models.FarmFarmer,
      onDelete: "CASCADE",
      foreignKey: {
        allowNull: true,
        name: 'farm_id'
      },
      constraints: false,
    });
    models.Farm.hasMany(models.FormSubmission, {
      onDelete: "CASCADE",
      foreignKey: 'farm_id'
    })
  };

  return Farm;
};