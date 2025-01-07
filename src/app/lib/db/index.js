const { Sequelize } = require('sequelize');
const userSequelize = new Sequelize({
  dialect: 'sqlite',
  storage: 'src/app/db/user_data.sqlite',
});

const storeSequelize = new Sequelize({
  dialect: 'sqlite',
  storage: 'src/app/db/store_data.sqlite',
});

module.exports = {
  userSequelize,
  storeSequelize,
};
