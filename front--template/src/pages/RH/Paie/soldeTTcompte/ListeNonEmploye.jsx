import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Modal, Button } from 'react-bootstrap';
import * as XLSX from 'xlsx';
import rh from '../../../../assets/imgs/employe.png';
import recherche from '../../../../assets/imgs/recherche.png';
import axios from 'axios';
import moment from 'moment';
import paiment from '../../../../assets/imgs/paiement.png'
import Bulteins_paieNonEmploye from './Bulteins_paieNonEmploye.jsx'
import utilisateur from '../../../../assets/imgs/utilisateur.png';


const ListeNonEmploye = () => {

  const url = "http://localhost:5000"
  const [data, setdata] = useState([])
  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedEmployeId, setSelectedEmployeId] = useState(null);
  


  const idPeriodepai = useParams();
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const searchValue = searchTerm.toLowerCase().trim();

  const filteredData = data.filter(item => {

    const nom = item.User?.nom?.toLowerCase().includes(searchValue);
    const prenom = item.User?.prenom?.toLowerCase().includes(searchValue);
    const email = item.User?.email?.toLowerCase().includes(searchValue);
    const telephone = item.User?.telephone?.includes(searchTerm);
    const poste = item.Poste?.poste?.toLowerCase().includes(searchValue);
  
    const declarationMatch =
      item.declaration !== undefined &&
      (
        (searchValue === 'oui' && item.declaration == 1) ||
        (searchValue === 'non' && item.declaration == 0)
      );
  
    return nom || prenom || email || telephone || poste || declarationMatch;
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

  //-------------------------- call-backend ------------------------------------//
  useEffect(() => {
    handleListeEmploye()
    //  handleListePostes();
  }, [])

  const handleListeEmploye = async () => {
    try {
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
      const employeactif=response.data.filter((item)=>item.User?.statuscompte==="désactiver")
      setdata(employeactif);
      // setFilteredData(response.data);
    } catch (error) {
      console.log("Erreur lors de la récupération des employes", error)
    }
  }


  const BultainPEClick = (id) => {
    setSelectedEmployeId(id);
  };

  return (
    <>
      <nav>
        <Link to="/dashboard" className="text-primary">Dashboard</Link>
        <span> / </span>
        <Link to="/Gpaiement" className="text-primary">Gestion Paie</Link>
        <span> / </span>
        <Link to="/periodes_paie" className="text-primary">Périodes de paie</Link>
        <span> / </span>
        <span> Liste des employés avec leur bulletin de paie  </span>
      </nav>
      <div className="card card-primary card-outline">
        <div className="card-header d-flex ">
          <img src={rh} alt="" width="90px" />
          <p className="card-title mt-5 ml-2 p-2 text-center" style={{ width: '350px', borderRadius: '50px', border: '1px solid rgb(215, 214, 216)' }}>
          Liste des employés ayant cessé leur activité
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
                        <div className="card-body mt-2">
                          <table id="example2" className="table table-bordered ">
                            <thead>
                              <tr>
                                <th>Id</th>
                                <th>Photo</th>
                                <th>Nom Prénom</th>
                                <th>Poste attribué</th>
                                <th>Date du recrutement</th>
                                <th>Salaire de base</th>
                                <th>Déclaration CNAS</th>
                                <th>Date Fin Contrat</th>
                                <th>Date de cessation de travail</th>
                                {/* <th>Jours Restant Congés</th> */}
                                <th>Action</th>
                              </tr>
                            </thead>
                            <tbody>
                              {filteredData.slice(indexOfFirstItem, indexOfLastItem).map((item, index) => (
                                <tr key={index}>
                                  <td>{indexOfFirstItem + index + 1}</td>
                                  <td>
                                    <img className="ronde" src={item.photo ? url + item.photo : utilisateur} alt="Photo de l'employé" width="30px" />
                                  </td>
                                  <td> {item.User?.nom} {item.User?.prenom}</td>
                                  <td>{item.Poste ? item.Poste.poste : 'Poste non défini'}</td>
                                  <td>{moment(item.daterecru).format('YYYY-MM-DD')}</td>
                                  <td>{item.SalairNeg} DZD</td>
                                  <td>{item.declaration==1?'Oui':'Non'}</td>
                                  <td>{item.DateFinContrat?moment(item.DateFinContrat).format('YYYY-MM-DD'):''}</td>
                                  <td>{item.User?.dateAD?moment(item.User.dateAD).format('YYYY-MM-DD'):''}</td>
                                  <td>
                                    <button className='btn btn-outline-warning' >
                                      <img src={paiment} alt="" width="22px" title='Bultein de paie' data-toggle="modal" data-target="#modal-bp" onClick={() => BultainPEClick(item.id)} />
                                    </button>&nbsp; &nbsp; &nbsp;
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
        
        {selectedEmployeId ? (
          <Bulteins_paieNonEmploye
            key={selectedEmployeId}  
            employeId={selectedEmployeId}
            idPeriodepai={idPeriodepai.id}
          />
        ) : null}

        {/* modal supprimer */}
        <div className="modal fade" id="modal-delete">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">

                <h4 className="modal-title">Confirmer l'archivage</h4>
                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <p> Êtes-vous sûr de vouloir archiver cet élément ? </p>
              </div>
              <div className="modal-footer justify-content-between">
                <button type="button" className="btn btn-default" data-dismiss="modal">Annuler</button>
                <button type="button" className="btn btn-danger">Archiver</button>
              </div>
            </div>
          </div>
        </div>


      </div>
    </>
  );
}

export default ListeNonEmploye;



