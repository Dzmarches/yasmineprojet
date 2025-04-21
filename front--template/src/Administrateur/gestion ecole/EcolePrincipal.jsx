import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate, useLocation } from 'react-router-dom'; // Importer useNavigate
import scool from '../../assets/imgs/school.png';
import add from '../../assets/imgs/add.png';
import edite from '../../assets/imgs/edit.png';
import delet from '../../assets/imgs/delete.png';

const Ecole = () => {
    const navigate = useNavigate(); // Utiliser useNavigate pour obtenir la fonction navigate
    const [showModal, setShowModal] = useState(false);
    const [ecoles, setEcoles] = useState([]);
    const [filteredEcoles, setFilteredEcoles] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(5);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedEcole, setSelectedEcole] = useState(null);
    const location = useLocation(); // Récupère l'état envoyé par navigate()

    // Récupérer les écoles depuis la base de données
    useEffect(() => {
        const fetchEcoles = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    console.error('Aucun token trouvé. Veuillez vous connecter.');
                    return;
                }

                const response = await axios.get('http://localhost:5000/ecole', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                // Vérifier que les données contiennent bien les champs nécessaires
                const ecolesWithDefaults = response.data.map(ecole => ({
                    ...ecole,
                    nomecole: ecole.nomecole || '', // Valeur par défaut si undefined
                    nom_arecole: ecole.nom_arecole || '', // Valeur par défaut si undefined
                }));

                setEcoles(ecolesWithDefaults);
                setFilteredEcoles(ecolesWithDefaults);
            } catch (error) {
                console.error('Erreur lors de la récupération des écoles', error);
            }
        };
        fetchEcoles();
    }, []);

    // Filtrer les écoles en fonction du terme de recherche
    useEffect(() => {
        const filtered = ecoles.filter(ecole => {
            const nomecole = ecole.nomecole || ''; // Valeur par défaut si undefined
            const nom_arecole = ecole.nom_arecole || ''; // Valeur par défaut si undefined

            return (
                nomecole.toLowerCase().includes(searchTerm.toLowerCase()) ||
                nom_arecole.toLowerCase().includes(searchTerm.toLowerCase())
            );
        });

        setFilteredEcoles(filtered);
        setCurrentPage(1); // Réinitialiser la pagination après une recherche
    }, [searchTerm, ecoles]);

    // Pagination
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredEcoles.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredEcoles.length / itemsPerPage);

    const nextPage = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };

    const prevPage = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    const handleEdit = async (id) => {
        const token = localStorage.getItem('token');
        if (!token) {
            console.error('Aucun token trouvé. Veuillez vous connecter.');
            return;
        }
    
        try {
            // Récupérer l'école
            const ecoleResponse = await axios.get(`http://localhost:5000/ecole/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const ecole = ecoleResponse.data;
            
            // Rediriger vers le formulaire de modification avec les données de l'école et de l'utilisateur
            navigate('/ecole/modifier', { state: { ecole } });
        } catch (error) {
            console.error('Erreur lors de la récupération de l\'école ou de l\'utilisateur:', error);
        }
    };

    // Supprimer une école
    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/ecole/${id}`);
            setEcoles(ecoles.filter(ecole => ecole.id !== id));
        } catch (error) {
            console.error('Erreur lors de la suppression de l\'école', error);
        }
    };

    // Fermer la modale
    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedEcole(null);
    };

    // Générer les boutons de pagination
    const paginationButtons = [];
    for (let i = 1; i <= totalPages; i++) {
        paginationButtons.push(
            <button
                key={i}
                onClick={() => setCurrentPage(i)}
                className={`btn btn-outline-primary ${i === currentPage ? 'active' : ''}`}
            >
                {i}
            </button>
        );
    }

    return (
        <>
            <nav>
                <Link to="/home" className="text-primary">Accueil</Link>
                <span> / </span>
                <span>Gestion des Écoles</span>
            </nav>
            <div className="card card-primary card-outline">
                <div className="card-header d-flex" style={{ backgroundColor: '#F8F8F8' }}>
                    <img src={scool} alt="" width="90px" />
                    <p className="card-title mt-5 ml-2 p-2 text-center"
                        style={{ width: '350px', borderRadius: '50px', border: '1px solid rgb(215, 214, 216)' }}>
                        Gestion des Écoles
                    </p>
                </div>
                <div className="card-body">
                    <div className="d-flex align-items-center gap-3 mb-3">
                        <Link className="btn btn-app p-1" to="/ecole/ajoutecole">
                            <img src={add} alt="" width="30px" /><br />
                            Ajouter
                        </Link>
                        <div className="input-group" style={{ maxWidth: '300px' }}>
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Rechercher une école"
                                className="form-control"
                                style={{ borderRadius: '8px', height: '50px', marginLeft: '20px', marginTop: '-10px' }}
                            />
                        </div>
                    </div>

                    <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                        <table className="table table-striped">
                            <thead>
                                <tr>
                                    <th>Nom (Français/Arabe)</th>
                                    <th>Téléphone/Email</th>
                                    <th>Adresse</th>
                                    <th>Logo</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentItems.map((ecole, index) => (
                                    <tr key={index}>
                                        {/* Nom (Français/Arabe) */}
                                        <td>
                                            <strong>{ecole.nomecole || 'Non renseigné'}</strong><br />
                                            <span style={{ color: '#666' }}>{ecole.nom_arecole || 'Non renseigné'}</span>
                                        </td>

                                        {/* Téléphone/Email */}
                                        <td>
                                            <strong>Téléphone:</strong> {ecole.telephoneecole || 'Non renseigné'}<br />
                                            <strong>Email:</strong> {ecole.emailecole || 'Non renseigné'}
                                        </td>

                                        {/* Adresse avec lien vers les coordonnées */}
                                        <td>
                                            {ecole.adresse ? (
                                                <a
                                                    href={`https://www.google.com/maps?q=${ecole.maps}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    style={{ color: '#007bff', textDecoration: 'none' }}
                                                >
                                                    {ecole.adresse}
                                                </a>
                                            ) : (
                                                'Non renseigné'
                                            )}
                                        </td>

                                        {/* Logo de l'école */}
                                        <td>
                                            {ecole.logo ? (
                                                <img
                                                    src={`http://localhost:5000${ecole.logo}`}
                                                    alt="Logo de l'école"
                                                    style={{ width: '50px', height: '50px', borderRadius: '50%' }}
                                                />
                                            ) : (
                                                'Aucun logo'
                                            )}
                                        </td>

                                        {/* Actions */}
                                        <td>
                                            <button className="btn btn-outline-success" onClick={() => handleEdit(ecole.id)}>
                                                <img src={edite} alt="modifier" width="22px" title="Modifier" />
                                            </button>
                                            &nbsp; &nbsp; &nbsp;
                                            <button
                                                className="btn btn-outline-danger"
                                                onClick={() => handleDelete(ecole.id)}
                                            >
                                                <img src={delet} alt="supprimer" width="22px" title="Supprimer" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="text-center">
                        <p><strong>Total d'écoles : </strong>{filteredEcoles.length}</p>
                    </div>

                    <div className="text-center">
                        <button onClick={prevPage} className="btn btn-outline-primary">Précédent</button>
                        {paginationButtons}
                        <button onClick={nextPage} className="btn btn-outline-primary">Suivant</button>
                    </div>

                    {showModal && (
                        <div className="modal fade show" style={{ display: 'block' }} id="modal-ecole" tabIndex="-1" role="dialog" aria-labelledby="modalEcoleLabel" aria-hidden={!showModal}>
                            <div className="modal-dialog" role="document">
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <h5 className="modal-title" id="modalEcoleLabel">{selectedEcole ? 'Modifier une École' : 'Ajouter une École'}</h5>
                                        <button type="button" className="close" onClick={handleCloseModal} aria-label="Close">
                                            <span aria-hidden="true">&times;</span>
                                        </button>
                                    </div>
                                    <div className="modal-body">
                                        <EcoleForm
                                            onClose={handleCloseModal}
                                            onSubmit={() => {
                                                setEcoles([...ecoles]); // Mettre à jour la liste des écoles
                                                setFilteredEcoles([...filteredEcoles]);
                                            }}
                                            selectedEcole={selectedEcole}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default Ecole;