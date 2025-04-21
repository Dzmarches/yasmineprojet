import express from 'express';
import { getEcoles, createEcole, updateEcole, deleteEcole, getEcoleById ,getUserByEcoleId} from '../controllers/administrateur/EcoleController.js';
import { verifyToken } from "../middelware/VerifyToken.js";
import  {Login} from '../controllers/User.js';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url'; // Importez fileURLToPath

// Obtenez __dirname en utilisant import.meta.url
const __filename = fileURLToPath(import.meta.url); // Chemin du fichier actuel
const __dirname = path.dirname(__filename); // Répertoire du fichier actuel

const router = express.Router();

// Chemin absolu vers le dossier public/images/Ecole
const uploadDir = path.join(__dirname, '../public/images/Ecole');

// Configuration de multer pour gérer les fichiers
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir); // Dossier de destination
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname); // Nom du fichier
    }
});

const upload = multer({ 
    storage: storage,
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
        if (!allowedTypes.includes(file.mimetype)) {
            return cb(new Error('Seules les images sont autorisées (jpeg, png, gif)'));
        }
        cb(null, true);
    },
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB
    }
});

// Définir les routes pour les écoles
router.get('/', getEcoles); // Récupérer toutes les écoles
router.get('/:id', getEcoleById); // Récupérer une école par ID
router.post('/', upload.single('logo'), createEcole); // Ajouter une école (avec gestion de fichier)
router.put('/:id', upload.single('logo'), updateEcole); // Modifier une école
router.delete('/:id', deleteEcole); // Supprimer une école
router.get('/user/:ecoleId', getUserByEcoleId);
router.get("/me",verifyToken, Login);


export default router;