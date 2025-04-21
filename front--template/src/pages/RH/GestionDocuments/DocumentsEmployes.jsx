import React, { useState, useEffect } from 'react';
import add from '../../../assets/imgs/add.png';
import { Link } from 'react-router-dom';
import { Modal, Button } from 'react-bootstrap';
import rh from '../../../assets/imgs/employe.png';
import edit from '../../../assets/imgs/edit.png';
import recherche from '../../../assets/imgs/recherche.png';
import archive from '../../../assets/imgs/archive.png';
import deletee from '../../../assets/imgs/delete.png';
import axios from 'axios';


const DocumentsEmployes = () => {

  const [data, setdata] = useState([])
  const [showModal, setShowModal] = useState(false);
  const [fileName, setFileName] = useState('');
  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedEmployeId, setSelectedEmployeId] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [roles, setRoles] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredData = data.filter(item => {
    // Vous pouvez filtrer en fonction de n'importe quel champ. Exemple ici : 'nom' et 'prenom'
    return (item.nom && item.nom.toLowerCase().includes(searchTerm.toLowerCase().trim())) ||
      (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase().trim())) ||
      (item.module && item.module.toLowerCase().includes(searchTerm.toLowerCase().trim()))

  });

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

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  useEffect(() => {
    handleListeDE()
  }, [])

  const handleListeDE = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert("Vous devez être connecté");
        return;
      }
      const response = await axios.get('http://localhost:5000/attestation/liste', {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      console.log(response.data)
      setdata(response.data)
      // setFilteredData(response.data);
    } catch (error) {
      console.log("Erreur lors de la récupération des attestattions", error)
    }

  }
  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("❌ Aucun token trouvé. Veuillez vous connecter.");
        return;
      }
      try {
        console.log("🔍 Appel à getMe en cours...");
        const response = await axios.get("http://localhost:5000/getMe", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log("✅ Réponse roles :", response.data.roles);
        setRoles(response.data.roles);
      } catch (error) {
        console.error("❌ Erreur lors de la récupération des informations de l'utilisateur :", error);
      }
    };
    fetchUser();
  }, []);

  const [demandeIdToDelete, setDemandeIdToDelete] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const handleClose = () => setShowDeleteModal(false);
  const handleShow = (id) => {
    setDemandeIdToDelete(id);
    setShowDeleteModal(true);
  };
  const ArchiverHS = async (id) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Vous devez être connecté pour soumettre le formulaire.");
        return;
      }
      const response = await axios.patch(`http://localhost:5000/attestation/archiver/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (response.status === 200) {
        handleListeDE();
      }
    } catch (error) {
      console.error("Erreur lors da la suppression ", error);
      alert("Une erreur est survenue lors de la suppression ");
    }
  };

  return (
    <>
      <nav>
        <Link to="/dashboard" className="text-primary">Accueil</Link>
        <span> / </span>
        <span>Gestion des ressource humaines</span>
      </nav>
      <div className="card card-primary card-outline">
        <div className="card-header d-flex ">
          <img src={rh} alt="" width="90px" />
          <p className="card-title mt-5 ml-2 p-2 text-center" style={{ width: '350px', borderRadius: '50px', border: '1px solid rgb(215, 214, 216)' }}>
            Gestion des  documents
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
                            <div className="button-container" style={{ marginTop: '20px' }}>
                            </div>
                            <div className='col-md-4'>
                              <Link className="btn btn-app p-1" to="/employes/document/ajouter">
                                <img src={add} alt="" width="30px" /><br />
                                Ajouter
                              </Link>
                            </div>
                            <div className='col-md-4'>

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
                                  onChange={handleSearchChange} />
                                  {/* <input type="search" id="form1" width={100} className="form-control" placeholder="Recherche" style={{ height: "38px" }} /> */}
                                </div>
                                <div style={{ background: "rgb(202, 200, 200)", padding: "3px", height: "37px", borderRadius: "2px" }}>
                                  <img src={recherche} alt="" height="30px" width="30px" />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="card-body mt-2">
                          <table id="example2" className="table table-bordered ">
                            <thead>
                              <tr>
                                <th>Id</th>
                                <th>Nom du modèle</th>
                                <th>Module</th>
                                <th>Description</th>
                                <th>Ecole Principale</th>
                                <th>Ecole</th>
                                <th>Actions</th>
                              </tr>
                            </thead>
                            <tbody>
                              {filteredData.slice(indexOfFirstItem, indexOfLastItem).map((item, index) => (
                                // {currentItems.map((item, index) => (
                                <tr key={index}>
                                  <td>{indexOfFirstItem + index + 1}</td>
                                  <td>{item.nom}</td>
                                  <td>{item.module}</td>
                                  <td>{item.description}</td>
                                  <td>{item.EcolePrincipal?.nomecole}</td>
                                  <td>{item.Ecole?.nomecole}</td>
                                  {(

                                    roles.some(role => ["AdminPrincipal", "Employé"].includes(role)) && !item.Ecole ? (
                                      // roles.includes("AdminPrincipal") ? (
                                      <td>
                                        <Link
                                          className="btn btn-outline-success"
                                          to={`/employes/document/modifier/${item.id}`}
                                          style={{ height: "45px" }}
                                        >
                                          <img src={edit} alt="" width="24px" title="modifier" />
                                        </Link>
                                        &nbsp;&nbsp;&nbsp;&nbsp;
                                        <a className="btn btn-outline-danger p-2" onClick={() => handleShow(item.id)}>
                                          <img src={deletee} alt="" width="27px" title="Supprimer" />
                                        </a>
                                      </td>
                                    ) : roles.some(role => ["Admin", "Employé"].includes(role)) && item.Ecole?.nomecole ? (
                                      <td>
                                        <Link
                                          className="btn btn-outline-success"
                                          to={`/employes/document/modifier/${item.id}`}
                                          style={{ height: "45px" }}
                                        >
                                          <img src={edit} alt="" width="24px" title="modifier" />
                                        </Link>
                                        &nbsp;&nbsp;&nbsp;&nbsp;
                                        <a className="btn btn-outline-danger p-2" onClick={() => handleShow(item.id)}>
                                          <img src={deletee} alt="" width="27px" title="Supprimer" />
                                        </a>
                                      </td>
                                    ) : null
                                  )}
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
                    ArchiverHS(demandeIdToDelete);
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
}

export default DocumentsEmployes;