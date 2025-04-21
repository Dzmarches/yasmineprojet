import express from 'express';
import { getCyclesScolaires, createCycleScolaire, updateCycleScolaire, deleteCycleScolaire } from '../Controllers/CycleScolaireController.js';

const router = express.Router();

// Définir les routes pour les cycles scolaires
router.get('/', getCyclesScolaires); // Récupérer tous les cycles scolaires
router.post('/', createCycleScolaire); // Ajouter un cycle scolaire
router.put('/:id', updateCycleScolaire); // Modifier un cycle scolaire
router.delete('/:id', deleteCycleScolaire); // Supprimer un cycle scolaire

export default router;