import MoyenneGenerale from '../../models/Admin/MoyenneGenerale.js';


export const saveBulkMoyennesGenerales = async (req, res) => {
  const { annescolaireId, trimestId,niveauId, sectionId, eleves } = req.body;
  console.log('Received data:', { annescolaireId, trimestId,niveauId, sectionId, eleves });
  try {
    const results = [];
    const errors = [];
    const cycle = eleves[0]?.cycle || 'Primaire';
    
    console.log(`Processing ${eleves.length} students with cycle: ${cycle}`);

    for (const eleve of eleves) {
      try {
        console.log(`Processing student ${eleve.id} with moyenne ${eleve.moyenneGenerale}`);
        
        const existingMoyenne = await MoyenneGenerale.findOne({
          where: {
            EleveId: eleve.id,
            niveauId,
            sectionId,
            annescolaireId,
            trimestId
          }
        });

        const moyenneValues = {
          EleveId: eleve.id,
          niveauId,
          sectionId,
          annescolaireId,
          trimestId,
          cycle,
          moyenne: parseFloat(eleve.moyenneGenerale) || 0
        };

        console.log('Moyenne values:', moyenneValues);

        if (existingMoyenne) {
          const updated = await existingMoyenne.update(moyenneValues);
          console.log('Updated record:', updated.toJSON());
          results.push({ eleveId: eleve.id, action: 'updated', data: updated.toJSON() });
        } else {
          const newMoyenne = await MoyenneGenerale.create(moyenneValues);
          console.log('Created record:', newMoyenne.toJSON());
          results.push({ eleveId: eleve.id, action: 'created', data: newMoyenne.toJSON() });
        }
      } catch (error) {
        console.error(`Error processing student ${eleve.id}:`, error);
        errors.push({
          eleveId: eleve.id,
          error: error.message,
          stack: error.stack
        });
      }
    }

    res.status(200).json({
      success: true,
      message: 'Bulk operation completed',
      results,
      errors: errors.length ? errors : undefined
    });
  } catch (error) {
    console.error('Erreur sauvegarde moyenne générale en masse:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la sauvegarde en masse',
      error: error.message,
      stack: error.stack
    });
  }
};

// export const saveMoyenneGenerale = async (req, res) => {
//   // Validate eleveId exists in params
//   const { eleveId } = req.params;
//   if (!eleveId) {
//     return res.status(400).json({
//       success: false,
//       message: 'Eleve ID is required in URL parameters'
//     });
//   }

//   const data = req.body;

//   try {
//     // Convert empty numeric fields to null
//     const numericFields = ['moyenne'];
//     const cleanedData = { ...data };

//     numericFields.forEach(field => {
//       if (cleanedData[field] === '') {
//         cleanedData[field] = null;
//       }
//     });

//     // Validate required fields
//     if (!cleanedData.sectionId || !cleanedData.annescolaireId || !cleanedData.trimestId) {
//       return res.status(400).json({
//         success: false,
//         message: 'sectionId, annescolaireId, and trimestId are required'
//       });
//     }

//     const existingMoyenne = await MoyenneGenerale.findOne({
//       where: {
//         eleveId: eleveId, // Use consistent casing (lowercase e)
//         sectionId: cleanedData.sectionId,
//         annescolaireId: cleanedData.annescolaireId,
//         trimestId: cleanedData.trimestId
//       }
//     });

//     const moyenneValues = {
//       eleveId: eleveId, // Consistent casing
//       sectionId: cleanedData.sectionId,
//       annescolaireId: cleanedData.annescolaireId,
//       trimestId: cleanedData.trimestId,
//       cycle: cleanedData.cycle,
//       moyenne: cleanedData.moyenne
//     };

//     if (existingMoyenne) {
//       await existingMoyenne.update(moyenneValues);
//       res.status(200).json({ success: true, message: 'Moyenne mise à jour', data: existingMoyenne });
//     } else {
//       const newMoyenne = await MoyenneGenerale.create(moyenneValues);
//       res.status(201).json({ success: true, message: 'Moyenne créée', data: newMoyenne });
//     }
//   } catch (error) {
//     console.error('Erreur sauvegarde moyenne générale:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Erreur lors de la sauvegarde',
//       error: error.errors?.map(e => e.message) || error.message
//     });
//   }
// };
