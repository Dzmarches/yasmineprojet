// routes/presenceRoutes.js
import express from 'express';
import { savePresences, getPresencesByDate } from '../../controllers/Admin/presenceController.js';

const router = express.Router();

// Enregistrer les présences
router.post('/', savePresences);
// Récupérer les présences par date
router.get('/date/:date', getPresencesByDate);


export default router;