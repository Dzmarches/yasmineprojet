// models/Admin/Presence.js
import { DataTypes } from 'sequelize';
import db from '../../config/Database.js';

const Presence = db.define('Presence', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    eleveId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'eleves',
            key: 'id'
        }
    },
    enseignantId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'enseignants',
            key: 'id'
        }
    },
    date: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    matin: {
        type: DataTypes.ENUM('present', 'retard', 'absent'),
        allowNull: false,
        defaultValue: 'present'
    },
    apres_midi: {
        type: DataTypes.ENUM('present', 'retard', 'absent'),
        allowNull: false,
        defaultValue: 'present'
    },
    heure: {
        type: DataTypes.TIME,
        allowNull: true,
    },
    justificationMatin: {
        type: DataTypes.STRING,
        allowNull: true
    },
    justificationApresMidi: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, {
    timestamps: true,
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    indexes: [
        {
            unique: true,
            fields: ['eleveId', 'date']
        }
    ]
});

// Importations dynamiques
import('./Eleve.js').then(({ default: Eleve }) => {
    Eleve.hasMany(Presence, { foreignKey: 'eleveId', as: 'presences' });
    Presence.belongsTo(Eleve, { foreignKey: 'eleveId', as: 'eleve' });
});

import('./Enseignant.js').then(({ default: Enseignant }) => {
    Enseignant.hasMany(Presence, { foreignKey: 'enseignantId', as: 'presencesEnseignant' });
    Presence.belongsTo(Enseignant, { foreignKey: 'enseignantId', as: 'enseignant' });
});

export default Presence;