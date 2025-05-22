import express from 'express'
import {Ajouter,ModifierContrat,Liste,Archiver,Find,MidifierPlanning 
    ,StatePE,ListePlanning,Archiverpp,DashboardCompt,DashboardComptAll,Rappel,listePaiementEleve} from
 '../../../controllers/comptabilite/paimentEleve/ContratControl.js'


const router =express.Router();

router.post('/ajouter',Ajouter);
router.get('/liste',Liste);
router.get('/find/:id',Find);
router.put('/modifier/:id',ModifierContrat);
router.patch('/archiver/:id', Archiver);

//plannig
router.put('/modifierPlanning/:id',MidifierPlanning);
router.get('/listeplanning',ListePlanning);
router.patch('/archiver/pp/:id',Archiverpp);
//static
router.get('/stats',StatePE);

//Dashboard Comptabilité:
router.post('/dashboard',DashboardCompt)
router.post('/dashboard/all',DashboardComptAll);
//rappel
router.post('/ajouterRappel',Rappel);

//recupere le contrat selon id de enfants et id du parent
router.get('/listePaimentEleve/:eleveId',listePaiementEleve)







export default router;