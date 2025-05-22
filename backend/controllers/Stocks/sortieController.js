import Sortie from '../../models/Stocks/sortie.js';
import Employe from '../../models/RH/employe.js';
import Article from '../../models/Stocks/Article.js';
import Categorie from '../../models/Stocks/Categorie.js';
import User from '../../models/User.js';
import EcoleSortie from '../../models/Stocks/EcoleSortie.js';


export const getSorties = async (req, res) => {
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

        let sorties; // Déclaration en dehors des blocs if
        if (isAdminPrincipal) {
            sorties = await Sortie.findAll({
                include: [
                    {
                        model: EcoleSortie,
                        where: { ecoleId }
                    },
                    {
                        model: Employe,
                        include: {
                            model: User,
                            attributes: ['nom', 'prenom']
                        },
                        attributes: ['id']
                    },
                    {
                        model: Article,
                        include: {
                            model: Categorie,
                            attributes: ['libelle']
                        },
                        attributes: ['id', 'libelle', 'magasin']
                    }
                ],
                where: whereClause,
                order: [['date_sortie', 'DESC']]
            });
        } else if (isAdmin) {
            sorties = await Sortie.findAll({
                include: [
                    {
                        model: EcoleSortie,
                        where: { ecoleeId }
                    },
                    {
                        model: Employe,
                        include: {
                            model: User,
                            attributes: ['nom', 'prenom']
                        },
                        attributes: ['id']
                    },
                    {
                        model: Article,
                        include: {
                            model: Categorie,
                            attributes: ['libelle']
                        },
                        attributes: ['id', 'libelle', 'magasin']
                    }
                ],
                where: whereClause,
                order: [['date_sortie', 'DESC']]
            });
        } else {
            return res.status(403).json({ error: 'Accès non autorisé' });
        }

        console.log('sorties', sorties); // Correction du log
        res.json(sorties);
    } catch (err) {
        console.error('❌ Erreur récupération sorties :', err);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};


export const createSortie = async (req, res) => {
    const { ecoleId, ecoleeId } = req.user;
    const { employeId, articleId, quantite, nomcomplet, date_sortie } = req.body;

    try {
        const sortie = await Sortie.create({
            employeId,
            articleId,
            quantite,
            nomcomplet,
            date_sortie,
        });

        await EcoleSortie.create({
            sortieId: sortie.id,
            ecoleId,
            ecoleeId,
        });

        res.status(201).json({ message: '✅ Sortie créée avec succès', sortie });
    } catch (err) {
        console.error('❌ Erreur création sortie :', err);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

export const updateSortie = async (req, res) => {
    const { id } = req.params;
    const { employeId, articleId, quantite, nomcomplet, date_sortie } = req.body;

    try {
        await Sortie.update(
            {
                employeId,
                articleId,
                quantite,
                nomcomplet,
                date_sortie,
            },
            { where: { id } }
        );

        res.json({ message: '✅ Sortie mise à jour avec succès' });
    } catch (err) {
        console.error('❌ Erreur update sortie :', err);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

export const deleteSortie = async (req, res) => {
    const { id } = req.params;

    try {
        await Sortie.destroy({ where: { id } });
        res.json({ message: '🗑️ Sortie supprimée avec succès' });
    } catch (err) {
        console.error('❌ Erreur suppression sortie :', err);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

