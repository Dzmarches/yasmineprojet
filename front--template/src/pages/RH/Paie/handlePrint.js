import moment from 'moment';

export const handlePrint = (currentItems) => {
    if (!currentItems || currentItems.length === 0) return;
    
     // Calcul du total des salaires nets
     const totalSalaireNet = currentItems.reduce((total, item) => total + parseFloat(item.salaireNet), 0);

    const printWindow = window.open("", "", "width=900,height=800");
    printWindow.document.write(`
        <html>
            <head>
                <title>Journal de Paie</title>
                <style>
                    @page { margin: 0; }
                    body {
                        font-family: "Times New Roman", Times, serif;
                        padding: 20px;
                        background-color: #f9f9f9;
                    }
                    .header-info {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        background:rgba(238, 239, 240, 0.88);
                        color: black;
                        padding: 15px;
                        font-size: 16px;
                        font-weight: bold;
                        margin-bottom: 20px;
                        border-radius: 8px;
                    }
                    .header-left, .header-right {
                        width: 48%;
                    }
                    .header-left div, .header-right div {
                        margin-bottom: 5px;
                    }
                    .bulletin {
                        margin-bottom: 20px;
                        padding: 10px;
                        border: 1px solid #ddd;
                        border-radius: 8px;
                        background: #fff;
                        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
                    }
                    .salary-details table {
                        width: 100%;
                        border-collapse: collapse;
                        margin-top: 10px;
                    }
                    .salary-details th {
                        background:rgba(238, 239, 240, 0.88);
                        color: black;
                        padding: 10px;
                        text-align: center;
                        font-size: 14px;
                    }
                    .salary-details td {
                        text-align: center;
                        padding: 8px;
                        border: 1px solid #ddd;
                        font-size: 14px;
                    }
                    .salary-details tr:nth-child(even) {
                        background: #f2f2f2;
                    }
                </style>
            </head>
            <body>
                <!-- En-tête : Infos de l'école et de la période séparées gauche/droite -->
                <div class="header-info">
                    <div class="header-left">
                        <div><strong>Ecole :</strong> ${currentItems[0]?.PeriodePaie?.EcolePrincipal?.nomecole}</div>
                        <div><strong>Période de Paie :</strong> 
                            ${new Date(currentItems[0]?.PeriodePaie?.dateDebut).toLocaleDateString('fr-FR', { month: 'long' }).toUpperCase()} - 
                            ${new Date(currentItems[0]?.PeriodePaie?.dateFin).toLocaleDateString('fr-FR', { month: 'long' }).toUpperCase()}
                        </div>
                    </div>
                    <div class="header-right">
                        <div><strong>Code Période :</strong> ${currentItems[0]?.PeriodePaie?.code}</div>
                        <div><strong>Date :</strong> ${moment().format('YYYY-MM-DD')}</div>
                        
                    </div>
                </div>

                <!-- Liste des employés avec leurs bulletins de paie -->
                ${currentItems.map((item) => `
                    <div class="bulletin">
                        <div class="salary-details">
                            <table>
                                <tr>
                                    <th><strong>Nom et Prénom</strong></th>
                                    <td>${item.nom_prenom}</td>
                                    <th><strong>Salaire Net</strong></th>
                                    <td><strong>${item.salaireNet.toLocaleString()} DA</strong></td>
                                    <th>Salaire de Base</th>
                                    <td>${item.salaireBase.toLocaleString()} DA</td>
                                </tr>
                            </table>

                            <table>
                                <thead>
                                    <tr>
                                        <th>Salaire de base du mois</th>
                                        <th>Salaire Brut</th>
                                        <th>Cotisations</th>
                                        <th>Salaire Imposable</th>
                                        <th>Retenue IRG</th>
                                        <th>Retenue SS</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>${item.NVSBaseAbsences.toLocaleString()} DA</td>
                                        <td>${item.salaireBrut.toLocaleString()} DA</td>
                                        <td>${item.cotisations.toLocaleString()} DA</td>
                                        <td>${item.SalaireImposable.toLocaleString()} DA</td>
                                        <td>${item.RetenueIRG.toLocaleString()} DA</td>
                                        <td>${item.RetenueSS.toLocaleString()} DA</td>
                                    </tr>
                                </tbody>
                            </table>

                            <table>
                                <thead>
                                    <tr>
                                        <th>Jours travaillés</th>
                                        <th>Heures Sup</th>
                                        <th>Jours d'Absence</th>
                                        <th>Jours en retard</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                       
                                        <td>${item.nbrJrTrvMois}</td>
                                         <td>${item.heuresSup}</td>
                                        <td>${item.joursAbsence}</td>
                                        <td>${item.nbrHRetard}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                `).join('')}
                 <!-- Total général -->
                <div class="total-summary">
                    <strong>Total des Salaires Nets : ${totalSalaireNet.toLocaleString()} DA</strong>
                </div>
            </body>
        </html>
    `);

    printWindow.document.close();
    printWindow.print();
};

// tttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttt
const handlePrintbe = () => {
    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
        <html>
            <head>
                <title>Bulletin de Paie</title>
                <style>
                    @page { 
                        size: A4; 
                        margin: 15px;
                    }
                    body { 
                        font-family: "Times New Roman"; 
                    }

                    .MsoNormalTable {
                        width: 100%;
                        border-collapse: collapse;
                    }

                    /* Bordures verticales uniquement */
                    .MsoNormalTable td, .MsoNormalTable th {
                        border-left: 1px solid black;
                        border-right: 1px solid black;
                        padding: 5px;
                    }

                    /* Suppression des bordures horizontales */
                    .MsoNormalTable tr:not(:first-child) td {
                        border-top: none;
                    }

                    .MsoNormalTable tr:not(:last-child) td {
                        border-bottom: none;
                    }

                    /* Garder la bordure pour l'en-tête */
                    .MsoNormalTable tr:first-child th {
                        border-top: 1px solid black;
                    }

                    /* Garder la bordure pour la dernière ligne */
                    .MsoNormalTable tr:last-child td {
                        border-bottom: 1px solid black;
                         border-top: 1px solid black !important;
                    }

                    /* Ajouter une bordure en haut pour la ligne avant le total */
                    .border-top td {
                        border-top: 1px solid black !important;
                    }

                    .text-center {
                        text-align: center;
                    }
                    .text-right {
                        text-align: right;
                    }
                </style>
            </head>
            <body>
                <table class="MsoNormalTable" border="1" cellspacing="0">
                    <tbody>
                        <tr>
                            <td colspan="3" rowspan="2">
                                <p><strong>Ecole : ${employe.User?.EcolePrincipal?.nomecole || ''}</strong></p>
                                <p>Adresse : ${employe.User?.EcolePrincipal?.adresse || ''}</p>
                                <p>Téléphone : ${employe.User?.EcolePrincipal?.telephoneecole}</p>
                                <p>Email : ${employe.User?.EcolePrincipal?.emailecole}</p>
                            </td>
                            <td colspan="3" class="text-center">
                                <strong>BULLETIN DE PAIE</strong>
                            </td>
                        </tr>
                        <tr>
                            <td colspan="3" class="text-center">
                                <p><strong>ANNEE : </strong>${moment(periodePaie.dateDebut).format('YYYY')}</p>
                                <p><strong>Période : </strong>${moment(periodePaie.dateDebut).format('DD-MM-YYYY')} - ${moment(periodePaie.dateFin).format('DD-MM-YYYY')}</p>
                            </td>
                        </tr>
                        <tr>
                            <td colspan="3">
                                <p>MATRICULE : <strong>${employe.CE || ''}</strong></p>
                                <p>FONCTION : ${employe.Poste?.poste || ''}</p>
                                <p>JOUR.TRAV: <strong>${employe.nbrJourTravail || ''}</strong></p>
                            </td>
                            <td colspan="3">
                                <p>NOM : ${employe.User?.nom || ''}</p>
                                <p>PRENOM : ${employe.User?.prenom || ''}</p>
                                <p>DATE DE NAISSANCE : ${employe.User?.datenaissance ? moment(employe.User.datenaissance).format('DD/MM/YYYY') : ''}</p>
                                <p>SITUATION FAMILIALE : ${employe.sitfamiliale || ''}</p>
                                <p>DATE ENTRÉE : ${employe.daterecru ? moment(employe.daterecru).format('DD/MM/YYYY') : ''}</p>
                                <p>NUMERO SS : ${employe.NumAS || ''}</p>
                            </td>
                        </tr>
                        <tr>
                            <th>Code</th>
                            <th>LIBELLE</th>
                            <th>BASE</th>
                            <th>TAUX</th>
                            <th>GAINS</th>
                            <th>RETENUES</th>
                        </tr>
                        <tr>
                            <td>R1000</td>
                            <td>SALAIRE DE BASE</td>
                            <td class="text-center"></td>
                            <td></td>
                            <td class="text-right">${parseFloat(employe.SalairNeg || 0).toFixed(2)}</td>
                            <td></td>
                        </tr>
                        ${employe.Primes.map(prime => `
                              <tr>
                                <td>${prime.code}</td>
                                <td>${prime.type_prime}</td>
                                <td class="text-center">${prime.montantType === "pourcentage" ? parseFloat(employe.SalairNeg || 0).toFixed(2) : parseFloat(prime.montant || 0).toFixed(2)}</td>
                                <td class="text-center">${prime.montantType === "pourcentage" ? parseFloat(prime.montant * 100).toFixed(2) : '1'}</td>
                                <td class="text-right">${prime.montantType === "pourcentage" ? (parseFloat(prime.montant) * parseFloat(employe.SalairNeg || 0)).toFixed(2) : parseFloat(prime.montant || 0).toFixed(2)}</td>
                                <td></td>
                            </tr>
                        `).join('')}
                        <tr>
                            <td>R200</td>
                            <td>RETENUE COTISATION SS</td>
                            <td></td>
                            <td class="text-center">${PourcentageRS}%</td>
                            <td></td>
                            <td class="text-right">${formdata.Rss || '0.00'}</td>
                        </tr>
                        <tr>
                            <td>R300</td>
                            <td>RETENUE IRG</td>
                            <td></td>
                            <td class="text-center">1</td>
                            <td></td>
                            <td class="text-right">${formdata.Rirg || '0.00'}</td>
                        </tr>
                        ${formdata.AutreRetenues ? `
                            <tr>
                                <td>R400</td>
                                <td>${formdata.nomAutreRetenues || 'AUTRE RETENUE'}</td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td class="text-right">${formdata.AutreRetenues || '0.00'}</td>
                            </tr>
                        ` : ''}
                        <tr class="border-top">
                           <td colspan="2" class="text-right"><strong>SALAIRE DE POSTE:${formdata.CotisationS}</strong></td>
                            <td class="text-right"colspan="2" class="text-right"><strong>TOTAL</strong></td>
                            <td class="text-right">${formdata.SalaireBrut || '0.00'}</td>
                            <td class="text-right">${(parseFloat(formdata.Rss || 0) + parseFloat(formdata.Rirg || 0) + parseFloat(formdata.AutreRetenues || 0)).toFixed(2)}</td>
                        </tr>
                        <tr>
                            <td colspan="6" class="text-right"><strong>NET A PAYER: ${formdata.SalairNet || '0.00'}</strong></td>
                        </tr>
                    </tbody>
                </table>
            </body>
        </html>
    `);
    printWindow.document.close();
    printWindow.print();
};
// tzzzzzzzzzzzzzzzzzzz
const handlePrintz = () => {
    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
        <html>
            <head>
                <title>Bulletin de Paie</title>
                <style>
                    @page { 
                        size: A4; 
                        margin: 15px;
                    }
                    body { 
                        font-family: "Times New Roman"; 
                    }

                    .MsoNormalTable {
                        width: 100%;
                        border-collapse: collapse;
                    }

                    /* Bordures verticales uniquement */
                    .MsoNormalTable td, .MsoNormalTable th {
                        border-left: 1px solid black;
                        border-right: 1px solid black;
                        padding: 5px;
                    }

                    /* Suppression des bordures horizontales */
                    .MsoNormalTable tr:not(:first-child) td {
                        border-top: none;
                    }

                    .MsoNormalTable tr:not(:last-child) td {
                        border-bottom: none;
                    }

                    /* Garder la bordure pour l'en-tête */
                    .MsoNormalTable tr:first-child th {
                        border-top: 1px solid black;
                    }

                    /* Garder la bordure pour la dernière ligne */
                    .MsoNormalTable tr:last-child td {
                        border-bottom: 1px solid black;
                         border-top: 1px solid black !important;
                    }

                    /* Ajouter une bordure en haut pour la ligne avant le total */
                    .border-top td {
                        border-top: 1px solid black !important;
                    }

                    .text-center {
                        text-align: center;
                    }
                    .text-right {
                        text-align: right;
                    }
                </style>
            </head>
            <body>
                <table class="MsoNormalTable" border="1" cellspacing="0">
                    <tbody>
                        <tr>
                            <td colspan="3" rowspan="2">
                                <p><strong>Ecole : ${employe.User?.EcolePrincipal?.nomecole || ''}</strong></p>
                                <p>Adresse : ${employe.User?.EcolePrincipal?.adresse || ''}</p>
                                <p>Téléphone : ${employe.User?.EcolePrincipal?.telephoneecole}</p>
                                <p>Email : ${employe.User?.EcolePrincipal?.emailecole}</p>
                            </td>
                            <td colspan="3" class="text-center">
                                <strong>BULLETIN DE PAIE</strong>
                            </td>
                        </tr>
                        <tr>
                            <td colspan="3" class="text-center">
                                <p><strong>ANNEE : </strong>${moment(periodePaie.dateDebut).format('YYYY')}</p>
                                <p><strong>Période : </strong>${moment(periodePaie.dateDebut).format('DD-MM-YYYY')} - ${moment(periodePaie.dateFin).format('DD-MM-YYYY')}</p>
                            </td>
                        </tr>
                        <tr>
                            <td colspan="3">
                                <p>MATRICULE : <strong>${employe.CE || ''}</strong></p>
                                <p>FONCTION : ${employe.Poste?.poste || ''}</p>
                                <p>JOUR.TRAV: <strong>${employe.nbrJourTravail || ''}</strong></p>
                            </td>
                            <td colspan="3">
                                <p>NOM : ${employe.User?.nom || ''}</p>
                                <p>PRENOM : ${employe.User?.prenom || ''}</p>
                                <p>DATE DE NAISSANCE : ${employe.User?.datenaissance ? moment(employe.User.datenaissance).format('DD/MM/YYYY') : ''}</p>
                                <p>SITUATION FAMILIALE : ${employe.sitfamiliale || ''}</p>
                                <p>DATE ENTRÉE : ${employe.daterecru ? moment(employe.daterecru).format('DD/MM/YYYY') : ''}</p>
                                <p>NUMERO SS : ${employe.NumAS || ''}</p>
                            </td>
                        </tr>
                        <tr>
                            <th>Code</th>
                            <th>LIBELLE</th>
                            <th>BASE</th>
                            <th>TAUX</th>
                            <th>GAINS</th>
                            <th>RETENUES</th>
                        </tr>
                        <tr>
                            <td>R1000</td>
                            <td>SALAIRE DE BASE</td>
                            <td class="text-center"></td>
                            <td></td>
                            <td class="text-right">${parseFloat(employe.SalairNeg || 0).toFixed(2)}</td>
                            <td></td>
                        </tr>
                        ${employe.Primes.map(prime => `
                              <tr>
                                <td>${prime.code}</td>
                                <td>${prime.type_prime}</td>
                                <td class="text-center">${prime.montantType === "pourcentage" ? parseFloat(employe.SalairNeg || 0).toFixed(2) : parseFloat(prime.montant || 0).toFixed(2)}</td>
                                <td class="text-center">${prime.montantType === "pourcentage" ? parseFloat(prime.montant * 100).toFixed(2) : '1'}</td>
                                <td class="text-right">${prime.montantType === "pourcentage" ? (parseFloat(prime.montant) * parseFloat(employe.SalairNeg || 0)).toFixed(2) : parseFloat(prime.montant || 0).toFixed(2)}</td>
                                <td></td>
                            </tr>
                        `).join('')}
                        <tr>
                            <td>R200</td>
                            <td>RETENUE COTISATION SS</td>
                            <td></td>
                            <td class="text-center">${PourcentageRS}%</td>
                            <td></td>
                            <td class="text-right">${formdata.Rss || '0.00'}</td>
                        </tr>
                        <tr>
                            <td>R300</td>
                            <td>RETENUE IRG</td>
                            <td></td>
                            <td class="text-center">1</td>
                            <td></td>
                            <td class="text-right">${formdata.Rirg || '0.00'}</td>
                        </tr>
                        ${formdata.AutreRetenues ? `
                            <tr>
                                <td>R400</td>
                                <td>${formdata.nomAutreRetenues || 'AUTRE RETENUE'}</td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td class="text-right">${formdata.AutreRetenues || '0.00'}</td>
                            </tr>
                        ` : ''}
                        <tr class="border-top">
                           <td colspan="2" class="text-right"><strong>SALAIRE DE POSTE:${formdata.CotisationS}</strong></td>
                            <td class="text-right"colspan="2" class="text-right"><strong>TOTAL</strong></td>
                            <td class="text-right">${formdata.SalaireBrut || '0.00'}</td>
                            <td class="text-right">${(parseFloat(formdata.Rss || 0) + parseFloat(formdata.Rirg || 0) + parseFloat(formdata.AutreRetenues || 0)).toFixed(2)}</td>
                        </tr>
                        <tr>
                            <td colspan="6" class="text-right"><strong>NET A PAYER: ${formdata.SalairNet || '0.00'}</strong></td>
                        </tr>
                    </tbody>
                </table>
            </body>
        </html>
    `);
    printWindow.document.close();
    printWindow.print();
};

//handle print de bultein de paie 
  const handlePrintb = (currentItems) => {
    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
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
            [LOGO DE L'ÉCOLE]
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
                <td>${employe.nbrJourTravail}</td>
                <td>${(parseFloat(employe.SalairNeg) / parseFloat(employe.nbrJourTravail)).toFixed(2)}</td>
                <td>${employe.SalairNeg}</td>
                <td></td>
              </tr>
             
              
              ${
                formdata.jourAbsent !== 0 
                ? `
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
              <tr>
                <td>R1000</td>
                <td>Salaire de base</td>
                <td></td>
                <td></td>
                <td>${formdata.SalaireBase}</td>
                <td></td>
              </tr>
              
              
             
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
                <td><strong>${formdata.SalaireBrut}</strong></td>
                <td><strong>${(parseFloat(formdata.Rss) + parseFloat(formdata.Rirg) + (formdata.AutreRetenues ? parseFloat(formdata.AutreRetenues) : 0))}</strong></td>
              </tr>
            </tfoot>
          </table>
  
          <h4 class="text-end mt-3"><strong>Net à payer : ${formdata.SalairNet} DZD</strong></h4>
        </div>
      </body>
    </html>
  `);
    printWindow.document.close();
    printWindow.print();
  };

  