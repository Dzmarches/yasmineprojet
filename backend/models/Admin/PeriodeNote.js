import { DataTypes } from "sequelize";
import db from '../../config/Database.js';
import EcolePrincipal from '../EcolePrincipal.js';
import Ecole from './Ecole.js';

const PeriodeNote = db.define('PeriodeNote', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    status: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    dateDebutPeriode: {
        type: DataTypes.DATE,
        allowNull: true
    },
    dateFinPeriode: {
        type: DataTypes.DATE,
        allowNull: true
    },
    ecoleId: {  // Clé étrangère vers EcolePrincipal
        type: DataTypes.INTEGER,
        references: {
            model: EcolePrincipal,
            key: "id",
        },
        onDelete: "CASCADE",
    },
    ecoleeId: {  // Clé étrangère vers Ecole
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: Ecole,
            key: "id",
        },
        onDelete: "CASCADE",
    },
}, {
    timestamps: true,
    // L'index sur `niveauId` n'a pas de champ défini dans ce modèle. À corriger si nécessaire.
});

/// 📌 Associations
PeriodeNote.belongsTo(EcolePrincipal, {
    foreignKey: 'ecoleId',
    as: 'ecolePrincipal'
});

PeriodeNote.belongsTo(Ecole, {
    foreignKey: 'ecoleeId',
    as: 'ecole'
});

// Tu peux aussi faire les relations inverses :
EcolePrincipal.hasMany(PeriodeNote, {
    foreignKey: 'ecoleId',
    as: 'periodesNotes'
});

Ecole.hasMany(PeriodeNote, {
    foreignKey: 'ecoleeId',
    as: 'periodesEcole'
});

export default PeriodeNote;
