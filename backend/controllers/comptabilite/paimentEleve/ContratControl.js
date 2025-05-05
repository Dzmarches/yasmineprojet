
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import Contrat from '../../../models/comptabilite/PaimentEtudiant/Contrat.js';
import Niveaux from '../../../models/Admin/Niveaux.js';
import User from '../../../models/User.js';
import Anneescolaire from '../../../models/Admin/Anneescolaires.js';
import EcolePrincipal from '../../../models/EcolePrincipal.js';
import TypeRevenue from '../../../models/comptabilite/TypeRevenue.js';
import Ecole from '../../../models/Admin/Ecole.js';
import Revenu from '../../../models/comptabilite/Revenu.js';
import Eleve from '../../../models/Admin/Eleve.js';
import PlanningPaiement from '../../../models/comptabilite/PaimentEtudiant/PlanningPaiement.js';
import sequelize from '../../../config/Database.js';
import moment from 'moment-timezone';
import UserEcole from '../../../models/Admin/UserEcole.js';
import Parent from '../../../models/Admin/Parent.js';
import { Op } from 'sequelize';
import JournalPaie from '../../../models/RH/paie/JournalPaie.js';

const __filename = fileURLToPath(import.meta.url);
// Obtenir le répertoire du fichier
const __dirname = path.dirname(__filename)


