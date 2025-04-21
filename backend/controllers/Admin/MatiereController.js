import EcoleMatiere from '../../models/Admin/EcoleMatiere.js';
import Matiere from '../../models/Admin/Matiere.js';
import { Op } from 'sequelize';

// Récupérer toutes les matières non archivées

// Récupérer toutes les matières non archivées en fonction du rôle de l'utilisateur
export const getMatieres = async (req, res) => {
    try {
        // Récupérer les informations de l'utilisateur connecté
        const ecoleId = req.user.ecoleId; // ecoleId de l'AdminPrincipal
        const roles = req.user.roles; // Rôles de l'utilisateur
        const userId = req.user.id; // ID de l'utilisateur connecté
        const ecoleeId = req.user.ecoleeId; // ecoleeId de l'Admin

        // Afficher les informations de l'utilisateur pour le débogage
        console.log('🟢 ecoleId:', ecoleId);
        console.log('🟢 roles:', roles);
        console.log('🟢 userId:', userId);
        console.log('🟢 ecoleeId:', ecoleeId);

        // Vérifier les rôles de l'utilisateur
        const isAdminPrincipal = roles.includes('AdminPrincipal');
        const isAdmin = roles.includes('Admin');

        console.log('🟢 isAdminPrincipal:', isAdminPrincipal);
        console.log('🟢 isAdmin:', isAdmin);

        let matieres;

        if (isAdminPrincipal) {
            // Récupérer les matières pour AdminPrincipal (filtrer par ecoleId)
            matieres = await Matiere.findAll({
                include: [{
                    model: EcoleMatiere,
                    where: { ecoleId }, // Filtrer par ecoleId
                }],
                where: { archiver: 0 }, // Ne récupérer que les matières non archivées
            });
        } else if (isAdmin) {
            // Récupérer les matières pour Admin (filtrer par ecoleeId)
            matieres = await Matiere.findAll({
                include: [{
                    model: EcoleMatiere,
                    where: { ecoleeId }, // Filtrer par ecoleeId
                }],
                where: { archiver: 0 }, // Ne récupérer que les matières non archivées
            });
        } else {
            // Si l'utilisateur n'a pas de rôle valide, retourner une erreur
            return res.status(403).json({ error: 'Accès non autorisé' });
        }

        res.json(matieres);
    } catch (error) {
        console.error("Erreur lors de la récupération des matières :", error);
        res.status(500).json({ error: 'Erreur lors de la récupération des matières' });
    }
};

export const getMatieresArchiver = async (req, res) => {
    try {
        // Récupérer les informations de l'utilisateur connecté
        const ecoleId = req.user.ecoleId; // ecoleId de l'AdminPrincipal
        const roles = req.user.roles; // Rôles de l'utilisateur
        const userId = req.user.id; // ID de l'utilisateur connecté
        const ecoleeId = req.user.ecoleeId; // ecoleeId de l'Admin

        // Afficher les informations de l'utilisateur pour le débogage
        console.log('🟢 ecoleId:', ecoleId);
        console.log('🟢 roles:', roles);
        console.log('🟢 userId:', userId);
        console.log('🟢 ecoleeId:', ecoleeId);

        // Vérifier les rôles de l'utilisateur
        const isAdminPrincipal = roles.includes('AdminPrincipal');
        const isAdmin = roles.includes('Admin');

        console.log('🟢 isAdminPrincipal:', isAdminPrincipal);
        console.log('🟢 isAdmin:', isAdmin);

        let matieres;

        if (isAdminPrincipal) {
            // Récupérer les matières pour AdminPrincipal (filtrer par ecoleId)
            matieres = await Matiere.findAll({
                include: [{
                    model: EcoleMatiere,
                    where: { ecoleId }, // Filtrer par ecoleId
                }],
                where: { archiver: 1 }, // Ne récupérer que les matières non archivées
            });
        } else if (isAdmin) {
            // Récupérer les matières pour Admin (filtrer par ecoleeId)
            matieres = await Matiere.findAll({
                include: [{
                    model: EcoleMatiere,
                    where: { ecoleeId }, // Filtrer par ecoleeId
                }],
                where: { archiver: 0 }, // Ne récupérer que les matières non archivées
            });
        } else {
            // Si l'utilisateur n'a pas de rôle valide, retourner une erreur
            return res.status(403).json({ error: 'Accès non autorisé' });
        }

        res.json(matieres);
    } catch (error) {
        console.error("Erreur lors de la récupération des matières :", error);
        res.status(500).json({ error: 'Erreur lors de la récupération des matières' });
    }
};

