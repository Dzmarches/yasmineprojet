import express from 'express';
import { getEnfantsByParent, getEnfantDetails,
    getAnneesScolairesByEleve,getTrimestresByAnnee, getNotesByTrimestre
 } from '../../controllers/Admin/ParentEleveController.js';
import Matiere from '../../models/Admin/Matiere.js';
import Niveaux from '../../models/Admin/Niveaux.js';
import Anneescolaire from '../../models/Admin/Anneescolaires.js';
import Trimest from '../../models/Admin/Trimest.js';
import User from '../../models/User.js';
import Eleve from '../../models/Admin/Eleve.js';
import Devoire from '../../models/Admin/Devoire.js';
import Section from '../../models/Admin/Section.js';
import Presence from '../../models/Admin/Presence.js';
import EleveParent from '../../models/Admin/EleveParent.js';
import Parent from '../../models/Admin/Parent.js';
import multer from 'multer';
import path from 'path';
import jwt from 'jsonwebtoken';
import { Op } from 'sequelize';



const router = express.Router();


// router.get('/mes-enfants',getEnfantsByParent);

// Route protégée pour récupérer les enfants d'un parent
router.get('/mes-enfants', getEnfantsByParent);

// Route protégée pour récupérer les détails d'un enfant spécifique
router.get('/enfant/:eleveId', getEnfantDetails);


// Dans votre fichier de routes parent
router.get('/enfant/:enfantId/devoirs', async (req, res) => {
    try {
        const { enfantId } = req.params;
        console.log("ID enfant reçu:", enfantId); // Log ID

        // Rechercher l'enfant avec ses relations Section et Niveaux
        const enfant = await Eleve.findByPk(enfantId, {
            include: [{
                model: Section,
                include: [Niveaux]
            }]
        });

        // Vérification si l'enfant existe
        if (!enfant) {
            console.log("Enfant non trouvé");
            return res.status(404).json({ message: "Enfant non trouvé" });
        }

        // Vérification des relations imbriquées
        const section = enfant.Section;
        const niveau = section?.Niveaux;

        if (!section || !niveau) {
            console.log("Section ou niveau manquant");
            return res.status(400).json({ message: "Données de section ou niveau manquantes" });
        }

        // Logs pour débogage
        console.log("Section ID:", section.id);
        console.log("Niveau ID:", niveau.id);

        // Recherche des devoirs associés à cette section et ce niveau
        const devoirs = await Devoire.findAll({
            where: {
                niveauId: niveau.id,
                sectionId: section.id
            },
            include: [
                { model: Matiere },
                { model: User, as: 'Enseignant' }
            ],
            order: [['dateLimite', 'DESC']]
        });

        console.log("Devoirs trouvés:", devoirs.length);
        res.json(devoirs);

    } catch (error) {
        console.error("Erreur complète:", error);
        res.status(500).json({
            message: "Erreur serveur",
            error: error.message,
            stack: error.stack
        });
    }
});

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/justifications/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'justification-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// Récupérer les absences/retards d'un enfant
// routes/Admin/ParentEleveRoutes.js

// Récupérer les absences/retards d'un enfant
router.get('/enfant/:enfantId/presences', async (req, res) => {
    try {
        const { enfantId } = req.params;
        const token = req.headers.authorization?.split(' ')[1];

        if (!token) {
            return res.status(401).json({ message: "Token manquant" });
        }

        // Décoder le token pour obtenir l'ID du parent
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const parentId = decoded.userId; // Assurez-vous que c'est bien 'userId' dans votre token

        // Vérifier que l'enfant appartient bien au parent via la table de jointure
        const relation = await EleveParent.findOne({
            where: {
                EleveId: enfantId,
                ParentId: parentId
            }
        });

        if (!relation) {
            return res.status(403).json({ message: "Accès non autorisé à cet enfant" });
        }

        // Récupérer les présences
        const presences = await Presence.findAll({
            where: {
                eleveId: enfantId,
                [Op.or]: [
                    { matin: { [Op.in]: ['absent', 'retard'] } },
                    { apres_midi: { [Op.in]: ['absent', 'retard'] } }
                ]
            },
            order: [['date', 'DESC']],
        });

        res.json(presences);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Erreur serveur",
            error: error.message
        });
    }
});

// Ajouter une justification pour une absence/retard
router.post('/presences/:id/justifier', upload.single('fichier'), async (req, res) => {
    try {
        const { id } = req.params;
        const { justificationText, periode } = req.body;
        const token = req.headers.authorization?.split(' ')[1];

        if (!token) {
            return res.status(401).json({ message: "Token manquant" });
        }

        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const parentId = decoded.id;

        // Trouver la présence avec vérification du parent via la table de jointure
        const presence = await Presence.findOne({
            where: { id },
            include: [{
                model: Eleve,
                include: [{
                    model: EleveParent,
                    where: { ParentId: parentId }
                }]
            }]
        });

        if (!presence) {
            return res.status(404).json({ message: "Présence non trouvée ou non autorisée" });
        }

        // Mettre à jour la justification
        const updateData = {};
        // router.post('/presences/:id/justifier', ...)
        if (periode === 'matin') {
            updateData.justificationTextMatin = justificationText;
            if (req.file) {
                updateData.fichierJustification = req.file.path;
            }
        } else if (periode === 'apres_midi') {
            updateData.justificationTextApresMidi = justificationText;
            if (req.file) {
                updateData.fichierJustification = req.file.path;
            }
        }

        if (req.file) {
            updateData.fichierJustification = req.file.path;
        }

        await presence.update(updateData);

        res.json({ message: "Justification enregistrée avec succès" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur serveur" });
    }
});

// Dans le routeur parent
router.post('/presences/:enfantId/absences', async (req, res) => {
    try {
        const { enfantId } = req.params;
        const { date, periode, raison } = req.body;
        const token = req.headers.authorization?.split(' ')[1];
        
        // Vérification du parent
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const parent = await Parent.findByPk(decoded.userId);

        // Création de l'absence prévue
        const newAbsence = await Presence.create({
            eleveId: enfantId,
            date,
            [periode === 'journee' ? 'matin' : periode]: 'absent',
            ...(periode === 'journee' && { apres_midi: 'absent' }),
            [`justificationText${periode === 'matin' ? 'Matin' : 'ApresMidi'}`]: raison,
            statut: 'prevue'
        });

        res.status(201).json(newAbsence);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur serveur" });
    }
});


router.get('/enfant/:eleveId/annees-scolaires', getAnneesScolairesByEleve);

// Récupérer les trimestres pour une année scolaire
router.get('/enfant/:eleveId/annee/:anneeId/trimestres', getTrimestresByAnnee);

// Récupérer les notes détaillées pour un trimestre
router.get('/enfant/:eleveId/trimestre/:trimestreId/notes', getNotesByTrimestre);
export default router;
