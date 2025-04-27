import { DataTypes } from 'sequelize';
import Employe from '../RH/employe.js';
import db from '../../config/Database.js';

class Enseignant extends Employe { }

Enseignant.init(
  {
    id: { type: DataTypes.INTEGER,primaryKey: true,autoIncrement: true, },
    npe: { type: DataTypes.STRING, allowNull: false },
    pfe: { type: DataTypes.STRING, allowNull: false },
    ddn: { type: DataTypes.DATE, allowNull: true },
    ninn: { type: DataTypes.STRING },
    archiver: { type: DataTypes.INTEGER, defaultValue: 0 },
    disponibilites: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: {
        lundi: { disponible: false, heures: [] },
        mardi: { disponible: false, heures: [] },
        mercredi: { disponible: false, heures: [] },
        jeudi: { disponible: false, heures: [] },
        vendredi: { disponible: false, heures: [] },
        samedi: { disponible: false, heures: [] },
        dimanche: { disponible: false, heures: [] }
      }
    },
    employe_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'employes',
        key: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
  },
  {
    sequelize: db,
    modelName: 'Enseignant',
    tableName: 'Enseignants',
    timestamps: true,
    paranoid: true,
  }
);


export default Enseignant;
