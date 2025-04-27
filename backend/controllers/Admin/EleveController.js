import Eleve from '../../models/Admin/Eleve.js';
import Parent from '../../models/Admin/Parent.js';
import Niveaux from '../../models/Admin/Niveaux.js';
import EleveParent from '../../models/Admin/EleveParent.js';
import Role from '../../models/Role.js'; // Assurez-vous d'avoir ce modèle
import UserRole from '../../models/UserRole.js'; // Assurez-vous d'avoir ce modèle
import User from '../../models/User.js';
import UserEcole from '../../models/Admin/UserEcole.js';
import Ecole from '../../models/Admin/Ecole.js';
import Ecole_SEcole_Role from '../../models/Ecole_SEcole_Role.js';
import bcrypt from 'bcrypt';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { Op } from "sequelize";


//récupere la liste des éléve selon niveau 
// controllers/eleveController.js
export const getElevesByNiveau = async (req, res) => {
    try {
      const { niveauId } = req.params;
      const eleves = await Eleve.findAll({
        where: { niveauId },
        include: [{
          model: User,
          attributes: ['nom', 'prenom'] // On ne récupère que le nom et prénom
        }]
      });
      res.json(eleves);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erreur lors de la récupération des élèves' });
    }
  };
export const updateEleveClasse = async (req, res) => {

    const { id } = req.params;

    const { classeId } = req.body;


    try {

        // Vérifiez si l'élève existe

        const eleve = await Eleve.findByPk(id);

        if (!eleve) {

            return res.status(404).json({ message: "Élève non trouvé." });

        }


        // Mettez à jour le champ classeId

        eleve.classeId = classeId;

        await eleve.save();


        return res.status(200).json({ message: "Classe mise à jour avec succès." });

    } catch (error) {

        console.error("Erreur lors de la mise à jour de l'élève :", error);

        return res.status(500).json({ message: "Erreur lors de la mise à jour de l'élève." });

    }

};
export const getElevesBySection = async (req, res) => {
    try {
        const { sectionId } = req.params;
        
        const eleves = await Eleve.findAll({
            where: { classeId: sectionId },
            include: [{
                model: User,
                attributes: ['id', 'nom', 'prenom', 'nom_ar', 'prenom_ar', 'datenaiss', 'lieuxnaiss', 'lieuxnaiss_ar'],
            }]
        });

        res.json(eleves);
    } catch (error) {
        console.error('Erreur lors de la récupération des élèves:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};
// Récupérer tous les élèves non archivés
export const ListeEleveParent = async (req, res) => {
    try {
        const ecoleId = req.user.ecoleId; // ecoleId de l'AdminPrincipal
        const roles = req.user.roles;
        const userId = req.user.id; // ID de l'utilisateur connecté

        console.log('🟢 ecoleId:', ecoleId);
        console.log('🟢 roles:', roles);
        console.log('🟢 userId:', userId);

        const isAdminPrincipal = roles.includes('AdminPrincipal');
        const isAdmin = roles.includes('Admin');

        console.log('🟢 isAdminPrincipal:', isAdminPrincipal);
        console.log('🟢 isAdmin:', isAdmin);

        let listeEleves = [];
        let ecoleIds = [];

        // 🔹 Récupération des écoles associées à l'utilisateur
        if (isAdminPrincipal) {
            console.log("🔹 Rôle: AdminPrincipal - Filtrage par User.ecoleId");
            ecoleIds = [ecoleId]; // AdminPrincipal est lié directement à 1 école
        } else if (isAdmin) {
            console.log("🔹 Rôle: Admin - Récupération des écoles via UserEcole");

            // 🔍 Récupérer toutes les écoles associées à cet Admin
            const userEcoles = await UserEcole.findAll({
                where: { userId: userId },
                attributes: ['ecoleeId']
            });

            ecoleIds = userEcoles.map((ue) => ue.ecoleeId);
            console.log("🏫 Écoles associées à cet Admin:", ecoleIds);
        }

        // 🔍 Récupération des élèves selon le rôle
        if (isAdminPrincipal) {
            // 🔹 Récupération des élèves ayant ecoleId dans User
            listeEleves = await User.findAll({
                where: {
                    type: 'Eleve', // Filtre sur le type "Élève"
                    ecoleId: { [Op.in]: ecoleIds } // Filtre sur ecoleId
                },
                include: [
                    {
                        model: Eleve, // Inclure les informations de la table Eleve
                        attributes: { exclude: [] }, // Récupérer tous les champs de Eleve
                        include: [
                            {
                                model: Parent, // Inclure les parents associés
                                through: { attributes: [] }, // Ne pas inclure les attributs de la table de liaison
                                include: [
                                    {
                                        model: User, // Inclure les informations de User pour les parents
                                        attributes: ['nom', 'prenom', 'email', 'telephone'] // Récupérer les champs nécessaires
                                    }
                                ]
                            }
                        ]
                    }
                ],
                attributes: { exclude: [] }, // Récupérer tous les champs de User
                logging: console.log // Active le logging des requêtes SQL
            });
        } else if (isAdmin) {
            // 🔹 Récupération des élèves ayant ecoleeId via UserEcole
            listeEleves = await User.findAll({
                include: [
                    {
                        model: UserEcole,
                        where: { ecoleeId: { [Op.in]: ecoleIds } }, // Filtre sur les écoles associées
                        attributes: [] // On n'a pas besoin des attributs de UserEcole
                    },
                    {
                        model: Eleve, // Inclure les informations de la table Eleve
                        attributes: { exclude: [] }, // Récupérer tous les champs de Eleve
                        include: [
                            {
                                model: Parent, // Inclure les parents associés
                                through: { attributes: [] }, // Ne pas inclure les attributs de la table de liaison
                                include: [
                                    {
                                        model: User, // Inclure les informations de User pour les parents
                                        attributes: ['nom', 'prenom', 'email', 'telephone'] // Récupérer les champs nécessaires
                                    }
                                ]
                            }
                        ]
                    }
                ],
                where: {
                    type: 'Eleve' // Filtre sur le type "Élève"
                },
                attributes: { exclude: [] }, // Récupérer tous les champs de User
                logging: console.log // Active le logging des requêtes SQL
            });
        }

        console.log("✅ Élèves trouvés :", JSON.stringify(listeEleves, null, 2));

        res.status(200).json({ listeEleves });

    } catch (error) {
        console.error("❌ Erreur lors de la récupération des élèves et parents :", error);
        res.status(500).json({ message: "Erreur interne du serveur", error });
    }
};

// Ajouter un élève
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configuration de Multer pour l'upload des fichiers
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Chemin vers le dossier public/images/Eleve
        const uploadPath = path.join(__dirname, '..','..', 'public', 'images', 'Eleve');
        
        // Créer le dossier s'il n'existe pas
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        const timestamp = Date.now();
        const ext = path.extname(file.originalname);
        // Générer un nom de fichier unique
        cb(null, `${timestamp}-${file.originalname}`);
    }
});

