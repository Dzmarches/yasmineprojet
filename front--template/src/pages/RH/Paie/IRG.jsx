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
import accept from '../../../assets/imgs/accept.png'
import excel from '../../../assets/imgs/excel.png'
import archive from '../../../assets/imgs/archive.png';
import impos from '../../../assets/imgs/impos.png';
import * as XLSX from 'xlsx';
import { pays } from '../Employes/OptionSelect.jsx';


const IRG = () => {
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    pays: "DZ",
    annee_fiscale: "",
    tranche_min: "",
    tranche_max: "",
    taux_imposition: "",
  });
  const [data, setData] = useState([]);
  const [demandeIdToDelete, setDemandeIdToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [isEditMode, setIsEditMode] = useState(false); // Pour savoir si on est en mode édition
  const [editId, setEditId] = useState(null); // Pour stocker l'ID de l'élément en cours de modification

  const handleEdit = (item) => {
    setIsEditMode(true); // Passer en mode édition
    setEditId(item.id); // Stocker l'ID de l'élément à modifier
    setFormData({
      pays: item.pays,
      annee_fiscale: item.annee_fiscale,
      tranche_min: item.tranche_min,
      tranche_max: item.tranche_max,
      taux_imposition: item.taux_imposition,
    });
  };

  //afficher les colonnes
  const [columnVisibility, setColumnVisibility] = useState({
    id: true,
    pays: true,
    annee_fiscale: true,
    tranche_min: true,
    tranche_max: true,
    taux_imposition: true,
  });
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  const handleSelectChange = (selectedOption) => {
    setFormData({ ...formData, pays: selectedOption ? selectedOption.value : "" });
  };

  useEffect(() => {
    ListeIRG();
  }, []);

  const ListeIRG = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Vous devez être connecté ");
        return;
      }
      const response = await axios.get(`http://localhost:5000/IRG/liste/`, {
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
    const countryLabel = pays.find(option => option.value === item.pays)?.label || item.pays;

    const matchesSearchTerm =
      (item.id && item.id.toString().includes(searchTerm)) ||
      (item.tranche_max && item.tranche_max.toString().includes(searchTerm)) ||
      (item.pays && item.pays.toString().includes(searchTerm)) ||
      (item.tranche_min && item.tranche_min.toString().includes(searchTerm)) ||
      (countryLabel.toLowerCase().includes(searchTerm.toLowerCase().trim())) || // Recherche par nom du pays
      (item.pays && item.pays.toLowerCase().includes(searchTerm.trim())) ||
      (item.annee_fiscale && item.annee_fiscale.toString().includes(searchTerm)) ||
      (item.taux_imposition && item.taux_imposition.toString().includes(searchTerm))

    return matchesSearchTerm;
  });

  // Composant pour basculer la visibilité des colonnes
  const ColumnVisibilityFilter = ({ columnVisibility, setColumnVisibility }) => {
    const columns = [
      { key: "id", label: "Id" },
      { key: "pays", label: "Pays" },
      { key: "tranche_min", label: "Tranche Min" },
      { key: "tranche_max", label: "Tranche Max" },
      { key: "annee_fiscale", label: "Année Fiscale" },
      { key: "taux_imposition", label: "Taux Imposition" },
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
                      <title>Liste IRG</title>
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
                      <h5>liste IRG</h5>
                      <table>
                          <thead>
                              <tr>
                                <th>ID</th>
                                <th>Code</th>
                                <th>Pays</th>
                                <th>Tranche Minimale</th>
                                <th>Tranche Maximale</th>
                                <th>Taux Imposition</th>
                                <th>Année Fiscale</th>
                              </tr>
                          </thead>
                          <tbody>
                              ${currentItems.map(item => `
                                  <tr>
                                 <td>${item.id}</td>
                                  <td>${item.pays}</td>
                                  <td>${pays.find((option) => option.value === item.pays)?.label || item.pays}</td>
                                  <td>${item.tranche_min}</td>
                                  <td>${item.tranche_max}</td>
                                  <td>${item.taux_imposition}</td>
                                  <td>${item.annee_fiscale}</td>
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
      "Code": item.pays,
      "Pays": `${pays.find((option) => option.value === item.pays)?.label || item.pays}`,
      "Tranche Minimale": item.tranche_min,
      "Tranche Maximale": item.tranche_max,
      "Taux Imposition": item.taux_imposition,
      "Année Fiscale": item.annee_fiscale,
    })));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "IRG");
    XLSX.writeFile(wb, "listeIRG.xlsx");
  };

  const ArchiverIRG = async (id) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Vous devez être connecté");
        return;
      }
      const response = await axios.patch(`http://localhost:5000/IRG/archiver/${id}`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      await ListeIRG();
      console.log(response.data)
    } catch (error) {
      console.log("Erreur", error)
    }
  }

  const validateForm = () => {
    const newErrors = {};

    // Vérifier si l'année fiscale est présente et correcte (4 chiffres)
    if (!formData.annee_fiscale) {
      newErrors.annee_fiscale = "L'année fiscale est requise";
    } else if (!/^\d{4}$/.test(formData.annee_fiscale)) {
      newErrors.annee_fiscale = "L'année fiscale doit être un nombre à 4 chiffres";
    }

    // Fonction pour valider un nombre décimal avec 2 décimales max
    const isValidDecimal = (value) => /^\d+(\.\d{1,2})?$/.test(value);

    // Vérifier si le pays est renseigné
    if (!formData.pays) {
      newErrors.pays = "Le pays est requis";
    }

    // Vérifier la tranche minimale
    if (!formData.tranche_min) {
      newErrors.tranche_min = "La tranche minimale est requise";
    } else if (!isValidDecimal(formData.tranche_min) || parseFloat(formData.tranche_min) < 0) {
      newErrors.tranche_min = "Doit être un nombre valide, positif et avec max 2 décimales";
    }

    // Vérifier la tranche maximale (optionnelle, peut être NULL en base de données)

    if (!formData.tranche_max) {
      newErrors.tranche_max = "La tranche minimale est requise";
    } else if (!isValidDecimal(formData.tranche_max) || parseFloat(formData.tranche_max) <= 0) {
      newErrors.tranche_max = "Doit être un nombre valide, positif et avec max 2 décimales";
    }
    // Vérifier le taux d'imposition
    if (!formData.taux_imposition) {
      newErrors.taux_imposition = "Le taux d'imposition est requis";
    } else if (!isValidDecimal(formData.taux_imposition) || parseFloat(formData.taux_imposition) < 0||parseFloat(formData.taux_imposition) > 1) {
      newErrors.taux_imposition = "Doit être un nombre valide, supérieur à 0 et avec max 2 décimales inférieure a 1";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const AjouterIRG = async () => {
    if (!validateForm()) return;

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Vous devez être connecté");
        return;
      }

     
      let response;
      if (isEditMode) {
        // Mode édition : requête PUT/PATCH
        response = await axios.put(`http://localhost:5000/IRG/modifier/${editId}`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        alert('IRG modifié avec succès');
      } else {
        // Mode ajout : requête POST
        response = await axios.post('http://localhost:5000/IRG/ajouter', formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        alert('IRG ajouté avec succès');
      }

      // Réinitialiser le formulaire et passer en mode ajout
      setFormData({
        pays: "DZ",
        annee_fiscale: "",
        tranche_min: "",
        tranche_max: "",
        taux_imposition: "",
      });
      setIsEditMode(false);
      setEditId(null);

      // Rafraîchir la liste des IRG
      await ListeIRG();
    } catch (error) {
      console.error("❌ Erreur Axios :", error);
      if (error.response) {
        alert(`❌ Erreur ${error.response.status}: ${error.response.data.message || "Problème inconnu"}`);
      } else if (error.request) {
        alert("❌ Erreur : Le serveur ne répond pas !");
      } else {
        alert("❌ Une erreur est survenue !");
      }
    }
  };

  return (
    <>
      <nav className="mb-2">
        <Link to="/dashboardadministrateur">Dashboard</Link>
        <span> / </span>
        <span>Gestion des IRG</span>
      </nav>

      <div className="card card-primary card-outline">
        <div className="card-header d-flex">
          <img src={impos} className='mt-2' width="60px" height="80px"/>
          <p className="card-title mt-5 ml-2 p-2 text-center" style={{ width: '350px', borderRadius: '50px', border: '1px solid rgb(215, 214, 216)' }}>
            Gestion des IRG
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
                                {/* Sélection du pays */}
                                <div className="col-md-4">
                                  <label>Pays *</label>
                                  <Select
                                    value={pays.find((option) => option.value === formData.pays)}
                                    onChange={handleSelectChange}
                                    options={pays}
                                    name="pays"
                                  />
                                  {errors.pays && <span className="text-danger">{errors.pays}</span>}
                                </div>

                                {/* Tranche Min */}
                                <div className="col-md-4">
                                  <label>Tranche Min *</label>
                                  <input type="number" className="form-control" name="tranche_min" value={formData.tranche_min} onChange={handleChange} />
                                  <small className="text-muted">Valeur entre 0 et 99 999 999.99.</small>
                                  {errors.tranche_min && <span className="text-danger">{errors.tranche_min}</span>}
                                </div>

                                {/* Tranche Max */}
                                <div className="col-md-4">
                                  <label>Tranche Max *</label>
                                  <input type="number" className="form-control" name="tranche_max" value={formData.tranche_max} onChange={handleChange} />
                                  <small className="text-muted">Valeur entre trancheMin et 99 999 999.99.</small>
                                  {errors.tranche_max && <span className="text-danger">{errors.tranche_max}</span>}
                                </div>

                                {/* Taux d'imposition */}
                                <div className="col-md-4">
                                  <label>Taux d'imposition *</label>
                                  <input type="number" step="0.01" className="form-control" name="taux_imposition" value={formData.taux_imposition} onChange={handleChange} />
                                  <small className="text-muted"> Veuillez entrer la valeur en décimal (ex : 20% → 0.2)</small>
                                  {errors.taux_imposition && <span className="text-danger">{errors.taux_imposition}</span>}
                                </div>

                                {/* Année fiscale */}
                                <div className="col-md-4">
                                  <label>Année fiscale *</label>
                                  <input type="number" className="form-control" name="annee_fiscale" value={formData.annee_fiscale} onChange={handleChange} />
                                  <small className="text-muted">Exemple : 2025.</small>
                                  {errors.annee_fiscale && <span className="text-danger">{errors.annee_fiscale}</span>}
                                </div>

                                {/* Boutons */}
                                <div className="col-md-12 mt-3">
                                  <button type="button" className="btn btn-outline-primary" onClick={AjouterIRG}>
                                    {isEditMode ? "Modifier" : "Ajouter"}
                                  </button>
                                  {isEditMode && (
                                    <button type="button" className="btn btn-outline-secondary ml-2"
                                      onClick={() => {
                                        setIsEditMode(false);
                                        setEditId(null);
                                        setFormData({
                                          pays: "DZ",
                                          annee_fiscale: "",
                                          tranche_min: "",
                                          tranche_max: "",
                                          taux_imposition: "",
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
                              < button className="btn btn-app p-1" onClick={handlePrint} >
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
                                    onChange={handleSearchChange}
                                  />
                                </div>
                                <div style={{ background: "rgb(202, 200, 200)", padding: "3px", height: "37px", borderRadius: "2px" }}>
                                  <img src={recherche} alt="" height="30px" width="30px" />
                                </div>
                              </div>
                            </div>
                          
                          </div>
                       
            
                          <ColumnVisibilityFilter columnVisibility={columnVisibility} setColumnVisibility={setColumnVisibility} />
                          <p>Liste IRG</p>
                          <table id="example2" className="table table-bordered">
                            <thead>
                              <tr>
                                <th>ID</th>
                                <th>Code</th>
                                <th>Pays</th>
                                <th>Tranche Minimale</th>
                                <th>Tranche Maximale</th>
                                <th>Taux Imposition</th>
                                <th>Année Fiscale</th>
                                <th>Action</th>
                              </tr>
                            </thead>
                            <tbody>
                            {/* .slice().reverse() */}
                              {currentItems.map((item, index) => (
                                <tr key={index}>
                                  <td>{indexOfFirstItem + index + 1}</td>
                                  <td>{item.pays}</td>
                                  <td>{pays.find((option) => option.value === item.pays)?.label || item.pays}</td>
                                  <td>{item.tranche_min}</td>
                                  <td>{item.tranche_max}</td>
                                  <td>{item.taux_imposition}</td>
                                  <td>{item.annee_fiscale}</td>
                                  <td width="300px" className="text-center">
                                    <a
                                      className="btn btn-outline-success p-2"
                                      onClick={() => handleEdit(item)} 
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
                <Modal.Title>Confirmer l'archivage</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <p>Êtes-vous sûr de vouloir archiver  ?</p>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                  Annuler
                </Button>
                <Button
                  variant="danger"
                  onClick={() => {
                    ArchiverIRG(demandeIdToDelete);
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

export default IRG;