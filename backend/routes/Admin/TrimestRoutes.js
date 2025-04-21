import express from 'express';
import { getTrimestres, createTrimest, updateTrimest, deleteTrimest } from '../../controllers/Admin/TrimestController.js';

const router = express.Router();

// Définir les routes pour les trimestres
router.get('/', getTrimestres); // Récupérer tous les trimestres
router.post('/', createTrimest); // Ajouter un trimestre
router.put('/:id', updateTrimest); // Modifier un trimestre
router.delete('/:id', deleteTrimest); // Supprimer un trimestre

export default router;