
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import Contrat from '../../../models/comptabilite/PaimentEtudiant/Contrat.js';
import Niveaux from '../../../models/Admin/Niveaux.js';
import User from '../../../models/User.js';
import Anneescolaire from '../../../models/Admin/Anneescolaires.js';
import EcolePrincipal from '../../../models/EcolePrincipal.js';
import TypeRevenue from '../../../models/comptabilite/TypeRevenue.js';
import Ecole from '../../../models/Admin/Ecole.js';
import Revenu from '../../../models/comptabilite/Revenu.js';
import Eleve from '../../../models/Admin/Eleve.js';

const __filename = fileURLToPath(import.meta.url);
// Obtenir le répertoire du fichier
const __dirname = path.dirname(__filename)


export const Liste=async (req, res) => {
  try {
    const ecoleId = req.user.ecoleId;
    const ecoleeId = req.user.ecoleeId;
    const roles = req.user.roles;

    const isAdminPrincipal = roles.includes('AdminPrincipal');
    const includeEcole = {
      model: Ecole,
      attributes:['nomecole','id']
    };
    if (ecoleeId) {
      includeEcole.where = { id: ecoleeId };
      includeEcole.required = true;
    }

    let hps;
    if (isAdminPrincipal) {
      console.log('AdminPrincipal détecté');
      hps = await Contrat.findAll({
        where: { archiver: 0 },
        order: [['createdAt', 'DESC']],
                include: [
                  {model: Anneescolaire,attributes:['datedebut','datefin']},
                  { model: Eleve,attributes:['fraixinscription'],
                  include:[
                     {model:Niveaux,attributes:['nomniveau','nomniveuarab','cycle']},
                     {model:User,where:{ecoleId},attributes:['nom','prenom','datenaiss'],}
                    ]
                  },
                ],
      });
    }
    else {
      console.log('Autre rôle détecté');
      hps = await Revenu.findAll({
        where: { archiver: 0 },
        order: [['createdAt', 'DESC']],
                include: [
                  {
                    model: EcolePrincipal,
                    where: { id: ecoleId },
                  },
                  {
                    model: TypeRevenue,
                    attributes:['type','id'],
                    required: false,
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

 export const Archiver = async (req, res) => {
    try {
      const { id } = req.params;
      const hs = await Revenu.findByPk(id);
      if (!hs) {
        return res.status(404).json({ message: "revenu non trouvée." });
      }
        await Revenu.update(
        { archiver: 1 },
        { where: { id } }
      );
      return res.status(200).json({ message: "archivée avec succès." });
    } catch (error) {
      console.error("❌ Erreur lors de l'archivage :", error);
      return res.status(500).json({ message: "Erreur serveur." });
    }
  };
  

  export const Ajouter = async (req, res) => {
    try {
      
    const {eleve,annee_scolaire,niveau,code, date_debut_paiement, 
      date_creation,remarque,nombre_echeances, typePaiment,
      totalApayer,frais_insc}=req.body;

      // Vérifier si le identifiant est unique
      const existing= await Contrat.findOne({ where: { code } });
      if (existing) {
        return res.status(400).json({ message: "code existe déjà" });
      }
      const newContrat = await Contrat.create({
        code, date_debut_paiement, date_creation,remarque,nombre_echeances, typePaiment,
        totalApayer,niveauId:niveau,annescolaireId:annee_scolaire,eleveId:eleve
      });

      await Eleve.update( {fraixinscription:frais_insc }, { where: { id: eleve } } );

      res.status(201).json({ message: "ajoutée avec succès"});
    } catch (error) {
      console.error("Erreur lors de l'ajout :", error);
      res.status(500).json({ message: "Erreur serveur" });
    }
  };
  
  export const Modifier = async (req, res) => {
    const { id } = req.params;
    const file = req.file;

    const { code, type,cause_ar, cause_fr,montant,date,par_ar,par_fr, mode_paie,remarque} = req.body;

    if (!type || !montant || !code) {
      return res.status(400).json({ message: "Le type, le montant et le code sont obligatoires" });
    }
      const updatedData = {
      code,
      typeId: type, 
      cause_ar,
      cause_fr,
      montant,
      date,
      par_ar,
      par_fr,
      mode_paie,
      remarque,
    };
      if (file) {
      updatedData.fichier = `/revenus/${updatedData.code}/${file.filename}`;
    }
    try {
      const [updated] = await Revenu.update(updatedData, {
        where: { id }
      });
  
      console.log('Résultat de la mise à jour :', updated);
  
      if (updated) {
        const updatedRevenu = await Revenu.findByPk(id);
        return res.status(200).json({
          message: 'Mise à jour avec succès',
          updatedRevenu
        });
      } else {
        return res.status(404).json({ message: "Revenu non trouvé" });
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour', error);
      return res.status(500).json({ message: 'Erreur serveur lors de la mise à jour' });
    }
  };
  
  
  