import { Sequelize } from "sequelize";
import db from "../../config/Database.js";
import Ecole from "./Ecole.js";
import Matiere from "./Matiere.js";
import EcolePrincipal from "../EcolePrincipal.js";

const { DataTypes } = Sequelize;

const EcoleMatiere = db.define("EcoleMatiere", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  ecoleId: {  // Clé étrangère pour EcolePrincipal
    type: DataTypes.INTEGER,
    references: {
      model: EcolePrincipal,
      key: "id",
    },
    onDelete: "CASCADE",
  },
  ecoleeId: {  // Clé étrangère pour Ecole
    type: DataTypes.INTEGER,
    allowNull: true, // Permettre à ecoleeId d'être null
    references: {
      model: Ecole,
      key: "id",
    },
    onDelete: "CASCADE",
  },
  matiereId: {  // Clé étrangère pour Niveaux
    type: DataTypes.INTEGER,
    references: {
      model: Matiere,
      key: "id",
    },
    onDelete: "CASCADE",
  }
}, {
  timestamps: false,
});

export default EcoleMatiere;
