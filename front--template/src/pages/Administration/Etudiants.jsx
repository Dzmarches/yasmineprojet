import React, { useState, useEffect } from 'react';
import axios from 'axios';
import QRCode from 'react-qr-code';

import etudiant from '../../assets/imgs/etudiant.png';
import edite from '../../assets/imgs/edit.png';
import delet from '../../assets/imgs/delete.png';
import excel from '../../assets/imgs/excel.png';
import importexel from '../../assets/imgs/import.png';
import printer from '../../assets/imgs/printer.png';
import add from '../../assets/imgs/add.png';
import sante from '../../assets/imgs/healthcare.png';
import User from '../../assets/imgs/user.png';
import familyIcon from '../../assets/imgs/family.png';
import healthIcon from '../../assets/imgs/healthcare.png';
import security from '../../assets/imgs/folder.png';
import studentcard from '../../assets/imgs/student-card.png';
import classe from '../../assets/imgs/classe.png';
import { Link, useNavigate } from 'react-router-dom';
import { Modal, Button } from 'react-bootstrap';
import * as XLSX from 'xlsx';
import Select from 'react-select';
import ProfileEmploye from './profil';
import './PrintStyles.css';
// Définir les colonnes par défaut en dehors du composant
const defaultColumns = [
  { key: 'photo', label: 'photo' },
  { key: 'nom', label: 'Nom & Prénom' },
  { key: 'prenom', label: 'Nom & Prénom (Arabe)' },
  { key: 'numinscription', label: 'Numéro d\'inscription' },
  { key: 'niveau', label: 'Niveau' },
  { key: 'cycle', label: 'Cycle' },
  { key: 'numidentnational', label: 'Numéro d\'Identification National' },
];

