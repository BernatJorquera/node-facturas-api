const Proyecto = require("../db/modelos/proyecto");
const { generaError } = require("../utils/errores");

const filtroQuery = (query) => {
  const {
    tecnologias, vencidos, ordenPor, orden, nPorPagina, pagina
  } = query;
  const conVencidos = vencidos ? (vencidos === "true" || vencidos === "false") : true;
  const conOrdenPor = ordenPor ? (ordenPor === "fecha" || ordenPor === "nombre") : true;
  const conOrden = orden ? (orden === "asc" || orden === "desc") : true;
  const conPorPagina = nPorPagina
    // eslint-disable-next-line radix
    ? (!isNaN(nPorPagina) && +nPorPagina === parseInt(+nPorPagina) && +nPorPagina > 0)
    : true;
  const conPagina = pagina
    // eslint-disable-next-line radix
    ? (!isNaN(pagina) && +pagina === parseInt(+pagina) && +pagina > 0)
    : true;
  const condicionTotal = conVencidos && conOrdenPor && conOrden && conPorPagina && conPagina;
  const filtroFind = {};
  let filtroSort = null;
  if (condicionTotal) {
    const error = null;
    if (tecnologias) {
      filtroFind.tecnologias = { $in: tecnologias.split(",") };
    }
    if (vencidos) {
      const currentTimestamp = new Date().getTime();
      filtroFind.entrega = { [vencidos === "true" ? "$gte" : "$lt"]: currentTimestamp };
    }
    if (ordenPor) {
      filtroSort = { [ordenPor === "fecha" ? "entrega" : "nombre"]: orden === "desc" ? -1 : 1 };
    }
    return { error, filtroFind, filtroSort };
  } else {
    const error = generaError("La query introducida no es correcta", 400);
    return { error, filtroFind, filtroSort };
  }
};

const getProyectos = async (tipo, query) => {
  const { error: errorQuery, filtroFind, filtroSort } = filtroQuery(query);
  const { nPorPagina, pagina } = query;
  if (errorQuery) {
    return {
      error: errorQuery,
      total: null,
      datos: null
    };
  }
  if (!tipo) {
    const error = null;
    const proyectos = await Proyecto
      .find(filtroFind)
      .sort(filtroSort)
      .skip(+nPorPagina * ((+pagina || 1) - 1))
      .limit(+nPorPagina);
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
  const proyectoCoincidente = await Proyecto.findOne({
    nombre: nuevoProyecto.nombre,
    cliente: nuevoProyecto.cliente
  });
  if (proyectoCoincidente) {
    const error = generaError("Ya existe el proyecto", 409);
    respuesta.error = error;
  } else {
    const nuevoProyectoBD = await Proyecto.create(nuevoProyecto);
    respuesta.proyecto = nuevoProyectoBD;
  }
  return respuesta;
};

const sustituirProyecto = async (nuevoProyecto, idProyecto) => {
  const respuesta = {
    proyecto: null,
    error: null
  };
  const proyectoCoincidente = await Proyecto.findById(idProyecto);
  if (proyectoCoincidente) {
    const proyectoSustituido = await proyectoCoincidente.updateOne(nuevoProyecto);
    respuesta.proyecto = nuevoProyecto;
  } else {
    const { proyectoSustituido, error } = await postProyecto(nuevoProyecto);
    respuesta.proyecto = proyectoSustituido;
    respuesta.error = error;
  }
  return respuesta;
};

const modificarProyecto = async (modificaciones, idProyecto) => {
  const respuesta = {
    proyecto: null,
    error: null
  };
  const proyectoCoincidente = await Proyecto.findByIdAndUpdate(idProyecto, modificaciones);
  if (proyectoCoincidente) {
    respuesta.proyecto = {
      ...proyectoCoincidente,
      ...modificaciones
    }._doc;
  } else {
    const error = generaError("El proyecto solicitado no existe", 404);
    respuesta.error = error;
  }
  return respuesta;
};

const borrarProyecto = async idProyecto => {
  const proyectoCoincidente = await Proyecto.findByIdAndDelete(idProyecto);
  return proyectoCoincidente;
};

module.exports = {
  getProyectos,
  getProyecto,
  postProyecto,
  sustituirProyecto,
  modificarProyecto,
  borrarProyecto
};
