import React, { useEffect, useState } from 'react';
import exportt from '../../../assets/imgs/excel.png';
import print from '../../../assets/imgs/printer.png';
import edit from '../../../assets/imgs/edit.png';
import add from '../../../assets/imgs/add.png';
import deletee from '../../../assets/imgs/delete.png';
import { Link } from 'react-router-dom';
import axios from 'axios';
import moment from 'moment';
import Select from 'react-select';
import { Modal, Button } from 'react-bootstrap';
import recherche from '../../../assets/imgs/recherche.png';
import excel from '../../../assets/imgs/excel.png';
import archive from '../../../assets/imgs/archive.png';
import paimentt from '../../../assets/imgs/paiementt.png';
import paiement from '../../../assets/imgs/paiement.png';
import * as XLSX from 'xlsx';

const PeriodesPaie = () => {
    
    const [errors, setErrors] = useState({});
    const [selectedOption, setSelectedOption] = useState(null);
    const options = [
        { value: 'Ouverte', label: 'Ouverte' },
        // { value: 'En traitement', label: 'En traitement' },
        { value: 'Clôturée', label: 'Clôturée' },
    ];
    const [formData, setFormData] = useState({
        code: "",
        dateDebut: "",
        dateFin: "",
        statut: "",
    });
    const [data, setData] = useState([]);
    const [demandeIdToDelete, setDemandeIdToDelete] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [isEditMode, setIsEditMode] = useState(false);
    const [editId, setEditId] = useState(null);

    // Fonction pour charger la liste des périodes de paie
    const ListePeriodesPaie = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                alert("Vous devez être connecté");
                return;
            }
            const response = await axios.get(`http://localhost:5000/PeriodePaie/liste/`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });
            if (response.status === 200 && Array.isArray(response.data)) {
                setData(response.data);
            } else {
                console.error("Les données ne sont pas un tableau !");
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        ListePeriodesPaie();
    }, []);

    // Fonction pour gérer les changements dans le formulaire
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };


    const handleChangeStatut = (selectedOption) => {
        setSelectedOption(selectedOption);
        setFormData({ ...formData, statut: selectedOption.value });
    };

    // Fonction pour valider le formulaire
    const validateForm = () => {
        const newErrors = {};

        if (!formData.code) {
            newErrors.code = "Le code est requis";
        }
        if (!formData.dateDebut) {
            newErrors.dateDebut = "La date de début est requise";
        }
        if (!formData.dateFin) {
            newErrors.dateFin = "La date de fin est requise";
        }
        if (!formData.statut) {
            newErrors.statut = "statut est requis";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    // Fonction pour ajouter ou modifier une période de paie
    const AjouterPeriodePaie = async () => {
        if (!validateForm()) return;
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                alert("Vous devez être connecté");
                return;
            }
            let response;
            if (isEditMode) {
                response = await axios.put(`http://localhost:5000/PeriodePaie/modifier/${editId}`, formData, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                });
                alert('Période de paie modifiée avec succès');
            } else {
                response = await axios.post('http://localhost:5000/PeriodePaie/ajouter', formData, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                });
                alert('Période de paie ajoutée avec succès');
            }
            setFormData({
                code: "",
                dateDebut: "",
                dateFin: "",
                statut: "",
            });
            setIsEditMode(false);
            setEditId(null);
            setSelectedOption("");
            await ListePeriodesPaie();
        } catch (error) {
            console.error("Erreur :", error);
            alert("Une erreur est survenue !");
        }
    };

    // Fonction pour archiver une période de paie
    const ArchiverPeriodePaie = async (id) => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                alert("Vous devez être connecté");
                return;
            }
            const response = await axios.patch(`http://localhost:5000/PeriodePaie/archiver/${id}`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });
            await ListePeriodesPaie();
            console.log(response.data);
        } catch (error) {
            console.log("Erreur", error);
        }
    };

    const handleEdit = (item) => {
        setIsEditMode(true);
        setEditId(item.id);
        setFormData({
            code: item.code,
            dateDebut: moment(item.dateDebut).format("YYYY-MM-DD"),
            dateFin: moment(item.dateFin).format("YYYY-MM-DD"),
            statut: item.statut,
        });
        // Mettre à jour selectedOption pour  Select
        const selectedStatut = options.find(option => option.value === item.statut);
        setSelectedOption(selectedStatut);
    };

    const handleExport = () => {
        const ws = XLSX.utils.json_to_sheet(data.map(item => ({
            "Code": item.code,
            "Date Début": item.dateDebut,
            "Date Fin": item.dateFin,
            "Statut": item.statut,
            "Ecole Principale": item.EcolePrincipal?.nomecole,
        })));
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "PeriodesPaie");
        XLSX.writeFile(wb, "listePeriodesPaie.xlsx");
    };
    const handlePrint = () => {
        const printWindow = window.open("", "", "width=800,height=600");
        printWindow.document.write(`
            <html>
                <head>
                    <title>Périodes de paie</title>
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
                    <h5>Rapport des périodes de paie</h5>
                    <table>
                        <thead>
                            <tr>
                                <th>Id</th>
                                <th>Code Période</th>
                                <th>Date Début</th>
                                <th>Date Fin</th>
                                <th>Statut</th>
                                <th>École Principale</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${currentItems.map((item, index) => `
                                <tr>
                                    <td>${index + 1}</td>
                                    <td>${item.code}</td>
                                    <td>${moment(item.dateDebut).format("YYYY-MM-DD")}</td>
                                    <td>${moment(item.dateFin).format("YYYY-MM-DD")}</td>
                                    <td>${item.statut}</td>
                                    <td>${item.EcolePrincipal?.nomecole || "N/A"}</td>
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

    //seartch
    const filteredData = data.filter(item => {
        const matchesSearchTerm =
            (item.code && item.code.toLowerCase().includes(searchTerm.toLowerCase().trim())) ||
            (moment(item.dateDebut).format("YYYY-MM-DD") && moment(item.dateDebut).format("YYYY-MM-DD").toString().toLowerCase().includes(searchTerm.toLowerCase().trim())) ||
            (moment(item.dateFin).format("YYYY-MM-DD") && moment(item.dateFin).format("YYYY-MM-DD").toString().toLowerCase().includes(searchTerm.toLowerCase().trim())) ||
            (item.statut && item.statut.toLowerCase().includes(searchTerm.toLowerCase().trim()))
        return matchesSearchTerm;
    });

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


    const handleClose = () => setShowDeleteModal(false);
    const handleShow = (id) => {
        setDemandeIdToDelete(id);
        setShowDeleteModal(true);
    };

    return (
        <>
            <nav>
                <Link to="/dashboard" className="text-primary">Dashboard</Link>
                <span> / </span>
                <Link to="/Gpaiement" className="text-primary">Gestion Paie</Link>
                <span> / </span>
                <span>Périodes de paie</span>
            </nav>

            <div className="card card-primary card-outline">
                <div className="card-header d-flex">
                    <img src={paimentt} className='mt-2' width="60px" height="80px" />
                    <p className="card-title mt-5 ml-2 p-2 text-center" style={{ width: '350px', borderRadius: '50px', border: '1px solid rgb(215, 214, 216)' }}>
                        Périodes de paie
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
                                                <div className="card-header " style={{ backgroundColor: "#f8f8f8" }}>
                                                    <div className="modal-body">
                                                        <div className="card-body border-0 rounded-lg">
                                                            <div className="row">
                                                                {/* Code */}
                                                                <div className="col-md-3">
                                                                    <label>Code *</label>
                                                                    <input type="text" className="form-control" name="code" style={{height:"40px"}}
                                                                     value={formData.code} onChange={handleChange} />
                                                                    {errors.code && <span className="text-danger">{errors.code}</span>}
                                                                </div>

                                                                {/* Date Début */}
                                                                <div className="col-md-3">
                                                                    <label>Date Début *</label>
                                                                    <input type="date" className="form-control"  style={{height:"40px"}}
                                                                    name="dateDebut" value={formData.dateDebut} onChange={handleChange} />
                                                                    {errors.dateDebut && <span className="text-danger">{errors.dateDebut}</span>}
                                                                </div>

                                                                {/* Date Fin */}
                                                                <div className="col-md-3">
                                                                    <label>Date Fin *</label>
                                                                    <input type="date" className="form-control" name="dateFin" value={formData.dateFin}
                                                                     onChange={handleChange}  style={{height:"40px"}}/>
                                                                    {errors.dateFin && <span className="text-danger">{errors.dateFin}</span>}
                                                                </div>

                                                                {/* Statut */}
                                                                <div className="col-md-3">
                                                                    <label>Statut *</label>
                                                                    <Select
                                                                        value={selectedOption}
                                                                        onChange={handleChangeStatut}
                                                                        options={options}

                                                                    />
                                                                    {errors.statut && <span className="text-danger">{errors.statut}</span>}
                                                                </div>
                                                                {/* Boutons */}
                                                                <div className="col-md-12 mt-3">
                                                                    <button type="button" className="btn btn-outline-primary" onClick={AjouterPeriodePaie}>
                                                                        {isEditMode ? "Modifier" : "Ajouter"}
                                                                    </button>
                                                                    {isEditMode && (
                                                                        <button type="button" className="btn btn-outline-secondary ml-2"
                                                                            onClick={() => {
                                                                                setIsEditMode(false);
                                                                                setEditId(null);
                                                                                setFormData({
                                                                                    code: "",
                                                                                    dateDebut: "",
                                                                                    dateFin: "",
                                                                                    statut: "",
                                                                                });
                                                                            }}>
                                                                            Annuler
                                                                        </button>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="card-body ">
                                                    <div className="row">
                                                        <div className="col-md-4">
                                                            <button className="btn btn-app p-1" onClick={handlePrint}>
                                                                <img src={print} alt="" width="30px" /><br />Imprimer
                                                            </button>
                                                            <button className='btn btn-app p-1' onClick={handleExport}>
                                                                <img src={excel} alt="" width="25px" /><br />Exporter
                                                            </button>
                                                        </div>
                                                        <div className="col-md-4 ml-auto ">
                                                            <div className="input-group mr-2">
                                                                <div className="form-outline">
                                                                    <input
                                                                        type="search"
                                                                        id="form1"
                                                                        className="form-control"
                                                                        placeholder="Recherche"
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
                                                    </div>

                                                    <p>Liste des périodes de paie</p>
                                                    <table id="example2" className="table table-bordered">
                                                        <thead>
                                                            <tr>
                                                                <th>Id</th>
                                                                <th>Période</th>
                                                                <th>Code</th>
                                                                <th>Date Début</th>
                                                                <th>Date Fin</th>
                                                                <th>Statut</th>
                                                                <th>École Principale</th>
                                                                <th>Action</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {currentItems.sort().reverse().map((item, index) => (
                                                                <tr key={index}>
                                                                    <td>{index + 1}</td>
                                                                    <td>
                                                                        <Link to={`/bulletins_paie/${item.id}`}>
                                                                            {new Date(item.dateDebut).toLocaleDateString('fr-FR', { month: 'long' }).toUpperCase()} -
                                                                            {new Date(item.dateFin).toLocaleDateString('fr-FR', { month: 'long' }).toUpperCase()}
                                                                        </Link>
                                                                    </td>
                                                                    <td>{item.code}</td>
                                                                    <td>{moment(item.dateDebut).format("YYYY-MM-DD")}</td>
                                                                    <td>{moment(item.dateFin).format("YYYY-MM-DD")}</td>

                                                                    <td>{item.statut}</td>
                                                                    <td>{item.EcolePrincipal.nomecole}</td>
                                                                    <td width="300px" className="text-center">
                                                                        <Link to={`/bulletins_paie/${item.id}`} className="btn btn-outline-warning p-2">
                                                                            <img src={paiement} alt="" width="27px" title="Liste des employés et leurs bulletins de paie" />
                                                                        </Link>
                                                                        &nbsp;&nbsp;&nbsp;&nbsp;
                                                                        <a className="btn btn-outline-success p-2" onClick={() => handleEdit(item)}>
                                                                            <img src={edit} alt="" width="27px" title="Modifier" />
                                                                        </a>
                                                                        &nbsp;&nbsp;&nbsp;&nbsp;
                                                                        <a className="btn btn-outline-danger p-2" onClick={() => handleShow(item.id)}>
                                                                            <img src={deletee} alt="" width="27px" title="Supprimer" />
                                                                        </a>
                                                                        &nbsp;&nbsp;&nbsp;&nbsp;
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
                        </div>
                    </div>
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

                <Modal show={showDeleteModal} onHide={handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Confirmer la suppression</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p>Êtes-vous sûr de vouloir supprimer cette periode ?</p>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose}>
                            Annuler
                        </Button>
                        <Button
                            variant="danger"
                            onClick={() => {
                                ArchiverPeriodePaie(demandeIdToDelete);
                                handleClose();
                            }}
                        >
                            Supprimer
                        </Button>
                    </Modal.Footer>
                </Modal>

            </div>
        </>
    );
};

export default PeriodesPaie;