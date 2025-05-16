import Event from '../models/Event.js';

// Récupérer tous les événements
export const getEvents = async (req, res) => {
    try {
        const events = await Event.findAll();
        res.json(events);
    } catch (error) {
        console.error("Erreur lors de la récupération des événements :", error);
        res.status(500).json({ error: "Erreur serveur" });
    }
};

// Créer un nouvel événement
export const createEvent = async (req, res) => {
    const { title, start, allDay, backgroundColor } = req.body;

    console.log("Données reçues :", req.body); // Log des données reçues

    try {
        const newEvent = await Event.create({ title, start, allDay, backgroundColor });
        res.status(201).json(newEvent);
    } catch (error) {
        console.error("Erreur lors de l'ajout de l'événement :", error);
        res.status(500).json({ error: "Erreur serveur" });
    }
};

// Supprimer un événement
export const deleteEvent = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedEvent = await Event.destroy({ where: { id } });
        if (deletedEvent) {
            res.status(204).send(); // No Content
        } else {
            res.status(404).json({ error: "Événement non trouvé" });
        }
    } catch (error) {
        console.error("Erreur lors de la suppression de l'événement :", error);
        res.status(500).json({ error: "Erreur serveur" });
    }
};