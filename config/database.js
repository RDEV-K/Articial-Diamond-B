const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    dialect: "mysql",
    port: process.env.DB_PORT,
    logging: customLogger
  },
);
function customLogger ( queryString, queryObject ) {
  console.log( queryString )      // outputs a string
  console.log( queryObject.bind ) // outputs an array
}

module.exports = sequelize;
