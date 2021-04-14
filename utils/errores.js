const debug = require("debug")("facturas:errores");
const { validationResult } = require("express-validator");

const generaError = (mensaje, status) => {
  const error = new Error(mensaje);
  error.codigo = status;
  return error;
};

const badRequestError = req => {
  const errores = validationResult(req);
  let error;
  if (!errores.isEmpty()) {
    error = generaError("El objeto introducido no tiene la forma correcta", 400);
  }
  return error;
};

const manejaErrores = (err, req, res, next) => {
  if (err.type === "entity.parse.failed") {
    return res.status(400).json({ error: true, mensaje: "El objeto introducido no tiene la forma correcta" });
  }
  const error = {
    codigo: err.codigo || 500,
    mensaje: err.codigo ? err.message : "Ha ocurrido un error general"
  };
  res.status(error.codigo).json({ error: true, mensaje: error.mensaje });
};

module.exports = {
  generaError,
  badRequestError,
  manejaErrores
};
