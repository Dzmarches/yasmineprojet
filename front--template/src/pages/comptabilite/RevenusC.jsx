import React, { useEffect, useState } from 'react';
import print from '../../assets/imgs/printer.png';
import edit from '../../assets/imgs/edit.png';
import { Link } from 'react-router-dom';
import axios from 'axios';
import moment from 'moment';
import Select from 'react-select';
import { Modal, Button } from 'react-bootstrap';
import recherche from '../../assets/imgs/recherche.png';
import excel from '../../assets/imgs/excel.png'
import archive from '../../assets/imgs/archive.png';
import revenu from '../../assets/imgs/cost.png';
import fichier from '../../assets/imgs/fichier.png';
import * as XLSX from 'xlsx';

const RevenusC = () => {
  const url = 'http://localhost:5000'
  const [errors, setErrors] = useState({});
  const [TypeRevenu, setTypeRevenu] = useState([]);
  const [fileName, setFileName] = useState("");
  const [selectedTR, setSelectedTR] = useState(null);
  const [formData, setFormData] = useState({
    code: "",
    type: "",
    cause_ar: "",
    cause_fr: "",
    montant: "",
    date: moment().format('YYYY-MM-DD'),
    par_ar: "",
    par_fr: "",
    mode_paie: "",
    remarque: "",
    fichier: null,
  });

  const [selectedEcole, setSelectedEcole] = useState(null);
  const [filteredEcoles, setFilteredEcoles] = useState([]);
  const [ecole, setEcoles] = useState([]);
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

  const isImage = (filename) => {
    return /\.(jpg|jpeg|png|gif)$/i.test(filename);
  };
  const [data, setData] = useState([]);
  const [revenuIdToDelete, setRevenuIdToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    handleListTypeRevenus();
    ListeRevenus();
  }, []);

  const handleListTypeRevenus = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Vous devez être connecté pour soumettre le formulaire.");
        return;
      }
      const response = await axios.get('http://localhost:5000/Typerevenus/liste', {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      const TROptions = response.data
        .filter(item => item.archiver === 0)
        .map(item => ({
          value: item.id,
          // label: `${item.type}`

          label: (
            <div>
              {item.type}{"    "}
              <span style={{ fontSize: "14px", color: "#888" }}>
                {item.Ecole?.nomecole || ''}
              </span>
            </div>
          )
        }));
      setTypeRevenu(TROptions);
    } catch (error) {
      console.error('Erreur lors de la récupération les types des revenus', error);
      alert('Une erreur est survenue lors de la récupération les types des revenus');
    }
  };

  const handleSelectTRChange = (selectedOption) => {
    setSelectedTR(selectedOption);
    setFormData({ ...formData, type: selectedOption.value });
  };

  const handleEdit = (item) => {
    setIsEditMode(true);
    setEditId(item.id);
    setFormData({
      code: item.code,
      type: item.TypeRevenue.id,
      cause_ar: item.cause_ar,
      cause_fr: item.cause_fr,
      montant: item.montant,
      date: moment(item.date).format('YYYY-MM-DD'),
      par_ar: item.par_ar,
      par_fr: item.par_fr,
      mode_paie: item.mode_paie,
      remarque: item.remarque,
      fichier: null,
    });
    setSelectedTR(TypeRevenu.find(tr => tr.value === item.TypeRevenue.id));
  };

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    if (type === "file") {
      const fichier = e.target.files[0];
      setFileName(fichier.name);
      setFormData({ ...formData, [name]: fichier });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const ListeRevenus = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Vous devez être connecté ");
        return;
      }
      const response = await axios.get(`http://localhost:5000/revenus/liste/`, {
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

  const handleClose = () => setShowDeleteModal(false);
  const handleShow = (id) => {
    setRevenuIdToDelete(id);
    setShowDeleteModal(true);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredData = data.filter(item => {
    const search = searchTerm.toLowerCase().trim();
    const matchesSearchTerm = search === '' || (
      (item.id && item.id.toString().includes(searchTerm)) ||
      (item.code && item.code.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (item.type && item.type.toString().includes(searchTerm)) ||
      (item.cause_ar && item.cause_ar.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (item.cause_fr && item.cause_fr.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (item.montant && item.montant.toString().includes(searchTerm)) ||
      (item.par_ar && item.par_ar.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (item.par_fr && item.par_fr.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (item.date && moment(item.date).format('DD-MM-YYYY').includes(searchTerm)) ||
      (item.TypeRevenue?.type && item.TypeRevenue.type.includes(searchTerm)) ||
      (item.mode_paie && item.mode_paie.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    // Filtre par école
    const matchesEcole = !selectedEcole ||
      (Array.isArray(item.Ecole) && item.Ecole.some(ecole => ecole.id === parseInt(selectedEcole))) ||
      (item.Ecole?.id === parseInt(selectedEcole));


    // Les deux conditions doivent être vraies
    return matchesSearchTerm && matchesEcole;
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

  const handlePrint = () => {
    const printWindow = window.open("", "", "width=800,height=600");
    printWindow.document.write(`
      <html>
        <head>
          <title>Liste des Revenus</title>
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
          <h5>Liste des Revenus</h5>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Code</th>
                <th>Type</th>
                <th>Cause (AR)</th>
                <th>Cause (FR)</th>
                <th>Montant</th>
                <th>Date</th>
                <th>Par(AR)</th>
                <th>Par(FR)</th>
                <th>Mode Paiement</th>
              </tr>
            </thead>
            <tbody>
              ${currentItems.map(item => `
                <tr>
                  <td>${item.id}</td>
                  <td>${item.code || ''}</td>
                  <td>${item.TypeRevenue ? item.TypeRevenue.type : ""}</td>
                  <td>${item.cause_ar || ''}</td>
                  <td>${item.cause_fr || ''}</td>
                  <td>${item.montant || ''}</td>
                  <td>${item.date ? moment(item.date).format('DD-MM-YYYY') : ''}</td>
                  <td>${item.par_ar || ''}</td>
                  <td>${item.par_fr || ''}</td>
                  <td>${item.mode_paie || ''}</td>
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

  const handleExport = () => {
    const ws = XLSX.utils.json_to_sheet(currentItems.map(item => ({
      "ID": item.id,
      "Code": item.code || '',
      "Type": item.TypeRevenue ? item.TypeRevenue.type : "",
      "Cause (AR)": item.cause_ar || '',
      "Cause (FR)": item.cause_fr || '',
      "Montant": item.montant || '',
      "Date": item.date ? moment(item.date).format('DD-MM-YYYY') : '',
      "Par (AR)": item.par_ar || '',
      "Par (FR)": item.par_fr || '',
      "Mode Paiement": item.mode_paie || '',
    })));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Revenus");
    XLSX.writeFile(wb, "liste_revenus.xlsx");
  };

  const ArchiverRevenu = async (id) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Vous devez être connecté");
        return;
      }
      const response = await axios.patch(`http://localhost:5000/revenus/archiver/${id}`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      await ListeRevenus();
    } catch (error) {
      console.log("Erreur", error);
    }
  };

  const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/jpg", "application/pdf",
    "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "text/plain"
  ];
  const maxSize = 5 * 1024 * 1024; // 5 Mo

  const validateFile = (file) => {
    if (file) {
      if (!allowedTypes.includes(file.type)) {
        return "Format non autorisé. Veuillez choisir une image, un PDF, un document Word ou un fichier texte.";
      }
      if (file.size > maxSize) {
        return "Le fichier est trop volumineux. La taille maximale est de 5 Mo.";
      }
    }
    return "";
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.type) newErrors.type = "Le type de revenu est requis";
    if (!formData.montant) newErrors.montant = "Le montant est requis";
    if (!formData.code) newErrors.code = "Le code est requis";

    const fileError = validateFile(formData.fichier);
    if (fileError) {
      newErrors.fichier = fileError;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const AjouterRevenu = async () => {
    if (!validateForm()) return;

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Vous devez être connecté");
        return;
      }

      const formDataToSend = new FormData();
      Object.keys(formData).forEach(key => {
        if (key !== 'fichier' && formData[key] !== null && formData[key] !== undefined) {
          formDataToSend.append(key, formData[key]);
        }
      });

      if (formData.fichier) {
        formDataToSend.append('fichier', formData.fichier);
      }

      let response;
      if (isEditMode) {
        response = await axios.put(`http://localhost:5000/revenus/modifier/${editId}`, formDataToSend, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
        alert('Revenu modifié avec succès');
      } else {
        response = await axios.post('http://localhost:5000/revenus/ajouter', formDataToSend, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
        alert('Revenu ajouté avec succès');
      }

      // Réinitialiser le formulaire
      setFormData({
        code: "",
        type: "",
        cause_ar: "",
        cause_fr: "",
        montant: "",
        date: moment().format('YYYY-MM-DD'),
        par_ar: "",
        par_fr: "",
        mode_paie: "",
        remarque: "",
        fichier: null,
      });
      setFileName("");
      setSelectedTR(null);
      setIsEditMode(false);
      setEditId(null);

      await ListeRevenus();
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

  //visibilité
  const [columnVisibility, setColumnVisibility] = useState({
    id: true,
    code: true,
    type: true,
    cause_ar: false,
    cause_fr: true,
    montant: true,
    date: true,
    par_ar: false,
    par_fr: true,
    mode_paie: true,
    remarque: false,
    fichier: true,
  });

  // Composant pour basculer la visibilité des colonnes
  // Composant pour basculer la visibilité des colonnes
  const ColumnVisibilityFilter = ({ columnVisibility, setColumnVisibility }) => {
    const columns = [
      { key: "id", label: "Id" },
      { key: "code", label: "Code" },
      { key: "type", label: "Type" },
      { key: "cause_ar", label: "Cause en arabe" },
      { key: "cause_fr", label: "Cause en Français" },
      { key: "montant", label: "Montant" },
      { key: "date", label: "Date" },
      { key: "par_ar", label: "Par en Arabe" },
      { key: "par_fr", label: "Par en Français" },
      { key: "mode_paie", label: "Mode de paiement" },
      { key: "remarque", label: "Remarque" },
      { key: "fichier", label: "Fichier" },
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
      <div className="mb-3 p-3">
        <h6>Choisir les colonnes à afficher :</h6>
        <Select
          isMulti
          options={columns.map(({ key, label }) => ({
            value: key,
            label: label,
          }))}
          value={columns
            .filter(({ key }) => columnVisibility[key])
            .map(({ key, label }) => ({
              value: key,
              label: label,
            }))}
          onChange={handleSelectChange}
          placeholder="Choisir les colonnes à afficher"
          isClearable={false}
        />

      </div>
    );
  };


  return (
    <>
      {/* <nav className="mb-2">
        <Link to="/dashboard">Dashboard</Link>
        <span> / </span>
        <span>Gestion des Revenus</span>
      </nav> */}

      {/* <div className="card card-primary card-outline"> */}
      {/* <div className="card-header d-flex">
          <img src={revenu} className='mt-2' width="60px" height="80px" />
          <p className="card-title mt-5 ml-2 p-2 text-center" style={{ width: '350px', borderRadius: '50px', border: '1px solid rgb(215, 214, 216)' }}>
            Gestion des Revenus
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
                                <label>Type du revenu *</label>
                                <Select
                                  name='type'
                                  options={TypeRevenu}
                                  onChange={handleSelectTRChange}
                                  value={selectedTR}
                                  placeholder="Sélectionnez un type"
                                />
                                {errors.type && <span className="text-danger">{errors.type}</span>}
                              </div>
                              <div className="col-md-4">
                                <label>Code *</label>
                                <input
                                  type="text"
                                  className="form-control"
                                  name="code"
                                  value={formData.code}
                                  onChange={handleChange}
                                  style={{ height: "40px" }}
                                />
                                {errors.code && <span className="text-danger">{errors.code}</span>}

                              </div>
                              <div className="col-md-4">
                                <label>Cause en Arabe</label>
                                <input
                                  type="text"
                                  className="form-control"
                                  name="cause_ar"
                                  value={formData.cause_ar}
                                  onChange={handleChange}
                                  style={{ height: "40px" }}
                                />
                              </div>
                              <div className="col-md-4">
                                <label>Cause en Français</label>
                                <input
                                  type="text"
                                  className="form-control"
                                  name="cause_fr"
                                  value={formData.cause_fr}
                                  onChange={handleChange}
                                  style={{ height: "40px" }}
                                />
                              </div>
                              <div className="col-md-4">
                                <label>Montant *</label>
                                <input
                                  type="number"
                                  className="form-control"
                                  name="montant"
                                  value={formData.montant}
                                  onChange={handleChange}
                                  style={{ height: "40px" }}
                                />
                                {errors.montant && <span className="text-danger">{errors.montant}</span>}
                              </div>
                              <div className="col-md-4">
                                <label>Date</label>
                                <input
                                  type="date"
                                  className="form-control"
                                  name="date"
                                  value={formData.date}
                                  onChange={handleChange}
                                  style={{ height: "40px" }}
                                />
                              </div>
                              <div className="col-md-4">
                                <label>Par en arabe</label>
                                <input
                                  type="text"
                                  className="form-control"
                                  name="par_ar"
                                  value={formData.par_ar}
                                  onChange={handleChange}
                                  style={{ height: "40px" }}
                                />
                              </div>
                              <div className="col-md-4">
                                <label>Par en Français</label>
                                <input
                                  type="text"
                                  className="form-control"
                                  name="par_fr"
                                  value={formData.par_fr}
                                  onChange={handleChange}
                                  style={{ height: "40px" }}
                                />
                              </div>
                              <div className="col-md-4">
                                <label htmlFor="mode_paie">Mode de paiement</label>
                                <select
                                  name='mode_paie'
                                  className="form-control"
                                  value={formData.mode_paie}
                                  onChange={handleChange}
                                  style={{ height: "40px" }}
                                >
                                  <option value="">Sélectionnez un mode</option>
                                  <option value="paiement en espéces">Paiement en espéces</option>
                                  <option value="virement bancaire">Virement bancaire</option>
                                  <option value="CCP">CCP</option>
                                  <option value="Chèques">Chèques</option>
                                </select>
                              </div>
                              <div className="col-md-4">
                                <label>Remarque</label>
                                <input
                                  type="text"
                                  className="form-control"
                                  name="remarque"
                                  value={formData.remarque}
                                  onChange={handleChange}
                                  style={{ height: "40px" }}
                                />
                              </div>
                              <div className="col-md-12 mb-3 mt-3" style={{ border: "1px solid rgb(192, 193, 194)", height: "40px", display: "flex", alignItems: "center", justifyContent: "center", padding: "5px", borderRadius: "5px", cursor: "pointer" }}>
                                <label htmlFor="file" style={{ marginRight: "10px", fontWeight: "bold", cursor: "pointer", color: 'rgb(65, 105, 238)' }}>
                                  {!fileName ? "Ajouter une pièce jointe" : <span style={{ marginLeft: "10px", fontSize: "14px" }}>{fileName}</span>}
                                </label>
                                <input
                                  id="file"
                                  type="file"
                                  name="fichier"
                                  style={{
                                    opacity: 0,
                                    position: 'absolute',
                                    zIndex: -1,
                                    width: "100%",
                                    height: "100%",
                                  }}
                                  onChange={handleChange}
                                />
                              </div>
                              {errors.fichier && <span className="text-danger">{errors.fichier}</span>}

                              <div className="col-md-12 mt-3">
                                <button type="button" className="btn btn-outline-primary" onClick={AjouterRevenu}>
                                  {isEditMode ? "Modifier" : "Ajouter"}
                                </button>
                                {isEditMode && (
                                  <button
                                    type="button"
                                    className="btn btn-outline-secondary ml-2"
                                    onClick={() => {
                                      setIsEditMode(false);
                                      setEditId(null);
                                      setFormData({
                                        code: "",
                                        type: "",
                                        cause_ar: "",
                                        cause_fr: "",
                                        montant: "",
                                        date: moment().format('YYYY-MM-DD'),
                                        par_ar: "",
                                        par_fr: "",
                                        mode_paie: "",
                                        remarque: "",
                                        fichier: null,
                                      });
                                      setFileName("");
                                      setSelectedTR(null);
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
                            <button className="btn btn-app p-1" onClick={handlePrint}>
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
                          <div className="col-md-4" style={{ flex: '1', marginRight: '10px' }}>
                            <select
                              name="ecole"
                              className="form-control"
                              required
                              style={{ height: '50px', borderRadius: '8px', backgroundColor: '#F8F8F8' }}
                              onChange={(e) => setSelectedEcole(e.target.value)}
                              value={selectedEcole || ''}
                            >
                              <option value="">Sélectionnez une école</option>
                              {ecole.map((item) => (
                                <option key={item.id} value={item.id}>
                                  {item.nomecole}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>


                        <p>Liste des Revenus</p>
                        {/* Filtre de visibilité des colonnes */}
                        <ColumnVisibilityFilter columnVisibility={columnVisibility} setColumnVisibility={setColumnVisibility} />

                        <table id="example2" className="table table-bordered table-sm">
                          <thead>
                            <tr>
                              {columnVisibility.id && <th>Id</th>}
                              {columnVisibility.code && <th>Code</th>}
                              {columnVisibility.type && <th>Type</th>}
                              {columnVisibility.cause_ar && <th>Cause (AR)</th>}
                              {columnVisibility.cause_fr && <th>Cause (FR)</th>}
                              {columnVisibility.montant && <th>Montant</th>}
                              {columnVisibility.date && <th>Date</th>}
                              {columnVisibility.par_ar && <th>Par (AR)</th>}
                              {columnVisibility.par_fr && <th>Par (FR)</th>}
                              {columnVisibility.mode_paie && <th>Mode Paiement</th>}
                              {columnVisibility.remarque && <th>Remarque</th>}
                              {columnVisibility.fichier && <th>Pièce jointe</th>}
                              <th>Ecole</th>
                              <th>Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {currentItems.map((item, index) => (
                              <tr key={index}>
                                {columnVisibility.id && <td>{indexOfFirstItem + index + 1}</td>}
                                {columnVisibility.code && <td>{item.code || '-'}</td>}
                                {columnVisibility.type && <td>{item.TypeRevenue?.type || '-'}</td>}
                                {columnVisibility.cause_ar && <td>{item.cause_ar || '-'}</td>}
                                {columnVisibility.cause_fr && <td>{item.cause_fr || '-'}</td>}
                                {columnVisibility.montant && <td>{item.montant || '-'}DZD</td>}
                                {columnVisibility.date && <td>{item.date ? moment(item.date).format("DD-MM-YYYY") : "" || '-'}</td>}
                                {columnVisibility.par_ar && <td>{item.par_ar || '-'}</td>}
                                {columnVisibility.par_fr && <td>{item.par_fr || '-'}</td>}
                                {columnVisibility.mode_paie && <td>{item.mode_paie || '-'}</td>}
                                {columnVisibility.remarque && <td>{item.remarque || '-'}</td>}
                                {columnVisibility.fichier && (
                                  <td width="100px" className="text-center">
                                    <div style={{
                                      width: "40px", height: "40px", border: "2px solid gray", display: "flex",
                                      alignItems: "center", justifyContent: "center", overflow: "hidden",
                                      cursor: "pointer", padding: "5px", marginLeft: '10px',
                                    }}
                                      onClick={() => {
                                        if (item) {
                                          console.log('itemfichier', item.fihcier);
                                          window.open(url + item.fichier, "_blank");
                                        }
                                      }}
                                    >
                                      {item && item.fichier ? (
                                        isImage(item.fichier) ? (
                                          <img src={url + item.fichier}
                                            alt="image" style={{ width: "100%", height: "100%", objectFit: "cover", }}
                                          />
                                        ) : (
                                          <img src={fichier} alt="Document"
                                            style={{ width: "30px", height: "30px", }}
                                          />
                                        )
                                      ) : null}
                                    </div>
                                  </td>
                                )}
                                <td>{item.Ecole?.nomecole}</td>
                                <td className="text-center" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                  <a className="btn btn-outline-success" style={{ maxWidth: '40px', maxHeight: '40px', display: 'flex', justifyContent: 'center', alignItems: 'center' }} onClick={() => handleEdit(item)}>
                                    <img src={edit} alt="" style={{ maxWidth: '30px', maxHeight: '30px' }} title="Modifier" />
                                  </a>
                                  &nbsp;&nbsp;&nbsp;&nbsp;
                                  <a className="btn btn-outline-warning" style={{ maxWidth: '40px', maxHeight: '40px', display: 'flex', justifyContent: 'center', alignItems: 'center' }} onClick={() => handleShow(item.id)}>
                                    <img src={archive} alt="" style={{ maxWidth: '35px', maxHeight: '35px' }} width="20px" title="Archiver" />
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
              <p>Êtes-vous sûr de vouloir archiver ce revenu ?</p>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose}>
                Annuler
              </Button>
              <Button
                variant="danger"
                onClick={() => {
                  ArchiverRevenu(revenuIdToDelete);
                  handleClose();
                }}
              >
                Archiver
              </Button>
            </Modal.Footer>
          </Modal>
        </div>
      </div>
      {/* </div> */}
    </>
  );
};

export default RevenusC;