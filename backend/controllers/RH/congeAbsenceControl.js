import moment from 'moment';
import CongeAbsence from '../../models/RH/congeAbsence.js'
import Employe from '../../models/RH/employe.js';
import Poste from '../../models/RH/poste.js';
import sequelize from '../../config/Database.js';
import CongeAnnuel from '../../models/RH/congeAnnuel.js';
import { Op } from 'sequelize';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import EcolePrincipal from '../../models/EcolePrincipal.js';
import Ecole from '../../models/Admin/Ecole.js';
import User from '../../models/User.js';
import UserEcole from '../../models/Admin/UserEcole.js';


const __filename = fileURLToPath(import.meta.url);
// Obtenir le répertoire du fichier
const __dirname = path.dirname(__filename)


// export const ajouterCA = async (req, res) => {
//   try {
//     const employe_id = 2;
//     const { type_demande, dateDebut, dateFin, commentaire } = req.body;

//     const dernierCA = await CongeAbsence.findOne({
//       where: { employe_id },
//       order: [['createdAt', 'DESC']],
//       limit: 1
//     });
//     const findEmploye = await Employe.findByPk(employe_id);

//     if (findEmploye) {
//       const dateRecrutement = moment(findEmploye.daterecru);
//       const currentDate = moment();
//       const differenceInMonths = currentDate.diff(dateRecrutement, 'months');
//       const jour_congeMois = differenceInMonths * 2.5;
//       console.log(jour_congeMois);
//       console.log('les employes pour les congés',employeconges);

//         // jour_congeMois=
//         if (dernierCA) {
//           console.log(jour_congeMois);
//           const jour_consomme = dernierCA.jour_consomme
//           const jour_restant = dernierCA.jour_restant
//           console.log('Dernier congé avant l\'ajout :', dernierCA);
//           const newCA = await CongeAbsence.create({
//             type_demande,
//             dateDebut,
//             dateFin,
//             commentaire,
//             employe_id,
//             jour_consomme,
//             jour_restant,
//             jour_congeMois,
//           });
//           return res.status(201).json({ message: 'Congé ajouté avec succès', newCA, dernierCA });

//         } else {

//           const newCA = await CongeAbsence.create({
//             type_demande,
//             dateDebut,
//             dateFin,
//             commentaire,
//             employe_id,
//             jour_congeMois,

//           });
//           return res.status(201).json({ message: 'Congé ajouté avec succès', newCA, dernierCA });


//       }

//     }

//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ message: 'Erreur serveur' });
//   }
// };

