import Trimest from '../../models/Admin/Trimest.js';

// Récupérer tous les trimestres non archivés
export const getTrimestres = async (req, res) => {
    try {
        const trimestres = await Trimest.findAll({ where: { archiver: 0 } });
        res.json(trimestres);
    } catch (err) {
        console.error("Erreur lors de la récupération des trimestres :", err);
        res.status(500).json({ error: 'Erreur lors de la récupération des trimestres' });
    }
};

// Ajouter un nouveau trimestre
export const createTrimest = async (req, res) => {
    const { titre, titre_ar, datedebut, datefin } = req.body;

    if (!titre || !titre_ar || !datedebut || !datefin) {
        return res.status(400).json({ error: 'Le titre, le titre en arabe, la date de début et la date de fin sont requis.' });
    }

    try {
        const newTrimest = await Trimest.create({ titre, titre_ar, datedebut, datefin, archiver: 0 });
        res.status(201).json({ message: 'Trimestre ajouté avec succès', newTrimest });
    } catch (err) {
        res.status(500).json({ error: 'Erreur lors de l\'ajout du trimestre' });
    }
};

// Modifier un trimestre
export const updateTrimest = async (req, res) => {
    const { id } = req.params;
    const { titre, titre_ar, datedebut, datefin } = req.body;

    if (!titre || !titre_ar || !datedebut || !datefin) {
        return res.status(400).json({ error: 'Le titre, le titre en arabe, la date de début et la date de fin sont requis.' });
    }

    try {
        const trimestToUpdate = await Trimest.findOne({ where: { id } });
        if (!trimestToUpdate) return res.status(404).json({ error: 'Trimestre non trouvé' });

        await trimestToUpdate.update({ titre, titre_ar, datedebut, datefin });
        res.status(200).json({ message: 'Trimestre modifié avec succès', trimestToUpdate });
    } catch (err) {
        res.status(500).json({ error: 'Erreur lors de la modification du trimestre' });
    }
};

// Supprimer un trimestre (archiver)
export const deleteTrimest = async (req, res) => {
    const { id } = req.params;

    try {
        const [updated] = await Trimest.update({ archiver: 1 }, { where: { id } });
        if (!updated) return res.status(404).json({ error: 'Trimestre non trouvé' });

        res.status(200).json({ message: `Trimestre avec l'ID ${id} archivé avec succès` });
    } catch (err) {
        console.error("Erreur lors de l'archivage du trimestre :", err);
        res.status(500).json({ error: 'Erreur lors de l\'archivage du trimestre' });
    }
};

// import Trimest from '../../models/Admin/Trimest.js';

// // Récupérer tous les trimestres non archivés
// export const getTrimestres = async (req, res) => {
//     try {
//         const ecoleId = req.user.ecoleId; // ecoleId de l'AdminPrincipal
//         const roles = req.user.roles; // Rôles de l'utilisateur
//         const ecoleeId = req.user.ecoleeId; // ecoleeId de l'Admin

//         const isAdminPrincipal = roles.includes('AdminPrincipal');
//         const isAdmin = roles.includes('Admin');

//         let trimestres;

//         if (isAdminPrincipal) {
//             trimestres = await Trimest.findAll({ where: { ecoleId, archiver: 0 } });
//         } else if (isAdmin) {
//             trimestres = await Trimest.findAll({ where: { ecoleeId, archiver: 0 } });
//         } else {
//             return res.status(403).json({ error: 'Accès non autorisé' });
//         }

//         res.json(trimestres);
//     } catch (err) {
//         console.error("Erreur lors de la récupération des trimestres :", err);
//         res.status(500).json({ error: 'Erreur lors de la récupération des trimestres' });
//     }
// };

// // Ajouter un nouveau trimestre
// export const createTrimest = async (req, res) => {
//     const { titre, titre_ar, datedebut, datefin, ecoleId, ecoleeId } = req.body;

//     // Convertir ecoleeId en null si c'est une chaîne vide ou 'null'
//     const ecoleeIdFinal = (ecoleeId === '' || ecoleeId === 'null') ? null : parseInt(ecoleeId, 10);

//     console.log('Données reçues :', { titre, titre_ar, datedebut, datefin, ecoleId, ecoleeId: ecoleeIdFinal }); // Ajoutez ce log

//     if (!titre || !titre_ar || !datedebut || !datefin) {
//         return res.status(400).json({ error: 'Le titre, le titre en arabe, la date de début et la date de fin sont requis.' });
//     }

//     try {
//         const newTrimest = await Trimest.create({
//             titre,
//             titre_ar,
//             datedebut,
//             datefin,
//             ecoleId,
//             ecoleeId: ecoleeIdFinal, // Utilisez la valeur convertie
//             archiver: 0,
//         });
//         res.status(201).json({ message: 'Trimestre ajouté avec succès', newTrimest });
//     } catch (err) {
//         console.error('Erreur lors de la création du trimestre :', err); // Ajoutez ce log
//         res.status(500).json({ error: 'Erreur lors de l\'ajout du trimestre' });
//     }
// };

// // Modifier un trimestre
// export const updateTrimest = async (req, res) => {
//     const { id } = req.params;
//     const { titre, titre_ar, datedebut, datefin, ecoleId, ecoleeId } = req.body;

//     // Convertir ecoleeId en null si c'est une chaîne vide ou 'null'
//     const ecoleeIdFinal = (ecoleeId === '' || ecoleeId === 'null') ? null : parseInt(ecoleeId, 10);

//     console.log('Données reçues pour la modification :', { titre, titre_ar, datedebut, datefin, ecoleId, ecoleeId: ecoleeIdFinal }); // Ajoutez ce log

//     if (!titre || !titre_ar || !datedebut || !datefin) {
//         return res.status(400).json({ error: 'Le titre, le titre en arabe, la date de début et la date de fin sont requis.' });
//     }

//     try {
//         const trimestToUpdate = await Trimest.findOne({ where: { id } });
//         if (!trimestToUpdate) return res.status(404).json({ error: 'Trimestre non trouvé' });

//         await trimestToUpdate.update({
//             titre,
//             titre_ar,
//             datedebut,
//             datefin,
//             ecoleId,
//             ecoleeId: ecoleeIdFinal, // Utilisez la valeur convertie
//         });
//         res.status(200).json({ message: 'Trimestre modifié avec succès', trimestToUpdate });
//     } catch (err) {
//         console.error('Erreur lors de la modification du trimestre :', err); // Ajoutez ce log
//         res.status(500).json({ error: 'Erreur lors de la modification du trimestre' });
//     }
// };
// // Supprimer un trimestre (archiver)
// export const deleteTrimest = async (req, res) => {
//     const { id } = req.params;

//     try {
//         const [updated] = await Trimest.update({ archiver: 1 }, { where: { id } });
//         if (!updated) return res.status(404).json({ error: 'Trimestre non trouvé' });

//         res.status(200).json({ message: `Trimestre avec l'ID ${id} archivé avec succès` });
//     } catch (err) {
//         console.error("Erreur lors de l'archivage du trimestre :", err);
//         res.status(500).json({ error: 'Erreur lors de l\'archivage du trimestre' });
//     }
// };