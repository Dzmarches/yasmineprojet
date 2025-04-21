// =============================
// Middleware de vérification du token
// =============================
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Role from "../models/Role.js";
import EcolePrincipal from "../models/EcolePrincipal.js";
import Ecole from '../models/Admin/Ecole.js';
import UserEcole from '../models/Admin/UserEcole.js';
import Permission from '../models/Permission.js'; // Importez le modèle Permission

export const verifyToken = async (req, res, next) => {
    try {
        const token = req.headers['authorization']?.split(' ')[1];
        //console.log('token recupere', token);

        if (!token) {
            return res.status(403).json({ message: "Token manquant ou invalide" });
        }

        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        req.userId = decoded.userId;

        const user = await User.findOne({
            where: { id: decoded.userId },
            include: [
                { model: Role, through: { attributes: [] } },
                { model: EcolePrincipal },
                {
                    model: UserEcole,
                    include: [{ model: Ecole, attributes: ["id", "nomecole"] }],
                    attributes: ["ecoleeId"],
                },
                {
                    model: Permission,
                    through: { attributes: [] },
                }
            ]
        });

        if (!user) {
            return res.status(404).json({ message: "Utilisateur non trouvé." });
        }

        const ecoleeId = user.UserEcoles?.length > 0 ? user.UserEcoles[0].dataValues.ecoleeId : null;

        const userPermissions = user.Permissions.map(permission => permission.name);

        //console.log("🔑 Permissions de l'utilisateur connecté :", userPermissions);

        req.user = {
            id: user.id,
            username: user.username,
            roles: user.Roles.map(role => role.name),
            permissions: userPermissions,
            roleIds: decoded.roleIds,
            ecoleId: user.ecoleId || (user.EcolePrincipal ? user.EcolePrincipal.id : null),
            ecoleeId
        };

        //console.log("✅ Utilisateur vérifié :", req.user);
        next();
    } catch (error) {
        console.error('❌ Erreur lors de la vérification du token:', error);
        return res.status(403).json({ message: "Token invalide ou expiré." });
    }
};