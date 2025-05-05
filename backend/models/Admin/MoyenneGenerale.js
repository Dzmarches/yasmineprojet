import { DataTypes } from 'sequelize';
import db from '../../config/Database.js';
import Anneescolaire from './Anneescolaires.js';
import Trimest from './Trimest.js';
import Niveaux from './Niveaux.js';

const MoyenneGenerale = db.define('MoyenneGenerale', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  EleveId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'eleves',
      key: 'id',
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  },
  niveauId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Niveaux,
      key: 'id',
    }
  },
  sectionId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'sections',
      key: 'id',
    }
  },
  annescolaireId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Anneescolaire,
      key: 'id',
    }
  },
  trimestId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Trimest,
      key: 'id',
    }
  },
  cycle: {
    type: DataTypes.ENUM('Primaire', 'Cem', 'Lycée'),
    allowNull: true
  },
  moyenne: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: false
  },
  status: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  timestamps: true,
  indexes: [
    {
      unique: true,
      fields: ['EleveId', 'sectionId', 'annescolaireId', 'trimestId'],
      name: 'idx_eleve_section_annee_trim'  // Nom plus court
    }
  ]
});

export default MoyenneGenerale;