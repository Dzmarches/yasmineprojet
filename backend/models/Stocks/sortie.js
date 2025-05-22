// models/Sortie.js

import { DataTypes } from 'sequelize';
import db from '../../config/Database.js';
import Employe from '../RH/employe.js';
import Article from './Article.js';


const Sortie = db.define('Sortie', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    employeId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Employe,
            key: 'id'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    },
    articleId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Article,
            key: 'id'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    },
    quantite: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    nomcomplet: {
        type: DataTypes.STRING,
        allowNull: true
    },
    date_sortie: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
    magasin: {
        type: DataTypes.STRING,
        allowNull: true
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
    tableName: 'Sorties',
    timestamps: true
});


// Définir les associations
Sortie.associate = () => {
    Sortie.belongsTo(Employe, {
        foreignKey: 'employeId',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    });
    Employe.hasMany(Sortie, {
        foreignKey: 'employeId'
    });
    Sortie.belongsTo(Article, {
        foreignKey: 'articleId',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    });
    Article.hasMany(Sortie, {
        foreignKey: 'articleId'
    });
};
// Appeler les associations après la définition des modèles
Sortie.associate();
export default Sortie;
