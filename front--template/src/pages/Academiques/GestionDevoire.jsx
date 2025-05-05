import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Button, Modal, Form, Alert, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const GestionDevoire = () => {
    const [trimests, setTrimests] = useState([]);
    const [annees, setAnnees] = useState([]);
    const [selectedAnnee, setSelectedAnnee] = useState(null);
    const [selectedTrimestre, setSelectedTrimestre] = useState(null);
    const [filteredAnnees, setFilteredAnnees] = useState([]);
    const [selectedAnneeScolaire, setSelectedAnneeScolaire] = useState([]);
    const [niveaux, setNiveaux] = useState([]);
    const [sections, setSections] = useState([]);
    const [selectedNiveau, setSelectedNiveau] = useState(null);
    const [selectedSection, setSelectedSection] = useState(null);
    const [loading, setLoading] = useState(true);
    const [matieres, setMatieres] = useState([]);
    const [selectedMatiere, setSelectedMatiere] = useState(null);
    const [eleves, setEleves] = useState([]);
    const [notes, setNotes] = useState({});
    const [loadingEleves, setLoadingEleves] = useState(false);
    const [loadingStatus, setLoadingStatus] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [devoirs, setDevoirs] = useState([]);
    const [travauxRendus, setTravauxRendus] = useState([]);
    const [newDevoir, setNewDevoir] = useState({
        titre: '',
        description: '',
        dateLimite: '',
        fichier: null
    });

    const enseignantId = localStorage.getItem('userId');
    const ecoleId = localStorage.getItem('ecoleId');
    const ecoleeId = localStorage.getItem('ecoleeId');

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
        const fetchAnnees = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await axios.get(
                    `http://localhost:5000/anneescolaire`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                setAnnees(response.data);
                setFilteredAnnees(response.data);
            } catch (error) {
                console.error('Error fetching annees scolaires', error);
            }
        };
        fetchAnnees();
    }, []);
    const fetchTrimests = async () => {

        try {
            const token = localStorage.getItem("token");
            const response = await axios.get(
                'http://localhost:5000/trimest',
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setTrimests(response.data);
            setFilteredTrimests(response.data);
        } catch (error) {
            //console.error('Erreur lors de la récupération des trimestres', error);
        } finally {
            //setIsLoading(false); // Désactive le chargement
        }
    };

    useEffect(() => {
        fetchTrimests();
    }, []);

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
        const fetchDevoirs = async () => {
            if (selectedSection && selectedAnneeScolaire && selectedTrimestre) {
                try {
                    const token = localStorage.getItem("token");
                    const response = await axios.get(
                        `http://localhost:5000/devoir/section/${selectedSection}`,
                        { headers: { Authorization: `Bearer ${token}` } }
                    );
                    setDevoirs(response.data);
                } catch (error) {
                    console.error("Erreur lors du chargement des devoirs:", error);
                }
            }
        };

        fetchDevoirs();
    }, [selectedSection, selectedAnneeScolaire, selectedTrimestre]);

    const handleFileChange = (e) => {
        setNewDevoir({
            ...newDevoir,
            fichier: e.target.files[0]
        });
    };

    const handleSubmitDevoir = async (e) => {
        e.preventDefault();
        if (!selectedMatiere) {
            alert("Veuillez sélectionner une matière");
            return;
        }

        try {
            const token = localStorage.getItem("token");
            const formData = new FormData();
            formData.append('titre', newDevoir.titre);
            formData.append('description', newDevoir.description);
            formData.append('dateLimite', newDevoir.dateLimite);
            formData.append('fichier', newDevoir.fichier);
            formData.append('enseignantId', enseignantId);
            formData.append('matiereId', selectedMatiere);
            formData.append('niveauId', selectedNiveau);
            formData.append('sectionId', selectedSection);
            formData.append('anneeScolaireId', selectedAnneeScolaire);
            formData.append('trimestreId', selectedTrimestre);

            const response = await axios.post(
                'http://localhost:5000/devoir',
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );

            setDevoirs([...devoirs, response.data]);
            setShowModal(false);
            setNewDevoir({
                titre: '',
                description: '',
                dateLimite: '',
                fichier: null
            });
        } catch (error) {
            console.error("Erreur lors de la création du devoir:", error);
        }
    };
    const downloadFile = async (filename) => {
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

    const fetchTravauxRendus = async () => {
        if (selectedSection && selectedAnneeScolaire && selectedTrimestre && devoirs.length > 0) {
            try {
                const token = localStorage.getItem("token");
                const response = await axios.get(
                    `http://localhost:5000/devoir/section/${selectedSection}/travaux`, 
                    { 
                        headers: { Authorization: `Bearer ${token}` },
                        params: {
                            annescolaireId: selectedAnneeScolaire,  // Make sure this matches the backend parameter name
                            trimestId: selectedTrimestre           // And this one too
                        }
                    }
                );
                
                setTravauxRendus(response.data);
            } catch (error) {
                console.error("Error fetching travaux rendus:", error);
            }
        }
    };
    useEffect(() => {
        fetchTravauxRendus();
    }, [devoirs, selectedSection, selectedAnneeScolaire, selectedTrimestre]);

    // Modifier la fonction de téléchargement
    const downloadTravail = async (filename) => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get(
                `http://localhost:5000/devoir/travaux/download/${filename}`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                    responseType: 'blob'
                }
            );

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

    return (
        <div className="container-fluid py-3">
            <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                    <li className="breadcrumb-item"><Link to="/dashboard">Dashboard</Link></li>
                    <li className="breadcrumb-item active">Gestion des Devoirs</li>
                </ol>
            </nav>

            <div className="card shadow">
                <div className="card-header bg-primary text-white">
                    <div className="d-flex justify-content-between align-items-center">
                        <h3 className="card-title mb-0">Gestion des Devoirs</h3>
                        {selectedSection && (
                            <Button variant="light" onClick={() => setShowModal(true)}>
                                <i className="fas fa-plus"></i> Ajouter un devoir
                            </Button>
                        )}
                    </div>
                </div>

                <div className="card-body">
                    {/* Sélection du niveau */}
                    <div className="mb-4">
                        <h4 className="mb-3 text-primary">🎯 Sélectionnez :</h4>
                        <div className="d-flex flex-wrap align-items-center">
                            {/* Année scolaire */}
                            <div className="form-group ml-0" style={{ minWidth: '150px' }}>
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

                            {/* Trimestre */}
                            <div className="form-group ml-2" style={{ minWidth: '150px' }}>
                                <select
                                    className="form-control input"
                                    style={{ height: '40px' }}
                                    value={selectedTrimestre || ''}
                                    onChange={(e) => setSelectedTrimestre(e.target.value)}
                                >
                                    <option value="">Trimestre</option>
                                    {Array.isArray(trimests) && trimests.map((trimestre) => (
                                        <option key={trimestre.id} value={trimestre.id}>
                                            {trimestre.titre}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-group ml-2" style={{ minWidth: '150px' }}>
                                <select
                                    className="form-control input"
                                    style={{ height: '40px' }}
                                    value={selectedNiveau || ''}
                                    onChange={(e) => setSelectedNiveau(parseInt(e.target.value) || '')}
                                >
                                    <option value="">Niveau</option>
                                    {niveaux.map((niveau) => (
                                        <option key={niveau.id} value={niveau.id}>
                                            {niveau.nomniveau}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            {/* Sélection de la section */}
                            {selectedNiveau && sections.length > 0 && (
                                <div className="form-group ml-2" style={{ minWidth: '150px' }}>
                                    <select
                                        className="form-control input"
                                        style={{ height: '40px' }}
                                        value={selectedSection || ''}
                                        onChange={(e) => setSelectedSection(e.target.value)}
                                    >
                                        <option value="">Section</option>
                                        {sections.map((section) => (
                                            <option key={section.id} value={section.id}>
                                                {section.classe} {section.classearab && `(${section.classearab})`}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            )}
                            {matieres.length > 0 && (
                                <div className="form-group ml-2" style={{ minWidth: '150px' }}>
                                    <select
                                        className="form-control input"
                                        style={{ height: '40px' }}
                                        value={selectedMatiere || ''}
                                        onChange={(e) => setSelectedMatiere(e.target.value)}
                                    >
                                        <option value="">Matière</option>
                                        {matieres.map((matiere) => (
                                            <option key={matiere.id} value={matiere.id}>
                                                {matiere.nom}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Liste des devoirs */}
                    {devoirs.length > 0 && (
                        <div className="mt-4">
                            <h4>Devoirs assignés</h4>
                            <div className="table-responsive">
                                <Table striped bordered hover>
                                    <thead>
                                        <tr>
                                            <th>Matière</th>
                                            <th>Titre</th>
                                            <th>Description</th>
                                            <th>Date limite</th>
                                            <th>Fichier</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {devoirs.map((devoir) => (
                                            <tr key={devoir.id}>
                                                <td>{devoir.Matiere?.nom}</td>
                                                <td>{devoir.titre}</td>
                                                <td>{devoir.description}</td>
                                                <td>{new Date(devoir.dateLimite).toLocaleDateString()}</td>
                                                <td>
                                                    <Button
                                                        variant="primary"
                                                        size="sm"
                                                        onClick={() => downloadFile(devoir.fichier)}
                                                    >
                                                        <i className="fas fa-download me-1"></i> Télécharger
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            </div>
                        </div>
                    )}

                    {/* Liste des élèves et travaux rendus */}
                    {selectedSection && devoirs.length > 0 && (
                        <div className="mt-4">
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <h4>Travaux rendus par les élèves</h4>
                            </div>
                            <div className="table-responsive">
                                <Table bordered hover>
                                    <thead>
                                        <tr>
                                            <th>Élève</th>
                                            {devoirs.map(devoir => (
                                                <th key={devoir.id}>
                                                    {devoir.Matiere?.nom} - {devoir.titre}
                                                    <small className="d-block text-muted">
                                                        {new Date(devoir.dateLimite).toLocaleDateString()}
                                                    </small>
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {eleves.length > 0 ? (
                                            eleves.map((eleve) => (
                                                <tr key={eleve.id}>
                                                    <td>
                                                        {eleve.User?.prenom} {eleve.User?.nom}
                                                        <small className="d-block text-muted">
                                                            {eleve.numidentnational}
                                                        </small>
                                                    </td>
                                                    {devoirs.map(devoir => (
                                                        <td key={`${eleve.id}-${devoir.id}`}>
                                                            {travauxRendus.some(t =>
                                                                t.eleveId === eleve.id && t.devoirId === devoir.id
                                                            ) ? (
                                                                <Button
                                                                    variant="success"
                                                                    size="sm"
                                                                    onClick={() => {
                                                                        const travail = travauxRendus.find(t =>
                                                                            t.eleveId === eleve.id && t.devoirId === devoir.id
                                                                        );
                                                                        downloadTravail(travail.fichier);
                                                                    }}
                                                                >
                                                                    <i className="fas fa-download me-1"></i> Télécharger
                                                                </Button>
                                                            ) : (
                                                                <span className="text-muted">Non rendu</span>
                                                            )}
                                                        </td>
                                                    ))}
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan={devoirs.length + 1} className="text-center">
                                                    Aucun élève trouvé dans cette section
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </Table>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Modal pour ajouter un devoir */}
            <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Ajouter un nouveau devoir</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmitDevoir}>
                        <Form.Group className="mb-3">
                            <Form.Label>Titre du devoir</Form.Label>
                            <Form.Control
                                type="text"
                                value={newDevoir.titre}
                                onChange={(e) => setNewDevoir({ ...newDevoir, titre: e.target.value })}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Description</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                value={newDevoir.description}
                                onChange={(e) => setNewDevoir({ ...newDevoir, description: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Date limite</Form.Label>
                            <Form.Control
                                type="date"
                                value={newDevoir.dateLimite}
                                onChange={(e) => setNewDevoir({ ...newDevoir, dateLimite: e.target.value })}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Fichier PDF</Form.Label>
                            <Form.Control
                                type="file"
                                accept=".pdf"
                                onChange={handleFileChange}
                                required
                            />
                        </Form.Group>
                        <div className="d-flex justify-content-end">
                            <Button variant="secondary" onClick={() => setShowModal(false)} className="me-2">
                                Annuler
                            </Button>
                            <Button variant="primary" type="submit">
                                Enregistrer
                            </Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default GestionDevoire;