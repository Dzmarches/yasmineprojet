import express from "express";
import {
    getAllEcoles,
    getEcoleById,
    createEcole,
    updateEcole,
    deleteEcole,getEcoleByIds,getEcoleWithUser,
} from "../controllers/Admin/EcoleController.js"; // Ajoute .js
import { verifyToken } from "../middelware/VerifyToken.js";
import  {getMe} from '../controllers/User.js';

const router = express.Router();

// Routes pour les écoles
router.get("/", getAllEcoles);
router.get("/:id", getEcoleById);
router.get("/getecole/:id", getEcoleByIds);
router.post("/", createEcole);
router.put("/:id", updateEcole);
router.delete("/:id", deleteEcole);
// Dans routes/ecoleRoutes.js
router.get('/getecolewithuser/:id', getEcoleWithUser);

router.get("/me",verifyToken, getMe);

export default router;