export const Liste = async (req, res) => {
  try {
    const ecoleId = req.user.ecoleId;
    const ecoleeId = req.user.ecoleeId;
    const roles = req.user.roles;

    const isAdminPrincipal = roles.includes('AdminPrincipal');

    const includeEcole = {
      model: Ecole, through: UserEcole, attributes: ['nomecole']
    };
    if (ecoleeId) {
      includeEcole.where = { id: ecoleeId };
      includeEcole.required = true;
    }

    let hps;
    if (isAdminPrincipal) {
      console.log('AdminPrincipal détecté');
      hps = await Contrat.findAll({
        where: { archiver: 0 },
        order: [['createdAt', 'DESC']],
        include: [
          { model: Anneescolaire, attributes: ['id', 'datedebut', 'datefin'] },
          {
            model: Eleve, attributes: ['id', 'fraixinscription', 'numinscription'],
            include: [
              { model: Niveaux, attributes: ['id', 'nomniveau', 'nomniveuarab', 'cycle'] },
              {
                model: User, where: { ecoleId }, attributes: ['id', 'nom', 'prenom', 'datenaiss', 'adresse'],
                include: [
                  { model: EcolePrincipal, where: { id: ecoleId }, attributes: ['nomecole', 'adresse'] },
                  includeEcole
                ]
              }
            ]
          },
        ],
      });
    }
    else {
      console.log('Autre rôle détecté');
      hps = await Contrat.findAll({
        where: { archiver: 0 },
        order: [['createdAt', 'DESC']],
        include: [
          { model: Anneescolaire, attributes: ['id', 'datedebut', 'datefin'] },
          {
            model: Eleve, attributes: ['id', 'fraixinscription', 'numinscription'],
            include: [
              { model: Niveaux, attributes: ['id', 'nomniveau', 'nomniveuarab', 'cycle'] },
              {
                model: User, where: { ecoleId }, attributes: ['id', 'nom', 'prenom', 'datenaiss'],
                include: [
                  { model: EcolePrincipal, where: { id: ecoleId }, attributes: ['nomecole'] },
                  includeEcole
                ]
              }
            ]
          },
        ],
      });

    }
    res.status(200).json(hps);
  } catch (error) {
    console.error("Erreur lors de la recuperation:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
}
export const Archiver = async (req, res) => {
  try {
    const { id } = req.params;

    const hs = await Contrat.findByPk(id);
    if (!hs) {
      return res.status(404).json({ message: "Contrat non trouvé." });
    }

    await Contrat.update(
      { archiver: 1 },
      { where: { id } }
    );

    const pp = await PlanningPaiement.findAll({ where: { ContratId: hs.id } });

    // Archiver chaque planning
    for (let i = 0; i < pp.length; i++) {
      await pp[i].update({ archiver: 1 });
    }
    return res.status(200).json({ message: "Contrat et plannings archivés avec succès." });

  } catch (error) {
    console.error("❌ Erreur lors de l'archivage :", error);
    return res.status(500).json({ message: "Erreur serveur." });
  }
};


export const Find = async (req, res) => {
  const { id } = req.params;
  const { ecoleId } = req.user;
  const { ecoleeId } = req.user;
  const roles = req.user.roles;
  const isAdminPrincipal = roles.includes('AdminPrincipal');

  const includeEcole = {
    model: Ecole, through: UserEcole, attributes: ['nomecole']
  };

  if (ecoleeId) {
    includeEcole.where = { id: ecoleeId };
    includeEcole.required = true;
  }

  try {

    const find = await Contrat.findByPk(id);

    if (find) {
      let planning;
      if (isAdminPrincipal) {

        planning = await PlanningPaiement.findAll({
          where: { ContratId: id, archiver: 0 }

          , include: [{
            model: Contrat, attributes: ['code', 'totalApayer', 'date_debut_paiement', 'date_sortie',
              'date_creation'],
            include: [
              { model: Anneescolaire, attributes: ['id', 'datedebut', 'datefin'] },
              {
                model: Eleve, attributes: ['id', 'fraixinscription', 'numinscription'],
                include: [
                  { model: Niveaux, attributes: ['id', 'nomniveau', 'nomniveuarab', 'cycle'] },
                  {
                    model: User, where: { ecoleId }, attributes: ['id', 'nom', 'prenom', 'datenaiss',
                      'adresse', 'nom_ar', 'prenom_ar', 'lieuxnaiss', 'lieuxnaiss_ar', 'adresse', 'adresse_ar'],
                    include: [
                      { model: EcolePrincipal, where: { id: ecoleId }, attributes: ['nomecole', 'adresse'] },
                      includeEcole
                    ]
                  },
                  {
                    model: Parent, attributes: ['typerole'],
                    through: { attributes: [] }, include: [{
                      model: User,
                      attributes: ['nom', 'prenom', 'email', 'telephone', 'adresse']
                    }
                    ]
                  },
                ]
              },
            ],
          }]

        });
      } else {
        console.log('Autre rôle détecté');
        planning = await Contrat.findAll({
          where: { archiver: 0 },
          order: [['createdAt', 'DESC']],
          include: [
            { model: Anneescolaire, attributes: ['id', 'datedebut', 'datefin'] },
            {
              model: Eleve, attributes: ['id', 'fraixinscription', 'numinscription'],
              include: [
                {
                  model: Parent,
                  through: { attributes: [] }, include: [{
                    model: User,
                    attributes: ['nom', 'prenom', 'email', 'telephone']
                  }
                  ]
                },
                { model: Niveaux, attributes: ['id', 'nomniveau', 'nomniveuarab', 'cycle'] },
                {
                  model: User, where: { ecoleId }, attributes: ['id', 'nom', 'prenom', 'datenaiss', 'adresse',
                    'nom_ar', 'prenom_ar'],
                  include: [
                    { model: EcolePrincipal, where: { id: ecoleId }, attributes: ['nomecole'] },
                    includeEcole
                  ]
                }

              ]
            },
          ],
        });

      }

      return res.status(200).json(planning);
    } else {
      return res.status(404).json({ message: "Planning non trouvé" });
    }
  } catch (error) {
    console.error('Erreur lors de la mise à jour', error);
    return res.status(500).json({ message: 'Erreur serveur lors de la mise à jour' });
  }
};


// export const Ajouter = async (req, res) => {
//   const t = await sequelize.transaction();
//   try {
//     const {
//       eleve, annee_scolaire, niveau, code, date_debut_paiement,
//       date_creation, remarque, nombre_echeances, typePaiment,
//       totalApayer, frais_insc
//     } = req.body;

//     const existing = await Contrat.findOne({ where: { code } });
//     if (existing) {
//       return res.status(400).json({ message: "code existe déjà" });
//     }

//     const newContrat = await Contrat.create({
//       code,
//       date_debut_paiement,
//       date_creation,
//       remarque,
//       nombre_echeances,
//       typePaiment,
//       totalApayer,
//       niveauId: niveau,
//       annescolaireId: annee_scolaire,
//       eleveId: eleve
//     }, { transaction: t });

//     await Eleve.update(
//       { fraixinscription: frais_insc },
//       { where: { id: eleve }, transaction: t }
//     );

//     let paiements = [];
//     // let dateEcheance = moment(date_debut_paiement);
//    let dateEcheance = moment.tz(date_debut_paiement, "Africa/Algiers").startOf('day').add(12, 'hours')
//     let montantParEcheance;
//     let nbEcheances;
//     let intervalMois;

//     console.log('dateceheances',dateEcheance)

//     switch (typePaiment) {
//       // case 'Paiement immédiat':
//       //   nbEcheances = 1;
//       //   intervalMois = 0;
//       //   montantParEcheance = totalApayer;
//       //   break;

//       case 'Paiement mensuel':
//         nbEcheances = nombre_echeances;
//         intervalMois = 1;
//         montantParEcheance = (totalApayer / nbEcheances).toFixed(2);
//         break;

//       case 'Paiement trimestriel':
//         nbEcheances = 4;
//         intervalMois = 3;
//         montantParEcheance = (totalApayer / 4).toFixed(2);
//         break;

//       case 'Paiement semestriel':
//         nbEcheances = 2;
//         intervalMois = 6;
//         montantParEcheance = (totalApayer / 2).toFixed(2);
//         break;

//       case 'Paiement annuel':
//         nbEcheances = 1;
//         intervalMois = 12;
//         // intervalMois = 12;
//         montantParEcheance = totalApayer;
//         break;

//       // case 'Paiement échelonné':
//       //   nbEcheances = nombre_echeances;
//       //   intervalMois = 1; // à personnaliser si besoin
//       //   montantParEcheance = (totalApayer / nbEcheances).toFixed(2);
//       //   break;
//     }

//     // 🛠 Boucle de génération d’échéances
//     for (let i = 0; i < nbEcheances; i++) {
//       paiements.push({
//         ContratId: newContrat.id,
//         codePP: `${code}-ECH-${i + 1}`,
//         date_echeance: dateEcheance.clone().toDate(),  // IMPORTANT: utiliser .clone()
//         montant_echeance: montantParEcheance,
//         montant_restant: montantParEcheance,
//         etat_paiement: 'non payé',
//         date_paiement: null,
//         mode_paiement: '',
//         notification: 0,
//         archiver: 0,
//       });

//       if (intervalMois > 0) {
//         dateEcheance.add(intervalMois, 'month'); // juste ici ajouter 1 mois, sans console.log
//       }
//     }


//     // ✅ Une seule fois ici, après la boucle
//     await PlanningPaiement.bulkCreate(paiements, { transaction: t });

//     await t.commit();
//     res.status(201).json({ message: "Contrat ajouté avec succès" });

//   } catch (error) {
//     await t.rollback();
//     console.error("Erreur transactionnelle :", error);
//     res.status(500).json({ message: "Erreur serveur lors de l'ajout" });
//   }
// };

// controllers/contratController.js



export const Ajouter = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const {
      eleve, annee_scolaire, niveau, code, date_debut_paiement,
      date_creation, remarque, typePaiment,
      totalApayer, frais_insc, date_sortie
    } = req.body;

    // Vérification si le contrat existe déjà
    const existing = await Contrat.findOne({ where: { code } });
    if (existing) {
      return res.status(400).json({ message: "Code existe déjà" });
    }
    // Création du nouveau contrat
    const newContrat = await Contrat.create({
      code,
      date_debut_paiement,
      date_creation,
      remarque,
      typePaiment,
      totalApayer,
      date_sortie,
      niveauId: niveau,
      annescolaireId: annee_scolaire,
      eleveId: eleve
    }, { transaction: t });



    // Mise à jour des frais d'inscription
    await Eleve.update(
      { fraixinscription: frais_insc },
      { where: { id: eleve }, transaction: t }
    );

    let paiements = [];
    let dateEcheance = moment.tz(date_debut_paiement, "Africa/Algiers").startOf('day').add(12, 'hours');
    let intervalMois;

    // Définir l'intervalle de mois en fonction du type de paiement
    switch (typePaiment) {
      case 'Paiement mensuel':
        intervalMois = 1;
        break;
      case 'Paiement trimestriel':
        intervalMois = 3;
        break;
      case 'Paiement semestriel':
        intervalMois = 6;
        break;
      case 'Paiement annuel':
        // intervalMois = 12;
        intervalMois = 12;
        break;
      default:
        return res.status(400).json({ message: "Type de paiement non valide" });
    }

    // Calculer le nombre d'échéances automatiquement
    let totalMois = moment(date_sortie).diff(moment(date_debut_paiement), 'months', true);
    totalMois = Math.ceil(totalMois); // arrondir vers le haut
    let nbEcheances = Math.ceil(totalMois / intervalMois);

    // Calcul du montant par échéance
    let montantParEcheance = (totalApayer / nbEcheances).toFixed(2);

    // Génération des paiements
    for (let i = 0; i < nbEcheances; i++) {
      if (dateEcheance.isBefore(moment(date_sortie))) {
        paiements.push({
          ContratId: newContrat.id,
          codePP: `${code}-ECH-${i + 1}`,
          date_echeance: dateEcheance.clone().toDate(),
          montant_echeance: montantParEcheance,
          montant_restant: montantParEcheance,
          etat_paiement: 'non payé',
          date_paiement: null,
          mode_paiement: '',
          notification: 0,
          archiver: 0,
        });
      } else {
        break;
      }
      // Avancer la date pour la prochaine échéance
      dateEcheance.add(intervalMois, 'months');
    }

    if (paiements.length === 0) {
      return res.status(400).json({ message: "Les paiements ne peuvent pas dépasser la date de sortie" });
    }

    // Insertion des paiements dans la base
    await PlanningPaiement.bulkCreate(paiements, { transaction: t });

    await t.commit();
    res.status(201).json({ message: "Contrat ajouté avec succès" });

  } catch (error) {
    await t.rollback();
    console.error("Erreur transactionnelle :", error);
    res.status(500).json({ message: "Erreur serveur lors de l'ajout" });
  }
};

