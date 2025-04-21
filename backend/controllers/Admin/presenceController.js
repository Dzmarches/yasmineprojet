// controllers/presenceController.js
import Presence from '../../models/Admin/Presence.js';
import Eleve from '../../models/Admin/Eleve.js';
import User from '../../models/User.js'; // Importez le modèle User si nécessaire
import Enseignant from '../../models/Admin/Enseignant.js';
import Employe from '../../models/RH/employe.js';
import { Op } from 'sequelize';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Créer le dossier s'il n'existe pas
const justificationsDir = path.join(__dirname, '../../public/justificationsEleve');
if (!fs.existsSync(justificationsDir)) {
    fs.mkdirSync(justificationsDir, { recursive: true });
}

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

export const savePresences = async (req, res) => {
  try {
      const { presences, date, heure, enseignantId } = req.body;
      const parsedPresences = JSON.parse(presences);
      
      const results = await Promise.all(parsedPresences.map(async (presence) => {
          // Vérifier si une présence existe déjà pour cet élève à cette date
          const existingPresence = await Presence.findOne({
              where: {
                  eleveId: presence.eleveId,
                  date: date
              }
          });

          let justificationMatinPath = null;
          let justificationApresMidiPath = null;

          // Gérer l'upload des fichiers
          if (req.files) {
              if (req.files[`justificationMatin-${presence.eleveId}`]) {
                  const file = req.files[`justificationMatin-${presence.eleveId}`][0];
                  const ext = path.extname(file.originalname);
                  justificationMatinPath = `/justifications/justif_${presence.eleveId}_matin_${Date.now()}${ext}`;
                  fs.writeFileSync(path.join(__dirname, '../../public' + justificationMatinPath), file.buffer);
              }
              
              if (req.files[`justificationApresMidi-${presence.eleveId}`]) {
                  const file = req.files[`justificationApresMidi-${presence.eleveId}`][0];
                  const ext = path.extname(file.originalname);
                  justificationApresMidiPath = `/justifications/justif_${presence.eleveId}_apresmidi_${Date.now()}${ext}`;
                  fs.writeFileSync(path.join(__dirname, '../../public' + justificationApresMidiPath), file.buffer);
              }
          }

          if (existingPresence) {
              // Mise à jour de la présence existante
              return await existingPresence.update({
                  matin: presence.matin,
                  apres_midi: presence.apres_midi,
                  heure: heure,
                  enseignantId: enseignantId,
                  justification: justificationMatinPath || justificationApresMidiPath || existingPresence.justification
              });
          } else {
              // Création d'une nouvelle présence
              return await Presence.create({
                  eleveId: presence.eleveId,
                  enseignantId: enseignantId,
                  date: date,
                  matin: presence.matin,
                  apres_midi: presence.apres_midi,
                  heure: heure,
                  justification: justificationMatinPath || justificationApresMidiPath
              });
          }
      }));

      res.status(200).json({ success: true, data: results });
  } catch (error) {
      console.error('Erreur lors de la sauvegarde des présences:', error);
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
          as: 'eleve'
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
