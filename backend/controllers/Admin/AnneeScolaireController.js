import Anneescolaire from '../models/Admin/Anneescolaire.js';

// Récupérer toutes les années scolaires non archivées
export const getAnneesScolaires = async (req, res) => {
    try {
        const annees = await Anneescolaire.findAll({ where: { archiver: 0 } });
        res.json(annees);
    } catch (err) {
        console.error("Erreur lors de la récupération des années scolaires :", err);
        res.status(500).json({ error: 'Erreur lors de la récupération des années scolaires' });
    }
};

// Ajouter une nouvelle année scolaire
export const createAnneeScolaire = async (req, res) => {
    const { titre, titre_ar, datedebut, datefin } = req.body;

    // Validation des champs obligatoires
    if (!titre || !titre_ar || !datedebut || !datefin) {
        return res.status(400).json({ error: 'Le titre, le titre en arabe, la date de début et la date de fin sont requis.' });
    }

    try {
        const newAnneescolaire = await Anneescolaire.create({ titre, titre_ar, datedebut, datefin, archiver: 0 });
        res.status(201).json({ message: 'Année scolaire ajoutée avec succès', newAnneescolaire });
    } catch (err) {
        console.error("Erreur lors de l'ajout de l'année scolaire :", err);
        res.status(500).json({ error: 'Erreur lors de l\'ajout de l\'année scolaire' });
    }
};

// Modifier une année scolaire
export const updateAnneeScolaire = async (req, res) => {
    const { id } = req.params;
    const { titre, titre_ar, datedebut, datefin } = req.body;

    // Validation des champs obligatoires
    if (!titre || !titre_ar || !datedebut || !datefin) {
        return res.status(400).json({ error: 'Le titre, le titre en arabe, la date de début et la date de fin sont requis.' });
    }

    try {
        const anneescolaireToUpdate = await Anneescolaire.findOne({ where: { id } });
        if (!anneescolaireToUpdate) return res.status(404).json({ error: 'Année scolaire non trouvée' });

        await anneescolaireToUpdate.update({ titre, titre_ar, datedebut, datefin });
        res.status(200).json({ message: 'Année scolaire modifiée avec succès', anneescolaireToUpdate });
    } catch (err) {
        console.error("Erreur lors de la modification de l'année scolaire :", err);
        res.status(500).json({ error: 'Erreur lors de la modification de l\'année scolaire' });
    }
};

// Supprimer une année scolaire (archiver)
export const deleteAnneeScolaire = async (req, res) => {
    const { id } = req.params;

    try {
        const [updated] = await Anneescolaire.update({ archiver: 1 }, { where: { id } });
        if (!updated) return res.status(404).json({ error: 'Année scolaire non trouvée' });

        res.status(200).json({ message: `Année scolaire avec l'ID ${id} archivée avec succès` });
    } catch (err) {
        console.error("Erreur lors de l'archivage de l'année scolaire :", err);
        res.status(500).json({ error: 'Erreur lors de l\'archivage de l\'année scolaire' });
    }
};