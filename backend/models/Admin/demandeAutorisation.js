
import { DataTypes } from 'sequelize';
import sequelize from '../../config/Database.js';
import moment from 'moment';
//ajouter importtaion du modele eleve

const DemandeAutorisation = sequelize.define('DemandeAutorisation', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
    type_demande: {
        type: DataTypes.STRING,
        allowNull: false, 
        validate: {
          notEmpty: {
            msg: 'Le type de demande est requis',
          },
        },
      },
      statut: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: 'En attente',
      },
      dateDebut: {
        type: DataTypes.DATE,
        allowNull: false, 
        validate: {
          notEmpty: {
            msg: 'La date de début est requise',
          },
          isDate: {
            msg: 'La date de début doit être une date valide',
          },
        },
      },
      dateFin: {
        type: DataTypes.DATE,
        allowNull: false, 
        validate: {
          notEmpty: {
            msg: 'La date de fin est requise',
          },
          isDate: {
            msg: 'La date de fin doit être une date valide',
          },
          isAfterStartDate(value) {
            if (value <= this.dateDebut) {
              throw new Error('La date de fin doit être postérieure à la date de début');
            }
          },
        },
      },
      commentaire: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      file: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      motif: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      RaisonA: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      archiver: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      // eleve_id: {
      //   type: DataTypes.INTEGER,
      //   allowNull: false, // L'ID de l'élève ne doit pas être vide
      //   validate: {
      //     notEmpty: {
      //       msg: "L'ID de l'élève est requis",
      //     },
      //   },
      // },
      eleve_id:{type:DataTypes.INTEGER}

  

    // eleve_id:{
    //   type: DataTypes.INTEGER,
    //   references: {
    //     model: 'eleves',
    //     key: 'id', 
    //   },
    // },
  
}, {
    timestamps: true, 

  });
  
// Définir les associations

// DemandeAutorisation.belongsTo(Eleve, { foreignKey: 'eleve_id' });
  
export default DemandeAutorisation;