export const ajouterCA = async (req, res) => {
  try {
    const employe_id = req.employe_id;
    const ecoleId = req.user.ecoleId;
    const ecoleeId = req.user.ecoleeId;

    const file = req.file;
    const { type_demande, dateDebut, dateFin, commentaire, idcongeAnnuel } = req.body;
    
    const idCAValue = (idcongeAnnuel === 'null' || idcongeAnnuel === '' || idcongeAnnuel === undefined) ? null : parseInt(idcongeAnnuel);

    let filePath = null;

    // Si un fichier est uploadé, définir le chemin de la photo
    if (file) {
      filePath = `/conges/employes/${employe_id}/${file.filename}`;
    }
    const FindCAAttente = await CongeAbsence.findOne(
      {
        where: {
          employe_id: employe_id,
          type_demande: "Congé Annuel",
          statut: "En attente"
        }
      })

    // console.log('FindCAAttente',FindCAAttente)

    if (FindCAAttente) {
      return res.status(203).json({ message: 'Vous avez déjà une demande de congé annuel en attente' });
    }

    const FindEmplyeCA = await CongeAbsence.findAll({ where: { employe_id: employe_id } })
    //trouver dernier tupple congeabsence restant

    if (FindEmplyeCA.length > 0) {
      const dernierCAE = await CongeAbsence.findOne({
        where: { employe_id: employe_id },
        order: [['createdAt', 'DESC']],
        limit: 1
      });

      const jour_congeMois = await calculerMoisConge(employe_id);
      const joursDeCongeMoisPrecedant = dernierCAE.jour_congeMois;
      const jour_restant = (jour_congeMois - joursDeCongeMoisPrecedant) + dernierCAE.jour_restant;
      //   const jour_consomme = joursDeCongeMois-(FindJourRestant+jour_consomme);
      //envoyer combien du jour restant 

      // Convertir 'null' (string) ou '' en null (valeur JavaScript)
      const newCA = await CongeAbsence.create({
        type_demande,
        dateDebut,
        dateFin,
        commentaire,
        employe_id,
        jour_restant,
        jour_congeMois,
        fichier: filePath,
        ecoleId, ecoleeId,
        idCA: idCAValue
      });
      return res.status(201).json({ message: 'Congé ajouté avec succès', newCA });

    } else {
      const jour_congeMois = await calculerMoisConge(employe_id);
      const jour_restant = jour_congeMois
      const newCA = await CongeAbsence.create({
        type_demande,
        dateDebut,
        dateFin,
        commentaire,
        employe_id,
        jour_congeMois,
        jour_restant,
        fichier: filePath,
        ecoleId, ecoleeId,
        idCA: idCAValue
      });
      return res.status(201).json({ message: 'Congé ajouté avec succès', newCA });
    };

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Erreur serveur' });
  }
};
export const mesCA = async (req, res) => {
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

    const mesca = await CongeAbsence.findAll({
      where: { employe_id: findEmploye.id },
      include: [
        {
          model: Employe,
        },
      ],
    });
    if (!mesca) {
      return res.status(404).json({ message: "pas de demande" });
    }
    return res.status(200).json(mesca);
  } catch (error) {
    console.error("Erreur lors de la récupération des demandes :", error);
    return res.status(500).json({ message: "Erreur serveur" });
  }
}

