import Presence from '../../models/Admin/Presence.js';
import Eleve from '../../models/Admin/Eleve.js';
import Enseignant from '../../models/Admin/Enseignant.js';
import Employe from '../../models/RH/employe.js';
import User from '../../models/User.js';
import { Op } from 'sequelize';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Répertoire de stockage des justificatifs
const justificationsDir = path.join(__dirname, '../../public/images/justificationabsenceEleve');
if (!fs.existsSync(justificationsDir)) {
    fs.mkdirSync(justificationsDir, { recursive: true });
}

export const savePresences = async (req, res) => {
    try {
        const { presences, date, heure, enseignantId } = req.body;
        
        if (!presences || !date) {
            return res.status(400).json({ success: false, message: "Champs requis manquants." });
        }
  
        const parsedPresences = Array.isArray(presences) ? presences : JSON.parse(presences);
  
        const results = await Promise.all(parsedPresences.map(async (presenceStr) => {
            const presence = typeof presenceStr === 'string' ? JSON.parse(presenceStr) : presenceStr;
            
            const existingPresence = await Presence.findOne({
                where: { eleveId: presence.eleveId, date }
            });
  
            let justificationMatinPath = null;
            let justificationApresMidiPath = null;
  
            // Traitement des fichiers
            const matinFileKey = `justificationMatin-${presence.eleveId}`;
            const apresMidiFileKey = `justificationApresMidi-${presence.eleveId}`;
  
            if (req.files) {
                // Fichier pour le matin
                const matinFile = req.files.find(f => f.fieldname === matinFileKey);
                if (matinFile) {
                    const fileName = `justif_${presence.eleveId}_matin_${Date.now()}${path.extname(matinFile.originalname)}`;
                    fs.writeFileSync(path.join(justificationsDir, fileName), matinFile.buffer);
                    justificationMatinPath = `/images/justificationabsenceEleve/${fileName}`;
                }
  
                // Fichier pour l'après-midi
                const apresMidiFile = req.files.find(f => f.fieldname === apresMidiFileKey);
                if (apresMidiFile) {
                    const fileName = `justif_${presence.eleveId}_apresmidi_${Date.now()}${path.extname(apresMidiFile.originalname)}`;
                    fs.writeFileSync(path.join(justificationsDir, fileName), apresMidiFile.buffer);
                    justificationApresMidiPath = `/images/justificationabsenceEleve/${fileName}`;
                }
            }
  
            const presenceData = {
                matin: presence.matin,
                apres_midi: presence.apres_midi,
                heure,
                enseignantId,
                justificationTextMatin: presence.justificationTextMatin || null,
                justificationTextApresMidi: presence.justificationTextApresMidi || null,
                justificationMatin: justificationMatinPath || existingPresence?.justificationMatin || null,
                justificationApresMidi: justificationApresMidiPath || existingPresence?.justificationApresMidi || null
            };
  
            if (existingPresence) {
                return await existingPresence.update(presenceData);
            } else {
                return await Presence.create({
                    eleveId: presence.eleveId,
                    ...presenceData,
                    date
                });
            }
        }));
  
        res.status(200).json({ success: true, data: results });
    } catch (error) {
        console.error('Erreur lors de la sauvegarde:', error);
        res.status(500).json({ success: false, message: error.message });
    }
  };

  export const getPresencesByDate = async (req, res) => {
    try {
        const { date } = req.params;

        const presences = await Presence.findAll({
            where: { date },
            include: [
                {
                    model: Eleve,
                    as: 'eleve',
                    include: [
                        {
                            model: User,
                            attributes: ['id', 'nom', 'prenom']
                        }
                    ]
                },
                {
                    model: Enseignant,
                    as: 'enseignant',
                    include: [
                        {
                            model: Employe,
                            include: [
                                {
                                    model: User,
                                    attributes: ['id', 'nom', 'prenom']
                                }
                            ]
                        }
                    ]
                }
            ],
            attributes: [
                'id',
                'eleveId',
                'enseignantId',
                'date',
                'heure',
                'matin',
                'apres_midi',
                'justificationMatin',
                'justificationApresMidi',
                'justificationTextMatin',
                'justificationTextApresMidi',
                'createdAt',
                'updatedAt'
            ]
        });

        res.status(200).json(presences);
    } catch (error) {
        console.error("Erreur lors de la récupération des présences:", error);
        res.status(500).json({
            message: "Erreur serveur",
            error: error.message
        });
    }
};


// export const savePresences = async (req, res) => {
//   try {
//     const { presences, date, heure, enseignantId } = req.body; // Ajoutez enseignantId

//     if (!presences || !Array.isArray(presences)) {
//       return res.status(400).json({ message: "Données de présence invalides" });
//     }

//     if (!date || !enseignantId) {
//       return res.status(400).json({ message: "Date et ID enseignant requis" });
//     }

//     // Vérifier si des présences existent déjà pour cette date
//     const existingPresences = await Presence.findAll({
//       where: {
//         eleveId: { [Op.in]: presences.map(p => p.eleveId) },
//         date
//       }
//     });

//     // Mise à jour ou création des présences
//     const results = [];
//     for (const presence of presences) {
//       const existing = existingPresences.find(p => p.eleveId === presence.eleveId);
      
//       if (existing) {
//         const updated = await existing.update({
//           matin: presence.matin,
//           apres_midi: presence.apres_midi,
//           heure: heure,
//           enseignantId: enseignantId // Ajoutez l'enseignantId
//         });
//         results.push(updated);
//       } else {
//         const created = await Presence.create({
//           eleveId: presence.eleveId,
//           enseignantId: enseignantId, // Ajoutez l'enseignantId
//           date,
//           matin: presence.matin,
//           apres_midi: presence.apres_midi,
//           heure: heure
//         });
//         results.push(created);
//       }
//     }

//     res.status(201).json({
//       message: "Présences enregistrées avec succès",
//       presences: results
//     });
//   } catch (error) {
//     console.error("Erreur lors de l'enregistrement des présences:", error);
//     res.status(500).json({ 
//       message: "Erreur serveur", 
//       error: error.message 
//     });
//   }
// };