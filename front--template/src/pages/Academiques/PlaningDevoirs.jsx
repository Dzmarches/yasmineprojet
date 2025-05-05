import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Modal, Button, Form, Table, Alert, Row, Col } from "react-bootstrap";

const GestionDevoir = () => {
    // États pour les données de base
    const [niveaux, setNiveaux] = useState([]);
    const [selectedNiveau, setSelectedNiveau] = useState(null);
    const [sections, setSections] = useState([]);
    const [selectedSection, setSelectedSection] = useState(null);
    const [annees, setAnnees] = useState([]);
    const [selectedAnnee, setSelectedAnnee] = useState(null);
    const [trimests, setTrimests] = useState([]);
    const [selectedTrimestre, setSelectedTrimestre] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // États pour la gestion des devoirs/examens
    const [typeEvaluation, setTypeEvaluation] = useState("devoir");
    const [showModal, setShowModal] = useState(false);
    const [matieresNiveau, setMatieresNiveau] = useState([]);
    const [selectedMatiere, setSelectedMatiere] = useState(null);
    const [dateEvaluation, setDateEvaluation] = useState("");
    const [heureDebut, setHeureDebut] = useState("08:00");
    const [heureFin, setHeureFin] = useState("10:00");
    const [devoirs, setDevoirs] = useState([]);
    const [jours] = useState(['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi']);

    // Charger les données initiales
    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const token = localStorage.getItem("token");

                // Charger les niveaux
                const niveauxResponse = await axios.get("http://localhost:5000/niveaux", {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setNiveaux(niveauxResponse.data);

                // Charger les années scolaires
                const anneesResponse = await axios.get("http://localhost:5000/anneescolaire", {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setAnnees(anneesResponse.data);

                // Charger les trimestres
                const trimestsResponse = await axios.get("http://localhost:5000/trimest", {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setTrimests(trimestsResponse.data);

                setLoading(false);
            } catch (error) {
                setError("Erreur lors du chargement des données initiales");
                console.error(error);
                setLoading(false);
            }
        };

        fetchInitialData();
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

    // Charger les matières quand un niveau est sélectionné
    useEffect(() => {
        if (selectedNiveau) {
            const fetchMatieres = async () => {
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
            fetchMatieres();
        }
    }, [selectedNiveau]);

    // Charger les devoirs/examens quand une section est sélectionnée
    useEffect(() => {
        if (selectedSection && selectedTrimestre) {
            const fetchDevoirs = async () => {
                try {
                    const token = localStorage.getItem("token");
                    const response = await axios.get(
                        `http://localhost:5000/devoirs/section/${selectedSection}/trimestre/${selectedTrimestre}`,
                        { headers: { Authorization: `Bearer ${token}` } }
                    );
                    setDevoirs(response.data);
                } catch (error) {
                    console.error("Erreur lors du chargement des devoirs/examens:", error);
                }
            };
            fetchDevoirs();
        }
    }, [selectedSection, selectedTrimestre]);

    // Gestion de la modal
    const handleOpenModal = () => setShowModal(true);
    const handleCloseModal = () => setShowModal(false);

    // Ajouter un devoir/examen
    const handleAddDevoir = () => {
        if (!selectedMatiere || !dateEvaluation || !heureDebut || !heureFin) {
            alert("Veuillez remplir tous les champs");
            return;
        }

        const newDevoir = {
            id: Date.now(),
            type: typeEvaluation,
            matiere: selectedMatiere.Matiere.nom,
            matiereArabe: selectedMatiere.Matiere.nomarabe,
            date: dateEvaluation,
            heureDebut,
            heureFin,
            jour: new Date(dateEvaluation).toLocaleDateString('fr-FR', { weekday: 'long' })
        };

        setDevoirs([...devoirs, newDevoir]);
        handleCloseModal();
    };

    // Supprimer un devoir/examen
    const handleDeleteDevoir = (id) => {
        setDevoirs(devoirs.filter(devoir => devoir.id !== id));
    };

    // Formater la date pour l'affichage
    const formatDate = (dateStr) => {
        if (!dateStr) return '';
        const date = new Date(dateStr);
        return date.toLocaleDateString('fr-FR');
    };

    if (loading) return <div className="d-flex justify-content-center mt-5"><div className="spinner-border" role="status"></div></div>;
    if (error) return <Alert variant="danger" className="mt-3">{error}</Alert>;

    return (
        <div className="container-fluid py-3">
            <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                    <li className="breadcrumb-item"><Link to="/dashboard">Dashboard</Link></li>
                    <li className="breadcrumb-item active">Gestion des devoirs/examens</li>
                </ol>
            </nav>

            <div className="card shadow">
                <div className="card-header bg-primary text-white">
                    <h3 className="card-title mb-0">
                        <i className="fas fa-clipboard-list mr-2"></i>
                        Planning des devoirs et examens
                    </h3>
                </div>
                <div className="card-body">
                    {/* Sélection des filtres */}
                    <div className="mb-4">
                        <h4 className="mb-3">Sélectionnez les paramètres :</h4>
                        <div className="row">
                            <div className="col-md-3">
                                <Form.Group controlId="formAnnee">
                                    <Form.Label>Année scolaire</Form.Label>
                                    <Form.Control
                                        as="select"
                                        value={selectedAnnee?.id || ""}
                                        onChange={(e) => {
                                            const selected = annees.find(a => a.id === parseInt(e.target.value));
                                            setSelectedAnnee(selected || null);
                                        }}
                                    >
                                        <option value="">Sélectionner...</option>
                                        {annees.map(annee => {
                                            const debut = new Date(annee.datedebut).getFullYear();
                                            const fin = new Date(annee.datefin).getFullYear();
                                            return (
                                                <option key={annee.id} value={annee.id}>
                                                    {debut}/{fin}
                                                </option>
                                            );
                                        })}
                                    </Form.Control>
                                </Form.Group>
                            </div>
                            <div className="col-md-3">
                                <Form.Group controlId="formTrimestre">
                                    <Form.Label>Trimestre</Form.Label>
                                    <Form.Control
                                        as="select"
                                        value={selectedTrimestre || ""}
                                        onChange={(e) => setSelectedTrimestre(e.target.value)}
                                    >
                                        <option value="">Sélectionner...</option>
                                        {trimests.map(trimestre => (
                                            <option key={trimestre.id} value={trimestre.id}>
                                                {trimestre.titre}
                                            </option>
                                        ))}
                                    </Form.Control>
                                </Form.Group>
                            </div>
                            <div className="col-md-3">
                                <Form.Group controlId="formNiveau">
                                    <Form.Label>Niveau</Form.Label>
                                    <Form.Control
                                        as="select"
                                        value={selectedNiveau || ""}
                                        onChange={(e) => setSelectedNiveau(e.target.value)}
                                    >
                                        <option value="">Sélectionner...</option>
                                        {niveaux.map(niveau => (
                                            <option key={niveau.id} value={niveau.id}>
                                                {niveau.nomniveau}
                                            </option>
                                        ))}
                                    </Form.Control>
                                </Form.Group>
                            </div>
                            <div className="col-md-3">
                                <Form.Group controlId="formSection">
                                    <Form.Label>Section</Form.Label>
                                    <Form.Control
                                        as="select"
                                        value={selectedSection || ""}
                                        onChange={(e) => setSelectedSection(e.target.value)}
                                        disabled={!selectedNiveau}
                                    >
                                        <option value="">Sélectionner...</option>
                                        {sections.map(section => (
                                            <option key={section.id} value={section.id}>
                                                {section.classe} {section.classearab && `(${section.classearab})`}
                                            </option>
                                        ))}
                                    </Form.Control>
                                </Form.Group>
                            </div>
                        </div>
                        <div className="row mt-3">
                            <div className="col-md-3">
                                <Form.Group controlId="formTypeEvaluation">
                                    <Form.Label>Type d'évaluation</Form.Label>
                                    <Form.Control
                                        as="select"
                                        value={typeEvaluation}
                                        onChange={(e) => setTypeEvaluation(e.target.value)}
                                    >
                                        <option value="devoir">Devoir</option>
                                        <option value="examen">Examen</option>
                                    </Form.Control>
                                </Form.Group>
                            </div>
                            <div className="col-md-9 d-flex align-items-end">
                                <Button
                                    variant="primary"
                                    onClick={handleOpenModal}
                                    disabled={!selectedSection}
                                    className="ml-2"
                                >
                                    <i className="fas fa-plus mr-2"></i>
                                    Ajouter un {typeEvaluation}
                                </Button>
                                <Button
                                    variant="success"
                                    disabled={!selectedSection || devoirs.length === 0}
                                    className="ml-2"
                                >
                                    <i className="fas fa-save mr-2"></i>
                                    Enregistrer le planning
                                </Button>
                                <Button
                                    variant="info"
                                    disabled={!selectedSection || devoirs.length === 0}
                                    className="ml-2"
                                >
                                    <i className="fas fa-print mr-2"></i>
                                    Imprimer le planning
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Tableau des devoirs/examens */}
                    {selectedSection && (
                        <div className="mt-4">
                            <h4 className="mb-3">
                                Planning des {typeEvaluation === "devoir" ? "devoirs" : "examens"} -
                                {sections.find(s => s.id === selectedSection)?.classe}
                            </h4>

                            <div className="table-responsive">
                                <Table striped bordered hover>
                                    <thead className="thead">
                                        <tr>
                                            {jours.map(jour => (
                                                <th key={jour} className="text-center">{jour}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            {jours.map(jour => {
                                                const evaluations = devoirs.filter(
                                                    d => d.jour.toLowerCase() === jour.toLowerCase()
                                                );

                                                return (
                                                    <td key={jour}>
                                                        {evaluations.map(evalItem => (
                                                            <div
                                                                key={evalItem.id}
                                                                className={`p-2 mb-2 rounded ${evalItem.type === "devoir"
                                                                        ? "bg-light text-dark"
                                                                        : "bg-warning text-dark"
                                                                    }`}
                                                            >
                                                                <div className="d-flex justify-content-between">
                                                                    <div>
                                                                        <strong>
                                                                            {evalItem.type === "devoir" ? "Devoir" : "Examen"}
                                                                        </strong>
                                                                        <div className="small">
                                                                            {evalItem.matiere}
                                                                            {evalItem.matiereArabe && (
                                                                                <span> ({evalItem.matiereArabe})</span>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                    <Button
                                                                        variant="link"
                                                                        size="sm"
                                                                        className="text-danger p-0"
                                                                        onClick={() => handleDeleteDevoir(evalItem.id)}
                                                                    >
                                                                        <i className="fas fa-times"></i>
                                                                    </Button>
                                                                </div>
                                                                <div className="small">
                                                                    {formatDate(evalItem.date)}
                                                                </div>
                                                                <div className="small">
                                                                    {evalItem.heureDebut} - {evalItem.heureFin}
                                                                </div>
                                                            </div>
                                                        ))}
                                                        {evaluations.length === 0 && (
                                                            <div className="text-muted text-center">-</div>
                                                        )}
                                                    </td>
                                                );
                                            })}
                                        </tr>
                                    </tbody>
                                </Table>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Modal pour ajouter un devoir/examen */}
            <Modal show={showModal} onHide={handleCloseModal} size="lg">
                <Modal.Header closeButton className="bg-primary text-white">
                    <Modal.Title>
                        Ajouter un {typeEvaluation === "devoir" ? "devoir" : "examen"}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Row>
                            <Col md={6}>
                                <Form.Group controlId="formMatiere">
                                    <Form.Label>Matière</Form.Label>
                                    <Form.Control
                                        as="select"
                                        value={selectedMatiere?.Matiere.id || ""}
                                        onChange={(e) => {
                                            const matiere = matieresNiveau.find(m => m.Matiere.id === parseInt(e.target.value));
                                            setSelectedMatiere(matiere || null);
                                        }}
                                    >
                                        <option value="">Sélectionner une matière...</option>
                                        {matieresNiveau.map(matiereItem => (
                                            <option key={matiereItem.Matiere.id} value={matiereItem.Matiere.id}>
                                                {matiereItem.Matiere.nom} ({matiereItem.Matiere.nomarabe})
                                            </option>
                                        ))}
                                    </Form.Control>
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group controlId="formDate">
                                    <Form.Label>Date</Form.Label>
                                    <Form.Control
                                        type="date"
                                        value={dateEvaluation}
                                        onChange={(e) => setDateEvaluation(e.target.value)}
                                        min={selectedAnnee?.datedebut}
                                        max={selectedAnnee?.datefin}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row className="mt-3">
                            <Col md={6}>
                                <Form.Group controlId="formHeureDebut">
                                    <Form.Label>Heure de début</Form.Label>
                                    <Form.Control
                                        type="time"
                                        value={heureDebut}
                                        onChange={(e) => setHeureDebut(e.target.value)}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group controlId="formHeureFin">
                                    <Form.Label>Heure de fin</Form.Label>
                                    <Form.Control
                                        type="time"
                                        value={heureFin}
                                        onChange={(e) => setHeureFin(e.target.value)}
                                        min={heureDebut}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                        {dateEvaluation && (
                            <Alert variant="info" className="mt-3">
                                Jour sélectionné : {new Date(dateEvaluation).toLocaleDateString('fr-FR', { weekday: 'long' })}
                            </Alert>
                        )}
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        <i className="fas fa-times mr-2"></i>
                        Annuler
                    </Button>
                    <Button variant="primary" onClick={handleAddDevoir}>
                        <i className="fas fa-plus mr-2"></i>
                        Ajouter
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default GestionDevoir;