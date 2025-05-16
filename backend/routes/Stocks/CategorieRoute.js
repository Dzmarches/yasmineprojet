import express from 'express';
import {getCategories,createCategorie,updateCategorie,deleteCategorie
} from '../../controllers/Stocks/CategorieController.js';


const router = express.Router();

router.get('/', getCategories);
router.post('/save', createCategorie);
router.put('/:id', updateCategorie);
router.delete('/delet/:id', deleteCategorie);

export default router;
