const { facturas } = require("../facturas.json");
const { generaError } = require("../utils/errores");

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

const postFactura = nuevaFactura => {
  nuevaFactura.id = facturas[facturas.length - 1].id + 1;
  facturas.push(nuevaFactura);
  return nuevaFactura;
};

module.exports = {
  getFacturas,
  postFactura
};
