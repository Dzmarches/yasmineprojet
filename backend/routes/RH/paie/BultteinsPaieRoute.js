import express from 'express';
import {FindEmploye,FindPeriodePaie,FindPointage,journalpaie,liste,ImprimerBTE,
    ArchiverJournalPaie,findeEnregistrer,getIRG,VoirFichesPaie,
    publierJournal,JPEmploye,listeConge,listeCongeNonEmploye}
    from '../../../controllers/RH/paie/BulletinsPaie.js'



const router=express.Router();

router.get("/employe/:id", FindEmploye);
router.get("/periodepaie/:id", FindPeriodePaie);
router.get("/employePointage/:employeId/:idPeriodepai", FindPointage);
router.post("/journalPaie", journalpaie);
router.get("/liste", liste);
router.patch("/archiver/:id",ArchiverJournalPaie);
router.get('/check-record/:employeId/:periodePaieId',findeEnregistrer)
router.get('/IRG/liste/',getIRG);
router.get('/imprimer/:idPeriodepai/:employe_id',ImprimerBTE);
// la route de voir et imprimer fiche de paie
router.get('/journalPaie/VoirFichesPaie',VoirFichesPaie);
router.put('/journalPaie/publier',publierJournal);
router.get('/journalPaie/Employe',JPEmploye);
router.get('/listeConge/:employeId/:idPeriodepai',listeConge);
router.get('/listeCongeNonE/:employeId',listeCongeNonEmploye);
  





export default router;

