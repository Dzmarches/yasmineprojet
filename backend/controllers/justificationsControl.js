import moment from 'moment';
import  sequelize  from '../config/Database.js';
import { Op } from 'sequelize';
import DemandeAutorisation from '../models/Admin/demandeAutorisation.js';
import { fileURLToPath } from 'url';
import fs from 'fs';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
// Obtenir le répertoire du fichier
const __dirname = path.dirname(__filename)

export const ajouterDA = async (req, res) => {
  try {
    const file = req.file;
    const eleve_id = 2;
    const { type_demande, dateDebut, dateFin, commentaire ,RaisonA} = req.body;

  //   if (!file) {
  //     return res.status(400).json({ message: 'Aucun fichier uploadé' });
  // }
      let filePath = null; 

     // Si un fichier est uploadé, définir le chemin de la photo
     if (file) {
      filePath = `/justifications/modeles/images/${file.filename}`;
    }
       const newCA = await DemandeAutorisation.create({
        type_demande,dateDebut,dateFin,commentaire,eleve_id,RaisonA,file: filePath
      });
      

      return res.status(201).json({ message: 'Congé ajouté avec succès', newCA });


  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Erreur serveur' });
  }
};

export const listeDA = async (req, res) => {
  try {
    const { id } = req.params;
    // const mesDA = await DemandeAutorisation.findAll({
    //   where: { eleve_id: id},
    //   include: [
    //     {
    //       model: Eleve,
    //     },
    //   ],
    // });
    const mesDA = await DemandeAutorisation.findAll({
        where: { eleve_id: id},
      });
    if (!mesDA) {
      return res.status(404).json({ message: "pas de demande d'autorisation" });
    }
    return res.status(200).json(mesDA);
  } catch (error) {
    console.error("Erreur lors de la récupération des demandes d'autorisations:", error);
    return res.status(500).json({ message: "Erreur serveur" });
  }
}
export const detailDA = async (req, res) => {

  const { id } = req.params;
  try {
    const demande = await DemandeAutorisation.findByPk(id);
    if (!demande) {
      return res.status(404).json({ message: 'Demande non trouvée' });
    }
    res.json(demande);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
}
export const listeTousDA=async(req,res)=>{
  try {
    
    const listeTDA=await DemandeAutorisation.findAll();

    if(!listeTDA){
      return res.status(404).json({message:"pas de demandes d'autorisation"})
    }
    return res.status(200).json(listeTDA)

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
}
export const changerstatut = async (req, res) => {
    try {
        const { id } = req.params; 
        const { statut } = req.body; 

        if (!statut) {
            return res.status(400).json({ message: "Le statut est requis" });
        }

        const demande = await DemandeAutorisation.findByPk(id);
        if (!demande) {
            return res.status(404).json({ message: "Demande non trouvée" });
        }
        await demande.update({ statut });

        return res.status(200).json({ message: "Statut mis à jour avec succès", demande });
    } catch (error) {
        console.error("Erreur lors de la mise à jour du statut :", error);
        return res.status(500).json({ message: "Erreur interne du serveur" });
    }
};
export const supprimerMademande = async (req, res) => {
  const { id } = req.params;
  try {
    // Vérifier si la demande existe
    const demande = await DemandeAutorisation.findOne({ where: { id } });

    if (!demande) {
      return res.status(404).json({ message: "Demande non trouvée" });
    }
    if (demande.statut !== 'En attente') {
      return res.status(400).json({ message: "Vous ne pouvez supprimer que les demandes en attente." });
    }
  
    if (demande.file) {
      const imagePath = path.join(__dirname, '../public', demande.file);
      // Supprimer le fichier s'il existe
      if (fs.existsSync(imagePath)) {
        fs.unlink(imagePath, (err) => {
          if (err) {
            console.error("Erreur lors de la suppression du fichier:", err);
          }
        });
      }
    }

    await demande.destroy();
    return res.status(200).json({ message: "Demande et fichier supprimés avec succès." });
  } catch (error) {
    console.error("Erreur lors de la suppression de la demande:", error);
    return res.status(500).json({ message: "Erreur serveur lors de la suppression." });
  }
};































