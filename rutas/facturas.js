const express = require("express");
const debug = require("debug")("facturas:facturas");
const { generaError } = require("../utils/errores");
const { getFacturas, postFactura } = require("../controladores/facturas");

const router = express.Router();

router.get("/:tipo?", (req, res, next) => {
  const respuesta = getFacturas(req.params.tipo);
  if (!respuesta) {
    const error = generaError("Endpoint no válido (endpoints válidos: ingresos, gastos)", 404);
    return next(error);
  }
  return res.json(respuesta);
});
router.post("/", (req, res, next) => {
  /* primero se debería comprobar el schema con validator y si no es adecuado devolver un badRequestError */
  const nuevaFactura = postFactura(req.body);
  return res.status(201).json(nuevaFactura);
});

module.exports = router;
