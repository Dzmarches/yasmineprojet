import bcrypt from 'bcrypt';
import Employe from "../../models/RH/employe.js";
import Poste from '../../models/RH/poste.js';
import Enseignant from '../../models/Admin/Enseignant.js';
import Pointage from '../../models/RH/pointage.js'
import sequelize from '../../config/Database.js'; // Importez l'instance de Sequelize
import Service from '../../models/RH/service.js';
import joi from 'joi';
import jwt from 'jsonwebtoken'
import { Op } from 'sequelize';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs'
import User from '../../models/User.js';
import Role from '../../models/Role.js';
import UserRole from '../../models/UserRole.js';
import UserEcole from '../../models/Admin/UserEcole.js';
import EcolePrincipal from '../../models/EcolePrincipal.js'
import Ecole from '../../models/Admin/Ecole.js';
import EnseignantClasse from '../../models/Admin/EnseignantClasse.js';
import Matiere from '../../models/Admin/Matiere.js';
import Section from '../../models/Admin/Section.js';
import Niveaux from '../../models/Admin/Niveaux.js';
import EmploiDuTemps from '../../models/Admin/EmploiDuTemps.js';


// Convertir l'URL du module en chemin de fichier
const __filename = fileURLToPath(import.meta.url);
// Obtenir le répertoire du fichier
const __dirname = path.dirname(__filename)
// import { UPDATE } from 'sequelize/lib/query-types';
const { UPDATE } = sequelize.QueryTypes;


// controllers/Admin/EnseignantController.js
export const getEmploiDuTempsEnseignant = async (req, res) => {
  try {
      const { enseignantId } = req.params;
      
      const emploiDuTemps = await EmploiDuTemps.findAll({
          where: { enseignantId },
          include: [
              {
                  model: Matiere,
                  attributes: ['id', 'nom']
              },
              {
                  model: Section,
                  attributes: ['id', 'classe']
              },
              {
                  model: Niveaux,
                  attributes: ['id', 'nomniveau']
              }
          ],
          order: [
              ['jour', 'ASC'],
              ['heure', 'ASC']
          ]
      });

      if (!emploiDuTemps || emploiDuTemps.length === 0) {
          return res.status(404).json({ message: "Aucun emploi du temps trouvé pour cet enseignant" });
      }

      res.status(200).json(emploiDuTemps);
  } catch (error) {
      console.error("Erreur lors de la récupération de l'emploi du temps:", error);
      res.status(500).json({ 
          message: "Erreur serveur", 
          error: error.message 
      });
  }
};


export const getDisponibilites = async (req, res) => {
  try {
    const { ecoleId, ecoleeId, roles } = req.user;
    const isAdminPrincipal = roles.includes('AdminPrincipal');

    // Définir les options de base pour la requête
    const baseOptions = {
      include: [
        {
          model: Employe,
          include: [
            {
              model: User,
              attributes: ['id', 'nom', 'prenom', 'nom_ar', 'prenom_ar'],
              where: { archiver: 0 },
              include: []
            }
          ],
          required: true
        }
      ],
      paranoid: false
    };

    // Ajouter le filtre d'école selon le rôle
    if (isAdminPrincipal) {
      // Pour AdminPrincipal, on inclut le filtre sur EcolePrincipal
      baseOptions.include[0].include[0].include.push({
        model: EcolePrincipal,
        where: { id: ecoleId }
      });
    } else {
      // Pour Admin normal, on filtre sur Ecole
      baseOptions.include[0].include[0].include.push({
        model: Ecole,
        where: { id: ecoleeId },
        through: { attributes: [] } // Si vous utilisez une table de jointure
      });
    }

    const enseignants = await Enseignant.findAll(baseOptions);

    if (!enseignants || enseignants.length === 0) {
      return res.status(404).json({ 
        message: `Aucun enseignant trouvé pour ${isAdminPrincipal ? 'cette école principale' : 'cette école'}`
      });
    }

    // Formater les données pour le frontend
    const formattedEnseignants = enseignants.map(ens => ({
      id: ens.id,
      Employe: {
        User: ens.Employe?.User,
        // ... autres propriétés nécessaires
      },
      disponibilites: ens.disponibilites || {}
    }));

    res.status(200).json(formattedEnseignants);
  } catch (error) {
    console.error('Erreur dans getDisponibilites:', {
      message: error.message,
      stack: error.stack,
      user: req.user
    });
    res.status(500).json({ 
      message: "Erreur serveur",
      error: error.message
    });
  }
};

