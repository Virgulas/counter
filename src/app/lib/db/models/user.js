const { DataTypes, Model } = require('sequelize');
const { userSequelize: sequelize } = require('../index');

class User extends Model {}

User.init(
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
    },
    picture: {
      type: DataTypes.STRING,
      defaultValue: '',
    },
    available: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    pix: {
      type: DataTypes.JSON,
      defaultValue: {},
    },
    card: {
      type: DataTypes.JSON,
      defaultValue: {},
    },
    cash: {
      type: DataTypes.JSON,
      defaultValue: {},
    },
  },
  {
    sequelize,
    modelName: 'User',
  }
);

module.exports = { sequelize, User };
