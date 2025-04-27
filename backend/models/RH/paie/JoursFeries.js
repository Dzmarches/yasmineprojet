import { Sequelize } from "sequelize";
import db from "../../../config/Database.js";

const { DataTypes } = Sequelize;

const JoursFeries = db.define('JoursFeries', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  date: {
    type: DataTypes.DATE, 
    allowNull: false,
  },
  nom: {
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
        msg: "La valeur de 'archiver' doit être 0 ou 1 ou 2.",
      },
    },
  },
},

{
  timestamps: false,
})

export default JoursFeries;
