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
import Ecole_SEcole_Role from '../../models/Ecole_SEcole_Role.js';
// Convertir l'URL du module en chemin de fichier
const __filename = fileURLToPath(import.meta.url);
// Obtenir le répertoire du fichier
const __dirname = path.dirname(__filename)
// import { UPDATE } from 'sequelize/lib/query-types';
const { UPDATE } = sequelize.QueryTypes;

export const AjouterEmploye = async (req, res) => {
  // console.log(req.body)
  const transaction = await sequelize.transaction();
  const file = req.file;
  const ecoleId = req.user.ecoleId;
  const ecoleeId = req.user.ecoleeId;

  try {
    let filePath = null;
    if (file) {
      filePath = `/images/employes/${file.filename}`;
    }
    const {
      nom, prenom, nom_arabe, prenom_arabe, datenaiss, tel, mail, user, pwd,
      nationalite, sexe, Lieunais, lieunaisArabe, sitfamiliale, nbrenfant, adresse, adresse_ar,
      TypePI, NumPI, NumPC, NumAS, poste, service, daterecru, NVTetudes, Experience,
      Typepai, SalairNeg, TypeContrat, DateFinContrat, Remarque, HeureEM, HeureSM,
      HeureEAM, HeureSAM, CE, npe, pfe, ddn, ninn, nbrHeureLegale, nbrJourTravail, Numpai,
      dateabt,notify,tauxabt,abattement,declaration
    } = req.body;

   
    let dateabtt;
    // Convert empty/string 'null' to actual null
    if (!dateabt || dateabt === 'null' || dateabt === 'Invalid date') {
      dateabtt = null;
    }
  
    console.log("Received dateabt:", dateabtt); 

    // Validate dateabt
 
    // const existingEmail = await User.findOne({ where: { email: mail } });
    // if (existingEmail) {
    //   await transaction.rollback(); // Annuler la transaction
    //   return res.status(400).json({ message: "email est déjà utilisé" });
    // }
    // Vérification si user existe déjà
    const existingEmploye = await User.findOne({ where: { username: user } });
    if (existingEmploye) {
      await transaction.rollback(); // Annuler la transaction
      return res.status(400).json({ message: "user existe déja" });
    }

    const hashedPassword = await bcrypt.hash(pwd, 10);
    const newUser = await User.create({
      nom, prenom,
      nom_ar: nom_arabe,
      prenom_ar: prenom_arabe,
      datenaiss: datenaiss,
      lieuxnaiss: Lieunais,
      lieuxnaiss_ar: lieunaisArabe,
      adresse: adresse,
      adresse_ar: adresse_ar,
      sexe,
      telephone: tel,
      email: mail,
      nationalite,
      username: user,
      password: hashedPassword,
      type: "Employé",
      ecoleId
    }, { transaction })
    // console.log('newuser', newUser);

    //ajouter le role Employé si il n'existe pas
    const [role] = await Role.findOrCreate({ where: { name: "Employé" } });
    const newUserRole = await UserRole.create({ userId: newUser.id, roleId: role.id }, { transaction });

    // console.log('userRole', newUserRole);
    //verifier si sous ecole existe on ajoute id de user et la sous ecole dans la table sous ecole
    if (ecoleeId && newUser) {
      const newUserSecoles = await UserEcole.create({ userId: newUser.id, ecoleeId }, { transaction })
      // console.log('userRole', newUserSecoles);
    }

    // console.log('ewUser.id', newUser.id)
    const newEmploye = await Employe.create({
      id: newUser.id, sitfamiliale, nbrenfant, TypePI, NumPI, NumPC, NumAS,
      poste, service, daterecru, NVTetudes, Experience, SalairNeg, Typepai,
      TypeContrat, DateFinContrat, Remarque, HeureEM, HeureSM, HeureEAM, HeureSAM, CE, photo: filePath,
      userId: newUser.id, nbrHeureLegale, nbrJourTravail, Numpai,dateabt,notify,
      tauxabt,abattement,declaration,dateabt: dateabtt,
    }, { transaction });



    // console.log("📢 Création des enregistrements dans Ecole_SEcole_Role...");

    // Récupérer les roleId des rôles "Élève" et "Parent"
    const [roleEmployeRecord] = await Role.findOrCreate({
      where: { name: "Employé" },
    });

    // Créer un enregistrement pour l'élève
    
    await Ecole_SEcole_Role.findOrCreate({
      where: {
        ecoleId: ecoleId,
        ecoleeId: ecoleeId || null,
        roleId: roleEmployeRecord.id,
      },
      defaults: {
        ecoleId: ecoleId,
        ecoleeId: ecoleeId || null,
        roleId: roleEmployeRecord.id,
      }
    }); 
    
    console.log("✅ Enregistrement Ecole_SEcole_Role vérifié/créé pour employe.");


    // console.log("newEploye", newEmploye)
    // console.log('avantposte', poste)
    // Création de l'enseignant
    const findposte = await Poste.findByPk(poste);
    // console.log('posteeee', findposte)


    if (findposte.poste === 'Enseignant') {
      // console.log('entrez')

      // console.log("Valeur de ddn:", ddn);
      const newEnseignant = await Enseignant.create({
        id: newEmploye.id,
        npe, pfe, ddn: ddn ? new Date(ddn) : null, ninn,
        employe_id: newEmploye.id
      }, { transaction });
    }

    await transaction.commit();
    return res.status(201).json({
      message: 'Employé créés avec succès',
      // employe: { id: newEmploye.id }
    });
  } catch (error) {
    // En cas d'erreur, annulation de la transaction
    await transaction.rollback();
    console.error("Erreur lors de la création :", error);
    return res.status(500).json({ message: "Erreur serveur lors de la création", error: error.message });
  }
};

