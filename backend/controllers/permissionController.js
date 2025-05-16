// controllers/permissionController.js
import UserRole from "../models/UserRole.js";
import Permission from "../models/Permission.js";
import { Op } from 'sequelize';


export const getUserPermissions = async (req, res) => {
  try {
    const { userId } = req.params;

    const userRolesWithPermissions = await UserRole.findAll({
      where: { userId },
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

    res.json({ permissions });
  } catch (error) {
    console.error("Erreur lors de la récupération des permissions:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};