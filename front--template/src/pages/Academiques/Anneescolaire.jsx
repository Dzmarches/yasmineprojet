import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import add from '../../assets/imgs/add.png';
import edit from '../../assets/imgs/edit.png';
import delet from '../../assets/imgs/archive.png'; // Assurez-vous que l'icône est correcte
import annee from '../../assets/imgs/annee.png';
import './modal.css';

const Anneescolaire = () => {
    const [showModal, setShowModal] = useState(false);
    const [annees, setAnnees] = useState([]);
    const [filteredAnnees, setFilteredAnnees] = useState([]);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [selectedAnnees, setSelectedAnnees] = useState(null);
    const [titre, setTitre] = useState('');
    const [titre_ar, setTitreAr] = useState('');
    const [datedebut, setDateDebut] = useState('');
    const [datefin, setDateFin] = useState('');
    const [archiver, setArchiver] = useState(0); // Valeur par défaut pour archiver
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(5);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredAnnees.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredAnnees.length / itemsPerPage);

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
    useEffect(() => {
    
        fetchAnnees();
    }, []);

    useEffect(() => {
        const filtered = annees.filter(annee =>
            annee.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
            annee.titre_ar.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredAnnees(filtered);
    }, [searchTerm, annees]);

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
        setSelectedAnnees(null);
        setTitre('');
        setTitreAr('');
        setDateDebut('');
        setDateFin('');
        setArchiver(0);
        setError('');
        setSuccess('');
    };

    const handleEdit = (annee) => {
        setSelectedAnnees(annee);
        setTitre(annee.titre);
        setTitreAr(annee.titre_ar);
        setDateDebut(annee.datedebut);
        setDateFin(annee.datefin);
        setArchiver(annee.archiver);
        handleShowModal();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!titre || !titre_ar || !datedebut || !datefin) {
            setError('Tous les champs sont obligatoires');
            return;
        }
    
        const token = localStorage.getItem("token");
    
        try {
            const config = {
                headers: { Authorization: `Bearer ${token}` }
            };
    
            const response = selectedAnnees
                ? await axios.put(`http://localhost:5000/anneescolaire/${selectedAnnees.id}`, {
                    titre,
                    titre_ar,
                    datedebut,
                    datefin,
                    archiver,
                }, config)
                : await axios.post('http://localhost:5000/anneescolaire', {
                    titre,
                    titre_ar,
                    datedebut,
                    datefin,
                    archiver,
                }, config);
    
            setSuccess(selectedAnnees ? 'Année scolaire modifiée avec succès!' : 'Année scolaire ajoutée avec succès!');
            setAnnees(selectedAnnees ? annees.map(a => (a.id === selectedAnnees.id ? response.data : a)) : [...annees, response.data]);
            handleCloseModal();
        } catch (error) {
            setError("Erreur lors de l'ajout/modification de l'année scolaire");
        }
    };
    const handleDelete = async (id) => {
        const token = localStorage.getItem("token");
    
        try {
            await axios.delete(`http://localhost:5000/anneescolaire/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setAnnees(annees.filter((annee) => annee.id !== id));
            setSuccess('Année scolaire supprimée avec succès!');
        } catch (error) {
            setError("Erreur lors de la suppression de l'année scolaire");
        }
    };
        

    return (
        <>
            <nav>
                <Link to="/home" className="text-primary">Accueil</Link>
                <span> / </span>
                <span>Gestion des Années Scolaires</span>
            </nav>
            <div className="card card-primary card-outline">
                <div className="card-header d-flex" style={{ backgroundColor: '#F8F8F8' }}>
                    <img src={annee} alt="" width="90px" />
                    <p className="card-title mt-5 ml-2 p-2 text-center"
                        style={{ width: '350px', borderRadius: '50px', border: '1px solid rgb(215, 214, 216)' }}>
                        Gestion des Années Scolaires
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
                                    <th>Date Début</th>
                                    <th>Date Fin</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredAnnees.map((annee, index) => (
                                    <tr key={index}>
                                        <td>{annee.titre}</td>
                                        <td>{annee.titre_ar}</td>
                                        <td>{new Date(annee.datedebut).toLocaleDateString()}</td>
                                        <td>{new Date(annee.datefin).toLocaleDateString()}</td>
                                        <td>
                                            <button className="btn btn-outline-success" onClick={() => handleEdit(annee)}>
                                                <img src={edit} alt="modifier" width="22px" title="Modifier" />
                                            </button>
                                            &nbsp;&nbsp;&nbsp;
                                            <button className="btn btn-outline-danger" onClick={() => handleDelete(annee.id)}>
                                                <img src={delet} alt="supprimer" width="22px" title="Supprimer" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="text-center">
                        <p>Total Années Scolaires: {filteredAnnees.length}</p>
                        <button onClick={prevPage} className="btn btn-outline-primary">Précédent</button>
                        {paginationButtons}
                        <button onClick={nextPage} className="btn btn-outline-primary">Suivant</button>
                    </div>

                    {/* Modal Bootstrap */}
                    <div className={`modal fade ${showModal ? 'show' : ''}`} style={{ display: showModal ? 'block' : 'none' }} id="modal-anneescolaire" tabIndex="-1" role="dialog" aria-labelledby="modalAnneescolaireLabel" aria-hidden={!showModal}>
                        <div className="modal-dialog modal-custom" role="document">
                            <div className="modal-content modal-custom-content">
                                <div className="modal-header">
                                    <h5 className="modal-title" id="modalAnneescolaireLabel">{selectedAnnees ? "Modifier une Année Scolaire" : "Ajouter une Année Scolaire"}</h5>
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
                                            <button type="submit" className="btn btn-primary">{selectedAnnees ? "Modifier" : "Ajouter"}</button>
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

export default Anneescolaire;