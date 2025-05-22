import { DataTypes } from 'sequelize';
import db from "../config/Database.js";
import EcolePrincipal from './EcolePrincipal.js';
import Ecole from './Admin/Ecole.js';

const Event = db.define('Event', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    start: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    allDay: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
    },
    backgroundColor: {
        type: DataTypes.STRING,
        defaultValue: '#ff0000',
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
}, {
    timestamps: true, // Active createdAt et updatedAt
});

export default Event;