export const detailDemande = async (req, res) => {
  const { id } = req.params;
  try {
    const demande = await CongeAbsence.findByPk(id);
    if (!demande) {
      return res.status(404).json({ message: 'Demande non trouvée' });
    }
    res.json(demande);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
}

export const CAEmployes = async (req, res) => {
  const ecoleId = req.user.ecoleId;
  const ecoleeId = req.user.ecoleeId;
  const roles = req.user.roles;

  try {

    // const demandes = await CongeAbsence.findAll({
    //    where:{ archiver:0,ecoleId:ecoleId},
    //   include: [
    //     {
    //       model: Employe,
    //       include: [
    //         {
    //           model: Poste,
    //           attributes: ["poste"], 
    //         },
    //         {
    //           model: User,
    //           attributes: ["nom","prenom"], 
    //         }
    //       ],
    //     },
    //   ],
    // });

    const isSuperAdmin = roles.includes("AdminPrincipal");
    const includeEcole = {
      model: Ecole,
      through: UserEcole,
    };

    if (ecoleeId && !isSuperAdmin) {
      includeEcole.where = { id: ecoleeId };
      includeEcole.required = true;
    }
    // const demandes = await CongeAbsence.findAll({
    //   where: { archiver: 0 },
    //         order: [['createdAt', 'DESC']],
    //         include: [
    //           {
    //             model: Employe,
    //             required: true, 
    //             where: {
    //               id: { [Op.ne]: null },
    //               archiver:0
    //             },
    //             include: [
    //               {
    //                 model: Poste,
    //                 attributes: ["poste"],
    //               },
    //               {
    //                 model: User,
    //                 attributes: ["nom", "prenom","statuscompte"],
    //                 where: {
    //                   ecoleId: ecoleId, 
    //                 },
    //                 include: [
    //                   {
    //                     model: EcolePrincipal,
    //                     where: { id: ecoleId },
    //                   },
    //                   includeEcole
    //                 ],
    //               },
    //             ],
    //           },

    //         ],

    // });
    const demandes = await CongeAbsence.findAll({
      where: { archiver: 0 },
      order: [['createdAt', 'DESC']],
      include: [
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
        {
          model: CongeAnnuel,
          required: false,
        },
      ],
    });



    if (!demandes) {
      return res.status(404).json({ message: "pas de demande" });
    }
    return res.status(200).json(demandes);
  } catch (error) {
    console.error("Erreur lors de la récupération des demandes :", error);
    return res.status(500).json({ message: "Erreur serveur" });
  }
}

export const demandeEmploye = async (req, res) => {
  const { id } = req.params;
  try {
    const demande = await CongeAbsence.findByPk(id, {
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
              attributes: ["nom", "prenom", "telephone"],
            }
          ],
        },
      ],
    });


    if (!demande) {
      return res.status(404).json({ message: 'Demande non trouvée' });
    } else {


      res.json(demande);
    }


  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur' });
  }

}
export const ModifierStautdemande = async (req, res) => {
  const { id } = req.params;
  const { statut, remarque, deduireCongeAnnuel } = req.body;

  try {
    const demande = await CongeAbsence.findByPk(id);
    if (!demande) {
      return res.status(404).json({ message: 'Demande non trouvée' });
    }
    const jrCongeDemander = moment(demande.dateFin).diff(moment(demande.dateDebut), 'days') + 1;
    const FindEmplyeCA = await CongeAbsence.findAll({ where: { employe_id: demande.employe_id } })
    //trouver dernier tupple congeabsence restant
    // console.log(FindEmplyeCA);


    if (FindEmplyeCA.length > 0) {
      const dernierCAE = await CongeAbsence.findOne({
        where: { employe_id: demande.employe_id },
        order: [['createdAt', 'DESC']],
        limit: 1
      });

      if (demande.type_demande === "Congé Annuel" || deduireCongeAnnuel) {

        const jourcongeMois = await calculerMoisConge(demande.employe_id);
        const diffjrCD = dernierCAE.jour_restant - jrCongeDemander;


        if (statut === 'Accepté' && diffjrCD >= 0) {
          demande.statut = statut;
          demande.jour_consomme = jrCongeDemander;
          demande.jour_restant = dernierCAE.jour_restant - jrCongeDemander
          //mois ou jai accepte la demande est inferieure au mois au l'employe ma envoyer la demande
          if (jourcongeMois > dernierCAE.jour_congeMois) {
            const jourRestant = ((jourcongeMois - dernierCAE.jour_congeMois) + dernierCAE.jour_restant) - diffjrCD;
            demande.jourRestant = jourRestant
          }

        }
        if (diffjrCD < 0) {
          if (statut === 'Refusé') {
            demande.motif = remarque;
            demande.statut = 'Refusé';
            await demande.save();
          }
          return res.status(200).json({ message: 'Demande mise à jour avec succès' });
        }

      }
      demande.statut = statut;
      demande.motif = remarque;
      await demande.save();
      return res.status(200).json({ message: 'Demande mise à jour avec succès', demande });

    }
  }
  catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Erreur serveur' });
  }
};


