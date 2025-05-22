import express from 'express';
import {
    getSorties,
    createSortie,
    updateSortie,
    deleteSortie
} from '../../controllers/Stocks/sortieController.js';

const router = express.Router();

router.get('/', getSorties);
router.post('/', createSortie);
router.put('/:id', updateSortie);
router.delete('/:id', deleteSortie);

export default router;
