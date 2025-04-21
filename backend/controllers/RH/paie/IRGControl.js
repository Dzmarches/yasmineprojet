
import IRG from '../../../models/RH/paie/IRG.js'

export const AjouterIRG = async (req, res) => {
  try {
    console.log('reerrererrehello')
    const ecoleId = req.user.ecoleId;
    const { annee_fiscale, tranche_min, tranche_max, taux_imposition, pays } = req.body;

    if (!annee_fiscale || !tranche_min || !tranche_max || !taux_imposition || !pays) {
      return res.status(400).json({ message: "Tous les champs sont obligatoires" });
    }
    // Vérifier si les valeurs numériques sont valides
    if (isNaN(tranche_min) || parseFloat(tranche_min) < 0) {
      return res.status(400).json({ message: "Tranche min invalide" });
    }
    if (isNaN(tranche_max) || parseFloat(tranche_max) <= parseFloat(tranche_min)) {
      return res.status(400).json({ message: "Tranche max doit être supérieure ou égale à la tranche min" });
    }
    if (isNaN(taux_imposition) || parseFloat(taux_imposition) < 0) {
      return res.status(400).json({ message: "Taux d'imposition invalide" });
    }
    // Création du nouvel IRG
    const newIRG = await IRG.create({
      annee_fiscale,
      tranche_min: parseFloat(tranche_min),
      tranche_max: parseFloat(tranche_max),
      taux_imposition: parseFloat(taux_imposition),
      pays,
      ecoleId
    });

    res.status(201).json({ message: "IRG ajouté avec succès", irg: newIRG });
  } catch (error) {
    console.error("Erreur lors de l'ajout de l'IRG:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

export const ListeIRG=async(req,res)=>{
        try {
          const primes = await IRG.findAll(
             { where:{
              archiver:0
            }}
          );
          res.status(200).json(primes);
        } catch (error) {
          console.error("Erreur lors de la recuperation:", error);
          res.status(500).json({ message: "Erreur serveur" });
        }
      }

export const ArchiverIRG = async (req, res) => {
    try {
      const { id } = req.params;
        const irgg = await IRG.findByPk(id);
      if (!irgg) {
        return res.status(404).json({ message: "IRG non trouvée." });
      }
        await IRG.update(
        { archiver: 2},
        { where: { id } }
      );
      return res.status(200).json({ message: "Prime archivée avec succès." });
    } catch (error) {
      console.error("❌ Erreur lors de l'archivage :", error);
      return res.status(500).json({ message: "Erreur serveur." });
    }
  };

  export const ModifierIRG = async (req, res) => {
    try {
      const { id } = req.params; // Récupérer l'ID depuis l'URL
      const { annee_fiscale, tranche_min, tranche_max, taux_imposition, pays } = req.body;
  
      // Vérifier si l'IRG existe
      const existingIRG = await IRG.findByPk(id);
      if (!existingIRG) {
        return res.status(404).json({ message: "IRG non trouvé" });
      }
  
      // Vérification des champs fournis
      const updateData = {};
      
      if (annee_fiscale) {
        if (!/^\d{4}$/.test(annee_fiscale)) {
          return res.status(400).json({ message: "L'année fiscale doit être un nombre à 4 chiffres" });
        }
        updateData.annee_fiscale = annee_fiscale;
      }
  
      if (pays) {
        updateData.pays = pays;
      }
  
      if (tranche_min) {
        if (isNaN(tranche_min) || parseFloat(tranche_min) < 0) {
          return res.status(400).json({ message: "Tranche min invalide" });
        }
        updateData.tranche_min = parseFloat(tranche_min);
      }
  
      if (tranche_max) {
        if (isNaN(tranche_max) || parseFloat(tranche_max) < parseFloat(updateData.tranche_min || existingIRG.tranche_min)) {
          return res.status(400).json({ message: "Tranche max doit être supérieure ou égale à la tranche min" });
        }
        updateData.tranche_max = parseFloat(tranche_max);
      }
  
      if (taux_imposition) {
        if (isNaN(taux_imposition) || parseFloat(taux_imposition) < 0) {
          return res.status(400).json({ message: "Taux d'imposition invalide" });
        }
        updateData.taux_imposition = parseFloat(taux_imposition);
      }
  
      // Effectuer la mise à jour
      await existingIRG.update(updateData);
  
      res.status(200).json({ message: "IRG modifié avec succès", irg: existingIRG });
  
    } catch (error) {
      console.error("Erreur lors de la modification de l'IRG:", error);
      res.status(500).json({ message: "Erreur serveur" });
    }
  };

