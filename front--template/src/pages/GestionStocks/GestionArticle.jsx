import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import matiereIcon from '../../assets/imgs/checklist.png';
import add from '../../assets/imgs/add.png';
import edite from '../../assets/imgs/edit.png';
import delet from '../../assets/imgs/archive.png';
import Select from 'react-select';
import '../Academiques/modal.css';

const GestionArticle = () => {
    const [articles, setArticles] = useState([]);
    const [categories, setCategories] = useState([]);
    const [values, setValues] = useState({
        code_article: '',
        libelle: '',
        description: '',
        magasinier:'',
        categorieId: '',
    });
    const [isEdit, setIsEdit] = useState(false);
    const [selectedId, setSelectedId] = useState(null);
    const [showModalArticle, setShowModalArticle] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(15);
    const [ecoleId, setEcoleId] = useState(null);
    const [ecoleeId, setEcoleeId] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const storedEcoleId = localStorage.getItem("ecoleId");
        const storedEcoleeId = localStorage.getItem("ecoleeId");
        if (storedEcoleId) setEcoleId(storedEcoleId);
        if (storedEcoleeId) setEcoleeId(storedEcoleeId);
        fetchArticles();
        fetchCategories();
    }, []);

    const fetchArticles = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                console.error('Aucun token trouvé. Veuillez vous connecter.');
                return;
            }
            const res = await axios.get('http://localhost:5000/article', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setArticles(res.data);
        } catch (err) {
            console.error("❌ Erreur de chargement des articles", err);
            setArticles([]);
        }
    };

    const fetchCategories = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get('http://localhost:5000/article/categories', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setCategories(res.data.map(cat => ({
                value: cat.id,
                label: cat.libelle
            })));
        } catch (err) {
            console.error("❌ Erreur de chargement des catégories", err);
            setCategories([]);
        }
    };

    const filteredArticles = articles.filter(a =>
        a.libelle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.code_article.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (a.produit && a.produit.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    const filteredAchats = achats.filter(a =>
        a.Article?.libelle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.Fournisseur?.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.prix.toString().includes(searchTerm)
    );

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredArticles.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredArticles.length / itemsPerPage);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm]);

    const handleShowModalArticle = () => {
        setShowModalArticle(true);
        setValues({
            code_article: '',
            libelle: '',
            description: '',
            magasinier:'',
            categorieId: ''
        });
        setIsEdit(false);
    };

    const handleEditArticle = (article) => {
        setValues({
            code_article: article.code_article,
            libelle: article.libelle,
            description: article.description,
            magasinier: article.magasinier,
            categorieId: categories.find(c => c.value === article.categorieId)
        });
        setSelectedId(article.id);
        setShowModalArticle(true);
        setIsEdit(true);
    };

    const handleDeleteArticle = async (id) => {
        const token = localStorage.getItem('token');
        if (!window.confirm('Confirmer la suppression ?')) return;
        try {
            await axios.delete(`http://localhost:5000/article/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            fetchArticles();
            setSuccess('Article archivé');
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            console.error(err);
            setError('Erreur de suppression');
            setTimeout(() => setError(''), 3000);
        }
    };

    const handleSubmitArticle = async (e) => {
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
            const payload = {
                ...values,
                categorieId: values.categorieId.value,
                magasinier: values.magasinier
            };

            if (isEdit) {
                await axios.put(`http://localhost:5000/article/${selectedId}`, payload, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setSuccess('Article modifié');
            } else {
                await axios.post('http://localhost:5000/article', {
                    ...payload,
                    ecoleId: ecoleId !== 'null' ? ecoleId : null,
                    ecoleeId: ecoleeId !== 'null' ? ecoleeId : null,
                }, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setSuccess('Article ajouté');
            }

            setShowModalArticle(false);
            fetchArticles();
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

    const handleSelectChange = (selectedOption, { name }) => {
        setValues(prev => ({
            ...prev,
            [name]: selectedOption
        }));
    };

    return (
        <>
        <nav>
                <Link to="/dashboard" className="text-primary">Accueil</Link>
                <span> / </span>
                <span>Gestion des Articles</span>
            </nav>

            <div className="card card-primary card-outline">
                <div className="card-header d-flex" style={{ backgroundColor: '#F8F8F8' }}>
                    <img src={matiereIcon} alt="" width="90px" />
                    <p className="card-title mt-5 ml-2 p-2 text-center"
                        style={{ width: '350px', borderRadius: '50px', border: '1px solid rgb(215, 214, 216)' }}>
                        Gestion des Articles
                    </p>
                </div>

                <div className="card-body">
                    {error && <div className="alert alert-danger">{error}</div>}
                    {success && <div className="alert alert-success">{success}</div>}

                    <div className="d-flex align-items-center gap-3 mb-3">
                        <button className="btn btn-app p-1" onClick={handleShowModalArticle}>
                            <img src={add} alt="" width="30px" /><br />
                            Ajouter
                        </button>

                        <div className="input-group" style={{ maxWidth: '300px' }}>
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Rechercher un article"
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
                                    <th>Catégorie</th>
                                    <th>Magasinier</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentItems.map((art) => (
                                    <tr key={art.id}>
                                        <td>{art.code_article}</td>
                                        <td>{art.libelle}</td>
                                        <td>{art.Categorie?.libelle}</td>
                                        <td>{art.magasinier}</td>
                                        <td>
                                            <button onClick={() => handleEditArticle(art)} className="btn btn-outline-success">
                                                <img src={edite} alt="Modifier" width="20px" />
                                            </button>
                                            <button onClick={() => handleDeleteArticle(art.id)} className="btn btn-outline-danger">
                                                <img src={delet} alt="Supprimer" width="20px" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="text-center">
                        <p><strong>Total de lignes : </strong>{filteredArticles.length}</p>
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
            <div className={`modal fade ${showModalArticle ? 'show' : ''}`} style={{ display: showModalArticle ? 'block' : 'none' }} tabIndex="-1" role="dialog">
                <div className="modal-dialog modal-lg modal-custom" role="document">
                    <div className="modal-content modal-custom-content">
                        <form onSubmit={handleSubmitArticle}>
                            <div className="modal-header">
                                <h5 className="modal-title">{isEdit ? 'Modifier un Article' : 'Ajouter un Article'}</h5>
                                <button type="button" className="close" onClick={() => setShowModalArticle(false)}>
                                    <span>&times;</span>
                                </button>
                            </div>

                            <div className="modal-body" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
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
                                        name="code_article"
                                        placeholder="Code Article"
                                        className="form-control input"
                                        style={{ borderRadius: '50px', padding: '10px 15px', backgroundColor: '#F0F2F8' }}
                                        value={values.code_article}
                                        onChange={handleChange}
                                        required
                                        disabled={isEdit}
                                    />
                                </div>

                                <div className="form-group">
                                    <input
                                        type="text"
                                        name="libelle"
                                        placeholder="Libellé"
                                        className="form-control input"
                                        style={{ borderRadius: '50px', padding: '10px 15px', backgroundColor: '#F0F2F8' }}
                                        value={values.libelle}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <Select
                                        name="categorieId"
                                        options={categories}
                                        value={values.categorieId}
                                        onChange={handleSelectChange}
                                        placeholder="Sélectionner une catégorie"
                                        styles={{
                                            container: (base) => ({
                                                ...base,
                                                width: '90%',  // Prend toute la largeur disponible
                                                marginLeft: '60px',
                                            }),
                                            control: (base, state) => ({
                                                ...base,
                                                backgroundColor: '#F0F2F8',
                                                borderRadius: '50px',
                                                margin: '10px 0',
                                                padding: '2px 10px',
                                                boxShadow: state.isFocused ? '0 0 0 2px rgba(90, 203, 207, 0.5)' : '2px 2px 8px rgba(0, 0, 0, 0.1)',
                                                minHeight: '50px',
                                                borderColor: state.isFocused ? '#5ACBCF' : '#ced4da',
                                                '&:hover': {
                                                    borderColor: '#5ACBCF'
                                                },
                                            }),
                                            valueContainer: (base) => ({
                                                ...base,
                                                flexWrap: 'nowrap',  // Empêche le retour à la ligne
                                                overflowX: 'auto',  // Permet le scroll horizontal
                                                maxWidth: '90%',
                                            }),
                                            multiValue: (base) => ({
                                                ...base,
                                                backgroundColor: '#5ACBCF',
                                                borderRadius: '10px',
                                                flexShrink: 0,  // Empêche la réduction des éléments
                                            }),
                                            multiValueLabel: (base) => ({
                                                ...base,
                                                color: 'white',
                                                padding: '2px 6px',
                                            }),
                                            multiValueRemove: (base) => ({
                                                ...base,
                                                color: 'white',
                                                ':hover': {
                                                    backgroundColor: '#dc3545',
                                                    color: 'white',
                                                },
                                            }),
                                            menuPortal: base => ({ ...base, zIndex: 9999 }),
                                            menu: base => ({
                                                ...base,
                                                zIndex: 9999,
                                                width: 'auto',  // S'adapte au contenu
                                                minWidth: '100%',  // Au moins la largeur du contrôle
                                            }),
                                            menuList: base => ({
                                                ...base,
                                                maxHeight: '200px',
                                            }),
                                            placeholder: (base) => ({
                                                ...base,
                                                color: '#A9A9A9',
                                            }),
                                            input: (base) => ({
                                                ...base,
                                                color: '#333',
                                                width: 'auto !important',  // Permet à l'input de s'adapter
                                            }),
                                        }}
                                        components={{
                                            DropdownIndicator: null  // Cache la flèche du dropdown
                                        }}
                                        menuPortalTarget={document.body}
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <select
                                        name="magasinier"
                                        className="form-control input"
                                        style={{ borderRadius: '50px', padding: '10px 15px', backgroundColor: '#F0F2F8' }}
                                        value={values.magasinier}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="">-- Sélectionner un type --</option>
                                        <option value="nouriteur">Nourriteur</option>
                                        <option value="fourniteur">Fourniteur</option>
                                    </select>
                                </div>
                                
                                <div className="form-group">
                                    <textarea
                                        name="description"
                                        className="form-control input"
                                        style={{ borderRadius: '15px', padding: '10px 15px', backgroundColor: '#F0F2F8', minHeight: '100px' }}
                                        placeholder="Description"
                                        value={values.description}
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
                                    onClick={() => setShowModalArticle(false)}
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

export default GestionArticle;