import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Role from "../models/Role.js";
import UserRole from "../models/UserRole.js";
import EcolePrincipal from "../models/EcolePrincipal.js";
import Ecole from "../models/Admin/Ecole.js";
import UserEcole from "../models/Admin/UserEcole.js";
import Permission from "../models/Permission.js";

import dotenv from "dotenv";
import { exec } from "child_process";  // <-- Import nécessaire pour utiliser exec
import fetch from "node-fetch"; // si vous n'utilisez pas Node 18+ qui a fetch intégré
import { Op } from 'sequelize';

dotenv.config();

export const getUserPermissions = async (req, res) => {
  try {
    const userId = req.user.id;

    // Inclure les rôles et leurs permissions (en tableau)
    const user = await User.findOne({
      where: { id: userId },
      include: [{
        model: Role,
        include: [{
          model: Permission,
          through: { attributes: [] } // Exclure les attributs de la table d'association
        }]
      }]
    });

    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    // Fusionner toutes les permissions de chaque rôle
    const permissions = user.Roles.reduce((acc, role) => {
      if (role.Permissions && Array.isArray(role.Permissions)) {
        return acc.concat(role.Permissions.map(permission => permission.name));
      }
      return acc;
    }, []);

    res.json({ permissions });
  } catch (error) {
    console.error("Erreur lors de la récupération des permissions", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};
//méthode pour récuperer les permission de user connecter lors de la création de sous
export const getUserPermission = async (req, res) => {
  const { userId, roleId } = req.params;

  try {
    const permissions = await UserRole.findAll({
      where: { userId, roleId },
      include: [{
        model: Permission,
        attributes: ["name"],
      }],
    });

    if (permissions.length === 0) {
      return res.status(404).json({ message: "Aucune permission trouvée pour cet utilisateur." });
    }

    const permissionNames = permissions.map(permission => permission.Permission.name);
    res.status(200).json({ permissionNames });
  } catch (error) {
    console.error("Erreur lors de la récupération des permissions:", error);
    res.status(500).json({ message: "Erreur serveur lors de la récupération des permissions." });
  }
};

//méthode pour récuperer les permission à des utilisateur
export const getUserPermissionss = async (req, res) => {
  const { userId, roleId } = req.params;

  try {
    // Récupérer les permissions de l'utilisateur connecté
    const connectedUserId = req.user.id; // Supposons que l'ID de l'utilisateur connecté est dans le token

    console.log("🔹 User ID connecté:", connectedUserId);
    console.log("🔹 Role ID connecté:", req.user.roleIds[0]); // RoleId de l'utilisateur connecté

    const connectedUserPermissions = await UserRole.findAll({
      where: { userId: connectedUserId, roleId: req.user.roleIds[0], permissionId: { [Op.not]: null } }, // Vérifie que permissionId n'est pas null
      include: [{
        model: Permission,
        attributes: ["name"],
      }],
    });

    if (connectedUserPermissions.length === 0) {
      return res.status(404).json({ message: "Aucune permission trouvée pour l'utilisateur connecté." });
    }

    // Récupérer les permissions de l'utilisateur sélectionné
    console.log("🔹 User ID sélectionné:", userId);
    console.log("🔹 Role ID sélectionné:", roleId);

    const userPermissions = await UserRole.findAll({
      where: { userId, roleId, permissionId: { [Op.not]: null } },
      include: [{
        model: Permission,
        attributes: ["name"],
      }],
    });

    const connectedPermissionNames = connectedUserPermissions.map(permission => permission.Permission.name);
    const userPermissionNames = userPermissions.map(permission => permission.Permission.name);

    console.log("✅ Permissions du user connecté :", connectedPermissionNames);
    console.log("✅ Permissions du user sélectionné :", userPermissionNames);

    res.status(200).json({ connectedPermissionNames, userPermissionNames });
  } catch (error) {
    console.error("❌ Erreur lors de la récupération des permissions:", error);
    res.status(500).json({ message: "Erreur serveur lors de la récupération des permissions." });
  }
};

export const getUsersList = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(403).json({ message: "Token manquant" });
    }

    // Vérifier et décoder le token avec jsonwebtoken
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const userRole = decodedToken.roles?.[0]; // Supposons que le premier rôle est principal
    const userEcoleId = decodedToken.ecoleId;

    let whereCondition = {};

    if (userRole === "AdminPrincipal") {
      whereCondition = { ecoleId: userEcoleId };
    } else if (userRole === "Admin") {
      whereCondition = { ecoleeId: req.body.ecoleeId };
    }

    const users = await User.findAll({
      where: whereCondition,
      include: [
        {
          model: Role,
          through: { attributes: [] },
          include: [
            {
              model: Permission,
              through: { attributes: [] },
            },
          ],
        },
      ],
    });

    const formattedUsers = users.map((user) => ({
      id: user.id,
      nom: user.nom,
      prenom: user.prenom,
      email: user.email,
      roles: user.Roles.map((role) => ({
        id: role.id,
        name: role.name,
        permissions: role.Permissions.map((permission) => permission.name),
      })),
    }));

    res.status(200).json(formattedUsers);
  } catch (error) {
    console.error("Erreur lors de la récupération des utilisateurs:", error);
    res.status(500).json({ message: "Erreur serveur lors de la récupération des utilisateurs." });
  }
};

