import { DataTypes } from 'sequelize';
import db from '../../config/Database.js';

// Définir le modèle 'Matiere'
const Matiere = db.define('Matiere', {
  id: {
    type: DataTypes.INTEGER, 
    primaryKey: true, 
    autoIncrement: true, 
  },
  nom: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  nomarabe: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  image: {
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
  timestamps: true, // Sequelize ajoutera automatiquement createdAt et updatedAt
});


export default Matiere;
