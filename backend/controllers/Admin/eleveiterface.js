import User from "../../models/User.js";
import Eleve from "../../models/Admin/Eleve.js";
import EleveParent from "../../models/Admin/EleveParent.js";
import Niveaux from "../../models/Admin/Niveaux.js";
import Section from "../../models/Admin/Section.js";
import Parent from "../../models/Admin/Parent.js";
import Anneescolaire from "../../models/Admin/Anneescolaires.js";
import Trimest from "../../models/Admin/Trimest.js";
import Matiere from "../../models/Admin/Matiere.js";
import Note from '../../models/Admin/Note.js';
import MoyenneGenerale from '../../models/Admin/MoyenneGenerale.js'; 
import EmploiDuTemps from '../../models/Admin/EmploiDuTemps.js';
import Periode from '../../models/Admin/Periode.js';
import Cycle from '../../models/CycleScolaire.js';
import jwt from 'jsonwebtoken';

import sequelize from '../../config/Database.js'; // ou le chemin correct vers ton fichier de config sequelize
import { Sequelize } from 'sequelize';

export const getAnneesScolairesByEleve = async (req, res) => {
    try {
        const { eleveId } = req.params;

        // Authentifier l'élève
        const token = req.headers.authorization?.split(' ')[1];
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        if (decoded.userId !== parseInt(eleveId)) {
            return res.status(403).json({ message: "Accès interdit. Élève non autorisé." });
        }

        const annees = await MoyenneGenerale.findAll({
            where: { EleveId: eleveId },
            attributes: ['annescolaireId'],
            include: [{
                model: Anneescolaire,
                attributes: ['id', 'titre', 'datedebut', 'datefin']
            }],
            group: ['annescolaireId', 'Anneescolaire.id'],
            order: [[Sequelize.col('Anneescolaire.datedebut'), 'DESC']]
        });

        res.status(200).json(annees.map(a => a.Anneescolaire));
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur serveur." });
    }
};

export const getTrimestresByAnnee = async (req, res) => {
    try {
        const { eleveId, anneeId } = req.params;
        const { published } = req.query;

        const token = req.headers.authorization?.split(' ')[1];
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        if (decoded.userId !== parseInt(eleveId)) {
            return res.status(403).json({ message: "Accès interdit. Élève non autorisé." });
        }

        const where = {
            EleveId: eleveId,
            annescolaireId: anneeId
        };

        if (published === 'true') {
            where.status = true;
        }

        const trimestres = await MoyenneGenerale.findAll({
            where,
            include: [{
                model: Trimest,
                attributes: ['id', 'titre', 'dateDebut', 'dateFin']
            }],
            attributes: ['id', 'moyenne', 'trimestId', 'status'],
            order: [[Trimest, 'dateDebut', 'ASC']]
        });

        res.status(200).json(trimestres);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur serveur." });
    }
};

export const getNotesByTrimestre = async (req, res) => {
    try {
        const { eleveId, trimestreId } = req.params;
        const { published } = req.query;

        const token = req.headers.authorization?.split(' ')[1];
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        if (decoded.userId !== parseInt(eleveId)) {
            return res.status(403).json({ message: "Accès interdit. Élève non autorisé." });
        }

        const where = {
            EleveId: eleveId,
            trimestId: trimestreId
        };

        if (published === 'true') {
            const moyenneExists = await MoyenneGenerale.findOne({
                where: {
                    EleveId: eleveId,
                    trimestId: trimestreId,
                    status: true
                }
            });

            if (!moyenneExists) {
                return res.status(403).json({ message: "Les notes ne sont pas encore publiées." });
            }
        }

        const notes = await Note.findAll({
            where,
            include: [{
                model: Matiere,
                attributes: ['id', 'nom', 'nomarabe']
            }],
            attributes: { exclude: ['createdAt', 'updatedAt'] },
            order: [[Matiere, 'nom', 'ASC']]
        });

        res.status(200).json(notes);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur serveur." });
    }
};


export const getEmploiDuTempsEleve = async (req, res) => {
    const userId = req.params.userId;

    try {
        // Récupérer l'élève
        const eleve = await Eleve.findOne({ where: { userId } });
        if (!eleve) return res.status(404).json({ message: 'Élève non trouvé.' });

        const { niveauId, classeId, cycle } = eleve;

        // Obtenir ID du cycle
        const cycleRecord = await Cycle.findOne({ where: { nomCycle: cycle } });
        if (!cycleRecord) return res.status(404).json({ message: 'Cycle non trouvé.' });

        // Périodes du cycle (avec sous-périodes)
        const periodes = await Periode.findAll({
            where: { cycleId: cycleRecord.id },
            order: [['heureDebut', 'ASC']]
        });

        // Emploi du temps (matières avec infos)
        const emploi = await EmploiDuTemps.findAll({
            where: { niveauId, sectionId: classeId },
            include: [{ model: Matiere }]
        });

        // Organisation par jour et heure
        const emploiStructure = {};

        emploi.forEach(seance => {
            const jour = seance.jour;
            if (!emploiStructure[jour]) emploiStructure[jour] = [];

            emploiStructure[jour].push({
                id: seance.id,
                heure: seance.heure,
                duree: seance.duree,
                matiere: {
                    nom: seance.Matiere?.nom || 'Matière inconnue',
                    nomarabe: seance.Matiere?.nomarabe || 'مادة غير معروفة'
                },
                matiereId: seance.matiereId
            });
        });

        res.json({
            periodes: periodes.map(p => ({
                id: p.id,
                type: p.type,
                heureDebut: p.heureDebut,
                heureFin: p.heureFin,
                sousPeriodes: p.sousPeriodes,
                label: p.label
            })),
            emploi: emploiStructure
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur lors du chargement de l’emploi du temps.' });
    }
};

