import EcolePrincipal from '../../models/EcolePrincipal.js';
import TypeDepense from '../../models/comptabilite/TypeDepense.js';
import Ecole from '../../models/Admin/Ecole.js';
import Depense from '../../models/comptabilite/Depense.js';

export const ListeTD = async (req, res) => {
  try {
    const ecoleId = req.user.ecoleId;
    const ecoleeId = req.user.ecoleeId;
    const roles = req.user.roles;

    const isAdminPrincipal = roles.includes('AdminPrincipal');
    const includeEcole = {
      model: Ecole,
      attributes: ['nomecole']
    };
    if (ecoleeId) {
      includeEcole.where = { id: ecoleeId };
      includeEcole.required = true;
    }
    let hps;
    if (isAdminPrincipal) {
      console.log('AdminPrincipal détecté');
      hps = await TypeDepense.findAll({
        where: { archiver: 0 },
        order: [['createdAt', 'DESC']],
        include: [
          {
            model: EcolePrincipal,
            where: { id: ecoleId },
          },
          {
            model: Ecole,
            attributes: ['nomecole'],
            required: false,
          },
        ],
      });
    }
    else {
      console.log('Autre rôle détecté');
      hps = await TypeDepense.findAll({
        where: { archiver: 0 },
        order: [['createdAt', 'DESC']],
        include: [
          {
            model: EcolePrincipal,
            where: { id: ecoleId },
          },
          includeEcole
        ]
      });
    }
    res.status(200).json(hps);
  } catch (error) {
    console.error("Erreur lors de la recuperation:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
}

export const FindTD = async (req, res) => {
  try {
    const idTR = req.params.id;
    const TR = await TypeDepense.findOne({
      where: { id: isTR },
      include: [
        { model: EcolePrincipal, attributes: ['nomecole'] }
      ]
    }
    );
    res.status(200).json(hs);
  } catch (error) {
    console.error("Erreur lors de la recuperation:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
}


export const ArchiverTD = async (req, res) => {
  try {
    const { id } = req.params;
    const hs = await TypeDepense.findByPk(id);
    if (!hs) {
      return res.status(404).json({ message: "type non trouvée." });
    }
    await TypeDepense.update(
      { archiver: 1 },
      { where: { id } }
    );
    await Depense.update({ archiver: 1 }, { where: { typeId: id }});
    return res.status(200).json({ message: "archivée avec succès." });
  } catch (error) {
    console.error("❌ Erreur lors de l'archivage :", error);
    return res.status(500).json({ message: "Erreur serveur." });
  }
};


export const AjouterTD = async (req, res) => {
  try {
    const ecoleId = req.user.ecoleId;
    const ecoleeId = req.user.ecoleeId;
    const { type, remarque } = req.body;
    if (!type) {
      return res.status(400).json({ message: " le type est  obligatoire" });
    }
    // Vérifier si le identifiant est unique
    const existingtype= await TypeDepense.findOne({ where: { type,ecoleId,ecoleeId } });
    if (existingtype) {
      return res.status(400).json({ message: "type existe déjà" });
    }
    const newHeureSup = await TypeDepense.create({
      type, remarque, ecoleId, ecoleeId
    });
    res.status(201).json({ message: "ajoutée avec succès" });
  } catch (error) {
    console.error("Erreur lors de l'ajout :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

export const ModifierTD = async (req, res) => {
  const { id } = req.params;
  const updatedData = req.body;

  const { type, remarque } = updatedData;
  if (!type) {
    return res.status(400).json({ message: " le type est  obligatoire" });
  }
  try {
    const [updated] = await TypeDepense.update(updatedData, {
      where: { id: id }
    });

    console.log('update result:', updated);

    if (updated) {
      const updatedtype = await TypeDepense.findByPk(id);
      return res.status(200).json({ message: ' mise à jour avec succès', updatedtype: updatedtype });
    } else {
      return res.status(404).json({ message: " non trouvée" });
    }
  } catch (error) {
    console.error('Erreur lors de la mise à jour', error);
    return res.status(500).json({ message: 'Erreur serveur lors de la mise à jour' });
  }
};
