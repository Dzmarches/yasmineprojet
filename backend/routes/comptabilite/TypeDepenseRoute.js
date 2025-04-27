import express from 'express'
import {AjouterTD,ModifierTD,ListeTD,ArchiverTD,FindTD} from '../../controllers/comptabilite/TypeDepenseControl.js'


const router =express.Router();

router.post('/ajouter',AjouterTD);
router.get('/liste',ListeTD);
router.get('/typedepense/:id',FindTD);
router.put('/modifier/:id',ModifierTD);
router.patch('/archiver/:id', ArchiverTD);






export default router;