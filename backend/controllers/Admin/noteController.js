import Note from '../../models/Admin/Note.js';
import Matiere from '../../models/Admin/Matiere.js';
import Anneescolaire from '../../models/Admin/Anneescolaires.js';
import Trimest from '../../models/Admin/Trimest.js';
import { Op } from 'sequelize';

// Sauvegarder les notes
export const saveNotes = async (req, res) => {
  const { notes, sectionId, cycle, annescolaireId, trimestId } = req.body;
  const enseignantId = req.user.id;

  try {
    const notesToSave = [];

    for (const eleveId in notes) {
      for (const matiereId in notes[eleveId]) {
        const matiereData = notes[eleveId][matiereId];

        const existingNote = await Note.findOne({
          where: {
            EleveId: eleveId,
            matiereId: matiereId,
            sectionId: sectionId,
            annescolaireId: annescolaireId,
            trimestId: trimestId
          }
        });

        const noteValues = {
          EleveId: eleveId,
          matiereId: parseInt(matiereId),
          enseignantId: enseignantId,
          sectionId: sectionId,
          annescolaireId: annescolaireId,
          trimestId: trimestId,
          cycle: cycle,
          remarque: matiereData.remarque || null,
          remarque_math: matiereData.remarque_math || null
        };

        // Remplissage des champs selon le cycle
        switch (cycle) {
          case 'Primaire':
            noteValues.expression_orale = matiereData.expression_orale || null;
            noteValues.lecture = matiereData.lecture || null;
            noteValues.production_ecrite = matiereData.production_ecrite || null;
            noteValues.moyenne_eval = matiereData.moyenne_eval || null;
            noteValues.examens = matiereData.examens || null;
            noteValues.moyenne = matiereData.moyenne || null;

            // Champs spécifiques aux mathématiques
            if (matiereData.calcul !== undefined) {
              noteValues.calcul = matiereData.calcul || null;
              noteValues.grandeurs_mesures = matiereData.grandeurs_mesures || null;
              noteValues.organisation_donnees = matiereData.organisation_donnees || null;
              noteValues.espace_geometrie = matiereData.espace_geometrie || null;
              noteValues.moyenne_eval_math = matiereData.moyenne_eval_math || null;
              noteValues.examens_math = matiereData.examens_math || null;
              noteValues.moyenne_math = matiereData.moyenne_math || null;
            }
            break;

          case 'Cem':
            noteValues.eval_continue = matiereData.eval_continue || null;
            noteValues.devoir1 = matiereData.devoir1 || null;
            noteValues.devoir2 = matiereData.devoir2 || null;
            noteValues.moyenne_eval = matiereData.moyenne_eval || null;
            noteValues.examens = matiereData.examens || null;
            noteValues.moyenne = matiereData.moyenne || null;
            noteValues.coefficient = matiereData.coefficient || null;
            noteValues.moyenne_total = matiereData.moyenne_total || null;
            break;

          case 'Lycée':
            noteValues.eval_continue = matiereData.eval_continue || null;
            noteValues.travaux_pratiques = matiereData.travaux_pratiques || null;
            noteValues.moyenne_devoirs = matiereData.moyenne_devoirs || null;
            noteValues.examens = matiereData.examens || null;
            noteValues.moyenne = matiereData.moyenne || null;
            noteValues.coefficient = matiereData.coefficient || null;
            noteValues.moyenne_total = matiereData.moyenne_total || null;
            break;
        }

        if (existingNote) {
          await existingNote.update(noteValues);
          notesToSave.push(existingNote);
        } else {
          const newNote = await Note.create(noteValues);
          notesToSave.push(newNote);
        }
      }
    }

    res.status(200).json({ success: true, message: 'Notes enregistrées', data: notesToSave });
  } catch (error) {
    console.error('Erreur sauvegarde notes:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur sauvegarde',
      error: error.message
    });
  }
};

// noteController.js (version corrigée)
export const saveNote = async (req, res) => {
  const { eleveId, matiereId } = req.params;
  const noteData = req.body;
  const enseignantId = req.user.id;

  try {
    // Convertir les champs vides en null pour les valeurs numériques
    const numericFields = [
      'moyenne', 'moyenne_eval', 'moyenne_math', 'moyenne_eval_math',
      'expression_orale', 'lecture', 'production_ecrite', 'examens',
      'calcul', 'grandeurs_mesures', 'organisation_donnees', 'espace_geometrie',
      'examens_math', 'coefficient'
    ];

    const cleanedData = { ...noteData };
    numericFields.forEach(field => {
      if (cleanedData[field] === '') {
        cleanedData[field] = null;
      }
    });

    const existingNote = await Note.findOne({
      where: {
        EleveId: eleveId,
        matiereId: matiereId,
        sectionId: cleanedData.sectionId,
        annescolaireId: cleanedData.annescolaireId,
        trimestId: cleanedData.trimestId
      }
    });

    const noteValues = {
      ...cleanedData,
      EleveId: eleveId,
      matiereId: matiereId,
      enseignantId: enseignantId,
      sectionId: cleanedData.sectionId,
      annescolaireId: cleanedData.annescolaireId,
      trimestId: cleanedData.trimestId,
      cycle: cleanedData.cycle,
      remarque: cleanedData.remarque || null,
      remarque_math: cleanedData.remarque_math || null,
      exemption: cleanedData.exemption || null
    };

    if (existingNote) {
      await existingNote.update(noteValues);
      res.status(200).json({ success: true, message: 'Note mise à jour', data: existingNote });
    } else {
      const newNote = await Note.create(noteValues);
      res.status(201).json({ success: true, message: 'Note créée', data: newNote });
    }
  } catch (error) {
    console.error('Erreur sauvegarde note:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur sauvegarde',
      error: error.errors?.map(e => e.message) || error.message
    });
  }
};
// Récupérer les notes pour une section et période donnée
export const getNotesBySection = async (req, res) => {
  try {
    const { sectionId } = req.params;
    const { annescolaireId, trimestId } = req.query;

    const whereClause = {
      sectionId,
      ...(annescolaireId && { annescolaireId }),
      ...(trimestId && { trimestId })
    };

    const notes = await Note.findAll({
      where: whereClause,
      include: [
        {
          model: Matiere,
          attributes: ['id', 'nom', 'nomarabe']
        },
        {
          model: Anneescolaire,
          attributes: ['id', 'datedebut', 'datefin']
        },
        {
          model: Trimest,
          attributes: ['id', 'titre']
        }
      ]
    });

    res.status(200).json(notes);
  } catch (error) {
    console.error('Erreur récupération notes:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};


// Mettre à jour l'exemption pour un élève dans une matière
export const updateExemption = async (req, res) => {
  try {
      const { eleveId, matiereId, sectionId, exemption } = req.body;
      
      const note = await Note.findOne({
          where: {
              EleveId: eleveId,
              matiereId: matiereId,
              sectionId: sectionId
          }
      });

      if (!note) {
          return res.status(404).json({ message: "Note non trouvée" });
      }

      note.exemption = exemption;
      await note.save();

      res.status(200).json({ message: "Exemption mise à jour avec succès" });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erreur serveur" });
  }
};

// Mettre à jour l'exemption pour tous les élèves dans une matière
export const bulkUpdateExemption = async (req, res) => {
  try {
      const { matiereId, sectionId, exemption } = req.body;
      
      await Note.update(
          { exemption: exemption },
          {
              where: {
                  matiereId: matiereId,
                  sectionId: sectionId
              }
          }
      );

      res.status(200).json({ message: "Exemptions mises à jour en masse avec succès" });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erreur serveur" });
  }
};