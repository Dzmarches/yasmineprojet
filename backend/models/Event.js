import { DataTypes } from 'sequelize';
import db from "../config/Database.js";

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
}, {
    timestamps: true, // Active createdAt et updatedAt
});

export default Event;
