import Poste from "../../models/RH/poste.js";
import sequelize from '../../config/Database.js';
import Ecole_SEcole_Postes from "../../models/RH/Ecole_SEcole_Postes.js";
import { Op } from "sequelize";
import EcolePrincipal from "../../models/EcolePrincipal.js";
import Ecole from '../../models/Admin/Ecole.js';
import Employe from "../../models/RH/employe.js";
import JournalPaie from "../../models/RH/paie/JournalPaie.js";
import Pointage from "../../models/RH/pointage.js";
import CongeAbsence from "../../models/RH/congeAbsence.js";
import User from "../../models/User.js";

const { UPDATE } = sequelize.QueryTypes;

export const AjouterPost = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const ecoleId = req.user.ecoleId;
    const ecoleeId = req.user.ecoleeId;
    const posteNom = req.body.poste.trim();

    if (!posteNom) {
      return res.status(400).json({ message: 'Le champ poste est requis.' });
    }

    // Vérifier si le poste existe déjà pour cette école ou sous-école
    const findPoste = await Poste.findOne({
      where: { poste: posteNom },
      include: [
        {
          model: Ecole_SEcole_Postes,
          where: { ecoleId: ecoleId,}
        }
      ],
      transaction
    });

    if (findPoste) {
      await transaction.rollback();
      return res.status(400).json({ message: 'Le poste existe déjà' });
    }
    const newPoste = await Poste.create(
      { poste: posteNom },
      { transaction }
    );

    // Associer le poste à l'école principale ou à la sous-école
    await Ecole_SEcole_Postes.create(
      {
        ecoleId: ecoleId,
        ecoleeId: ecoleeId,
        posteId: newPoste.id,
      },
      { transaction }
    );

    await transaction.commit();
    return res.status(201).json({ message: 'Poste ajouté avec succès', poste: newPoste });

  } catch (error) {
    await transaction.rollback();
    console.error(error);
    return res.status(500).json({ message: 'Erreur serveur' });
  }
};
export const ModifierPost = async (req, res) => {
  try {
    const { id } = req.params;
    const poste = req.body.poste.trim();
    const [updated] = await Poste.update({ poste }, {
      where: { id: id }
    });

    if (!updated) {
      return res.status(404).json({ message: 'Poste non trouvé' });
    }

    const updatedPoste = await Poste.findByPk(id);
    res.status(200).json(updatedPoste);
  } catch (error) {
    console.error('Erreur lors de la mise à jour du poste:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};
export const ListPost = async (req, res) => {
  try {
    const ecoleId = req.user.ecoleId;
    const ecoleeId = req.user.ecoleeId;
    const roles = req.user.roles;

    const isAdminPrincipal = roles.includes('AdminPrincipal');
    let postes;

    if (isAdminPrincipal) {
      postes = await Poste.findAll({
        where: { archiver: 0 },
        include: [
          {
            model: Ecole_SEcole_Postes,
            where: { ecoleId: ecoleId },
            attributes: []
          }
        ]
      });
    } else {
      console.log('Autre rôle détecté');
      postes = await Poste.findAll({
        where: { archiver: 0 },
        include: [
          {
            model: Ecole_SEcole_Postes,
            where: {
              // [Op.and]: [{ ecoleId: ecoleId }, { ecoleeId: ecoleeId }]
              [Op.and]: [{ ecoleId: ecoleId }]

            },
            attributes: []
          }
        ]
      });
    }

    if (!postes.length) {
      return res.status(404).json({ message: 'Aucun poste trouvé pour cette école.' });
    }

    return res.status(200).json(postes);

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Erreur serveur' });
  }
};
export const ArchiverPoste = async (req, res) => {
  try {
    const { id } = req.params;
    const [updated] = await Poste.update(
      { archiver: 1 },
      { where: { id } }
    );
    if (updated) {
      const updatedPoste = await Poste.findByPk(id);
      // Trouver les employés liés à ce poste
      const employes = await Employe.findAll({ where: { poste: id } });

      for (const emp of employes) {
        const employeId = emp.id;
        const userId = emp.userId;
        await Employe.update({ archiver: 1 }, { where: { id: employeId } });
        await JournalPaie.update({ archiver: 1 }, { where: { idEmploye: employeId } });
        await Pointage.update({ archiver: 1 }, { where: { employe_id: employeId } });
        await CongeAbsence.update({ archiver: 1 }, { where: { employe_id: employeId } });
        if (userId) {
          await User.update({ archiver: 1 }, { where: { id: userId } });
        }
      }
      return res.status(200).json(updatedPoste);
    } else {
      return res.status(404).json({ message: 'poste non trouvé.' });
    }
  } catch (error) {
    console.error(error);

  }

}