export const CongesDroit = async (req, res) => {
  //   const IDdemande = req.params.id;
  //   console.log('ID Demande:', IDdemande);

  //   const t = await sequelize.transaction();
  //   try {
  //     const findDemande = await CongeAbsence.findByPk(IDdemande);

  //     console.log(findDemande.jour_restant!=0)

  //     if (findDemande) {
  //       const IDemploye = findDemande.employe_id;
  //       const findEmploye = await Employe.findByPk(IDemploye, { transaction: t });

  //       if (findEmploye) {
  //         const dateRecrutement = moment(findEmploye.daterecru);
  //         const currentDate = moment();
  //         console.log('Date de recrutement est', dateRecrutement.format('YYYY-MM-DD'), "Current date est", currentDate.format('YYYY-MM-DD'));
  //         const differenceInMonths = currentDate.diff(dateRecrutement, 'months');
  //         console.log('Différence en mois:', differenceInMonths);
  //         const joursDeConge = differenceInMonths * 2.5;
  //         // Mettre à jour le champ jours_conge de findDemande
  //         findDemande.jour_congeMois = joursDeConge;
  //         findDemande.jour_restant = (joursDeConge - (findDemande.jour_consomme + findDemande.jour_restant))
  //         console.log('jour e conge est', joursDeConge)
  //         // Enregistrer les modifications sur findDemande
  //         await findDemande.save({ transaction: t });
  //         // Commit de la transaction
  //         await t.commit();
  //         return res.json({
  //           message: `Employee has the right to ${joursDeConge} days of leave.`,
  //           jours_de_conge: joursDeConge
  //         });

  //       } else {
  //         await t.rollback();
  //         return res.status(404).json({ message: 'Employee not found.' });
  //       }
  //     } else {
  //       await t.rollback();
  //       return res.status(404).json({ message: 'Request not found.' });
  //     }

  //   } catch (error) {
  //     await t.rollback();
  //     console.error('Error finding employee:', error);
  //     return res.status(500).json({ message: 'An error occurred while retrieving the employee.' });
  //   }
  // };
  // export const CongesDroitTest = async (IDdemande) => {
  //   // const IDdemande = req.params.id;
  //   // console.log('ID Demande:', IDdemande);

  //   const t = await sequelize.transaction();
  //   try {
  //     const findDemande = await CongeAbsence.findByPk(IDdemande);

  //     if (findDemande) {
  //       const IDemploye = findDemande.employe_id;
  //       const findEmploye = await Employe.findByPk(IDemploye, { transaction: t });

  //       if (findEmploye) {
  //         const dateRecrutement = moment(findEmploye.daterecru);
  //         const currentDate = moment();
  //         console.log('Date de recrutement est', dateRecrutement.format('YYYY-MM-DD'), "Current date est", currentDate.format('YYYY-MM-DD'));
  //         const differenceInMonths = currentDate.diff(dateRecrutement, 'months');
  //         console.log('Différence en mois:', differenceInMonths);
  //         const joursDeConge = differenceInMonths * 2.5;
  //         // Mettre à jour le champ jours_conge de findDemande
  //         findDemande.jour_congeMois = joursDeConge;
  //         findDemande.jour_restant = (joursDeConge - (findDemande.jour_consomme + findDemande.jour_restant))
  //         console.log('jour e conge est', joursDeConge)
  //         // Enregistrer les modifications sur findDemande
  //         await findDemande.save({ transaction: t });
  //         // Commit de la transaction
  //         await t.commit();
  //         return res.json({
  //           message: `Employee has the right to ${joursDeConge} days of leave.`,
  //           jours_de_conge: joursDeConge
  //         });

  //       } else {
  //         await t.rollback();
  //         return res.status(404).json({ message: 'Employee not found.' });
  //       }
  //     } else {
  //       await t.rollback();
  //       return res.status(404).json({ message: 'Request not found.' });
  //     }

  //   } catch (error) {
  //     await t.rollback();
  //     console.error('Error finding employee:', error);
  //     return res.status(500).json({ message: 'An error occurred while retrieving the employee.' });
  //   }
};

export const CongesAnnuel = async (req, res) => {
  try {
    //recupere id employé
    const { id } = req.params;
    // chercher si employe a deja des demande ou c la premiere fois
    const FindEmplyeCA = await CongeAbsence.findAll({
      where: { employe_id: id, archiver: 0 }
    })
    //trouver dernier tupple congeabsence restant

    if (FindEmplyeCA.length > 0) {
      const dernierCAE = await CongeAbsence.findOne({
        where: { employe_id: id, archiver: 0 },
        order: [['createdAt', 'DESC']],
        limit: 1
      });
      const FindJourRestant = dernierCAE.jour_restant;
      //envoyer combien du jour restant 
      return res.status(201).json
        ({
          message: `vous avez le droit a ${FindJourRestant} du conge`,
          jourConge: FindJourRestant
        })
    } else {
      //si employe effectue pour la premier fois la demande
      const joursDeCongeMois = await calculerMoisConge(id);
      return res.status(201).json({
        message: `vous avez le droit à ${joursDeCongeMois} jours de congé`,
        jourConge: joursDeCongeMois
      });
    }
  } catch (error) {
    console.log(error)
  }
}
export const calculerMoisConge = async (idEmploye) => {
  try {
    if (!idEmploye) {
      console.log('ID employé manquant');
      return null;  // Retourne null si l'ID est invalide
    }
    const findEmploye = await Employe.findByPk(idEmploye);
    if (!findEmploye) {
      console.log('Employé n\'existe pas');
      return null;  // Retourne null si l'employé n'existe pas
    }
    const dateRecrutement = moment(findEmploye.daterecru);
    const currentDate = moment();
    const differenceInMonths = currentDate.diff(dateRecrutement, 'months');
    const joursDeConge = differenceInMonths * 2.5;

    // if(differenceInMonths=12){
    //   joursDeConge=22;
    // }

    return joursDeConge;  // Retourne la valeur correctement
  } catch (error) {
    console.error(error);
    return null;  // Retourne null en cas d'erreur
  }
};



