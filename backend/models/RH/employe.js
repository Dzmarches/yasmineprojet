
import { DataTypes } from 'sequelize';
import User from '../User.js';
import db from "../../config/Database.js";


class Employe extends User {}

 Employe.init( {

    id: { type: DataTypes.INTEGER,primaryKey: true,autoIncrement: true, },
    sitfamiliale:{type:DataTypes.STRING},
    nbrenfant:{type:DataTypes.INTEGER},

// Identifiants administratifs
    TypePI:{type:DataTypes.STRING},
    NumPI:{type:DataTypes.STRING},
    NumPC:{type:DataTypes.STRING},
    NumAS:{type:DataTypes.STRING},
  //Informations professionnelles
  poste:{
    type: DataTypes.INTEGER,
    references: {
      model: 'Postes', 
      key: 'id', 
    },
  },
  service:{ type: DataTypes.INTEGER,
    references: {
      model: 'Services', 
      key: 'id', 
    },},
    
  daterecru:{type:DataTypes.DATE,allowNull:false},
  NVTetudes: {type:DataTypes.STRING},
  Experience:{type:DataTypes.STRING},
  // SalairNeg:{type:DataTypes.FLOAT},
  SalairNeg:{ type: DataTypes.DECIMAL(10, 2)},
  TypeContrat:{type:DataTypes.STRING},
  DateFinContrat:{type:DataTypes.DATE,allowNull: true},
  Remarque:{type:DataTypes.STRING},
  HeureEM:{type:DataTypes.TIME,allowNull:false},
  HeureSM:{type:DataTypes.TIME,allowNull:false},
  HeureEAM:{type:DataTypes.TIME,allowNull:false},
  HeureSAM:{type:DataTypes.TIME,allowNull:false},
  nbrJourTravail:{type:DataTypes.INTEGER,allowNull:false},
  nbrHeureLegale:{type: DataTypes.DECIMAL(8,2),allowNull:false},
  Typepai:{type:DataTypes.STRING},
  Numpai:{type:DataTypes.STRING},
  CE:{type:DataTypes.STRING},
  archiver:{type:DataTypes.INTEGER,defaultValue:0},
  photo:{type:DataTypes.STRING,allowNull:true},
  userId: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Users',
      key: 'id',
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  },
  declaration:{
    type:DataTypes.BOOLEAN,
    defaultValue:0,
  },
  abattement:{
    type: DataTypes.STRING,
    defaultValue:'non',
  },
  dateabt:{
    type: DataTypes.DATE,
    allowNull:true,
  },
  tauxabt:{
    type: DataTypes.FLOAT,
    allowNull:true,
    defaultValue:0,
  },
  notify:{
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  }
},

{
  sequelize: db,
  modelName: 'Employe',
  tableName: 'Employes',
  timestamps: true,
  paranoid: true,
}
);
  
  export default Employe;