// Création de l'instance multer et exportation
export const uploadMiddleware = multer({ storage });
export const createEleve = async (req, res) => {
    const { eleveData, parentData } = req.body;
    const photo = req.file;

    // console.log("📌 Données reçues (req.body) :", req.body);
    console.log("📌 Données de l'élève reçues :", eleveData);
    console.log("📌 Données des parents reçues :", parentData);
    console.log("📌 Photo reçue :", photo);

    try {
        // Parser eleveData si c'est une chaîne JSON
        let parsedEleveData = eleveData;
        if (typeof eleveData === 'string') {
            parsedEleveData = JSON.parse(eleveData);
        }

        // Parser parentData si c'est une chaîne JSON
        let parsedParentData = parentData;
        if (typeof parentData === 'string') {
            parsedParentData = JSON.parse(parentData);
        }

        // Vérifier que parsedParentData est un tableau
        if (!Array.isArray(parsedParentData)) {
            console.error("❌ Données des parents invalides : parentData doit être un tableau.");
            return res.status(400).json({ message: "Données des parents invalides : parentData doit être un tableau." });
        }

        // 1. Créer ou trouver les parents
        console.log("📢 Création ou recherche des parents...");
        const parents = await Promise.all(
            parsedParentData.map(async (parent) => {
                console.log("📌 Traitement du parent :", parent);

                // Vérifier si le parent existe déjà
                const existingParent = await User.findOne({
                    where: {
                        nom: parent.nomparent,
                        prenom: parent.prenomparent,
                        datenaiss: parent.datenaissparent,
                        lieuxnaiss: parent.lieuxnaissparent
                    },
                    include: [{
                        model: Parent,
                        where: { typerole: parent.typerole }
                    }]
                });

                if (existingParent) {
                    console.log("✅ Parent existant trouvé :", existingParent.id);
                    return existingParent.Parents[0]; // Retourner le parent existant
                }

                // Si le parent n'existe pas, le créer
                console.log("📌 Création d'un nouveau parent...");
                const hashedPassword = await bcrypt.hash(parent.paswwordparent, 10);
                console.log("📌 Mot de passe hashé pour le parent :", hashedPassword);

                const newUser = await User.create({
                    nom: parent.nomparent,
                    prenom: parent.prenomparent,
                    nom_ar: parent.nom_arparent,
                    prenom_ar: parent.prenom_arparent,
                    datenaiss: parent.datenaissparent,
                    lieuxnaiss: parent.lieuxnaissparent,
                    lieuxnaiss_ar: parent.lieuxnaiss_arparent,
                    adresse: parent.adresseparent,
                    adresse_ar: parent.adresse_arparent,
                    sexe: parent.sexe,
                    telephone: parent.telephoneparent,
                    email: parent.emailparent,
                    nationalite: parent.nationaliteparent,
                    username: parent.usernameparent,
                    password: hashedPassword,
                    type: 'Parent',
                    ecoleId: parent.ecoleId || null,
                });
                
                console.log("✅ Utilisateur parent créé :", newUser);

                const newParent = await Parent.create({
                    id: newUser.id,
                    emailparent: parent.emailparent,
                    telephoneparent: parent.telephoneparent,
                    travailleparent: parent.travailleparent,
                    situation_familiale: parent.situation_familiale.trim(),
                    nombreenfant: parent.nombreenfant,
                    typerole: parent.typerole,
                    userId: newUser.id,
                });
                console.log("✅ Parent créé :", newParent);

                if (parent.ecoleeId) {
                    await UserEcole.create({
                        userId: newUser.id,
                        ecoleeId: parent.ecoleeId,
                    });
                    console.log("✅ UserEcole créé pour le parent.");
                }

                const [roleParent] = await Role.findOrCreate({
                    where: { name: "Parent" },
                });
                console.log("✅ Rôle parent trouvé ou créé :", roleParent);

                await UserRole.create({
                    userId: newUser.id,
                    roleId: roleParent.id,
                });
                console.log("✅ UserRole créé pour le parent.");

                return newParent;
            })
        );

        // 2. Créer l'élève (le reste du code reste inchangé)
        console.log("📢 Création de l'élève...");
        const hashedPasswordEleve = await bcrypt.hash(parsedEleveData.password, 10);

        const newUser = await User.create({
            nom: parsedEleveData.nom,
            prenom: parsedEleveData.prenom,
            nom_ar: parsedEleveData.nom_ar,
            prenom_ar: parsedEleveData.prenom_ar,
            datenaiss: parsedEleveData.datenaiss,
            lieuxnaiss: parsedEleveData.lieuxnaiss,
            lieuxnaiss_ar: parsedEleveData.lieuxnaiss_ar,
            adresse: parsedEleveData.adresse,
            adresse_ar: parsedEleveData.adresse_ar,
            sexe: parsedEleveData.sexe,
            telephone: parsedEleveData.telephone,
            email: parsedEleveData.email,
            nationalite: parsedEleveData.nationalite,
            username: parsedEleveData.username,
            password: hashedPasswordEleve,
            type: 'Eleve',
            ecoleId: parsedEleveData.ecoleId || null,
            statuscompte: parsedEleveData.statuscompte || 'activer',
        });
        
        console.log("✅ Utilisateur élève créé :", newUser);

        let photoPath = null;
        if (photo) {
            photoPath = `/images/Eleve/${photo.filename}`;
            console.log("✅ Chemin de la photo :", photoPath);
        }

        const newEleve = await Eleve.create({
            id: newUser.id,
            nactnaiss: parsedEleveData.nactnaiss,
            etat_social: parsedEleveData.etat_social,
            antecedents: parsedEleveData.antecedents,
            antecedentsDetails: parsedEleveData.antecedentsDetails,
            suiviMedical: parsedEleveData.suiviMedical,
            suiviMedicalDetails: parsedEleveData.suiviMedicalDetails,
            natureTraitement: parsedEleveData.natureTraitement,
            natureTraitementDetails: parsedEleveData.natureTraitementDetails,
            crises: parsedEleveData.crises,
            crisesDetails: parsedEleveData.crisesDetails,
            conduiteTenir: parsedEleveData.conduiteTenir,
            conduiteTenirDetails: parsedEleveData.conduiteTenirDetails,
            operationChirurgical: parsedEleveData.operationChirurgical,
            operationChirurgicalDetails: parsedEleveData.operationChirurgicalDetails,
            maladieChronique: parsedEleveData.maladieChronique,
            maladieChroniqueDetails: parsedEleveData.maladieChroniqueDetails,
            dateInscription: parsedEleveData.dateInscription,
            autreecole: parsedEleveData.autreecole,
            nomecole: parsedEleveData.nomecole,
            redoublant: parsedEleveData.redoublant,
            niveauredoublant: parsedEleveData.niveauredoublant,
            orphelin: parsedEleveData.orphelin,
            niveaueleve: parsedEleveData.niveaueleve,
            numinscription: parsedEleveData.numinscription,
            numidentnational: parsedEleveData.numidentnational,
            datedinscriptionEncour: parsedEleveData.datedinscriptionEncour,
            fraixinscription: parsedEleveData.fraixinscription,
            cycle: parsedEleveData.cycle,
            photo: photoPath,
            userId: newUser.id,
            niveauId: parsedEleveData.niveauId,
        });
        console.log("✅ Élève créé :", newEleve);

        const [roleEleve] = await Role.findOrCreate({
            where: { name: "Elève" },
        });
        console.log("✅ Rôle élève trouvé ou créé :", roleEleve);

        await UserRole.create({
            userId: newEleve.id,
            roleId: roleEleve.id,
        });
        console.log("✅ UserRole créé pour l'élève.");

        if (parsedEleveData.ecoleeId) {
            await UserEcole.create({
                userId: newUser.id,
                ecoleeId: parsedEleveData.ecoleeId,
            });
            console.log("✅ UserEcole créé pour l'élève.");
        }

        // 3. Créer les relations entre l'élève et les parents
        console.log("📢 Création des relations entre l'élève et les parents...");
        await Promise.all(
            parents.map(async (parent) => {
                await EleveParent.create({
                    EleveId: newEleve.id,
                    ParentId: parent.id,
                });
                console.log("✅ Relation EleveParent créée pour le parent :", parent.id);
            })
        );

        // 4. Créer les enregistrements dans Ecole_SEcole_Role
        // 4. Créer les enregistrements dans Ecole_SEcole_Role
        console.log("📢 Création des enregistrements dans Ecole_SEcole_Role...");

        // Récupérer les roleId des rôles "Élève" et "Parent"
        const [roleEleveRecord] = await Role.findOrCreate({
            where: { name: "Elève" },
        });
        const [roleParentRecord] = await Role.findOrCreate({
            where: { name: "Parent" },
        });

        // Créer un enregistrement pour l'élève
        await Ecole_SEcole_Role.findOrCreate({
            where: {
                ecoleId: parsedEleveData.ecoleId,
                ecoleeId: parsedEleveData.ecoleeId || null,
                roleId: roleEleveRecord.id,
            },
            defaults: {
                ecoleId: parsedEleveData.ecoleId,
                ecoleeId: parsedEleveData.ecoleeId || null,
                roleId: roleEleveRecord.id,
            },
        });
        console.log("✅ Enregistrement Ecole_SEcole_Role vérifié/créé pour l'élève.");

        // Créer des enregistrements pour chaque parent
        await Promise.all(
            parents.map(async (parent) => {
                await Ecole_SEcole_Role.findOrCreate({
                    where: {
                        ecoleId: parent.ecoleId || parsedEleveData.ecoleId,
                        ecoleeId: parent.ecoleeId || parsedEleveData.ecoleeId || null,
                        roleId: roleParentRecord.id,
                    },
                    defaults: {
                        ecoleId: parent.ecoleId || parsedEleveData.ecoleId,
                        ecoleeId: parent.ecoleeId || parsedEleveData.ecoleeId || null,
                        roleId: roleParentRecord.id,
                    },
                });
                console.log("✅ Enregistrement Ecole_SEcole_Role vérifié/créé pour le parent :", parent.id);
            })
        );

        // Le reste du code (rôles, etc.) reste inchangé...

        // Réponse réussie
        console.log("✅ Élève et parents créés/linkés avec succès !");
        res.status(201).json({
            message: "Élève et parents créés/linkés avec succès !",
            eleve: newEleve,
            parents: parents,
        });
    } catch (error) {
        console.error("❌ Erreur lors de la création de l'élève et des parents :", error);
        res.status(500).json({
            message: "Une erreur est survenue lors de la création de l'élève et des parents.",
            error: error.message,
        });
    }
};

