// server.js
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import db from "./config/Database.js";
import router from "./routes/index.js";
import PeriodeNote from "./models/Admin/periodenote.js";
import Note from "./models/Admin/Note.js";
// import EcolePrincipal from "./models/EcolePrincipal.js";
// import Ecole from "./models/Ecole.js";
// import User from "./models/User.js";
// import Role from "./models/Role.js";
// import UserRole from "./models/UserRole.js";
// import UserEcole from "./models/UserEcole.js";
// import CycleScolaire from "./models/CycleScolaire.js";
// import Parent from "./models/Parent.js";
// import Eleve from "./models/Eleve.js";
// import EleveParent from "./models/EleveParent.js";
// import Enseignant from "./models/Enseignant.js";
import  './models/relations.js';
// import attestationRoute from './routes/attestationRoute.js';
// import justificationsRoute from './routes/justificationsRoute.js';
import congeAsence from './routes/RH/congeAbsenceRoute.js';
import employeRoute from'./routes/RH/employeRoute.js';
import pointageRoute from'./routes/RH/pointageRoute.js';
import posteRoute from './routes/RH/posteRoute.js';
import serviceRoute from './routes/RH/serviceRoute.js';
import  justificationsRoute from './routes/justificationsRoute.js';
import  attestationRoute from './routes/attestationRoute.js';
import  IRGRoute from './routes/RH/paie/IRGRoute.js';
import primeRoute from './routes/RH/paie/primeRoute.js';
import periodesPaieRoute from './routes/RH/paie/periodePaieRoute.js';
import BultteinsPaieRoute from './routes/RH/paie/BultteinsPaieRoute.js';
import HeureSupRoute from './routes/RH/HeureSupRoute.js';
import ParametreRetard from './routes/RH/paie/ParametreRetardRoute.js';
import joursferies from './routes/RH/paie/JourFeries.js';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs'
import Typerevenus from './routes/comptabilite/TypeRevenueRoute.js'
import Typedepenses from './routes/comptabilite/TypeDepenseRoute.js'
import depensesRoute from './routes/comptabilite/DepensesRoute.js'
import revenusRoute from './routes/comptabilite/RevenusRoute.js'
import ContratRoute from './routes/comptabilite/paimentEleve/ContratRoute.js'
import PlanningPaiementR from './routes/comptabilite/paimentEleve/PlanningPaiementR.js'
// import './cron/absenceFinJournee.js'


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename)

dotenv.config();
const app = express();



app.use(express.urlencoded({ extended: true }));
// app.use(cors({ credentials: true, origin: ['http://localhost:5173'] }));
app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use('/justifications',justificationsRoute)
app.use('/images/employes', express.static(path.join(__dirname, 'public/images/employes')));
app.use('/justifications/modeles/images', express.static(path.join(__dirname, 'public/justifications/modeles/images')));
app.use("/attestations/modeles/images", express.static(path.join(__dirname, "public/attestations/modeles/images")));
app.use(`/conges/employes`, express.static(path.join(__dirname, `public/conges/employes`)));
app.use(`/revenus`, express.static(path.join(__dirname, `public/revenus`)));
app.use(`/depenses`, express.static(path.join(__dirname, `public/depenses`)));

app.use(router);

import { verifyToken } from "./middelware/VerifyToken.js";
app.use((req, res, next) => {
  verifyToken(req, res, next);
});

// app.get('/images/employes/:imageName', verifyToken, (req, res) => {
//   const imageName = req.params.imageName;
//   const imagePath = path.join(__dirname, './public/images/employes', imageName);
//   if (!fs.existsSync(imagePath)) {
//       return res.status(404).json({ message: "Image non trouvée" });
//   }
//   res.sendFile(imagePath);
// });

app.use('/employes', employeRoute);
app.use('/services', serviceRoute);
app.use('/postes', posteRoute);
app.use('/pointage', pointageRoute);
app.use('/congeAbsence',congeAsence);
app.use('/PeriodePaie',periodesPaieRoute);
app.use('/primes',primeRoute);
app.use('/IRG',IRGRoute);
app.use('/BultteinPaie',BultteinsPaieRoute);
app.use('/HeureSup',HeureSupRoute);
app.use('/attestation',attestationRoute);
app.use('/ParametreRetard',ParametreRetard);
app.use('/joursferies',joursferies);
app.use('/Typerevenus',Typerevenus);
app.use('/Typedepenses',Typedepenses);
app.use('/revenus',revenusRoute);
app.use('/depenses',depensesRoute);
app.use('/contrat',ContratRoute);
app.use('/PlanningPaiement',PlanningPaiementR);

export const syncDatabase = async () => {
  try {
    await db.sync();
    console.log('✅ Toutes les tables ont été synchronisées');
  } catch (error) {
    console.error('❌ Erreur lors de la synchronisation de la base de données :', error);
    throw error;
  }
};


const startServer = async () => {
  await syncDatabase();
  app.listen(5000, () => console.log('Server running at port 5000'));
};

startServer();
