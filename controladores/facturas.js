const { facturas } = require("../facturas.json");
const { generaError } = require("../utils/errores");

const getFacturaSchema = (requiereId, noEsPatch) => {
  const id = {
    [requiereId ? "exists" : "optional"]: true,
    isInt: true
  };
  const numero = {
    [noEsPatch ? "exists" : "optional"]: true,
    isInt: true
  };
  const fecha = {
    [noEsPatch ? "exists" : "optional"]: true,
    isInt: true,
    isLength: {
      options: {
        min: 13,
        max: 13
      }
    }
  };
  const vencimiento = {
    optional: true,
    isInt: true,
    isLength: {
      options: {
        min: 13,
        max: 13
      }
    }
  };
  const base = {
    [noEsPatch ? "exists" : "optional"]: true,
    isFloat: {
      options: {
        min: 0
      }
    }
  };
  const tipoIva = {
    [noEsPatch ? "exists" : "optional"]: true,
    isInt: {
      options: {
        min: 0
      }
    }
  };
  const tipo = {
    [noEsPatch ? "exists" : "optional"]: true,
    custom: {
      options: value => value === "gasto" || value === "ingreso"
    }
  };
  const abonada = {
    [noEsPatch ? "exists" : "optional"]: true,
    isBoolean: true
  };
  return {
    id,
    numero,
    fecha,
    vencimiento,
    base,
    tipoIva,
    tipo,
    abonada
  };
};

const getFacturas = (tipo) => {
  if (tipo === "ingresos") {
    const ingresos = facturas.filter(factura => factura.tipo === "ingreso");
    return {
      total: ingresos.length,
      datos: ingresos
    };
  } else if (tipo === "gastos") {
    const gastos = facturas.filter(factura => factura.tipo === "gasto");
    return {
      total: gastos.length,
      datos: gastos
    };
  } else if (!tipo) {
    return {
      total: facturas.length,
      datos: facturas
    };
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
  getFacturaSchema,
  postFactura,
  sustituirFactura,
  modificarFactura,
  borrarFactura
};
