'use strict';
module.exports = (sequelize, DataTypes) => {
  var User = sequelize.define('User', {
    login: DataTypes.STRING,
    password: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return User;
};