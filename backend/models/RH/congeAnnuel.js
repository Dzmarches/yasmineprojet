
import { DataTypes } from 'sequelize';
import sequelize from '../../config/Database.js';
import moment from 'moment';


const CongeAnnuel = sequelize.define('CongeAnnuel', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
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
    dateDebut:{type:DataTypes.DATEONLY},
    dateFin:{type:DataTypes.DATEONLY},
    archiver:{type:DataTypes.INTEGER,defaultValue:0},
 
 

  
  
  }, {
      timestamps: true, 
      // hooks: {
      //   beforeCreate: (employe, options) => {
      //     if (employe.datenais) {
      //       employe.datenais = moment(employe.datenais, "DD/MM/YYYY").format("YYYY-MM-DD");
      //     }
      //   },
      //   beforeUpdate: (employe, options) => {
      //     if (employe.datenais) {
      //       employe.datenais = moment(employe.datenais, "DD/MM/YYYY").format("YYYY-MM-DD");
      //     }
      //   }
      // }
    });
    
export default CongeAnnuel;
  