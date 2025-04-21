import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Button, Modal, Form, Row, Col, Alert, Badge, Spinner } from 'react-bootstrap';

const DisponibiliteEnseignants = () => {
    const [enseignants, setEnseignants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [currentEnseignant, setCurrentEnseignant] = useState(null);
    const [formData, setFormData] = useState({});
    const [successMessage, setSuccessMessage] = useState('');

    const joursSemaine = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi'];

    useEffect(() => {
        fetchEnseignants();
    }, []);

    const fetchEnseignants = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setError('Veuillez vous reconnecter');
                return;
            }
            const response = await axios.get('http://localhost:5000/enseignant/disponibilites', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            console.log('Données brutes reçues:', JSON.stringify(response.data, null, 2));

            const processedData = response.data.map(enseignant => {
                const dispoParsed = typeof enseignant.disponibilites === 'string'
                    ? JSON.parse(enseignant.disponibilites)
                    : enseignant.disponibilites;

                return {
                    ...enseignant,
                    disponibilites: {
                        lundi: { disponible: false, heures: [] },
                        mardi: { disponible: false, heures: [] },
                        mercredi: { disponible: false, heures: [] },
                        jeudi: { disponible: false, heures: [] },
                        dimanche: { disponible: false, heures: [] },
                        ...dispoParsed
                    }
                };
            });

            setEnseignants(processedData);
            setError(null);
        } catch (error) {
            console.error('Erreur:', {
                message: error.message,
                response: error.response?.data,
                config: error.config
            });
            setError('Aucun Enseignants');
            setEnseignants([]);
        } finally {
            setLoading(false);
        }
    };

    const handleEditDisponibilites = (enseignant) => {
        setCurrentEnseignant(enseignant);
        setFormData({ ...enseignant.disponibilites });
        setModalVisible(true);
    };

    const renderDisponibiliteCell = (dispo) => {
        if (!dispo || !dispo.disponible || !dispo.heures || dispo.heures.length === 0) {
            return <Badge bg="secondary">Non disponible</Badge>;
        }

        return dispo.heures.map((h, i) => (
            <div key={i}>
                <Badge bg="success">{h.debut} - {h.fin}</Badge>
            </div>
        ));
    };

    const handleFormChange = (jour, field, value) => {
        setFormData(prev => ({
            ...prev,
            [jour]: {
                ...prev[jour],
                [field]: value
            }
        }));
    };

    const handleTimeSlotChange = (jour, index, field, value) => {
        setFormData(prev => {
            const newHeures = [...prev[jour].heures];
            newHeures[index] = {
                ...newHeures[index],
                [field]: value
            };
            return {
                ...prev,
                [jour]: {
                    ...prev[jour],
                    heures: newHeures
                }
            };
        });
    };

    const addTimeSlot = (jour) => {
        setFormData(prev => ({
            ...prev,
            [jour]: {
                ...prev[jour],
                heures: [...prev[jour].heures, { debut: '', fin: '' }]
            }
        }));
    };

    const removeTimeSlot = (jour, index) => {
        setFormData(prev => {
            const newHeures = [...prev[jour].heures];
            newHeures.splice(index, 1);
            return {
                ...prev,
                [jour]: {
                    ...prev[jour],
                    heures: newHeures
                }
            };
        });
    };

    const handleSaveDisponibilites = async () => {
        try {
            await axios.put(`/enseignant/disponibilites/${currentEnseignant.id}`, {
                disponibilites: formData
            });

            setSuccessMessage('Disponibilités mises à jour avec succès');
            setModalVisible(false);
            fetchEnseignants();
            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (error) {
            setError('Erreur lors de la mise à jour des disponibilités');
        }
    };

    if (loading) {
        return (
            <div className="text-center mt-5">
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Chargement...</span>
                </Spinner>
            </div>
        );
    }

    if (error) {
        return <Alert variant="danger">{error}</Alert>;
    }

    return (
        <div className="container mt-4">
            <h1 className="mb-4">Disponibilités des Enseignants</h1>

            {successMessage && (
                <Alert variant="success" onClose={() => setSuccessMessage('')} dismissible>
                    {successMessage}
                </Alert>
            )}

            <div className="table-responsive">
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>Nom</th>
                            <th>Nom Arabe</th>
                            {joursSemaine.map(jour => (
                                <th key={jour}>{jour.charAt(0).toUpperCase() + jour.slice(1)}</th>
                            ))}
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {enseignants.length > 0 ? (
                            enseignants.map(enseignant => (
                                <tr key={enseignant.id}>
                                    <td>{enseignant.Employe?.User?.prenom} {enseignant.Employe?.User?.nom}</td>
                                    <td>{enseignant.Employe?.User?.prenom_ar} {enseignant.Employe?.User?.nom_ar}</td>
                                    {joursSemaine.map(jour => (
                                        <td key={jour}>
                                            {renderDisponibiliteCell(enseignant.disponibilites[jour])}
                                        </td>
                                    ))}
                                    <td>
                                        <Button variant="primary" size="sm" onClick={() => handleEditDisponibilites(enseignant)}>
                                            Modifier
                                        </Button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={joursSemaine.length + 3} className="text-center">
                                    Aucun enseignant trouvé
                                </td>
                            </tr>
                        )}
                    </tbody>
                </Table>
            </div>

            <Modal show={modalVisible} onHide={() => setModalVisible(false)} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>
                        Modifier disponibilités - {currentEnseignant?.Employe?.User?.prenom} {currentEnseignant?.Employe?.User?.nom}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {currentEnseignant && (
                        <Form>
                            {joursSemaine.map(jour => (
                                <div key={jour} className="mb-4 p-3 border rounded">
                                    <Form.Group as={Row} className="mb-3">
                                        <Col sm={12}>
                                            <Form.Check
                                                type="switch"
                                                id={`${jour}-disponible`}
                                                label={`Disponible le ${jour}`}
                                                checked={formData[jour]?.disponible || false}
                                                onChange={(e) => handleFormChange(jour, 'disponible', e.target.checked)}
                                            />
                                        </Col>
                                    </Form.Group>

                                    {formData[jour]?.disponible && (
                                        <>
                                            <h6>Créneaux horaires</h6>
                                            {formData[jour].heures?.map((h, index) => (
                                                <Row key={index} className="mb-3 g-2 align-items-center">
                                                    <Col sm={4}>
                                                        <Form.Label>Début</Form.Label>
                                                        <Form.Control
                                                            type="time"
                                                            value={h.debut}
                                                            onChange={(e) => handleTimeSlotChange(jour, index, 'debut', e.target.value)}
                                                        />
                                                    </Col>
                                                    <Col sm={4}>
                                                        <Form.Label>Fin</Form.Label>
                                                        <Form.Control
                                                            type="time"
                                                            value={h.fin}
                                                            onChange={(e) => handleTimeSlotChange(jour, index, 'fin', e.target.value)}
                                                        />
                                                    </Col>
                                                    <Col sm={4}>
                                                        <Button variant="danger" size="sm" onClick={() => removeTimeSlot(jour, index)}>
                                                            Supprimer
                                                        </Button>
                                                    </Col>
                                                </Row>
                                            ))}
                                            <Button variant="outline-primary" size="sm" onClick={() => addTimeSlot(jour)}>
                                                Ajouter un créneau
                                            </Button>
                                        </>
                                    )}
                                </div>
                            ))}
                        </Form>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setModalVisible(false)}>Annuler</Button>
                    <Button variant="primary" onClick={handleSaveDisponibilites}>Enregistrer</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default DisponibiliteEnseignants;
