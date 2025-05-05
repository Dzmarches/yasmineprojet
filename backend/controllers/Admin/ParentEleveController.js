import User from "../../models/User.js";
import Eleve from "../../models/Admin/Eleve.js";
import EleveParent from "../../models/Admin/EleveParent.js";
import Niveaux from "../../models/Admin/Niveaux.js";
import Section from "../../models/Admin/Section.js";
import Parent from "../../models/Admin/Parent.js";
import Anneescolaire from "../../models/Admin/Anneescolaires.js";
import Trimest from "../../models/Admin/Trimest.js";
import Matiere from "../../models/Admin/Matiere.js";
import Note from '../../models/Admin/Note.js';
import MoyenneGenerale from '../../models/Admin/MoyenneGenerale.js'; 
import jwt from 'jsonwebtoken';

import sequelize from '../../config/Database.js'; // ou le chemin correct vers ton fichier de config sequelize
import { Sequelize } from 'sequelize';

// Récupérer la liste des enfants d'un parent
export const getEnfantsByParent = async (req, res) => {
    try {
        // Récupérer le parentId depuis le token
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const parentId = decoded.userId;

        // Vérifier si l'utilisateur est bien un parent
        const parent = await Parent.findByPk(parentId);
        if (!parent) {
            return res.status(403).json({ message: "Accès refusé. Utilisateur n'est pas un parent." });
        }

        // Récupérer les enfants associés à ce parent
        const enfants = await EleveParent.findAll({
            where: { ParentId: parentId },
            include: [
                {
                    model: Eleve,
                    as: 'Eleve',
                    include: [
                        {
                            model: User,
                            attributes: ['id', 'nom', 'prenom', 'sexe']  // La photo est maintenant dans Eleve
                        },
                        {
                            model: Niveaux,
                            attributes: ['id', 'nomniveau']
                        },
                        {
                            model: Section,
                            attributes: ['id', 'classe']
                        }
                    ]
                }
            ]
        });

        // Formater la réponse
        const enfantsFormates = enfants.map(item => ({
            id: item.Eleve.id,
            userId: item.Eleve.userId,
            nom: item.Eleve.User.nom,
            prenom: item.Eleve.User.prenom,
            photo: item.Eleve.photo || (item.Eleve.User.sexe === 'F' ? '/default-female.png' : '/default-male.png'), // Utilisation de photo dans Eleve
            niveau: item.Eleve.Niveaux?.nomniveau,
            classe: item.Eleve.Section?.classe,
            numInscription: item.Eleve.numinscription
        }));

        res.status(200).json(enfantsFormates);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur lors de la récupération des enfants" });
    }
};

