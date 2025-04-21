import { DataTypes } from 'sequelize';
import db from '../../config/Database.js';
import Salle from './Salle.js';
import Section from './Section.js';

const SalleSection = db.define('SalleSection', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  salleId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Salle,
      key: 'id',
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  },
  sectionId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Section,
      key: 'id',
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  },
  disponibilite: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  heure_debut: {
    type: DataTypes.TIME,
    allowNull: false,
  },
  heure_fin: {
    type: DataTypes.TIME,
    allowNull: false,
  }
}, {
  timestamps: false,
});

// Définir les relations
Salle.hasMany(SalleSection, { foreignKey: 'salleId' });
SalleSection.belongsTo(Salle, { foreignKey: 'salleId' });

Section.hasMany(SalleSection, { foreignKey: 'sectionId' });
SalleSection.belongsTo(Section, { foreignKey: 'sectionId' });

export default SalleSection;
