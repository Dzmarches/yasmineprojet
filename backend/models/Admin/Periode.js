import { DataTypes } from 'sequelize';
import db from '../../config/Database.js';

const Periode = db.define('Periode', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    cycleId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Cyclescolaires',
            key: 'id'
        }
    },
    type: {
        type: DataTypes.ENUM('matin', 'apres_midi', 'dejeuner'),
        allowNull: false
    },
    heureDebut: {
        type: DataTypes.TIME,
        allowNull: false
    },
    heureFin: {
        type: DataTypes.TIME,
        allowNull: false
    },
    sousPeriodes: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: []
    },label: {
        type: DataTypes.STRING,
        allowNull: true
    },
}, {
    timestamps: true,
    indexes: [
        {
            unique: true,
            fields: ['cycleId', 'type']
        }
    ]
});

export default Periode;