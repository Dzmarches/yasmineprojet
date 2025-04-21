// npm install node-cron


import cron from 'node-cron'
import Pointage from '../models/RH/pointage.js'; 
import Employe from '../models/RH/employe.js';
import moment from 'moment' 

// Planification de la tâche à 17h00 chaque jour
cron.schedule('22 14 * * *', async () => {
  const date = moment().format('YYYY-MM-DD');
  console.log('date',date)

  try {

    const employes = await Employe.findAll();
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
