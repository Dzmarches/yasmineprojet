import { DataTypes } from 'sequelize';
import db from '../../config/Database.js';

const Categorie = db.define('Categorie', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    code_categorie: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    libelle: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    actif: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    date_creation: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    date_modification: {
        type: DataTypes.DATE,
        allowNull: true
    },
}, {
    timestamps: false
});

export default Categorie;
