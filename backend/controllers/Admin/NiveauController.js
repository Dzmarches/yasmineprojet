import Niveaux from '../../models/Admin/Niveaux.js';
import Matiere from '../../models/Admin/Matiere.js';
import EcoleNiveau from '../../models/Admin/EcoleNiveau.js';
import Sequelize from 'sequelize';
import jwt from 'jsonwebtoken';
import NiveauxMatieres from '../../models/Admin/NiveauxMatieres.js';

export const getNiveaux = async (req, res) => {
    try {
        // Récupérer les informations de l'utilisateur connecté
        const ecoleId = req.user.ecoleId; // ecoleId de l'AdminPrincipal
        const ecoleeId = req.user.ecoleeId; // ecoleeId de l'Admin
        const roles = req.user.roles; // Rôles de l'utilisateur

        // Afficher les informations de l'utilisateur pour le débogage
        console.log('🟢 ecoleId:', ecoleId);
        console.log('🟢 ecoleeId:', ecoleeId);
        console.log('🟢 roles:', roles);

        // Vérifier les rôles de l'utilisateur
        const isAdminPrincipal = roles.includes('AdminPrincipal');
        const isAdmin = roles.includes('Admin');

        console.log('🟢 isAdminPrincipal:', isAdminPrincipal);
        console.log('🟢 isAdmin:', isAdmin);

        let niveaux;

        if (isAdminPrincipal) {
            // Récupérer les niveaux pour AdminPrincipal (filtrer par ecoleId)
            niveaux = await Niveaux.findAll({
                include: [{
                    model: EcoleNiveau,
                    where: { ecoleId }, // Filtrer par ecoleId
                }],
                where: { archiver: 0 }, // Ne récupérer que les niveaux non archivés
            });
        } else if (isAdmin) {
            // Récupérer les niveaux pour Admin (filtrer par ecoleeId)
            niveaux = await Niveaux.findAll({
                include: [{
                    model: EcoleNiveau,
                    where: { ecoleeId }, // Filtrer par ecoleeId
                }],
                where: { archiver: 0 }, // Ne récupérer que les niveaux non archivés
            });
        } else {
            // Si l'utilisateur n'a pas de rôle valide, retourner une erreur
            return res.status(403).json({ error: 'Accès non autorisé' });
        }

        res.json(niveaux);
    } catch (err) {
        console.error('❌ Erreur lors de la récupération des niveaux :', err);
        res.status(500).json({ error: 'Erreur lors de la récupération des niveaux' });
    }
};

// Ajouter un niveau
export const createNiveau = async (req, res) => {
    const { nomniveau, nomniveuarab, cycle, statutInscription, niveauMatiere, ecoleId, ecoleeId, matieresConfessions  } = req.body;

    console.log("Données reçues dans le backend :", req.body); // Afficher les données reçues

    // Convertir 'null' en null pour ecoleeId
    const ecoleeIdFinal = ecoleeId === 'null' ? null : ecoleeId;

    // Validation des champs obligatoires (sauf ecoleeId qui peut être null)
    if (!nomniveau || !nomniveuarab || !cycle || !ecoleId) {
        console.error("Erreur : Le nom, le nom arabe, le cycle et ecoleId sont requis.");
        return res.status(400).json({ error: 'Le nom, le nom arabe, le cycle et ecoleId sont requis.' });
    }

    try {
        // Création du niveau
        const niveau = await Niveaux.create({
            nomniveau,
            nomniveuarab,
            cycle,
            statutInscription,
            matieresConfessions,
            archiver: 0
        });

        console.log("Niveau créé :", niveau); // Afficher le niveau créé

        // Enregistrement de la relation dans `EcoleNiveau`
        const ecoleNiveau = await EcoleNiveau.create({
            ecoleId,
            ecoleeId: ecoleeIdFinal, // Utiliser ecoleeIdFinal
            niveauId: niveau.id,
        });

        console.log("Relation EcoleNiveau créée :", ecoleNiveau); // Afficher la relation créée

        // Vérification des matières
        if (niveauMatiere && niveauMatiere.length > 0) {
            const matieresExistantes = await Matiere.findAll({ where: { id: niveauMatiere } });

            if (matieresExistantes.length !== niveauMatiere.length) {
                return res.status(400).json({ error: "Certaines matières n'existent pas." });
            }

            // Création des associations avec confessions
            const associations = niveauMatiere.map(matiereId => ({
                matiereId,
                niveauId: niveau.id,
                matieresConfessions: matieresConfessions[matiereId] || null
            }));

            await NiveauxMatieres.bulkCreate(associations);
        }

        res.status(201).json({ message: 'Niveau ajouté avec succès', niveau });
    } catch (err) {
        console.error("Erreur lors de l'ajout du niveau :", err);
        res.status(500).json({ error: "Erreur lors de l'ajout du niveau", details: err.message });
    }
};
// controllers/niveaux.js

