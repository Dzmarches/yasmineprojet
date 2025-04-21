import express from 'express';
import { 
    ListeParents, 
    getParentById, 
    createParent, 
    updateParent, 
    deleteParent 
} from '../../controllers/Admin/ParentController.js';
import { verifyToken } from '../../middelware/VerifyToken.js';
import checkPermission from '../../middelware/PermissionMiddleware.js';

const router = express.Router();

router.get('/', verifyToken, checkPermission('Administration-Gestion parents-Voir'), ListeParents);
router.get('/:id', verifyToken, getParentById);
router.post('/', verifyToken, createParent);
router.put('/:id', verifyToken, updateParent);
router.delete('/:id', verifyToken, deleteParent);

export default router;