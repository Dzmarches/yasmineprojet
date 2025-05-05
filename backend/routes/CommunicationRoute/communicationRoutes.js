import express from 'express';
import { sendEmailsToStudents } from '../../controllers/Communication/CommunicationController.js';

const router = express.Router();

router.post('/send-emails', sendEmailsToStudents);

export default router;