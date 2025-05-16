import React, { useState } from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import moment from 'moment';
import archive from '../../../assets/imgs/delete.png';
import edit from '../../../assets/imgs/edit.png';
import print from '../../../assets/imgs/printer.png';
import axios from 'axios';

const PlanningModal = ({ show, handleCloseP, planning, FindContrat}) => {

    const [isEditMode, setIsEditMode] = useState(false);
    const [editPlan, setEditPlan] = useState(null);
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
    const handleClose = () => {
        setShowDeleteModal(false);
        setCanEdit(false);
    };
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
            // Trouver le contrat associé au planning archivé
            const archivedPlan = planning.find(plan => plan.id === id);
            if (archivedPlan && archivedPlan.ContratId) {
                await FindContrat(archivedPlan.ContratId);
            }

        } catch (error) {
            console.log("Erreur", error);
        }
    };

    const handleListeDE = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                alert("Vous devez être connecté");
                return;
            }
            const response = await axios.get('http://localhost:5000/attestation/liste',
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );
            const filteredDocs = response.data.filter((doc) => doc.module === "eleve" && doc.code === "RPE");
            const options = filteredDocs.map((doc) => ({
                value: doc.id,
                label: doc.nom,
                modele: doc.modeleTexte
            }));
            return options
        } catch (error) {
            console.log("Erreur lors de la récupération des attestations", error);
        }
    };
    //imprimer recu paiment:
    const printrecu = async (id) => {
        const selectedPlan = planning.find(plan => plan.id === id);
        console.log('selectedPlan', selectedPlan);
        const reponse = await handleListeDE();
        const modeleText = reponse[0].modele;

        const contrat = selectedPlan.Contrat;
        const eleve = contrat?.Eleve;
        const user = eleve?.User;
        const ecolePrincipal = user?.EcolePrincipal;

        let nomR = "", prenomR = "", emailR = "", telR = "", adresseR = "";
        const pere = eleve?.Parents?.find(p => p.typerole === "Père");
        const mere = eleve?.Parents?.find(p => p.typerole === "Mère");
        const tuteur = eleve?.Parents?.find(p => p.typerole === "Tuteur");

        let responsable = null;
        if (tuteur) {
            responsable = tuteur;
        } else if (pere && mere) {
            responsable = pere;
        } else if (pere) {
            responsable = pere;
        } else if (mere) {
            responsable = mere;
        }
        if (responsable?.User) {
            nomR = responsable.User.nom || "";
            prenomR = responsable.User.prenom || "";
            emailR = responsable.User.email || "";
            telR = responsable.User.telephone || "";
            adresseR = responsable.User.adresse || "";
        }

        if (!selectedPlan || !modeleText) {
            alert('plannig ou model du contrat non défini')
            return;
        }
        const modeleTextupdate = modeleText
            .replace(/\[nomecolePE\]/g, ecolePrincipal?.nomecole || "")
            .replace(/\[logoecoleP\]/g,
                `<img src="http://localhost:5000${ecolePrincipal?.logo}" alt="Logo de l'école" style="max-width: 70px; max-height: 70px;">`
            )
            .replace(/\[adressePE\]/g, ecolePrincipal?.adresse || "")
            .replace(/\[nomE\]/g, user?.nom || "")
            .replace(/\[nomAbE\]/g, user?.nom_ar || "")
            .replace(/\[prenomE\]/g, user?.prenom || "")
            .replace(/\[prenomAbE\]/g, user?.prenom_ar || "")
            .replace(/\[LieunaisE\]/g, user?.lieuxnaiss || "")
            .replace(/\[LieunaisAbE\]/g, user?.adresse || "")
            .replace(/\[AdresseE\]/g, user?.prenom_ar || "")
            .replace(/\[AdresseAbE\]/g, user?.adresse_ar || "")
            .replace(/\[datenaissE\]/g, user?.datenaiss ? moment(user.datenaiss).format("DD/MM/YYYY") : "")
            .replace(/\[numInscription\]/g, eleve?.numinscription || "")
            .replace(/\[FraisInsc\]/g, eleve?.fraixinscription || "")
            .replace(/\[NV\]/g, `${eleve?.Niveaux?.nomniveau} ${eleve?.Niveaux?.cycle} ` || "")
            //responsable
            .replace(/\[nomP\]/g, nomR || "")
            .replace(/\[prenomP\]/g, prenomR || "")
            .replace(/\[EmailP\]/g, emailR || "")
            .replace(/\[TelP\]/g, telR || "")
            .replace(/\[AdresseP\]/g, adresseR || "")
            .replace(/\[dateToday\]/g, moment().format("DD/MM/YYYY"))
            //contrat
            .replace(/\[AS\]/g, `${moment(contrat.Anneescolaire?.datedebut).format("YYYY")}/${moment(contrat.Anneescolaire?.datefin).format("YYYY")}` || "")
            .replace(/\[codeC\]/g, contrat?.code || "")
            .replace(/\[ddP\]/g, `${moment(contrat.date_debut_paiement).format("DD-MM-YYYY")}` || "")
            .replace(/\[dfP\]/g, `${moment(contrat.date_sortie).format("DD-MM-YYYY")}` || "")
            .replace(/\[dcC\]/g, `${moment(contrat.date_creation).format("DD-MM-YYYY")}` || "")

            .replace(/\[totalC\]/g, selectedPlan.montant_echeance || "")
            .replace(/\[TypeP\]/g, contrat?.typePaiment || "")
            .replace(/\[ModeP\]/g, selectedPlan?.mode_paiement || "")
            .replace(/\[detail\]/g,
                ` Frais de scolarité pour l'échéance :<br><br>
                &nbsp;&nbsp; 
                <small>
                Code :${selectedPlan?.codePP}<br>
                 &nbsp;&nbsp; Date : ${selectedPlan?.date_echeance ? moment(selectedPlan?.date_echeance).format('DD/MM/YYYY') : ''}
                </small>` || ""
            )
        //plannig
        const iframe = document.createElement('iframe');
        iframe.style.display = 'none';
        document.body.appendChild(iframe);
        const iframeDocument = iframe.contentWindow.document;
        iframeDocument.open();
        // @page{ margin: 0;}
        iframeDocument.write(`
                <html>
                  <head>
                    <title>${user?.nom}.${user?.prenom}</title>
                    <style>
                      @media print {
                        body { margin: 0 !important ; padding: 40px !important ; }
                        table {
                          border-collapse: collapse;
                          width: 100%;
                        }
                        table, th, td {
                          border: 1px solid #EBEBEB;
                        }
                      }
                    </style>
                  </head>
                  <body>
                  <body>
                    <div class="containerEditor">
                      <div class="ql-editor">
                        ${modeleTextupdate}
                      </div>
                    </div>
                  </body>
                </html>
              `);
        iframeDocument.close();
        const originalTitle = document.title;
        document.title = `${user?.nom}.${user?.prenom}`;
        setTimeout(() => {
            iframe.contentWindow.focus();
            iframe.contentWindow.print();
            document.title = originalTitle;
            document.body.removeChild(iframe);
        }, 1000);
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
                                    const now = moment().startOf('day'); 
                                    const due = moment(plan.date_echeance).startOf('day'); 
                                    const daysDiff = due.diff(now, 'days');
                                    let rowClass = '';
                                    if (plan.etat_paiement === 'payé') {
                                        rowClass = 'row-paid';
                                    } else if (daysDiff < -7) {
                                        rowClass = 'row-overdue';
                                    } else if (daysDiff < 0) {
                                        rowClass = 'row-orange';
                                    } else if (daysDiff <= 7) {
                                        rowClass = 'row-soon';
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
                                                    className="btn btn-outline-danger action-btn"
                                                    onClick={() => handleShow(plan.id)}
                                                    title="Supprimer"
                                                >
                                                    <img src={archive} alt="Supprimer" className="action-icon" />
                                                </button>
                                                {plan.etat_paiement === 'payé' &&
                                                    (
                                                        <button
                                                            className="btn btn-outline-info action-btn"
                                                            onClick={() => printrecu(plan.id)}
                                                            title="Imprimer"
                                                        >
                                                            <img src={print} alt="Imprimer" className="action-icon" />
                                                        </button>
                                                    )}

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
                    <Modal.Title>Confirmer la suppression</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Êtes-vous sûr de vouloir supprimer  ?</p>
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
                        Supprimer
                    </Button>
                </Modal.Footer>
            </Modal>
        </Modal>




    );
};

export default PlanningModal;
