import { Model, DataTypes } from 'sequelize';
import db from '../config/Database.js';

class UserRole extends Model {}

UserRole.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true, // Colonne `id` auto-incrémentée
    },
    userId: {
        type: DataTypes.INTEGER,
        references: {
            model: 'Users',
            key: 'id',
        },
    },
    roleId: {
        type: DataTypes.INTEGER,
        references: {
            model: 'roles',
            key: 'id',
        },
    },
    permissionId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'permissions',
            key: 'id',
        },
    },
}, {
    sequelize: db,
    modelName: 'UserRole',
    tableName: 'user_roles',
    timestamps: false,
});

export default UserRole;