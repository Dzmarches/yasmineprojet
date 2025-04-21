import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import salleIcon from '../../assets/imgs/classe.png';
import addIcon from '../../assets/imgs/add.png';
import editIcon from '../../assets/imgs/edit.png';
import deleteIcon from '../../assets/imgs/archive.png';
import './modal.css';

const Salles = () => {
    const [showModal, setShowModal] = useState(false);
    const [salle, setSalle] = useState('');
    const [sallearab, setSalleArab] = useState('');
    const [capacite, setCapacite] = useState('');
    const [remarque, setRemarque] = useState('');
    const [salles, setSalles] = useState([]);
    const [filteredSalles, setFilteredSalles] = useState([]);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [selectedIds, setSelectedIds] = useState([]);
    const [selectAll, setSelectAll] = useState(false);
    const [selectedSalle, setSelectedSalle] = useState(null);
    const [filter, setFilter] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(15);
    const [ecoleId, setEcoleId] = useState(null);
    const [ecoleeId, setEcoleeId] = useState(null);

    const fetchSalles = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                console.error('Aucun token trouvé. Veuillez vous connecter.');
                return;
            }

            const response = await axios.get('http://localhost:5000/salles', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setSalles(response.data);
            setFilteredSalles(response.data);
        } catch (error) {
            console.error("Erreur lors de la récupération des salles", error);
        }
    };
    useEffect(() => {

        fetchSalles();
    }, []);

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
        setCurrentPage(1); // Reset to first page when filtering
        const filtered = salles.filter(salle =>
            salle.salle.toLowerCase().includes(filter.toLowerCase()) ||
            salle.sallearab.toLowerCase().includes(filter.toLowerCase()) ||
            salle.capacité.toString().includes(filter) ||
            (salle.remarque && salle.remarque.toLowerCase().includes(filter.toLowerCase()))
        );
        setFilteredSalles(filtered);
    }, [filter, salles]);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredSalles.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredSalles.length / itemsPerPage);

    const nextPage = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };

    const prevPage = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

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

    const handleShowModal = () => {
        setShowModal(true);
        setSelectedSalle(null);
        setSalle('');
        setSalleArab('');
        setCapacite('');
        setRemarque('');
        setError('');
        setSuccess('');
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedSalle(null);
        setSalle('');
        setSalleArab('');
        setCapacite('');
        setRemarque('');
        setError('');
        setSuccess('');
    };

    const handleEdit = (salle) => {
        setSelectedSalle(salle);
        setSalle(salle.salle);
        setSalleArab(salle.sallearab);
        setCapacite(salle.capacité);
        setRemarque(salle.remarque || '');
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!salle || !capacite || !ecoleId) {
            setError("Les champs salle, salle en arabe, capacité et ecoleId sont obligatoires");
            return;
        }

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setError('Aucun token trouvé. Veuillez vous connecter.');
                return;
            }

            const data = {
                salle,
                sallearab,
                capacité: capacite,
                remarque: remarque || null,
                ecoleId,
                ecoleeId: ecoleeId === "null" ? null : ecoleeId,
            };

            if (selectedSalle) {
                // Modification
                await axios.put(
                    `http://localhost:5000/salles/${selectedSalle.id}`,
                    data,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                setSuccess("Salle modifiée avec succès!");
            } else {
                // Ajout
                await axios.post(
                    'http://localhost:5000/salles',
                    data,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                setSuccess("Salle ajoutée avec succès!");
            }

            // Recharger les données
            await fetchSalles();

            // Réinitialisation
            setSalle('');
            setSalleArab('');
            setCapacite('');
            setRemarque('');
            setError('');

            // Fermer le modal immédiatement
            handleCloseModal();

        } catch (error) {
            setError(error.response?.data?.message || "Erreur lors de l'opération");
            console.error("Erreur:", error);
        }
    };

    const handleDelete = async (id) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setError('Aucun token trouvé. Veuillez vous connecter.');
                return;
            }

            await axios.delete(`http://localhost:5000/salles/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            // Recharger les données
            await fetchSalles();
            setSuccess('Salle supprimée avec succès!');

            setTimeout(() => setSuccess(''), 2000);

        } catch (error) {
            setError(error.response?.data?.message || "Erreur lors de la suppression");
        }
    };

    const handleSelectAll = () => {
        if (selectAll) {
            setSelectedIds([]);
        } else {
            setSelectedIds(filteredSalles.map(salle => salle.id));
        }
        setSelectAll(!selectAll);
    };

    const handleSelect = (id) => {
        if (selectedIds.includes(id)) {
            setSelectedIds(selectedIds.filter(salleId => salleId !== id));
        } else {
            setSelectedIds([...selectedIds, id]);
        }
    };

    return (
        <>
            <nav>
                <Link to="/dashboard" className="text-primary">Accueil</Link>
                <span> / </span>
                <span>Gestion des Salles</span>
            </nav>
            <div className="card card-primary card-outline">
                <div className="card-header d-flex" style={{ backgroundColor: '#F8F8F8' }}>
                    <img src={salleIcon} alt="" width="90px" />
                    <p className="card-title mt-5 ml-2 p-2 text-center" style={{ width: '350px', borderRadius: '50px', border: '1px solid rgb(215, 214, 216)' }}>
                        Gestion des Salles
                    </p>
                </div>
                <div className="card-body">

                    <div className="d-flex align-items-center gap-3 mb-3">
                        {/* Bouton Ajouter */}
                        <button className="btn btn-app p-1" onClick={handleShowModal}>
                            <img src={addIcon} alt="" width="30px" /><br />
                            Ajouter
                        </button>

                        {/* Champ de recherche */}
                        <div className="input-group" style={{ maxWidth: '300px' }}>
                            <input
                                type="text"
                                value={filter}
                                onChange={(e) => setFilter(e.target.value)}
                                placeholder="Rechercher une salle"
                                className="form-control"
                                style={{ borderRadius: '8px', height: '50px', marginLeft: '20px', marginTop: '-10px' }}
                            />
                        </div>
                    </div>

                    <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                        <table className="table table-striped">
                            <thead>
                                <tr>
                                    <th>
                                        <input
                                            type="checkbox"
                                            onChange={handleSelectAll}
                                            checked={selectAll && filteredSalles.length > 0}
                                        />
                                    </th>
                                    <th>Nom</th>
                                    <th>Nom (Arabe)</th>
                                    <th>Capacité</th>
                                    <th>Remarque</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentItems.map((salle, index) => (
                                    <tr key={index}>
                                        <td>
                                            <input
                                                type="checkbox"
                                                onChange={() => handleSelect(salle.id)}
                                                checked={selectedIds.includes(salle.id)}
                                            />
                                        </td>
                                        <td>{salle.salle}</td>
                                        <td>{salle.sallearab}</td>
                                        <td>{salle.capacité}</td>
                                        <td>{salle.remarque || '-'}</td>
                                        <td>
                                            <button className="btn btn-outline-success" onClick={() => handleEdit(salle)}>
                                                <img src={editIcon} alt="modifier" width="22px" title="Modifier" />
                                            </button>
                                            &nbsp;&nbsp;&nbsp;
                                            <button className="btn btn-outline-danger" onClick={() => handleDelete(salle.id)}>
                                                <img src={deleteIcon} alt="supprimer" width="22px" title="Supprimer" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="text-center">
                        <p>Total Salles: {filteredSalles.length}</p>
                        <div className="text-center">
                            <button
                                onClick={prevPage}
                                disabled={currentPage === 1}
                                className="btn btn-outline-primary"
                            >
                                Précédent
                            </button>

                            {Array.from({ length: totalPages }, (_, i) => (
                                <button
                                    key={i + 1}
                                    onClick={() => setCurrentPage(i + 1)}
                                    className={`btn btn-outline-primary ${currentPage === i + 1 ? 'active' : ''}`}
                                >
                                    {i + 1}
                                </button>
                            ))}

                            <button
                                onClick={nextPage}
                                disabled={currentPage === totalPages}
                                className="btn btn-outline-primary"
                            >
                                Suivant
                            </button>
                        </div>
                    </div>

                    {/* Modal */}
                    <div className={`modal fade ${showModal ? 'show' : ''}`} style={{ display: showModal ? 'block' : 'none' }} id="modal-salle" tabIndex="-1" role="dialog" aria-labelledby="modalSalleLabel" aria-hidden={!showModal}>
                        <div className="modal-dialog modal-custom" role="document">
                            <div className="modal-content modal-custom-content">
                                <div className="modal-header">
                                    <h5 className="modal-title" id="modalSalleLabel">{selectedSalle ? "Modifier une Salle" : "Ajouter une Salle"}</h5>
                                    <button type="button" className="close" onClick={handleCloseModal} aria-label="Close">
                                        <span aria-hidden="true">&times;</span>
                                    </button>
                                </div>
                                <div className="modal-body">
                                    {error && <div className="alert alert-danger">{error}</div>}
                                    {success && <div className="alert alert-success">{success}</div>}
                                    <form onSubmit={handleSubmit}>
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
                                        </div>
                                        <div className="form-group">
                                            <input
                                                type="text"
                                                className="form-control input"
                                                value={salle}
                                                onChange={(e) => setSalle(e.target.value)}
                                                placeholder="Nom de la salle"
                                                required
                                            />
                                        </div>
                                        <div className="form-group">
                                            <input
                                                type="text"
                                                className="form-control input"
                                                value={sallearab}
                                                onChange={(e) => setSalleArab(e.target.value)}
                                                placeholder="Nom en arabe"
                                                required
                                            />
                                        </div>
                                        <div className="form-group">
                                            <input
                                                type="number"
                                                className="form-control input"
                                                value={capacite}
                                                onChange={(e) => setCapacite(e.target.value)}
                                                placeholder="Capacité"
                                                required
                                                min="1"
                                            />
                                        </div>
                                        <div className="form-group">
                                            <input
                                                type="text"
                                                className="form-control input"
                                                value={remarque}
                                                onChange={(e) => setRemarque(e.target.value)}
                                                placeholder="Remarque (optionnel)"
                                            />
                                        </div>
                                        <div className="modal-footer">
                                            <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>Fermer</button>
                                            <button type="submit" className="btn btn-primary">{selectedSalle ? "Modifier" : "Ajouter"}</button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </>
    );
};

export default Salles;