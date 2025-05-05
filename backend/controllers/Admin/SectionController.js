import Section from '../../models/Admin/Section.js';
import Niveaux from '../../models/Admin/Niveaux.js';
import EcoleSections from '../../models/Admin/EcoleSections.js';


//récupere la liste des sections selon niveau 
// controllers/sectionController.js
export const getSectionsByNiveau = async (req, res) => {
    try {
      const { niveauId } = req.params;
      const sections = await Section.findAll({
        where: { niveauxId: niveauId, archiver: 0 }
      });
      res.json(sections);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erreur lors de la récupération des sections' });
    }
  };


// Récupérer toutes les sections non archivées
export const getSections = async (req, res) => {
    try {
        // Récupérer les informations de l'utilisateur connecté
        const ecoleId = req.user.ecoleId; // ecoleId de l'AdminPrincipal
        const roles = req.user.roles; // Rôles de l'utilisateur
        const userId = req.user.id; // ID de l'utilisateur connecté
        const ecoleeId = req.user.ecoleeId; // ecoleeId de l'Admin

        // Afficher les informations de l'utilisateur pour le débogage
        console.log('🟢 ecoleId:', ecoleId);
        console.log('🟢 roles:', roles);
        console.log('🟢 userId:', userId);
        console.log('🟢 ecoleeId:', ecoleeId);

        // Vérifier les rôles de l'utilisateur
        const isAdminPrincipal = roles.includes('AdminPrincipal');
        const isAdmin = roles.includes('Admin');

        console.log('🟢 isAdminPrincipal:', isAdminPrincipal);
        console.log('🟢 isAdmin:', isAdmin);

        let sections;

        if (isAdminPrincipal) {
            // Récupérer les sections pour AdminPrincipal (filtrer par ecoleId)
            sections = await Section.findAll({
                include: [
                    {
                        model: Niveaux,
                    },
                    {
                        model: EcoleSections,
                        where: { ecoleId }, // Filtrer par ecoleId
                    },
                ],
                where: { archiver: 0 }, // Ne récupérer que les sections non archivées
            });
        } else if (isAdmin) {
            // Récupérer les sections pour Admin (filtrer par ecoleeId)
            sections = await Section.findAll({
                include: [
                    {
                        model: Niveaux,
                    },
                    {
                        model: EcoleSections,
                        where: { ecoleeId }, // Filtrer par ecoleeId
                    },
                ],
                where: { archiver: 0 }, // Ne récupérer que les sections non archivées
            });
        } else {
            // Si l'utilisateur n'a pas de rôle valide, retourner une erreur
            return res.status(403).json({ error: 'Accès non autorisé' });
        }

        res.json(sections);
    } catch (err) {
        console.error("Erreur lors de la récupération des sections :", err);
        res.status(500).json({ error: 'Erreur lors de la récupération des sections' });
    }
};

// Ajouter une nouvelle section
// Ajouter une nouvelle section
export const createSection = async (req, res) => {
    const { classe, classearab, niveaunum, numregime, niveauxId, ecoleId, ecoleeId } = req.body;

    if (!classe || !classearab || !niveaunum || !numregime || !niveauxId || !ecoleId) {
        return res.status(400).json({ error: 'Tous les champs sont requis.' });
    }

    try {
        const section = await Section.create({ classe, classearab, niveaunum, numregime, niveauxId, archiver: 0 });

        // Créer l'entrée dans EcoleSections
        await EcoleSections.create({
            ecoleId,
            ecoleeId: ecoleeId === "null" ? null : ecoleeId,
            sectionId: section.id,
        });

        res.status(201).json({ message: 'Section ajoutée avec succès', section });
    } catch (err) {
        console.error('Erreur lors de l\'ajout de la section:', err);
        res.status(500).json({ error: 'Erreur lors de l\'ajout de la section', details: err.message });
    }
};

// Modifier une section
export const updateSection = async (req, res) => {
    const { id } = req.params;
    const { classe, classearab, niveaunum, numregime, niveauxId, ecoleId, ecoleeId } = req.body;

    if (!classe || !classearab || !niveaunum || !numregime || !niveauxId || !ecoleId) {
        return res.status(400).json({ error: 'Tous les champs sont requis.' });
    }

    try {
        const section = await Section.findOne({ where: { id } });
        if (!section) return res.status(404).json({ error: 'Section non trouvée' });

        await section.update({ classe, classearab, niveaunum, numregime, niveauxId });

        // Mettre à jour l'entrée dans EcoleSections
        const ecoleSection = await EcoleSections.findOne({ where: { sectionId: id } });
        if (ecoleSection) {
            await ecoleSection.update({
                ecoleId,
                ecoleeId: ecoleeId === "null" ? null : ecoleeId,
            });
        } else {
            await EcoleSections.create({
                ecoleId,
                ecoleeId: ecoleeId === "null" ? null : ecoleeId,
                sectionId: id,
            });
        }

        res.status(200).json({ message: 'Section modifiée avec succès', section });
    } catch (err) {
        console.error("Erreur lors de la modification de la section :", err);
        res.status(500).json({ error: 'Erreur lors de la modification de la section' });
    }
};

// Supprimer une section (archiver)
export const deleteSection = async (req, res) => {
    const { id } = req.params;

    try {
        const [updated] = await Section.update({ archiver: 1 }, { where: { id } });
        if (!updated) return res.status(404).json({ error: 'Section non trouvée' });

        res.status(200).json({ message: `Section avec l'ID ${id} archivée avec succès` });
    } catch (err) {
        console.error("Erreur lors de l'archivage de la section :", err);
        res.status(500).json({ error: 'Erreur lors de l\'archivage de la section' });
    }
};