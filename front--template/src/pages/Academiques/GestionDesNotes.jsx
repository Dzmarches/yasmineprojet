import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Button, Modal, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import NoteModal from './NoteModal';
import add from '../../assets/imgs/add.png';

const GestionDesNotes = () => {
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
    const [showModalRemarque , setShowModalRemarque ] = useState(false);
    const [enseignantsParMatiere, setEnseignantsParMatiere] = useState({});

    const [remarque, setRemarque] = useState([]);


    const handleShowModalRemarque = () => setShowModalRemarque(true);
    const handleCloseModalRemarque = () => {
        setShowModalRemarque(false);
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
                setNiveaux(response.data);
            } catch (error) {
                console.error("Erreur lors du chargement des niveaux.", error);
            } finally {
                setLoading(false);
            }
        };

        fetchNiveaux();
    }, []);

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
                    alert("Dates sauvegardées avec succès");
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
                cycle: niveaux.find(n => n.id === selectedNiveau)?.cycle
            };

            // Conversion des nombres
            const numericFields = ['moyenne', 'coefficient', 'eval_continue', 'devoir1', /* ajoutez tous les champs numériques */];
            numericFields.forEach(field => {
                if (noteToSend[field]) {
                    noteToSend[field] = parseFloat(noteToSend[field]);
                }
            });

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

    // const getMoyenne = (eleveId, matiereId) => {
    //     const note = notesData[eleveId]?.[matiereId];
    //     return note?.moyenne ? note.moyenne.toFixed(2) : 'N/A';
    // };
    const getMoyenne = (eleveId, matiereId) => {
        const note = notesData[eleveId]?.[matiereId];
        if (!note || note.moyenne === null || note.moyenne === undefined) {
            return 'N/A';
        }

        // Convertir en nombre si c'est une chaîne
        const moyenneNum = typeof note.moyenne === 'string'
            ? parseFloat(note.moyenne)
            : note.moyenne;

        // Vérifier que c'est bien un nombre valide
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
        const cycle = niveaux.find(n => n.id === selectedNiveau)?.cycle;
        const notesEleve = notesData[eleveId] || {};

        if (cycle === 'Primaire') {
            // Pour le primaire: moyenne des moyennes des matières
            let sommeMoyennes = 0;
            let nbMatieres = 0;

            matieresNiveau.forEach(matiere => {
                const note = notesEleve[matiere.Matiere.id];
                if (note && note.moyenne) {
                    sommeMoyennes += parseFloat(note.moyenne);
                    nbMatieres++;
                }
            });

            return nbMatieres > 0 ? (sommeMoyennes / nbMatieres).toFixed(2) : 'N/A';
        }
        else if (cycle === 'Cem' || cycle === 'Lycée') {
            // Pour CEM et Lycée: somme des (moyenne * coefficient) / somme des coefficients
            let sommeMoyennesPonderees = 0;
            let sommeCoefficients = 0;

            matieresNiveau.forEach(matiere => {
                const note = notesEleve[matiere.Matiere.id];
                if (note && note.moyenne && note.coefficient) {
                    sommeMoyennesPonderees += parseFloat(note.moyenne) * parseFloat(note.coefficient);
                    sommeCoefficients += parseFloat(note.coefficient);
                }
            });

            return sommeCoefficients > 0 ? (sommeMoyennesPonderees / sommeCoefficients).toFixed(2) : 'N/A';
        }

        return 'N/A';
    };


    useEffect(() => {
        const storedEcoleId = localStorage.getItem("ecoleId");
        const storedEcoleeId = localStorage.getItem("ecoleeId");

        if (storedEcoleId) setEcoleId(storedEcoleId);
        if (storedEcoleeId) setEcoleeId(storedEcoleeId);
    }, []);

    return (
        <div className="container-fluid py-3">
            <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                    <li className="breadcrumb-item"><Link to="/dashboard">Dashboard</Link></li>
                    <li className="breadcrumb-item active">Gestion des notes</li>
                </ol>
            </nav>
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
                            {selectedSection && (
                                <div className="mt-4">
                                    <div className="d-flex flex-wrap gap-2">
                                        <button
                                            className="btn btn-secondary mr-2"
                                            onClick={handleOpenMatieresModal}
                                        >
                                            <i className="fas fa-book mr-2"></i>
                                            Coef des matières
                                        </button>
                                        <button className="btn btn-app p-1" onClick={handleShowModalRemarque}>
                                            <img src={add} alt="" width="30px" /><br />
                                            Ajouter
                                        </button>
                                    </div>
                                    <h4>Liste des élèves de la section sélectionnée :</h4>
                                    <div className="table-responsive">
                                        <table className="table table-bordered table-striped">
                                            <thead className="thead-dark">
                                                <tr>
                                                    <th>Nom complet</th>
                                                    {matieresNiveau.map((matiere) => (
                                                        <th key={matiere.id}>
                                                            {matiere.Matiere?.nomarabe} {' - '} {matiere.Matiere?.nom}

                                                        </th>
                                                    ))}
                                                    <th>Moyenne Générale</th>
                                                </tr>
                                            </thead>

                                            <tbody>
                                                {eleves.map((eleve) => (
                                                    <tr key={eleve.id}>
                                                        <td>{eleve.User?.prenom} {eleve.User?.nom}</td>
                                                        {matieresNiveau.map((matiere) => {
                                                            const moyenne = getMoyenne(eleve.id, matiere.Matiere.id);
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
                                                            {getMoyenneGenerale(eleve.id)}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                            <tfoot>
                                                <tr>
                                                    <th>Moyenne de la matière</th>
                                                    {matieresNiveau.map((matiere) => {
                                                        const moyenneGen = getMoyenneGeneraleParMatiere(matiere.Matiere.id);
                                                        return (
                                                            <th key={matiere.id}>
                                                                {isNaN(moyenneGen) ? 'N/A' : moyenneGen.toFixed(2)}
                                                            </th>
                                                        );
                                                    })}
                                                    <th>
                                                        {/* Moyenne générale de la classe */}
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

            <NoteModal
                show={showNoteModal}
                handleClose={() => setShowNoteModal(false)}
                eleve={selectedEleve}
                matiere={selectedMatiere}
                notes={notesData[selectedEleve?.id]?.[selectedMatiere?.id]}
                cycle={niveaux.find(n => n.id === selectedNiveau)?.cycle}
                onSave={handleNoteSave}
            />

            <div className={`modal fade ${showModalRemarque ? 'show' : ''}`} style={{ display: showModalRemarque ? 'block' : 'none' }} id="modal-niveau" tabIndex="-1" role="dialog" aria-labelledby="modalNiveauLabel" aria-hidden={!showModalRemarque}>
                <div className="modal-dialog modal-custom" role="document">
                    <div className="modal-content modal-custom-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="modalNiveauLabel"></h5>
                            <button type="button" className="close" onClick={handleCloseModalRemarque} aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">

                            <div className="modal-body">
                                <form>
                                    <div className="form-group">
                                        <input
                                            type="hidden"
                                            className="form-control input"
                                            value={ecoleId || ''}
                                            readOnly
                                        />
                                        <input
                                            type="hidden"
                                            className="form-control input"
                                            value={ecoleeId || ''}
                                            readOnly
                                        />
                                        <input
                                            type="text"
                                            className="form-control input"
                                            value={remarque}
                                            onChange={(e) => setRemarque(e.target.value)}
                                            placeholder="Remarque"
                                        />
                                    </div>
                                    <div className="modal-footer">
                                        <button type="button" className="btn btn-secondary" onClick={handleCloseModalRemarque}>Fermer</button>
                                        <button type="submit" className="btn btn-primary"></button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    )
}

export default GestionDesNotes;