export const getNiveauById = async (req, res) => {
    try {
        const { id } = req.params;

        const niveau = await Niveaux.findByPk(id, {
            include: [
                {
                    model: Matiere,
                    through: { attributes: ['preference'] }, // Inclut la préférence (confession)
                },
                {
                    model: EcoleNiveau,
                },
            ],
        });

        if (!niveau) {
            return res.status(404).json({ error: 'Niveau non trouvé' });
        }

        // Formater la réponse pour inclure les confessions
        const response = {
            ...niveau.toJSON(),
            matieresConfessions: {},
        };

        // Remplir matieresConfessions avec les données de la table de liaison
        niveau.Matieres.forEach((matiere) => {
            response.matieresConfessions[matiere.id] = matiere.NiveauxMatieres.preference || '';
        });

        res.json(response);
    } catch (err) {
        console.error('❌ Erreur lors de la récupération du niveau :', err);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};
// Modifier un niveau
export const updateNiveau = async (req, res) => {
    const { id } = req.params;
    const { nomniveau, nomniveuarab, cycle, statutInscription, niveauMatiere, ecoleId, ecoleeId, matieresConfessions } = req.body;

    if (!nomniveau || !nomniveuarab || !cycle) {
        return res.status(400).json({ error: 'Le nom, le nom arabe et le cycle sont requis.' });
    }

    try {
        // Vérifier si le niveau existe
        const niveau = await Niveaux.findOne({ where: { id } });
        if (!niveau) return res.status(404).json({ error: 'Niveau non trouvé' });

        // Mise à jour des informations du niveau
        await niveau.update({ nomniveau, nomniveuarab, cycle, statutInscription });

        // Mise à jour de la relation `EcoleNiveau`
        const ecoleNiveau = await EcoleNiveau.findOne({ where: { niveauId: id } });

        if (ecoleNiveau) {
            await ecoleNiveau.update({ ecoleId, ecoleeId });
        } else {
            await EcoleNiveau.create({ ecoleId, ecoleeId, niveauId: id });
        }

        // Mise à jour des matières associées avec confessions
        if (niveauMatiere && niveauMatiere.length > 0) {
            // Supprimer d'abord toutes les associations existantes
            await NiveauxMatieres.destroy({ where: { niveauId: id } });

            // Créer les nouvelles associations avec confessions
            const associations = niveauMatiere.map(matiereId => ({
                matiereId,
                niveauId: id,
                matieresConfessions: matieresConfessions[matiereId] || null
            }));

            await NiveauxMatieres.bulkCreate(associations);
        } else {
            // Si aucune matière n'est sélectionnée, supprimer toutes les associations
            await NiveauxMatieres.destroy({ where: { niveauId: id } });
        }

        res.status(200).json({ message: 'Niveau modifié avec succès', niveau });
    } catch (err) {
        console.error("Erreur lors de la modification du niveau :", err);
        res.status(500).json({ error: 'Erreur lors de la modification du niveau', details: err.message });
    }
};

// Supprimer un niveau (archiver)
export const deleteNiveau = async (req, res) => {
    const { id } = req.params;

    try {
        const [updated] = await Niveaux.update({ archiver: 1 }, { where: { id } });
        if (!updated) return res.status(404).json({ error: 'Niveau non trouvé' });

        res.status(200).json({ message: `Niveau avec l'ID ${id} archivé avec succès` });
    } catch (err) {
        console.error("Erreur lors de l'archivage du niveau :", err);
        res.status(500).json({ error: 'Erreur lors de l\'archivage du niveau' });
    }
};