import express from 'express'
import {Ajouter,Modifier,Liste,Archiver} from
 '../../../controllers/comptabilite/paimentEleve/ContratControl.js'


const router =express.Router();

router.post('/ajouter',Ajouter);
router.get('/liste',Liste);
router.put('/modifier/:id',Modifier);
router.patch('/archiver/:id', Archiver);






export default router;