import Fournisseur from '../../models/Stocks/Fournisseur.js';
import EcoleFournisseur from '../../models/Stocks/EcoleFournisseur.js';

export const getFournisseurs = async (req, res) => {
    try {
        // Récupère les infos utilisateur à partir du token
        const { ecoleId, ecoleeId, roles } = req.user;

        const isAdminPrincipal = roles.includes('AdminPrincipal');
        const isAdmin = roles.includes('Admin');

        let fournisseurs;

        if (isAdminPrincipal) {
            fournisseurs = await Fournisseur.findAll({
                include: [{
                    model: EcoleFournisseur,
                    where: { ecoleId },
                    required: true
                }],
                where: { archiver: 0 }
            });
        } else if (isAdmin) {
            fournisseurs = await Fournisseur.findAll({
                include: [{
                    model: EcoleFournisseur,
                    where: { ecoleeId },
                    required: true
                }],
                where: { archiver: 0 }
            });
        } else {
            return res.status(403).json({ error: 'Accès non autorisé' });
        }

        res.json(fournisseurs);
    } catch (err) {
        console.error('❌ Erreur lors de la récupération des fournisseurs :', err);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

export const createFournisseur = async (req, res) => {
    const {
        nom,
        contact,
        email,
        adresse,
        telephone
    } = req.body;

    try {
        const { ecoleId, ecoleeId } = req.user;

        const fournisseur = await Fournisseur.create({
            nom,
            contact,
            email,
            adresse,
            telephone,
            archiver: 0,  // Nouveau fournisseur non archivé par défaut
            date_creation: new Date()
        });

        // Créer l'association avec l'école
        await EcoleFournisseur.create({
            fournisseurId: fournisseur.id,
            ecoleId: ecoleId !== 'null' ? ecoleId : null,
            ecoleeId: ecoleeId !== 'null' ? ecoleeId : null
        });

        res.status(201).json({
            message: 'Fournisseur créé avec succès',
            fournisseur
        });
    } catch (error) {
        console.error('❌ Erreur création fournisseur :', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

export const updateFournisseur = async (req, res) => {
    const { id } = req.params;
    const {
        nom,
        contact,
        email,
        adresse,
        telephone
    } = req.body;

    try {
        const [updated] = await Fournisseur.update({
            nom,
            contact,
            email,
            adresse,
            telephone
        }, {
            where: { id }
        });

        if (updated) {
            const updatedFournisseur = await Fournisseur.findByPk(id);
            res.json({
                message: 'Fournisseur mis à jour',
                fournisseur: updatedFournisseur
            });
        } else {
            res.status(404).json({ error: 'Fournisseur non trouvé' });
        }
    } catch (error) {
        console.error('❌ Erreur update fournisseur :', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

export const deleteFournisseur = async (req, res) => {
    const { id } = req.params;

    try {
        const updated = await Fournisseur.update({ archiver: 1 }, {
            where: { id }
        });

        if (updated[0] === 1) {
            res.json({ message: 'Fournisseur archivé' });
        } else {
            res.status(404).json({ error: 'Fournisseur non trouvé' });
        }
    } catch (error) {
        console.error('❌ Erreur suppression fournisseur :', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};