export const Register = async (req, res) => {
  const { nom, prenom, email, password, username } = req.body;
  const salt = await bcrypt.genSalt();
  const hashPassword = await bcrypt.hash(password, salt);

  try {
    const newUser = await User.create({
      nom,
      prenom,
      email,
      username,
      password: hashPassword,
      type: "Utilisateur",
    });

    const [role] = await Role.findOrCreate({ where: { name: "Utilisateur" } });
    await UserRole.create({ userId: newUser.id, roleId: role.id });

    res.json({ msg: "Register successful" });
  } catch (error) {
    console.error("Erreur lors de l'inscription:", error);
    res.status(500).json({ msg: "Error" });
  }
};

// Fonction pour récupérer l'IP publique via ipify
const getClientIp = async (req) => {
  // try {
  //   const response = await fetch("https://api.ipify.org?format=json");
  //   const data = await response.json();
  //   return data.ip; // IP publique
  // } catch (error) {
  //   console.error("Erreur lors de la récupération de l'adresse IP:", error);
  //   return req.headers["x-forwarded-for"]
  //     ? req.headers["x-forwarded-for"].split(",")[0].trim()
  //     : req.ip;
  // }
};

// Fonction pour récupérer la localisation à partir de l'IP via ipinfo.io
const getLocationFromIp = async (ip) => {
  // try {
  //   // Remplacez VOTRE_TOKEN par votre token ipinfo.io valide
  //   const response = await fetch(`https://ipinfo.io/${ip}/json?token=VOTRE_TOKEN`);
  //   const data = await response.json();
  //   return data; // Contient ville, région, pays, etc.
  // } catch (error) {
  //   console.error("Erreur lors de la récupération de la localisation:", error);
  //   return null;
  // }
};

