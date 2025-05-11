import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Select from 'react-select';
import { Modal, Button, Form, Row, Col, Alert, Table } from "react-bootstrap";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

const EmploiDuTempsV2 = () => {
    // États pour les données de base
    const [niveaux, setNiveaux] = useState([]);
    const [sections, setSections] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [periodes, setPeriodes] = useState([]);
    const [emploiDuTemps, setEmploiDuTemps] = useState([]);
    const [enseignants, setEnseignants] = useState([]);
    const [enseignantDisponibilites, setEnseignantDisponibilites] = useState({});
    // États pour les modales
    const [showPeriodModal, setShowPeriodModal] = useState(false);
    const [showMatieresModal, setShowMatieresModal] = useState(false);
    const [matieresNiveau, setMatieresNiveau] = useState([]);
    const [durees, setDurees] = useState({});
    const [ecoleId, setEcoleId] = useState(null);
    const [ecoleeId, setEcoleeId] = useState(null);
    const [cycle, setCycle] = useState(""); // Stocker le cycle
    const [cycles, setCycles] = useState([]);
    const [values, setValues] = useState({ cycle: '' });
    const filteredNiveaux = niveaux.filter(niveau => niveau.cycle === values.cycle);
    // États pour la sélection dans les modales
    const [selectedModalNiveau, setSelectedModalNiveau] = useState("");
    const [selectedModalSection, setSelectedModalSection] = useState("");

    const [selectedModalNiveaux, setSelectedModalNiveaux] = useState([]); // Notez le pluriel
    const [selectedModalSections, setSelectedModalSections] = useState([]); // Notez le pluriel

    const [loadedPeriodes, setLoadedPeriodes] = useState(null);

    const [emploiDuTempsData, setEmploiDuTempsData] = useState({});

    // Charger les emplois du temps pour une section
    const fetchEmploiDuTemps = async (sectionId) => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get(
                `http://localhost:5000/emploi-du-temps/section/${sectionId}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            // Organiser les données par jour et heure pour un accès facile
            const emploiOrganise = {};
            response.data.forEach(item => {
                if (!emploiOrganise[item.jour]) {
                    emploiOrganise[item.jour] = {};
                }
                emploiOrganise[item.jour][item.heure] = {
                    matiere: item.Matiere,
                    enseignant: item.Enseignant?.Employe?.User || null
                };
            });

            setEmploiDuTempsData(prev => ({
                ...prev,
                [sectionId]: emploiOrganise
            }));

        } catch (error) {
            console.error("Erreur lors du chargement de l'emploi du temps:", error);
        }
    };

    // Charger les emplois du temps quand une section est sélectionnée
    useEffect(() => {
        if (selectedModalSections.length > 0) {
            selectedModalSections.forEach(sectionId => {
                fetchEmploiDuTemps(sectionId);
            });
        } else {
            setEmploiDuTempsData({});
        }
    }, [selectedModalSections]);
    useEffect(() => {
        const fetchNiveauxWithSections = async () => {
            if (values.cycle) {
                try {
                    const token = localStorage.getItem("token");
                    const response = await axios.get(
                        `http://localhost:5000/niveaux/by-cycle-with-sections/${values.cycle}`,
                        { headers: { Authorization: `Bearer ${token}` } }
                    );
                    setNiveaux(response.data);
                } catch (error) {
                    setError("Erreur lors du chargement des niveaux et sections.");
                    console.error(error);
                } finally {
                    setLoading(false);
                }
            }
        };
        fetchNiveauxWithSections();
    }, [values.cycle]);
    useEffect(() => {
        const fetchPeriodesAndNiveaux = async () => {
            if (values.cycle) {
                try {
                    const token = localStorage.getItem("token");
                    const selectedCycle = cycles.find(c => c.nomCycle === values.cycle);

                    if (!selectedCycle) {
                        console.warn("Aucun cycle correspondant trouvé.");
                        return;
                    }

                    const response = await axios.get(
                        `http://localhost:5000/emploi-du-temps/periodes/${selectedCycle.id}`,
                        { headers: { Authorization: `Bearer ${token}` } }
                    );

                    console.log("Réponse reçue :", response.data);

                    // Utilisez response.data au lieu de periodes
                    if (response.data && response.data.length > 0) {
                        console.log("Périodes reçues :", response.data);
                        const newFormData = {
                            matin: { debut: '08:00', fin: '12:00', sousPeriodes: [] },
                            dejeuner: { debut: '12:00', fin: '13:00', label: 'Déjeuner' },
                            apres_midi: { debut: '13:00', fin: '16:00', sousPeriodes: [] }
                        };

                        response.data.forEach(periode => {
                            if (periode.type === 'matin') {
                                newFormData.matin = {
                                    debut: periode.heureDebut,
                                    fin: periode.heureFin,
                                    sousPeriodes: periode.sousPeriodes ? JSON.parse(periode.sousPeriodes) : []
                                };
                            } else if (periode.type === 'dejeuner') {
                                newFormData.dejeuner = {
                                    debut: periode.heureDebut,
                                    fin: periode.heureFin,
                                    label: periode.label || 'Déjeuner'
                                };
                            } else if (periode.type === 'apres_midi') {
                                newFormData.apres_midi = {
                                    debut: periode.heureDebut,
                                    fin: periode.heureFin,
                                    sousPeriodes: periode.sousPeriodes ? JSON.parse(periode.sousPeriodes) : []
                                };
                            }
                        });

                        console.log("FormData généré :", newFormData);
                        setFormData(newFormData);
                        setPeriodes(response.data); // Mettez à jour l'état periodes
                    } else {
                        console.warn("Aucune période reçue.");
                        // Initialiser avec des valeurs par défaut si aucune période n'est trouvée
                        setFormData({
                            matin: { debut: '08:00', fin: '12:00', sousPeriodes: [] },
                            dejeuner: { debut: '12:00', fin: '13:00', label: 'Déjeuner' },
                            apres_midi: { debut: '13:00', fin: '16:00', sousPeriodes: [] }
                        });
                    }
                } catch (error) {
                    console.error("Erreur lors du chargement des périodes:", error);
                    setFormData({
                        matin: { debut: '08:00', fin: '12:00', sousPeriodes: [] },
                        dejeuner: { debut: '12:00', fin: '13:00', label: 'Déjeuner' },
                        apres_midi: { debut: '13:00', fin: '16:00', sousPeriodes: [] }
                    });
                }
            }
        };
        fetchPeriodesAndNiveaux();
    }, [values.cycle, cycles]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setValues(prev => ({ ...prev, [name]: value }));
    };

    // États pour la configuration des périodes
    const [formData, setFormData] = useState({
        matin: { debut: '08:00', fin: '12:00', sousPeriodes: [] },
        dejeuner: { debut: '12:00', fin: '13:00', label: 'Déjeuner', sousPeriodes: [] },
        apres_midi: { debut: '13:00', fin: '16:00', sousPeriodes: [] }
    });

    const jours = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi'];

    const [generationStatus, setGenerationStatus] = useState({
        loading: false,
        success: null,
        message: ''
    });
    const handleGenererAuto = async () => {
        setGenerationStatus({ loading: true, success: null, message: 'Génération en cours...' });

        // Demander confirmation avant de lancer la génération
        const confirm = window.confirm(
            "Êtes-vous sûr de vouloir générer les emplois du temps pour TOUS les niveaux et sections ? " +
            "Cette opération peut prendre plusieurs minutes."
        );

        if (!confirm) {
            setGenerationStatus({ loading: false, success: null, message: '' });
            return;
        }

        try {
            const token = localStorage.getItem("token");
            let successCount = 0;
            let errorCount = 0;
            const errors = [];
            const nonPlanifiees = [];

            // Générer pour chaque niveau
            for (const niveau of niveaux) {
                // Récupérer les sections pour ce niveau
                const sectionsResponse = await axios.get(
                    `http://localhost:5000/sections/niveau/${niveau.id}`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );

                // Générer pour chaque section
                for (const section of sectionsResponse.data) {
                    try {
                        const response = await axios.post(
                            "http://localhost:5000/emploi-du-temps/generer-emploi",
                            {
                                niveauId: niveau.id,
                                sectionId: section.id
                            },
                            { headers: { Authorization: `Bearer ${token}` } }
                        );

                        if (response.data.success) {
                            successCount++;
                            if (response.data.nonPlanifiees) {
                                nonPlanifiees.push({
                                    niveau: niveau.nomniveau,
                                    section: `${section.classe} (${section.classearab})`,
                                    matieres: response.data.nonPlanifiees
                                });
                            }
                        } else {
                            errorCount++;
                            errors.push({
                                niveau: niveau.nomniveau,
                                section: `${section.classe} (${section.classearab})`,
                                error: response.data.message || 'Erreur inconnue'
                            });
                        }
                    } catch (error) {
                        errorCount++;
                        errors.push({
                            niveau: niveau.nomniveau,
                            section: `${section.classe} (${section.classearab})`,
                            error: error.response?.data?.message || error.message
                        });
                    }
                }
            }

            // Afficher le résultat
            let message = `Génération terminée: ${successCount} emplois générés avec succès`;
            if (errorCount > 0) {
                message += `, ${errorCount} erreurs`;
            }

            setGenerationStatus({
                loading: false,
                success: errorCount === 0,
                message: message
            });

            // Afficher les matières non planifiées
            if (nonPlanifiees.length > 0) {
                const nonPlanifieesMessage = nonPlanifiees.map(np =>
                    `Niveau ${np.niveau}, Section ${np.section}:\n` +
                    np.matieres.map(m => `- ${m.nom} (manque ${m.manque} minutes)`).join('\n')
                ).join('\n\n');

                alert(`Génération terminée avec des matières non planifiées:\n\n${nonPlanifieesMessage}`);
            }

            // Afficher les erreurs si nécessaire
            if (errors.length > 0) {
                console.error("Erreurs lors de la génération:", errors);
            }

        } catch (error) {
            console.error("Erreur globale de génération:", error);
            setGenerationStatus({
                loading: false,
                success: false,
                message: error.response?.data?.message || 'Erreur lors de la communication avec le serveur'
            });
        }
    };
    // Charger les niveaux au montage
    useEffect(() => {
        const fetchNiveaux = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await axios.get("http://localhost:5000/niveaux", {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setNiveaux(response.data);
            } catch (error) {
                setError("Erreur lors du chargement des niveaux.");
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchNiveaux();
    }, []);




    // Charger les matières quand une section est sélectionnée dans la modale
    const handleLoadMatieres = async () => {
        if (selectedModalNiveaux.length === 0 || selectedModalSections.length === 0) {
            alert("Veuillez sélectionner au moins un niveau et une section");
            return;
        }

        try {
            const token = localStorage.getItem("token");
            // On prend le premier niveau et la première section sélectionnés pour l'exemple
            const response = await axios.get(
                `http://localhost:5000/niveaux/${selectedModalNiveaux[0]}/matieres`,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setMatieresNiveau(response.data);

            // Initialiser les configurations
            const initialConfigurations = {};
            response.data.forEach(item => {
                initialConfigurations[item.id] = {
                    duree: item.duree || '',
                    dureeseance: item.dureeseance || '',
                    nombreseanceparjour: item.nombreseanceparjour || '',
                    preference: item.preference || ''
                };
            });
            setDurees(initialConfigurations);
        } catch (error) {
            console.error("Erreur lors du chargement des matières:", error);
            alert("Erreur lors du chargement des matières");
        }
    };


    // Gestion des périodes
    const handleTimeChange = (periode, field, value) => {
        setFormData(prev => ({
            ...prev,
            [periode]: {
                ...prev[periode],
                [field]: value
            }
        }));
    };

    const handleDejeunerLabelChange = (value) => {
        setFormData(prev => ({
            ...prev,
            dejeuner: {
                ...prev.dejeuner,
                label: value
            }
        }));
    };

    const handleAddSubPeriod = (periode) => {
        setFormData(prev => ({
            ...prev,
            [periode]: {
                ...prev[periode],
                sousPeriodes: [
                    ...prev[periode].sousPeriodes,
                    { debut: '', fin: '', label: '' }
                ]
            }
        }));
    };

    const handleSubPeriodChange = (periode, index, field, value) => {
        setFormData(prev => {
            const newSubPeriods = [...prev[periode].sousPeriodes];
            newSubPeriods[index][field] = value;

            return {
                ...prev,
                [periode]: {
                    ...prev[periode],
                    sousPeriodes: newSubPeriods
                }
            };
        });
    };

    const handleRemoveSubPeriod = (periode, index) => {
        setFormData(prev => {
            const newSubPeriods = [...prev[periode].sousPeriodes];
            newSubPeriods.splice(index, 1);

            return {
                ...prev,
                [periode]: {
                    ...prev[periode],
                    sousPeriodes: newSubPeriods
                }
            };
        });
    };

    // Sauvegarder les périodes
    const handleSavePeriodes = async () => {
        if (!values.cycle || values.cycle === "") {
            alert("Veuillez sélectionner un cycle scolaire.");
            return;
        }

        try {
            const token = localStorage.getItem("token");

            const selectedCycle = cycles.find(c => c.nomCycle === values.cycle);
            if (!selectedCycle) {
                alert("Cycle invalide.");
                return;
            }

            const periodesToSave = [
                {
                    type: 'matin',
                    heureDebut: formData.matin.debut,
                    heureFin: formData.matin.fin,
                    sousPeriodes: formData.matin.sousPeriodes
                },
                {
                    type: 'dejeuner',
                    heureDebut: formData.dejeuner.debut,
                    heureFin: formData.dejeuner.fin,
                    label: formData.dejeuner.label,
                    sousPeriodes: []
                },
                {
                    type: 'apres_midi',
                    heureDebut: formData.apres_midi.debut,
                    heureFin: formData.apres_midi.fin,
                    sousPeriodes: formData.apres_midi.sousPeriodes
                }
            ];

            await axios.post(
                'http://localhost:5000/periodes',
                {
                    cycleId: selectedCycle.id,
                    periodes: periodesToSave
                },
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            alert('Périodes enregistrées avec succès !');
            setShowPeriodModal(false);
        } catch (error) {
            console.error("Erreur lors de l'enregistrement:", error);
            alert(`Erreur: ${error.response?.data?.message || error.message}`);
        }
    };


    // Générer les heures basées sur les périodes configurées
    // Modifiez la fonction generateHeures pour mieux gérer les sous-périodes
    const formatTime = (timeString) => {
        if (!timeString) return '';
        // Si le temps est déjà au format HH:MM, retournez-le tel quel
        if (timeString.length === 5) return timeString;
        // Sinon, convertissez HH:MM:SS en HH:MM
        return timeString.substring(0, 5);
    };

    // Utilisez cette fonction pour formater les heures dans generateHeures()
    const generateHeures = () => {
        let heures = [];

        // Matin
        if (formData.matin.sousPeriodes?.length > 0) {
            formData.matin.sousPeriodes.forEach(sp => {
                heures.push({
                    plage: `${formatTime(sp.debut)}-${formatTime(sp.fin)}`,
                    label: sp.label || '',
                    type: 'matin'
                });
            });
        } else if (formData.matin.debut && formData.matin.fin) {
            heures.push({
                plage: `${formatTime(formData.matin.debut)}-${formatTime(formData.matin.fin)}`,
                label: '',
                type: 'matin'
            });
        }

        // Déjeuner
        if (formData.dejeuner.debut && formData.dejeuner.fin) {
            heures.push({
                plage: `${formatTime(formData.dejeuner.debut)}-${formatTime(formData.dejeuner.fin)}`,
                label: formData.dejeuner.label || 'Déjeuner',
                type: 'dejeuner'
            });
        }

        // Après-midi
        if (formData.apres_midi.sousPeriodes?.length > 0) {
            formData.apres_midi.sousPeriodes.forEach(sp => {
                heures.push({
                    plage: `${formatTime(sp.debut)}-${formatTime(sp.fin)}`,
                    label: sp.label || '',
                    type: 'apres_midi'
                });
            });
        } else if (formData.apres_midi.debut && formData.apres_midi.fin) {
            heures.push({
                plage: `${formatTime(formData.apres_midi.debut)}-${formatTime(formData.apres_midi.fin)}`,
                label: '',
                type: 'apres_midi'
            });
        }

        return heures;
    };

    // Ajoutez un useEffect pour suivre les changements de formData
    useEffect(() => {
        console.log("FormData mis à jour:", formData);
        // Cela vous aidera à déboguer et voir si les périodes sont bien mises à jour
    }, [formData]);

    useEffect(() => {
        if (selectedModalNiveau) {
            const fetchSections = async () => {
                try {
                    const token = localStorage.getItem("token");
                    const response = await axios.get(
                        `http://localhost:5000/sections/niveau/${selectedModalNiveau}`,
                        { headers: { Authorization: `Bearer ${token}` } }
                    );
                    setSections(response.data);
                } catch (error) {
                    console.error("Erreur lors du chargement des sections:", error);
                }
            };

            fetchSections();
        } else {
            setSections([]);
            setSelectedModalSection("");
        }
    }, [selectedModalNiveau]);

    // Charger les matières quand une section est sélectionnée dans la modale
    useEffect(() => {
        if (selectedModalNiveau && selectedModalSection) {
            const fetchMatieres = async () => {
                try {
                    const token = localStorage.getItem("token");
                    const response = await axios.get(
                        `http://localhost:5000/niveaux/${selectedModalNiveau}/matieres`,
                        { headers: { Authorization: `Bearer ${token}` } }
                    );

                    setMatieresNiveau(response.data);

                    // Initialiser les configurations
                    const initialConfigurations = {};
                    response.data.forEach(item => {
                        initialConfigurations[item.id] = {
                            duree: item.duree || '',
                            dureeseance: item.dureeseance || '',
                            nombreseanceparjour: item.nombreseanceparjour || '',
                            preference: item.preference || ''
                        };
                    });
                    setDurees(initialConfigurations);
                } catch (error) {
                    console.error("Erreur lors du chargement des matières:", error);
                }
            };

            fetchMatieres();
        } else {
            setMatieresNiveau([]);
            setDurees({});
        }
    }, [selectedModalNiveau, selectedModalSection]);

    // Gestion de la sélection du niveau dans la modale
    const handleNiveauSelectChange = (e) => {
        const options = e.target.options;
        const selectedValues = [];
        for (let i = 0; i < options.length; i++) {
            if (options[i].selected) {
                selectedValues.push(options[i].value);
            }
        }
        setSelectedModalNiveaux(selectedValues);
        setSelectedModalSections([]); // Réinitialiser les sections quand les niveaux changent
    };

    const handleSectionSelectChange = (e) => {
        const options = e.target.options;
        const selectedValues = [];
        for (let i = 0; i < options.length; i++) {
            if (options[i].selected) {
                selectedValues.push(options[i].value);
            }
        }
        setSelectedModalSections(selectedValues);
    };
    useEffect(() => {
        if (selectedModalNiveaux.length > 0) {
            const fetchSections = async () => {
                try {
                    const token = localStorage.getItem("token");
                    const allSections = [];

                    for (const niveauId of selectedModalNiveaux) {
                        const response = await axios.get(
                            `http://localhost:5000/sections/niveau/${niveauId}`,
                            { headers: { Authorization: `Bearer ${token}` } }
                        );
                        allSections.push(...response.data);
                    }

                    setSections(allSections);
                } catch (error) {
                    console.error("Erreur lors du chargement des sections:", error);
                }
            };

            fetchSections();
        } else {
            setSections([]);
            setSelectedModalSections([]);
        }
    }, [selectedModalNiveaux]);
    // Ouvrir la modale des périodes
    const handleOpenPeriodModal = () => {
        setSelectedModalNiveau("");
        setSelectedModalSection("");
        setShowPeriodModal(true);
    };

    // Ouvrir la modale des matières
    const handleOpenMatieresModal = () => {
        setSelectedModalNiveau("");
        setSelectedModalSection("");
        setShowMatieresModal(true);
    };

    // Gestion des changements dans le formulaire des matières
    const handleFieldChange = (id, field, value) => {
        setDurees(prev => ({
            ...prev,
            [id]: {
                ...prev[id],
                [field]: value
            }
        }));
    };

    // Sauvegarder les configurations des matières
    const handleSaveConfigurations = async () => {
        try {
            const token = localStorage.getItem("token");
            const updates = Object.entries(durees).map(([id, config]) => ({
                id,
                duree: config.duree ? parseInt(config.duree) : null,
                dureeseance: config.dureeseance ? parseInt(config.dureeseance) : null,
                nombreseanceparjour: config.nombreseanceparjour ? parseInt(config.nombreseanceparjour) : null,
                preference: config.preference || null
            }));

            // Envoyer les mises à jour
            for (const update of updates) {
                await axios.put(
                    `http://localhost:5000/niveaux/niveau-matiere/${update.id}`,
                    {
                        duree: update.duree,
                        dureeseance: update.dureeseance,
                        nombreseanceparjour: update.nombreseanceparjour,
                        preference: update.preference
                    },
                    { headers: { Authorization: `Bearer ${token}` } }
                );
            }

            alert("Configurations enregistrées avec succès!");
            setShowMatieresModal(false);
        } catch (error) {
            console.error("Erreur lors de l'enregistrement:", error);
            alert(`Erreur: ${error.response?.data?.message || error.message}`);
        }
    };
    useEffect(() => {
        if (values.cycle && filteredNiveaux.length > 0) {
            filteredNiveaux.forEach(niveau => {
                if (niveau.Sections && niveau.Sections.length > 0) {
                    niveau.Sections.forEach(section => {
                        fetchEmploiDuTemps(section.id);
                    });
                }
            });
        }
    }, [values.cycle, filteredNiveaux]);


    const exportToPDF = () => {
        if (!values.cycle) return;

        const doc = new jsPDF({
            orientation: 'landscape'
        });

        const title = `Emploi du temps - Cycle ${values.cycle}`;

        // Document title
        doc.setFontSize(16);
        doc.setFont('helvetica', 'bold');
        doc.text(title, 14, 15);

        // Prepare table data
        const heures = generateHeures();
        const headers = ['Heures/Jours', ...jours];

        const data = heures.map(heure => {
            const row = [heure.plage + (heure.label ? `\n${heure.label}` : '')];

            jours.forEach(jour => {
                if (heure.type === 'dejeuner') {
                    row.push({
                        content: heure.label,
                        styles: { fillColor: [255, 242, 204], textColor: [0, 0, 0] } // Light yellow
                    });
                } else {
                    // Collect all sections data for this time slot
                    let cellContent = [];

                    filteredNiveaux.forEach(niveau => {
                        niveau.Sections?.forEach(section => {
                            const sectionData = emploiDuTempsData[section.id] || {};
                            const jourData = sectionData[jour] || {};
                            const cours = jourData[heure.plage];

                            if (cours) {
                                const matiere = cours.matiere?.nom || cours.Matiere?.nom || 'Matière inconnue';
                                const enseignant = cours.enseignant
                                    ? `${cours.enseignant.nom} ${cours.enseignant.prenom}`
                                    : cours.Enseignant?.Employe?.User
                                        ? `${cours.Enseignant.Employe.User.nom} ${cours.Enseignant.Employe.User.prenom}`
                                        : 'Enseignant non assigné';

                                cellContent.push(`${section.classe}: ${matiere} (${enseignant})`);
                            }
                        });
                    });

                    if (cellContent.length > 0) {
                        row.push({
                            content: cellContent.join('\n'),
                            styles: { fillColor: [226, 239, 218], textColor: [0, 0, 0] } // Light green
                        });
                    } else {
                        row.push({
                            content: '-',
                            styles: { fillColor: [255, 255, 255], textColor: [0, 0, 0] }
                        });
                    }
                }
            });

            return row;
        });

        // Generate table
        autoTable(doc, {
            head: [headers.map(header => ({
                content: header,
                styles: {
                    fillColor: [68, 114, 196], // Blue
                    textColor: [255, 255, 255], // White
                    fontStyle: 'bold'
                }
            }))],
            body: data,
            startY: 25,
            styles: {
                fontSize: 8,
                cellPadding: 2,
                valign: 'middle',
                halign: 'center'
            },
            columnStyles: {
                0: {
                    cellWidth: 25,
                    fillColor: [217, 225, 242], // Very light blue
                    fontStyle: 'bold'
                }
            },
            didDrawPage: (data) => {
                // Footer
                doc.setFontSize(10);
                doc.setTextColor(150);
                doc.text('Généré le ' + new Date().toLocaleDateString(), data.settings.margin.left, doc.internal.pageSize.height - 10);
            }
        });

        doc.save(`EmploiDuTemps_Cycle_${values.cycle}.pdf`);
    };

    const exportToExcel = async () => {
        if (!values.cycle) return;

        const title = `Emploi du temps - Cycle ${values.cycle}`;
        const heures = generateHeures();

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("Emploi du temps");

        const joursRow = ['Heures/Jours', ...jours];

        // Merged title
        worksheet.mergeCells(1, 1, 1, jours.length + 1);
        const titleCell = worksheet.getCell('A1');
        titleCell.value = title;
        titleCell.font = { bold: true, size: 16 };
        titleCell.alignment = { horizontal: 'center' };
        titleCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'D9E1F2' } };

        // Header row
        const headerRow = worksheet.addRow(joursRow);
        headerRow.eachCell((cell) => {
            cell.font = { bold: true, color: { argb: 'FFFFFF' } };
            cell.alignment = { horizontal: 'center' };
            cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '4472C4' } };
        });

        // Add data rows
        heures.forEach((heure) => {
            const row = [];
            row.push(heure.plage + (heure.label ? ` (${heure.label})` : ''));

            jours.forEach((jour) => {
                if (heure.type === 'dejeuner') {
                    row.push(heure.label);
                } else {
                    // Collect all sections data for this time slot
                    let cellContent = [];

                    filteredNiveaux.forEach(niveau => {
                        niveau.Sections?.forEach(section => {
                            const sectionData = emploiDuTempsData[section.id] || {};
                            const jourData = sectionData[jour] || {};
                            const cours = jourData[heure.plage];

                            if (cours) {
                                const matiere = cours.matiere?.nom || cours.Matiere?.nom || 'Matière inconnue';
                                const enseignant = cours.enseignant
                                    ? `${cours.enseignant.nom} ${cours.enseignant.prenom}`
                                    : cours.Enseignant?.Employe?.User
                                        ? `${cours.Enseignant.Employe.User.nom} ${cours.Enseignant.Employe.User.prenom}`
                                        : 'Enseignant non assigné';

                                cellContent.push(`${section.classe}: ${matiere} (${enseignant})`);
                            }
                        });
                    });

                    row.push(cellContent.length > 0 ? cellContent.join('\n') : '-');
                }
            });

            const addedRow = worksheet.addRow(row);
            addedRow.eachCell((cell, colNumber) => {
                cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };

                if (colNumber === 1) {
                    // First column: hours
                    cell.font = { bold: true };
                    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'D9E1F2' } };
                } else if (heure.type === 'dejeuner') {
                    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF2CC' } };
                } else {
                    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'E2EFDA' } };
                }
            });
        });

        // Adjust columns
        worksheet.columns.forEach(column => {
            column.width = 25;
        });

        // Generate and download file
        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        saveAs(blob, `EmploiDuTemps_Cycle_${values.cycle}.xlsx`);
    };

    useEffect(() => {
        const fetchCycle = async () => {
            const token = localStorage.getItem("token");
            if (!token) {
                console.error("❌ Aucun token trouvé !");
                return;
            }

            try {
                if (ecoleeId && ecoleeId !== "null" && ecoleeId !== "undefined") {
                    // Récupérer le cycle spécifique à ecoleeId
                    console.log(`🔍 Récupération du cycle pour l'ecoleeId: ${ecoleeId}`);
                    const response = await axios.get(`http://localhost:5000/ecoles/${ecoleeId}`, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });

                    console.log("✅ Cycle récupéré :", response.data.cycle);
                    setCycle(response.data.cycle); // Mettre à jour le cycle spécifique
                    setCycles([{ id: ecoleeId, nomCycle: response.data.cycle }]); // Ajouter le cycle spécifique à la liste des cycles
                } else {
                    // Récupérer tous les cycles disponibles
                    console.log("🔍 Récupération de tous les cycles");
                    const response = await axios.get('http://localhost:5000/cyclescolaires', {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });

                    console.log("✅ Tous les cycles récupérés :", response.data);
                    setCycles(response.data); // Mettre à jour la liste des cycles
                }
            } catch (error) {
                console.error("❌ Erreur lors de la récupération des cycles :", error);
            }
        };

        fetchCycle();
    }, [ecoleeId]); // Dépendance pour exécuter lorsque ecoleeId change
    useEffect(() => {
        if (cycle) {
            setValues((prevValues) => ({
                ...prevValues,
                cycle: cycle,
            }));
        }
    }, [cycle]);

    

    // if (loading) return <div className="d-flex justify-content-center mt-5"><div className="spinner-border" role="status"></div></div>;
    // if (error) return <Alert variant="danger" className="mt-3">{error}</Alert>;

    return (
        <div className="container-fluid py-3">
            <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                    <li className="breadcrumb-item"><Link to="/dashboard">Dashboard</Link></li>
                    <li className="breadcrumb-item active">Emploi du temps V2</li>
                </ol>
            </nav>

            <div className="card shadow">
                <div className="card-header bg-primary text-white">
                    <h3 className="card-title mb-0">
                        <i className="fas fa-calendar-alt mr-2"></i>
                        Gestion des emplois du temps
                    </h3>
                </div>
                <div className='col-md-6'>
                    <label htmlFor="cycleId" className="form-label">Cycle Scolaire</label>
                    <select
                        className="form-control"
                        name="cycle"
                        value={values.cycle}
                        onChange={handleChange}
                        style={{ height: '50px', borderRadius: '8px', backgroundColor: '#F8F8F8' }}
                        required
                    >
                        <option value="">Sélectionner un cycle</option>
                        {cycles.map((cycleItem) => (
                            <option key={cycleItem.id} value={cycleItem.nomCycle}>
                                {cycleItem.nomCycle}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="card-body">
                    <div className="d-flex justify-content-end mb-4 gap-2">
                        <Button
                            variant="success"
                            onClick={exportToExcel}
                            className="ml-2"
                            disabled={!values.cycle}
                        >
                            <i className="fas fa-file-excel mr-2"></i>
                            Excel
                        </Button>
                        <Button
                            variant="danger"
                            onClick={exportToPDF}
                            className="ml-2"
                            disabled={!values.cycle}
                        >
                            <i className="fas fa-file-pdf mr-2"></i>
                            PDF
                        </Button>
                        <button
                            className="btn btn-warning ml-2"
                            onClick={handleGenererAuto}
                            disabled={generationStatus.loading || !values.cycle}
                        >
                            {generationStatus.loading ? (
                                <>
                                    <span className="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true"></span>
                                    Génération en cours...
                                </>
                            ) : (
                                <>
                                    <i className="fas fa-magic mr-2"></i>
                                    Générer automatiquement (tous les niveaux)
                                </>
                            )}
                        </button>
                        <Button variant="info" onClick={handleOpenMatieresModal} className="ml-2" disabled={!values.cycle}>
                            <i className="fas fa-book mr-2"></i>
                            Durée des matières
                        </Button>
                        <Button variant="info" onClick={handleOpenPeriodModal} className="ml-2" disabled={!values.cycle}>
                            <i className="fas fa-clock mr-2"></i>
                            Configurer les périodes
                        </Button>
                    </div>

                    {/* Tableau principal - Conditionné par la sélection d'un cycle */}
                    {values.cycle ? (
                        <div className="table-responsive">
                            <Table bordered hover>
                                <thead>
                                    <tr>
                                        <th rowSpan="2" className="align-middle">Niveau</th>
                                        <th rowSpan="2" className="align-middle">Section</th>
                                        {jours.map(jour => {
                                            const heuresJour = generateHeures();
                                            return (
                                                <th key={jour} colSpan={heuresJour.length} className="text-center">
                                                    {jour}
                                                    {/* Afficher un indicateur si aucune période n'est définie */}
                                                    {heuresJour.length === 0 && (
                                                        <div className="text-danger small">(Aucune période configurée)</div>
                                                    )}
                                                </th>
                                            );
                                        })}
                                    </tr>
                                    <tr>
                                        {jours.flatMap(jour => {
                                            const heuresJour = generateHeures();
                                            return heuresJour.length > 0 ? (
                                                heuresJour.map(heure => (
                                                    <th key={`${jour}-${heure.plage}`} className="text-center small">
                                                        <div>{heure.plage}</div>
                                                        {heure.label && <div className="text-muted">{heure.label}</div>}
                                                    </th>
                                                ))
                                            ) : (
                                                <th key={`${jour}-empty`} className="text-center small text-muted">
                                                    —
                                                </th>
                                            );
                                        })}
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredNiveaux.length > 0 ? (
                                        filteredNiveaux.map(niveau => {
                                            const sections = niveau.Sections || [];
                                            return sections.length > 0 ? sections.map((section, index) => (
                                                <tr key={section.id}>
                                                    {index === 0 && (
                                                        <td rowSpan={sections.length} className="align-middle font-weight-bold">
                                                            {niveau.nomniveau}
                                                        </td>
                                                    )}
                                                    <td className="align-middle">
                                                        {section.classe} {section.classearab && `(${section.classearab})`}
                                                    </td>
                                                    {jours.flatMap(jour => {
                                                        const heuresJour = generateHeures();
                                                        return heuresJour.length > 0 ? (
                                                            heuresJour.map(heure => {
                                                                const emploi = emploiDuTempsData[section.id]?.[jour]?.[heure.plage];
                                                                return (
                                                                    <td key={`${section.id}-${jour}-${heure.plage}`} className="align-middle">
                                                                        {emploi ? (
                                                                            <div className="p-2 bg-light rounded">
                                                                                <div className="text-primary">
                                                                                    {emploi.matiere.nom}
                                                                                    {emploi.matiere.nomarabe && (
                                                                                        <div className="small text-muted">{emploi.matiere.nomarabe}</div>
                                                                                    )}
                                                                                </div>
                                                                                {emploi.enseignant && (
                                                                                    <div className="text-secondary small">
                                                                                        {emploi.enseignant.nom} {emploi.enseignant.prenom}
                                                                                    </div>
                                                                                )}
                                                                            </div>
                                                                        ) : (
                                                                            <div className="p-2 bg-light rounded text-muted">—</div>
                                                                        )}
                                                                    </td>
                                                                );
                                                            })
                                                        ) : (
                                                            <td key={`${section.id}-${jour}-empty`} className="text-center small text-muted">
                                                                —
                                                            </td>
                                                        );
                                                    })}
                                                </tr>
                                            )) : (
                                                <tr key={`niveau-${niveau.id}`}>
                                                    <td className="align-middle font-weight-bold">{niveau.nomniveau}</td>
                                                    <td colSpan={1 + jours.length * generateHeures().length} className="text-center text-muted">
                                                        Aucune section disponible
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    ) : (
                                        <tr>
                                            <td colSpan={2 + jours.length * generateHeures().length} className="text-center text-muted">
                                                Aucun niveau disponible pour ce cycle
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </Table>
                        </div>
                    ) : (
                        <div className="alert alert-info text-center">
                            <i className="fas fa-info-circle mr-2"></i>
                            Veuillez sélectionner un cycle scolaire pour afficher l'emploi du temps
                        </div>
                    )}
                </div>
            </div>

            {/* Modal Configuration Périodes */}
            <Modal show={showPeriodModal} onHide={() => setShowPeriodModal(false)} size="xl">
                <Modal.Header closeButton className="bg-primary text-white">
                    <Modal.Title><i className="fas fa-clock mr-2"></i>Configuration des périodes</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Row className="mb-4">
                        <Row className="mb-4">
                            <Col md={6}>
                                <label htmlFor="cycleId" className="form-label">Cycle Scolaire</label>
                                <select
                                    className="form-control"
                                    name="cycle"
                                    value={values.cycle}
                                    onChange={handleChange}
                                    style={{ height: '50px', borderRadius: '8px', backgroundColor: '#F8F8F8' }}
                                    required
                                >
                                    <option value="">Sélectionner un cycle</option>
                                    {cycles.map((cycleItem) => (
                                        <option key={cycleItem.id} value={cycleItem.nomCycle}>
                                            {cycleItem.nomCycle}
                                        </option>
                                    ))}
                                </select>
                            </Col>

                        </Row>
                    </Row>

                    <div className="border-top pt-3">
                        {/* Contenu de configuration des périodes identique à la première version */}
                        <Form>
                            <div className="mb-4 p-3 border rounded">
                                <h5 className="mb-3">
                                    <i className="fas fa-sun mr-2 text-warning"></i>
                                    Période du matin
                                </h5>
                                <Row className="mb-3">
                                    <Col md={5}>
                                        <Form.Label>Heure de début</Form.Label>
                                        <Form.Control
                                            type="time"
                                            value={formData.matin.debut}
                                            onChange={(e) => handleTimeChange('matin', 'debut', e.target.value)}
                                        />
                                    </Col>
                                    <Col md={5}>
                                        <Form.Label>Heure de fin</Form.Label>
                                        <Form.Control
                                            type="time"
                                            value={formData.matin.fin}
                                            onChange={(e) => handleTimeChange('matin', 'fin', e.target.value)}
                                        />
                                    </Col>
                                </Row>

                                <h6 className="mt-4 mb-3">
                                    <i className="fas fa-list-ul mr-2"></i>
                                    Sous-périodes
                                </h6>
                                {formData.matin.sousPeriodes.length === 0 && (
                                    <Alert variant="info" className="small">
                                        Aucune sous-période définie. La plage globale sera utilisée.
                                    </Alert>
                                )}
                                {formData.matin.sousPeriodes.map((sp, index) => (
                                    <Row key={`matin-${index}`} className="mb-3 align-items-center">
                                        <Col md={3}>
                                            <Form.Control
                                                type="time"
                                                value={sp.debut}
                                                onChange={(e) => handleSubPeriodChange('matin', index, 'debut', e.target.value)}
                                                placeholder="Début"
                                            />
                                        </Col>
                                        <Col md={3}>
                                            <Form.Control
                                                type="time"
                                                value={sp.fin}
                                                onChange={(e) => handleSubPeriodChange('matin', index, 'fin', e.target.value)}
                                                placeholder="Fin"
                                            />
                                        </Col>
                                        <Col md={4}>
                                            <Form.Control
                                                type="text"
                                                value={sp.label}
                                                onChange={(e) => handleSubPeriodChange('matin', index, 'label', e.target.value)}
                                                placeholder="Libellé (ex: Cours, Récréation...)"
                                            />
                                        </Col>
                                        <Col md={2} className="text-center">
                                            <Button
                                                variant="outline-danger"
                                                size="sm"
                                                onClick={() => handleRemoveSubPeriod('matin', index)}
                                            >
                                                <i className="fas fa-trash"></i>
                                            </Button>
                                        </Col>
                                    </Row>
                                ))}
                                <Button
                                    variant="outline-primary"
                                    size="sm"
                                    onClick={() => handleAddSubPeriod('matin')}
                                    className="mt-2"
                                >
                                    <i className="fas fa-plus mr-2"></i>
                                    Ajouter une sous-période
                                </Button>
                            </div>

                            {/* Configuration déjeuner */}
                            <div className="mb-4 p-3 border rounded bg-light">
                                <h5 className="mb-3">
                                    <i className="fas fa-utensils mr-2 text-success"></i>
                                    Pause déjeuner
                                </h5>
                                <Row className="mb-3">
                                    <Col md={5}>
                                        <Form.Label>Heure de début</Form.Label>
                                        <Form.Control
                                            type="time"
                                            value={formData.dejeuner.debut}
                                            onChange={(e) => handleTimeChange('dejeuner', 'debut', e.target.value)}
                                        />
                                    </Col>
                                    <Col md={5}>
                                        <Form.Label>Heure de fin</Form.Label>
                                        <Form.Control
                                            type="time"
                                            value={formData.dejeuner.fin}
                                            onChange={(e) => handleTimeChange('dejeuner', 'fin', e.target.value)}
                                        />
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md={10}>
                                        <Form.Label>Libellé à afficher</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={formData.dejeuner.label}
                                            onChange={(e) => handleDejeunerLabelChange(e.target.value)}
                                            placeholder="Libellé (ex: Déjeuner, Pause...)"
                                        />
                                    </Col>
                                </Row>
                            </div>

                            {/* Configuration après-midi */}
                            <div className="p-3 border rounded">
                                <h5 className="mb-3">
                                    <i className="fas fa-moon mr-2 text-info"></i>
                                    Période de l'après-midi
                                </h5>
                                <Row className="mb-3">
                                    <Col md={5}>
                                        <Form.Label>Heure de début</Form.Label>
                                        <Form.Control
                                            type="time"
                                            value={formData.apres_midi.debut}
                                            onChange={(e) => handleTimeChange('apres_midi', 'debut', e.target.value)}
                                        />
                                    </Col>
                                    <Col md={5}>
                                        <Form.Label>Heure de fin</Form.Label>
                                        <Form.Control
                                            type="time"
                                            value={formData.apres_midi.fin}
                                            onChange={(e) => handleTimeChange('apres_midi', 'fin', e.target.value)}
                                        />
                                    </Col>
                                </Row>

                                <h6 className="mt-4 mb-3">
                                    <i className="fas fa-list-ul mr-2"></i>
                                    Sous-périodes
                                </h6>
                                {formData.apres_midi.sousPeriodes.length === 0 && (
                                    <Alert variant="info" className="small">
                                        Aucune sous-période définie. La plage globale sera utilisée.
                                    </Alert>
                                )}
                                {formData.apres_midi.sousPeriodes.map((sp, index) => (
                                    <Row key={`apres_midi-${index}`} className="mb-3 align-items-center">
                                        <Col md={3}>
                                            <Form.Control
                                                type="time"
                                                value={sp.debut}
                                                onChange={(e) => handleSubPeriodChange('apres_midi', index, 'debut', e.target.value)}
                                                placeholder="Début"
                                            />
                                        </Col>
                                        <Col md={3}>
                                            <Form.Control
                                                type="time"
                                                value={sp.fin}
                                                onChange={(e) => handleSubPeriodChange('apres_midi', index, 'fin', e.target.value)}
                                                placeholder="Fin"
                                            />
                                        </Col>
                                        <Col md={4}>
                                            <Form.Control
                                                type="text"
                                                value={sp.label}
                                                onChange={(e) => handleSubPeriodChange('apres_midi', index, 'label', e.target.value)}
                                                placeholder="Libellé (ex: Cours, Récréation...)"
                                            />
                                        </Col>
                                        <Col md={2} className="text-center">
                                            <Button
                                                variant="outline-danger"
                                                size="sm"
                                                onClick={() => handleRemoveSubPeriod('apres_midi', index)}
                                            >
                                                <i className="fas fa-trash"></i>
                                            </Button>
                                        </Col>
                                    </Row>
                                ))}
                                <Button
                                    variant="outline-primary"
                                    size="sm"
                                    onClick={() => handleAddSubPeriod('apres_midi')}
                                    className="mt-2"
                                >
                                    <i className="fas fa-plus mr-2"></i>
                                    Ajouter une sous-période
                                </Button>
                            </div>
                        </Form>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowPeriodModal(false)}>
                        Annuler
                    </Button>
                    <Button variant="primary" onClick={handleSavePeriodes}>
                        Enregistrer
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Modal Configuration Matières */}
            <Modal show={showMatieresModal} onHide={() => setShowMatieresModal(false)} size="xl">
                <Modal.Header closeButton className="bg-primary text-white">
                    <Modal.Title><i className="fas fa-book mr-2"></i>Configuration des matières</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Row className="mb-4">
                        <Col md={6}>
                            <Form.Group>
                                <Form.Label>Sélectionnez un niveau :</Form.Label>
                                <Form.Control
                                    as="select"
                                    value={selectedModalNiveau}
                                    onChange={(e) => setSelectedModalNiveau(e.target.value)}
                                    className="form-select"
                                >
                                    <option value="">Sélectionner un niveau</option>
                                    {niveaux.map(niveau => (
                                        <option key={niveau.id} value={niveau.id}>
                                            {niveau.nomniveau}
                                        </option>
                                    ))}
                                </Form.Control>
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group>
                                <Form.Label>Sélectionnez une section :</Form.Label>
                                <Form.Control
                                    as="select"
                                    value={selectedModalSection}
                                    onChange={(e) => setSelectedModalSection(e.target.value)}
                                    className="form-select"
                                    disabled={!selectedModalNiveau}
                                >
                                    <option value="">Sélectionner une section</option>
                                    {sections.map(section => (
                                        <option key={section.id} value={section.id}>
                                            {section.classe} {section.classearab && `(${section.classearab})`}
                                        </option>
                                    ))}
                                </Form.Control>
                            </Form.Group>
                        </Col>
                    </Row>

                    {matieresNiveau.length > 0 && (
                        <div className="mt-4">
                            <h5>Configuration des durées pour les matières</h5>
                            <div className="table-responsive">
                                <Table bordered hover className="mt-3">
                                    <thead className="thead-light">
                                        <tr>
                                            <th>Matière</th>
                                            <th>Durée totale (h/semaine)</th>
                                            <th>Durée séance (min)</th>
                                            <th>Nb. séances/jour</th>
                                            <th>Préférence horaire</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {matieresNiveau.map(item => (
                                            <tr key={item.id}>
                                                <td>
                                                    {item.Matiere?.nom}
                                                    {item.Matiere?.nomarabe && (
                                                        <div className="text-muted small">{item.Matiere.nomarabe}</div>
                                                    )}
                                                </td>
                                                <td>
                                                    <Form.Control
                                                        type="number"
                                                        min="0"
                                                        value={durees[item.id]?.duree || ''}
                                                        onChange={(e) => handleFieldChange(item.id, 'duree', e.target.value)}
                                                    />
                                                </td>
                                                <td>
                                                    <Form.Control
                                                        type="number"
                                                        min="0"
                                                        value={durees[item.id]?.dureeseance || ''}
                                                        onChange={(e) => handleFieldChange(item.id, 'dureeseance', e.target.value)}
                                                    />
                                                </td>
                                                <td>
                                                    <Form.Control
                                                        type="number"
                                                        min="0"
                                                        max="10"
                                                        value={durees[item.id]?.nombreseanceparjour || ''}
                                                        onChange={(e) => handleFieldChange(item.id, 'nombreseanceparjour', e.target.value)}
                                                    />
                                                </td>
                                                <td>
                                                    <Form.Control
                                                        as="select"
                                                        value={durees[item.id]?.preference || ''}
                                                        onChange={(e) => handleFieldChange(item.id, 'preference', e.target.value)}
                                                    >
                                                        <option value="">Aucune préférence</option>
                                                        <option value="Uniquement La matiné">Uniquement La matiné</option>
                                                        <option value="Uniquement L'après-midi">Uniquement L'après-midi</option>
                                                        <option value="Plus Grand Moitié La Matin">Plus Grand Moitié La Matin</option>
                                                        <option value="Moitié Moitié">Moitié Moitié</option>
                                                    </Form.Control>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            </div>
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowMatieresModal(false)}>
                        Annuler
                    </Button>
                    <Button
                        variant="primary"
                        onClick={handleSaveConfigurations}
                        disabled={!selectedModalNiveau || !selectedModalSection || matieresNiveau.length === 0}
                    >
                        Enregistrer
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};
export default EmploiDuTempsV2;