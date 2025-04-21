import express from 'express';
import { getEvents, createEvent, deleteEvent } from '../Controllers/EventController.js';

const router = express.Router();

// Définir les routes pour les événements
router.get('/', getEvents); // Récupérer tous les événements
router.post('/', createEvent); // Créer un nouvel événement
router.delete('/:id', deleteEvent); // Supprimer un événement

export default router;