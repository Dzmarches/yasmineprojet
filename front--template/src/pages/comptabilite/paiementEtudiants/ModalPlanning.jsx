import React, { useState } from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import moment from 'moment';
import archive from '../../../assets/imgs/archive.png';
import edit from '../../../assets/imgs/edit.png';
import axios from 'axios';

const PlanningModal = ({ show, handleCloseP, planning, FindContrat }) => {


    const [isEditMode, setIsEditMode] = useState(false);  // Mode édition
    const [editPlan, setEditPlan] = useState(null); // Données du planning à modifier
    const [formData, setFormData] = useState({
        code: '',
        montant_echeance: '',
        montant_restant: '',
        etat_paiement: '',
        date_paiement: '',
        mode_paiement: '',
        date_echeance: '',
    });

    //archivage 
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [ppIdDelete, setppIdDelete] = useState(null);


    // Modifier un planning
    const ModifierP = (planId) => {
        const selectedPlan = planning.find(plan => plan.id === planId);
        setEditPlan(selectedPlan);
        setFormData({
            code: selectedPlan.codePP,
            montant_echeance: selectedPlan.montant_echeance,
            montant_restant: selectedPlan.montant_restant,
            etat_paiement: selectedPlan.etat_paiement,
            date_paiement: selectedPlan.date_paiement ? moment(selectedPlan.date_paiement).format('YYYY-MM-DD') : '',
            date_echeance: selectedPlan.date_echeance ? moment(selectedPlan.date_echeance).format('YYYY-MM-DD') : '',
            mode_paiement: selectedPlan.mode_paiement
        });
        setIsEditMode(true);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name === 'etat_paiement') {
            if (value === 'payé') {
                setFormData((prev) => ({
                    ...prev,
                    etat_paiement: value,
                    montant_restant: 0, // Paié = montant restant = 0
                }));
            } else if (value === 'non payé') {
                setFormData((prev) => ({
                    ...prev,
                    etat_paiement: value,
                    montant_restant: editPlan?.montant_restant ?? prev.montant_restant,
                    date_paiement: '',
                    mode_paiement: '',
                }));
            } else {
                setFormData((prev) => ({
                    ...prev,
                    [name]: value,
                }));
            }
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
    };


    const handleSaveChanges = async () => {
        // Préparer les données à envoyer
        const updatedData = { ...formData, id: editPlan.id };
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                console.error('Aucun token trouvé. Veuillez vous connecter.');
                return;
            }
            const response = await fetch(`http://localhost:5000/contrat/modifierPlanning/${editPlan.id}`, {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedData),
            });

            if (response.ok) {
                const result = await response.json();
                setIsEditMode(false);
                await FindContrat(editPlan.ContratId);
            } else {
                console.error('Erreur lors de la mise à jour');
            }
        } catch (error) {
            console.error('Erreur de réseau', error);
        }
    };

    const handleShow = (id) => {
        setppIdDelete(id);
        setShowDeleteModal(true);
    };
    const handleClose = () => setShowDeleteModal(false);

    const Archiver = async (id) => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                alert("Vous devez être connecté");
                return;
            }
            const response = await axios.patch(`http://localhost:5000/contrat/archiver/pp/${id}`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });
            setShowDeleteModal(false);
        } catch (error) {
            console.log("Erreur", error);
        }
    };

    return (
        <Modal show={show} onHide={handleCloseP} size="xl" centered>
            <Modal.Header closeButton className="bg-info text-white">
                <Modal.Title>
                    Planning de paiement
                </Modal.Title>
            </Modal.Header>
            {isEditMode && (
                <Modal.Body>
                    <Form className="container-fluid">
                        <Row>
                            <Col md={3}>
                                <Form.Group controlId="formCode">
                                    <Form.Label>Code</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="code"
                                        value={formData.code}
                                        onChange={handleInputChange}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={3}>
                                <Form.Group controlId="formDateEcheance">
                                    <Form.Label>Date Échéance</Form.Label>
                                    <Form.Control
                                        type="date"
                                        name="date_echeance"
                                        value={formData.date_echeance}
                                        onChange={handleInputChange}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={3}>
                                <Form.Group controlId="formMontantEcheance">
                                    <Form.Label>Montant Échéance</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="montant_echeance"
                                        value={formData.montant_echeance}
                                        onChange={handleInputChange}
                                    />
                                </Form.Group>
                            </Col>

                            <Col md={3}>
                                <Form.Group controlId="formMontantRestant">
                                    <Form.Label>Montant Restant</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="montant_restant"
                                        value={formData.montant_restant}
                                        onChange={handleInputChange}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row>
                            <Col md={3}>
                                <Form.Group controlId="formEtatPaiement">
                                    <Form.Label>État Paiement</Form.Label>
                                    <Form.Control
                                        as="select"  // Utiliser "as" pour un select
                                        name="etat_paiement"
                                        value={formData.etat_paiement}
                                        onChange={handleInputChange}
                                        style={{ height: "30px" }}
                                    >
                                        <option value="">Sélectionnez l'état du paiement</option>
                                        <option value="payé">Payé</option>
                                        <option value="non payé">Non payé</option>
                                    </Form.Control>
                                </Form.Group>
                            </Col>

                            <Col md={3}>
                                <Form.Group controlId="formDatePaiement">
                                    <Form.Label>Date Paiement</Form.Label>
                                    <Form.Control
                                        type="date"
                                        name="date_paiement"
                                        value={formData.date_paiement}
                                        onChange={handleInputChange}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={3}>
                                <Form.Group controlId="formModePaiement">
                                    <Form.Label>Mode Paiement</Form.Label>
                                    <Form.Control
                                        as="select"
                                        name="mode_paiement"
                                        value={formData.mode_paiement}
                                        onChange={handleInputChange}
                                        style={{ height: "30px" }}
                                    >
                                        <option value="">Sélectionnez un mode</option>
                                        <option value="paiement en espéces">Paiement en espéces</option>
                                        <option value="virement bancaire">Virement bancaire</option>
                                        <option value="CCP">CCP</option>
                                        <option value="Chèques">Chèques</option>
                                    </Form.Control>
                                </Form.Group>
                            </Col>
                        </Row>

                        <div className="d-flex justify-content-between mt-3">
                            <Button variant="primary" onClick={handleSaveChanges}>
                                Enregistrer
                            </Button>
                            <Button variant="secondary" onClick={() => setIsEditMode(false)}>
                                Annuler
                            </Button>
                        </div>
                    </Form>
                </Modal.Body>
            )}

            <Modal.Body style={{ maxHeight: '500px', overflowY: 'auto' }}>
                {planning ? (
                    <div className="table-container">
                        <table className="table border table-hover">
                            <thead>
                                <tr>
                                    <th>Id</th>
                                    <th>Code Contrat</th>
                                    <th>Code</th>
                                    <th>Date Échéance</th>
                                    <th>Montant Échéance</th>
                                    <th>Montant Restant</th>
                                    <th>État Paiement</th>
                                    <th>Date Paiement</th>
                                    <th>Mode Paiement</th>
                                    <th>Modifier</th>
                                </tr>
                            </thead>
                            <tbody>
                                {planning.map((plan, index) => {
                                    // calcul de la classe de la ligne
                                    const due = moment(plan.date_echeance);
                                    const now = moment();
                                    const daysDiff = due.diff(now, 'days');
                                    let rowClass = '';
                                    if (plan.etat_paiement === 'payé') {
                                        rowClass = 'row-paid ';           // vert
                                    } else if (due.isBefore(now, 'day') && plan.etat_paiement !== 'payé') {
                                        rowClass = 'row-overdue';             // rouge
                                    } else if (daysDiff <= 7) {
                                        rowClass = 'row-soon';            // jaune
                                    }

                                    let style = {};
                                    if (plan.etat_paiement === 'payé') {
                                        style = { backgroundColor: '#e6f4ea' };
                                    } else if (due.isBefore(now)) {
                                        style = { backgroundColor: '#ffe5e5' };
                                    } else if (daysDiff <= 7) {
                                        style = { backgroundColor: '#fff4cc' };
                                    }

                                    return (
                                        <tr key={plan.id} className={rowClass}>
                                            <td>{index + 1}</td>
                                            <td>{plan.Contrat?.code}</td>
                                            <td>{plan.codePP}</td>
                                            <td>{plan.date_echeance ? moment(plan.date_echeance).format('DD-MM-YYYY') : ''}</td>
                                            <td>{parseFloat(plan.montant_echeance).toLocaleString()} DA</td>
                                            <td>{parseFloat(plan.montant_restant).toLocaleString()} DA</td>
                                            <td>{plan.etat_paiement}</td>
                                            <td>
                                                {plan.date_paiement
                                                    ? moment(plan.date_paiement).format('DD-MM-YYYY')
                                                    : ''}
                                            </td>
                                            <td>{plan.mode_paiement || ''}</td>
                                            <td style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
                                                <button
                                                    className="btn btn-outline-success action-btn"
                                                    onClick={() => ModifierP(plan.id)}
                                                    title="Modifier"
                                                >
                                                    <img src={edit} alt="Modifier" className="action-icon" />
                                                </button>
                                                <button
                                                    className="btn btn-outline-warning action-btn"
                                                    onClick={() => handleShow(plan.id)}
                                                    title="Archiver"
                                                >
                                                    <img src={archive} alt="Archiver" className="action-icon" />
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="alert alert-info" role="alert">
                        Chargement des informations...
                    </div>
                )}
            </Modal.Body>



            <Modal show={showDeleteModal} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirmer l'archivage</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Êtes-vous sûr de vouloir archiver  ?</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Annuler
                    </Button>
                    <Button
                        variant="danger"
                        onClick={() => {
                            Archiver(ppIdDelete);
                            handleClose();
                        }}
                    >
                        Archiver
                    </Button>
                </Modal.Footer>
            </Modal>
        </Modal>




    );
};

export default PlanningModal;
