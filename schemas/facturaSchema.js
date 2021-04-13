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

module.exports = {
  getFacturaSchema
};
