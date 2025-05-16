import Employe from '../models/RH/employe.js'
import EcolePrincipal from '../models/EcolePrincipal.js'
import Ecole from '../models/Admin/Ecole.js';
import Poste from '../models/RH/poste.js';
import Service from '../models/RH/service.js';
import User from '../models/User.js';
import CongeAnnuel from '../models/RH/congeAnnuel.js';
import CongeAbsence from '../models/RH/congeAbsence.js';
import UserEcole from '../models/Admin/UserEcole.js';
import Prime from '../models/RH/paie/Prime.js';
import HeuresSup from '../models/RH/HeuresSup.js';
import ParametereRetard from '../models/RH/paie/ParametereRetard.js';
import JournalPaie from '../models/RH/paie/JournalPaie.js';
import PeriodePaie from '../models/RH/paie/PeriodesPaie.js';
import Pointage from '../models/RH/pointage.js';
import Ecole_SEcole_Postes from '../models/RH/Ecole_SEcole_Postes.js';
import Ecole_SEcole_Services from '../models/RH/Ecole_SEcole_Services.js';
import TypeRevenue from '../models/comptabilite/TypeRevenue.js';
import TypeDepense from '../models/comptabilite/TypeDepense.js';
import Anneescolaire from '../models/Admin/Anneescolaires.js';
import Niveaux from '../models/Admin/Niveaux.js';
import Eleve from '../models/Admin/Eleve.js';
import Revenu from '../models/comptabilite/Revenu.js';
import Depense from '../models/comptabilite/Depense.js';
import Contrat from '../models/comptabilite/PaimentEtudiant/Contrat.js';
import PlanningPaiement from '../models/comptabilite/PaimentEtudiant/PlanningPaiement.js';
import sequelize from '../config/Database.js';
import { DataTypes } from 'sequelize';

