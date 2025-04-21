import Periode from '../../models/Admin/Periode.js';
import { Op } from 'sequelize';

export const createOrUpdatePeriodes = async (req, res) => {
    try {
        const { niveauId, sectionId, periodes } = req.body;

        // Valider les données
        if (!niveauId || !sectionId || !periodes || !Array.isArray(periodes)) {
            return res.status(400).json({ message: "Données invalides" });
        }

        // Traitement des périodes
        const results = [];
        for (const periode of periodes) {
            const [instance, created] = await Periode.upsert({
                niveauId,
                sectionId,
                type: periode.type,
                heureDebut: periode.heureDebut,
                heureFin: periode.heureFin,
                sousPeriodes: periode.sousPeriodes
            }, {
                returning: true,
                conflictFields: ['niveauId', 'sectionId', 'type']
            });

            results.push(instance);
        }

        res.status(200).json({
            message: "Périodes enregistrées avec succès",
            periodes: results
        });
    } catch (error) {
        console.error("Erreur lors de l'enregistrement des périodes:", error);
        res.status(500).json({ 
            message: "Erreur serveur", 
            error: error.message 
        });
    }
};
export const getPeriodesBySection = async (req, res) => {
    try {
        const { niveauId, sectionId } = req.params;

        const periodes = await Periode.findAll({
            where: {
                niveauId,
                sectionId
            },
            order: [
                ['type', 'ASC'],
                ['heureDebut', 'ASC']
            ]
        });

        // Si aucune période n'existe, retourner les valeurs par défaut
        if (periodes.length === 0) {
            const defaultPeriodes = [
                {
                    type: 'matin',
                    heureDebut: '08:00',
                    heureFin: '12:00',
                    sousPeriodes: []
                },
                {
                    type: 'dejeuner',
                    heureDebut: '12:00',
                    heureFin: '13:00',
                    label: 'Déjeuner',
                    sousPeriodes: []
                },
                {
                    type: 'apres_midi',
                    heureDebut: '13:00',
                    heureFin: '16:00',
                    sousPeriodes: []
                }
            ];
            return res.status(200).json(defaultPeriodes);
        }

        res.status(200).json(periodes);
    } catch (error) {
        console.error("Erreur lors de la récupération des périodes:", error);
        res.status(500).json({ 
            message: "Erreur serveur", 
            error: error.message 
        });
    }
};


// export const getPeriodesBySection = async (req, res) => {
//     try {
//         const { niveauId, sectionId } = req.params;

//         const periodes = await Periode.findAll({
//             where: {
//                 niveauId,
//                 sectionId
//             },
//             order: [
//                 ['type', 'ASC'],
//                 ['heureDebut', 'ASC']
//             ]
//         });

//         // Si aucune période trouvée, retourner des valeurs par défaut
//         if (periodes.length === 0) {
//             return res.status(200).json([
//                 {
//                     type: 'matin',
//                     heureDebut: '08:00:00',
//                     heureFin: '12:00:00',
//                     sousPeriodes: []
//                 },
//                 {
//                     type: 'dejeuner',
//                     heureDebut: '12:00:00',
//                     heureFin: '13:00:00',
//                     sousPeriodes: [],
//                     label: 'Déjeuner'
//                 },
//                 {
//                     type: 'apres_midi',
//                     heureDebut: '13:00:00',
//                     heureFin: '16:00:00',
//                     sousPeriodes: []
//                 }
//             ]);
//         }

//         res.status(200).json(periodes);
//     } catch (error) {
//         console.error("Erreur lors de la récupération des périodes:", error);
//         res.status(500).json({ 
//             message: "Erreur serveur", 
//             error: error.message 
//         });
//     }
// };