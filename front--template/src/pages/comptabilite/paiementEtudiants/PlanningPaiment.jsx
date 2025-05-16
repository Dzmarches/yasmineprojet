import React, { useEffect, useState } from 'react';
import exportIcon from '../../../assets/imgs/excel.png';
import printIcon from '../../../assets/imgs/printer.png';
import { Link } from 'react-router-dom';
import Select from 'react-select';
import axios from 'axios';
import moment from 'moment-timezone';
import * as XLSX from 'xlsx';
import { Modal, Button, Form, Row, Col, CardBody, Card, Container, CardTitle } from 'react-bootstrap';
import recherche from '../../../assets/imgs/recherche.png';
import edit from '../../../assets/imgs/edit.png';
import archive from '../../../assets/imgs/delete.png';
import print from '../../../assets/imgs/printer.png';
// import { StatsComptabilite } from './StatsComptabilite';



const PlanningPaiement = () => {
    const [selectedEleves, setSelectedEleves] = useState([]);
    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [selectedEcole, setSelectedEcole] = useState(null);
    const [ecoles, setEcoles] = useState([]);
    const [errors, setErrors] = useState({});
    const [isEditMode, setIsEditMode] = useState(false);

    const [OptionsAS, setOptionsAS] = useState([]);
    const [OptionsNV, setOptionsNV] = useState([]);
    const [OptionsE, setOptionsE] = useState([]);
    const [SelectedRappel, setSelectedRappel] = useState();

    const [SelectedAS, setSelectedAS] = useState(null);
    const [SelectedE, setSelectedE] = useState(null);
    const [SelectedNV, setSelectedNV] = useState(null);
    const [isPlanningModalOpen, setIsPlanningModalOpen] = useState(false);
    const [Today, setToday] = useState('');

    const [formData, setFormData] = useState({
        annee_scolaire: '',
        niveau: '',
        eleve: '',
        code: '',
        totalApayer: '',
        frais_insc: '0',
        etat_paiement: 'retardplus7',
    });
    const handleCloseP = () => setIsPlanningModalOpen(false);
    const handleShow = () => setIsPlanningModalOpen(true);
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
                const ecolesWithDefaults = response.data.map(ecole => ({
                    ...ecole,
                    nomecole: ecole.nomecole || '',
                    nom_arecole: ecole.nom_arecole || '',
                }));
                setEcoles(ecolesWithDefaults);
            } catch (error) {
                console.error('Erreur lors de la récupération des écoles', error);
            }
        };
        fetchEcoles();
    }, []);

    useEffect(() => {
        handleListAnneScolaire();
        handleListeNiveaux();
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
    useEffect(() => {
        const fetchElevesByNiveau = async () => {
            const niveauId = formData.niveau;
            if (niveauId) {
                try {
                    const token = localStorage.getItem("token");
                    const response = await axios.get(`http://localhost:5000/eleves/niveau/${niveauId}`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });

                    const eleves = response.data.filter(eleve => eleve.niveauId === niveauId);
                    const elevesOptions = eleves
                        .filter(item => item.archiver === 0)
                        .map(item => ({
                            value: item.id,
                            fraisInscription: item.fraixinscription,
                            label: (
                                <div>
                                    {item.User?.nom} {item.User?.prenom} {"     "}
                                    <span style={{ fontSize: "17px", color: "#888" }}>
                                        {item.numinscription || ''}
                                    </span>
                                </div>
                            )
                        }));

                    setOptionsE(elevesOptions);
                } catch (error) {
                    console.error(error);
                }
            }
        };
        fetchElevesByNiveau();
    }, [formData.niveau]);

    useEffect(() => {
        fetchplanning();
    }, []);

    const fetchplanning = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get('http://localhost:5000/contrat/listeplanning', {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });
            console.log("Données reçues:", response.data);
            const { hps, today } = response.data;
            // Vérifie que hps est bien un tableau
            if (Array.isArray(hps)) {
                const filteredData = hps.slice(0, 10);
                console.log(filteredData);
            } else {
                console.error('hps n\'est pas un tableau:', hps);
            }
            setData(hps);
            setToday(today);
            setFilteredData(hps);
        } catch (error) {
            console.error("Erreur lors du chargement des données:", error);
        }
    };
    const handlePrint = () => {
        const printWindow = window.open("", "", "width=800,height=600");
        printWindow.document.write(`
          <html>
            <head>
              <title>Planning des paiement</title>
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
              <h5>Planning des paiement</h5>
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Code Contrat</th>
                    <th>Code</th>
                    <th>Nom et Prénom </th>
                    <th>Num Inscription</th>
                    <th>Niveau</th>
                    <th>Date Échéance</th>
                    <th>Montant Échéance</th>
                    <th>Montant Restant</th>
                    <th>État Paiement</th>
                    <th>Date Paiement</th>
                    <th>Mode Paiement</th>
                  </tr>
                </thead>
                <tbody>
                  ${filteredData.map(item => `
                    <tr>
                      <td>${item.id || ''}</td>
                      <td>${item.Contrat?.code || ''}</td>
                      <td> ${item.codePP || ''} </td>
                      <td>${item.Contrat?.Eleve?.User?.nom || ''} ${item.Contrat?.Eleve?.User?.prenom || ''}</td>
                      <td>${item.Contrat?.Eleve?.numinscription || ''}</td>
                      <td>${item.Contrat?.Niveaux?.nomniveau || ''}</td>
                      <td>${item.date_echeance ? moment(item.date_echeance).format('DD-MM-YYYY') : ''}</td>
                      <td>${item.montant_echeance || ''}</td>
                      <td>${item.montant_restant || ''}</td>
                      <td>${item.etat_paiement || ''}</td>
                      <td>${item.date_paiement ? moment(item.date_paiement).format('DD-MM-YYYY') : ''}</td>
                      <td>${item.mode_paiement || ''}</td>
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
        const ws = XLSX.utils.json_to_sheet(filteredData.map(item => ({
            "Code Contrat": item.Contrat?.code,
            "Code": item.codePP,
            "Nom et Prénom": `${item.Contrat?.Eleve?.User.nom} ${item.Contrat?.Eleve?.User.prenom}`,
            "Num Inscription": `${item.Contrat?.Eleve?.numinscription}`,
            "Niveau": item.Contrat?.Niveaux?.nomniveau,
            "Date Échéance": item.date_echeance ? moment(item.date_echeance).format('DD-MM-YYYY') : '',
            "Montant Échéance": item.montant_echeance,
            "Montant Restant": item.montant_restant,
            "État Paiement": item.etat_paiement,
            "Date Paiement": item.date_paiement ? moment(item.date_paiement).format('DD-MM-YYYY') : '',
            "Mode Paiement": item.mode_paiement
        })));

        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "PlanningPaiement");
        XLSX.writeFile(wb, "planning_paiement.xlsx");
    };
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };
    const handleSelectChange = (selectedOption, name) => {
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
            case 'rappel':
                setSelectedRappel(selectedOption);
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
    const [columnVisibility, setColumnVisibility] = useState({
        code: true,
        date_echeance: true,
        montant_echeance: true,
        montant_restant: true,
        mode_paiement: true,
        date_paiement: true,
        etat_paiement: true,
        action: true,
    });

    const ColumnVisibilityFilter = () => {
        const columns = [
            { key: "code", label: "Code" },
            { key: "date_echeance", label: "Date Échéance" },
            { key: "montant_echeance", label: "Montant Échéance" },
            { key: "montant_restant", label: "Montant Restant" },
            { key: "etat_paiement", label: "Etat paiement" },
            { key: "date_paiement", label: "Date Paiement" },
            { key: "mode_paiement", label: "Mode Paiment" },
            { key: "numInsc", label: "Num Insciption" },
            { key: "ecole", label: "Ecole" },
            { key: "dateRappel", label: "Date de rappel" },
            { key: "dureRappel", label: "Durée de rappel" },
            { key: "action", label: "Action" },
        ];

        const handleColumnChange = (selectedOptions) => {
            const newVisibility = {};
            columns.forEach(col => {
                newVisibility[col.key] = selectedOptions.some(opt => opt.value === col.key);
            });
            setColumnVisibility(newVisibility);
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
                    onChange={handleColumnChange}
                    placeholder="Choisir les colonnes à afficher"
                    isClearable={false}
                />
            </div>
        );
    };

    const itemsPerPage = 10;
    const [currentPage, setCurrentPage] = useState(1);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };
    const pageNumbers = [];
    for (let i = Math.max(1, currentPage - 2); i <= Math.min(currentPage + 2, totalPages); i++) {
        pageNumbers.push(i);
    }
    const [searchTerm, setSearchTerm] = useState('');
    const applyFilters = () => {
        const filtersActive =
            formData.eleve ||
            formData.niveau ||
            formData.annee_scolaire ||
            formData.etat_paiement ||
            startDate ||
            endDate ||
            selectedEcole ||
            searchTerm;

        if (!filtersActive) {
            setFilteredData(data);
            return;
        }

        const filtered = data.filter(item => {
            try {
                const contrat = item.Contrat || {};
                const eleve = contrat.Eleve || {};
                const user = eleve.User || {};
                const niveaux = contrat.Niveaux || {};
                const anneescolaire = contrat.Anneescolaire || {};
                const today = moment().startOf('day');
                const dueDate = moment(item.date_echeance).startOf('day');
                const daysDiff = today.diff(dueDate, 'days');

                // Appliquez chaque filtre un par un
                if (formData.eleve && eleve.id != formData.eleve) return false;
                if (formData.niveau && niveaux.id != formData.niveau) return false;
                if (formData.annee_scolaire && anneescolaire.id != formData.annee_scolaire) return false;
                // if (formData.etat_paiement && item.etat_paiement !== formData.etat_paiement) return false;

                if (startDate && !moment(item.date_echeance).isSameOrAfter(startDate, 'day')) return false;
                if (endDate && !moment(item.date_echeance).isSameOrBefore(endDate, 'day')) return false;

                if (selectedEcole && user.Ecoles[0]?.id != selectedEcole) return false;

                if (searchTerm) {
                    const term = searchTerm.toLowerCase();
                    const matches =
                        (user.nom?.toLowerCase().includes(term)) ||
                        (user.prenom?.toLowerCase().includes(term)) ||
                        (
                            user?.nom && user?.prenom &&
                            (`${user?.nom} ${user?.prenom}`).includes(searchTerm)
                        ) ||
                        (item.codePP?.toLowerCase().includes(term)) ||
                        (item.montant_echeance?.toLowerCase().includes(term)) ||
                        (item.montant_restant?.toLowerCase().includes(term)) ||
                        (item.Contrat?.code?.toLowerCase().includes(term)) ||
                        (item.Contrat?.Eleve?.numinscription.toLowerCase().includes(term)) ||
                        (item.mode_paiement.toLowerCase().includes(term))
                    if (!matches) return false;

                }

                // Filtre par état de paiement
                if (formData.etat_paiement) {
                    // Cas "payé" et "non payé"
                    if (formData.etat_paiement === "payé" && item.etat_paiement !== "payé") return false;
                    if (formData.etat_paiement === "non payé" && item.etat_paiement !== "non payé") return false;

                    // Cas "retard" (1-7 jours de retard)
                    if (formData.etat_paiement === "retard") {
                        if (item.etat_paiement !== "non payé" || daysDiff <= 0 || daysDiff > 7) return false;
                    }

                    // Cas "retardplus7" (>7 jours de retard)
                    if (formData.etat_paiement === "retardplus7") {
                        if (item.etat_paiement !== "non payé" || daysDiff <= 7) return false;
                    }
                }

                return true;
            } catch (error) {
                console.error("Erreur de filtrage:", error, item);
                return false;
            }
        });
        setFilteredData(filtered);
        setCurrentPage(1);
    };
    // Déclenche applyFilters quand les filtres changent
    useEffect(() => {
        applyFilters();
    }, [formData.eleve, formData.niveau, formData.annee_scolaire, formData.etat_paiement,
        startDate, endDate, selectedEcole, searchTerm, data]);

    const [editFormData, setEditFormData] = useState({
        code: '',
        montant_echeance: '',
        montant_restant: '',
        etat_paiement: '',
        date_paiement: '',
        date_echeance: '',
        mode_paiement: ''
    });

    const [editPlan, setEditPlan] = useState(null); // Données du planning à modifier
    const ModifierP = (planId) => {
        const selectedPlan = currentItems.find(plan => plan.id === planId);
        setEditPlan(selectedPlan); // Conservez une référence à l'élément en cours de modification
        setIsPlanningModalOpen(true);

        setEditFormData({
            code: selectedPlan.codePP,
            montant_echeance: selectedPlan.montant_echeance,
            montant_restant: selectedPlan.montant_restant,
            etat_paiement: selectedPlan.etat_paiement,
            date_paiement: selectedPlan.date_paiement ? moment(selectedPlan.date_paiement).format('YYYY-MM-DD') : '',
            date_echeance: selectedPlan.date_echeance ? moment(selectedPlan.date_echeance).format('YYYY-MM-DD') : '',
            mode_paiement: selectedPlan.mode_paiement
        });
    };

    //modifier plannig 
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name === 'etat_paiement') {
            if (value === 'payé') {
                setEditFormData((prev) => ({
                    ...prev,
                    etat_paiement: value,
                    montant_restant: 0, // Paié = montant restant = 0
                }));
            } else if (value === 'non payé') {
                setEditFormData((prev) => ({
                    ...prev,
                    etat_paiement: value,
                    montant_restant: editPlan?.montant_restant ?? prev.montant_restant,
                    date_paiement: '',
                    mode_paiement: '',
                }));
            } else {
                setEditFormData((prev) => ({
                    ...prev,
                    [name]: value,
                }));
            }
        } else {
            setEditFormData((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleSaveChanges = async () => {
        const updatedData = { ...editFormData, id: editPlan.id };
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:5000/contrat/modifierPlanning/${editPlan.id}`, {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedData),
            });
            if (response.ok) {
                const result = await response.json();
                setIsPlanningModalOpen(false);
                fetchplanning();
            }
        } catch (error) {
            console.error('Erreur de réseau', error);
        }
    };

    //archivage 
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [ppIdDelete, setppIdDelete] = useState(null);
    const Archiver = async (id) => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                alert("Vous devez être connecté");
                return;
            }
            const response = await axios.patch(`http://localhost:5000/contrat/archiver/pp/${id}`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });
            setShowDeleteModal(false);
            await fetchplanning();

        } catch (error) {
            console.log("Erreur", error);
        }
    };
    const handleShowP = (id) => {
        setppIdDelete(id);
        setShowDeleteModal(true);
    };
    const handleClose = () => setShowDeleteModal(false);

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
            const filteredDocs = response.data.filter((doc) => doc.module === "eleve" && doc.code === "RPE");
            const options = filteredDocs.map((doc) => ({
                value: doc.id,
                label: doc.nom,
                modele: doc.modeleTexte
            }));
            return options
        } catch (error) {
            console.log("Erreur lors de la récupération des attestations", error);
        }
    };
    const printrecu = async (id) => {
        const selectedPlan = currentItems.find(plan => plan.id === id);
        const reponse = await handleListeDE();
        const modeleText = reponse[0].modele;

        const contrat = selectedPlan.Contrat;
        const eleve = contrat?.Eleve;
        const user = eleve?.User;
        const ecolePrincipal = user?.EcolePrincipal;

        let nomR = "", prenomR = "", emailR = "", telR = "", adresseR = "";
        const pere = eleve?.Parents?.find(p => p.typerole === "Père");
        const mere = eleve?.Parents?.find(p => p.typerole === "Mère");
        const tuteur = eleve?.Parents?.find(p => p.typerole === "Tuteur");

        let responsable = null;
        if (tuteur) {
            responsable = tuteur;
        } else if (pere && mere) {
            responsable = pere;
        } else if (pere) {
            responsable = pere;
        } else if (mere) {
            responsable = mere;
        }
        if (responsable?.User) {
            nomR = responsable.User.nom || "";
            prenomR = responsable.User.prenom || "";
            emailR = responsable.User.email || "";
            telR = responsable.User.telephone || "";
            adresseR = responsable.User.adresse || "";
        }

        if (!selectedPlan || !modeleText) {
            alert('plannig ou model du contrat non défini')
            return;
        }
        const modeleTextupdate = modeleText
            .replace(/\[nomecolePE\]/g, ecolePrincipal?.nomecole || "")
            .replace(/\[logoecoleP\]/g,
                `<img src="http://localhost:5000${ecolePrincipal?.logo}" alt="Logo de l'école" style="max-width: 70px; max-height: 70px;">`
            )
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
            //responsable
            .replace(/\[nomP\]/g, nomR || "")
            .replace(/\[prenomP\]/g, prenomR || "")
            .replace(/\[EmailP\]/g, emailR || "")
            .replace(/\[TelP\]/g, telR || "")
            .replace(/\[AdresseP\]/g, adresseR || "")
            .replace(/\[dateToday\]/g, moment().format("DD/MM/YYYY"))
            //contrat
            .replace(/\[AS\]/g, `${moment(contrat.Anneescolaire?.datedebut).format("YYYY")}/${moment(contrat.Anneescolaire?.datefin).format("YYYY")}` || "")
            .replace(/\[codeC\]/g, contrat?.code || "")
            .replace(/\[ddP\]/g, `${moment(contrat.date_debut_paiement).format("DD-MM-YYYY")}` || "")
            .replace(/\[dfP\]/g, `${moment(contrat.date_sortie).format("DD-MM-YYYY")}` || "")
            .replace(/\[dcC\]/g, `${moment(contrat.date_creation).format("DD-MM-YYYY")}` || "")

            .replace(/\[totalC\]/g, selectedPlan.montant_echeance || "")
            .replace(/\[TypeP\]/g, contrat?.typePaiment || "")
            .replace(/\[ModeP\]/g, selectedPlan?.mode_paiement || "")
            .replace(/\[detail\]/g,
                ` Frais de scolarité pour l'échéance :<br><br>
                    &nbsp;&nbsp; 
                    <small>
                    Code :${selectedPlan?.codePP}<br>
                     &nbsp;&nbsp; Date : ${selectedPlan?.date_echeance ? moment(selectedPlan?.date_echeance).format('DD/MM/YYYY') : ''}
                    </small>` || ""
            )
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
                        <title>${user?.nom}.${user?.prenom}</title>
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
        document.title = `${user?.nom}.${user?.prenom}`;
        setTimeout(() => {
            iframe.contentWindow.focus();
            iframe.contentWindow.print();
            document.title = originalTitle;
            document.body.removeChild(iframe);
        }, 1000);
    };

    const [selectedItems, setSelectedItems] = useState([]);
    const handleSelectAll = (event) => {
        if (event.target.checked) {
            setSelectedItems(currentItems.map(item => item.id));
        } else {
            setSelectedItems([]);
        }
    };

    const handleSelectItem = (id) => {
        setSelectedItems((prevSelectedItems) =>
            prevSelectedItems.includes(id)
                ? prevSelectedItems.filter(itemId => itemId !== id)
                : [...prevSelectedItems, id]
        );
    };
    const rappelOptions = [
        { value: '2', label: 'chaque  2 jours' },
        { value: '3', label: 'chaque 3 jours' },
        { value: '4', label: 'chaque 4 jours' },
        { value: '5', label: 'chaque 5 jours' },
        { value: '6', label: 'chaque 6 jours' },
        { value: '7', label: 'chaque 7 jours' },
        { value: null, label: 'Aucun Rappel' },
    ];
    useEffect(() => {
        if (SelectedRappel) {
            AppliquerRappel();
        }
    }, [SelectedRappel]);

    const AppliquerRappel = async () => {
        if (selectedItems.length === 0) {
            alert("Veuillez sélectionner au moins un paiement");
            return;
        }
        // if (!SelectedRappel) {
        //     alert("Veuillez sélectionner un délai de rappel");
        //     return;
        // }
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(
                'http://localhost:5000/contrat/ajouterRappel',
                {
                    planningIds: selectedItems,
                    delai: SelectedRappel.value // en jours
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

            if (response.status === 200) {
                alert("Rappels programmés avec succès");
                setSelectedItems([]);
                setSelectedRappel(null);
                await fetchplanning();
            }
        } catch (error) {
            console.error('Erreur lors de l\'envoi des rappels', error);
            alert("Une erreur est survenue lors de l'envoi des rappels");
        }
    };
    return (
        <>
            <div className="card-body">
                {/* {<StatsComptabilite />} */}
                <div className="filters-section mb-4 p-4 bg-light rounded">
                    <div className="row">
                        {/* Bloc Dates */}
                        <div className="col-md-3">
                            <div className="form-group mb-3">
                                <label className="font-weight-bold">Date Début</label>
                                <input
                                    type="date"
                                    className="form-control border-primary"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    style={{ height: "40px" }}
                                />
                            </div>
                            <div className="form-group">
                                <label>Niveau</label>
                                <Select
                                    options={OptionsNV} // Options de niveaux
                                    value={SelectedNV}
                                    onChange={selectedOption => handleSelectChange(selectedOption, 'niveau')}
                                    placeholder="Sélectionner un niveau"
                                />
                                {errors.niveau && <span className="text-danger">{errors.niveau}</span>}
                            </div>
                            <button className="btn btn-outline-primary" onClick={() => {
                                setFormData({
                                    annee_scolaire: '',
                                    niveau: '',
                                    eleve: '',
                                    etat_paiement: 'retardplus7',
                                });
                                setSelectedAS(null);
                                setSelectedNV(null);
                                setSelectedE(null);
                                setStartDate('');
                                setEndDate('');
                                setSelectedEcole(null);
                                setSearchTerm('');
                                applyFilters();
                            }}>
                                Réinitialiser les filtres
                            </button>
                        </div>

                        {/* Bloc Année Scolaire et Niveau */}
                        <div className="col-md-3">
                            <div className="form-group">
                                <label className="font-weight-bold">Date Fin</label>
                                <input
                                    type="date"
                                    className="form-control border-primary"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    style={{ height: "40px" }}
                                />
                            </div>

                            <div className="form-group mb-3">
                                <label>Élève</label>
                                <Select
                                    name="eleve"
                                    options={OptionsE}
                                    onChange={(selected) => handleSelectChange(selected, 'eleve')}
                                    value={SelectedE}
                                    placeholder="Sélectionnez l'élève"
                                />
                                {errors.eleve && <span className="text-danger">{errors.eleve}</span>}
                            </div>
                        </div>

                        {/* Bloc Élève */}
                        <div className="col-md-3">
                            <div className="form-group mb-3">
                                <label>Année Scolaire</label>
                                <Select
                                    name="annee_scolaire"
                                    options={OptionsAS}
                                    onChange={(selected) => handleSelectChange(selected, 'annee_scolaire')}
                                    value={SelectedAS}
                                    placeholder="Sélectionnez l'année scolaire"
                                />
                                {errors.annee_scolaire && <span className="text-danger">{errors.annee_scolaire}</span>}
                            </div>
                            <div className="form-group">
                                <label className="font-weight-bold">Recherche</label>
                                <div className="input-group">
                                    <input
                                        type="search"
                                        className="form-control"
                                        placeholder="nom,code,montant,mode"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        aria-label="Recherche"
                                        style={{ height: "40px" }}
                                    />
                                    <div className="input-group-append">
                                        <span className="input-group-text bg-white">
                                            <img src={recherche} alt="Rechercher" style={{ height: "20px", width: "20px", opacity: 0.7 }} />
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Bloc École */}
                        <div className="col-md-3 ">
                            <div className="form-group">
                                <label className="font-weight-bold">École</label>
                                <select
                                    name="ecole"
                                    className="form-control "
                                    required
                                    style={{ height: "40px" }}
                                    onChange={(e) => setSelectedEcole(e.target.value)}
                                    value={selectedEcole || ''}
                                >
                                    <option value="">Sélectionnez une école</option>
                                    {ecoles.map((item) => (
                                        <option key={item.id} value={item.id}>
                                            {item.nomecole}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group">
                                <label className="font-weight-bold">Etat paiement</label>
                                <select
                                    name="etat_paiement"
                                    className="form-control"
                                    required
                                    style={{ height: "40px" }}
                                    onChange={(e) => setFormData({ ...formData, etat_paiement: e.target.value })}
                                    value={formData.etat_paiement || ''}
                                >
                                    <option value="">Sélectionner un Etat</option>
                                    <option value="payé">Payé</option>
                                    <option value="non payé">Non Payé</option>
                                    <option value="retard">Retard (1-7 jours)</option>
                                    <option value="retardplus7">Retard (plus 7 jours)</option>
                                </select>
                            </div>

                        </div>

                    </div>
                </div>

                <div className="row ">
                    {/* <div className="col-md-12"> */}
                    <button className='btn btn-app p-1' onClick={() => handlePrint()}>
                        <img src={printIcon} alt="" width="20px" /><br />Imprimer
                    </button>
                    <button className='btn btn-app p-1' onClick={handleExport}>
                        <img src={exportIcon} alt="" width="25px" /><br />Exporter
                    </button>

                    <div className="form-group " style={{ marginLeft: 'auto' }}>
                        <div
                            className="d-flex align-items-center gap-2 p-2 rounded"
                            style={{ border: "1px solid #ced4da", backgroundColor: "#f8f9fa" }}
                        >
                            <div className="flex-grow-1">
                                <Select
                                    value={SelectedRappel}
                                    onChange={selectedOption => handleSelectChange(selectedOption, 'rappel')}
                                    options={rappelOptions}
                                    placeholder="Sélectionner un délai de rappel en jours"
                                    classNamePrefix="select"
                                    styles={{
                                        control: (base) => ({
                                            ...base,
                                            minWidth: '400px',
                                            border: "none",
                                            boxShadow: "none",
                                            backgroundColor: "transparent"
                                        }),
                                    }}
                                />
                            </div>
                            {/* <button
                                    className="btn btn-outline-secondary d-flex align-items-center justify-content-center px-3"
                                    onClick={AppliquerRappel}
                                    style={{ height: '38px' }}
                                >
                                    <small>Ajouter</small>
                                </button> */}
                        </div>
                    </div>


                    {/* </div> */}
                </div>

                <ColumnVisibilityFilter />
                <div style={{ overflowX: 'auto', overflowY: 'hidden', scrollBehavior: 'smooth' }}>
                    <table className="table table-bordered  table-hover">
                        <thead>
                            <tr>
                                <th> <input type="checkbox" onChange={(e) => handleSelectAll(e)} /></th>
                                <th>ID</th>
                                <th>Code Contrat</th>
                                <th>Niveau</th>
                                <th>Nom et Prénom</th>
                                {columnVisibility.numInsc && <th>Num Inscription</th>}
                                {columnVisibility.code && <th>Code</th>}
                                {columnVisibility.date_echeance && <th>Date Échéance</th>}
                                {columnVisibility.montant_echeance && <th>Montant Échéance</th>}
                                {columnVisibility.montant_restant && <th>Montant Restant</th>}
                                {columnVisibility.etat_paiement && <th>Etat paiement</th>}
                                {columnVisibility.date_paiement && <th>Date Paiement</th>}
                                {columnVisibility.mode_paiement && <th>Mode Paiment</th>}
                                {columnVisibility.ecole && <th>Ecole</th>}
                                {columnVisibility.dateRappel && <th>Date Rappel</th>}
                                {columnVisibility.dureRappel && <th>Durée Rappel</th>}
                                {columnVisibility.action && <th>Actions</th>}
                            </tr>
                        </thead>
                        <tbody>
                            {currentItems.map((item, index) => {
                                { console.log('rappel day ', Today); }
                                const due = moment(item.date_echeance).startOf('day');
                                const daysDiff = due.diff(Today, 'days');
                                let rowClass = '';
                                if (item.etat_paiement === 'payé') {
                                    rowClass = 'row-paid';
                                } else if (daysDiff < -7) {
                                    rowClass = 'row-overdue';
                                } else if (daysDiff < 0) {
                                    rowClass = 'row-orange';
                                } else if (daysDiff <= 7) {
                                    rowClass = 'row-soon';
                                }
                                return (
                                    <tr key={item.id} className={rowClass}>
                                        <td>
                                            <input type="checkbox" onChange={() => handleSelectItem(item.id)}
                                                checked={selectedItems.includes(item.id)}
                                            />
                                        </td>
                                        <td>{index + 1}</td>
                                        <td>
                                            {item.Contrat?.code}
                                            <br />
                                            {item.Contrat?.Anneescolaire && (
                                                <>
                                                    {moment(item.Contrat.Anneescolaire.datedebut).format('YYYY')}/
                                                    {moment(item.Contrat.Anneescolaire.datefin).format('YYYY')}
                                                </>
                                            )}
                                        </td>
                                        <td> {item.Contrat?.Niveaux?.nomniveau}<br />{item.Contrat?.Niveaux?.cycle}
                                        </td>
                                        <td>
                                            {item.Contrat?.Eleve?.User?.nom} <br />
                                            {item.Contrat?.Eleve?.User?.prenom}<br />

                                        </td>
                                        {columnVisibility.numInsc && <td> {item.Contrat?.Eleve?.numinscription}</td>}
                                        {columnVisibility.code && <td>{item.codePP}</td>}
                                        {columnVisibility.date_echeance && <td>{item.date_echeance ? moment(item.date_echeance).format('DD-MM-YYYY') : ''}</td>}
                                        {columnVisibility.montant_echeance && <td>{item.montant_echeance}</td>}
                                        {columnVisibility.montant_restant && <td>{item.montant_restant}</td>}
                                        {columnVisibility.etat_paiement && <td>{item.etat_paiement}</td>}
                                        {columnVisibility.date_paiement && <td>{item.date_paiement ? moment(item.date_paiement).format('DD-MM-YYYY') : ''}</td>}
                                        {columnVisibility.mode_paiement && <td>{item.mode_paiement}</td>}
                                        {columnVisibility.dateRappel && <td>{item?.dateRappel ? moment(item?.dateRappel).format('DD-MM-YYYY') : ''}</td>}
                                        {columnVisibility.ecole && <td>{item?.Contrat?.Eleve?.User?.Ecoles[0]?.nomecole}</td>}
                                        {columnVisibility.dureRappel && <td>{item?.dureRappel}</td>}
                                        <td style={{ display: columnVisibility.action ? 'flex' : 'none', justifyContent: 'space-around', alignItems: 'center' }}>
                                            {columnVisibility.action && (
                                                <>
                                                    {item.etat_paiement === 'payé' && (
                                                        <button
                                                            className="btn btn-outline-info action-btn"
                                                            onClick={() => printrecu(item.id)}
                                                            title="Imprimer">
                                                            <img src={print} alt="Imprimer" className="action-icon" />
                                                        </button>)}
                                                    <button
                                                        className="btn btn-outline-success action-btn"
                                                        onClick={() => ModifierP(item.id)}
                                                        title="Modifier"
                                                    >
                                                        <img src={edit} alt="Modifier" className="action-icon" />
                                                    </button>
                                                    <button
                                                        className="btn btn-outline-danger action-btn"
                                                        onClick={() => handleShowP(item.id)}
                                                        title="Archiver"
                                                    >
                                                        <img src={archive} alt="Archiver" className="action-icon" />
                                                    </button>

                                                </>
                                            )}
                                        </td>

                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>

                <Modal show={isPlanningModalOpen} onHide={handleCloseP} size="xl" centered>
                    <Modal.Header closeButton className="bg-info text-white">
                        <Modal.Title>
                            Modifier  Planning du Paiement
                        </Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                        <Form className="container-fluid">
                            <Row>
                                <Col md={3}>

                                    <Form.Group controlId="formCode">
                                        <Form.Label>Code</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="code"
                                            value={editFormData.code}
                                            onChange={handleInputChange}
                                        />

                                    </Form.Group>
                                </Col>
                                <Col md={3}>
                                    <Form.Group controlId="formDateEcheance">
                                        <Form.Label>Date Échéance</Form.Label>
                                        <Form.Control
                                            type="date"
                                            name="date_echeance"
                                            value={editFormData.date_echeance}
                                            onChange={handleInputChange}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={3}>
                                    <Form.Group controlId="formMontantEcheance">
                                        <Form.Label>Montant Échéance</Form.Label>
                                        <Form.Control
                                            type="number"
                                            name="montant_echeance"
                                            value={editFormData.montant_echeance}
                                            onChange={handleInputChange}
                                        />
                                    </Form.Group>
                                </Col>

                                <Col md={3}>
                                    <Form.Group controlId="formMontantRestant">
                                        <Form.Label>Montant Restant</Form.Label>
                                        <Form.Control
                                            type="number"
                                            name="montant_restant"
                                            value={editFormData.montant_restant}
                                            onChange={handleInputChange}
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Row>
                                <Col md={3}>
                                    <Form.Group controlId="formEtatPaiement">
                                        <Form.Label>État Paiement</Form.Label>
                                        <Form.Control
                                            as="select"  // Utiliser "as" pour un select
                                            name="etat_paiement"
                                            value={editFormData.etat_paiement}
                                            onChange={handleInputChange}
                                            style={{ height: "30px" }}
                                        >
                                            <option value="">Sélectionnez l'état du paiement</option>
                                            <option value="payé">Payé</option>
                                            <option value="non payé">Non payé</option>
                                        </Form.Control>
                                    </Form.Group>
                                </Col>

                                <Col md={3}>
                                    <Form.Group controlId="formDatePaiement">
                                        <Form.Label>Date Paiement</Form.Label>
                                        <Form.Control
                                            type="date"
                                            name="date_paiement"
                                            value={editFormData.date_paiement}
                                            onChange={handleInputChange}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={3}>
                                    <Form.Group controlId="formModePaiement">
                                        <Form.Label>Mode Paiement</Form.Label>
                                        <Form.Control
                                            as="select"
                                            name="mode_paiement"
                                            value={editFormData.mode_paiement}
                                            onChange={handleInputChange}
                                            style={{ height: "30px" }}
                                        >
                                            <option value="">Sélectionnez un mode</option>
                                            <option value="paiement en espéces">Paiement en espéces</option>
                                            <option value="virement bancaire">Virement bancaire</option>
                                            <option value="CCP">CCP</option>
                                            <option value="Chèques">Chèques</option>
                                        </Form.Control>
                                    </Form.Group>
                                </Col>
                            </Row>

                            <div className="d-flex justify-content-between mt-3">
                                <Button variant="primary" onClick={handleSaveChanges}>
                                    Enregistrer
                                </Button>
                                <Button variant="secondary">
                                    Annuler
                                </Button>
                            </div>
                        </Form>
                    </Modal.Body>

                </Modal>
                {/* arhcivage model  */}
                <Modal show={showDeleteModal} onHide={handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Confirmer la suppression</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p>Êtes-vous sûr de vouloir supprimer  ?</p>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose}>
                            Annuler
                        </Button>
                        <Button
                            variant="danger"
                            onClick={() => {
                                Archiver(ppIdDelete);
                                handleClose();
                            }}
                        >
                            Supprimer
                        </Button>
                    </Modal.Footer>
                </Modal>

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
        </>
    );
};

export default PlanningPaiement;