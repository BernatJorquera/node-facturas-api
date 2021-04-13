require("dotenv").config();
const debug = require("debug")("facturas:db");
const chalk = require("chalk");
const { Sequelize } = require("sequelize");

const sequelize = new Sequelize({
  host: process.env.MYSQL_HOST,
  database: process.env.MYSQL_DB,
  username: process.env.MYSQL_USER,
  password: process.env.MYSQL_PWD,
  dialect: "mysql",
  logging: mensaje => debug(chalk.blue(mensaje))
});

module.exports = sequelize;
