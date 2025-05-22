import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Card, Button, Spinner, Alert, Modal, Form } from 'react-bootstrap';
import devoir from '../../assets/imgs/duty.png';


const DevoirsEleve = () => {
    const [devoirs, setDevoirs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userId, setUserId] = useState(null);

    const [showModal, setShowModal] = useState(false);
    const [selectedDevoir, setSelectedDevoir] = useState(null);
    const [commentaire, setCommentaire] = useState('');
    const [file, setFile] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            setError('Utilisateur non authentifié.');
            return;
        }

        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            setUserId(payload.userId);
            fetchDevoirs(payload.userId);
        } catch (err) {
            console.error('Erreur de décodage du token:', err);
            setError("Erreur d'identification.");
        }
    }, []);

    const fetchDevoirs = async (id) => {
        try {
            const res = await axios.get(`http://localhost:5000/eleves/eleve/${id}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setDevoirs(res.data);
        } catch (err) {
            console.error(err);
            setError('Erreur lors du chargement des devoirs.');
        } finally {
            setLoading(false);
        }
    };

    const downloadDevoir = async (filename) => {
        try {
            const response = await axios.get(`http://localhost:5000/devoir/download/${filename}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                responseType: 'blob'
            });

            const url = URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', filename);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            alert('Erreur lors du téléchargement');
        }
    };

    const handleShowModal = (devoir) => {
        setSelectedDevoir(devoir);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedDevoir(null);
        setCommentaire('');
        setFile(null);
        setSubmitSuccess(false);
    };

    const handleSubmitTravail = async () => {
        if (!file) {
            alert('Veuillez sélectionner un fichier.');
            return;
        }

        setSubmitting(true);

        const formData = new FormData();
        formData.append('fichier', file);
        formData.append('devoirId', selectedDevoir.id);
        formData.append('eleveId', userId);
        formData.append('commentaire', commentaire);

        try {
            await axios.post(`http://localhost:5000/eleves/traveaux`, formData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'multipart/form-data'
                }
            });
            setSubmitSuccess(true);
            fetchDevoirs(userId);
        } catch (err) {
            console.error(err);
            alert('Erreur lors de la soumission');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <>
            <nav>
                <Link to="/elevesinterface" className="text-primary">Accueil</Link>
                <span> / Mes Devoirs</span>
            </nav>
            <div className="container py-4">
                {/* En-tête avec image et titre */}
                <div className="card card-primary card-outline mb-4">
                    <div className="card-header d-flex align-items-center" style={{ backgroundColor: '#F8F8F8' }}>
                        <img src={devoir} alt="Devoir" width="90px" />
                        <p className="card-title mt-4 ml-3 p-2 text-center"
                            style={{
                                width: '350px',
                                borderRadius: '50px',
                                border: '1px solid rgb(215, 214, 216)'
                            }}>
                            Mes Devoirs à Réaliser
                        </p>
                    </div>
                    <div className='card card-body'>
                        {/* Affichage des devoirs */}
                        {loading ? (
                            <Spinner animation="border" />
                        ) : error ? (
                            <Alert variant="danger">{error}</Alert>
                        ) : devoirs.length === 0 ? (
                            <Alert variant="info">Aucun devoir pour le moment.</Alert>
                        ) : (
                            <div className="devoirs-grid">
                                {devoirs.map((devoir) => (
                                    <Card className="mb-3 shadow-sm" key={devoir.id} style={{ border: '1px solid rgb(228, 227, 227)' }}>
                                        <Card.Body>
                                            <Card.Title>{devoir.Matiere?.nom || 'Matière inconnue'}</Card.Title>
                                            <Card.Text>{devoir.description}</Card.Text>
                                            <small className="text-muted d-block mb-1">
                                                À rendre avant le {new Date(devoir.dateLimite).toLocaleDateString()}
                                            </small>
                                            {new Date() > new Date(devoir.dateLimite) && (
                                                <small className="text-danger fw-bold">
                                                    <strong>⚠️ Date limite dépassée !</strong>
                                                </small>
                                            )} <br />
                                            <Button
                                                variant="outline-primary"
                                                onClick={() => downloadDevoir(devoir.fichier)}
                                                className="me-2"
                                            >
                                                Télécharger
                                            </Button>
                                            <Button
                                                variant="success"
                                                onClick={() => handleShowModal(devoir)}
                                                disabled={new Date() > new Date(devoir.dateLimite)}
                                                title={new Date() > new Date(devoir.dateLimite) ? "Date limite dépassée" : "Répondre au devoir"}
                                            >
                                                Répondre
                                            </Button>

                                        </Card.Body>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Modal de soumission */}
                <Modal show={showModal} onHide={handleCloseModal} size="lg">
                    <Modal.Header closeButton>
                        <Modal.Title>Réponse au devoir</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {submitSuccess ? (
                            <Alert variant="success">Travail soumis avec succès !</Alert>
                        ) : (
                            <Form>
                                <Form.Group controlId="fichier">
                                    <Form.Label>Fichier</Form.Label>
                                    <Form.Control type="file" onChange={(e) => setFile(e.target.files[0])} />
                                </Form.Group>
                                <Form.Group controlId="commentaire" className="mt-3">
                                    <Form.Label>Commentaire</Form.Label>
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
                            <Button variant="primary" onClick={handleSubmitTravail} disabled={submitting}>
                                {submitting ? 'Envoi en cours...' : 'Soumettre'}
                            </Button>
                        )}
                    </Modal.Footer>
                </Modal>
            </div>
        </>
    );

};

export default DevoirsEleve;
