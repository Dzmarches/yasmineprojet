import express from 'express';
import { 
    createOrUpdatePeriodes, 
    getPeriodesBySection 
} from '../../controllers/Admin/periodeController.js';

const router = express.Router();


router.post('/', createOrUpdatePeriodes);
// router.get('/:niveauId/:sectionId', getPeriodesBySection);
router.get('/:niveauId/:sectionId', getPeriodesBySection);

// Supprimer les périodes (optionnel)
//router.delete('/:niveauId/:sectionId', deletePeriodes);

export default router;