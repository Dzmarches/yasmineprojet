import { DataTypes } from 'sequelize';
import sequelize from '../../config/Database.js';

const Ecole_SEcole_Postes = sequelize.define('Ecole_SEcole_Postes', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  ecoleId: {
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
  posteId: {
    unique: false, 
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'postes',  
      key: 'id',
    },
    onUpdate: 'CASCADE',  
    onDelete: 'CASCADE',  
  },
}, {
  timestamps: true,
  indexes: [
    {
      unique: false,
      fields: ['ecoleId', 'ecoleeId', 'posteId'],  
    },
  ],
});

export default Ecole_SEcole_Postes; 