import express from 'express';
import { savePresences, getPresencesByDate } from '../../controllers/Admin/presenceController.js';
import multer from 'multer';
import Presence from '../../models/Admin/Presence.js';
import Eleve from '../../models/Admin/Eleve.js';
import User from '../../models/User.js';
// Ajoutez en haut du fichier de routes
import { Op } from 'sequelize';

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ 
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // Limite de 5MB
    }
});

router.post('/', upload.any(), savePresences);
router.get('/date/:date', getPresencesByDate);

// GET filtered absences
router.get('/filtered', async (req, res) => {
    try {
        const presences = await Presence.findAll({
            where: {
                [Op.or]: [
                    { matin: { [Op.in]: ['absent', 'retard'] } },
                    { apres_midi: { [Op.in]: ['absent', 'retard'] } }
                ]
            },
            include: [
                {
                    model: Eleve,
                    as: 'eleve',
                    include: [{ model: User, as: 'User' }]
                }
            ],
            order: [['date', 'DESC']]
        });

        // Grouper les résultats
        const grouped = presences.reduce((acc, presence) => {
            const key = `${presence.eleveId}-${presence.date}`;
            if (!acc[key]) {
                acc[key] = {
                    id: presence.id,
                    date: presence.date,
                    eleve: presence.eleve,
                    matin: presence.matin,
                    apres_midi: presence.apres_midi,
                    justificationMatin: presence.justificationMatin,
                    justificationApresMidi: presence.justificationApresMidi,
                    justificationTextMatin: presence.justificationTextMatin,
                    justificationTextApresMidi: presence.justificationTextApresMidi
                };
            } else {
                // Fusionner les périodes
                acc[key].matin = presence.matin !== 'present' ? presence.matin : acc[key].matin;
                acc[key].apres_midi = presence.apres_midi !== 'present' ? presence.apres_midi : acc[key].apres_midi;
            }
            return acc;
        }, {});

        res.json(Object.values(grouped));
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// PUT update justification
router.put('/:id', upload.single('fichier'), async (req, res) => {
    try {
        const presence = await Presence.findByPk(req.params.id);
        if (!presence) return res.status(404).json({ message: 'Presence non trouvée' });

        const updates = {};
        if (req.body.matinJustification) {
            updates.justificationTextMatin = req.body.matinJustification;
        }
        if (req.body.apresMidiJustification) {
            updates.justificationTextApresMidi = req.body.apresMidiJustification;
        }

        if (req.files) {
            if (req.files.matinFile) {
                updates.justificationMatin = req.files.matinFile[0].filename;
            }
            if (req.files.apresMidiFile) {
                updates.justificationApresMidi = req.files.apresMidiFile[0].filename;
            }
        }

        await presence.update(updates);
        res.json(presence);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
export default router;
