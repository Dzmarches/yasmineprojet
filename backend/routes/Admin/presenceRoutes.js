import express from 'express';
import { savePresences, getPresencesByDate } from '../../controllers/Admin/presenceController.js';
import multer from 'multer';

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ 
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // Limite de 5MB
    }
});

router.post('/', upload.any(), savePresences);
router.get('/date/:date', getPresencesByDate);
export default router;
