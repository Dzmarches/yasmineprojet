import { DataTypes } from 'sequelize';
import sequelize from '../../config/Database.js';

const HeuresSup = sequelize.define('HeuresSup', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nom: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: false,
  },
  taux: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  ecoleId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'EcolePrincipals',
      key: 'id',
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  },
  archiver: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  
}, {
  timestamps: true,
});

export default HeuresSup;
