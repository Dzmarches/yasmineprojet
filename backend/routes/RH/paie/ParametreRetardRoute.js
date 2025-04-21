import express from 'express'
import {Ajouter,Liste,Modifier,Archiver} from '../../../controllers/RH/paie/ParametreRetardControl.js'


const router =express.Router();

router.post('/ajouter',Ajouter);
router.get('/liste',Liste);
router.put('/modifier/:id',Modifier);
router.patch('/archiver/:id', Archiver);


export default router;