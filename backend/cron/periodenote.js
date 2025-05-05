import cron from 'node-cron';
import PeriodeNote from '../models/Admin/PeriodeNote.js';
import { Op } from 'sequelize';

cron.schedule('0 0 * * *', async () => {
  const now = new Date();
  await PeriodeNote.update(
    { status: false },
    {
      where: {
        dateFinPeriode: {
          [Op.lt]: now
        },
        status: true
      }
    }
  );
  console.log("CRON: Mise à jour exécutée");
});