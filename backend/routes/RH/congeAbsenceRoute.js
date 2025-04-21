import express from 'express';
import {
    ajouterCA, mesCA, detailDemande, CAEmployes, demandeEmploye,
    ModifierStautdemande, CongesDroit,
    CongesAnnuel, AjouterCongesAnnuels, verifierDateCongeAnnuel, Archiver, supprimerMademande, ListeCAnnuel, ModifierCAnnuel, ArchiverCAnnuel
} from '../../controllers/RH/congeAbsenceControl.js';
import { fileURLToPath } from 'url';
import path from 'path';
import multer from 'multer';
import fs from 'fs';
import Employe from '../../models/RH/employe.js';

// Convertir l'URL du module en chemin de fichier
const __filename = fileURLToPath(import.meta.url);
// Obtenir le répertoire du fichier
const __dirname = path.dirname(__filename);

// Middleware pour récupérer l'ID de l'employé
const getEmployeId = async (req, res, next) => {
    try {
        const userconnect = req.user.id; // Récupère l'ID de l'utilisateur connecté
        const findEmploye = await Employe.findOne({ where: { userId: userconnect } });

        console.log('findEmploye',findEmploye)
        if (!findEmploye) {
            return res.status(404).json({ message: "Employé non trouvé" });
        }

        req.employe_id = findEmploye.id; // Ajoute l'ID de l'employé à `req`
        next();
    } catch (error) {
        console.error("Erreur lors de la récupération de l'ID de l'employé :", error);
        res.status(500).json({ message: "Erreur serveur" });
    }
};

// Configuration de multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const employe_id = req.employe_id; // Récupère l'ID de l'employé depuis `req`
        console.log('id de la req est ',employe_id)
        if (!employe_id) {
            return cb(new Error('ID employé est requis'));
        }

        const dir = path.join(__dirname, `../../public/conges/employes/${employe_id}`);

        // Crée le dossier s'il n'existe pas
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }

        cb(null, dir);
    },
    filename: function (req, file, cb) {
        const { type_demande } = req.body;
        const employe_id = req.employe_id; // Récupère l'ID de l'employé depuis `req`
        if (!employe_id) {
            return cb(new Error('ID employé est requis'));
        }

        const now = new Date();
        const dateStr = now.toISOString().replace(/:/g, '-').split('.')[0]; // Remplace les ":" par "-" pour éviter les problèmes
        const extension = path.extname(file.originalname).replace(/\s/g, '');
        const sanitizedType = type_demande.replace(/\s/g, '_');
        const filename = `E${employe_id}_${sanitizedType}_${dateStr}${extension}`;

        cb(null, filename);
    }
});

const upload = multer({ storage: storage });

const router = express.Router();

// Routes
router.post('/ajouter', getEmployeId, upload.single('fichier'), ajouterCA);
router.get('/mesCA/', mesCA);
router.get('/demandeDetail/:id', detailDemande);
router.get('/demandesCAemployes/', CAEmployes);
router.get('/demandeEmploye/:id', demandeEmploye);
router.put('/ModifierStautdemande/:id', ModifierStautdemande);
router.get('/CongesDroit/:id', CongesDroit);
router.get('/CongesAnnuel/:id', CongesAnnuel);
router.delete('/supprimerMademande/:id', supprimerMademande);
router.post('/AjouterCAnnuel', AjouterCongesAnnuels);
router.get('/verifierDateCongeAnnuel', verifierDateCongeAnnuel);
router.get('/ListeCAnnuel', ListeCAnnuel);
router.put('/ModifierCAnnuel/:id', ModifierCAnnuel);
router.patch('/ArchiverCAnnuel/:id', ArchiverCAnnuel);
router.patch('/archiver/:id', Archiver);

export default router;