// npm install node-cron


import cron from 'node-cron'
import Pointage from '../models/RH/pointage.js'; 
import Employe from '../models/RH/employe.js';
import moment from 'moment' 
import User from '../models/User.js';
import { Op } from 'sequelize';

// Planification de la tâche à 17h00 chaque jour

  cron.schedule('00 16 * * *', async () => {
    const date = moment().tz('Africa/Algiers').format('YYYY-MM-DD');
    console.log("Tâche lancée pour la date :", date);

  try {

const users=await User.findAll({where:{archiver:0,statuscompte:"activer"}});
const userId=users.map((item)=>item.id);
    const employes = await Employe.findAll({
      where: {
        archiver: 0,
        userId: {
          [Op.in]: userId,
        },
      },
     });
    for (let employe of employes) {

      const pointage = await Pointage.findOne({
        where: { employe_id: employe.id, date },
      });

      if (!pointage) {
        await Pointage.create({
          date,
          statut: 'absent',
          employe_id: employe.id,
          HeureEMP: null,
          HeureSMP: null,
          HeureEAMP: null,
          HeureSAMP: null,
          latlogEMP: null,
          latlogSMP: null,
          latlogEAMP: null,
          latlogSAMP: null,
         type_pointage :"auto"

        });
        continue;
      }

      const aucunPointageFait =
        !pointage.HeureEMP &&
        !pointage.HeureSMP &&
        !pointage.HeureEAMP &&
        !pointage.HeureSAMP;

      if (aucunPointageFait) {
        await pointage.update({ statut: 'absent' });
      }
    }

    console.log("Marquage automatique des absents effectué.");
  } catch (error) {
    console.error("Erreur dans le cron des absents :", error);
  }
});