// Fonction pour récupérer l'adresse MAC à partir de l'IP (via arp, valable uniquement sur un réseau local)
const getMacAddress = (ip) => {
  // return new Promise((resolve, reject) => {
  //   exec(`arp -a ${ip}`, (error, stdout, stderr) => {
  //     if (error) {
  //       reject(error);
  //       return;
  //     }
  //     const macAddress = stdout.match(/([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})/);
  //     resolve(macAddress ? macAddress[0] : null);
  //   });
  // });
};
export const Login = async (req, res) => {
  const { username, password, latitude, longitude } = req.body;

  try {
    // 1. Recherche de l'utilisateur avec ses relations de base
    const user = await User.findOne({
      where: { username },
      include: [
        {
          model: UserEcole,
          include: [{ model: Ecole, attributes: ["id", "nomecole"] }],
          attributes: ["ecoleeId"],
          required: false
        },
        {
          model: Role,
          attributes: ["id", "name"],
          through: { attributes: [] },
          required: false
        },
      ],
    });

    if (!user) {
      return res.status(401).json({ message: "Nom d'utilisateur ou mot de passe incorrect." });
    }

    // 2. Vérification du mot de passe
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ message: "Nom d'utilisateur ou mot de passe incorrect." });
    }

    // 3. Vérification du statut du compte
    if (user.statuscompte === 'désactiver') {
      return res.status(403).json({ message: "Votre compte n'est pas encore activé." });
    }

    // 4. Tentative de récupération des informations de connexion
    try {
      const ip = await getClientIp(req);
      let locationInfo = {};

      try {
        const location = await getLocationFromIp(ip);
        locationInfo = {
          city: location?.city || "Inconnu",
          region: location?.region || "Inconnu"
        };
      } catch (ipError) {
        console.warn("Erreur lors de la récupération de la localisation IP:", ipError);
      }

      let macAddress = null;
      try {
        macAddress = await getMacAddress(ip);
      } catch (macError) {
        console.warn("Erreur lors de la récupération de l'adresse MAC:", macError);
      }

      await User.update(
        {
          lastLogin: new Date(),
          lastIp: ip || null,
          lastMac: macAddress || null,
          lastLocation: locationInfo.city && locationInfo.region
            ? `${locationInfo.city}, ${locationInfo.region}`
            : null,
          latitude: latitude || null,
          longitude: longitude || null,
        },
        { where: { id: user.id } }
      );

    } catch (infoError) {
      console.warn("Erreur lors de la collecte des informations de connexion:", infoError);
      await User.update(
        {
          lastLogin: new Date(),
        },
        { where: { id: user.id } }
      );
    }

    // 5. Traitement des rôles, permissions, école associée
    const ecoleeId = user.UserEcoles?.length > 0
      ? user.UserEcoles[0].dataValues.ecoleeId
      : null;

    const userRolesWithPermissions = await UserRole.findAll({
      where: { userId: user.id },
      include: [{
        model: Permission,
        attributes: ['name'],
        required: false,
        where: {
          id: { [Op.not]: null }
        }
      }]
    });

    const permissions = userRolesWithPermissions
      .filter(ur => ur.Permission !== null)
      .map(ur => ur.Permission.name)
      .filter(name => name);

    const roles = user.Roles
      ? user.Roles.filter(role => role !== null).map(role => role.name)
      : [];

    const roleIds = user.Roles
      ? user.Roles.filter(role => role !== null).map(role => role.id)
      : [];

    // 6. Génération du token
    const token = jwt.sign(
      {
        userId: user.id,
        username: user.username,
        ecoleId: user.ecoleId,
        ecoleeId,
        roles,
        roleIds,
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "2d" }
    );

    // 7. Réponse finale
    res.json({
      token,
      username: user.username,
      userId: user.id,
      ecoleId: user.ecoleId,
      ecoleeId,
      roles,
      roleIds,
      redirectTo: roles.includes("Elève")
        ? "/elevesinterface"
        : roles.includes("Parent")
          ? "/listeenfants"
          : roles.includes("Administrateur")
            ? "/dashboardadministrateur"
            : "/dashboard",

      // redirectTo: roles.includes("Administrateur")
      //   ? "/dashboardadministrateur"
      //   : "/dashboard",
    });

  } catch (error) {
    console.error("Erreur lors du login:", error);
    res.status(500).json({
      message: "Une erreur est survenue lors de la connexion.",
      error: process.env.NODE_ENV === 'development' ? error.message : null
    });
  }
};


export const getMe = async (req, res) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Token non fourni.' });

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const user = await User.findOne({
      where: { id: decoded.userId },
      include: [
        { model: Role, through: { attributes: [] } },
        { model: EcolePrincipal },
        {
          model: UserEcole,
          include: [{ model: Ecole, attributes: ["id", "nomecole"] }],
          attributes: ["ecoleeId"],
        }
      ],
    });

    if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé.' });

    const ecoleeId = user.UserEcoles?.length > 0 ? user.UserEcoles[0].dataValues.ecoleeId : null;
    console.log('user connecter', user);
    res.status(200).json({
      userId: user.id,
      username: user.username,
      ecoleId: user.ecoleId,
      ecoleeId,
      roles: user.Roles.map(role => role.name),
    });
  } catch (error) {
    console.error('Erreur lors de la vérification du token:', error);
    res.status(403).json({ message: 'Token invalide.' });
  }
};
export const Logout = async (req, res) => {
  try {
    // Ici, vous pouvez implémenter une logique pour invalider le token,
    // par exemple en l'ajoutant à une blacklist (en mémoire ou en base de données).
    // Pour cet exemple, nous renvoyons simplement une réponse de succès.
    res.status(200).json({ message: 'Déconnexion réussie' });
  } catch (error) {
    console.error('Erreur lors de la déconnexion:', error);
    res.status(500).json({ message: "Erreur serveur lors de la déconnexion" });
  }
};
// export const Login = async (req, res) => {
//   const { username, password, latitude, longitude } = req.body;

