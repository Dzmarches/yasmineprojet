import { DataTypes } from 'sequelize';
import db from '../../config/Database.js';
import Niveaux from './Niveaux.js'; // Assurez-vous que le modèle Niveaux existe

// Définir le modèle 'Section' avec la clé étrangère
const Section = db.define('Section', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  classe: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  classearab: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  niveaunum: {
    type: DataTypes.STRING, 
    allowNull: true,
  },
  numregime: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  niveauxId: {
    type: DataTypes.INTEGER,
    references: {
      model: Niveaux,
      key: 'id',
    },
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

// Définir la relation entre Section et Niveaux
Section.belongsTo(Niveaux, { foreignKey: 'niveauxId', as: 'niveau' });



export default Section;
