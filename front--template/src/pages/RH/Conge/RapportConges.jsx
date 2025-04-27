import React, { useEffect, useState } from 'react';
import exportt from '../../../assets/imgs/excel.png';
import print from '../../../assets/imgs/printer.png';
import importt from '../../../assets/imgs/import.png';
import edit from '../../../assets/imgs/edit.png';
import add from '../../../assets/imgs/add.png';
import deletee from '../../../assets/imgs/delete.png';
import detail from '../../../assets/imgs/details.png';
import conge from '../../../assets/imgs/leave.png';
import Select from 'react-select';
import { Link } from 'react-router-dom';
import { Modal, Button } from 'react-bootstrap';
import AddEditConge from './AddEditConge';
import AddMonConge from './Employe/AddEmployeCA';
import axios from 'axios';
import moment from 'moment';
import ModifierCA from './ModiferCA';
import CongeAnnuel from './CongeAnnuel';
import recherche from '../../../assets/imgs/recherche.png';
import accept from '../../../assets/imgs/accept.png';
import reject from '../../../assets/imgs/reject.png';
import fichier from '../../../assets/imgs/fichier.png';
import * as XLSX from 'xlsx';



const RapportConges = () => {

    const [data, setData] = useState([]);
    const [DemandeId, setDemandeId] = useState(null);
    const [EmployeId, setEmployeId] = useState(null);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [AttenteC, setAttenteC] = useState('');
    const [employees, setEmployees] = useState([]);
    const [selectedEmployees, setSelectedEmployees] = useState([]);
    const [filteredCA, setFilteredCA] = useState([]); // Pointages filtrés




    const [selectedEcole, setSelectedEcole] = useState(null);
    const [filteredEcoles, setFilteredEcoles] = useState([]);
    const [ecole, setEcoles] = useState([]);
    useEffect(() => {
        const fetchEcoles = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    console.error('Aucun token trouvé. Veuillez vous connecter.');
                    return;
                }

                const response = await axios.get('http://localhost:5000/ecoles', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                // Vérifier que les données contiennent bien les champs nécessaires
                const ecolesWithDefaults = response.data.map(ecole => ({
                    ...ecole,
                    nomecole: ecole.nomecole || '', // Valeur par défaut si undefined
                    nom_arecole: ecole.nom_arecole || '', // Valeur par défaut si undefined
                }));
                setEcoles(ecolesWithDefaults);
                setFilteredEcoles(ecolesWithDefaults);
            } catch (error) {
                console.error('Erreur lors de la récupération des écoles', error);
            }
        };
        fetchEcoles();
    }, []);

    // Récupérer la liste des employés
    useEffect(() => {
        const fetchEmployees = async () => {
            const token = localStorage.getItem("token");
            if (!token) {
                alert("Vous devez être connecté");
                return;
            }
            const response = await axios.get('http://localhost:5000/employes/liste', {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });
            const employeeOptions = response.data.map(emp => ({
                value: emp.id,
                label: `${emp.User.nom} ${emp.User.prenom}`
            }));
            setEmployees(employeeOptions);
        };
        fetchEmployees();
    }, []);

    const url = 'http://localhost:5000'
    //afficher les colonnes
    const [columnVisibility, setColumnVisibility] = useState({
        id: true,
        type_demande: true,
        dateDebut: true,
        dateFin: true,
        duree: true,
        statut: true,
        actions: true,
        nom_prenom: true,
        poste: true,
        justifictaion: false,
        jourR: true,
        jourP: true,
    });

    // Pagination
    const itemsPerPage = 10;
    const [currentPage, setCurrentPage] = useState(1);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const totalPages = Math.ceil(data.length / itemsPerPage);

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };
    const pageNumbers = [];
    for (let i = Math.max(1, currentPage - 2); i <= Math.min(currentPage + 2, totalPages); i++) {
        pageNumbers.push(i);
    }
    // Fetch data from backend
    useEffect(() => {
        listeDCA();
    }, []);

    const listeDCA = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                alert("Vous devez être connecté ");
                return;
            }
            const response = await axios.get(`http://localhost:5000/congeAbsence/demandesCAemployes/`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });
            if (response.status === 200) {
                if (Array.isArray(response.data)) {
                    setData(response.data);
                    setFilteredCA(response.data);
                } else {
                    console.error("Les données ne sont pas un tableau !");
                }
            }
        } catch (error) {
            console.log(error);
            setFilteredCA([]);
        }
    };





    // Filtrage des données
    // const filteredData = data.filter(item => {
    //     const itemDateDebut = moment(item.dateDebut).format('YYYY-MM-DD');
    //     const itemDateFin = moment(item.dateFin).format('YYYY-MM-DD');
    //     const matchesSearchTerm =
    //         // (item.Employe && item.Employe.nom.toLowerCase().includes(searchTerm.toLowerCase())) ||
    //         // (item.Employe && item.Employe.prenom.toLowerCase().includes(searchTerm.toLowerCase())) ||
    //         (item.type_demande && item.type_demande.toLowerCase().includes(searchTerm.toLowerCase())) ||
    //         (item.statut && item.statut.toLowerCase().includes(searchTerm.toLowerCase()));

    //     const matchesDateRange =
    //         (!startDate || itemDateDebut >= startDate) &&
    //         (!endDate || itemDateFin <= endDate);
    //     return matchesSearchTerm && matchesDateRange;
    // });
    const applyFilters = () => {
        let filtered = data.filter(item => {
            // Filtre par employés sélectionnés
            const isEmployeeMatch = selectedEmployees.length > 0
                ? selectedEmployees.some(emp => emp.value === item.Employe.id)
                : true;

            // Filtre par date
            const isDateMatch = (!startDate || moment(item.date).isSameOrAfter(moment(startDate))) &&
                (!endDate || moment(item.date).isSameOrBefore(moment(endDate)));

            // Filtre par recherche
            const isSearchMatch = searchTerm === '' ||
                (item.Employe.User?.nom && item.Employe.User?.nom.toLowerCase().includes(searchTerm.toLowerCase().trim())) ||
                (item.Employe.User?.prenom && item.Employe.User?.prenom.toLowerCase().includes(searchTerm.toLowerCase().trim())) ||
                (item.Employe.Poste.poste && item.Employe.Poste.poste.toLowerCase().includes(searchTerm.toLowerCase().trim())) ||
                (item.HeureSMP && item.HeureSMP.includes(searchTerm)) ||
                (item.HeureEAMP && item.HeureEAMP.includes(searchTerm)) ||
                (item.HeureEMP && item.HeureEMP.includes(searchTerm)) ||
                (item.HeureSAMP && item.HeureSAMP.includes(searchTerm)) ||
                (item.statut && item.statut.includes(searchTerm));

            // Filtre par école
            const matchesEcole = !selectedEcole ||
                (item.Employe?.User?.Ecoles.some(ecole => ecole.id === parseInt(selectedEcole))) ||
                (item.Employe?.User?.Ecoles[0]?.id === parseInt(selectedEcole));


            return isEmployeeMatch && isDateMatch && isSearchMatch && matchesEcole;
        });

        setFilteredCA(filtered);
        setCurrentPage(1); // Réinitialiser la pagination quand les filtres changent
    };
    useEffect(() => {
        applyFilters();
    }, [selectedEmployees, startDate, endDate, data, searchTerm, selectedEcole, ecole]);


    const currentItems = filteredCA.slice(indexOfFirstItem, indexOfLastItem);

    // Composant pour basculer la visibilité des colonnes
    const ColumnVisibilityFilter = ({ columnVisibility, setColumnVisibility }) => {
        const columns = [
            { key: "id", label: "Id" },
            { key: "nom_prenom", label: "Nom Prénom" },
            { key: "poste", label: "Poste" },
            { key: "type_demande", label: "Type de demande" },
            { key: "dateDebut", label: "Date début" },
            { key: "dateFin", label: "Date fin" },
            { key: "duree", label: "Durée" },
            { key: "statut", label: "Statut" },
            { key: "actions", label: "Actions" },
            { key: "justifictaion", label: "justifictaion" },
            { key: "jourR", label: "Jour restant" },
            { key: "jourP", label: "Jour consommé" },
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
            <div className="mb-3 p-3">
                <h6>Choisir les colonnes à afficher :</h6>
                <Select
                    isMulti
                    options={columns.map(({ key, label }) => ({
                        value: key,
                        label: label,
                    }))}
                    value={columns
                        .filter(({ key }) => columnVisibility[key]) // Sélectionne les colonnes visibles
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



    // Gérer l'impression
    const handlePrint = () => {
        const printWindow = window.open("", "", "width=800,height=600");
        printWindow.document.write(`
                <html>
                    <head>
                        <title>liste des congés et absences des employés</title>
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
                        <h5>liste des congés et absences des employés</h5>
                        <table>
                            <thead>
                                <tr>
                                 <th>Nom et prénom</th>
                                 <th>Poste</th>
                                  <th>Type de demande</th>
                                 <th>Date début</th>
                                 <th>Date fin</th>
                                 <th>Statut</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${currentItems.map(item => `
                                    <tr>
                                      
                                        <td>${item.Employe?.User?.nom} ${item.Employe.User.prenom}</td>
                                        <td>${item.Employe?.Poste?.poste}</td>
                                        <td>${item.type_demande}</td>
                                        <td>${moment(item.dateDebut).format('YYYY-MM-DD')}</td>
                                        <td>${moment(item.dateFin).format('YYYY-MM-DD')}</td>
                                        <td>${item.statut}</td>
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
    const handleExport = () => {

        const ws = XLSX.utils.json_to_sheet(currentItems.map(item => ({
            "Nom et Prénom": `${item.Employe?.User?.nom} ${item.Employe?.User?.prenom}`,
            "Poste": item.Employe?.Poste?.poste,
            "Type Demande": item.type_demande,
            "Date Début": moment(item.dateDebut).format('YYYY-MM-DD'),
            "Date Fin": moment(item.dateFin).format('YYYY-MM-DD'),
            "Statut": item.statut,

        })));

        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "congés et absences");
        XLSX.writeFile(wb, "liste.xlsx");
    };

    const isImage = (filename) => {
        return /\.(jpg|jpeg|png|gif)$/i.test(filename);
    };
    return (
        <>
            <nav className='mb-2'>
                <Link to="/dashboard">Dashboard</Link>
                <span> / </span>
                <Link to="/RessourcesHumaines" className="text-primary">Ressources Humaines</Link>
                <span> / </span>
                <span>Gestion des congés et absences des employés</span>
            </nav>
            <div className="card card-primary card-outline">
                <div className="card-header d-flex ">
                    <img src={conge} alt="" width="90px" />
                    <p className="card-title mt-5 ml-2 p-2 text-center" style={{ width: '400px', borderRadius: '50px', border: '1px solid rgb(215, 214, 216)' }}>
                        Gestion des congés et absences des employés
                    </p>
                </div>

                <div className="card-body p-2">
                    <div className="row mt-3">
                        <div className="col-6">
                            <a className="btn btn-app p-2" onClick={handlePrint}>
                                <img src={print} alt="" width="30px" /><br />
                                Imprimer
                            </a>
                            <a className="btn btn-app p-2" onClick={handleExport}>
                                <img src={exportt} alt="" width="30px" /><br />
                                Exporter Excel
                            </a>
                        </div>
                    </div>
                    {/* <div className="row">
                        <div className="select-search col-12">
                            <div className="col-6">

                            </div>
                            <div className="col-6">
                                <div className="input-group mr-2">
                                    <div className="form-outline">
                                        <input
                                            type="search"
                                            id="form1"
                                            className="form-control"
                                            placeholder="Recherche par type et statut"
                                            style={{ height: "38px", width: "250px" }}
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                        />
                                    </div>
                                    <div style={{ background: "rgb(202, 200, 200)", padding: "3px", height: "37px", borderRadius: "2px" }}>
                                        <img src={recherche} alt="" height="30px" width="30px" />
                                    </div>
                                </div>
                            </div>
                        </div> */}
                    {/* </div> */}

                    {/* Filtres par date */}
                    {/* <div className="row mt-3">
                        <div className="col-6">
                            <label htmlFor="">Date debut</label>
                            <input
                                type="date"
                                className="form-control"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                            />
                        </div>
                        <div className="col-6">
                            <label htmlFor="">Date fin</label>
                            <input
                                type="date"
                                className="form-control"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                            />
                        </div>
                    </div> */}
                </div>
                {/* Section Filtres */}
                <div className="filters-section mb-4 p-3 bg-light rounded">
                    <div className="row align-items-end">
                        {/* Dates */}
                        <div className="col-md-5">
                            <div className="row">
                                <div className="col-md-6">
                                    <div className="form-group">
                                        <label className="font-weight-bold">Date Début</label>
                                        <input
                                            type="date"
                                            className="form-control border-primary"
                                            value={startDate}
                                            onChange={(e) => setStartDate(e.target.value)}
                                            style={{ height: "40px" }}
                                        />
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="form-group">
                                        <label className="font-weight-bold">Date Fin</label>
                                        <input
                                            type="date"
                                            className="form-control border-primary"
                                            value={endDate}
                                            onChange={(e) => setEndDate(e.target.value)}
                                            style={{ height: "40px" }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Sélection Employés */}
                        <div className="col-md-4">
                            <div className="form-group">
                                <label className="font-weight-bold">Employés</label>
                                <Select
                                    options={employees}
                                    onChange={setSelectedEmployees}
                                    placeholder="Sélectionner un ou plusieurs employés"
                                    isClearable
                                    isMulti
                                    className="react-select-container"
                                    classNamePrefix="react-select"
                                />
                            </div>
                        </div>

                        {/* Recherche */}
                        <div className="col-md-3">
                            <div className="form-group">
                                <label className="font-weight-bold">Recherche</label>
                                <div className="input-group search-box">
                                    <input
                                        type="search"
                                        className="form-control"
                                        placeholder="Nom, poste, heure..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        aria-label="Recherche"
                                        style={{ height: "40px" }}
                                    />
                                    <div className="input-group-append">
                                        <span className="input-group-text bg-white">
                                            <img src={recherche} alt="Rechercher" style={{ height: "20px", width: "20px", opacity: 0.7 }} />
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-4" style={{ width: '100%' }}>
                            <select
                                name="ecole"
                                className="form-control"
                                required
                                style={{ height: '38px', borderRadius: '8px', backgroundColor: '#F8F8F8' }}
                                onChange={(e) => setSelectedEcole(e.target.value)}
                                value={selectedEcole || ''}
                            >
                                <option value="">Sélectionnez une école</option>
                                {ecole.map((item) => (
                                    <option key={item.id} value={item.id}>
                                        {item.nomecole}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
                {/* Filtre de visibilité des colonnes */}
                <ColumnVisibilityFilter columnVisibility={columnVisibility} setColumnVisibility={setColumnVisibility} />



                <div className="card-body ">
                    <table id="example2" className="table table-bordered ">
                        <thead>
                            <tr>
                                {columnVisibility.id && <th>Id</th>}
                                {columnVisibility.nom_prenom && <th>Nom et prénom</th>}
                                {columnVisibility.poste && <th>Poste</th>}
                                <th>Période Congé Annuel</th>
                                {columnVisibility.type_demande && <th>Type de demande</th>}
                                {columnVisibility.dateDebut && <th>Date début</th>}
                                {columnVisibility.dateFin && <th>Date fin</th>}
                                {/* {columnVisibility.jourP && <th>Jours de Congé</th>} */}
                                {columnVisibility.jourP && <th>Jours pris</th>}
                                {columnVisibility.jourR && <th>Jours restants</th>}
                                {/* {columnVisibility.duree && <th>Durée</th>} */}
                                {columnVisibility.justifictaion && <th>Justifictaion</th>}
                                {columnVisibility.statut && (
                                    <th>Statut {AttenteC > 0 && (<span className="badge bg-danger ms-2"> {AttenteC}</span>)}</th>
                                )}
                                <th>Ecole</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentItems.map((item, index) => (
                                <tr key={index}>

                                    {columnVisibility.id && <td>{indexOfFirstItem + index + 1}</td>}
                                    {columnVisibility.nom_prenom && <td>{item.Employe ? item.Employe?.User?.nom : ''} {item.Employe ? item.Employe?.User?.prenom : ''}</td>}
                                    {columnVisibility.poste && <td>{item.Employe ? item.Employe?.Poste?.poste : ''}</td>}
                                    <td>
                                        {item.CongeAnnuel
                                            ? `${moment(item.CongeAnnuel.dateDebut).format('DD-MM-YYYY')} / ${moment(item.CongeAnnuel.dateFin).format('DD-MM-YYYY')}`
                                            : ''}
                                    </td>
                                    {columnVisibility.type_demande && <td> {item.type_demande}</td>}
                                    {columnVisibility.dateDebut && <td>{moment(item.dateDebut).format('YYYY-MM-DD')}</td>}
                                    {columnVisibility.dateFin && <td>{moment(item.dateFin).format('YYYY-MM-DD')}</td>}
                                    {/* <td>{item.jour_congeMois}</td> */}
                                    {columnVisibility.jourP && <td>{item.jour_consomme}</td>}
                                    {columnVisibility.jourR && <td>{item.jour_restant}</td>}
                                    {/* {columnVisibility.duree && (<td>{moment(item.dateFin).diff(moment(item.dateDebut), 'days') + 1} jours</td>)} */}
                                    {columnVisibility.justifictaion && (<td style={{ width: "50px", }}>
                                        <div
                                            style={{
                                                width: "50px",
                                                height: "35px",
                                                border: "2px solid gray",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                overflow: "hidden",
                                                cursor: "pointer",
                                                padding: "5px",
                                            }}
                                            onClick={() => {
                                                item ? window.open(url + item.fichier, "_blank") : ''
                                            }}
                                        >
                                            {item && item.fichier ? (
                                                isImage(item.fichier) ? (
                                                    <img
                                                        src={url + item.fichier}
                                                        alt="image"
                                                        style={{
                                                            width: "100%",
                                                            height: "100%",
                                                            objectFit: "cover",
                                                        }}
                                                    />
                                                ) : (
                                                    <img
                                                        src={fichier}
                                                        alt="Document"
                                                        style={{
                                                            width: "50px",
                                                            height: "50px",
                                                        }}
                                                    />
                                                )
                                            ) : null}
                                        </div>
                                    </td>)}

                                    {columnVisibility.statut && (
                                        <td><strong>{item.statut}</strong></td>
                                    )}
                                    <td>{item.Employe?.User?.Ecoles ? item.Employe?.User?.Ecoles[0]?.nomecole : ''}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <p className='mt-2'>Affichage de {indexOfFirstItem + 1} à {indexOfLastItem} sur {data.length} entrées</p>

                    {/* Pagination */}
                    <div className="pagination  d-flex justify-content-end">
                        <button
                            className="btn btn-outline-primary "
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                        >
                            Previous
                        </button>
                        {/* Affichage des boutons de page */}
                        {pageNumbers.map((number) => (
                            <button
                                key={number}
                                className={`btn ${currentPage === number ? 'btn-outline-primary' : 'btn-light'}`}
                                onClick={() => handlePageChange(number)}
                            >
                                {number}
                            </button>
                        ))}

                        <button
                            className="btn btn-outline-primary"
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                        >
                            Next
                        </button>
                    </div>
                </div>

                {/* Modal profile */}
                {/* modal supprimer */}
                <div className="modal fade" id="modal-delete">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h4 className="modal-title">Confirmer la suppression</h4>
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                <p> Êtes-vous sûr de vouloir supprimer cet élément ? </p>
                            </div>
                            <div className="modal-footer justify-content-between">
                                <button type="button" className="btn btn-default" data-dismiss="modal">Annuler</button>
                                <button type="button" className="btn btn-danger">Supprimer</button>
                            </div>
                        </div>
                    </div>
                </div>


            </div>

        </>
    );
}

export default RapportConges;