// export const createEleve = async (req, res) => {
//     const { eleveData, parentData } = req.body;
//     const photo = req.file;

//     // Log des données reçues
//     console.log("📌 Données reçues (req.body) :", req.body);
//     console.log("📌 Données de l'élève reçues :", eleveData);
//     console.log("📌 Données des parents reçues :", parentData);
//     console.log("📌 Photo reçue :", photo);

//     try {
//         // Parser eleveData si c'est une chaîne JSON
//         let parsedEleveData = eleveData;
//         if (typeof eleveData === 'string') {
//             parsedEleveData = JSON.parse(eleveData);
//         }

//         // Parser parentData si c'est une chaîne JSON
//         let parsedParentData = parentData;
//         if (typeof parentData === 'string') {
//             parsedParentData = JSON.parse(parentData);
//         }

//         // Vérifier que parsedParentData est un tableau
//         if (!Array.isArray(parsedParentData)) {
//             console.error("❌ Données des parents invalides : parentData doit être un tableau.");
//             return res.status(400).json({ message: "Données des parents invalides : parentData doit être un tableau." });
//         }
//         // 1. Créer les parents
//         console.log("📢 Création des parents...");
//         const parents = await Promise.all(
//             parsedParentData.map(async (parent) => {
//                 console.log("📌 Création du parent :", parent);

