
import express from 'express';
import {ajouterDE ,ListeDE,InfoDE,ModifierDE,AttestationInfo,uploadImagemodele,Archiver} from '../controllers/attestationControl.js';
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
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, path.join(__dirname, '../public/attestations/modeles/images'));
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9); // Nom unique
      const extension = path.extname(file.originalname); // Extension du fichier
      cb(null, uniqueSuffix + extension); // Nom du fichier
    }
  });
const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/jpg'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true); // Accepter le fichier
    } else {
      cb(new Error('Seules les images (JPEG, PNG, GIF) sont autorisées.'), false); // Rejeter le fichier
    }
  };
  
  const upload = multer({ 
    storage: storage,
    fileFilter: fileFilter,
    limits: {
      fileSize: 5 * 1024 * 1024, // Limite de taille à 5 Mo
    }
  });

router.post("/ajouter", ajouterDE);
router.get("/liste", ListeDE);
router.get("/info/:id",InfoDE);
router.put("/modifier/:id",ModifierDE);
router.patch('/archiver/:id', Archiver);

// router.post("/uploadImagemodele", upload.single('image'), uploadImagemodele);
router.post("/uploadImagemodele", upload.single("image"), (req, res) => {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "Aucun fichier envoyé" });
    }
    const imageUrl = `http://localhost:5000/attestations/modeles/images/${req.file.filename}`;
    console.log('Image URL:', imageUrl);
  
    res.json({
      success: true,
      files: [imageUrl], 
    });
  });
router.post('/deleteImages', (req, res) => {
    const { imageUrls } = req.body;
    if (!imageUrls || !Array.isArray(imageUrls)) {
      return res.status(400).json({ success: false, message: 'URLs des images manquantes' });
    }
    const errors = [];
    imageUrls.forEach(imageUrl => {
      try {
        // Extraire le nom du fichier à partir de l'URL publique
        const filename = path.basename(imageUrl);
  
        // Chemin physique du fichier
        const filePath = path.join(__dirname, '../public/attestations/modeles/images', filename);
  
        // Vérifier si le fichier existe et le supprimer
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
          console.log(`Fichier supprimé : ${filePath}`);
        } else {
          console.warn(`Fichier non trouvé : ${filePath}`);
        }
      } catch (error) {
        errors.push(`Erreur lors de la suppression de ${imageUrl}: ${error.message}`);
      }
    });
  
    if (errors.length > 0) {
      return res.status(500).json({ success: false, message: 'Erreurs lors de la suppression', errors });
    }
  
    res.json({ success: true, message: 'Images supprimées avec succès' });
 });


  router.get("/monattestation/:id",AttestationInfo);

export default router;
