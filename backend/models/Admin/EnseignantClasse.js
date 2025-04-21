import { DataTypes } from 'sequelize';
import db from '../../config/Database.js';
import Enseignant from './Enseignant.js';
import Section from './Section.js';
import Matiere from './Matiere.js';
import Niveaux from './Niveaux.js';

const EnseignantClasse = db.define('EnseignantClasse', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  enseignantId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Enseignant, // Référence correcte au modèle Sequelize
      key: 'id',
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  }, 
  matiereId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Matiere, // Référence correcte au modèle Sequelize
      key: 'id',
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  },  
  classeId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Section, // Référence correcte au modèle Sequelize
      key: 'id',
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  },
  niveauId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Niveaux, // Référence correcte au modèle Sequelize
      key: 'id',
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  },
}, {
  timestamps: false,
  tableName: 'EnseignantClasse',
});



export default EnseignantClasse;
