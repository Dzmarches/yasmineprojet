import { DataTypes } from 'sequelize';
import db from '../../config/Database.js';
import Categorie from './Categorie.js';

const Article = db.define('Article', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    code_article: {
        type: DataTypes.STRING,
        allowNull: false
    },
    libelle: {
        type: DataTypes.STRING,
        allowNull: false
    },
    magasin: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    categorieId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Categorie,
            key: 'id'
        }
    },
    date_creation: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
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
    timestamps: false,
    indexes: [
        {
            unique: true,
            fields: ['code_article', 'libelle']
        }
    ]
});

// Association
Categorie.hasMany(Article, { foreignKey: 'categorieId' });
Article.belongsTo(Categorie, { foreignKey: 'categorieId' });

export default Article;
