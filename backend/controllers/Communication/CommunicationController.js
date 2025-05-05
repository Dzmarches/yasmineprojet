import db from '../../config/Database.js'; 
import nodemailer from 'nodemailer';
import { Op } from 'sequelize';
import Eleve from '../../models/Admin/Eleve.js';
import Parent from '../../models/Admin/Parent.js';

// Configuration du transporteur email (à adapter selon votre configuration SMTP)
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: process.env.SMTP_SECURE === 'true', // true pour 465, false pour autres ports
    auth: {
        user: process.env.SMTP_USER,  // Assurez-vous que la variable d'environnement est correcte
        pass: process.env.SMTP_PASS   // Assurez-vous que la variable d'environnement est correcte
    }
    
});

export const sendEmailsToStudents = async (req, res) => {
    try {
        const { eleveIds, subject, message } = req.body;

        // Récupérer les élèves avec leurs parents et emails
        const eleves = await Eleve.findAll({
            where: { id: { [Op.in]: eleveIds } },
            include: [{
                model: Parent,
                as: 'Parents',
                attributes: ['emailparent'],
                through: { attributes: [] },
            }],
            logging: console.log // Add this to see the generated SQL
        });

        // Envoyer un email à chaque parent
        const sendEmailPromises = eleves.map(eleve => {
            // Récupérer les emails des parents associés à l'élève
            const parentEmails = eleve.Parents.map(parent => parent.emailparent).filter(email => email);

            // Si aucun parent n'a d'email, ignorer cet élève
            if (parentEmails.length === 0) {
                console.warn(`Aucun email trouvé pour l'élève ${eleve.id}`);
                return Promise.resolve();
            }

            // Configuration de l'email
            const mailOptions = {
                from: process.env.EMAIL_FROM || '"École" <no-reply@ecole.com>',
                to: parentEmails.join(','), // Envoyer à tous les parents
                subject: subject,
                html: `
                    <p>Bonjour,</p>
                    <p>${message}</p>
                    <p>Cordialement,<br>L'équipe pédagogique</p>
                `
            };

            return transporter.sendMail(mailOptions);
        });

        await Promise.all(sendEmailPromises);

        res.status(200).json({
            success: true,
            message: `Emails envoyés aux parents de ${eleves.length} élèves`
        });
    } catch (error) {
        console.error('Erreur lors de l\'envoi des emails:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de l\'envoi des emails',
            error: error.message
        });
    }
};