// Récupérer les détails d'un enfant spécifique
export const getEnfantDetails = async (req, res) => {
    try {
        const { eleveId } = req.params;

        // Vérifier que le parent a bien accès à cet enfant
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const parentId = decoded.userId;

        const relationExists = await EleveParent.findOne({
            where: { ParentId: parentId, EleveId: eleveId }
        });

        if (!relationExists) {
            return res.status(403).json({ message: "Accès refusé. Cet enfant ne vous est pas associé." });
        }

        // Récupérer les détails de l'enfant
        const eleve = await Eleve.findByPk(eleveId, {
            include: [
                {
                    model: User,
                    attributes: ['id', 'nom', 'prenom', 'sexe', 'datenaiss', 'email', 'telephone']
                },
                {
                    model: Niveaux,
                    attributes: ['id', 'nomniveau']
                },
                {
                    model: Section,
                    attributes: ['id', 'classe']
                }
            ]
        });

        if (!eleve) {
            return res.status(404).json({ message: "Enfant non trouvé" });
        }

        res.status(200).json({
            id: eleve.id,
            userId: eleve.userId,
            nom: eleve.User.nom,
            prenom: eleve.User.prenom,
            photo: eleve.photo || (eleve.User.sexe === 'F' ? '/default-female.png' : '/default-male.png'), // Utilisation de photo dans Eleve
            datenaiss: eleve.User.datenaiss,
            email: eleve.User.email,
            telephone: eleve.User.telephone,
            niveau: eleve.Niveaux?.nomniveau,
            classe: eleve.Section?.classe,
            numInscription: eleve.numinscription,
            groupeSanguin: eleve.groupeSanguin,
            etat_social: eleve.etat_social
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur lors de la récupération des détails de l'enfant" });
    }
};

// Récupérer les années scolaires d'un élève
export const getAnneesScolairesByEleve = async (req, res) => {
    try {
        const { eleveId } = req.params;
        
        // Vérifier l'accès du parent
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const parentId = decoded.userId;

        const relationExists = await EleveParent.findOne({
            where: { ParentId: parentId, EleveId: eleveId }
        });

        if (!relationExists) {
            return res.status(403).json({ message: "Accès refusé." });
        }

        // Récupérer les années scolaires distinctes pour cet élève
        const annees = await MoyenneGenerale.findAll({
            where: { EleveId: eleveId },
            attributes: ['annescolaireId'],
            include: [{
                model: Anneescolaire,
                attributes: ['id', 'titre', 'datedebut', 'datefin']
            }],
            group: ['annescolaireId'],
            order: [[Sequelize.col('Anneescolaire.datedebut'), 'DESC']]
        });
        
           

        res.status(200).json(annees.map(a => a.Anneescolaire));
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur serveur" });
    }
};
// Récupérer les trimestres pour une année scolaire
export const getTrimestresByAnnee = async (req, res) => {
    try {
        const { eleveId, anneeId } = req.params;
        const { published } = req.query;
        
        // Vérifier l'accès du parent
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const parentId = decoded.userId;

        const relationExists = await EleveParent.findOne({
            where: { ParentId: parentId, EleveId: eleveId }
        });

        if (!relationExists) {
            return res.status(403).json({ message: "Accès refusé." });
        }

        // Construire la condition where
        const where = { 
            EleveId: eleveId,
            annescolaireId: anneeId
        };

        // Si published=true, ne retourner que les moyennes publiées
        if (published === 'true') {
            where.status = true;
        }

        // Récupérer les trimestres avec les moyennes
        const trimestres = await MoyenneGenerale.findAll({
            where: where,
            include: [{
                model: Trimest,
                attributes: ['id', 'titre', 'dateDebut', 'dateFin']
            }],
            attributes: ['id', 'moyenne', 'trimestId', 'status'],
            order: [[Trimest, 'dateDebut', 'ASC']]
        });

        res.status(200).json(trimestres);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur serveur" });
    }
};
// Récupérer les notes détaillées pour un trimestre
export const getNotesByTrimestre = async (req, res) => {
    try {
        const { eleveId, trimestreId } = req.params;
        const { published } = req.query;
        
        // Vérifier l'accès du parent
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const parentId = decoded.userId;

        const relationExists = await EleveParent.findOne({
            where: { ParentId: parentId, EleveId: eleveId }
        });

        if (!relationExists) {
            return res.status(403).json({ message: "Accès refusé." });
        }

        // Construire la condition where
        const where = { 
            EleveId: eleveId,
            trimestId: trimestreId
        };

        // Si published=true, vérifier que la moyenne générale est publiée
        if (published === 'true') {
            const moyenneExists = await MoyenneGenerale.findOne({
                where: {
                    EleveId: eleveId,
                    trimestId: trimestreId,
                    status: true
                }
            });

            if (!moyenneExists) {
                return res.status(403).json({ message: "Les notes de ce trimestre ne sont pas encore publiées." });
            }
        }

        // Récupérer les notes avec les matières
        const notes = await Note.findAll({
            where: where,
            include: [{
                model: Matiere,
                attributes: ['id', 'nom', 'nomarabe']
            }],
            attributes: { 
                exclude: ['createdAt', 'updatedAt'] 
            },
            order: [[Matiere, 'nom', 'ASC']]
        });

        res.status(200).json(notes);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur serveur" });
    }
};


// export const getEnfantsByParent = async (req, res) => {
//     try {
//         const parentId = req.user.id; // ID du parent connecté (depuis le token)

//         // Récupérer tous les élèves associés à ce parent
//         const enfants = await User.findAll({
//             include: [
//                 {
//                     model: Eleve,
//                     include: [
//                         { model: Niveaux },
//                         { model: Section
                            
//                          }
//                     ]
//                 },
//                 {
//                     model: EleveParent,
//                     where: { ParentId: parentId },
//                     attributes: []
//                 }
//             ],
//             where: {
//                 type: 'eleve'
//             }
//         });

//         // Formater les données pour le frontend
//         const formattedEnfants = enfants.map(enfant => ({
//             id: enfant.id,
//             nom: enfant.nom,
//             prenom: enfant.prenom,
//             photo: enfant.Eleve?.photo || '/default-avatar.png',
//             niveau: enfant.Eleve?.Niveaux?.nom || 'Non spécifié',
//             classe: enfant.Eleve?.Classe?.nom || 'Non spécifié'
//         }));

//         res.status(200).json(formattedEnfants);
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Erreur lors de la récupération des enfants' });
//     }
// };