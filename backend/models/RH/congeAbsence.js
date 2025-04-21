
import { DataTypes } from 'sequelize';
import sequelize from '../../config/Database.js';
import moment from 'moment';
import Employe from '../RH/employe.js'


const CongeAbsence = sequelize.define('CongeAbsence', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
    type_demande:{type:DataTypes.STRING},
    statut: { type: DataTypes.STRING,allowNull:true, defaultValue:'En attente' },
    dateDebut:{type:DataTypes.DATE,allowNull: true},
    dateFin:{type:DataTypes.DATE,allowNull: true},
    commentaire: { type: DataTypes.STRING,allowNull: true},
    motif: { type: DataTypes.STRING,allowNull: true},
    jour_congeMois: { type: DataTypes.FLOAT,defaultValue:0},
    jour_consomme: { type: DataTypes.FLOAT,defaultValue:0},
    jour_restant: { type: DataTypes.FLOAT,defaultValue:0},
    archiver:{type:DataTypes.INTEGER,defaultValue:0},
    fichier:{type:DataTypes.STRING,allowNull:true},

    employe_id:{
      type: DataTypes.INTEGER,
      references: {
        model: 'employes',
        key: 'id', 
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
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
    idCA: {
      type: DataTypes.INTEGER,
      allowNull: true,
      unique: false, 
      references: {
        model: 'congeannuels',  
        key: 'id',
      },
      onUpdate: 'CASCADE',  
      onDelete: 'CASCADE',  
    },
}, {
    timestamps: true, 
  // hooks: {
  //   beforeCreate: (congeabsence, options) => {
  //     if (congeabsence.dateDebut) {
  //       congeabsence.dateDebut = moment(congeabsence.dateDebut).startOf('day').format('YYYY-MM-DD');
  //     }
  //     if (congeabsence.dateFin) {
  //       congeabsence.dateFin = moment(congeabsence.dateFin).startOf('day').format('YYYY-MM-DD');
  //     }
  //   },
  //   beforeUpdate: (congeabsence, options) => {
  //     if (congeabsence.dateDebut) {
  //       congeabsence.dateDebut = moment(congeabsence.dateDebut).startOf('day').format('YYYY-MM-DD');
  //     }
  //     if (congeabsence.dateFin) {
  //       congeabsence.dateFin = moment(congeabsence.dateFin).startOf('day').format('YYYY-MM-DD');
  //     }
  //   }
  // }
  });
  

 
export default CongeAbsence;
