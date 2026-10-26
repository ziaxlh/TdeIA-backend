'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Estudiante extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Estudiante.init({
    nombre: DataTypes.STRING,
    correo: DataTypes.STRING,
    passwordHash: DataTypes.STRING,
    programa: DataTypes.STRING,
    semestre: DataTypes.INTEGER,
    promedio: DataTypes.FLOAT
  }, {
    sequelize,
    modelName: 'Estudiante',
  });
  return Estudiante;
};