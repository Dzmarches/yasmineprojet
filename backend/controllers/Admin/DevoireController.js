import Devoire from '../../models/Admin/Devoire.js';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import Matiere from '../../models/Admin/Matiere.js';
import Niveaux from '../../models/Admin/Niveaux.js';
import Anneescolaire from '../../models/Admin/Anneescolaires.js';
import Trimest from '../../models/Admin/Trimest.js';
import User from '../../models/User.js';
import TravailRendu from '../../models/Admin/TravailRendu.js';
import Eleve from '../../models/Admin/Eleve.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Dans le contrôleur createDevoir
export const createDevoir = async (req, res) => {
    try {
        const { titre, description, dateLimite, enseignantId, matiereId, niveauId, sectionId, anneeScolaireId, trimestreId } = req.body;
        
        if (!req.file) {
            return res.status(400).json({ message: "Aucun fichier n'a été téléchargé" });
        }

        // Vérifiez que le répertoire existe, sinon créez-le
        const uploadDir = path.join(__dirname, '../../public/images/Devoire');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }

        // Déplacez le fichier vers le répertoire permanent
        const tempPath = req.file.path;
        const targetPath = path.join(uploadDir, req.file.filename);
        
        fs.renameSync(tempPath, targetPath);

        // Stockez seulement le nom du fichier dans la base de données
        const devoir = await Devoire.create({
            titre,
            description,
            dateLimite,
            fichier: req.file.filename, // Stockez seulement le nom du fichier
            enseignantId,
            matiereId,
            niveauId,
            sectionId,
            annescolaireId: anneeScolaireId,
            trimestId: trimestreId
        });

        res.status(201).json(devoir);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur lors de la création du devoir" });
    }
};

// Dans le contrôleur downloadDevoirFile
export const downloadDevoirFile = async (req, res) => {
    try {
        const { filename } = req.params;
        const filePath = path.join(__dirname, '../../public/images/Devoire', filename);
        
        if (fs.existsSync(filePath)) {
            // Déterminez le type de contenu
            const ext = path.extname(filename).toLowerCase();
            let contentType = 'application/octet-stream';
            
            if (ext === '.pdf') {
                contentType = 'application/pdf';
            } else if (ext === '.doc' || ext === '.docx') {
                contentType = 'application/msword';
            } else if (ext === '.jpg' || ext === '.jpeg') {
                contentType = 'image/jpeg';
            } else if (ext === '.png') {
                contentType = 'image/png';
            }

            // Configurer les headers
            res.setHeader('Content-Type', contentType);
            res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
            
            // Envoyer le fichier
            const fileStream = fs.createReadStream(filePath);
            fileStream.pipe(res);
        } else {
            res.status(404).json({ message: "Fichier non trouvé" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur lors du téléchargement du fichier" });
    }
};

// Récupérer tous les devoirs d'une section
export const getDevoirsBySection = async (req, res) => {
    try {
        const { sectionId } = req.params;
        const devoirs = await Devoire.findAll({
            where: { sectionId },
            include: [
                { model: Matiere }, // Utilisez directement le modèle
                { model: Niveaux },
                { model: Anneescolaire },
                { model: Trimest },
                { model: User, as: 'Enseignant' } // Pour l'enseignant
            ]
        });
        res.json(devoirs);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur lors de la récupération des devoirs" });
    }
};


// Soumettre un travail pour un devoir
export const submitTravail = async (req, res) => {
    try {
        const { devoirId, eleveId } = req.body;
        
        if (!req.file) {
            return res.status(400).json({ message: "Aucun fichier n'a été téléchargé" });
        }

        // Ici vous devriez créer ou mettre à jour une entrée dans votre table de travaux rendus
        // Cette partie dépend de votre modèle pour les travaux rendus
        
        res.status(201).json({ 
            message: "Travail soumis avec succès",
            filename: req.file.filename
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur lors de la soumission du travail" });
    }
};


// controllers/devoirController.js

export const getTravauxByDevoir = async (req, res) => {
    try {
        const travaux = await TravailRendu.findAll({
            where: { devoirId: req.params.devoirId },
            include: [
                {
                    model: Eleve,
                    include: [User],
                    attributes: ['id', 'numidentnational'],
                    required: true
                },
                {
                    model: Devoir,
                    attributes: ['id', 'titre'],
                    include: [
                        {
                            model: Matiere,
                            attributes: ['id', 'nom']
                        }
                    ]
                }
            ]
        });
        res.status(200).json(travaux);
    } catch (error) {
        console.error('Erreur dans getTravauxByDevoir:', error);
        res.status(500).json({ 
            message: 'Erreur serveur',
            error: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
};

// Télécharger un fichier de travail rendu
export const downloadTravail = async (req, res) => {
    try {
        const filename = req.params.filename;
        // Correction du chemin (attention à l'orthographe: "travaux" et non "traveaux")
        const filePath = path.join(__dirname, '../../public/images/travaux', filename);
        
        if (fs.existsSync(filePath)) {
            res.download(filePath, filename, (err) => {
                if (err) {
                    console.error('Erreur lors du téléchargement:', err);
                    res.status(500).json({ message: "Erreur lors du téléchargement" });
                }
            });
        } else {
            console.error('Fichier non trouvé:', filePath);
            res.status(404).json({ message: "Fichier introuvable" });
        }
    } catch (error) {
        console.error('Erreur dans downloadTravail:', error);
        res.status(500).json({ 
            message: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
};