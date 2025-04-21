import Salle from '../../models/Admin/Salle.js';

// Récupérer toutes les salles non archivées
export const getSalles = async (req, res) => {
    try {
        // Récupérer les informations de l'utilisateur connecté
        const ecoleId = req.user.ecoleId; // ecoleId de l'AdminPrincipal
        const roles = req.user.roles; // Rôles de l'utilisateur
        const ecoleeId = req.user.ecoleeId; // ecoleeId de l'Admin

        // Vérifier les rôles de l'utilisateur
        const isAdminPrincipal = roles.includes('AdminPrincipal');
        const isAdmin = roles.includes('Admin');

        let salles;

        if (isAdminPrincipal) {
            // Récupérer les salles pour AdminPrincipal (filtrer par ecoleId)
            salles = await Salle.findAll({
                where: { ecoleId, archiver: 0 }, // Filtrer par ecoleId et salles non archivées
            });
        } else if (isAdmin) {
            // Récupérer les salles pour Admin (filtrer par ecoleeId)
            salles = await Salle.findAll({
                where: { ecoleeId, archiver: 0 }, // Filtrer par ecoleeId et salles non archivées
            });
        } else {
            // Si l'utilisateur n'a pas de rôle valide, retourner une erreur
            return res.status(403).json({ error: 'Accès non autorisé' });
        }

        res.json(salles);
    } catch (err) {
        console.error("Erreur lors de la récupération des salles :", err);
        res.status(500).json({ error: 'Erreur lors de la récupération des salles' });
    }
};

// Ajouter une nouvelle salle
export const createSalle = async (req, res) => {
    const { salle, sallearab, capacité, remarque, ecoleId, ecoleeId } = req.body;

    if (!salle || !sallearab || !capacité || !ecoleId) {
        return res.status(400).json({ error: 'Le nom de la salle, le nom arabe, la capacité et ecoleId sont requis.' });
    }

    try {
        const newSalle = await Salle.create({
            salle,
            sallearab,
            capacité,
            remarque,
            ecoleId,
            ecoleeId: ecoleeId === "null" ? null : ecoleeId, // Gérer ecoleeId
            archiver: 0,
        });
        res.status(201).json({ message: 'Salle ajoutée avec succès', newSalle });
    } catch (err) {
        console.error("Erreur lors de l'ajout de la salle :", err);
        res.status(500).json({ error: 'Erreur lors de l\'ajout de la salle' });
    }
};

// Modifier une salle
export const updateSalle = async (req, res) => {
    const { id } = req.params;
    const { salle, sallearab, capacité, remarque, ecoleId, ecoleeId } = req.body;

    if (!salle || !sallearab || !capacité || !ecoleId) {
        return res.status(400).json({ error: 'Le nom de la salle, le nom arabe, la capacité et ecoleId sont requis.' });
    }

    try {
        const salleToUpdate = await Salle.findOne({ where: { id } });
        if (!salleToUpdate) return res.status(404).json({ error: 'Salle non trouvée' });

        await salleToUpdate.update({
            salle,
            sallearab,
            capacité,
            remarque,
            ecoleId,
            ecoleeId: ecoleeId === "null" ? null : ecoleeId, // Gérer ecoleeId
        });
        res.status(200).json({ message: 'Salle modifiée avec succès', salleToUpdate });
    } catch (err) {
        console.error("Erreur lors de la modification de la salle :", err);
        res.status(500).json({ error: 'Erreur lors de la modification de la salle' });
    }
};

// Supprimer une salle (archiver)
export const deleteSalle = async (req, res) => {
    const { id } = req.params;

    try {
        const [updated] = await Salle.update({ archiver: 1 }, { where: { id } });
        if (!updated) return res.status(404).json({ error: 'Salle non trouvée' });

        res.status(200).json({ message: `Salle avec l'ID ${id} archivée avec succès` });
    } catch (err) {
        console.error("Erreur lors de l'archivage de la salle :", err);
        res.status(500).json({ error: 'Erreur lors de l\'archivage de la salle' });
    }
};