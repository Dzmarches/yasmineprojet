import { DataTypes } from 'sequelize';
import sequelize from '../../config/Database.js';
import moment from 'moment';

const Revenu= sequelize.define('Revenu', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  code: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  cause_ar: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  cause_fr: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  montant: {
    type: DataTypes.DECIMAL(15,2),
    allowNull: false,
  },

  date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  par_ar: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  par_fr: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  mode_paie: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  remarque: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  fichier:{type:DataTypes.STRING,allowNull:true},
  typeId:{
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: false, 
    references: {
      model: 'typerevenues',  
      key: 'id',
    },
    onUpdate: 'CASCADE',  
    onDelete: 'CASCADE',  
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

export default Revenu;
