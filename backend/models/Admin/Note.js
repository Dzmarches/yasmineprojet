import { DataTypes } from 'sequelize';
import db from '../../config/Database.js';

const Note = db.define('Note', {
  id: {
    type: DataTypes.INTEGER, 
    primaryKey: true, 
    autoIncrement: true, 
  },
  EleveId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id',
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  },
  matiereId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'matieres',
      key: 'id',
    }
  },
  enseignantId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
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
  // periodeId: {
  //   type: DataTypes.INTEGER,
  //   allowNull: true,
  //   references: {
  //     model: 'periodes',
  //     key: 'id',
  //   }
  // },
  
  // Champs pour Primaire
  expression_orale: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  lecture: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  production_ecrite: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  moyenne_eval: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  
  // Champs pour CEM
  eval_continue: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  devoir1: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  devoir2: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  
  // Champs pour Lycée
  travaux_pratiques: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  moyenne_devoirs: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  
  // Champs communs
  examens: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  moyenne: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  coefficient: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  moyenne_total: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  remarque: {
    type: DataTypes.STRING,
    allowNull: true
  },
  cycle: {
    type: DataTypes.ENUM('Primaire', 'Cem', 'Lycée'),
    allowNull: true
  }
}, {
  timestamps: true,
  indexes: [
    {
      unique: true,
      fields: ['EleveId', 'matiereId', 'sectionId', 'periodeId']
    }
  ]
});

export default Note;