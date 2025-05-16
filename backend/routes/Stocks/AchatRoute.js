import express from 'express';
import * as AchatController from '../../controllers/Stocks/AchatController.js';

const router = express.Router();

router.get('/', AchatController.getAchats);
router.post('/', AchatController.createAchat);
router.put('/:id', AchatController.updateAchat);
router.delete('/:id', AchatController.deleteAchat);
router.get('/fournisseurs', AchatController.getFournisseursForSelect);

export default router;
