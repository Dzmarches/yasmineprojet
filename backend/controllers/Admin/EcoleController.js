import Ecole from "../../models/Admin/Ecole.js";
import User from "../../models/User.js";
import UserEcole from "../../models/Admin/UserEcole.js";
import Role from '../../models/Role.js';
import UserRole from '../../models/UserRole.js';
import EcolePrincipal from "../../models/EcolePrincipal.js";
import Permission from "../../models/Permission.js";
import Ecole_SEcole_Role from '../../models/Ecole_SEcole_Role.js';
import bcrypt from "bcrypt";

// Méthode pour récupérer toutes les écoles
export const getAllEcoles = async (req, res) => {
    try {
        const ecoleId = req.user?.ecoleId; // Récupéré depuis le token (auth middleware)

        const ecoles = await Ecole.findAll({
            where: {
                ecoleId: ecoleId,
            },
            include: [
                {
                    model: EcolePrincipal,
                    attributes: ['logo'], // Tu peux ajouter ce que tu veux ici
                },
            ],
        });

        res.status(200).json(ecoles);
    } catch (error) {
        console.error("Erreur lors de la récupération des écoles:", error);
        res.status(500).json({ message: "Erreur serveur" });
    }
};


// Méthode pour récupérer une école par son ID
export const getEcoleById = async (req, res) => {
    try {
        const { id } = req.params; // Récupérer l'id depuis les paramètres de l'URL
        const ecole = await Ecole.findOne({
            where: { id: id },
            attributes: ['id', 'cycle', 'ecoleId'],
        });

        if (!ecole) {
            return res.status(404).json({ message: "École non trouvée" });
        }
        res.status(200).json(ecole);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
// Dans votre contrôleur backend
// Dans votre contrôleur backend
export const getEcoleByIds = async (req, res) => {
    try {
        const ecole = await Ecole.findByPk(req.params.id, {
            include: [{
                model: User,
                attributes: ['id'],
                required: false // Rend l'association optionnelle
            }]
        });

        if (!ecole) {
            return res.status(404).json({ message: 'École non trouvée' });
        }

        // Formater la réponse
        const response = {
            ...ecole.toJSON(),
            userId: ecole.User?.id || null
        };

        res.json(response);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};
// Dans votre contrôleur d'école (backend)
export const getEcoleWithUser = async (req, res) => {
    try {
        const ecole = await Ecole.findByPk(req.params.id, {
            include: [
                {
                    model: User,
                    through: { attributes: [] }, // Ne pas inclure les attributs de la table de jointure
                    attributes: ['id', 'nom', 'prenom', 'email', 'telephone', 'username']
                }
            ]
        });

        if (!ecole) {
            return res.status(404).json({ message: 'École non trouvée' });
        }

        // Formater la réponse
        const response = {
            ...ecole.toJSON(),
            userId: ecole.User?.id || null,
            nom: ecole.User?.nom || '',
            prenom: ecole.User?.prenom || '',
            email: ecole.User?.email || '',
            telephone: ecole.User?.telephone || '',
            username: ecole.User?.username || ''
        };
console.log('ecole', response);
        res.json(response);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};
// Méthode pour créer une école, un utilisateur et lier les deux via UserEcole
export const createEcole = async (req, res) => {
    const {
        nomecole,
        nom_arecole,
        adresse,
        emailecole,
        telephoneecole,
        fix,
        cycle,
        maps,
        facebook,
        insta,
        linkdin,
        rc,
        rib,
        nif,
        nom,
        prenom,
        email,
        telephone,
        username,
        password,
        ecoleId,
        permissions, // Les permissions formatées
        
    } = req.body;

    try {
        const ecolePrincipal = await EcolePrincipal.findByPk(ecoleId);
        if (!ecolePrincipal) {
            return res.status(400).json({ message: "ecoleId invalide : l'école principale n'existe pas." });
        }

        const newEcole = await Ecole.create({
            nomecole,
            nom_arecole,
            adresse,
            emailecole,
            telephoneecole,
            fix,
            cycle,
            maps,
            facebook,
            insta,
            linkdin,
            rc,
            rib,
            nif,
            ecoleId,
            
        });

        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = await User.create({
            nom,
            prenom,
            email,
            telephone,
            username,
            password: hashedPassword,
            type: "Admin",
            ecoleId: ecoleId,
        });

        await UserEcole.create({
            userId: newUser.id,
            ecoleeId: newEcole.id,
        });

        const [role] = await Role.findOrCreate({
            where: { name: "Admin" },
        });

        await UserRole.create({
            userId: newUser.id,
            roleId: role.id,
        });
        await Ecole_SEcole_Role.findOrCreate({
            where: {
                ecoleId: ecoleId,
                ecoleeId: newEcole.id,
                roleId: role.id,
            },
            defaults: {
                ecoleId: ecoleId,
                ecoleeId: newEcole.id,
                roleId: role.id,
            }
        });        

        // Sauvegarder les permissions
        if (permissions && Array.isArray(permissions)) {
            for (const permissionName of permissions) {
                const [permission] = await Permission.findOrCreate({
                    where: { name: permissionName },
                    defaults: { name: permissionName },
                });

                await UserRole.create({
                    userId: newUser.id,
                    roleId: role.id,
                    permissionId: permission.id,
                });
            }
        }

        res.status(201).json({ message: "École et utilisateur créés avec succès", ecole: newEcole, user: newUser });
    } catch (error) {
        console.error("Erreur lors de la création de l'école et de l'utilisateur:", error);
        res.status(500).json({ message: "Erreur serveur" });
    }
};
// Méthode pour mettre à jour une école
export const updateEcole = async (req, res) => {
    const { id } = req.params;
    const updatedData = req.body;

    try {
        const ecole = await Ecole.findByPk(id);
        if (!ecole) {
            return res.status(404).json({ message: "École non trouvée" });
        }

        // Mettre à jour les champs, y compris les nouveaux
        await ecole.update({
            ...updatedData,
        });

        res.status(200).json({ message: "École mise à jour avec succès", ecole });
    } catch (error) {
        console.error("Erreur lors de la mise à jour de l'école:", error);
        res.status(500).json({ message: "Erreur serveur" });
    }
};

// Méthode pour supprimer une école
export const deleteEcole = async (req, res) => {
    const { id } = req.params;

    try {
        const ecole = await Ecole.findByPk(id);
        if (!ecole) {
            return res.status(404).json({ message: "École non trouvée" });
        }

        await ecole.destroy();
        res.status(200).json({ message: "École supprimée avec succès" });
    } catch (error) {
        console.error("Erreur lors de la suppression de l'école:", error);
        res.status(500).json({ message: "Erreur serveur" });
    }
};