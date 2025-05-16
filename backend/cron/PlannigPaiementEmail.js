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


const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
        user: process.env.SMTP_USER,  
        pass: process.env.SMTP_PASS   
    }
    
});
export const ListePlanning = async (req, res) => {
    try {
        const startOfDay = moment().tz('Africa/Algiers').startOf('day').toDate();
        const endOfDay = moment().tz('Africa/Algiers').endOf('day').toDate();
        const hps = await PlanningPaiement.findAll({
            where: {
                archiver: 0, etat_paiement: 'non payé',
                date_echeance: {
                    [Op.between]: [startOfDay, endOfDay]
                }
            },
            order: [['createdAt', 'DESC']],
            include: [
                {
                    model: Contrat,
                    attributes: ['id', 'code'],
                    where: { archiver: 0 },
                    include: [
                        {
                            model: Eleve,
                            attributes: ['id', 'fraixinscription', 'numinscription'],
                            include: [
                                {
                                    model: Niveaux,
                                    attributes: ['id', 'nomniveau', 'nomniveuarab', 'cycle']
                                },
                                {
                                    model: User,
                                    attributes: ['id', 'nom', 'prenom', 'datenaiss',
                                        'adresse', 'nom_ar', 'prenom_ar', 'lieuxnaiss', 'lieuxnaiss_ar', 'adresse', 'adresse_ar'],
                                    include: [
                                        {
                                            model: EcolePrincipal,
                                            attributes: ['nomecole', 'adresse', 'logo']
                                        }

                                    ]
                                },
                                {
                                    model: Parent,
                                    attributes: ['typerole', 'emailparent'],
                                    through: { attributes: [] },
                                    include: [
                                        {
                                            model: User,
                                            attributes: ['nom', 'prenom', 'email', 'telephone', 'adresse']
                                        }
                                    ]
                                },
                            ]
                        },
                        { model: Niveaux, attributes: ['id', 'nomniveau', 'cycle'] },
                        { model: Anneescolaire, attributes: ['id', 'datedebut', 'datefin'] },
                    ]
                },
            ],
        });
        res.status(200).json(hps);

    } catch (error) {
        console.error("Erreur lors de la récupération:", error);
        res.status(500).json({ message: "Erreur serveur" });
    }
};
// Définition de sleep (attente asynchrone)
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


cron.schedule('21 10 * * *', async () => {
    try {
        console.log('entrer')
        const now = moment().tz('Africa/Algiers').startOf('day');
        console.log('now', now);

        const dateLimite = now.clone().subtract(7, 'days');

        console.log('dateLimite', dateLimite);

        const plannings = await PlanningPaiement.findAll({
            where: {
                archiver: 0, etat_paiement: 'non payé', rappel_envoye: 0,
                date_echeance: {
                    [Op.lt]: dateLimite
                },
            },
            order: [['createdAt', 'DESC']],
            include: [
                {
                    model: Contrat,
                    attributes: ['id', 'code'],
                    where: { archiver: 0 },
                    include: [
                        {
                            model: Eleve,
                            attributes: ['id', 'fraixinscription', 'numinscription'],
                            include: [
                                {
                                    model: User,
                                    attributes: ['id', 'nom', 'prenom', 'datenaiss',
                                        'adresse', 'nom_ar', 'prenom_ar', 'lieuxnaiss', 'lieuxnaiss_ar', 'adresse', 'adresse_ar'],
                                    include: [
                                        {
                                            model: EcolePrincipal,
                                            attributes: ['nomecole', 'adresse', 'logo']
                                        }
                                    ]
                                },
                                {
                                    model: Parent,
                                    attributes: ['typerole', 'emailparent',],
                                    through: { attributes: [] },
                                    include: [
                                        {
                                            model: User,
                                            attributes: ['nom', 'prenom', 'email', 'telephone', 'adresse']
                                        }
                                    ]
                                },
                            ]
                        },
                        { model: Niveaux, attributes: ['id', 'nomniveau', 'cycle'] },
                        { model: Anneescolaire, attributes: ['id', 'datedebut', 'datefin'] },
                    ]
                },
            ],
        });
        for (const planning of plannings) {
            const eleve = planning.Contrat.Eleve;
            const parents = eleve.Parents;
            for (const parent of parents) {
                // const user = parent.User;
                const user = parent;
                if (user && user.User?.email) {
                    try {
                        await sendEmail(user.User?.email, eleve, planning, user); 
                        await planning.update({ rappel_envoye: 1 });
                        await sleep(2000);
                    } catch (err) {
                        console.error(`Erreur en envoyant à ${user.User?.email}`, err);
                    }
                }
            }
        }
        console.log('Rappels envoyés aux parents', plannings);
    } catch (error) {
        console.error('Erreur dans la tâche cron :', error);
    }
});

