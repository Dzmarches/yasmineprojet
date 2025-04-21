import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Ecole from '../../models/EcolePrincipal.js';
import User from '../../models/User.js';
import Role from '../../models/Role.js';
import UserRole from '../../models/UserRole.js';
import Ecole_SEcole_Role from '../../models/Ecole_SEcole_Role.js';
import bcrypt from 'bcrypt';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Récupérer toutes les écoles non archivées
export const getUserByEcoleId = async (req, res) => {
    try {
        const { ecoleId } = req.params;
        const user = await User.findOne({ 
            where: { ecoleId },
            attributes: ['id', 'nom', 'prenom', 'email', 'telephone', 'username', 'password'] // Sélectionnez explicitement les champs
        });

        if (!user) {
            return res.status(404).json({ message: "Utilisateur non trouvé pour cette école." });
        }

        // Renvoyez l'objet utilisateur brut (sans le wrapper dataValues)
        res.json(user.get({ plain: true }));
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur", error });
    }
};
export const getEcoles = async (req, res) => {
    try {
        const ecoles = await Ecole.findAll({ where: { archiver: 0 } });
        res.json(ecoles);
    } catch (err) {
        console.error("Erreur lors de la récupération des écoles :", err);
        res.status(500).json({ error: 'Erreur lors de la récupération des écoles' });
    }
};

// EcoleController.js
export const getEcoleById = async (req, res) => {
    const { id } = req.params;

    try {
        const ecole = await Ecole.findOne({ where: { id } });
        if (!ecole) {
            return res.status(404).json({ error: 'École non trouvée' });
        }
        res.json(ecole);
    } catch (err) {
        console.error("Erreur lors de la récupération de l'école :", err);
        res.status(500).json({ error: 'Erreur lors de la récupération de l\'école' });
    }
};
// Ajouter une nouvelle école

export const createEcole = async (req, res) => {
    const {
        nomecole,
        nom_arecole,
        adresse,
        emailecole,
        telephoneecole,
        fix,
        maps,
        rc,
        rib,
        nif,
        username,
        password,
        nom,
        prenom,
        email,
        telephone,
        facebook,
        insta,
        linkdin,
        numerodagrimo, // Nouveau champ
        dateFinDagrimo, // Nouveau champ
    } = req.body;

    const logo = req.file;

    // Vérification des champs obligatoires
    if (!nomecole || !nom_arecole || !adresse || !emailecole || !telephoneecole || !maps || !rc || !rib || !nif || !username || !password || !nom || !prenom || !email || !telephone) {
        return res.status(400).json({ error: 'Tous les champs sont requis.' });
    }

    try {
        let logoPath = '';
        let logoUrl = '';

        if (logo) {
            logoPath = `/images/Ecole/${logo.filename}`;
            logoUrl = `${req.protocol}://${req.get('host')}${logoPath}`;
        }

        const newEcole = await Ecole.create({
            nomecole,
            nom_arecole,
            adresse,
            emailecole,
            telephoneecole,
            fix,
            maps,
            rc,
            rib,
            nif,
            archiver: 0,
            logo: logoPath,
            facebook,
            insta,
            linkdin,
            numerodagrimo, // Ajout du nouveau champ
            dateFinDagrimo, // Ajout du nouveau champ
        });

        const salt = await bcrypt.genSalt();
        const hashPassword = await bcrypt.hash(password, salt);

        const newUser = await User.create({
            nom,
            prenom,
            email,
            telephone,
            username,
            password: hashPassword,
            type: "AdminPrincipal",
            ecoleId: newEcole.id,
        });

        const [role] = await Role.findOrCreate({
            where: { name: "AdminPrincipal" },
        });

        await UserRole.create({
            userId: newUser.id,
            roleId: role.id,
        });
        await Ecole_SEcole_Role.findOrCreate({
            where: {
              ecoleId: newEcole.id,
              ecoleeId: null,
              roleId: role.id,
            },
            defaults: {
              ecoleId: newEcole.id,
              ecoleeId: null,
              roleId: role.id,
            }
        });

        res.status(201).json({ 
            message: 'École et utilisateur ajoutés avec succès', 
            newEcole: {
                ...newEcole.toJSON(),
                logoUrl
            },
            newUser 
        });

    } catch (err) {
        console.error("Erreur lors de l'ajout de l'école :", err);
        res.status(500).json({ error: 'Erreur lors de l\'ajout de l\'école' });
    }
};

