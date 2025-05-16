import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Button, Modal, Form, Alert, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const EmploiDuTempEnseignant = () => {
    const [annees, setAnnees] = useState([]);
    const [selectedAnneeScolaire, setSelectedAnneeScolaire] = useState(null);
    const [niveaux, setNiveaux] = useState([]);
    const [sections, setSections] = useState([]);
    const [selectedNiveau, setSelectedNiveau] = useState(null);
    const [selectedSection, setSelectedSection] = useState(null);
    const [loading, setLoading] = useState(true);
    const [matieres, setMatieres] = useState([]);
    const enseignantId = localStorage.getItem('userId');
    const ecoleeId = localStorage.getItem('ecoleeId');
    const [cycles, setCycles] = useState([]);
    const [selectedCycle, setSelectedCycle] = useState("");
    const [emploiDuTempsData, setEmploiDuTempsData] = useState({});
    const [allNiveauxEnseignant, setAllNiveauxEnseignant] = useState([]);
    const [allSectionsEnseignant, setAllSectionsEnseignant] = useState([]);

    const jours = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi'];
    const [periodes, setPeriodes] = useState({
        matin: { debut: '08:00', fin: '12:00', sousPeriodes: [] },
        dejeuner: { debut: '12:00', fin: '13:00', label: 'Déjeuner' },
        apres_midi: { debut: '13:00', fin: '16:00', sousPeriodes: [] }
    });

    const formatTime = (timeString) => {
        if (!timeString) return '';
        if (timeString.length === 5) return timeString;
        return timeString.substring(0, 5);
    };

    const generateHeures = () => {
        let heures = [];

        // Matin
        if (periodes.matin.sousPeriodes?.length > 0) {
            periodes.matin.sousPeriodes.forEach(sp => {
                heures.push({
                    plage: `${formatTime(sp.debut)}-${formatTime(sp.fin)}`,
                    label: sp.label || '',
                    type: 'matin'
                });
            });
        } else if (periodes.matin.debut && periodes.matin.fin) {
            heures.push({
                plage: `${formatTime(periodes.matin.debut)}-${formatTime(periodes.matin.fin)}`,
                label: '',
                type: 'matin'
            });
        }

        // Déjeuner
        if (periodes.dejeuner.debut && periodes.dejeuner.fin) {
            heures.push({
                plage: `${formatTime(periodes.dejeuner.debut)}-${formatTime(periodes.dejeuner.fin)}`,
                label: periodes.dejeuner.label || 'Déjeuner',
                type: 'dejeuner'
            });
        }

        // Après-midi
        if (periodes.apres_midi.sousPeriodes?.length > 0) {
            periodes.apres_midi.sousPeriodes.forEach(sp => {
                heures.push({
                    plage: `${formatTime(sp.debut)}-${formatTime(sp.fin)}`,
                    label: sp.label || '',
                    type: 'apres_midi'
                });
            });
        } else if (periodes.apres_midi.debut && periodes.apres_midi.fin) {
            heures.push({
                plage: `${formatTime(periodes.apres_midi.debut)}-${formatTime(periodes.apres_midi.fin)}`,
                label: '',
                type: 'apres_midi'
            });
        }

        return heures;
    };

    useEffect(() => {
        const fetchNiveaux = async () => {
            try {
                setLoading(true);
                const token = localStorage.getItem("token");
                const response = await axios.get(
                    `http://localhost:5000/enseignant/${enseignantId}/niveaux`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                setNiveaux(response.data);
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
        const fetchAnnees = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await axios.get(
                    `http://localhost:5000/anneescolaire`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                setAnnees(response.data);
            } catch (error) {
                console.error('Error fetching annees scolaires', error);
            }
        };
        fetchAnnees();
    }, []);

    useEffect(() => {
        const fetchMatieres = async () => {
            if (selectedSection) {
                try {
                    const token = localStorage.getItem("token");
                    const response = await axios.get(
                        `http://localhost:5000/listClasse/enseignants/${enseignantId}/sections/${selectedSection}/matieres`,
                        { headers: { Authorization: `Bearer ${token}` } }
                    );
                    setMatieres(response.data);
                } catch (error) {
                    console.error("Erreur lors de la récupération des matières:", error);
                    setMatieres([]);
                }
            }
        };

        fetchMatieres();
    }, [selectedSection, enseignantId]);

    useEffect(() => {
        const fetchEmploiDuTemps = async () => {
            if (enseignantId && selectedAnneeScolaire && selectedCycle) {
                try {
                    const token = localStorage.getItem("token");
                    const response = await axios.get(
                        `http://localhost:5000/emploi-du-temps/enseignant/${enseignantId}`,
                        {
                            headers: { Authorization: `Bearer ${token}` },
                            params: {
                                anneeScolaireId: selectedAnneeScolaire
                            }
                        }
                    );

                    // Mettre à jour les données
                    setAllNiveauxEnseignant(response.data.niveaux || []);
                    setAllSectionsEnseignant(response.data.sections || []);
                    
                    // Formater les données pour l'affichage
                    const formattedData = {};
                    Object.keys(response.data.emploiDuTemps).forEach(jour => {
                        formattedData[jour] = {};
                        Object.keys(response.data.emploiDuTemps[jour]).forEach(heure => {
                            formattedData[jour][heure] = 
                                response.data.emploiDuTemps[jour][heure].map(cours => ({
                                    ...cours,
                                    key: `${jour}-${heure}-${cours.section.id}-${cours.matiere.id}`
                                }));
                        });
                    });
                    
                    setEmploiDuTempsData(formattedData);
                } catch (error) {
                    console.error("Erreur lors du chargement de l'emploi du temps:", error);
                }
            }
        };

        fetchEmploiDuTemps();
    }, [enseignantId, selectedAnneeScolaire, selectedCycle]);

    const isFormComplete = selectedAnneeScolaire && selectedCycle;

    // Fonction pour regrouper les cours par section
    const groupBySection = (coursList) => {
        const grouped = {};
        coursList.forEach(cours => {
            if (!grouped[cours.section.id]) {
                grouped[cours.section.id] = {
                    section: cours.section,
                    cours: []
                };
            }
            grouped[cours.section.id].cours.push(cours);
        });
        return Object.values(grouped);
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
                    const response = await axios.get(`http://localhost:5000/ecoles/${ecoleeId}`, {
                        headers: { Authorization: `Bearer ${token}` },
                    });
                    setCycles([{ id: ecoleeId, nomCycle: response.data.cycle }]);
                    setSelectedCycle(response.data.cycle);
                } else {
                    const response = await axios.get('http://localhost:5000/cyclescolaires', {
                        headers: { Authorization: `Bearer ${token}` },
                    });
                    setCycles(response.data);
                }
            } catch (error) {
                console.error("❌ Erreur lors de la récupération des cycles :", error);
            }
        };

        fetchCycle();
    }, [ecoleeId]);

    useEffect(() => {
        const fetchPeriodes = async () => {
            if (selectedCycle) {
                try {
                    const token = localStorage.getItem("token");
                    const selectedCycleObj = cycles.find(c => c.nomCycle === selectedCycle);
                    if (!selectedCycleObj) return;

                    const response = await axios.get(
                        `http://localhost:5000/emploi-du-temps/periodes/${selectedCycleObj.id}`,
                        { headers: { Authorization: `Bearer ${token}` } }
                    );

                    if (response.data && response.data.length > 0) {
                        const newPeriodes = {
                            matin: { debut: '08:00', fin: '12:00', sousPeriodes: [] },
                            dejeuner: { debut: '12:00', fin: '13:00', label: 'Déjeuner' },
                            apres_midi: { debut: '13:00', fin: '16:00', sousPeriodes: [] }
                        };

                        response.data.forEach(periode => {
                            if (periode.type === 'matin') {
                                newPeriodes.matin = {
                                    debut: periode.heureDebut,
                                    fin: periode.heureFin,
                                    sousPeriodes: periode.sousPeriodes ? JSON.parse(periode.sousPeriodes) : []
                                };
                            } else if (periode.type === 'dejeuner') {
                                newPeriodes.dejeuner = {
                                    debut: periode.heureDebut,
                                    fin: periode.heureFin,
                                    label: periode.label || 'Déjeuner'
                                };
                            } else if (periode.type === 'apres_midi') {
                                newPeriodes.apres_midi = {
                                    debut: periode.heureDebut,
                                    fin: periode.heureFin,
                                    sousPeriodes: periode.sousPeriodes ? JSON.parse(periode.sousPeriodes) : []
                                };
                            }
                        });

                        setPeriodes(newPeriodes);
                    }
                } catch (error) {
                    console.error("Erreur lors du chargement des périodes:", error);
                }
            }
        };
        fetchPeriodes();
    }, [selectedCycle, cycles]);

    return (
        <div className="container-fluid py-3">
            <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                    <li className="breadcrumb-item"><Link to="/dashboard">Dashboard</Link></li>
                    <li className="breadcrumb-item active">Emploi Du Temps</li>
                </ol>
            </nav>

            <div className="card shadow">
                <div className="card-header bg-primary text-white">
                    <h3 className="card-title mb-0">Emploi Du Temps</h3>
                </div>

                <div className="card-body">
                    <div className="mb-4">
                        <h4 className="mb-3 text-primary">🎯 Sélectionnez :</h4>
                        <div className="d-flex flex-wrap align-items-center gap-2">
                            {/* Cycle scolaire */}
                            <div className="form-group" style={{ minWidth: '150px' }}>
                                <select
                                    className="form-control input"
                                    style={{ height: '40px' }}
                                    value={selectedCycle || ""}
                                    onChange={(e) => setSelectedCycle(e.target.value)}
                                >
                                    <option value="">Cycle scolaire</option>
                                    {cycles.map((cycle) => (
                                        <option key={cycle.id} value={cycle.nomCycle}>
                                            {cycle.nomCycle}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Année scolaire */}
                            <div className="form-group" style={{ minWidth: '150px' }}>
                                <select
                                    className="form-control input"
                                    style={{ height: '40px' }}
                                    value={selectedAnneeScolaire || ""}
                                    onChange={(e) => setSelectedAnneeScolaire(e.target.value)}
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

                        </div>
                    </div>

                    {isFormComplete ? (
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
                                                if (heure.type === 'dejeuner') {
                                                    return (
                                                        <td key={`${jour}-${idx}`} className="align-middle text-center">
                                                            <div className="text-muted fst-italic">
                                                                {heure.label}
                                                            </div>
                                                        </td>
                                                    );
                                                }

                                                const coursList = emploiDuTempsData[jour]?.[heure.plage] || [];
                                                const coursParSection = groupBySection(coursList);

                                                return (
                                                    <td key={`${jour}-${idx}`} className="align-middle">
                                                        {coursParSection.length > 0 ? (
                                                            coursParSection.map((groupe, i) => (
                                                                <div key={i} className="mb-2 p-2 bg-light rounded">
                                                                    <div className="font-weight-bold">
                                                                        {groupe.section.classe} 
                                                                        {groupe.section.classeArab && ` (${groupe.section.classeArab})`}
                                                                    </div>
                                                                    {groupe.cours.map((cours, j) => (
                                                                        <div key={j} className="small">
                                                                            <span className="text-primary">
                                                                                {cours.matiere.nom} ({cours.matiere.code})
                                                                            </span>
                                                                            <div className="text-muted">
                                                                                Durée: {cours.duree} min
                                                                            </div>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            ))
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
                    ) : (
                        <div className="alert alert-info">
                            Veuillez sélectionner un cycle et une année scolaire pour afficher l'emploi du temps.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default EmploiDuTempEnseignant;