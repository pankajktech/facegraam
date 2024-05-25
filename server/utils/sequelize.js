const { configDotenv } = require("dotenv");
const Sequelize = require("sequelize");

configDotenv();

const sequelize = new Sequelize(
  process.env.PGDATABASE,
  process.env.PGUSER,
  process.env.PGPASSWORD,
  {
    host: process.env.PGHOST,
    port: process.env.PGPORT,
    dialect: "postgres",
    dialectOptions: {
      ssl: {
        rejectUnauthorized: true,
      },
    },
  },
);

sequelize
  .authenticate()
  .then(() => {
    console.log("Databse Connected Succesfully");
  })
  .catch((err) => {
    console.log("Errror Connecting", err.original.sqlMessage);
  });

sequelize.sync({ force: true }).then(() => {
  console.log("Tables created");
});

module.exports = sequelize;
