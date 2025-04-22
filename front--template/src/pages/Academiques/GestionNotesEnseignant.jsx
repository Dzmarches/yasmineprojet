import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Button, Modal, Form, Alert, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const GestionNotesEnseignant = () => {
    const [niveaux, setNiveaux] = useState([]);
    const [sections, setSections] = useState([]);
    const [selectedNiveau, setSelectedNiveau] = useState(null);
    const [selectedSection, setSelectedSection] = useState(null);
    const [loading, setLoading] = useState(true);
    const [matieres, setMatieres] = useState([]);
    const [eleves, setEleves] = useState([]);
    const [notes, setNotes] = useState({});
    const [loadingEleves, setLoadingEleves] = useState(false);
    const [periodeStatus, setPeriodeStatus] = useState(false);
    const [loadingStatus, setLoadingStatus] = useState(true);
    const [periodeDates, setPeriodeDates] = useState({
        dateDebut: null,
        dateFin: null
    });

    const enseignantId = localStorage.getItem('userId');
    const ecoleId = localStorage.getItem('ecoleId');
    const ecoleeId = localStorage.getItem('ecoleeId');

    useEffect(() => {
        const fetchPeriodeStatus = async () => {
            try {
                setLoadingStatus(true);
                const token = localStorage.getItem("token");
                const response = await axios.get(
                    `http://localhost:5000/periodenotes/status/${ecoleId || '0'}/${ecoleeId || '0'}`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                setPeriodeStatus(response.data.status || false);

                if (response.data.status) {
                    setPeriodeDates({
                        dateDebut: response.data.dateDebutPeriode,
                        dateFin: response.data.dateFinPeriode
                    });
                }
            } catch (error) {
                console.error("Erreur lors de la récupération du statut de période:", error);
                setPeriodeStatus(false);
            } finally {
                setLoadingStatus(false);
            }
        };

        fetchPeriodeStatus();
    }, [ecoleId, ecoleeId]);

    useEffect(() => {
        const fetchNiveaux = async () => {
            try {
                setLoading(true);
                const token = localStorage.getItem("token");
                const response = await axios.get(
                    `http://localhost:5000/enseignant/${enseignantId}/niveaux`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                const niveauxAvecCycle = Array.isArray(response.data)
                    ? response.data.map(niveau => ({
                        ...niveau,
                        cycle: niveau.cycle || 'Non spécifié'
                    }))
                    : [];
                console.log('cycle', niveauxAvecCycle);
                setNiveaux(niveauxAvecCycle);
            } catch (error) {
                console.error("Erreur lors de la récupération des niveaux:", error);
                setNiveaux([]);
            } finally {
                setLoading(false);
            }
        };

        fetchNiveaux();
    }, [enseignantId]);


    useEffect(() => {
        const fetchSections = async () => {
            if (selectedNiveau) {
                try {
                    setLoading(true);
                    const token = localStorage.getItem("token");
                    const response = await axios.get(
                        `http://localhost:5000/enseignant/${enseignantId}/niveaux/${selectedNiveau}/sections`,
                        { headers: { Authorization: `Bearer ${token}` } }
                    );
                    console.log("classe", response.data)
                    setSections(response.data);
                } catch (error) {
                    console.error("Erreur lors de la récupération des sections:", error);
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchSections();
    }, [selectedNiveau, enseignantId]);

    useEffect(() => {
        const fetchMatieres = async () => {
            if (selectedSection) {
                try {
                    const token = localStorage.getItem("token");
                    const response = await axios.get(
                        `http://localhost:5000/listClasse/enseignants/${enseignantId}/sections/${selectedSection}/matieres`,
                        { headers: { Authorization: `Bearer ${token}` } }
                    );
                    const uniqueMatieres = response.data.filter(
                        (matiere, index, self) =>
                            index === self.findIndex(m => m.id === matiere.id)
                    );
                    setMatieres(uniqueMatieres);
                } catch (error) {
                    console.error("Erreur lors de la récupération des matières:", error);
                    setMatieres([]);
                }
            }
        };

        fetchMatieres();
    }, [selectedSection, enseignantId]);

    useEffect(() => {
        const fetchEleves = async () => {
            if (selectedSection) {
                setLoadingEleves(true);
                try {
                    const token = localStorage.getItem("token");
                    const response = await axios.get(
                        `http://localhost:5000/enseignant/sections/${selectedSection}/eleves`,
                        { headers: { Authorization: `Bearer ${token}` } }
                    );
                    setEleves(response.data);

                    const initialNotes = {};
                    response.data.forEach(eleve => {
                        initialNotes[eleve.id] = {};
                    });
                    setNotes(initialNotes);
                } catch (error) {
                    console.error("Erreur lors du chargement des élèves:", error);
                } finally {
                    setLoadingEleves(false);
                }
            }
        };

        fetchEleves();
    }, [selectedSection]);


    const handleSaveNotes = async () => {
        try {
            const token = localStorage.getItem("token");
            const notesToSend = {};

            // Restructurer les notes pour le backend
            for (const eleveId in notes) {
                notesToSend[eleveId] = {};
                for (const fieldKey in notes[eleveId]) {
                    const parts = fieldKey.split('_');
                    const matiereId = parts[0];
                    const fieldName = parts.slice(1).join('_'); // Gère les underscores dans les noms de champs

                    if (!notesToSend[eleveId][matiereId]) {
                        notesToSend[eleveId][matiereId] = {};
                    }
                    notesToSend[eleveId][matiereId][fieldName] = notes[eleveId][fieldKey];
                }
            }

            const response = await axios.post(
                'http://localhost:5000/notes/',
                {
                    notes: notesToSend,
                    sectionId: selectedSection,
                    cycle: selectedCycle
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (response.data.success) {
                alert('Notes enregistrées avec succès!');
            }
        } catch (error) {
            console.error("Erreur enregistrement notes:", error);
            alert("Erreur lors de l'enregistrement");
        }
    };

    // Puis modifier votre bouton d'enregistrement pour appeler cette fonction:

    const handleNoteChange = (eleveId, fieldId, value) => {
        const roundToTwo = (num) => {
            const floatNum = parseFloat(num);
            if (isNaN(floatNum)) return '';
            const str = floatNum.toFixed(3); // garde 3 chiffres pour analyse
            const [intPart, decimalPart] = str.split('.');
            const thirdDigit = parseInt(decimalPart[2]);
            let rounded = floatNum;

            if (thirdDigit >= 5) {
                rounded = (Math.floor(floatNum * 100) + 1) / 100;
            } else {
                rounded = Math.floor(floatNum * 100) / 100;
            }

            return rounded.toFixed(2);
        };

        setNotes(prev => {
            const updatedEleveNotes = {
                ...prev[eleveId],
                [fieldId]: value
            };

            const [matiereId, champ] = fieldId.split('_');
            const currentMatiere = matieres.find(m => m.id == matiereId);
            const isMath = currentMatiere ? isMathSubject(currentMatiere) : false;
            const isPrimaire = selectedCycle === 'Primaire';
            const isCem = selectedCycle === 'Cem';
            const isLycée = selectedCycle === 'Lycée';

            // ----- LOGIQUE PRIMAIRE -----
            // ----- LOGIQUE PRIMAIRE -----
            if (isPrimaire) {
                const exp = parseFloat(updatedEleveNotes[`${matiereId}_expression_orale`] || 0);
                const lec = parseFloat(updatedEleveNotes[`${matiereId}_lecture`] || 0);
                const prod = parseFloat(updatedEleveNotes[`${matiereId}_production_ecrite`] || 0);
                const examens = parseFloat(updatedEleveNotes[`${matiereId}_examens`] || 0);

                let total = 0;
                let count = 0;

                // Vérifiez si la matière est Math
                const isMath = currentMatiere ? isMathSubject(currentMatiere) : false;

                if (isMath) {
                    const calcul = parseFloat(updatedEleveNotes[`${matiereId}_calcul`] || 0);
                    const grandeurs_mesures = parseFloat(updatedEleveNotes[`${matiereId}_grandeurs_mesures`] || 0);
                    const organisation_donnees = parseFloat(updatedEleveNotes[`${matiereId}_organisation_donnees`] || 0);
                    const espace_geometrie = parseFloat(updatedEleveNotes[`${matiereId}_espace_geometrie`] || 0);

                    // Calculer la moyenne pour les mathématiques
                    let totalMath = 0;
                    let countMath = 0;

                    if (calcul > 0) { totalMath += calcul; countMath++; }
                    if (grandeurs_mesures > 0) { totalMath += grandeurs_mesures; countMath++; }
                    if (organisation_donnees > 0) { totalMath += organisation_donnees; countMath++; }
                    if (espace_geometrie > 0) { totalMath += espace_geometrie; countMath++; }

                    if (countMath > 0) {
                        const moyenneEvalMath = totalMath / countMath;
                        updatedEleveNotes[`${matiereId}_moyenne_eval`] = roundToTwo(moyenneEvalMath);
                    } else {
                        updatedEleveNotes[`${matiereId}_moyenne_eval`] = '';
                    }
                } else {
                    // Logique pour les autres matières
                    if (exp > 0) { total += exp; count++; }
                    if (lec > 0) { total += lec; count++; }
                    if (prod > 0) { total += prod; count++; }

                    if (count > 0) {
                        const moyenneEval = total / count;
                        updatedEleveNotes[`${matiereId}_moyenne_eval`] = roundToTwo(moyenneEval);
                    } else {
                        updatedEleveNotes[`${matiereId}_moyenne_eval`] = '';
                    }
                }

                const moyenne_eval_valide = updatedEleveNotes[`${matiereId}_moyenne_eval`] !== '';
                const examens_valide = !isNaN(examens);

                if (moyenne_eval_valide && examens_valide) {
                    const moyenne = (parseFloat(updatedEleveNotes[`${matiereId}_moyenne_eval`]) + examens) / 2;
                    updatedEleveNotes[`${matiereId}_moyenne`] = roundToTwo(moyenne);
                } else if (!moyenne_eval_valide && examens_valide) {
                    updatedEleveNotes[`${matiereId}_moyenne`] = roundToTwo(examens);
                } else {
                    updatedEleveNotes[`${matiereId}_moyenne`] = '';
                }
            }

            // ----- LOGIQUE CEM -----
            if (isCem) {
                const eval_continue = parseFloat(updatedEleveNotes[`${matiereId}_eval_continue`] || 0);
                const devoir1 = parseFloat(updatedEleveNotes[`${matiereId}_devoir1`] || 0);
                const devoir2 = parseFloat(updatedEleveNotes[`${matiereId}_devoir2`] || 0);
                const examens = parseFloat(updatedEleveNotes[`${matiereId}_examens`] || 0);
                const coefficient = parseFloat(updatedEleveNotes[`${matiereId}_coefficient`] || 0); // 👉 AJOUT ICI

                let totalEval = 0;
                let countEval = 0;

                if (!isNaN(eval_continue) && eval_continue > 0) {
                    totalEval += eval_continue;
                    countEval++;
                }
                if (!isNaN(devoir1) && devoir1 > 0) {
                    totalEval += devoir1;
                    countEval++;
                }
                if (!isNaN(devoir2) && devoir2 > 0) {
                    totalEval += devoir2;
                    countEval++;
                }

                if (countEval > 0) {
                    updatedEleveNotes[`${matiereId}_moyenne_eval`] = roundToTwo(totalEval / countEval);
                } else {
                    updatedEleveNotes[`${matiereId}_moyenne_eval`] = '';
                }

                const moyenne_eval_valide = updatedEleveNotes[`${matiereId}_moyenne_eval`] !== '';
                const examens_valide = !isNaN(examens) && examens > 0;

                if (moyenne_eval_valide && examens_valide) {
                    const moyenne_brute = (parseFloat(updatedEleveNotes[`${matiereId}_moyenne_eval`]) + examens * 2) / 3;
                    updatedEleveNotes[`${matiereId}_moyenne`] = roundToTwo(moyenne_brute);

                    if (!isNaN(coefficient) && coefficient > 0) {
                        updatedEleveNotes[`${matiereId}_moyenne_total`] = roundToTwo(moyenne_brute * coefficient);
                    } else {
                        updatedEleveNotes[`${matiereId}_moyenne_total`] = '';
                    }

                } else if (!moyenne_eval_valide && examens_valide) {
                    const moyenne_brute = examens;
                    updatedEleveNotes[`${matiereId}_moyenne`] = roundToTwo(moyenne_brute);

                    if (!isNaN(coefficient) && coefficient > 0) {
                        updatedEleveNotes[`${matiereId}_moyenne_total`] = roundToTwo(moyenne_brute * coefficient);
                    } else {
                        updatedEleveNotes[`${matiereId}_moyenne_total`] = '';
                    }

                } else {
                    updatedEleveNotes[`${matiereId}_moyenne`] = '';
                    updatedEleveNotes[`${matiereId}_moyenne_total`] = '';
                }
            }
            if (isLycée) {
                const eval_continue = parseFloat(updatedEleveNotes[`${matiereId}_eval_continue`] || 0);
                const travaux_pratiques = parseFloat(updatedEleveNotes[`${matiereId}_travaux_pratiques`] || 0);
                const moyenne_devoirs = parseFloat(updatedEleveNotes[`${matiereId}_moyenne_devoirs`] || 0);
                const examens = parseFloat(updatedEleveNotes[`${matiereId}_examens`] || 0);
                const coefficient = parseFloat(updatedEleveNotes[`${matiereId}_coefficient`] || 0);

                let total = 0;
                let poidsTotal = 0;

                if (!isNaN(eval_continue) && eval_continue > 0) {
                    total += eval_continue;
                    poidsTotal += 1;
                }

                if (!isNaN(travaux_pratiques) && travaux_pratiques > 0) {
                    total += travaux_pratiques;
                    poidsTotal += 1;
                }

                if (!isNaN(moyenne_devoirs) && moyenne_devoirs > 0) {
                    total += moyenne_devoirs;
                    poidsTotal += 1;
                }

                if (!isNaN(examens) && examens > 0) {
                    total += examens * 2;
                    poidsTotal += 2;
                }

                if (poidsTotal > 0) {
                    const moyenne_brute = total / poidsTotal;
                    updatedEleveNotes[`${matiereId}_moyenne`] = roundToTwo(moyenne_brute);

                    if (!isNaN(coefficient) && coefficient > 0) {
                        updatedEleveNotes[`${matiereId}_moyenne_total`] = roundToTwo(moyenne_brute * coefficient);
                    } else {
                        updatedEleveNotes[`${matiereId}_moyenne_total`] = '';
                    }
                } else {
                    updatedEleveNotes[`${matiereId}_moyenne`] = '';
                    updatedEleveNotes[`${matiereId}_moyenne_total`] = '';
                }
            }



            return {
                ...prev,
                [eleveId]: updatedEleveNotes
            };
        });
    };


    const formatDate = (dateString) => {
        if (!dateString) return 'Non spécifiée';
        const date = new Date(dateString);
        return date.toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    const isMathSubject = (matiere) => {
        const mathKeywords = ['maths', 'math', 'mathématique', 'mathématiques', 'الرياضيات'];
        const matiereName = matiere.nom?.toLowerCase() || '';
        const matiereNameAr = matiere.nomarabe || '';
        return mathKeywords.some(keyword =>
            matiereName.includes(keyword.toLowerCase()) ||
            matiereNameAr.includes(keyword)
        );
    };
    const getColumnsByCycle = (cycle) => {
        switch (cycle) {
            case 'Primaire':
                return [
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
                ];
            case 'Cem':
                return [
                    { id: 'eval_continue', label: 'التقويم المستمر / Évaluation continue' },
                    { id: 'devoir1', label: 'الفرض الأول / Devoir 1' },
                    { id: 'devoir2', label: 'الفرض الثاني / Devoir 2' },
                    { id: 'moyenne_eval', label: 'معدل التقويم / Moyenne évaluation' },
                    { id: 'examens', label: 'الإختبارات / Examens' },
                    { id: 'moyenne', label: 'معدل / Moyenne' },
                    { id: 'coefficient', label: 'معامل / Coefficient' },
                    { id: 'moyenne_total', label: 'Moyenne totale' }
                ];
            case 'Lycée':
                return [
                    { id: 'eval_continue', label: 'التقويم المستمر / Évaluation continue' },
                    { id: 'travaux_pratiques', label: 'أعمال التطبيقية / Travaux pratiques' },
                    { id: 'moyenne_devoirs', label: 'معدل الفروض / Moyenne devoirs' },
                    { id: 'examens', label: 'الإختبارات / Examens' },
                    { id: 'moyenne', label: 'معدل / Moyenne' },
                    { id: 'coefficient', label: 'معامل / Coefficient' },
                    { id: 'moyenne_total', label: 'Moyenne totale' }
                ];
            default:
                return [];
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
    const rawCycle = niveaux.find(n => n.id === selectedNiveau)?.cycle || '';
    const selectedCycle = rawCycle.charAt(0).toUpperCase() + rawCycle.slice(1).toLowerCase();
    // console.log('cycle trouvé', selectedCycle);
    const columns = getColumnsByCycle(selectedCycle);

    useEffect(() => {
        const fetchExistingNotes = async () => {
            if (selectedSection && matieres.length > 0) {
                try {
                    const token = localStorage.getItem("token");
                    const response = await axios.get(
                        `http://localhost:5000/notes/section/${selectedSection}`,
                        { headers: { Authorization: `Bearer ${token}` } }
                    );

                    const existingNotes = response.data;
                    const formattedNotes = {};

                    // Initialiser la structure des notes
                    eleves.forEach(eleve => {
                        formattedNotes[eleve.id] = {};
                    });

                    // Remplir avec les notes existantes
                    existingNotes.forEach(note => {
                        const eleveId = note.EleveId;

                        // Primaire
                        if (note.cycle === 'Primaire') {
                            formattedNotes[eleveId][`${note.matiereId}_expression_orale`] = note.expression_orale || '';
                            formattedNotes[eleveId][`${note.matiereId}_lecture`] = note.lecture || '';
                            formattedNotes[eleveId][`${note.matiereId}_production_ecrite`] = note.production_ecrite || '';
                            formattedNotes[eleveId][`${note.matiereId}_moyenne_eval`] = note.moyenne_eval || '';
                            formattedNotes[eleveId][`${note.matiereId}_examens`] = note.examens || '';
                            formattedNotes[eleveId][`${note.matiereId}_moyenne`] = note.moyenne || '';
                            formattedNotes[eleveId][`${note.matiereId}_remarque`] = note.remarque || '';
                        }
                        // CEM
                        else if (note.cycle === 'Cem') {
                            formattedNotes[eleveId][`${note.matiereId}_eval_continue`] = note.eval_continue || '';
                            formattedNotes[eleveId][`${note.matiereId}_devoir1`] = note.devoir1 || '';
                            formattedNotes[eleveId][`${note.matiereId}_devoir2`] = note.devoir2 || '';
                            formattedNotes[eleveId][`${note.matiereId}_moyenne_eval`] = note.moyenne_eval || '';
                            formattedNotes[eleveId][`${note.matiereId}_examens`] = note.examens || '';
                            formattedNotes[eleveId][`${note.matiereId}_moyenne`] = note.moyenne || '';
                            formattedNotes[eleveId][`${note.matiereId}_coefficient`] = note.coefficient || '';
                            formattedNotes[eleveId][`${note.matiereId}_moyenne_total`] = note.moyenne_total || '';
                        }
                        // Lycée
                        else if (note.cycle === 'Lycée') {
                            formattedNotes[eleveId][`${note.matiereId}_eval_continue`] = note.eval_continue || '';
                            formattedNotes[eleveId][`${note.matiereId}_travaux_pratiques`] = note.travaux_pratiques || '';
                            formattedNotes[eleveId][`${note.matiereId}_moyenne_devoirs`] = note.moyenne_devoirs || '';
                            formattedNotes[eleveId][`${note.matiereId}_examens`] = note.examens || '';
                            formattedNotes[eleveId][`${note.matiereId}_moyenne`] = note.moyenne || '';
                            formattedNotes[eleveId][`${note.matiereId}_coefficient`] = note.coefficient || '';
                            formattedNotes[eleveId][`${note.matiereId}_moyenne_total`] = note.moyenne_total || '';
                        }
                    });
                    console.log('les note des eleve', formattedNotes);
                    setNotes(formattedNotes);
                } catch (error) {
                    console.error("Erreur lors du chargement des notes existantes:", error);
                }
            }
        };

        fetchExistingNotes();
    }, [selectedSection, matieres, eleves]);

    if (!periodeStatus) {
        return (
            <div className="container-fluid py-3">
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item"><Link to="/dashboard">Dashboard</Link></li>
                        <li className="breadcrumb-item active">Gestion des notes</li>
                    </ol>
                </nav>
                <Alert variant="warning" className="mt-3">
                    <Alert.Heading>⏳ Période de saisie non ouverte</Alert.Heading>
                    <p>
                        La période de saisie des notes n'est pas encore ouverte.
                        Veuillez patienter jusqu'à la date prévue par l'administration.
                    </p>
                </Alert>
            </div>
        );
    }

    return (
        <div className="container-fluid py-3">
            <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                    <li className="breadcrumb-item"><Link to="/dashboard">Dashboard</Link></li>
                    <li className="breadcrumb-item active">Gestion des notes</li>
                </ol>
            </nav>
            <div className="alert alert-info mb-4">
                <div className="d-flex justify-content-between align-items-center">
                    <div>
                        <strong>Période de saisie active</strong>
                        <div className="mt-2">
                            <Badge bg="success" className="me-2">
                                <i className="fas fa-calendar-check me-1"></i>
                                Du: {formatDate(periodeDates.dateDebut)}
                            </Badge>
                            <Badge bg="danger">
                                <i className="fas fa-calendar-times me-1"></i>
                                Au: {formatDate(periodeDates.dateFin)}
                            </Badge>
                        </div>
                    </div>
                    <div>
                        <Badge bg="primary">
                            <i className="fas fa-clock me-1"></i>
                            {new Date() > new Date(periodeDates.dateFin)
                                ? "Période terminée"
                                : "Période en cours"}
                        </Badge>
                    </div>
                </div>
            </div>

            <div className="card shadow">
                <div className="card-header bg-primary text-white">
                    <h3 className="card-title mb-0">Gestion des notes</h3>
                </div>

                <div className="card-body">
                    {/* Sélection du niveau */}
                    <div className="mb-4">
                        <h4>Sélectionnez un niveau :</h4>
                        <div className="d-flex flex-wrap gap-2">
                            {niveaux.map((niveau) => (
                                <button
                                    key={niveau.id}
                                    onClick={() => setSelectedNiveau(niveau.id)}
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
                                        onClick={() => setSelectedSection(section.id)}
                                        className={`btn ${selectedSection === section.id ? 'btn-primary' : 'btn-outline-secondary'}`}
                                    >
                                        {section.classe} {section.classearab && `(${section.classearab})`}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Liste des élèves et saisie des notes */}
                    {selectedSection && (
                        <div className="mt-4">
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <h4>Liste des élèves de la section sélectionnée :</h4>
                                <Button
                                    variant="success"
                                    disabled={!Object.keys(notes).length}
                                    onClick={handleSaveNotes}
                                >
                                    Enregistrer les notes
                                </Button>
                            </div>
                            <div className="table-responsive">
                                <Table bordered hover>
                                    <thead>
                                        <tr>
                                            <th rowSpan="2">#</th>
                                            <th rowSpan="2">Nom complet</th>
                                            {matieres.map(matiere => {
                                                const isMath = isMathSubject(matiere);
                                                const columnsToUse = isMath && selectedCycle === 'Primaire'
                                                    ? getMathColumnsForPrimaire()
                                                    : getColumnsByCycle(selectedCycle);

                                                return (
                                                    <th
                                                        key={matiere.id}
                                                        colSpan={columnsToUse.reduce((acc, col) =>
                                                            acc + (col.subColumns ? col.subColumns.length : 1), 0)}
                                                    >
                                                        {matiere.nomarabe} {'  '} {matiere.nom}
                                                    </th>
                                                );
                                            })}
                                        </tr>
                                        <tr>
                                            {matieres.map(matiere => {
                                                const isMath = isMathSubject(matiere);
                                                const columnsToUse = isMath && selectedCycle === 'Primaire'
                                                    ? getMathColumnsForPrimaire()
                                                    : getColumnsByCycle(selectedCycle);

                                                return columnsToUse.map(column => {
                                                    if (column.subColumns) {
                                                        return column.subColumns.map(subColumn => (
                                                            <th key={`${matiere.id}_${subColumn.id}`}>
                                                                {subColumn.label}
                                                            </th>
                                                        ));
                                                    }
                                                    return (
                                                        <th key={`${matiere.id}_${column.id}`}>
                                                            {column.label}
                                                        </th>
                                                    );
                                                });
                                            })}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {eleves.length > 0 ? (
                                            eleves.map((eleve, index) => (
                                                <tr key={eleve.id}>
                                                    <td>{index + 1}</td>
                                                    <td>{eleve.User?.prenom} {eleve.User?.nom}</td>
                                                    {matieres.map(matiere => {
                                                        const isMath = isMathSubject(matiere);
                                                        const columnsToUse = isMath && selectedCycle === 'Primaire'
                                                            ? getMathColumnsForPrimaire()
                                                            : getColumnsByCycle(selectedCycle);

                                                        return columnsToUse.map(column => {
                                                            if (column.subColumns) {
                                                                return column.subColumns.map(subColumn => (
                                                                    <td key={`${matiere.id}_${subColumn.id}`}>
                                                                        <Form.Control
                                                                            type="number"
                                                                            min="0"
                                                                            max="10" // Note sur 10 pour les sous-composantes des maths
                                                                            step="0.25"
                                                                            value={notes[eleve.id]?.[`${matiere.id}_${subColumn.id}`] || ''}
                                                                            onChange={(e) =>
                                                                                handleNoteChange(
                                                                                    eleve.id,
                                                                                    `${matiere.id}_${subColumn.id}`,
                                                                                    e.target.value
                                                                                )
                                                                            }
                                                                            placeholder="Note"
                                                                        />
                                                                    </td>
                                                                ));
                                                            }

                                                            const fieldId = isMath && selectedCycle === 'Primaire'
                                                                ? `${matiere.id}_${column.id.replace('_math', '')}`
                                                                : `${matiere.id}_${column.id}`;

                                                            return (
                                                                <td key={`${matiere.id}_${column.id}`}>
                                                                    <Form.Control
                                                                        type={column.id.includes('remarque') ? 'text' : 'number'}
                                                                        min={column.id.includes('remarque') ? undefined : '0'}
                                                                        max={column.id.includes('remarque') ? undefined : '20'}
                                                                        step={column.id.includes('remarque') ? undefined : '0.25'}
                                                                        value={notes[eleve.id]?.[fieldId] || ''}
                                                                        onChange={(e) =>
                                                                            handleNoteChange(
                                                                                eleve.id,
                                                                                fieldId,
                                                                                e.target.value
                                                                            )
                                                                        }
                                                                        placeholder={
                                                                            column.id.includes('remarque') ? 'Remarque' :
                                                                                column.id.includes('coefficient') ? 'Coeff' : 'Note'
                                                                        }
                                                                        readOnly={[
                                                                            'moyenne_eval',
                                                                            'moyenne_eval_math',
                                                                            'moyenne',
                                                                            'moyenne_math',
                                                                            'moyenne_total',
                                                                        ].some(term => column.id.includes(term))}
                                                                        className={
                                                                            [
                                                                                'moyenne_eval',
                                                                                'moyenne_eval_math',
                                                                                'moyenne',
                                                                                'moyenne_math',
                                                                                'moyenne_total',
                                                                            ].some(term => column.id.includes(term)) ? 'bg-light' : ''
                                                                        }
                                                                    />
                                                                </td>
                                                            );
                                                        });
                                                    })}
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td
                                                    colSpan={
                                                        2 + matieres.length * getColumnsByCycle(selectedCycle).reduce((acc, col) =>
                                                            acc + (col.subColumns ? col.subColumns.length : 1), 0)
                                                    }
                                                    className="text-center text-muted"
                                                >
                                                    Aucun élève trouvé dans cette section
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                    <tfoot>
                                        <tr>
                                            <td colSpan="2" className="fw-bold text-end">Moyenne de la classe</td>
                                            {matieres.map(matiere => (
                                                columns.map(column => {
                                                    if (column.subColumns) {
                                                        return column.subColumns.map(() => (
                                                            <td key={`empty_${matiere.id}`}></td>
                                                        ));
                                                    }
                                                    if (column.id === 'moyenne') {
                                                        // Calcule la moyenne des moyennes pour chaque matière
                                                        const moyennes = eleves.map(e => parseFloat(notes[e.id]?.[`${matiere.id}_moyenne`] || 0))
                                                            .filter(m => !isNaN(m));
                                                        const moyenneClasse = moyennes.length > 0
                                                            ? (moyennes.reduce((a, b) => a + b, 0) / moyennes.length).toFixed(2)
                                                            : '';
                                                        return (
                                                            <td key={`moyenneClasse_${matiere.id}`} className="bg-info text-white fw-bold">
                                                                {moyenneClasse}
                                                            </td>
                                                        );
                                                    }
                                                    return <td key={`empty_${matiere.id}_${column.id}`}></td>;
                                                })
                                            ))}
                                        </tr>
                                    </tfoot>

                                </Table>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default GestionNotesEnseignant;