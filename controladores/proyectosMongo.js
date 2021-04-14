const Proyecto = require("../db/modelos/proyecto");
const { generaError } = require("../utils/errores");

const getProyectos = async (tipo) => {
  if (!tipo) {
    const error = null;
    const proyectos = await Proyecto.find();
    return {
      error,
      total: proyectos.length,
      datos: proyectos
    };
  } else if (tipo === "pendientes") {
    const error = null;
    const proyectos = await Proyecto.find({ estado: "pendiente" });
    return {
      error,
      total: proyectos.length,
      datos: proyectos
    };
  } else if (tipo === "en-progreso") {
    const error = null;
    const proyectos = await Proyecto.find({ estado: "wip" });
    return {
      error,
      total: proyectos.length,
      datos: proyectos
    };
  } else if (tipo === "finalizados") {
    const error = null;
    const proyectos = await Proyecto.find({ estado: "finalizado" });
    return {
      error,
      total: proyectos.length,
      datos: proyectos
    };
  } else {
    return {
      error: generaError(
        "Endpoint no válido (endpoints válidos: pendientes, en-progreso, finalizados)", 404
      ),
      total: null,
      datos: null
    };
  }
};

const getProyecto = async id => {
  const proyecto = await Proyecto.findById(id, "-_id");
  return proyecto;
};

const postProyecto = async nuevoProyecto => {
  const respuesta = {
    proyecto: null,
    error: null
  };
  const proyectoEncontrado = await Proyecto.findOne({
    nombre: nuevoProyecto.nombre,
    cliente: nuevoProyecto.cliente
  });
  if (proyectoEncontrado) {
    const error = generaError("Ya existe el proyecto", 409);
    respuesta.error = error;
  } else {
    const nuevoProyectoBD = await Proyecto.create(nuevoProyecto);
    respuesta.proyecto = nuevoProyectoBD;
  }
  return respuesta;
};

module.exports = {
  getProyectos,
  getProyecto,
  postProyecto
};
