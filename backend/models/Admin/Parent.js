// models/Parent.js
import { DataTypes } from 'sequelize';
import User from '../User.js';
import db from '../../config/Database.js';

class Parent extends User {}

Parent.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    // emailparent: { type: DataTypes.STRING, allowNull: false, validate: { isEmail: true } },
    emailparent: { type: DataTypes.STRING, allowNull: true },
    telephoneparent: { type: DataTypes.STRING, allowNull: true },
    travailleparent: { type: DataTypes.STRING, allowNull: true },
    situation_familiale: { 
      type: DataTypes.ENUM('Marié', 'Divorcé', 'Célibataire', 'Mariée', 'Divorcée',''), 
      allowNull: true 
    },
    nombreenfant: { type: DataTypes.INTEGER, allowNull: true },
    typerole: { type: DataTypes.ENUM('Père', 'Mère', 'Tuteur'), allowNull: true },
    archiver: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      validate: {
        isIn: [[0, 1, 2]],
      },
    },
  },
  {
    sequelize: db,
    modelName: 'Parent',
    timestamps: true,
    paranoid: true,
  }
);

export default Parent;
