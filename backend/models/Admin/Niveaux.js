import { DataTypes } from 'sequelize';
import db from '../../config/Database.js';
import Matiere from './Matiere.js';

// Définir le modèle 'Niveaux'
const Niveaux = db.define('Niveaux', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nomniveau: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  nomniveuarab: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  statutInscription: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  cycle: {
    type: DataTypes.STRING,
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
  createdAt: false,
  updatedAt: false,
  tableName: 'niveauxes', // Ajout de cette ligne pour corriger le nom de la table
});



export default Niveaux;
