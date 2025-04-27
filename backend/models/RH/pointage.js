import { DataTypes } from 'sequelize';
import sequelize from '../../config/Database.js';


const Pointage = sequelize.define('Pointage', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  statut: { type: DataTypes.STRING },
  heuresupP: { type: DataTypes.FLOAT },
  HeureEMP: { type: DataTypes.TIME, allowNull: true },
  HeureSMP: { type: DataTypes.TIME, allowNull: true },
  HeureEAMP: { type: DataTypes.TIME, allowNull: true },
  HeureSAMP: { type: DataTypes.TIME, allowNull: true },
  datedu: { type: DataTypes.DATE, allowNull: true },
  datea: { type: DataTypes.DATE, allowNull: true },
  justificationab: { type: DataTypes.STRING, allowNull: true },
  justificationret: { type: DataTypes.STRING, allowNull: true },
  date: { type: DataTypes.DATEONLY, allowNull: false },
  latlogEMP: { type: DataTypes.STRING, allowNull: true },
  latlogSMP: { type: DataTypes.STRING, allowNull: true },
  latlogEAMP: { type: DataTypes.STRING, allowNull: true },
  latlogSAMP: { type: DataTypes.STRING, allowNull: true },
  archiver: { type: DataTypes.INTEGER, defaultValue: 0 },
  type_pointage: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      len: [0, 15], 
    },
  },
//   ALTER TABLE pointages
// ADD COLUMN type_pointage VARCHAR(15) NULL;
  IdHeureSup: { 
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'heuressups',  
      key: 'id',
    },
    onUpdate: 'CASCADE',  
    onDelete: 'CASCADE',  
  },
  employe_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'employes',  
      key: 'id',
    },
    onUpdate: 'CASCADE',  
    onDelete: 'CASCADE',  
  },

}, {
  timestamps: true,
});

// (async () => {
//   const Employe = await import('../RH/employe.js');
  
//   Pointage.belongsTo(Employe.default, { 
//     foreignKey: 'employe_id', 
//     onDelete: 'CASCADE', 
//     onUpdate: 'CASCADE' 
//   });
// })();

export default Pointage;
