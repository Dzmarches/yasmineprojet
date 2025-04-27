import express from 'express'
import {AjouterD,ModifierD,ListeD,ArchiverD} from '../../controllers/comptabilite/DepenseControl.js'
import { fileURLToPath } from 'url';
import path from 'path';
import multer from 'multer';
import fs from 'fs';


// Convertir l'URL du module en chemin de fichier
const __filename = fileURLToPath(import.meta.url);
// Obtenir le répertoire du fichier
const __dirname = path.dirname(__filename);
// Configuration de multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const code = req.body.code; 
        console.log('code de la req est ',req.body.code)
        if (!code) {
            return cb(new Error('code est requis'));
        }
        const dir = path.join(__dirname, `../../public/depenses/${code}`);
        // Crée le dossier s'il n'existe pas
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        cb(null, dir);
    },
    filename: function (req, file, cb) {
        const { code } = req.body;
        if (!code) {
            return cb(new Error('code est requis'));
        }
        const now = new Date();
        const dateStr = now.toISOString().replace(/:/g, '-').split('.')[0]; 
        const extension = path.extname(file.originalname).replace(/\s/g, '');
        const sanitizedType = code.replace(/\s/g, '_');
        const filename = `Code_${sanitizedType}_${dateStr}${extension}`;
        cb(null, filename);
    }
});
const upload = multer({ storage: storage });
const router = express.Router();

router.post('/ajouter',upload.single('fichier'),AjouterD);
router.get('/liste',ListeD);
router.put('/modifier/:id',upload.single('fichier'),ModifierD);
router.patch('/archiver/:id', ArchiverD);


export default router;