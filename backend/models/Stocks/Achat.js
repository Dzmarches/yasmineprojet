// models/Achat.js
import { DataTypes } from 'sequelize';
import db from '../../config/Database.js';
import Article from './Article.js';
import Fournisseur from './Fournisseur.js'; // Assure-toi que ce modèle existe
import Categorie from './Categorie.js';

const Achat = db.define('Achat', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    categorieId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Categorie,
            key: 'id'
        }
    },
    articleId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    fournisseurId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    quantite: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    prix: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    devise: {
        type: DataTypes.STRING(10),
        allowNull: true
    },
    th: {
        type: DataTypes.FLOAT,
        allowNull: true,
    },
    tva: {
        type: DataTypes.FLOAT,
        allowNull: true,
    },
    unite: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    date_achat: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    date_peremption: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true,
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
    timestamps: true
});

// Associations
Achat.belongsTo(Article, { foreignKey: 'articleId' });
Achat.belongsTo(Fournisseur, { foreignKey: 'fournisseurId' });

Categorie.hasMany(Achat, { foreignKey: 'categorieId' });
Achat.belongsTo(Categorie, { foreignKey: 'categorieId' });

export default Achat;
