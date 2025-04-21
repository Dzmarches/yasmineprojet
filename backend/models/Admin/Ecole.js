import { Sequelize } from "sequelize";
import db from "../../config/Database.js";
import EcolePrincipal from '../EcolePrincipal.js';
const { DataTypes } = Sequelize;
// Définition du modèle 'Ecole'
const Ecole = db.define('Ecole', {
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
  siegesocial: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  nif: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  cycle:{
    type: DataTypes.STRING,
    allowNull: false,
  },
  ecoleId: {
    type: DataTypes.INTEGER,
    allowNull: true, // Rendre la colonne nullable
    references: {
      model: 'EcolePrincipals', // Nom de la table référencée
      key: 'id', // Colonne référencée
    },
    onDelete: 'SET NULL', // Compatible avec allowNull: true
    onUpdate: 'CASCADE',
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
});
export default Ecole;