export const ListeEmploye = async (req, res) => {
  try {
    const { poste } = req.query; // Récupérer le poste depuis les paramètres de la requête
    const ecoleId = req.user.ecoleId;
    const ecoleeId = req.user.ecoleeId;
    const roles = req.user.roles;
    const isAdminPrincipal = roles.includes('AdminPrincipal');
    let listeEmployes;

    if (isAdminPrincipal) {
      listeEmployes = await Employe.findAll({
        where: { archiver: 0 },
        include: [
          {
            model: User,
            required: true,
            include: [
              { model: EcolePrincipal, where: { id: ecoleId } },
              { model: Ecole, through: UserEcole }
            ]
          },
          {
            model: Poste,
            where: { poste: { [Op.eq]: poste || 'Enseignant' } }, // Utiliser le poste dynamique
            attributes: ['poste']
          },
          { model: Service, attributes: ['service'] }
        ]
      });
    } else {
      listeEmployes = await Employe.findAll({
        where: { archiver: 0 },
        include: [
          {
            model: User,
            where: { ecoleId: ecoleId },
            include: [
              { model: EcolePrincipal },
              { model: Ecole, where: { id: ecoleeId }, through: UserEcole }
            ]
          },
          {
            model: Poste,
            where: { poste: { [Op.eq]: poste || 'Enseignant' } }, // Utiliser le poste dynamique
            attributes: ['poste']
          },
          { model: Service, attributes: ['service'] }
        ]
      });
    }

    if (!listeEmployes || listeEmployes.length === 0) {
      return res.status(404).json({ message: `Pas d'employés avec le poste '${poste || 'Enseignant'}'` });
    }

    return res.status(200).json(listeEmployes);

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Erreur serveur" });
  }
};


export const ProfileEmploye = async (req, res) => {
  try {
    const { id } = req.params;

    const profilEmploye = await Employe.findOne({
      where: { id },
      include: [
        { model: User },
        { model: Poste, attributes: ['id', 'poste'] },
        { model: Service, attributes: ['id', 'service'] },
        {
          model: Enseignant,
          include: [{
            model: EnseignantClasse,
            include: [
              {
                model: Matiere,
                attributes: ['id', 'nom'],
              },
              {
                model: Section,
                attributes: ['id', 'classe'],
              },
              {
                model: Niveaux,
                attributes: ['id', 'nomniveau'],
              }
            ],
            as: 'EnseignantClasses' // Ajoutez cette ligne
          }],
          as: 'Enseignant' // Ajoutez cette ligne
        }
      ],
    });

    if (!profilEmploye) {
      return res.status(404).json({ message: "Employé non trouvé" });
    }

    // Formattez les données pour le frontend
    const responseData = {
      ...profilEmploye.get({ plain: true }),
      enseignantClasses: profilEmploye.Enseignant?.EnseignantClasses?.map(ec => ({
        matiere: ec.Matiere,
        section: ec.Section,
        niveau: ec.Niveaux // Doit correspondre à l'alias défini
      })) || []
    };

    console.log('Enseignant:', profilEmploye.Enseignant);
    console.log('EnseignantClasses:', responseData);

    return res.status(200).json(responseData);

  } catch (error) {
    console.error("Erreur lors de la récupération du profil :", error);
    return res.status(500).json({ message: "Erreur serveur" });
  }
};
//archiver employe

// export const ArchiverE = async (req, res) => {
//   const { id } = req.params;

//   try {

//     const findEmploye = await Employe.findByPk(id);
//     if (!findEmploye) {
//       return res.status(404).json({ message: 'Employé non trouvé.' });
//     }
//     const [updatedEmploye] = await Employe.update(
//       { archiver: 1 }, 
//       { where: { id } } 
//     );

