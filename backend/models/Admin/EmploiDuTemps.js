import { DataTypes } from 'sequelize';
import db from '../../config/Database.js';
import Enseignant from './Enseignant.js';
import Matiere from './Matiere.js';
import Section from './Section.js';
import Niveaux from './Niveaux.js';

const EmploiDuTemps = db.define('EmploiDuTemps', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    jour: {
        type: DataTypes.STRING,
        allowNull: false
    },
    heure: {
        type: DataTypes.STRING,
        allowNull: false
    },
    duree: {
        type: DataTypes.INTEGER, // Durée en minutes
        allowNull: false
    },
    niveauId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Niveaux,
            key: 'id'
        }
    },
    sectionId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Section,
            key: 'id'
        }
    },
    matiereId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Matiere,
            key: 'id'
        }
    },
    enseignantId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: Enseignant,
            key: 'id'
        }
    }
}, {
    timestamps: false,
    tableName: 'EmploiDuTemps'
});

export default EmploiDuTemps;