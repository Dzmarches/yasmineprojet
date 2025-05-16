import EcolePrincipal from '../../../models/EcolePrincipal.js';
import { Ecole, UserEcole } from '../../../models/relations.js';
import ParametereRetard from '../../../models/RH/paie/ParametereRetard.js';
import User from '../../../models/User.js';

export const Liste=async (req, res) => {
  try {
    const ecoleId = req.user.ecoleId;
    const PR = await ParametereRetard.findAll(
       { where:{
        ecoleId,
        archiver:0
      },
      order: [['createdAt', 'DESC']],
    include:[
       { model:EcolePrincipal,attributes:['nomecole']}
    ]}
    );

    res.status(200).json(PR);
  } catch (error) {
    console.error("Erreur lors de la recuperation:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
}

 export const Archiver = async (req, res) => {
    try {
      const { id } = req.params;
        const PR = await ParametereRetard.findByPk(id);
      if (!PR) {
        return res.status(404).json({ message: " non trouvée." });
      }
        await PR.update(
        { archiver: 1 },
        { where: { id } }
      );
  
      return res.status(200).json({ message: " archivée avec succès." });
    } catch (error) {
      console.error("❌ Erreur lors de l'archivage :", error);
      return res.status(500).json({ message: "Erreur serveur." });
    }
  };

  
  export const Ajouter = async (req, res) => {
    try {

      const ecoleId = req.user.ecoleId;
      const { HE, Rmax, Rmin, statut} = req.body;
 
  
      
      if ( !Rmax || !Rmin || !statut) {
        return res.status(400).json({ message: "les champs sont obligatoires" });
      }


      const newER = await ParametereRetard.create({ HE, Rmax, Rmin, statut, ecoleId, });
  
      res.status(201).json({ message: " ajoutée avec succès", newER: newER });
    } catch (error) {
      console.error("Erreur lors de l'ajout de la :", error);
      res.status(500).json({ message: "Erreur serveur" });
    }
  };
  
  export const Modifier = async (req, res) => {
    const { id } = req.params;
    const updatedData = req.body; 

    // console.log("updatedData", updatedData);

    const {Rmax ,Rmin ,statut} = updatedData;
    if ( !Rmax || !Rmin || !statut) {
      return res.status(400).json({ message: "les champs sont obligatoires" });
    }
  
    try {
      const [updated] = await ParametereRetard.update(updatedData, {
        where: { id: id }
      });
      // console.log('update result:', updated);
  
      if (updated) {
        const updatePR = await ParametereRetard.findByPk(id);
        return res.status(200).json({ message: "mise à jour avec succès", updatePR: updatePR });
      } else {
        return res.status(404).json({ message: "non trouvée" });
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour', error);
      return res.status(500).json({ message: 'Erreur serveur lors de la mise à jour' });
    }
  };
  
