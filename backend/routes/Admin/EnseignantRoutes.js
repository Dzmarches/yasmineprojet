import express from 'express'
import { ListeEmploye ,ProfileEmploye,ArchiverE,ModifierEmploye,employeMe,
    getDisponibilites,getEmploiDuTempsEnseignant} 
from '../../controllers/Admin/EnseignantController.js';
import multer from 'multer';
import path from 'path';
import moment from 'moment';
import { fileURLToPath } from 'url';

import Niveaux from '../../models/Admin/Niveaux.js';
import Section from '../../models/Admin/Section.js';
import EnseignantClasse from '../../models/Admin/EnseignantClasse.js';
import Eleve from '../../models/Admin/Eleve.js';
import User from '../../models/User.js';


// Convertir l'URL du module en chemin de fichier
const __filename = fileURLToPath(import.meta.url);
// Obtenir le répertoire du fichier
const __dirname = path.dirname(__filename)
const router =express.Router();
//stocker photo de  dans public/images

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../../public/images/employes'));
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
// EnseignantRoutes.js
router.get("/liste", ListeEmploye);
router.get("/disponibilites", getDisponibilites); // Déplacer cette ligne AVANT "/:id"
router.get("/me", employeMe);
router.get("/:id", ProfileEmploye); // Route paramétrée vient APRÈS les routes spécifiques
router.patch("/archiver/:id", ArchiverE);
router.put("/modifier/:id", upload.single('photo'), ModifierEmploye);
// routes/Admin/EnseignantRoutes.js
router.get("/emploi-du-temps/:enseignantId", getEmploiDuTempsEnseignant);

router.get('/:enseignantId/niveaux', async (req, res) => {
    try {
        const niveaux = await Niveaux.findAll({
            include: [{
                model: EnseignantClasse,
                where: { enseignantId: req.params.enseignantId },
                attributes: []
            }],
            distinct: true
        });
        
        res.json(niveaux);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur serveur" });
    }
});

// 2. Récupérer les sections d'un enseignant pour un niveau donné
router.get('/:enseignantId/niveaux/:niveauId/sections', async (req, res) => {
    try {
        const sections = await Section.findAll({
            include: [{
                model: EnseignantClasse,
                where: { 
                    enseignantId: req.params.enseignantId,
                    niveauId: req.params.niveauId
                },
                attributes: []
            }],
            distinct: true
        });
        
        res.json(sections);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur serveur" });
    }
});

// 3. Récupérer les élèves d'une section
// Route pour récupérer les élèves d'une section
router.get('/sections/:sectionId/eleves', async (req, res) => {
    try {
      const eleves = await Eleve.findAll({
        where: { 
          classeId: req.params.sectionId, // Filtre direct sur classeId
          archiver: 0 
        },
        include: [
          {
            model: User,
            attributes: ['id', 'nom', 'prenom'],
          },
          {
            model: Section,
            attributes: ['id', 'classe']
          },
          {
            model: Niveaux,
            attributes: ['id', 'nomniveau']
          }
        ],
        order: [['createdAt', 'DESC']]
      });
  
      res.status(200).json(eleves);
    } catch (error) {
      console.error('Erreur lors de la récupération des élèves :', error);
      res.status(500).json({ message: "Erreur serveur" });
    }
  });


// 4. Récupérer les matières d'un niveau
router.get('/niveaux/:niveauId/matieres', async (req, res) => {
    try {
        const matieres = await Matiere.findAll({
            include: [{
                model: EnseignantClasse,
                where: { 
                    niveauId: req.params.niveauId,
                    enseignantId: req.user.id // ou req.params.enseignantId selon votre auth
                },
                attributes: []
            }],
            distinct: true
        });
        
        res.json(matieres);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur serveur" });
    }
});


export default router