//                 const hashedPassword = await bcrypt.hash(parent.paswwordparent, 10);
//                 console.log("📌 Mot de passe hashé pour le parent :", hashedPassword);

//                 const newUser = await User.create({
//                     nom: parent.nomparent,
//                     prenom: parent.prenomparent,
//                     datenaiss: parent.datenaissparent,
//                     lieuxnaiss: parent.lieuxnaissparent,
//                     adresse: parent.adresseparent,
//                     sexe: parent.sexe,
//                     telephone: parent.telephoneparent,
//                     email: parent.emailparent,
//                     username: parent.usernameparent,
//                     password: hashedPassword,
//                     type: 'Parent',
//                     ecoleId: parent.ecoleId || null,
//                 });
//                 console.log("✅ Utilisateur parent créé :", newUser);

//                 const newParent = await Parent.create({
//                     id: newUser.id,
//                     emailparent: parent.emailparent,
//                     telephoneparent: parent.telephoneparent,
//                     travailleparent: parent.travailleparent,
//                     situation_familiale: parent.situation_familiale.trim(),
//                     nombreenfant: parent.nombreenfant,
//                     typerole: parent.typerole,
//                     userId: newUser.id,
//                 });
//                 console.log("✅ Parent créé :", newParent);

//                 if (parent.ecoleeId) {
//                     await UserEcole.create({
//                         userId: newUser.id,
//                         ecoleeId: parent.ecoleeId,
//                     });
//                     console.log("✅ UserEcole créé pour le parent.");
//                 }

