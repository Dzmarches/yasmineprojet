import EcolePrincipal from '../../../models/EcolePrincipal.js';
import { Ecole, UserEcole } from '../../../models/relations.js';
import Employe from '../../../models/RH/employe.js';
import Prime from '../../../models/RH/paie/Prime.js'
import Prime_Employe from '../../../models/RH/paie/Prime_Employe.js';
import User from '../../../models/User.js';

export const ListePrime=async (req, res) => {
  try {
    const ecoleId = req.user.ecoleId;
   
    const primes = await Prime.findAll(
       { where:{
        ecoleId,
        archiver:0
      },
      order: [['createdAt', 'DESC']],
    include:[
       { model:EcolePrincipal,attributes:['nomecole']}
    ]}
    );
  
    res.status(200).json(primes);
  } catch (error) {
    console.error("Erreur lors de la recuperation:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
}

export const FindPrime=async (req, res) => {
    try {
      const ecoleId = req.user.ecoleId;
      const idPrime= req.params.id;
     
      const primes = await Prime.findOne( { where:{id:idPrime},
      include:[
         { model:EcolePrincipal,attributes:['nomecole']}
      ]}
      );
      
      res.status(200).json(primes);
    } catch (error) {
      console.error("Erreur lors de la recuperation:", error);
      res.status(500).json({ message: "Erreur serveur" });
    }
}

//   export  const ModifierPrime =async(req,res)=>{
//     const { id } = req.params;
//       const updatedData = req.body; 
//       console.log("updatedData", updatedData);
//       try {
//           const [updated] = await Prime.update(updatedData, {
//               where: { id: id }
//           });
//           console.log('upadate is',updated)
//           if (updated) {
//               const updateprime = await Prime.findByPk(id);
//               return res.status(200).json({ message: 'prime mis à jour avec succès', prime: updateprime });
//           }
//       } catch (error) {
//           console.error('Erreur lors de la mise à jour', error);
//           return res.status(500).json({ message: 'Erreur serveur lors de la mise à jour' });
//       }
// }
 export const Archiver = async (req, res) => {
    try {
      const { id } = req.params;
        const prime = await Prime.findByPk(id);
      if (!prime) {
        return res.status(404).json({ message: "Prime non trouvée." });
      }
        await Prime.update(
        { archiver: 1 },
        { where: { id } }
      );
  
      return res.status(200).json({ message: "Prime archivée avec succès." });
    } catch (error) {
      console.error("❌ Erreur lors de l'archivage :", error);
      return res.status(500).json({ message: "Erreur serveur." });
    }
  };
  
  export const AffecterEP=async(req,res)=>{
    const { primeIds, employeeIds } = req.body;
  
    if (!primeIds || !employeeIds || !Array.isArray(primeIds) || !Array.isArray(employeeIds)) {
      return res.status(400).json({ message: 'Les IDs des primes et des employés sont requis sous forme de tableaux.' });
    }
  
    try {
      // Créer les associations dans la table Prime_Employe
      const associations = [];
      for (const primeId of primeIds) {
        for (const employeeId of employeeIds) {
          associations.push({ PrimeId: primeId, EmployeId: employeeId });
        }
      }
  
      // Insérer les associations en une seule requête
      await Prime_Employe.bulkCreate(associations);
  
      res.status(200).json({ message: 'Primes affectées avec succès.' });
    } catch (error) {
      console.error("Erreur lors de l'affectation des primes:", error);
      res.status(500).json({ message: 'Erreur lors de l\'affectation des primes.' });
    }
  
  };
    
  export const ListeEmployesAvecPrimes = async (req, res) => {
    try {
      const ecoleId = req.user.ecoleId; 
      const ecoleeId=req.user.ecoleeId;
      // Récupérer les employés avec leurs primes et les informations associées
      const employesAvecPrimes = await Employe.findAll({
        
        include: [
          {
            model: User,
            attributes: ["nom", "prenom","statuscompte"],
            include: [
              {
                model: Ecole,
                through: UserEcole, 
                attributes: ["id", "nomecole"],
               
              },
            ],
          },
          {
            model: Prime,
            through: Prime_Employe, 
            attributes: ["id", "type_prime", "montant"],
            required:true
          },
        ],
      });
      console.log(employesAvecPrimes)
  
      res.status(200).json(employesAvecPrimes);
    } catch (error) {
      console.error("Erreur lors de la récupération des employés avec leurs primes :", error);
      res.status(500).json({ message: "Erreur serveur." });
    }
  };
  
  export const AjouterPrime = async (req, res) => {
    try {
 
      const ecoleId = req.user.ecoleId;
      const { code, type_prime, montant, prime_cotisable, prime_imposable, montantType
        ,deduire, identifiant_special } = req.body;
  
  
      
      if (!code || !type_prime || !montant || !montantType || !identifiant_special) {
        return res.status(400).json({ message: "Code, type de prime, montant, montantType et identifiant spécial sont obligatoires" });
      }
  
      // Vérifier la validité de 'montantType'
      if (!['montant', 'pourcentage','jour'].includes(montantType)) {
        return res.status(400).json({ message: "Le champ 'montantType' doit être soit 'montant' soit 'pourcentage'" });
      }
  
      // Vérifier si le identifiant est unique
      const existingPrime = await Prime.findOne({ where: { identifiant_special } });
      if (existingPrime) {
        return res.status(400).json({ message: "Ce identifiant de prime existe déjà" });
      }
  
      // Créer la nouvelle prime
      const newPrime = await Prime.create({
        code,
        type_prime,
        montant,
        montantType,  
        identifiant_special, 
        prime_cotisable: JSON.parse(prime_cotisable || "false"),
        prime_imposable: JSON.parse(prime_imposable || "false"),
        deduire: JSON.parse(deduire || "false"),
        ecoleId,
      });
  
      res.status(201).json({ message: "Prime ajoutée avec succès", prime: newPrime });
    } catch (error) {
      console.error("Erreur lors de l'ajout de la prime:", error);
      res.status(500).json({ message: "Erreur serveur" });
    }
  };
  
  export const ModifierPrime = async (req, res) => {
    const { id } = req.params;
    const updatedData = req.body; 
    console.log("updatedData", updatedData);
  
    const { code, type_prime, montant, montantType, identifiant_special, prime_cotisable, prime_imposable,deduire } = updatedData;
    if (!code || !type_prime || !montant || !montantType || !identifiant_special) {
      return res.status(400).json({ message: "Code, type de prime, montant, montantType et identifiant spécial sont obligatoires" });
    }
    if (!['montant', 'pourcentage','jour'].includes(montantType)) {
      return res.status(400).json({ message: "Le champ 'montantType' doit être soit 'montant' soit 'pourcentage'" });
    }
     
  
    try {
      const [updated] = await Prime.update(updatedData, {
        where: { id: id }
      });
  
      console.log('update result:', updated);
  
      if (updated) {
        const updatedPrime = await Prime.findByPk(id);
        return res.status(200).json({ message: 'Prime mise à jour avec succès', prime: updatedPrime });
      } else {
        return res.status(404).json({ message: "Prime non trouvée" });
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour', error);
      return res.status(500).json({ message: 'Erreur serveur lors de la mise à jour' });
    }
  };
  
  
  export const desactiveEP = async (req, res) => {
    try {
      
      const { primeIds, employeeIds } = req.body;
  
      if (!primeIds || !employeeIds || !Array.isArray(primeIds) || !Array.isArray(employeeIds)) {
        return res.status(400).json({ message: 'Les IDs des primes et des employés sont requis sous forme de tableaux.' });
      }
 
      console.log('primeIds desactiveEP',primeIds);
      console.log('employeeIds desactiveEP',employeeIds);
        // Méthode 1: Utilisation directe du modèle de jointure
        await Prime_Employe.destroy({
            where: {
                primeId: primeIds,
                employeId: employeeIds
            }
        });

        // Méthode alternative: Si vous avez bien configuré les associations
        // const employe = await Employe.findByPk(employeId);
        // await employe.removePrimes(primeId); // Notez le 's' à removePrimes

        res.status(200).json({ message: "Prime désaffectée avec succès" });
    } catch (error) {
        console.error("Erreur:", error);
        res.status(500).json({ message: "Erreur serveur" });
    }
};
