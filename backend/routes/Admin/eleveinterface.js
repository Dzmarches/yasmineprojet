import express from 'express';
import {getAnneesScolairesByEleve,getTrimestresByAnnee, getNotesByTrimestre,getEmploiDuTempsEleve
 } from '../../controllers/Admin/eleveiterface.js';

 import jwt from 'jsonwebtoken';
 import { Op } from 'sequelize';
 
 
 
 const router = express.Router();
 router.get('/enfant/:eleveId/annees-scolaires', getAnneesScolairesByEleve);
 
 // Récupérer les trimestres pour une année scolaire
 router.get('/enfant/:eleveId/annee/:anneeId/trimestres', getTrimestresByAnnee);
 
 // Récupérer les notes détaillées pour un trimestre
 router.get('/enfant/:eleveId/trimestre/:trimestreId/notes', getNotesByTrimestre);
 router.get('/eleve/:userId', getEmploiDuTempsEleve);

 export default router;