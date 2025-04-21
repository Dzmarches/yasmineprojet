import express from 'express';
import {
    listRoles,
    addRole,
    updateRole,
    archiveRole,
    restoreRole,
} from '../controllers/RoleController.js';

const router = express.Router();

// Lister tous les rôles
router.get('/liste', listRoles);

// Ajouter un rôle
router.post('/ajouter', addRole);

// Modifier un rôle
router.put('/modifier/:id', updateRole);

// Archiver un rôle
router.patch('/archiver/:id', archiveRole);

// Restaurer un rôle archivé
router.patch('/restaurer/:id', restoreRole);

export default router;