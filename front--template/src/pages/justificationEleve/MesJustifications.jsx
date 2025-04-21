import React, { useEffect, useState } from 'react';
import exportt from '../../assets/imgs/excel.png';
import print from '../../assets/imgs/printer.png';
import importt from '../../assets/imgs/import.png';
import edit from '../../assets/imgs/edit.png';
import add from '../../assets/imgs/add.png';
import deletee from '../../assets/imgs/delete.png';
import detail from '../../assets/imgs/details.png';
import conge from '../../assets/imgs/leave.png';
import { Link } from 'react-router-dom';
import annuler from '../../assets/imgs/annuler.png';
import axios from 'axios';
import moment from 'moment';
import recherche from '../../assets/imgs/recherche.png';
import AddJustification from './AddJustification';
import DetailJustification from './DetailJustification';
import { Modal, Button } from 'react-bootstrap';


const MesAutorisations = () => {
  const [data, setData] = useState([]);
  const [demandeId, setDemandeId] = useState(null);
  const [demandeIdToDelete, setDemandeIdToDelete] = useState(null);
  const [demandeStautToDelete, setDemandeStautToDelete] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);


  // Pagination
  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = Array.isArray(data) ? data.slice(indexOfFirstItem, indexOfLastItem) : [];
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
    const id = 2;
    listeMesDA(id);
  }, []);

  const listeMesDA = async (id) => {
    try {

      const token = localStorage.getItem("token");
      if (!token) {
          alert("Vous devez être connecté");
          return;
      }
      const response = await axios.get(`http://localhost:5000/justifications/listeDA/${id}`,{
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


  const handleDeleteDemande = async (id) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
          alert("Vous devez être connecté");
          return;
      }
      const response = await axios.delete(`http://localhost:5000/justifications/supprimerMademande/${id}`,{
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
    });
      if (response.status === 200) {
        setData(currentItems.filter(item => item.id !== id));
      }
    } catch (error) {
      console.error("Erreur lors de la suppression de la demande:", error);
      alert("Erreur lors de la suppression de la demande.");
    }
  };
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredData = data.filter(item => {
    const itemDateDebut = moment(item.dateDebut).format('YYYY-MM-DD HH:mm:ss');
    const itemDateFin = moment(item.dateFin).format('YYYY-MM-DD HH:mm:ss');

    const matchesSearchTerm =
      (item.statut && item.statut.toLowerCase().includes(searchTerm.toLowerCase().trim())) ||
      (item.type_demande && item.type_demande.toLowerCase().includes(searchTerm.toLowerCase().trim()));

    const matchesDateRange =
      (!startDate || itemDateDebut >= startDate) &&
      (!endDate || itemDateFin <= endDate);

    return matchesSearchTerm && matchesDateRange;
  });

  const handleClose = () => setShowDeleteModal(false);
  const handleShow = (id) => {
    setDemandeIdToDelete(id);
    setShowDeleteModal(true);
  };




  return (
    <>
      <nav className='mb-2'>
        <Link to="/home">Accueil</Link>
        <span> / </span>
        <span>Gestion des justifications</span>
      </nav>

      <div className="card card-primary card-outline">
        <div className="card-header d-flex">
          <img src={conge} alt="" width="90px" />
          <p className="card-title mt-5 ml-2 p-2 text-center" style={{ width: '350px', borderRadius: '50px', border: '1px solid rgb(215, 214, 216)' }}>
            Gestion de mes justifications
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
                          <div className='row mt-3'>
                            <div className='col-md-4'>
                              <button className="btn btn-app p-2" data-toggle="modal" data-target="#addAutorisation">
                                <img src={add} alt="" width="30px" /><br />
                                Ajouter Demande
                              </button>
                              <a className='btn btn-app p-1' href="">
                                <img src={print} alt="" width="30px" /><br />Imprimer
                              </a>
                            </div>

                            <div className="col-md-3">
                              <input
                                type="date"
                                className="form-control"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                style={{ height: '40px' }}
                              />
                            </div>
                            <div className="col-md-3">
                              <input
                                type="date"
                                className="form-control"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                style={{ height: '40px' }}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="card-body mt-2">
                          <div className="row">
                            <div className='col-md-4 ml-auto mb-3'>
                              <div className="input-group mr-2">
                                <div className="form-outline">
                                  <input
                                    type="search"
                                    id="form1"
                                    className="form-control"
                                    placeholder="Recherche par type et statut"
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

                          <p> Mes justifications</p>
                          <table id="example2" className="table table-bordered">
                            <thead>
                              <tr>
                                <th>Id</th>
                                <th>Type de demande</th>
                                <th>Date du</th>
                                <th>Date à</th>
                                <th>Statut</th>
                                <th>Actions</th>
                              </tr>
                            </thead>
                            <tbody>
                              {filteredData.map((item, index) => (
                                <tr key={index}>
                                  <td>{indexOfFirstItem + index + 1}</td>
                                  <td>
                                    {item.type_demande} <br />
                                    {(item.RaisonA) ? item.RaisonA : ''}
                                  </td>
                                  <td>{moment(item.dateDebut).format('YYYY-MM-DD HH:mm:ss')}</td>
                                  <td>{moment(item.dateFin).format('YYYY-MM-DD HH:mm:ss')}</td>
                                  <td>{item.statut}</td>
                                  <td width="300px" className='text-center'>
                                    <a className='btn btn-outline-primary p-2' data-toggle="modal" data-target="#detailemployeca" onClick={() => setDemandeId(item.id)}>
                                      <img src={detail} alt="" width="27px" title='Détail de la demande' />
                                    </a>
                                    &nbsp;&nbsp;&nbsp;&nbsp;
                                    {item.statut === 'En attente' && (
                                      <a
                                        className="btn btn-outline-danger p-2"
                                        onClick={() => handleShow(item.id)}
                                      >
                                        <img src={annuler} alt="" width="27px" title="Annuler la demande" />
                                      </a>
                                    )}
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
            < AddJustification listeMesDA={listeMesDA}/>
            < DetailJustification demandeId={demandeId} />
            {/* Modal de suppression */}
            <Modal show={showDeleteModal} onHide={handleClose}>
              <Modal.Header closeButton>
                <Modal.Title>Confirmer la suppression</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <p>Êtes-vous sûr de vouloir supprimer cette demande ?</p>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                  Annuler
                </Button>
                <Button
                  variant="danger"
                  onClick={() => {
                    handleDeleteDemande(demandeIdToDelete);
                    handleClose();
                  }}
                >
                  Supprimer
                </Button>
              </Modal.Footer>
            </Modal>

          </div>
        </div>
      </div>
    </>
  );
};

export default MesAutorisations;