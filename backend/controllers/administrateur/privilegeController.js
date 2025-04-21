import { User, EcolePrincipal } from '../../models/relations.js';
import { Op } from 'sequelize'; // Importez Op pour les opérations de requête

export const getUsersWithEcole = async (req, res) => {
    try {
        // Récupérer les utilisateurs avec ecoleId non null et type = 'AdminPrincipal'
        const usersWithEcole = await User.findAll({
            where: {
                [Op.and]: [ // Utilisez Op.and pour combiner plusieurs conditions
                    { ecoleId: { [Op.not]: null } }, // ecoleId n'est pas null
                    { type: 'AdminPrincipal' } // type est 'AdminPrincipal'
                ]
            },
            include: [{
                model: EcolePrincipal, // Incluez le modèle EcolePrincipal
                as: 'EcolePrincipal' // Assurez-vous que l'alias correspond à votre relation
            }]
        });

        // Renvoyer les résultats
        res.status(200).json({ usersWithEcole });
    } catch (error) {
        console.error('Erreur dans getUsersWithEcole:', error); // Log l'erreur pour le débogage
        res.status(500).json({ message: error.message });
    }
};

