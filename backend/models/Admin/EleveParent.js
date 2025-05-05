import { DataTypes } from 'sequelize';
import db from '../../config/Database.js';
import Eleve from './Eleve.js';
import Parent from './Parent.js';

const EleveParent = db.define('EleveParent', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  EleveId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users', // TABLE "users" car Eleve et Parent partagent la même table
      key: 'id',
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  },  
  ParentId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users', // TABLE "users" car Eleve et Parent partagent la même table
      key: 'id',
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  },
}, {
  timestamps: false,
  tableName: 'EleveParents',
});

// Définition des relations avec les modèles Sequelize
// Eleve.belongsToMany(Parent, { through: EleveParent, foreignKey: 'EleveId' });
// Parent.belongsToMany(Eleve, { through: EleveParent, foreignKey: 'ParentId' });

// Définir les associations
Eleve.belongsToMany(Parent, { 
  through: EleveParent, 
  foreignKey: 'EleveId',
});

Parent.belongsToMany(Eleve, { 
  through: EleveParent, 
  foreignKey: 'ParentId',
});

// Association directe entre EleveParent et Eleve
EleveParent.belongsTo(Eleve, {
  foreignKey: 'EleveId',
});

EleveParent.belongsTo(Parent, {
  foreignKey: 'ParentId',
});

Eleve.hasMany(EleveParent, {
  foreignKey: 'EleveId',
});

Parent.hasMany(EleveParent, {
  foreignKey: 'ParentId',
});

export default EleveParent;
