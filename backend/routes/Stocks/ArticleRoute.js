// routes/Stock/articleRoutes.js
import express from 'express';
import {
    getArticles,
    createArticle,
    updateArticle,
    deleteArticle,
    getCategoriesForSelect
} from '../../controllers/Stocks/ArticleController.js';

const router = express.Router();

router.get('/', getArticles);
router.get('/categories', getCategoriesForSelect);
router.post('/', createArticle);
router.put('/:id', updateArticle);
router.delete('/:id', deleteArticle);

export default router;