const { facturas } = require("../facturas.json");
const { generaError } = require("../utils/errores");

const getFacturaSchema = (requiereId) => {
  const id = {
    [requiereId ? "exists" : "optional"]: true,
    isInt: true
  };
  const numero = {
    exists: true,
    isInt: true
  };
  const fecha = {
    exists: true,
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
    exists: true,
    isFloat: {
      options: {
        min: 0
      }
    }
  };
  const tipoIva = {
    exists: true,
    isInt: {
      options: {
        min: 0
      }
    }
  };
  const tipo = {
    custom: {
      options: value => value === "gasto" || value === "ingreso"
    }
  };
  const abonada = {
    exists: true,
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
    respuesta.error = generaError("La id introducida ya corresponde a otra factura", 409);
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

module.exports = {
  getFacturas,
  getFacturaSchema,
  postFactura,
  sustituirFactura
};
