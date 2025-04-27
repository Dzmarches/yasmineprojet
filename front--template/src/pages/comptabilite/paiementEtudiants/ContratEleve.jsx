import React, { useEffect, useState } from 'react';
import print from '../../../assets/imgs/printer.png';
import edit from '../../../assets/imgs/edit.png';
import { Link } from 'react-router-dom';
import axios from 'axios';
import moment from 'moment';
import Select from 'react-select';
import { Modal, Button } from 'react-bootstrap';
import recherche from '../../../assets/imgs/recherche.png';
import excel from '../../../assets/imgs/excel.png'
import archive from '../../../assets/imgs/archive.png';
import fichier from '../../../assets/imgs/fichier.png';
import * as XLSX from 'xlsx';

const ContratEleve = () => {
    const url = 'http://localhost:5000'
    const [errors, setErrors] = useState({});

    const [OptionsAS, setOptionsAS] = useState([]);
    const [OptionsNV, setOptionsNV] = useState([]);
    const [OptionsE, setOptionsE] = useState([]);

    const [SelectedAS, setSelectedAS] = useState(null);
    const [SelectedE, setSelectedE] = useState(null);
    const [SelectedNV, setSelectedNV] = useState(null);

    const [fileName, setFileName] = useState("");
    const [selectedTR, setSelectedTR] = useState(null);
    const [TypeRevenu, setTypeRevenu] = useState([]);

    const [formData, setFormData] = useState({
        code: "",
        niveau: "",
        annee_scolaire: "",
        eleve: "",
        date_debut_paiement: moment().format('YYYY-MM-DD'),
        date_creation: moment().format('YYYY-MM-DD'),
        remarque: "",
        nombre_echeances: 0,
        typePaiment: "",
        totalApayer: 0,
        fichier: null,
        frais_insc: "",
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
    const [searchTerm, setSearchTerm] = useState('');
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [editId, setEditId] = useState(null);
    const [revenuIdToDelete, setRevenuIdToDelete] = useState(null);

    useEffect(() => {
        handleListAnneScolaire();
        handleListeNiveaux();
        ListeContrats();
    }, []);

    const handleListAnneScolaire = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                alert("Vous devez être connecté pour soumettre le formulaire.");
                return;
            }
            const response = await axios.get('http://localhost:5000/anneescolaire/', {
                headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json", },
            });
            const ASOptions = response.data
                .filter(item => item.archiver === 0)
                .map(item => ({
                    value: item.id,
                    label: `${moment(item.datedebut).format('YYYY')} / ${moment(item.datefin).format('YYYY')}`
                }));
            setOptionsAS(ASOptions);
        } catch (error) {
            console.error('Erreur lors de la récupération des années', error);
            alert('Une erreur est survenue lors de la récupération des années');
        }
    };

    const handleListeNiveaux = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                alert("Vous devez être connecté pour soumettre le formulaire.");
                return;
            }
            const response = await axios.get('http://localhost:5000/niveaux', {
                headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json", },
            });
            const ASOptions = response.data
                .filter(item => item.archiver === 0)
                .map(item => ({
                    value: item.id,
                    label: (
                        <div>
                            {item.nomniveau}  {item.cycle}{"    "}
                            <span style={{ fontSize: "15px", color: "#888" }}>
                                {item.nomniveuarab || ''}
                            </span>
                        </div>
                    )
                }));
            setOptionsNV(ASOptions);
        } catch (error) {
            console.error('Erreur lors de la récupération des niveaux', error);
            alert('Une erreur est survenue lors de la récupération des niveaux');
        }
    };

    //select change etudiants
    // const handleSelectChange = (selectedOption, name) => {
    //     console.log("Option sélectionnée:", selectedOption); // Debug

    //     switch (name) {
    //         case 'annee_scolaire':
    //             setSelectedAS(selectedOption);
    //             setFormData({ ...formData, annee_scolaire: selectedOption.value })
    //             break;
    //         case 'niveau':
    //             setSelectedNV(selectedOption);
    //             setFormData({ ...formData, niveau: selectedOption.value })
    //             break;
    //         case 'eleve':
    //             setSelectedE(selectedOption);
    //             // setFormData({ ...formData, eleve: selectedOption.value ,frais_insc:selectedOption.fraisInscription});
    //             // setFormData({
    //             //     ...formData,
    //             //     eleve: selectedOption.value,
    //             //     frais_insc: selectedOption.fraisInscription
    //             // });
    //             setFormData({ 
    //                 ...formData, 
    //                 eleve: selectedOption.value,
    //                 frais_insc: selectedOption.fraisInscription || "0" // Valeur par défaut si undefined
    //             });

    //             console.log('formadata',formData.frais_insc)
    //             break;
    //         default:
    //             break;
    //     }
    //     setFormData({ ...formData, [name]: selectedOption.value });
    // };

    const handleSelectChange = (selectedOption, name) => {
        console.log("Option sélectionnée:", selectedOption);

        switch (name) {
            case 'annee_scolaire':
                setSelectedAS(selectedOption);
                setFormData(prev => ({
                    ...prev,
                    annee_scolaire: selectedOption.value
                }));
                break;

            case 'niveau':
                setSelectedNV(selectedOption);
                setFormData(prev => ({
                    ...prev,
                    niveau: selectedOption.value
                }));
                break;

            case 'eleve':
                setSelectedE(selectedOption);
                const newFrais = selectedOption.fraisInscription || "0";

                setFormData(prev => ({
                    ...prev,
                    eleve: selectedOption.value,
                    frais_insc: newFrais
                }));
                break;

            default:
                setFormData(prev => ({
                    ...prev,
                    [name]: selectedOption.value
                }));
                break;
        }
    };


    //recupere les eleleves selon le niveaux
    useEffect(() => {
        const niveauId = formData.niveau;
        if (niveauId) {
            const fetchData = async () => {
                try {
                    const token = localStorage.getItem("token");
                    const [elevesResponse] = await Promise.all([
                        axios.get(`http://localhost:5000/eleves/niveau/${niveauId}`, {
                            headers: { Authorization: `Bearer ${token}` }
                        }),
                    ]);
                    // Filtrer les élèves qui n'ont pas de section affectée
                    const eleves = elevesResponse.data.filter(eleve => eleve.niveauId === niveauId);
                    const ASOptions = eleves
                        .filter(item => item.archiver === 0)
                        .map(item => ({
                            value: item.id,
                            fraisInscription: item.fraixinscription,
                            label: (
                                <div>
                                    {item.User?.nom} {item.User?.prenom} {"     "}
                                    <span style={{ fontSize: "17px", color: "#888" }}>
                                        {item.User?.datenaiss ? moment(item.User?.datenaiss).format('DD-MM-YYYY') : ''}
                                    </span>
                                </div>
                            )
                        }));
                    console.log('frais', ASOptions)

                    setOptionsE(ASOptions);
                } catch (error) {
                    console.error(error);
                }
            };
            fetchData();
        }
    }, [formData.niveau]);



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

    const ListeContrats = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                alert("Vous devez être connecté ");
                return;
            }
            const response = await axios.get(`http://localhost:5000/contrat/liste/`, {
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
            const response = await axios.patch(`http://localhost:5000/contrat/archiver/${id}`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });
            await ListeContrats();
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

        if (!formData.niveau) newErrors.niveau = "Niveau est requis";
        if (!formData.annee_scolaire) newErrors.annee_scolaire = "Année scolaire est requis";
        if (!formData.eleve) newErrors.eleve = "Eleve est requis";
        if (!formData.code) newErrors.code = "Code est requis";
        if (!formData.date_debut_paiement) newErrors.date_debut_paiement = "Date debut de paiment est requis";
        if (!formData.date_creation) newErrors.date_creation = "Date ceation est requis";
        if (!formData.nombre_echeances) newErrors.nombre_echeances = "Nombre d'écheances est requis";
        if (!formData.totalApayer) newErrors.totalApayer = "Total a payer est requis";
        if (!formData.typePaiment) newErrors.typePaiment = "Type paiement est requis";
        if (!formData.frais_insc) newErrors.frais_insc = "Frais Inscription est requis";


        const fileError = validateFile(formData.fichier);
        if (fileError) {
            newErrors.fichier = fileError;
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const AjouterContrat = async () => {
        if (!validateForm()) return;

        try {
            const token = localStorage.getItem("token");
            if (!token) {
                alert("Vous devez être connecté");
                return;
            }

            // const formDataToSend = new FormData();
            // Object.keys(formData).forEach(key => {
            //     console.log('paq de fichier 5')
            //     if (key !== 'fichier' && formData[key] !== null && formData[key] !== undefined) {
            //         console.log('paq de fichier 9')
            //         formDataToSend.append(key, formData[key]);
            //     }
            // });
            // if (formData.fichier) {
            //     formDataToSend.append('fichier', formData.fichier);
            // }

            let response;
            if (isEditMode) {
                response = await axios.put(`http://localhost:5000/contrat/modifier/${editId}`, formData, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                });
                alert('Contrat modifié avec succès');
            } else {
                console.log('formDataToSend', formData)
                response = await axios.post('http://localhost:5000/contrat/ajouter', formData, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                });
                alert('Contrat ajouté avec succès');
            }
            // Réinitialiser le formulaire
            setFormData({
                code: "",
                niveau: "",
                annee_scolaire: "",
                eleve: "",
                date_debut_paiement: moment().format('YYYY-MM-DD'),
                date_creation: moment().format('YYYY-MM-DD'),
                remarque: "",
                nombre_echeances: 0,
                typePaiment: "",
                totalApayer: 0,
                frais_insc: "",
                fichier: null,
                frais_insc: ""
            });
            setFileName("");
            setSelectedE(null);
            setSelectedAS(null);
            setSelectedNV(null);
            setIsEditMode(false);
            setEditId(null);
            await ListeContrats();

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
        niveau: true,
        annee_scolaire: true,
        eleve: true,
        date_debut_paiement: true,
        date_creation: true,
        remarque: false,
        nombre_echeances: true,
        typePaiment: true,
        totalApayer: true,
        fichier: false,
        frais_insc: true,
    });

    // Composant pour basculer la visibilité des colonnes
    // Composant pour basculer la visibilité des colonnes
    const ColumnVisibilityFilter = ({ columnVisibility, setColumnVisibility }) => {
        const columns = [
            { key: "id", label: "Id" },
            { key: "code", label: "Code" },
            { key: "niveau", label: "Niveau" },
            { key: "annee_scolaire", label: "Année Scolaire " },
            { key: "eleve", label: "Eléve" },
            { key: "date_debut_paiement", label: "Date Debut Paiment" },
            { key: "date_creation", label: "Date creration Contrat" },
            { key: "nombre_echeances", label: "Nombre echeances" },
            { key: "typePaiment", label: "Type Paiment" },
            { key: "totalApayer", label: "Total a payer" },
            { key: "remarque", label: "Remarque" },
            { key: "fichier", label: "Fichier" },
            { key: "frais_insc", label: "Frais inscription" },
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
                                                                <label>Année Scolaire *</label>
                                                                <Select
                                                                    name='annee_scolaire'
                                                                    options={OptionsAS}
                                                                    onChange={(selected) => handleSelectChange(selected, 'annee_scolaire')}
                                                                    value={SelectedAS}
                                                                    placeholder="Sélectionnez une Année Scolaire"
                                                                />
                                                                {errors.annee_scolaire && <span className="text-danger">{errors.annee_scolaire}</span>}
                                                            </div>
                                                            <div className="col-md-4">
                                                                <label>Niveaux *</label>
                                                                <Select
                                                                    name='niveau'
                                                                    options={OptionsNV}
                                                                    onChange={(selected) => handleSelectChange(selected, 'niveau')}
                                                                    value={SelectedNV}
                                                                    placeholder="Sélectionnez le niveau"
                                                                />
                                                                {errors.niveau && <span className="text-danger">{errors.niveau}</span>}
                                                            </div>
                                                            <div className="col-md-4">
                                                                <label>Élève*</label>
                                                                <Select
                                                                    name='eleve'
                                                                    options={OptionsE}
                                                                    onChange={(selected) => handleSelectChange(selected, 'eleve')}
                                                                    value={SelectedE}
                                                                    placeholder="Sélectionnez l'élève"
                                                                />
                                                                {errors.eleve && <span className="text-danger">{errors.eleve}</span>}
                                                            </div>
                                                            <div className="col-md-4">
                                                                <label>Code  *</label>
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
                                                                <label>Total a payé *</label>
                                                                <input
                                                                    type="number"
                                                                    className="form-control"
                                                                    name="totalApayer"
                                                                    value={formData.totalApayer}
                                                                    onChange={handleChange}
                                                                    style={{ height: "40px" }}
                                                                />
                                                                {errors.totalApayer && <span className="text-danger">{errors.totalApayer}</span>}
                                                            </div>
                                                            <div className="col-md-4">
                                                                <label>Date de début de paiement  *</label>
                                                                <input
                                                                    type="date"
                                                                    className="form-control"
                                                                    name="date_debut_paiement"
                                                                    value={formData.date_debut_paiement}
                                                                    onChange={handleChange}
                                                                    style={{ height: "40px" }}
                                                                />
                                                                {errors.date_debut_paiement && <span className="text-danger">{errors.date_debut_paiement}</span>}
                                                            </div>


                                                            <div className="col-md-4">
                                                                <label htmlFor="typePaiment">Type de paiement</label>
                                                                <select
                                                                    name='typePaiment'
                                                                    className="form-control"
                                                                    value={formData.typePaiment}
                                                                    onChange={handleChange}
                                                                    style={{ height: "40px" }}
                                                                >
                                                                    <option value="">Sélectionnez un mode</option>
                                                                    <option value="Paiement unique">Paiement unique</option>
                                                                    <option value="Paiement échelonné">Paiement échelonné</option>

                                                                    {/* 💵 Paiement unique	L'étudiant paie la totalité en une seule fois.
                                                                    📅 Paiement mensuel	Le montant total est divisé sur plusieurs mois (ex. : chaque mois).
                                                                    📅 Paiement trimestriel	Paiement tous les 3 mois (souvent : 4 paiements par an).
                                                                    📅 Paiement semestriel	Deux paiements dans l'année, un tous les 6 mois.
                                                                    📅 Paiement annuel	Paiement une fois par an.
                                                                    📅 Paiement échelonné	Paiement en plusieurs échéances définies librement (pas forcément régulières).
                                                                    📅 Paiement immédiat (comptant)	Paiement total dès l'inscription, sans délai.*/}
                                                                </select>
                                                                {errors.typePaiment && <span className="text-danger">{errors.typePaiment}</span>}

                                                            </div>
                                                            <div className="col-md-4">
                                                                <label>Nombre d'écheances</label>
                                                                <input
                                                                    type="number"
                                                                    className="form-control"
                                                                    name="nombre_echeances"
                                                                    value={formData.nombre_echeances}
                                                                    onChange={handleChange}
                                                                    style={{ height: "40px" }}
                                                                />
                                                                {errors.nombre_echeances && <span className="text-danger">{errors.nombre_echeances}</span>}
                                                            </div>
                                                            <div className="col-md-4">
                                                                <label>Date Creation Contrat </label>
                                                                <input
                                                                    type="date"
                                                                    className="form-control"
                                                                    name="date_creation"
                                                                    value={formData.date_creation}
                                                                    onChange={handleChange}
                                                                    style={{ height: "40px" }}
                                                                />
                                                                {errors.date_creation && <span className="text-danger">{errors.date_creation}</span>}
                                                            </div>
                                                            <div className="col-md-4">
                                                                <label>Frais d'inscription</label>
                                                                <input
                                                                    type="text"
                                                                    className="form-control"
                                                                    name="frais_insc"
                                                                    value={formData.frais_insc}
                                                                    onChange={handleChange}
                                                                    style={{ height: "40px" }}
                                                                />
                                                                {errors.frais_insc && <span className="text-danger">{errors.frais_insc}</span>}
                                                            </div>

                                                            <div className="col-md-8">
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

                                                            {/* <div className="col-md-12 mb-3 mt-3" style={{ border: "1px solid rgb(192, 193, 194)", height: "40px", display: "flex", alignItems: "center", justifyContent: "center", padding: "5px", borderRadius: "5px", cursor: "pointer" }}>
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
                                                            </div> */}
                                                            {/* {errors.fichier && <span className="text-danger">{errors.fichier}</span>} */}
                                                            <div className="col-md-12 mt-3">
                                                                <button type="button" className="btn btn-outline-primary" onClick={AjouterContrat}>
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
                                                                                niveau: "",
                                                                                annee_scolaire: "",
                                                                                eleve: "",
                                                                                date_debut_paiement: moment().format('YYYY-MM-DD'),
                                                                                date_creation: moment().format('YYYY-MM-DD'),
                                                                                remarque: "",
                                                                                nombre_echeances: 0,
                                                                                typePaiment: "",
                                                                                totalApayer: 0,
                                                                                fichier: null,
                                                                                frais_insc: ""
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
                                                            {columnVisibility.niveau && <th>Niveau</th>}
                                                            {columnVisibility.annee_scolaire && <th>Année Scolaire</th>}
                                                            {columnVisibility.eleve && <th>Eléve</th>}
                                                            {columnVisibility.date_debut_paiement && <th>Debut Paiement</th>}
                                                            {columnVisibility.date_creation && <th>Date Creation</th>}
                                                            {columnVisibility.nombre_echeances && <th>Nbr Echeances</th>}
                                                            {columnVisibility.typePaiment && <th>Type Paiement</th>}
                                                            {columnVisibility.totalApayer && <th>Total a payer</th>}
                                                            {columnVisibility.frais_insc && <th>Frais d'inscription</th>}
                                                            {columnVisibility.remarque && <th>Remarque</th>}
                                                            <th>Ecole</th>
                                                            <th>Action</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {currentItems.map((item, index) => (
                                                            <tr key={index}>
                                                                {columnVisibility.id && <td>{indexOfFirstItem + index + 1}</td>}
                                                                {columnVisibility.code && <td>{item.code || '-'}</td>}
                                                                {columnVisibility.niveau && <td>{item.Eleve?.Niveaux?.nomniveau || '-'}</td>}
                                                                {columnVisibility.annee_scolaire && (
                                                                    <td>
                                                                        {item.Anneescolaire?.datedebut && item.Anneescolaire?.datefin ? (
                                                                            `${moment(item.Anneescolaire.datedebut).format('YYYY')}/${moment(item.Anneescolaire.datefin).format('YYYY')}`
                                                                        ) : (
                                                                            "—"
                                                                        )}
                                                                    </td>
                                                                )}
                                                                {columnVisibility.eleve && (
                                                                    <td>  {item.Eleve?.User ? (
                                                                            <>
                                                                                <div>{item.Eleve.User.nom} {item.Eleve.User.prenom}</div>
                                                                                <div style={{ fontSize: '0.85em', color: '#666' }}>
                                                                                    {item.Eleve.User.datenaiss
                                                                                        ? moment(item.Eleve.User.datenaiss).format('DD/MM/YYYY')
                                                                                        : '-'}
                                                                                </div>
                                                                            </>
                                                                        ) : (
                                                                            '-'
                                                                        )}
                                                                    </td>
                                                                )}
                                                                {columnVisibility.date_debut_paiement && <td>{item.date_debut_paiement ? moment(item.date_debut_paiement).format("DD-MM-YYYY") : ""}</td>}
                                                                {columnVisibility.date_creation && <td>{item.date_creation ? moment(item.date_creation).format("DD-MM-YYYY") : ""}</td>}
                                                                {columnVisibility.nombre_echeances && <td>{item.nombre_echeances || '-'}</td>}
                                                                {columnVisibility.typePaiment && <td>{item.typePaiment || '-'}</td>}
                                                                {columnVisibility.totalApayer && <td>{item.totalApayer || '-'}</td>}
                                                                {columnVisibility.frais_insc && <td>{item.Eleve?.fraixinscription || '-'}</td>}
                                                                {columnVisibility.remarque && <td>{item.remarque || '-'}</td>}
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

        </>
    );
};

export default ContratEleve;
