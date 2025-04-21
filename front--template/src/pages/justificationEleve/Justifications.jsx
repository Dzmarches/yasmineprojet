import React, { useEffect, useState } from 'react';
import exportt from '../../assets/imgs/excel.png';
import print from '../../assets/imgs/printer.png';
import importt from '../../assets/imgs/import.png';
import edit from '../../assets/imgs/edit.png';
import add from '../../assets/imgs/add.png';
import deletee from '../../assets/imgs/delete.png';
import detail from '../../assets/imgs/details.png';
import conge from '../../assets/imgs/leave.png';
import Select from 'react-select';
import { Link } from 'react-router-dom';
import axios from 'axios';
import moment from 'moment';
import recherche from '../../assets/imgs/recherche.png';
import vu from '../../assets/imgs/vu.png';

const Autorisations = () => {
    const url = 'http://localhost:5000'
    const [selectedOption, setSelectedOption] = useState(null);
    const [data, setData] = useState([]);
    const [DemandeId, setDemandeId] = useState(null);
    const [EmployeId, setEmployeId] = useState(null);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

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
            const response = await axios.get(`http://localhost:5000/justifications/ListeTousDA/`);
            if (response.status === 200) {
                if (Array.isArray(response.data)) {
                    setData(response.data);
                } else {
                    console.error("Les données ne sont pas un tableau !");
                }
            }
        } catch (error) {
            console.log(error);
        }
    };

    // Filtrage des données
    const filteredData = data.filter(item => {
        const itemDateDebut = moment(item.dateDebut).format('YYYY-MM-DD');
        const itemDateFin = moment(item.dateFin).format('YYYY-MM-DD');
        const matchesSearchTerm =
            (item.Employe && item.Employe.nom.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (item.Employe && item.Employe.prenom.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (item.type_demande && item.type_demande.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (item.statut && item.statut.toLowerCase().includes(searchTerm.toLowerCase()));
        const matchesDateRange =
            (!startDate || itemDateDebut >= startDate) &&
            (!endDate || itemDateFin <= endDate);
        return matchesSearchTerm && matchesDateRange;

    });

    const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
    const changeStatut = async (id, statut) => {


        try {
            const response = await axios.patch(`http://localhost:5000/justifications/changerstatut/${id}`, {
                statut: statut
            });

            if (response.status === 200) {
                listeDCA();
            }
        } catch (error) {
            console.error("Erreur lors du changement de statut :", error.response?.data || error.message);
        }
    };
    return (
        <>
            <nav className='mb-2'>
                <Link to="/home">Accueil</Link>
                <span> / </span>
                <span>les justifications  des élèves </span>
            </nav>

            <div className="card card-primary card-outline">
                <div className="card-header d-flex ">
                    <img src={conge} alt="" width="90px" />
                    <p className="card-title mt-5 ml-2 p-2 text-center" style={{ width: '400px', borderRadius: '50px', border: '1px solid rgb(215, 214, 216)' }}>
                    les justifications  des élèves
                    </p>
                </div>

                <div className="card-body p-2">
                    <div className="row mt-3">
                        <div className="col-6">
                            <a className="btn btn-app p-2">
                                <img src={print} alt="" width="30px" /><br />
                                Imprimer
                            </a>
                            <a className="btn btn-app p-2">
                                <img src={exportt} alt="" width="30px" /><br />
                                Exporter Excel
                            </a>
                            <a className="btn btn-app p-2">
                                <img src={importt} alt="" width="30px" /><br />
                                Importer Excel
                            </a>
                        </div>
                    </div>
                    <div className="row">
                        <div className="select-search col-12">
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
                        </div>
                    </div>

                    {/* Filtres par date */}
                    <div className="row mt-3">
                        <div className="col-6">
                            <label htmlFor="">Date du</label>
                            <input
                                type="date"
                                className="form-control"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                            />
                        </div>
                        <div className="col-6">
                            <label htmlFor="">Date à</label>
                            <input
                                type="date"
                                className="form-control"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                            />
                        </div>
                    </div>
                </div>
                <div className="card-body ">
                    <table id="example2" className="table table-bordered ">
                        <thead>
                            <tr>
                                <th width="3%">Id</th>
                                <th width="15%">Nom et prénom</th>
                                <th width="10%">Type de la demande</th>
                                <th width="10%">Du</th>
                                <th width="10%">À</th>
                                <th width="20%">Commentaire</th>
                                <th width="10%">Justification</th>
                                <th width="6%">Statut</th>
                                <th width="5%">Mettre à jour statut</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentItems.map((item, index) => (
                                <tr key={index}>
                                    <td>{indexOfFirstItem + index + 1}</td>
                                    <td></td>

                                    <td>{item.type_demande} <br />
                                        {(item.RaisonA) ? item.RaisonA : ''}
                                    </td>
                                    <td>{moment(item.dateDebut).format('YYYY-MM-DD HH:mm:ss')}</td>
                                    <td>{moment(item.dateFin).format('YYYY-MM-DD HH:mm:ss')}</td>
                                    <td>{item.commentaire} </td>
                                    <td> <div
                                        style={{
                                            width: "80px",
                                            height: "80px",
                                            border: "2px solid gray",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            overflow: "hidden",
                                            cursor: "pointer",
                                            padding: "5px",
                                        }}
                                        onClick={() => {
                                            item ? window.open(url + item.file, "_blank") : ''
                                        }}>
                                        <img
                                            src={item ? url + item.file : ''}
                                            alt="image"
                                            style={{
                                                width: "100%",
                                                height: "100%",
                                                objectFit: "cover",
                                            }}
                                        />
                                    </div>
                                    </td>
                                    <td>{item.statut} </td>

                                    <td width="300px" className='text-center'>
                                        <button className='btn btn-outline-success' onClick={() => changeStatut(item.id, "Consulté")}>
                                            <img src={vu} alt="" width="22px" title='Mettre à jour le statut en Consulté' />
                                        </button>&nbsp; &nbsp; &nbsp;
                                    </td>
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


            </div>
        </>
    );
}

export default Autorisations;