//     const [updatedUser] = await User.update(
//       { archiver: 1 },
//       { where: { id: findEmploye.userId } }
//     );

//     // Vérifier si les mises à jour ont réussi
//     if (updatedEmploye > 0 && updatedUser > 0) {
//       // Récupérer l'employé mis à jour pour le renvoyer dans la réponse
//       const archivedEmploye = await Employe.findByPk(id, {
//         include: [{ model: User }],
//       });

//       return res.status(200).json({
//         message: 'Employé et utilisateur archivés avec succès.',
//         data: archivedEmploye,
//       });
//     } else {
//       return res.status(404).json({ message: 'Aucun enregistrement mis à jour.' });
//     }
//   } catch (error) {
//     console.error('Erreur lors de l\'archivage :', error);
//     return res.status(500).json({ message: 'Erreur serveur lors de l\'archivage.', error: error.message });
//   }
// };

export const ArchiverE = async (req, res) => {
  try {
    const { id } = req.params;

    const [updated] = await Employe.update(
      { archiver: 1 },
      { where: { id } }
    );

    if (updated) {
      const updatedEmploye = await Employe.findByPk(id)
        ;
      // console.log(updatedEmploye);
      return res.status(200).json(updatedEmploye);
    } else {
      return res.status(404).json({ message: 'Employé non trouvé.' });
    }
  } catch (error) {
    console.error(error);

  }

}

export const ModifierEmploye = async (req, res) => {
  const { id } = req.params;
  const transaction = await sequelize.transaction();
  const file = req.file;

  try {
    const existingEmploye = await Employe.findByPk(id);
    if (!existingEmploye) {
      return res.status(404).json({ message: "Employé non trouvé" });
    }

    const existingUserEmploye = await User.findByPk(existingEmploye.userId);
    if (!existingUserEmploye) {
      return res.status(404).json({ message: "User non trouvé" });
    }

    const {
      nom, prenom, nom_arabe, prenom_arabe, datenaiss, tel, mail, user,
      nationalite, sexe, Lieunais, lieunaisArabe, sitfamiliale, nbrenfant, adresse,
      TypePI, NumPI, NumPC, NumAS, poste, service, daterecru, NVTetudes, Experience,
      Typepai, SalairNeg, TypeContrat, DateFinContrat, Remarque, HeureEM, HeureSM,
      HeureEAM, HeureSAM, CE, npe, pfe, ddn, ninn, adresse_ar, pwd, disponibilites
    } = req.body;

    const existingUser = await User.findOne({
      where: {
        username: user,
        id: { [Op.ne]: existingUserEmploye.id }
      }
    });
    if (existingUser) {
      return res.status(400).json({ message: "Le nom d'utilisateur est déjà utilisé" });
    }

    const updatedUserData = {
      nom,
      prenom,
      nom_ar: nom_arabe,
      prenom_ar: prenom_arabe,
      datenaiss,
      lieuxnaiss: Lieunais,
      lieuxnaiss_ar: lieunaisArabe,
      adresse,
      adresse_ar,
      sexe,
      telephone: tel,
      email: mail,
      nationalite,
      username: user,
      type: "Employé",
      ecoleId: existingUserEmploye.ecoleId,
    };

    if (pwd) {
      updatedUserData.password = await bcrypt.hash(pwd, 10);
    }

    await existingUserEmploye.update(updatedUserData, { transaction });

    const updatedEmployeData = {
      sitfamiliale,
      nbrenfant,
      TypePI,
      NumPI,
      NumPC,
      NumAS,
      poste,
      service,
      daterecru,
      NVTetudes,
      Experience,
      SalairNeg,
      Typepai,
      TypeContrat,
      DateFinContrat,
      Remarque,
      HeureEM,
      HeureSM,
      HeureEAM,
      HeureSAM,
      CE,
    };

    if (file) {
      updatedEmployeData.photo = `/images/employes/${file.filename}`;
    }

    await existingEmploye.update(updatedEmployeData, { transaction });

    const findPoste = await Poste.findByPk(poste);
    if (findPoste && findPoste.poste === 'Enseignant') {
      const enseignantData = {
        npe,
        pfe,
        ddn: ddn ? new Date(ddn) : null,
        ninn,
        disponibilites: disponibilites ? JSON.parse(disponibilites) : null
      };

      let enseignant = await Enseignant.findOne({ where: { employe_id: id } });

      if (enseignant) {
        await enseignant.update(enseignantData, { transaction });
      } else {
        enseignant = await Enseignant.create(
          { ...enseignantData, employe_id: existingEmploye.id },
          { transaction }
        );
      }

      // Récupération des IDs
      const matieresIds = JSON.parse(req.body.matieresIds || '[]');
      const sectionsIds = JSON.parse(req.body.sectionsIds || '[]');
      const niveauIds = JSON.parse(req.body.niveauIds || '[]');

      // Suppression des anciennes entrées
      await EnseignantClasse.destroy({
        where: { enseignantId: enseignant.id },
        transaction,
      });

      // Création des nouvelles entrées avec bulkCreate
      const nouvellesEntrees = [];
      for (const matiereId of matieresIds) {
        for (const classeId of sectionsIds) {
          for (const niveauId of niveauIds) {
            nouvellesEntrees.push({
              enseignantId: enseignant.id,
              matiereId,
              classeId,
              niveauId,
            });
          }
        }
      }

      if (nouvellesEntrees.length > 0) {
        await EnseignantClasse.bulkCreate(nouvellesEntrees, { transaction });
      }
    }

    await transaction.commit();

    return res.status(200).json({
      message: 'Employé modifié avec succès !',
      employe: { id: existingEmploye.id },
    });

  } catch (error) {
    await transaction.rollback();
    console.error("Erreur lors de la modification :", error);
    return res.status(500).json({
      message: "Erreur serveur lors de la modification",
      error: error.message
    });
  }
};


