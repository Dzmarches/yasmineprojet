import express from 'express';
import { getNiveaux, createNiveau, updateNiveau, deleteNiveau,getNiveauById , getNiveauxByCycle,
  getNiveauxWithSectionsByCycle
} from '../../controllers/Admin/NiveauController.js';
import NiveauxMatieres from '../../models/Admin/NiveauxMatieres.js';
import Matiere from '../../models/Admin/Matiere.js';
import Enseignant from '../../models/Admin/Enseignant.js';


const router = express.Router();

// Définir les routes pour les niveaux
router.get('/', getNiveaux); // Récupérer tous les niveaux
router.post('/', createNiveau); // Ajouter un niveau
router.get('/:id', getNiveauById);
router.put('/modifier/:id', updateNiveau); // Modifier un niveau
router.delete('/:id', deleteNiveau); // Supprimer un niveau
// Dans vos routes (par exemple niveauxRoutes.js)
router.get('/by-cycle/:cycle',getNiveauxByCycle); 
router.get('/by-cycle-with-sections/:cycle',getNiveauxWithSectionsByCycle);

// Récupérer les matières par niveau
router.get('/:niveauId/matieres', async (req, res) => {
  try {
    const { niveauId } = req.params;

    const matieres = await NiveauxMatieres.findAll({
      where: { niveauId },
      include: [
        { model: Matiere, attributes: ['id', 'nom', 'nomarabe'] },
      ]
    });

    res.json(matieres);
    console.log('liste matiere', matieres);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Mettre à jour la durée d'une matière
// Mettre à jour la configuration d'une matière
router.put('/niveau-matiere/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { duree, dureeseance, nombreseanceparjour, preference } = req.body;

    const niveauMatiere = await NiveauxMatieres.findByPk(id);
    if (!niveauMatiere) {
      return res.status(404).json({ message: 'Association non trouvée' });
    }

    niveauMatiere.duree = duree;
    niveauMatiere.dureeseance = dureeseance;
    niveauMatiere.nombreseanceparjour = nombreseanceparjour;
    niveauMatiere.preference = preference;

    await niveauMatiere.save();

    res.json(niveauMatiere);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;