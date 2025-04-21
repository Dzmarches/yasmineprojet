import express from 'express';
// import { EnseignantClasse, Section, Eleve, User } from '../models/index.js';
import EnseignantClasse from '../../models/Admin/EnseignantClasse.js';
import Section from '../../models/Admin/Section.js';
import Eleve from '../../models/Admin/Eleve.js';
import User from '../../models/User.js';
import Matiere from '../../models/Admin/Matiere.js';
import Enseignant from '../../models/Admin/Enseignant.js';
import Employe from '../../models/RH/employe.js';

const router = express.Router();

// Route pour récupérer les classes d'un enseignant
router.get('/enseignant/:enseignantId/classes', async (req, res) => {
  const { enseignantId } = req.params;
  try {
    const classes = await EnseignantClasse.findAll({
      where: { enseignantId },
      include: [{ model: Section, attributes: ['id', 'classe'] }],
    });
    res.json({ classes }); // Renvoyer les classes sous forme de tableau
  } catch (error) {
    console.error('Erreur lors de la récupération des classes:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Route pour récupérer les élèves d'une classe
router.get('/classe/:classeId/eleves', async (req, res) => {
  const { classeId } = req.params;
  try {
    const eleves = await Eleve.findAll({
      where: { classeId },
      include: [{ model: User, attributes: ['nom', 'prenom', 'email', 'telephone'] }],
    });
    res.json(eleves); // Renvoyer les élèves sous forme de tableau
  } catch (error) {
    console.error('Erreur lors de la récupération des élèves:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});


// routes/enseignant.js

// Récupérer les matières d'un enseignant pour une section donnée
router.get('/enseignants/:enseignantId/sections/:sectionId/matieres', async (req, res) => {
  try {
    const { enseignantId, sectionId } = req.params;

    const matieres = await EnseignantClasse.findAll({
      where: {
        enseignantId,
        classeId: sectionId
      },
      include: [
        {
          model: Matiere,
          attributes: ['id', 'nom', 'nomarabe']
        }
      ],
      attributes: []
    });

    // Extraire uniquement les matières
    const matieresEnseignant = matieres.map(item => item.Matiere);

    res.status(200).json(matieresEnseignant);
  } catch (error) {
    console.error("Erreur lors de la récupération des matières:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// Dans votre backend (routes/enseignantClasse.js)
router.get('/:niveauId/:sectionId', async (req, res) => {
  try {
    const { niveauId, sectionId } = req.params;

    const result = await EnseignantClasse.findAll({
      where: {
        niveauId,
        classeId: sectionId
      },
      include: [
        {
          model: Enseignant,
          include: [
            {
              model: Employe,
              include: [
                {
                  model: User,
                  attributes: ['id', 'nom', 'prenom']
                }
              ]
            }
          ]
        },
        {
          model: Matiere
        }
      ]
    });

    res.json(result);
  } catch (error) {
    console.error('Erreur:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});
export default router;