//                 const [roleParent] = await Role.findOrCreate({
//                     where: { name: "Parent" },
//                 });
//                 console.log("✅ Rôle parent trouvé ou créé :", roleParent);

//                 await UserRole.create({
//                     userId: newUser.id,
//                     roleId: roleParent.id,
//                 });
//                 console.log("✅ UserRole créé pour le parent.");

//                 return newParent;
//             })
//         );

//         // 2. Créer l'élève
//         console.log("📢 Création de l'élève...");

//         // Assurez-vous que parsedEleveData est un objet
//         const hashedPasswordEleve = await bcrypt.hash(parsedEleveData.password, 10);

//         const newUser = await User.create({
//             nom: parsedEleveData.nom,
//             prenom: parsedEleveData.prenom,
//             datenaiss: parsedEleveData.datenaiss,
//             lieuxnaiss: parsedEleveData.lieuxnaiss,
//             adresse: parsedEleveData.adresse,
//             sexe: parsedEleveData.sexe,
//             telephone: parsedEleveData.telephone,
//             email: parsedEleveData.email,
//             username: parsedEleveData.username,
//             password: hashedPasswordEleve,
//             type: 'Eleve',
//             ecoleId: parsedEleveData.ecoleId || null,
//         });
//         console.log("✅ Utilisateur élève créé :", newUser);

//         let photoPath = null;
//         if (photo) {
//             photoPath = `/images/Eleve/${photo.filename}`;
//             console.log("✅ Chemin de la photo :", photoPath);
//         }

//         const newEleve = await Eleve.create({
//             id: newUser.id,
//             nactnaiss: parsedEleveData.nactnaiss,
//             etat_social: parsedEleveData.etat_social,
//             antecedents: parsedEleveData.antecedents,
//             antecedentsDetails: parsedEleveData.antecedentsDetails,
//             suiviMedical: parsedEleveData.suiviMedical,
//             suiviMedicalDetails: parsedEleveData.suiviMedicalDetails,
//             natureTraitement: parsedEleveData.natureTraitement,
//             natureTraitementDetails: parsedEleveData.natureTraitementDetails,
//             crises: parsedEleveData.crises,
//             crisesDetails: parsedEleveData.crisesDetails,
//             conduiteTenir: parsedEleveData.conduiteTenir,
//             conduiteTenirDetails: parsedEleveData.conduiteTenirDetails,
//             operationChirurgical: parsedEleveData.operationChirurgical,
//             operationChirurgicalDetails: parsedEleveData.operationChirurgicalDetails,
//             maladieChronique: parsedEleveData.maladieChronique,
//             maladieChroniqueDetails: parsedEleveData.maladieChroniqueDetails,
//             dateInscription: parsedEleveData.dateInscription,
//             autreecole: parsedEleveData.autreecole,
//             nomecole: parsedEleveData.nomecole,
//             redoublant: parsedEleveData.redoublant,
//             niveauredoublant: parsedEleveData.niveauredoublant,
//             orphelin: parsedEleveData.orphelin,
//             niveaueleve: parsedEleveData.niveaueleve,
//             numinscription: parsedEleveData.numinscription,
//             numidentnational: parsedEleveData.numidentnational,
//             datedinscriptionEncour: parsedEleveData.datedinscriptionEncour,
//             fraixinscription: parsedEleveData.fraixinscription,
//             cycle: parsedEleveData.cycle,
//             photo: photoPath,
//             userId: newUser.id,
//             niveauId: parsedEleveData.niveauId,
//         });
//         console.log("✅ Élève créé :", newEleve);

