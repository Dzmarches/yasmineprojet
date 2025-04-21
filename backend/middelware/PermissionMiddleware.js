import UserRole from '../models/UserRole.js'; // Importez le modèle UserRole
import Permission from '../models/Permission.js'; // Importez le modèle Permission

const checkPermission = (permissionName) => {
    return async (req, res, next) => {
        const userId = req.user.id;
        //console.log("🟢 ID de l'utilisateur :", userId);

        try {
            // Trouver la permission par son nom
            const permission = await Permission.findOne({ where: { name: permissionName } });

            if (!permission) {
                console.error("❌ Permission non trouvée :", permissionName);
                return res.status(404).json({ message: "Permission non trouvée" });
            }

            //console.log("✅ Permission trouvée :", permission.id);

            // Vérifier si l'utilisateur a cette permission via UserRole
            const hasPermission = await UserRole.findOne({
                where: {
                    userId,
                    permissionId: permission.id,
                },
            });

            if (!hasPermission) {
                console.error("❌ L'utilisateur n'a pas la permission :", permissionName);
                return res.status(403).json({ message: "Accès refusé" });
            }

            //console.log("✅ L'utilisateur a la permission :", permissionName);
            next();
        } catch (error) {
            console.error("❌ Erreur lors de la vérification des permissions :", error);
            res.status(500).json({ message: "Erreur lors de la vérification des permissions", error });
        }
    };
};

export default checkPermission;