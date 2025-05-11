import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Button, Modal, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import NoteModal from './NoteModal';
import AbsenceRemarqueRow from './AbsenceRemarqueRow';
import DecisionFinaleRow from './DecisionFinaleRow';
import add from '../../assets/imgs/add.png';
import edite from '../../assets/imgs/edit.png';
import delet from '../../assets/imgs/delete.png';
import archive from '../../assets/imgs/archive.png';
import show from '../../assets/imgs/vu.png';
import './modal.css';
import { PDFDocument, rgb } from 'pdf-lib';
import { FaCalendarAlt, FaUsers, FaUserCheck, FaChartLine, FaClipboardList } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';

const HorizontalStepper = () => {
    const [exemptionAll, setExemptionAll] = useState({});
    const [bulkExemptionMode, setBulkExemptionMode] = useState(false);
    const [activeStep, setActiveStep] = useState(0);
    const [cycle, setCycle] = useState('');
    const [trimests, setTrimests] = useState([]);
    const [annees, setAnnees] = useState([]);
    const [selectedAnnee, setSelectedAnnee] = useState(null);
    const [selectedTrimestre, setSelectedTrimestre] = useState(null);
    const [filteredAnnees, setFilteredAnnees] = useState([]);
    const [niveaux, setNiveaux] = useState([]);
    const [selectedNiveau, setSelectedNiveau] = useState(null);
    const [sections, setSections] = useState([]);
    const [selectedSection, setSelectedSection] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showMatieresModal, setShowMatieresModal] = useState(false);
    const [matieresNiveau, setMatieresNiveau] = useState([]);
    const [eleves, setEleves] = useState([]);
    const [loadingEleves, setLoadingEleves] = useState(false);
    const [modeEnseignant, setModeEnseignant] = useState(false);
    const [dateDebut, setDateDebut] = useState('');
    const [dateFin, setDateFin] = useState('');
    const [ecoleId, setEcoleId] = useState(null);
    const [ecoleeId, setEcoleeId] = useState(null);
    const [showDateFields, setShowDateFields] = useState(false);
    const [notesData, setNotesData] = useState({});
    const [selectedEleve, setSelectedEleve] = useState(null);
    const [selectedMatiere, setSelectedMatiere] = useState(null);
    const [showNoteModal, setShowNoteModal] = useState(false);
    const [showModalRemarque, setShowModalRemarque] = useState(false);
    const [enseignantsParMatiere, setEnseignantsParMatiere] = useState({});
    const [selectedStudents, setSelectedStudents] = useState([]);
    const [selectAll, setSelectAll] = useState(false);
    const [allSelected, setAllSelected] = useState(false);
    const [remarques, setRemarques] = useState([]);
    const [remarque, setRemarque] = useState(''); // Changé de [] à ''
    const [loadingRemarques, setLoadingRemarques] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [editId, setEditId] = useState(null);

    const [trimestreDates, setTrimestreDates] = useState({
        debut: '',
        fin: ''
    });

    const handleSelectStudent = (eleveId) => {
        setSelectedStudents(prev => {
            if (prev.includes(eleveId)) {
                return prev.filter(id => id !== eleveId);
            } else {
                return [...prev, eleveId];
            }
        });
    };

    const onSelectAll = () => {
        if (allSelected) {
            setSelectedStudents([]);
        } else {
            setSelectedStudents(eleves.map(eleve => eleve.id));
        }
        setAllSelected(!allSelected);
    };

    // Fonction pour mettre à jour les élèves sélectionnés
    // Dans GestionDesNotes.jsx
    const handleUpdateEleves = async () => {
        if (!selectedAnnee || !selectedNiveau || selectedStudents.length === 0) {
            alert('Veuillez sélectionner une année scolaire, un niveau et au moins un élève');
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const nextNiveau = findNextNiveau(selectedNiveau);
            if (!nextNiveau) {
                alert('Impossible de déterminer le niveau suivant');
                return;
            }

            const currentYear = new Date(selectedAnnee.datedebut).getFullYear();
            const nextAnnee = annees.find(a => {
                const debut = new Date(a.datedebut).getFullYear();
                return debut === currentYear + 1;
            });

            if (!nextAnnee) {
                alert('Année scolaire suivante non trouvée');
                return;
            }

            const updateData = selectedStudents.map(id => ({
                id: parseInt(id),
                niveauId: parseInt(nextNiveau.id),
                annescolaireId: parseInt(nextAnnee.id),
                cycle: nextNiveau.cycle
            }));

            console.log('📤 Données formatées envoyées au serveur :', updateData);

            const response = await axios({
                method: 'put',
                url: 'http://localhost:5000/eleves/update-bulk',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                data: updateData
            });

            alert(`${response.data.updatedCount} élèves mis à jour avec succès!`);
            setSelectedStudents([]);
            setAllSelected(false);

        } catch (error) {
            console.error('❌ Erreur lors de la mise à jour:', error);
            let errorMessage = error.response?.data?.message || error.message;

            if (error.response?.data?.error) {
                errorMessage += ` (Détails: ${error.response.data.error})`;
            }

            alert(`Erreur: ${errorMessage}`);
        }
    };


    // Fonction utilitaire pour trouver le niveau suivant
    const findNextNiveau = (currentNiveauId) => {
        if (!niveaux || !currentNiveauId) return null;

        const currentNiveau = niveaux.find(n => n.id === parseInt(currentNiveauId));
        if (!currentNiveau) return null;

        return niveaux.find(n =>
            n.cycle === currentNiveau.cycle &&
            n.ordre > currentNiveau.ordre
        );
    };
    // Fonction pour sélectionner/désélectionner tous les élèves
    const toggleSelectAll = () => {
        if (selectAll) {
            setSelectedStudents([]);
        } else {
            setSelectedStudents(eleves.map(eleve => eleve.id));
        }
        setSelectAll(!selectAll);
    };

    // Fonction pour mettre à jour le statut
    const handleUpdateStatus = async () => {
        if (!selectedAnnee || !selectedTrimestre || !selectedNiveau || !selectedSection) {
            alert('Veuillez sélectionner tous les paramètres');
            return;
        }

        if (selectedStudents.length === 0) {
            alert('Veuillez sélectionner au moins un élève');
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const response = await axios.put(
                'http://localhost:5000/moyenne/update-status',
                {
                    eleveIds: selectedStudents,
                    annescolaireId: selectedAnnee.id,
                    trimestId: selectedTrimestre,
                    niveauId: selectedNiveau,
                    sectionId: selectedSection,
                    status: true // Vous pouvez aussi le rendre dynamique si besoin
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            alert(response.data.message);
            // Recharger les données si nécessaire
        } catch (error) {
            console.error('Erreur:', error);
            alert(`Erreur lors de la mise à jour: ${error.response?.data?.message || error.message}`);
        }
    };

    const handleSaveMoyennesGenerales = async () => {
        if (!selectedAnnee || !selectedTrimestre || !selectedNiveau || !selectedSection) {
            alert('Veuillez sélectionner tous les paramètres');
            return;
        }

        const elevesAvecMoyenne = eleves.map(eleve => {
            const moyenne = parseFloat(getMoyenneGenerale(eleve.id)) || 0;
            if (isNaN(moyenne)) {
                console.error(`Invalid moyenne for student ${eleve.id}:`, getMoyenneGenerale(eleve.id));
            }
            return {
                id: eleve.id,
                moyenneGenerale: moyenne
            };
        }).filter(eleve => !isNaN(eleve.moyenneGenerale));

        if (elevesAvecMoyenne.length === 0) {
            alert('Aucune moyenne valide à sauvegarder');
            return;
        }

        try {
            const token = localStorage.getItem('token');

            const response = await axios.post(
                `http://localhost:5000/moyenne/save-bulk-generales`,
                {
                    annescolaireId: selectedAnnee.id,
                    trimestId: selectedTrimestre,
                    niveauId: selectedNiveau,
                    sectionId: selectedSection,
                    eleves: elevesAvecMoyenne
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            console.log('Réponse du serveur:', response.data);
            if (response.data.errors?.length) {
                console.error('Errors:', response.data.errors);
                alert(`${response.data.errors.length} erreurs pendant la sauvegarde. Voir la console.`);
            } else {
                alert(`Moyennes sauvegardées pour ${elevesAvecMoyenne.length} élèves!`);
            }
        } catch (error) {
            console.error('Erreur:', error);
            alert(`Erreur lors de la sauvegarde: ${error.response?.data?.message || error.message}`);
        }
    };

    const handleUpdateExemption = async (eleveId, matiereId, exemptionValue) => {
        try {
            const token = localStorage.getItem("token");
            await axios.post(
                "http://localhost:5000/notes/updateExemption",
                {
                    eleveId,
                    matiereId,
                    sectionId: selectedSection,
                    exemption: exemptionValue
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            // Mettre à jour le state local
            setNotesData(prev => ({
                ...prev,
                [eleveId]: {
                    ...prev[eleveId],
                    [matiereId]: {
                        ...prev[eleveId]?.[matiereId],
                        exemption: exemptionValue
                    }
                }
            }));

        } catch (error) {
            console.error("Erreur lors de la mise à jour de l'exemption:", error);
            alert("Erreur lors de la mise à jour");
        }
    };

    // Fonction pour mettre à jour toutes les exemptions d'une matière
    const handleBulkUpdateExemption = async (matiereId, exemptionValue) => {
        try {
            const token = localStorage.getItem("token");
            await axios.post(
                "http://localhost:5000/notes/bulkUpdateExemption",
                {
                    matiereId,
                    sectionId: selectedSection,
                    exemption: exemptionValue
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            // Mettre à jour le state local pour tous les élèves
            const updatedNotes = { ...notesData };
            eleves.forEach(eleve => {
                if (!updatedNotes[eleve.id]) {
                    updatedNotes[eleve.id] = {};
                }
                if (!updatedNotes[eleve.id][matiereId]) {
                    updatedNotes[eleve.id][matiereId] = {};
                }
                updatedNotes[eleve.id][matiereId].exemption = exemptionValue;
            });

            setNotesData(updatedNotes);
            setExemptionAll(prev => ({
                ...prev,
                [matiereId]: exemptionValue
            }));

        } catch (error) {
            console.error("Erreur lors de la mise à jour en masse:", error);
            alert("Erreur lors de la mise à jour en masse");
        }
    };

    // Fonction pour basculer le mode bulk exemption
    const toggleBulkExemptionMode = () => {
        setBulkExemptionMode(!bulkExemptionMode);
        console.log("Mode exemption activé/désactivé");
    };

    const handleShowModalRemarque = () => setShowModalRemarque(true);
    const handleCloseModalRemarque = () => {
        setShowModalRemarque(false);
        setRemarque('');
        setEditMode(false);
        setEditId(null);
    };
    
    const fetchEnseignantsParMatiere = async () => {
        if (!selectedNiveau || !selectedSection) return;

        try {
            const token = localStorage.getItem("token");
            const response = await axios.get(
                `http://localhost:5000/listClasse/${selectedNiveau}/${selectedSection}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            const enseignantsMap = {};
            response.data.forEach(item => {
                enseignantsMap[item.matiereId] = item.Enseignant;
            });
            setEnseignantsParMatiere(enseignantsMap);
        } catch (error) {
            console.error("Erreur lors du chargement des enseignants:", error);
        }
    };

    useEffect(() => {
        const fetchNiveaux = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await axios.get("http://localhost:5000/niveaux", {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const niveauxAvecCycle = Array.isArray(response.data)
                    ? response.data.map(niveau => ({
                        ...niveau,
                        cycle: niveau.cycle || 'Non spécifié'
                    }))
                    : [];
                console.log('cycle', niveauxAvecCycle);
                setNiveaux(niveauxAvecCycle);
            } catch (error) {
                console.error("Erreur lors du chargement des niveaux.", error);
            } finally {
                setLoading(false);
            }
        };

        fetchNiveaux();
    }, []);
    useEffect(() => {
        if (selectedNiveau && niveaux.length > 0) {
            const niveauTrouve = niveaux.find(n => String(n.id) === String(selectedNiveau));
            if (niveauTrouve) {
                setCycle(niveauTrouve.cycle);
            } else {
                setCycle('');
            }
        } else {
            setCycle('');
        }
    }, [selectedNiveau, niveaux]);

    useEffect(() => {
        if (selectedNiveau) {
            const fetchSections = async () => {
                try {
                    const token = localStorage.getItem("token");
                    const response = await axios.get(
                        `http://localhost:5000/sections/niveau/${selectedNiveau}`,
                        { headers: { Authorization: `Bearer ${token}` } }
                    );
                    setSections(response.data);
                    setSelectedSection(null);
                } catch (error) {
                    console.error("Erreur lors du chargement des sections.", error);
                }
            };
            fetchSections();
        }
    }, [selectedNiveau]);

    useEffect(() => {
        const fetchAnnees = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await axios.get(
                    `http://localhost:5000/anneescolaire`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                setAnnees(response.data);
                setFilteredAnnees(response.data);
            } catch (error) {
                console.error('Error fetching annees scolaires', error);
            }
        };
        fetchAnnees();
    }, []);
    const fetchTrimests = async () => {

        try {
            const token = localStorage.getItem("token");
            const response = await axios.get(
                'http://localhost:5000/trimest',
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setTrimests(response.data);
            setFilteredTrimests(response.data);
        } catch (error) {
            //console.error('Erreur lors de la récupération des trimestres', error);
        } finally {
            //setIsLoading(false); // Désactive le chargement
        }
    };

    useEffect(() => {
        fetchTrimests();
    }, []);

    useEffect(() => {
        const fetchEleves = async () => {
            if (selectedSection) {
                setLoadingEleves(true);
                try {
                    const token = localStorage.getItem("token");
                    const [elevesResponse, enseignantsResponse] = await Promise.all([
                        axios.get(
                            `http://localhost:5000/eleves/section/${selectedSection}`,
                            { headers: { Authorization: `Bearer ${token}` } }
                        ),
                        axios.get(
                            `http://localhost:5000/listClasse/${selectedNiveau}/${selectedSection}`,
                            { headers: { Authorization: `Bearer ${token}` } }
                        )
                    ]);

                    console.log('les eleves', elevesResponse.data);
                    setEleves(elevesResponse.data);

                    const enseignantsMap = {};
                    enseignantsResponse.data.forEach(item => {
                        enseignantsMap[item.matiereId] = item.Enseignant;
                    });
                    setEnseignantsParMatiere(enseignantsMap);
                } catch (error) {
                    console.error("Erreur lors du chargement des données:", error);
                } finally {
                    setLoadingEleves(false);
                }
            }
        };

        fetchEleves();
    }, [selectedSection]);
    // useEffect(() => {
    //     const fetchEleves = async () => {
    //         if (selectedSection) {
    //             setLoadingEleves(true);
    //             try {
    //                 const token = localStorage.getItem("token");
    //                 const response = await axios.get(
    //                     `http://localhost:5000/eleves/section/${selectedSection}`,
    //                     { headers: { Authorization: `Bearer ${token}` } }
    //                 );
    //                 setEleves(response.data);
    //             } catch (error) {
    //                 console.error("Erreur lors du chargement des élèves:", error);
    //             } finally {
    //                 setLoadingEleves(false);
    //             }
    //         }
    //     };

    //     fetchEleves();
    // }, [selectedSection]);

    useEffect(() => {
        const fetchMatieresForSection = async () => {
            if (!selectedNiveau) return;

            try {
                const token = localStorage.getItem("token");
                const response = await axios.get(
                    `http://localhost:5000/niveaux/${selectedNiveau}/matieres`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                setMatieresNiveau(response.data);
            } catch (error) {
                console.error("Erreur lors du chargement des matières:", error);
            }
        };

        fetchMatieresForSection();
    }, [selectedNiveau]);

    const handleOpenMatieresModal = async () => {
        if (!selectedNiveau) {
            alert("Veuillez sélectionner un niveau d'abord");
            return;
        }

        try {
            const token = localStorage.getItem("token");
            const response = await axios.get(
                `http://localhost:5000/niveaux/${selectedNiveau}/matieres`,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setMatieresNiveau(response.data);
            setShowMatieresModal(true);
        } catch (error) {
            console.error("Erreur lors du chargement des matières:", error);
        }
    };

    useEffect(() => {
        const storedEcoleId = localStorage.getItem("ecoleId");
        const storedEcoleeId = localStorage.getItem("ecoleeId");

        if (storedEcoleId) {
            setEcoleId(storedEcoleId);
        }
        if (storedEcoleeId) {
            setEcoleeId(storedEcoleeId);
        }
    }, []);

    useEffect(() => {
        const fetchPeriodeNote = async () => {
            const storedEcoleId = localStorage.getItem("ecoleId");
            const storedEcoleeId = localStorage.getItem("ecoleeId");

            // Determine which ID to use
            const idToUse = storedEcoleId || storedEcoleeId;
            if (!idToUse) return;

            try {
                const token = localStorage.getItem("token");
                const response = await axios.get(
                    `http://localhost:5000/periodenotes/${storedEcoleId ? storedEcoleId : '0'
                    }/${storedEcoleeId ? storedEcoleeId : '0'
                    }`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );

                if (response.data) {
                    setModeEnseignant(response.data.status || false);
                    setShowDateFields(response.data.status || false);
                    if (response.data.status) {
                        setDateDebut(response.data.dateDebutPeriode?.split('T')[0] || '');
                        setDateFin(response.data.dateFinPeriode?.split('T')[0] || '');
                    }
                }
            } catch (error) {
                console.error("Erreur lors du chargement de la période:", error);
            }
        };

        fetchPeriodeNote();
    }, []);

    const handleModeEnseignantChange = async (e) => {
        const checked = e.target.checked;
        const storedEcoleId = localStorage.getItem("ecoleId");
        const storedEcoleeId = localStorage.getItem("ecoleeId");

        if (!storedEcoleId && !storedEcoleeId) {
            alert("Aucun ID d'école trouvé");
            return;
        }

        try {
            const token = localStorage.getItem("token");
            const dataToSend = {
                status: checked,
                ecoleId: storedEcoleId || null,
                ecoleeId: storedEcoleeId || null
            };

            // On envoie null pour les dates seulement quand on désactive le mode
            if (!checked) {
                dataToSend.dateDebutPeriode = null;
                dataToSend.dateFinPeriode = null;
            }

            await axios.post(
                "http://localhost:5000/periodenotes",
                dataToSend,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            // Rafraîchir les données après la mise à jour
            const response = await axios.get(
                `http://localhost:5000/periodenotes/${storedEcoleId || '0'}/${storedEcoleeId || '0'}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (response.data) {
                setModeEnseignant(response.data.status);
                setShowDateFields(response.data.status);
                setDateDebut(response.data.dateDebutPeriode?.split('T')[0] || '');
                setDateFin(response.data.dateFinPeriode?.split('T')[0] || '');
            } else {
                setModeEnseignant(false);
                setShowDateFields(false);
                setDateDebut('');
                setDateFin('');
            }

        } catch (error) {
            console.error("Erreur lors de la mise à jour du mode:", error);
            setModeEnseignant(!checked);
        }
    };

    useEffect(() => {
        if (modeEnseignant && dateDebut && dateFin) {
            const saveDates = async () => {
                const storedEcoleId = localStorage.getItem("ecoleId");
                const storedEcoleeId = localStorage.getItem("ecoleeId");

                try {
                    const token = localStorage.getItem("token");
                    await axios.post(
                        "http://localhost:5000/periodenotes",
                        {
                            status: modeEnseignant,
                            dateDebutPeriode: dateDebut,
                            dateFinPeriode: dateFin,
                            ecoleId: storedEcoleId || null,
                            ecoleeId: storedEcoleeId || null
                        },
                        { headers: { Authorization: `Bearer ${token}` } }
                    );
                } catch (error) {
                    console.error("Erreur lors de l'enregistrement des dates:", error);
                    alert("Erreur lors de la sauvegarde des dates");
                }
            };

            saveDates();
        }
    }, [dateDebut, dateFin, modeEnseignant]);

    const handleSaveDates = async () => {
        const storedEcoleId = localStorage.getItem("ecoleId");
        const storedEcoleeId = localStorage.getItem("ecoleeId");

        if (!storedEcoleId && !storedEcoleeId) {
            alert("Aucun ID d'école trouvé");
            return;
        }

        try {
            const token = localStorage.getItem("token");
            await axios.post(
                "http://localhost:5000/periodenotes",
                {
                    status: modeEnseignant,
                    dateDebutPeriode: dateDebut,
                    dateFinPeriode: dateFin,
                    ecoleId: storedEcoleId || null,
                    ecoleeId: storedEcoleeId || null
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            alert("Configuration sauvegardée avec succès");
        } catch (error) {
            console.error("Erreur lors de l'enregistrement:", error);
            alert("Erreur lors de la sauvegarde");
        }
    };


    useEffect(() => {
        const fetchNotes = async () => {
            if (selectedSection) {
                try {
                    const token = localStorage.getItem("token");
                    const response = await axios.get(
                        `http://localhost:5000/notes/section/${selectedSection}`,
                        { headers: { Authorization: `Bearer ${token}` } }
                    );

                    const formattedNotes = {};
                    response.data.forEach(note => {
                        if (!formattedNotes[note.EleveId]) {
                            formattedNotes[note.EleveId] = {};
                        }
                        formattedNotes[note.EleveId][note.matiereId] = note;
                    });
                    setNotesData(formattedNotes);
                } catch (error) {
                    console.error("Erreur lors du chargement des notes:", error);
                }
            }
        };
        fetchNotes();
    }, [selectedSection]);


    const handleNoteSave = async (updatedNote) => {
        try {
            const token = localStorage.getItem("token");
            const enseignant = enseignantsParMatiere[selectedMatiere.id];

            if (!enseignant) {
                alert("Aucun enseignant assigné à cette matière");
                return;
            }

            const noteToSend = {
                ...updatedNote,
                enseignantId: enseignant.id,
                sectionId: selectedSection,
                cycle: niveaux.find(n => n.id === selectedNiveau)?.cycle,
                annescolaireId: selectedAnnee?.id,
                trimestId: selectedTrimestre,
                exemption: updatedNote.exemption || null
            };

            const response = await axios.post(
                `http://localhost:5000/notes/${selectedEleve.id}/${selectedMatiere.id}`,
                noteToSend,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setNotesData(prev => ({
                ...prev,
                [selectedEleve.id]: {
                    ...prev[selectedEleve.id],
                    [selectedMatiere.id]: response.data.data
                }
            }));

            setShowNoteModal(false);
            alert('Note sauvegardée avec succès!');
        } catch (error) {
            console.error("Erreur lors de la sauvegarde:", error);
            alert(`Erreur: ${error.response?.data?.message || error.message}`);
        }
    };
    const getMoyenne = (eleveId, matiereId) => {
        const note = notesData[eleveId]?.[matiereId];
        if (!note) return 'N/A';

        // Vérifie si c'est une matière mathématique
        const isMath = matieresNiveau.find(m => m.Matiere.id === matiereId)?.Matiere?.nom.toLowerCase().includes('math');

        if (isMath) {
            // Pour les maths, on utilise moyenne_math si elle existe, sinon on calcule
            if (note.moyenne_math !== null && note.moyenne_math !== undefined) {
                const moyenneNum = typeof note.moyenne_math === 'string'
                    ? parseFloat(note.moyenne_math)
                    : note.moyenne_math;
                return !isNaN(moyenneNum) ? moyenneNum.toFixed(2) : 'N/A';
            }

            // Calcul alternatif si moyenne_math n'existe pas
            if (note.moyenne_eval_math && note.examens_math) {
                const moyenne = (parseFloat(note.moyenne_eval_math) + parseFloat(note.examens_math)) / 2;
                return moyenne.toFixed(2);
            }
        }

        // Pour les autres matières
        if (note.moyenne === null || note.moyenne === undefined) return 'N/A';

        const moyenneNum = typeof note.moyenne === 'string'
            ? parseFloat(note.moyenne)
            : note.moyenne;

        return !isNaN(moyenneNum) ? moyenneNum.toFixed(2) : 'N/A';
    };


    const getMoyenneGeneraleParMatiere = (matiereId) => {
        let total = 0;
        let count = 0;

        eleves.forEach((eleve) => {
            const note = notesData[eleve.id]?.[matiereId];
            if (note && typeof note.moyenne === 'number' && !isNaN(note.moyenne)) {
                total += note.moyenne;
                count++;
            }
        });

        if (count === 0) return NaN;
        return total / count;
    };

    const getMoyenneGenerale = (eleveId) => {
        // const cycle = niveaux.find(n => n.id === selectedNiveau)?.cycle;
        // ✅ FAIS ÇA :
        if (!cycle) {
            //console.log("⚠️ Cycle non encore chargé !");
            return 'N/A';
        }
        const notesEleve = notesData[eleveId] || {};


        if (!cycle || !notesEleve) {
            //console.log("❌ Cycle ou notes introuvables");
            return 'N/A';
        }

        if (cycle === 'Primaire') {
            let sommeMoyennes = 0;
            const nbMatieres = matieresNiveau.length;

            //console.log("🟡 Cycle PRIMAIRE — nombre de matières :", nbMatieres);

            matieresNiveau.forEach(matiereItem => {
                const matiere = matiereItem.Matiere;
                const note = notesEleve[matiere.id];
                const isMath = matiere.nomarabe === 'الرياضيات';

                // console.log("➡️ Matière :", matiere.nom, "| ID :", matiere.id);
                // console.log("📝 Note récupérée :", note);

                if (note) {
                    if (isMath) {
                        const calcul = parseFloat(note.calcul) || 0;
                        const grandeurs = parseFloat(note.grandeurs_mesures) || 0;
                        const organisation = parseFloat(note.organisation_donnees) || 0;
                        const geometrie = parseFloat(note.espace_geometrie) || 0;

                        const moyenneMath = (calcul + grandeurs + organisation + geometrie) / 4;
                        // console.log("📊 Moyenne maths (primaire) :", moyenneMath.toFixed(2));
                        sommeMoyennes += moyenneMath;
                    } else {
                        const moyenne = parseFloat(note.moyenne) || 0;
                        // console.log("📚 Moyenne matière normale :", moyenne);
                        sommeMoyennes += moyenne;
                    }
                } else {
                    // console.log("⚠️ Pas de note pour cette matière, on ajoute 0");
                    sommeMoyennes += 0;
                }
            });

            const moyenneFinale = nbMatieres > 0 ? (sommeMoyennes / nbMatieres).toFixed(2) : 'N/A';
            // console.log("✅ Moyenne finale PRIMAIRE :", moyenneFinale);
            return moyenneFinale;
        }

        else if (cycle === 'Cem' || cycle === 'Lycée') {
            let sommeMoyennesPonderees = 0;
            let sommeCoefficients = 0;

            // console.log("🟢 Cycle CEM/LYCÉE — calcul pondéré");

            matieresNiveau.forEach(matiereItem => {
                const matiere = matiereItem.Matiere;
                const note = notesEleve[matiere.id];
                const isMath = matiere.nomarabe === 'الرياضيات';

                // console.log("➡️ Matière :", matiere.nom, "| ID :", matiere.id);
                // console.log("📝 Note récupérée :", note);

                if (note) {
                    const coeff = parseFloat(note.coefficient) || 1;

                    if (isMath) {
                        const calcul = parseFloat(note.calcul) || 0;
                        const grandeurs = parseFloat(note.grandeurs_mesures) || 0;
                        const organisation = parseFloat(note.organisation_donnees) || 0;
                        const geometrie = parseFloat(note.espace_geometrie) || 0;

                        const moyenneMath = (calcul + grandeurs + organisation + geometrie) / 4;
                        // console.log("📊 Moyenne maths (pondérée) :", moyenneMath.toFixed(2), "| Coeff :", coeff);
                        sommeMoyennesPonderees += moyenneMath * coeff;
                        sommeCoefficients += coeff;
                    } else {
                        const moyenne = parseFloat(note.moyenne) || 0;
                        // console.log("📚 Moyenne matière normale :", moyenne, "| Coeff :", coeff);
                        sommeMoyennesPonderees += moyenne * coeff;
                        sommeCoefficients += coeff;
                    }
                }
            });

            const moyenneFinale = sommeCoefficients > 0
                ? (sommeMoyennesPonderees / sommeCoefficients).toFixed(2)
                : 'N/A';

            // console.log("✅ Moyenne finale CEM/LYCÉE :", moyenneFinale);
            return moyenneFinale;
        }

        // console.log("❌ Cycle non reconnu :", cycle);
        return 'N/A';
    };

    useEffect(() => {
        const storedEcoleId = localStorage.getItem("ecoleId");
        const storedEcoleeId = localStorage.getItem("ecoleeId");

        if (storedEcoleId) setEcoleId(storedEcoleId);
        if (storedEcoleeId) setEcoleeId(storedEcoleeId);
    }, []);

    const handlePrintBulletin = async (eleve) => {
        try {
            // Charger le template PDF
            const existingPdfBytes = await fetch('/template.pdf').then(res => res.arrayBuffer());
            const pdfDoc = await PDFDocument.load(existingPdfBytes);
            const page = pdfDoc.getPages()[0];

            // Récupérer les dimensions de la page
            const { width, height } = page.getSize();

            // Configuration des polices
            const fontSize = 10;
            const textColor = rgb(0, 0, 0);

            // 1. Informations de l'élève
            page.drawText(`${eleve.User?.prenom || ''} `, {
                x: 410,
                y: 748,
                size: 12,
                color: textColor,
            });

            page.drawText(`${eleve.User?.nom || ''} `, {
                x: 240,
                y: 748,
                size: 12,
                color: textColor,
            });

            const dateNaissance = eleve.User?.datenaiss || eleve.user?.lieuxnaiss
                ? new Date(eleve.User.datenaiss).toLocaleDateString('fr-FR')
                : '';
            page.drawText(dateNaissance, {
                x: 80,
                y: 748,
                size: 10,
                color: textColor,
            });

            if (selectedAnnee) {
                const debut = new Date(selectedAnnee.datedebut).getFullYear();
                const fin = new Date(selectedAnnee.datefin).getFullYear();
                page.drawText(`${debut}/${fin}`, {
                    x: 60,
                    y: 765,
                    size: 10,
                    color: textColor,
                });
            }

            if (selectedTrimestre) {
                const trimestre = trimests.find(t => t.id === selectedTrimestre);
                if (trimestre) {
                    page.drawText(`${trimestre.titre}`, {
                        x: 120,
                        y: 775,
                        size: 10,
                        color: textColor,
                    });
                }
            }

            // 2. Configuration des positions des matières
            const matieresConfig = {
                'اللغة العربية': {
                    baseY: 615,
                    fields: {
                        expression_orale: { x: 400 },
                        lecture: { x: 360 },
                        production_ecrite: { x: 320 },
                        moyenne_eval: { x: 235 },
                        examens: { x: 195 },
                        moyenne: { x: 155 },
                        remarque: { x: 80 }
                    }
                },
                'اللغة الأمازيغية': {
                    baseY: 605,
                    fields: {
                        expression_orale: { x: 400 },
                        lecture: { x: 360 },
                        production_ecrite: { x: 320 },
                        moyenne_eval: { x: 235 },
                        examens: { x: 195 },
                        moyenne: { x: 155 },
                        remarque: { x: 80 }
                    }
                },
                'اللغة الفرنسية': {
                    baseY: 575,
                    fields: {
                        expression_orale: { x: 400 },
                        lecture: { x: 360 },
                        production_ecrite: { x: 320 },
                        moyenne_eval: { x: 235 },
                        examens: { x: 195 },
                        moyenne: { x: 155 },
                        remarque: { x: 80 }
                    }
                },
                'اللغة الإنجليزية': {
                    baseY: 535,
                    fields: {
                        expression_orale: { x: 400 },
                        lecture: { x: 360 },
                        production_ecrite: { x: 320 },
                        moyenne_eval: { x: 235 },
                        examens: { x: 195 },
                        moyenne: { x: 155 },
                        remarque: { x: 80 }
                    }
                },
                'الرياضيات': {
                    baseY: 495,
                    fields: {
                        calcul: { x: 400 },
                        grandeurs_mesures: { x: 360 },
                        organisation_donnees: { x: 320 },
                        espace_geometrie: { x: 280 },
                        moyenne_eval: { x: 235 },
                        examens: { x: 195 },
                        moyenne: { x: 155 },
                        remarque: { x: 80 }
                    }
                },
                'التربية الإسلامية': {
                    baseY: 455,
                    fields: {
                        examens: { x: 195 },
                        moyenne: { x: 155 },
                        remarque: { x: 80 }
                    }
                },
                'التربية العلمية و التكنولوجية': {
                    baseY: 455,
                    fields: {
                        examens: { x: 195 },
                        moyenne: { x: 155 },
                        remarque: { x: 80 }
                    }
                },
                'التربية المدنية': {
                    baseY: 435,
                    fields: {
                        examens: { x: 195 },
                        moyenne: { x: 155 },
                        remarque: { x: 80 }
                    }
                },
                'التاريخ و الجغرافيا': {
                    baseY: 415,
                    fields: {
                        examens: { x: 195 },
                        moyenne: { x: 155 },
                        remarque: { x: 80 }
                    }
                },
                'التربية التشكيلية': {
                    baseY: 395,
                    fields: {
                        examens: { x: 195 },
                        moyenne: { x: 155 },
                        remarque: { x: 80 }
                    }
                },
                'التربية الموسيقية': {
                    baseY: 375,
                    fields: {
                        examens: { x: 195 },
                        moyenne: { x: 155 },
                        remarque: { x: 80 }
                    }
                },
                'التربية البدنية والرياضية': {
                    baseY: 355,
                    fields: {
                        examens: { x: 195 },
                        moyenne: { x: 155 },
                        remarque: { x: 80 }
                    }
                },
            };

            // 3. Remplissage des notes pour chaque matière
            matieresNiveau.forEach(matiereItem => {
                const matiere = matiereItem.Matiere;
                const config = matieresConfig[matiere.nomarabe.trim()];
                const notes = notesData[eleve.id]?.[matiere.id] || {};

                if (config) {
                    Object.entries(config.fields).forEach(([field, position]) => {
                        const rawValue = notes[field];
                        const value = rawValue !== undefined && rawValue !== null
                            ? (typeof rawValue === 'number' ? rawValue.toFixed(2) : rawValue.toString())
                            : 'N/A';

                        page.drawText(value, {
                            x: position.x,
                            y: config.baseY,
                            size: fontSize,
                            color: textColor,
                        });
                    });
                }
            });

            // 4. Affichage des remarques aux positions spécifiées
            const remarquesPositions = [
                { x: 440, y: 285 },  // Position 1
                { x: 420, y: 265 },  // Position 2
                { x: 440, y: 245 },  // Position 3
                { x: 440, y: 215 },  // Position 4
                { x: 415, y: 195 }   // Position 5
            ];

            // Récupérer les matières principales pour les remarques
            const matieresPrincipales = [
                'اللغة العربية',
                'اللغة الأمازيغية',
                'اللغة الفرنسية',
                'اللغة الإنجليزية',
                'التربية البدنية والرياضية'
            ];

            // Afficher les remarques des matières principales aux positions spécifiées
            matieresPrincipales.forEach((matiereNom, index) => {
                if (index < remarquesPositions.length) {
                    const matiereItem = matieresNiveau.find(m => m.Matiere.nomarabe.trim() === matiereNom);
                    if (matiereItem) {
                        const matiere = matiereItem.Matiere;
                        const notes = notesData[eleve.id]?.[matiere.id] || {};
                        const remarque = notes.remarque || '';

                        const position = remarquesPositions[index];
                        page.drawText(remarque, {
                            x: position.x,
                            y: position.y,
                            size: fontSize,
                            color: textColor,
                        });
                    }
                }
            });

            // 5. Moyenne générale
            const moyenneGenerale = getMoyenneGenerale(eleve.id);
            page.drawText(moyenneGenerale, {
                x: 70,
                y: 330,
                size: fontSize + 2,
                color: textColor,
            });

            // 6. Absences
            page.drawText(notesData[eleve.id]?.absences?.toString() || '0', {
                x: 500,
                y: 330,
                size: fontSize,
                color: textColor,
            });

            // 7. Générer et télécharger le PDF
            const pdfBytes = await pdfDoc.save();
            const blob = new Blob([pdfBytes], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);

            const link = document.createElement('a');
            link.href = url;
            link.download = `Bulletin_${eleve.User.prenom}_${eleve.User.nom}.pdf`;
            document.body.appendChild(link);
            link.click();

            // Nettoyage
            setTimeout(() => {
                document.body.removeChild(link);
                URL.revokeObjectURL(url);
            }, 100);

        } catch (error) {
            console.error('Erreur génération PDF:', error);
            alert('Erreur lors de la génération du bulletin');
        }
    };


    const fetchRemarques = async () => {
        try {
            setLoadingRemarques(true);
            const res = await axios.get('http://localhost:5000/remarques/liste', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            setRemarques(res.data);
        } catch (error) {
            toast.error("Erreur lors du chargement des remarques.");
        } finally {
            setLoadingRemarques(false);
        }
    };

    // Charger les remarques au montage du composant
    useEffect(() => {
        fetchRemarques();
    }, []);

    const handleAddRemarque = async () => {
        if (!remarque.trim()) {
            toast.warning('Veuillez saisir une remarque.');
            return;
        }

        try {
            setLoading(true);
            await axios.post('http://localhost:5000/remarques',
                { remarque },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                }
            );
            toast.success('Remarque ajoutée avec succès.');
            setRemarque('');
            fetchRemarques(); // Recharge les remarques après ajout
        } catch (error) {
            toast.error('Erreur lors de l\'ajout.');
        } finally {
            setLoading(false);
        }
    };
    const handleEditClick = (item) => {
        setRemarque(item.remarque);
        setEditId(item.id);
        setEditMode(true);
        setShowModalRemarque(true); // Ouvre la modale pour éditer
    };
    const handleUpdateRemarque = async () => {
        if (!remarque.trim()) {
            toast.warning('Veuillez saisir une remarque.');
            return;
        }

        try {
            setLoading(true);
            await axios.put(`http://localhost:5000/remarques/${editId}`, { remarque }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            toast.success('Remarque modifiée avec succès.');
            setRemarque('');
            setEditMode(false);
            setEditId(null);
            fetchRemarques();
        } catch (error) {
            toast.error("Erreur lors de la modification.");
        } finally {
            setLoading(false);
        }
    };

    const handleArchiveRemarque = async (id) => {
        try {
            await axios.patch(`http://localhost:5000/remarques/${id}/archive`, { archiver: 1 }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            toast.success('Remarque archivée.');
            fetchRemarques();
        } catch (err) {
            toast.error('Erreur lors de l’archivage.');
        }
    };


    const steps = [
        { id: 0, label: "Gestion des notes", icon: <FaChartLine /> },
        { id: 1, label: "Gestion des Dispenses", icon: <FaUserCheck /> },
        { id: 2, label: "Remarques & Décisions", icon: <FaClipboardList /> },
        { id: 3, label: "Décision Finale", icon: <FaUserCheck /> },
    ];

    const stepContents = [
        <div className="p-3 border rounded card mt-2">
            <div className="card shadow">
                <div className="card-header bg-primary text-white">
                    <h3 className="card-title mb-0">Gestion des notes</h3>
                </div>

                <div className="card-body">
                    <div className="mb-4">
                        <Form.Group controlId="formModeEnseignant" className="d-flex align-items-center">
                            <label className="switch">
                                <input
                                    type="checkbox"
                                    checked={modeEnseignant}
                                    onChange={handleModeEnseignantChange}
                                />
                                <span className="slider round"></span>
                            </label>
                        </Form.Group>

                        {showDateFields && (
                            <div className="row mt-3">
                                <div className="col-md-6">
                                    <Form.Group controlId="formDateDebut">
                                        <Form.Label>Date de début</Form.Label>
                                        <Form.Control
                                            type="date"
                                            value={dateDebut}
                                            onChange={(e) => setDateDebut(e.target.value)}
                                        />
                                    </Form.Group>
                                </div>
                                <div className="col-md-6">
                                    <Form.Group controlId="formDateFin">
                                        <Form.Label>Date de fin</Form.Label>
                                        <Form.Control
                                            type="date"
                                            value={dateFin}
                                            onChange={(e) => setDateFin(e.target.value)}
                                        />
                                    </Form.Group>
                                </div>
                                <div className="col-12 mt-2">
                                    <Button
                                        variant="primary"
                                        onClick={handleSaveDates}
                                        disabled={!dateDebut || !dateFin}
                                    >
                                        Enregistrer les dates
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Sélection des filtres (Année scolaire, Trimestre, Niveau, Section) */}
                    <div className="mb-4">
                        <h4 className="mb-3 text-primary">🎯 Sélectionnez :</h4>
                        <div className="d-flex flex-wrap align-items-center">

                            {/* Année scolaire */}
                            <div className="form-group ml-0" style={{ minWidth: '150px' }}>
                                <select
                                    className="form-control input"
                                    style={{ height: '40px' }}
                                    value={selectedAnnee?.id || ""}
                                    onChange={(e) => {
                                        const selected = annees.find((a) => a.id === parseInt(e.target.value));
                                        setSelectedAnnee(selected || null);
                                    }}
                                >
                                    <option value="">Année scolaire</option>
                                    {annees.map((annee) => {
                                        const debut = new Date(annee.datedebut).getFullYear();
                                        const fin = new Date(annee.datefin).getFullYear();
                                        return (
                                            <option key={annee.id} value={annee.id}>
                                                {debut} - {fin}
                                            </option>
                                        );
                                    })}
                                </select>
                            </div>

                            {/* Trimestre */}
                            <div className="form-group ml-2" style={{ minWidth: '150px' }}>
                                <select
                                    className="form-control input"
                                    style={{ height: '40px' }}
                                    value={selectedTrimestre || ''}
                                    onChange={(e) => setSelectedTrimestre(e.target.value)}
                                >
                                    <option value="">Trimestre</option>
                                    {Array.isArray(trimests) && trimests.map((trimestre) => (
                                        <option key={trimestre.id} value={trimestre.id}>
                                            {trimestre.titre}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Niveau */}
                            <div className="form-group ml-2" style={{ minWidth: '150px' }}>
                                <select
                                    className="form-control input"
                                    style={{ height: '40px' }}
                                    value={selectedNiveau || ''}
                                    onChange={(e) => setSelectedNiveau(e.target.value)}
                                >
                                    <option value="">Niveau</option>
                                    {niveaux.map((niveau) => (
                                        <option key={niveau.id} value={niveau.id}>
                                            {niveau.nomniveau}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            {/* <h4 className="mb-3 text-primary">Cycle sélectionné : {cycle}</h4> */}

                            {/* Section */}
                            {selectedNiveau && sections.length > 0 && (
                                <div className="form-group ml-2" style={{ minWidth: '150px' }}>
                                    <select
                                        className="form-control input"
                                        style={{ height: '40px' }}
                                        value={selectedSection || ''}
                                        onChange={(e) => setSelectedSection(e.target.value)}
                                    >
                                        <option value="">Section</option>
                                        {sections.map((section) => (
                                            <option key={section.id} value={section.id}>
                                                {section.classe} {section.classearab && `(${section.classearab})`}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            )}
                        </div>
                    </div>
                    {/* Affichage de la table des élèves */}
                    {selectedSection && (
                        <div className="mt-4">
                            <div className="d-flex flex-wrap gap-2">
                                <Button
                                    className="btn btn-secondary mr-2"
                                    onClick={handleOpenMatieresModal}
                                >
                                    <i className="fas fa-book mr-2"></i>
                                    Coef des matières
                                </Button>
                                <Button
                                    className="btn btn-success mr-2"
                                    onClick={handleSaveMoyennesGenerales}
                                    disabled={!selectedSection || !selectedAnnee || !selectedTrimestre || eleves.length === 0}
                                >
                                    <i className="fas fa-save mr-2"></i>
                                    Sauvegarder les moyennes
                                </Button>

                                <Button className="btn btn-app p-1" onClick={handleShowModalRemarque}>
                                    <img src={add} alt="" width="30px" /><br />
                                    Ajouter
                                </Button>
                                <Button
                                    onClick={handleUpdateStatus}
                                    disabled={selectedStudents.length === 0}
                                    className="ml-2"
                                >
                                    <img src={show} alt="Valider" width="20" className="mr-2" />
                                </Button>

                            </div>
                            <h4>Liste des élèves de la section sélectionnée :</h4>

                            <div className="table-responsive">
                                <table className="table table-bordered table-striped">
                                    <thead className="thead-light">
                                        <tr>
                                            <th>
                                                <Form.Check
                                                    type="checkbox"
                                                    checked={selectAll}
                                                    onChange={toggleSelectAll}
                                                    label="Tous"
                                                />
                                            </th>
                                            <th rowSpan="2">numero identification</th>
                                            <th rowSpan="2">Nom complet</th>
                                            {matieresNiveau.map((matiere) => (
                                                <th key={matiere.id}>
                                                    {matiere.Matiere?.nomarabe} {' - '} {matiere.Matiere?.nom}
                                                </th>
                                            ))}
                                            <th>Moyenne Générale</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {eleves.map((eleve) => (
                                            <tr key={eleve.id}>
                                                <td>
                                                    <Form.Check
                                                        type="checkbox"
                                                        checked={selectedStudents.includes(eleve.id)}
                                                        onChange={() => handleSelectStudent(eleve.id)}
                                                    />
                                                </td>
                                                <td>{eleve.numidentnational}</td>
                                                <td>{eleve.User?.prenom} {eleve.User?.nom}</td>
                                                {matieresNiveau.map((matiere) => {
                                                    const isMath = matiere.Matiere?.nom.toLowerCase().includes('math');
                                                    const moyenne = getMoyenne(eleve.id, matiere.Matiere.id, isMath);
                                                    return (
                                                        <td key={matiere.id}>
                                                            {enseignantsParMatiere[matiere.Matiere.id] ? (
                                                                <Button
                                                                    variant="link"
                                                                    onClick={() => {
                                                                        setSelectedEleve(eleve);
                                                                        setSelectedMatiere(matiere.Matiere);
                                                                        setShowNoteModal(true);
                                                                    }}
                                                                >
                                                                    {moyenne}
                                                                </Button>
                                                            ) : (
                                                                <span className="text-danger">Pas de prof assigné</span>
                                                            )}
                                                        </td>
                                                    );
                                                })}
                                                <td>
                                                    {(() => {
                                                        const moyenneGen = getMoyenneGenerale(eleve.id);
                                                        console.log("Moyenne Générale affichée pour élève", eleve.id, ":", moyenneGen);
                                                        return moyenneGen;
                                                    })()}
                                                </td>
                                                <td>
                                                    <Button className="btn btn-sm btn-outline-primary" style={{ color: "black" }} onClick={() => handlePrintBulletin(eleve)}>
                                                        <i className="fas fa-print"></i>
                                                    </Button>
                                                </td>

                                            </tr>
                                        ))}
                                    </tbody>
                                    <tfoot>
                                        <tr>
                                            <th>Moyenne de la matière</th>
                                            <th></th>
                                            {matieresNiveau.map((matiere) => {
                                                const moyenneGen = getMoyenneGeneraleParMatiere(matiere.Matiere.id);
                                                return (
                                                    <th key={matiere.id}>
                                                        {isNaN(moyenneGen) ? 'N/A' : moyenneGen.toFixed(2)}
                                                    </th>
                                                );
                                            })}
                                            <th>
                                                {(() => {
                                                    const cycle = niveaux.find(n => n.id === selectedNiveau)?.cycle;
                                                    let total = 0;
                                                    let count = 0;

                                                    eleves.forEach(eleve => {
                                                        const mg = getMoyenneGenerale(eleve.id);
                                                        if (mg !== 'N/A') {
                                                            total += parseFloat(mg);
                                                            count++;
                                                        }
                                                    });

                                                    return count > 0 ? (total / count).toFixed(2) : 'N/A';
                                                })()}
                                            </th>
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <Modal show={showMatieresModal} onHide={() => setShowMatieresModal(false)} size="lg">
                <Modal.Header closeButton className="bg-primary text-white">
                    <Modal.Title>Configuration des matières pour le niveau</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="table-responsive">
                        <table className="table table-bordered table-hover">
                            <thead className="thead-light">
                                <tr>
                                    <th>Matière</th>
                                    <th style={{ width: '120px' }}>conf</th>
                                </tr>
                            </thead>
                            <tbody>
                                {matieresNiveau.map((item) => (
                                    <tr key={item.id}>
                                        <td>
                                            {item.Matiere?.nom || 'N/A'}
                                            {item.Matiere?.nomarabe && (
                                                <div className="text-muted small">{item.Matiere.nomarabe}</div>
                                            )}
                                        </td>
                                        <td>
                                            <Form.Control
                                                type="number"
                                                min="0"
                                                placeholder="conf"
                                            />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowMatieresModal(false)}>
                        <i className="fas fa-times mr-2"></i>
                        Annuler
                    </Button>
                    <Button variant="primary">
                        <i className="fas fa-save mr-2"></i>
                        Enregistrer
                    </Button>
                </Modal.Footer>
            </Modal>


            {/* <NoteModal
                show={showNoteModal}
                handleClose={() => setShowNoteModal(false)}
                eleve={selectedEleve}
                matiere={selectedMatiere}
                notes={selectedEleve && selectedMatiere
                    ? notesData[selectedEleve.id]?.[selectedMatiere.id] || {}
                    : {}}
                cycle={niveaux.find(n => n.id === selectedNiveau)?.cycle} // Assurez-vous que c'est bien 'Primaire', 'Cem' ou 'Lycée'
                onSave={handleNoteSave}
                annescolaireId={selectedAnnee?.id}
                trimestId={selectedTrimestre}
            /> */}
            <NoteModal
                // key={selectedEleve.id}
                show={showNoteModal}
                handleClose={() => setShowNoteModal(false)}
                eleve={selectedEleve}
                matiere={selectedMatiere}
                notes={selectedEleve && selectedMatiere
                    ? notesData[selectedEleve.id]?.[selectedMatiere.id] || {}
                    : {}}
                cycle={cycle} // ✅ On transmet le cycle ici
                onSave={handleNoteSave}
                annescolaireId={selectedAnnee?.id}
                trimestId={selectedTrimestre}
            />
            <div className={`modal fade ${showModalRemarque ? 'show' : ''}`}
                style={{ display: showModalRemarque ? 'block' : 'none' }}
                id="modal-niveau"
                tabIndex="-1"
                role="dialog"
                aria-labelledby="modalNiveauLabel"
                aria-hidden={!showModalRemarque}>
                <div className="modal-dialog">
                    <div className="modal-content">
                        <ToastContainer />
                        <div className="modal-header">
                            <h5 className="modal-title" id="modalNiveauLabel">Ajouter Une Remarque</h5>
                            <button type="button" className="close" onClick={handleCloseModalRemarque} aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <p className="mbp">Ajouter une Remarque</p>

                            <div className="input">
                                <input
                                    type="text"
                                    className="form-control input"
                                    value={remarque}
                                    onChange={(e) => setRemarque(e.target.value)}
                                    placeholder="Entrez votre remarque"
                                />
                                <button
                                    type="button"
                                    onClick={editMode ? handleUpdateRemarque : handleAddRemarque}
                                    disabled={loading}
                                >
                                    {loading ? 'En cours...' : editMode ? 'Modifier' : 'Ajouter'}
                                </button>

                            </div>

                            <hr />
                            <div className="list-item">
                                {loadingRemarques ? (
                                    <p>Chargement des remarques...</p>
                                ) : remarques.length > 0 ? (
                                    remarques
                                        .filter(item => !item.archiver) // Filtre les remarques non archivées
                                        .map((item) => (
                                            <div className="item" key={item.id}>
                                                <p>{item.remarque}</p>
                                                <div className="item-btn">
                                                    <button onClick={() => handleEditClick(item)}>
                                                        <img src={edite} alt="Modifier" title="modifier" />
                                                    </button>
                                                    <button onClick={() => handleArchiveRemarque(item.id)}>
                                                        <img src={archive} alt="Archiver" />
                                                    </button>
                                                </div>
                                            </div>
                                        ))
                                ) : (
                                    <p>Aucune remarque ajoutée.</p>
                                )}
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" onClick={handleCloseModalRemarque}>
                                Fermer
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>,
        <div className="p-3 border rounded card mt-2">
            <div className="card shadow">
                <div className="card-header bg-primary text-white">
                    <h3 className="card-title mb-0">Gestion des Dispenses</h3>
                </div>

                <div className="card-body">
                    <div className="mb-4">
                        <h4 className="mb-3 text-primary">🎯 Sélectionnez :</h4>
                        <div className="d-flex flex-wrap align-items-center">
                            {/* Année scolaire */}
                            <div className="form-group ml-0" style={{ minWidth: '150px' }}>
                                <select
                                    className="form-control input"
                                    style={{ height: '40px' }}
                                    value={selectedAnnee?.id || ""}
                                    onChange={(e) => {
                                        const selected = annees.find((a) => a.id === parseInt(e.target.value));
                                        setSelectedAnnee(selected || null);
                                    }}
                                >
                                    <option value="">Année scolaire</option>
                                    {annees.map((annee) => {
                                        const debut = new Date(annee.datedebut).getFullYear();
                                        const fin = new Date(annee.datefin).getFullYear();
                                        return (
                                            <option key={annee.id} value={annee.id}>
                                                {debut} - {fin}
                                            </option>
                                        );
                                    })}
                                </select>
                            </div>

                            {/* Trimestre */}
                            <div className="form-group ml-2" style={{ minWidth: '150px' }}>
                                <select
                                    className="form-control input"
                                    style={{ height: '40px' }}
                                    value={selectedTrimestre || ''}
                                    onChange={(e) => setSelectedTrimestre(e.target.value)}
                                >
                                    <option value="">Trimestre</option>
                                    {Array.isArray(trimests) && trimests.map((trimestre) => (
                                        <option key={trimestre.id} value={trimestre.id}>
                                            {trimestre.titre}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Niveau */}
                            <div className="form-group ml-2" style={{ minWidth: '150px' }}>
                                <select
                                    className="form-control input"
                                    style={{ height: '40px' }}
                                    value={selectedNiveau || ''}
                                    onChange={(e) => setSelectedNiveau(e.target.value)}
                                >
                                    <option value="">Niveau</option>
                                    {niveaux.map((niveau) => (
                                        <option key={niveau.id} value={niveau.id}>
                                            {niveau.nomniveau}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Section */}
                            {selectedNiveau && sections.length > 0 && (
                                <div className="form-group ml-2" style={{ minWidth: '150px' }}>
                                    <select
                                        className="form-control input"
                                        style={{ height: '40px' }}
                                        value={selectedSection || ''}
                                        onChange={(e) => setSelectedSection(e.target.value)}
                                    >
                                        <option value="">Section</option>
                                        {sections.map((section) => (
                                            <option key={section.id} value={section.id}>
                                                {section.classe} {section.classearab && `(${section.classearab})`}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            {/* Matière */}
                            {selectedSection && (
                                <div className="form-group ml-2" style={{ minWidth: '200px' }}>
                                    <select
                                        className="form-control input"
                                        style={{ height: '40px' }}
                                        value={selectedMatiere?.id || ''}
                                        onChange={(e) => {
                                            const matiere = matieresNiveau.find(m => m.Matiere.id === parseInt(e.target.value));
                                            setSelectedMatiere(matiere?.Matiere || null);
                                        }}
                                    >
                                        <option value="">Matière</option>
                                        {matieresNiveau.map((matiere) => (
                                            <option key={matiere.Matiere.id} value={matiere.Matiere.id}>
                                                {matiere.Matiere.nom}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            )}
                        </div>
                    </div>

                    {selectedMatiere && (
                        <div className="mt-4">
                            <div className="table-responsive">
                                <Table striped bordered hover>
                                    <thead>
                                        <tr>
                                            <th>Nom complet</th>

                                            {/* Colonnes dynamiques selon matière et cycle */}
                                            {cycle === 'Primaire' && selectedMatiere.nom === 'Français' ? (
                                                <>
                                                    <th>Expression orale</th>
                                                    <th>Lecture</th>
                                                    <th>Production écrite</th>
                                                </>
                                            ) : (
                                                <th>Moyenne</th>
                                            )}

                                            {/* Checkbox globale à la fin */}
                                            <th>
                                                <div className="d-flex align-items-center" style={{ marginLeft: '30px', marginTop: '-20px' }}>
                                                    <Form.Check
                                                        type="checkbox"
                                                        id="exemption-all"
                                                        label={"All"}
                                                        className="mr-2"
                                                        checked={eleves.every(eleve =>
                                                            notesData[eleve.id]?.[selectedMatiere.id]?.exemption
                                                        )}
                                                        onChange={(e) => {
                                                            const isChecked = e.target.checked;
                                                            handleBulkUpdateExemption(
                                                                selectedMatiere.id,
                                                                isChecked ? "Exempté" : null
                                                            );
                                                        }}
                                                    />
                                                </div>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {eleves.map((eleve) => {
                                            const note = notesData[eleve.id]?.[selectedMatiere.id] || {};
                                            return (
                                                <tr key={eleve.id}>
                                                    <td>{eleve.User?.prenom} {eleve.User?.nom}</td>

                                                    {/* Données dynamiques selon cycle et matière */}
                                                    {cycle === 'Primaire' && selectedMatiere.nom === 'Français' ? (
                                                        <>
                                                            <td>{note.expression_orale || 'N/A'}</td>
                                                            <td>{note.lecture || 'N/A'}</td>
                                                            <td>{note.production_ecrite || 'N/A'}</td>
                                                        </>
                                                    ) : (
                                                        <td>{note.moyenne || 'N/A'}</td>
                                                    )}

                                                    {/* Checkbox individuelle */}
                                                    <td>
                                                        <Form.Check
                                                            type="checkbox"
                                                            id={`exemption-${eleve.id}`}
                                                            label={note.exemption ? "Dispenses" : "indispense "}
                                                            checked={!!note.exemption}
                                                            onChange={(e) =>
                                                                handleUpdateExemption(
                                                                    eleve.id,
                                                                    selectedMatiere.id,
                                                                    e.target.checked ? "Dispenses" : null
                                                                )
                                                            }
                                                        />
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </Table>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>,
        <div className="p-3 border rounded card mt-2">
            <div className="card shadow">
                <div className="card-header bg-primary text-white">
                    <h3 className="card-title mb-0">Gestion des absences et remarques</h3>
                </div>

                <div className="card-body">
                    <div className="mb-4">
                        <h4 className="mb-3 text-primary">🎯 Sélectionnez :</h4>
                        <div className="d-flex flex-wrap align-items-center">
                            {/* Année scolaire */}
                            <div className="form-group ml-0" style={{ minWidth: '150px' }}>
                                <select
                                    className="form-control input"
                                    style={{ height: '40px' }}
                                    value={selectedAnnee?.id || ""}
                                    onChange={(e) => {
                                        const selected = annees.find((a) => a.id === parseInt(e.target.value));
                                        setSelectedAnnee(selected || null);
                                    }}
                                >
                                    <option value="">Année scolaire</option>
                                    {annees.map((annee) => {
                                        const debut = new Date(annee.datedebut).getFullYear();
                                        const fin = new Date(annee.datefin).getFullYear();
                                        return (
                                            <option key={annee.id} value={annee.id}>
                                                {debut} - {fin}
                                            </option>
                                        );
                                    })}
                                </select>
                            </div>

                            {/* Trimestre */}
                            <div className="form-group ml-2" style={{ minWidth: '150px' }}>
                                <select
                                    className="form-control input"
                                    style={{ height: '40px' }}
                                    value={selectedTrimestre || ''}
                                    onChange={(e) => {
                                        const trimId = e.target.value;
                                        setSelectedTrimestre(trimId);
                                        // Trouver les dates du trimestre sélectionné
                                        const trim = trimests.find(t => t.id === trimId);
                                        if (trim) {
                                            setTrimestreDates({
                                                debut: trim.datedebut,
                                                fin: trim.datefin
                                            });
                                        }
                                    }}
                                >
                                    <option value="">Trimestre</option>
                                    {Array.isArray(trimests) && trimests.map((trimestre) => (
                                        <option key={trimestre.id} value={trimestre.id}>
                                            {trimestre.titre}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Niveau */}
                            <div className="form-group ml-2" style={{ minWidth: '150px' }}>
                                <select
                                    className="form-control input"
                                    style={{ height: '40px' }}
                                    value={selectedNiveau || ''}
                                    onChange={(e) => setSelectedNiveau(e.target.value)}
                                >
                                    <option value="">Niveau</option>
                                    {niveaux.map((niveau) => (
                                        <option key={niveau.id} value={niveau.id}>
                                            {niveau.nomniveau}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Section */}
                            {selectedNiveau && sections.length > 0 && (
                                <div className="form-group ml-2" style={{ minWidth: '150px' }}>
                                    <select
                                        className="form-control input"
                                        style={{ height: '40px' }}
                                        value={selectedSection || ''}
                                        onChange={(e) => setSelectedSection(e.target.value)}
                                    >
                                        <option value="">Section</option>
                                        {sections.map((section) => (
                                            <option key={section.id} value={section.id}>
                                                {section.classe} {section.classearab && `(${section.classearab})`}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            )}
                        </div>
                    </div>

                    {selectedSection && (
                        <div className="mt-4">
                            <div className="table-responsive">
                                <Table striped bordered hover>
                                    <thead>
                                        <tr>
                                            <th>Numéro Identification</th>
                                            <th>Nom & Prénom</th>
                                            <th>Absences</th>
                                            <th>Retards</th>
                                            <th>Justifications</th>
                                            {matieresNiveau.map((matiere) => (
                                                <th key={matiere.Matiere.id}>
                                                    {matiere.Matiere.nom} ({enseignantsParMatiere[matiere.Matiere.id]?.User?.prenom || 'N/A'})
                                                </th>
                                            ))}
                                            <th>Décision Finale</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {eleves.map((eleve) => (
                                            <AbsenceRemarqueRow
                                                key={eleve.id}
                                                eleve={eleve}
                                                matieres={matieresNiveau}
                                                enseignantsParMatiere={enseignantsParMatiere}
                                                selectedSection={selectedSection}
                                                selectedTrimestre={selectedTrimestre}
                                                trimestreDates={trimestreDates}
                                            />
                                        ))}
                                    </tbody>
                                </Table>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>,
        // Dans le tableau stepContents, remplacez le 4ème élément par :
        <div className="p-3 border rounded card mt-2">
            <div className="card shadow">
                <div className="card-header bg-primary text-white">
                    <h3 className="card-title mb-0">Décision Finale</h3>
                </div>

                <div className="card-body">
                    <div className="mb-4">
                        <h4 className="mb-3 text-primary">🎯 Sélectionnez :</h4>
                        <div className="d-flex flex-wrap align-items-center">
                            {/* Année scolaire */}
                            <div className="form-group ml-0" style={{ minWidth: '150px' }}>
                                <select
                                    className="form-control input"
                                    style={{ height: '40px' }}
                                    value={selectedAnnee?.id || ""}
                                    onChange={(e) => {
                                        const selected = annees.find((a) => a.id === parseInt(e.target.value));
                                        setSelectedAnnee(selected || null);
                                    }}
                                >
                                    <option value="">Année scolaire</option>
                                    {annees.map((annee) => {
                                        const debut = new Date(annee.datedebut).getFullYear();
                                        const fin = new Date(annee.datefin).getFullYear();
                                        return (
                                            <option key={annee.id} value={annee.id}>
                                                {debut} - {fin}
                                            </option>
                                        );
                                    })}
                                </select>
                            </div>

                            {/* Niveau */}
                            <div className="form-group ml-2" style={{ minWidth: '150px' }}>
                                <select
                                    className="form-control input"
                                    style={{ height: '40px' }}
                                    value={selectedNiveau || ''}
                                    onChange={(e) => setSelectedNiveau(e.target.value)}
                                >
                                    <option value="">Niveau</option>
                                    {niveaux.map((niveau) => (
                                        <option key={niveau.id} value={niveau.id}>
                                            {niveau.nomniveau}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Section */}
                            {selectedNiveau && sections.length > 0 && (
                                <div className="form-group ml-2" style={{ minWidth: '150px' }}>
                                    <select
                                        className="form-control input"
                                        style={{ height: '40px' }}
                                        value={selectedSection || ''}
                                        onChange={(e) => setSelectedSection(e.target.value)}
                                    >
                                        <option value="">Section</option>
                                        {sections.map((section) => (
                                            <option key={section.id} value={section.id}>
                                                {section.classe} {section.classearab && `(${section.classearab})`}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            )}
                        </div>
                    </div>

                    {selectedSection && (
                        <div className="mt-4">
                            <div className="d-flex justify-content-between mb-3">
                                <div>
                                    <Form.Check
                                        type="checkbox"
                                        label="Sélectionner tous"
                                        checked={allSelected}
                                        onChange={() => onSelectAll()}
                                    />
                                </div>
                                <Button
                                    variant="primary"
                                    onClick={handleUpdateEleves}
                                    disabled={selectedStudents.length === 0}
                                >
                                    Mettre à jour les élèves sélectionnés
                                </Button>
                            </div>

                            <div className="table-responsive">
                                <Table striped bordered hover>
                                    <thead>
                                        <tr>
                                            <th>Sélection</th>
                                            <th>Numéro Identification</th>
                                            <th>Nom & Prénom</th>
                                            <th>Trimestre 1</th>
                                            <th>Trimestre 2</th>
                                            <th>Trimestre 3</th>
                                            <th>Moyenne Annuelle</th>
                                            <th>Décision</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {eleves.map((eleve) => (
                                            <DecisionFinaleRow
                                                key={eleve.id}
                                                eleve={eleve}
                                                selectedAnnee={selectedAnnee}
                                                selectedNiveau={selectedNiveau}
                                                selectedSection={selectedSection}
                                                cycle={cycle}
                                                niveaux={niveaux}
                                                sections={sections}
                                                isSelected={selectedStudents.includes(eleve.id)}
                                                onSelect={handleSelectStudent}
                                                allSelected={allSelected}
                                            />
                                        ))}
                                    </tbody>
                                </Table>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>,
    ];


    return (
        <div className="container-fluid py-3">
            <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                    <li className="breadcrumb-item"><Link to="/dashboard">Dashboard</Link></li>
                    <li className="breadcrumb-item active">Gestion des notes</li>
                </ol>
            </nav>
            <div className="stepper-container bg-white p-3 rounded shadow-sm">
                <div className="d-flex align-items-center justify-content-between">
                    {steps.map((step) => (
                        <div
                            key={step.id}
                            className={`d-flex align-items-center step-item ${activeStep === step.id ? 'active' : ''}`}
                            onClick={() => setActiveStep(step.id)}
                            style={{ cursor: 'pointer' }}
                        >
                            <div className={`step-icon ${activeStep === step.id ? 'bg-primary' : 'bg-success'}`}>
                                {step.icon}
                            </div>
                            <span className={`step-label ml-2 ${activeStep === step.id ? 'text-primary fw-bold' : 'text-muted'}`}>
                                {step.label}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="step-content mt-3">
                {stepContents[activeStep]}
            </div>
            <style>{`
.stepper-container {
    overflow-x: auto;
    white-space: nowrap;
    padding: 1rem;
    scrollbar-width: none;
    -ms-overflow-style: none;
}

.stepper-container::-webkit-scrollbar {
    display: none;
}

.step-item {
    display: flex;
    align-items: center;
    padding: 0 10px;
    transition: all 0.3s ease;
}

.step-icon {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #e0e0e0;
    color: #757575;
    transition: all 0.3s ease;
}

.step-item.active .step-icon {
    background-color: #4e73df;
    color: white;
    transform: scale(1.1);
}

.step-label {
    font-size: 14px;
    color: #757575;
    font-weight: 500;
    margin-left: 8px;
    transition: all 0.3s ease;
}

.step-item.active .step-label {
    color: #4e73df;
    font-weight: 600;
}

@media (max-width: 768px) {
    .step-item {
        padding: 0 5px;
    }
    
    .step-icon {
        width: 25px;
        height: 25px;
        font-size: 12px;
    }
    
    .step-label {
        font-size: 12px;
        margin-left: 5px;
    }
        .exemption-switch .form-check-input {
    margin-left: 0.5rem;
    margin-right: 0.5rem;
}

.exemption-switch .form-check-label {
    margin-bottom: 0;
    font-size: 0.875rem;
}

.bulk-exemption-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
}
}
`}</style>
        </div>
    );
};

export default HorizontalStepper;