// routes/EleveRoutes.js
import express from 'express';
import multer from 'multer';
import path from 'path';
import Eleve from '../../models/Admin/Eleve.js';
import User from '../../models/User.js';
import Parent from '../../models/Admin/Parent.js';
import Section from '../../models/Admin/Section.js';
import {
    ListeEleveParent, createEleve, deleteEleve, getEleveById, updateEleve, uploadMiddleware,
    getElevesByNiveau, updateEleveClasse, getElevesBySection, getElevesByEcole, getDevoirsByEleve
    , soumettreTravail, getDevoirsBySection, modifierStatutEleve
} from '../../controllers/Admin/EleveController.js';
import { verifyToken } from '../../middelware/VerifyToken.js';
import checkPermission from '../../middelware/PermissionMiddleware.js';
import bcrypt from 'bcrypt';

const router = express.Router();

router.put('/update-bulk', async (req, res) => {
    console.log('🚀 Route /update-bulk appelée');

    try {
        console.log('🧾 Type reçu dans le backend :', typeof req.body);
        console.log('🧾 Est-ce un tableau ? ', Array.isArray(req.body));
        console.log('🧾 Contenu brut reçu :', JSON.stringify(req.body, null, 2));

        if (!Array.isArray(req.body)) {
            return res.status(400).json({
                success: false,
                message: 'Les données doivent être un tableau'
            });
        }

        const updates = req.body.map(item => ({
            where: { id: item.id },
            data: {
                niveauId: item.niveauId,
                annescolaireId: item.annescolaireId,
                cycle: item.cycle
            }
        }));

        console.log('🔄 Instructions de mise à jour générées :', JSON.stringify(updates, null, 2));

        const results = await Promise.all(
            updates.map(update =>
                Eleve.update(update.data, { where: update.where })
            )
        );

        const updatedCount = results.reduce((sum, result) => sum + result[0], 0);

        console.log('✅ Élèves mis à jour :', updatedCount);

        res.json({
            success: true,
            updatedCount
        });
    } catch (error) {
        console.error('❌ Erreur lors de la mise à jour:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la mise à jour des élèves',
            error: error.message
        });
    }
});

router.get('/', verifyToken, checkPermission('Administration-Gestion élève-Voir'), ListeEleveParent);
router.post('/', verifyToken, uploadMiddleware.single('photo'), createEleve);
router.put('/:id', verifyToken, uploadMiddleware.single('photo'), updateEleve);
router.delete('/:id', verifyToken, deleteEleve);
router.get('/:id', verifyToken, getEleveById);
router.get('/niveau/:niveauId', getElevesByNiveau);
router.put('/:id/classe', verifyToken, updateEleveClasse);
router.get("/section/:sectionId", verifyToken, getElevesBySection);
// routes/eleveRoutes.js
router.get('/ecole/:ecoleeId', getElevesByEcole);
router.get('/eleve/:eleveId', getDevoirsByEleve);
// Configuration de multer pour le stockage des fichiers
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'images/travaux/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});
const upload = multer({ storage });
router.post('/traveaux', upload.single('fichier'), soumettreTravail);
router.get('/eleves/:eleveId', getDevoirsBySection);

router.put('/:id/update-niveau', async (req, res) => {
    try {
        const { niveauId, classeId, annescolaireId } = req.body;
        const updatedEleve = await Eleve.updateNiveau(req.params.id, {
            niveauId,
            classeId,
            annescolaireId
        });
        res.json(updatedEleve);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
});
router.put('/:id/statut', modifierStatutEleve);
// Dans votre backend (exemple Express)
router.put('/users/:userId/statut', async (req, res) => {
    try {
        const user = await User.findByPk(req.params.userId);
        if (!user) return res.status(404).json({ message: "Utilisateur non trouvé" });

        await user.update({
            statuscompte: req.body.statuscompte,
            dateAD: req.body.statuscompte === 'désactiver' ? new Date() : null
        });

        res.json({ message: "Statut mis à jour avec succès" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur serveur" });
    }
});
// Dans votre fichier de routes pour les élèves
// routes/eleves.js



// routes/EleveRoutes.js
// Dans votre route /passwords

// router.get('/:id/passwords', verifyToken, async (req, res) => {
//     try {
//         const id = parseInt(req.params.id, 10);

//         // Récupération des données de l'élève et des parents
//         const eleve = await Eleve.findByPk(id, {
//             include: [
//                 {
//                     model: User,
//                     attributes: ['id', 'nom', 'prenom', 'username', 'password']
//                 },
//                 {
//                     model: Parent,
//                     include: [{
//                         model: User,
//                         attributes: ['id', 'nom', 'prenom', 'username', 'password']
//                     }]
//                 }
//             ]
//         });

//         if (!eleve) {
//             return res.status(404).json({ error: "Élève non trouvé" });
//         }

//         // Fonction pour récupérer ou "décrypter" le mot de passe
//         const retrievePassword = (hashedPassword) => {
//             // Si les mots de passe sont en clair dans la base, il suffit de les retourner
//             // Si bcrypt est utilisé et qu'on veut tenter un déchiffrement (ce qui n'est pas possible),
//             // on retourne un message masqué
//             return hashedPassword || "******** (mot de passe crypté)";
//         };

//         // Construction de la réponse avec les mots de passe récupérés
//         const response = {
//             eleve: {
//                 id: eleve.User.id,
//                 nom: eleve.User.nom,
//                 prenom: eleve.User.prenom,
//                 username: eleve.User.username,
//                 password: retrievePassword(eleve.User.password) // Tentative de récupération du mot de passe
//             },
//             parents: eleve.Parents?.map(parent => ({
//                 id: parent.User.id,
//                 nom: parent.User.nom,
//                 prenom: parent.User.prenom,
//                 username: parent.User.username,
//                 password: retrievePassword(parent.User.password),
//                 type: parent.typerole
//             })) || []
//         };

//         console.log("✅ Mots de passe récupérés :", response);

//         res.status(200).json(response);
//     } catch (error) {
//         console.error("Erreur lors de la récupération des mots de passe :", error);
//         res.status(500).json({ error: "Erreur serveur" });
//     }
// });



export default router;