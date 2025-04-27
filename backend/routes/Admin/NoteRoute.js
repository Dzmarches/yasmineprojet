import express from 'express';
import Enseignant from '../../models/Admin/Enseignant.js';
import Presence from '../../models/Admin/Presence.js';
import Eleve from '../../models/Admin/Eleve.js';
import { saveNotes, getNotesBySection, saveNote, updateExemption, bulkUpdateExemption } from '../../controllers/Admin/noteController.js';

const router = express.Router();

// Sauvegarder les notes (accessible seulement par les enseignants)
router.route('/').post(saveNotes);
router.route('/section/:sectionId').get(getNotesBySection);
router.route('/:eleveId/:matiereId').post(saveNote);
router.route('/updateExemption').post(updateExemption);
router.route('/bulkUpdateExemption').post(bulkUpdateExemption);

// Dans votre backend (routes/presences.js)
router.get('/section/:sectionId', async (req, res) => {
  try {
      const { sectionId } = req.params;
      const { dateDebut, dateFin } = req.query;
      
      const presences = await Presence.findAll({
          where: {
              eleveId: {
                  [Op.in]: sequelize.literal(`(
                      SELECT id FROM eleves WHERE sectionId = ${sectionId}
                  )`)
              },
              date: {
                  [Op.between]: [dateDebut, dateFin]
              }
          },
          include: [
              { model: Eleve, as: 'eleve' },
              { model: Enseignant, as: 'enseignant' }
          ]
      });
      
      res.json(presences);
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erreur serveur" });
  }
});


export default router;