// Modifier une école
export const updateEcole = async (req, res) => {
    const { id } = req.params;
    
    console.log('Requête de mise à jour reçue:', { body: req.body, file: req.file });

    try {
        // Récupérer l'école actuelle
        const ecole = await Ecole.findOne({ where: { id } });
        if (!ecole) {
            console.log('École non trouvée avec ID:', id);
            return res.status(404).json({ error: 'École non trouvée' });
        }

        let logoPath = ecole.logo;
        
        // Gérer le nouveau logo si fourni
        if (req.file) {
            // Supprimer l'ancien fichier s'il existe
            if (ecole.logo) {
                const oldLogoPath = path.join(__dirname, '../../public', ecole.logo);
                if (fs.existsSync(oldLogoPath)) {
                    fs.unlinkSync(oldLogoPath);
                    console.log('Ancien logo supprimé:', oldLogoPath);
                }
            }
            
            // Créer le chemin d'accès URL (pas le chemin système)
            logoPath = `/images/Ecole/${req.file.filename}`;
            console.log('Nouveau logo:', logoPath);
        }

        // Préparer les données de mise à jour
        const updateData = {
            nomecole: req.body.nomecole || ecole.nomecole,
            nom_arecole: req.body.nom_arecole || ecole.nom_arecole,
            adresse: req.body.adresse || ecole.adresse,
            emailecole: req.body.emailecole || ecole.emailecole,
            telephoneecole: req.body.telephoneecole || ecole.telephoneecole,
            fix: req.body.fix || ecole.fix,
            maps: req.body.maps || ecole.maps,
            rc: req.body.rc || ecole.rc,
            rib: req.body.rib || ecole.rib,
            nif: req.body.nif || ecole.nif,
            facebook: req.body.facebook || ecole.facebook,
            insta: req.body.insta || ecole.insta,
            linkdin: req.body.linkdin || ecole.linkdin,
            logo: logoPath,
            numerodagrimo:req.body.numerodagrimo || ecole.numerodagrimo, // Ajout du nouveau champ
            dateFinDagrimo:req.body.dateFinDagrimo || ecole.dateFinDagrimo // Ajout du nouveau champ
        };

        console.log('Données de mise à jour:', updateData);

        // Mettre à jour l'école
        const [updated] = await Ecole.update(updateData, {
            where: { id },
        });

        if (!updated) {
            console.log('Aucune ligne mise à jour - peut-être que les données sont identiques');
            return res.status(400).json({ error: 'Échec de la mise à jour - données identiques ou erreur' });
        }

        // Mettre à jour l'utilisateur associé
        const user = await User.findOne({ where: { ecoleId: id } });
        if (user) {
            const userUpdateData = {
                nom: req.body.nom || user.nom,
                prenom: req.body.prenom || user.prenom,
                email: req.body.email || user.email,
                telephone: req.body.telephone || user.telephone,
                username: req.body.username || user.username
            };
            
            console.log('Mise à jour utilisateur:', userUpdateData);
            
            await User.update(userUpdateData, {
                where: { id: user.id },
            });
        }

        console.log('Mise à jour réussie pour l\'école ID:', id);
        res.status(200).json({ 
            message: 'École mise à jour avec succès', 
            updatedData: {
                ...updateData,
                logoUrl: `${req.protocol}://${req.get('host')}${logoPath}`
            }
        });
    } catch (err) {
        console.error("Erreur lors de la mise à jour de l'école:", err);
        res.status(500).json({ error: 'Erreur serveur lors de la mise à jour', details: err.message });
    }
};
// Supprimer une école (archiver)
export const deleteEcole = async (req, res) => {
    const { id } = req.params;

    try {
        const [updated] = await Ecole.update({ archiver: 1 }, { where: { id } });
        if (!updated) return res.status(404).json({ error: 'École non trouvée' });

        res.status(200).json({ message: `École avec l'ID ${id} archivée avec succès` });
    } catch (err) {
        console.error("Erreur lors de l'archivage de l'école :", err);
        res.status(500).json({ error: 'Erreur lors de l\'archivage de l\'école' });
    }
};