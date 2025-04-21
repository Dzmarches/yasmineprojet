import { DataTypes } from 'sequelize';
import sequelize from '../config/Database.js';
import moment from 'moment';

const Attestation= sequelize.define('Attestation', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nom: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  modeleTexte: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  module: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  ecoleId:{
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: false, 
    references: {
      model: 'ecoleprincipals',  
      key: 'id',
    },
    onUpdate: 'CASCADE',  
    onDelete: 'CASCADE',  
  },
  ecoleeId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    unique: false, 
    references: {
      model: 'ecoles',  
      key: 'id',
    },
    onUpdate: 'CASCADE',  
    onDelete: 'CASCADE',  
  },
  archiver: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
}, {
  timestamps: true,
  hooks: {
    beforeCreate: (attestation, options) => {
      attestation.createdAt = moment().format('YYYY-MM-DD HH:mm:ss');
    },
    beforeUpdate: (attestation, options) => {
      attestation.updatedAt = moment().format('YYYY-MM-DD HH:mm:ss');
    }
  }
});

export default Attestation;