export const ListeEmploye = async (req, res) => {
  try {
    const ecoleId = req.user.ecoleId;
    const ecoleeId = req.user.ecoleeId;
    const roles = req.user.roles;
    const isAdminPrincipal = roles.includes('AdminPrincipal');
    let listeEmployes;

    if (isAdminPrincipal) {
      // console.log('AdminPrincipal détecté');
      listeEmployes = await Employe.findAll({
        where: { archiver: 0, },
        include: [
          {
            model: User,
            required: true,

            include: [
              { model: EcolePrincipal, where: { id: ecoleId } },
              { model: Ecole, through: UserEcole }
            ]
          },
          { model: Poste, attributes: ['poste'] },
          { model: Service, attributes: ['service'] }
        ]
      });
    } else {
      if (ecoleeId) {
        listeEmployes = await Employe.findAll({
          where: { archiver: 0, },
          include: [
            {
              model: User,
              where: { ecoleId: ecoleId },
              include: [
                { model: EcolePrincipal },
                { model: Ecole, where: { id: ecoleeId }, through: UserEcole }
              ]
            },
            { model: Poste, attributes: ['poste'] },
            { model: Service, attributes: ['service'] }
          ]
        });

      } else {
        // console.log('Autre rôle détecté');
        listeEmployes = await Employe.findAll({
          where: { archiver: 0, },
          include: [
            {
              model: User,
              where: { ecoleId: ecoleId },
              include: [
                { model: EcolePrincipal },
              ]
            },
            { model: Poste, attributes: ['poste'] },
            { model: Service, attributes: ['service'] }
          ]
        });
      }
    }

    // console.log('Les employés sont:', listeEmployes);
    if (!listeEmployes || listeEmployes.length === 0) {
      return res.status(404).json({ message: "Pas d'employés" });
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
        { model: Poste, attributes: ['poste'] },
        { model: Service, attributes: ['service'] },
        { model: Enseignant }

      ],

    });
    // console.log('profilEmploye', profilEmploye);

    if (!profilEmploye) {
      return res.status(404).json({ message: "Employé non trouvé" });
    }
    return res.status(200).json(profilEmploye);
  } catch (error) {
    console.error("Erreur lors de la récupération du profil de l'employé :", error);
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
  // console.log('file', file);
  try {
    const existingEmploye = await Employe.findByPk(id);
    if (!existingEmploye) {
      return res.status(404).json({ message: "Employé non trouvé" });
    }
    const existingUserEmploye = await User.findByPk(existingEmploye.userId);
    if (!existingUserEmploye) {
      return res.status(404).json({ message: "User non trouvé" });
    }
    // Extraction des données
    // const {
    //   nom, prenom, nom_arabe, prenom_arabe, datenaiss, tel, mail, user,
    //   nationalite, sexe, Lieunais, lieunaisArabe, sitfamiliale, nbrenfant, adresse,
    //   TypePI, NumPI, NumPC, NumAS, poste, service, daterecru, NVTetudes, Experience,
    //   Typepai, SalairNeg, TypeContrat, DateFinContrat, Remarque, HeureEM, HeureSM,
    //   HeureEAM, HeureSAM, CE, npe, pfe, ddn, ninn, adresse_ar, pwd,nbrHeureLegale, nbrJourTravail, Numpai
    // } = req.body;
    const {
      nom, prenom, nom_arabe, prenom_arabe, datenaiss, tel, mail, user,
      nationalite, sexe, Lieunais, lieunaisArabe, sitfamiliale, nbrenfant, adresse,
      TypePI, NumPI, NumPC, NumAS, poste, service, daterecru, NVTetudes, Experience,
      Typepai, SalairNeg, TypeContrat, DateFinContrat, Remarque, HeureEM, HeureSM,
      HeureEAM, HeureSAM, CE, npe, pfe, ddn, ninn, adresse_ar, pwd, 
      nbrHeureLegale, nbrJourTravail, Numpai, disponibilites,
      dateabt,notify,tauxabt,abattement,declaration, dateAD,statuscompte
    } = req.body;
    
  
    let dateabtt;
    // Convert empty/string 'null' to actual null
    if (!dateabt || dateabt === 'null' || dateabt === 'Invalid date') {
      dateabtt = null;
    }

    let dateADD;
    // Convert empty/string 'null' to actual null
    if (!dateAD || dateAD === 'null' || dateAD === 'Invalid date') {
      dateADD = null;
    }

    // Vérification si le nom d'utilisateur existe déjà (sauf pour l'employé actuel)
    const existingUser = await User.findOne({ where: { username: user, id: { [Op.ne]: existingUserEmploye.id } } });
    if (existingUser) {
      return res.status(400).json({ message: "Le nom d'utilisateur est déjà utilisé" });
    }
    // Si le mot de passe est fourni, le hacher
    let hashedPassword;
    if (pwd) {
      hashedPassword = await bcrypt.hash(pwd, 10);
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
      adresse_ar: adresse_ar,
      sexe,
      telephone: tel,
      email: mail,
      nationalite,
      username: user,
      type: "Employé",
      ecoleId: existingUserEmploye.ecoleId,
      dateAD:dateADD,statuscompte
      
    };
    // Si un nouveau mot de passe est fourni, le hacher et l'ajouter
    if (pwd) {
      updatedUserData.password = await bcrypt.hash(pwd, 10);
    }
    await existingUserEmploye.update(updatedUserData, { transaction });
    // Mettre à jour l'employé existant
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
      nbrHeureLegale, nbrJourTravail, Numpai,
      dateabt:dateabtt,notify,tauxabt,abattement,declaration
    };

    // Si un fichier est téléchargé, mettez chià jour le chemin du fichier
    if (file) {
      const filePath = `/images/employes/${file.filename}`;
      updatedEmployeData.photo = filePath;

      console.log('path de file is ', filePath)
      // Supprimez l'ancien fichier si nécessaire
      // if (existingEmploye.photo) {
      //   const oldFilePath = path.join(__dirname, '../../public', existingEmploye.photo);
      //   fs.unlink(oldFilePath, (err) => {
      //     if (err) {
      //       console.error("Erreur lors de la suppression de l'ancien fichier :", err);
      //     }
      //   });
      // }
    }
    await existingEmploye.update(updatedEmployeData, { transaction });


    // Si le poste est "Enseignant", mettez à jour les informations de l'enseignant
    const findposte = await Poste.findByPk(poste);
    if (findposte && findposte.poste === 'Enseignant') {
      // const enseignantData = { npe, pfe, ddn: ddn ? new Date(ddn) : null, ninn };
      const enseignantData = { 
        npe, 
        pfe, 
        ddn: ddn ? new Date(ddn) : null, 
        ninn,
        disponibilites: disponibilites ? JSON.parse(disponibilites) : null
      };
      const existingEnseignant = await Enseignant.findOne({ where: { employe_id: id } });

      if (existingEnseignant) {
        // Mettre à jour l'enseignant existant
        await existingEnseignant.update(enseignantData, { transaction });
      } else {
        // Créer un nouvel enseignant si aucun n'existe
        await Enseignant.create({ ...enseignantData, employe_id: existingEmploye.id }, { transaction });
      }
    }

    // Validation de la transaction
    await transaction.commit();

    // Réponse de succès

    return res.status(200).json({
      message: 'Employé modifié avec succès !',
      employe: { id: existingEmploye.id },
    });

  } catch (error) {
    // En cas d'erreur, annulation de la transaction
    await transaction.rollback();
    console.error("Erreur lors de la modification :", error);
    return res.status(500).json({ message: "Erreur serveur lors de la modification", error: error.message });
  }
};

