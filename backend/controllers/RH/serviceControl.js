
import Service from "../../models/RH/service.js";
import sequelize from '../../config/Database.js';
import Ecole_SEcole_Services from "../../models/RH/Ecole_SEcole_Services.js";
import { Op } from "sequelize";
import Employe from "../../models/RH/employe.js";
import JournalPaie from "../../models/RH/paie/JournalPaie.js";
import Pointage from "../../models/RH/pointage.js";
import CongeAbsence from "../../models/RH/congeAbsence.js";
import User from "../../models/User.js";

const { UPDATE } = sequelize.QueryTypes;

export const AjouterService = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const ecoleId = req.user.ecoleId;
    const ecoleeId = req.user.ecoleeId;
    const serviceNom = req.body.service.trim();

    if (!serviceNom) {
      return res.status(400).json({ message: 'Le champ service est requis.' });
    }

    // Vérifier si le service existe déjà
    const findService = await Service.findOne({
      where: { service: serviceNom },
       include: [
        {
          model: Ecole_SEcole_Services,
          where: { ecoleId: ecoleId,}
        }
      ],
      transaction,
    });
    if (findService) {
      await transaction.rollback(); 
      return res.status(400).json({ message: 'Le service existe déjà' });
    }

    // Création du service
    const newService = await Service.create(
      { service: serviceNom },
      { transaction }
    );

    // Associer le service à l'école principale ou sous-école
    await Ecole_SEcole_Services.create(
      {
        ecoleId: ecoleId,
        ecoleeId: ecoleeId,
        serviceId: newService.id,
      },
      { transaction }
    );

    await transaction.commit(); // Valider la transaction
    return res.status(201).json({ message: 'Service ajouté avec succès', service: newService });

  } catch (error) {
    await transaction.rollback(); // Annuler la transaction en cas d'erreur
    console.error('Erreur lors de l\'ajout du service:', error);
    return res.status(500).json({ message: 'Erreur serveur' });
  }
};
export const ModifierService = async (req, res) => {
  try {
    const { id } = req.params;
    const service = req.body.service.trim();

    const [updated] = await Service.update({ service }, {
      where: { id: id }
    });

    if (!updated) {
      return res.status(404).json({ message: 'service non trouvé' });
    }

    const updatedService = await Service.findByPk(id);
    res.status(200).json(updatedService);
  } catch (error) {
    console.error('Erreur lors de la mise à jour du service:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};
export const ListeService = async (req, res) => {
  try {
    const ecoleId = req.user.ecoleId;
    const ecoleeId = req.user.ecoleeId;
    const roles = req.user.roles;
    const isAdminPrincipal = roles.includes('AdminPrincipal');
    // const isAdministrateur = roles.includes('Administrateur');
    // console.log('isAdministrateur:', isAdministrateur);

    let services;

    // if (isAdministrateur) {
    //   console.log('Administrateur détecté');
    //   services = await Service.findAll({
    //     where: { archiver: 0 }
    //   });
    // } else 
    if (isAdminPrincipal) {
      console.log('AdminPrincipal détecté');
      services = await Service.findAll({
        where: { archiver: 0 },
        include: [
          {
            model: Ecole_SEcole_Services,
            where: { ecoleId: ecoleId },
            attributes: []
          }
        ]
      });
    } else {
      console.log('Autre rôle détecté');
      services = await Service.findAll({
        where: { archiver: 0 },
        include: [
          {
            model: Ecole_SEcole_Services,
            where: {
              // [Op.and]: [{ ecoleId: ecoleId }, { ecoleeId: ecoleeId }]
              [Op.and]: [{ ecoleId: ecoleId }]
            },
            attributes: []
          }
        ]
      });
    }
    if (!services.length) {
      return res.status(404).json({ message: 'Aucun service trouvé pour cette école.' });
    }
    return res.status(200).json(services);

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Erreur serveur' });
  }
};
export const ArchiverService = async (req, res) => {
  try {
    const { id } = req.params;
    const [updated] = await Service.update(
      { archiver: 1 },
      { where: { id } }
    );
    if (updated) {
      const updatedService = await Service.findByPk(id);
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
      return res.status(200).json(updatedService);
    } else {
      return res.status(404).json({ message: 'service non trouvé.' });
    }
  } catch (error) {
    console.error(error);
  }
};