//         const [roleEleve] = await Role.findOrCreate({
//             where: { name: "Elève" },
//         });
//         console.log("✅ Rôle élève trouvé ou créé :", roleEleve);

//         await UserRole.create({
//             userId: newEleve.id,
//             roleId: roleEleve.id,
//         });
//         console.log("✅ UserRole créé pour l'élève.");

//         if (parsedEleveData.ecoleeId) {
//             await UserEcole.create({
//                 userId: newUser.id,
//                 ecoleeId: parsedEleveData.ecoleeId,
//             });
//             console.log("✅ UserEcole créé pour l'élève.");
//         }

//         // 3. Créer les relations entre l'élève et les parents
//         console.log("📢 Création des relations entre l'élève et les parents...");
//         await Promise.all(
//             parents.map(async (parent) => {
//                 await EleveParent.create({
//                     EleveId: newEleve.id,
//                     ParentId: parent.id,
//                 });
//                 console.log("✅ Relation EleveParent créée pour le parent :", parent.id);
//             })
//         );

//         // 4. Créer les enregistrements dans Ecole_SEcole_Role
//         // 4. Créer les enregistrements dans Ecole_SEcole_Role
//         console.log("📢 Création des enregistrements dans Ecole_SEcole_Role...");

//         // Récupérer les roleId des rôles "Élève" et "Parent"
//         const [roleEleveRecord] = await Role.findOrCreate({
//             where: { name: "Elève" },
//         });
//         const [roleParentRecord] = await Role.findOrCreate({
//             where: { name: "Parent" },
//         });

//         // Créer un enregistrement pour l'élève
//         await Ecole_SEcole_Role.findOrCreate({
//             where: {
//                 ecoleId: parsedEleveData.ecoleId,
//                 ecoleeId: parsedEleveData.ecoleeId || null,
//                 roleId: roleEleveRecord.id,
//             },
//             defaults: {
//                 ecoleId: parsedEleveData.ecoleId,
//                 ecoleeId: parsedEleveData.ecoleeId || null,
//                 roleId: roleEleveRecord.id,
//             },
//         });
//         console.log("✅ Enregistrement Ecole_SEcole_Role vérifié/créé pour l'élève.");

//         // Créer des enregistrements pour chaque parent
//         await Promise.all(
//             parents.map(async (parent) => {
//                 await Ecole_SEcole_Role.findOrCreate({
//                     where: {
//                         ecoleId: parent.ecoleId || parsedEleveData.ecoleId,
//                         ecoleeId: parent.ecoleeId || parsedEleveData.ecoleeId || null,
//                         roleId: roleParentRecord.id,
//                     },
//                     defaults: {
//                         ecoleId: parent.ecoleId || parsedEleveData.ecoleId,
//                         ecoleeId: parent.ecoleeId || parsedEleveData.ecoleeId || null,
//                         roleId: roleParentRecord.id,
//                     },
//                 });
//                 console.log("✅ Enregistrement Ecole_SEcole_Role vérifié/créé pour le parent :", parent.id);
//             })
//         );

