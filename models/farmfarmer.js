'use strict';
module.exports = (sequelize, DataTypes) => {
  var FarmFarmer = sequelize.define('FarmFarmer', {
    is_active: DataTypes.BOOLEAN,
    join_date: DataTypes.DATE,
    end_date: DataTypes.DATE
  }); 
  
  return FarmFarmer;
};