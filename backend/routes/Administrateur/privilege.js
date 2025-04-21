import express from 'express';
import { getUsersWithEcole } from '../../controllers/administrateur/privilegeController.js';
import UserRole from '../../models/UserRole.js';
import { verifyToken } from '../../middelware/VerifyToken.js';
import Permission from '../../models/Permission.js';

const router = express.Router();

router.get('/users-with-ecole', getUsersWithEcole);

router.get('/user/:userId/role', verifyToken, async (req, res) => {
  const { userId } = req.params;

  try {
    // Trouver le rôle de l'utilisateur
    const userRole = await UserRole.findOne({
      where: { userId },
      attributes: ['roleId'], // Récupérer uniquement le roleId
    });

    if (!userRole) {
      return res.status(404).json({ message: "Rôle non trouvé pour cet utilisateur" });
    }

    // Retourner le roleId
    res.status(200).json({ roleId: userRole.roleId });
  } catch (error) {
    console.error('Erreur lors de la récupération du rôle:', error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});
// routes/privilegeRoutes.js
router.get('/user/:userId/permissions', verifyToken, async (req, res) => {
  const { userId } = req.params;

  try {
    // Récupérer les permissions de l'utilisateur via UserRole
    const userPermissions = await UserRole.findAll({
      where: { userId },
      include: [
        {
          model: Permission,
          attributes: ['name'],
        },
      ],
    });

    // Formater les permissions pour le frontend
    const permissions = userPermissions
      .filter(up => up.Permission) // Filtrer ceux qui ont une Permission définie
      .map(up => ({
        name: up.Permission.name,
      }));


    res.status(200).json({ permissions });
  } catch (error) {
    console.error('Erreur lors de la récupération des permissions:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});
router.post('/save-permissions', verifyToken, async (req, res) => {
  const { userId, roleId, permissions } = req.body;

  try {
      if (!userId || !roleId) {
          return res.status(400).json({ message: "userId et roleId sont requis" });
      }

      const permissionRecords = await Promise.all(
          permissions.map(async (permission) => {
              const [permissionRecord] = await Permission.findOrCreate({
                  where: { name: permission.permissionId },
                  defaults: { name: permission.permissionId },
              });
              return permissionRecord;
          })
      );

      const newPermissionIds = permissionRecords.map(record => record.id);

      const existingUserPermissions = await UserRole.findAll({
          where: { userId, roleId }
      });

      const newPermissionsSet = new Set(newPermissionIds);

      for (const permissionId of newPermissionIds) {
          const existingRecord = existingUserPermissions.find(up => up.permissionId === permissionId);
          if (!existingRecord) {
              await UserRole.create({ userId, roleId, permissionId });
          }
      }

      for (const existingRecord of existingUserPermissions) {
          if (!newPermissionsSet.has(existingRecord.permissionId)) {
              await existingRecord.destroy();
          }
      }

      res.status(200).json({ message: "Permissions enregistrées avec succès" });
  } catch (error) {
      console.error("Erreur lors de l'enregistrement des permissions:", error);
      res.status(500).json({ message: "Erreur lors de l'enregistrement des permissions", error });
  }
});


router.post('/save-permission', verifyToken, async (req, res) => {
  const { userId, roleId, permissions } = req.body; // Inclure roleId dans la requête

  console.log('Données reçues du frontend:', { userId, roleId, permissions });

  try {
    if (!userId || !roleId) {
      return res.status(400).json({ message: "userId et roleId sont requis" });
    }

    // Si la liste des permissions est vide, renvoyer une erreur
    if (!permissions || permissions.length === 0) {
      return res.status(400).json({ message: "La liste des permissions ne peut pas être vide" });
    }

    // Récupérer ou créer les permissions dans la base de données
    const permissionRecords = await Promise.all(
      permissions.map(async (permission) => {
        const [permissionRecord] = await Permission.findOrCreate({
          where: { name: permission },
          defaults: { name: permission },
        });
        return permissionRecord;
      })
    );

    const newPermissionIds = permissionRecords.map(record => record.id);

    // Récupérer les permissions existantes pour cet utilisateur et ce rôle
    const existingUserPermissions = await UserRole.findAll({
      where: { userId, roleId }
    });

    const newPermissionsSet = new Set(newPermissionIds);

    // Pour chaque permission envoyée, mettre à jour ou insérer
    for (const permissionId of newPermissionIds) {
      const existingRecord = existingUserPermissions.find(up => up.permissionId === permissionId);
      if (!existingRecord) {
        await UserRole.create({ userId, roleId, permissionId }); // Associer userId, roleId et permissionId
      }
    }

    // Supprimer uniquement les permissions obsolètes
    for (const existingRecord of existingUserPermissions) {
      if (!newPermissionsSet.has(existingRecord.permissionId)) {
        await existingRecord.destroy();
      }
    }

    res.status(200).json({ message: "Permissions enregistrées avec succès" });
  } catch (error) {
    console.error("Erreur lors de l'enregistrement des permissions:", error);
    res.status(500).json({ message: "Erreur lors de l'enregistrement des permissions", error });
  }
});
export default router;
