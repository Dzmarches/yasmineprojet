import express from 'express';
import { 
    getEmploiDuTempsBySection,
    getMatieresByNiveau,
    updateDureeMatiere,
    getPeriodes,
    savePeriodes,
    genererEmploiAuto
} from '../../controllers/Admin/emploiDuTempsController.js';

const router = express.Router();

// Obtenir l'emploi du temps d'une section
router.get('/section/:sectionId', getEmploiDuTempsBySection);

// Obtenir les matières d'un niveau
router.get('/niveaux/:niveauId/matieres', getMatieresByNiveau);

// Mettre à jour la durée d'une matière
router.put('/niveaux/niveau-matiere/:id', updateDureeMatiere);

// Gestion des périodes
router.get('/periodes/:niveauId/:sectionId', getPeriodes);
router.post('/periodes', savePeriodes);

// Génération automatique de l'emploi du temps
// router.post('/generer-auto/:niveauId/:sectionId', genererEmploiAuto);
router.post('/generer-emploi',genererEmploiAuto);

export default router;