import React from 'react'


      export  const handlePrint = () => {
        const printWindow = window.open("", "", "width=800,height=600");
        printWindow.document.write(`
            <html>
                <head>
                    <title>Rapport d</title>
                    <style>
                        @page { margin: 0; }
                        body {
                            font-family: Arial, sans-serif;
                            padding: 20px;
                            background-color: #f9f9f9;
                        }
                        h5 {
                            text-align: center;
                            font-size: 18px;
                            color: #333;
                            margin-bottom: 20px;
                        }
                        table {
                            margin:15px;
                            width: 100%;
                            border-collapse: collapse;
                            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                            background-color: #fff;
                            margin-bottom: 20px;
                        }
                        th, td {
                            border: 1px solid #ddd;
                            padding: 12px;
                            text-align: left;
                        }
                        th {
                            background-color: #f4f4f4;
                            font-weight: bold;
                            color: #333;
                            text-transform: uppercase;
                            font-size: 14px;
                        }
                        td {
                            color: #555;
                            font-size: 14px;
                        }
                        tr:nth-child(even) {
                            background-color: #f9f9f9;
                        }
                        tr:hover {
                            background-color: #f1f1f1;
                        }
                    </style>
                </head>
                <body>
                    <h5>Rapport des Pointages</h5>
                    <table>
                        <thead>
                            <tr>
                                <th>Nom Prénom</th>
                                <th>Poste</th>
                                <th>Date</th>
                                <th>Heure d'entrée <br/> Matin</th>
                                <th>Heure de sortie <br/> Matin</th>
                                <th>Heure d'entrée <br/> Après-midi</th>
                                <th>Heure de sortie <br/> Après-midi</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${filteredPointages.map(item => `
                                <tr>
                                    <td>${item.Employe.User.nom} ${item.Employe.User.prenom}</td>
                                    <td>${item.Employe.Poste.poste}</td>
                                    <td>${moment(item.date).format('YYYY-MM-DD')}</td>
                                    <td>${item.HeureEMP}</td>
                                    <td>${item.HeureSMP}</td>
                                    <td>${item.HeureEAMP}</td>
                                    <td>${item.HeureSAMP}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </body>
            </html>
        `);
        printWindow.document.close();
        printWindow.print();
    };

      // Fonction pour exporter les données vers Excel
     export const handleExport = () => {
        const ws = XLSX.utils.json_to_sheet(filteredPointages.map(item => ({
            "Nom et Prénom": `${item.Employe.User.nom} ${item.Employe.User.prenom}`,
            "Poste": item.Employe.Poste.poste,
            "Date": moment(item.date).format('YYYY-MM-DD'),
            "Heure d'entrée": item.HeureEMP,
            "Heure de sortie": item.HeureSMP,
            "Heure d'entrée  après-midi": item.HeureEAMP,
            "Heure de sortie après-midi": item.HeureSAMP,
        
        })));

        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Pointages");
        XLSX.writeFile(wb, "rapport_pointage.xlsx");
    };