//         // Réponse réussie
//         console.log("✅ Élève et parents créés avec succès !");
//         res.status(201).json({
//             message: "Élève et parents créés avec succès !",
//             eleve: newEleve,
//             parents: parents,
//         });
//     } catch (error) {
//         console.error("❌ Erreur lors de la création de l'élève et des parents :", error);
//         res.status(500).json({
//             message: "Une erreur est survenue lors de la création de l'élève et des parents.",
//             error: error.message,
//         });
//     }
// };
// Récupérer un élève par ID
export const getEleveById = async (req, res) => {
    const id = parseInt(req.params.id, 10);
    console.log("📢 Requête reçue pour récupérer l'élève avec ID :", req.params.id);

    if (isNaN(id)) {
        console.log("❌ ID invalide :", req.params.id);
        return res.status(400).json({ error: "ID invalide" });
    }

    try {
        console.log("🔎 Recherche de l'élève avec l'ID :", id);

        // Récupérer l'élève avec toutes les informations
        const eleve = await Eleve.findByPk(id, {
            include: [
                {
                    model: User,
                    where: { id: id },
                    attributes: { exclude: [] }
                },
                {
                    model: Niveaux,
                    as: "niveau",
                    attributes: ['id', 'nomniveau']
                },
                {
                    model: Parent,
                    include: [
                        {
                            model: User,
                            attributes: { exclude: [] }
                        }
                    ],
                    order: [['id', 'ASC']]
                }
            ],
        });

        if (!eleve) {
            console.log("❌ Aucun élève trouvé avec cet ID :", id);
            return res.status(404).json({ error: "Élève non trouvé" });
        }

        console.log("✅ Élève trouvé avec succès");

        // Formater les données pour le frontend
        const responseData = {
            eleve: {
                ...eleve.get({ plain: true }),
                ...eleve.User.get({ plain: true }),
                niveau: eleve.niveau?.nomniveau || 'Non spécifié',
                niveauId: eleve.niveauId,
            },
            pere: {},
            mere: {},
            tuteur: {}
        };

        // Organisation des parents par type
        if (eleve.Parents && eleve.Parents.length > 0) {
            eleve.Parents.forEach(parent => {
                const parentData = {
                    id: parent.id,
                    userId: parent.userId,
                    nomparent: parent.User.nom,
                    prenomparent: parent.User.prenom,
                    nom_arparent: parent.User.nom_ar,
                    prenom_arparent: parent.User.prenom_ar,
                    datenaissparent: parent.User.datenaiss ? formatDate(parent.User.datenaiss) : null,
                    lieuxnaissparent: parent.User.lieuxnaiss,
                    lieuxnaiss_arparent: parent.User.lieuxnaiss_ar,
                    adresseparent: parent.User.adresse,
                    adresse_arparent: parent.User.adresse_ar,
                    telephoneparent: parent.User.telephone,
                    emailparent: parent.User.email,
                    usernameparent: parent.User.username,
                    paswwordparent: parent.User.password,
                    travailleparent: parent.travailleparent,
                    situation_familiale: parent.situation_familiale,
                    nombreenfant: parent.nombreenfant,
                    nationaliteparent: parent.User.nationalite,
                    typerole: parent.typerole
                };

                if (parent.typerole === 'Père') {
                    responseData.pere = parentData;
                } else if (parent.typerole === 'Mère') {
                    responseData.mere = parentData;
                } else if (parent.typerole === 'Tuteur') {
                    responseData.tuteur = parentData;
                }
            });
        }

        // Définir le statut orphelin
        if (!responseData.pere.id && !responseData.mere.id) {
            responseData.eleve.orphelin = 'orpholinelesdeux';
        } else if (!responseData.pere.id) {
            responseData.eleve.orphelin = 'orpholinepère';
        } else if (!responseData.mere.id) {
            responseData.eleve.orphelin = 'orpholinemère';
        } else {
            responseData.eleve.orphelin = 'vivant';
        }

        res.status(200).json(responseData);
    } catch (err) {
        console.error("❌ Erreur lors de la récupération de l'élève :", err);
        res.status(500).json({ 
            error: "Erreur serveur", 
            details: process.env.NODE_ENV === 'development' ? err.message : undefined
        });
    }
};

// Fonction utilitaire pour formater la date
function formatDate(dateString) {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
}

