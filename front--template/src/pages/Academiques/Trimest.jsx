import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import add from '../../assets/imgs/add.png';
import edit from '../../assets/imgs/edit.png';
import delet from '../../assets/imgs/delete.png';
import semestre from '../../assets/imgs/semester.png';
import './modal.css';

const Trimest = () => {
    const [showModal, setShowModal] = useState(false);
    const [trimests, setTrimests] = useState([]);
    const [filteredTrimests, setFilteredTrimests] = useState([]);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [selectedTrimest, setSelectedTrimest] = useState(null);
    const [titre, setTitre] = useState('');
    const [titre_ar, setTitreAr] = useState('');
    const [datedebut, setDateDebut] = useState('');
    const [datefin, setDateFin] = useState('');
    const [archiver, setArchiver] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const [isLoading, setIsLoading] = useState(true); // Ajoutez cet état

    const token = localStorage.getItem('token');
    const axiosConfig = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };

    const fetchTrimests = async () => {
        setIsLoading(true); // Active le chargement
        try {
            const response = await axios.get('http://localhost:5000/trimest', axiosConfig);
            setTrimests(response.data);
            setFilteredTrimests(response.data);
        } catch (error) {
            console.error('Erreur lors de la récupération des trimestres', error);
        } finally {
            setIsLoading(false); // Désactive le chargement
        }
    };

    useEffect(() => {
        fetchTrimests();
    }, []);

    useEffect(() => {
        const filtered = trimests.filter(trim =>
            (trim.titre && trim.titre.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (trim.titre_ar && trim.titre_ar.toLowerCase().includes(searchTerm.toLowerCase()))
        );
        setFilteredTrimests(filtered);
    }, [searchTerm, trimests]);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredTrimests.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredTrimests.length / itemsPerPage);

    const nextPage = () => currentPage < totalPages && setCurrentPage(currentPage + 1);
    const prevPage = () => currentPage > 1 && setCurrentPage(currentPage - 1);

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

    const handleShowModal = () => setShowModal(true);
    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedTrimest(null);
        setTitre('');
        setTitreAr('');
        setDateDebut('');
        setDateFin('');
        setArchiver(0);
        setError('');
        setSuccess('');
    };

    const formatDateForInput = (date) => {
        if (!date) return ''; // Si la date est undefined ou null, retourne une chaîne vide
        const dateObj = new Date(date); // Convertit en objet Date
        return dateObj.toISOString().split('T')[0]; // Formate en YYYY-MM-DD
    };

    const handleEdit = (trimest) => {
        console.log('Trimestre sélectionné :', trimest); // Ajoutez ce log
        setSelectedTrimest(trimest);
        setTitre(trimest.titre);
        setTitreAr(trimest.titre_ar);
        setDateDebut(formatDateForInput(trimest.datedebut)); // Formate la date de début
        setDateFin(formatDateForInput(trimest.datefin)); // Formate la date de fin
        setArchiver(trimest.archiver);
        handleShowModal();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Vérification des champs obligatoires
        if (!titre || !datedebut || !datefin) {
            setError('Tous les champs sont obligatoires');
            return;
        }
    
        try {
            const token = localStorage.getItem('token');
            if (!token) throw new Error('Aucun token trouvé');
    
            const data = {
                titre,
                titre_ar,
                datedebut,
                datefin,
            };
    
            console.log('Données envoyées au serveur :', data);
    
            let response;
            if (selectedTrimest) {
                // Modification
                response = await axios.put(
                    `http://localhost:5000/trimest/${selectedTrimest.id}`,
                    data,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                setSuccess('Trimestre modifié avec succès!');
            } else {
                // Ajout
                response = await axios.post(
                    'http://localhost:5000/trimest',
                    data,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                setSuccess('Trimestre ajouté avec succès!');
            }
    
            // Mise à jour optimiste des états
            setTrimests(prevTrimests => 
                selectedTrimest 
                    ? prevTrimests.map(t => (t.id === selectedTrimest.id ? response.data : t)) 
                    : [...prevTrimests, response.data]
            );
    
            // Recharger les données après l'opération
            await fetchTrimests();
    
            // Réinitialisation
            setTitre('');
            setTitreAr(''); // Corrected here
            setDateDebut('');
            setDateFin('');
            setError('');
    
            // Fermer le modal
            handleCloseModal();
    
        } catch (error) {
            setError(error.response?.data?.message || "Erreur lors de l'ajout/modification du trimestre");
            console.error("Erreur:", error);
        }
    };

    const handleDelete = async (id) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) throw new Error('Aucun token trouvé');
    
            await axios.delete(`http://localhost:5000/trimest/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
    
            // Mise à jour optimiste
            setTrimests(prevTrimests => prevTrimests.filter(trim => trim.id !== id));
            setSuccess('Trimestre supprimé avec succès!');
    
            // Recharger les données après suppression
            await fetchTrimests();
    
            setTimeout(() => setSuccess(''), 2000);
    
        } catch (error) {
            setError(error.response?.data?.message || "Erreur lors de la suppression du trimestre");
        }
    };

    useEffect(() => {
        const cleanedTrimests = trimests.map(trim => ({
            ...trim,
            titre: trim.titre || '', // Initialise avec une chaîne vide si `titre` est undefined
            titre_ar: trim.titre_ar || '', // Initialise avec une chaîne vide si `titre_ar` est undefined
        }));

        const filtered = cleanedTrimests.filter(trim =>
            trim.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
            trim.titre_ar.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredTrimests(filtered);
    }, [searchTerm, trimests]);
    return (
        <>
            <nav>
                <Link to="/dashboard" className="text-primary">Accueil</Link>
                <span> / </span>
                <span>Gestion des Trimestres</span>
            </nav>
            <div className="card card-primary card-outline">
                <div className="card-header d-flex" style={{ backgroundColor: '#F8F8F8' }}>
                    <img src={semestre} alt="" width="90px" />
                    <p className="card-title mt-5 ml-2 p-2 text-center"
                        style={{ width: '350px', borderRadius: '50px', border: '1px solid rgb(215, 214, 216)' }}>
                        Gestion des Trimestres
                    </p>
                </div>
                <div className="card-body">
                    <div className="d-flex align-items-center gap-3 mb-3">
                        {/* Bouton Ajouter */}
                        <button className="btn btn-app p-1" onClick={handleShowModal}>
                            <img src={add} alt="" width="30px" /><br />
                            Ajouter
                        </button>

                        {/* Champ de recherche avec icône */}
                        <div className="input-group" style={{ maxWidth: '300px' }}>
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Rechercher une section"
                                className="form-control"
                                style={{ borderRadius: '8px', height: '50px', marginLeft: '20px', marginTop: '-10px' }}
                            />
                        </div>
                    </div>

                    <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                        <table className="table table-striped">
                            <thead>
                                <tr>
                                    <th>Nom</th>
                                    <th>Nom (Arabe)</th>
                                    <th>Date Début </th>
                                    <th>Date Fin</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredTrimests.map((trimest, index) => (
                                    <tr key={index}>
                                        <td>{trimest.titre}</td>
                                        <td>{trimest.titre_ar}</td>
                                        <td>{new Date(trimest.datedebut).toLocaleDateString()}</td>
                                        <td>{new Date(trimest.datefin).toLocaleDateString()}</td>
                                        <td>
                                            <button className="btn btn-outline-success" onClick={() => handleEdit(trimest)}>
                                                <img src={edit} alt="modifier" width="22px" title="Modifier" />
                                            </button>
                                            &nbsp;&nbsp;&nbsp;
                                            <button className="btn btn-outline-danger" onClick={() => handleDelete(trimest.id)}>
                                                <img src={delet} alt="supprimer" width="22px" title="Supprimer" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="text-center">
                        <p>Total Trimestres: {filteredTrimests.length}</p>
                        <button onClick={prevPage} className="btn btn-outline-primary">Précédent</button>
                        {paginationButtons}
                        <button onClick={nextPage} className="btn btn-outline-primary">Suivant</button>
                    </div>

                    {/* Modal Bootstrap */}
                    <div className={`modal fade ${showModal ? 'show' : ''}`} style={{ display: showModal ? 'block' : 'none' }} id="modal-trimest" tabIndex="-1" role="dialog" aria-labelledby="modalTrimestLabel" aria-hidden={!showModal}>
                        <div className="modal-dialog modal-custom" role="document">
                            <div className="modal-content modal-custom-content">
                                <div className="modal-header">
                                    <h5 className="modal-title" id="modalTrimestLabel">{selectedTrimest ? "Modifier un Trimestre" : "Ajouter un Trimestre"}</h5>
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
                                                type="text"
                                                className="form-control input"
                                                value={titre}
                                                onChange={(e) => setTitre(e.target.value)}
                                                placeholder="Titre"
                                            />
                                        </div>
                                        <div className="form-group">
                                            <input
                                                type="text"
                                                className="form-control input"
                                                value={titre_ar}
                                                onChange={(e) => setTitreAr(e.target.value)}
                                                placeholder="Titre en arabe"
                                            />
                                        </div>
                                        <div className="form-group">
                                            <input
                                                type="date"
                                                className="form-control input"
                                                value={datedebut}
                                                onChange={(e) => setDateDebut(e.target.value)}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <input
                                                type="date"
                                                className="form-control input"
                                                value={datefin}
                                                onChange={(e) => setDateFin(e.target.value)}
                                            />
                                        </div>
                                        <div className="modal-footer">
                                            <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>Fermer</button>
                                            <button type="submit" className="btn btn-primary">{selectedTrimest ? "Modifier" : "Ajouter"}</button>
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

export default Trimest;