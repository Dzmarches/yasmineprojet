import { Sequelize } from "sequelize";
import db from "../config/Database.js";

const { DataTypes } = Sequelize;

// Définition du modèle 'EcolePrincipal'
const EcolePrincipal = db.define('EcolePrincipals', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nomecole: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  nom_arecole: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  logo: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  adresse: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  emailecole: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  telephoneecole: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  // type: {
  //   type: DataTypes.STRING,
  //   allowNull: true,
  // },
  maps: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  fix: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  facebook: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  insta: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  linkdin: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  rc: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  rib: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  // siegesocial: {
  //   type: DataTypes.STRING,
  //   allowNull: true,
  // },
  nif: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  numerodagrimo:{
    type: DataTypes.STRING,
    allowNull: false,
  },
  dateFinDagrimo:{
    type: DataTypes.DATE,
    allowNull: false,
  },
  archiver: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    validate: {
      isIn: {
        args: [[0, 1, 2]],
        msg: "La valeur de 'archiver' doit être 0, 1 ou 2.",
      },
    },
  },
}, {
  timestamps: false,
})

export default EcolePrincipal;
