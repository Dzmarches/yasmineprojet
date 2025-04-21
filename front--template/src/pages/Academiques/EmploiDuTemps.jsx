import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Modal, Button, Form, Row, Col, Alert } from "react-bootstrap";

const EmploiDuTemps = () => {
    // États pour les données de base
    const [niveaux, setNiveaux] = useState([]);
    const [selectedNiveau, setSelectedNiveau] = useState(null);
    const [sections, setSections] = useState([]);
    const [selectedSection, setSelectedSection] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [emploiDuTemps, setEmploiDuTemps] = useState([]);
    const [enseignants, setEnseignants] = useState([]);
    const [enseignantDisponibilites, setEnseignantDisponibilites] = useState({});

    const [showMatieresModal, setShowMatieresModal] = useState(false);
    const [matieresNiveau, setMatieresNiveau] = useState([]);
    const [durees, setDurees] = useState({});

    // États pour la gestion des périodes
    const [showPeriodModal, setShowPeriodModal] = useState(false);
    const [periodes, setPeriodes] = useState([]);
    const [formData, setFormData] = useState({
        matin: { debut: '08:00', fin: '12:00', sousPeriodes: [] },
        dejeuner: { debut: '12:00', fin: '13:00', label: 'Déjeuner' },
        apres_midi: { debut: '13:00', fin: '16:00', sousPeriodes: [] }
    });

    const [jours] = useState(['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi']);

    const [generationStatus, setGenerationStatus] = useState({
        loading: false,
        success: null,
        message: ''
    });
    // generer l'emploi du temps
    const handleGenererAuto = async () => {
        if (!selectedNiveau || !selectedSection) {
            alert("Veuillez sélectionner un niveau et une section");
            return;
        }

        setGenerationStatus({ loading: true, success: null, message: '' });

        try {
            const token = localStorage.getItem("token");
            const response = await axios.post(
                "http://localhost:5000/emploi-du-temps/generer-emploi",
                {
                    niveauId: selectedNiveau,
                    sectionId: selectedSection
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            console.log('Réponse du serveur:', response.data);

            if (response.data.success) {
                // Recharger l'emploi du temps
                const edtResponse = await axios.get(
                    `http://localhost:5000/emploi-du-temps/section/${selectedSection}`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                setEmploiDuTemps(edtResponse.data);

                setGenerationStatus({
                    loading: false,
                    success: true,
                    message: response.data.message || 'Emploi du temps généré avec succès!'
                });

                if (response.data.nonPlanifiees) {
                    const message = response.data.nonPlanifiees
                        .map(m => `${m.nom} (manque ${m.manque} minutes)`)
                        .join('\n');

                    alert(`Emploi généré avec succès, mais certaines matières n'ont pas pu être entièrement planifiées:\n${message}`);
                }
            } else {
                setGenerationStatus({
                    loading: false,
                    success: false,
                    message: response.data.message || 'Erreur lors de la génération'
                });
            }
        } catch (error) {
            console.error("Erreur de génération:", error);
            setGenerationStatus({
                loading: false,
                success: false,
                message: error.response?.data?.message || 'Erreur lors de la communication avec le serveur'
            });
        }
    };

    // Fonction pour générer les créneaux à partir des périodes
    const generateCreneauxFromPeriodes = (periodes) => {
        const creneaux = [];

        // Formatage des heures (supprimer les secondes si présentes)
        const formatTime = (timeStr) => {
            if (!timeStr) return '';
            return timeStr.split(':').slice(0, 2).join(':');
        };

        // Trier les périodes par type (matin, déjeuner, après-midi)
        const periodesTriees = {
            matin: periodes.find(p => p.type === 'matin'),
            dejeuner: periodes.find(p => p.type === 'dejeuner'),
            apres_midi: periodes.find(p => p.type === 'apres_midi')
        };

        // Ajouter les créneaux du matin
        if (periodesTriees.matin) {
            const sousPeriodes = JSON.parse(periodesTriees.matin.sousPeriodes || '[]');
            if (sousPeriodes.length > 0) {
                sousPeriodes.forEach(sp => {
                    creneaux.push({
                        plage: `${formatTime(sp.debut)}-${formatTime(sp.fin)}`,
                        label: sp.label || '',
                        type: 'matin',
                        duree: calculateDuration(sp.debut, sp.fin)
                    });
                });
            } else {
                creneaux.push({
                    plage: `${formatTime(periodesTriees.matin.heureDebut)}-${formatTime(periodesTriees.matin.heureFin)}`,
                    label: '',
                    type: 'matin',
                    duree: calculateDuration(periodesTriees.matin.heureDebut, periodesTriees.matin.heureFin)
                });
            }
        }

        // Ajouter le créneau déjeuner
        if (periodesTriees.dejeuner) {
            creneaux.push({
                plage: `${formatTime(periodesTriees.dejeuner.heureDebut)}-${formatTime(periodesTriees.dejeuner.heureFin)}`,
                label: periodesTriees.dejeuner.label || 'Déjeuner',
                type: 'dejeuner',
                duree: 0 // Pas de cours pendant le déjeuner
            });
        }

        // Ajouter les créneaux de l'après-midi
        if (periodesTriees.apres_midi) {
            const sousPeriodes = JSON.parse(periodesTriees.apres_midi.sousPeriodes || '[]');
            if (sousPeriodes.length > 0) {
                sousPeriodes.forEach(sp => {
                    creneaux.push({
                        plage: `${formatTime(sp.debut)}-${formatTime(sp.fin)}`,
                        label: sp.label || '',
                        type: 'apres_midi',
                        duree: calculateDuration(sp.debut, sp.fin)
                    });
                });
            } else {
                creneaux.push({
                    plage: `${formatTime(periodesTriees.apres_midi.heureDebut)}-${formatTime(periodesTriees.apres_midi.heureFin)}`,
                    label: '',
                    type: 'apres_midi',
                    duree: calculateDuration(periodesTriees.apres_midi.heureDebut, periodesTriees.apres_midi.heureFin)
                });
            }
        }

        return creneaux;
    };

    // Fonction pour calculer la durée en minutes entre deux heures
    const calculateDuration = (startTime, endTime) => {
        const [startHours, startMinutes] = startTime.split(':').map(Number);
        const [endHours, endMinutes] = endTime.split(':').map(Number);

        return (endHours * 60 + endMinutes) - (startHours * 60 + startMinutes);
    };

    // Fonction principale pour générer l'emploi du temps
    const genererEmploiDuTemps = (matieres, creneaux, jours) => {
        const emploiDuTemps = [];
        const enseignantsDisponibilites = {};
        const matieresParJour = {};
        const joursDisponibles = jours.filter(j => j !== 'Dimanche'); // Exclure dimanche si nécessaire

        // Initialiser les disponibilités des enseignants
        matieres.forEach(matiere => {
            if (matiere.enseignantId) {
                enseignantsDisponibilites[matiere.enseignantId] = JSON.parse(JSON.stringify(matiere.disponibilites));
            }
        });

        // Initialiser le compteur de séances par jour pour chaque matière
        joursDisponibles.forEach(jour => {
            matieresParJour[jour] = {};
            matieres.forEach(matiere => {
                matieresParJour[jour][matiere.matiereId] = 0;
            });
        });

        // Trier les matières par priorité (celles avec plus de contraintes en premier)
        const matieresTriees = [...matieres].sort((a, b) => {
            // Priorité aux matières avec préférence spécifique
            if (a.preference && !b.preference) return -1;
            if (!a.preference && b.preference) return 1;

            // Priorité aux matières avec plus de séances par jour
            if (a.seancesParJour > b.seancesParJour) return -1;
            if (a.seancesParJour < b.seancesParJour) return 1;

            // Priorité aux matières avec plus de durée totale
            if (a.dureeTotale > b.dureeTotale) return -1;
            if (a.dureeTotale < b.dureeTotale) return 1;

            return 0;
        });

        // Fonction pour trouver un créneau disponible
        const trouverCreneauDisponible = (matiere, jour) => {
            // Filtrer les créneaux selon la préférence de la matière
            let creneauxFiltres = creneaux.filter(c => c.duree >= matiere.dureeSeance);

            if (matiere.preference === "Uniquement La matiné") {
                creneauxFiltres = creneauxFiltres.filter(c => c.type === 'matin');
            } else if (matiere.preference === "Uniquement L'après-midi") {
                creneauxFiltres = creneauxFiltres.filter(c => c.type === 'apres_midi');
            } else if (matiere.preference === "Plus Grand Moitié La Matin") {
                // Priorité matin mais peut aller après-midi si nécessaire
                const creneauxMatin = creneauxFiltres.filter(c => c.type === 'matin');
                if (creneauxMatin.length > 0) {
                    creneauxFiltres = creneauxMatin;
                }
            }
            // Pour "Moitié Moitié", on garde tous les créneaux

            // Vérifier la disponibilité de l'enseignant si existant
            if (matiere.enseignantId) {
                const dispoEnseignant = enseignantsDisponibilites[matiere.enseignantId]?.[jour.toLowerCase()];
                if (dispoEnseignant && dispoEnseignant.disponible === false) {
                    return null; // Enseignant indisponible ce jour
                }
            }

            // Trouver un créneau non encore attribué
            for (const creneau of creneauxFiltres) {
                const creneauDejaUtilise = emploiDuTemps.some(
                    edt => edt.jour === jour && edt.heure === creneau.plage
                );

                if (!creneauDejaUtilise) {
                    // Vérifier que l'enseignant est disponible à cette heure si nécessaire
                    if (matiere.enseignantId) {
                        const dispoEnseignant = enseignantsDisponibilites[matiere.enseignantId]?.[jour.toLowerCase()];
                        if (dispoEnseignant && dispoEnseignant.heures && dispoEnseignant.heures.length > 0) {
                            const [debut, fin] = creneau.plage.split('-');
                            const heureDebut = debut.replace(':', '');
                            const heureFin = fin.replace(':', '');

                            const estDisponible = dispoEnseignant.heures.some(h => {
                                const [hDebut, hFin] = h.split('-');
                                return heureDebut >= hDebut && heureFin <= hFin;
                            });

                            if (!estDisponible) continue;
                        }
                    }

                    return creneau;
                }
            }

            return null;
        };

        // Algorithme de génération
        matieresTriees.forEach(matiere => {
            let dureeRestante = matiere.dureeTotale;
            let joursEssayes = 0;
            const joursMelanges = [...joursDisponibles].sort(() => Math.random() - 0.5);

            while (dureeRestante > 0 && joursEssayes < joursDisponibles.length * 2) {
                const jourIndex = joursEssayes % joursDisponibles.length;
                const jour = joursMelanges[jourIndex];

                // Vérifier le nombre maximum de séances par jour pour cette matière
                if (matieresParJour[jour][matiere.matiereId] >= matiere.seancesParJour) {
                    joursEssayes++;
                    continue;
                }

                const creneau = trouverCreneauDisponible(matiere, jour);
                if (creneau) {
                    emploiDuTemps.push({
                        jour,
                        heure: creneau.plage,
                        duree: matiere.dureeSeance,
                        niveauId: selectedNiveau,
                        sectionId: selectedSection,
                        matiereId: matiere.matiereId,
                        enseignantId: matiere.enseignantId
                    });

                    dureeRestante -= matiere.dureeSeance;
                    matieresParJour[jour][matiere.matiereId]++;

                    // Marquer le créneau comme utilisé
                    creneau.duree -= matiere.dureeSeance;
                    if (creneau.duree <= 0) {
                        creneaux.splice(creneaux.indexOf(creneau), 1);
                    }
                }

                joursEssayes++;
            }

            if (dureeRestante > 0) {
                console.warn(`Impossible d'attribuer toute la durée pour la matière ${matiere.Matiere?.nom}`);
            }
        });

        return emploiDuTemps;
    };

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

            // Initialiser tous les champs
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

            setShowMatieresModal(true);
        } catch (error) {
            console.error("Erreur lors du chargement des matières:", error);
            alert("Erreur lors du chargement des matières");
        }
    };

    const handleFieldChange = (id, field, value) => {
        setDurees(prev => ({
            ...prev,
            [id]: {
                ...prev[id],
                [field]: value
            }
        }));
    };

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
                        nombreseanceparjour: update.nombreseanceparjour, // Bien inclure ce champ
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

    const handleDureeChange = (niveauMatiereId, value) => {
        setDurees(prev => ({
            ...prev,
            [niveauMatiereId]: value
        }));
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

    // Charger les sections quand un niveau est sélectionné
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
                    setError("Erreur lors du chargement des sections.");
                    console.error(error);
                }
            };

            fetchSections();
        }
    }, [selectedNiveau]);

    // Charger l'emploi du temps et les périodes quand une section est sélectionnée
    // Dans le useEffect qui charge les périodes
    useEffect(() => {
        if (selectedSection) {
            const fetchData = async () => {
                try {
                    const token = localStorage.getItem("token");

                    // Charger l'emploi du temps
                    const edtResponse = await axios.get(
                        `http://localhost:5000/emploi-du-temps/section/${selectedSection}`,
                        { headers: { Authorization: `Bearer ${token}` } }
                    );
                    console.log("Structure des données:", edtResponse.data);
                    setEmploiDuTemps(edtResponse.data);

                    // Charger les périodes depuis la base de données
                    const periodesResponse = await axios.get(
                        `http://localhost:5000/periodes/${selectedNiveau}/${selectedSection}`,
                        { headers: { Authorization: `Bearer ${token}` } }
                    );

                    // Fonction pour parser les sous-périodes
                    const parseSousPeriodes = (sousPeriodesStr) => {
                        try {
                            if (!sousPeriodesStr || sousPeriodesStr === "[]") return [];
                            return JSON.parse(sousPeriodesStr);
                        } catch (error) {
                            console.error("Erreur de parsing des sous-périodes:", error);
                            return [];
                        }
                    };

                    // Formater les données pour l'état local
                    const formattedPeriodes = {
                        matin: { debut: '08:00:00', fin: '12:00:00', sousPeriodes: [] },
                        dejeuner: { debut: '12:00:00', fin: '13:00:00', label: 'Déjeuner' },
                        apres_midi: { debut: '13:00:00', fin: '16:00:00', sousPeriodes: [] }
                    };

                    periodesResponse.data.forEach(p => {
                        const sousPeriodes = parseSousPeriodes(p.sousPeriodes);

                        if (p.type === 'dejeuner') {
                            formattedPeriodes.dejeuner = {
                                debut: p.heureDebut,
                                fin: p.heureFin,
                                label: p.label || 'Déjeuner'
                            };
                        } else {
                            formattedPeriodes[p.type] = {
                                debut: p.heureDebut,
                                fin: p.heureFin,
                                sousPeriodes: sousPeriodes
                            };
                        }
                    });

                    setFormData(formattedPeriodes);
                    setPeriodes(periodesResponse.data);
                } catch (error) {
                    console.error("Erreur lors du chargement des données:", error);
                    // En cas d'erreur, utiliser les valeurs par défaut
                    setFormData({
                        matin: { debut: '08:00:00', fin: '12:00:00', sousPeriodes: [] },
                        dejeuner: { debut: '12:00:00', fin: '13:00:00', label: 'Déjeuner' },
                        apres_midi: { debut: '13:00:00', fin: '16:00:00', sousPeriodes: [] }
                    });
                    setPeriodes([]);
                }
            };

            fetchData();
        }
    }, [selectedSection, selectedNiveau]);

    // Gestion de la modal
    const handleOpenPeriodModal = () => setShowPeriodModal(true);
    const handleClosePeriodModal = () => setShowPeriodModal(false);

    // Gestion des changements de temps
    const handleTimeChange = (periode, field, value) => {
        setFormData(prev => ({
            ...prev,
            [periode]: {
                ...prev[periode],
                [field]: value
            }
        }));
    };

    // Gestion du label du déjeuner
    const handleDejeunerLabelChange = (value) => {
        setFormData(prev => ({
            ...prev,
            dejeuner: {
                ...prev.dejeuner,
                label: value
            }
        }));
    };

    // Gestion des sous-périodes
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

    // Sauvegarde des périodes
    const handleSavePeriodes = async () => {
        try {
            const token = localStorage.getItem("token");
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
                    niveauId: selectedNiveau,
                    sectionId: selectedSection,
                    periodes: periodesToSave
                },
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            // Recharger les périodes après sauvegarde
            const response = await axios.get(
                `http://localhost:5000/periodes/${selectedNiveau}/${selectedSection}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setPeriodes(response.data);

            handleClosePeriodModal();
            alert('Périodes enregistrées avec succès!');
        } catch (error) {
            console.error("Erreur lors de l'enregistrement:", error);
            alert(`Erreur: ${error.response?.data?.message || error.message}`);
        }
    };

    // Génération des heures basées sur les périodes configurées
    const generateHeures = () => {
        let heures = [];

        // Formatage des heures (supprimer les secondes si présentes)
        const formatTime = (timeStr) => {
            if (!timeStr) return '';
            return timeStr.split(':').slice(0, 2).join(':');
        };

        // Matin
        if (formData.matin.sousPeriodes.length > 0) {
            formData.matin.sousPeriodes.forEach(sp => {
                heures.push({
                    plage: `${formatTime(sp.debut)}-${formatTime(sp.fin)}`,
                    label: sp.label || '',
                    type: 'matin'
                });
            });
        } else {
            heures.push({
                plage: `${formatTime(formData.matin.debut)}-${formatTime(formData.matin.fin)}`,
                label: '',
                type: 'matin'
            });
        }

        // Déjeuner
        heures.push({
            plage: `${formatTime(formData.dejeuner.debut)}-${formatTime(formData.dejeuner.fin)}`,
            label: formData.dejeuner.label,
            type: 'dejeuner'
        });

        // Après-midi
        if (formData.apres_midi.sousPeriodes.length > 0) {
            formData.apres_midi.sousPeriodes.forEach(sp => {
                heures.push({
                    plage: `${formatTime(sp.debut)}-${formatTime(sp.fin)}`,
                    label: sp.label || '',
                    type: 'apres_midi'
                });
            });
        } else {
            heures.push({
                plage: `${formatTime(formData.apres_midi.debut)}-${formatTime(formData.apres_midi.fin)}`,
                label: '',
                type: 'apres_midi'
            });
        }

        return heures;
    };

    // Gestion des sélections
    const handleNiveauClick = (niveauId) => {
        setSelectedNiveau(niveauId);
    };

    const handleSectionClick = (sectionId) => {
        setSelectedSection(sectionId);
    };

    if (loading) return <div className="d-flex justify-content-center mt-5"><div className="spinner-border" role="status"></div></div>;
    if (error) return <Alert variant="danger" className="mt-3">{error}</Alert>;

    return (
        <div className="container-fluid py-3">
            <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                    <li className="breadcrumb-item"><Link to="/dashboard">Dashboard</Link></li>
                    <li className="breadcrumb-item active">Emploi du temps</li>
                </ol>
            </nav>

            <div className="card shadow">
                <div className="card-header bg-primary text-white">
                    <h3 className="card-title mb-0">
                        <i className="fas fa-calendar-alt mr-2"></i>
                        Gestion des emplois du temps
                    </h3>
                </div>
                <div className="card-body">
                    {/* Sélection du niveau */}
                    <div className="mb-4">
                        <h4>Sélectionnez un niveau :</h4>
                        <div className="d-flex flex-wrap gap-2">
                            {niveaux.map((niveau) => (
                                <button
                                    key={niveau.id}
                                    onClick={() => handleNiveauClick(niveau.id)}
                                    className={`btn ${selectedNiveau === niveau.id ? 'btn-success' : 'btn-outline-secondary'}`}
                                >
                                    {niveau.nomniveau}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Sélection de la section */}
                    {selectedNiveau && sections.length > 0 && (
                        <div className="mb-4">
                            <h4>Sélectionnez une section :</h4>
                            <div className="d-flex flex-wrap gap-2">
                                {sections.map((section) => (
                                    <button
                                        key={section.id}
                                        onClick={() => handleSectionClick(section.id)}
                                        className={`btn ${selectedSection === section.id ? 'btn-primary' : 'btn-outline-secondary'}`}
                                    >
                                        {section.classe} {section.classearab && `(${section.classearab})`}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Affichage de l'emploi du temps */}
                    {selectedSection && (
                        <div className="mt-4">
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <h4 className="mb-0">
                                    Emploi du temps - {sections.find(s => s.id === selectedSection)?.classe}
                                </h4>
                                <div>
                                    <button
                                        className="btn btn-warning ml-2"
                                        onClick={handleGenererAuto}
                                        disabled={generationStatus.loading}
                                    >
                                        {generationStatus.loading ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true"></span>
                                                Génération...
                                            </>
                                        ) : (
                                            <>
                                                <i className="fas fa-magic mr-2"></i>
                                                Générer automatiquement
                                            </>
                                        )}
                                    </button>
                                    <button
                                        className="btn btn-secondary mr-2"
                                        onClick={handleOpenMatieresModal}
                                    >
                                        <i className="fas fa-book mr-2"></i>
                                        Durée des matières
                                    </button>
                                    <button
                                        className="btn btn-info"
                                        onClick={handleOpenPeriodModal}
                                    >
                                        <i className="fas fa-clock mr-2"></i>
                                        Configurer les périodes
                                    </button>
                                </div>
                            </div>

                            <div className="table-responsive">
                                <table className="table table-bordered table-hover">
                                    <thead className="thead-light">
                                        <tr>
                                            <th style={{ width: '15%' }}>Heures/Jours</th>
                                            {jours.map((jour) => (
                                                <th key={jour} className="text-center">{jour}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {generateHeures().map((heure, idx) => (
                                            <tr key={idx} className={heure.type === 'dejeuner' ? 'table-warning' : ''}>
                                                <td>
                                                    {heure.plage}
                                                    {heure.label && <div className="text-muted small">{heure.label}</div>}
                                                </td>
                                                {jours.map((jour) => {
                                                    // Pour le déjeuner, on affiche juste le label
                                                    if (heure.type === 'dejeuner') {
                                                        return (
                                                            <td key={`${jour}-${idx}`} className="align-middle text-center">
                                                                <div className="text-muted fst-italic">
                                                                    {heure.label}
                                                                </div>
                                                            </td>
                                                        );
                                                    }

                                                    const cours = emploiDuTemps.find(
                                                        (c) =>
                                                            c.jour.toLowerCase() === jour.toLowerCase() &&
                                                            c.heure === heure.plage
                                                    );

                                                    return (
                                                        <td key={`${jour}-${idx}`} className="align-middle">
                                                            {cours ? (
                                                                <div className="text-center p-2 bg-light rounded">
                                                                    <strong className="d-block">{cours.Matiere?.nom || cours.matiere?.nom || 'Matière inconnue'}</strong>
                                                                    {cours.Enseignant?.Employe?.User ? (
                                                                        <span className="text-muted">
                                                                            {cours.Enseignant.Employe.User.nom} {cours.Enseignant.Employe.User.prenom}
                                                                        </span>
                                                                    ) : (
                                                                        <span className="text-muted">Enseignant non assigné</span>
                                                                    )}
                                                                </div>
                                                            ) : (
                                                                <div className="text-center text-muted">-</div>
                                                            )}
                                                        </td>
                                                    );
                                                })}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Boutons d'action */}
                            <div className="mt-3 d-flex justify-content-end gap-2">
                                <button className="btn btn-success">
                                    <i className="fas fa-plus mr-2"></i>
                                    Ajouter un cours
                                </button>
                                <button className="btn btn-primary">
                                    <i className="fas fa-print mr-2"></i>
                                    Imprimer
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Modal de configuration des périodes */}
            <Modal show={showPeriodModal} onHide={handleClosePeriodModal} size="lg">
                <Modal.Header closeButton className="bg-primary text-white">
                    <Modal.Title>Configuration des périodes horaires</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        {/* Configuration matin */}
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
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClosePeriodModal}>
                        <i className="fas fa-times mr-2"></i>
                        Annuler
                    </Button>
                    <Button variant="primary" onClick={handleSavePeriodes}>
                        <i className="fas fa-save mr-2"></i>
                        Enregistrer les périodes
                    </Button>
                </Modal.Footer>
            </Modal>


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
                                    <th style={{ width: '120px' }}>Durée totale (h/semaine)</th>
                                    <th style={{ width: '120px' }}>Durée séance (min)/jour</th>
                                    <th style={{ width: '150px' }}>Nb. séances/jour</th>
                                    <th style={{ width: '150px' }}>Préférence</th>
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
                                                value={durees[item.id]?.duree || ''}
                                                onChange={(e) => handleFieldChange(item.id, 'duree', e.target.value)}
                                                placeholder="Heures"
                                            />
                                        </td>
                                        <td>
                                            <Form.Control
                                                type="number"
                                                min="0"
                                                value={durees[item.id]?.dureeseance || ''}
                                                onChange={(e) => handleFieldChange(item.id, 'dureeseance', e.target.value)}
                                                placeholder="Minutes"
                                            />
                                        </td>
                                        <td>
                                            <Form.Control
                                                type="number"
                                                min="0"
                                                max="10"
                                                value={durees[item.id]?.nombreseanceparjour || ''}
                                                onChange={(e) => handleFieldChange(item.id, 'nombreseanceparjour', e.target.value)}
                                                placeholder="Nombre"
                                            />
                                        </td>
                                        <td>
                                            <Form.Control
                                                as="select"
                                                value={durees[item.id]?.preference || ''}
                                                onChange={(e) => handleFieldChange(item.id, 'preference', e.target.value)}
                                            >
                                                <option value="">Sélectionner</option>
                                                <option value="Uniquement La matiné">Uniquement La matiné</option>
                                                <option value="Uniquement L'après-midi">Uniquement L'après-midi</option>
                                                <option value="Plus Grand Moitié La Matin">Plus Grand Moitié La Matin</option>
                                                <option value="Moitié Moitié">Moitié Moitié</option>
                                            </Form.Control>
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
                    <Button variant="primary" onClick={handleSaveConfigurations}>
                        <i className="fas fa-save mr-2"></i>
                        Enregistrer
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default EmploiDuTemps;