// Ajouter une nouvelle matière
export const createMatiere = async (req, res) => {
    const { nom, nomarabe, ecoleId, ecoleeId } = req.body;
    const image = req.file ? req.file.filename : null;

    console.log("Données reçues dans createMatiere :", { nom, nomarabe, image, ecoleId, ecoleeId });

    if (!nom || !nomarabe || !ecoleId) {
        return res.status(400).json({ error: 'Le nom, le nom arabe et ecoleId sont requis.' });
    }

    try {
        // Recherche ou création de la matière
        const [matiere, created] = await Matiere.findOrCreate({
            where: { nom, nomarabe },
            defaults: { image: image ?? null, archiver: 0 }
        });

        if (!created) {
            console.log("ℹ️ La matière existait déjà :", matiere.nom);
        } else {
            console.log("✅ Matière créée :", matiere.nom);
        }
        const cleanedEcoleeId = ecoleeId === "null" || ecoleeId === undefined ? null : ecoleeId;

        // Vérifier si la relation existe déjà
        const relationExist = await EcoleMatiere.findOne({
            where: {
                matiereId: matiere.id,
                ecoleId,
                ecoleeId: cleanedEcoleeId
            }
        });

        if (!relationExist) {
            await EcoleMatiere.create({
                matiereId: matiere.id,
                ecoleId,
                ecoleeId: cleanedEcoleeId
            });

            console.log("✅ Relation EcoleMatiere créée !");
        } else {
            console.log("ℹ️ La relation EcoleMatiere existait déjà.");
        }

        res.status(201).json({
            message: created
                ? 'Matière ajoutée avec succès'
                : 'Matière déjà existante, mais relation ajoutée avec succès (ou déjà présente)',
            matiere
        });
    } catch (err) {
        console.error("❌ Erreur lors de l'ajout de la matière :", err);
        res.status(500).json({ error: 'Erreur lors de l\'ajout de la matière' });
    }
};

// Modifier une matière
export const updateMatiere = async (req, res) => {
    const { id } = req.params;
    const { nom, nomarabe, ecoleId, ecoleeId } = req.body;
    const image = req.file ? req.file.filename : null;

    // Afficher les données reçues
    console.log("Données reçues dans updateMatiere :", { id, nom, nomarabe, image, ecoleId, ecoleeId });

    if (!nom || !nomarabe || !image || !ecoleId) {
        return res.status(400).json({ error: 'Le nom, le nom arabe, l\'image, ecoleId sont requis.' });
    }

    try {
        const matiere = await Matiere.findOne({ where: { id } });
        if (!matiere) return res.status(404).json({ error: 'Matière non trouvée' });

        await matiere.update({ nom, nomarabe, image });

        // Afficher la matière mise à jour
        console.log("✅ Matière mise à jour :", matiere);

        // Convertir ecoleeId en null si c'est la chaîne "null"
        const ecoleeIdFinal = ecoleeId === "null" ? null : ecoleeId;

        const ecoleMatiereData = {
            ecoleId,
            ecoleeId: ecoleeIdFinal, // Utiliser ecoleeIdFinal ici
            matiereId: id
        };

        const ecoleMatiere = await EcoleMatiere.findOne({ where: { matiereId: id } });

        if (ecoleMatiere) {
            await ecoleMatiere.update(ecoleMatiereData);
        } else {
            await EcoleMatiere.create(ecoleMatiereData);
        }

        // Afficher la relation EcoleMatiere mise à jour
        console.log("✅ Relation EcoleMatiere mise à jour avec succès !");

        res.status(200).json({ message: 'Matière modifiée avec succès', matiere });
    } catch (err) {
        console.error("Erreur lors de la modification de la matière :", err);
        res.status(500).json({ error: 'Erreur lors de la modification de la matière' });
    }
};
// Supprimer une matière (archiver)
export const deleteMatiere = async (req, res) => {
    const { id } = req.params;

    try {
        const [updated] = await Matiere.update({ archiver: 1 }, { where: { id } });
        if (!updated) return res.status(404).json({ error: 'Matière non trouvée' });

        res.status(200).json({ message: `Matière avec l'ID ${id} archivée avec succès` });
    } catch (err) {
        console.error("Erreur lors de l'archivage de la matière :", err);
        res.status(500).json({ error: 'Erreur lors de l\'archivage de la matière' });
    }
};

// Rechercher des matières
export const searchMatieres = async (req, res) => {
    const { term } = req.query;

    if (!term) {
        return res.status(400).json({ error: 'Le terme de recherche est requis.' });
    }

    try {
        const matieres = await Matiere.findAll({
            where: {
                [Op.or]: [
                    { nom: { [Op.like]: `%${term}%` } },
                    { nomarabe: { [Op.like]: `%${term}%` } }
                ]
            }
        });

        res.status(200).json(matieres);
    } catch (error) {
        console.error('Erreur lors de la recherche des matières:', error);
        res.status(500).json({ error: 'Erreur serveur lors de la recherche des matières' });
    }
};