const Etudiants = () => {


  const [ecoleInfo, setEcoleInfo] = useState(null);
  const [showCard, setShowCard] = useState(false);
  const [selectedEleve, setSelectedEleve] = useState(null);
  const [showHealthModal, setShowHealthModal] = useState(false);
  const [healthInfo, setHealthInfo] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [fileName, setFileName] = useState('');
  const [niveaux, setNiveaux] = useState([]);
  const [ecole, setEcoles] = useState([]);
  const [sections, setSections] = useState([]);
  const [infos, setInfos] = useState(null);
  const [eleves, setEleves] = useState([]);
  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [additionalColumns, setAdditionalColumns] = useState([]);
  const navigate = useNavigate();
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [profileInfo, setProfileInfo] = useState(null);
  const [showPrintOptions, setShowPrintOptions] = useState(false);
  const [showPrintOptionsME, setShowPrintOptionsME] = useState(false);
  const [selectedPrintOption, setSelectedPrintOption] = useState('');
  const [printOptions, setPrintOptions] = useState([]);
  const [selectedEcole, setSelectedEcole] = useState(null);
  const [filteredEleves, setFilteredEleves] = useState([]);
  const [filteredEcoles, setFilteredEcoles] = useState([]);
  // Combiner les colonnes par défaut et les colonnes supplémentaires
  const columns = [...defaultColumns, ...additionalColumns];

  const infosOptions = [
    { value: 'A', label: 'Elève sans Section' },
    { value: 'B', label: 'Elève sans Compte' },
  ];

  const options = [
    { value: 'sans_section', label: 'Élève sans section' },
    { value: 'sans_compte', label: 'Élève sans compte' },
  ];

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  const handleDownloadTemplate = () => {
    const ws = XLSX.utils.aoa_to_sheet([["Nom", "Prénom", "Email"]]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Etudiants");
    XLSX.writeFile(wb, "etudiants_template.xlsx");
  };

  const handleFileChange = (event) => {
    setFileName(event.target.files[0].name);
  };

  const handleImport = () => {
    alert('Importation en cours...');
  };

  // const indexOfLastItem = currentPage * itemsPerPage;
  // const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  // const currentItems = Array.isArray(eleves) ? eleves.slice(indexOfFirstItem, indexOfLastItem) : [];

  // const totalPages = Math.ceil(eleves.length / itemsPerPage);

  const displayedEleves = filteredEleves.length > 0 ? filteredEleves : eleves;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = Array.isArray(filteredEleves)
    ? filteredEleves.slice(indexOfFirstItem, indexOfLastItem)
    : [];
  const totalPages = Math.ceil(displayedEleves.length / itemsPerPage);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const pageNumbers = [];
  for (let i = Math.max(1, currentPage - 2); i <= Math.min(currentPage + 2, totalPages); i++) {
    pageNumbers.push(i);
  }

  useEffect(() => {
    const fetchSections = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.error('Aucun token trouvé. Veuillez vous connecter.');
          return;
        }

        const response = await axios.get('http://localhost:5000/sections', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setSections(response.data);
      } catch (error) {
        console.error('Erreur lors de la récupération des sections', error);
      }
    };

    const fetchNiveaux = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.error('Aucun token trouvé. Veuillez vous connecter.');
          return;
        }

        const response = await axios.get('http://localhost:5000/niveaux', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setNiveaux(response.data);
      } catch (error) {
        console.error('Erreur lors de la récupération des niveaux', error);
      }
    };

    const fetchEleves = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.error('Aucun token trouvé. Veuillez vous connecter.');
          return;
        }

        console.log("🟢 Envoi de la requête GET /eleves");
        const response = await axios.get('http://localhost:5000/eleves', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // if (response.data && response.data.listeEleves) {
        //   console.log("✅ Réponse reçue :", response.data);
        //   setEleves(response.data.listeEleves);
        //   setFilteredEleves(response.data.listeEleves); // Initialisez filteredEleves
        // } 
        if (response.data && response.data.listeEleves) {
          setEleves(response.data.listeEleves);
          setFilteredEleves(response.data.listeEleves); // Initialiser filteredEleves
        } else {
          console.error('Aucun élève trouvé');
        }
      } catch (error) {
        if (error.response) {
          console.error('Erreur serveur:', error.response.data);
        } else if (error.request) {
          console.error('Pas de réponse du serveur');
        } else {
          console.error('Erreur lors de la configuration de la requête:', error.message);
        }
      }
    };
    fetchSections();
    fetchNiveaux();
    fetchEleves();
  }, []);

  const handleInfosChange = (selectedOption) => {
    setInfos(selectedOption);
  };

  const handleChange = (selected) => {
    setSelectedOptions(selected);
    setAdditionalColumns(selected.map(option => ({ key: option.value, label: option.label })));
  };

  const formatOptionLabel = ({ label, value }, { context }) => {
    if (context === 'menu' && selectedOptions.some((opt) => opt.value === value)) {
      return <div style={{ color: 'blue' }}>{label}</div>;
    }
    return label;
  };

  const handleExport = () => {
    const ws = XLSX.utils.json_to_sheet(eleves);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Etudiants");
    XLSX.writeFile(wb, "etudiants_export.xlsx");
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('Aucun token trouvé. Veuillez vous connecter.');
        return;
      }

      await axios.delete(`http://localhost:5000/eleves/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Mettre à jour la liste des élèves après suppression
      setEleves(prev => prev.filter(eleve => eleve.id !== id));
    } catch (error) {
      console.error("Erreur lors de la suppression de l'élève", error);
    }
  };

  const handleEdit = async (id) => {
    console.log("🟢 ID de l'élève cliqué :", id);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('Aucun token trouvé. Veuillez vous connecter.');
        return;
      }

      const response = await axios.get(`http://localhost:5000/eleves/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("📌 Réponse complète de l'API :", response.data);

      const eleve = response.data.eleve;

      if (eleve && eleve.id) {
        console.log("✅ ID extrait :", eleve.id);
        navigate(`/etudiants/modifiereleve/${eleve.id}`);
      } else {
        console.error("❌ ID de l'élève manquant !");
      }
    } catch (error) {
      console.error("❌ Erreur lors de la récupération de l'élève :", error);
    }
  };

  const handleShowHealthModal = async (id) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Aucun token trouvé. Veuillez vous connecter.');

      const response = await axios.get(`http://localhost:5000/eleves/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("Données de l'élève reçues :", response.data); // Vérifiez ici
      setHealthInfo(response.data.eleve); // Assurez-vous que c'est bien `response.data.eleve`
      setShowHealthModal(true);
    } catch (error) {
      console.error("Erreur lors de la récupération des informations de santé", error);
    }
  };

  const handleCloseHealthModal = () => {
    setShowHealthModal(false);
    setHealthInfo(null);
  };
  const handleShowProfileModal = async (id) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Aucun token trouvé. Veuillez vous connecter.');

      // Récupérer les informations de base de l'élève
      const eleveResponse = await axios.get(`http://localhost:5000/eleves/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Récupérer les informations de mot de passe
      const passwordsResponse = await axios.get(`http://localhost:5000/eleves/${id}/passwords`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Fusionner les données
      const profileData = {
        ...eleveResponse.data.eleve,
        passwords: passwordsResponse.data
      };

      console.log("Données complètes reçues :", {
        ...profileData,
        // Affichage des mots de passe dans la console (pour débogage seulement)
        User: {
          ...profileData.User,
          password: `[HASH:${profileData.User?.password?.substring(0, 8)}...]`
        },
        Parents: profileData.Parents?.map(parent => ({
          ...parent,
          User: {
            ...parent.User,
            password: `[HASH:${parent.User?.password?.substring(0, 8)}...]`
          }
        }))
      });

      setProfileInfo(profileData);
      setShowProfileModal(true);
    } catch (error) {
      console.error("Erreur lors de la récupération des informations de l'élève :", error);
    }
  };

  const handleCloseProfileModal = () => {
    setShowProfileModal(false);
    setProfileInfo(null);
  };


  const handleCloseCard = () => {
    setShowCard(false);
    setSelectedEleve(null);
  };


  const fetchEcoleInfo = async (ecoleId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('Aucun token trouvé. Veuillez vous connecter.');
        return;
      }

      const response = await axios.get(`http://localhost:5000/ecole/${ecoleId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setEcoleInfo(response.data);
      console.log('infos ecole', response.data)
    } catch (error) {
      console.error('Erreur lors de la récupération des informations de l\'école', error);
    }
  };

  // Modifiez handleShowCard pour inclure la récupération des infos de l'école
  const handleShowCard = async (eleve) => {
    setSelectedEleve(eleve);
    setShowCard(true);

    setEcoleInfo(null);  // Réinitialisation pour éviter d'anciennes données

    if (eleve.ecoleId) {
      await fetchEcoleInfo(eleve.ecoleId); // Assure la récupération AVANT d'afficher
    }
  };


  useEffect(() => {
    const fetchEcoles = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.error('Aucun token trouvé. Veuillez vous connecter.');
          return;
        }

        const response = await axios.get('http://localhost:5000/ecoles', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Vérifier que les données contiennent bien les champs nécessaires
        const ecolesWithDefaults = response.data.map(ecole => ({
          ...ecole,
          nomecole: ecole.nomecole || '', // Valeur par défaut si undefined
          nom_arecole: ecole.nom_arecole || '', // Valeur par défaut si undefined
        }));

        setEcoles(ecolesWithDefaults);
        setFilteredEcoles(ecolesWithDefaults);
      } catch (error) {
        console.error('Erreur lors de la récupération des écoles', error);
      }
    };
    fetchEcoles();
  }, []);
  const filterElevesByEcole = async (ecoleId) => {
    if (!ecoleId) {
      setFilteredEleves(eleves); // Réinitialiser à la liste complète
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `http://localhost:5000/eleves/ecole/${ecoleId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log("liste eleves avec ecole", response.data.listeEleves);
      setFilteredEleves(response.data.listeEleves || []);
    } catch (error) {
      console.error("Erreur lors du filtrage par école", error);
      setFilteredEleves([]);
    }
  };

  return (
    <>

      <style>
        {`
        .td-photo {
          padding: 0;
          transition: transform 0.5s ease;
        }

        .td-photo .photo-circle {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          overflow: hidden;
          margin: auto;
          transition: transform 0.5s ease;
        }

        .td-photo .photo-circle img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s ease;
        }

        .td-photo:hover .photo-circle {
          transform: scale(2.5);
          z-index: 20;
          position: relative;
        }
      `}
      </style>
      <nav>
        <Link to="/dashboard" className="text-primary">Accueil</Link>
        <span> / </span>
        <span>Gestion des étudiants</span>
      </nav>
      <div className="card card-primary card-outline">
        <div className="card-header d-flex " style={{ backgroundColor: '#F8F8F8' }}>
          <img src={etudiant} alt="" width="90px" />
          <p className="card-title mt-5 ml-2 p-2 text-center" style={{ width: '350px', borderRadius: '50px', border: '1px solid rgb(215, 214, 216)' }}>
            Gestion des Elèves
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
                        <div className="card-header" style={{ backgroundColor: 'rgb(238, 237, 237)' }} >
                          <div className="row" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                            <div className="col-md-3" style={{ flex: '1', marginRight: '10px' }}>
                              <select
                                name="niveau"
                                className="form-control"
                                required
                                style={{ height: '50px', borderRadius: '8px', backgroundColor: '#F8F8F8' }}
                              >
                                <option value="">Sélectionnez un niveau</option>
                                {niveaux.length > 0 ? (
                                  niveaux.map((niveau) => (
                                    <option key={niveau.id} value={niveau.id}>{niveau.nomniveau}</option>
                                  ))
                                ) : (
                                  <option value="" disabled>Aucun niveau disponible</option>
                                )}
                              </select>
                            </div>
                            <div className="col-md-3" style={{ flex: '1', marginRight: '10px' }}>
                              <select
                                name="sections"
                                className="form-control"
                                required
                                style={{ height: '50px', borderRadius: '8px', backgroundColor: '#F8F8F8' }}
                              >
                                <option value="">Sélectionnez une section</option>
                                {sections.length > 0 ? (
                                  sections.map((section) => (
                                    <option key={section.id} value={section.id}>{section.classe}</option>
                                  ))
                                ) : (
                                  <option value="" disabled>Aucune section disponible</option>
                                )}
                              </select>
                            </div>
                            <div className="col-md-3" style={{ flex: '1', marginRight: '10px' }}>
                              <Select
                                id="infos"
                                value={infos}
                                onChange={handleInfosChange}
                                options={infosOptions}
                                placeholder="Élève sans infos"
                              />
                            </div>
                            <div className="col-md-3" style={{ flex: '1', marginRight: '10px' }}>
                              <select
                                name="ecole"
                                className="form-control"
                                required
                                style={{ height: '50px', borderRadius: '8px', backgroundColor: '#F8F8F8' }}
                                onChange={(e) => {
                                  const ecoleId = e.target.value;
                                  setSelectedEcole(ecoleId);
                                  filterElevesByEcole(ecoleId);
                                }}
                                value={selectedEcole || ''}
                              >
                                <option value="">Sélectionnez une école</option>
                                {ecole.length > 0 ? (
                                  ecole.map((item) => (
                                    <option key={item.id} value={item.id}>
                                      {item.nomecole}
                                    </option>
                                  ))
                                ) : (
                                  <option value="" disabled>Aucune école disponible</option>
                                )}
                              </select>
                            </div>
                          </div>
                          <div className='row'>
                            <div className="button-container" style={{ marginTop: '20px' }}>
                            </div>
                            <div className='col-md-4'>
                              <Link className="btn btn-app p-1" to="/etudiants/formulaire">
                                <img src={add} alt="" width="30px" /><br />
                                Ajouter
                              </Link>
                              <a className='btn btn-app p-1' href="">
                                <img src={printer} alt="" width="30px" /><br />Imprimer
                              </a>
                              <a className='btn btn-app p-1' href="#" onClick={handleShowModal}>
                                <img src={importexel} alt="" width="30px" /><br />Importer
                              </a>
                              <Modal show={showModal} onHide={handleCloseModal}>
                                <Modal.Header className="text-center">
                                  <Modal.Title>Importer des étudiants</Modal.Title>
                                  <button
                                    type="button"
                                    className="btn-close"
                                    aria-label="Close"
                                    onClick={handleCloseModal}
                                    style={{ background: "none", border: "none" }}
                                  ></button>
                                </Modal.Header>
                                <Modal.Body>
                                  <div className="text-center">
                                    <button
                                      className="btn btn-success mb-3"
                                      onClick={handleDownloadTemplate}
                                    >
                                      Créer et télécharger le formulaire d'importation
                                    </button>
                                    <div className="custom-file mb-3">
                                      <input
                                        type="file"
                                        className="custom-file-input"
                                        id="customFile"
                                        onChange={handleFileChange}
                                      />
                                      <label className="custom-file-label" htmlFor="customFile">
                                        {fileName || "aucun fichier choisi"}
                                      </label>
                                    </div>
                                    <button
                                      className="btn btn-primary mb-3"
                                      onClick={handleImport}
                                    >
                                      Début de l'importation
                                    </button>
                                  </div>
                                  <div className="modal-footer">
                                    <button
                                      className="btn btn-secondary"
                                      onClick={handleCloseModal}
                                    >
                                      Annuler
                                    </button>
                                  </div>
                                </Modal.Body>
                              </Modal>
                              <a className='btn btn-app p-1' href="#" onClick={handleExport}>
                                <img src={excel} alt="" width="25px" /><br />Exporter
                              </a>
                              <Link to="/affecterclasse" className='btn btn-app p-1'>
                                <img src={classe} alt="" width="25px" /><br />
                                affecter classe
                              </Link>
                            </div>
                            <div className='col-md-4'>
                              <div className="input-group mr-2">
                                <div className="form-outline" data-mdb-input-init>
                                  <input type="search" id="form1" width={100} style={{ height: '38px' }} className="form-control" placeholder="Recherche" />
                                </div>
                                <button type="button" className="btn btn-primary" data-mdb-ripple-init>
                                  <i className="fas fa-search"></i>
                                </button>
                              </div>
                            </div>
                            <div className="col-md-4" style={{ flex: '1', marginRight: '10px' }}>
                              <Select
                                isMulti
                                options={options}
                                value={selectedOptions}
                                onChange={handleChange}
                                placeholder="Colonnes"
                                formatOptionLabel={formatOptionLabel}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="table-responsive">
                          <table className="table table-bordered table-hover">
                            <thead>
                              <tr>
                                <th>#</th>
                                {columns.map((column, index) => (
                                  <th key={index}>{column.label}</th>
                                ))}
                                <th>Ecole</th>
                                <th style={{ width: '250px' }}>Action</th>
                              </tr>
                            </thead>
                            <tbody>
                              {currentItems.map((eleve, index) => (
                                <tr key={eleve.id}>
                                  <td>{indexOfFirstItem + index + 1}</td>
                                  {columns.map((column, colIndex) => (
                                    <td key={colIndex} className={column.key === 'photo' ? 'td-photo' : ''}>
                                      {column.key === 'photo' ? (
                                        <div className="photo-circle">
                                          <img
                                            src={
                                              eleve[column.key]
                                                ? `http://localhost:5000${eleve[column.key]}`
                                                : eleve.Eleve?.[column.key]
                                                  ? `http://localhost:5000${eleve.Eleve[column.key]}`
                                                  : 'http://localhost:5000/images/Eleve/default.png'
                                            }
                                            alt="photo élève"
                                          />
                                        </div>
                                      ) : (
                                        eleve[column.key] ||
                                        (eleve.Eleve && eleve.Eleve[column.key]) ||
                                        'N/A'
                                      )}
                                    </td>

                                  ))}

                                  <td>
                                    {eleve.ecoleName}
                                    {eleve.ecoleInfo?.logo && (
                                      <img
                                        src={`http://localhost:5000${eleve.ecoleInfo.logo}`}
                                        alt="logo école"
                                        width="20"
                                        style={{ marginLeft: '10px' }}
                                      />
                                    )}
                                  </td>

                                  <td style={{ width: '250px' }}>
                                    <button
                                      className="btn btn-outline-success btn-sm p-1 me-1 ml-1"
                                      style={{ minWidth: '28px', minHeight: '28px' }}
                                      onClick={() => handleEdit(eleve.id)}
                                    >
                                      <img src={edite} alt="modifier" width="10px" title="Modifier" />
                                    </button>

                                    <button
                                      className="btn btn-outline-danger btn-sm p-1 me-1 ml-1"
                                      style={{ minWidth: '28px', minHeight: '28px' }}
                                      onClick={() => handleDelete(eleve.id)}
                                    >
                                      <img src={delet} alt="Supprimer" width="10px" />
                                    </button>

                                    <button
                                      className="btn btn-outline-info btn-sm p-1 me-1 ml-1"
                                      style={{ minWidth: '28px', minHeight: '28px' }}
                                      onClick={() => handleShowHealthModal(eleve.id)}
                                    >
                                      <img src={sante} width="10px" />
                                    </button>

                                    <button
                                      className="btn btn-outline-secondary btn-sm p-1 ml-1"
                                      style={{ minWidth: '28px', minHeight: '28px' }}
                                      onClick={() => handleShowCard(eleve)}
                                    >
                                      <img src={studentcard} alt="Carte étudiant" width="10px" />
                                    </button>
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
        <ProfileEmploye />
      </div>
      <Modal show={showHealthModal} onHide={handleCloseHealthModal}>
        <Modal.Header closeButton>
          <Button variant="transparent" onClick={() => window.print()}>
            <img src={printer} alt="" width={30} />
          </Button>
          <Modal.Title>Informations de santé</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {healthInfo ? (
            <div>
              {/* Informations de l'élève */}
              <div className='card mb-3'>
                <div className='card-header d-flex align-items-center'>
                  <img src={etudiant} alt="" width={30} />
                  <h5>Informations de l'élève</h5>
                </div>
                <div className='card-body'>
                  {healthInfo.User ? (
                    <div className='d-flex justify-content-between'>
                      <p><strong>Nom :</strong> {healthInfo.User.nom}</p>
                      <p><strong>Prénom :</strong> {healthInfo.User.prenom}</p>
                    </div>
                  ) : (
                    <p>Aucune information sur l'élève disponible.</p>
                  )}
                </div>
              </div>

              {/* Informations des parents */}
              <div className='card mb-3'>
                <div className='card-header'>
                  <img src={familyIcon} alt="" width={30} />
                  <h5>Informations des parents</h5>
                </div>
                <div className='card-body'>
                  {healthInfo.Parents && healthInfo.Parents.length > 0 ? (
                    <div className='row'>
                      {/* Père à gauche */}
                      <div className='col-md-6'>
                        <h6>Informations du mère</h6>
                        {healthInfo.Parents[0]?.User ? (
                          <>
                            <p><strong>Nom :</strong> {healthInfo.Parents[0].User.nom}</p>
                            <p><strong>Prénom :</strong> {healthInfo.Parents[0].User.prenom}</p>
                            <p><strong>Email :</strong> {healthInfo.Parents[0].User.email}</p>
                            <p><strong>Téléphone :</strong> {healthInfo.Parents[0].User.telephone}</p>
                            <p><strong>Type :</strong> {healthInfo.Parents[0].typerole}</p>
                          </>
                        ) : (
                          <p>Aucune information sur le père disponible.</p>
                        )}
                      </div>

                      {/* Mère à droite */}
                      <div className='col-md-6'>
                        <h6>Informations de la père</h6>
                        {healthInfo.Parents[1]?.User ? (
                          <>
                            <p><strong>Nom :</strong> {healthInfo.Parents[1].User.nom}</p>
                            <p><strong>Prénom :</strong> {healthInfo.Parents[1].User.prenom}</p>
                            <p><strong>Email :</strong> {healthInfo.Parents[1].User.email}</p>
                            <p><strong>Téléphone :</strong> {healthInfo.Parents[1].User.telephone}</p>
                            <p><strong>Type :</strong> {healthInfo.Parents[1].typerole}</p>
                          </>
                        ) : (
                          <p>Aucune information sur la mère disponible.</p>
                        )}
                      </div>
                    </div>
                  ) : (
                    <p>Aucune information sur les parents disponible.</p>
                  )}
                </div>
              </div>

              {/* Informations de santé */}
              <div className='card mb-3'>
                <div className='card-header'>
                  <img src={healthIcon} alt="" width={30} />
                  <h5>Informations de santé</h5>
                </div>
                <div className='card-body'>
                  <p><strong>Antécédents médicaux :</strong> {healthInfo.antecedents}</p>
                  <p><strong>Détails des antécédents :</strong> {healthInfo.antecedentsDetails}</p>
                  <p><strong>Suivi médical :</strong> {healthInfo.suiviMedical}</p>
                  <p><strong>Détails du suivi médical :</strong> {healthInfo.suiviMedicalDetails}</p>
                  <p><strong>Traitement en cours :</strong> {healthInfo.natureTraitement}</p>
                  <p><strong>Détails du traitement :</strong> {healthInfo.natureTraitementDetails}</p>
                  <p><strong>Crises :</strong> {healthInfo.crises}</p>
                  <p><strong>Détails des crises :</strong> {healthInfo.crisesDetails}</p>
                  <p><strong>Conduite à tenir :</strong> {healthInfo.conduiteTenir}</p>
                  <p><strong>Détails de la conduite à tenir :</strong> {healthInfo.conduiteTenirDetails}</p>
                  <p><strong>Opération chirurgicale :</strong> {healthInfo.operationChirurgical}</p>
                  <p><strong>Détails de l'opération :</strong> {healthInfo.operationChirurgicalDetails}</p>
                  <p><strong>Maladie chronique :</strong> {healthInfo.maladieChronique}</p>
                  <p><strong>Détails de la maladie chronique :</strong> {healthInfo.maladieChroniqueDetails}</p>
                </div>
              </div>
            </div>
          ) : (
            <p>Chargement des informations de santé...</p>
          )}
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseHealthModal}>
            Fermer
          </Button>
          <Button variant="primary" onClick={() => window.print()}>
            <img src={printer} alt="" width={50} />
          </Button>
        </Modal.Footer>
      </Modal>

      {showCard && selectedEleve && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header d-flex justify-content-between align-items-center">
                {/* Logo à droite */}
                {ecoleInfo?.logo && (
                  <img
                    src={`http://localhost:5000${ecoleInfo.logo}`}
                    alt={`Logo de ${ecoleInfo.nomecole}`}
                    style={{
                      maxWidth: '50px',
                      maxHeight: '50px',
                      order: 2
                    }}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.style.display = 'none';
                    }}
                  />
                )}

                {/* Nom de l'école au centre */}
                <h1 className="text-center mx-auto" style={{ order: 1 }}>
                  {ecoleInfo?.nomecole || "N/A"}
                </h1>

                {/* Bouton fermer */}
                <button
                  type="button"
                  className="close"
                  onClick={handleCloseCard}
                  style={{ order: 3 }}
                >
                  &times;
                </button>
              </div>

              <div className="modal-body d-flex">
                {/* Informations élève à gauche */}
                <div className="card p-3 flex-grow-1">
                  <h4>{selectedEleve.nom || "Nom inconnu"}</h4>
                  <p>Date de naissance: {selectedEleve.dateNaissance || "N/A"}</p>
                  <p>Section: {selectedEleve.section || "N/A"}</p>
                  <p>Année scolaire: {selectedEleve.anneeScolaire || "2024 - 2025"}</p>
                  <p>Nom d'utilisateur: {selectedEleve.username || "N/A"}</p>
                </div>

                <div className="ml-3 d-flex flex-column justify-content-center">
                  <QRCode
                    value={JSON.stringify({
                      nom: selectedEleve.nom,
                      classe: selectedEleve.classe,
                      section: selectedEleve.section
                    })}
                    size={80}
                    level="L"
                  />
                </div>

                {/* QR Code à droite */}
                {/* <div className="ml-3 d-flex flex-column justify-content-center">
                  <QRCode
                    value={`https://votresite.com/eleve/${selectedEleve.id}`}
                    size={128}
                  />
                </div> */}
              </div>
            </div>
          </div>
        </div>
      )}


    </>
  );
}

