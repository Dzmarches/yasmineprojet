import { Sequelize } from "sequelize";
import db from "../../../config/Database.js";
const { DataTypes } = Sequelize;

const JournalPaie = db.define('JournalPaie', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  periodePaieId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'PeriodePaies', 
      key: 'id',
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  },
  nom_prenom: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  idEmploye: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Employes', 
      key: 'id',
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  },
  salaireBase:{
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0,
  },
  NVSBaseAbsences:{
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0,
  },
  nbrJrTrvMois: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  joursAbsence:{
    type:DataTypes.DECIMAL(10, 2),
    defaultValue: 0,
  },
  nbrHRetard:{
    type:DataTypes.DECIMAL(10, 2),
    defaultValue: 0,
  },
  salaireNet: {
    type: DataTypes.DECIMAL(10, 2), 
    defaultValue: 0,
    },
  salaireBrut: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0,
  },
  cotisations: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0,
    },
  SalaireImposable: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0,  },

  RetenueIRG:{
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0,
  },

  RetenueSS:{
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0,
  },
  AutreRetenues:{
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0,
  },
  AbsenceRetenues:{
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0,
  },
  NomAutreRetenues:{
    type: DataTypes.STRING,
  },
  date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  heuresSup:{
    type:DataTypes.DECIMAL(10, 2),
    defaultValue: 0,
  },
  GeinheuresSup:{
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0,
  },
  Geins:{
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0,
  },
  Retenues:{
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0,
  },
  statut:{
    type: DataTypes.STRING,
    defaultValue: 'non publier',
  },
  bulletin_html:{
    type: DataTypes.TEXT('long'),
    allowNull: true   },

  archiver: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    validate: {
      isIn: [[0, 1, 2]],
    },
  },
 
 
}, {
  timestamps: true,
  tableName: 'JournalPaie',
});

export default JournalPaie;
