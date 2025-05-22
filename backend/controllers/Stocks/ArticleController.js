import Article from '../../models/Stocks/Article.js';
import EcoleArticle from '../../models/Stocks/EcoleArticle.js';
import Categorie from '../../models/Stocks/Categorie.js';

export const getArticles = async (req, res) => {
    try {
        const ecoleId = req.user.ecoleId;
        const ecoleeId = req.user.ecoleeId;
        const roles = req.user.roles;
        const { magasin } = req.query;

        const isAdminPrincipal = roles.includes('AdminPrincipal');
        const isAdmin = roles.includes('Admin');

        let whereClause = { 
            archiver: 0,
            ...(magasin && { magasin }) // Ajouter le filtre magasin si présent
        };

        let articles;

        if (isAdminPrincipal) {
            articles = await Article.findAll({
                include: [
                    {
                        model: EcoleArticle,
                        where: { ecoleId }
                    },
                    {
                        model: Categorie,
                        attributes: ['libelle']
                    }
                ],
                where: whereClause
            });
        } else if (isAdmin) {
            articles = await Article.findAll({
                include: [
                    {
                        model: EcoleArticle,
                        where: { ecoleeId }
                    },
                    {
                        model: Categorie,
                        attributes: ['libelle']
                    }
                ],
                where: whereClause
            });
        } else {
            return res.status(403).json({ error: 'Accès non autorisé' });
        }

        res.json(articles);
    } catch (err) {
        console.error('❌ Erreur lors de la récupération des articles :', err);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

export const createArticle = async (req, res) => {
    const {
        code_article,
        libelle,
        magasinier,
        description,
        categorieId,
        magasin,
        ecoleId,
        ecoleeId
    } = req.body;

    try {
        const existing = await Article.findOne({
            where: {
                code_article,
                libelle
            }
        });

        if (existing) {
            return res.status(400).json({ error: 'Un article avec ce code et libellé existe déjà.' });
        }

        const article = await Article.create({
            code_article,
            libelle,
            magasinier,
            description,
            categorieId,
            magasin,
            date_creation: new Date()
        });

        const associationData = { articleId: article.id };
        if (ecoleId && ecoleId !== 'null') associationData.ecoleId = ecoleId;
        if (ecoleeId && ecoleeId !== 'null') associationData.ecoleeId = ecoleeId;

        await EcoleArticle.create(associationData);

        res.status(201).json({ message: 'Article créé avec succès' });
    } catch (error) {
        console.error('❌ Erreur création article :', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

export const updateArticle = async (req, res) => {
    const { id } = req.params;
    const {
        libelle,
        magasinier,
        description,
        categorieId,
        magasin
    } = req.body;

    try {
        await Article.update({
            libelle,
            magasinier,
            description,
            categorieId,
            magasin
        }, {
            where: { id }
        });

        res.json({ message: 'Article mis à jour' });
    } catch (error) {
        console.error('❌ Erreur update article :', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

export const deleteArticle = async (req, res) => {
    const { id } = req.params;

    try {
        await Article.update({ archiver: 1 }, { where: { id } });
        res.json({ message: 'Article archivé' });
    } catch (error) {
        console.error('❌ Erreur suppression article :', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

export const getCategoriesForSelect = async (req, res) => {
    try {
        const categories = await Categorie.findAll({
            where: { archiver: 0 },
            attributes: ['id', 'libelle']
        });
        res.json(categories);
    } catch (error) {
        console.error('❌ Erreur récupération catégories :', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};