export default Etudiants;



{/* <Modal show={showProfileModal} onHide={handleCloseProfileModal} size="lg">
        <Modal.Header closeButton>
          <Button variant="transparent" onClick={() => window.print()}>
            <img src={printer} alt="" width={30} />
          </Button>
          <Modal.Title>Profil de l'élève</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {profileInfo ? (
            <div>
              <div className="card mb-4">
                <div className="card-header d-flex align-items-center">
                  <img src={etudiant} alt="" width={30} />
                  <h5 className="mb-0 ml-2">Informations de l'élève</h5>
                </div>
                <div className="card-body">
                  <div className="row d-flex align-items-center">
                    <div className="col-md-8">
                      <div className="row">
                        <div className="col-md-6">
                          <p><strong>Nom :</strong> {profileInfo.User?.nom}</p>
                          <p><strong>Prénom :</strong> {profileInfo.User?.prenom}</p>
                        </div>
                        <div className="col-md-6">
                          <p><strong>Nom d'utilisateur :</strong> {profileInfo.User?.username}</p>
                          <p><strong>Mot de passe :</strong> {profileInfo.User?.password}</p>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-4 text-center">
                      {profileInfo.User?.photo ? (
                        <img
                          src={profileInfo.User.photo}
                          alt="Photo de l'élève"
                          className="img-fluid rounded"
                          style={{ maxHeight: '150px' }}
                        />
                      ) : (
                        <div className="bg-light p-4 rounded">
                          <p>Pas de photo</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="card">
                <div className="card-header d-flex align-items-center">
                  <img src={familyIcon} alt="" width={30} />
                  <h5 className="mb-0 ml-2">Information parent</h5>
                </div>
                <div className="card-body">
                  <div className="row">
                    {profileInfo.Parents && profileInfo.Parents[0] && (
                      <div className="col-md-12 mb-4 parent-card">
                        <div className="card">
                          <div className="card-header">
                            <h6>Informations du père</h6>
                          </div>
                          <div className="card-body">
                            <div className="row d-flex align-items-center">
                              <div className="col-md-8">
                                <div className="row">
                                  <div className="col-md-6">
                                    <p><strong>Nom :</strong> {profileInfo.Parents[0].User?.nom || 'Non spécifié'}</p>
                                    <p><strong>Prénom :</strong> {profileInfo.Parents[0].User?.prenom || 'Non spécifié'}</p>
                                  </div>
                                  <div className="col-md-6">
                                    <p><strong>Nom d'utilisateur :</strong> {profileInfo.Parents[0].User?.username || 'Non spécifié'}</p>
                                    <p><strong>Mot de passe :</strong> {profileInfo.Parents[0].User?.password}</p>
                                  </div>
                                </div>
                              </div>
                              <div className="col-md-4">
                                <div className="signature-area">
                                  <p className="text-center mb-2"><strong>Signature</strong></p>
                                  <div style={{
                                    height: '80px',
                                    border: '1px solid #000',
                                    marginBottom: '10px'
                                  }}></div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {profileInfo.Parents && profileInfo.Parents[1] && (
                      <div className="col-md-12 mb-4 parent-card">
                        <div className="card">
                          <div className="card-header">
                            <h6>Informations de la mère</h6>
                          </div>
                          <div className="card-body">
                            <div className="row d-flex align-items-center">
                              <div className="col-md-8">
                                <div className="row">
                                  <div className="col-md-6">
                                    <p><strong>Nom :</strong> {profileInfo.Parents[1].User?.nom || 'Non spécifié'}</p>
                                    <p><strong>Prénom :</strong> {profileInfo.Parents[1].User?.prenom || 'Non spécifié'}</p>
                                  </div>
                                  <div className="col-md-6">
                                    <p><strong>Nom d'utilisateur :</strong> {profileInfo.Parents[1].User?.username || 'Non spécifié'}</p>
                                    <p><strong>Mot de passe :</strong> {profileInfo.Parents[1].User?.password}</p>
                                  </div>
                                </div>
                              </div>
                              <div className="col-md-4">
                                <div className="signature-area">
                                  <p className="text-center mb-2"><strong>Signature</strong></p>
                                  <div style={{
                                    height: '80px',
                                    border: '1px solid #000',
                                    marginBottom: '10px'
                                  }}></div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="card mt-4">
                <div className="card-header d-flex align-items-center">
                  <img src={security} alt="" width={30} />
                  <h5>  Déclaration de confidentialité</h5>
                </div>
                <div className="card-body">
                  <div className="alert alert-warning mt-3">
                    <strong>⚠️ Avis de confidentialité :</strong> Les informations affichées dans ce document, y compris les identifiants et les mots de passe, sont strictement confidentielles.
                    En tant que parent, il est de votre responsabilité de protéger ces données sensibles et de veiller à ce qu'elles ne soient pas partagées ou utilisées de manière inappropriée.
                    Assurez-vous de la sécurité de ces informations pour la protection de votre enfant.
                  </div>
                  <div className="mt-4 row">
                    <div className="col-md-6">
                      <p className="text-center"><strong>Signature de l'administrateur</strong></p>
                      <div className="signature-box" style={{ height: '60px', borderBottom: '1px solid #000' }}></div>
                    </div>
                  </div>
                  <div className="mt-4 text-right">
                    <p>Fait à ______________, le {new Date().toLocaleDateString('fr-FR')}</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <p>Chargement des informations de l'élève...</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseProfileModal}>
            Fermer
          </Button>
          <Button variant="primary" onClick={() => window.print()}>
            <img src={printer} alt="" width={30} />
          </Button>
        </Modal.Footer>
      </Modal> */}