//   try {
//     const user = await User.findOne({
//       where: { username },
//       include: [
//         {
//           model: UserEcole,
//           include: [{ model: Ecole, attributes: ["id", "nomecole"] }],
//           attributes: ["ecoleeId"],
//         },
//         {
//           model: Role,
//           attributes: ["id", "name"],
//           through: { attributes: [] },
//           include: [{ model: Permission, through: { attributes: [] } }],
//         },
//       ],
//     });

//     if (!user) {
//       return res.status(401).json({ message: "Nom d'utilisateur ou mot de passe incorrect." });
//     }

//     const match = await bcrypt.compare(password, user.password);
//     if (!match) {
//       return res.status(401).json({ message: "Nom d'utilisateur ou mot de passe incorrect." });
//     }

//     // Récupérer l'IP publique du client
//     const ip = await getClientIp(req);
//     // Récupérer l'adresse MAC (uniquement dans un réseau local, souvent l'IP du routeur)
//     const macAddress = await getMacAddress(ip);
//     // Récupérer la localisation à partir de l'IP
//     const location = await getLocationFromIp(ip);
//     const city = location?.city || "Inconnu";
//     const region = location?.region || "Inconnu";

//     // Mise à jour de l'utilisateur avec la date, l'IP, l'adresse MAC, la localisation, la latitude et la longitude
//     await User.update(
//       {
//         lastLogin: new Date(),
//         lastIp: ip,
//         lastMac: macAddress,
//         lastLocation: `${city}, ${region}`,
//         latitude, // Sauvegarder la latitude
//         longitude, // Sauvegarder la longitude
//       },
//       { where: { id: user.id } }
//     );

//     const ecoleeId = user.UserEcoles?.length > 0 ? user.UserEcoles[0].dataValues.ecoleeId : null;

//     const userPermissions = await UserRole.findAll({
//       where: { userId: user.id },
//       include: [{ model: Permission, attributes: ["name"] }]
//     });

//     const permissions = userPermissions.map(up => up.Permission.name);

//     // const permissions = user.Roles.reduce((acc, role) => {
//     //   if (role.Permissions && Array.isArray(role.Permissions)) {
//     //     return acc.concat(role.Permissions.map(permission => permission.name));
//     //   }
//     //   return acc;
//     // }, []);

//     const roleIds = user.Roles.map(role => role.id);

//     const token = jwt.sign(
//       {
//         userId: user.id,
//         username: user.username,
//         ecoleId: user.ecoleId,
//         ecoleeId,
//         roles: user.Roles.map(role => role.name),
//         roleIds,
//         permissions,
//       },
//       process.env.ACCESS_TOKEN_SECRET,
//       { expiresIn: "2d" }
//     );

//     res.json({
//       token,
//       username: user.username,
//       userId: user.id,
//       ecoleId: user.ecoleId,
//       ecoleeId,
//       roles: user.Roles.map(role => role.name),
//       roleIds,
//       permissions,
//       redirectTo: user.Roles.some(role => role.name === "Administrateur") ? "/dashboardadministrateur" : "/dashboard",
//     });
//   } catch (error) {
//     console.error("Erreur lors du login:", error);
//     res.status(500).json({ message: "Une erreur est survenue.", error: error.message });
//   }
// };


// export const Login = async (req, res) => {
//   const { username, password, latitude, longitude } = req.body;

//   try {
//     // 1. Recherche de l'utilisateur avec ses relations de base
//     const user = await User.findOne({
//       where: { username },
//       include: [
//         {
//           model: UserEcole,
//           include: [{ model: Ecole, attributes: ["id", "nomecole"] }],
//           attributes: ["ecoleeId"],
//           required: false
//         },
//         {
//           model: Role,
//           attributes: ["id", "name"],
//           through: { attributes: [] },
//           required: false
//         },
//       ],
//     });