// export const ModifierEmploye = async (req, res) => {
//   const { id } = req.params;
//   const transaction = await sequelize.transaction();
//   const file = req.file;

//   try {
//     const existingEmploye = await Employe.findByPk(id);
//     if (!existingEmploye) {
//       return res.status(404).json({ message: "Employé non trouvé" });
//     }

//     const existingUserEmploye = await User.findByPk(existingEmploye.userId);
//     if (!existingUserEmploye) {
//       return res.status(404).json({ message: "User non trouvé" });
//     }

//     // Extraction des données
//     const {
//       nom, prenom, nom_arabe, prenom_arabe, datenaiss, tel, mail, user,
//       nationalite, sexe, Lieunais, lieunaisArabe, sitfamiliale, nbrenfant, adresse,
//       TypePI, NumPI, NumPC, NumAS, poste, service, daterecru, NVTetudes, Experience,
//       Typepai, SalairNeg, TypeContrat, DateFinContrat, Remarque, HeureEM, HeureSM,
//       HeureEAM, HeureSAM, CE, npe, pfe, ddn, ninn, adresse_ar, pwd,
//     } = req.body;

//     // Vérification si le nom d'utilisateur existe déjà (sauf pour l'employé actuel)
//     const existingUser = await User.findOne({ where: { username: user, id: { [Op.ne]: existingUserEmploye.id } }});
//     if (existingUser) {
//       return res.status(400).json({ message: "Le nom d'utilisateur est déjà utilisé" });
//     }

//     // Si le mot de passe est fourni, le hacher
//     let hashedPassword;
//     if (pwd) {
//       hashedPassword = await bcrypt.hash(pwd, 10);
//     }

//     const updatedUserData = {
//       nom,
//       prenom,
//       nom_ar: nom_arabe,
//       prenom_ar: prenom_arabe,
//       datenaiss,
//       lieuxnaiss: Lieunais,
//       lieuxnaiss_ar: lieunaisArabe,
//       adresse,
//       adresse_ar: adresse_ar,
//       sexe,
//       telephone: tel,
//       email: mail,
//       nationalite,
//       username: user,
//       type: "Employé",
//       ecoleId: existingUserEmploye.ecoleId,
//     };

//     // Si un nouveau mot de passe est fourni, le hacher et l'ajouter
//     if (pwd) {
//       updatedUserData.password = await bcrypt.hash(pwd, 10);
//     }

//     await existingUserEmploye.update(updatedUserData, { transaction });