export const AjouterCongesAnnuels = async (req, res) => {
  try {
    const ecoleId = req.user.ecoleId;
    const ecoleeId = req.user.ecoleeId;

    const rawDateDebut = req.body.dateDebut;
    const rawDateFin = req.body.dateFin;

    if (!rawDateDebut || !rawDateFin) {
      return res.status(400).json({ message: "Les dates ne doivent pas être vides." });
    }
    const dateDebut = moment(rawDateDebut, "YYYY-MM-DD", true);
    const dateFin = moment(rawDateFin, "YYYY-MM-DD", true);


    if (!dateDebut.isValid() || !dateFin.isValid()) {
      return res.status(400).json({ message: "Format de date invalide." });
    }

    const ajouterCA = await CongeAnnuel.create({
      dateDebut, dateFin, ecoleId, ecoleeId
    });
    res.status(201).json({ message: "Congé ajouté avec succès." });
  } catch (error) {
    console.error("Erreur:", error);
    res.status(500).json({ message: "Erreur serveur." });
  }
};


export const verifierDateCongeAnnuel = async (req, res) => {
  try {

    const userconnect = req.user.id;
    const ecoleId = req.user.ecoleId;
    const ecoleeId = req.user.ecoleeId;
    const roles = req.user.roles;
    const isEmploye = roles.includes("Employé");
    const today = moment().format('YYYY-MM-DD')

    if (!isEmploye) {
      return res.status(403).json({ message: "Accès refusé" });
    }

    // Récupérer les données de l'employé
    const findEmploye = await Employe.findOne({ where: { userId: userconnect } });
    if (!findEmploye) {
      return res.status(404).json({ message: "Employé non trouvé" });
    }

    const liste = await CongeAnnuel.findAll({
      where: {
        dateDebut: { [Op.lte]: today }, // dateDebut ≤ aujourd'hui
        dateFin: { [Op.gte]: today },   // dateFin ≥ aujourd'hui
        archiver: 0,
        [Op.and]: [{ ecoleId: ecoleId }, { ecoleeId: ecoleeId }],
      },
      include: [
        {
          model: Ecole,
          attributes: ["nomecole"],
        },
        {
          model: EcolePrincipal,
          attributes: ["nomecole"],
        },
      ],
    });

    if (liste) {
      console.log("✅ Aujourd'hui est entre dateDebut et dateFin !");
      return res.status(200).json({
        message: "Aujourd'hui est entre dateDebut et dateFin !",
        conge: liste,
      });
    } else {
      return res.status(404).json({
        message: "Aujourd'hui N'EST PAS dans la période de congé.",
      });
    }
  } catch (error) {
    console.error("🚨 Erreur serveur :", error);
    return res.status(500).json({
      message: "Erreur serveur.",
      error: error.message,
    });
  }
};


//supprimer ma demande 