export const employeMe = async (req, res) => {
  try {
    const idE = req.user.id;

    const user = await User.findOne({
      where: { id: idE },
      include: [
        { model: EcolePrincipal },
        { model: Ecole, through: UserEcole }
      ]
    });

    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    const employe = await Employe.findOne({
      where: { userId: user.id },
      include: [
        { model: Poste },
        { model: Service },
        {
          model: User,
          include: [
            { model: EcolePrincipal },
            { model: Ecole, through: UserEcole }
          ]
        },
        {
          model: Enseignant, // 🟢 Ajout ici
          attributes: ['npe', 'pfe', 'ddn', 'ninn', 'disponibilites']
        }
      ]
    });

    if (!employe) {
      return res.status(404).json({ message: "Employé non trouvé" });
    }

    return res.status(200).json(employe);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};


// export const employeMe = async (req, res) => {
//   try {
//     const idE = req.user.id;
//     const user = await User.findOne({
//       where: { id: idE },
//       include: [
//         { model: EcolePrincipal },
//         { model: Ecole, through: UserEcole }
//       ]
//     });
//     if (!user) {
//       return res.status(404).json({ message: "Utilisateur non trouvé" });
//     }
//     const employe = await Employe.findOne({
//       where: { userId: user.id },
//       include: [
//         { model: Poste },
//         { model: Service },
//         {
//           model: User,
//           include: [
//             { model: EcolePrincipal },
//             { model: Ecole, through: UserEcole }
//           ]
//         }
//       ]
//     });
//     if (!employe) {
//       return res.status(404).json({ message: "Employé non trouvé" });
//     }

//     return res.status(200).json(employe);

//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Erreur serveur" });
//   }
// };


