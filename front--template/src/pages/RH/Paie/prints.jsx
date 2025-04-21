  //   const handlePrint = () => {
  //     const printWindow = window.open("", "_blank");
  //     printWindow.document.write(`
  //     <html>
  //       <head>
  //         <title>Bulletin de Paie</title>
  //         <style>
  //           @page { 
  //             size: A4; 
  //             margin: 15px; /* Ajuste la marge pour éviter le décalage */
  //           }
  //           body { 
  //             font-family: Arial, sans-serif; 
  //             text-align: center; /* Centre tout le contenu */
  //           }
  //           .container { 
  //             width: 90%; /* Réduit la largeur pour éviter le débordement */
  //             max-width: 800px; 
  //             margin: 0 auto; /* Centre la div */
  //             text-align: left; /* Remet le texte à gauche pour éviter le centrage des paragraphes */
  //             box-sizing: border-box; /* Corrige les marges et bordures */
  //           }
  //           .border { 
  //             border: 1px solid #000; 
  //             padding: 10px; 
  //             margin-bottom: 10px; 
  //           }
  //           .text-end { text-align: right; }
  //           .table { 
  //             width: 100%; 
  //             border-collapse: collapse; 
  //           }
  //           .table th, .table td { 
  //             border: 1px solid #000; 
  //             padding: 8px; 
  //           }
  //           .table th { background-color: #f2f2f2; }
  //           .header { 
  //             display: flex; 
  //             justify-content: space-between; 
  //             align-items: center; 
  //           }
  //           .info-section { 
  //             display: flex; 
  //             justify-content: space-between; 
  //           }
  //           .col { 
  //             width: 48%; 
  //           }
  //         </style>
  //       </head>
  //       <body>
  //         <div class="container">
  //           <div class="header mb-4 p-2">
  //             <h5 class="fw-bold text-uppercase">Ecole : ${employe.User?.EcolePrincipal?.nomecole}</h5>
  //             <div>
  //               <p><strong>Adresse :</strong> ${employe.User?.EcolePrincipal?.adresse}</p>
  //               <p><strong>Email :</strong> ${employe.User?.EcolePrincipal?.emailecole}</p>
  //               <p><strong>Téléphone :</strong> ${employe.User?.EcolePrincipal?.telephoneecole}</p>
  //             </div>
  //           </div>

  //           <div class="header border p-2">
  //             <h5 class="fw-bold text-uppercase">Bulletin de paie</h5>
  //             <h6 class="fw-semibold">Période : ${moment(periodePaie.dateDebut).format('DD-MM-YYYY')} - ${moment(periodePaie.dateFin).format('DD-MM-YYYY')}</h6>
  //           </div>

  //           <div class="border p-3">
  //             <div class="info-section">
  //               <div class="col">
  //                 <p><strong>Employé :</strong> ${employe.User?.nom} ${employe.User?.prenom}</p>
  //                 <p><strong>Code :</strong> ${employe.CE}</p>
  //                 <p><strong>Situation familiale :</strong> ${employe.sitfamiliale}</p>
  //                 <p><strong>N° SS :</strong> ${employe.NumAS}</p>
  //               </div>
  //               <div class="col">
  //                 <p><strong>Service :</strong> ${employe.Service?.service}</p>
  //                 <p><strong>Poste :</strong> ${employe.Poste?.poste}</p>
  //                 <p><strong>Date de recrutement :</strong> ${moment(employe.daterecru).format('DD-MM-YYYY')}</p>
  //               </div>
  //             </div>
  //           </div>

  //           <table class="table">
  //             <thead>
  //               <tr>
  //                 <th>Code</th>
  //                 <th>Libellé</th>
  //                 <th>Qte/Base</th>
  //                 <th>Montant</th>
  //                 <th>Gain</th>
  //                 <th>Retenue</th>
  //               </tr>
  //             </thead>
  //             <tbody>
  //               <tr>
  //                 <td>R1000</td>
  //                 <td>Salaire de base</td>
  //                 <td>${employe.nbrJourTravail}</td>
  //                 <td>${(parseFloat(employe.SalairNeg) / parseFloat(employe.nbrJourTravail)).toFixed(2)}</td>
  //                 <td>${employe.SalairNeg}</td>
  //                 <td></td>
  //               </tr>
  //                 <!-- Primes cotisables -->
  //               ${employe.Primes.filter(prime => prime.prime_cotisable).map((prime) => `
  //                 <tr>
  //                   <td>${prime.code}</td>
  //                   <td>${prime.type_prime}</td>
  //                   <td>1</td>
  //                   <td>${(parseFloat(prime.montant) <= 1 && prime.montantType === "pourcentage") ?
  //         (parseFloat(prime.montant) * parseFloat(employe.SalairNeg)).toFixed(2) : parseFloat(prime.montant).toFixed(2)}
  // </td>
  // <td>${(parseFloat(prime.montant) <= 1 && prime.montantType === "pourcentage") ?
  //         (parseFloat(prime.montant) * parseFloat(employe.SalairNeg)).toFixed(2) : parseFloat(prime.montant).toFixed(2)}
  // </td>

  //                   <td></td>
  //                 </tr>
  //               `).join('')}
  //               <tr>
  //                 <td>I50010</td>
  //                 <td>Retenue Sécurité Sociale Mois</td>
  //                 <td>${PourcentageRS}</td>
  //                 <td>${formdata.CotisationS}</td>
  //                 <td></td>
  //                 <td>${formdata.Rss}</td>
  //               </tr>
  //               <tr>

  //                ${employe.Primes.filter(prime => prime.prime_imposable).map((prime) => `
  //                 <tr>
  //                   <td>${prime.code}</td>
  //                   <td>${prime.type_prime}</td>
  //                   <td>1</td>
  //                  <td>${(parseFloat(prime.montant) <= 1 && prime.montantType === "pourcentage") ?
  //             (parseFloat(prime.montant) * parseFloat(employe.SalairNeg)).toFixed(2) : parseFloat(prime.montant).toFixed(2)}
  // </td>
  // <td>${(parseFloat(prime.montant) <= 1 && prime.montantType === "pourcentage") ?
  //             (parseFloat(prime.montant) * parseFloat(employe.SalairNeg)).toFixed(2) : parseFloat(prime.montant).toFixed(2)}
  // </td>

  //                   <td></td>
  //                 </tr>
  //               `).join('')}
  //                 <td>R80008</td>
  //                 <td>Retenue IRG du Mois</td>
  //                 <td>1</td>
  //                 <td>${formdata.SalaireImpos}</td>
  //                 <td></td>
  //                 <td>${formdata.Rirg}</td>

  //                  <!-- Primes non imposables non cotisables -->
  //               ${employe.Primes.filter(prime => !prime.prime_imposable && !prime.prime_cotisable).map((prime) => `
  //                 <tr>
  //                   <td>${prime.code}</td>
  //                   <td>${prime.type_prime}</td>
  //                   <td>1</td>
  //                  <td>${(parseFloat(prime.montant) <= 1 && prime.montantType === "pourcentage") ?
  //                 (parseFloat(prime.montant) * parseFloat(employe.SalairNeg)).toFixed(2) : parseFloat(prime.montant).toFixed(2)}
  //                 </td>
  //                 <td>
  //                 ${(parseFloat(prime.montant) <= 1 && prime.montantType === "pourcentage") ?
  //                 (parseFloat(prime.montant) * parseFloat(employe.SalairNeg)).toFixed(2) : parseFloat(prime.montant).toFixed(2)}
  //                 </td>

  //                   <td></td>
  //                 </tr>
  //               `).join('')}
  //               </tr>
  //             </tbody>
  //             <tfoot>
  //               <tr>
  //                 <td colSpan="4" class="text-end"><strong>Total</strong></td>
  //                 <td><strong>${formdata.SalaireBrut}</strong></td>
  //                 <td><strong>${parseFloat(formdata.Rss) + parseFloat(formdata.Rirg)}</strong></td>
  //               </tr>
  //             </tfoot>
  //           </table>

  //           <h4 class="text-end mt-3"><strong>Net à payer : ${formdata.SalairNet} DZD</strong></h4>
  //         </div>
  //       </body>
  //     </html>
  //   `);
  //     printWindow.document.close();
  //     printWindow.print();
  //   };

  const handlePrint = () => {
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
        .table td {
        border: 1px solid #000; 
          padding: 8px;
          border-bottom: 1px solid #ddd; /* Seulement une bordure en bas */
        }
         .table tr {
        border: none; 
          padding: 8px;
         
        }
          
        .table tr:last-child td {
           border-bottom: none/* Supprime la bordure pour la dernière ligne */
        }
         .table tfoot tr{
           border-left: none;
           border-right: none;
           
        }
         }
        .header { 
          display: flex; 
          justify-content: space-between; 
          align-items: center; 
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
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header mb-4 p-2">
          <h5 class="fw-bold text-uppercase">Ecole : ${employe.User?.EcolePrincipal?.nomecole}</h5>
          <div>
            <p><strong>Adresse :</strong> ${employe.User?.EcolePrincipal?.adresse}</p>
            <p><strong>Email :</strong> ${employe.User?.EcolePrincipal?.emailecole}</p>
            <p><strong>Téléphone :</strong> ${employe.User?.EcolePrincipal?.telephoneecole}</p>
          </div>
        </div>

        <div class="header border p-2">
          <h5 class="fw-bold text-uppercase">Bulletin de paie</h5>
          <h6 class="fw-semibold">Période : ${moment(periodePaie.dateDebut).format('DD-MM-YYYY')} - ${moment(periodePaie.dateFin).format('DD-MM-YYYY')}</h6>
        </div>

        <div class="border p-3">
          <div class="info-section">
            <div class="col">
              <p><strong>Employé :</strong> ${employe.User?.nom} ${employe.User?.prenom}</p>
              <p><strong>Code :</strong> ${employe.CE}</p>
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
            ${employe.Primes.filter(prime => prime.prime_cotisable).map((prime) => `
              <tr>
                <td>${prime.code}</td>
                <td>${prime.type_prime} 
                ${(parseFloat(prime.montant) <= 1 && prime.montantType === "pourcentage") ? 
                 (prime.montant * 100 )+' %': ''}</td>
                <td>1</td>
                <td>${(parseFloat(prime.montant) <= 1 && prime.montantType === "pourcentage") ?
        (parseFloat(prime.montant) * parseFloat(employe.SalairNeg)).toFixed(2) : parseFloat(prime.montant).toFixed(2)}</td>
                <td>${(parseFloat(prime.montant) <= 1 && prime.montantType === "pourcentage") ?
        (parseFloat(prime.montant) * parseFloat(employe.SalairNeg)).toFixed(2) : parseFloat(prime.montant).toFixed(2)}</td>
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
                <td>1</td>
                <td>${(parseFloat(prime.montant) <= 1 && prime.montantType === "pourcentage") ?
            (parseFloat(prime.montant) * parseFloat(employe.SalairNeg)).toFixed(2) : parseFloat(prime.montant).toFixed(2)}</td>
                <td>${(parseFloat(prime.montant) <= 1 && prime.montantType === "pourcentage") ?
            (parseFloat(prime.montant) * parseFloat(employe.SalairNeg)).toFixed(2) : parseFloat(prime.montant).toFixed(2)}</td>
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
                (parseFloat(prime.montant) * parseFloat(employe.SalairNeg)).toFixed(2) : parseFloat(prime.montant).toFixed(2)}</td>
                <td>${(parseFloat(prime.montant) <= 1 && prime.montantType === "pourcentage") ?
                (parseFloat(prime.montant) * parseFloat(employe.SalairNeg)).toFixed(2) : parseFloat(prime.montant).toFixed(2)}</td>
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

  //noveau bltn depaie

    const handlePrintt = () => {
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
                      .MsoNormalTable td, .MsoNormalTable th {
                          border: 1px solid black;
                          padding: 5px;
                      }
                      .MsoNormal {
                          margin: 0;
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
                              <td width="388" valign="top" colspan="3" rowspan="2">
                                  <p class="MsoNormal"><strong>Ecole&nbsp;: ${employe.User?.EcolePrincipal?.nomecole || ''}</strong></p>
                                  <p class="MsoNormal">Adresse&nbsp;: ${employe.User?.EcolePrincipal?.adresse || ''}</p>
                                  <p class="MsoNormal">Téléphone&nbsp;:  ${employe.User?.EcolePrincipal?.telephoneecole}</p>
                                  <p class="MsoNormal">Email&nbsp;: ${employe.User?.EcolePrincipal?.emailecole}</p>
                              </td>
                              <td width="371" valign="top" colspan="3">
                                  <p class="MsoNormal text-center"><strong>BULLETIN DE PAIE</strong></p>
                              </td>
                          </tr>
                          <tr>
                              <td width="371" valign="center" colspan="3">
                                  <p class="MsoNormal"><span>&nbsp;</span></p>
                                  <p class="MsoNormal text-center"><strong>ANNEE&nbsp;: </strong>${moment(periodePaie.dateDebut).format('YYYY')}</p>
                                  <p class="MsoNormal text-center"><strong>Période&nbsp;:${moment(periodePaie.dateDebut).format('DD-MM-YYYY')} - ${moment(periodePaie.dateFin).format('DD-MM-YYYY')}</p>
                                  <p class="MsoNormal text-center">&nbsp;</p>
                              </td>
                          </tr>
                          <tr>
                              <td width="388" valign="top" colspan="3">
                                  <p class="MsoNormal">&nbsp;</p>
                                  <p class="MsoNormal">MATRICULE&nbsp;: <strong>${employe.CE || ''}</strong></p>
                                  <p class="MsoNormal">&nbsp;</p>
                                  <p class="MsoNormal">FONCTION&nbsp;: ${employe.Poste?.poste || ''}</p>
                                  <p class="MsoNormal">&nbsp;</p>
                                  <p class="MsoNormal">JOUR.TRAV: <strong>${employe.nbrJourTravail || ''}</strong></p>
                              </td>
                              <td width="371" valign="top" colspan="3">
                                  <p class="MsoNormal">NOM : ${employe.User?.nom || ''}</p>
                                  <p class="MsoNormal">PRENOM : ${employe.User?.prenom || ''}</p>
                                  <p class="MsoNormal">DATE DE&nbsp;NAISSANCE&nbsp;: ${employe.User?.datenaissance ? moment(employe.User.datenaissance).format('DD/MM/YYYY') : ''}</p>
                                  <p class="MsoNormal">SITUATION FAMILIALE&nbsp;: ${employe.sitfamiliale || ''}</p>
                                  <p class="MsoNormal">DATE ENTRÉE : ${employe.daterecru ? moment(employe.daterecru).format('DD/MM/YYYY') : ''}</p>
                                  <p class="MsoNormal">NUMERO SS&nbsp;: ${employe.NumAS || ''}</p>
                                  <p class="MsoNormal">&nbsp;</p>
                              </td>
                          </tr>
                          <tr>
                              <td width="64" valign="center">
                                  <p class="MsoNormal text-center"><strong>RUB</strong></p>
                              </td>
                              <td width="231" valign="center">
                                  <p class="MsoNormal text-center"><strong>LIBELLE INDEMNITE</strong></p>
                              </td>
                              <td width="92" valign="center">
                                  <p class="MsoNormal text-center"><strong>BASE</strong></p>
                              </td>
                              <td width="89" valign="center">
                                  <p class="MsoNormal text-center"><strong>NOMBRE/TAUX</strong></p>
                              </td>
                              <td width="90" valign="center">
                                  <p class="MsoNormal text-center"><strong>GAINS</strong></p>
                              </td>
                              <td width="191" valign="center">
                                  <p class="MsoNormal text-center"><strong>RETENUES</strong></p>
                              </td>
                          </tr>
                          <tr>
                              <td width="64" valign="top">
                                  <p class="MsoNormal">&nbsp;</p>
                                  <p class="MsoNormal">&nbsp;</p>
                              </td>
                              <td width="231" valign="top">
                                  <p class="MsoNormal">&nbsp;</p>
                                  <p class="MsoNormal">SALAIRE DE BASE</p>
                                  <p class="MsoNormal">&nbsp;</p>
                                  ${employe.Primes.filter(prime => prime.prime_cotisable).map(prime => `
                                      <p class="MsoNormal">${prime.type_prime}</p>
                                      <p class="MsoNormal">&nbsp;</p>
                                  `).join('')}
                                  <p class="MsoNormal">RETENUE COTISATION SS</p>
                                  <p class="MsoNormal">&nbsp;</p>
                                  ${employe.Primes.filter(prime => prime.prime_imposable).map(prime => `
                                      <p class="MsoNormal">${prime.type_prime}</p>
                                      <p class="MsoNormal">&nbsp;</p>
                                  `).join('')}
                                  <p class="MsoNormal">RETENUE IRG</p>
                                  <p class="MsoNormal">&nbsp;</p>
                                  ${employe.Primes.filter(prime => !prime.prime_imposable && !prime.prime_cotisable).map(prime => `
                                      <p class="MsoNormal">${prime.type_prime}</p>
                                      <p class="MsoNormal">&nbsp;</p>
                                  `).join('')}
                                  ${formdata.AutreRetenues ? `
                                      <p class="MsoNormal">${formdata.nomAutreRetenues || 'AUTRE RETENUE'}</p>
                                      <p class="MsoNormal">&nbsp;</p>
                                  ` : ''}
                              </td>
                              <td width="92" valign="top">
                                  <p class="MsoNormal text-right">&nbsp;</p>
                                  <p class="MsoNormal text-center">${parseFloat(employe.SalairNeg || 0).toFixed(2)}</p>
                                  <p class="MsoNormal">&nbsp;</p>
                                  ${employe.Primes.filter(prime => prime.prime_cotisable).map(prime => `
                                      <p class="MsoNormal text-center">${(parseFloat(prime.montant) <= 1 && prime.montantType === "pourcentage" ? 
                                          parseFloat(employe.SalairNeg || 0).toFixed(2) : parseFloat(prime.montant || 0).toFixed(2))}</p>
                                      <p class="MsoNormal">&nbsp;</p>
                                  `).join('')}
                                  <p class="MsoNormal text-center">${parseFloat(employe.SalairNeg || 0).toFixed(2)}</p>
                                  <p class="MsoNormal">&nbsp;</p>
                                  ${employe.Primes.filter(prime => prime.prime_imposable).map(prime => `
                                      <p class="MsoNormal text-center">${(parseFloat(prime.montant) <= 1 && prime.montantType === "pourcentage" ? 
                                          parseFloat(employe.SalairNeg || 0).toFixed(2) : parseFloat(prime.montant || 0).toFixed(2))}</p>
                                      <p class="MsoNormal">&nbsp;</p>
                                  `).join('')}
                                  <p class="MsoNormal text-center">${formdata.SalaireImpos || '0.00'}</p>
                              </td>
                              <td width="89" valign="top">
                                  <p class="MsoNormal text-right">&nbsp;</p>
                                  <p class="MsoNormal text-right">&nbsp;</p>
                                  <p class="MsoNormal">&nbsp;</p>
                                  ${employe.Primes.filter(prime => prime.prime_cotisable).map(prime => `
                                      <p class="MsoNormal text-center">${(parseFloat(prime.montant) <= 1 && prime.montantType === "pourcentage" ? 
                                          (parseFloat(prime.montant)).toFixed(2) : '1')}</p>
                                      <p class="MsoNormal">&nbsp;</p>
                                  `).join('')}
                                  <p class="MsoNormal text-center">${PourcentageRS}</p>
                                  <p class="MsoNormal">&nbsp;</p>
                                  ${employe.Primes.filter(prime => prime.prime_imposable).map(prime => `
                                      <p class="MsoNormal text-center">${(parseFloat(prime.montant) <= 1 && prime.montantType === "pourcentage" ? 
                                          (parseFloat(prime.montant) * 100).toFixed(2) : '1')}</p>
                                      <p class="MsoNormal">&nbsp;</p>
                                  `).join('')}
                                  <p class="MsoNormal text-center">1</p>
                              </td>
                              <td width="90" valign="top">
                                  <p class="MsoNormal text-right">&nbsp;</p>
                                  <p class="MsoNormal text-right">${parseFloat(employe.SalairNeg || 0).toFixed(2)}</p>
                                  <p class="MsoNormal">&nbsp;</p>
                                  ${employe.Primes.filter(prime => prime.prime_cotisable).map(prime => `
                                      <p class="MsoNormal text-right">${(parseFloat(prime.montant) <= 1 && prime.montantType === "pourcentage" ? 
                                          (parseFloat(prime.montant) * parseFloat(employe.SalairNeg || 0)).toFixed(2) : parseFloat(prime.montant || 0).toFixed(2))}</p>
                                      <p class="MsoNormal">&nbsp;</p>
                                  `).join('')}
                                  <p class="MsoNormal text-right">&nbsp;</p>
                                  <p class="MsoNormal">&nbsp;</p>
                                  ${employe.Primes.filter(prime => prime.prime_imposable).map(prime => `
                                      <p class="MsoNormal text-right">${(parseFloat(prime.montant) <= 1 && prime.montantType === "pourcentage" ? 
                                          (parseFloat(prime.montant) * parseFloat(employe.SalairNeg || 0)).toFixed(2) : parseFloat(prime.montant || 0).toFixed(2))}</p>
                                      <p class="MsoNormal">&nbsp;</p>
                                  `).join('')}
                                  <p class="MsoNormal text-right">&nbsp;</p>
                              </td>
                              <td width="191" valign="top">
                                  <p class="MsoNormal text-right">&nbsp;</p>
                                  <p class="MsoNormal text-right">&nbsp;</p>
                                  <p class="MsoNormal text-right">&nbsp;</p>
                                  <p class="MsoNormal text-right">${formdata.Rss || '0.00'}</p>
                                  <p class="MsoNormal text-right">&nbsp;</p>
                                  <p class="MsoNormal text-right">&nbsp;</p>
                                  <p class="MsoNormal text-right">&nbsp;</p>
                                  <p class="MsoNormal text-right">&nbsp;</p>
                                  <p class="MsoNormal text-right">${formdata.Rirg || '0.00'}</p>
                                  ${formdata.AutreRetenues ? `
                                      <p class="MsoNormal text-right">${formdata.AutreRetenues || '0.00'}</p>
                                  ` : ''}
                              </td>
                          </tr>
                          <tr>
                              <td width="478" valign="top" colspan="4">
                                  <p class="MsoNormal text-right"><strong>TOTAL</strong></p>
                                 <small class="MsoNormal text-muted ">SALAIRE DE POSTE<span>&nbsp;</span>: ${parseFloat(formdata.CotisationS || 0).toFixed(2)}</small>
  
                              </td>
                              <td width="90" valign="top">
                                  <p class="MsoNormal text-right ">${formdata.SalaireBrut || '0.00'}</p>
                              </td>
                              <td width="191" valign="top">
                                  <p class="MsoNormal text-right ">${(parseFloat(formdata.Rss || 0) + parseFloat(formdata.Rirg || 0) + parseFloat(formdata.AutreRetenues || 0)).toFixed(2)}</p>
                              </td>
                          </tr>
                          <tr>
                              <td width="760" valign="top" colspan="6">
                                  <p class="MsoNormal text-right"><strong>NET A PAYER: ${formdata.SalairNet || '0.00'}</strong></p>
                                  <p class="MsoNormal">&nbsp;</p>
                              </td>
                          </tr>
                      </tbody>
                  </table>
              </body>
          </html>
      `);
      printWindow.document.close();
      printWindow.print();
  };