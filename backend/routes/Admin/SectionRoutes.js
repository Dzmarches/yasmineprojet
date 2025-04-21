import express from 'express';
import { getSections, createSection, updateSection, deleteSection,getSectionsByNiveau } from '../../controllers/Admin/SectionController.js';

const router = express.Router();

// Définir les routes pour les sections
router.get('/', getSections); // Récupérer toutes les sections
router.post('/', createSection); // Ajouter une section
router.put('/:id', updateSection); // Modifier une section
router.delete('/:id', deleteSection); // Supprimer une section
router.get('/niveau/:niveauId', getSectionsByNiveau);

export default router;