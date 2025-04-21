import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { Modal, Button } from 'react-bootstrap';
import * as XLSX from 'xlsx';
import Select from 'react-select';
import './PrintStyles.css';

// Assets
import parentIcon from '../../assets/imgs/family.png';
import edite from '../../assets/imgs/edit.png';
import delet from '../../assets/imgs/delete.png';
import excel from '../../assets/imgs/excel.png';
import importexel from '../../assets/imgs/import.png';
import printer from '../../assets/imgs/printer.png';
import add from '../../assets/imgs/add.png';
import userIcon from '../../assets/imgs/user.png';
import studentIcon from '../../assets/imgs/student-card.png';

// Colonnes par défaut
const defaultColumns = [
  { key: 'nom', label: 'Nom' },
  { key: 'prenom', label: 'Prénom' },
  { key: 'email', label: 'Email' },
  { key: 'telephone', label: 'Téléphone' },
  { key: 'username', label: 'Nom d\'utilisateur' },
];

const Parents = () => {
  const [parents, setParents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [fileName, setFileName] = useState('');
  const [selectedParent, setSelectedParent] = useState(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [profileInfo, setProfileInfo] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [additionalColumns, setAdditionalColumns] = useState([]);
  const navigate = useNavigate();

  // Options pour les colonnes supplémentaires
  const options = [
    { value: 'typerole', label: 'Type de rôle' },
    { value: 'eleves', label: 'Enfants' },
  ];

  // Combiner les colonnes
  const columns = [...defaultColumns, ...additionalColumns];

  // Pagination
  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = parents.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(parents.length / itemsPerPage);

  useEffect(() => {
    const fetchParents = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.error('Aucun token trouvé. Veuillez vous connecter.');
          return;
        }

        const response = await axios.get('http://localhost:5000/parents', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data && response.data.listeParents) {
          setParents(response.data.listeParents);
        } else {
          console.error('Aucun parent trouvé');
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des parents:', error);
      }
    };

    fetchParents();
  }, []);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  const handleDownloadTemplate = () => {
    const ws = XLSX.utils.aoa_to_sheet([["Nom", "Prénom", "Email", "Téléphone", "Type de rôle"]]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Parents");
    XLSX.writeFile(wb, "parents_template.xlsx");
  };

  const handleFileChange = (event) => {
    setFileName(event.target.files[0].name);
  };

  const handleImport = () => {
    alert('Importation en cours...');
  };

  const handleExport = () => {
    const ws = XLSX.utils.json_to_sheet(parents);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Parents");
    XLSX.writeFile(wb, "parents_export.xlsx");
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('Aucun token trouvé. Veuillez vous connecter.');
        return;
      }

      await axios.delete(`http://localhost:5000/parents/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setParents(prev => prev.filter(parent => parent.id !== id));
    } catch (error) {
      console.error("Erreur lors de la suppression du parent", error);
    }
  };

  const handleEdit = (id) => {
    navigate(`/parents/modifier/${id}`);
  };

  const handleShowProfileModal = async (id) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Aucun token trouvé. Veuillez vous connecter.');

      const response = await axios.get(`http://localhost:5000/parents/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setProfileInfo(response.data);
      setShowProfileModal(true);
    } catch (error) {
      console.error("Erreur lors de la récupération du parent:", error);
    }
  };

  const handleCloseProfileModal = () => {
    setShowProfileModal(false);
    setProfileInfo(null);
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

  // Générer les numéros de page pour la pagination
  const pageNumbers = [];
  for (let i = Math.max(1, currentPage - 2); i <= Math.min(currentPage + 2, totalPages); i++) {
    pageNumbers.push(i);
  }

  return (
    <>
      <nav>
        <Link to="/dashboard" className="text-primary">Accueil</Link>
        <span> / </span>
        <span>Gestion des parents</span>
      </nav>

      <div className="card card-primary card-outline">
        <div className="card-header d-flex" style={{ backgroundColor: '#F8F8F8' }}>
          <img src={parentIcon} alt="" width="90px" />
          <p className="card-title mt-5 ml-2 p-2 text-center" style={{ width: '350px', borderRadius: '50px', border: '1px solid rgb(215, 214, 216)' }}>
            Gestion des Parents
          </p>
        </div>

        <div className="card-body">
          <div className="tab-content">
            <div className="tab-pane fade show active">
              <section className="content mt-2">
                <div className="container-fluid">
                  <div className="row">
                    <div className="col-12">
                      <div className="card">
                        <div className="card-header" style={{ backgroundColor: 'rgb(238, 237, 237)' }}>
                          <div className="row">
                            <div className="col-md-8">
                              <div className="button-container">
                                <button className="btn btn-app p-1" onClick={() => window.print()}>
                                  <img src={printer} alt="" width="30px" /><br />
                                  Imprimer
                                </button>
                                <button className="btn btn-app p-1" onClick={handleShowModal}>
                                  <img src={importexel} alt="" width="30px" /><br />
                                  Importer
                                </button>
                                <button className="btn btn-app p-1" onClick={handleExport}>
                                  <img src={excel} alt="" width="25px" /><br />
                                  Exporter
                                </button>
                              </div>
                            </div>
                            <div className="col-md-4">
                              <div className="input-group">
                                <input
                                  type="search"
                                  className="form-control"
                                  placeholder="Recherche"
                                  style={{ height: '38px' }}
                                />
                                <button type="button" className="btn btn-primary">
                                  <i className="fas fa-search"></i>
                                </button>
                              </div>
                            </div>
                          </div>
                          <div className="row mt-3">
                            <div className="col-md-12">
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
                                <th>Action</th>
                              </tr>
                            </thead>
                            <tbody>
                              {currentItems.map((parent, index) => (
                                <tr key={parent.id}>
                                  <td>{indexOfFirstItem + index + 1}</td>
                                  {columns.map((column, colIndex) => {
                                    // Gestion spéciale pour les enfants
                                    if (column.key === 'eleves') {
                                      const enfants = parent.Parent?.Eleves || [];
                                      return (
                                        <td key={colIndex}>
                                          {enfants.length > 0
                                            ? enfants.map(e => `${e.User?.nom} ${e.User?.prenom}`).join(', ')
                                            : 'Aucun'}
                                        </td>
                                      );
                                    }
                                    // Gestion spéciale pour le type de rôle
                                    if (column.key === 'typerole') {
                                      return (
                                        <td key={colIndex}>
                                          {parent.Parent?.typerole || 'N/A'}
                                        </td>
                                      );
                                    }
                                    // Colonnes normales
                                    return (
                                      <td key={colIndex}>
                                        {parent[column.key] || 'N/A'}
                                      </td>
                                    );
                                  })}
                                  <td>
                                    <button
                                      className="btn btn-outline-success"
                                      onClick={() => navigate(`/parents/modifier/${parent.id}`)}
                                    >
                                      <img src={edite} alt="modifier" width="22px" title="Modifier" />
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
          </div>
        </div>
      </div>

      {/* Modal d'importation */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header className="text-center">
          <Modal.Title>Importer des parents</Modal.Title>
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
              Télécharger le modèle
            </button>
            <div className="custom-file mb-3">
              <input
                type="file"
                className="custom-file-input"
                id="customFile"
                onChange={handleFileChange}
              />
              <label className="custom-file-label" htmlFor="customFile">
                {fileName || "Choisir un fichier"}
              </label>
            </div>
            <button
              className="btn btn-primary mb-3"
              onClick={handleImport}
            >
              Importer
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
    </>
  );
};

export default Parents;