//     // Mettre à jour l'employé existant
//     const updatedEmployeData = {
//       sitfamiliale,
//       nbrenfant,
//       TypePI,
//       NumPI,
//       NumPC,
//       NumAS,
//       poste,
//       service,
//       daterecru,
//       NVTetudes,
//       Experience,
//       SalairNeg,
//       Typepai,
//       TypeContrat,
//       DateFinContrat,
//       Remarque,
//       HeureEM,
//       HeureSM,
//       HeureEAM,
//       HeureSAM,
//       CE,
//     };

//     // Si un fichier est téléchargé, mettre à jour le chemin du fichier
//     if (file) {
//       const filePath = `/images/employes/${file.filename}`;
//       updatedEmployeData.photo = filePath;
//     }

//     await existingEmploye.update(updatedEmployeData, { transaction });

//     // Si le poste est "Enseignant", mettre à jour les informations de l'enseignant
//     const findposte = await Poste.findByPk(poste);
//     if (findposte && findposte.poste === 'Enseignant') {
//       const enseignantData = { npe, pfe, ddn: ddn ? new Date(ddn) : null, ninn };
//       const existingEnseignant = await Enseignant.findOne({ where: { employe_id: id } });

//       if (existingEnseignant) {
//         // Mettre à jour l'enseignant existant
//         await existingEnseignant.update(enseignantData, { transaction });
//       } else {
//         // Créer un nouvel enseignant si aucun n'existe
//         await Enseignant.create({ ...enseignantData, employe_id: existingEmploye.id }, { transaction });
//       }

//       // Récupérer les matières et sections sélectionnées
//       const matieresIds = JSON.parse(req.body.matieresIds || '[]');
//       const sectionsIds = JSON.parse(req.body.sectionsIds || '[]');
//       const niveauIds = JSON.parse(req.body.niveauIds || '[]');

//       console.log("matieresIds reçues:", matieresIds);
//       console.log("sectionsIds reçues:", sectionsIds);
//       console.log("niveauIds reçues:", niveauIds);

//       // Supprimer les anciennes entrées dans EnseignantClasse pour cet enseignant
//       await EnseignantClasse.destroy({
//         where: { enseignantId: existingEnseignant.id },
//         transaction,
//       });

//       // Ajouter les nouvelles entrées dans EnseignantClasse
//       for (const matiereId of matieresIds) {
//         for (const classeId of sectionsIds) {
//           for (const niveauId  of niveauIds){
//             await EnseignantClasse.create(
//               {
//                 enseignantId: existingEnseignant.id,
//                 matiereId,
//                 classeId,
//                 niveauId ,
//               },
//               { transaction }
//             );
//           }
//         }
//       }
//     }

//     // Validation de la transaction
//     await transaction.commit();

//     // Réponse de succès
//     return res.status(200).json({
//       message: 'Employé modifié avec succès !',
//       employe: { id: existingEmploye.id },
//     });
//   } catch (error) {
//     // En cas d'erreur, annulation de la transaction
//     await transaction.rollback();
//     console.error("Erreur lors de la modification :", error);
//     return res.status(500).json({ message: "Erreur serveur lors de la modification", error: error.message });
//   }
// };


// controllers/AuthController.js ou là où se trouve votre getMe
export const employeMe = async (req, res) => {
  try {
      const user = await User.findByPk(req.user.id, {
          include: [
              {
                  model: Employe,
                  include: [
                      {
                          model: Poste,
                          attributes: ['id', 'poste']
                      }
                  ]
              },
              {
                  model: Role,
                  through: { attributes: [] },
                  attributes: ['id', 'name']
              }
          ]
      });

      if (!user) {
          return res.status(404).json({ message: "Utilisateur non trouvé" });
      }

      // Formater la réponse
      const response = {
          id: user.id,
          username: user.username,
          email: user.email,
          roles: user.Roles.map(role => role.name),
          employe: user.Employe ? {
              id: user.Employe.id,
              poste: user.Employe.Poste ? user.Employe.Poste.poste : null
          } : null
      };
      console.log('emmployé', response);
      res.status(200).json(response);
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erreur serveur" });
  }
};