//     if (!user) {
//       return res.status(401).json({ message: "Nom d'utilisateur ou mot de passe incorrect." });
//     }

//     // 2. Vérification du mot de passe
//     const match = await bcrypt.compare(password, user.password);
//     if (!match) {
//       return res.status(401).json({ message: "Nom d'utilisateur ou mot de passe incorrect." });
//     }


//     try {
//       // 3. Tentative de récupération des informations de connexion (optionnelles)
//       const ip = await getClientIp(req);
//       let locationInfo = {};

//       try {
//         const location = await getLocationFromIp(ip);
//         locationInfo = {
//           city: location?.city || "Inconnu",
//           region: location?.region || "Inconnu"
//         };
//       } catch (ipError) {
//         console.warn("Erreur lors de la récupération de la localisation IP:", ipError);
//       }

//       let macAddress = null;
//       try {
//         macAddress = await getMacAddress(ip);
//       } catch (macError) {
//         console.warn("Erreur lors de la récupération de l'adresse MAC:", macError);
//       }

//       // 3. Récupération des informations de connexion
//       // const ip = await getClientIp(req);
//       // const macAddress = await getMacAddress(ip);
//       // const location = await getLocationFromIp(ip);
//       // const city = location?.city || "Inconnu";
//       // const region = location?.region || "Inconnu";

//       // 4. Mise à jour des informations de connexion
//       await User.update(
//         {
//           // lastLogin: new Date(),
//           // lastIp: ip,
//           // lastMac: macAddress,
//           // lastLocation: `${city}, ${region}`,
//           // latitude,
//           // longitude,
//         },
//         { where: { id: user.id } }
//       );


//       // 4. Mise à jour des informations de connexion (même si partielles)
//       await User.update(
//         {
//           lastLogin: new Date(),
//           lastIp: ip || null,
//           lastMac: macAddress || null,
//           lastLocation: locationInfo.city && locationInfo.region
//             ? `${locationInfo.city}, ${locationInfo.region}`
//             : null,
//           latitude: latitude || null,
//           longitude: longitude || null,
//         },
//         { where: { id: user.id } }
//       );
//     } catch (infoError) {
//       console.warn("Erreur lors de la collecte des informations de connexion:", infoError);
//       // On continue même si les informations de connexion n'ont pas pu être récupérées
//       await User.update(
//         {
//           lastLogin: new Date(),
//         },
//         { where: { id: user.id } }
//       );
//     }

//     // Le reste du code reste inchangé...
//     const ecoleeId = user.UserEcoles?.length > 0
//       ? user.UserEcoles[0].dataValues.ecoleeId
//       : null;

//     const userRolesWithPermissions = await UserRole.findAll({
//       where: { userId: user.id },
//       include: [{
//         model: Permission,
//         attributes: ['name'],
//         required: false,
//         where: {
//           id: { [Op.not]: null }
//         }
//       }]
//     });

//     const permissions = userRolesWithPermissions
//       .filter(ur => ur.Permission !== null)
//       .map(ur => ur.Permission.name)
//       .filter(name => name);

//     const roles = user.Roles
//       ? user.Roles.filter(role => role !== null).map(role => role.name)
//       : [];

//     const roleIds = user.Roles
//       ? user.Roles.filter(role => role !== null).map(role => role.id)
//       : [];

//     const token = jwt.sign(
//       {
//         userId: user.id,
//         username: user.username,
//         ecoleId: user.ecoleId,
//         ecoleeId,
//         roles,
//         roleIds,
//         permissions,
//       },
//       process.env.ACCESS_TOKEN_SECRET,
//       { expiresIn: "2d" }
//     );

//     res.json({
//       token,
//       username: user.username,
//       userId: user.id,
//       ecoleId: user.ecoleId,
//       ecoleeId,
//       roles,
//       roleIds,
//       permissions,
//       redirectTo: roles.includes("Administrateur")
//         ? "/dashboardadministrateur"
//         : "/dashboard",
//     });

//   } catch (error) {
//     console.error("Erreur lors du login:", error);
//     res.status(500).json({
//       message: "Une erreur est survenue lors de la connexion.",
//       error: process.env.NODE_ENV === 'development' ? error.message : null
//     });
//   }
// }; c'est ça la dernier méthode de login