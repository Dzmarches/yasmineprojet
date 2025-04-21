import Note from '../../models/Admin/Note.js';
import Matiere from '../../models/Admin/Matiere.js';
import { Op } from 'sequelize';

// Sauvegarder les notes
export const saveNotes = async (req, res) => {
    const { notes, sectionId, cycle } = req.body;
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
            }
          });
  
          const noteValues = {
            EleveId: eleveId,
            matiereId: parseInt(matiereId),
            enseignantId: enseignantId,
            sectionId: sectionId,
            cycle: cycle,
            remarque: matiereData.remarque || null
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
      res.status(500).json({ success: false, message: 'Erreur sauvegarde', error: error.message });
    }
  };

  // noteController.js (version corrigée)
export const saveNote = async (req, res) => {
  const { eleveId, matiereId } = req.params;
  const noteData = req.body;
  
  try {
      const existingNote = await Note.findOne({
          where: {
              EleveId: eleveId,
              matiereId: matiereId,
              sectionId: noteData.sectionId
          }
      });

      const noteValues = {
          ...noteData,
          EleveId: eleveId,
          matiereId: matiereId,
          enseignantId: noteData.enseignantId,
          sectionId: noteData.sectionId,
          cycle: noteData.cycle
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
        
        const notes = await Note.findAll({
            where: { sectionId },
            include: [
                {
                    model: Matiere,
                    attributes: ['id', 'nom', 'nomarabe']
                }
            ]
        });

        res.status(200).json(notes);
    } catch (error) {
        console.error('Erreur récupération notes:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};