// export const ModifierContrat = async (req, res) => {
//   const t = await sequelize.transaction();
//   try {
//     const contratId = req.params.id;
//     const {
//       eleve,
//       annee_scolaire,
//       niveau,
//       code,
//       date_debut_paiement,
//       date_creation,
//       remarque,
//       typePaiment,
//       totalApayer,
//       frais_insc,
//       date_sortie
//     } = req.body;

//     // 1) retrouver le contrat
//     const contrat = await Contrat.findByPk(contratId, { transaction: t });
//     if (!contrat) {
//       await t.rollback();
//       return res.status(404).json({ message: "Contrat non trouvé" });
//     }

//     // 2) contrôle unique du code (si modifié)
//     if (code !== contrat.code) {
//       const exist = await Contrat.findOne({ where: { code }, transaction: t });
//       if (exist) {
//         await t.rollback();
//         return res.status(400).json({ message: "Ce code de contrat existe déjà" });
//       }
//     }
//     // 3) mise à jour du contrat
//     await contrat.update({
//       code,
//       date_debut_paiement,
//       date_creation,
//       remarque,
//       typePaiment,
//       totalApayer,
//       niveauId: niveau,
//       annescolaireId: annee_scolaire,
//       eleveId: eleve,date_sortie
//     }, { transaction: t });

