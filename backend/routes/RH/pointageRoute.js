import express from 'express';
import { AjouterPointage,ModifierPointage,Listepointage,InfoPointageToday,
    Listepointagedate,AjouterPointageLocalisation,setAllpoinates,ecoleD,ListepointageRapport
    ,ecoleEmployerUser,marquerabsences,archiver}
 from '../../controllers/RH/pointageControl.js';
 

const router = express.Router();

router.post("/ajouter", AjouterPointage);
router.put("/modifier/:id",ModifierPointage );
router.get("/liste",Listepointage );
router.get("/liste/date",Listepointagedate );
router.post("/ajouter/localisation/",AjouterPointageLocalisation);
router.get("/InfoPointageToday",InfoPointageToday);
router.get("/allpointages",setAllpoinates);
router.get('/ecoleD', ecoleD);
router.get('/ListepointageRapport', ListepointageRapport);
router.get('/ecoleDEmploye/:id', ecoleEmployerUser);
router.post('/marquerabsences', marquerabsences);
router.patch('/archiver/:id', archiver);







export default router;