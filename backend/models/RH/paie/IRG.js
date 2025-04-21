import { DataTypes } from 'sequelize';
import sequelize from '../../../config/Database.js';

const IRG = sequelize.define('IRG', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  pays: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  annee_fiscale: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  // (x,y)
  // x : Nombre total de chiffres (y compris avant et après la virgule).
// y : Nombre de chiffres après la virgule (précision décimale).
  tranche_min: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
  },
  tranche_max: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true, // NULL = pas de limite
  },
  taux_imposition: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: true,
  },
  // deduction_fixe: {
  //   type: DataTypes.DECIMAL(10, 2),
  //   allowNull: true,
  //   defaultValue: 0.00,
  // },
  archiver: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    validate: {
      isIn: {
        args: [[0, 1, 2]],
        msg: "La valeur de 'archiver' doit être 0, 1 ou 2.",
      },
    },
  },
}, {
  timestamps: true,
});

export default IRG;
