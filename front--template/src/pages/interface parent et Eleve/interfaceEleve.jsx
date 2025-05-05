import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Card, Spinner, Table ,Alert, Modal, Form } from 'react-bootstrap';
import { FaBook, FaClock } from 'react-icons/fa';
import { MdAssignment } from 'react-icons/md';
import { GiTeacher } from 'react-icons/gi';

const InterfaceEleve = () => {
    const [activeStep, setActiveStep] = useState(0);
    const [eleve, setEleve] = useState(null);
    const [notes, setNotes] = useState([]);
    const [devoirs, setDevoirs] = useState([]);
    const [emploiTemps, setEmploiTemps] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingDevoirs, setLoadingDevoirs] = useState(false);
    const [error, setError] = useState(null);
    const [userId, setUserId] = useState(null); // Nouvel état pour stocker l'ID utilisateur
    const [showModal, setShowModal] = useState(false);
    const [selectedDevoir, setSelectedDevoir] = useState(null);
    const [commentaire, setCommentaire] = useState('');
    const [file, setFile] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);

    const steps = [
        { id: 0, label: 'Notes', icon: <FaBook /> },
        { id: 1, label: 'Devoirs', icon: <MdAssignment /> },
        { id: 2, label: 'Emploi du temps', icon: <FaClock /> }
    ];

    useEffect(() => {
        // Fonction pour décoder le token JWT et récupérer le userId
        const getUserIdFromToken = () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    // Décoder la partie payload du token
                    const payload = JSON.parse(atob(token.split('.')[1]));
                    setUserId(payload.userId); // Stocker l'ID utilisateur
                    fetchEleveData(payload.userId); // Utiliser l'ID pour récupérer les données
                } catch (error) {
                    console.error("Erreur lors du décodage du token:", error);
                    setError("Erreur d'authentification");
                }
            } else {
                setError("Token non trouvé");
            }
        };

        // Fonction pour récupérer les données de l'élève
        const fetchEleveData = async (userId) => {
            try {
                const response = await axios.get(`http://localhost:5000/eleves/${userId}`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
                setEleve(response.data);

                // Ici vous pouvez aussi charger les notes, devoirs, etc.
                // en utilisant le userId

                setLoading(false);
            } catch (err) {
                console.error("Erreur lors de la récupération des données:", err);
                setError(err.response?.data?.message || "Erreur de chargement");
                setLoading(false);
            }
        };

        getUserIdFromToken();
    }, []);

    const fetchDevoirs = async (userId) => {
        setLoadingDevoirs(true);
        try {
            const response = await axios.get(`http://localhost:5000/eleves/eleve/${userId}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            setDevoirs(response.data);
        } catch (error) {
            console.error("Erreur lors du chargement des devoirs:", error);
            setError(error.response?.data?.message || "Erreur de chargement des devoirs");
        } finally {
            setLoadingDevoirs(false);
        }
    };

    // Charger les devoirs quand l'utilisateur change ou quand on active l'onglet
    useEffect(() => {
        if (userId && activeStep === 1) { // 1 correspond à l'onglet Devoirs
            fetchDevoirs(userId);
        }
    }, [userId, activeStep]);

    // Fonction pour rafraîchir les devoirs
    const handleRefreshDevoirs = () => {
        if (userId) {
            fetchDevoirs(userId);
        }
    };

    const downloadDevoir = async (filename) => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get(
                `http://localhost:5000/devoir/download/${filename}`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                    responseType: 'blob' // Important pour les téléchargements de fichiers
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


    const handleShowModal = (devoir) => {
        setSelectedDevoir(devoir);
        setShowModal(true);
    };

    // Fonction pour fermer la modal
    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedDevoir(null);
        setCommentaire('');
        setFile(null);
        setSubmitSuccess(false);
    };

    const handleSubmitTravail = async () => {
        if (!file) {
            alert('Veuillez sélectionner un fichier');
            return;
        }

        setSubmitting(true);

        const formData = new FormData();
        formData.append('fichier', file);
        formData.append('devoirId', selectedDevoir.id);
        formData.append('eleveId', userId);
        formData.append('commentaire', commentaire);

        try {
            const response = await axios.post('http://localhost:5000/eleves/traveaux', formData, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'multipart/form-data'
                }
            });

            setSubmitSuccess(true);
            // Rafraîchir la liste des devoirs
            fetchDevoirs(userId);
        } catch (error) {
            console.error("Erreur lors de la soumission:", error);
            alert("Erreur lors de la soumission du travail");
        } finally {
            setSubmitting(false);
        }
    };

    // Modifier le rendu des devoirs pour inclure le bouton de réponse
    const renderDevoirsContent = () => (
        <Card className="shadow-lg">
            <Card.Body>
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h4>Devoirs à rendre</h4>
                </div>

                {loadingDevoirs ? (
                    <div className="text-center">
                        <Spinner animation="border" variant="primary" />
                    </div>
                ) : error ? (
                    <Alert variant="danger">{error}</Alert>
                ) : devoirs.length === 0 ? (
                    <Alert variant="info">Aucun devoir à rendre pour le moment</Alert>
                ) : (
                    <div className="devoirs-list">
                        {devoirs.map((devoir, index) => (
                            <div key={index} className="devoir-item mb-4 p-3 border rounded">
                                <div className="d-flex justify-content-between align-items-center">
                                    <div>
                                        <h5>{devoir.Matiere?.nom || 'Matière inconnue'}</h5>
                                        <p className="text-muted mb-1">{devoir.description}</p>
                                        <small className="text-danger">
                                            À rendre avant le {new Date(devoir.dateLimite).toLocaleDateString()}
                                        </small>
                                        <div className="mt-2">
                                            <small className="text-muted">
                                                Donné par: {devoir.Enseignant?.prenom} {devoir.Enseignant?.nom}
                                            </small>
                                        </div>
                                    </div>
                                    <div>
                                        <Button
                                            variant="outline-primary"
                                            onClick={() => downloadDevoir(devoir.fichier)}
                                            className="mr-2"
                                        >
                                            Télécharger
                                        </Button>
                                        <Button
                                            variant="success"
                                            onClick={() => handleShowModal(devoir)}
                                        >
                                            Répondre
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Modal de réponse */}
                <Modal show={showModal} onHide={handleCloseModal} size="lg">
                    <Modal.Header closeButton>
                        <Modal.Title>Réponse au devoir: {selectedDevoir?.Matiere?.nom}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {submitSuccess ? (
                            <Alert variant="success">
                                Votre travail a été soumis avec succès!
                            </Alert>
                        ) : (
                            <Form>
                                <Form.Group controlId="formFile" className="mb-3">
                                    <Form.Label>Fichier à rendre</Form.Label>
                                    <Form.Control 
                                        type="file" 
                                        onChange={(e) => setFile(e.target.files[0])} 
                                        required
                                    />
                                </Form.Group>
                                <Form.Group controlId="formComment" className="mb-3">
                                    <Form.Label>Commentaire (optionnel)</Form.Label>
                                    <Form.Control 
                                        as="textarea" 
                                        rows={3} 
                                        value={commentaire}
                                        onChange={(e) => setCommentaire(e.target.value)}
                                    />
                                </Form.Group>
                            </Form>
                        )}
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleCloseModal}>
                            Fermer
                        </Button>
                        {!submitSuccess && (
                            <Button 
                                variant="primary" 
                                onClick={handleSubmitTravail}
                                disabled={submitting}
                            >
                                {submitting ? (
                                    <>
                                        <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                                        <span className="ml-2">Envoi en cours...</span>
                                    </>
                                ) : 'Soumettre'}
                            </Button>
                        )}
                    </Modal.Footer>
                </Modal>
            </Card.Body>
        </Card>
    );

    const renderStepContent = () => {
        switch (activeStep) {

            case 1: // Devoirs
                return renderDevoirsContent();

            case 2: // Emploi du temps
                return (
                    <Card className="shadow-lg">
                        <Card.Body>
                            <h4 className="mb-4">Emploi du temps</h4>
                            {emploiTemps.length === 0 ? (
                                <div className="alert alert-info">
                                    Emploi du temps non disponible
                                </div>
                            ) : (
                                <div className="table-responsive">
                                    <Table bordered className="timetable">
                                        <thead>
                                            <tr>
                                                <th>Heure</th>
                                                <th>Lundi</th>
                                                <th>Mardi</th>
                                                <th>Mercredi</th>
                                                <th>Jeudi</th>
                                                <th>Vendredi</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {emploiTemps.map((creneau, index) => (
                                                <tr key={index}>
                                                    <td>{creneau.heure}</td>
                                                    {['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi'].map((jour) => (
                                                        <td key={jour}>
                                                            <div className="cours-item">
                                                                {creneau[jour] && (
                                                                    <>
                                                                        <GiTeacher className="mr-2" />
                                                                        <strong>{creneau[jour].matiere}</strong>
                                                                        <div>{creneau[jour].salle}</div>
                                                                    </>
                                                                )}
                                                            </div>
                                                        </td>
                                                    ))}
                                                </tr>
                                            ))}
                                        </tbody>
                                    </Table>
                                </div>
                            )}
                        </Card.Body>
                    </Card>
                );

            default:
                return null;
        }
    };

    return (
        <div className="container py-5">
            <div className="stepper-wrapper mb-5">
                <div className="stepper">
                    {steps.map((step) => (
                        <div
                            key={step.id}
                            className={`stepper-item ${activeStep === step.id ? 'active' : ''}`}
                            onClick={() => setActiveStep(step.id)}
                        >
                            <div className="stepper-icon">
                                {step.icon}
                            </div>
                            <div className="stepper-label">{step.label}</div>
                        </div>
                    ))}
                </div>
            </div>

            {renderStepContent()}

            <style jsx>{`
                .stepper {
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 2rem;
                }

                .stepper-item {
                    flex: 1;
                    text-align: center;
                    cursor: pointer;
                    padding: 1rem;
                    transition: all 0.3s ease;
                    position: relative;
                }

                .stepper-item:not(:last-child):after {
                    content: '';
                    position: absolute;
                    width: 100%;
                    height: 2px;
                    background: #dee2e6;
                    top: 40%;
                    left: 50%;
                    z-index: 0;
                }

                .stepper-icon {
                    width: 50px;
                    height: 50px;
                    border-radius: 50%;
                    background: #f8f9fa;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin: 0 auto 1rem;
                    font-size: 1.5rem;
                    color: #6c757d;
                    border: 2px solid #dee2e6;
                    transition: all 0.3s ease;
                    position: relative;
                    z-index: 1;
                }

                .stepper-item.active .stepper-icon {
                    background: #007bff;
                    color: white;
                    border-color: #007bff;
                }

                .stepper-label {
                    color: #6c757d;
                    font-weight: 500;
                }

                .stepper-item.active .stepper-label {
                    color: #007bff;
                }

                .table-notes th {
                    background: #007bff;
                    color: white;
                }

                .timetable th {
                    background: #f8f9fa;
                    text-align: center;
                }

                .timetable td {
                    vertical-align: middle;
                    min-width: 150px;
                }

                .cours-item {
                    padding: 0.5rem;
                    background: #f8f9fa;
                    border-radius: 4px;
                    text-align: center;
                }

                .devoir-item {
                    transition: transform 0.2s;
                }

                .devoir-item:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                }
            `}</style>
        </div>
    );
};

export default InterfaceEleve;