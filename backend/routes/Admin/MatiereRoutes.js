import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { getMatieres, createMatiere, updateMatiere, deleteMatiere, searchMatieres } from '../../controllers/Admin/MatiereController.js';

// Obtenir __dirname dans un module ES
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Définir le stockage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const destinationPath = path.join(__dirname, '../../public/images/matiere'); // Corrected path
        console.log('Destination Path:', destinationPath); // Debugging
        cb(null, destinationPath); // Dossier de destination
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname)); // Nom de fichier unique
    }
});

const upload = multer({ storage: storage });

// Définir les routes pour les matières
router.get('/', getMatieres); // Récupérer toutes les matières
router.post('/', upload.single('image'), createMatiere); // Ajouter une nouvelle matière avec upload d'image
router.put('/:id', upload.single('image'), updateMatiere); // Modifier une matière avec upload d'image
router.delete('/:id', deleteMatiere); // Supprimer une matière
router.get('/search', searchMatieres); // Rechercher des matières

export default router;