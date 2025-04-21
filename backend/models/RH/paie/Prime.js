import { Sequelize } from "sequelize";
import db from "../../../config/Database.js";

const { DataTypes } = Sequelize;

const Prime = db.define('Prime', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  code: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  type_prime: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  montant: {
    type: DataTypes.FLOAT, 
    allowNull: false,
  },
  montantType: {  
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'montant',  
    validate: {
      isIn: {
        args: [['montant', 'pourcentage','jour']],
        msg: "Le 'montantType' doit être soit 'montant' soit 'pourcentage'.",
      },
    },
  },
  identifiant_special: {  
    type: DataTypes.STRING,
    allowNull: false,
  },
  prime_cotisable: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  prime_imposable: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  deduire: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
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

export default Prime;
