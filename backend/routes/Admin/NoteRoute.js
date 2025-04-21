import express from 'express';
import { saveNotes, getNotesBySection, saveNote } from '../../controllers/Admin/noteController.js';

const router = express.Router();

// Sauvegarder les notes (accessible seulement par les enseignants)
router.route('/')
  .post(saveNotes);
  router.route('/section/:sectionId')
  .get(getNotesBySection);
  router.route('/:eleveId/:matiereId')
  .post(saveNote);


export default router;