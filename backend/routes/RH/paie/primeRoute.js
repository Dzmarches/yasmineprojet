import express from 'express'
import {AjouterPrime,ListePrime,ModifierPrime,FindPrime,Archiver,AffecterEP,ListeEmployesAvecPrimes,desactiveEP} from '../../../controllers/RH/paie/primeControl.js'


const router =express.Router();

router.post('/ajouter',AjouterPrime);
router.get('/liste',ListePrime);
router.get('/prime/:id',FindPrime);
router.put('/modifierPrime/:id',ModifierPrime);
router.patch('/archiver/:id', Archiver);

// / Route pour affecter des primes à des employés
router.post('/assign', AffecterEP);
router.get('/assigned', ListeEmployesAvecPrimes);
router.post('/unassign', desactiveEP);






export default router;