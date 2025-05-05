import { DataTypes } from 'sequelize';
import db from '../../config/Database.js';
import Devoire from './Devoire.js';
import Eleve from './Eleve.js';

const TravailRendu = db.define('TravailRendu', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    devoirId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'Devoires', // nom exact du modèle dans la base
            key: 'id',
        }
    },
    eleveId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Eleve,
            key: 'id',
        }
    },
    fichier: {
        type: DataTypes.STRING,
        allowNull: false
    },
    dateSoumission: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    note: {
        type: DataTypes.FLOAT,
        allowNull: true
    },
    commentaire: {
        type: DataTypes.TEXT,
        allowNull: true
    }
});

export default TravailRendu;