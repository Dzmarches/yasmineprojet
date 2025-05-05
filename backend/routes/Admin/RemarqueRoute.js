import express from 'express';
import { addRemarque, updateRemarque, archiveRemarque, listRemarques } from '../../controllers/Admin/RemarqueController.js';

const router = express.Router();

router.post('/', addRemarque);
router.put('/:id', updateRemarque);
router.patch('/:id/archive', archiveRemarque);
router.get('/liste', listRemarques);

export default router;
