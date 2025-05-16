import { Sequelize } from "sequelize";
import db from "../../config/Database.js";
import Ecole from "../Admin/Ecole.js";
import EcolePrincipal from "../EcolePrincipal.js";
import Fournisseur from "./Fournisseur.js";

const { DataTypes } = Sequelize;

const EcoleFournisseur = db.define("EcoleFournisseur", {
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
  fournisseurId: { 
    type: DataTypes.INTEGER,
    references: {
      model: Fournisseur,
      key: "id",
    },
    onDelete: "CASCADE",
  }
}, {
  timestamps: false,
});

export default EcoleFournisseur;
