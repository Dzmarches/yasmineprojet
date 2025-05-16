import express from 'express';
import {
    getFournisseurs,
    createFournisseur,
    updateFournisseur,
    deleteFournisseur
} from '../../controllers/Stocks/FourniteurController.js';

const router = express.Router();

router.get('/', getFournisseurs);
router.post('/', createFournisseur);
router.put('/:id', updateFournisseur);
router.delete('/:id', deleteFournisseur);

export default router;