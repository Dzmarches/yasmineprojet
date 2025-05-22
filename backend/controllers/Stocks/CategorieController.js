import Categorie from '../../models/Stocks/Categorie.js';
import EcoleCategorie from '../../models/Stocks/EcoleCategorie.js';

export const getCategories = async (req, res) => {
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

        let categories;

        if (isAdminPrincipal) {
            categories = await Categorie.findAll({
                include: [{
                    model: EcoleCategorie,
                    where: { ecoleId }
                }],
                where: whereClause
            });
        } else if (isAdmin) {
            categories = await Categorie.findAll({
                include: [{
                    model: EcoleCategorie,
                    where: { ecoleeId }
                }],
                where: whereClause
            });
        } else {
            return res.status(403).json({ error: 'Accès non autorisé' });
        }

        res.json(categories);
    } catch (err) {
        console.error('❌ Erreur lors de la récupération des catégories :', err);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

export const createCategorie = async (req, res) => {
    const { code_categorie, libelle, description, magasin, ecoleId, ecoleeId } = req.body;

    try {
        const categorie = await Categorie.create({
            code_categorie,
            libelle,
            description,
            magasin,
            date_creation: new Date()
        });

        const associationData = {
            categorieId: categorie.id,
        };

        if (ecoleId && ecoleId !== 'null') associationData.ecoleId = ecoleId;
        if (ecoleeId && ecoleeId !== 'null') associationData.ecoleeId = ecoleeId;

        await EcoleCategorie.create(associationData);

        res.status(201).json({ message: 'Catégorie créée avec succès' });
    } catch (error) {
        console.error('❌ Erreur création :', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

export const updateCategorie = async (req, res) => {
    const { id } = req.params;
    const { libelle, description, magasin } = req.body;

    try {
        await Categorie.update({
            libelle,
            description,
            magasin,
            date_modification: new Date()
        }, {
            where: { id }
        });

        res.json({ message: 'Catégorie mise à jour' });
    } catch (error) {
        console.error('❌ Erreur update :', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

export const deleteCategorie = async (req, res) => {
    const { id } = req.params;

    try {
        await Categorie.update({ archiver: 1 }, { where: { id } });
        res.json({ message: 'Catégorie archivée' });
    } catch (error) {
        console.error('❌ Erreur suppression :', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};
