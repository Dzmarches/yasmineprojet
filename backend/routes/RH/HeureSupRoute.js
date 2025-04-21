import express from 'express'
import {AjouterHeuresup,ListeHeuresup,ModifierHeuresup,FindHeuresup,Archiver} from '../../controllers/RH/HeuresSupControl.js'


const router =express.Router();

router.post('/ajouter',AjouterHeuresup);
router.get('/liste',ListeHeuresup);
router.get('/prime/:id',FindHeuresup);
router.put('/modifier/:id',ModifierHeuresup);
router.patch('/archiver/:id', Archiver);






export default router;