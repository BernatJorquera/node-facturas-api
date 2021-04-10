const express = require("express");
const debug = require("debug")("facturas:facturas");
const { checkSchema, validationResult } = require("express-validator");
const { generaError, badRequestError } = require("../utils/errores");
const {
  getFacturas,
  getFactura,
  getFacturaSchema,
  postFactura,
  sustituirFactura,
  modificarFactura,
  borrarFactura
} = require("../controladores/facturas");

const router = express.Router();

router.get("/:tipo?", (req, res, next) => {
  const respuesta = getFacturas(req.params.tipo);
  if (!respuesta) {
    const error = generaError("Endpoint no válido (endpoints válidos: ingresos, gastos)", 404);
    return next(error);
  }
  return res.json(respuesta);
});
router.get("/factura/:idFactura", (req, res, next) => {
  const respuesta = getFactura(+req.params.idFactura);
  if (!respuesta) {
    const error = generaError("El id introducido no corresponde a ninguna factura", 404);
    return next(error);
  }
  return res.json(respuesta);
});
router.post("/factura",
  checkSchema(getFacturaSchema(false, true)),
  (req, res, next) => {
    const error = badRequestError(req);
    if (error) {
      return next(error);
    }
    const nuevaFactura = postFactura(req.body);
    return res.status(201).json(nuevaFactura);
  });
router.put("/factura/:idFactura",
  checkSchema(getFacturaSchema(true, true)),
  (req, res, next) => {
    const error = badRequestError(req);
    if (error) {
      return next(error);
    }
    const respuesta = sustituirFactura(req.body, +req.params.idFactura);
    if (respuesta.error) {
      return next(respuesta.error);
    } else {
      return res.status(201).json(respuesta.factura);
    }
  });
router.patch("/factura/:idFactura",
  checkSchema(getFacturaSchema(false, false)),
  (req, res, next) => {
    const error = badRequestError(req);
    if (error) {
      return next(error);
    }
    const respuesta = modificarFactura(req.body, +req.params.idFactura);
    if (respuesta.error) {
      return next(respuesta.error);
    } else {
      return res.status(200).json(respuesta.factura);
    }
  });
router.delete("/factura/:idFactura", (req, res, next) => {
  const respuesta = borrarFactura(+req.params.idFactura);
  if (!respuesta) {
    const error = generaError("El id introducido no corresponde a ninguna factura", 404);
    return next(error);
  }
  return res.json(respuesta);
});

module.exports = router;
