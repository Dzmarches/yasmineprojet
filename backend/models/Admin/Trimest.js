import { DataTypes } from 'sequelize';
import db from '../../config/Database.js';
import EcolePrincipal from '../EcolePrincipal.js';
import Ecole from './Ecole.js';

// Définir le modèle 'Trimest'
const Trimest = db.define('Trimest', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  titre: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  titre_ar: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  datedebut: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  datefin: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  // ecoleId: {  // Clé étrangère pour EcolePrincipal
  //   type: DataTypes.INTEGER,
  //   references: {
  //     model: EcolePrincipal,
  //     key: "id",
  //   },
  //   onDelete: "CASCADE",
  // },
  // ecoleeId: {  // Clé étrangère pour Ecole
  //   type: DataTypes.INTEGER,
  //   allowNull: true, // Permettre à ecoleeId d'être null
  //   references: {
  //     model: Ecole,
  //     key: "id",
  //   },
  //   onDelete: "CASCADE",
  // },
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
// Trimest.belongsTo(EcolePrincipal, { foreignKey: 'ecoleId', as: 'ecolePrincipal' });
// Trimest.belongsTo(Ecole, { foreignKey: 'ecoleeId', as: 'ecole' });

// EcolePrincipal.hasMany(Trimest, { foreignKey: 'ecoleId', as: 'Trimest' });
// Ecole.hasMany(Trimest, { foreignKey: 'ecoleeId', as: 'Trimest' });
export default Trimest;
