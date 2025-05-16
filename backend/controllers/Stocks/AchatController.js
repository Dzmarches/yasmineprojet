import Achat from '../../models/Stocks/Achat.js';
import EcoleAchat from '../../models/Stocks/EcoleAchat.js';
import Article from '../../models/Stocks/Article.js';
import Fournisseur from '../../models/Stocks/Fournisseur.js';

export const getAchats = async (req, res) => {
    try {
        const ecoleId = req.user.ecoleId;
        const ecoleeId = req.user.ecoleeId;
        const roles = req.user.roles;

        const isAdminPrincipal = roles.includes('AdminPrincipal');
        const isAdmin = roles.includes('Admin');

        let achats;

        if (isAdminPrincipal) {
            achats = await Achat.findAll({
                include: [
                    {
                        model: Article,
                        attributes: ['libelle']
                    },
                    {
                        model: Fournisseur,
                        attributes: ['nom']
                    }
                ],
                where: { archiver: 0 }
            });
        } else if (isAdmin) {
            achats = await Achat.findAll({
                include: [
                    {
                        model: Article,
                        attributes: ['libelle']
                    },
                    {
                        model: Fournisseur,
                        attributes: ['nom']
                    }
                ],
                where: { archiver: 0 }
            });
        } else {
            return res.status(403).json({ error: 'Accès non autorisé' });
        }

        res.json(achats);
    } catch (err) {
        console.error('❌ Erreur lors de la récupération des achats :', err);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

export const createAchat = async (req, res) => {
    const {
        articleId,
        fournisseurId,
        prix,
        devise,
        tva,
        unite,
        date_achat,
        date_peremption,
        description,
        ecoleId,
        ecoleeId
    } = req.body;

    try {
        const achat = await Achat.create({
            articleId,
            fournisseurId,
            prix,
            devise,
            tva,
            unite,
            date_achat,
            date_peremption,
            description,
            date_creation: new Date()
        });

        const associationData = {
            achatId: achat.id,
        };

        if (ecoleId && ecoleId !== 'null') associationData.ecoleId = ecoleId;
        if (ecoleeId && ecoleeId !== 'null') associationData.ecoleeId = ecoleeId;

        await EcoleAchat.create(associationData);

        res.status(201).json({ message: 'Achat créé avec succès' });
    } catch (error) {
        console.error('❌ Erreur création achat :', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

export const updateAchat = async (req, res) => {
    const { id } = req.params;
    const {
        prix,
        devise,
        tva,
        unite,
        date_peremption,
        description
    } = req.body;

    try {
        await Achat.update({
            prix,
            devise,
            tva,
            unite,
            date_peremption,
            description
        }, {
            where: { id }
        });

        res.json({ message: 'Achat mis à jour' });
    } catch (error) {
        console.error('❌ Erreur update achat :', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

export const deleteAchat = async (req, res) => {
    const { id } = req.params;

    try {
        await Achat.update({ archiver: 1 }, { where: { id } });
        res.json({ message: 'Achat archivé' });
    } catch (error) {
        console.error('❌ Erreur suppression achat :', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

export const getFournisseursForSelect = async (req, res) => {
    try {
        const fournisseurs = await Fournisseur.findAll({
            where: { actif: true },
            attributes: ['id', 'nom']
        });
        res.json(fournisseurs);
    } catch (error) {
        console.error('❌ Erreur récupération fournisseurs :', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};
