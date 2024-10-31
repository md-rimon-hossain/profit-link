const { Sequelize } = require("sequelize");

// Initialize Sequelize with SQLite
const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "./database.sqlite", // This will create a file named database.sqlite in the project directory
  logging: false,
});

module.exports = sequelize;
