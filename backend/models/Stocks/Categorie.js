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
    date_creation: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    date_modification: {
        type: DataTypes.DATE,
        allowNull: true
    },
    magasin: {
        type: DataTypes.STRING,
        allowNull: false
    },
    archiver: { 
        type: DataTypes.INTEGER,
        defaultValue: 0, 
        validate: {
          isIn: {
            args: [[0, 1, 2]], 
            msg: "La valeur de 'archiver' doit être 0, 1 ou 2."
          }
        }
    }
}, {
    timestamps: false
});

export default Categorie;
