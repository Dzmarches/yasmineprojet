import Role from '../models/Role.js';
import Ecole_SEcole_Role from '../models/Ecole_SEcole_Role.js';
import jwt from 'jsonwebtoken';

// Lister tous les rôles
export const listRoles = async (req, res) => {
    try {
        // Vérifier la présence du token
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'Token non fourni ou invalide.' });
        }

        const token = authHeader.split(' ')[1]; // Extraire le token

        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        //console.log('Token décodé:', decodedToken); // Ajoutez ce log

        // Accéder au premier rôle dans le tableau
        const userRole = decodedToken.roles[0];
        //console.log('Rôle de l\'utilisateur:', userRole); // Ajoutez ce log

        let roles;

        if (userRole === 'AdminPrincipal') {
            // Récupérer les rôles associés à ecoleId
            roles = await Ecole_SEcole_Role.findAll({
                where: { ecoleId: decodedToken.ecoleId },
                include: [{ model: Role }],
            });
        } else if (userRole === 'Admin') {
            // Récupérer les rôles associés à ecoleeId
            roles = await Ecole_SEcole_Role.findAll({
                where: { ecoleeId: decodedToken.ecoleeId },
                include: [{ model: Role }],
            });
        } else {
            return res.status(403).json({ message: 'Accès non autorisé.' });
        }

        // Formater la réponse
        const formattedRoles = roles.map(item => item.Role);

        console.log('rollles', formattedRoles);
        res.status(200).json(formattedRoles);
    } catch (error) {
        console.error('Erreur lors de la récupération des rôles:', error);
        if (error.name === 'JsonWebTokenError') {
            res.status(401).json({ message: 'Token invalide.' });
        } else {
            res.status(500).json({ message: 'Erreur serveur lors de la récupération des rôles.' });
        }
    }
};
// Ajouter un rôle
export const addRole = async (req, res) => {
    const { name } = req.body;
    console.log('Données reçues:', { name });

    if (!name || typeof name !== 'string' || name.trim() === '') {
        return res.status(400).json({ message: 'Le nom du rôle est requis et doit être une chaîne de caractères valide.' });
    }

    try {
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const userRole = decodedToken.roles[0];

        const [roleInstance, created] = await Role.findOrCreate({
            where: { name },
            defaults: { name },
        });

        if (created) {
            console.log('→ Nouveau rôle créé:', roleInstance.name);
        } else {
            console.log('→ Rôle déjà existant:', roleInstance.name);
        }

        if (userRole === 'AdminPrincipal') {
            await Ecole_SEcole_Role.findOrCreate({
                where: {
                    ecoleId: decodedToken.ecoleId,
                    roleId: roleInstance.id,
                },
                defaults: {
                    ecoleId: decodedToken.ecoleId,
                    roleId: roleInstance.id,
                },
            });
        } else if (userRole === 'Admin') {
            await Ecole_SEcole_Role.findOrCreate({
                where: {
                    ecoleId: decodedToken.ecoleId,
                    ecoleeId: decodedToken.ecoleeId,
                    roleId: roleInstance.id,
                },
                defaults: {
                    ecoleId: decodedToken.ecoleId,
                    ecoleeId: decodedToken.ecoleeId,
                    roleId: roleInstance.id,
                },
            });
        } else {
            return res.status(403).json({ message: 'Accès non autorisé.' });
        }

        res.status(201).json({ role: roleInstance, message: created ? 'Rôle ajouté avec succès.' : 'Rôle déjà existant, association ajoutée.' });
    } catch (error) {
        console.error('Erreur lors de l\'ajout du rôle:', error);
        res.status(500).json({ message: 'Erreur serveur lors de l\'ajout du rôle.' });
    }
};

// export const addRole = async (req, res) => {
//     const { name } = req.body;
//     console.log('Données reçues:', { name });

//     if (!name || typeof name !== 'string' || name.trim() === '') {
//         return res.status(400).json({ message: 'Le nom du rôle est requis et doit être une chaîne de caractères valide.' });
//     }

//     try {
//         const token = req.headers.authorization.split(' ')[1]; // Récupérer le token JWT
//         const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET); // Décoder le token

