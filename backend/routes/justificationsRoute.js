import express from 'express'
import { ajouterDA,listeDA,detailDA,listeTousDA,changerstatut,supprimerMademande}
 from '../controllers/justificationsControl.js';
 import { fileURLToPath } from 'url';
 import fs from 'fs';
 import path from 'path';
 import multer from 'multer';

 
 const __filename = fileURLToPath(import.meta.url);
 // Obtenir le répertoire du fichier
 const __dirname = path.dirname(__filename)
 const storage = multer.diskStorage({
     destination: (req, file, cb) => {
       cb(null, path.join(__dirname, '../public/justifications/modeles/images'));
     },
     filename: (req, file, cb) => {
       const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9); // Nom unique
       const extension = path.extname(file.originalname); // Extension du fichier
       cb(null, uniqueSuffix + extension); // Nom du fichier
     }
   });

const upload = multer({ storage: storage,});
const router=express.Router();
router.post('/ajouterDA',upload.single('fichier'),ajouterDA);
router.get('/listeDA/:id',listeDA);
router.get('/detailDA/:id',detailDA);
router.get('/ListeTousDA',listeTousDA);
router.patch('/changerstatut/:id',changerstatut);
router.delete('/supprimerMademande/:id', supprimerMademande);


export default router;