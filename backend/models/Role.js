import { DataTypes, Model } from 'sequelize';
import db from '../config/Database.js';
class Role extends Model {}

Role.init({
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, unique: true },
}, {
    sequelize: db,
    modelName: 'Role',
    tableName: 'roles',
    timestamps: true
});


export default Role;