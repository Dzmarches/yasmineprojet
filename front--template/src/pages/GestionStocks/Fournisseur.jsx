import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import fournisseurIcon from '../../assets/imgs/supplier.png';
import add from '../../assets/imgs/add.png';
import edite from '../../assets/imgs/edit.png';
import delet from '../../assets/imgs/archive.png';
import '../Academiques/modal.css';

const GestionFournisseur = () => {
    const [fournisseurs, setFournisseurs] = useState([]);
    const [values, setValues] = useState({
        nom: '',
        contact: '',
        email: '',
        adresse: '',
        telephone: ''
    });
    const [isEdit, setIsEdit] = useState(false);
    const [selectedId, setSelectedId] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(15);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        fetchFournisseurs();
    }, []);

    const fetchFournisseurs = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                console.error('Aucun token trouvé. Veuillez vous connecter.');
                return;
            }
            const res = await axios.get('http://localhost:5000/fournisseur', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setFournisseurs(res.data);
        } catch (err) {
            console.error("❌ Erreur de chargement des fournisseurs", err);
            setFournisseurs([]);
        }
    };

    const filteredFournisseurs = fournisseurs.filter(f =>
        f.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (f.contact && f.contact.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (f.email && f.email.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredFournisseurs.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredFournisseurs.length / itemsPerPage);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm]);

    const handleShowModal = () => {
        setShowModal(true);
        setValues({
            nom: '',
            contact: '',
            email: '',
            adresse: '',
            telephone: ''
        });
        setIsEdit(false);
    };

    const handleEdit = (fournisseur) => {
        setValues({
            nom: fournisseur.nom,
            contact: fournisseur.contact,
            email: fournisseur.email,
            adresse: fournisseur.adresse,
            telephone: fournisseur.telephone
        });
        setSelectedId(fournisseur.id);
        setShowModal(true);
        setIsEdit(true);
    };

    const handleDelete = async (id) => {
        const token = localStorage.getItem('token');
        if (!window.confirm('Confirmer l\'archivage du fournisseur ?')) return;
        try {
            await axios.delete(`http://localhost:5000/fournisseur/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            fetchFournisseurs();
            setSuccess('Fournisseur archivé');
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            console.error(err);
            setError('Erreur lors de l\'archivage');
            setTimeout(() => setError(''), 3000);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        const token = localStorage.getItem('token');
        if (!token) {
            console.error('Aucun token trouvé.');
            setError('Non autorisé');
            setIsLoading(false);
            return;
        }

        try {
            if (isEdit) {
                await axios.put(`http://localhost:5000/fournisseur/${selectedId}`, values, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setSuccess('Fournisseur modifié');
            } else {
                await axios.post('http://localhost:5000/fournisseur', values, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setSuccess('Fournisseur ajouté');
            }

            setShowModal(false);
            fetchFournisseurs();
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            console.error(err);
            setError('Erreur lors de l\'enregistrement');
            setTimeout(() => setError(''), 3000);
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setValues(prev => ({
            ...prev,
            [name]: value
        }));
    };

    return (
        <>
            <nav>
                <Link to="/dashboard" className="text-primary">Accueil</Link>
                <span> / </span>
                <span>Gestion des Fournisseurs</span>
            </nav>
            <div className="card card-primary card-outline">
                <div className="card-header d-flex" style={{ backgroundColor: '#F8F8F8' }}>
                    <img src={fournisseurIcon} alt="" width="90px" />
                    <p className="card-title mt-5 ml-2 p-2 text-center"
                        style={{ width: '350px', borderRadius: '50px', border: '1px solid rgb(215, 214, 216)' }}>
                        Gestion des Fournisseurs
                    </p>
                </div>

                <div className="card-body">
                    {error && <div className="alert alert-danger">{error}</div>}
                    {success && <div className="alert alert-success">{success}</div>}

                    <div className="d-flex align-items-center gap-3 mb-3">
                        <button className="btn btn-app p-1" onClick={handleShowModal}>
                            <img src={add} alt="" width="30px" /><br />
                            Ajouter
                        </button>

                        <div className="input-group" style={{ maxWidth: '300px' }}>
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Rechercher un fournisseur"
                                className="form-control"
                            />
                        </div>
                    </div>

                    <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                        <table className="table table-striped">
                            <thead>
                                <tr>
                                    <th>Nom</th>
                                    <th>Contact</th>
                                    <th>Email</th>
                                    <th>Téléphone</th>
                                    <th>Adresse</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentItems.map((fournisseur) => (
                                    <tr key={fournisseur.id}>
                                        <td>{fournisseur.nom}</td>
                                        <td>{fournisseur.contact}</td>
                                        <td>{fournisseur.email}</td>
                                        <td>{fournisseur.telephone}</td>
                                        <td>{fournisseur.adresse}</td>
                                        <td>
                                            <button onClick={() => handleEdit(fournisseur)} className="btn btn-outline-success">
                                                <img src={edite} alt="Modifier" width="20px" />
                                            </button>
                                            <button onClick={() => handleDelete(fournisseur.id)} className="btn btn-outline-danger">
                                                <img src={delet} alt="Archiver" width="20px" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="text-center">
                        <p><strong>Total de lignes : </strong>{filteredFournisseurs.length}</p>
                        <button 
                            onClick={() => setCurrentPage(currentPage - 1)} 
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
                            onClick={() => setCurrentPage(currentPage + 1)} 
                            disabled={currentPage === totalPages} 
                            className="btn btn-outline-primary"
                        >
                            Suivant
                        </button>
                    </div>
                </div>
            </div>

            {/* Modal */}
            <div className={`modal fade ${showModal ? 'show' : ''}`} style={{ display: showModal ? 'block' : 'none' }} tabIndex="-1" role="dialog">
                <div className="modal-dialog modal-lg modal-custom" role="document">
                    <div className="modal-content modal-custom-content">
                        <form onSubmit={handleSubmit}>
                            <div className="modal-header">
                                <h5 className="modal-title">{isEdit ? 'Modifier un Fournisseur' : 'Ajouter un Fournisseur'}</h5>
                                <button type="button" className="close" onClick={() => setShowModal(false)}>
                                    <span>&times;</span>
                                </button>
                            </div>

                            <div className="modal-body" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                                <div className="form-group">
                                    <input
                                        type="text"
                                        name="nom"
                                        placeholder="Nom complet"
                                        className="form-control input"
                                        style={{ borderRadius: '50px', padding: '10px 15px', backgroundColor: '#F0F2F8' }}
                                        value={values.nom}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <input
                                        type="text"
                                        name="contact"
                                        placeholder="Personne à contacter"
                                        className="form-control input"
                                        style={{ borderRadius: '50px', padding: '10px 15px', backgroundColor: '#F0F2F8' }}
                                        value={values.contact}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="form-group">
                                    <input
                                        type="email"
                                        name="email"
                                        placeholder="Email"
                                        className="form-control input"
                                        style={{ borderRadius: '50px', padding: '10px 15px', backgroundColor: '#F0F2F8' }}
                                        value={values.email}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="form-group">
                                    <input
                                        type="text"
                                        name="telephone"
                                        placeholder="Téléphone"
                                        className="form-control input"
                                        style={{ borderRadius: '50px', padding: '10px 15px', backgroundColor: '#F0F2F8' }}
                                        value={values.telephone}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="form-group">
                                    <textarea
                                        name="adresse"
                                        className="form-control input"
                                        style={{ borderRadius: '15px', padding: '10px 15px', backgroundColor: '#F0F2F8', minHeight: '100px' }}
                                        placeholder="Adresse complète"
                                        value={values.adresse}
                                        onChange={handleChange}
                                        rows="3"
                                    />
                                </div>
                            </div>

                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    style={{ borderRadius: '50px', padding: '8px 20px' }}
                                    onClick={() => setShowModal(false)}
                                >
                                    Fermer
                                </button>
                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                    style={{ borderRadius: '50px', padding: '8px 20px' }}
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true"></span>
                                            Enregistrement...
                                        </>
                                    ) : 'Enregistrer'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
};

export default GestionFournisseur;