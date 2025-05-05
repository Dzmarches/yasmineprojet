import { DataTypes } from 'sequelize';
import db from '../../config/Database.js';
import Anneescolaire from './Anneescolaires.js';
import Trimest from './Trimest.js';
import Niveaux from './Niveaux.js';
import Matiere from './Matiere.js';
import User from '../User.js';
import Section from './Section.js';
import PeriodeNote from './periodenote.js';
import TravailRendu from './TravailRendu.js';

const Devoire = db.define('Devoire', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    enseignantId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id',
        }
    },
    matiereId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Matiere,
            key: 'id',
        }
    },
    niveauId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Niveaux,
            key: 'id',
        }
    },
    sectionId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'sections',
            key: 'id',
        }
    },
    annescolaireId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Anneescolaire,
            key: 'id',
        }
    },
    trimestId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Trimest,
            key: 'id',
        }
    },
    titre: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.STRING,
        allowNull: true
    },
    dateLimite: {
        type: DataTypes.DATE,
        allowNull: false
    },
    fichier: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    timestamps: true,
    indexes: [
        {
            unique: true,
            fields: ['sectionId', 'annescolaireId', 'trimestId'],
            name: 'idx_section_annee_trim'
        }
    ]
});


export default Devoire;