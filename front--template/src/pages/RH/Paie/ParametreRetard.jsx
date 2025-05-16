import React, { useEffect, useState } from 'react';
import edit from '../../../assets/imgs/edit.png';
import deletee from '../../../assets/imgs/delete.png';
import { Link } from 'react-router-dom';
import axios from 'axios';
import moment from 'moment';
import Select from 'react-select';
import { Modal, Button } from 'react-bootstrap';
import recherche from '../../../assets/imgs/recherche.png';
import paimentt from '../../../assets/imgs/en-retard.png';
import * as XLSX from 'xlsx';

const ParametreRetard = () => {

    const [errors, setErrors] = useState({});
    const [selectedOption, setSelectedOption] = useState(null);
    const options = [
        { value: 'journée', label: 'journée' },
        { value: 'demi-journée', label: 'demi-journée' },
        { value: 'autorisé', label: 'autorisé' },
        { value: 'autre', label: 'autre' },

    ];
    const [formData, setFormData] = useState({ HE: null, Rmax: null, Rmin: null, statut: '', });

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
            const response = await axios.get(`http://localhost:5000/ParametreRetard/liste/`, {
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
        if (!formData.Rmax) {
            newErrors.Rmax = "champ est requise";
        }
        if (!formData.Rmin) {
            newErrors.Rmin = "champ est requise";
        }
        if (!formData.statut) {
            newErrors.statut = "champ est requis";
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
                response = await axios.put(`http://localhost:5000/ParametreRetard/modifier/${editId}`, formData, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                });
                alert('modifiée avec succès');

            } else {
                response = await axios.post('http://localhost:5000/ParametreRetard/ajouter', formData, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                });
                alert('ajoutée avec succès');

            }
            setFormData({ HE: null, Rmax: "", Rmin: "", statut: "", });
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
            const response = await axios.patch(`http://localhost:5000/ParametreRetard/archiver/${id}`, {}, {
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
            HE: item.HE,
            Rmax: item.Rmax,
            Rmin: item.Rmin,
            statut: item.statut,
        });
        // Mettre à jour selectedOption pour  Select
        const selectedStatut = options.find(option => option.value === item.statut);
        setSelectedOption(selectedStatut);
    };

    //seartch
    const filteredData = data.filter(item => {
        const matchesSearchTerm =
            (item.HE && item.HE.toLowerCase().includes(searchTerm.toLowerCase().trim())) ||
            (item.Rmax && moment(item.Rmax).toString().toLowerCase().includes(searchTerm.toLowerCase().trim())) ||
            (item.Rmin && moment(item.Rmin).toString().toLowerCase().includes(searchTerm.toLowerCase().trim())) ||
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

                                                            <div className="col-md-3">
                                                                <label>Retard Min  *</label>
                                                                <input type="time" className="form-control" name="Rmin" value={formData.Rmin}
                                                                    onChange={handleChange} style={{ height: '40px' }} />
                                                                {errors.Rmin && <span className="text-danger">{errors.Rmin}</span>}
                                                            </div>

                                                            <div className="col-md-3">
                                                                <label>Retard Max *</label>
                                                                <input type="time" className="form-control" name="Rmax" value={formData.Rmax}
                                                                    onChange={handleChange} style={{ height: '40px' }} />
                                                                {errors.Rmax && <span className="text-danger">{errors.Rmax}</span>}
                                                            </div>

                                                            <div className="col-md-3">
                                                                <label>Equivalent temps à déduire *</label>
                                                                <Select
                                                                    value={selectedOption}
                                                                    onChange={handleChangeStatut}
                                                                    options={options}
                                                                />
                                                                {errors.statut && <span className="text-danger">{errors.statut}</span>}
                                                            </div>
                                                            {(selectedOption?.value === 'autre' &&
                                                                <div className="col-md-3">
                                                                    <label>Equivalent heure à déduire*</label>
                                                                    <input type="time" className="form-control" name="HE" value={formData.HE}
                                                                     onChange={handleChange}  style={{height:"40px"}}/>
                                                                    <small className='text-muted'>Entrer le temps (en heures) correspondant au retard</small>
                                                                </div>

                                                            )}

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
                                                                            setFormData({ HE: "", Rmax: "", Rmin: "", statut: "" });
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

                                                <p>Liste Paramétre Retards</p>
                                                <table id="example2" className="table table-bordered table-sm">
                                                    <thead>
                                                        <tr>
                                                            <th>Id</th>
                                                            <th>Retard Min {('(<)')}</th>
                                                            <th>Retard Max {('(>=)')}</th>
                                                            <th>Equivalent temps à déduire</th>
                                                            <th>École Principale</th>
                                                            <th>Action</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {currentItems.sort().reverse().map((item, index) => (
                                                            <tr key={index}>
                                                                <td>{index + 1}</td>
                                                                <td>{item.Rmin}</td>
                                                                <td>{item.Rmax}</td>
                                                                <td>
                                                                    {item.statut}<br />
                                                                    {item.statut === "autre" &&
                                                                        <span style={{
                                                                            backgroundColor: '#ff4d4d',
                                                                            color: 'white',
                                                                            borderRadius: '15px',
                                                                            padding: '1px 10px',
                                                                            display: 'inline-block',
                                                                            textAlign: 'center',

                                                                        }}
                                                                        >{item.HE}</span>}
                                                                </td>
                                                                <td>{item.EcolePrincipal?.nomecole}</td>
                                                             <td style={{ maxWidth: "25px" }}>
                                                             <div className="d-flex gap-2 ">
                                                                    <button
                                                                        className="btn btn-outline-success action-btn"
                                                                        onClick={() => handleEdit(item)}>
                                                                        <img src={edit} alt="" width="27px" title="Modifier" className="action-icon" />
                                                                    </button>
                                                                    <button
                                                                        className="btn btn-outline-danger action-btn"
                                                                        onClick={() => handleShow(item.id)}>
                                                                        <img src={deletee} alt="" width="27px" title="Supprimer" className="action-icon" />
                                                                    </button>
                                                                </div>
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

            {/* </div> */}
        </>
    );
};

export default ParametreRetard;


