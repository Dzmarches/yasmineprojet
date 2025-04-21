import { Model, DataTypes } from "sequelize";
import db from "../config/Database.js";

class Permission extends Model {}

Permission.init({
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, unique: true },
}, { 
  sequelize: db,
  modelName: 'Permission', 
  tableName: 'permissions', 
  timestamps: true 
});

export default Permission;
