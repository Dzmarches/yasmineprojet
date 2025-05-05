import PeriodeNote from '../../models/Admin/periodenote.js';
import { Op } from 'sequelize';

// Vérifier les périodes expirées avant chaque opération
const checkExpiredPeriods = async () => {
    await PeriodeNote.checkAndUpdateExpiredPeriods();
};

// Créer ou mettre à jour une période de note
export const createOrUpdatePeriodeNote = async (req, res) => {
    try {
        await checkExpiredPeriods();
        
        const { status, dateDebutPeriode, dateFinPeriode, ecoleId, ecoleeId } = req.body;

        const whereCondition = ecoleId 
            ? { ecoleId } 
            : ecoleeId 
                ? { ecoleeId } 
                : {};

        if (!ecoleId && !ecoleeId) {
            return res.status(400).json({ message: 'ecoleId ou ecoleeId est requis' });
        }

        const existingPeriode = await PeriodeNote.findOne({ where: whereCondition });

        let periode;
        if (existingPeriode) {
            // Mise à jour intelligente des dates
            const updateData = {
                status,
                dateDebutPeriode: status ? dateDebutPeriode || existingPeriode.dateDebutPeriode : null,
                dateFinPeriode: status ? dateFinPeriode || existingPeriode.dateFinPeriode : null
            };
            
            periode = await existingPeriode.update(updateData);
        } else {
            // Création seulement si nécessaire
            periode = await PeriodeNote.create({
                status,
                dateDebutPeriode: status ? dateDebutPeriode : null,
                dateFinPeriode: status ? dateFinPeriode : null,
                ...whereCondition
            });
        }

        res.status(200).json(periode);
    } catch (error) {
        console.error('Erreur lors de la mise à jour:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

// Récupérer la période de note
export const getPeriodeNote = async (req, res) => {
    try {
        await checkExpiredPeriods();
        
        const { ecoleId, ecoleeId } = req.params;

        const whereCondition = ecoleId && ecoleId !== '0' 
            ? { ecoleId } 
            : ecoleeId && ecoleeId !== '0' 
                ? { ecoleeId } 
                : {};

        if (!whereCondition.ecoleId && !whereCondition.ecoleeId) {
            return res.status(400).json({ message: 'ecoleId ou ecoleeId est requis' });
        }

        const periode = await PeriodeNote.findOne({ where: whereCondition });

        res.status(200).json(periode || { status: false });
    } catch (error) {
        console.error('Erreur lors de la récupération de la période:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

export const getPeriodeNoteStatus = async (req, res) => {
    try {
        await checkExpiredPeriods();
        
        const { ecoleId, ecoleeId } = req.params;

        const whereCondition = {};
        
        if (ecoleId && ecoleId !== '0') {
            whereCondition.ecoleId = ecoleId;
        } else if (ecoleeId && ecoleeId !== '0') {
            whereCondition.ecoleeId = ecoleeId;
        } else {
            return res.status(400).json({ 
                message: "Either ecoleId or ecoleeId must be provided" 
            });
        }

        const periodeNote = await PeriodeNote.findOne({ 
            where: whereCondition 
        });

        if (!periodeNote) {
            return res.status(200).json({ 
                status: false,
                message: "No period configuration found"
            });
        }

        res.status(200).json({
            status: periodeNote.status,
            dateDebutPeriode: periodeNote.dateDebutPeriode,
            dateFinPeriode: periodeNote.dateFinPeriode
        });

    } catch (error) {
        console.error("Error fetching periode note status:", error);
        res.status(500).json({ 
            message: "Error fetching period status",
            error: error.message 
        });
    }
};

// Optionnel: Ajouter un cron job pour vérifier périodiquement les périodes expirées
import cron from 'node-cron';

// Vérifier toutes les heures
cron.schedule('0 * * * *', () => {
    PeriodeNote.checkAndUpdateExpiredPeriods();
    console.log('Vérification des périodes expirées effectuée');
});