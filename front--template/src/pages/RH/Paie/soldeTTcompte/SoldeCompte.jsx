import React, { useEffect, useState } from 'react';
import exportt from '../../../../assets/imgs/excel.png';
import print from '../../../../assets/imgs/printer.png';
import edit from '../../../../assets/imgs/edit.png';
import add from '../../../../assets/imgs/add.png';
import deletee from '../../../../assets/imgs/delete.png';
import { Link } from 'react-router-dom';
import axios from 'axios';
import moment from 'moment';
import Select from 'react-select';
import { Modal, Button } from 'react-bootstrap';
import recherche from '../../../../assets/imgs/recherche.png';
import excel from '../../../../assets/imgs/excel.png';
import archive from '../../../../assets/imgs/archive.png';
import paimentt from '../../../../assets/imgs/paiementt.png';
import paiement from '../../../../assets/imgs/paiement.png';
import * as XLSX from 'xlsx';

const SoldeCompte = () => {

    const [data, setData] = useState([]);
    const [demandeIdToDelete, setDemandeIdToDelete] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');



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

                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {currentItems.sort().reverse().map((item, index) => (
                                                                <tr key={index}>
                                                                    <td>{index + 1}</td>
                                                                    <td>
                                                                        <Link to={`/bulletins_paie/NonEmploye/${item.id}`}>
                                                                            {new Date(item.dateDebut).toLocaleDateString('fr-FR', { month: 'long' }).toUpperCase()} -
                                                                            {new Date(item.dateFin).toLocaleDateString('fr-FR', { month: 'long' }).toUpperCase()}
                                                                        </Link>
                                                                    </td>
                                                                    <td>{item.code}</td>
                                                                    <td>{moment(item.dateDebut).format("YYYY-MM-DD")}</td>
                                                                    <td>{moment(item.dateFin).format("YYYY-MM-DD")}</td>

                                                                    <td>{item.statut}</td>
                                                                    <td>{item.EcolePrincipal.nomecole}</td>
                                                                    <td> 
                                                                     <Link to={`/bulletins_paie/NonEmploye/${item.id}`} className="btn btn-outline-warning p-2">
                                                                        <img src={paiement} alt="" width="27px" title="Liste des employés et leurs bulletins de paie" />
                                                                    </Link></td>
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
            </div>
        </>
    );
};

export default SoldeCompte;