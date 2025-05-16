//Documents

import Attestation from "../models/Attestation.js";
import dotenv from 'dotenv'
import EcolePrincipal from "../models/EcolePrincipal.js";
import { Ecole } from "../models/relations.js";
import { Op } from "sequelize";
dotenv.config();

export const ajouterDE = async (req, res) => {
  try {
    const ecoleId = req.user.ecoleId;   
    const ecoleeId = req.user.ecoleeId; 
    const { nom, description, modeleTexte, module ,code} = req.body;

    if (!nom || !module || !modeleTexte || !code) {
      return res.status(400).json({ message: "Nom, module,code et modèle de texte sont obligatoires." });
    }

    const existAttestation = await Attestation.findOne({
      where: {code} 
    });
    if (existAttestation) {
      return res.status(409).json({ message: "Ce code existe déjà" });
    }
    const nouvelleAttestation = await Attestation.create({
      nom,
      code,
      description: description || "",
      modeleTexte,
      module,ecoleId,ecoleeId
    });

    res.status(201).json({
      message: "Document ajoutée avec succès !",
      attestation: nouvelleAttestation
    });
  } catch (error) {
    console.error("Erreur lors de l'ajout du document :", error);
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
    console.error("Erreur lors de la récupération des documents :", error);
    res.status(500).json({
      message: "Erreur lors de la récupération des documents",
      error: error.message
    });
  }
};

export const InfoDE = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: "L'ID du l'document est requis." });
    }

    const attestation = await Attestation.findByPk(id);
    if (!attestation) {
      return res.status(404).json({ message: "document non trouvée." });
    }
    res.status(200).json(attestation);
  } catch (error) {
    console.error("Erreur lors de la récupération du document :", error);
    res.status(500).json({ message: "Erreur serveur lors de la récupération du document." });
  }
};

export const ModifierDE = async (req, res) => {
  try {
    const { id } = req.params;
    const { nom, description, modeleTexte, module,code } = req.body;
    if (!id) {
      return res.status(400).json({ message: "L'ID du document est requis." });
    }

    const attestation = await Attestation.findByPk(id);
    if (!attestation) {
      return res.status(404).json({ message: "document non trouvée." });
    }

    if (!nom || !module || !modeleTexte || !code) {
      return res.status(400).json({ message: "Nom, module,code et modèle de texte sont obligatoires." });
    }

    const existAttestation = await Attestation.findOne({
      where: {
        code,
        id: { [Op.ne]: id }, 
      },
    });
    
    if (existAttestation) {
      return res.status(409).json({ message: "Ce code existe déjà pour un autre document." });
    }
    
    if (nom) attestation.nom = nom;
    if (description) attestation.description = description;
    if (modeleTexte) attestation.modeleTexte = modeleTexte;
    if (module) attestation.module = module;
    if (code) attestation.code = code;

    // Sauvegarder les modifications
    await attestation.save();

    res.status(200).json({ message: "document mise à jour avec succès.", attestation });
  } catch (error) {
    console.error("Erreur lors de la mise à jour du document :", error);
    res.status(500).json({ message: "Erreur serveur lors de la mise à jour du document." });
  }
};

export const AttestationInfo = async (req, res) => {
  try {
    const { id } = req.params;
    const attestation = await Attestation.findByPk(id);
    if (attestation) {
      return res.status(200).json(attestation);
    } else {
      return res.status(404).json({ message: 'document non trouvé' })
    }
  } catch (error) {
    console.log(error)
  }
}

export const uploadImagemodele=async(req,res)=>{

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