//     // 4) mise à jour du frais d’inscription de l’élève
//     await Eleve.update(
//       { fraixinscription: frais_insc },
//       { where: { id: eleve }, transaction: t }
//     );

//     await t.commit();
//     return res.status(200).json({ message: "Contrat mis à jour avec succès", contrat });
//   }
//   catch (error) {
//     await t.rollback();
//     console.error("Erreur transactionnelle lors de la modification :", error);
//     return res.status(500).json({ message: "Erreur serveur lors de la modification" });
//   }
// };



//plannig :
export const ModifierContrat = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const contratId = req.params.id;
    const {
      eleve,
      annee_scolaire,
      niveau,
      code,
      date_debut_paiement,
      date_creation,
      remarque,
      typePaiment,
      totalApayer,
      frais_insc,
      date_sortie
    } = req.body;

    // 1) Récupérer le contrat
    const contrat = await Contrat.findByPk(contratId, { transaction: t });
    if (!contrat) {
      await t.rollback();
      return res.status(404).json({ message: "Contrat non trouvé" });
    }

    // 2) Vérifier s'il y a des paiements non archivés
    const plannings = await PlanningPaiement.findAll({ where: { ContratId: contratId }, transaction: t });
    const planningsNonArchives = plannings.filter(p => p.archiver === 0);
    const canModifyPayments = planningsNonArchives.length === 0; // Pas de paiements actifs, donc modification autorisée

    if (canModifyPayments) {
      // On peut modifier totalApayer et date_debut_paiement
      let paiements = [];
      let dateEcheance = moment.tz(date_debut_paiement, "Africa/Algiers").startOf('day').add(12, 'hours');
      let intervalMois;

      // Définir l'intervalle de mois en fonction du type de paiement
      switch (typePaiment) {
        case 'Paiement mensuel':
          intervalMois = 1;
          break;
        case 'Paiement trimestriel':
          intervalMois = 3;
          break;
        case 'Paiement semestriel':
          intervalMois = 6;
          break;
        case 'Paiement annuel':
          intervalMois = 12;
          break;
        default:
          return res.status(400).json({ message: "Type de paiement non valide" });
      }

      // Calculer le nombre d'échéances automatiquement
      let totalMois = moment(date_sortie).diff(moment(date_debut_paiement), 'months', true);
      totalMois = Math.ceil(totalMois); // arrondir vers le haut
      let nbEcheances = Math.ceil(totalMois / intervalMois);

      // Calcul du montant par échéance
      let montantParEcheance = (totalApayer / nbEcheances).toFixed(2);

      // Générer les paiements
      for (let i = 0; i < nbEcheances; i++) {
        if (dateEcheance.isBefore(moment(date_sortie))) {
          paiements.push({
            ContratId: contrat.id,
            codePP: `${code}-ECH-${i + 1}`,
            date_echeance: dateEcheance.clone().toDate(),
            montant_echeance: montantParEcheance,
            montant_restant: montantParEcheance,
            etat_paiement: 'non payé',
            date_paiement: null,
            mode_paiement: '',
            notification: 0,
            archiver: 0,
          });
        } else {
          break;
        }

        // Avancer la date pour la prochaine échéance
        dateEcheance.add(intervalMois, 'months');
      }

      if (paiements.length === 0) {
        return res.status(400).json({ message: "Les paiements ne peuvent pas dépasser la date de sortie" });
      }

      // Insertion des paiements dans la base
      await PlanningPaiement.bulkCreate(paiements, { transaction: t });
    } else {
      // Si des paiements non archivés existent, on ne peut pas changer les montants ou dates liés au paiement
      // return res.status(400).json({ message: "Impossible de modifier : il reste des paiements non archivés" });
      await contrat.update({
        code,
        remarque,
        niveauId: niveau,
        annescolaireId: annee_scolaire,
        eleveId: eleve,
        date_creation
      }, { transaction: t });

      // 5) Mise à jour des frais d'inscription
      await Eleve.update(
        { fraixinscription: frais_insc },
        { where: { id: eleve }, transaction: t }
      );

    }

    // 3) Vérifier le code et si ce n'est pas le même, vérifier s'il existe déjà
    if (code !== contrat.code) {
      const exist = await Contrat.findOne({ where: { code }, transaction: t });
      if (exist) {
        await t.rollback();
        return res.status(400).json({ message: "Ce code de contrat existe déjà" });
      }
    }

    // 4) Mise à jour du contrat
    await contrat.update({
      code,
      date_debut_paiement,
      date_creation,
      remarque,
      typePaiment,
      totalApayer,
      niveauId: niveau,
      annescolaireId: annee_scolaire,
      eleveId: eleve,
      date_sortie
    }, { transaction: t });

    // 5) Mise à jour des frais d'inscription
    await Eleve.update(
      { fraixinscription: frais_insc },
      { where: { id: eleve }, transaction: t }
    );

    await t.commit();
    return res.status(200).json({ message: "Contrat mis à jour avec succès" });
  } catch (error) {
    await t.rollback();
    console.error("Erreur transactionnelle lors de la modification :", error);
    return res.status(500).json({ message: "Erreur serveur lors de la modification" });
  }
};
export const MidifierPlanning = async (req, res) => {

  const planningId = req.params.id;

  const { code, montant_echeance, montant_restant, etat_paiement, date_paiement,
    mode_paiement, date_echeance } = req.body;

  try {
    // Trouver le planning avec l'ID
    const planning = await PlanningPaiement.findByPk(planningId);
    if (!planning) {
      return res.status(404).json({ message: 'Planning non trouvé' });
    }

    // Mettre à jour les champs du planning
    planning.codePP = code;
    planning.montant_echeance = montant_echeance;
    planning.montant_restant = montant_restant;
    planning.etat_paiement = etat_paiement;
    planning.date_paiement = date_paiement;
    planning.date_echeance = date_echeance;
    // Vérification de la date_paiement, si elle est null ou vide, on la garde à null
    planning.date_paiement = date_paiement ? date_paiement : null;
    planning.mode_paiement = mode_paiement;

    await planning.save();
    res.status(200).json({ message: 'Planning mis à jour avec succès', planning });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

export const ListePlanning = async (req, res) => {
  try {
    const ecoleId = req.user.ecoleId;
    const ecoleeId = req.user.ecoleeId;
    const roles = req.user.roles;

    const isAdminPrincipal = roles.includes('AdminPrincipal');
    const includeEcole = {
      model: Ecole,
      attributes: ['nomecole', 'id']
    };
    if (ecoleeId) {
      includeEcole.where = { id: ecoleeId };
      includeEcole.required = true;
    }
    let hps;
    if (isAdminPrincipal) {
      console.log('AdminPrincipal détecté');
      hps = await PlanningPaiement.findAll({
        where: { archiver: 0 },
        order: [['createdAt', 'DESC']],
        include: [
          {
            model: Contrat, attributes: ['id', 'code'],
            include: [
              {
                model: Eleve, attributes: ['id', 'fraixinscription', 'numinscription'],
                include: [{ model: User, attributes: ['nom', 'prenom'] }]
              },
              { model: Niveaux, attributes: ['id', 'nomniveau', 'cycle'] },
              { model: Anneescolaire, attributes: ['id', 'datedebut', 'datefin'] },

            ],

          },
        ],
      });
    }
    else {
      console.log('Autre rôle détecté');
      hps = await PlanningPaiement.findAll({
        where: { archiver: 0 },
        order: [['createdAt', 'DESC']],
        include: [
          {
            model: Contrat, attributes: ['id', 'code'],
            include: [
              {
                model: Eleve, attributes: ['fraixinscription', 'numinscription'],
                include: [{ model: User, attributes: ['nom', 'prenom'] }]
              },
              { model: Niveaux, attributes: ['nomniveau', 'cycle'] },
              { model: Anneescolaire, attributes: ['datedebut', 'datefin'] },

            ],

          },
        ],
      });
    }
    res.status(200).json(hps);
  } catch (error) {
    console.error("Erreur lors de la recuperation:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
}

export const Archiverpp = async (req, res) => {
  try {
    const { id } = req.params;

    console.log("archiver id", id);
    const hs = await PlanningPaiement.findByPk(id);
    if (!hs) {
      return res.status(404).json({ message: "Planning non trouvé." });
    }
    await PlanningPaiement.update(
      { archiver: 1 },
      { where: { id } }
    );
    return res.status(200).json({ message: "plannings archivé avec succès." });

  } catch (error) {
    console.error("❌ Erreur lors de l'archivage :", error);
    return res.status(500).json({ message: "Erreur serveur." });
  }
};


// comptabilite statistic
export const StatePE = async (req, res) => {
  try {
    const { ecoleId } = req.user;

    const contrats = await Contrat.findAll({
      where: { archiver: 0 },
      include: [
        {
          model: Eleve,
          include: [{
            model: User,
            where: { ecoleId },
            attributes: []
          }]
        },
        {
          model: Anneescolaire,
          attributes: ['id', 'datedebut', 'datefin']
        },
        {
          model: PlanningPaiement,
          where: { archiver: 0 },
          required: false,
          attributes: ['id', 'montant_echeance', 'etat_paiement', 'date_echeance']
        }
      ],
      attributes: ['id', 'totalApayer', 'annescolaireId']
    });

    const stats = {
      totalPaye: 0,
      totalNonPaye: 0,
      totalContrat: 0, // <--- ajouté ici
      totalContrats: contrats.length,
      parAnneeScolaire: {}
    };

    const aujourdhui = moment().startOf('day');

    contrats.forEach(contrat => {
      const totalApayer = parseFloat(contrat.totalApayer) || 0; // <--- correction ici

      stats.totalContrat += totalApayer;

      const paiements = contrat.PlanningPaiements || [];
      const anneeKey = contrat.Anneescolaire
        ? `${moment(contrat.Anneescolaire.datedebut).format('YYYY')}/${moment(contrat.Anneescolaire.datefin).format('YYYY')}`
        : 'Inconnue';

      if (!stats.parAnneeScolaire[anneeKey]) {
        stats.parAnneeScolaire[anneeKey] = {
          paye: 0,
          nonPaye: 0,
          totalContrat: 0, // <--- ajouté ici
          contrats: 0
        };
      }

      stats.parAnneeScolaire[anneeKey].contrats += 1;
      stats.parAnneeScolaire[anneeKey].totalContrat += totalApayer;

      paiements.forEach(paiement => {
        const montant = parseFloat(paiement.montant_echeance) || 0;
        const estPaye = paiement.etat_paiement === 'payé';

        if (estPaye) {
          stats.totalPaye += montant;
          stats.parAnneeScolaire[anneeKey].paye += montant;
        } else {
          stats.totalNonPaye += montant;
          stats.parAnneeScolaire[anneeKey].nonPaye += montant;
        }
      });
    });

    const result = {
      totalPaye: stats.totalPaye.toFixed(2),
      totalNonPaye: stats.totalNonPaye.toFixed(2),
      totalContrat: stats.totalContrat.toFixed(2), // <--- ajouté ici
      totalContrats: stats.totalContrats,
      parAnneeScolaire: Object.entries(stats.parAnneeScolaire).map(([annee, data]) => ({
        annee,
        paye: data.paye.toFixed(2),
        nonPaye: data.nonPaye.toFixed(2),
        totalContrat: data.totalContrat.toFixed(2), // <--- ajouté ici
        contrats: data.contrats,
        taux: data.paye > 0 ? ((data.paye / (data.paye + data.nonPaye)) * 100).toFixed(2) : 0
      }))
    };
    res.json(result);

  } catch (error) {
    console.error("Erreur dans StatePE:", {
      message: error.message,
      stack: error.stack,
      query: error.query
    });

    res.status(500).json({
      message: "Erreur lors du calcul des statistiques",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

//DashboardCompt 

export const DashboardCompt = async (req, res) => {
  try {

    const { ecoleId } = req.user;
    const { ecoleeId } = req.user;
    const includeEcole = {
      model: Ecole,
      attributes: ['nomecole', 'id']
    };

    if (ecoleeId) {
      includeEcole.where = { id: ecoleeId };
      includeEcole.required = true;
    }
    console.log('req', req.body);
    const months = [
      'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
      'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
    ];

    const ceMoisLabel = req.body.selectedMonth;
    const ceMoisIndex = months.indexOf(ceMoisLabel);
    const ceMois = ceMoisIndex !== -1 ? ceMoisIndex + 1 : null;

    const yearId = req.body.selectedYear;
    const annee = await Anneescolaire.findByPk(yearId);
    if (!annee || !ceMois) {
      return res.status(400).json({ error: "Mois ou année invalide." });
    }

    const dateDebutAnnee = moment(annee.datedebut);
    const dateFinAnnee = moment(annee.datefin);
    const anneeCible =
      ceMois >= dateDebutAnnee.month() + 1 ? dateDebutAnnee.year() : dateFinAnnee.year();

    const dateStart = moment(`${anneeCible}-${ceMois.toString().padStart(2, '0')}-01`).startOf('month').toDate();
    const dateEnd = moment(dateStart).endOf('month').toDate();
    console.log('dateStart', dateStart, 'dateEnd', dateEnd)


    //--------------paiment etudiant
    const paiements = await PlanningPaiement.findAll({
      where: {
        date_echeance: { [Op.between]: [dateStart, dateEnd] },
        archiver: 0
      },
      include: [{
        model: Contrat, attributes: ['code', 'totalApayer'],
        include: [{
          model: Eleve, attributes: ['numinscription', 'fraixinscription'],
          include: [{
            model: User, attributes: ['nom', 'prenom', 'ecoleId'],
            include: [
              { model: EcolePrincipal, where: { id: ecoleId }, attributes: ['nomecole', 'adresse'] },
              includeEcole
            ]
          }]
        }]
      }]
    });

    let totalPaye = 0;
    let totalNonPaye = 0;
    for (const paiement of paiements) {
      const montant = parseFloat(paiement.montant_echeance || 0);
      if (paiement.etat_paiement === 'payé') {
        totalPaye += montant;
      } else {
        totalNonPaye += montant;
      }
    }
    //-----Frais Insc a payé 
    const FraisInsc = await Eleve.findAll({
      where: {
        datedinscriptionEncour: { [Op.between]: [dateStart, dateEnd] },
        archiver: 0
      },
      include: [{
        model: User,
        attributes: ['nom', 'prenom', 'ecoleId'],
        include: [{
          model: EcolePrincipal,
          where: { id: ecoleId },
          attributes: ['nomecole', 'adresse']
        },
        includeEcole] // ← cette ligne est OK seulement si includeEcole est bien défini comme un tableau d'include Sequelize
      }]
    });
    
    let totalFraisInscription = 0;
    for (const eleve of FraisInsc) {
      totalFraisInscription += parseFloat(eleve.fraixinscription || 0);
    }


    //------------------Autres Revenus------------
    let TotalAutreRevenus = 0;
    const AutreRevenus = await Revenu.findAll({
      where:
      {
        date: { [Op.between]: [dateStart, dateEnd] },
        archiver: 0, ecoleId, ecoleeId
      }
    });
    for (let i = 0; i < AutreRevenus.length; i++) {
      const montant = parseFloat(AutreRevenus[i].montant);
      if (!isNaN(montant)) {
        TotalAutreRevenus += montant;
      }
    }
    //----------------------Autres Depenses
    let TotalAutreDepenses = 0;
    const AutreDepenses = await Revenu.findAll({
      where:
      {
        date: { [Op.between]: [dateStart, dateEnd] },
        archiver: 0, ecoleId, ecoleeId
      }
    });
    for (let i = 0; i < AutreDepenses.length; i++) {
      const montant = parseFloat(AutreDepenses[i].montant);
      if (!isNaN(montant)) {
        TotalAutreDepenses += montant;
      }
    }

    //-----------------Salaire Employé-----------
    const salaires=await JournalPaie.findAll({
      where:{}
    })



    const DataSend = {
      AutreRevenus: { liste: AutreRevenus, total: TotalAutreRevenus },
      AutresDepenses: { liste: AutreDepenses, total: TotalAutreDepenses },
      FraiScolarite: { liste: paiements,totalPaye,totalNonPaye,totalFraisInscription,}
    }
    res.status(200).json(DataSend);

  } catch (error) {
    console.error("Erreur dans StatePE:", {
      message: error.message,
      stack: error.stack,
      query: error.query
    });

    res.status(500).json({
      message: "Erreur lors du calcul des statistiques",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

