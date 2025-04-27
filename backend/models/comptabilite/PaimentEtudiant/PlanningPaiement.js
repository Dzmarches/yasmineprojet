import { DataTypes } from 'sequelize';
import sequelize from '../../../config/Database.js';
import moment from 'moment';

const PlanningPaiement= sequelize.define('PlanningPaiement', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
   ContratId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'contrats', 
      key: 'id',
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  },
  codePP:{
    type: DataTypes.STRING,
    allowNull: false,
  },  
  date_echeance: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  montant_echeance: {
    type: DataTypes.DECIMAL(15,2),
    allowNull: false,
  },
  montant_restant: {
    type: DataTypes.DECIMAL(15,2),
    allowNull: false,
  },
  //payé non payé
  etat_paiement: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  date_paiement: {
    type: DataTypes.DATE,
    allowNull: false,
  },
 montant_restant: {
    type: DataTypes.DECIMAL(15,2),
    allowNull: false,
  },
mode_paiement: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  notification: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  archiver: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },

}, {
  timestamps: true,
});

export default PlanningPaiement;
