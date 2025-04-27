import React, { useEffect, useState } from 'react';
import exportt from '../../assets/imgs/excel.png';
import edit from '../../assets/imgs/edit.png';
import add from '../../assets/imgs/add.png';
import deletee from '../../assets/imgs/delete.png';
import { Link } from 'react-router-dom';
import axios from 'axios';
import moment from 'moment';
import Select from 'react-select';
import { Modal, Button } from 'react-bootstrap';
import recherche from '../../assets/imgs/recherche.png';
import excel from '../../assets/imgs/excel.png';
import archive from '../../assets/imgs/archive.png';
import paimentt from '../../assets/imgs/paiementt.png';
import * as XLSX from 'xlsx';


const Typedepense = () => {
    const [errors, setErrors] = useState({});

    const [formData, setFormData] = useState({
        type: "",
        remarque: "",
    });

    const styleRemarque={
        whiteSpace: "pre-wrap", /* Allows line breaks */
        wordWrap: "break-word", /* Handles long words */
        maxWidth: "200px", /* Limits the width of the cell */
    
}
    const [data, setData] = useState([]);
    const [demandeIdToDelete, setDemandeIdToDelete] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [isEditMode, setIsEditMode] = useState(false);
    const [editId, setEditId] = useState(null);


    // Fonction pour charger la liste des périodes de paie
    const ListeTR = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                alert("Vous devez être connecté");
                return;
            }
            const response = await axios.get(`http://localhost:5000/Typedepenses/liste/`, {
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
        ListeTR();
    }, []);

    // Fonction pour gérer les changements dans le formulaire
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };
    // Fonction pour valider le formulaire
    const validateForm = () => {
        const newErrors = {};
        if (!formData.type) {
            newErrors.type = "Type est requis";
        }
        if (formData.remarque.length > 200) {
            newErrors.remarque = "La remarque ne doit pas dépasser 200 caractères";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const AjouterModifierTR = async () => {
        if (!validateForm()) return;
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                alert("Vous devez être connecté");
                return;
            }
            let response;
            if (isEditMode) {
                console.log('token', token)
                console.log('edit mode', isEditMode)
                response = await axios.put(`http://localhost:5000/Typedepenses/modifier/${editId}`, formData, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                });
                alert(' modifiée avec succès');
            } else {
                response = await axios.post('http://localhost:5000/Typedepenses/ajouter', formData, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                });
                alert('ajoutée avec succès');


            }

            setFormData({
                type: "",
                remarque: "",

            });
            setIsEditMode(false);
            setEditId(null);
            await ListeTR();
        } catch (error) {

            if (error.status === 400) {
                alert(error.response.data.message)

            } else {
                console.error("Erreur :", error);
                alert("Une erreur est survenue !");
            }

        }
    };

    // Fonction pour archiver une période de paie
    const ArchiverHS = async (id) => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                alert("Vous devez être connecté");
                return;
            }
            const response = await axios.patch(`http://localhost:5000/Typedepenses/archiver/${id}`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });
            await ListeTR();
            console.log(response.data);
        } catch (error) {
            console.log("Erreur", error);
        }
    };

    const handleEdit = (item) => {
        setIsEditMode(true);
        setEditId(item.id);
        setFormData({
            type: item.type,
            remarque: item.remarque,
        });
    };
    const handleExport = () => {
        const ws = XLSX.utils.json_to_sheet(data.map(item => ({
            "Type": item.type,
            "Remarque": item.remarque,
            "Ecole Principale": item.EcolePrincipal?.nomecole,
            "Ecole": item.Ecole?.nomecole,
        })));
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "heures supplémentaires");
        XLSX.writeFile(wb, "heures_suplémentaires.xlsx");
    };
    //seartch
    const filteredData = data.filter(item => {
        const matchesSearchTerm =
            (item.type && item.type.toLowerCase().includes(searchTerm.toLowerCase().trim())) ||
            (item.Ecole?.nomecole && item.Ecole?.nomecole.toLowerCase().includes(searchTerm.toLowerCase().trim())) ||
            (item.EcolePrincipal?.nomecole && item.EcolePrincipal?.nomecole.toLowerCase().includes(searchTerm.toLowerCase().trim())) ||
            (item.remarque && item.remarque.toString().toLowerCase().includes(searchTerm.toLowerCase().trim()))
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
            {/* <nav>
                <Link to="/dashboard" className="text-primary">Dashboard</Link>
                <span> / </span>
                <span>Gestion des types de dépenses</span>
            </nav> */}

            {/* <div className="card card-primary card-outline"> */}
                {/* <div className="card-header d-flex">
                    <img src={paimentt} className='mt-2' width="60px" height="80px" />
                    <p className="card-title mt-5 ml-2 p-2 text-center" style={{ width: '350px', borderRadius: '50px', border: '1px solid rgb(215, 214, 216)' }}>
                        Gestion des types de dépenses
                    </p>
                </div> */}
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
                                                                <div className="col-md-4">
                                                                    <label>Type *</label>
                                                                    <input type="text" className="form-control" name="type"
                                                                        value={formData.type} onChange={handleChange} style={{ height: "40px" }}
                                                                    />
                                                                    {errors.type && <span className="text-danger">{errors.type}</span>}
                                                                </div>

                                                                <div className="col-md-4">
                                                                    <label>Remarque </label>
                                                                    <input type="text" className="form-control" name="remarque" style={{ height: "40px" }}
                                                                     value={formData.remarque} onChange={handleChange}
                                                                      />
                                                                    {errors.remarque && <span className="text-danger">{errors.remarque}</span>}<br />
                                                                </div>

                                                                {/* Boutons */}
                                                                <div className="col-md-4" style={{ marginTop: '40px' }}>
                                                                    <button type="button" className="btn btn-outline-primary" onClick={AjouterModifierTR}>
                                                                        {isEditMode ? "Modifier" : "Ajouter"}
                                                                    </button>
                                                                    {isEditMode && (
                                                                        <button type="button" className="btn btn-outline-secondary ml-2"
                                                                            onClick={() => {
                                                                                setIsEditMode(false);
                                                                                setEditId(null);
                                                                                setFormData({
                                                                                    type: "",
                                                                                    remarque: "",
                                                                                });
                                                                            }}
                                                                        >
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

                                                    <p>Liste des types de dépenses</p>
                                                    <table id="example2" className="table table-bordered table-sm">
                                                        <thead>
                                                            <tr>
                                                                <th width="1px">Id</th>
                                                                <th >Type</th>
                                                                <th>Remarque</th>
                                                                <th>École Principale</th>
                                                                <th>École</th>
                                                                <th>Action</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {currentItems.sort().reverse().map((item, index) => (
                                                                <tr key={index}>
                                                                    <td width="1px">{index + 1}</td>
                                                                    <td>{item.type}</td>
                                                                    <td style={styleRemarque}>{item.remarque}</td>                                                                    <td>{item.EcolePrincipal?.nomecole}</td>
                                                                    <td>{item.Ecole?.nomecole}</td>
                                                                    <td className="text-center">
                                                                        <a className="btn btn-outline-success p-2"
                                                                            onClick={() => handleEdit(item)}
                                                                        >
                                                                            <img src={edit} alt="" width="20px" title="Modifier" />
                                                                        </a>
                                                                        &nbsp;&nbsp;&nbsp;&nbsp;
                                                                        <a
                                                                            className="btn btn-outline-warning p-2"
                                                                            onClick={() => handleShow(item.id)}
                                                                        >
                                                                            <img src={deletee} alt="" width="20px" title="Supprimer" />
                                                                        </a>
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
                        <p>Êtes-vous sûr de vouloir supprimer ?</p>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose}>
                            Annuler
                        </Button>
                        <Button
                            variant="danger"
                            onClick={() => {
                                ArchiverHS(demandeIdToDelete);
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

export default Typedepense;


