import { DataTypes } from 'sequelize';
import db from '../../config/Database.js';
import Niveaux from './Niveaux.js';  
import Matiere from './Matiere.js';  
import Enseignant from './Enseignant.js';

const NiveauxMatieres = db.define('NiveauxMatieres', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  niveauId: {
    type: DataTypes.INTEGER,
    references: { model: Niveaux, key: 'id' },
    allowNull: false,
  },
  matiereId: {
    type: DataTypes.INTEGER,
    references: { model: Matiere, key: 'id' },
    allowNull: false,
  },
  enseignantId:{
    type: DataTypes.INTEGER,
    references: { model: Enseignant, key: 'id' },
    allowNull: true,
  },
  duree: {
    type: DataTypes.INTEGER, // Durée en minutes
    allowNull: true,
    defaultValue: null
  },
  dureeseance:{
    type: DataTypes.INTEGER, // Durée en minutes
    allowNull: true,
    defaultValue: null
  },
  nombreseanceparjour:{
    type: DataTypes.INTEGER, // Durée en minutes
    allowNull: true,
    defaultValue: null
  },
  preference:{
    type: DataTypes.STRING,
    allowNull: true,
  },
  matieresConfessions:{
    type: DataTypes.INTEGER, // Durée en minutes
    allowNull: true,
    defaultValue: null
  }
}, {
  timestamps: false,
});


export default NiveauxMatieres;
