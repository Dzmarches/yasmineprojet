import React, { useEffect, useState } from 'react';
import print from '../../../assets/imgs/printer.png';
import edit from '../../../assets/imgs/edit.png';
import { Link } from 'react-router-dom';
import axios from 'axios';
import moment from 'moment';
import Select from 'react-select';
import { Modal, Button, Spinner } from 'react-bootstrap';
import recherche from '../../../assets/imgs/recherche.png';
import excel from '../../../assets/imgs/excel.png'
import archive from '../../../assets/imgs/archive.png';
import fichier from '../../../assets/imgs/fichier.png';
import PlanningModal from './ModalPlanning.jsx'
import plan from '../../../assets/imgs/leave.png';
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
    const [loadingSelects, setLoadingSelects] = useState(false);
    const [loadingModalPP, setLoadingModalPP] = useState(false);


    const [formData, setFormData] = useState({
        code: "",
        niveau: "",
        annee_scolaire: "",
        eleve: "",
        date_debut_paiement: moment().format('YYYY-MM-DD'),
        date_creation: moment().format('YYYY-MM-DD'),
        remarque: "",
        typePaiment: "",
        totalApayer: 0,
        fichier: null,
        frais_insc: "",
        date_sortie: moment().format('2025-05-30'),
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


    const [data, setData] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const [isPlanningModalOpen, setIsPlanningModalOpen] = useState(false);
    const [planning, setPlanning] = useState(null);

    const [isEditMode, setIsEditMode] = useState(false);
    const [editId, setEditId] = useState(null);
    const [ContratIdDelete, setContratIdDelete] = useState(null);

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
                                        {item.numinscription ? item.numinscription : ''}
                                    </span>
                                </div>
                            )
                        }));

                    setOptionsE(ASOptions);
                } catch (error) {
                    console.error(error);
                }
            };
            fetchData();
        }
    }, [formData.niveau]);

    const [editItem, setEditItem] = useState(null);
    const handleEdit = (item) => {
        setEditItem(item); // On sauvegarde l'item pour remplir plus tard
        setEditId(item.id);
        setIsEditMode(true);
        setLoadingSelects(true);
        FindContrat(item.id);
        setFormData({
            code: item.code,
            niveau: item.Eleve?.Niveaux?.id,
            annee_scolaire: item.Anneescolaire?.id,
            eleve: item.Eleve?.id,
            date_debut_paiement: moment(item.date_debut_paiement).format('YYYY-MM-DD'),
            date_creation: moment(item.date_creation).format('YYYY-MM-DD'),
            remarque: item.Remarque,
            typePaiment: item.typePaiment,
            totalApayer: item.totalApayer,
            frais_insc: item.Eleve?.fraixinscription,
            date_sortie: moment(item.date_sortie).format('YYYY-MM-DD')
        });
    };

    // Ce useEffect écoute quand OptionsE sont prêtes ET qu'on a cliqué sur Modifier
    useEffect(() => {
        if (editItem && OptionsE.length > 0 && OptionsAS.length > 0 && OptionsNV.length > 0) {
            setSelectedE(OptionsE.find(tr => tr.value === editItem.Eleve?.id) || null);
            setSelectedAS(OptionsAS.find(tr => tr.value === editItem.Anneescolaire?.id) || null);
            setSelectedNV(OptionsNV.find(tr => tr.value === editItem.Eleve?.Niveaux?.id) || null);
            setLoadingSelects(false);
            // Facultatif : une fois que tout est rempli tu peux vider editItem
            // setEditItem(null);
        }
    }, [editItem, OptionsE, OptionsAS, OptionsNV]);


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
    const handleCloseP = () => setIsPlanningModalOpen(false);


    const handleShow = (id) => {
        setContratIdDelete(id);
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
            (item.date_debut_paiement && moment(item.date_debut_paiement).format('DD-MM-YYYY').includes(searchTerm)) ||
            (item.date_creation && moment(item.date_creation).format('DD-MM-YYYY').includes(searchTerm)) ||
            (item.date_sortie && moment(item.date_sortie).format('DD-MM-YYYY').includes(searchTerm)) ||
            (item.typePaiment && item.typePaiment.includes(searchTerm)) ||
            (item.totalApayer && item.totalApayer.includes(searchTerm)) ||
            (item.Eleve.User?.nom && item.Eleve.User.nom.includes(searchTerm)) ||
            (item.Eleve.User?.prenom && item.Eleve.User.prenom.includes(searchTerm)) ||
            (item.Eleve.numinscription && item.Eleve?.numinscription.includes(searchTerm)) ||
            (item.Eleve?.fraixinscription && item.Eleve?.fraixinscription.includes(searchTerm)) ||
            (item.Eleve?.Niveaux?.nomniveau && item.Eleve?.Niveaux?.nomniveau.includes(searchTerm)) ||
            (
                item.Anneescolaire?.datedebut && item.Anneescolaire?.datefin &&
                (`${moment(item.Anneescolaire.datedebut).format('YYYY')}/${moment(item.Anneescolaire.datefin).format('YYYY')}`).includes(searchTerm)
            ) ||
            (
                item.Eleve?.User?.nom && item.Eleve?.User?.prenom &&
                (`${item.Eleve?.User?.nom} ${item.Eleve?.User?.prenom}`).includes(searchTerm)
            )



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
          <title>Liste des Contrats</title>
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
          <h5>Liste des Contrats</h5>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Code</th>
                <th>Niveau </th>
                <th>Nom Prenom </th>
                <th>Debut paiment</th>
                <th>Date de fin de paiement</th>
                <th>Type Paiment</th>
                <th>Total a payer</th>
                <th>Frais d'inscriptions</th>
                <th>Date création</th>
              </tr>
            </thead>
            <tbody>
              ${currentItems.map(item => `
                <tr>
                  <td>${item.id}</td>
                  <td>${item.code || ''}</td>
                  <td>
                  ${item.Eleve?.Niveaux?.nomniveau || ''}
                  ${moment(item.Anneescolaire?.datedebut).format('YYYY')}/${moment(item.Anneescolaire?.datefin).format('YYYY') || ''}
                  </td>
                  <td>${item.Eleve.User.nom} 
                  ${item.Eleve.User.prenom}
                  <br/>
                  ${item.Eleve.numinscription}
                  </td>
                  <td>${item.date_debut_paiement ? moment(item.date_debut_paiement).format('DD-MM-YYYY') : ''}</td>
                  <td>${item.date_sortie ? moment(item.date_debut_paiement).format('DD-MM-YYYY') : ''}</td>
                  <td>${item.typePaiment}</td>
                  <td>${item.totalApayer}</td>
                  <td>${item.Eleve?.fraixinscription}</td>
                  <td>${item.date_creation ? moment(item.date_creation).format("DD-MM-YYYY") : ""}</td>
                
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
            "Année Scolaire": `${moment(item.Anneescolaire?.datedebut).format('YYYY')} / ${moment(item.Anneescolaire?.datefin).format('YYYY')}`,
            "Niveau": item.Eleve?.Niveaux?.nomniveau || "",
            "Nom Prenom": `${item.Eleve?.User?.nom} ${item.Eleve?.User?.prenom}`,
            "Num Inscription": item.Eleve?.numinscription || '',
            "Debut paiement": item.date_debut_paiement ? moment(item.date_debut_paiement).format('DD-MM-YYYY') : '',
            "Date de fin de paiement": item.date_sortie ? moment(item.date_sortie).format('DD-MM-YYYY') : '',
            "Type Paiement": item.typePaiment || '',
            "Total à payer": item.totalApaye || '',
            "Frais d'inscription": item.Eleve?.fraixinscription || '',
            "Date création": item.date_creation ? moment(item.date_creation).format("DD-MM-YYYY") : ''

        })));
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Contrats");
        XLSX.writeFile(wb, "liste_contrats.xlsx");
    };

    const Archiver = async (id) => {
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

    const validateForm = () => {
        const newErrors = {};

        if (!formData.niveau) newErrors.niveau = "Niveau est requis";
        if (!formData.annee_scolaire) newErrors.annee_scolaire = "Année scolaire est requis";
        if (!formData.eleve) newErrors.eleve = "Eleve est requis";
        if (!formData.code) newErrors.code = "Code est requis";
        if (!formData.date_debut_paiement) newErrors.date_debut_paiement = "Date debut de paiment est requis";
        if (!formData.date_creation) newErrors.date_creation = "Date ceation est requis";
        if (!formData.totalApayer) newErrors.totalApayer = "Total a payer est requis";
        if (!formData.typePaiment) newErrors.typePaiment = "Type paiement est requis";
        if (!formData.frais_insc) newErrors.frais_insc = "Frais Inscription est requis";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const showModalPP = async (id) => {
        await FindContrat(id);
        setIsPlanningModalOpen(true);
    }

    const [canEdit, setCanEdit] = useState(false);
    const FindContrat = async (id) => {
        try {
            setLoadingSelects(true);
            const token = localStorage.getItem("token");
            if (!token) {
                alert("Vous devez être connecté");
                return;
            }
            const response = await axios.get(`http://localhost:5000/contrat/find/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });
            if (response.status === 200) {
                setPlanning(response.data);
                if (response.data.length === 0) {
                    setCanEdit(false);
                } else {
                    // const allArchived = response.data.filter(p => p.archiver === 0).length === 0;
                    // console.log('allArchived',allArchived)
                    setCanEdit(true);
                }
                return response.data;
            }
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

    useEffect(() => {
    }, [canEdit]);
    //visibilité
    const [columnVisibility, setColumnVisibility] = useState({
        id: true,
        code: true,
        niveau: true,
        annee_scolaire: true,
        eleve: true,
        date_debut_paiement: true,
        date_creation: false,
        remarque: false,
        date_sortie: true,
        typePaiment: false,
        totalApayer: true,
        frais_insc: true,
        action: true,
    });
    // Composant pour basculer la visibilité des colonnes
    const ColumnVisibilityFilter = ({ columnVisibility, setColumnVisibility }) => {
        const columns = [
            { key: "id", label: "Id" },
            { key: "code", label: "Code" },
            { key: "niveau", label: "Niveau" },
            { key: "annee_scolaire", label: "Année Scolaire " },
            { key: "eleve", label: "Eléve" },
            { key: "date_debut_paiement", label: "Date Debut Paiment" },
            { key: "date_creation", label: "Date creation Contrat" },
            { key: "date_sortie", label: "Date de fin de paiement" },
            { key: "typePaiment", label: "Type Paiment" },
            { key: "totalApayer", label: "Total a payer" },
            { key: "remarque", label: "Remarque" },
            { key: "frais_insc", label: "Frais inscription" },
            { key: "numInsc", label: "Num Insciption" },
            { key: "ecole", label: "Ecole" },
            { key: "action", label: "Action" },
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

    const AjouterContrat = async () => {
        if (!validateForm()) return;
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                alert("Vous devez être connecté");
                return;
            }
            let response;
            if (isEditMode) {
                console.log('editId', editId)
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
                date_sortie: moment().format('2025-05-30'),
                typePaiment: "",
                totalApayer: 0,
                frais_insc: "",
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

    // les statistiques

    // Dans votre composant ContratEleve, ajoutez cet état
    const [stats, setStats] = useState({
        totalPaye: 0,
        totalNonPaye: 0,
        parAnneeScolaire: [],
        parNiveau: []
    });

    // Fonction pour calculer les statistiques
    const calculerStats = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get('http://localhost:5000/contrat/stats', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setStats(response.data);
        } catch (error) {
            console.error("Erreur lors du calcul des stats", error);
        }
    };

    // Appelez cette fonction dans useEffect
    useEffect(() => {
        calculerStats();
        // ... autres initialisations
    }, []);



    const handleListeDE = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                alert("Vous devez être connecté");
                return;
            }
            const response = await axios.get('http://localhost:5000/attestation/liste',
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );
            const filteredDocs = response.data.filter((doc) => doc.module === "eleve" && doc.nom === "Contrat Paiment Eléve");
            const options = filteredDocs.map((doc) => ({
                value: doc.id, // Utilisez l'ID ou un autre champ unique comme valeur
                label: doc.nom, // Utilisez le nom du document comme libellé
                modele: doc.modeleTexte
            }));
            return options
        } catch (error) {
            console.log("Erreur lors de la récupération des attestations", error);
        }
    };

    //imprimer Contrat:
    const Printcontrat = async (id) => {
        const data = await FindContrat(id);
        console.log('data is', data)
        const planning = data[0];
        const contrat = planning.Contrat;
        const eleve = contrat?.Eleve;
        const user = eleve?.User;
        const ecolePrincipal = user?.EcolePrincipal;
        const pere = eleve?.Parents?.find(p => p.typerole === "Père");
        const mere = eleve?.Parents?.find(p => p.typerole === "Mère");

        const reponse = await handleListeDE();
        const modeleText = reponse[0].modele;

        if (!contrat || !modeleText) {
            alert('Contrat ou model du contrat non défini')
            return;
        }
        const dateToday = moment().format('DD/MM/YYYY');
        //plannig 
        const planningHtml = data.map((p, index) => `
            <tr>
            <td>${index + 1}</td>
            <td>${moment(p.date_echeance).format("DD/MM/YYYY")}</td>
            <td>${p.codePP} DA</td>
            <td>${p.montant_echeance} DA</td>
        </tr>
    `).join("");
        const planningTable = `
    <table>
        <thead>
            <tr>
                <th>#</th>
                <th>Date Échéance</th>
                <th>Code</th>
                <th>Montant</th>
            </tr>
        </thead>
        <tbody>
            ${planningHtml}
        </tbody>
    </table>
`;

        const modeleTextupdate = modeleText
            .replace(/\[nomecolePE\]/g, ecolePrincipal?.nomecole || "")
            .replace(/\[adressePE\]/g, ecolePrincipal?.adresse || "")
            .replace(/\[nomE\]/g, user?.nom || "")
            .replace(/\[nomAbE\]/g, user?.nom_ar || "")
            .replace(/\[prenomE\]/g, user?.prenom || "")
            .replace(/\[prenomAbE\]/g, user?.prenom_ar || "")
            .replace(/\[LieunaisE\]/g, user?.lieuxnaiss || "")
            .replace(/\[LieunaisAbE\]/g, user?.adresse || "")
            .replace(/\[AdresseE\]/g, user?.prenom_ar || "")
            .replace(/\[AdresseAbE\]/g, user?.adresse_ar || "")
            .replace(/\[datenaissE\]/g, user?.datenaiss ? moment(user.datenaiss).format("DD/MM/YYYY") : "")
            .replace(/\[numInscription\]/g, eleve?.numinscription || "")
            .replace(/\[FraisInsc\]/g, eleve?.fraixinscription || "")
            .replace(/\[NV\]/g, `${eleve?.Niveaux?.nomniveau} ${eleve?.Niveaux?.cycle} ` || "")
            .replace(/\[nomP\]/g, pere?.User?.nom || "")
            .replace(/\[prenomP\]/g, pere?.User?.prenom || "")
            .replace(/\[EmailP\]/g, pere?.User?.email || "")
            .replace(/\[TelP\]/g, pere?.User?.telephone || "")
            .replace(/\[AdresseP\]/g, pere?.User?.adresse || "")
            .replace(/\[dateToday\]/g, moment().format("DD/MM/YYYY"))

            //contrat
            .replace(/\[AS\]/g, `${moment(contrat.Anneescolaire?.datedebut).format("YYYY")}/${moment(contrat.Anneescolaire?.datefin).format("YYYY")}` || "")
            .replace(/\[codeC\]/g, contrat?.code || "")
            .replace(/\[ddP\]/g, `${moment(contrat.date_debut_paiement).format("DD-MM-YYYY")}` || "")
            .replace(/\[dfP\]/g, `${moment(contrat.date_sortie).format("DD-MM-YYYY")}` || "")
            .replace(/\[dcC\]/g, `${moment(contrat.date_creation).format("DD-MM-YYYY")}` || "")
            .replace(/\[totalC\]/g, contrat?.totalApayer || "")
            .replace(/\[TypeP\]/g, contrat?.typePaiment || "")
            .replace(/\[planning\]/g, planningTable)

        //plannig







        const iframe = document.createElement('iframe');
        iframe.style.display = 'none';
        document.body.appendChild(iframe);

        const iframeDocument = iframe.contentWindow.document;
        iframeDocument.open();
        // @page{ margin: 0;}
        iframeDocument.write(`
            <html>
              <head>
                <title>${contrat.Contrat?.Eleve?.User?.nom}.${contrat.Contrat?.Eleve?.User?.prenom}</title>
                <style>
                  @media print {
                    body { margin: 0 !important ; padding: 40px !important ; }
                    table {
                      border-collapse: collapse;
                      width: 100%;
                    }
                    table, th, td {
                      border: 1px solid #EBEBEB;
                    }
                  }
                </style>
              </head>
              <body>
              <body>
                <div class="containerEditor">
                  <div class="ql-editor">
                    ${modeleTextupdate}
                  </div>
                </div>
              </body>
            </html>
          `);
        iframeDocument.close();
        const originalTitle = document.title;
        document.title = `${contrat.Contrat?.Eleve?.User?.nom}.${contrat.Contrat?.Eleve?.User?.prenom}`;
        setTimeout(() => {
            iframe.contentWindow.focus();
            iframe.contentWindow.print();
            document.title = originalTitle;
            document.body.removeChild(iframe);
        }, 1000);
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
                                                                    readOnly={canEdit}
                                                                />
                                                                {errors.totalApayer && <span className="text-danger">{errors.totalApayer}</span>}
                                                            </div>

                                                            <div className="col-md-4">
                                                                <label htmlFor="typePaiment">Type de paiement</label>
                                                                <select
                                                                    disabled={canEdit}
                                                                    name='typePaiment'
                                                                    className="form-control"
                                                                    value={formData.typePaiment}
                                                                    onChange={handleChange}
                                                                    style={{ height: "40px" }}
                                                                >
                                                                    <option value="">Sélectionnez un mode</option>
                                                                    <option value="Paiement mensuel">Paiement mensuel</option>
                                                                    <option value="Paiement trimestriel">Paiement trimestriel</option>
                                                                    <option value="Paiement semestriel">Paiement semestriel</option>
                                                                    <option value="Paiement annuel">Paiement annuel</option>
                                                                </select>
                                                                {errors.typePaiment && <span className="text-danger">{errors.typePaiment}</span>}
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
                                                                <label>Date de début du paiement  *</label>
                                                                <input
                                                                    type="date"
                                                                    className="form-control"
                                                                    name="date_debut_paiement"
                                                                    value={formData.date_debut_paiement}
                                                                    onChange={handleChange}
                                                                    style={{ height: "40px" }}
                                                                    readOnly={canEdit}
                                                                />
                                                                {errors.date_debut_paiement && <span className="text-danger">{errors.date_debut_paiement}</span>}
                                                            </div>
                                                            <div className="col-md-4">
                                                                <label>Date de Fin du paiement*</label>
                                                                <input
                                                                    type="date"
                                                                    className="form-control"
                                                                    name="date_sortie"
                                                                    value={formData.date_sortie}
                                                                    onChange={handleChange}
                                                                    readOnly={canEdit}
                                                                    style={{ height: "40px" }}
                                                                />
                                                                {errors.date_sortie && <span className="text-danger">{errors.date_sortie}</span>}
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
                                                                            setEditItem(null);
                                                                            setFormData({
                                                                                code: "",
                                                                                niveau: "",
                                                                                annee_scolaire: "",
                                                                                eleve: "",
                                                                                date_debut_paiement: moment().format('YYYY-MM-DD'),
                                                                                date_creation: moment().format('YYYY-MM-DD'),
                                                                                remarque: "",
                                                                                date_sortie: moment().format('2025-05-30'),
                                                                                typePaiment: "",
                                                                                totalApayer: 0,
                                                                                frais_insc: ""
                                                                            });
                                                                            setFileName("");
                                                                            setSelectedE(null);
                                                                            setSelectedAS(null);
                                                                            setSelectedNV(null);
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

                                                {/* Filtre de visibilité des colonnes */}
                                                <ColumnVisibilityFilter columnVisibility={columnVisibility} setColumnVisibility={setColumnVisibility} />
                                                <p>Liste des Contrats</p>
                                                <table id="example2" className="table table-bordered table-sm">
                                                    <thead>
                                                        <tr>
                                                            {columnVisibility.id && <th>Id</th>}
                                                            {columnVisibility.code && <th>Code</th>}
                                                            {columnVisibility.niveau && <th>Niveau</th>}
                                                            {columnVisibility.annee_scolaire && <th>Année Scolaire</th>}
                                                            {columnVisibility.eleve && <th>Eléve</th>}
                                                            {columnVisibility.numInsc && <th>Num Inscription</th>}
                                                            {columnVisibility.date_debut_paiement && <th>Debut Paiement</th>}
                                                            {columnVisibility.date_creation && <th>Date Creation</th>}
                                                            {columnVisibility.date_sortie && <th>Fin Paiement</th>}
                                                            {columnVisibility.typePaiment && <th>Type Paiement</th>}
                                                            {columnVisibility.totalApayer && <th>Total a payer</th>}
                                                            {columnVisibility.frais_insc && <th>Frais d'inscription</th>}
                                                            {columnVisibility.remarque && <th>Remarque</th>}
                                                            {columnVisibility.ecole && <th>Ecole</th>}
                                                            {columnVisibility.action && <th style={{ width: "180px" }}>Action</th>}

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
                                                                            {/* <div style={{ fontSize: '0.85em', color: '#666' }}>
                                                                                {item.Eleve.numinscription
                                                                                    ? item.Eleve.numinscription
                                                                                    : '-'}
                                                                            </div> */}
                                                                        </>
                                                                    ) : (
                                                                        '-'
                                                                    )}
                                                                    </td>
                                                                )}
                                                                {columnVisibility.numInsc && <td> {item.Contrat?.Eleve?.numinscription}</td>}
                                                                {columnVisibility.date_debut_paiement && <td>{item.date_debut_paiement ? moment(item.date_debut_paiement).format("DD-MM-YYYY") : ""}</td>}
                                                                {columnVisibility.date_creation && <td>{item.date_creation ? moment(item.date_creation).format("DD-MM-YYYY") : ""}</td>}
                                                                {columnVisibility.date_sortie && <td>{item.date_sortie ? moment(item.date_sortie).format("DD-MM-YYYY") : '-'}</td>}
                                                                {columnVisibility.typePaiment && <td>{item.typePaiment || '-'}</td>}
                                                                {columnVisibility.totalApayer && <td>{item.totalApayer || '-'}</td>}
                                                                {columnVisibility.frais_insc && <td>{item.Eleve?.fraixinscription || '-'}</td>}
                                                                {columnVisibility.remarque && <td>{item.remarque || '-'}</td>}
                                                                {columnVisibility.ecole && <td>{item.Eleve?.User?.Ecole?.nomecole}</td>}
                                                                {columnVisibility.action &&
                                                                    <td style={{ display: 'flex', justifyContent: '', width: "180px", alignItems: 'center', textAlign: 'center' }}>
                                                                        <button
                                                                            className="btn btn-outline-info action-btn"
                                                                            onClick={() => Printcontrat(item.id)}
                                                                            title="Imprimer"
                                                                        >
                                                                            <img src={print} alt="Imprimer" className="action-icon" />
                                                                        </button>
                                                                        <button
                                                                            className="btn btn-outline-success action-btn"
                                                                            onClick={() => handleEdit(item)}
                                                                            title="Modifier"
                                                                        >
                                                                            <img src={edit} alt="Modifier" className="action-icon" />
                                                                        </button>
                                                                        <button
                                                                            className="btn btn-outline-warning action-btn"
                                                                            onClick={() => handleShow(item.id)}
                                                                            title="Archiver"
                                                                        >
                                                                            <img src={archive} alt="Archiver" className="action-icon" />
                                                                        </button>
                                                                        <button
                                                                            className="btn btn-outline-info action-btn"
                                                                            onClick={() => showModalPP(item.id)}
                                                                            title="Planning"
                                                                        >
                                                                            <img src={plan} alt="Planning" className="action-icon" />
                                                                        </button>

                                                                    </td>
                                                                }


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
                                    Archiver(ContratIdDelete);
                                    handleClose();
                                }}
                            >
                                Archiver
                            </Button>
                        </Modal.Footer>
                    </Modal>

                    <PlanningModal
                        show={isPlanningModalOpen}
                        handleCloseP={handleCloseP}
                        planning={planning}
                        FindContrat={FindContrat}
                    />

                </div >
            </div >

        </>
    );
};

export default ContratEleve;