//Ressources humaines
//employes
export const employes = async (req, res) => {
  try {
    const ecoleId = req.user.ecoleId;
    const ecoleeId = req.user.ecoleeId;
    const roles = req.user.roles;
    const isAdminPrincipal = roles.includes('AdminPrincipal');
    const includeEcole = {
      model: Ecole,
      through: UserEcole,
      attributes: ['nomecole', 'id']
    };
    if (ecoleeId && !isAdminPrincipal) {
      includeEcole.where = { id: ecoleeId };
      includeEcole.required = true;
    }

    const listeEmployes = await Employe.findAll({
      where: { archiver: 1, },
      include: [
        {
          model: User,
          required: true,
          include: [
            { model: EcolePrincipal, where: { id: ecoleId } },
            includeEcole
          ]
        },
        { model: Poste, attributes: ['poste'] },
        { model: Service, attributes: ['service'] }
      ]
    });

    if (!listeEmployes || listeEmployes.length === 0) {
      return res.status(404).json({ message: "Pas d'employés" });
    }
    return res.status(200).json(listeEmployes);

  } catch (error) {
    // console.error(error);
    return res.status(500).json({ message: "Erreur serveur" });
  }
};
export const restaurerEmployes = async (req, res) => {
  try {
    const { id } = req.params;
    const [updated] = await Employe.update(
      { archiver: 0 },
      { where: { id } }
    );
    if (updated) {
      const updatedEmploye = await Employe.findByPk(id);
      const userId = updatedEmploye?.userId;
      await JournalPaie.update({ archiver: 0 }, { where: { idEmploye: id } });
      await Pointage.update({ archiver: 0 }, { where: { employe_id: id } });
      await CongeAbsence.update({ archiver: 0 }, { where: { employe_id: id } });
      await User.update({ archiver: 0 }, { where: { id: userId } });
      return res.status(200).json(updatedEmploye);

    } else {
      return res.status(404).json({ message: 'Employé non trouvé.' });
    }
  } catch (error) {
    console.error(error);
  }
}
export const ArchiverEmployes = async (req, res) => {
  try {
    const { id } = req.params;
    const [updated] = await Employe.update(
      { archiver: 2 },
      { where: { id } }
    );
    if (updated) {
      const updatedEmploye = await Employe.findByPk(id);
      const userId = updatedEmploye?.userId;
      await JournalPaie.update({ archiver: 2 }, { where: { idEmploye: id } });
      await Pointage.update({ archiver: 2 }, { where: { employe_id: id } });
      await CongeAbsence.update({ archiver: 2 }, { where: { employe_id: id } });
      await User.update({ archiver: 2 }, { where: { id: userId } });

      return res.status(200).json(updatedEmploye);
    } else {
      return res.status(404).json({ message: 'Employé non trouvé.' });
    }
  } catch (error) {
    console.error(error);

  }

}
export const supprimerEmployes = async (req, res) => {
  // try {
  //   const { id } = req.params;
  //   const employe = await Employe.findByPk(id);
  //   if (!employe) {
  //     return res.status(404).json({ message: "Employé introuvable." });
  //   }
  //   await employe.destroy();

  //   return res.status(200).json({ message: "Employé supprimé avec succès." });
  // } catch (error) {
  //   console.error("Erreur lors de la suppression de l'employé :", error);
  //   return res.status(500).json({ message: "Erreur serveur." });
  // }
};
//Congé et Absences
export const congeAbsences = async (req, res) => {
  const ecoleId = req.user.ecoleId;
  const ecoleeId = req.user.ecoleeId;
  const roles = req.user.roles;
  try {
    const isSuperAdmin = roles.includes("AdminPrincipal");
    const includeEcole = {
      model: Ecole,
      through: UserEcole,
    };
    if (ecoleeId && !isSuperAdmin) {
      includeEcole.where = { id: ecoleeId };
      includeEcole.required = true;
    }
    const demandes = await CongeAbsence.findAll({
      where: { archiver: 1 },
      order: [['createdAt', 'DESC']],
      include: [
        {
          model: Employe,
          required: true,
          include: [
            {
              model: Poste,
              attributes: ["poste"],
            },
            {
              model: User,
              attributes: ["nom", "prenom", "statuscompte"],
              where: {
                ecoleId: ecoleId,
              },
              include: [
                {
                  model: EcolePrincipal,
                  where: { id: ecoleId },
                },
                includeEcole
              ],
            },
          ],
        },
        {
          model: CongeAnnuel,
          required: false,
        },
      ],
    });

    if (!demandes) {
      return res.status(404).json({ message: "pas de demande" });
    }
    return res.status(200).json(demandes);
  } catch (error) {
    console.error("Erreur lors de la récupération des demandes :", error);
    return res.status(500).json({ message: "Erreur serveur" });
  }
}
export const restaurerCA = async (req, res) => {
  try {
    const { id } = req.params;
    const [updated] = await CongeAbsence.update(
      { archiver: 0 },
      { where: { id } }
    );
    if (updated) {
      const updatedEmploye = await CongeAbsence.findByPk(id);
      return res.status(200).json(updatedEmploye);

    } else {
      return res.status(404).json({ message: 'non trouvé.' });
    }
  } catch (error) {
    console.error(error);
  }
}
export const ArchiverCA = async (req, res) => {
  try {
    const { id } = req.params;
    const [updated] = await CongeAbsence.update(
      { archiver: 2 },
      { where: { id } }
    );
    if (updated) {
      const updatedEmploye = await CongeAbsence.findByPk(id);
      return res.status(200).json(updatedEmploye);
    } else {
      return res.status(404).json({ message: 'non trouvé.' });
    }
  } catch (error) {
    console.error(error);

  }
}
//CONGE ANNUEL
export const CAnnuel = async (req, res) => {
  try {
    const ecoleId = req.user.ecoleId;
    const ecoleeId = req.user.ecoleeId;
    const roles = req.user.roles;

    const isSuperAdmin = roles.includes("AdminPrincipal");
    const includeEcole = {
      model: Ecole,
    };
    if (ecoleeId && !isSuperAdmin) {
      includeEcole.where = { id: ecoleeId };
      includeEcole.required = true;
    }
    const liste = await CongeAnnuel.findAll({
      where: { archiver: 1 },
      include: [
        {
          model: EcolePrincipal,
          where: { id: ecoleId },
        },
        includeEcole,
      ],
    });
    if (!liste || liste.length === 0) {
      return res.status(404).json({ message: "Pas de congé annuel trouvé." });
    }

    return res.status(200).json(liste);
  } catch (error) {
    console.error("Erreur:", error);
    res.status(500).json({ message: "Erreur serveur." });
  }
};
export const restaurercongeAnnuel = async (req, res) => {
  try {
    const { id } = req.params;
    const [updated] = await CongeAnnuel.update(
      { archiver: 0 },
      { where: { id } }
    );
    if (updated) {
      const updatedata = await CongeAnnuel.findByPk(id);
      return res.status(200).json(updatedata);

    } else {
      return res.status(404).json({ message: 'non trouvé.' });
    }
  } catch (error) {
    console.error(error);
  }
}
export const ArchivercongeAnnuel = async (req, res) => {
  try {
    const { id } = req.params;
    const [updated] = await CongeAnnuel.update(
      { archiver: 2 },
      { where: { id } }
    );
    if (updated) {
      const updatedata = await CongeAnnuel.findByPk(id);
      return res.status(200).json(updatedata);
    } else {
      return res.status(404).json({ message: 'non trouvé.' });
    }
  } catch (error) {
    console.error(error);

  }
}
//PRIMES
export const primes = async (req, res) => {
  try {
    const ecoleId = req.user.ecoleId;
    const primes = await Prime.findAll(
      {
        where: {
          ecoleId,
          archiver: 1
        },
        order: [['createdAt', 'DESC']],
        include: [
          { model: EcolePrincipal, attributes: ['nomecole'] }
        ]
      }
    );
    res.status(200).json(primes);
  } catch (error) {
    console.error("Erreur lors de la recuperation:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
}
export const restaurerPrimes = async (req, res) => {
  try {
    const { id } = req.params;
    const [updated] = await Prime.update(
      { archiver: 0 },
      { where: { id } }
    );
    if (updated) {
      const updatedEmploye = await Prime.findByPk(id);
      return res.status(200).json(updatedEmploye);

    } else {
      return res.status(404).json({ message: ' non trouvé.' });
    }
  } catch (error) {
    console.error(error);
  }
}
export const archiverPrimes = async (req, res) => {
  try {
    const { id } = req.params;
    const [updated] = await Prime.update(
      { archiver: 2 },
      { where: { id } }
    );
    if (updated) {
      const updatedEmploye = await Prime.findByPk(id);
      return res.status(200).json(updatedEmploye);
    } else {
      return res.status(404).json({ message: ' non trouvé.' });
    }
  } catch (error) {
    console.error(error);

  }

}
//HeureSup
export const HeureSup = async (req, res) => {
  try {
    const ecoleId = req.user.ecoleId;
    const data = await HeuresSup.findAll(
      {
        where: {
          ecoleId,
          archiver: 1
        },
        order: [['createdAt', 'DESC']],
        include: [
          { model: EcolePrincipal, attributes: ['nomecole'] }
        ]
      }
    );
    res.status(200).json(data);
  } catch (error) {
    console.error("Erreur lors de la recuperation:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
}
export const restaurerHS = async (req, res) => {
  try {
    const { id } = req.params;
    const [updated] = await HeuresSup.update(
      { archiver: 0 },
      { where: { id } }
    );
    if (updated) {
      const updatedata = await HeuresSup.findByPk(id);
      return res.status(200).json(updatedata);

    } else {
      return res.status(404).json({ message: ' non trouvé.' });
    }
  } catch (error) {
    console.error(error);
  }
}
export const archiverHp = async (req, res) => {
  try {
    const { id } = req.params;
    const [updated] = await HeuresSup.update(
      { archiver: 2 },
      { where: { id } }
    );
    if (updated) {
      const updatedata = await HeuresSup.findByPk(id);
      return res.status(200).json(updatedata);
    } else {
      return res.status(404).json({ message: ' non trouvé.' });
    }
  } catch (error) {
    console.error(error);

  }
}
//HeureRetards
export const heureRetard = async (req, res) => {
  try {
    const ecoleId = req.user.ecoleId;
    const data = await ParametereRetard.findAll(
      {
        where: {
          ecoleId,
          archiver: 1
        },
        order: [['createdAt', 'DESC']],
        include: [
          { model: EcolePrincipal, attributes: ['nomecole'] }
        ]
      }
    );
    res.status(200).json(data);
  } catch (error) {
    console.error("Erreur lors de la recuperation:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
}
export const restaurerHR = async (req, res) => {
  try {
    const { id } = req.params;
    const [updated] = await ParametereRetard.update(
      { archiver: 0 },
      { where: { id } }
    );
    if (updated) {
      const updatedata = await ParametereRetard.findByPk(id);
      return res.status(200).json(updatedata);

    } else {
      return res.status(404).json({ message: ' non trouvé.' });
    }
  } catch (error) {
    console.error(error);
  }
}
export const archiverHR = async (req, res) => {
  try {
    const { id } = req.params;
    const [updated] = await ParametereRetard.update(
      { archiver: 2 },
      { where: { id } }
    );
    if (updated) {
      const updatedata = await ParametereRetard.findByPk(id);
      return res.status(200).json(updatedata);
    } else {
      return res.status(404).json({ message: ' non trouvé.' });
    }
  } catch (error) {
    console.error(error);

  }

}
//PeriodePaie
export const periodepaiee = async (req, res) => {
  try {
    const ecoleId = req.user.ecoleId;
    const paiePeriodes = await PeriodePaie.findAll(
      {
        where: {
          ecoleId,
          archiver: 1
        },
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
export const restaurerPP = async (req, res) => {
  try {
    const { id } = req.params;
    const [updated] = await PeriodePaie.update(
      { archiver: 0 },
      { where: { id } }
    );
    if (updated) {

      const updatedata = await PeriodePaie.findByPk(id);

      await JournalPaie.update(
        { archiver: 0 },
        { where: { periodePaieId: id } }
      );

      return res.status(200).json(updatedata);

    } else {
      return res.status(404).json({ message: ' non trouvé.' });
    }
  } catch (error) {
    console.error(error);
  }
}
export const archiverPP = async (req, res) => {
  try {
    const { id } = req.params;
    const [updated] = await PeriodePaie.update(
      { archiver: 2 },
      { where: { id } }
    );
    if (updated) {
      const updatedata = await PeriodePaie.findByPk(id);
      await JournalPaie.update(
        { archiver: 2 },
        { where: { periodePaieId: id } }
      );
      return res.status(200).json(updatedata);
    } else {
      return res.status(404).json({ message: ' non trouvé.' });
    }
  } catch (error) {
    console.error(error);
  }
}
//JournalPaie
export const journalpaiee = async (req, res) => {
  try {
    const ecoleId = req.user.ecoleId;
    const journalPaie = await JournalPaie.findAll(
      {
        where: { archiver: 1 },
        include: [
          {
            model: PeriodePaie,
            where: { ecoleId, statut: 'Clôturée' },
            include: [{ model: EcolePrincipal, attributes: ['nomecole', 'adresse', 'emailecole'] }]
          },
          {
            model: Employe, attributes: ['id', 'declaration', 'CE'],
            include: [{ model: User, attributes: ['statuscompte'] }]
          }
        ]
      }
    );
    res.status(200).json(journalPaie);
  } catch (error) {
    console.error("Erreur lors de la recuperation:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
}
export const restaurerJP = async (req, res) => {
  try {
    const { id } = req.params;
    const [updated] = await JournalPaie.update(
      { archiver: 0 },
      { where: { id } }
    );
    if (updated) {
      const updatedata = await JournalPaie.findByPk(id);

      return res.status(200).json(updatedata);


    } else {
      return res.status(404).json({ message: ' non trouvé.' });
    }
  } catch (error) {
    console.error(error);
  }
}
export const archiverJP = async (req, res) => {
  try {
    const { id } = req.params;
    const [updated] = await JournalPaie.update(
      { archiver: 2 },
      { where: { id } }
    );
    if (updated) {
      const updatedata = await JournalPaie.findByPk(id);
      return res.status(200).json(updatedata);
    } else {
      return res.status(404).json({ message: ' non trouvé.' });
    }
  } catch (error) {
    console.error(error);

  }

}
//Pointages ,,,
export const Pointagess = async (req, res) => {
  try {
    const ecoleId = req.user.ecoleId;
    const ecoleeId = req.user.ecoleeId;
    const roles = req.user.roles;

    const isSuperAdmin = roles.includes("AdminPrincipal");
    const includeEcole = {
      model: Ecole,
      through: UserEcole,
    };
    if (ecoleeId && !isSuperAdmin) {
      includeEcole.where = { id: ecoleeId };
      includeEcole.required = true;
    }
    const pointages = await Pointage.findAll({
      where: { archiver: 1 },
      include: [
        {
          model: Employe,
          required: true,
          include: [
            {
              model: Poste,
              attributes: ["poste"],
            },
            {
              model: User,
              attributes: ["nom", "prenom", "statuscompte"],
              where: {
                ecoleId: ecoleId,
              },
              include: [
                {
                  model: EcolePrincipal,
                  where: { id: ecoleId },
                },
                includeEcole
              ],
            },
          ],
        },
      ],
    });

    if (!pointages || pointages.length === 0) {
      return res.status(404).json({ message: "Pas de pointages" });
    }
    return res.status(200).json(pointages);

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Erreur serveur' });
  }

}
export const archiverPoint = async (req, res) => {
  try {
    const { id } = req.params;
    const [updated] = await Pointage.update(
      { archiver: 0 },
      { where: { id } }
    );
    if (updated) {
      const updatedata = await Pointage.findByPk(id);

      return res.status(200).json(updatedata);


    } else {
      return res.status(404).json({ message: ' non trouvé.' });
    }
  } catch (error) {
    console.error(error);
  }
}
export const restaurerPoint = async (req, res) => {
  try {
    const { id } = req.params;
    const [updated] = await Pointage.update(
      { archiver: 2 },
      { where: { id } }
    );
    if (updated) {
      const updatedata = await Pointage.findByPk(id);
      //ajouter les liens avec les pointages 

      return res.status(200).json(updatedata);
    } else {
      return res.status(404).json({ message: ' non trouvé.' });
    }
  } catch (error) {
    console.error(error);

  }

}
//Poses
export const Postes = async (req, res) => {
  try {
    const ecoleId = req.user.ecoleId;
    const ecoleeId = req.user.ecoleeId;
    const roles = req.user.roles;
    const isAdminPrincipal = roles.includes('AdminPrincipal');

    let postes;
    if (isAdminPrincipal) {
      postes = await Poste.findAll({
        where: { archiver: 1 },
        include: [
          {
            model: Ecole_SEcole_Postes,
            where: { ecoleId: ecoleId },
            include: [{ model: EcolePrincipal, attributes: ['nomecole'] }, { model: Ecole, attributes: ['nomecole'] }]

          }
        ]
      });
    } else {
      console.log('Autre rôle détecté');
      postes = await Poste.findAll({
        where: { archiver: 1 },
        include: [
          {
            model: Ecole_SEcole_Postes,
            where: {
              // [Op.and]: [{ ecoleId: ecoleId }, { ecoleeId: ecoleeId }]
              [Op.and]: [{ ecoleId: ecoleId }]

            },
            include: [{ model: EcolePrincipal, attributes: ['nomecole'] }, { model: Ecole, attributes: ['nomecole'] }]
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
export const archiverPoste = async (req, res) => {
  try {
    const { id } = req.params;
    // Mise à jour du poste
    const [updated] = await Poste.update(
      { archiver: 2 },
      { where: { id } }
    );
    if (!updated) {
      return res.status(404).json({ message: 'Poste non trouvé.' });
    }
    const updatedata = await Poste.findByPk(id);
    // Trouver les employés liés à ce poste
    const employes = await Employe.findAll({ where: { poste: id } });

    for (const emp of employes) {
      const employeId = emp.id;
      const userId = emp.userId;
      await Employe.update({ archiver: 2 }, { where: { id: employeId } });
      await JournalPaie.update({ archiver: 2 }, { where: { idEmploye: employeId } });
      await Pointage.update({ archiver: 2 }, { where: { employe_id: employeId } });
      await CongeAbsence.update({ archiver: 2 }, { where: { employe_id: employeId } });
      if (userId) {
        await User.update({ archiver: 2 }, { where: { id: userId } });
      }
    }
    return res.status(200).json(updatedata);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Erreur serveur.' });
  }
};
export const restaurerPoste = async (req, res) => {
  try {
    const { id } = req.params;
    // Mise à jour du poste
    const [updated] = await Poste.update(
      { archiver: 0 },
      { where: { id } }
    );
    if (!updated) {
      return res.status(404).json({ message: 'Poste non trouvé.' });
    }
    const updatedata = await Poste.findByPk(id);
    // Trouver les employés liés à ce poste
    const employes = await Employe.findAll({ where: { poste: id } });
    for (const emp of employes) {
      const employeId = emp.id;
      const userId = emp.userId;
      await Employe.update({ archiver: 0 }, { where: { id: employeId } });
      await JournalPaie.update({ archiver: 0 }, { where: { idEmploye: employeId } });
      await Pointage.update({ archiver: 0 }, { where: { employe_id: employeId } });
      await CongeAbsence.update({ archiver: 0 }, { where: { employe_id: employeId } });
      if (userId) {
        await User.update({ archiver: 0 }, { where: { id: userId } });
      }
    }
    return res.status(200).json(updatedata);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Erreur serveur.' });
  }

}
//SERVICE
export const Services = async (req, res) => {
  try {
    const ecoleId = req.user.ecoleId;
    const ecoleeId = req.user.ecoleeId;
    const roles = req.user.roles;
    const isAdminPrincipal = roles.includes('AdminPrincipal');
    let services;

    if (isAdminPrincipal) {
      services = await Service.findAll({
        where: { archiver: 1 },
        include: [
          {
            model: Ecole_SEcole_Services,
            where: { ecoleId: ecoleId },

            include: [{ model: EcolePrincipal, attributes: ['nomecole'] },
            { model: Ecole, attributes: ['nomecole'] }]
          }

        ]
      });
    } else {
      console.log('Autre rôle détecté');
      services = await Service.findAll({
        where: { archiver: 1 },
        include: [
          {
            model: Ecole_SEcole_Services,
            where: {
              // [Op.and]: [{ ecoleId: ecoleId }, { ecoleeId: ecoleeId }]
              [Op.and]: [{ ecoleId: ecoleId }]
            },
            include: [{ model: EcolePrincipal, attributes: ['nomecole'] },
            { model: Ecole, attributes: ['nomecole'] }]
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
export const archiverService = async (req, res) => {
  try {
    const { id } = req.params;
    // Mise à jour du service
    const [updated] = await Service.update(
      { archiver: 2 },
      { where: { id } }
    );
    if (!updated) {
      return res.status(404).json({ message: 'Service non trouvé.' });
    }
    const updatedata = await Service.findByPk(id);
    // Trouver les employés liés à ce poste
    const employes = await Employe.findAll({ where: { poste: id } });

    for (const emp of employes) {
      const employeId = emp.id;
      const userId = emp.userId;
      await Employe.update({ archiver: 2 }, { where: { id: employeId } });
      await JournalPaie.update({ archiver: 2 }, { where: { idEmploye: employeId } });
      await Pointage.update({ archiver: 2 }, { where: { employe_id: employeId } });
      await CongeAbsence.update({ archiver: 2 }, { where: { employe_id: employeId } });
      if (userId) {
        await User.update({ archiver: 2 }, { where: { id: userId } });
      }
    }
    return res.status(200).json(updatedata);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Erreur serveur' });
  }
};
export const restaurerService = async (req, res) => {
  try {
    const { id } = req.params;
    // Mise à jour du poste
    const [updated] = await Service.update(
      { archiver: 0 },
      { where: { id } }
    );
    if (!updated) {
      return res.status(404).json({ message: 'Service non trouvé.' });
    }
    const updatedata = await Service.findByPk(id);
    // Trouver les employés liés à ce poste
    const employes = await Employe.findAll({ where: { poste: id } });
    for (const emp of employes) {
      const employeId = emp.id;
      const userId = emp.userId;
      await Employe.update({ archiver: 0 }, { where: { id: employeId } });
      await JournalPaie.update({ archiver: 0 }, { where: { idEmploye: employeId } });
      await Pointage.update({ archiver: 0 }, { where: { employe_id: employeId } });
      await CongeAbsence.update({ archiver: 0 }, { where: { employe_id: employeId } });
      if (userId) {
        await User.update({ archiver: 0 }, { where: { id: userId } });
      }
    }
    return res.status(200).json(updatedata);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Erreur serveur' });
  }
}
//___________________________COMPTABILITE_________________________
//TypeRevenus
export const TypeRevenuss = async (req, res) => {
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
      hps = await TypeRevenue.findAll({
        where: { archiver: 1 },
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
      hps = await TypeRevenue.findAll({
        where: { archiver: 1 },
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
export const archiverTR = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { id } = req.params;
    const [updated] = await TypeRevenue.update({ archiver: 2 }, { where: { id }, transaction: t });
    if (!updated) {
      await t.rollback();
      return res.status(404).json({ message: 'Type Revenus non trouvé.' });
    }
    await Revenu.update({ archiver: 2 }, { where: { typeId: id }, transaction: t });
    const updatedata = await TypeRevenue.findByPk(id, { transaction: t });
    await t.commit();
    res.status(200).json(updatedata);
  } catch (error) {
    await t.rollback();
    console.error(error);
    return res.status(500).json({ message: 'Erreur serveur' });
  }

};
export const restaurerTR = async (req, res) => {
  const t = sequelize.transaction();
  try {
    const { id } = req.params;
    const [updated] = await TypeRevenue.update(
      { archiver: 0 },
      { where: { id } }
    );
    if (!updated) {
      await t.rollback();
      return res.status(404).json({ message: 'non trouvé.' });
    }
    await Revenu.update({ archiver: 0 }, { where: { typeId: id }, transaction: t });
    const updatedata = await TypeRevenue.findByPk(id, { transaction: t });
    await t.commit();

    return res.status(200).json(updatedata);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Erreur serveur' });
  }

}
//TYpeDepenses
export const TypeDepensess = async (req, res) => {
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
        where: { archiver: 1 },
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
        where: { archiver: 1 },
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
export const archiverTD = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { id } = req.params;
    const [updated] = await TypeDepense.update({ archiver: 2 }, { where: { id }, transaction: t });
    if (!updated) {
      await t.rollback();
      return res.status(404).json({ message: 'Type non trouvé.' });
    }
    await Depense.update({ archiver: 2 }, { where: { typeId: id }, transaction: t });
    const updatedata = await TypeDepense.findByPk(id, { transaction: t });
    await t.commit();
    res.status(200).json(updatedata);
  } catch (error) {
    await t.rollback();
    console.error(error);
    return res.status(500).json({ message: 'Erreur serveur' });
  }

};
export const restaurerTD = async (req, res) => {
  const t = sequelize.transaction();
  try {
    const { id } = req.params;
    const [updated] = await TypeDepense.update(
      { archiver: 0 },
      { where: { id } }
    );
    if (!updated) {
      await t.rollback();
      return res.status(404).json({ message: 'non trouvé.' });
    }
    await Depense.update({ archiver: 0 }, { where: { typeId: id }, transaction: t });
    const updatedata = await TypeDepense.findByPk(id, { transaction: t });
    await t.commit();

    return res.status(200).json(updatedata);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Erreur serveur' });
  }

}
//Revenus
export const Revenuss = async (req, res) => {
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
      hps = await Revenu.findAll({
        where: { archiver: 1 },
        order: [['createdAt', 'DESC']],
        include: [
           {model:TypeRevenue},
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
      hps = await Revenu.findAll({
        where: { archiver: 1 },
        order: [['createdAt', 'DESC']],
        include: [
           {model:TypeRevenue},
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
export const restaurerR = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { id } = req.params;
    const [updated] = await Revenu.update({ archiver: 0 }, { where: { id }, transaction: t });
    if (!updated) {
      await t.rollback();
      return res.status(404).json({ message: ' Revenus non trouvé.' });
    }
    const updatedata = await Revenu.findByPk(id, { transaction: t });
    await t.commit();
    res.status(200).json(updatedata);
  } catch (error) {
    await t.rollback();
    console.error(error);
    return res.status(500).json({ message: 'Erreur serveur' });
  }

};
export const archiverR = async (req, res) => {
  const t = sequelize.transaction();
  try {
    const { id } = req.params;
    const [updated] = await Revenu.update(
      { archiver: 0 },
      { where: { id } }
    );
    if (!updated) {
      await t.rollback();
      return res.status(404).json({ message: 'non trouvé.' });
    }
    const updatedata = await Revenu.findByPk(id, { transaction: t });
    await t.commit();

    return res.status(200).json(updatedata);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Erreur serveur' });
  }

}
//Depenses
export const Depensess = async (req, res) => {
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
      hps = await Depense.findAll({
        where: { archiver: 1 },
        order: [['createdAt', 'DESC']],
        include: [
          {model:TypeDepense},
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
      hps = await Depense.findAll({
        where: { archiver: 1 },
        order: [['createdAt', 'DESC']],
        include: [
           {model:TypeDepense},
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
export const restaurerD = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { id } = req.params;
    const [updated] = await Depense.update({ archiver: 0 }, { where: { id }, transaction: t });
    if (!updated) {
      await t.rollback();
      return res.status(404).json({ message: 'non trouvé.' });
    }
    const updatedata = await Depense.findByPk(id, { transaction: t });
    await t.commit();
    res.status(200).json(updatedata);
  } catch (error) {
    await t.rollback();
    console.error(error);
    return res.status(500).json({ message: 'Erreur serveur' });
  }

};
export const archiverD = async (req, res) => {
  const t = sequelize.transaction();
  try {
    const { id } = req.params;
    const [updated] = await Depense.update(
      { archiver: 2 },
      { where: { id } }
    );
    if (!updated) {
      await t.rollback();
      return res.status(404).json({ message: 'non trouvé.' });
    }
    const updatedata = await Depense.findByPk(id, { transaction: t });
    await t.commit();

    return res.status(200).json(updatedata);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Erreur serveur' });
  }
}
//Contrat
export const Contrats = async (req, res) => {
  try {
    const ecoleId = req.user.ecoleId;
    const ecoleeId = req.user.ecoleeId;
    const roles = req.user.roles;

    const isAdminPrincipal = roles.includes('AdminPrincipal');
    const includeEcole = {
      model: Ecole, through: UserEcole, attributes: ['nomecole', 'id']
    };
    if (ecoleeId) {
      includeEcole.where = { id: ecoleeId };
      includeEcole.required = false;
    }

    let hps;
    if (isAdminPrincipal) {
      console.log('AdminPrincipal détecté');
      hps = await Contrat.findAll({
        where: { archiver: 1},
        order: [['createdAt', 'DESC']],
        include: [
          { model: Anneescolaire, attributes: ['id', 'datedebut', 'datefin'] },
          {
            model: Eleve, attributes: ['id', 'fraixinscription', 'numinscription'],
            include: [
              { model: Niveaux, attributes: ['id', 'nomniveau', 'nomniveuarab', 'cycle'] },
              {
                model: User, attributes: ['id', 'nom', 'prenom', 'datenaiss', 'adresse'],
                include: [
                  { model: EcolePrincipal, where: { id: ecoleId }, attributes: ['nomecole', 'adresse'] },
                  includeEcole
                ]
              }
            ]
          },
        ],
      });
    }
    else {
      console.log('Autre rôle détecté');
      hps = await Contrat.findAll({
        where: { archiver: 1},
        order: [['createdAt', 'DESC']],
        include: [
          { model: Anneescolaire, attributes: ['id', 'datedebut', 'datefin'] },
          {
            model: Eleve,
            required: true,
            attributes: ['id', 'fraixinscription', 'numinscription'],
            include: [
              { model: Niveaux, attributes: ['id', 'nomniveau', 'nomniveuarab', 'cycle'] },
              {
                model: User,
                required: true, // important !
                attributes: ['id', 'nom', 'prenom', 'datenaiss', 'adresse'],
                include: [
                  {
                    model: EcolePrincipal,
                    required: true,
                    where: { id: ecoleId },
                    attributes: ['nomecole', 'adresse']
                  },
                  {
                    model: Ecole,
                    through: { model: UserEcole },
                    as: 'Ecoles',
                    required: true,
                    where: { id: ecoleeId },
                    attributes: ['nomecole']
                  }
                ]
              }
            ]
          }
        ]
      });
    }

    res.status(200).json(hps);
  } catch (error) {
    console.error("Erreur lors de la recuperation:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
}
export const restaurerContrat = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { id } = req.params;
    const [updated] = await Contrat.update({ archiver: 0 }, { where: { id }, transaction: t });
    if (!updated) {
      await t.rollback();
      return res.status(404).json({ message: ' non trouvé.' });
    }
    const updatedata = await Contrat.findByPk(id, { transaction: t });
    if (updatedata) {
      await PlanningPaiement.update({ archiver: 0 }, { where: { ContratId: id } , transaction: t });
    }
    await t.commit();
    res.status(200).json(updatedata);
  } catch (error) {
    await t.rollback();
    console.error(error);
    return res.status(500).json({ message: 'Erreur serveur' });
  }

};
export const archiverContrat = async (req, res) => {
  const t = sequelize.transaction();
  try {
    const { id } = req.params;
    const [updated] = await Contrat.update(
      { archiver: 2 },
      { where: { id } }
    );
    if (!updated) {
      await t.rollback();
      return res.status(404).json({ message: 'non trouvé.' });
    }

    const updatedata = await Contrat.findByPk(id, { transaction: t });
    if (updatedata) {
      if (updatedata) {
        await PlanningPaiement.update({ archiver: 2 }, { where: { ContratId: id } ,transaction: t });
      }
    }
    await t.commit();

    return res.status(200).json(updatedata);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Erreur serveur' });
  }

}
//Planning
export const Plannings = async (req, res) => {
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
      hps = await PlanningPaiement.findAll({
        where: { archiver: 1 },
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
      hps = await PlanningPaiement.findAll({
        where: { archiver: 1 },
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
export const restaurerPlannings = async (req, res) => {
  const { id } = req.params;
  const t = await sequelize.transaction();
  try {
    const [updated] = await PlanningPaiement.update({ archiver: 0 }, { where: { id }, transaction: t });
    if (!updated) {
      await t.rollback();
      return res.status(404).json({ message: 'Type Revenus non trouvé.' });
    }
    const updatedata = await PlanningPaiement.findByPk(id, { transaction: t });
    await t.commit();
    res.status(200).json(updatedata);
  } catch (error) {
    await t.rollback();
    console.error(error);
    return res.status(500).json({ message: 'Erreur serveur' });
  }

};
export const archiverPlannings = async (req, res) => {
  const t = sequelize.transaction();
  try {
    const { id } = req.params;
    const [updated] = await PlanningPaiement.update(
      { archiver: 2 },
      { where: { id } }
    );
    if (!updated) {
      await t.rollback();
      return res.status(404).json({ message: 'non trouvé.' });
    }
    const updatedata = await PlanningPaiement.findByPk(id, { transaction: t });
    await t.commit();
    return res.status(200).json(updatedata);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Erreur serveur' });
  }

}



