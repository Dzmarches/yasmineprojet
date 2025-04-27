import { DataTypes } from 'sequelize';
import sequelize from '../../../config/Database.js';
import moment from 'moment';

const Contrat= sequelize.define('Contrat', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  code: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  niveauId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'niveauxes', 
      key: 'id',
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  },
  annescolaireId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "anneescolaires", 
      key: 'id',
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  },
  eleveId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users', 
      key: 'id',
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  },  
  totalApayer: {
    type:  DataTypes.DECIMAL(15,2),
    allowNull: false,
  },
  date_debut_paiement: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  date_creation: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  nombre_echeances: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  typePaiment: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  Remarque: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  archiver: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
}, {
  timestamps: true,
});

export default Contrat;
