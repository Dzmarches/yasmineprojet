import Remarque from '../../models/Admin/Remarque.js';
import EcoleRemarque from '../../models/Admin/EcoleRemarque.js';
import jwt from 'jsonwebtoken';


export const listRemarques = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Token non fourni ou invalide.' });
    }

    const token = authHeader.split(' ')[1];
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const userRole = decodedToken.roles[0];

    let remarques;

    if (userRole === 'AdminPrincipal') {
      remarques = await EcoleRemarque.findAll({
        where: { ecoleId: decodedToken.ecoleId },
        include: [{
          model: Remarque,
          where: { archiver: 0 }
        }]
      });
    } else if (userRole === 'Admin') {
      remarques = await EcoleRemarque.findAll({
        where: { ecoleeId: decodedToken.ecoleeId },
        include: [{
          model: Remarque,
          where: { archiver: 0 }
        }]
      });
    } else {
      return res.status(403).json({ message: 'Accès non autorisé.' });
    }

    // Extraire uniquement les remarques (en supprimant les infos de liaison)
    const formatted = remarques.map(item => item.Remarque);

    res.status(200).json(formatted);
  } catch (error) {
    console.error('Erreur lors de la récupération des remarques:', error);
    if (error.name === 'JsonWebTokenError') {
      res.status(401).json({ message: 'Token invalide.' });
    } else {
      res.status(500).json({ message: 'Erreur serveur lors de la récupération des remarques.' });
    }
  }
};

// Ajouter une remarque
export const addRemarque = async (req, res) => {
  const { remarque } = req.body;

  try {
    // Vérifier et décoder le token
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Token non fourni ou invalide.' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const userRole = decoded.roles[0];

    // Créer la remarque
    const newRemarque = await Remarque.create({ remarque });

    // Créer la liaison dans EcoleRemarque
    if (userRole === 'AdminPrincipal') {
      await EcoleRemarque.create({
        ecoleId: decoded.ecoleId,
        remarqueId: newRemarque.id,
      });
    } else if (userRole === 'Admin') {
      await EcoleRemarque.create({
        ecoleeId: decoded.ecoleeId,
        remarqueId: newRemarque.id,
      });
    } else {
      return res.status(403).json({ message: 'Accès non autorisé.' });
    }

    res.status(201).json(newRemarque);
  } catch (error) {
    console.error('Erreur lors de l’ajout de la remarque :', error);
    res.status(500).json({ message: error.message });
  }
};

// Modifier une remarque
export const updateRemarque = async (req, res) => {
  const { id } = req.params;
  const { remarque } = req.body;

  try {
    const updated = await Remarque.update({ remarque }, { where: { id } });
    if (updated[0] === 0) return res.status(404).json({ message: "Remarque non trouvée" });
    res.status(200).json({ message: "Remarque mise à jour" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Archiver une remarque (0 = active, 1 = archivée, 2 = supprimée)
export const archiveRemarque = async (req, res) => {
  const { id } = req.params;
  const { archiver } = req.body;

  try {
    const updated = await Remarque.update({ archiver }, { where: { id } });
    if (updated[0] === 0) return res.status(404).json({ message: "Remarque non trouvée" });
    res.status(200).json({ message: "Remarque archivée/modifiée" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
