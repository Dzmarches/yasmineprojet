import { Sequelize } from "sequelize";
import db from "../../../config/Database.js";

const { DataTypes } = Sequelize;

const PeriodePaie = db.define('PeriodePaie', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  code: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  dateDebut: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  dateFin: {
    type: DataTypes.DATE, 
    allowNull: false,
  },
  statut: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue:'',
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
}, {
  timestamps: true, 
  tableName: 'PeriodePaies', // Définit un nom de table correct
});

export default PeriodePaie;
