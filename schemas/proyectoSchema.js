const getProyectoSchema = noEsPatch => {
  const nombre = {
    [noEsPatch ? "exists" : "optional"]: true
  };
  const estado = {
    [noEsPatch ? "exists" : "optional"]: true
  };
  const aprobado = {
    [noEsPatch ? "exists" : "optional"]: true,
    isInt: true,
    isLength: {
      options: {
        min: 13,
        max: 13
      }
    }
  };
  const entrega = {
    [noEsPatch ? "exists" : "optional"]: true,
    isInt: true,
    isLength: {
      options: {
        min: 13,
        max: 13
      }
    }
  };
  const cliente = {
    [noEsPatch ? "exists" : "optional"]: true
  };
  const tecnologias = {
    [noEsPatch ? "exists" : "optional"]: true,
    custom: {
      options: value => Array.isArray(value)
    }
  };
  return {
    nombre,
    estado,
    aprobado,
    entrega,
    cliente,
    tecnologias
  };
};

module.exports = {
  getProyectoSchema
};
