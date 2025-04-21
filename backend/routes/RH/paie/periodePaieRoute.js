import express from 'express';
import {AjouterPeriodePaie,ModifierPeriodePaie,ListePeriodePaie,ArchiverPeriodePaie}from 
'../../../controllers/RH/paie/periodesPaieControl.js'



const router=express.Router();

router.post("/ajouter", AjouterPeriodePaie);
router.put("/modifier/:id",ModifierPeriodePaie );
router.get("/liste",ListePeriodePaie );
router.patch("/archiver/:id",ArchiverPeriodePaie);


export default router;

