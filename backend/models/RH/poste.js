import { DataTypes } from 'sequelize';
import sequelize from '../../config/Database.js';
const Poste = sequelize.define('Poste', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  poste: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  archiver: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  
}, {
  timestamps: true,
});


export default Poste;
