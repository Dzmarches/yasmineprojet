import React, { useEffect, useState } from 'react';
import exportt from '../../../assets/imgs/excel.png';
import print from '../../../assets/imgs/printer.png';
import importt from '../../../assets/imgs/import.png';
import edit from '../../../assets/imgs/edit.png';
import add from '../../../assets/imgs/add.png';
import deletee from '../../../assets/imgs/delete.png';
import detail from '../../../assets/imgs/details.png';
import conge from '../../../assets/imgs/leave.png';
import { Link } from 'react-router-dom';
import annuler from '../../../assets/imgs/annuler.png';
import axios from 'axios';
import moment from 'moment';
import Select from 'react-select';
import { Modal, Button } from 'react-bootstrap';
import recherche from '../../../assets/imgs/recherche.png';
import prime from '../../../assets/imgs/primee.png';
import AddPrime from './AddPrime.jsx';
import EditPrime from './EditPrime.jsx';
import accept from '../../../assets/imgs/accept.png'
import excel from '../../../assets/imgs/excel.png'
import archive from '../../../assets/imgs/archive.png';
import * as XLSX from 'xlsx';

const Primes = () => {
  const [data, setData] = useState([]);
  const [primeId, setprimeId] = useState(null);
  const [demandeIdToDelete, setDemandeIdToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  //afficher les colonnes
  const [columnVisibility, setColumnVisibility] = useState({
    id: true,
    code: true,
    type_prime: true,
    commentaire: true,
    montant: true,
    prime_cotisable: true,
    prime_imposable: true,
    EcoleP: true,
    actions: true,
  });

  useEffect(() => {
    ListePrimes();
  }, []);

  const ListePrimes = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Vous devez être connecté ");
        return;
      }
      const response = await axios.get(`http://localhost:5000/primes/liste/`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.status === 200 && Array.isArray(response.data)) {
        console.log('responsedate', response.data)
        setData(response.data);
      } else {
        console.error("Les données ne sont pas un tableau !");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleClose = () => setShowDeleteModal(false);
  const handleShow = (id) => {
    setDemandeIdToDelete(id);
    setShowDeleteModal(true);
  };
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredData = data.filter(item => {

    const matchesSearchTerm =
      (item.code && item.code.toLowerCase().includes(searchTerm.toLowerCase().trim())) ||
      (item.type_prime && item.type_prime.toLowerCase().includes(searchTerm.toLowerCase().trim())) ||
      (item.commentaire && item.commentaire.toLowerCase().includes(searchTerm.toLowerCase().trim())) ||
      (item.montant && item.montant.toString().includes(searchTerm.trim())) ||
      (item.prime_cotisable !== undefined &&
        String(item.prime_cotisable ? "ouic" : "nonc")
          .toLowerCase()
          .includes(searchTerm.toLowerCase().trim())) ||
      (item.prime_imposable !== undefined &&
        String(item.prime_imposable ? "oui" : "non")
          .toLowerCase()
          .includes(searchTerm.toLowerCase().trim()))

    return matchesSearchTerm;
  });

  // Composant pour basculer la visibilité des colonnes
  const ColumnVisibilityFilter = ({ columnVisibility, setColumnVisibility }) => {
    const columns = [
      { key: "id", label: "Id" },
      { key: "code", label: "code" },
      { key: "type_prime", label: "type prime" },
      { key: "commentaire", label: "commentaire" },
      { key: "prime_cotisable", label: "prime cotisable" },
      { key: "prime_imposable", label: "prime imposable" },
      { key: "actions", label: "actions" },
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
      <div className="mb-3">
        {/* <h6>Choisir les colonnes à afficher :</h6>
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
        /> */}

      </div>
    );
  };

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

  // Gérer l'impression
  const handlePrint = () => {
    const printWindow = window.open("", "", "width=800,height=600");
    printWindow.document.write(`
              <html>
                  <head>
                      <title>Liste des primes</title>
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
                      <h5>Rapport des Pointages</h5>
                      <table>
                          <thead>
                              <tr>
                                  <th>Id</th>
                                  <th>Code</th>
                                  <th>Type Prime</th>
                                  <th>Montant</th>
                                  <th>Prime Cotisable</th>
                                  <th>Prime Imposable</th>
                                  <th>Ecole Pincipale </th>
                                 
                              </tr>
                          </thead>
                          <tbody>
                              ${currentItems.map(item => `
                                  <tr>
                                      <td>${item.id}</td>
                                      <td>${item.code}</td>
                                      <td>${item.type_prime}</td>
                                      <td>${item.montant}</td>
                                     <td>${item.prime_cotisable ? `cotisable` : ""}</td>
                                     <td>${item.prime_imposable ? `imposable` : ""}</td>
                                     <td>${item.EcolePrincipal?.nomecole}</td>
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
      "Id": `${item.id}`,
      "Code": item.code,
      "Type Prime": item.type_prime,
      "Montant": item.montant,
      "Prime Cotisable": `${item.prime_cotisable ? `cotisable` : ""}`,
      "Prime Imposable": `${item.prime_imposable ? `imposable` : ""}`,
      "Ecole Principale": item.EcolePrincipal?.nomecole,
    })));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "primes");
    XLSX.writeFile(wb, "liste_primes.xlsx");
  };

  const ArchiverPrime = async (id) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Vous devez être connecté");
        return;
      }
      const response = await axios.patch(`http://localhost:5000/primes/archiver/${id}`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      await ListePrimes();
      console.log(response.data)
    } catch (error) {
      console.log("Erreur", error)
    }
  }

  return (
    <>
      <nav>
        <Link to="/dashboard" className="text-primary">Dashboard</Link>
        <span> / </span>
        <Link to="/Gpaiement" className="text-primary">Gestion Paie</Link>
        <span> / </span>
        <span>Gestion des primes</span>
      </nav>

      <div className="card card-primary card-outline">
        <div className="card-header d-flex">
          <img src={prime} alt="" width="90px" />
          <p className="card-title mt-5 ml-2 p-2 text-center" style={{ width: '350px', borderRadius: '50px', border: '1px solid rgb(215, 214, 216)' }}>
            Gestion des primes
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
                          <div className="row mt-3">
                            <div className="col-md-4">
                              <button className="btn btn-app p-2" data-toggle="modal" data-target="#addprime">
                                <img src={add} alt="" width="30px" /><br />
                                Ajouter
                              </button>
                              < button className="btn btn-app p-1" onClick={handlePrint} >
                                <img src={print} alt="" width="30px" /><br />Imprimer
                              </button>
                              <button className='btn btn-app p-1' onClick={handleExport}>
                                <img src={excel} alt="" width="25px" /><br />Exporter
                              </button>
                            </div>
                          </div>
                        </div>
                        <div className="card-body mt-2">
                          <div className="row">
                            <div className="col-md-4 ml-auto mb-3">
                              <div className="input-group mr-2">
                                <div className="form-outline">
                                  <input
                                    type="search"
                                    id="form1"
                                    className="form-control"
                                    placeholder="Recherche"
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
                          {/* Filtre de visibilité des colonnes */}
                          <ColumnVisibilityFilter columnVisibility={columnVisibility} setColumnVisibility={setColumnVisibility} />
                          <p>Liste des primes</p>
                          <table id="example2" className="table table-bordered">
                            <thead>
                              <tr>
                                {columnVisibility.id && <th>Id</th>}
                                {columnVisibility.code && <th>Code</th>}
                                {columnVisibility.type_prime && <th>Type Prime</th>}
                                {columnVisibility.montant && <th>Montant</th>}
                                {columnVisibility.prime_cotisable && <th>Prime Cotisable</th>}
                                {columnVisibility.prime_imposable && <th>Prime Imposable</th>}
                                <th>Calculer en fonction des jours de présence </th>
                                {columnVisibility.EcoleP && <th>Ecole Principale</th>}
                                {columnVisibility.actions && <th>Actions</th>}
                              </tr>
                            </thead>
                            <tbody>
                              {currentItems.map((item, index) => (
                                <tr key={index}>
                                  {columnVisibility.id && <td>{indexOfFirstItem + index + 1}</td>}
                                  {columnVisibility.code && <td>{item.code}</td>}
                                  {columnVisibility.type_prime && <td>{item.type_prime}</td>}
                                  {columnVisibility.montant && <td>{item.montant}</td>}
                                  <td>
                                    {columnVisibility.prime_cotisable && (
                                      item.prime_cotisable ? (
                                        <img src={accept} width="25px" alt="accept" />
                                      ) : ""
                                    )}
                                  </td>
                                  <td>
                                    {
                                      item.prime_imposable ? (
                                        <img src={accept} width="25px" alt="accept" />
                                      ) : ""
                                    }
                                  </td>
                                  <td width="300px">
                                    {
                                      item.deduire ? (
                                        <img src={accept} width="25px" alt="accept" />
                                      ) : ""
                                    }
                                  </td>
                                  {columnVisibility.EcoleP && (<td>{item.EcolePrincipal.nomecole}</td>)}

                                  {columnVisibility.actions && (
                                    <td width="300px" className="text-center">
                                      <a
                                        className="btn btn-outline-success p-2"
                                        data-toggle="modal"
                                        data-target="#modifierPrime"
                                        onClick={() => setprimeId(item.id)}
                                      >
                                        <img src={edit} alt="" width="27px" title="Modifier" />
                                      </a>
                                      &nbsp;&nbsp;&nbsp;&nbsp;
                                      <a
                                        className="btn btn-outline-warning p-2"
                                        onClick={() => handleShow(item.id)}
                                      >
                                        <img src={archive} alt="" width="27px" title="arhciver" />
                                      </a>
                                    </td>
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
            <AddPrime ListePrimes={ListePrimes} />
            <EditPrime primeId={primeId} ListePrimes={ListePrimes} />
            <Modal show={showDeleteModal} onHide={handleClose}>
              <Modal.Header closeButton>
                <Modal.Title>Confirmer l'archivage</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <p>Êtes-vous sûr de vouloir archiver cette prime ?</p>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                  Annuler
                </Button>
                <Button
                  variant="danger"
                  onClick={() => {
                    ArchiverPrime(demandeIdToDelete);
                    handleClose();
                  }}
                >
                  Archiver
                </Button>
              </Modal.Footer>
            </Modal>
          </div>
        </div>
      </div>
    </>
  );
};

export default Primes;