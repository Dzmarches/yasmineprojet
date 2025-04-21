import express from 'express'
import { AjouterService,ModifierService,ListeService,ArchiverService } from '../../controllers/RH/serviceControl.js';
const router =express.Router();


router.post("/ajouter",AjouterService)
router.put("/modifier/:id",ModifierService)
router.get("/liste",ListeService);
router.patch("/archiver/:id",ArchiverService);


export default router