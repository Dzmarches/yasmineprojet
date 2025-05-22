import { Sequelize } from "sequelize";
import db from "../../config/Database.js";
import Ecole from "../Admin/Ecole.js";
import EcolePrincipal from "../EcolePrincipal.js";
import Sortie from "./sortie.js";

const { DataTypes } = Sequelize;

const EcoleSortie = db.define("EcoleSortie", {
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
  sortieId: { 
    type: DataTypes.INTEGER,
    references: {
      model: Sortie,
      key: "id",
    },
    onDelete: "CASCADE",
  }
}, {
  timestamps: false,
});

export default EcoleSortie;
