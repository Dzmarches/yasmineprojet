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
    ecoleId: {
        type: DataTypes.INTEGER,
        references: {
            model: EcolePrincipal,
            key: "id",
        },
        onDelete: "CASCADE",
    },
    ecoleeId: {
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
    hooks: {
        beforeSave: async (periode) => {
            // Vérifier si la date de fin est dépassée
            if (periode.dateFinPeriode && new Date() > new Date(periode.dateFinPeriode)) {
                periode.status = false;
            }
        }
    }
});

// Associations
PeriodeNote.belongsTo(EcolePrincipal, {
    foreignKey: 'ecoleId',
    as: 'ecolePrincipal'
});

PeriodeNote.belongsTo(Ecole, {
    foreignKey: 'ecoleeId',
    as: 'ecole'
});

EcolePrincipal.hasMany(PeriodeNote, {
    foreignKey: 'ecoleId',
    as: 'periodesNotes'
});

Ecole.hasMany(PeriodeNote, {
    foreignKey: 'ecoleeId',
    as: 'periodesEcole'
});

// Méthode pour vérifier et mettre à jour les périodes expirées
PeriodeNote.checkAndUpdateExpiredPeriods = async function() {
    try {
        await this.update(
            { status: false },
            {
                where: {
                    status: true,
                    dateFinPeriode: { [db.Sequelize.Op.lt]: new Date() }
                }
            }
        );
    } catch (error) {
        console.error('Error updating expired periods:', error);
    }
};

export default PeriodeNote;