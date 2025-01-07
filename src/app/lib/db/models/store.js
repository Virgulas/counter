const { DataTypes, Model } = require('sequelize');
const { storeSequelize: sequelize } = require('../index');

class Store extends Model {}

Store.init(
  {
    id: {
      type: DataTypes.DATEONLY,
      primaryKey: true,
      allowNull: false,
    },
    products: {
      type: DataTypes.JSON,
      defaultValue: [],
    },
    debts: {
      type: DataTypes.JSON,
      defaultValue: [],
    },
    discounts: {
      type: DataTypes.JSON,
      defaultValue: [],
    },
    pix: {
      type: DataTypes.NUMBER,
      defaultValue: 0,
    },
    card: {
      type: DataTypes.NUMBER,
      defaultValue: 0,
    },
    cash: {
      type: DataTypes.NUMBER,
      defaultValue: 0,
    },
  },
  {
    sequelize,
    modelName: 'Store',
  }
);

module.exports = { sequelize, Store };
