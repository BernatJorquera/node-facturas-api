const express = require("express");
const debug = require("debug")("facturas:facturas");
const { checkSchema, validationResult } = require("express-validator");
const { generaError, badRequestError } = require("../utils/errores");
const { getFacturas, getFacturaSchema, postFactura } = require("../controladores/facturas");

const router = express.Router();

router.get("/:tipo?", (req, res, next) => {
  const respuesta = getFacturas(req.params.tipo);
  if (!respuesta) {
    const error = generaError("Endpoint no válido (endpoints válidos: ingresos, gastos)", 404);
    return next(error);
  }
  return res.json(respuesta);
});
router.post("/factura",
  checkSchema(getFacturaSchema(false)),
  (req, res, next) => {
    const error = badRequestError(req);
    if (error) {
      return next(error);
    }
    const nuevaFactura = postFactura(req.body);
    return res.status(201).json(nuevaFactura);
  });

module.exports = router;