//         // const userRole = decodedToken.role; // Récupérer le rôle de l'utilisateur
//         const userRole = decodedToken.roles[0]; // Corrige l'incohérence avec listRoles

//         // Vérifier si le rôle existe déjà
//         // const existingRole = await Role.findOne({ where: { name } });
//         // if (existingRole) {
//         //     return res.status(400).json({ message: 'Ce rôle existe déjà.' });
//         // }
//         const [roleInstance, created] = await Role.findOrCreate({
//             where: { name },
//             defaults: { name },
//           });
          
//           if (created) {
//             console.log('→ Nouveau rôle créé:', roleInstance.name);
//           } else {
//             console.log('→ Rôle déjà existant:', roleInstance.name);
//           }
          

//         // Créer le rôle
//         // const newRole = await Role.create({ name });

//         // Associer le rôle à ecoleId ou ecoleeId selon le rôle de l'utilisateur
//         if (userRole === 'AdminPrincipal') {
//             console.log('→ Création de l\'association avec ecoleId:', decodedToken.ecoleId);
//             await Ecole_SEcole_Role.create({
//                 ecoleId: decodedToken.ecoleId,
//                 roleId: newRole.id,
//             });
//         } else if (userRole === 'Admin') {
//             console.log('→ Création de l\'association avec ecoleeId:', decodedToken.ecoleeId);
//             await Ecole_SEcole_Role.create({
//                 ecoleId: decodedToken.ecoleId,
//                 ecoleeId: decodedToken.ecoleeId,
//                 roleId: newRole.id,
//             });
//         } else {
//             console.warn('→ Aucun rôle correspondant, association non créée.');
//         }


//         res.status(201).json({ role: newRole, message: 'Rôle ajouté avec succès.' });
//     } catch (error) {
//         console.error('Erreur lors de l\'ajout du rôle:', error);
//         res.status(500).json({ message: 'Erreur serveur lors de l\'ajout du rôle.' });
//     }
// };

// Modifier un rôle
export const updateRole = async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;
    console.log('Données reçues:', { id, name });

    if (!name || typeof name !== 'string' || name.trim() === '') {
        return res.status(400).json({ message: 'Le nom du rôle est requis et doit être une chaîne de caractères valide.' });
    }

    try {
        const token = req.headers.authorization.split(' ')[1]; // Récupérer le token JWT
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET); // Décoder le token

        const userRole = decodedToken.role; // Récupérer le rôle de l'utilisateur

        // Vérifier si le rôle existe
        const role = await Role.findByPk(id);
        if (!role) {
            return res.status(404).json({ message: 'Rôle non trouvé.' });
        }

        // Mettre à jour le rôle
        role.name = name;
        await role.save();

        res.status(200).json({ role, message: 'Rôle modifié avec succès.' });
    } catch (error) {
        console.error('Erreur lors de la modification du rôle:', error);
        res.status(500).json({ message: 'Erreur serveur lors de la modification du rôle.' });
    }
};

// Archiver un rôle (soft delete)
export const archiveRole = async (req, res) => {
    const { id } = req.params;

    try {
        // Vérifier si le rôle existe
        const role = await Role.findByPk(id);
        if (!role) {
            return res.status(404).json({ message: 'Rôle non trouvé.' });
        }

        // Archiver le rôle (soft delete)
        await role.destroy();

        res.status(200).json({ message: 'Rôle archivé avec succès.' });
    } catch (error) {
        console.error('Erreur lors de l\'archivage du rôle:', error);
        res.status(500).json({ message: 'Erreur serveur lors de l\'archivage du rôle.' });
    }
};

// Restaurer un rôle archivé
export const restoreRole = async (req, res) => {
    const { id } = req.params;

    try {
        // Restaurer le rôle
        await Role.restore({ where: { id } });

        res.status(200).json({ message: 'Rôle restauré avec succès.' });
    } catch (error) {
        console.error('Erreur lors de la restauration du rôle:', error);
        res.status(500).json({ message: 'Erreur serveur lors de la restauration du rôle.' });
    }
};