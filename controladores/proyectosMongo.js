const Proyecto = require("../db/modelos/proyecto");

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
  }
};

module.exports = {
  getProyectos
};
