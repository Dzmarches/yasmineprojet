import { Sequelize } from "sequelize";
import db from "../../config/Database.js";
import Ecole from "./Ecole.js";
import EcolePrincipal from "../EcolePrincipal.js";
import Remarque from "./Remarque.js";

const { DataTypes } = Sequelize;

const EcoleRemarque = db.define("EcoleRemarque", {
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
  remarqueId: {  // Clé étrangère pour Niveaux
    type: DataTypes.INTEGER,
    references: {
      model: Remarque,
      key: "id",
    },
    onDelete: "CASCADE",
  }
}, {
  timestamps: false,
});

export default EcoleRemarque;
