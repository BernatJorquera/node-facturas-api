require("dotenv").config();
const express = require("express");
const chalk = require("chalk");
const debug = require("debug")("facturas:root");
const { program } = require("commander");
const morgan = require("morgan");
const cors = require("cors");
const rutasFacturas = require("./rutas/facturas");
const rutasProyectos = require("./rutas/proyectos");
const { manejaErrores } = require("./utils/errores");
require("./db/dbMongo");

program.option("-p", "--puerto <puerto>", "Puerto para el servidor");
program.parse(process.argv);
const options = program.opts();

const app = express();
const puerto = options.puerto || process.env.PUERTO || 5000;

const server = app.listen(puerto, () => {
  debug(chalk.green(`Usando el puerto ${puerto}`));
});

server.on("error", err => {
  debug(chalk.red.bold("Ha ocurrido un error al levantar el servidor"));
  if (err === "EADDRINUSE") {
    debug(chalk.red.bold(`El puerto ${puerto} está ocupado`));
  }
});

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use("/facturas", rutasFacturas);
app.use("/proyectos", rutasProyectos);
app.use("/", (req, res, next) => {
  res.json("Has pedido algo de la página principal");
});
app.use(manejaErrores);
