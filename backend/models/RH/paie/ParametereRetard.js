import { Sequelize } from "sequelize";
import db from "../../../config/Database.js";

const { DataTypes } = Sequelize;

const  ParametereRetard= db.define('ParametereRetard', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },

  Rmax: {
    type:DataTypes.TIME, 
    allowNull: false,
  },
  Rmin: {
    type: DataTypes.TIME, 
    allowNull: false,
  },
  HE: {
    type: DataTypes.TIME, 
    allowNull: true,
  },

  statut: {
    type: DataTypes.STRING, 
    allowNull: false,
  },
  ecoleId: {
    type: DataTypes.INTEGER,
    allowNull: false, 
    references: {
      model: 'EcolePrincipals', 
      key: 'id', 
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
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
  timestamps: true,
});

export default ParametereRetard;
