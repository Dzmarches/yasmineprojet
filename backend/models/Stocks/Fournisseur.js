import { DataTypes } from 'sequelize';
import db from '../../config/Database.js';

const Fournisseur = db.define('Fournisseur', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nom: {
    type: DataTypes.STRING,
    allowNull: false
  },
  contact: {
    type: DataTypes.STRING,
    allowNull: true
  },
  email: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      isEmail: true
    }
  },
  adresse: {
    type: DataTypes.STRING,
    allowNull: true
  },
  telephone: {
    type: DataTypes.STRING,
    allowNull: true
  },
  magasin: {
    type: DataTypes.STRING,
    allowNull: true
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
  date_creation: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  timestamps: false
});

export default Fournisseur;
