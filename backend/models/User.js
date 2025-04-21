// models/User.js
import { Model, DataTypes } from "sequelize";
import db from "../config/Database.js";

class User extends Model {}

User.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    nom: DataTypes.STRING,
    prenom: DataTypes.STRING,
    nom_ar: DataTypes.STRING,
    prenom_ar: DataTypes.STRING,
    datenaiss: DataTypes.DATE,
    lieuxnaiss: DataTypes.STRING,
    lieuxnaiss_ar: DataTypes.STRING,
    adresse: DataTypes.STRING,
    adresse_ar: DataTypes.STRING,
    sexe: DataTypes.STRING,
    telephone: DataTypes.STRING,
    email: DataTypes.STRING,
    nationalite: DataTypes.STRING,
    username: { type: DataTypes.STRING, unique: true },
    password: DataTypes.STRING,
    type: { type: DataTypes.STRING, allowNull: true },
    ecoleId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'EcolePrincipals',
        key: 'id',
      },
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
    },
    statuscompte: {
      type: DataTypes.STRING,
      allowNull: false, // Rendre ce champ obligatoire
      defaultValue: 'activer', // Valeur par défaut
      validate: {
        isIn: {
          args: [['activer', 'désactiver']],
          msg: "Le statut du compte doit être 'activer' ou 'désactiver'.",
        },
      },
    },
    dateAD:{
      type:DataTypes.DATE,
      allowNull: true, 
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
    // Nouveaux champs pour la dernière connexion
    lastLogin: DataTypes.DATE,
    lastIp: DataTypes.STRING,
    lastMac: DataTypes.STRING,
    lastLocation: DataTypes.STRING,
    latitude: DataTypes.FLOAT, // Nouveau champ pour la latitude
    longitude: DataTypes.FLOAT, // Nouveau champ pour la longitude
  },
  {
    sequelize: db,
    modelName: "User",
    tableName: "Users",
    timestamps: true,
    paranoid: true,
  }
);

export default User;