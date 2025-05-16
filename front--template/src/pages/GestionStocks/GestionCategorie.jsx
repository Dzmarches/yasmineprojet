import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import matiereIcon from '../../assets/imgs/categories.png';
import add from '../../assets/imgs/add.png';
import edite from '../../assets/imgs/edit.png';
import delet from '../../assets/imgs/archive.png';
import '../Academiques/modal.css';

const GestionCategorie = () => {
    const [categories, setCategories] = useState([]);
    const [values, setValues] = useState({});
    const [isEdit, setIsEdit] = useState(false);
    const [selectedId, setSelectedId] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const [ecoleId, setEcoleId] = useState(null);
    const [ecoleeId, setEcoleeId] = useState(null);

    useEffect(() => {
        const storedEcoleId = localStorage.getItem("ecoleId");
        const storedEcoleeId = localStorage.getItem("ecoleeId");
        if (storedEcoleId) setEcoleId(storedEcoleId);
        if (storedEcoleeId) setEcoleeId(storedEcoleeId);
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                console.error('Aucun token trouvé. Veuillez vous connecter.');
                return;
            }
            const res = await axios.get('http://localhost:5000/categorie', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log("🔍 Résultat API /categorie:", res.data);
            if (Array.isArray(res.data)) {
                setCategories(res.data);
            } else {
                setCategories([]);
                console.error("⚠️ L'API n'a pas retourné un tableau.");
            }
        } catch (err) {
            console.error("❌ Erreur de chargement des catégories", err);
            setCategories([]);
        }
    };


    const filteredCategories = categories.filter(c =>
        c.libelle.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredCategories.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredCategories.length / itemsPerPage);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm]);

    const handleShowModal = () => {
        setShowModal(true);
        setValues({});
        setIsEdit(false);
    };

    const handleEdit = (categorie) => {
        setValues(categorie);
        setSelectedId(categorie.id);
        setShowModal(true);
        setIsEdit(true);
    };

    const handleDelete = async (id) => {
        const token = localStorage.getItem('token');
        if (!window.confirm('Confirmer la suppression ?')) return;
        try {
            await axios.delete(`http://localhost:5000/categorie/delete/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            fetchCategories();
            setSuccess('Catégorie archivée');
        } catch (err) {
            console.error(err);
            setError('Erreur de suppression');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        if (!token) {
            console.error('Aucun token trouvé.');
            setError('Non autorisé');
            return;
        }

        try {
            if (isEdit) {
                await axios.put(`http://localhost:5000/categorie/${selectedId}`, {
                    libelle: values.libelle,
                    description: values.description
                }, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setSuccess('Catégorie modifiée');
            } else {
                await axios.post('http://localhost:5000/categorie/save', {
                    ...values,
                    ecoleId: ecoleId !== 'null' ? ecoleId : null,
                    ecoleeId: ecoleeId !== 'null' ? ecoleeId : null,
                }, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setSuccess('Catégorie ajoutée');
            }

            setShowModal(false);
            fetchCategories();
        } catch (err) {
            console.error(err);
            setError('Erreur lors de l’enregistrement');
        }
    };


    useEffect(() => {
        const storedEcoleId = localStorage.getItem("ecoleId");
        const storedEcoleeId = localStorage.getItem("ecoleeId");

        if (storedEcoleId) setEcoleId(storedEcoleId);
        if (storedEcoleeId) setEcoleeId(storedEcoleeId);
    }, []);

    return (
        <>
            <nav>
                <Link to="/dashboard" className="text-primary">Accueil</Link>
                <span> / </span>
                <span>Gestion des Catégories</span>
            </nav>

            <div className="card card-primary card-outline">
                <div className="card-header d-flex" style={{ backgroundColor: '#F8F8F8' }}>
                    <img src={matiereIcon} alt="" width="90px" />
                    <p className="card-title mt-5 ml-2 p-2 text-center"
                        style={{ width: '350px', borderRadius: '50px', border: '1px solid rgb(215, 214, 216)' }}>
                        Gestion des Catégories
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
                                placeholder="Rechercher une catégorie"
                                className="form-control"
                            />
                        </div>
                    </div>

                    <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                        <table className="table table-striped">
                            <thead>
                                <tr>
                                    <th>Code</th>
                                    <th>Libellé</th>
                                    <th>Description</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentItems.map((cat) => (
                                    <tr key={cat.id}>
                                        <td>{cat.code_categorie}</td>
                                        <td>{cat.libelle}</td>
                                        <td>{cat.description}</td>
                                        <td>
                                            <button onClick={() => handleEdit(cat)} className="btn btn-outline-success">
                                                <img src={edite} alt="Modifier" width="20px" />
                                            </button>
                                            <button onClick={() => handleDelete(cat.id)} className="btn btn-outline-danger">
                                                <img src={delet} alt="Supprimer" width="20px" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="text-center">
                        <p><strong>Total de lignes : </strong>{filteredCategories.length}</p>
                        <button onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1} className="btn btn-outline-primary">Précédent</button>
                        {Array.from({ length: totalPages }, (_, i) => (
                            <button key={i + 1} onClick={() => setCurrentPage(i + 1)} className={`btn btn-outline-primary ${currentPage === i + 1 ? 'active' : ''}`}>
                                {i + 1}
                            </button>
                        ))}
                        <button onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages} className="btn btn-outline-primary">Suivant</button>
                    </div>
                </div>
            </div>

            {/* Modal */}
            <div className={`modal fade ${showModal ? 'show' : ''}`} style={{ display: showModal ? 'block' : 'none' }} tabIndex="-1" role="dialog">
                <div className="modal-dialog modal-custom" role="document">
                    <div className="modal-content modal-custom-content">
                        <form onSubmit={handleSubmit}>
                            <div className="modal-header">
                                <h5 className="modal-title">{isEdit ? 'Modifier une Catégorie' : 'Ajouter une Catégorie'}</h5>
                                <button type="button" className="close" onClick={() => setShowModal(false)}>
                                    <span>&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
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
                                        placeholder="Code Catégorie"
                                        className="form-control input"
                                        value={values.code_categorie || ''}
                                        onChange={(e) => setValues({ ...values, code_categorie: e.target.value })}
                                        required
                                        disabled={isEdit}
                                    />
                                </div>
                                <div className="form-group">
                                    <input
                                        type="text"
                                        placeholder="Libellé"
                                        className="form-control input"
                                        value={values.libelle || ''}
                                        onChange={(e) => setValues({ ...values, libelle: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <textarea
                                        name="description"
                                        className="form-control input"
                                        style={{ borderRadius: '15px', padding: '10px 15px', backgroundColor: '#F0F2F8', minHeight: '100px' }}
                                        placeholder="Description"
                                        value={values.description}
                                        onChange={(e) => setValues({ ...values, description: e.target.value })}
                                        rows="3"
                                    />
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Fermer</button>
                                <button type="submit" className="btn btn-primary">Enregistrer</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
};

export default GestionCategorie;
