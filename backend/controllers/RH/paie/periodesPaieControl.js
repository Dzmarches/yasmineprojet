import EcolePrincipal from '../../../models/EcolePrincipal.js';
import JournalPaie from '../../../models/RH/paie/JournalPaie.js';
import PeriodePaie from '../../../models/RH/paie/PeriodesPaie.js';


export const ListePeriodePaie = async (req, res) => {
  try {
    const ecoleId = req.user.ecoleId;
    const paiePeriodes = await PeriodePaie.findAll(
      {
        where: { ecoleId,  archiver: 0 },
        include: [
          { model: EcolePrincipal, attributes: ['nomecole'] }
        ]
      }
    );
    res.status(200).json(paiePeriodes);
  } catch (error) {
    console.error("Erreur lors de la recuperation:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
}

export const ArchiverPeriodePaie = async (req, res) => {
  try {
    const { id } = req.params;
    const paieperiode = await PeriodePaie.findByPk(id);
    if (!paieperiode) {
      return res.status(404).json({ message: "periodes de  paie non trouvée." });
    }
    await PeriodePaie.update(
      { archiver: 1 },
      { where: { id } }
    );
    //  Archive tous les journaux liés à cette période
    await JournalPaie.update(
      { archiver: 1 },
      { where: { periodePaieId: id } }
    );

    return res.status(200).json({ message: "periodes de  paie archivée avec succès." });
  } catch (error) {
    console.error("❌ Erreur lors de l'archivage :", error);
    return res.status(500).json({ message: "Erreur serveur." });
  }
};

export const AjouterPeriodePaie = async (req, res) => {
  try {
    const ecoleId = req.user.ecoleId;
    const { code, dateDebut, dateFin, statut } = req.body;
    if (!code || !dateDebut || !dateFin || !statut) {
      return res.status(400).json({ message: "les champs sont obligatoires" });
    }

    // Vérifier si le identifiant est unique
    const existingCode = await PeriodePaie.findOne({ where: { code } });
    if (existingCode) {
      return res.status(400).json({ message: "Ce code de periodes de  paie  existe déjà" });
    }
    // Créer la nouvelle Periodepaie
    const newPeriodePaie = await PeriodePaie.create({ code, dateDebut, dateFin, statut, ecoleId, });
    res.status(201).json({ message: "Periode Paie ajoutée avec succès", paie: newPeriodePaie });
  } catch (error) {
    console.error("Erreur lors de l'ajout de periodes de  paie:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

export const ModifierPeriodePaie = async (req, res) => {
  const { id } = req.params;
  const updatedData = req.body;

  const { code, dateDebut, dateFin, statut } = req.body;
  if (!code || !dateDebut || !dateFin || !statut) {
    return res.status(400).json({ message: "les champs sont obligatoires" });
  }

  try {
    const [updated] = await PeriodePaie.update(updatedData, {
      where: { id: id }
    });

    console.log('update result:', updated);

    if (updated) {
      const updatedPpaie = await PeriodePaie.findByPk(id);
      return res.status(200).json({ message: ' Périodes de paie mise à jour avec succès', paieperiode: updatedPpaie });
    } else {
      return res.status(404).json({ message: " Périodes de paie non trouvée" });
    }
  } catch (error) {
    console.error('Erreur lors de la mise à jour', error);
    return res.status(500).json({ message: 'Erreur serveur lors de la mise à jour' });
  }
};




