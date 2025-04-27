import express from 'express';
import { getAnneesScolaires, createAnneeScolaire, updateAnneeScolaire, deleteAnneeScolaire } from '../../controllers/Admin/AnneeScolaireController.js';

const router = express.Router();

// Définir les routes pour les années scolaires
router.get('/', getAnneesScolaires); // Récupérer toutes les années scolaires
router.post('/', createAnneeScolaire); // Ajouter une nouvelle année scolaire
router.put('/:id', updateAnneeScolaire); // Modifier une année scolaire
router.delete('/:id', deleteAnneeScolaire); // Supprimer une année scolaire

export default router;