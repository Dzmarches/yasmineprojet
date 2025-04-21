import { Sequelize } from "sequelize";
import db from "../../config/Database.js";
import Ecole from "./Ecole.js";
import Niveaux from "./Niveaux.js";
import EcolePrincipal from "../EcolePrincipal.js";

const { DataTypes } = Sequelize;

const EcoleNiveau = db.define("EcoleNiveau", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  ecoleId: {  // Clé étrangère pour EcolePrincipal
    type: DataTypes.INTEGER,
    references: {
      model: "EcolePrincipals",
      key: "id",
    },
    onDelete: "CASCADE",
  },
  ecoleeId: {  // Clé étrangère pour Ecole
    type: DataTypes.INTEGER,
    allowNull: true, // Permettre à ecoleeId d'être null
    references: {
      model: "Ecoles",
      key: "id",
    },
    onDelete: "CASCADE",
  },
  niveauId: {  // Clé étrangère pour Niveaux
    type: DataTypes.INTEGER,
    references: {
      model: "Niveaux",
      key: "id",
    },
    onDelete: "CASCADE",
  },
  archiver: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    validate: {
      isIn: {
        args: [[0, 1, 2]],
        msg: "La valeur de 'archiver' doit être 0, 1 ou 2."
      }
    }
  },
}, {
  timestamps: false,
});

export default EcoleNiveau;
