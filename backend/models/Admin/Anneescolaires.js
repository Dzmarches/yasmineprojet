import { DataTypes } from 'sequelize';
import db from '../../config/Database.js';

const Anneescolaire = db.define('Anneescolaire', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  titre: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  titre_ar: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  datedebut: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  datefin: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  archiver: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    validate: {
      isIn: {
        args: [[0, 1, 2]],
        msg: "La valeur de 'archiver' doit être 0, 1 ou 2."
      }
    }
  },
}, {
  timestamps: false,
});

export default Anneescolaire;
