const express = require("express");
const debug = require("debug")("facturas:facturas");
const { checkSchema } = require("express-validator");
const { generaError, badRequestError } = require("../utils/errores");
const { getProyectoSchema } = require("../schemas/proyectoSchema");
const {
  getProyectos,
  getProyecto,
  postProyecto,
  sustituirProyecto,
  modificarProyecto,
  borrarProyecto
} = require("../controladores/proyectosMongo");

const router = express.Router();

router.get("/:tipo?", async (req, res, next) => {
  const { error, total, datos } = await getProyectos(req.params.tipo, req.query);
  if (error) {
    return next(error);
  }
  return res.json({ total, datos });
});
router.get("/proyecto/:idProyecto", async (req, res, next) => {
  const respuesta = await getProyecto(req.params.idProyecto);
  if (!respuesta) {
    const error = generaError("El id introducido no corresponde a ningún proyecto", 404);
    return next(error);
  }
  return res.json(respuesta);
});
router.post("/proyecto",
  checkSchema(getProyectoSchema(true)),
  async (req, res, next) => {
    const error = badRequestError(req);
    if (error) {
      return next(error);
    }
    const respuesta = await postProyecto(req.body);
    if (respuesta.error) {
      return next(respuesta.error);
    } else {
      return res.status(201).json(respuesta.proyecto);
    }
  });
router.put("/proyecto/:idProyecto",
  checkSchema(getProyectoSchema(true)),
  async (req, res, next) => {
    const error = badRequestError(req);
    if (error) {
      return next(error);
    }
    const respuesta = await sustituirProyecto(req.body, req.params.idProyecto);
    if (respuesta.error) {
      return next(respuesta.error);
    } else {
      return res.status(201).json(respuesta.proyecto);
    }
  });
router.patch("/proyecto/:idProyecto",
  checkSchema(getProyectoSchema(false)),
  async (req, res, next) => {
    const error = badRequestError(req);
    if (error) {
      return next(error);
    }
    const respuesta = await modificarProyecto(req.body, req.params.idProyecto);
    if (respuesta.error) {
      return next(respuesta.error);
    } else {
      return res.status(200).json(respuesta.proyecto);
    }
  });
router.delete("/proyecto/:idProyecto",
  async (req, res, next) => {
    const respuesta = await borrarProyecto(req.params.idProyecto);
    if (!respuesta) {
      const error = generaError("El id introducido no corresponde a ningún proyecto", 404);
      return next(error);
    }
    return res.json(respuesta);
  });

module.exports = router;
