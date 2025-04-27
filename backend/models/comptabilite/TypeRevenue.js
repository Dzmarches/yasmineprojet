import { DataTypes } from 'sequelize';
import sequelize from '../../config/Database.js';
import moment from 'moment';

const TypeRevenue= sequelize.define('TypeRevenue', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  remarque: {
    type: DataTypes.STRING,
    allowNull: true,
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
});

export default TypeRevenue;
