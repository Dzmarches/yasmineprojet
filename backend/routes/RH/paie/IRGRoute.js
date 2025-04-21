import express from 'express';
import {AjouterIRG,ModifierIRG,ListeIRG,ArchiverIRG}from '../../../controllers/RH/paie/IRGControl.js'



const router=express.Router();

router.post("/ajouter", AjouterIRG);
router.put("/modifier/:id",ModifierIRG );
router.get("/liste",ListeIRG );
router.patch("/archiver/:id",ArchiverIRG);


export default router;

