import { Model, DataTypes } from "sequelize";
import db from "../../config/Database.js";
import User from "../User.js";
import Niveaux from "./Niveaux.js";
import Section from "./Section.js";

class Eleve extends User {}

Eleve.init(
  {
    nactnaiss: DataTypes.STRING,
    etat_social: DataTypes.STRING,
    antecedents: DataTypes.ENUM('Oui', 'Non'),
    antecedentsDetails: DataTypes.STRING,
    suiviMedical: DataTypes.ENUM('Oui', 'Non'),
    suiviMedicalDetails: DataTypes.STRING,
    natureTraitement: DataTypes.ENUM('Oui', 'Non'),
    natureTraitementDetails: DataTypes.STRING,
    crises: DataTypes.ENUM('Oui', 'Non'),
    crisesDetails: DataTypes.STRING,
    conduiteTenir: DataTypes.ENUM('Oui', 'Non'),
    conduiteTenirDetails: DataTypes.STRING,
    operationChirurgical: DataTypes.ENUM('Oui', 'Non'),
    operationChirurgicalDetails: DataTypes.STRING,
    maladieChronique: DataTypes.ENUM('Oui', 'Non'),
    maladieChroniqueDetails: DataTypes.STRING,
    dateInscription: DataTypes.DATE,
    autreecole: DataTypes.ENUM('Oui', 'Non'),
    nomecole: DataTypes.STRING,
    redoublant: DataTypes.ENUM('Oui', 'Non'),
    niveauredoublant: DataTypes.STRING,
    orphelin: DataTypes.ENUM('orpholinepère', 'orpholinemère', 'orpholinelesdeux', 'vivant'),
    niveaueleve: { type: DataTypes.STRING, allowNull: true},
    numinscription: { type: DataTypes.STRING, allowNull: false, unique: true },
    numidentnational: { type: DataTypes.STRING, allowNull: false, unique: true },
    datedinscriptionEncour: { type: DataTypes.DATE, allowNull: false },
    fraixinscription: { type: DataTypes.DECIMAL(10, 2), allowNull: true, defaultValue: 0.00 },
    groupeSanguin:{type: DataTypes.STRING, allowNull: true},
    photo: { type: DataTypes.STRING, allowNull: true },
    cycle: DataTypes.STRING,
    niveauId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'niveauxes', // Assurez-vous que c'est le bon nom de table
        key: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
    classeId: {
      type: DataTypes.INTEGER,
      allowNull: true, // Autorise NULL
      references: {
        model: 'Sections', // Assurez-vous que c'est le bon nom de table
        key: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },    
    archiver: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      validate: {
        isIn: [[0, 1, 2]],
      },
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users', // Assurez-vous que c'est le bon nom de table
        key: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
  },
  {
    sequelize: db,
    modelName: 'Eleve',
    timestamps: true,
    paranoid: true,
  }
);

// Associations
Eleve.belongsTo(User, { foreignKey: 'userId' });
User.hasOne(Eleve, { foreignKey: 'userId' });

Eleve.belongsTo(Niveaux, { foreignKey: 'niveauId' });
Niveaux.hasMany(Eleve, { foreignKey: 'niveauId', });

Eleve.belongsTo(Section, { foreignKey: 'classeId' });
Section.hasMany(Eleve, { foreignKey: 'classeId' });

export default Eleve;