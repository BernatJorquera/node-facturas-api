const express = require("express");
const debug = require("debug")("facturas:facturas");
const { checkSchema, validationResult } = require("express-validator");
const { generaError, badRequestError } = require("../utils/errores");
const { getFacturaSchema } = require("../schemas/facturaSchema");
const {
  getFacturas,
  getFactura,
  postFactura,
  sustituirFactura,
  modificarFactura,
  borrarFactura
} = require("../controladores/facturasSQL");

const router = express.Router();

router.get("/:tipo?", async (req, res, next) => {
  const { error, total, datos } = await getFacturas(req.params.tipo, req.query);
  if (error) {
    return next(error);
  }
  return res.json({ total, datos });
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
