// routes/index.js ou votre fichier de routes principal
import express from "express";
import { Login, Register, getMe, Logout } from "../controllers/User.js";
import { verifyToken } from "../middelware/VerifyToken.js";
import ecoleRoutes from './EcoleRoutes.js';
import EcolesRoute from './EcolesRoute.js';
import EleveRoutes from './Admin/EleveRoutes.js';
import privilegeRoutes from './Administrateur/privilege.js';
import NiveauRoutes from './Admin/NiveauRoutes.js';
import MatiereRoutes from './Admin/MatiereRoutes.js';
import SallesRoute from './Admin/SalleRoutes.js';
import SectionRoute from './Admin/SectionRoutes.js';
import TrimestRoute from './Admin/TrimestRoutes.js';
import UserPermissionRoutes from './Administrateur/UserPermissionRoutes.js';
import EnseignantRoutes from './Admin/EnseignantRoutes.js';
import EnseignantClasseRoutes from './Admin/EnseignantClassesRoutes.js';
import RoleRoute from './RoleRoute.js';
import cycleScolaireRoutes from './Administrateur/CycleScolaireRoutes.js';
import ParentRoutes from './Admin/ParentRoutes.js';

import PresenceRoutes from './Admin/presenceRoutes.js';
import periodeRoutes from './Admin/periodeRoutes.js';
import emploiDuTempsRoutes from './Admin/emploiDuTempsRoutes.js';
import periodenotesRoute from './Admin/periodeNoteRoutes.js';
import noteRoute from './Admin/NoteRoute.js';
import anneeScolaireRoutes from './Admin/AnnéeScolaireRoutes.js';

import moyenneGeneraleRoutes from './Admin/moyenneGeneraleRoutes.js';

import path from 'path';
import { fileURLToPath } from 'url';

// Obtenez __dirname à partir de import.meta.url
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Servir les fichiers statiques du dossier public/images/Ecole
app.use('/images/Ecole', express.static(path.join(__dirname, '../public/images/Ecole')));
app.use('/images/Eleve', express.static(path.join(__dirname, '../public/images/Eleve')));
app.use('/images', express.static(path.join(__dirname, '../public/images')));

// Middleware pour sécuriser toutes les routes sauf /Login et /Register
app.use((req, res, next) => {
  if (req.path === '/Login' || req.path === '/Register') {
    return next();
  }
  verifyToken(req, res, next);
});

// Routes publiques
app.post('/Login', Login);
app.post('/Register', Register);
app.get('/getMe', getMe);

app.get('/dashboard', verifyToken, (req, res) => {
  res.json({ message: "Accès autorisé au tableau de bord" });
});



// Ajoutez la route de déconnexion protégée
app.post('/logout', verifyToken, Logout);

// Autres routes
app.use('/ecole', ecoleRoutes);
app.use('/ecoles', EcolesRoute);
app.use('/eleves', EleveRoutes);
app.use('/parents', ParentRoutes);
app.use('/niveaux', NiveauRoutes);
app.use('/matieres', MatiereRoutes);
app.use('/sections', SectionRoute);
app.use('/salles', SallesRoute);
app.use('/trimest', TrimestRoute);
app.use('/api', privilegeRoutes);
app.use('/apii', UserPermissionRoutes);
app.use('/enseignant',EnseignantRoutes);
app.use('/listClasse',EnseignantClasseRoutes);
app.use('/roles', RoleRoute);
app.use('/cyclescolaires', cycleScolaireRoutes);
app.use('/presences',PresenceRoutes);
app.use('/periodes', periodeRoutes);
app.use('/emploi-du-temps',emploiDuTempsRoutes );
app.use('/periodenotes', periodenotesRoute);
app.use('/notes',noteRoute);
app.use('/anneescolaire', anneeScolaireRoutes);
app.use('/moyenne', moyenneGeneraleRoutes);

export default app;
