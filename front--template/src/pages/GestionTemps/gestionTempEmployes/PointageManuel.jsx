import React, { useEffect, useState } from 'react'
import exportt from '../../../assets/imgs/excel.png';
import print from '../../../assets/imgs/printer.png'
import importt from '../../../assets/imgs/import.png'
import { Link } from 'react-router-dom';
import { Modal, Button, Form } from 'react-bootstrap';
import * as XLSX from 'xlsx';
import Select from 'react-select';
import rh from '../../../assets/imgs/employe.png';
import edit from '../../../assets/imgs/edit.png';
import add from '../../../assets/imgs/add.png';
import deletee from '../../../assets/imgs/delete.png';
import absence from '../../../assets/imgs/absenceEmploye.png'
import detail from '../../../assets/imgs/details.png'
import { StatutPointage } from '../../RH/Employes/OptionSelect'
import axios from 'axios';
import moment from 'moment'
import recherche from '../../../assets/imgs/recherche.png';

const PointageManuel = () => {
    const today = new Date();
    const options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        hour12: false
    };
    const Datetoday = today.toLocaleDateString('fr-FR', options);
    const formattedDate = today.toISOString().slice(0, 16);
    const [showModal, setShowModal] = useState(false);
    const [fileName, setFileName] = useState('');
    const itemsPerPage = 10;
    const [currentPage, setCurrentPage] = useState(1);
    const [data, setData] = useState([]);
    const [statut, setStatut] = useState({});
    const [selectedPointageId, setSelectedPointageId] = useState(null);
    const [pointages, setPointages] = useState([]);
    const [listepointages, setlistepointages] = useState([]);
    const [datedu, setDatedu] = useState('');
    const [datea, setDatea] = useState('');

    const handleShowModal = () => setShowModal(true);
    const handleCloseModal = () => setShowModal(false);

    const handleDownloadTemplate = () => {
        const ws = XLSX.utils.aoa_to_sheet([["Nom", "Prénom", "Email"]]);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Etudiants");
        XLSX.writeFile(wb, "etudiants_template.xlsx");
    };

    const handleFileChange = (event) => {
        setFileName(event.target.files[0].name);
    };

    const handleImport = () => {
        alert('Importation en cours...');
    };


    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);
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


    const handledate = async (e) => {
        const { name, value } = e.target;
        // Mettre à jour l'état des dates
        if (name === 'datedu') {
            setDatedu(value);
        } else if (name === 'datea') {
            setDatea(value);
        }
        // Vérifier si les deux dates sont définies après la mise à jour
        if (datedu && datea) {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    alert("Vous devez être connecté ");
                    return;
                }
                const response = await axios.get(`http://localhost:5000/pointage/liste/date`, {
                    params: {
                        datedu: moment(datedu).format("YYYY-MM-DD"),
                        datea: moment(datea).format("YYYY-MM-DD")
                    }
                }, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                });
                console.log('les data selon les date sont', response.data);
                setlistepointages(response.data);
            } catch (error) {
                console.error("Erreur lors de la récupération des pointages:", error);
            }
        }
    };

    useEffect(() => {
        const fetchPointages = async () => {
            if (datedu && datea) {
              
                try {
                    const token = localStorage.getItem("token");
                    if (!token) {
                        alert("Vous devez être connecté");
                        return;
                    }
                    const response = await axios.get(`http://localhost:5000/pointage/liste/date`, {
                        params: {
                            datedu: moment(datedu).format("YYYY-MM-DD"),
                            datea: moment(datea).format("YYYY-MM-DD")
                        }
                        , headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json",
                        },
                    });

                    setlistepointages(response.data);
                } catch (error) {
                    console.error("Erreur lors de la récupération des pointages:", error);
                }
            }
        };

        fetchPointages();
    }, [datedu, datea]); // Dépendances pour surveiller les changements de dates
    // ----------------------------------backend--------------------------------

    const [showModalStatut, setShowModalStatut] = useState(false);
    const [formData, setFormData] = useState({});


    const listePointage = async () => {
        try {
            
            const token = localStorage.getItem("token");
            if (!token) {
                alert("Vous devez être connecté pour soumettre le formulaire.");
                return;
            }
            const response = await axios.get('http://localhost:5000/pointage/liste', {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            const employePactif = response.data.filter((item) => item.Employe.User?.statuscompte === "activer")
            setlistepointages(employePactif);
        } catch (error) {
            console.log("Erreur lors de la récupération des pointage", error);
        }
    };

    useEffect(() => {
        listePointage();
    }, []);

    const handleShowModalStatutt = (id, heureEMP, heureSMP, heureEAMP, heureSAMP, nom, prenom, statut, heuresupP, justificationret, datea, datedu) => {
        // setselectedPointageId(id);
        setSelectedPointageId(id);
        setShowModalStatut(true);

        // Initialiser formData pour l'employé sélectionné
        setFormData(prevFormData => ({
            ...prevFormData,
            [id]: {
                id: id, // ID de l'employé
                statut: statut,
                justificationab: '',
                // heuresupP: null,
                HeureEMP: heureEMP,
                HeureSMP: heureSMP,
                HeureEAMP: heureEAMP,
                HeureSAMP: heureSAMP,
                datedu: datedu ? moment(datedu).format("YYYY-MM-DD HH:mm:ss") : null,
                datea: datea ? moment(datea).format("YYYY-MM-DD HH:mm:ss") : null,
                nom: nom,
                prenom: prenom,
                heuresupP: heuresupP,
                justificationret: justificationret,

            }
        }));
    };

    const handleShowModalStatut = (id, heureEMP, heureSMP, heureEAMP, heureSAMP, nom, prenom, statutPointage, heuresupP, justificationret, datea, datedu, IdHeureSup) => {
        setSelectedPointageId(id);
        setShowModalStatut(true);

        // Initialiser le statut
        setStatut(prev => ({
            ...prev,
            [id]: statutPointage // Utilisez le statut passé en paramètre
        }));

        // Initialiser formData
        setFormData(prevFormData => ({
            ...prevFormData,
            [id]: {
                id: id,
                statut: statutPointage,
                justificationret: justificationret || '',
                HeureEMP: heureEMP,
                HeureSMP: heureSMP,
                HeureEAMP: heureEAMP,
                HeureSAMP: heureSAMP,
                datedu: datedu ? moment(datedu).format("YYYY-MM-DD HH:mm:ss") : null,
                datea: datea ? moment(datea).format("YYYY-MM-DD HH:mm:ss") : null,
                nom: nom,
                prenom: prenom,
                heuresupP: heuresupP || 0,
                IdHeureSup: IdHeureSup || '' // Ajoutez IdHeureSup ici
            }
        }));
    };



    const handleCloseModalStatut = () => setShowModalStatut(false);

    const handleStatutChange = (value) => {
        setStatut(prevStatut => ({
            ...prevStatut,
            [selectedPointageId]: value
        }));

    };

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData(prevFormData => {
            const newFormData = {
                ...prevFormData,
                [selectedPointageId]: {
                    ...prevFormData[selectedPointageId],
                    [name]: value
                }
            };
            // Si heuresupP est mis à 0, on efface le type d'heure supplémentaire
            if (name === 'heuresupP' && parseInt(value) === 0) {
                newFormData[selectedPointageId].IdHeureSup = '';
            }

            return newFormData;
        });
    };

    const ListeEmployeToday = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                alert("Vous devez être connecté ");
                return;
            }
            const response = await axios.post('http://localhost:5000/pointage/ajouter', {}, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });
            alert(response.data.message);
            await listePointage();

            // Mettre à jour l'état avec les pointages ajoutés
            // setPointages(response.data.pointages);
        } catch (error) {
            console.error('Erreur lors de l\'ajout des pointages par défaut:', error);
            if (error.response) {
                alert(`Erreur serveur: ${error.response.data.message}`);
            } else if (error.request) {
                alert('Erreur de réseau. Veuillez vérifier votre connexion Internet.');
            } else {
                alert('Une erreur inattendue s\'est produite.');
            }
        }
    };

    const ModifierPointage = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                alert("Vous devez être connecté ");
                return;
            }
            // Vérification du statut
        // if (!statut[selectedPointageId]) {
        //     alert("Veuillez sélectionner un statut");
        //     return;
        // }
        // Vérification des heures supplémentaires
        const heuresSup = parseInt(formData[selectedPointageId]?.heuresupP) || 0;
        const typeHeureSup = formData[selectedPointageId]?.IdHeureSup;

        if (heuresSup > 0 && !typeHeureSup) {
            alert("Veuillez sélectionner un type d'heure supplémentaire lorsque le nombre d'heures est supérieur à 0");
            return;
        }
            const response = await axios.put(`http://localhost:5000/pointage/modifier/${selectedPointageId}`, {
                ...formData[selectedPointageId],
                statut: statut[selectedPointageId]
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                }
            });
            alert(response.data.message);
            handleCloseModalStatut();
            // Optionnel : Mettre à jour la liste des pointages après modification
            listePointage(); // Recharger les pointages pour refléter les modifications
        } catch (error) {
            console.error('Erreur lors de la modification du pointage:', error);
            alert('Une erreur s\'est produite lors de la modification du pointage.');
        }
    };

    //la recherche
    const [searchTerm, setSearchTerm] = useState('');

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };
    const filteredData = listepointages.filter(item => {
        return (item.Employe.User?.nom && item.Employe.User?.nom.toLowerCase().includes(searchTerm.toLowerCase().trim())) ||
            (item.Employe.User?.prenom && item.Employe.User?.prenom.toLowerCase().includes(searchTerm.toLowerCase().trim())) ||
            (item.Employe.Poste.poste && item.Employe.Poste.poste.toLowerCase().includes(searchTerm.toLowerCase().trim())) ||
            (item.HeureSMP && item.HeureSMP.includes(searchTerm)) ||
            (item.HeureEAMP && item.HeureEAMP.includes(searchTerm)) ||
            (item.HeureEMP && item.HeureEMP.includes(searchTerm)) ||
            (item.HeureSAMP && item.HeureSAMP.includes(searchTerm)) ||
            (item.statut && item.statut.includes(searchTerm))
    });

    //imprimer 
    const handlePrint = () => {
        const printWindow = window.open("", "", "width=800,height=600");
        printWindow.document.write(`
            <html>
                <head>
                    <title>Liste de Pointage</title>
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
                    <h5>Liste des Pointages</h5>
                    <table>
                        <thead>
                            <tr>
                                <th>Nom Prénom</th>
                                <th>Poste</th>
                                <th>Statut</th>
                                <th>Date</th>
                                <th>Heure d'entrée Matin</th>
                                <th>Heure de sortie Matin</th>
                                <th>Heure d'entrée Après-midi</th>
                                <th>Heure de sortie Après-midi</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${filteredData.map(item => `
                                <tr>
                                    <td>${item.Employe.User.nom} ${item.Employe.User.prenom}</td>
                                    <td>${item.Employe.Poste.poste}</td>
                                    <td>${item.statut}</td>
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

    const handleExport = () => {
        const ws = XLSX.utils.json_to_sheet(filteredData.map(item => ({
            "Nom et Prénom": `${item.Employe.User.nom} ${item.Employe.User.prenom}`,
            "Poste": item.Employe.Poste.poste,
            "Statut": item.statut,
            "Date": moment(item.date).format('YYYY-MM-DD'),
            "Heure d'entrée Matin": item.HeureEMP,
            "Heure de sortie Matin": item.HeureSMP,
            "Heure d'entrée Après-midi": item.HeureEAMP,
            "Heure de sortie Après-midi": item.HeureSAMP,
        })));

        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Pointages");
        XLSX.writeFile(wb, "liste_pointages.xlsx");
    };

    // afficher toutes les heures sup
    const [heuresSupplementaires, setHeuresSupplementaires] = useState([]);

    useEffect(() => {
        const fetchHeuresSupplementaires = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await axios.get('http://localhost:5000/HeureSup/liste', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                });
                setHeuresSupplementaires(response.data);
            } catch (error) {
                console.error("Erreur lors du chargement des heures supplémentaires:", error);
            }
        };
        fetchHeuresSupplementaires();
    }, []);


    useEffect(() => {
        if (selectedPointageId && formData[selectedPointageId]?.heuresupP === 0) {
            setFormData(prevFormData => ({
                ...prevFormData,
                [selectedPointageId]: {
                    ...prevFormData[selectedPointageId],
                    IdHeureSup: ''
                }
            }));
        }
    }, [formData[selectedPointageId]?.heuresupP, selectedPointageId]);
    return (
        <>
            <nav>
                <Link to="/dashboard" className="text-primary">Dashboard</Link>
                <span> / </span>
                <Link to="/RessourcesHumaines" className="text-primary">Ressources Humaines</Link>
                <span> / </span>
                <span>  Gestion du  Pointage manuel</span>
            </nav>
            <div className="card card-primary card-outline">
                <div className="card-header d-flex ">
                    <img src={rh} alt="" width="90px" />
                    <p className="card-title mt-5 ml-2 p-2 text-center" style={{ width: '350px', borderRadius: '50px', border: '1px solid rgb(215, 214, 216)' }}>
                        Gestion du  Pointage manuel
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
                                                <div className="card-header">

                                                    <div className='row mt-3'>
                                                        <div className="button-container" style={{ marginTop: '20px' }}>
                                                        </div>
                                                        <div className='col-md-4'>
                                                            <button className='btn btn-app p-1' onClick={handlePrint} >
                                                                <img src={print} alt="" width="30px" /><br />Imprimer
                                                            </button>
                                                            {/* <a className='btn btn-app p-1' href="#" onClick={handleShowModal}>
                                                                <img src={importt} alt="" width="30px" /><br />Importer
                                                            </a> */}
                                                            <Modal show={showModal} onHide={handleCloseModal}>
                                                                <Modal.Header className="text-center">
                                                                    <Modal.Title>Importer des étudiants</Modal.Title>
                                                                    <button
                                                                        type="button"
                                                                        className="btn-close"
                                                                        aria-label="Close"
                                                                        onClick={handleCloseModal}
                                                                        style={{ background: "none", border: "none" }}
                                                                    ></button>
                                                                </Modal.Header>
                                                                <Modal.Body>
                                                                    <div className="text-center">
                                                                        <button
                                                                            className="btn btn-success mb-3"
                                                                            onClick={handleDownloadTemplate}
                                                                        >
                                                                            Créer et télécharger le formulaire d'importation
                                                                        </button>
                                                                        <div className="custom-file mb-3">
                                                                            <input
                                                                                type="file"
                                                                                className="custom-file-input"
                                                                                id="customFile"
                                                                                onChange={handleFileChange}
                                                                            />
                                                                            <label className="custom-file-label" htmlFor="customFile">
                                                                                {fileName || "aucun fichier choisi"}
                                                                            </label>
                                                                        </div>
                                                                        <button
                                                                            className="btn btn-primary mb-3"
                                                                            onClick={handleImport}
                                                                        >
                                                                            Début de l'importation
                                                                        </button>
                                                                    </div>
                                                                    <div className="modal-footer">
                                                                        <button
                                                                            className="btn btn-secondary"
                                                                            onClick={handleCloseModal}
                                                                        >
                                                                            Annuler
                                                                        </button>
                                                                    </div>
                                                                </Modal.Body>
                                                            </Modal>
                                                            <button className='btn btn-app p-1' onClick={handleExport}>
                                                                <img src={exportt} alt="" width="25px" /><br />Exporter
                                                            </button>

                                                        </div>

                                                        <div className="col-md-4" style={{ flex: '1', marginRight: '10px' }}>
                                                            <div className="input-group mr-2">
                                                                <div className="form-outline" data-mdb-input-init> <input
                                                                    type="search"
                                                                    id="form1"
                                                                    className="form-control"
                                                                    placeholder="Recherche"
                                                                    style={{ height: "38px" }}
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
                                                <div className="card-body col-12 mt-2">
                                                    <div className='row'>
                                                        <div className="col-12  d-flex justify-content-center">
                                                            <button className=' mt-2 mb-4   btn btn-outline-dark'
                                                                onClick={ListeEmployeToday}>Afficher la liste des employés pour le pointage d'ajourdhui date
                                                                :{Datetoday}
                                                            </button>
                                                        </div>
                                                    </div>
                                                    <div className="row md-12">

                                                        {/* <div className="col-md-6 mb-4">
                                                            <label htmlFor="">Date du</label>
                                                            <input type="date" className='form-control' name='datedu' onChange={handledate} />

                                                        </div>
                                                        <div className="col-md-6 mb-4"> */}
                                                        {/* <label htmlFor="">Date a</label>
                                                            <input type="date" className='form-control' name='datea' onChange={handledate} />
                                                        </div> */}
                                                    </div>
                                                    <table className="table table-bordered " id="imprimer">
                                                        <thead>
                                                            <tr>
                                                                <th>Nom et Prénom</th>
                                                                <th>Poste</th>
                                                                <th>Heure d'entrée Matin</th>
                                                                <th>Heure de sortie l'après-midi</th>
                                                                <th>Heure d'entrée Matin</th>
                                                                <th>Heure de sortie l'après-midi</th>
                                                                <th>Statut</th>
                                                                <th>date</th>
                                                                <th>Heures supplémentaires</th>
                                                                <th>Modifier</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {filteredData.map((item) => (
                                                                <tr key={item.id}>
                                                                    <td>{item.Employe.User ? item.Employe.User.nom : "nom non défini"} {item.Employe.User?.prenom}</td>
                                                                    <td>{item.Employe && item.Employe.Poste ? item.Employe.Poste.poste : 'Poste non défini'}</td>
                                                                    <td>{item.Employe ? item.Employe.HeureEM : "heure non défini"}
                                                                        <br />
                                                                        <span className='text-danger'> {item.HeureEMP != item.Employe.HeureEM ? item.HeureEMP : ''}</span>
                                                                        <br />
                                                                        <span className='text-danger'> {item.statut === 'absent' ? 'Absent' : ''}</span>
                                                                    </td>
                                                                    <td>{item.Employe ? item.Employe.HeureSM : "heure non défini"}  <br />
                                                                        <span className='text-danger'> {item.HeureSMP != item.Employe.HeureSM ? item.HeureSMP : ''}</span><br />
                                                                        <span className='text-danger'> {item.statut === 'absent' ? 'Absent' : ''}</span>
                                                                    </td>
                                                                    <td>{item.Employe ? item.Employe.HeureEAM : "heure non défini"}  <br />
                                                                        <span className='text-danger'> {item.HeureEAMP != item.Employe.HeureEAM ? item.HeureEAMP : ''}</span>  <br />
                                                                        <span className='text-danger'> {item.statut === 'absent' ? 'Absent' : ''}</span>
                                                                    </td>
                                                                    <td>{item.Employe ? item.Employe.HeureSAM : "heure non défini"}  <br />
                                                                        <span className='text-danger'> {item.HeureSAMP != item.Employe.HeureSAM ? item.HeureSAMP : ''}</span>  <br />
                                                                        <span className='text-danger'> {item.statut === 'absent' ? 'Absent' : ''}</span>
                                                                    </td>
                                                                    <td>
                                                                        <span
                                                                            style={{
                                                                                backgroundColor:
                                                                                    item.statut === 'present'
                                                                                        ? 'green'
                                                                                        : item.statut === 'retard'
                                                                                            ? 'orange'
                                                                                            : item.statut === 'absent'
                                                                                                ? 'red'
                                                                                                : 'gray',
                                                                                color: 'white',
                                                                                borderRadius: '15px',
                                                                                padding: '1px 10px',
                                                                                display: 'inline-block',
                                                                                width: "90px",
                                                                                textAlign: 'center',
                                                                            }}
                                                                        >
                                                                            {item.statut}
                                                                        </span>
                                                                    </td>
                                                                    <td>{moment(item.date).format('YYYY-MM-DD')}</td>
                                                                    <td>{item.heuresupP}<br/>
                                                                        <small style={{ color: 'green' }}>{item.HeuresSup?.nom}</small>
                                                                    </td>
                                                                    <td>
                                                                        <Button onClick={() => handleShowModalStatut(
                                                                            item.id,
                                                                            item.HeureEMP,
                                                                            item.HeureSMP,
                                                                            item.HeureEAMP,
                                                                            item.HeureSAMP,
                                                                            item.Employe.User?.nom,
                                                                            item.Employe.User?.prenom,
                                                                            item.statut,
                                                                            item.heuresupP,
                                                                            item.justificationret,
                                                                            item.datea,
                                                                            item.datedu,
                                                                            item.IdHeureSup 
                                                                        )}>
                                                                            Modifier
                                                                        </Button>
                                                                        <Modal show={showModalStatut} onHide={handleCloseModalStatut} backdropClassName="custom-backdrop" style={{
                                                                            backgroundColor: "rgba(194, 194, 194, 0.59)",
                                                                            borderRadius: "10px",
                                                                            boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
                                                                        }}>

                                                                            <Modal.Header closeButton>
                                                                                <Modal.Title>Modifier le statut
                                                                                </Modal.Title>
                                                                            </Modal.Header>
                                                                            <Modal.Body style={{ maxHeight: "70vh", overflowY: "auto", overflowX: 'hidden' }}>

                                                                                <div >
                                                                                    <p>Employé: {formData[selectedPointageId]?.nom} {formData[selectedPointageId]?.prenom}</p>
                                                                                    <div className='row'>
                                                                                        <div className='col-12'>
                                                                                            <div className="d-flex gap-4">
                                                                                                <div className='col-4 d-flex align-items-center mr-4 mb-3'>
                                                                                                    <input
                                                                                                        type="radio"
                                                                                                        value="present"
                                                                                                        checked={statut[selectedPointageId] === 'present'}
                                                                                                        onChange={() => handleStatutChange('present')}
                                                                                                    />
                                                                                                    Présent
                                                                                                </div>
                                                                                                <div className='d-flex align-items-center mr-4 col-4 mb-3'>
                                                                                                    <input
                                                                                                        type="radio"
                                                                                                        value="retard"
                                                                                                        checked={statut[selectedPointageId] === 'retard'}
                                                                                                        onChange={() => handleStatutChange('retard')}
                                                                                                    />
                                                                                                    Retard
                                                                                                </div>
                                                                                                <div className='d-flex align-items-center mr-4 col-4 mb-3'>
                                                                                                    <input
                                                                                                        type="radio"
                                                                                                        value="absent"
                                                                                                        checked={statut[selectedPointageId] === 'absent'}
                                                                                                        onChange={() => handleStatutChange("absent")}
                                                                                                    />
                                                                                                    Absent
                                                                                                </div>
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>

                                                                                    {/* Heure supplémentaire */}
                                                                                    <div className="mb-3">
                                                                                        <div className="mb-3">
                                                                                            <label>Heure supplémentaire</label>
                                                                                            <div className="row">
                                                                                                <div className="col-md-6">
                                                                                                    <input
                                                                                                        type="number"
                                                                                                        placeholder="Nombre d'heures"
                                                                                                        min={0}
                                                                                                        className="form-control"
                                                                                                        name="heuresupP"
                                                                                                        value={formData[selectedPointageId]?.heuresupP || ''}
                                                                                                        onChange={handleChange}
                                                                                                    />
                                                                                                </div>
                                                                                                <div className="col-md-6">
                                                                                                    <select
                                                                                                        className="form-control"
                                                                                                        name="IdHeureSup"
                                                                                                        value={formData[selectedPointageId]?.IdHeureSup || ''}
                                                                                                        onChange={handleChange}
                                                                                                        disabled={!formData[selectedPointageId]?.heuresupP || parseInt(formData[selectedPointageId]?.heuresupP) === 0}
                                                                                                    >
                                                                                                        <option value="">Sélectionner le type</option>
                                                                                                        {heuresSupplementaires.map((hs) => (
                                                                                                            <option key={hs.id} value={hs.id}>
                                                                                                                {hs.nom} (Taux: {hs.taux})
                                                                                                            </option>
                                                                                                        ))}
                                                                                                    </select>
                                                                                                </div>
                                                                                            </div>
                                                                                        </div>

                                                                                    </div>
                                                                                </div>

                                                                                {/* {statut[selectedPointageId] === 'retard' && ( */}
                                                                                <Form >
                                                                                    <Form.Group controlId="formHeureEntreeMatin">
                                                                                        <Form.Label>Heure d'entrée Matin</Form.Label>
                                                                                        <Form.Control type="time" placeholder="HH:MM" name='HeureEMP' value={formData[selectedPointageId]?.HeureEMP || formData[selectedPointageId]?.HeureEM} onChange={handleChange} />
                                                                                    </Form.Group>

                                                                                    <Form.Group controlId="formHeureSortieApresMidi">
                                                                                        <Form.Label>Heure de sortie l'après-midi</Form.Label>
                                                                                        <Form.Control type="time" placeholder="HH:MM" name='HeureSMP' value={formData[selectedPointageId]?.HeureSMP || formData[selectedPointageId]?.HeureSM} onChange={handleChange} />
                                                                                    </Form.Group>

                                                                                    <Form.Group controlId="formHeureEntreeMatin2">
                                                                                        <Form.Label>Heure d'entrée Matin</Form.Label>
                                                                                        <Form.Control type="time" placeholder="HH:MM" name='HeureEAMP' value={formData[selectedPointageId]?.HeureEAMP || formData[selectedPointageId]?.HeureEAMP} onChange={handleChange} />
                                                                                    </Form.Group>

                                                                                    <Form.Group controlId="formHeureSortieApresMidi2">
                                                                                        <Form.Label>Heure de sortie l'après-midi</Form.Label>
                                                                                        <Form.Control type="time" placeholder="HH:MM" name='HeureSAMP' value={formData[selectedPointageId]?.HeureSAMP || formData[selectedPointageId]?.HeureSAMP} onChange={handleChange} />
                                                                                    </Form.Group>
                                                                                    <Form.Group controlId="justification">
                                                                                        <Form.Label>Justification du retard</Form.Label>
                                                                                        <Form.Control
                                                                                            as="textarea"
                                                                                            rows={3}
                                                                                            name='justificationret'
                                                                                            maxLength={200}
                                                                                            style={{ resize: 'none' }}
                                                                                            value={formData[selectedPointageId]?.justificationret || ''}
                                                                                            onChange={handleChange}
                                                                                            placeholder="Entrez votre justification ici..."
                                                                                        />
                                                                                    </Form.Group>
                                                                                </Form>
                                                                                {/* )} */}

                                                                                {statut[selectedPointageId] === 'absentt' && (
                                                                                    <Form>
                                                                                        <Form.Group controlId="formHeureEntreeMatin2">
                                                                                            <Form.Label> Du </Form.Label>
                                                                                            <Form.Control type="datetime-local" placeholder="du" name='datedu' value={formData[selectedPointageId]?.datedu || ''} onChange={handleChange} />
                                                                                        </Form.Group>

                                                                                        <Form.Group controlId="formHeureSortieApresMidi2">
                                                                                            <Form.Label> à</Form.Label>
                                                                                            <Form.Control type="datetime-local" name='datea' value={formData[selectedPointageId]?.datea || ''} onChange={handleChange} />
                                                                                        </Form.Group>
                                                                                        <Form.Group controlId="justification">
                                                                                        </Form.Group>
                                                                                    </Form>
                                                                                )}
                                                                            </Modal.Body>
                                                                            <Modal.Footer>
                                                                                <Button variant="secondary" onClick={handleCloseModalStatut}>
                                                                                    Annuler
                                                                                </Button>
                                                                                <Button variant="primary" onClick={ModifierPointage}>
                                                                                    Enregistrer
                                                                                </Button>
                                                                            </Modal.Footer>
                                                                        </Modal>
                                                                    </td>
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
                        <div className="tab-pane fade" id="formulaire" role="tabpanel" aria-labelledby="custom-content-below-profile-tab">
                            Ajouter
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default PointageManuel;