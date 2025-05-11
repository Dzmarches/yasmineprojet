import db from '../../config/Database.js';
import { Op } from 'sequelize';
import EnseignantClasse from '../../models/Admin/EnseignantClasse.js';
import NiveauxMatieres from '../../models/Admin/NiveauxMatieres.js';
import Periode from '../../models/Admin/Periode.js';
import EmploiDuTemps from '../../models/Admin/EmploiDuTemps.js';
import Matiere from '../../models/Admin/Matiere.js';
import Enseignant from '../../models/Admin/Enseignant.js';
import Employe from '../../models/RH/employe.js';
import User from '../../models/User.js';
import Section from '../../models/Admin/Section.js';
import Niveaux from '../../models/Admin/Niveaux.js';

// Fonction utilitaire pour calculer la durée d'une période en heures
function calculerDureePeriode(debut, fin) {
    const [h1, m1] = debut.split(':').map(Number);
    const [h2, m2] = fin.split(':').map(Number);
    return (h2 - h1) + (m2 - m1) / 60;
}


export const getEmploiDuTempsEnseignant = async (req, res) => {
    try {
        const enseignantId = req.params.enseignantId;
        
        // Vérifier si l'enseignant existe
        const enseignant = await Enseignant.findByPk(enseignantId);
        if (!enseignant) {
            return res.status(404).json({ message: "Enseignant non trouvé" });
        }

        // Récupérer l'emploi du temps avec les associations
        const emploiDuTemps = await EmploiDuTemps.findAll({
            where: { enseignantId: enseignantId },
            include: [
                {
                    model: Matiere,
                    attributes: ['id', 'nom']
                },
                {
                    model: Section,
                    attributes: ['id', 'classe', 'classearab']
                },
                {
                    model: Niveaux,
                    attributes: ['id', 'nomniveau', 'nomniveuarab']
                }
            ],
            order: [
                ['jour', 'ASC'],
                ['heure', 'ASC']
            ]
        });

        // Organiser les données par jour pour une meilleure présentation
        const emploiOrganise = {};
        const jours = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi'];

        // Initialiser la structure
        jours.forEach(jour => {
            emploiOrganise[jour] = [];
        });

        // Remplir avec les données
        emploiDuTemps.forEach(cours => {
            if (emploiOrganise[cours.jour]) {
                emploiOrganise[cours.jour].push({
                    id: cours.id,
                    heure: cours.heure,
                    duree: cours.duree,
                    matiere: {
                        id: cours.Matiere.id,
                        nom: cours.Matiere.nom,
                        code: cours.Matiere.code
                    },
                    section: {
                        id: cours.Section.id,
                        classe: cours.Section.classe,
                        classeArab: cours.Section.classearab
                    },
                    niveau: {
                        id: cours.Niveaux.id,
                        nom: cours.Niveaux.nomniveau,
                        nomArab: cours.Niveaux.nomniveuarab
                    }
                });
            }
        });
        console.log('emploi du temps ', emploiOrganise);
        res.status(200).json(emploiOrganise);
    } catch (error) {
        console.error("Erreur lors de la récupération de l'emploi du temps:", error);
        res.status(500).json({ 
            message: "Erreur lors de la récupération de l'emploi du temps",
            error: error.message 
        });
    }
};

