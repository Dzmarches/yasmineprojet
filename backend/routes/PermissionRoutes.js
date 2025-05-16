// routes/permissionRoutes.js
import express from "express";
import { getUserPermissions } from "../controllers/permissionController.js";

const router = express.Router();

router.get("/perm/:userId", getUserPermissions);

export default router;