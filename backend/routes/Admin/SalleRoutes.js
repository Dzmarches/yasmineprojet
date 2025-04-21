import express from 'express';
import { getSalles, createSalle, updateSalle, deleteSalle } from '../../controllers/Admin/SalleController.js';

const router = express.Router();

// Définir les routes pour les salles
router.get('/', getSalles); // Récupérer toutes les salles
router.post('/', createSalle); // Ajouter une salle
router.put('/:id', updateSalle); // Modifier une salle
router.delete('/:id', deleteSalle); // Supprimer une salle

export default router;