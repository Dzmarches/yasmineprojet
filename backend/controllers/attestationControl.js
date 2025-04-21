/////Documents

import Attestation from "../models/Attestation.js";
import dotenv from 'dotenv'
import EcolePrincipal from "../models/EcolePrincipal.js";
import { Ecole } from "../models/relations.js";
dotenv.config();

export const ajouterDE = async (req, res) => {
  try {
    const ecoleId = req.user.ecoleId;   
    const ecoleeId = req.user.ecoleeId; 
    console.log('ecoleeId',ecoleeId)
    const { nom, description, modeleTexte, module } = req.body;
    if (!nom || !module || !modeleTexte) {
      return res.status(400).json({ message: "Nom, module et modèle de texte sont obligatoires." });
    }
    
    const nouvelleAttestation = await Attestation.create({
      nom,
      description: description || "",
      modeleTexte,
      module,ecoleId,ecoleeId
    });

    res.status(201).json({
      message: "Attestation ajoutée avec succès !",
      attestation: nouvelleAttestation
    });
  } catch (error) {
    console.error("Erreur lors de l'ajout de l'attestation :", error);
    res.status(500).json({
      message: "Erreur lors de l'ajout",
      error: error.message
    });
  }
};

export const ListeDE = async (req, res) => {
  try {
    const ecoleId = req.user.ecoleId;   
    const ecoleeId = req.user.ecoleeId; 
    const attestations = await Attestation.findAll(
     {
       where:{ecoleId,archiver:0},
       include:
     [{model:EcolePrincipal,attributes:['nomecole']},
     {model:Ecole,attributes:['nomecole']}]
    }
    );
    if (attestations) {
      return res.status(200).json(attestations);

    } else {
      res.status(404).json({ message: 'not found' });

    }

  } catch (error) {
    console.error("Erreur lors de la récupération des attestations :", error);
    res.status(500).json({
      message: "Erreur lors de la récupération des attestations",
      error: error.message
    });
  }
};

export const InfoDE = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: "L'ID de l'attestation est requis." });
    }

    const attestation = await Attestation.findByPk(id);
    if (!attestation) {
      return res.status(404).json({ message: "Attestation non trouvée." });
    }

    res.status(200).json(attestation);
  } catch (error) {
    console.error("Erreur lors de la récupération de l'attestation :", error);
    res.status(500).json({ message: "Erreur serveur lors de la récupération de l'attestation." });
  }
};

export const ModifierDE = async (req, res) => {
  try {
    const { id } = req.params;
    const { nom, description, modeleTexte, module } = req.body;


    if (!id) {
      return res.status(400).json({ message: "L'ID de l'attestation est requis." });
    }

    const attestation = await Attestation.findByPk(id);

    if (!attestation) {
      return res.status(404).json({ message: "Attestation non trouvée." });
    }


    if (nom) attestation.nom = nom;
    if (description) attestation.description = description;
    if (modeleTexte) attestation.modeleTexte = modeleTexte;
    if (module) attestation.module = module;

    // Sauvegarder les modifications
    await attestation.save();


    res.status(200).json({ message: "Attestation mise à jour avec succès.", attestation });
  } catch (error) {
    console.error("Erreur lors de la mise à jour de l'attestation :", error);
    res.status(500).json({ message: "Erreur serveur lors de la mise à jour de l'attestation." });
  }
};

export const AttestationInfo = async (req, res) => {
  try {
    const { id } = req.params;
    const attestation = await Attestation.findByPk(id);

    if (attestation) {
      return res.status(200).json(attestation);
    } else {
      return res.status(404).json({ message: 'attestation non trouvé' })
    }

  } catch (error) {
    console.log(error)
  }
}

export const uploadImagemodele=async(req,res)=>{
  console.log('rrererrerrre');
  console.log('rererer',req.file);
    if (!req.file) {
      return res.status(400).send('No file uploaded.');
    }
    
    const imageUrl = `http://localhost:${process.env.PORT_SERVER}/attestations/modeles/images/${req.file.filename}`;
    console.log('imageurlesr',imageUrl)
    res.status(200).json({ url: imageUrl });
  
}

export const Archiver = async (req, res) => {
  try {
    const { id } = req.params;
    const hs = await Attestation.findByPk(id);
    if (!hs) {
      return res.status(404).json({ message: "non trouvée." });
    }
      await Attestation.update(
      { archiver: 1 },
      { where: { id } }
    );

    return res.status(200).json({ message: "archivée avec succès." });
  } catch (error) {
    console.error("❌ Erreur lors de l'archivage :", error);
    return res.status(500).json({ message: "Erreur serveur." });
  }
};

