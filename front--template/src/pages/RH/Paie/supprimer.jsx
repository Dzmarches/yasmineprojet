import React, { useEffect, useState } from 'react';
import axios from 'axios';
import moment from 'moment';
import printer from '../../../assets/imgs/printer.png';
import sauvegarder from '../../../assets/imgs/sauvegarder.png';
import { Spinner } from 'react-bootstrap';


const Bulteins_paieEmploye = ({ employeId, idPeriodepai }) => {

  const [employe, setEmploye] = useState(null);
  const [periodePaie, setPeriodePaie] = useState(null);
  const [listeIRG, setListeIRG] = useState(null);
  const [listepointages, setListepointages] = useState(null);
  const [isRecordExists, setIsRecordExists] = useState(false);
  const [loading, setLoading] = useState(true);

  const PourcentageRS = 0.09;
  const PourcentageAbbatement = 0.4;

  const [formdata, setformdata] = useState({
    Rirg: 0,
    Rss: 0,
    sommePC: 0,
    SalaireBrut: 0,
    TotalPrimeCotisable: 0,
    TotalPrimes: 0,
    CotisationS: 0,
    SalairNet: 0,
    SalaireImpos: 0,
    heureSupOuvrable: 0,
    heureSup: 0,
    jourAbsent: 0,
    AutreRetenues: 0,
    heureAbs: null,
    nomAutreRetenues: '',
    nbrJTM: 0,
    SalairNegAbsc: 0,
    retenueAbs: 0,
    SalaireBase: 0,
    base: 0,
    totalPrimesNonImpoNonCoti: 0,
    heureRetard: 0,
    nbrPresent: 0,
  });

  const [userModified, setUserModified] = useState({
    Rirg: false,
    Rss: false,
    heureSup: false,
    SalaireImpos: false,
  });

  const handelChange = (e) => {
    const { name, value } = e.target;
    // Mettre à jour formdata
    setformdata((prev) => ({ ...prev, [name]: value }));
    // Marquer le champ comme modifié par l'utilisateur
    setUserModified((prev) => ({ ...prev, [name]: true }));
  };

  // // Fonction pour calculer la différence en heures entre deux horaires (format "HH:mm")
  // function diffHeures(heure1, heure2) {
  //   const [h1, m1] = heure1.split(':').map(Number);
  //   const [h2, m2] = heure2.split(':').map(Number);

  //   // Convertir les heures et minutes en minutes totales
  //   const minutes1 = h1 * 60 + m1;
  //   const minutes2 = h2 * 60 + m2;

  //   // Calcul de la différence en minutes (retard seulement si positif)
  //   const diffMinutes = Math.max(0, minutes2 - minutes1);
  //   return diffMinutes / 60; // Convertir en heures
  // }

  function calculerDureeHeures(debut, fin) {
    if (!debut || !fin) return 0;
  
    const [h1, m1, s1] = debut.split(":").map(Number);
    const [h2, m2, s2] = fin.split(":").map(Number);
  
    const date1 = new Date(0, 0, 0, h1, m1, s1);
    const date2 = new Date(0, 0, 0, h2, m2, s2);
  
    let diff = (date2 - date1) / 1000 / 60 / 60; // différence en heures
    return diff > 0 ? diff : 0; // on retourne 0 si la durée est négative
  }
  
  // Fonction pour calculer la différence en heures
  // function calculerDureeHeures(debut, fin) {
  //   const d = moment.duration(moment(fin, "HH:mm").diff(moment(debut, "HH:mm")));
  //   return d.asHours(); // retourne un nombre à virgule (ex: 4.5h)
  // }

  const calculer = () => {
    if (!employe || !employe.Primes) return;
    // let SalaireBase = parseFloat(employe.SalairNeg);
    const nbrJT = parseFloat(employe.nbrJourTravail);
    const nombrepresent = listepointages.filter(pointage => pointage.statut === 'present').length;

//       //  Heures normales de travail par jour
//   const dureeMatinNormale = calculerDureeHeures(employe.HeureEM, employe.HeureSM);
//   const dureeApresMidiNormale = calculerDureeHeures(employe.HeureEAM, employe.HeureSAM);
//   const totalHeuresNormales = dureeMatinNormale + dureeApresMidiNormale;

//    // Calcul des jours travaillés
//   const joursTravailles = listepointages.filter(pointage => {
//     const { HeureEMP, HeureSMP, HeureEAMP, HeureSAMP, statut } = pointage;

//     if (statut !== 'present') {
//       console.log('liste des pointagespresents',listepointages)

//       return false;
//     }
  
//   console.log('liste des pointagespresents',listepointages)

//   // Vérifie si les 4 heures sont bien remplies
//   // if (!HeureEMP || !HeureSMP || !HeureEAMP || !HeureSAMP) {
//   //   return false;
//   // }
//   // 3. Calcul du total travaillé
//   const dureeMatin = calculerDureeHeures(HeureEMP, HeureSMP);
//   console.log('dureeMatin',dureeMatin)
//   const dureeApresMidi = calculerDureeHeures(HeureEAMP, HeureSAMP);
//   console.log('dureeApresMidi',dureeApresMidi)

//   const totalHeuresTravaillees = dureeMatin + dureeApresMidi;
//   console.log('totalHeuresTravaillees',totalHeuresTravaillees)

//   // 4. On compte le jour si le total ≥ heures normales
//   return totalHeuresTravaillees >= totalHeuresNormales;
// }).length;

// console.log("✅ Nombre de jours travaillés dans le mois :", joursTravailles);

 // Tu peux ajuster ce seuil selon les règles


  const dureeMatinNormale = calculerDureeHeures(employe.HeureEM, employe.HeureSM);
  const dureeApresMidiNormale = calculerDureeHeures(employe.HeureEAM, employe.HeureSAM);
  const totalHeuresNormales = dureeMatinNormale + dureeApresMidiNormale;

  console.log('totalHeuresNormales',totalHeuresNormales);

// const joursTravailles = listepointages.filter(pointage => {
//   const { HeureEMP, HeureSMP, HeureEAMP, HeureSAMP, statut } = pointage;

//   if (statut !== 'present' && statut !== 'retard') return false;

//   console.log('pointage',pointage)

//   const dureeMatin = calculerDureeHeures(HeureEMP, HeureSMP);
//   const dureeApresMidi = calculerDureeHeures(HeureEAMP, HeureSAMP);
//   const totalJour = dureeMatin + dureeApresMidi;
//   console.log('totele de jour',totalJour)

//   totalHeuresTravailleesMois += totalJour;

//   // On considère que la journée est comptée si l'employé a fait assez d'heures
//   return totalJour >= totalHeuresNormales;
// }).length;



let seuilDemiJournee;

if (dureeApresMidiNormale < dureeMatinNormale) {
  seuilDemiJournee = dureeApresMidiNormale;
} else {
  seuilDemiJournee = dureeMatinNormale;
}

console.log('seuildemijournee',seuilDemiJournee)

let joursTravaillesPondérés = 0;
let totalHeuresTravailleesMois = 0;
console.log('joursTravaillesPondérés',joursTravaillesPondérés)

listepointages.forEach(pointage => {
  const { HeureEMP, HeureSMP, HeureEAMP, HeureSAMP, statut } = pointage;

  if (!['present', 'retard'].includes(statut)) return;

  const dureeMatin = calculerDureeHeures(HeureEMP, HeureSMP);
  const dureeApresMidi = calculerDureeHeures(HeureEAMP, HeureSAMP);
  const totalJour = dureeMatin + dureeApresMidi;

  console.log("🕓 pointage", pointage);
  console.log("📅 total du jour :", totalJour);

  totalHeuresTravailleesMois += totalJour;

  // Ajout pondéré : 1 jour complet, 0.5 si demi-journée, sinon 0
  if (totalJour >= totalHeuresNormales) {
    joursTravaillesPondérés += 1;
  } else {
    
    joursTravaillesPondérés += 1;
    console.log('joursTravaillesPondérés',joursTravaillesPondérés)

    // joursTravaillesPondérés += 0.5;
  }
});

console.log("✅ Nombre total de jours pondérés :", joursTravaillesPondérés);
console.log("⏱️ Total des heures travaillées :", totalHeuresTravailleesMois.toFixed(2), "heures");



























    //calculer les jours de travaille selon les heures d'entrées et les heures sorties

    const sb = parseFloat(employe.SalairNeg) / nbrJT;
    let SalaireBase = (nombrepresent * sb).toFixed(2);
    const nbrHeureLegal = parseFloat(employe.nbrHeureLegale);
    const nombreHeuresTravailJour = Math.round(nbrHeureLegal / nbrJT);


    //calculer les heures supp
    const heureSupOuvrable = listepointages
      .filter(Heure => Heure.heuresupP)
      .reduce((sum, Heure) => {
        return sum + parseFloat(Heure.heuresupP || 0);
      }, 0);

    //calculer les montants des heures sup et abcences
    const base = ((employe.SalairNeg) / nbrHeureLegal).toFixed(2);
    // console.log('base is ', base)

    //heure sup
    const totalHeuresSup = listepointages
      .filter(item => item.heuresupP && item.HeuresSup)
      .reduce((sum, item) => {
        const heuresSup = parseFloat(item.heuresupP) || 0;
        const taux = parseFloat(item.HeuresSup?.taux) || 0;
        return sum + (heuresSup * base * (1 + taux));
      }, 0);
    // console.log('Total des heures supplémentaires:', totalHeuresSup);

    //en cas abcences :

    //jour en retard :

    // const nbrJretard=listepointages.map((item)=>console.log('teettssete',item.HeureEMP))

    //nombre des jours en abences 
    const nombreAbsences = listepointages.filter(pointage => pointage.statut === 'absent').length;
    //nombre de jour travailler
    const NbrJTM = nbrJT - parseFloat(nombreAbsences);
    if (nombreAbsences) {
      SalaireBase = Abcences(nbrJT, nombreAbsences, nombreHeuresTravailJour, base, SalaireBase, NbrJTM);
    }
    // else {
    //   SalaireBase = parseFloat(employe.SalairNeg);
    // }

    //les primes uniquement cotisables 
    const totalPrimesCotisablesUni = employe.Primes
      .filter((prime) => Number(prime.prime_cotisable) === 1 && Number(prime.prime_imposable) === 0)
      .reduce((sum, prime) => {
        let primeValue = parseFloat(prime.montant || 0);
        if (prime.montantType === "pourcentage" && primeValue < 1) {
          primeValue *= SalaireBase;
        }
        if (prime.montantType === "jour" && prime.deduire == 1) {
          primeValue *= formdata.nbrJTM;
        }
        if (prime.montantType === "jour" && prime.deduire == 0) {
          primeValue *= nbrJT;
        }

        return sum + primeValue;
      }, 0);

    const totalPrimesCotisables = employe.Primes
      .filter((prime) => prime.prime_cotisable)
      .reduce((sum, prime) => {
        let primeValue = parseFloat(prime.montant || 0);
        if (prime.montantType === "pourcentage" && primeValue < 1) {
          primeValue *= SalaireBase;
        }
        if (prime.montantType === "jour" && prime.deduire == 1) {
          primeValue *= formdata.nbrJTM;
        }
        if (prime.montantType === "jour" && prime.deduire == 0) {
          primeValue *= nbrJT;
        }

        return sum + primeValue;
      }, 0);



    const totalPrimess = employe.Primes.reduce((sum, prime) => {
      let primeValue = parseFloat(prime.montant || 0);
      if (prime.montantType === "pourcentage" && primeValue <= 1) {
        primeValue *= SalaireBase;
      }
      if (prime.montantType === "jour" && prime.deduire == 1) {
        primeValue *= formdata.nbrJTM;
      }
      if (prime.montantType === "jour" && prime.deduire == 0) {
        primeValue *= nbrJT;
      }
      return sum + primeValue;
    }, 0);

    const totalPrimesNonImpoNonCoti = employe.Primes.reduce((sum, prime) => {
      let primeValue = parseFloat(prime.montant || 0);
      // Vérifier si la prime est cotisable ou imposable avant de l'ajouter
      if (!prime.prime_cotisable && !prime.prime_imposable) {
        if (prime.montantType === "pourcentage" && primeValue <= 1) {
          primeValue *= SalaireBase;
        }
        if (prime.montantType === "jour" && prime.deduire == 1) {
          primeValue *= formdata.nbrJTM;
        }
        if (prime.montantType === "jour" && prime.deduire == 0) {
          primeValue *= nbrJT;
        }
        return sum + primeValue;
      }
      return sum; // Ne pas ajouter la prime si elle est non cotisable et non imposable
    }, 0);

    // let CotisationS;
    // if (formdata.heureAbs) {
    //   console.log('formdata.AutreRetenues', formdata.heureAbs)
    //   CotisationS = (parseFloat(SalaireBase|| 0) + parseFloat(totalPrimesCotisables) + parseFloat(formdata.heureSup));
    //   console.log('CotisationS', CotisationS);
    // } else {
    //   CotisationS = parseFloat(SalaireBase || 0) + parseFloat(totalPrimesCotisables) + parseFloat(formdata.heureSup);
    //   console.log('CotisationS pas deminuer', CotisationS)

    // }

    const CotisationS = (parseFloat(SalaireBase || 0) + parseFloat(totalPrimesCotisables) + parseFloat(formdata.heureSup));
    const totalPrimes = totalPrimess - totalPrimesNonImpoNonCoti;

    const SalaireBrut = totalPrimes + parseFloat(SalaireBase || 0) + parseFloat(formdata.heureSup || 0);
    // Vérifier si l'utilisateur a déjà modifié Rss, sinon recalculer
    const Rss = userModified.Rss ? parseFloat(formdata.Rss || 0) : CotisationS * PourcentageRS;
    //caluler salaire imposable
    const SalaireImpo = userModified.SalaireImpos ? parseFloat(formdata.SalaireImpos || 0) : SalaireBrut - Rss - totalPrimesCotisablesUni;

    // Vérifier si l'utilisateur a déjà modifié Rirg, sinon utiliser 0
    // const Rirg = userModified.Rirg ? parseFloat(formdata.Rirg || 0) : 0;
    const Rirg = calculerIRG(SalaireImpo, listeIRG, nombreAbsences)
    // plus
    let SalairNet;
    if (formdata.AutreRetenues) {
      SalairNet = (SalaireBrut - Rss - Rirg + totalPrimesNonImpoNonCoti) - parseFloat(formdata.AutreRetenues);
    } else {
      SalairNet = (SalaireBrut - Rss - Rirg + totalPrimesNonImpoNonCoti)

    }

    setformdata((prev) => ({
      ...prev,
      TotalPrimeCotisable: totalPrimesCotisables.toFixed(2),
      TotalPrimes: totalPrimes.toFixed(2),
      SalaireBrut: SalaireBrut.toFixed(2),
      CotisationS: CotisationS.toFixed(2),
      Rss: Rss.toFixed(2),
      Rirg: Rirg.toFixed(2),
      SalairNet: SalairNet.toFixed(2),
      SalaireImpos: SalaireImpo.toFixed(2),
      heureSupOuvrable: heureSupOuvrable,
      jourAbsent: nombreAbsences,
      heureSup: totalHeuresSup.toFixed(2),
      SalaireBase, nbrJTM: NbrJTM,
      base,
      totalPrimesNonImpoNonCoti: totalPrimesNonImpoNonCoti,
      nbrPresent: nombrepresent,
    }));
  };
  const Abcences = (NbrJTM, nombreAbsences, nombreHeuresTravailJour, base, SalaireBase) => {
    //abcese
    //nombre des heure du travail de lemployé par journneer
    const nbrHabscJ = parseFloat(nombreAbsences * nombreHeuresTravailJour)
    const retenueAbs = (base * nbrHabscJ).toFixed(2);
    const SalairNegAbsc = (SalaireBase - retenueAbs).toFixed(2);
    setformdata((prev) => ({ ...prev, retenueAbs, SalairNegAbsc }));
    return SalairNegAbsc;
  }

  const calculerIRG = (salaireImpo, listeIRG, nombreAbsences) => {
    let retenueIRG = 0;
    // Si le salaire imposable est inférieur ou égal à 30 000, pas de retenue IRG
    if (salaireImpo <= 30000 && !nombreAbsences) {
      return 0;
    }
    // Parcourir les tranches IRG
    let somme = 0;
    let lastsomme = 0;

    for (const tranche of listeIRG) {
      const trancheMin = parseFloat(tranche.tranche_min);
      const trancheMax = parseFloat(tranche.tranche_max);
      const tauxImposition = parseFloat(tranche.taux_imposition);
      // Si le salaire imposable est dans cette tranche
      if (salaireImpo >= trancheMin && salaireImpo >= trancheMax) {
        somme = somme + (parseFloat(trancheMax) - parseFloat(trancheMin)) * parseFloat(tauxImposition);
      }
      if (salaireImpo > trancheMin && salaireImpo < trancheMax) {
        lastsomme = (parseFloat(salaireImpo) - parseFloat(trancheMin)) * parseFloat(tauxImposition);
      }
    }
    const sommebareme = parseFloat(somme + lastsomme);
    const abattement = sommebareme * parseFloat(PourcentageAbbatement);

    if (abattement > 1500) {
      const retenueIRG = sommebareme - 1500
      return retenueIRG;

    } else if (abattement > 1000) {
      const retenueIRG = sommebareme - 1000;
      return retenueIRG
    }
    // return retenueIRG;
    return abattement;
  };

  useEffect(() => {
    // console.log('employeId', employeId, "idPeriodepai", idPeriodepai)
    if (employeId && idPeriodepai) {
      const fetchData = async () => {
        try {
          const token = localStorage.getItem("token");
          if (!token) {
            alert("Vous devez être connecté pour accéder à ces informations.");
            setIsRecordExists(true);
            return;
          }
          // Vérifier si l'enregistrement existe déjà
          const recordExistsResponse = await axios.get(
            `http://localhost:5000/BultteinPaie/check-record/${employeId}/${idPeriodepai}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );

          // Mettre à jour l'état si l'enregistrement existe
          if (recordExistsResponse.data.exists) {
            setIsRecordExists(true);
          }
          const [employeRes, periodePaieRes, listeIRG, listepointages] = await Promise.all([
            axios.get(`http://localhost:5000/BultteinPaie/employe/${employeId}`, {
              headers: { Authorization: `Bearer ${token}` },
            }),
            axios.get(`http://localhost:5000/BultteinPaie/periodepaie/${idPeriodepai}`, {
              headers: { Authorization: `Bearer ${token}` },
            }),
            axios.get(`http://localhost:5000/BultteinPaie/IRG/liste/`, {
              headers: { Authorization: `Bearer ${token}` },
            }),
            axios.get(`http://localhost:5000/BultteinPaie/employePointage/${employeId}/${idPeriodepai}`, {
              headers: { Authorization: `Bearer ${token}` },
            }),
          ]);

          // console.log('liste des irgs', listeIRG.data)
          setEmploye(employeRes.data);
          setPeriodePaie(periodePaieRes.data);
          setListeIRG(listeIRG.data);
          // console.log('liste de pointage', listepointages.data)
          setListepointages(listepointages.data)
        } catch (error) {
          console.error("Erreur lors de la récupération des données", error);
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }
  }, [employeId, idPeriodepai]);

  useEffect(() => {
    if (employe && periodePaie) {
      calculer();
    }
  }, [employe, periodePaie, formdata.heureSup, formdata.Rirg,
    formdata.SalaireImpos, formdata.AutreRetenues, formdata.CotisationS, formdata.heureAbs

  ]);



  const generateBulletinHTML = () => {
    return `
     <html>
      <head>
        <title>Bulletin de Paie</title>
        <style>
          @page { 
            size: A4; 
            margin: 15px;
          }
          body { 
            font-family: Arial, sans-serif; 
            text-align: center;
          }
          .container { 
            width: 90%;
            max-width: 800px; 
            margin: 0 auto;
            text-align: left;
            box-sizing: border-box;
          }
          .border { 
            border: 1px solid #000; 
            padding: 10px; 
            margin-bottom: 10px; 
          }
          .text-end { text-align: right; }
          .table { 
            width: 100%; 
            border-collapse: collapse; 
          }
          .table th { 
            border: 1px solid #000; 
            padding: 8px; 
            background-color: #f2f2f2;
          }
         
          /* Bordures verticales uniquement */
          .table td, .table th {
              border-left: 1px solid black;
              border-right: 1px solid black;
              padding: 5px;
          }

          /* Suppression des bordures horizontales */
          .table tr:not(:first-child) td {
              border-top: none;
          }

          .table tr:not(:last-child) td {
              border-bottom: none;
          }

          /* Garder la bordure pour l'en-tête */
          .table tr:first-child th {
              border-top: 1px solid black;
          }

          /* Garder la bordure pour la dernière ligne */
          .table tr:last-child td {
              border-bottom: 1px solid black;
          }
          
          .header { 
            display: flex; 
            justify-content: center; /* Centrage horizontal */
            align-items: center; /* Centrage vertical */
            text-align: center;
          }
          .info-section { 
            display: flex; 
            justify-content: space-between; 
          }
          .col { 
            width: 48%; 
          }
          .no-border {
            border: none !important;
          }
          .dual-container {
            display: flex;
            justify-content: space-between;
           
          }
          .dual-box {
            width: 48%;
            border: 1px solid #000;
            padding: 10px;
          }
          .logo-placeholder {
            width: 100px;
            height: 100px;
            border: 1px dashed #ccc;
            margin: 0 auto 10px auto;
            display: flex;
            align-items: center;
            justify-content: center;
            background-color: #f9f9f9;
          }
        </style>
      </head>
      <body>
        <div class="container">
         
          
          <!-- Deux cadres séparés pour école et période de paie -->
          <div class="dual-container">
            <!-- Cadre des informations de l'école -->
            <div class="dual-box">
              <p><strong>Ecole</strong> ${employe.User?.EcolePrincipal?.nomecole}</p>
              <p><strong>Adresse :</strong> ${employe.User?.EcolePrincipal?.adresse}</p>
            </div>
            <!-- Cadre de la période de paie -->
            <div class="dual-box">
          <div class="logo-placeholder">
             <img src="http://localhost:5000${employe.User?.EcolePrincipal?.logo}" alt="Logo de l'école" style="max-width: 100px; max-height: 100px;">
          </div>
            </div>
          </div>

          <div class="header border text-center p-2">
            <h5 class="fw-bold text-uppercase ">BULLETIN DE PAIE 
             ${new Date(periodePaie.dateDebut).toLocaleDateString('fr-FR', { month: 'long' }).toUpperCase()} -
             ${new Date(periodePaie.dateFin).toLocaleDateString('fr-FR', { month: 'long' }).toUpperCase()}
             ${moment(periodePaie.dateFin).format('YYYY')}
            </h5>
          </div>

          <div class="border p-3">
            <div class="info-section">
              <div class="col">
                <p><strong>Employé :</strong> ${employe.User?.nom} ${employe.User?.prenom}</p>
              <p><strong>Code employé :</strong> ${employe.CE}</p>
                <p><strong>Situation familiale :</strong> ${employe.sitfamiliale}</p>
                <p><strong>N° SS :</strong> ${employe.NumAS}</p>
              </div>
              <div class="col">
                <p><strong>Service :</strong> ${employe.Service?.service}</p>
                <p><strong>Poste :</strong> ${employe.Poste?.poste}</p>
                <p><strong>Date de recrutement :</strong> ${moment(employe.daterecru).format('DD-MM-YYYY')}</p>
              </div>
            </div>
          </div>
          <table class="table">
            <thead>
              <tr>
                <th>Code</th>
                <th>Libellé</th>
                <th>Qte/Base</th>
                <th>Montant</th>
                <th>Gain</th>
                <th>Retenue</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>R1000</td>
                <td>Salaire de base</td>
                <td>${formdata.nbrPresent}</td>
                <td>${(parseFloat(employe.SalairNeg) / parseFloat(employe.nbrJourTravail)).toFixed(2)}</td>
                <td>${formdata.SalaireBase}</td>
                <td></td>
              </tr>
              ${formdata.jourAbsent !== 0 ?
        `
                  <tr>
                    <td>R1000</td>
                    <td>Absences</td>
                    <td>${formdata.jourAbsent}</td>
                    <td>${formdata.base}</td>
                    <td></td>
                    <td>${formdata.retenueAbs}</td>
                    <td></td>
                  </tr>
                `
        : ''
      }
                  ${formdata.jourAbsent !== 0 ?
        `
                                <tr>
                                  <td>R1000</td>
                                  <td>Salaire de base</td>
                                  <td></td>
                                  <td></td>
                                  <td>${formdata.SalaireBase}</td>
                                  <td></td>
                                </tr>
                                    </tr>
                                  `
        : ''
      }
      
        ${formdata.heureSupOuvrable !== 0 ?
        `
                                <tr>
                                  <td>R6000</td>
                                  <td>heures Supplimentaires</td>
                                  <td>${formdata.heureSupOuvrable}</td>
                                  <td>${formdata.heureSup}</td>
                                  <td>${formdata.heureSup}</td>
                                  <td></td>
                                </tr>
                                    </tr>
                                  `
        : ''
      }
              ${employe.Primes.filter(prime => prime.prime_cotisable).map((prime) => `
                <tr>
                  <td>${prime.code}</td>
                  <td>${prime.type_prime}</td>

                 <td>
                 ${(parseFloat(prime.montant) <= 1 && prime.montantType === "pourcentage") ?
          (prime.montant) :
          (prime.montantType === "jour" && prime.deduire == 1) ?
            (formdata.nbrJTM)
            : (prime.montantType === "jour" && prime.deduire == 0) ?
              (employe.nbrJourTravail) :
              parseFloat(prime.montant).toFixed(2)}
                 </td>

                 <td>
  ${prime.montantType === "jour" && prime.deduire == 1
          ? (parseFloat(prime.montant) * parseFloat(formdata.nbrJTM)).toFixed(2)
          : prime.montantType === "jour" && prime.deduire == 0
            ? (parseFloat(prime.montant) * parseFloat(employe.nbrJourTravail)).toFixed(2)
            : (parseFloat(prime.montant) <= 1 && prime.montantType === "pourcentage")
              ? (parseFloat(prime.montant) * parseFloat(formdata.SalaireBase)).toFixed(2)
              : parseFloat(prime.montant).toFixed(2)
        }
</td>

<td>
  ${prime.montantType === "jour" && prime.deduire == 1
          ? (parseFloat(prime.montant) * parseFloat(formdata.nbrJTM)).toFixed(2)
          : prime.montantType === "jour" && prime.deduire == 0
            ? (parseFloat(prime.montant) * parseFloat(employe.nbrJourTravail)).toFixed(2)
            : (parseFloat(prime.montant) <= 1 && prime.montantType === "pourcentage")
              ? (parseFloat(prime.montant) * parseFloat(formdata.SalaireBase)).toFixed(2)
              : parseFloat(prime.montant).toFixed(2)
        }
</td>

                  <td></td>
                </tr>
              `).join('')}
              <tr>
                <td>I50010</td>
                <td>Retenue Sécurité Sociale Mois</td>
                <td>${PourcentageRS}</td>
                <td>${formdata.CotisationS}</td>
                <td></td>
                <td>${formdata.Rss}</td>
              </tr>
              ${employe.Primes.filter(prime => prime.prime_imposable).map((prime) => `
                <tr>
                  <td>${prime.code}</td>
                  <td>${prime.type_prime}</td>
                 <td>
                 ${(parseFloat(prime.montant) <= 1 && prime.montantType === "pourcentage") ?
            (prime.montant) :
            (prime.montantType === "jour" && prime.deduire == 1) ?
              (formdata.nbrJTM)
              : (prime.montantType === "jour" && prime.deduire == 0) ?
                (employe.nbrJourTravail) :
                parseFloat(prime.montant).toFixed(2)}
                 </td>

                 <td>
  ${prime.montantType === "jour" && prime.deduire == 1
            ? (parseFloat(prime.montant) * parseFloat(formdata.nbrJTM)).toFixed(2)
            : prime.montantType === "jour" && prime.deduire == 0
              ? (parseFloat(prime.montant) * parseFloat(employe.nbrJourTravail)).toFixed(2)
              : (parseFloat(prime.montant) <= 1 && prime.montantType === "pourcentage")
                ? (parseFloat(prime.montant) * parseFloat(formdata.SalaireBase)).toFixed(2)
                : parseFloat(prime.montant).toFixed(2)
          }
</td>

<td>
  ${prime.montantType === "jour" && prime.deduire == 1
            ? (parseFloat(prime.montant) * parseFloat(formdata.nbrJTM)).toFixed(2)
            : prime.montantType === "jour" && prime.deduire == 0
              ? (parseFloat(prime.montant) * parseFloat(employe.nbrJourTravail)).toFixed(2)
              : (parseFloat(prime.montant) <= 1 && prime.montantType === "pourcentage")
                ? (parseFloat(prime.montant) * parseFloat(formdata.SalaireBase)).toFixed(2)
                : parseFloat(prime.montant).toFixed(2)
          }
</td>

                  <td></td>
                </tr>
              `).join('')}
              <tr>
                <td>R80008</td>
                <td>Retenue IRG du Mois</td>
                <td>1</td>
                <td>${formdata.SalaireImpos}</td>
                <td></td>
                <td>${formdata.Rirg}</td>
              </tr>
              ${employe.Primes.filter(prime => !prime.prime_imposable && !prime.prime_cotisable).map((prime) => `
                <tr>
                  <td>${prime.code}</td>
                  <td>${prime.type_prime}</td>
                  <td>1</td>
                  <td>${(parseFloat(prime.montant) <= 1 && prime.montantType === "pourcentage") ?
              (parseFloat(prime.montant) * parseFloat(formdata.SalaireBase)).toFixed(2) : parseFloat(prime.montant).toFixed(2)}</td>
                  <td>${(parseFloat(prime.montant) <= 1 && prime.montantType === "pourcentage") ?
              (parseFloat(prime.montant) * parseFloat(formdata.SalaireBase)).toFixed(2) : parseFloat(prime.montant).toFixed(2)}</td>
                  <td></td>
                </tr>
              `).join('')}
              ${formdata.AutreRetenues ? `
                <tr>
                  <td>R90000</td>
                  <td>${formdata.nomAutreRetenues || 'Autre retenue'}</td>
                  <td>1</td>
                  <td>${formdata.AutreRetenues}</td>
                  <td></td>
                  <td>${formdata.AutreRetenues}</td>
                </tr>
              ` : ''}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan="4" class="text-end"><strong>Total</strong></td>
                <td><strong>${parseFloat(formdata.SalaireBrut) + parseFloat(formdata.totalPrimesNonImpoNonCoti)}</strong></td>
                <td><strong>${(parseFloat(formdata.Rss) + parseFloat(formdata.Rirg) + (formdata.AutreRetenues ? parseFloat(formdata.AutreRetenues) : 0)).toFixed(2)}</strong></td>
              </tr>
            </tfoot>
          </table>
          <h4 class="text-end mt-3"><strong>Net à payer : ${formdata.SalairNet} DZD</strong></h4>
        </div>
      </body>
    </html>

    `;
  };

  const handlePrint = async () => {
    // if (!isRecordExists) {
    //   await saveBulletinHTML(employe.id);
    // }
    const bulletinHTML = generateBulletinHTML();
    const printWindow = window.open("", "_blank");
    printWindow.document.write(bulletinHTML);
    printWindow.document.close();
    printWindow.print();
  };



  if (loading) return <Spinner animation="border" variant="primary" style={{ marginTop: '-600px', marginLeft: '50%' }} />

  //  <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
  //   <Spinner animation="border" variant="primary" />
  // </div>;
  if (!employe || !periodePaie) return <p>Erreur lors du chargement des données.</p>;


  const handleSave = async (idEmploye) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Vous devez être connecté pour effectuer cette action.");
      return;
    }
    const bulletinHTML = generateBulletinHTML();

    const dataToSave = {
      periodePaieId: idPeriodepai,
      idEmploye: idEmploye,
      nom_prenom: `${employe.User?.nom} ${employe.User?.prenom}`,
      salaireBase: employe.SalairNeg,
      NVSBaseAbsences: formdata.SalaireBase,
      nbrJrTrvMois: formdata.nbrPresent,
      salaireNet: formdata.SalairNet,
      salaireBrut: formdata.SalaireBrut,
      cotisations: formdata.CotisationS,
      SalaireImposable: formdata.SalaireImpos,
      RetenueIRG: formdata.Rirg,
      nbrHRetard: 0,
      RetenueSS: formdata.Rss,
      heuresSup: formdata.heureSupOuvrable,
      joursAbsence: formdata.jourAbsent,
      AutreRetenues: formdata.AutreRetenues,
      NomAutreRetenues: formdata.nomAutreRetenues,
      AbsenceRetenues: formdata.retenueAbs,
      GeinheuresSup: formdata.heureSup,
      bulletin_html: bulletinHTML,
    };

    try {
      const response = await axios.post('http://localhost:5000/BultteinPaie/journalPaie', dataToSave, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.status === 200) {
        alert("Bulletin de paie enregistré avec succès !");
        setIsRecordExists(true);

      }
    } catch (error) {
      console.error("Erreur lors de l'enregistrement du bulletin de paie", error);
      alert("Une erreur s'est produite lors de l'enregistrement.");
    }
  };

  return (
    <div className="modal fade" id="modal-bp" tabIndex="-1" aria-labelledby="modal-default-label" aria-hidden="true">
      <div className="modal-dialog modal-xl modal-dialog-scrollable">
        <div className="modal-content">
          <div className="modal-header bg-info text-white">
            <div className="widget-user-header d-flex align-items-center">
              <button className='btn btn-app p-1' onClick={handlePrint}>
                <img src={printer} alt="" width="30px" /><br />Imprimer
              </button>
              {/* <button className='btn btn-app p-1 ml-2' title='Enregistrer dans journal de paie' onClick={handleSave}>
                <img src={sauvegarder} alt="" width="30px" /><br />Enregistrer 
              </button> */}

              {periodePaie.statut === "Ouverte" ?
                <button
                  className='btn btn-app p-1 ml-2'
                  title='Enregistrer dans journal de paie'
                  onClick={() => handleSave(employe.id)}
                // disabled={isRecordExists}>
                >
                  <img src={sauvegarder} alt="" width="30px" /><br />
                  Validation de la paie
                </button> : ''
              }

            </div>
            <button type="button" className="close text-white" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div className="modal-body">
            {/* Informations Personnelles */}
            <h5 className="custom-title mb-4">Bulletins de paie periode: {moment(periodePaie.dateDebut).format('DD-MM-YYYY')} - {moment(periodePaie.dateFin).format('DD-MM-YYYY')}</h5>
            <div className="card shadow-lg border-0 rounded-lg p-4 mb-4">
              <div className="row">
                <div className="col-md-2">
                  <h6 className="font-weight-bold">Employé</h6>
                  <p>{employe.User?.nom} {employe.User?.prenom}</p>
                </div>
                <div className="col-md-2">
                  <h6 className="font-weight-bold">Code</h6>
                  <p>{employe.CE}</p>
                </div>
                <div className="col-md-2">
                  <h6 className="font-weight-bold">Situation familiale</h6>
                  <p>{employe.sitfamiliale}</p>
                </div>
                <div className="col-md-2">
                  <h6 className="font-weight-bold">Numero d'assurance sociale</h6>
                  <p>{employe.NumAS}</p>
                </div>
                <div className="col-md-2">
                  <h6 className="font-weight-bold">Poste attribué</h6>
                  <p>{employe.Poste ? employe.Poste.poste : 'pas  de poste '}</p>
                </div>
                <div className="col-md-2">
                  <h6 className="font-weight-bold">Service</h6>
                  <p>{employe.Service?.service}</p>
                </div>
                <div className="col-md-2">
                  <h6 className="font-weight-bold">Salaire de base</h6>
                  <p>{employe.SalairNeg}</p>
                </div>
              </div>
              <hr />
              {/* liste des primes employés */}
              {employe.Primes && employe.Primes.length > 0 && (
                <div className="row mt-3">
                  <h5 >Primes de l'employé :</h5>
                  <table className="table table-bordered">
                    <thead className="thead-light">
                      <tr>
                        <th>Code</th>
                        <th>Type</th>
                        <th>Montant</th>
                        <th>Type de Montant</th>
                        <th>Imposable</th>
                        <th>Cotisable</th>
                        <th>Retenue Absence</th>
                      </tr>
                    </thead>
                    <tbody>
                      {employe.Primes.map((prime) => (
                        <tr key={prime.id}>
                          <td>{prime.code}</td>
                          <td>{prime.type_prime}</td>
                          <td>
                            {prime.montant}
                            {prime.montantType === "pourcentage" && parseFloat(prime.montant) <= 1 && (
                              <div style={{ fontSize: "12px", color: "gray" }}>
                                ({(parseFloat(prime.montant) * parseFloat(formdata.SalaireBase)).toFixed(2)} )
                              </div>
                            )}
                            {(prime.montantType === "jour" && prime.deduire == 1) && (
                              <div style={{ fontSize: "12px", color: "gray" }}>
                                ({(parseFloat(prime.montant) * parseFloat(formdata.nbrJTM)).toFixed(2)} )
                              </div>
                            )}
                            {(prime.montantType === "jour" && prime.deduire == 0) && (
                              <div style={{ fontSize: "12px", color: "gray" }}>
                                ({(parseFloat(prime.montant) * parseFloat(employe.nbrJourTravail)).toFixed(2)} )
                              </div>
                            )}

                          </td>
                          <td>{prime.montantType}</td>
                          <td>{prime.prime_imposable ? "Oui" : "Non"}</td>
                          <td>{prime.prime_cotisable ? "Oui" : "Non"}</td>
                          <td>{prime.deduire ? "Oui" : "Non"}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tr>
                      <td style={{ color: 'green' }}>Total des Primes :</td>
                      <td style={{ color: 'green' }}>{formdata.TotalPrimes}</td>
                      <td style={{ color: 'green' }}>Total des primes cotisables :</td>
                      <td style={{ color: 'green' }}>{formdata.TotalPrimeCotisable}</td>
                    </tr>
                  </table>
                </div>
              )}
              <hr />

              <div className="row">
                <h5 className="w-100 mb-3"> Autres :</h5>
                <div className="col-md-3">
                  <p> nombre de jours de travail </p>
                  <input type="number" className="form-control" name="nbrJour" read value={employe.nbrJourTravail} readOnly onChange={handelChange} />
                </div>
                <div className="col-md-3">
                  <p>Heures de travail par  mois</p>
                  <input type="number" className="form-control" name="htm" value={employe.nbrHeureLegale} readOnly onChange={handelChange} />
                </div>
                <div className="col-md-3">
                  <p> Nbr jours de travail pour ce mois </p>
                  <input type="number" className="form-control" name="nbrPresent" read value={formdata.nbrPresent} readOnly onChange={handelChange} />
                </div>

                <div className="col-md-3">
                  <p>Nombre des heures  supplémentaire</p>
                  <input type="number" className="form-control" readOnly name="heureSupOuvrable" value={formdata.heureSupOuvrable} onChange={handelChange} />
                  <small className='text-muted'>
                    {(() => {
                      const heuresParType = {};
                      listepointages.forEach(item => {
                        if (item.heuresupP && item.HeuresSup?.nom) {
                          const type = item.HeuresSup.nom;
                          heuresParType[type] = (heuresParType[type] || 0) + item.heuresupP;
                        }
                      });
                      return Object.entries(heuresParType).map(([type, total]) => (
                        <p key={type}>{total} : {type}</p>
                      ));
                    })()}
                  </small>
                </div>
                <div className="col-md-3">
                  <p>Nombre de jours d'absence</p>
                  <input type="number" className="form-control" name="jourAbsent" value={formdata.jourAbsent} onChange={handelChange} />
                </div>

                <div className="col-md-3">
                  <p>Nombre des heures en retard</p>
                  <input type="number" className="form-control" name="heureRetard" value={formdata.heureRetard} onChange={handelChange} />
                </div>
              </div>
              <hr />

              <div className="row w-100">
                <h5 className="w-100 mb-3 text-green"> Calculer :</h5>

                <div className="col-md-4 mt-3">
                  <h6 className="font-weight-bold"> Salaire de base </h6><br />
                  <input type="number" className="form-control" name="SalairNeg" readOnly value={formdata.SalaireBase} onChange={handelChange} />
                </div>
                <div className="col-md-4 mt-3">
                  <h6 className="font-weight-bold">Nouveau Salaire de base en cas d'absence </h6><br />
                  <input type="number" className="form-control" name="SalairNegAbsc" readOnly value={formdata.SalairNegAbsc} onChange={handelChange} />
                </div>

                <div className="col-md-4 mt-3">
                  <h6 className="font-weight-bold"> Montant total des heures <br /> supplémentaires</h6>
                  <input type="number" className="form-control" name="heureSup" value={formdata.heureSup} onChange={handelChange} />
                </div>
                <div className="col-md-4 mt-3">
                  <h6 className="font-weight-bold"> Montant à déduire en raison des heures d'absence <br /></h6>
                  <input type="number" className="form-control" name="retenueAbs" value={formdata.retenueAbs} onChange={handelChange} />
                </div>

                <div className="col-md-4  mt-3">
                  <h6 className="font-weight-bold">Cotisations Sociale ou Salaire de Poste</h6>
                  <input type="number" className="form-control" name="CotisationS" readOnly value={formdata.CotisationS} onChange={handelChange} />
                  <small>Salaire Base + Primes Cotisables +heures Supplimentaires</small>
                </div>

                <div className="col-md-4 mt-3">
                  <h6 className="font-weight-bold"> Salaire Brut </h6>
                  <input type="number" className="form-control" readOnly name="SalaireBrut" value={formdata.SalaireBrut} />
                  <small>Salaire Base +Total  Primes + Heures Supplimentaires</small>
                </div>

                <div className="col-md-4  mt-3">
                  <h6 className="font-weight-bold"> Salaire Imposable </h6>
                  <input type="number" className="form-control" readOnly name="SalaireImpos" value={formdata.SalaireImpos} />
                  <small>Salaire Brut-Retenue Sécurité Sociale Mois</small>
                  <small style={{ color: 'red' }}>  .{parseFloat(employe.SalaireImpos) <= 30000 ? "pas IRG" : "appliquer IRG"}</small>
                </div>
              </div>
              <hr />

              {/* Les retenues */}
              <div className="row w-100">
                <h5 className="w-100 mb-3 text-red">Les retenues :</h5><br />
                <div className="col-md-3">
                  <h6 className="font-weight-bold">Retenue Sécurité Sociale Mois</h6>
                  <input type="number" className="form-control" readOnly name="Rss" value={formdata.Rss} onChange={handelChange} />
                  <small> Cotisations Sociale * {PourcentageRS}</small>
                </div>

                <div className="col-md-3">
                  <h6 className="font-weight-bold">Retenue IRG du Mois</h6>
                  <input type="number" className="form-control" readOnly name="Rirg" value={formdata.Rirg} onChange={handelChange} />
                </div>

                <div className="col-md-3">
                  <h6 className="font-weight-bold">Autres retenues</h6>
                  <input type="number" className="form-control" name='AutreRetenues' value={formdata.AutreRetenues} onChange={handelChange} />
                </div>
                <div className="col-md-3">
                  <h6 className="font-weight-bold">Nom de la  retenue</h6>
                  <input type="text" className="form-control" name='nomAutreRetenues' value={formdata.nomAutreRetenues} onChange={handelChange} />
                </div>
              </div>
              <hr />

              <div className="row w-100">
                <h5 className="w-100 mb-3 text-primary">Salaire Net :</h5>
                <div className="col-md-6">
                  <h6 className="font-weight-bold">Salaire Net</h6>
                  <input type="number" className="form-control" readOnly name="SalairNet" value={formdata.SalairNet} onChange={handelChange} />
                  <small> Salaire Brut - Retenue Sécurité Sociale Mois - Retenue IRG du Mois</small>
                </div>
              </div>
              <hr />

              {/* liste des primes employés */}
              {listeIRG && listeIRG.length > 0 && (
                <div className="row mt-3">
                  <h4 >Barème IRG algerie :</h4>
                  <table className="table table-bordered">
                    <thead className="thead-light">
                      <tr>
                        <th>Tranche Minimale</th>
                        <th>Tranche Maximale</th>
                        <th>Taux Imposition</th>
                        <th>Année Fiscale</th>
                        <th>Pays</th>
                      </tr>
                    </thead>
                    <tbody>
                      {listeIRG.map((item) => (
                        <tr key={item.id}>
                          <td>{item.tranche_min}</td>
                          <td>{item.tranche_max}</td>
                          <td>{item.taux_imposition}</td>
                          <td>{item.annee_fiscale}</td>
                          <td>{item.pays}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              <hr />

            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Bulteins_paieEmploye;