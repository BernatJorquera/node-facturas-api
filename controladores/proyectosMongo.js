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
  }
};

module.exports = {
  getProyectos
};
