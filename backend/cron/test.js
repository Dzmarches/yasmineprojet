import EcolePrincipal from '../models/EcolePrincipal.js';
import TypeRevenue from '../models/comptabilite/TypeRevenue.js';
import Ecole from '../models/Admin/Ecole.js';
import Eleve from '../models/Admin/Eleve.js';
import PlanningPaiement from '../models/comptabilite/PaimentEtudiant/PlanningPaiement.js';
import sequelize from '../config/Database.js';
import UserEcole from '../models/Admin/UserEcole.js';
import Parent from '../models/Admin/Parent.js';
import { Op } from 'sequelize';
import Contrat from '../models/comptabilite/PaimentEtudiant/Contrat.js';
import Niveaux from '../models/Admin/Niveaux.js';
import Anneescolaire from '../models/Admin/Anneescolaires.js';
import User from '../models/User.js';
import cron from 'node-cron'
import moment from 'moment-timezone';
import nodemailer from 'nodemailer';
// npm install node-cron nodemailer moment-timezone




// Fonction pour temporiser entre les mails
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Création du transporteur mail
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Fonction d'envoi de mail
async function sendEmail(email, eleve, planning, parent) {
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; padding: 20px;">
      <h3 style="color: #2c3e50;">Rappel de paiement</h3>
      <p>Bonjour <strong>${parent.nom_complet}</strong>,</p>
      <p>Nous vous rappelons que le paiement suivant pour votre enfant <strong>${eleve.nom} ${eleve.prenom}</strong> est en attente :</p>
      <ul>
        <li><strong>Montant :</strong> ${planning.montant} DA</li>
        <li><strong>Échéance :</strong> ${moment(planning.date_echeance).format('DD/MM/YYYY')}</li>
        <li><strong>Niveau :</strong> ${eleve.niveau.nom}</li>
        <li><strong>École :</strong> ${eleve.ecole.nom}</li>
      </ul>
      <p>Merci de régulariser la situation dans les plus brefs délais.</p>
      <p style="color: #7f8c8d;">Ceci est un message automatique. Veuillez ne pas y répondre.</p>
    </div>
  `;

  await transporter.sendMail({
    from: `"Administration" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Rappel de Paiement',
    html: htmlContent
  });
}

// Rappel des paiements échus depuis 7 jours (1 fois)
cron.schedule('37 10 * * *', async () => {
    console.log('rrerre')
  const today = moment().tz('Africa/Algiers');
  const limitDate = today.clone().subtract(7, 'days').format('YYYY-MM-DD');

  const paiements = await PlanningPaiement.findAll({
    where: {
      etat: 'non payé',
      rappel_envoye: false,
      date_echeance: { [Op.lte]: limitDate }
    },
    include: [Eleve]
  });

  for (const p of paiements) {
    const eleve = await Eleve.findByPk(p.eleveId, {
      include: [Niveaux, Ecole, Parent]
    });
    const email = eleve.Parent?.email;

    if (email) {
      await sendEmail(email, eleve, p, eleve.Parent);
      p.rappel_envoye = true;
      await p.save();
      await sleep(2000); // Pause pour éviter le spam SMTP
    }
  }

  console.log(`[RAPPEL 7J] ${paiements.length} rappels envoyés.`);
});

// Rappel régulier (tous les X jours)
cron.schedule('36 09 * * *', async () => {
  const today = moment().tz('Africa/Algiers').format('YYYY-MM-DD');

  const paiements = await PlanningPaiement.findAll({
    where: {
      etat: 'non payé',
      dateRappel: today
    },
    include: [Eleve]
  });

  for (const p of paiements) {
    const eleve = await Eleve.findByPk(p.eleveId, {
      include: [Niveaux, Ecole, Parent]
    });
    const email = eleve.Parent?.email;

    if (email) {
      await sendEmail(email, eleve, p, eleve.Parent);

      const duree = p.dureRappel || 7;
      const prochaineDate = moment(today).add(duree, 'days').format('YYYY-MM-DD');
      p.dateRappel = prochaineDate;
      await p.save();
      await sleep(2000);
    }
  }

  console.log(`[RAPPEL régulier] ${paiements.length} rappels envoyés.`);
});
