import db from "./config/Database.js";
import User from "./models/User.js";
import Role from "./models/Role.js";
import UserRole from "./models/UserRole.js";
import Ecole from "./models/Ecole.js"; // Si vous avez un modèle Ecole
import Poste from '../models/RH/poste.js';
import Service from '../models/RH/service.js';
import Employe from '../models/RH/employe.js';
import Pointage from '../models/RH/pointage.js';
// Synchroniser les modèles avec la base de données

const syncDatabase = async () => {
    try {
        // Authentifier la connexion à la base de données
        await db.authenticate();
        console.log("Connection to the database has been established successfully.");

        // Synchroniser les modèles
        await db.sync({ force: true }); // `force: true` efface et recrée les tables
        console.log("All tables have been created successfully.");
    } catch (error) {
        console.error("Unable to sync the database:", error);
    }
};

// Exécuter la synchronisation
syncDatabase();