'use strict';
module.exports = (sequelize, DataTypes) => {
  var Farmer = sequelize.define('Farmer', {
    lastname: DataTypes.STRING,
    username: DataTypes.STRING,
    email: {type: DataTypes.STRING, validate: {is: /^[A-Za-z0-9.-]+@[A-Za-z]+\.[a-z]+$/}},
    phone: {type: DataTypes.STRING}
  });

  Farmer.associate = function(models) {
    models.Farmer.belongsToMany(models.Farm, {
      through: models.FarmFarmer,
      foreignKey: 'farmer_id'
    });
  };

  return Farmer;
};