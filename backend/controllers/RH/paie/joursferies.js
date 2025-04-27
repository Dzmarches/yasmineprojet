
import JoursFeries from '../../../models/RH/paie/JoursFeries.js'
import EcolePrincipal from '../../../models/EcolePrincipal.js'

export const AjouterJF= async (req, res) => {
  try {
    const ecoleId = req.user.ecoleId;
    const { nom,date  } = req.body;

    if (!nom || !date ) {
      return res.status(400).json({ message: "nom et date sont obligatoires" });
    }
    const newFJ = await JoursFeries.create({
      date,nom,ecoleId
    });

    res.status(201).json({ message: "jours feries ajouté avec succès"});
  } catch (error) {
    console.error("Erreur lors de l'ajout ", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

export const ListeJF=async(req,res)=>{
        try {
            const ecoleId = req.user.ecoleId;
          const jr = await JoursFeries.findAll(
             {
               where:{
             ecoleId:ecoleId,
              archiver:0
              
            },include:[{model:EcolePrincipal,attributes:['nomecole']}]
          },
           
           
          );
          res.status(200).json(jr);
        } catch (error) {
          console.error("Erreur lors de la recuperation:", error);
          res.status(500).json({ message: "Erreur serveur" });
        }
      }

export const ArchiverJF = async (req, res) => {
    try {
      const { id } = req.params;
      const ecoleId = req.user.ecoleId;
      
        const jf = await JoursFeries.findByPk(id);
      if (!jf) {
        return res.status(404).json({ message: "jf non trouvée." });
      }
        await JoursFeries.update(
        { archiver: 1},
        { where: { id,ecoleId } }
      );
      return res.status(200).json({ message: "archivée avec succès." });
    } catch (error) {
      console.error("❌ Erreur lors de l'archivage :", error);
      return res.status(500).json({ message: "Erreur serveur." });
    }
  };

  export const ModifierJF = async (req, res) => {
    try {
        const { id } = req.params;
        const ecoleId = req.user.ecoleId;
        const { nom, date } = req.body;

        // Vérifier si le jour férié existe
        const jf = await JoursFeries.findByPk(id);
        if (!jf) {
            return res.status(404).json({ message: "Jour férié non trouvé" });
        }

        // Vérifier que le jour férié appartient à la même école
        if (jf.ecoleId !== ecoleId) {
            return res.status(403).json({ message: "Vous n'êtes pas autorisé à modifier ce jour férié" });
        }

        // Vérification des champs fournis et préparation des données à mettre à jour
        const updateData = {};

        if (nom !== undefined) {
            if (typeof nom !== 'string' || nom.trim() === '') {
                return res.status(400).json({ message: "Le nom du jour férié est invalide" });
            }
            updateData.nom = nom.trim();
        }

        if (date !== undefined) {
            // Vérifier que la date est valide
            if (isNaN(Date.parse(date))) {
                return res.status(400).json({ message: "Date invalide" });
            }
            updateData.date = new Date(date);
        }

        // Vérifier qu'au moins un champ a été fourni pour la modification
        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({ message: "Aucune donnée à mettre à jour" });
        }

        // Effectuer la mise à jour
        await jf.update(updateData);

        res.status(200).json({ 
            message: "Jour férié modifié avec succès", 
            jourFerie: jf 
        });

    } catch (error) {
        console.error("Erreur lors de la modification du jour férié:", error);
        res.status(500).json({ message: "Erreur serveur" });
    }
};