export const supprimerMademande = async (req, res) => {
  const { id } = req.params;
  try {
    // Vérifier si la demande de congé existe et est en attente
    const demande = await CongeAbsence.findOne({ where: { id } });
    if (!demande) {
      return res.status(404).json({ message: "Demande de congé non trouvée" });
    }
    if (demande.statut !== 'En attente') {
      return res.status(400).json({ message: "Vous ne pouvez supprimer que les demandes en attente." });
    }
    if (demande.fichier) {
      const imagePath = path.join(__dirname, '../../public', demande.fichier);
      // Supprimer le fichier s'il existe
      if (fs.existsSync(imagePath)) {
        fs.unlink(imagePath, (err) => {
          if (err) {
            console.error("Erreur lors de la suppression du fichier:", err);
          }
        });
      }
    }
    await demande.destroy();
    return res.status(200).json({ message: "Demande supprimée avec succès." });
  } catch (error) {
    console.error("Erreur lors de la suppression de la demande:", error);
    return res.status(500).json({ message: "Erreur serveur lors de la suppression." });
  }
};

export const ListeCAnnuel = async (req, res) => {
  try {
    const ecoleId = req.user.ecoleId;
    const ecoleeId = req.user.ecoleeId;
    const roles = req.user.roles;
    const isAdminPrincipal = roles.includes("AdminPrincipal");
    const isAdministrateur = roles.includes("Administrateur");

    let liste;
    if (isAdministrateur) {
      liste = await CongeAnnuel.findAll({
        where: { archiver: 0 },
        include: [
          {
            model: EcolePrincipal,
            attributes: ["nomecole"],
          },
          {
            model: Ecole,
            attributes: ["nomecole"],
          },
        ],
      });
    } else if (isAdminPrincipal) {
      liste = await CongeAnnuel.findAll({
        where: { archiver: 0, ecoleId: ecoleId },
        include: [
          {
            model: EcolePrincipal,
            attributes: ["nomecole"],
          },
          {
            model: Ecole,
            attributes: ["nomecole"],
          },
        ],
      });
    } else {
      liste = await CongeAnnuel.findAll({
        where: {
          archiver: 0,
          [Op.and]: [{ ecoleId: ecoleId }, { ecoleeId: ecoleeId }],
        },
        include: [
          {
            model: Ecole,
            attributes: ["nomecole"],
          },
          {
            model: EcolePrincipal,
            attributes: ["nomecole"],
          },
        ],
      });
    }

    if (!liste || liste.length === 0) {
      return res.status(404).json({ message: "Pas de congé annuel trouvé." });
    }

    return res.status(200).json(liste);
  } catch (error) {
    console.error("Erreur:", error);
    res.status(500).json({ message: "Erreur serveur." });
  }
};

export const ModifierCAnnuel = async (req, res) => {
  const { id } = req.params;
  const { dateDebut, dateFin } = req.body;
  try {
    const conge = await CongeAnnuel.findByPk(id);
    if (!conge) {
      return res.status(404).json({ message: "Congé annuel non trouvé." });
    }
    conge.dateDebut = dateDebut;
    conge.dateFin = dateFin;
    await conge.save();
    return res.status(200).json({ message: "Congé annuel modifié avec succès!", conge });
  } catch (error) {
    console.error("Erreur lors de la modification du congé annuel:", error);
    return res.status(500).json({ message: "Erreur serveur." });
  }
};
export const ArchiverCAnnuel = async (req, res) => {
  try {
    const { id } = req.params;
    const [updated] = await CongeAnnuel.update(
      { archiver: 1 },
      { where: { id } }
    );

    if (updated) {
      return res.status(200).json({ message: 'archiver avec succé' });
    } else {
      return res.status(400).json({ message: 'error .' });
    }
  } catch (error) {
    console.error(error);

  }

}
export const Archiver = async (req, res) => {
  try {
    const { id } = req.params;
    const hs = await CongeAbsence.findByPk(id);
    if (!hs) {
      return res.status(404).json({ message: " non trouvée." });
    }
    await CongeAbsence.update(
      { archiver: 1 },
      { where: { id } }
    );

    return res.status(200).json({ message: "archivée avec succès." });
  } catch (error) {
    console.error("❌ Erreur lors de l'archivage :", error);
    return res.status(500).json({ message: "Erreur serveur." });
  }
};







