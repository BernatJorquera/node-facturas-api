const getProyectoSchema = () => {
  const nombre = {
    exists: true
  };
  const estado = {
    exists: true
  };
  const aprobado = {
    exists: true,
    isInt: true,
    isLength: {
      options: {
        min: 13,
        max: 13
      }
    }
  };
  const entrega = {
    exists: true,
    isInt: true,
    isLength: {
      options: {
        min: 13,
        max: 13
      }
    }
  };
  const cliente = {
    exists: true
  };
  const tecnologias = {
    exists: true,
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
