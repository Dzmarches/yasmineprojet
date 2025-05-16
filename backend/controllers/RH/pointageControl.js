import Pointage from '../../models/RH/pointage.js';
import Employe from '../../models/RH/employe.js';
import Poste from '../../models/RH/poste.js';
import moment from 'moment';
import { Op, where } from 'sequelize';
// import Ecole from '../../models/RH/Ecole.js';
import Ecole from '../../models/Admin/Ecole.js';
import User from '../../models/User.js';
import EcolePrincipal from '../../models/EcolePrincipal.js';
import Service from '../../models/RH/service.js';
import UserEcole from '../../models/Admin/UserEcole.js';
import PeriodePaie from '../../models/RH/paie/PeriodesPaie.js';
import HeuresSup from '../../models/RH/HeuresSup.js';

export const AjouterPointage = async (req, res) => {
  try {
    const ecoleId = req.user.ecoleId;
    const ecoleeId = req.user.ecoleeId;
    const roles = req.user.roles;


    const date = moment().format("YYYY-MM-DD");
    const type_pointage = "manuel"
    if (!moment(date, 'YYYY-MM-DD', true).isValid()) {
      return res.status(400).json({ error: "Format de date invalide" });
    }

    let users;
    if (!ecoleeId && ecoleId) {
      const users_e = await User.findAll({
        where: {
          archiver: 0,
          ecoleId: ecoleId,
          statuscompte: 'activer'
        },
        include: [
          {
            model: Ecole,
            through: { attributes: [] },
            required: false 
          }
        ]
      });

       users = users_e.filter(user => user.Ecoles.length === 0);

    }
    if (ecoleeId) {
      users = await User.findAll({
        where: { archiver: 0, ecoleId: ecoleId ,statuscompte: 'activer'},
        include: [
          { model: EcolePrincipal },
          { model: Ecole, where: { id: ecoleeId }, through: UserEcole }
        ]
      });
    }

    const userIds = users.map(user => user.id);
    console.log('usersIds',userIds);

    const employes = await Employe.findAll({
      where: { archiver: 0, userId: userIds },
      include: [
        {
          model: User,
          where: { statuscompte: 'activer' },
        }
      ]
    });


    const pointagesAjoutes = [];

    for (const employe of employes) {
      // ✅ Vérifier si un pointage existe déjà pour cet employé
      const pointageExistant = await Pointage.findOne({
        where: { employe_id: employe.id, date }
      });

      if (!pointageExistant) {
        const nouveauPointage = await Pointage.create({
          employe_id: employe.id,
          date,
          HeureEMP: employe.HeureEM,
          HeureSMP: employe.HeureSM,
          HeureEAMP: employe.HeureEAM,
          HeureSAMP: employe.HeureSAM,
          statut: 'present',
          type_pointage
        });
        pointagesAjoutes.push(nouveauPointage);
      }
    }


    res.status(200).json({
      message: 'Pointages par défaut ajoutés avec succès',
      pointages: pointagesAjoutes
    });
  } catch (error) {
    console.error('❌ Erreur lors de l\'ajout des pointages :', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

export const Listepointage = async (req, res) => {
  try {
    const ecoleId = req.user.ecoleId;
    const ecoleeId = req.user.ecoleeId;
    const roles = req.user.roles;
    const today = moment().format("YYYY-MM-DD");
    
    const isAdminPrincipal = roles.includes('AdminPrincipal');
    const includeEcole = {
      model: Ecole,
      through: UserEcole,
    };
    if (ecoleeId) {
      includeEcole.where = { id: ecoleeId };
      includeEcole.required = true;
    }


    let pointages;
    if (isAdminPrincipal) {
      // console.log('AdminPrincipal détecté');
      pointages = await Pointage.findAll({
        where: { archiver: 0, date: { [Op.eq]: today } },
        include: [
          // { model: HeuresSup,attributes: ["nom","taux"] },
          {
            model: Employe,
            required: true,
            where: {
              id: { [Op.ne]: null },
              archiver: 0
            },
            include: [
              {
                model: Poste,
                attributes: ["poste"],
              },
              {
                model: User,
                attributes: ["nom", "prenom", "statuscompte"],
                where: {
                  ecoleId: ecoleId, // L'utilisateur doit appartenir à l'école principale
                },
                include: [
                  {
                    model: EcolePrincipal,
                    where: { id: ecoleId }, // Vérifie bien que c'est l'école principale
                  },
                  {
                    model: Ecole,
                    through: UserEcole,
                    required: false, // Permet d'inclure les utilisateurs qui ne sont pas dans une sous-école
                  },
                ],
              },
            ],
          },
          { model: HeuresSup, attributes: ["nom", "taux"] }
        ],
      });
    }

    else {
      console.log('Autre rôle détecté');

      pointages = await Pointage.findAll({
        where: { archiver: 0, date: { [Op.eq]: today } },
        order: [['date', 'DESC']],
        include: [
          // { model: HeuresSup,attributes: ["nom","taux"] },
          {
            model: Employe,
            required: true,
            where: {
              id: { [Op.ne]: null },
              archiver: 0
            },
            include: [
              {
                model: Poste,
                attributes: ["poste"],
              },
              {
                model: User,
                attributes: ["nom", "prenom", "statuscompte"],
                where: {
                  ecoleId: ecoleId,
                },
                include: [
                  {
                    model: EcolePrincipal,
                    where: { id: ecoleId },
                  },
                  includeEcole
                ],
              },
            ],
          },
          { model: HeuresSup, attributes: ["nom", "taux"] }
        ],
      });
    }


    if (!pointages || pointages.length === 0) {
      return res.status(404).json({ message: "Pas de pointages" });
    }
    return res.status(201).json(pointages);

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Erreur serveur' });
  }

}

export const AjouterPointagee = async (req, res) => {
  try {
    const {
      id,
      statut,
      justificationab,
      justificationret,
      heuresupP,
      HeureEMP,
      HeureSMP,
      HeureEAMP,
      HeureSAMP,
      datedu,
      datea,
    } = req.body;


    if (!id || !statut) {
      return res.status(400).json({ message: 'Champs requis manquants' });
    }

    const newPointage = await Pointage.create({
      employeId: id,
      statut,
      justificationab,
      justificationret,
      heuresupP,
      HeureEMP,
      HeureSMP,
      HeureEAMP,
      HeureSAMP,
      datedu,
      datea,
    });

    // Envoyer une réponse appropriée
    return res.status(201).json({
      message: 'Pointage ajouté avec succès',
      data: newPointage,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Erreur serveur' });
  }
};



export const ModifierPointage = async (req, res) => {
  const { id } = req.params;
  const updatedData = { ...req.body };

  // Nettoyage du champ heuresupP
  if (updatedData.heuresupP === '' || updatedData.heuresupP === undefined || updatedData.heuresupP === null) {
    updatedData.heuresupP = 0; // ou null, selon ta logique
  }

  // Vérifie si c'est bien un nombre
  updatedData.heuresupP = parseFloat(updatedData.heuresupP);
  if (isNaN(updatedData.heuresupP)) {
    updatedData.heuresupP = 0;
  }

  // Gérer aussi IdHeureSup si heuresupP vaut 0
  if (updatedData.heuresupP === 0) {
    updatedData.IdHeureSup = null;
  }
  try {
    const [updated] = await Pointage.update(updatedData, {
      where: { id: id }
    });

    if (updated) {
      const updatedPointage = await Pointage.findByPk(id);
      return res.status(200).json({ message: 'Pointage mis à jour avec succès', pointage: updatedPointage });
    }

    return res.status(404).json({ message: 'Pointage non trouvé' });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du pointage:', error);
    return res.status(500).json({ message: 'Erreur serveur lors de la mise à jour du pointage' });
  }
}



export const Listepointagedate = async (req, res) => {
  try {
    const { datedu, datea } = req.query;
    // console.log('date du ',datedu,'datea',datea)
    // Construire l'objet de conditions pour Sequelize
    const conditions = {};

    // Vérifier si datedu est défini
    if (datedu) {
      conditions.date = {
        ...conditions.date,
        [Op.gte]: moment(datedu).startOf('day').toDate() // date >= datedu
      };
    }
    // Vérifier si datea est défini
    if (datea) {
      conditions.date = {
        ...conditions.date,
        [Op.lte]: moment(datea).endOf('day').toDate() // date <= datea
      };
    }
    // Si aucune date n'est fournie, renvoyer une erreur
    if (!datedu && !datea) {
      return res.status(400).json({ message: 'Veuillez fournir au moins une date.' });
    }

    // Récupérer les pointages en fonction des conditions
    const pointages = await Pointage.findAll({
      where: conditions,
      include: [
        {
          model: Employe,
          include: [
            {
              model: Poste,
              attributes: ["poste"],
            },
            {
              model: User,
              attributes: ["nom", "prenom"],
            }
          ],
        },
        { model: HeuresSup, attributes: ["nom", "taux"] }
      ],
    });

    if (!pointages || pointages.length === 0) {
      return res.status(404).json({ message: "Pas de pointages trouvés pour les dates spécifiées." });
    }

    return res.status(200).json(pointages);
  } catch (error) {
    console.error('Erreur lors de la récupération des pointages par date:', error);
    return res.status(500).json({ message: 'Erreur serveur' });
  }
};

// export const AjouterPointageLocalisation = async (req, res) => {
//   try {

//     ///recuperre le spointages
//     const userconnect=req.user.id;
//     const ecoleId = req.user.ecoleId;
//     const ecoleeId = req.user.ecoleeId;
//     const roles = req.user.roles;

//     const isEmploye = roles.includes('Employé');

//     if(isEmploye){

//       const findEmploye=await Employe.findOne({where:{userId:userconnect}});
//       //recuperre l'ecole principale:

//       if(ecoleId && !ecoleeId){
//         const findEcoleP=await EcolePrincipal.findByPk(ecoleId);
//         const positionEcole=findEcoleP.maps;

//       }

//       if (ecoleeId){
//         const findEcole=await Ecole.findByPk(ecoleeId);
//         const mapEcole=findEcole.maps;

//       }
//     }

//     const { lat, long,  time, BTN ,comment} = req.body;
//     const date = moment.format("YYYY-MM-DD");

//     const pointageArray = [lat, long];
//     const isInEcolePosition = positionEcole.some(
//       ([latEcole, lonEcole]) => latEcole === lat && lonEcole === long
//     );
//     // Vérification des paramètres requis
//     if (!lat || !long || !date || !time) {
//       return res.status(400).json({ message: 'Tous les champs sont requis.' });
//     }
//     const latlong = `${lat};${long}`;


//     // Vérifier si l'employé a déjà un pointage à cette date
//     let findemploye = await Pointage.findOne({
//       where: {
//         employe_id: findEmploye.id,
//         date: date
//       }
//     });
//     const  employeinfo=await Employe.findByPk(employe_id);
//    // Si aucun enregistrement n'existe, en créer un
//     if (!findemploye) {
//       findemploye = await Pointage.create({
//         date: date,
//         HeureEMP: null,
//         HeureSMP: null,
//         HeureEAMP: null,
//         HeureSAMP: null,
//         employe_id:findEmploye.id,
//         latlogEMP: null,
//         latlogSMP: null,
//         latlogEAMP: null,
//         latlogSAMP: null,
//       });
//     }
//     // Définition des champs à mettre à jour selon BTN
//     const updateFields = {};
//     switch (BTN) {


//       case 'EMP':
//         if (!findemploye.HeureEMP || !findemploye.latlogEMP) {
//           if (
//             moment(employeinfo.HeureEM, "HH:mm:ss").isBefore(
//               moment(time, "HH:mm:ss")
//             )
//           ) {
//             updateFields.statut = "retard";
//           } else {
//             updateFields.statut = "present";
//           }

//           updateFields.justificationret=`retard entrée du matin :${comment}`
//           updateFields.HeureEMP = time;
//           updateFields.latlogEMP = latlong;

//         }
//         break;
//       case 'SMP':

//         if (!findemploye.HeureSMP || !findemploye.latlogSMP) {
//           // if (
//           // moment(employeinfo.HeureSM, "HH:mm:ss").isAfter(moment(time, "HH:mm:ss")) 
//           // ) {
//           //   if (findemploye.statut !== "retard") {
//           //     updateFields.statut = "sortie anticipée";
//           //   }
//           // } 
//           updateFields.HeureSMP = time;
//           updateFields.latlogSMP = latlong;

//         }else{
//           console.log('vous avez pas le droit')
//         }
//         break;
//       case 'EAMP':
//         if (!findemploye.HeureEAMP || !findemploye.latlogEAMP) {
//           if (
//             moment(employeinfo.HeureEAM, "HH:mm:ss").isBefore(
//               moment(time, "HH:mm:ss")
//             )
//           ) {
//             if (findemploye.statut !== "retard") {
//               updateFields.statut = "retard";
//             }
//             }


//              updateFields.justificationret=`${findemploye.justificationret}
//              , retard entrée aprés midi :${comment}`

//           updateFields.HeureEAMP = time;
//           updateFields.latlogEAMP = latlong;
//         }
//         break;
//       case 'SAMP':
//          if (!findemploye.HeureSAMP || !findemploye.latlogSAMP) {
//         //   if (
//         //     moment(employeinfo.HeureSAM, "HH:mm:ss").isBefore(
//         //       moment(time, "HH:mm:ss")
//         //     )
//         //   ) {
//         //     if (findemploye.statut !== "retard") {
//         //       updateFields.statut = "retard";
//         //     }
//         //   }

//           updateFields.HeureSAMP = time;
//           updateFields.latlogSAMP = latlong;
//         }
//         break;
//       default:
//         return res.status(400).json({ message: 'Type de pointage non valide.' });
//     }

//     if (!isInEcolePosition) {
//       updateFields.statut = "absent"; 
//     }

//     // Vérifier s'il y a des mises à jour à effectuer
//     if (Object.keys(updateFields).length > 0) {
//       await Pointage.update(updateFields, {
//         where: { id: findemploye.id }
//       });

//       // Fusionner les nouvelles valeurs pour la réponse
//       findemploye = { ...findemploye.dataValues, ...updateFields };
//     }

//     return res.status(201).json({
//       message: 'Pointage ajouté/mis à jour avec succès',
//       data: findemploye,updateFields
//     });

//   } catch (error) {
//     console.error('Erreur lors de l\'ajout du pointage:', error);
//     return res.status(500).json({ message: 'Erreur serveur' });
//   }
// };
export const AjouterPointageLocalisation = async (req, res) => {
  try {
    // Récupérer les infos de l'utilisateur connecté
    const userconnect = req.user.id;
    const ecoleId = req.user.ecoleId;
    const ecoleeId = req.user.ecoleeId;
    const roles = req.user.roles;
    const type_pointage = "localisation"

    // Vérifier si l'utilisateur est un employé
    const isEmploye = roles.includes("Employé");
    if (!isEmploye) {
      return res.status(403).json({ message: "Accès refusé" });
    }

    // Récupérer les données de l'employé
    const findEmploye = await Employe.findOne({ where: { userId: userconnect } });
    if (!findEmploye) {
      return res.status(404).json({ message: "Employé non trouvé" });
    }

    // Récupérer la position de l'école ou sous-école

    let maps = [];
    if (ecoleId && !ecoleeId) {
      const findEcoleP = await EcolePrincipal.findByPk(ecoleId);
      maps = Array.isArray(findEcoleP?.maps) ? findEcoleP.maps : [];
    } else if (ecoleeId) {
      const findEcole = await Ecole.findByPk(ecoleeId);
      maps = Array.isArray(findEcole?.maps) ? findEcole.maps : [];
    }


    // Récupérer les données du pointage
    const { lat, long, time, BTN, comment } = req.body;
    const date = moment().format("YYYY-MM-DD");
    const pointageArray = [lat, long];

    // Vérifier si les coordonnées se trouvent dans l'école
    const isInEcolePosition = maps.some(
      ([latEcole, lonEcole]) => latEcole === lat && lonEcole === long
    );

    // Vérifier les champs requis
    if (!lat || !long || !date ) {
      return res.status(400).json({ message: "Tous les champs sont requis." });
    }

    // Générer la position sous format string
    const latlong = `${lat};${long}`;

    // Vérifier si un pointage existe pour cet employé aujourd'hui
    let findemploye = await Pointage.findOne({
      where: { employe_id: findEmploye.id, date },
    });

    // Récupérer les informations de l'employé pour la vérification des horaires
    const employeinfo = await Employe.findByPk(findEmploye.id);

    // Si aucun pointage n'existe, en créer un nouveau
    if (!findemploye) {
      findemploye = await Pointage.create({
        date,
        HeureEMP: null,
        HeureSMP: null,
        HeureEAMP: null,
        HeureSAMP: null,
        employe_id: findEmploye.id,
        latlogEMP: null,
        latlogSMP: null,
        latlogEAMP: null,
        latlogSAMP: null,
        type_pointage
      });
    }
    // const serverTime = moment().format("HH:mm:ss");
    const serverTime = moment().tz("Africa/Algiers").format("HH:mm");

    // Définition des champs à mettre à jour
    const updateFields = {};
    switch (BTN) {
      case "EMP":
        if (!findemploye.HeureEMP || !findemploye.latlogEMP) {
          updateFields.statut = moment(employeinfo.HeureEM, "HH:mm:ss").isBefore(moment(serverTime, "HH:mm:ss"))
            ? "retard"
            : "present";
          updateFields.justificationret = `retard entrée du matin : ${comment}`;
          updateFields.HeureEMP = serverTime;
          updateFields.latlogEMP = latlong;
        }
        break;

      case "SMP":
        if (!findemploye.HeureSMP || !findemploye.latlogSMP) {
          updateFields.HeureSMP = serverTime;
          updateFields.latlogSMP = latlong;
        }
        break;

      case "EAMP":
        if (!findemploye.HeureEAMP || !findemploye.latlogEAMP) {
          updateFields.statut = moment(employeinfo.HeureEAM, "HH:mm:ss").isBefore(moment(serverTime, "HH:mm:ss"))
            ? "retard"
            : findemploye.statut;
          updateFields.justificationret = `${findemploye.justificationret || ""}, retard entrée après-midi : ${comment}`;
          updateFields.HeureEAMP = serverTime;
          updateFields.latlogEAMP = latlong;
        }
        break;

      case "SAMP":
        if (!findemploye.HeureSAMP || !findemploye.latlogSAMP) {
          updateFields.HeureSAMP = serverTime;
          updateFields.latlogSAMP = latlong;
        }
        break;

      default:
        return res.status(400).json({ message: "Type de pointage non valide." });
    }

    // Vérifier si l'employé est hors de l'école
    if (!isInEcolePosition) {
      updateFields.statut = "absent";
    }

    // Appliquer les mises à jour si nécessaire
    if (Object.keys(updateFields).length > 0) {
      await Pointage.update(updateFields, {
        where: { id: findemploye.id },
      });

      findemploye = { ...findemploye.dataValues, ...updateFields };
    }

    return res.status(201).json({
      message: "Pointage ajouté/mis à jour avec succès",
      data: findemploye,
    });

  } catch (error) {
    console.error("Erreur lors de l'ajout du pointage:", error);
    return res.status(500).json({ message: "Erreur serveur" });
  }
};
export const InfoPointageToday = async (req, res) => {
  try {

    const userconnect = req.user.id;
    const ecoleId = req.user.ecoleId;
    const ecoleeId = req.user.ecoleeId;
    const roles = req.user.roles;
    const isEmploye = roles.includes("Employé");
    const dateToday = moment().format("YYYY-MM-DD");

    if (!isEmploye) {
      return res.status(403).json({ message: "Accès refusé" });
    }
    const findEmploye = await Employe.findOne({ where: { userId: userconnect } });

    if (!findEmploye) {
      return res.status(404).json({ message: "Employé non trouvé" });
    }

    const findPointage = await Pointage.findOne({
      where: {
        employe_id: findEmploye.id,
        date: dateToday
      }

    });

    if (!findPointage) {
      return res.status(404).json({ message: 'Aucun pointage trouvé pour aujourd\'hui.' });
    }
    return res.status(200).json(findPointage);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Erreur lors de la récupération des informations de pointage.' });
  }
};

export const setAllpoinates = async (req, res) => {
  try {

    const userconnect = req.user.id;
    const ecoleId = req.user.ecoleId;
    const ecoleeId = req.user.ecoleeId;
    const roles = req.user.roles;

    const isEmploye = roles.includes("Employé");
    if (!isEmploye) {
      return res.status(403).json({ message: "Accès refusé" });
    }

    // Récupérer les données de l'employé
    const findEmploye = await Employe.findOne({ where: { userId: userconnect } });

    if (!findEmploye) {
      return res.status(404).json({ message: "Employé non trouvé" });
    }
    const dateToday = moment().format("YYYY-MM-DD");
    const findpointage = await Pointage.findAll({
      where: {
        employe_id: findEmploye.id,
      },
      order: [['date', 'DESC']],
      include: [
        {
          model: Employe,
          include: [
            {
              model: User,
              include: [{ model: EcolePrincipal }]
            }
          ]
        }
      ]
    });

    if (!findpointage) {
      return res.status(404).json({ message: 'Aucun pointage trouvé pour aujourd\'hui.' });
    }
    return res.status(200).json(findpointage);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Erreur lors de la récupération des informations de pointage.' });
  }
};

export const ecoleD = async (req, res) => {
  try {
    const ecoleId = req.user.ecoleId;
    const ecoleeId = req.user.ecoleeId;
    const roles = req.user.roles;

    if (ecoleId && !ecoleeId) {
      const findEcoleP = await EcolePrincipal.findOne({
        where: { id: ecoleId },
      });

      if (findEcoleP) {
        return res.status(200).json(findEcoleP);
      } else {
        console.log('Ecole principale non trouvée');
        return res.status(404).json({ message: 'Ecole principale non trouvée' });
      }
    }

    if (ecoleeId && ecoleId) {
      const findEcole = await Ecole.findOne({
        where: { id: ecoleeId, ecoleId },
      });

      if (findEcole) {
        return res.status(200).json(findEcole);
      } else {
        console.log('Ecole non trouvée');
        return res.status(404).json({ message: 'Ecole non trouvée' });
      }
    }

    return res.status(400).json({ message: 'Données manquantes' });

  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }

}




export const ListepointageRapport = async (req, res) => {
  try {
    const ecoleId = req.user.ecoleId;
    const ecoleeId = req.user.ecoleeId;
    const roles = req.user.roles;

    const isAdminPrincipal = roles.includes('AdminPrincipal');

    const includeEcole = {
      model: Ecole,
      through: UserEcole,
    };
    if (ecoleeId) {
      includeEcole.where = { id: ecoleeId };
      includeEcole.required = true;
    }
    let pointages;
    if (isAdminPrincipal) {
      console.log('AdminPrincipal détecté y');
      pointages = await Pointage.findAll({
        where: { archiver: 0 },
        order: [['date', 'DESC']],
        include: [
          {
            model: Employe,
            required: true,
            where: {
              id: { [Op.ne]: null },
            },
            include: [
              {
                model: Poste,
                attributes: ["poste"],
              },
              {
                model: User,
                attributes: ["nom", "prenom"],
                where: {
                  ecoleId: ecoleId,
                },
                include: [
                  {
                    model: EcolePrincipal,
                    where: { id: ecoleId },
                  },
                  {
                    model: Ecole,
                    through: UserEcole,
                    required: false,
                  },
                ],
              },
            ],
          },
          {
            model: HeuresSup,
            attributes: ["nom", "taux"]
          }
        ],
      });
    }
    else {
      console.log('Autre rôle détecté');
      pointages = await Pointage.findAll({
        where: { archiver: 0 },
        order: [['date', 'DESC']],
        include: [
          {
            model: Employe,
            required: true,
            where: {
              id: { [Op.ne]: null },
            },
            include: [
              {
                model: Poste,
                attributes: ["poste"],
              },
              {
                model: User,
                attributes: ["nom", "prenom"],
                where: {
                  ecoleId: ecoleId,
                },
                include: [
                  {
                    model: EcolePrincipal,
                    where: { id: ecoleId },
                  },
                  includeEcole
                ],
              },
            ],
          },
          {
            model: HeuresSup,
            attributes: ["nom", "taux"]
          }
        ],
      });
    }


    // Vérification si des pointages ont été trouvés
    if (!pointages || pointages.length === 0) {
      return res.status(404).json({ message: "Pas de pointages" });
    }

    // Retourner les pointages trouvés
    return res.status(200).json(pointages);

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Erreur serveur' });
  }
};

export const ecoleEmployerUser = async (req, res) => {
  try {
    const ecoleId = req.user.ecoleId;
    const ecoleeId = req.user.ecoleeId;
    const roles = req.user.roles;
    console.log('params', req.params)
    const UserEmploye = req.params.id;

    if (UserEmploye) {

      let findUsermaps;
      findUsermaps = await User.findOne({
        where: { id: UserEmploye },
        include: [
          {
            model: Ecole,
            required: true,
            through: UserEcole,
            attributes: ['maps'],
          }

        ]
      });

      if (!findUsermaps) {
        findUsermaps = await User.findOne({
          where: { id: UserEmploye },
          include: [
            {
              model: EcolePrincipal,
              attributes: ['maps'],
              required: true,
            }

          ]
        });
      }
      return res.status(200).json(findUsermaps);
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }

}
export const marquerabsences = async (req, res) => {
    try {
      console.log('hello');
      const date = moment().tz('Africa/Algiers').format('YYYY-MM-DD');
      const users=await User.findAll({where:{archiver:0,statuscompte:"activer"}});
      const userId=users.map((item)=>item.id);
          const employes = await Employe.findAll({
            where: {
              archiver: 0,
              userId: {
                [Op.in]: userId,
              },
            },
           });
          for (let employe of employes) {
      
            const pointage = await Pointage.findOne({
              where: { employe_id: employe.id, date },
            });
      
            if (!pointage) {
              await Pointage.create({
                date,
                statut: 'absent',
                employe_id: employe.id,
                HeureEMP: null,
                HeureSMP: null,
                HeureEAMP: null,
                HeureSAMP: null,
                latlogEMP: null,
                latlogSMP: null,
                latlogEAMP: null,
                latlogSAMP: null,
               type_pointage :"auto"
      
              });
              continue;
            }
      
            const aucunPointageFait =
              !pointage.HeureEMP &&
              !pointage.HeureSMP &&
              !pointage.HeureEAMP &&
              !pointage.HeureSAMP;
      
            if (aucunPointageFait) {
              await pointage.update({ statut: 'absent' });
            }
          }
          return res.status(200).json({ message: "Les absences ont été marquées avec succès." });

        } catch (error) {
          return res.status(500).json({ message: "Une erreur s'est produite lors du marquage des absences." });
        }
}

 export const archiver = async (req, res) => {
    try {
      const { id } = req.params;
      const hs = await Pointage.findByPk(id);
      if (!hs) {
        return res.status(404).json({ message: "non trouvée." });
      }
        await Pointage.update(
        { archiver: 1 },
        { where: { id } }
      );
      return res.status(200).json({ message: "archivée avec succès." });
    } catch (error) {
      console.error("❌ Erreur lors de l'archivage :", error);
      return res.status(500).json({ message: "Erreur serveur." });
    }
  };