import React, { useState, useEffect } from 'react';

import axios from 'axios';
import { Link } from 'react-router-dom';
import parentIcon from '../../assets/imgs/family.png';
import { Modal, Button, Form } from 'react-bootstrap';
import moment from 'moment';

import { FaBookOpen as NotesIcon, FaCalendarAlt as EventNoteIcon, FaChild as PersonIcon, FaHome as HomeworkIcon, FaFileUpload as UploadIcon } from 'react-icons/fa';

const ListeDeSesEnfants = () => {
    const [enfants, setEnfants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedEnfant, setSelectedEnfant] = useState(null);
    const [activeStep, setActiveStep] = useState(0);
    const [devoirs, setDevoirs] = useState([]);
    const [loadingDevoirs, setLoadingDevoirs] = useState(false);

    const [presences, setPresences] = useState([]);
    const [loadingPresences, setLoadingPresences] = useState(false);
    const [showJustifyModal, setShowJustifyModal] = useState(false);
    const [selectedPresence, setSelectedPresence] = useState(null);
    const [justification, setJustification] = useState('');
    const [periode, setPeriode] = useState('matin');
    const [file, setFile] = useState(null);

    const [showReportAbsenceModal, setShowReportAbsenceModal] = useState(false);
    const [absenceDate, setAbsenceDate] = useState('');
    const [absencePeriod, setAbsencePeriod] = useState('matin');
    const [absenceReason, setAbsenceReason] = useState('');

    const [anneesScolaires, setAnneesScolaires] = useState([]);
    const [contrats, setContrats] = useState([]);
    const [selectedAnnee, setSelectedAnnee] = useState(null);
    const [trimestres, setTrimestres] = useState([]);
    const [selectedTrimestre, setSelectedTrimestre] = useState(null);
    const [notes, setNotes] = useState([]);
    const [loadingNotes, setLoadingNotes] = useState(false);
    const [showNotesModal, setShowNotesModal] = useState(false);
    const [LoadingContrats, setLoadingContrats] = useState(false);
    const [showModalC, setShowModalC] = useState(false);
    const [selectedContrat, setSelectedContrat] = useState(null);
    const [Today, setToday] = useState('');

    const handleShowModalC = (contrat) => {
        setSelectedContrat(contrat);
        setShowModalC(true);
    };
    const handleCloseModalC = () => {
        setSelectedContrat(null);
        setShowModalC(false);
    };

    const fetchContrats = async (enfantId) => {
        try {
            setLoadingContrats(true);
            const token = localStorage.getItem('token');
            const response = await axios.get(`http://localhost:5000/contrat/listePaimentEleve/${enfantId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            const { contrats, today } = response.data;
            setContrats(contrats);
            setToday(today);
            setLoadingContrats(false);
        } catch (error) {
            console.error('Erreur lors de la récupération des contrats:',
                error.response?.data || error.message);
            setLoadingContrats(false);
        }
    };
    const fetchAnneesScolaires = async (enfantId) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`http://localhost:5000/parent/enfant/${enfantId}/annees-scolaires`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setAnneesScolaires(response.data);
        } catch (error) {
            console.error('Erreur lors de la récupération des années scolaires:', error);
        }
    };

    const fetchTrimestres = async (enfantId, anneeId) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`http://localhost:5000/parent/enfant/${enfantId}/annee/${anneeId}/trimestres`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setTrimestres(response.data);
        } catch (error) {
            console.error('Erreur lors de la récupération des trimestres:', error);
        }
    };

    const fetchNotes = async (enfantId, trimestreId) => {
        try {
            setLoadingNotes(true);
            const token = localStorage.getItem('token');
            const response = await axios.get(`http://localhost:5000/parent/enfant/${enfantId}/trimestre/${trimestreId}/notes`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setNotes(response.data);
            setLoadingNotes(false);
            setShowNotesModal(true);
        } catch (error) {
            console.error('Erreur lors de la récupération des notes:', error);
            setLoadingNotes(false);
        }
    };
    const handleAnneeClick = (annee) => {
        setSelectedAnnee(annee);
        fetchTrimestres(selectedEnfant.id, annee.id);
    };
    const handleTrimestreClick = (trimestre) => {
        setSelectedTrimestre(trimestre);
        fetchNotes(selectedEnfant.id, trimestre.trimestId);
    };
    const handleEnfantClick = async (enfantId) => {
        try {
            const token = localStorage.getItem('token');

            // Charger les infos de l'enfant
            const enfantResponse = await axios.get(`http://localhost:5000/parent/enfant/${enfantId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setSelectedEnfant(enfantResponse.data);

            // Charger les années scolaires
            await fetchAnneesScolaires(enfantId);

            // Charger les devoirs de l'enfant
            await fetchDevoirs(enfantId);

            // Charger les présences de l'enfant
            await fetchPresences(enfantId);
            await fetchContrats(enfantId);
        } catch (error) {
            console.error('Erreur lors de la récupération des détails de l\'enfant:', error);
        }
    };
    const isWithin7Days = (dateString) => {
        const date = new Date(dateString);
        const today = new Date();
        const diffTime = Math.abs(today - date);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays <= 7;
    };
    const submitPlannedAbsence = async () => {
        try {
            const token = localStorage.getItem('token');
            await axios.post(`http://localhost:5000/parent/presences/${selectedEnfant.id}/absences`, {
                date: absenceDate,
                periode: absencePeriod,
                raison: absenceReason
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            await fetchPresences(selectedEnfant.id);
            setShowReportAbsenceModal(false);
            alert('Absence signalée avec succès');
        } catch (error) {
            console.error('Erreur:', error);
            alert('Erreur lors du signalement');
        }
    };
    useEffect(() => {
        const fetchEnfants = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:5000/parent/mes-enfants', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setEnfants(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Erreur lors de la récupération des enfants:', error);
                setLoading(false);
            }
        };

        fetchEnfants();
    }, []);

    // const handleEnfantClick = async (enfantId) => {
    //     try {
    //         const token = localStorage.getItem('token');
    //         const response = await axios.get(`http://localhost:5000/parent/enfant/${enfantId}`, {
    //             headers: { Authorization: `Bearer ${token}` }
    //         });
    //         setSelectedEnfant(response.data);
    //     } catch (error) {
    //         console.error('Erreur lors de la récupération des détails de l\'enfant:', error);
    //     }
    // };

    const downloadDevoir = async (filename) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(
                `http://localhost:5000/devoir/download/${filename}`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                    responseType: 'blob'
                }
            );

            // Créer un lien de téléchargement
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', filename);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error("Erreur lors du téléchargement:", error);
            alert("Erreur lors du téléchargement du fichier");
        }
    };
    const fetchDevoirs = async (enfantId) => {
        try {
            setLoadingDevoirs(true);
            const token = localStorage.getItem('token');
            const response = await axios.get(`http://localhost:5000/parent/enfant/${enfantId}/devoirs`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            console.log("Réponse des devoirs:", response.data); // <-- Ajoutez ce log
            setDevoirs(response.data);
            setLoadingDevoirs(false);
        } catch (error) {
            console.error('Erreur lors de la récupération des devoirs:', error.response?.data || error.message);
            setLoadingDevoirs(false);
        }
    };
    // const handleEnfantClick = async (enfantId) => {
    //     try {
    //         const token = localStorage.getItem('token');

    //         // Charger les infos de l'enfant
    //         const enfantResponse = await axios.get(`http://localhost:5000/parent/enfant/${enfantId}`, {
    //             headers: { Authorization: `Bearer ${token}` }
    //         });
    //         setSelectedEnfant(enfantResponse.data);

    //         // Charger les devoirs de l'enfant
    //         await fetchDevoirs(enfantId);
    //     } catch (error) {
    //         console.error('Erreur lors de la récupération des détails de l\'enfant:', error);
    //     }
    // };
    const fetchPresences = async (enfantId) => {
        try {
            setLoadingPresences(true);
            const token = localStorage.getItem('token');
            const response = await axios.get(`http://localhost:5000/parent/enfant/${enfantId}/presences`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setPresences(response.data);
            setLoadingPresences(false);
        } catch (error) {
            console.error('Erreur lors de la récupération des présences:', error);
            setLoadingPresences(false);
        }
    };
    // const handleEnfantClick = async (enfantId) => {
    //     try {
    //         const token = localStorage.getItem('token');

    //         // Charger les infos de l'enfant
    //         const enfantResponse = await axios.get(`http://localhost:5000/parent/enfant/${enfantId}`, {
    //             headers: { Authorization: `Bearer ${token}` }
    //         });
    //         setSelectedEnfant(enfantResponse.data);

    //         // Charger les devoirs de l'enfant
    //         await fetchDevoirs(enfantId);

    //         // Charger les présences de l'enfant
    //         await fetchPresences(enfantId);
    //     } catch (error) {
    //         console.error('Erreur lors de la récupération des détails de l\'enfant:', error);
    //     }
    // };
    const handleJustify = (presence) => {
        setSelectedPresence(presence);
        setShowJustifyModal(true);
    };

    const submitJustification = async () => {
        try {
            const token = localStorage.getItem('token');
            const formData = new FormData();
            formData.append('justificationText', justification);
            formData.append('periode', periode);
            if (file) {
                formData.append('fichier', file);
            }

            await axios.post(
                `http://localhost:5000/parent/presences/${selectedPresence.id}/justifier`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );

            // Recharger les présences
            await fetchPresences(selectedEnfant.id);
            setShowJustifyModal(false);
            setJustification('');
            setFile(null);
            alert('Justification enregistrée avec succès');
        } catch (error) {
            console.error('Erreur lors de l\'envoi de la justification:', error);
            alert('Erreur lors de l\'envoi de la justification');
        }
    };
    const downloadJustification = (filename) => {
        window.open(`http://localhost:5000/${filename}`, '_blank');
    };
    const getColumnsByCycle = (cycle) => {
        switch (cycle) {
            case 'Primaire':
                return {
                    regular: [ // Colonnes pour les matières normales
                        {
                            id: 'eval_continue',
                            label: 'التقويم المستمر / Évaluation continue',
                            subColumns: [
                                { id: 'expression_orale', label: 'التعبير و التواصل الشفوي / Expression et communication orale' },
                                { id: 'lecture', label: 'القراءة و المحفوظات / Lecture et archives' },
                                { id: 'production_ecrite', label: 'الإنتاج الكتابي / Production écrite' }
                            ]
                        },
                        { id: 'moyenne_eval', label: 'معدل التقويم المستمر / Moyenne évaluation continue' },
                        { id: 'examens', label: 'الإختبارات / Examens' },
                        { id: 'moyenne', label: 'معدل / Moyenne' },
                        { id: 'remarque', label: 'Remarque' }
                    ],
                    math: [ // Colonnes spécifiques pour les mathématiques
                        {
                            id: 'eval_continue_math',
                            label: 'التقويم المستمر / Évaluation continue (Maths)',
                            subColumns: [
                                { id: 'calcul', label: 'الحساب /10' },
                                { id: 'grandeurs_mesures', label: 'المقادير و القياس /10' },
                                { id: 'organisation_donnees', label: 'تنظيم المعطيات /10' },
                                { id: 'espace_geometrie', label: 'الفضاء و الهندسة /10' }
                            ]
                        },
                        { id: 'moyenne_eval_math', label: 'معدل التقويم المستمر / Moyenne évaluation continue' },
                        { id: 'examens_math', label: 'الإختبارات / Examens' },
                        { id: 'moyenne_math', label: 'معدل / Moyenne' },
                        { id: 'remarque_math', label: 'Remarque' }
                    ]
                };
            case 'Cem':
                return {
                    regular: [
                        { id: 'eval_continue', label: 'التقويم المستمر / Évaluation continue' },
                        { id: 'devoir1', label: 'الفرض الأول / Devoir 1' },
                        { id: 'devoir2', label: 'الفرض الثاني / Devoir 2' },
                        { id: 'moyenne_eval', label: 'معدل التقويم / Moyenne évaluation' },
                        { id: 'examens', label: 'الإختبارات / Examens' },
                        { id: 'moyenne', label: 'معدل / Moyenne' },
                        { id: 'coefficient', label: 'معامل / Coefficient' },
                        { id: 'moyenne_total', label: 'Moyenne totale' }
                    ]
                };
            case 'Lycée':
                return {
                    regular: [
                        { id: 'eval_continue', label: 'التقويم المستمر / Évaluation continue' },
                        { id: 'travaux_pratiques', label: 'أعمال التطبيقية / Travaux pratiques' },
                        { id: 'moyenne_devoirs', label: 'معدل الفروض / Moyenne devoirs' },
                        { id: 'examens', label: 'الإختبارات / Examens' },
                        { id: 'moyenne', label: 'معدل / Moyenne' },
                        { id: 'coefficient', label: 'معامل / Coefficient' },
                        { id: 'moyenne_total', label: 'Moyenne totale' }
                    ]
                };
            default:
                return { regular: [] };
        }
    };

    const getMathColumnsForPrimaire = () => {
        return [
            {
                id: 'eval_continue_math',
                label: 'التقويم المستمر / Évaluation continue (Maths)',
                subColumns: [
                    { id: 'calcul', label: 'الحساب /10' },
                    { id: 'grandeurs_mesures', label: 'المقادير و القياس /10' },
                    { id: 'organisation_donnees', label: 'تنظيم المعطيات /10' },
                    { id: 'espace_geometrie', label: 'الفضاء و الهندسة /10' }
                ]
            },
            { id: 'moyenne_eval_math', label: 'معدل التقويم المستمر / Moyenne évaluation continue' },
            { id: 'examens_math', label: 'الإختبارات / Examens' },
            { id: 'moyenne_math', label: 'معدل / Moyenne' },
            { id: 'remarque_math', label: 'Remarque' }
        ];
    };
    const NoteTable = ({ notes, columns }) => {
        const flattenedColumns = columns.flatMap(col =>
            col.subColumns ? col.subColumns : [col]
        );
        return (

            <div className="table-responsive" style={{ marginBottom: '20px' }}>
                <table className="table table-striped">
                    <thead style={{ backgroundColor: '#2c3e50', color: 'white' }}>
                        <tr>
                            <th style={{ padding: '12px 15px' }}>Matière</th>
                            {flattenedColumns.map(col => (
                                <th key={col.id} style={{ padding: '12px 15px' }}>{col.label}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {notes.map(note => (
                            <tr key={note.id}>
                                <td style={{ padding: '12px 15px', fontWeight: '500' }}>
                                    {note.Matiere.nom}
                                </td>
                                {flattenedColumns.map(col => (
                                    <td key={col.id} style={{ padding: '12px 15px' }}>
                                        {note[col.id] ?? '-'}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    };
    const steps = [
        { label: 'Informations', icon: <PersonIcon /> },
        { label: 'Notes', icon: <NotesIcon /> },
        { label: 'Absences', icon: <EventNoteIcon /> },
        { label: 'Devoirs', icon: <HomeworkIcon /> },
        { label: 'Paiement Droits Scolarité', icon: <HomeworkIcon /> },
    ];
    return (
        <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
            <nav style={{ marginBottom: '20px' }}>
                <Link to="/dashboard" style={{ color: '#007bff', textDecoration: 'none' }}>Accueil</Link>
                <span> / </span>
                <span>Mes enfants</span>

            </nav>
            <div className="card card-primary card-outline">
                <div className="card-header d-flex" style={{ backgroundColor: '#F8F8F8' }}>
                    <img src={parentIcon} alt="" width="90px" />
                    <p className="card-title mt-5 ml-2 p-2 text-center" style={{ width: '350px', borderRadius: '50px', border: '1px solid rgb(215, 214, 216)' }}>
                        Mes Enfants
                    </p>
                </div>
                {loading ? (
                    <p style={{ textAlign: 'center' }}>Chargement...</p>
                ) : enfants.length === 0 ? (
                    <p style={{ textAlign: 'center' }}>Aucun enfant trouvé.</p>
                ) : (
                    <>
                        <div style={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: '20px',
                            justifyContent: 'center',
                            marginBottom: '30px',
                            marginTop: '10px'
                        }}>
                            {enfants.map((enfant) => (
                                <div
                                    key={enfant.id}
                                    onClick={() => handleEnfantClick(enfant.id)}
                                    className={`enfant-card ${selectedEnfant?.id === enfant.id ? 'selected' : ''}`}
                                >
                                    <img
                                        src={`http://localhost:5000${enfant.photo}`}
                                        alt="enfant"
                                        className="enfant-photo"
                                    />
                                    <p><strong>{enfant.prenom} {enfant.nom}</strong></p>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>
            <div className="card card-primary card-outline">
                <div className="card card-header">
                    {/* Stepper */}
                    {selectedEnfant && (
                        <div>
                            <div className="stepper-container">
                                {steps.map((step, index) => (
                                    <div
                                        key={index}
                                        onClick={() => setActiveStep(index)}
                                        className={`stepper-step ${activeStep === index ? 'active' : ''}`}
                                    >
                                        <div className="icon">{step.icon}</div>
                                        <div>{step.label}</div>
                                    </div>
                                ))}
                            </div>

                        </div>
                    )}
                </div>
                {/* Step content */}
                {activeStep === 0 && selectedEnfant &&(
                    <div>
                        <h3>Informations de {selectedEnfant.prenom}</h3>
                        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                            <img
                                src={`http://localhost:5000${selectedEnfant.photo}`}
                                alt="profil"
                                style={{ width: '80px', height: '80px', borderRadius: '50%' }}
                            />
                            <div>
                                <p><strong>Nom complet:</strong> {selectedEnfant.prenom} {selectedEnfant.nom}</p>
                                <p><strong>Date de naissance:</strong> {new Date(selectedEnfant.datenaiss).toLocaleDateString()}</p>
                                <p><strong>Classe:</strong> {selectedEnfant.classe}</p>
                                <p><strong>Niveau:</strong> {selectedEnfant.niveau}</p>
                                <p><strong>Groupe sanguin:</strong> {selectedEnfant.groupeSanguin || 'Non spécifié'}</p>
                            </div>
                        </div>
                    </div>
                )}
                {activeStep === 1 && selectedEnfant &&(
                    <div>
                        <h3>Notes de {selectedEnfant.prenom}</h3>

                        {anneesScolaires.length === 0 ? (
                            <div className="alert alert-info">
                                Aucune année scolaire trouvée.
                            </div>
                        ) : (
                            <div>
                                <h4>Années scolaires</h4>
                                <div className="d-flex flex-wrap gap-2 mb-4">
                                    {anneesScolaires.map(annee => (
                                        <button
                                            key={annee.id}
                                            className={`btn ${selectedAnnee?.id === annee.id ? 'btn-primary' : 'btn-outline-primary'}`}
                                            onClick={() => handleAnneeClick(annee)}
                                            style={{ margin: '5px' }}
                                        >
                                            {new Date(annee.datedebut).getFullYear()} - {new Date(annee.datefin).getFullYear()}
                                        </button>
                                    ))}

                                </div>

                                {selectedAnnee && trimestres.length > 0 && (
                                    <div>
                                        <h4 style={{ marginTop: '20px' }}>Trimestres</h4>
                                        <div className="d-flex flex-wrap gap-2">
                                            {trimestres.map(trimestre => {
                                                const moyenne = trimestre.moyenne;
                                                const moyenneFormatee = typeof moyenne === 'number'
                                                    ? moyenne.toFixed(2)
                                                    : (typeof moyenne === 'string' && !isNaN(parseFloat(moyenne)))
                                                        ? parseFloat(moyenne).toFixed(2)
                                                        : 'N/A';

                                                return (
                                                    <button
                                                        key={trimestre.id}
                                                        className={`btn ${selectedTrimestre?.id === trimestre.id ? 'btn-success' : 'btn-outline-success'}`}
                                                        onClick={() => handleTrimestreClick(trimestre)}
                                                        style={{ minWidth: '200px', position: 'relative' }}
                                                        disabled={!trimestre.status} // Désactiver si non publié
                                                    >
                                                        <div>{trimestre.Trimest.titre}</div>
                                                        <div>Moyenne: {moyenneFormatee}</div>
                                                        {!trimestre.status && (
                                                            <small className="text-muted">(Non publié)</small>
                                                        )}
                                                        {trimestre.status && (
                                                            <small className="text-success">(Publié)</small>
                                                        )}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}

                {activeStep === 2 && selectedEnfant &&(
                    <div>
                        <div className="d-flex justify-content-between mb-3">
                            <h3>Absences et retards de {selectedEnfant.prenom}</h3>
                            <Button
                                variant="warning"
                                onClick={() => setShowReportAbsenceModal(true)}
                            >
                                <i className="fas fa-calendar-times mr-2"></i>
                                Signaler une absence prévue
                            </Button>
                        </div>

                        {loadingPresences ? (
                            <div className="text-center my-4">
                                <div className="spinner-border text-primary" role="status">
                                    <span className="sr-only">Chargement...</span>
                                </div>
                                <p>Chargement des absences...</p>
                            </div>
                        ) : presences.length === 0 ? (
                            <div className="alert alert-info">
                                Aucune absence ou retard enregistré pour le moment.
                            </div>
                        ) : (
                            <div className="table-responsive">
                                <table className="table table-striped table-hover">
                                    <thead className="thead-light">
                                        <tr>
                                            <th>Date</th>
                                            <th>Matin</th>
                                            <th>Après-midi</th>
                                            <th>Justification</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {presences.map((presence) => (
                                            <tr key={presence.id}>
                                                <td>
                                                    {new Date(presence.date).toLocaleDateString('fr-FR', {
                                                        day: '2-digit',
                                                        month: '2-digit',
                                                        year: 'numeric'
                                                    })}
                                                </td>
                                                <td>
                                                    <span className={`badge ${presence.matin === 'present' ? 'badge-success' :
                                                        presence.matin === 'retard' ? 'badge-warning' : 'badge-danger'
                                                        }`}>
                                                        {presence.matin}
                                                    </span>
                                                    {presence.justificationMatin && (
                                                        <span className="ml-2 text-success">
                                                            <i className="fas fa-check-circle"></i>
                                                        </span>
                                                    )}
                                                </td>
                                                <td>
                                                    <span className={`badge ${presence.apres_midi === 'present' ? 'badge-success' :
                                                        presence.apres_midi === 'retard' ? 'badge-warning' : 'badge-danger'
                                                        }`}>
                                                        {presence.apres_midi}
                                                    </span>
                                                    {presence.justificationApresMidi && (
                                                        <span className="ml-2 text-success">
                                                            <i className="fas fa-check-circle"></i>
                                                        </span>
                                                    )}
                                                </td>
                                                <td>
                                                    {/* Justification matin */}
                                                    {presence.justificationTextMatin && (
                                                        <div className="mb-1">
                                                            <i className="fas fa-comment-alt mr-1"></i>
                                                            {presence.justificationTextMatin}
                                                        </div>
                                                    )}

                                                    {/* Justification après-midi */}
                                                    {presence.justificationTextApresMidi && (
                                                        <div className="mb-1">
                                                            <i className="fas fa-comment-alt mr-1"></i>
                                                            {presence.justificationTextApresMidi}
                                                        </div>
                                                    )}

                                                    {/* Fichier de justification matin */}
                                                    {presence.fichierJustificationMatin && presence.justificationMatin === 'justifié' && (
                                                        <div>
                                                            <button
                                                                onClick={() => downloadJustification(presence.fichierJustificationMatin)}
                                                                className="btn btn-sm btn-link p-0"
                                                            >
                                                                <i className="fas fa-file-download mr-1"></i>
                                                                Voir fichier (matin)
                                                            </button>
                                                        </div>
                                                    )}

                                                    {/* Fichier de justification après-midi */}
                                                    {presence.fichierJustificationApresMidi && presence.justificationApresMidi === 'justifié' && (
                                                        <div>
                                                            <button
                                                                onClick={() => downloadJustification(presence.fichierJustificationApresMidi)}
                                                                className="btn btn-sm btn-link p-0"
                                                            >
                                                                <i className="fas fa-file-download mr-1"></i>
                                                                Voir fichier (après-midi)
                                                            </button>
                                                        </div>
                                                    )}
                                                </td>
                                                <td>
                                                    {isWithin7Days(presence.date) ? (
                                                        <button
                                                            onClick={() => handleJustify(presence)}
                                                            className="btn btn-primary btn-sm"
                                                        >
                                                            <i className="fas fa-edit"></i> Justifier
                                                        </button>
                                                    ) : (
                                                        <span className="text-muted">Délai expiré</span>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}
                {activeStep === 3 && selectedEnfant &&(
                    <div>
                        <h3>Devoirs de {selectedEnfant.prenom}</h3>
                        {loadingDevoirs ? (
                            <div className="text-center my-4">
                                <div className="spinner-border text-primary" role="status">
                                    <span className="sr-only">Chargement...</span>
                                </div>
                                <p>Chargement des devoirs...</p>
                            </div>
                        ) : devoirs.length === 0 ? (
                            <div className="alert alert-info">
                                Aucun devoir trouvé pour le moment.
                            </div>
                        ) : (
                            <div className="table-responsive">
                                <table className="table table-striped table-hover">
                                    <thead className="thead-light">
                                        <tr>
                                            <th>Matière</th>
                                            <th>Titre</th>
                                            <th>Description</th>
                                            <th>Date limite</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {devoirs.map((devoir) => (
                                            <tr key={devoir.id}>
                                                <td>{devoir.Matiere?.nom}</td>
                                                <td>{devoir.titre}</td>
                                                <td>{devoir.description || 'Aucune description'}</td>
                                                <td>
                                                    {new Date(devoir.dateLimite).toLocaleDateString('fr-FR', {
                                                        day: '2-digit',
                                                        month: '2-digit',
                                                        year: 'numeric'
                                                    })}
                                                </td>
                                                <td>
                                                    <button
                                                        onClick={() => downloadDevoir(devoir.fichier)}
                                                        className="btn btn-primary btn-sm"
                                                    >
                                                        <i className="fas fa-download mr-1"></i> Télécharger
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}
                {activeStep === 4 && selectedEnfant &&(
                    <div>
                        <h3>Paiement Droits Scolarité {selectedEnfant.prenom}</h3>
                        {LoadingContrats ? (
                            <div className="text-center my-4">
                                <div className="spinner-border text-primary" role="status">
                                    <span className="sr-only">Chargement...</span>
                                </div>
                                <p>Chargement des devoirs...</p>
                            </div>
                        ) : contrats.length === 0 ? (
                            <div className="alert alert-info">
                                Aucun Contrat trouvé pour le moment.
                            </div>
                        ) : (
                            <div className="table-responsive">
                                <table className="table table-striped table-hover">
                                    <thead className="thead-light">
                                        <tr>
                                            <th>ID</th>
                                            <th>Eléve</th>
                                            <th>Code</th>
                                            <th>Niveau <br />Année Scolaire</th>
                                            <th>Num Inscription</th>
                                            <th>Debut Paiement</th>
                                            <th>Fin Paiement</th>
                                            <th>Type Paiement</th>
                                            <th>Total a payer</th>
                                            <th>Frais d'inscription	</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {contrats.map((contrat, index) => (
                                            <tr key={index}>
                                                <td>{index + 1}</td>
                                                <td>{contrat.Eleve?.User?.nom}<br />{contrat.Eleve?.User?.prenom}</td>
                                                <td>{contrat.code}</td>
                                                <td>{contrat.Eleve?.Niveaux?.nomniveau} <br />
                                                    {contrat.Anneescolaire?.datedebut && contrat.Anneescolaire?.datefin ? (
                                                        `${moment(contrat.Anneescolaire.datedebut).format('YYYY')}/
                                                                        ${moment(contrat.Anneescolaire.datefin).format('YYYY')}`
                                                    ) : (
                                                        ""
                                                    )}
                                                </td>
                                                <td>{contrat.Eleve?.numinscription}</td>
                                                <td>{contrat.date_debut_paiement ? moment(contrat.date_debut_paiement).format("DD-MM-YYYY") : ""}</td>
                                                <td>{contrat.date_sortie ? moment(contrat.date_sortie).format("DD-MM-YYYY") : '-'}</td>
                                                <td>{contrat.typePaiment}</td>
                                                <td>{contrat.totalApayer}</td>
                                                <td>{contrat.Eleve?.fraixinscription}</td>
                                                <td>
                                                    <button
                                                        className="btn btn-sm btn-info"
                                                        onClick={() => handleShowModalC(contrat)}
                                                    >
                                                        Voir échéances
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}
            </div>
            <Modal show={showJustifyModal} onHide={() => setShowJustifyModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Justifier une absence/retard</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group>
                            <Form.Label>Période concernée</Form.Label>
                            <Form.Control
                                as="select"
                                value={periode}
                                onChange={(e) => setPeriode(e.target.value)}
                            >
                                <option value="matin">Matin</option>
                                <option value="apres_midi">Après-midi</option>
                            </Form.Control>
                        </Form.Group>

                        <Form.Group>
                            <Form.Label>Justification</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                value={justification}
                                onChange={(e) => setJustification(e.target.value)}
                                placeholder="Expliquez la raison de l'absence/retard"
                            />
                        </Form.Group>

                        <Form.Group>
                            <Form.Label>Fichier de justification (optionnel)</Form.Label>
                            <div className="custom-file">
                                <input
                                    type="file"
                                    className="custom-file-input"
                                    id="customFile"
                                    onChange={(e) => setFile(e.target.files[0])}
                                />
                                <label className="custom-file-label" htmlFor="customFile">
                                    {file ? file.name : 'Choisir un fichier'}
                                </label>
                            </div>
                            <small className="form-text text-muted">
                                Vous pouvez uploader un fichier PDF ou image (max 2MB)
                            </small>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowJustifyModal(false)}>
                        Annuler
                    </Button>
                    <Button variant="primary" onClick={submitJustification}>
                        <UploadIcon className="mr-1" /> Envoyer la justification
                    </Button>
                </Modal.Footer>
            </Modal>


            <Modal show={showReportAbsenceModal} onHide={() => setShowReportAbsenceModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Signaler une absence prévue</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group>
                            <Form.Label>Date de l'absence</Form.Label>
                            <Form.Control
                                type="date"
                                value={absenceDate}
                                onChange={(e) => setAbsenceDate(e.target.value)}
                                min={new Date().toISOString().split('T')[0]}
                            />
                        </Form.Group>

                        <Form.Group>
                            <Form.Label>Période concernée</Form.Label>
                            <Form.Control
                                as="select"
                                value={absencePeriod}
                                onChange={(e) => setAbsencePeriod(e.target.value)}
                            >
                                <option value="matin">Matin</option>
                                <option value="apres_midi">Après-midi</option>
                                <option value="journee">Journée entière</option>
                            </Form.Control>
                        </Form.Group>

                        <Form.Group>
                            <Form.Label>Raison de l'absence</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                value={absenceReason}
                                onChange={(e) => setAbsenceReason(e.target.value)}
                                placeholder="Précisez la raison de l'absence..."
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowReportAbsenceModal(false)}>
                        Annuler
                    </Button>
                    <Button variant="primary" onClick={submitPlannedAbsence}>
                        Enregistrer
                    </Button>
                </Modal.Footer>
            </Modal>

            <Modal show={showNotesModal} onHide={() => setShowNotesModal(false)} size="lg">
                <Modal.Header closeButton style={{ backgroundColor: '#f8f9fa', borderBottom: '1px solid #dee2e6' }}>
                    <Modal.Title style={{ color: '#2c3e50', fontWeight: 'bold' }}>
                        Notes de {selectedEnfant?.prenom} - {selectedTrimestre?.Trimest?.titre}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ padding: '20px' }}>
                    {loadingNotes ? (
                        <div className="text-center" style={{ padding: '20px' }}>
                            <div className="spinner-border text-primary" role="status">
                                <span className="visually-hidden">Chargement...</span>
                            </div>
                            <p style={{ marginTop: '10px' }}>Chargement des notes...</p>
                        </div>
                    ) : notes.length === 0 ? (
                        <div className="alert alert-info" style={{ borderRadius: '5px' }}>
                            Aucune note trouvée pour ce trimestre.
                        </div>
                    ) : (
                        <div>
                            {(() => {
                                const cycle = notes[0]?.cycle || 'Primaire';
                                const columnsConfig = getColumnsByCycle(cycle);

                                // Séparer les notes de mathématiques des autres notes
                                const mathNotes = notes.filter(note =>
                                    note.Matiere.nom.toLowerCase().includes('math') ||
                                    note.Matiere.nomarabe.toLowerCase().includes('رياضيات')
                                );
                                const otherNotes = notes.filter(note =>
                                    !note.Matiere.nom.toLowerCase().includes('math') &&
                                    !note.Matiere.nomarabe.toLowerCase().includes('رياضيات')
                                );

                                return (
                                    <>
                                        {cycle === 'Primaire' && mathNotes.length > 0 && (
                                            <>
                                                <h4 style={{ marginTop: '20px', color: '#2c3e50' }}>
                                                    Mathématiques
                                                </h4>
                                                <NoteTable
                                                    notes={mathNotes}
                                                    columns={columnsConfig.math || []}
                                                />
                                            </>
                                        )}

                                        {otherNotes.length > 0 && (
                                            <>
                                                <h4 style={{
                                                    marginTop: '20px',
                                                    color: '#2c3e50',
                                                    display: cycle === 'Primaire' ? 'block' : 'none'
                                                }}>
                                                    Autres matières
                                                </h4>
                                                <NoteTable
                                                    notes={otherNotes}
                                                    columns={columnsConfig.regular}
                                                />
                                            </>
                                        )}
                                    </>
                                );
                            })()}
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer style={{ backgroundColor: '#f8f9fa', borderTop: '1px solid #dee2e6' }}>
                    <Button variant="secondary" onClick={() => setShowNotesModal(false)} style={{ borderRadius: '4px', padding: '6px 12px' }}>
                        Fermer
                    </Button>
                </Modal.Footer>
            </Modal>
            {/* Modal des échéances */}
            <Modal show={showModalC} onHide={handleCloseModalC} size="lg" centered>
                <Modal.Header closeButton>
                    <Modal.Title>Échéances du contrat : {selectedContrat?.code}

                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {/* Légende des couleurs */}
                    <div style={{
                        display: 'flex',
                        marginTop: '5px',
                        marginBottom: '16px',
                        marginRight: '35px',
                        gap: '12px',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        fontFamily: 'Arial, sans-serif',
                    }}>
                        <div style={{ backgroundColor: '#A9DFBF', padding: '3px 10px', borderRadius: '15px', minWidth: '150px' }}>
                            🟢 Payé
                        </div>
                        <div style={{ backgroundColor: '#F5B7B1', padding: '3px 10px', borderRadius: '15px', minWidth: '150px' }}>
                            🔴 Retard &gt; 7 jours
                        </div>
                        <div style={{ backgroundColor: '#FAD7A0', padding: '3px 10px', borderRadius: '15px', minWidth: '150px' }}>
                            🟠 Retard ≤ 7 jours
                        </div>
                        <div style={{ backgroundColor: '#FCF3CF', padding: '3px 10px', borderRadius: '15px', minWidth: '150px' }}>
                            🟡 À venir ≤ 7 jours
                        </div>
                    </div>

                    {selectedContrat?.PlanningPaiements?.length > 0 ? (
                        <table className="table table-bordered table-hover">
                            <thead>
                                <tr>
                                    <th>Code Échéance</th>
                                    <th>Date Échéance</th>
                                    <th>Montant</th>
                                    <th>Montant Restant</th>
                                    <th>État Paiement</th>
                                    <th>Date Paiement</th>
                                    <th>Mode Paiement</th>
                                </tr>
                            </thead>
                            <tbody>
                                {selectedContrat?.PlanningPaiements.map((pp) => {

                                    const due = moment(pp.date_echeance).startOf('day');
                                    const daysDiff = due.diff(Today, 'days');
                                    let rowClass = '';
                                    if (pp.etat_paiement === 'payé') {
                                        rowClass = 'row-paid';
                                    } else if (daysDiff < -7) {
                                        rowClass = 'row-overdue';
                                    } else if (daysDiff < 0) {
                                        rowClass = 'row-orange';
                                    } else if (daysDiff <= 7) {
                                        rowClass = 'row-soon';
                                    }
                                    return (
                                        <tr key={pp.id} className={rowClass}>
                                            <td>{pp.codePP}</td>
                                            <td>{pp.date_echeance ? moment(pp.date_echeance).format('DD-MM-YYYY') : ''}</td>
                                            <td>{pp.montant_echeance}</td>
                                            <td>{pp.montant_restant}</td>
                                            <td>
                                                <span className={`
                                                 badge ${pp.etat_paiement === 'payé' ?
                                                        'badge-success' : 'badge-danger'
                                                    }`}>
                                                    {pp.etat_paiement}
                                                </span>
                                            </td>
                                            <td>{pp.date_paiement}</td>
                                            <td>{pp.mode_paiement} </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    ) : (
                        <p>Aucune échéance disponible pour ce contrat.</p>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModalC}>
                        Fermer
                    </Button>
                </Modal.Footer>
            </Modal>

            <style>
                {`
                .enfant-card {
  text-align: center;
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  border: 1px solid #ddd;
  border-radius: 10px;
  padding: 15px;
  width: 150px;
  background: #fff;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  position: relative;
  overflow: hidden;
}

.enfant-card:hover {
  transform: translateY(-5px) scale(1.03);
  box-shadow: 0 8px 16px rgba(0,0,0,0.15);
}

.enfant-card.selected {
  border: 2px solid #007bff;
}

.enfant-photo {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #eaeaea;
  transition: border-color 0.3s ease;
}

.enfant-card:hover .enfant-photo {
  border-color: #007bff;
}

          .note-item {
            display: flex;
            justify-content: space-between;
            padding: 5px;
            background-color: #f8f9fa;
            border-radius: 4px;
            font-size: 0.9rem;
          }

          .note-label {
            font-weight: 500;
            color: #6c757d;
          }

          .note-value {
            font-weight: bold;
            color: #2c3e50;
          }

          .btn-annee {
            margin: 5px;
            transition: all 0.3s ease;
            border-radius: 20px;
          }

          .btn-annee:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 8px rgba(0,0,0,0.1);
          }

          .btn-trimestre {
            min-width: 200px;
            padding: 10px;
            margin: 5px;
            display: flex;
            flex-direction: column;
            align-items: center;
            border-radius: 10px;
            transition: all 0.3s ease;
          }

          .btn-trimestre:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 8px rgba(0,0,0,0.1);
          }
          .stepper-container {
  display: flex;
  justify-content: space-around;
  margin-bottom: 20px;
  border-bottom: 1px solid #eee;
  padding-bottom: 10px;
}

.stepper-step {
  cursor: pointer;
  text-align: center;
  color: #666;
  transition: all 0.3s ease;
  padding: 10px;
  border-radius: 10px;
}

.stepper-step:hover {
  background-color: #f1f1f1;
}

.stepper-step.active {
  color: #007bff;
  font-weight: bold;
  background-color: #e9f5ff;
}

.stepper-step .icon {
  font-size: 24px;
  margin-bottom: 5px;
}

/* Conteneur principal */
.enfant-details {
  border: 1px solid #ccc;
  border-radius: 10px;
  padding: 25px;
  background: #fff;
  box-shadow: 0 5px 10px rgba(0,0,0,0.05);
  transition: all 0.3s ease;
}

/* Titres de section */
.section-title {
  font-size: 1.4rem;
  margin-bottom: 15px;
  color: #333;
}

/* Spinner personnalisé */
.spinner-border {
  width: 2rem;
  height: 2rem;
}

/* Boutons année scolaire et trimestre */
.btn-annee,
.btn-trimestre {
  transition: all 0.3s ease;
  border-radius: 8px;
}

.btn-annee:hover,
.btn-trimestre:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

        
        `}
            </style>
        </div>
    );
};

export default ListeDeSesEnfants;
