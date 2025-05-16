
import express from 'express';
import {
    employes, restaurerEmployes, supprimerEmployes, ArchiverEmployes, congeAbsences,
    restaurerCA, ArchiverCA, primes, restaurerPrimes, archiverPrimes, HeureSup, restaurerHS,
    archiverHp, heureRetard, restaurerHR, archiverHR, CAnnuel, restaurercongeAnnuel, ArchivercongeAnnuel,
    restaurerJP, archiverJP, journalpaiee, periodepaiee, restaurerPP, archiverPP, Pointagess, archiverPoint, restaurerPoint,
    restaurerService, archiverService, Services, restaurerPoste, archiverPoste, Postes,
    archiverPlannings, restaurerPlannings, archiverContrat, restaurerContrat,
    archiverD, restaurerD, archiverR, restaurerR, restaurerTR, Plannings,
    archiverTR,TypeRevenuss,restaurerTD,archiverTD,TypeDepensess,Revenuss,Depensess,Contrats
}
    from '../controllers/archivesControl.js';

const router = express.Router();

//___________________________RH_____________________________________________
//recuperer la liste des archives
router.get("/employes", employes);
router.patch("/restaurer/employes/:id", restaurerEmployes);
router.patch("/archiver/employes/:id", ArchiverEmployes);
router.delete("/supprimer/employes/:id", supprimerEmployes);
//congeAbsences
router.get("/congeAbsences", congeAbsences);
router.patch("/restaurer/congeAbsences/:id", restaurerCA);
router.patch("/archiver/congeAbsences/:id", ArchiverCA);
//CongeAnnuel
router.get("/congeAnnuel", CAnnuel);
router.patch("/restaurer/congeAnnuel/:id", restaurercongeAnnuel);
router.patch("/archiver/congeAnnuel/:id", ArchivercongeAnnuel);
//primes
router.get("/primes", primes);
router.patch("/restaurer/primes/:id", restaurerPrimes);
router.patch("/archiver/primes/:id", archiverPrimes);
//heureSup
router.get("/heureSup", HeureSup);
router.patch("/restaurer/heureSup/:id", restaurerHS);
router.patch("/archiver/heureSup/:id", archiverHp);
//prametrerReatrd
router.get("/heureRetard", heureRetard);
router.patch("/restaurer/heureRetard/:id", restaurerHR);
router.patch("/archiver/heureRetard/:id", archiverHR);
//PeriodePaie
router.get("/periodepaie", periodepaiee);
router.patch("/restaurer/periodepaie/:id", restaurerPP);
router.patch("/archiver/periodepaie/:id", archiverPP);
//JournalPaie
router.get("/journalpaie", journalpaiee);
router.patch("/restaurer/journalpaie/:id", restaurerJP);
router.patch("/archiver/journalpaie/:id", archiverJP);
//Pointages
router.get("/pointages", Pointagess);
router.patch("/restaurer/pointages/:id", restaurerPoint);
router.patch("/archiver/pointages/:id", archiverPoint);
//Poste
router.get("/poste", Postes);
router.patch("/restaurer/poste/:id", restaurerPoste);
router.patch("/archiver/poste/:id", archiverPoste);
//Service
router.get("/service", Services);
router.patch("/restaurer/service/:id", restaurerService);
router.patch("/archiver/service/:id", archiverService);

//_________________________COMPTABILITE________________________________
//Type revenus
router.get("/typeRevenu", TypeRevenuss);
router.patch("/restaurer/typeRevenu/:id", restaurerTR);
router.patch("/archiver/typeRevenu/:id", archiverTR);
//Type Depenses
router.get("/typeDepense", TypeDepensess);
router.patch("/restaurer/typeDepense/:id", restaurerTD);
router.patch("/archiver/typeDepense/:id", archiverTD);
// revenus
router.get("/revenus", Revenuss);
router.patch("/restaurer/revenus/:id", restaurerR);
router.patch("/archiver/revenus/:id", archiverR);
// Depenses
router.get("/depenses", Depensess);
router.patch("/restaurer/depenses/:id", restaurerD);
router.patch("/archiver/depenses/:id", archiverD);
// Contrat
router.get("/contrat", Contrats);
router.patch("/restaurer/contrat/:id", restaurerContrat);
router.patch("/archiver/contrat/:id", archiverContrat);
// Planning
router.get("/planning", Plannings);
router.patch("/restaurer/planning/:id", restaurerPlannings);
router.patch("/archiver/planning/:id", archiverPlannings);




export default router;
