import express from 'express';
import { AjouterPost, ModifierPost, ListPost,ArchiverPoste } from '../../controllers/RH/postControl.js';

const router = express.Router();
router.post("/ajouter", AjouterPost);
router.put("/modifier/:id", ModifierPost);
router.get("/liste", ListPost);
// router.get("/liste", ListPost);
router.patch("/archiver/:id",ArchiverPoste)

export default router;