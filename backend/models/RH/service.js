
import { DataTypes } from 'sequelize';
import sequelize from '../../config/Database.js';


const Service = sequelize.define('Service', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
    service: { type: DataTypes.STRING,allowNull: false,},
    archiver:{type:DataTypes.INTEGER,defaultValue:0},
    
    
}, {
    timestamps: true, 
  });


 
  export default Service;
