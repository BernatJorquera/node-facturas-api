/* eslint-disable eqeqeq */
const { facturas } = require("../facturas.json");
const { generaError } = require("../utils/errores");

const pasarFiltroQuery = (facturas, query) => {
  const respuesta = {
    error: false,
    facturas
  };
  const {
    abonadas, vencidas, ordenPor, orden, nPorPagina, pagina
  } = query;
  const conAbonadas = abonadas ? (abonadas === "true" || abonadas === "false") : true;
  const conVencidas = vencidas ? (vencidas === "true" || vencidas === "false") : true;
  const conOrdenPor = ordenPor ? (ordenPor === "fecha" || ordenPor === "base") : true;
  const conOrden = orden ? (orden === "asc" || orden === "desc") : true;
  const conPorPagina = nPorPagina
    // eslint-disable-next-line radix
    ? (!isNaN(nPorPagina) && +nPorPagina === parseInt(+nPorPagina) && +nPorPagina > 0)
    : true;
  const conPagina = pagina
    // eslint-disable-next-line radix
    ? (!isNaN(pagina) && +pagina === parseInt(+pagina) && +pagina > 0 && +pagina < +nPorPagina)
    : true;
  const condicionTotal = conAbonadas && conVencidas && conOrdenPor && conOrden && conPorPagina && conPagina;
  if (condicionTotal) {
    respuesta.facturas = facturas
      .filter(factura => (abonadas ? (factura.abonada ? "true" : "false") === abonadas : true)
        && (vencidas ? (factura.vencimiento ? "true" : "false") === vencidas : true))
      .sort((f1, f2) => f1[ordenPor] - f2[ordenPor]);
    if (ordenPor && orden === "desc") {
      respuesta.facturas.reverse();
    }
    if (nPorPagina) {
      const pagDefault = pagina || 1;
      respuesta.facturas = respuesta.facturas.slice(+nPorPagina * (+pagDefault - 1), +nPorPagina * (+pagDefault));
    }
  } else {
    respuesta.error = generaError("La query introducida no es correcta", 400);
  }
  return respuesta;
};

const getFacturas = async (tipo, query) => {
  if (tipo === "ingresos") {
    const ingresos = facturas.filter(factura => factura.tipo === "ingreso");
    const { error, facturas: ingresosFiltrados } = pasarFiltroQuery(ingresos, query);
    return {
      error,
      total: ingresosFiltrados.length,
      datos: ingresosFiltrados
    };
  } else if (tipo === "gastos") {
    const gastos = facturas.filter(factura => factura.tipo === "gasto");
    const { error, facturas: gastosFiltrados } = pasarFiltroQuery(gastos, query);
    return {
      error,
      total: gastosFiltrados.length,
      datos: gastosFiltrados
    };
  } else if (!tipo) {
    const { error, facturas: facturasFiltradas } = pasarFiltroQuery(facturas, query);
    return {
      error,
      total: facturasFiltradas.length,
      datos: facturasFiltradas
    };
  } else {
    return { error: generaError("Endpoint no válido (endpoints válidos: ingresos, gastos)", 404) };
  }
};

const getFactura = id => facturas.find(factura => factura.id === id);

const postFactura = (nuevaFactura, posicionFactura) => {
  const respuesta = {
    error: false,
    factura: null
  };
  nuevaFactura.id = nuevaFactura.id || facturas[facturas.length - 1].id + 1;
  const facturaConflictiva = facturas.find(factura => factura.id === nuevaFactura.id);
  if (!facturaConflictiva) {
    if (posicionFactura) {
      facturas[posicionFactura] = nuevaFactura;
    } else {
      facturas.push(nuevaFactura);
    }
    respuesta.factura = nuevaFactura;
  } else {
    respuesta.error = generaError("El id introducida ya corresponde a otra factura", 409);
  }
  return respuesta;
};

const sustituirFactura = (nuevaFactura, idParam) => {
  let respuesta = {
    error: false,
    factura: null
  };
  const facturaCoincidente = facturas
    .map((factura, i) => [factura, i])
    .find(factura => factura[0].id === idParam);
  if (facturaCoincidente) {
    respuesta = postFactura(nuevaFactura, facturaCoincidente[1]);
  } else {
    respuesta = postFactura(nuevaFactura);
  }
  return respuesta;
};

const modificarFactura = (modificaciones, id) => {
  const respuesta = {
    error: false,
    factura: null
  };
  const facturaAModificar = facturas
    .map((factura, i) => [factura, i])
    .find(factura => factura[0].id === id);
  if (facturaAModificar) {
    const facturaConflictiva = (modificaciones.id !== id)
      && facturas.find(factura => factura.id === modificaciones.id);
    if (facturaConflictiva) {
      respuesta.error = generaError("El id introducida ya corresponde a otra factura", 409);
    }
    const facturaModificada = {
      ...facturaAModificar[0],
      ...modificaciones
    };
    facturas[facturaAModificar[1]] = facturaModificada;
    respuesta.factura = facturaModificada;
  } else {
    respuesta.error = generaError("El id introducido no corresponde a ninguna factura", 404);
  }
  return respuesta;
};

const borrarFactura = id => {
  const facturaABorrar = facturas.find(factura => factura[0].id === id);
  facturas.filter(factura => factura.id !== id);
  return facturaABorrar;
};

module.exports = {
  getFacturas,
  getFactura,
  postFactura,
  sustituirFactura,
  modificarFactura,
  borrarFactura
};
