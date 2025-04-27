import express from 'express'
import {AjouterTR,ModifierTR,ListeTR,ArchiverTR,FindTR} from '../../controllers/comptabilite/TypeRevenueControl.js'


const router =express.Router();

router.post('/ajouter',AjouterTR);
router.get('/liste',ListeTR);
router.get('/typeRevenue/:id',FindTR);
router.put('/modifier/:id',ModifierTR);
router.patch('/archiver/:id', ArchiverTR);




export default router;