export const getEmploiDuTempsBySection = async (req, res) => {
    try {
        const { sectionId } = req.params;

        const emploiDuTemps = await EmploiDuTemps.findAll({
            where: { sectionId },
            include: [
                {
                    model: Matiere,
                    attributes: ['id', 'nom', 'nomarabe']
                },
                {
                    model: Enseignant,
                    include: [{
                        model: Employe,
                        include: [{
                            model: User,
                            attributes: ['id', 'nom', 'prenom']
                        }]
                    }]
                }
            ],
            order: [
                ['jour', 'ASC'],
                ['heure', 'ASC']
            ]
        });

        //console.log('Données retournées:', JSON.stringify(emploiDuTemps, null, 2)); // Pour débogage
        res.json(emploiDuTemps);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

// Obtenir les matières d'un niveau avec leurs durées
export const getMatieresByNiveau = async (req, res) => {
    try {
        const { niveauId } = req.params;
        const matieres = await NiveauxMatieres.findAll({
            where: { niveauId },
            include: [{ model: db.models.Matiere, as: 'Matiere' }]
        });
        res.status(200).json(matieres);
    } catch (error) {
        console.error("Erreur:", error);
        res.status(500).json({ message: "Erreur lors de la récupération" });
    }
};

// Mettre à jour la durée d'une matière pour un niveau
export const updateDureeMatiere = async (req, res) => {
    try {
        const { id } = req.params;
        const { duree } = req.body;

        await NiveauxMatieres.update({ duree }, { where: { id } });
        res.status(200).json({ message: "Durée mise à jour avec succès" });
    } catch (error) {
        console.error("Erreur:", error);
        res.status(500).json({ message: "Erreur lors de la mise à jour" });
    }
};

// Gestion des périodes
export const getPeriodes = async (req, res) => {
    try {
        const { cycleId } = req.params;

        const periodes = await Periode.findAll({
            where: { cycleId },
            order: [['heureDebut', 'ASC']]
        });

        res.status(200).json(periodes);
    } catch (error) {
        console.error("Erreur:", error);
        res.status(500).json({ message: "Erreur lors de la récupération" });
    }
};


export const savePeriodes = async (req, res) => {
    try {
        const { cycleId, periodes } = req.body;

        await Periode.destroy({ where: { cycleId } });

        const nouvellesPeriodes = await Periode.bulkCreate(
            periodes.map(p => ({
                ...p,
                cycleId,
                sousPeriodes: p.sousPeriodes || [],
                label: p.label || null
            }))
        );

        res.status(200).json({
            message: "Périodes enregistrées avec succès",
            periodes: nouvellesPeriodes
        });
    } catch (error) {
        console.error("Erreur:", error);
        res.status(500).json({ message: "Erreur lors de l'enregistrement" });
    }
};


// Génération automatique de l'emploi du temps
// export const genererEmploiAuto = async (req, res) => {
//     try {
//         const { niveauId, sectionId } = req.params;

//         // 1. Récupérer les matières du niveau avec leurs durées
//         const matieresNiveau = await NiveauxMatieres.findAll({
//             where: { niveauId },
//             include: [
//                 { model: db.models.Matiere, as: 'Matiere' },
//                 { model: db.models.Enseignant, as: 'Enseignant' }
//             ]
//         });

//         // 2. Récupérer les périodes configurées
//         const periodes = await Periode.findAll({
//             where: { niveauId, sectionId },
//             order: [['heureDebut', 'ASC']]
//         });

//         // 3. Récupérer les disponibilités des enseignants
//         const enseignantsClasses = await EnseignantClasse.findAll({
//             where: { niveauId, classeId: sectionId },
//             include: [
//                 { model: db.models.Enseignant, as: 'Enseignant' },
//                 { model: db.models.Matiere, as: 'Matiere' }
//             ]
//         });

//         // 4. Algorithme de génération automatique
//         const jours = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi'];
//         const emploiGenere = [];
//         const heuresParMatiere = {}; // Pour suivre les heures restantes par matière

//         // Initialiser les heures par matière
//         matieresNiveau.forEach(matiere => {
//             heuresParMatiere[matiere.matiereId] = matiere.duree || 0;
//         });

//         // Fonction pour trouver une période disponible
//         const trouverPeriodeDisponible = (jour, heureDebut) => {
//             return periodes.find(p => 
//                 p.heureDebut <= heureDebut && 
//                 p.heureFin > heureDebut &&
//                 !emploiGenere.some(e => 
//                     e.jour === jour && 
//                     e.heure === `${p.heureDebut}-${p.heureFin}`
//                 )
//             );
//         };

//         // Algorithme de placement aléatoire
//         jours.forEach(jour => {
//             matieresNiveau.forEach(matiere => {
//                 if (heuresParMatiere[matiere.matiereId] <= 0) return;

//                 // Trouver un enseignant disponible pour cette matière
//                 const enseignantDispo = enseignantsClasses.find(ec => 
//                     ec.matiereId === matiere.matiereId &&
//                     // Vérifier si l'enseignant est déjà occupé à ce moment
//                     !emploiGenere.some(e => 
//                         e.jour === jour && 
//                         e.enseignantId === ec.enseignantId
//                     )
//                 );

//                 if (enseignantDispo) {
//                     // Trouver une période disponible
//                     const periodeDispo = trouverPeriodeDisponible(jour, '08:00:00'); // Commence à 8h par défaut

//                     if (periodeDispo) {
//                         const dureeCours = Math.min(
//                             matiere.duree, 
//                             calculerDureePeriode(periodeDispo.heureDebut, periodeDispo.heureFin)
//                         );

//                         emploiGenere.push({
//                             jour,
//                             heure: `${periodeDispo.heureDebut}-${periodeDispo.heureFin}`,
//                             matiereId: matiere.matiereId,
//                             enseignantId: enseignantDispo.enseignantId,
//                             niveauId,
//                             sectionId,
//                             duree: dureeCours
//                         });

//                         heuresParMatiere[matiere.matiereId] -= dureeCours;
//                     }
//                 }
//             });
//         });

//         // 5. Sauvegarder dans la base de données
//         await EmploiDuTemps.destroy({ where: { niveauId, sectionId } });
//         await EmploiDuTemps.bulkCreate(emploiGenere);

//         res.status(200).json({
//             success: true,
//             message: 'Emploi du temps généré avec succès',
//             emploiDuTemps: emploiGenere
//         });

//     } catch (error) {
//         console.error("Erreur lors de la génération:", error);
//         res.status(500).json({ 
//             success: false, 
//             message: "Erreur lors de la génération de l'emploi du temps" 
//         });
//     }
// };

// Dans votre fichier controller (emploiDuTempsController.js)

// controllers/emploiDuTempsController.js

export const genererEmploiAuto = async (req, res) => {
    const { niveauId, sectionId } = req.body;

    try {
        // 1. Récupérer toutes les données nécessaires
        const [matieres, enseignantsClasse, periodes, enseignants] = await Promise.all([
            NiveauxMatieres.findAll({
                where: { niveauId },
                include: [
                    { model: Matiere, attributes: ['id', 'nom', 'nomarabe'] }
                ],
                attributes: ['id', 'duree', 'dureeseance', 'nombreseanceparjour', 'preference', 'matiereId']
            }),
            EnseignantClasse.findAll({
                where: { niveauId, classeId: sectionId },
                include: [
                    { model: Enseignant, attributes: ['id', 'disponibilites'] },
                    { model: Matiere, attributes: ['id', 'nom'] }
                ]
            }),
            Periode.findAll({
                where: { niveauId, sectionId },
                order: [['type', 'ASC']]
            }),
            Enseignant.findAll({
                attributes: ['id', 'disponibilites'],
                include: [{
                    model: EnseignantClasse,
                    where: { niveauId, classeId: sectionId },
                    required: false
                }]
            })
        ]);

        console.log('=== DONNEES RECUPEREES ===');
        console.log('Matières:', matieres.map(m => `${m.Matiere.nom} (${m.duree}h, ${m.dureeseance}min)`));
        // console.log('Enseignants:', enseignants.map(e => `${e.nom} ${e.prenom}`));
        console.log('Périodes:', periodes.map(p => `${p.type}: ${p.heureDebut}-${p.heureFin}`));

        // 2. Préparer les créneaux horaires
        const creneauxParJour = {};
        const joursValides = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi'];
        const labelsPauses = ['pause', 'repos', 'la pause', 'récréation'];

        joursValides.forEach(jour => {
            creneauxParJour[jour] = periodes.flatMap(p => {
                // Exclure la période de déjeuner
                if (p.type === 'dejeuner') return [];

                const sousPeriodes = p.sousPeriodes ? JSON.parse(p.sousPeriodes) : [];

                return sousPeriodes.length > 0
                    ? sousPeriodes.map(sp => ({
                        ...sp,
                        type: p.type,
                        duree: calculerDuree(sp.debut, sp.fin),
                        jour
                    })).filter(sp => {
                        // Filtrer les pauses
                        const label = (sp.label || '').toLowerCase().trim();
                        return !labelsPauses.includes(label);
                    })
                    : [{
                        debut: p.heureDebut,
                        fin: p.heureFin,
                        type: p.type,
                        duree: calculerDuree(p.heureDebut, p.heureFin),
                        jour,
                        label: ''
                    }];
            }).filter(c => c.duree >= 30); // Créneaux d'au moins 30 minutes
        });

        console.log('=== CRENEAUX DISPONIBLES ===');
        console.log(JSON.stringify(creneauxParJour, null, 2));

        // 3. Préparer les matières avec leurs enseignants
        const matieresAPlanifier = matieres.map(matiere => {
            const dureeTotale = (matiere.duree || 0) * 60; // Convertir en minutes
            const dureeSeance = matiere.dureeseance || 0;

            if (!dureeTotale || !dureeSeance) {
                throw new Error(`Configuration invalide pour ${matiere.Matiere.nom}`);
            }

            // Trouver l'enseignant assigné
            const enseignantClasse = enseignantsClasse.find(ec =>
                ec.matiereId === matiere.matiereId
            );

            const enseignant = enseignantClasse
                ? enseignants.find(e => e.id === enseignantClasse.enseignantId)
                : null;

            return {
                ...matiere.get({ plain: true }),
                dureeTotale,
                dureeSeance,
                priorite: calculerPriorite(matiere),
                heuresPlanifiees: 0,
                enseignantId: enseignant?.id || null,
                enseignantDisponibilites: enseignant?.disponibilites || null,
                enseignantNom: enseignant ? `${enseignant.nom} ${enseignant.prenom}` : 'Non assigné'
            };
        });

        console.log('=== MATIERES A PLANIFIER ===');
        console.log(matieresAPlanifier.map(m => ({
            matiere: m.Matiere.nom,
            dureeTotale: m.dureeTotale,
            dureeSeance: m.dureeSeance,
            preference: m.preference,
            enseignant: m.enseignantNom,
            priorite: m.priorite
        })));

        // 4. Algorithme de planification amélioré
        // 4. Algorithme de planification amélioré
        const emploiGenere = [];
        let matieresNonPlanifiees = [];

        // Trier les matières par priorité (plus haute d'abord)
        const matieresTriees = [...matieresAPlanifier].sort((a, b) => b.priorite - a.priorite);

        // Mélanger les jours pour une répartition plus aléatoire
        // const joursMelanges = [...joursValides].sort(() => Math.random() - 0.5);
        const joursMelanges = [...joursValides].sort(() => Math.random() - 0.5);

        for (const matiere of matieresTriees) {
            let dureeRestante = matiere.dureeTotale;
            let tentatives = 0;
            const maxTentatives = joursValides.length * 5; // Augmenter le nombre de tentatives
            
            // Essayer de répartir sur tous les jours
            while (dureeRestante > 0 && tentatives < maxTentatives) {
                // Choisir un jour aléatoire
                const jourIndex = Math.floor(Math.random() * joursValides.length);
                const jour = joursValides[jourIndex];
                
                // Vérifier la disponibilité de l'enseignant pour ce jour
                if (matiere.enseignantId && matiere.enseignantDisponibilites) {
                    const dispoJour = matiere.enseignantDisponibilites[jour];
                    if (dispoJour?.disponible === false) {
                        tentatives++;
                        continue; // Passer au jour suivant si l'enseignant n'est pas disponible
                    }
                }
        
                const creneauTrouve = trouverMeilleurCreneau(matiere, creneauxParJour, jour);
                
                if (!creneauTrouve) {
                    tentatives++;
                    continue;
                }
        
                const { creneau, index } = creneauTrouve;
                const dureePossible = Math.min(
                    creneau.duree,
                    matiere.dureeSeance,
                    dureeRestante
                );
        
                if (dureePossible >= 30) {
                    emploiGenere.push({
                        jour: jour.charAt(0).toUpperCase() + jour.slice(1),
                        heure: `${creneau.debut}-${creneau.fin}`,
                        duree: dureePossible,
                        niveauId,
                        sectionId,
                        matiereId: matiere.matiereId,
                        enseignantId: matiere.enseignantId,
                        matiereNom: matiere.Matiere.nom,
                        enseignantNom: matiere.enseignantNom
                    });
        
                    dureeRestante -= dureePossible;
                    
                    // Mettre à jour le créneau
                    creneau.duree -= dureePossible;
                    if (creneau.duree <= 0) {
                        creneauxParJour[jour].splice(index, 1);
                    }
                }
        
                tentatives++;
            }
        
            if (dureeRestante > 0) {
                matieresNonPlanifiees.push({
                    nom: matiere.Matiere.nom,
                    manque: dureeRestante,
                    preference: matiere.preference,
                    enseignant: matiere.enseignantNom
                });
            }
        }

        console.log('=== EMPLOI GENERE ===');
        console.log(emploiGenere);
        console.log('=== MATIERES NON PLANIFIEES ===');
        console.log(matieresNonPlanifiees);

        // 5. Sauvegarde dans la base de données
        await db.transaction(async t => {
            await EmploiDuTemps.destroy({ where: { sectionId }, transaction: t });

            if (emploiGenere.length > 0) {
                await EmploiDuTemps.bulkCreate(
                    emploiGenere.map(e => ({
                        jour: e.jour,
                        heure: e.heure,
                        duree: e.duree,
                        niveauId: e.niveauId,
                        sectionId: e.sectionId,
                        matiereId: e.matiereId,
                        enseignantId: e.enseignantId
                    })),
                    { transaction: t }
                );
            }
        });

        // 6. Retourner le résultat
        if (matieresNonPlanifiees.length > 0) {
            return res.status(207).json({
                success: true,
                message: 'Emploi généré avec certaines matières non planifiées',
                nonPlanifiees: matieresNonPlanifiees,
                emploiGenere: emploiGenere.map(e => ({
                    jour: e.jour,
                    heure: e.heure,
                    matiere: e.matiereNom,
                    enseignant: e.enseignantNom,
                    duree: e.duree
                })),
                stats: {
                    totalMatieres: matieres.length,
                    planifiees: matieres.length - matieresNonPlanifiees.length,
                    nonPlanifiees: matieresNonPlanifiees.length
                }
            });
        }

        return res.json({
            success: true,
            message: 'Emploi du temps généré avec succès',
            emploiGenere: emploiGenere.map(e => ({
                jour: e.jour,
                heure: e.heure,
                matiere: e.matiereNom,
                enseignant: e.enseignantNom,
                duree: e.duree
            })),
            stats: {
                totalMatieres: matieres.length,
                planifiees: matieres.length,
                nonPlanifiees: 0
            }
        });

    } catch (error) {
        console.error('=== ERREUR DE GENERATION ===', error);
        return res.status(500).json({
            success: false,
            message: 'Échec de la génération',
            error: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
};

// Fonction pour trouver le meilleur créneau disponible
const trouverMeilleurCreneau = (matiere, creneauxParJour, jour) => {
    const creneaux = creneauxParJour[jour] || [];
    
    // Essayer d'abord les créneaux qui correspondent parfaitement aux préférences
    for (let i = 0; i < creneaux.length; i++) {
        const creneau = creneaux[i];

        // Vérifier si le créneau correspond aux préférences
        if (matiere.preference === 'Uniquement La matiné' && creneau.type !== 'matin') continue;
        if (matiere.preference === "Uniquement L'après-midi" && creneau.type !== 'apres_midi') continue;

        // Vérifier la disponibilité de l'enseignant
        if (matiere.enseignantId && matiere.enseignantDisponibilites) {
            const dispoJour = matiere.enseignantDisponibilites[jour.toLowerCase()];
            
            // Si l'enseignant est complètement indisponible ce jour
            if (dispoJour?.disponible === false) continue;

            // Si l'enseignant a des heures spécifiques de disponibilité
            if (dispoJour?.heures?.length > 0) {
                const [debut, fin] = [creneau.debut, creneau.fin].map(t => t.replace(':', ''));
                const estDisponible = dispoJour.heures.some(h => {
                    const [hDebut, hFin] = h.split('-');
                    return debut >= hDebut && fin <= hFin;
                });

                if (!estDisponible) continue;
            }
        }

        // Vérifier la durée minimale
        if (creneau.duree >= Math.min(matiere.dureeSeance, 30)) {
            return {
                creneau,
                index: i,
                jour
            };
        }
    }

    // Si aucun créneau idéal n'est trouvé, essayer avec n'importe quel créneau disponible
    for (let i = 0; i < creneaux.length; i++) {
        const creneau = creneaux[i];
        if (creneau.duree >= 30) { // Séance minimale de 30 minutes
            return {
                creneau,
                index: i,
                jour
            };
        }
    }

    return null;
};

// Fonction utilitaire pour calculer la durée en minutes
const calculerDuree = (debut, fin) => {
    if (!debut || !fin) return 0;
    const [hD, mD] = debut.split(':').map(Number);
    const [hF, mF] = fin.split(':').map(Number);
    return (hF * 60 + mF) - (hD * 60 + mD);
};

// Fonction pour calculer la priorité d'une matière
const calculerPriorite = (matiere) => {
    let priorite = 0;

    // Priorité selon les préférences
    if (matiere.preference === 'Uniquement La matiné') priorite += 100;
    else if (matiere.preference === "Uniquement L'après-midi") priorite += 80;
    else if (matiere.preference === "Plus Grand Moitié La Matin") priorite += 60;

    // Priorité selon la durée totale
    priorite += (matiere.duree || 0) * 2;

    // Priorité selon le nombre de séances par jour
    priorite += (matiere.nombreseanceparjour || 0) * 10;

    // Priorité supplémentaire si la matière a un enseignant assigné
    if (matiere.enseignantId) priorite += 50;

    return priorite;
};
