// routes/UserPermissionRoutes.js
import express from 'express';
import bcrypt from "bcrypt";
import { getUserPermissions, getUserPermission, getUserPermissionss, getUsersList } from '../../controllers/User.js';
import { verifyToken } from '../../middelware/VerifyToken.js';
import User from '../../models/User.js';
import Role from '../../models/Role.js';
import UserRole from '../../models/UserRole.js';
import Permission from '../../models/Permission.js';
import moment from 'moment'

const router = express.Router();


// Route pour récupérer les permissions de l'utilisateur connecté
router.get('/user-permissions', verifyToken, getUserPermissions);
router.get('/users/permissions/:userId/:roleId', verifyToken, getUserPermission);

//route pour récuperer les permission à des utilisateur
router.get('/user/permission/:userId/:roleId', verifyToken, getUserPermissionss);
//méthode pour sauvegarder les permission à des utilisateur
router.get('/users', verifyToken, getUsersList);

//méthode qui récupère un user avec leur id 
// routes/userRoutes.js
router.get('/users/:userId', async (req, res) => {
    try {
        const user = await User.findByPk(req.params.userId, {
            attributes: [
                'id', 'nom', 'prenom', 'nom_ar', 'prenom_ar', 'datenaiss', 'lieuxnaiss', 'lieuxnaiss_ar',
                'telephone', 'email', 'username', 'password'
            ],
            include: [{
                model: Role,
                attributes: ['id', 'name'], // Ne récupérer que l'ID et le nom des rôles
                through: { attributes: [] }, // Exclure la table de liaison
            }],
            raw: false,  // Désactiver raw pour obtenir un objet Sequelize avec ses relations
            nest: true,  // Organiser les données en respectant la relation
        });

        if (!user) {
            return res.status(404).json({ message: 'Utilisateur non trouvé' });
        }

        // Vérification si les rôles existent
        const userRoles = user.Roles && user.Roles.length > 0
            ? user.Roles.map(role => ({ id: role.id, name: role.name }))
            : [];

        res.json({
            user: {
                id: user.id,
                nom: user.nom,
                prenom: user.prenom,
                nom_ar: user.nom_ar,
                prenom_ar: user.prenom_ar,
                datenaiss: user.datenaiss,
                lieuxnaiss: user.lieuxnaiss,
                lieuxnaiss_ar: user.lieuxnaiss_ar,
                telephone: user.telephone,
                email: user.email,
                username: user.username,
                roles: userRoles, // Ajouter uniquement les rôles de l'utilisateur
            }
        });

        console.log('Utilisateur trouvé avec rôles:', user.toJSON());
    } catch (error) {
        console.error('Erreur lors de la récupération de l\'utilisateur:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
});



router.put('/users/modifier/:userId', async (req, res) => {
    const userId = req.params.userId;
    console.log('Données reçues:', req.body);

    const {
        nom, prenom, nom_ar, prenom_ar, datenaiss, lieuxnaiss, lieuxnaiss_ar,
        telephone, email, username, password, roles
    } = req.body;

    try {
        // Vérifier si le username est déjà utilisé par un autre utilisateur
        const existingUser = await User.findOne({ where: { username } });
        if (existingUser && existingUser.id != userId) {
            console.log("Nom d'utilisateur déjà utilisé par un autre utilisateur.");
            return res.status(400).json({ message: "Ce nom d'utilisateur est déjà utilisé par un autre utilisateur." });
        }

        // Récupérer l'utilisateur actuel pour vérifier le mot de passe
        const user = await User.findByPk(userId);

        let hashedPassword = user.password; // Conserver l'ancien mot de passe par défaut
        if (password && password !== user.password) {
            // Si un nouveau mot de passe est fourni et différent de l'ancien, on le hash
            hashedPassword = await bcrypt.hash(password, 10);
        }

        // Mise à jour des informations de l'utilisateur
        await User.update({
            nom,
            prenom,
            nom_ar,
            prenom_ar,
            datenaiss,
            lieuxnaiss,
            lieuxnaiss_ar,
            telephone,
            email,
            username,
            password: hashedPassword
        }, {
            where: { id: userId }
        });

        // Récupérer les permissions existantes pour cet utilisateur
        const existingUserRoles = await UserRole.findAll({
            where: { userId },
            include: [{ model: Role, include: [Permission] }], // Inclure les rôles et les permissions
        });

        // Créer un mapping des permissions par rôle
        const permissionsByRole = {};
        existingUserRoles.forEach(userRole => {
            if (userRole.Role && userRole.Role.Permissions) {
                permissionsByRole[userRole.roleId] = userRole.Role.Permissions.map(permission => permission.id);
            }
        });

        // Suppression des rôles existants pour cet utilisateur dans la table UserRole
        // Supprimer les anciens rôles
        await UserRole.destroy({ where: { userId } });

        // Vérifier si des rôles sont fournis
        if (roles && roles.length > 0) {
            const newUserRoles = roles.map(role => ({
                userId,
                roleId: role.id
            }));

            // Insérer les nouveaux rôles
            await UserRole.bulkCreate(newUserRoles);
        }


        res.status(200).json({ message: "Utilisateur mis à jour avec succès." });
    } catch (error) {
        console.error("Erreur lors de la mise à jour de l'utilisateur :", error);
        res.status(500).json({ message: "Erreur serveur lors de la mise à jour de l'utilisateur." });
    }
});


router.put('/users/modifier/statut/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        // 1. Trouver l'utilisateur
        const user = await User.findByPk(userId);
        
        if (!user) {
            return res.status(404).json({ message: "Utilisateur non trouvé" });
        }

        // 3. Basculer le statut
        const newStatus = user.statuscompte === 'activer' ? 'désactiver' : 'activer';
        
        // 4. Mettre à jour dans la base de données
        let dateAD;

        if(newStatus==='désactiver'){
             dateAD = moment().format('YYYY-MM-DD');
        }else{
            dateAD=null
        }

        await User.update(
            { statuscompte: newStatus ,dateAD},
            { where: { id: userId } }
        );

        res.status(200).json({ 
            message: `Statut du compte mis à jour avec succès`,
            newStatus 
        });

    } catch (error) {
        console.error("Erreur lors du changement de statut:", error);
        res.status(500).json({ 
            message: "Erreur serveur lors du changement de statut",
            error: error.message 
        });
    }}
)

export default router;