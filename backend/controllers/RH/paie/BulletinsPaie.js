import { Op } from 'sequelize';
import Enseignant from '../../../models/Admin/Enseignant.js';
import EcolePrincipal from '../../../models/EcolePrincipal.js';
import { Ecole, UserEcole } from '../../../models/relations.js';
import Employe from '../../../models/RH/employe.js';
import PeriodePaie from '../../../models/RH/paie/PeriodesPaie.js';
import Prime from '../../../models/RH/paie/Prime.js'
import Prime_Employe from '../../../models/RH/paie/Prime_Employe.js';
import Pointage from '../../../models/RH/pointage.js';
import Poste from '../../../models/RH/poste.js';
import Service from '../../../models/RH/service.js';
import User from '../../../models/User.js';
import JournalPaie from '../../../models/RH/paie/JournalPaie.js';
import HeuresSup from '../../../models/RH/HeuresSup.js';
import IRG from '../../../models/RH/paie/IRG.js';
import moment from 'moment';
import CongeAbsence from '../../../models/RH/congeAbsence.js';


///bultainde paie

export const FindEmploye = async (req, res) => {
  try {
    const { id } = req.params;
    console.log('lala', id)
    const profilEmploye = await Employe.findOne({
      where: { id },
      include: [
        {
          model: User,
          include: [
            { model: EcolePrincipal, attributes: ['nomecole', 'logo', 'adresse', 'emailecole', 'telephoneecole'] }
          ]
        },
        { model: Poste, attributes: ['poste'] },
        { model: Service, attributes: ['service'] },
        { model: Prime, through: Prime_Employe },
        { model: Enseignant },
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

export const FindPeriodePaie = async (req, res) => {
  try {
    const ecoleId = req.user.ecoleId;
    const idPp = req.params.id;
    const paieperiode = await PeriodePaie.findOne({
      where: { id: idPp },
      include: [
        { model: EcolePrincipal, attributes: ['nomecole'] }
      ]
    }
    );
    res.status(200).json(paieperiode);
  } catch (error) {
    console.error("Erreur lors de la recuperation:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
}


// export const listeConge = async (req, res) => {
//   try {
//     const { employeId, idPeriodepai } = req.params;

//     const findperiodepai = await PeriodePaie.findOne({
//       where: { id: idPeriodepai }
//     })
//     if (!findperiodepai) {
//       return res.status(404).json({ message: "Période de paie non trouvée" });
//     }

//     // Filtrer les congés 
 

// const CA = await CongeAbsence.findAll({
//   where: {
//     employe_id: employeId,
//     [Op.or]: [
//       {
//         dateDebut: {
//           [Op.between]: [findperiodepai.dateDebut, findperiodepai.dateFin]
//         }
//       },
//       {
//         dateFin: {
//           [Op.between]: [findperiodepai.dateDebut, findperiodepai.dateFin]
//         }
//       },
//       {
//         dateDebut: {
//           // less than or equal
//           [Op.lte]: findperiodepai.dateDebut
//         },
//         dateFin: {
//           // greater than or equal
//           [Op.gte]: findperiodepai.dateFin
//         }
//       }
//     ]
//   }
// });


//     console.log('CA is ', CA)

//     if (!CA) {
//       return res.status(404).json({ message: "CA non trouvé" });
//     }
//     return res.status(200).json(CA);
//   } catch (error) {
//     console.error("Erreur lors de la récupération  CA de l'employé :", error);
//     return res.status(500).json({ message: "Erreur serveur" });
//   }
// };

export const listeConge = async (req, res) => {
  try {
    const { employeId, idPeriodepai } = req.params;
    const findperiodepai = await PeriodePaie.findOne({
      where: { id: idPeriodepai }
    });

    if (!findperiodepai) {
      return res.status(404).json({ message: "Période de paie non trouvée" });
    }
    const CA = await CongeAbsence.findAll({
      where: {
        employe_id: employeId,
        statut:"Accepté",
        [Op.or]: [
          {
            dateDebut: {
              // dateDebut entre dateDébut et dateFin de la période
              [Op.between]: [findperiodepai.dateDebut, findperiodepai.dateFin]
            }
          },
          {
            dateFin: {
              // dateFin entre dateDébut et dateFin de la période
              [Op.between]: [findperiodepai.dateDebut, findperiodepai.dateFin]
            }
          },
          {
            // Le congé a commencé avant la période et se termine après
            dateDebut: { [Op.lte]: findperiodepai.dateDebut },
            dateFin: { [Op.gte]: findperiodepai.dateFin }
          }
        ]
      }
    });

    if (!CA || CA.length === 0) {
      return res.status(200).json({ message: "Aucun congé durant cette période", totalJours: 0, details: [] });
    }
    const periodeDebut = moment(findperiodepai.dateDebut);
    const periodeFin = moment(findperiodepai.dateFin);

    let totalJours = 0;
    let details = [];

    CA.forEach(conge => {
      const jours = calculerJoursDansPeriode(conge, periodeDebut, periodeFin);
      totalJours += jours;

      details.push({
        id: conge.id,
        type: conge.type_demande,
        statut: conge.statut,
        dateDebut: conge.dateDebut,
        dateFin: conge.dateFin,
        joursConsommesDansPeriode: jours
      });
    });

    return res.status(200).json({ totalJours, details });

  } catch (error) {
    console.error("Erreur lors de la récupération des congés :", error);
    return res.status(500).json({ message: "Erreur serveur" });
  }
};

function calculerJoursDansPeriode(conge, periodeDebut, periodeFin) {
  const debut = moment.max(moment(conge.dateDebut), moment(periodeDebut));
  const fin = moment.min(moment(conge.dateFin), moment(periodeFin));
  const diff = fin.diff(debut, 'days') + 1;
  return diff > 0 ? diff : 0;
}

export const FindPointage = async (req, res) => {
  try {
    const { employeId, idPeriodepai } = req.params;

    const findperiodepai = await PeriodePaie.findOne({
      where: { id: idPeriodepai }
    })
    if (!findperiodepai) {
      return res.status(404).json({ message: "Période de paie non trouvée" });
    }

    // Filtrer les pointages entre dateDebut et dateFin
    const pointages = await Pointage.findAll({
      where: {
        employe_id: employeId,
        date: {
          [Op.between]: [findperiodepai.dateDebut, findperiodepai.dateFin]
        }
      }
      , include: [{ model: HeuresSup }]
    });

    console.log('pintages is ', pointages)

    if (!pointages) {
      return res.status(404).json({ message: "pointages non trouvé" });
    }
    return res.status(200).json(pointages);
  } catch (error) {
    console.error("Erreur lors de la récupération  pointages de l'employé :", error);
    return res.status(500).json({ message: "Erreur serveur" });
  }
};

// export const journalpaie = async (req, res) => {
//   try {

//     const dataWithDate = {...req.body,date: new Date(),  };
//     const newJournalPaie = await JournalPaie.create(dataWithDate);
//     res.status(201).json(newJournalPaie);

//   } catch (error) {
//     console.error("Erreur lors de l'ajout :", error);
//     res.status(500).json({ message: "Erreur serveur" });
//   }
// };
export const journalpaie = async (req, res) => {
  try {

    console.log('requete.body', req.body)
    const { periodePaieId, idEmploye } = req.body;

    const [journalPaie, created] = await JournalPaie.findOrCreate({
      where: {
        periodePaieId: periodePaieId,
        idEmploye: idEmploye
      },
      defaults: {
        ...req.body,
        date: new Date()
      }
    });

    // Si l'entrée existait déjà (created = false), on fait une mise à jour
    if (!created) {
      await journalPaie.update({
        ...req.body,
        date: new Date()
      });
    }

    res.status(200).json({
      message: created ? 'Nouveau bulletin créé' : 'Bulletin mis à jour',
      data: journalPaie
    });

  } catch (error) {
    console.error("Erreur:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
}

export const liste = async (req, res) => {
  try {

    const ecoleId = req.user.ecoleId;
    const journalPaie = await JournalPaie.findAll(
      {
        where: { archiver: 0 },
        include: [
          {
            model: PeriodePaie,
            where: { ecoleId  ,statut:'Clôturée'},
            include: [{ model: EcolePrincipal, attributes: ['nomecole', 'adresse', 'emailecole'] }]
          },
          {model:Employe,attributes: ['id','declaration'],
            include:[{model:User,attributes:['statuscompte']}]}
        ]
      }
    );
    res.status(200).json(journalPaie);
  } catch (error) {
    console.error("Erreur lors de la recuperation:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
}

export const ArchiverJournalPaie = async (req, res) => {
  try {
    const { id } = req.params;
    const jp = await JournalPaie.findByPk(id);
    if (!jp) {
      return res.status(404).json({ message: " non trouvée." });
    }
    await JournalPaie.update(
      { archiver: 1 },
      { where: { id } }
    );
    return res.status(200).json({ message: " archivée avec succès." });
  } catch (error) {
    console.error("❌ Erreur lors de l'archivage :", error);
    return res.status(500).json({ message: "Erreur serveur." });
  }
};

// Vérifier si un enregistrement existe déjà pour un employé et une période de paie donnée
export const findeEnregistrer = async (req, res) => {
  try {
    const { employeId, periodePaieId } = req.params;
    const recordExists = await JournalPaie.findOne({
      where: {
        idEmploye: employeId,
        periodePaieId: periodePaieId,
      },
    });
    // Renvoyer une réponse JSON
    if (recordExists) {
      res.status(200).json({ exists: true });
    } else {
      res.status(200).json({ exists: false });
    }
  } catch (error) {
    console.error("Erreur lors de la vérification de l'enregistrement :", error);
    res.status(500).json({ message: "Erreur lors de la vérification de l'enregistrement" });
  }
}

export const getIRG = async (req, res) => {
  try {
    const year = moment().format('YYYY');
    const irgs = await IRG.findAll(
      {
        where: {
          archiver: 0,
          annee_fiscale: year,
          pays: 'DZ',
        }
      }
    );
    res.status(200).json(irgs);
  } catch (error) {
    console.error("Erreur lors de la recuperation:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
}

export const ImprimerBTE = async (req, res) => {
  try {
    const { idPeriodepai, employe_id } = req.params;
    console.log('idPeriodepai, ', idPeriodepai, 'employe_id', employe_id)
    const journal = await JournalPaie.findOne({
      where: {
        periodePaieId: idPeriodepai,
        idEmploye: employe_id
      },
    });
    res.status(200).json(journal);
  } catch (error) {
    console.error("Erreur:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }

}

export const ImprimerBTEmploye = async (req, res) => {
  try {
    const { idPeriodepai, employe_id } = req.params;
    const PP = await PeriodePaie.findOne({ where: { id: idPeriodepai } });

    if (!PP) {
      return res.status(404).json({ message: "Période de paie introuvable" });
    }
    const statutPP = PP.statut;
    if (statutPP === 'Clôturée') {
      const journal = await JournalPaie.findOne({
        where: {
          periodePaieId: idPeriodepai,
          idEmploye: employe_id
        }
      });
      if (!journal) {
        return res.status(404).json({ message: "Journal de paie introuvable" });
      }

      return res.status(200).json(journal);
    } else {
      return res.status(400).json({ message: "La période de paie n'est pas clôturée" });
    }
  } catch (error) {
    console.error("Erreur lors de la récupération du journal de paie :", error);
    return res.status(500).json({ message: "Erreur serveur" });
  }
}

export const VoirFichesPaie = async (req, res) => {
  try {

    const ecoleId = req.user.ecoleId;
    const journalPaie = await JournalPaie.findAll(
      {
        where: { archiver: 0 },

        include: [
          {
            model: PeriodePaie, attributes: ["id", "code", "dateDebut", "dateFin", "statut"],
            where: { ecoleId, statut: 'Clôturée' },
            include: [{ model: EcolePrincipal, attributes: ['nomecole'] }]
          },
          {
            model: Employe, attributes: ['photo', 'daterecru','declaration'],
            include: [{ model: Poste, attributes: ['poste'] }, { model: Service, attributes: ['service'], }]
          }
        ]
      }
    );
    res.status(200).json(journalPaie);
  } catch (error) {
    console.error("Erreur lors de la recuperation:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
}

export const publierJournal = async (req, res) => {
  const { bulletins } = req.body;

  if (!bulletins || !Array.isArray(bulletins)) {
    return res.status(400).json({ message: "Liste invalide" });
  }
  try {
    await JournalPaie.update(
      { statut: 'Publié' },
      { where: { id: bulletins } }
    );
    res.status(200).json({ message: "Bulletins publiés" });
  } catch (error) {
    console.error("Erreur:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
}

export const JPEmploye = async (req, res) => {
  try {
    const id = req.user.id;
    const employe = await Employe.findOne({ where: { userId: id } })
    const journal = await JournalPaie.findAll({
      where: {
        idEmploye: employe.id,
        statut: 'Publié'
      },
      include:[{model:PeriodePaie,attributes:['dateDebut','dateFin']}]
    });
    res.status(200).json(journal);
  } catch (error) {
    console.error("Erreur:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }

}



export const listeCongeNonEmploye = async (req, res) => {
  try {
    const { employeId } = req.params; 
    const dateActuelle = moment().format("YYYY-MM-DD");
   
    const CA = await CongeAbsence.findAll({
      where: {
        statut:"Accepté",
        employe_id: employeId,
        type_demande:"Congé Annuel"
      },
      order: [['createdAt', 'DESC']]  
    });

    if (!CA || CA.length === 0) {
      return res.status(200).json({ message: "Aucun congé " ,  dateActuelle});
    }
    return res.status(200).json({
      dateActuelle,
      conges: CA
    });

  } catch (error) {
    console.error("Erreur lors de la récupération des congés :", error);
    return res.status(500).json({ message: "Erreur serveur" });
  }
};