//modifier eleve
export const updateEleve = async (req, res) => {
    const { id } = req.params;
    const { eleveData, parentData } = req.body;
    const photo = req.file;

    console.log("📌 Données reçues pour la mise à jour :", req.body);
    console.log("📌 Photo reçue :", photo);

    try {
        // Parser les données
        let parsedEleveData = typeof eleveData === 'string' ? JSON.parse(eleveData) : eleveData;
        let parsedParentData = typeof parentData === 'string' ? JSON.parse(parentData) : parentData;

        if (!Array.isArray(parsedParentData)) {
            return res.status(400).json({ message: "parentData doit être un tableau" });
        }

        // 1. Mettre à jour l'élève
        const eleve = await Eleve.findByPk(id, {
            include: [
                { model: User },
                { 
                    model: Parent,
                    include: [User]
                }
            ]
        });

        if (!eleve) {
            return res.status(404).json({ error: "Élève non trouvé" });
        }

        // Mettre à jour User
        await eleve.User.update({
            nom: parsedEleveData.nom,
            prenom: parsedEleveData.prenom,
            datenaiss: parsedEleveData.datenaiss,
            lieuxnaiss: parsedEleveData.lieuxnaiss,
            adresse: parsedEleveData.adresse,
            sexe: parsedEleveData.sexe,
            telephone: parsedEleveData.telephone,
            email: parsedEleveData.email,
            username: parsedEleveData.username,
            password: parsedEleveData.password 
                ? await bcrypt.hash(parsedEleveData.password, 10) 
                : eleve.User.password,
        });

        // Mettre à jour Eleve
        const updateData = { ...parsedEleveData };
        if (photo) {
            updateData.photo = `/images/Eleve/${photo.filename}`;
        }
        await eleve.update(updateData);

        // 2. Mettre à jour les parents
        for (const parentUpdate of parsedParentData) {
            // Trouver le parent existant par son type
            const existingParent = eleve.Parents.find(p => p.typerole === parentUpdate.typerole);
            
            if (existingParent) {
                // Mettre à jour le parent existant
                await existingParent.update({
                    travailleparent: parentUpdate.travailleparent,
                    situation_familiale: parentUpdate.situation_familiale,
                    nombreenfant: parentUpdate.nombreenfant,
                });

                // Mettre à jour l'User associé
                await existingParent.User.update({
                    nom: parentUpdate.nomparent,
                    prenom: parentUpdate.prenomparent,
                    datenaiss: parentUpdate.datenaissparent,
                    lieuxnaiss: parentUpdate.lieuxnaissparent,
                    adresse: parentUpdate.adresseparent,
                    telephone: parentUpdate.telephoneparent,
                    email: parentUpdate.emailparent,
                    username: parentUpdate.usernameparent,
                    password: parentUpdate.paswwordparent 
                        ? await bcrypt.hash(parentUpdate.paswwordparent, 10) 
                        : existingParent.User.password,
                });
            } else {
                // Créer un nouveau parent seulement si nécessaire
                const hashedPassword = await bcrypt.hash(parentUpdate.paswwordparent, 10);
                const newUser = await User.create({
                    nom: parentUpdate.nomparent,
                    prenom: parentUpdate.prenomparent,
                    datenaiss: parentUpdate.datenaissparent,
                    lieuxnaiss: parentUpdate.lieuxnaissparent,
                    adresse: parentUpdate.adresseparent,
                    telephone: parentUpdate.telephoneparent,
                    email: parentUpdate.emailparent,
                    username: parentUpdate.usernameparent,
                    password: hashedPassword,
                    type: 'Parent',
                    ecoleId: parentUpdate.ecoleId,
                });

                const newParent = await Parent.create({
                    userId: newUser.id,
                    emailparent: parentUpdate.emailparent,
                    telephoneparent: parentUpdate.telephoneparent,
                    travailleparent: parentUpdate.travailleparent,
                    situation_familiale: parentUpdate.situation_familiale,
                    nombreenfant: parentUpdate.nombreenfant,
                    typerole: parentUpdate.typerole,
                    ecoleId: parentUpdate.ecoleId,
                });

                await EleveParent.create({
                    EleveId: id,
                    ParentId: newParent.id,
                });
            }
        }

        res.status(200).json({
            message: "Élève et parents mis à jour avec succès",
            eleve: await Eleve.findByPk(id, {
                include: [User, { model: Parent, include: [User] }]
            })
        });
    } catch (error) {
        console.error("❌ Erreur lors de la mise à jour :", error);
        res.status(500).json({
            message: "Erreur lors de la mise à jour",
            error: error.message
        });
    }
};


// Supprimer un élève (archiver)
export const deleteEleve = async (req, res) => {
    const { id } = req.params;

    try {
        const [updated] = await Eleve.update({ archiver: 1 }, { where: { id } });
        if (!updated) return res.status(404).json({ error: 'Élève non trouvé' });

        res.status(200).json({ message: `Élève avec l'ID ${id} archivé avec succès` });
    } catch (err) {
        console.error("Erreur lors de l'archivage de l'élève :", err);
        res.status(500).json({ error: 'Erreur lors de l\'archivage de l\'élève' });
    }
};

// controllers/eleveController.js
export const getElevesByEcole = async (req, res) => {
    try {
      const { ecoleeId } = req.params;
  
      console.log("ecoleeId reçu dans les params:", ecoleeId);
  
      const eleves = await User.findAll({
        where: {
          type: 'Eleve',
        },
        include: [
          {
            model: UserEcole,
            where: { ecoleeId }, // ← lien via la table de jointure
            attributes: [], // Pas besoin de renvoyer les données de jointure
          },
          {
            model: Eleve,
            include: [Parent]
          }
        ]
      });
  
      res.status(200).json({ listeEleves: eleves });
    } catch (error) {
      console.error("Erreur:", error);
      res.status(500).json({ message: "Erreur serveur" });
    }
};
  
  