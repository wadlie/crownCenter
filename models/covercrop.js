'use strict';
module.exports = (sequelize, DataTypes) => {
  var CoverCrop = sequelize.define('CoverCrop', {
      cover_crop_species: {
        type: DataTypes.ENUM, 
        values: ['Annual RyeGrass', 'Rape/Canola', 'Cereal Rye', 'Wheat', 'Triticale', 'Oats', 'Crimson Clover', 'Red Clover', 'White Clover', 'Unknown Clover spp', 'Hairy Vetch', 'Crown Vetch', 'Unknown Vetch spp', 'Radish', 'Winter Peas', 'Other', 'Woolypod Vetch']
      },
      cover_crop_number: DataTypes.INTEGER,
      rate: DataTypes.DECIMAL
  }); 

  CoverCrop.associate = function (models) {
    models.CoverCrop.belongsTo(models.FormFieldHistory, {
      onDelete: "CASCADE",
      foreignKey: {
        allowNull: true,
        name: 'formfieldhistory_id'
      },
    })
  };

  return CoverCrop;
};