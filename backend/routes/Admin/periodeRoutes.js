import express from 'express';
import { 
    createOrUpdatePeriodes, 
    getPeriodesByCycle 
} from '../../controllers/Admin/periodeController.js';

const router = express.Router();


router.post('/', createOrUpdatePeriodes);
// router.get('/:niveauId/:sectionId', getPeriodesBySection);
router.get('/:cycleId', getPeriodesByCycle);

// Supprimer les périodes (optionnel)
//router.delete('/:niveauId/:sectionId', deletePeriodes);

export default router;