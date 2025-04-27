// routes/EleveRoutes.js
import express from 'express';
import Eleve from '../../models/Admin/Eleve.js';
import User from '../../models/User.js';
import Parent from '../../models/Admin/Parent.js';
import Section from '../../models/Admin/Section.js';
import { ListeEleveParent, createEleve, deleteEleve, getEleveById, updateEleve, uploadMiddleware,
    getElevesByNiveau, updateEleveClasse, getElevesBySection, getElevesByEcole } from '../../controllers/Admin/EleveController.js';
import { verifyToken } from '../../middelware/VerifyToken.js';
import checkPermission from '../../middelware/PermissionMiddleware.js';
import bcrypt from 'bcrypt';

const router = express.Router();
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