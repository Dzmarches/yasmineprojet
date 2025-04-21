import CycleScolaire from '../../models/CycleScolaire.js';

// Récupérer tous les cycles scolaires non archivés
export const getCyclesScolaires = async (req, res) => {
    try {
        const cycles = await CycleScolaire.findAll({ where: { archiver: 0 } });
        res.json(cycles);
    } catch (err) {
        console.error("Erreur lors de la récupération des cycles :", err);
        res.status(500).json({ error: "Erreur interne du serveur." });
    }
};

// Ajouter un cycle scolaire
export const createCycleScolaire = async (req, res) => {
    const { nomCycle, nomCycleArabe, classement } = req.body;

    if (!nomCycle || !nomCycleArabe || classement === undefined) {
        return res.status(400).json({ error: "Tous les champs sont requis." });
    }

    try {
        const cycle = await CycleScolaire.create({ 
            nomCycle, 
            nomCycleArabe, 
            classement,
            archiver: 0 
        });
        return res.status(201).json({ message: "Cycle scolaire ajouté avec succès", cycle });
    } catch (err) {
        console.error("Erreur lors de l'ajout :", err);
        return res.status(500).json({ error: "Erreur interne du serveur." });
    }
};

// Modifier un cycle scolaire
export const updateCycleScolaire = async (req, res) => {
    const { id } = req.params;
    const { nomCycle, nomCycleArabe, classement } = req.body;

    if (!nomCycle || !nomCycleArabe || classement === undefined) {
        return res.status(400).json({ error: "Tous les champs sont requis." });
    }

    try {
        const cycle = await CycleScolaire.findByPk(id);
        if (!cycle) return res.status(404).json({ error: "Cycle scolaire non trouvé" });

        await cycle.update({ nomCycle, nomCycleArabe, classement });
        return res.status(200).json({ message: "Cycle scolaire modifié avec succès", cycle });
    } catch (err) {
        console.error("Erreur lors de la modification :", err);
        return res.status(500).json({ error: "Erreur interne du serveur." });
    }
};

// Supprimer un cycle scolaire (archiver)
export const deleteCycleScolaire = async (req, res) => {
    const { id } = req.params;

    try {
        const [updated] = await CycleScolaire.update({ archiver: 1 }, { where: { id } });
        if (!updated) return res.status(404).json({ error: "Cycle scolaire non trouvé" });

        return res.status(200).json({ message: `Cycle scolaire avec l'ID ${id} archivé avec succès` });
    } catch (err) {
        console.error("Erreur lors de l'archivage :", err);
        return res.status(500).json({ error: "Erreur interne du serveur." });
    }
};