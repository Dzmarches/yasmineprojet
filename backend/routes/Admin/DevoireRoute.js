import express from 'express';
import { 
    createDevoir, 
    getDevoirsBySection, 
    downloadDevoirFile,
    submitTravail , getTravauxByDevoir, downloadTravail
} from '../../controllers/Admin/DevoireController.js';
import multer from 'multer';

const router = express.Router();

// Configuration de multer pour le stockage des fichiers
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import TravailRendu from '../../models/Admin/TravailRendu.js';
import Devoire from '../../models/Admin/Devoire.js';
import Matiere from '../../models/Admin/Matiere.js';
import Eleve from '../../models/Admin/Eleve.js';
import User from '../../models/User.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configuration de multer pour le stockage des fichiers
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Chemin vers le dossier public/images/Devoire
        const uploadPath = path.join(__dirname, '../../public/images/Devoire');
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, 'devoir-' + uniqueSuffix + ext);
    }
});

const upload = multer({ 
    storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'application/pdf') {
            cb(null, true);
        } else {
            cb(new Error('Seuls les fichiers PDF sont autorisés'), false);
        }
    }
});

// Routes protégées par authentification
router.post('/', upload.single('fichier'), createDevoir);
router.get('/section/:sectionId', getDevoirsBySection);
router.get('/download/:filename', downloadDevoirFile);
router.post('/soumettre', upload.single('fichier'), submitTravail);
router.get('/:devoirId/travaux',getTravauxByDevoir);
router.get('/travaux/download/:filename', downloadTravail);

router.get('/section/:sectionId/travaux', async (req, res) => {
    try {
        const { sectionId } = req.params;
        const { annescolaireId, trimestId } = req.query;
        
        const travaux = await TravailRendu.findAll({
            include: [
                {
                    model: Devoire,
                    where: { 
                        sectionId,
                        annescolaireId,
                        trimestId
                    },
                    include: [Matiere]
                },
                {
                    model: Eleve,
                    include: [User]
                }
            ]
        });
        
        res.status(200).json(travaux);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
});

export default router;