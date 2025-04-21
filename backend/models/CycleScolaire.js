import { Sequelize } from "sequelize";
import db from "../config/Database.js";
const { DataTypes } = Sequelize;

const CycleScolaire = db.define('CycleScolaire', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  nomCycle: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  nomCycleArabe: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  classement: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  archiver: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    validate: {
      isIn: {
        args: [[0, 1, 2]],
        msg: "La valeur de 'archiver' doit être 0, 1 ou 2.",
      },
    },
  },
}, {
  timestamps: false,
});

export default CycleScolaire;