//fonction envoie selon les rappel
cron.schedule('34 09 * * *', async () => {
    // const now = moment().tz('Africa/Algiers');
    const startOfDay = moment().tz('Africa/Algiers').startOf('day');
    const endOfDay = moment().tz('Africa/Algiers').endOf('day');
    console.log('startOfDay', startOfDay)
    console.log('endOfDay', endOfDay)
    try {
        const plannings = await PlanningPaiement.findAll({
            where: {
                archiver: 0,
                etat_paiement: 'non payé',
                dateRappel: {
                    [Op.between]: [startOfDay, endOfDay]
                }
            },
            include: [
                {
                    model: Contrat,
                    include: [
                        {
                            model: Eleve,
                            attributes: ['id', 'fraixinscription', 'numinscription'],
                            include: [
                                {
                                    model: User,
                                    attributes: ['id', 'nom', 'prenom', 'datenaiss',
                                        'adresse', 'nom_ar', 'prenom_ar', 'lieuxnaiss', 'lieuxnaiss_ar', 'adresse', 'adresse_ar'],
                                    include: [
                                        {
                                            model: EcolePrincipal,
                                            attributes: ['nomecole', 'adresse', 'logo']
                                        }
                                    ]
                                },
                                {
                                    model: Parent,
                                    attributes: ['typerole', 'emailparent',],
                                    through: { attributes: [] },
                                    include: [
                                        {
                                            model: User,
                                            attributes: ['nom', 'prenom', 'email', 'telephone', 'adresse']
                                        }
                                    ]
                                },
                            ]
                        },
                        { model: Niveaux, attributes: ['id', 'nomniveau', 'cycle'] },
                        { model: Anneescolaire, attributes: ['id', 'datedebut', 'datefin'] },
                    ]
                }
            ]
        });
        for (const planning of plannings) {
            if (planning.dureRappel) {
                const nextReminder = moment(planning.dateRappel).add(planning.dureRappel, 'days');
                planning.dateRappel = nextReminder.toDate();
                await planning.save();
            }
            const eleve = planning.Contrat.Eleve;
            const parents = eleve.Parents;
            for (const parent of parents) {
                const user = parent;
                if (user && user.User?.email) {
                    await sendEmail(user.User?.email, eleve, planning, user);
                }
            }
        }
        console.log('📬 Rappels envoyés avec succès2');
    } catch (error) {
        console.error('❌ Erreur dans la tâche CRON de rappel :', error);
    }
});

// envoie des emails
// const transporter = nodemailer.createTransport({
//     host: 'smtp.gmail.com',
//     port: 587,
//     secure: false, // true si port 465
//     auth: {
//         user: 'devmail349@gmail.com',
//         pass: 'inyz dheu dbbi ihrn'
//     }
// });
// const transporter = nodemailer.createTransport({
//     host: 'smtp.gmail.com',
//     port: 465,
//     secure: true,
//     auth: {
//         user: 'devmail349@gmail.com',
//         pass: 'inyz dheu dbbi ihrn'
//     }
// });

async function sendEmail(email, eleve, planning, parent) {
    const mailOptions = {
        from: process.env.EMAIL_FROM || '"École" <no-reply@ecole.com>',
        to: email,
        // to: email.join(','),
        subject: `Rappel de paiement`,
        html: `  <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; border: 1px solid #e1e5eb; border-radius: 12px; padding: 25px; max-width: 650px; margin: auto; background-color: #ffffff; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
        <div style="text-align: center; margin-bottom: 20px;">
            <h5 style="color: #3a7bd5; margin: 0; font-size: 10px; font-weight: 600;">Rappel de paiement Code :${planning.codePP}</h5>
            <div style="height: 3px; width: 250px; background: linear-gradient(to right, #3a7bd5, #00d2ff); margin: 10px auto;"></div>
        </div>
        <div style="background-color: #f8fafc; padding: 15px; border-radius: 8px; border-left: 4px solid #3a7bd5; margin-bottom: 20px;">
           <p style="font-size: 13px; color: #4a4a4a; margin: 0; line-height: 1.6;">
            Bonjour,&nbsp;&nbsp;${parent?.User?.nom} ${parent?.User?.prenom}<br>
            Ceci est un rappel concernant le paiement de 
            <strong>${eleve.User?.nom} ${eleve.User?.prenom}</strong> 
            (<strong>Niveau : ${planning?.Contrat?.Niveaux?.nomniveau}</strong>, 
            <strong>Cycle : ${planning?.Contrat?.Niveaux?.cycle}</strong>).<br>
            Le paiement était attendu pour le <strong>${moment(planning?.date_echeance).format('DD-MM-YYYY')}</strong> 
            et n’a pas encore été effectué.<br>
        <div style="display: flex; justify-content: space-between; background-color: #f0f7ff; padding: 12px 20px; border-radius: 8px; margin-bottom: 25px;">
            <span style="font-size: 14px; color: #4a4a4a;">Montant à payer:</span>
            <span style="font-size: 14px; color:#e74c3c;">  ${planning?.montant_echeance} DA</span>
        </div>
        </div>
        <hr style="border: none; border-top: 1px dashed #e1e5eb; margin: 25px 0;">
        <p style="font-size: 12px; color:rgb(141, 150, 158); line-height: 1.6; margin-bottom: 20px;">
            Merci de bien vouloir régulariser cette situation dans les meilleurs délais.<br>
            Pour toute question, n'hésitez pas à nous contacter.
        </p>
        <div style="text-align: center; margin-top: 25px;">
            <p style="font-size: 12px; color: #6c757d; margin-bottom: 5px;">Cordialement,</p>
            <p style="font-size: 12px; color: #3a7bd5; margin: 0;">École ${eleve.User?.EcolePrincipal?.nomecole}</p>
        </div>
    </div>`

        };
    try {
        await transporter.sendMail(mailOptions);
        console.log(`✅ Email envoyé à ${email}`);
    } catch (err) {
        console.error(`❌ Échec envoi email à ${email}`, err);
    }
}
