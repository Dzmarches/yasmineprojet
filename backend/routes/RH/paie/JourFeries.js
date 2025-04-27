import express from 'express';
import {AjouterJF,ModifierJF,ListeJF,ArchiverJF}from '../../../controllers/RH/paie/joursferies.js'



const router=express.Router();

router.post("/ajouter", AjouterJF);
router.put("/modifier/:id",ModifierJF );
router.get("/liste",ListeJF );
router.patch("/archiver/:id",ArchiverJF);


export default router;

