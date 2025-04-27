// routes/moyenneGeneraleRoutes.js
import express from 'express';
import MoyenneGenerale from '../../models/Admin/MoyenneGenerale.js';
import Trimest from '../../models/Admin/Trimest.js';
import { saveBulkMoyennesGenerales } from '../../controllers/Admin/MoyenneGeneraleController.js';

const router = express.Router();

router.post('/save-bulk-generales', saveBulkMoyennesGenerales);

router.get('/eleve/:eleveId/:anneeId/:sectionId', async (req, res) => {
    try {
        const moyennes = await MoyenneGenerale.findAll({
            where: {
                EleveId: req.params.eleveId,
                annescolaireId: req.params.anneeId,
                sectionId: req.params.sectionId
            },
            include: [
                { model: Trimest, attributes: ['id', 'titre'] }
            ]
        });
        
        res.json(moyennes);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
});

export default router;