import EcolePrincipal from '../../models/EcolePrincipal.js';
import HeuresSup from '../../models/RH/HeuresSup.js';

export const ListeHeuresup=async (req, res) => {
  try {
    const ecoleId = req.user.ecoleId;
   
    const hps = await HeuresSup.findAll(
       { where:{
        ecoleId,
        archiver:0
      },
    include:[
       { model:EcolePrincipal,attributes:['nomecole']}
    ]
    }
    );
    
    res.status(200).json(hps);
  } catch (error) {
    console.error("Erreur lors de la recuperation:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
}

export const FindHeuresup=async (req, res) => {
    try {
      const ecoleId = req.user.ecoleId;
      const idHs= req.params.id;
     
      const hs = await HeuresSup.findOne( { where:{id:idHs},
      include:[
         { model:EcolePrincipal,attributes:['nomecole']}
      ]}
      );
      
      res.status(200).json(hs);
    } catch (error) {
      console.error("Erreur lors de la recuperation:", error);
      res.status(500).json({ message: "Erreur serveur" });
    }
}


 export const Archiver = async (req, res) => {
    try {
      const { id } = req.params;
      const hs = await HeuresSup.findByPk(id);
      if (!hs) {
        return res.status(404).json({ message: "Heure sup non trouvée." });
      }
        await HeuresSup.update(
        { archiver: 1 },
        { where: { id } }
      );
  
      return res.status(200).json({ message: "Heures Sup archivée avec succès." });
    } catch (error) {
      console.error("❌ Erreur lors de l'archivage :", error);
      return res.status(500).json({ message: "Erreur serveur." });
    }
  };
  

  export const AjouterHeuresup = async (req, res) => {
    try {
      const ecoleId = req.user.ecoleId;
      const { nom , taux} = req.body;
      if (!nom || !taux ) {
        return res.status(400).json({ message: " nom et taux sont obligatoires" });
      }
      // Vérifier si le identifiant est unique
      const existingNom = await HeuresSup.findOne({ where: { nom } });
      if (existingNom) {
        return res.status(400).json({ message: "nom existe déjà" });
      }
      const newHeureSup = await HeuresSup.create({
        taux,
        nom,
        ecoleId,
      });
  
      res.status(201).json({ message: "heures sup ajoutée avec succès"});
    } catch (error) {
      console.error("Erreur lors de l'ajout :", error);
      res.status(500).json({ message: "Erreur serveur" });
    }
  };
  
  export const ModifierHeuresup = async (req, res) => {
    const { id } = req.params;
    const updatedData = req.body; 
    console.log("updatedData", updatedData);
  
    const { nom,taux } = updatedData;
    if (!nom || !taux ) {
      return res.status(400).json({ message: " nom et taux sont obligatoires" });
    }

    try {
      const [updated] = await HeuresSup.update(updatedData, {
        where: { id: id }
      });
  
      console.log('update result:', updated);
  
      if (updated) {
        const updatedPrime = await HeuresSup.findByPk(id);
        return res.status(200).json({ message: ' mise à jour avec succès', heuresp: updatedPrime });
      } else {
        return res.status(404).json({ message: " non trouvée" });
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour', error);
      return res.status(500).json({ message: 'Erreur serveur lors de la mise à jour' });
    }
  };
  