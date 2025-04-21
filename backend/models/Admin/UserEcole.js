// models/UserEcole.js
import { Sequelize } from "sequelize";
import db from "../../config/Database.js";

const { DataTypes } = Sequelize;

const UserEcole = db.define('UserEcole', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: true, // Permettre à ecoleeId d'être null
    references: {
      model: 'Users',
      key: 'id',
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  },
  ecoleeId: {
    type: DataTypes.INTEGER,
    allowNull: true, // Permettre à ecoleeId d'être null
    references: {
      model: 'Ecoles',
      key: 'id',
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  },
}, {
  timestamps: false,
});

export default UserEcole;
