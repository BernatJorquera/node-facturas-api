const { DataTypes } = require("sequelize");
const sequelize = require("../dbSQL");

const Factura = sequelize.define("Factura", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  numero: {
    type: DataTypes.STRING(15),
    allowNull: false
  },
  fecha: {
    type: DataTypes.STRING(15),
    allowNull: false
  },
  vencimiento: DataTypes.STRING(15),
  concepto: DataTypes.TEXT,
  base: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  tipoIva: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  tipo: {
    type: DataTypes.ENUM(["ingreso", "gasto"]),
    allowNull: false
  },
  abonada: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  }
}, {
  tableName: "facturas",
  timestamps: false
});

module.exports = Factura;
