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
import * as XLSX from 'xlsx';



const Conges = () => {

    const [selectedOption, setSelectedOption] = useState(null);
    const [data, setData] = useState([]);
    const [DemandeId, setDemandeId] = useState(null);
    const [EmployeId, setEmployeId] = useState(null);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [AttenteC, setAttenteC] = useState('');
    const [demandeIdToDelete, setDemandeIdToDelete] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
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
    });



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

    const options = [
        { value: 'enseignant', label: 'enseignant' },
    ];

    const handleChange = selectedOption => {
        setSelectedOption(selectedOption);
    };

    const handleIDdemande = (id, idemploye) => {
        setDemandeId(id);
        setEmployeId(idemploye);
    };

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
                    const employeCactif = response.data.filter((item) => item.Employe.User?.statuscompte === "activer")
                    setData(employeCactif);
                    const demandeAttente = response.data.filter((att) => att.statut === "En attente" && att.Employe.User?.statuscompte === "activer").length
                    setAttenteC(demandeAttente);

                } else {
                    console.error("Les données ne sont pas un tableau !");
                }
            }
        } catch (error) {
            console.log(error);
        }
    };

    //archivage :

    const handleClose = () => setShowDeleteModal(false);
    const handleShow = (id) => {
        setDemandeIdToDelete(id);
        setShowDeleteModal(true);
    };

    const Archiver = async (id) => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                alert("Vous devez être connecté");
                return;
            }
            const response = await axios.patch(`http://localhost:5000/congeAbsence/archiver/${id}`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });
            await listeDCA();
            console.log(response.data);
        } catch (error) {
            console.log("Erreur", error);
        }
    };


    // Filtrage des données
    const filteredData = data.filter(item => {
        const itemDateDebut = moment(item.dateDebut).format('YYYY-MM-DD');
        const itemDateFin = moment(item.dateFin).format('YYYY-MM-DD');
        const matchesSearchTerm =
            (item.Employe.User && item.Employe?.User.nom.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (item.Employe.User&& item.Employe?.User.prenom.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (item.type_demande && item.type_demande.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (item.Employe.Poste?.poste && item.Employe.Poste.poste.toLowerCase().includes(searchTerm.toLowerCase().trim())) ||
            (item.statut && item.statut.toLowerCase().includes(searchTerm.toLowerCase()));

        const matchesDateRange =
            (!startDate || itemDateDebut >= startDate) &&
            (!endDate || itemDateFin <= endDate);

        // Filtre par école
        const matchesEcole = !selectedEcole ||
            (item.Employe?.User?.Ecoles.some(ecole => ecole.id === parseInt(selectedEcole))) ||
            (item.Employe?.User?.Ecoles[0]?.id === parseInt(selectedEcole));

        return matchesSearchTerm && matchesDateRange && matchesEcole;


    });

    const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

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


    const changeStatut = async (id, statut) => {
        try {
            const response = await axios.patch(`http://localhost:5000/congeAbsence/changerstatut/${id}`, {
                statut: statut
            });
            if (response.status === 200) {
                listeDCA();
            }
        } catch (error) {
            console.error("Erreur lors du changement de statut :", error.response?.data || error.message);
        }
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
        XLSX.utils.book_append_sheet(wb, ws, "des congés et absences des employés");
        XLSX.writeFile(wb, "liste.xlsx");
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
                            <button className="btn btn-app p-2" data-toggle="modal" data-target="#congeAnnuel">
                                <img src={add} alt="" width="30px" /><br />
                                congé annuel
                            </button>

                            <a className="btn btn-app p-2" onClick={handlePrint}>
                                <img src={print} alt="" width="30px" /><br />
                                Imprimer
                            </a>
                            <a className="btn btn-app p-2" onClick={handleExport}>
                                <img src={exportt} alt="" width="30px" /><br />
                                Exporter Excel
                            </a>
                            {/* <a className="btn btn-app p-2">
                                <img src={importt} alt="" width="30px" /><br />
                                Importer Excel
                            </a> */}
                        </div>
                    </div>


                    <div className="row ">

                        <div className="col-3 mt-5" style={{ flex: '1', marginRight: '10px',}}>
                            <select
                                name="ecole"
                                className="form-control"
                                required
                                style={{ height: '35px', borderRadius: '8px', backgroundColor: '#F8F8F8' }}
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
                        <div className="col-3" style={{ flex: '1' ,marginTop:'40px',height:'30px'}}>
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
                                    <img src={recherche} alt="" height="20px" width="20px" />
                                </div>
                            </div>
                        </div>
                        <div className="col-3">
                            <label htmlFor="">Date debut</label>
                            <input
                                type="date"
                                className="form-control"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                            />
                        </div>
                        <div className="col-3">
                            <label htmlFor="">Date fin</label>
                            <input
                                type="date"
                                className="form-control"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                            />
                        </div>
                       
                    </div>
                </div>
                {/* Filtre de visibilité des colonnes */}
                <ColumnVisibilityFilter columnVisibility={columnVisibility} setColumnVisibility={setColumnVisibility} />



                <div className="card-body ">
                    <table id="example2" className="table table-bordered table-sm ">
                        <thead>
                            <tr>
                                {columnVisibility.id && <th>Id</th>}
                                {columnVisibility.nom_prenom && <th>Nom et prénom</th>}
                                {columnVisibility.poste && <th>Poste</th>}
                                {columnVisibility.type_demande && <th>Type de demande</th>}
                                {columnVisibility.dateDebut && <th>Date début</th>}
                                {columnVisibility.dateFin && <th>Date fin</th>}
                                {columnVisibility.duree && <th>Durée</th>}
                                {columnVisibility.statut && (
                                    <th>Statut {AttenteC > 0 && (<span className="badge bg-danger ms-2"> {AttenteC}</span>)}</th>
                                )}
                                <th>Ecole</th>
                                {columnVisibility.actions && <th>Actions</th>}
                            </tr>
                        </thead>
                        <tbody>
                            {currentItems.map((item, index) => (
                                <tr key={index}>
                                    {columnVisibility.id && <td>{indexOfFirstItem + index + 1}</td>}
                                    {columnVisibility.nom_prenom && <td>{item.Employe ? item.Employe?.User?.nom : ''} {item.Employe ? item.Employe?.User?.prenom : ''}</td>}
                                    {columnVisibility.poste && <td>{item.Employe ? item.Employe?.Poste?.poste : ''}</td>}
                                    {columnVisibility.type_demande && <td>{item.type_demande}</td>}
                                    {columnVisibility.dateDebut && <td>{moment(item.dateDebut).format('YYYY-MM-DD')}</td>}
                                    {columnVisibility.dateFin && <td>{moment(item.dateFin).format('YYYY-MM-DD')}</td>}
                                    {columnVisibility.duree && (<td>{moment(item.dateFin).diff(moment(item.dateDebut), 'days') + 1} jours</td>)}
                                    {columnVisibility.statut && <td><strong>{item.statut}</strong></td>}
                                    <td>{item.Employe?.User?.Ecoles ? item.Employe?.User?.Ecoles[0]?.nomecole : ''}</td>
                                    {columnVisibility.actions && (
                                        <td className="text-center">
                                            <div className="d-flex justify-content-center align-items-center gap-2">
                                                {/* Bouton Modifier */}
                                                <button
                                                    className="btn btn-outline-success d-flex justify-content-center align-items-center p-1"
                                                    data-toggle="modal"
                                                    data-target="#ModifierCA"
                                                    onClick={() => handleIDdemande(item.id, item.employe_id)}
                                                    style={{ width: "35px", height: "35px" }}
                                                >
                                                    <img src={edit} alt="Modifier" width="20px" title="Modifier" />
                                                </button>

                                                {/* Bouton Supprimer */}
                                                <button
                                                    className="btn btn-outline-danger d-flex justify-content-center align-items-center p-1"
                                                    onClick={() => handleShow(item.id)}
                                                    style={{ width: "35px", height: "35px" }}
                                                >
                                                    <img src={deletee} alt="Supprimer" width="20px" title="Supprimer" />
                                                </button>
                                            </div>
                                        </td>

                                    )}

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
                <AddEditConge />
                <AddMonConge />
                <ModifierCA IDemande={DemandeId} IDEmploye={EmployeId} />
                <CongeAnnuel />
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
                            Archiver(demandeIdToDelete);
                            handleClose();
                        }}
                    >
                        Supprimer
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default Conges;