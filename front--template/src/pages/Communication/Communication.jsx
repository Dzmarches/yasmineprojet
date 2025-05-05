import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Button, Modal, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Communication = () => {
    const [niveaux, setNiveaux] = useState([]);
    const [selectedNiveau, setSelectedNiveau] = useState(null);
    const [sections, setSections] = useState([]);
    const [selectedSection, setSelectedSection] = useState(null);
    const [eleves, setEleves] = useState([]);
    const [selectedEleves, setSelectedEleves] = useState([]);
    const [showEmailModal, setShowEmailModal] = useState(false);
    const [emailData, setEmailData] = useState({
        subject: '',
        message: ''
    });
    const [loading, setLoading] = useState(false);

    const token = localStorage.getItem('token');
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };

    // Récupérer les niveaux
    useEffect(() => {
        const fetchNiveaux = async () => {
            try {
                const response = await axios.get("http://localhost:5000/niveaux", config);
                setNiveaux(response.data);
            } catch (error) {
                console.error("Erreur lors du chargement des niveaux", error);
                toast.error("Erreur lors du chargement des niveaux");
            }
        };
        fetchNiveaux();
    }, []);

    // Récupérer les sections quand un niveau est sélectionné
    useEffect(() => {
        const fetchSections = async () => {
            if (selectedNiveau) {
                try {
                    const response = await axios.get(
                        `http://localhost:5000/sections/niveau/${selectedNiveau}`,
                        config
                    );
                    setSections(response.data);
                    setSelectedSection(null);
                    setEleves([]);
                } catch (error) {
                    console.error("Erreur lors du chargement des sections", error);
                    toast.error("Erreur lors du chargement des sections");
                }
            }
        };
        fetchSections();
    }, [selectedNiveau]);

    // Récupérer les élèves quand une section est sélectionnée
    useEffect(() => {
        const fetchEleves = async () => {
            if (selectedSection) {
                try {
                    const response = await axios.get(
                        `http://localhost:5000/eleves/section/${selectedSection}`,
                        config
                    );
                    setEleves(response.data);
                    setSelectedEleves([]); // Réinitialiser la sélection
                } catch (error) {
                    console.error("Erreur lors du chargement des élèves", error);
                    toast.error("Erreur lors du chargement des élèves");
                }
            }
        };
        fetchEleves();
    }, [selectedSection]);

    // Gérer la sélection/désélection d'un élève
    const handleSelectEleve = (eleveId) => {
        setSelectedEleves(prev => {
            if (prev.includes(eleveId)) {
                return prev.filter(id => id !== eleveId);
            } else {
                return [...prev, eleveId];
            }
        });
    };

    // Sélectionner/désélectionner tous les élèves
    const handleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedEleves(eleves.map(eleve => eleve.id));
        } else {
            setSelectedEleves([]);
        }
    };

    // Ouvrir le modal d'envoi d'email
    const handleOpenEmailModal = () => {
        if (selectedEleves.length === 0) {
            toast.warning("Veuillez sélectionner au moins un élève");
            return;
        }
        setShowEmailModal(true);
    };

    // Envoyer les emails
    const handleSendEmails = async () => {
        if (!emailData.subject || !emailData.message) {
            toast.warning("Veuillez remplir tous les champs");
            return;
        }

        setLoading(true);
        try {
            await axios.post(
                "http://localhost:5000/communication/send-emails",
                {
                    eleveIds: selectedEleves,
                    subject: emailData.subject,
                    message: emailData.message
                },
                config
            );
            toast.success("Emails envoyés avec succès");
            setShowEmailModal(false);
            setEmailData({ subject: '', message: '' });
        } catch (error) {
            console.error("Erreur lors de l'envoi des emails", error);
            toast.error("Erreur lors de l'envoi des emails");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container-fluid py-3">
            <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                    <li className="breadcrumb-item"><Link to="/dashboard">Dashboard</Link></li>
                    <li className="breadcrumb-item active">Communication</li>
                </ol>
            </nav>

            <div className="card shadow mb-4">
                <div className="card-header bg-primary text-white">
                    <h3 className="card-title mb-0">Communication avec les élèves</h3>
                </div>
                <div className="card-body">
                    <div className="row mb-4">
                        <div className="col-md-4">
                            <Form.Group controlId="formNiveau">
                                <Form.Label>Niveau</Form.Label>
                                <Form.Control
                                    as="select"
                                    value={selectedNiveau || ''}
                                    onChange={(e) => setSelectedNiveau(e.target.value)}
                                >
                                    <option value="">Sélectionnez un niveau</option>
                                    {niveaux.map((niveau) => (
                                        <option key={niveau.id} value={niveau.id}>
                                            {niveau.nomniveau}
                                        </option>
                                    ))}
                                </Form.Control>
                            </Form.Group>
                        </div>

                        <div className="col-md-4">
                            <Form.Group controlId="formSection">
                                <Form.Label>Section</Form.Label>
                                <Form.Control
                                    as="select"
                                    value={selectedSection || ''}
                                    onChange={(e) => setSelectedSection(e.target.value)}
                                    disabled={!selectedNiveau}
                                >
                                    <option value="">Sélectionnez une section</option>
                                    {sections.map((section) => (
                                        <option key={section.id} value={section.id}>
                                            {section.classe} {section.classearab && `(${section.classearab})`}
                                        </option>
                                    ))}
                                </Form.Control>
                            </Form.Group>
                        </div>
                    </div>

                    {eleves.length > 0 && (
                        <div className="table-responsive">
                            <div className="d-flex justify-content-between mb-3">
                                <div>
                                    <Form.Check
                                        type="checkbox"
                                        id="select-all"
                                        label="Tout sélectionner"
                                        checked={selectedEleves.length === eleves.length}
                                        onChange={handleSelectAll}
                                    />
                                </div>
                                <Button
                                    variant="primary"
                                    onClick={handleOpenEmailModal}
                                    disabled={selectedEleves.length === 0}
                                >
                                    <i className="fas fa-envelope mr-2"></i>
                                    Envoyer un email ({selectedEleves.length})
                                </Button>
                            </div>

                            <Table striped bordered hover>
                                <thead>
                                    <tr>
                                        <th>Sélection</th>
                                        <th>Numéro Identification</th>
                                        <th>Nom & Prénom</th>
                                        <th>Email</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {eleves.map((eleve) => (
                                        <tr key={eleve.id}>
                                            <td>
                                                <Form.Check
                                                    type="checkbox"
                                                    checked={selectedEleves.includes(eleve.id)}
                                                    onChange={() => handleSelectEleve(eleve.id)}
                                                />
                                            </td>
                                            <td>{eleve.numidentnational}</td>
                                            <td>{eleve.User?.prenom} {eleve.User?.nom}</td>
                                            <td>{eleve.User?.email || 'Non renseigné'}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </div>
                    )}
                </div>
            </div>

            {/* Modal pour l'envoi d'email */}
            <Modal show={showEmailModal} onHide={() => setShowEmailModal(false)} size="lg">
                <Modal.Header closeButton className="bg-primary text-white">
                    <Modal.Title>Envoyer un email</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="formSubject" className="mb-3">
                            <Form.Label>Sujet</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Sujet de l'email"
                                value={emailData.subject}
                                onChange={(e) => setEmailData({...emailData, subject: e.target.value})}
                            />
                        </Form.Group>

                        <Form.Group controlId="formMessage">
                            <Form.Label>Message</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={8}
                                placeholder="Contenu du message"
                                value={emailData.message}
                                onChange={(e) => setEmailData({...emailData, message: e.target.value})}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowEmailModal(false)}>
                        Annuler
                    </Button>
                    <Button 
                        variant="primary" 
                        onClick={handleSendEmails}
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <span className="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true"></span>
                                Envoi en cours...
                            </>
                        ) : (
                            'Envoyer'
                        )}
                    </Button>
                </Modal.Footer>
            </Modal>

            <ToastContainer position="top-right" autoClose={5000} />
        </div>
    );
};

export default Communication;