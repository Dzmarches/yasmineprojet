import express from 'express'
import { AjouterEmploye,ListeEmploye ,ProfileEmploye,ArchiverE,ModifierEmploye,employeMe} 
from '../../controllers/RH/employeControl.js';
import multer from 'multer';
import path from 'path';
import moment from 'moment';
import { fileURLToPath } from 'url';
import fs from 'fs';

// Convertir l'URL du module en chemin de fichier
const __filename = fileURLToPath(import.meta.url);
// Obtenir le répertoire du fichier
const __dirname = path.dirname(__filename)
const router =express.Router();
//stocker photo de  dans public/images

const storage = multer.diskStorage({
    // destination: function (req, file, cb) {
    //     cb(null, path.join(__dirname, '../../public/images/employes'));
    // },
    destination: function (req, file, cb) {
        const dir = path.join(__dirname, '../../public/images/employes');
        // Vérifie si le dossier existe, sinon le créer
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, { recursive: true });
        }
        cb(null, dir);
      },
    filename: function (req, file, cb) {
        console.log(req.body)
        // Récupérer le nom et le prénom de l'employé depuis req.body
        const { nom, prenom , datenaiss} = req.body;

        // Vérifier si le nom et le prénom sont présents
        if (!nom || !prenom ||! datenaiss) {
            return cb(new Error('Le nom et le prénom et date recrutement sont requis'));
        }

        // Créer un nom de fichier unique avec le nom et le prénom de l'employé
        const filename = `${nom}_${prenom}_${moment( datenaiss).format('YYYY-MM-DD')}_${path.extname(file.originalname)}`;

        cb(null, filename);
    }
});






const upload = multer({ storage: storage });
router.post("/ajouter",upload.single('photo'),AjouterEmploye)
router.get("/liste",ListeEmploye)
router.get("/employe/:id",ProfileEmploye)
router.patch("/archiver/:id",ArchiverE)
router.put("/modifier/:id",upload.single('photo'),ModifierEmploye)
router.get("/me",employeMe);







export default router