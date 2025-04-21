import { DataTypes } from 'sequelize';
import db from '../../config/Database.js';
import EcolePrincipal from '../EcolePrincipal.js';
import Ecole from './Ecole.js';

// Définir le modèle 'Salle' sans clé étrangère
const Salle = db.define('Salle', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  salle: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  sallearab: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  capacité: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  remarque: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  ecoleId: {  // Clé étrangère pour EcolePrincipal
    type: DataTypes.INTEGER,
    references: {
      model: EcolePrincipal,
      key: "id",
    },
    onDelete: "CASCADE",
  },
  ecoleeId: {  // Clé étrangère pour Ecole
    type: DataTypes.INTEGER,
    allowNull: true, // Permettre à ecoleeId d'être null
    references: {
      model: Ecole,
      key: "id",
    },
    onDelete: "CASCADE",
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
Salle.belongsTo(EcolePrincipal, { foreignKey: 'ecoleId', as: 'ecolePrincipal' });
Salle.belongsTo(Ecole, { foreignKey: 'ecoleeId', as: 'ecole' });

EcolePrincipal.hasMany(Salle, { foreignKey: 'ecoleId', as: 'salles' });
Ecole.hasMany(Salle, { foreignKey: 'ecoleeId', as: 'salles' });

export default Salle;
