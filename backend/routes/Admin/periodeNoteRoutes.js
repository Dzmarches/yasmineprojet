import express from 'express';
import { createOrUpdatePeriodeNote, getPeriodeNote,getPeriodeNoteStatus } from '../../controllers/Admin/periodeNoteController.js';

const router = express.Router();

router.post('/', createOrUpdatePeriodeNote);
router.get('/:ecoleId/:ecoleeId', getPeriodeNote);
router.get('/status/:ecoleId/:ecoleeId',getPeriodeNoteStatus);

export default router;