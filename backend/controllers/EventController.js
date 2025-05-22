import Event from '../models/Event.js';

// Récupérer tous les événements selon les rôles
export const getEvents = async (req, res) => {
    try {
        const ecoleId = req.user.ecoleId;     // Pour AdminPrincipal
        const ecoleeId = req.user.ecoleeId;   // Pour Admin
        const roles = req.user.roles;

        console.log('🟢 ecoleId:', ecoleId);
        console.log('🟢 ecoleeId:', ecoleeId);
        console.log('🟢 roles:', roles);

        const isAdminPrincipal = roles.includes('AdminPrincipal');
        const isAdmin = roles.includes('Admin');

        console.log('🟢 isAdminPrincipal:', isAdminPrincipal);
        console.log('🟢 isAdmin:', isAdmin);

        let events;

        if (isAdminPrincipal) {
            // Récupérer les événements liés à l'ecoleId
            events = await Event.findAll({
                where: { ecoleId }
            });
        } else if (isAdmin) {
            // Récupérer les événements liés à l'ecoleeId
            events = await Event.findAll({
                where: { ecoleeId }
            });
        } else {
            return res.status(403).json({ error: 'Accès non autorisé' });
        }

        res.json(events);
    } catch (error) {
        console.error("❌ Erreur lors de la récupération des événements :", error);
        res.status(500).json({ error: "Erreur serveur" });
    }
};

// Créer un nouvel événement
export const createEvent = async (req, res) => {
    const { title, start, allDay, backgroundColor } = req.body;
    const ecoleId = req.user.ecoleId;
    const ecoleeId = req.user.ecoleeId;
    const roles = req.user.roles;

    console.log("📥 Données reçues :", req.body);
    console.log("🟢 ecoleId:", ecoleId);
    console.log("🟢 ecoleeId:", ecoleeId);
    console.log("🟢 roles:", roles);

    const isAdminPrincipal = roles.includes('AdminPrincipal');
    const isAdmin = roles.includes('Admin');

    try {
        let newEvent;

        if (isAdminPrincipal) {
            newEvent = await Event.create({
                title,
                start,
                allDay,
                backgroundColor,
                ecoleId,
                ecoleeId: null
            });
        } else if (isAdmin) {
            newEvent = await Event.create({
                title,
                start,
                allDay,
                backgroundColor,
                ecoleId: null,
                ecoleeId
            });
        } else {
            return res.status(403).json({ error: 'Accès non autorisé à la création' });
        }

        res.status(201).json(newEvent);
    } catch (error) {
        console.error("❌ Erreur lors de la création de l'événement :", error);
        res.status(500).json({ error: "Erreur serveur" });
    }
};

// Supprimer un événement (vérification des droits)
export const deleteEvent = async (req, res) => {
    const { id } = req.params;
    const ecoleId = req.user.ecoleId;
    const ecoleeId = req.user.ecoleeId;
    const roles = req.user.roles;

    const isAdminPrincipal = roles.includes('AdminPrincipal');
    const isAdmin = roles.includes('Admin');

    try {
        const event = await Event.findByPk(id);

        if (!event) {
            return res.status(404).json({ error: "Événement non trouvé" });
        }

        // Vérifie si l'utilisateur a les droits de supprimer
        if (
            (isAdminPrincipal && event.ecoleId === ecoleId) ||
            (isAdmin && event.ecoleeId === ecoleeId)
        ) {
            await event.destroy();
            res.status(204).send(); // No Content
        } else {
            return res.status(403).json({ error: "Suppression non autorisée" });
        }
    } catch (error) {
        console.error("❌ Erreur lors de la suppression de l'événement :", error);
        res.status(500).json({ error: "Erreur serveur" });
    }
};
// Mettre à jour un événement existant
export const updateEvent = async (req, res) => {
    const { id } = req.params;
    const { title, start, allDay, backgroundColor } = req.body;

    const ecoleId = req.user.ecoleId;
    const ecoleeId = req.user.ecoleeId;
    const roles = req.user.roles;

    const isAdminPrincipal = roles.includes('AdminPrincipal');
    const isAdmin = roles.includes('Admin');

    try {
        const event = await Event.findByPk(id);

        if (!event) {
            return res.status(404).json({ error: "Événement non trouvé" });
        }

        // Vérifie si l'utilisateur a les droits de modification
        if (
            (isAdminPrincipal && event.ecoleId === ecoleId) ||
            (isAdmin && event.ecoleeId === ecoleeId)
        ) {
            event.title = title !== undefined ? title : event.title;
            event.start = start !== undefined ? start : event.start;
            event.allDay = allDay !== undefined ? allDay : event.allDay;
            event.backgroundColor = backgroundColor !== undefined ? backgroundColor : event.backgroundColor;

            await event.save();

            res.json(event);
        } else {
            return res.status(403).json({ error: "Modification non autorisée" });
        }
    } catch (error) {
        console.error("❌ Erreur lors de la modification de l'événement :", error);
        res.status(500).json({ error: "Erreur serveur" });
    }
};
