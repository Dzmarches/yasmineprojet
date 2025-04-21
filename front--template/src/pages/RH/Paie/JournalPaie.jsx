import React, { useEffect, useState } from 'react';
import print from '../../../assets/imgs/printer.png';
import { Link } from 'react-router-dom';
import annuler from '../../../assets/imgs/annuler.png';
import axios from 'axios';
import moment from 'moment';
import recherche from '../../../assets/imgs/recherche.png';
import prime from '../../../assets/imgs/primee.png';
import excel from '../../../assets/imgs/excel.png'
import Journalpaie from '../../../assets/imgs/JournalPaie.png'
import Select from 'react-select';
import { Modal, Button } from 'react-bootstrap';
import deletee from '../../../assets/imgs/delete.png';
import { handlePrint } from './handlePrint';
import * as XLSX from 'xlsx';


const JournalPaie = () => {
    const [data, setData] = useState([]);
    const [primeId, setprimeId] = useState(null);
    const [demandeIdToDelete, setDemandeIdToDelete] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [periodesPaie, setPeriodesPaie] = useState([]);

    //afficher les colonnes

    const [columnVisibility, setColumnVisibility] = useState({
        id: true,
        EcoleP: true,
        actions: true,
        PeriodePaie: true,
        Code_paie: true,
        nom_prenom: true,
        salaireBase: false,
        salaireNet: true,
        salaireBrut: false,
        cotisations: false,
        SalaireImposable: false,
        RetenueIRG: false,
        RetenueSS: false,
        heuresSupWeekEnd: false,
        heuresSupOuvrable: false,
        joursAbsence: false,
        date: true,

    });

    useEffect(() => {
        ListeJP();
    }, []);

    const ListeJP = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                alert("Vous devez être connecté ");
                return;
            }
            const response = await axios.get(`http://localhost:5000/BultteinPaie/liste/`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            if (response.status === 200 && Array.isArray(response.data)) {
                console.log('responsedate', response.data)
                setData(response.data);
            } else {
                console.error("Les données ne sont pas un tableau !");
            }
        } catch (error) {
            console.log(error);
        }
    };



    const fetchPeriodesPaie = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                alert("Vous devez être connecté");
                return;
            }
            const response = await axios.get("http://localhost:5000/PeriodePaie/liste", {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });
            setPeriodesPaie(response.data);
        } catch (error) {
            console.error("Erreur lors de la récupération des périodes de paie", error);
        }
    };
    useEffect(() => {
        fetchPeriodesPaie();
    }, []);

    const [periodeSelectionnee, setPeriodeSelectionnee] = useState(null);
    const handlePeriodeChange = (selectedOption) => {
        setPeriodeSelectionnee(selectedOption.value);
    }
    const handleClose = () => setShowDeleteModal(false);
    const handleShow = (id) => {
        setDemandeIdToDelete(id);
        setShowDeleteModal(true);
    };
    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const filteredData = data.filter(item => {
        const matchesPeriode = !periodeSelectionnee || item.PeriodePaie?.id === periodeSelectionnee;
    
        const periodePaieString = item.PeriodePaie
            ? `${new Date(item.PeriodePaie.dateDebut).toLocaleDateString('fr-FR', { month: 'long' }).toUpperCase()} - ${new Date(item.PeriodePaie.dateFin).toLocaleDateString('fr-FR', { month: 'long' }).toUpperCase()}`
            : '';
    
        const search = searchTerm.toLowerCase().trim();
    
        const matchesSearchTerm = search === '' || (
            (item.Code_paie && item.Code_paie.toLowerCase().includes(search)) ||
            (item.nom_prenom && item.nom_prenom.toLowerCase().includes(search)) ||
            (item.salaireNet && item.salaireNet.toString().toLowerCase().includes(search)) ||
            (item.salaireBase && item.salaireBase.toString().includes(search)) ||
            (item.salaireBrut && item.salaireBrut.toString().includes(search)) ||
            (item.cotisations && item.cotisations.toString().includes(search)) ||
            (item.SalaireImposable && item.SalaireImposable.toString().includes(search)) ||
            (item.RetenueIRG && item.RetenueIRG.toString().includes(search)) ||
            (item.RetenueSS && item.RetenueSS.toString().includes(search)) ||
            (item.heuresSupWeekEnd && item.heuresSupWeekEnd.toString().includes(search)) ||
            (item.heuresSupOuvrable && item.heuresSupOuvrable.toString().includes(search)) ||
            (item.joursAbsence && item.joursAbsence.toString().includes(search)) ||
            (periodePaieString && periodePaieString.toLowerCase().includes(search)) ||
            (item.date && item.date.toString().includes(search)) ||
            (
                item.Employe?.declaration !== undefined &&
                (
                    (search === 'oui' && item.Employe.declaration === true) ||
                    (search === 'non' && item.Employe.declaration === false)
                )
            ) ||
            (
                item.Employe?.User?.statuscompte !== undefined &&
                (
                    (search === 'employé' && item.Employe.User.statuscompte.toLowerCase() === 'activer') ||
                    (search === 'non employé' && item.Employe.User.statuscompte.toLowerCase() === 'désactiver')
                )
            )
        );
    
        return matchesPeriode && matchesSearchTerm;
    });
    
    

    // Composant pour basculer la visibilité des colonnes
    const ColumnVisibilityFilter = ({ columnVisibility, setColumnVisibility }) => {
        const columns = [
            { key: "id", label: "Id" },
            { key: "EcoleP", label: "EcolePrincipale" },
            { key: "PeriodePaie", label: "Periode Paie: " },
            { key: "Code_paie", label: "Code paie" },
            { key: "nom_prenom", label: "Nom Prenom: " },
            { key: "salaireBase", label: "salaire Base" },
            { key: "salaireBaseAbsences", label: "Salaire de Base du Mois" },
            { key: "salaireNet", label: "salaire Net" },
            { key: "salaireBrut", label: "salaire Brut" },
            { key: "cotisations", label: "cotisations" },
            { key: "SalaireImposable", label: "salaire Imposable" },
            { key: "RetenueIRG", label: "Retenue IRG" },
            { key: "RetenueSS", label: "Retenue Sécurité Sociale" },
            { key: "heuresSup", label: "heures Sup" },
            { key: "heuresSupM", label: "Montant heures Sup" },
            { key: "jourtravaille", label: "nbr Jour travaillés" },
            { key: "joursAbsence", label: "joursAbsence" },
            // { key: "RetenueAbsence", label: "Retenue d'Absence" },
            { key: "nbrheureretard", label: "nbr heures retard" },
            { key: "AutreRetenue", label: "Autres Retenues" },
            { key: "date", label: "date" },
            { key: "actions", label: "actions" },



        ];
        // Fonction pour gérer la sélection/désélection des colonnes
        const handleSelectChange = (selectedOptions) => {
            const newColumnVisibility = { ...columnVisibility };
            // Met à jour l'état columnVisibility en fonction des options sélectionnées
            columns.forEach(({ key }) => {
                newColumnVisibility[key] = selectedOptions.some(option => option.value === key);
            });
            setColumnVisibility(newColumnVisibility);
        };
        return (
            <div className="mb-3">
                <h6>Choisir les colonnes à afficher :</h6>
                <Select
                    isMulti
                    options={columns.map(({ key, label }) => ({
                        value: key,
                        label: label,
                    }))}
                    value={columns
                        .filter(({ key }) => columnVisibility[key])
                        .map(({ key, label }) => ({
                            value: key,
                            label: label,
                        }))}
                    onChange={handleSelectChange}
                    placeholder="Choisir les colonnes à afficher"
                    isClearable={false}
                />
            </div>
        );
    };
    // Pagination
    const itemsPerPage = 15;
    const [currentPage, setCurrentPage] = useState(1);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = Array.isArray(filteredData) ? filteredData.slice(indexOfFirstItem, indexOfLastItem) : [];
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);

    const pageNumbers = [];
    for (let i = Math.max(1, currentPage - 2); i <= Math.min(currentPage + 2, totalPages); i++) {
        pageNumbers.push(i);
    }

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    // Dans votre composant JournalPaie
    const handlePrintClick = () => {
        if (!periodeSelectionnee) {
            alert("Veuillez sélectionner une période de paie avant d'imprimer.");
            return;
        }
        handlePrint(currentItems, columnVisibility);
    };

   
    // const handlePrintClick2 = () => {
    //     if (!periodeSelectionnee) {
    //         alert("Veuillez sélectionner une période de paie avant d'imprimer.");
    //         return;
    //     }
    //     if (!currentItems || currentItems.length === 0) return;

    //     // Récupérer toutes les tables dans bulletinHTML
    //     const bulletinHTML = currentItems
    //         .map((item) => item.bulletin_html)
    //         .join('');

    //         console.log('bulletinHTML',bulletinHTML)
    //         console.log('currentItems',currentItems)
    //     // Extraire uniquement la table de bulletinHTML
    //     const parser = new DOMParser();
    //     const doc = parser.parseFromString(bulletinHTML, "text/html");
    //     const tables = doc.querySelectorAll("table");
    //     let tablesHTML = "";
    //     let totalNetAPayer = 0;
    //     let totalgains = 0;
    //     let totalretenues = 0;

    //     currentItems.forEach((item, index) => {
    //         const table = tables[index];
    //         if (table) {
    //             // Extraire le poste depuis le bulletin HTML
    //             const posteMatch = item.bulletin_html.match(/<strong>Poste :<\/strong>([^<]+)/);
    //             const poste = posteMatch ? posteMatch[1].trim() : "Poste non spécifié";
    //             // Ajouter la colonne supplémentaire dans l'en-tête
    //             const headerRow = table.querySelector("thead tr");
    //             if (headerRow) {
    //                 const newHeader = document.createElement("th");
    //                 newHeader.textContent = "Employé";
    //                 newHeader.style.border = "1px solid black";
    //                 headerRow.insertBefore(newHeader, headerRow.firstChild);
    //                 // Ajuster les colspan dans la ligne de total
    //                 const footerRow = table.querySelector("tfoot tr");
    //                 if (footerRow) {
    //                     const footerCol = footerRow.querySelector("td[colspan]");
    //                     if (footerCol) {
    //                         const currentColspan = parseInt(footerCol.getAttribute("colspan")) || 4;
    //                         footerCol.setAttribute("colspan", currentColspan + 1);
    //                     }
    //                 }
    //             }
    //             // Compter le nombre de lignes dans le corps
    //             const bodyRows = table.querySelectorAll("tbody tr");
    //             const rowCount = bodyRows.length;

    //             // Ajouter les cellules avec rowspan et bordures
    //             if (rowCount > 0) {
    //                 const firstRow = bodyRows[0];
    //                 const newCell = document.createElement("td");
    //                 newCell.rowSpan = rowCount;
    //                 newCell.style.verticalAlign = "top";
    //                 newCell.style.borderLeft = "1px solid black";
    //                 newCell.style.borderRight = "1px solid black";
    //                 newCell.style.borderBottom = "1px solid black";
    //                 newCell.innerHTML = `<strong>${item.nom_prenom}</strong><br/>${poste}`;
    //                 firstRow.insertBefore(newCell, firstRow.firstChild);

    //                 // Ajouter les bordures manquantes
    //                 firstRow.querySelectorAll("td").forEach(td => {
    //                     td.style.borderTop = "1px solid black";
    //                 });

    //                 // Gérer les colspan dans les lignes existantes
    //                 bodyRows.forEach(row => {
    //                     const cols = row.querySelectorAll("td");
    //                     if (cols.length > 0) {
    //                         const lastCol = cols[cols.length - 1];
    //                         if (lastCol.hasAttribute("colspan")) {
    //                             const colspan = parseInt(lastCol.getAttribute("colspan")) || 1;
    //                             lastCol.setAttribute("colspan", colspan);
    //                         }
    //                     }
    //                 });
    //             }

    //             // Ajouter le net à payer
    //             const netAPayer = parseFloat(item.salaireNet).toFixed(2);
    //             totalNetAPayer += parseFloat(item.salaireNet);
    //             // totalgains += parseFloat(item.salaireBrut);
    //             totalretenues += parseFloat(item.RetenueIRG) + parseFloat(item.RetenueSS) + parseFloat(item.AutreRetenues);
    //             // const totalGains=parseFloat(item.salaireBrut).toFixed(2)
    //             tablesHTML += table.outerHTML;
    //             tablesHTML += `<p class="text-end" style="margin: 17px 0 15px 0; font-size:15px"><strong>Net à payer: ${netAPayer} DZD</strong></p>`;
    //         }
    //     });

    //     const totalNetAPayerFormatted = totalNetAPayer.toFixed(2);
    //     const totalretenuesFormatted = totalretenues.toFixed(2);
    //     // const totalgainsFormatted = totalgains.toFixed(2);
    //     const totalgainsFormatted = (parseFloat(totalNetAPayerFormatted) + parseFloat(totalretenuesFormatted)).toFixed(2);

    //     // Créer une nouvelle fenêtre pour l'impression
    //     const printWindow = window.open("", "_blank");
    //     printWindow.document.write(`
    //     <html>
    //     <head>
    //         <title>Bulletin de Paie</title>
    //         <style>
    //             @page { 
    //                 size: A4; 
    //                 margin: 5mm;
    //             }
    //             body { 
    //                 font-family: Arial, sans-serif; 
    //                 margin: 0;
    //                 padding: 5px;
    //                 font-size: 12px;
    //             }
    //             .container { 
    //                 width: 100%;
    //                 padding: 0;
    //             }
    //             .border { 
    //                 border: 1px solid #000; 
    //                 padding: 5px; 
    //                 margin-bottom: 5px; 
    //             }
    //             .text-end { margin-top: 30px;  text-align: right; }
    //             .table { 
    //                 width: 100%; 
    //                 border-collapse: collapse;
    //                 margin: 5px 0;
    //                 font-size: 11px;
    //             }
    //             .table th { 
    //                 border: 1px solid #000; 
    //                 padding: 3px; 
    //                 background-color: #f2f2f2;
    //                 text-align: center;
    //             }
    //             .table td { 
    //                 border-left: 1px solid black;
    //                 border-right: 1px solid black;
    //                 padding: 3px;
    //             }
    //             .table tr:first-child th {
    //                 border-top: 1px solid black;
    //             }
    //             .table tr:last-child td {
    //                 border-bottom: 1px solid black;
    //             }
    //             .header { 
    //                 padding: 3px;
    //                 margin-bottom: 5px;
    //                 text-align: center;
    //             }
    //             .info-section { 
    //                 display: flex; 
    //                 justify-content: space-between;
    //                 font-size: 11px;
    //             }
    //             .col { 
    //                 width: 48%; 
    //             }
    //             .total-section {
    //                 margin-top: 10px;
    //                 padding-top: 5px;
    //                 border-top: 1px solid #000;
    //                 font-size: 12px;
    //             }
    //             h5 {
    //                 margin: 5px 0;
    //                 font-size: 14px;
    //                 text-align: center;
    //             }
    //             h4, h3 {
    //                 margin: 5px 0;
    //             }
    //                  .table-summary {
    //                     width: 100%;
    //                     border-collapse: collapse;
    //                     margin-top: 15px;
    //                     font-size: 12px;
    //                 }
    //                 .table-summary td {
    //                     border: 1px solid black;
    //                     padding: 5px;
    //                 }
    //                 .table-summary .total-label {
    //                     font-weight: bold;
    //                     background-color: #f2f2f2;
    //                 }
    //         </style>
    //     </head>
    //     <body>
    //         <div class="container">
    //             <div class="border p-3">
    //                 <div class="info-section">
    //                     <div class="col">
    //                         <p><strong>Ecole :</strong> ${currentItems[0]?.PeriodePaie?.EcolePrincipal?.nomecole}</p>
    //                         <p><strong>Adresse :</strong> ${currentItems[0]?.PeriodePaie?.EcolePrincipal?.adresse}</p>
    //                     </div>
    //                     <div class="col">
    //                         <p><strong>Edition :</strong> ${moment().format('DD-MM-YYYY')}</p>
    //                         <p><strong>Période :</strong>  
    //                         ${new Date(currentItems[0]?.PeriodePaie?.dateDebut).toLocaleDateString('fr-FR', { month: 'long' }).toUpperCase()} - 
    //                         ${new Date(currentItems[0]?.PeriodePaie?.dateFin).toLocaleDateString('fr-FR', { month: 'long' }).toUpperCase()}-
    //                         ${new Date(currentItems[0]?.PeriodePaie?.dateFin).toLocaleDateString('fr-FR', { year: 'numeric' }).toUpperCase()}
    //                         </p>
    //                     </div>
    //                 </div>
    //             </div>

    //             <div class="header border">
    //                 <h5>BULLETIN DE PAIE</h5>
    //             </div>

    //             ${tablesHTML}
                
    //           <table class="table-summary">
    //                     <tr>
    //                         <td rowspan="3" class="total-label">TOTAL GENERAL</td>
    //                         <td class="total-label">GAINS</td>
    //                         <td class="text-end">${totalgainsFormatted}DZD</td>
    //                     </tr>
    //                     <tr>
    //                         <td class="total-label">RETENUES</td>
    //                         <td class="text-end">${totalretenuesFormatted} DZD</td>
    //                     </tr>
    //                     <tr>
    //                         <td class="total-label">NET A PAYER</td>
    //                         <td class="text-end">${totalNetAPayerFormatted} DZD</td>
    //                     </tr>
    //                 </table>
    //         </div>
    //     </body>
    //     </html>
    // `);
    //     printWindow.document.close();
    //     printWindow.print();
    // };

         

         

    // Fonction pour exporter les données vers Excel
    
    const handlePrintClick2 = () => {
        if (!periodeSelectionnee) {
            alert("Veuillez sélectionner une période de paie avant d'imprimer.");
            return;
        }
        if (!currentItems || currentItems.length === 0) return;

        let tablesHTML = "";
        let totalNetAPayer = 0;
        let totalretenues = 0;
    
        const parser = new DOMParser();
    
        currentItems.forEach((item, index) => {
            // Parse chaque bulletin_html individuellement
            const parser = new DOMParser();
            const doc = parser.parseFromString(item.bulletin_html, "text/html");
        
            // Récupère uniquement la première table
            const table = doc.querySelector("table");
            
            if (table) {
                // Ensuite tu fais tes modifs habituelles...
                // (ajout colonne Employé, calcul, etc.)
        
                const posteMatch = item.bulletin_html.match(/<strong>Poste :<\/strong>([^<]+)/);
                const poste = posteMatch ? posteMatch[1].trim() : "Poste non spécifié";
        
                const headerRow = table.querySelector("thead tr");
                if (headerRow) {
                    const newHeader = document.createElement("th");
                    newHeader.textContent = "Employé";
                    newHeader.style.border = "1px solid black";
                    headerRow.insertBefore(newHeader, headerRow.firstChild);

                    // Ajuster les colspan dans la ligne de total
                    const footerRow = table.querySelector("tfoot tr");
                    if (footerRow) {
                        const footerCol = footerRow.querySelector("td[colspan]");
                        if (footerCol) {
                            const currentColspan = parseInt(footerCol.getAttribute("colspan")) || 4;
                            footerCol.setAttribute("colspan", currentColspan + 1);
                        
                    }
                }
                }
        
                const bodyRows = table.querySelectorAll("tbody tr");
                const rowCount = bodyRows.length;
        
                if (rowCount > 0) {
                    const firstRow = bodyRows[0];
                    const newCell = document.createElement("td");
                    newCell.rowSpan = rowCount;
                    newCell.style.verticalAlign = "top";
                    newCell.style.borderLeft = "1px solid black";
                    newCell.style.borderRight = "1px solid black";
                    newCell.style.borderBottom = "1px solid black";
                    newCell.innerHTML = `<strong>${item.nom_prenom}</strong><br/>${poste}`;
                    firstRow.insertBefore(newCell, firstRow.firstChild);
                }
        
                const netAPayer = parseFloat(item.salaireNet).toFixed(2);
                totalNetAPayer += parseFloat(item.salaireNet);
                totalretenues += parseFloat(item.RetenueIRG) + parseFloat(item.RetenueSS) + parseFloat(item.AutreRetenues);
        
                tablesHTML += table.outerHTML;
                tablesHTML += `<p class="text-end" style="margin: 17px 0 15px 0; font-size:15px"><strong>Net à payer: ${netAPayer} DZD</strong></p>`;
            }
        });
        
    
        const totalNetAPayerFormatted = totalNetAPayer.toFixed(2);
        const totalretenuesFormatted = totalretenues.toFixed(2);
        const totalgainsFormatted = (parseFloat(totalNetAPayerFormatted) + parseFloat(totalretenuesFormatted)).toFixed(2);
    
        // Impression
        const printWindow = window.open("", "_blank");
        printWindow.document.write(`
            <html>
            <head>
                <title>Bulletin de Paie</title>
                <style>
                    @page { size: A4; margin: 5mm; }
                    body { font-family: Arial, sans-serif; margin: 0; padding: 5px; font-size: 12px; }
                    .container { width: 100%; padding: 0; }
                    .border { border: 1px solid #000; padding: 5px; margin-bottom: 5px; }
                    .text-end { margin-top: 30px;  text-align: right; }
                    .table { width: 100%; border-collapse: collapse; margin: 5px 0; font-size: 11px; }
                    .table th { border: 1px solid #000; padding: 3px; background-color: #f2f2f2; text-align: center; }
                    .table td { border-left: 1px solid black; border-right: 1px solid black; padding: 3px; }
                    .table tr:first-child th { border-top: 1px solid black; }
                    .table tr:last-child td { border-bottom: 1px solid black; }
                    .header { padding: 3px; margin-bottom: 5px; text-align: center; }
                    .info-section { display: flex; justify-content: space-between; font-size: 11px; }
                    .col { width: 48%; }
                    .table-summary {
                        width: 100%;
                        border-collapse: collapse;
                        margin-top: 15px;
                        font-size: 12px;
                    }
                    .table-summary td {
                        border: 1px solid black;
                        padding: 5px;
                    }
                    .table-summary .total-label {
                        font-weight: bold;
                        background-color: #f2f2f2;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="border p-3">
                        <div class="info-section">
                            <div class="col">
                                <p><strong>Ecole :</strong> ${currentItems[0]?.PeriodePaie?.EcolePrincipal?.nomecole}</p>
                                <p><strong>Adresse :</strong> ${currentItems[0]?.PeriodePaie?.EcolePrincipal?.adresse}</p>
                            </div>
                            <div class="col">
                                <p><strong>Edition :</strong> ${moment().format('DD-MM-YYYY')}</p>
                                <p><strong>Période :</strong>  
                                ${new Date(currentItems[0]?.PeriodePaie?.dateDebut).toLocaleDateString('fr-FR', { month: 'long' }).toUpperCase()} - 
                                ${new Date(currentItems[0]?.PeriodePaie?.dateFin).toLocaleDateString('fr-FR', { month: 'long' }).toUpperCase()} - 
                                ${new Date(currentItems[0]?.PeriodePaie?.dateFin).toLocaleDateString('fr-FR', { year: 'numeric' }).toUpperCase()}
                                </p>
                            </div>
                        </div>
                    </div>
    
                    <div class="header border">
                        <h5>BULLETIN DE PAIE</h5>
                    </div>
    
                    ${tablesHTML}
    
                    <table class="table-summary">
                        <tr>
                            <td rowspan="3" class="total-label">TOTAL GENERAL</td>
                            <td class="total-label">GAINS</td>
                            <td class="text-end">${totalgainsFormatted} DZD</td>
                        </tr>
                        <tr>
                            <td class="total-label">RETENUES</td>
                            <td class="text-end">${totalretenuesFormatted} DZD</td>
                        </tr>
                        <tr>
                            <td class="total-label">NET A PAYER</td>
                            <td class="text-end">${totalNetAPayerFormatted} DZD</td>
                        </tr>
                    </table>
                </div>
            </body>
            </html>
        `);
        printWindow.document.close();
        printWindow.print();
    };
    
    
    const handleExport = () => {
        const ws = XLSX.utils.json_to_sheet(currentItems.map(item => ({
            "Code de période de paie": item.PeriodePaie?.code,
            " date debut période de paie": item.PeriodePaie?.dateDebut,
            " date fin période de paie": item.PeriodePaie?.dateFin,
            "Nom Prenom": item.nom_prenom,
            "Salaire de Base": item.salaireBase,
            "Salaire Net": item.salaireNet,
            "Salaire Brut": item.salaireBrut,
            "Cotisations SS": item.cotisations,
            "Salaire Imposable ": item.SalaireImposable,
            "Retenue IRG": item.RetenueIRG,
            "Retenue SS": item.RetenueSS,
            "heuresS WeekEnd": item.heuresSupWeekEnd,
            "heuresS Ouvrable": item.heuresSupOuvrable,
            "Jours Abcence": item.joursAbsence,
            "Date": moment(item.date).format('YYYY-DD-MM'),
            "Ecole": item.PeriodePaie?.EcolePrincipal?.nomecole,
        })));
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "journal_paie");
        XLSX.writeFile(wb, "journal_paie.xlsx");
    };

    const ArchiverJP = async (id) => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                alert("Vous devez être connecté");
                return;
            }
            const response = await axios.patch(`http://localhost:5000/BultteinPaie/archiver/${id}`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });
            await ListeJP();
            console.log(response.data)
        } catch (error) {
            console.log("Erreur", error)
        }
    }


    return (
        <>
            <nav>
                <Link to="/dashboard" className="text-primary">Dashboard</Link>
                <span> / </span>
                <Link to="/Gpaiement" className="text-primary">Gestion Paie</Link>
                <span> / </span>
                <span>Journal de paie</span>
            </nav>

            <div className="card card-primary card-outline">
                <div className="card-header d-flex">
                    <img src={Journalpaie} alt="" width="90px" />
                    <p className="card-title mt-5 ml-2 p-2 text-center" style={{ width: '350px', borderRadius: '50px', border: '1px solid rgb(215, 214, 216)' }}>
                        Journal de paie
                    </p>
                </div>
                <div className="card-body">
                    <div className="tab-content" id="custom-content-below-tabContent">
                        <div className="tab-pane fade show active" id="listes" role="tabpanel" aria-labelledby="custom-content-below-home-tab">
                            <section className="content mt-2">
                                <div className="container-fluid">
                                    <div className="row">
                                        <div className="col-12">
                                            <div className="card">
                                                <div className="card-header p-2" style={{ backgroundColor: "#f8f8f8" }}>
                                                    <div className="row mt-3">
                                                        <div className="col-md-4">
                                                            < button className="btn btn-app p-1" onClick={handlePrintClick} >
                                                                <img src={print} alt="" width="30px" /><br />Model 1
                                                            </button>
                                                            < button className="btn btn-app p-1" onClick={handlePrintClick2} >
                                                                <img src={print} alt="" width="30px" /><br />Model 2
                                                            </button>

                                                            <button className='btn btn-app p-1' onClick={handleExport}>
                                                                <img src={excel} alt="" width="25px" /><br />Exporter
                                                            </button>
                                                        </div>
                                                        <div className="col-md-4">
                                                            <div className="mb-3">
                                                                <label htmlFor="periode-select">Choisir une période de paie :</label>
                                                                <Select
                                                                    id="periode-select"
                                                                    options={periodesPaie.map((periode) => ({
                                                                        value: periode.id,
                                                                        label: `
                                                                           ${new Date(periode?.dateDebut).toLocaleDateString('fr-FR', { month: 'long' }).toUpperCase()}-
                                                                            ${new Date(periode?.dateFin).toLocaleDateString('fr-FR', { month: 'long' }).toUpperCase()}
                                                                             `,
                                                                    }))}
                                                                    onChange={handlePeriodeChange}
                                                                    placeholder="Sélectionnez une période"
                                                                />
                                                            </div>
                                                        </div>
                                                        
                                                        <div className="col-md-4" style={{ marginTop: '44px' }}>
                                                            <div className="mb-3">
                                                                <div className="input-group">
                                                                    <div className="form-outline">
                                                                        <input
                                                                            type="search"
                                                                            id="form1"
                                                                            className="form-control"
                                                                            placeholder="Recherche"
                                                                            style={{ height: "38px", width: "250px" }}
                                                                            value={searchTerm}
                                                                            onChange={handleSearchChange}
                                                                        />
                                                                    </div>
                                                                    <div style={{ background: "rgb(202, 200, 200)", padding: "3px", height: "37px", borderRadius: "2px" }}>
                                                                        <img src={recherche} alt="" height="30px" width="30px" />
                                                                    </div>
                                                                </div>
                                                            </div>


                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="card-body mt-2">

                                                    {/* Filtre de visibilité des colonnes */}
                                                    <ColumnVisibilityFilter columnVisibility={columnVisibility} setColumnVisibility={setColumnVisibility} />
                                                    <p>Journal de paie</p>
                                                    <table id="example2" className="table table-bordered">
                                                        <thead>
                                                            <tr>
                                                                {columnVisibility.id && <th>Id</th>}
                                                                {columnVisibility.PeriodePaie && <th>Periode de paie</th>}
                                                                {columnVisibility.Code_paie && <th>Code Periode de paie</th>}
                                                                {columnVisibility.nom_prenom && <th>Nom et Prénom</th>}
                                                                <th>Déclaration CNAS</th>
                                                                <th>Actuellement employé</th>
                                                                {columnVisibility.salaireBase && <th>Salaire de Base</th>}
                                                                {columnVisibility.salaireBaseAbsences && <th>Salaire de Base du Mois</th>}
                                                                {columnVisibility.salaireNet && <th>Salaire Net</th>}
                                                                {columnVisibility.salaireBrut && <th>Salaire Brut</th>}
                                                                {columnVisibility.cotisations && <th>Cotisations</th>}
                                                                {columnVisibility.SalaireImposable && <th>Salaire Imposable</th>}
                                                                {columnVisibility.RetenueIRG && <th>Retenue IRG</th>}
                                                                {columnVisibility.RetenueSS && <th>Retenue SS</th>}
                                                                {columnVisibility.heuresSup && <th>Heures Supplémentaires</th>}
                                                                {columnVisibility.heuresSupM && <th>Montant Heures Supplémentaires</th>}
                                                                {columnVisibility.jourtravaille && <th>nbr Jour travaillés</th>}
                                                                {columnVisibility.joursAbsence && <th>Jours d'Absence</th>}
                                                                {/* {columnVisibility.RetenueAbsence && <th>Retenue d'Absence</th>} */}
                                                                {columnVisibility.nbrheureretard && <th>nbr heures retard </th>}
                                                                {columnVisibility.AutreRetenue && <th>Autres Retenues </th>}
                                                                {columnVisibility.date && <th>Date</th>}
                                                                {columnVisibility.EcoleP && <th>Ecole Principale</th>}
                                                                {columnVisibility.actions && <th>Actions</th>}
                                                            </tr>
                                                        </thead>
                                                        <tbody>

                                                            {currentItems.map((item, index) => (
                                                                <tr key={index}>
                                                                    {columnVisibility.id && <td>{indexOfFirstItem + index + 1}</td>}
                                                                    {columnVisibility.PeriodePaie &&
                                                                        <td>{new Date(item.PeriodePaie?.dateDebut).toLocaleDateString('fr-FR', { month: 'long' }).toUpperCase()}-
                                                                            {new Date(item.PeriodePaie?.dateFin).toLocaleDateString('fr-FR', { month: 'long' }).toUpperCase()} </td>
                                                                    }

                                                                    {columnVisibility.Code_paie && <td>{item.PeriodePaie?.code}</td>}
                                                                    {columnVisibility.nom_prenom && <td>{item.nom_prenom}</td>}
                                                                    <td>{item.Employe.declaration==1?'Oui':'Non'}</td>
                                                                    <td>{item.Employe?.User?.statuscompte==='activer'?'Employé':'Non Employé'}</td>
                                                                    {columnVisibility.salaireBase && <td>{item.salaireBase}</td>}
                                                                    {columnVisibility.salaireBaseAbsences && <td>{item.NVSBaseAbsences}</td>}
                                                                    {columnVisibility.salaireNet && <td>{item.salaireNet}</td>}
                                                                    {columnVisibility.salaireBrut && <td>{item.salaireBrut}</td>}
                                                                    {columnVisibility.cotisations && <td>{item.cotisations}</td>}
                                                                    {columnVisibility.SalaireImposable && <td>{item.SalaireImposable}</td>}
                                                                    {columnVisibility.RetenueIRG && <td>{item.RetenueIRG}</td>}
                                                                    {columnVisibility.RetenueSS && <td>{item.RetenueSS}</td>}
                                                                    {columnVisibility.heuresSup && <td>{item.heuresSup}</td>}
                                                                    {columnVisibility.heuresSupM && <td>{item.GeinheuresSup}</td>}
                                                                    {columnVisibility.jourtravaille && <td>{item.nbrJrTrvMois}</td>}
                                                                    {columnVisibility.joursAbsence && <td>{item.joursAbsence}</td>}
                                                                    {/* {columnVisibility.RetenueAbsence && <td>{item.AbsenceRetenues}</td>} */}
                                                                    {columnVisibility.nbrheureretard && <td>{item.nbrHRetard}</td>}
                                                                    {columnVisibility.AutreRetenue && <td> {item.AutreRetenues}<br/><small className='text-muted'> {item.NomAutreRetenues}</small> </td>}
                                                                    {columnVisibility.date && <td>{moment(item.date).format('YYYY-DD-MM')}</td>}
                                                                    {columnVisibility.EcoleP && <td>{item.PeriodePaie?.EcolePrincipal?.nomecole}</td>}
                                                                    {columnVisibility.actions && <td>
                                                                        <a 
                                                                            className="btn btn-outline-danger"
                                                                            onClick={() => handleShow(item.id)}
                                                                        >
                                                                            <img src={deletee} alt="" width="20px" title="Supprimer" />
                                                                        </a></td>}
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>
                            {/* Pagination */}
                            <div className="pagination">
                                <button
                                    className="btn btn-primary"
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage === 1}
                                >
                                    Précédent
                                </button>
                                {pageNumbers.map((number) => (
                                    <button
                                        key={number}
                                        className={`btn ${currentPage === number ? 'btn-info' : 'btn-light'}`}
                                        onClick={() => handlePageChange(number)}
                                    >
                                        {number}
                                    </button>
                                ))}
                                <button
                                    className="btn btn-primary"
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                >
                                    Suivant
                                </button>
                            </div>
                        </div>

                    </div>
                    <Modal show={showDeleteModal} onHide={handleClose}>
                        <Modal.Header closeButton>
                            <Modal.Title>Confirmer la suppression</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <p>Êtes-vous sûr de vouloir supprimer  ?</p>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={handleClose}>
                                Annuler
                            </Button>
                            <Button
                                variant="danger"
                                onClick={() => {
                                    ArchiverJP(demandeIdToDelete);
                                    handleClose();
                                }}
                            >
                                Supprimer
                            </Button>
                        </Modal.Footer>
                    </Modal>
                </div>
            </div>
        </>
    );
};




export default JournalPaie
