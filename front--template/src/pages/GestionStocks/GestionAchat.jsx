import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import achatIcon from '../../assets/imgs/add-to-cart.png';
import add from '../../assets/imgs/add.png';
import edite from '../../assets/imgs/edit.png';
import delet from '../../assets/imgs/archive.png';
import Select from 'react-select';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import '../Academiques/modal.css';

const GestionAchat = () => {
    const [achats, setAchats] = useState([]);
    const [articles, setArticles] = useState([]);
    const [fournisseurs, setFournisseurs] = useState([]);
    const [values, setValues] = useState({
        articleId: null,
        fournisseurId: null,
        prix: '',
        devise: 'DZ',
        tva: '',
        unite: '',
        date_achat: new Date(),
        date_peremption: null,
        description: ''
    });
    const [isEdit, setIsEdit] = useState(false);
    const [selectedId, setSelectedId] = useState(null);
    const [showModalAchats, setShowModalAchats] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(15);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        fetchAchats();
        fetchArticles();
        fetchFournisseurs();
    }, []);

    const fetchAchats = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get('http://localhost:5000/achat', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setAchats(res.data);
        } catch (err) {
            console.error("Erreur de chargement des achats", err);
            setError('Erreur de chargement des achats');
        }
    };

    const fetchArticles = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get('http://localhost:5000/article', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setArticles(res.data.map(art => ({
                value: art.id,
                label: `${art.code_article} - ${art.libelle}`
            })));
        } catch (err) {
            console.error("Erreur de chargement des articles", err);
        }
    };

    const fetchFournisseurs = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get('http://localhost:5000/fournisseur', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setFournisseurs(res.data.map(f => ({
                value: f.id,
                label: f.nom
            })));
        } catch (err) {
            console.error("Erreur de chargement des fournisseurs", err);
        }
    };

    const filteredAchats = achats.filter(a =>
        a.Article?.libelle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.Fournisseur?.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.prix.toString().includes(searchTerm)
    );

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentAchat = filteredAchats.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredAchats.length / itemsPerPage);

    const handleShowModalAchats = () => {
        setShowModalAchats(true);
        setValues({
            articleId: null,
            fournisseurId: null,
            prix: '',
            devise: 'DZ',
            tva: '',
            unite: '',
            date_achat: new Date(),
            date_peremption: null,
            description: ''
        });
        setIsEdit(false);
    };

    const handleEditAchats = (achat) => {
        setValues({
            articleId: articles.find(a => a.value === achat.articleId),
            fournisseurId: fournisseurs.find(f => f.value === achat.fournisseurId),
            prix: achat.prix,
            devise: achat.devise,
            tva: achat.tva,
            unite: achat.unite,
            date_achat: new Date(achat.date_achat),
            date_peremption: achat.date_peremption ? new Date(achat.date_peremption) : null,
            description: achat.description
        });
        setSelectedId(achat.id);
        setShowModalAchats(true);
        setIsEdit(true);
    };

    const handleDeleteAchats = async (id) => {
        if (!window.confirm('Confirmer la suppression ?')) return;
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`http://localhost:5000/achat/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchAchats();
            setSuccess('Achat supprimé');
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            console.error(err);
            setError('Erreur de suppression');
            setTimeout(() => setError(''), 3000);
        }
    };

    const handleSubmitAchats = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        const token = localStorage.getItem('token');

        try {
            const payload = {
                articleId: values.articleId.value,
                fournisseurId: values.fournisseurId.value,
                prix: parseFloat(values.prix),
                devise: values.devise,
                tva: values.tva ? parseFloat(values.tva) : null,
                unite: values.unite,
                date_achat: values.date_achat,
                date_peremption: values.date_peremption,
                description: values.description
            };

            if (isEdit) {
                await axios.put(`http://localhost:5000/achat/${selectedId}`, payload, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setSuccess('Achat modifié');
            } else {
                await axios.post('http://localhost:5000/achat', payload, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setSuccess('Achat ajouté');
            }

            setShowModal(false);
            fetchAchats();
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || 'Erreur lors de l\'enregistrement');
            setTimeout(() => setError(''), 3000);
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setValues(prev => ({ ...prev, [name]: value }));
    };

    const handleSelectChange = (selectedOption, { name }) => {
        setValues(prev => ({ ...prev, [name]: selectedOption }));
    };

    const handleDateChange = (date, name) => {
        setValues(prev => ({ ...prev, [name]: date }));
    };

    return (
        <>
            <nav>
                <Link to="/dashboard" className="text-primary">Accueil</Link>
                <span> / </span>
                <span>Gestion des Achats</span>
            </nav>

            <div className="card card-primary card-outline">
                <div className="card-header d-flex" style={{ backgroundColor: '#F8F8F8' }}>
                    <img src={achatIcon} alt="" width="90px" />
                    <p className="card-title mt-5 ml-2 p-2 text-center"
                        style={{ width: '350px', borderRadius: '50px', border: '1px solid rgb(215, 214, 216)' }}>
                        Gestion des Achats
                    </p>
                </div>

                <div className="card-body">
                    {error && <div className="alert alert-danger">{error}</div>}
                    {success && <div className="alert alert-success">{success}</div>}

                    <div className="d-flex align-items-center gap-3 mb-3">
                        <button className="btn btn-app p-1" onClick={handleShowModalAchats}>
                            <img src={add} alt="" width="30px" /><br />
                            Ajouter
                        </button>

                        <div className="input-group" style={{ maxWidth: '300px' }}>
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Rechercher un achat"
                                className="form-control"
                            />
                        </div>
                    </div>

                    <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                        <table className="table table-striped">
                            <thead>
                                <tr>
                                    <th>Article</th>
                                    <th>Fournisseur</th>
                                    <th>Prix</th>
                                    <th>Date Achat</th>
                                    <th>Date Péremption</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentAchat.map((achat) => (
                                    <tr key={achat.id}>
                                        <td>{achat.Article?.libelle}</td>
                                        <td>{achat.Fournisseur?.nom}</td>
                                        <td>{achat.prix} {achat.devise}</td>
                                        <td>{new Date(achat.date_achat).toLocaleDateString()}</td>
                                        <td>{achat.date_peremption ? new Date(achat.date_peremption).toLocaleDateString() : '-'}</td>
                                        <td>
                                            <button onClick={() => handleEditAchats(achat)} className="btn btn-outline-success">
                                                <img src={edite} alt="Modifier" width="20px" />
                                            </button>
                                            <button onClick={() => handleDeleteAchats(achat.id)} className="btn btn-outline-danger">
                                                <img src={delet} alt="Supprimer" width="20px" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="text-center">
                        <p><strong>Total de lignes : </strong>{filteredAchats.length}</p>
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
            <div className={`modal fade ${showModalAchats ? 'show' : ''}`} style={{ display: showModalAchats ? 'block' : 'none' }} tabIndex="-1" role="dialog">
                <div className="modal-dialog modal-lg modal-custom" role="document">
                    <div className="modal-content modal-custom-content">
                        <form onSubmit={handleSubmitAchats}>
                            <div className="modal-header">
                                <h5 className="modal-title">{isEdit ? 'Modifier un Achat' : 'Ajouter un Achat'}</h5>
                                <button type="button" className="close" onClick={() => setShowModalAchats(false)}>
                                    <span>&times;</span>
                                </button>
                            </div>

                            <div className="modal-body" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                                <div className="form-group">
                                    <Select
                                        name="articleId"
                                        options={articles}
                                        value={values.articleId}
                                        onChange={handleSelectChange}
                                        placeholder="Sélectionner un article"
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
                                    <Select
                                        name="fournisseurId"
                                        options={fournisseurs}
                                        value={values.fournisseurId}
                                        onChange={handleSelectChange}
                                        placeholder="Sélectionner un fournisseur"
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
                                    <input
                                        type="number"
                                        name="prix"
                                        className="form-control input"
                                        value={values.prix}
                                        onChange={handleChange}
                                        min="0"
                                        step="10"
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <input
                                        type="text"
                                        name="unite"
                                        className="form-control input"
                                        value={values.unite}
                                        onChange={handleChange}
                                        placeholder="kg, L, pièce..."
                                    />
                                </div>
                                <div className="form-group">
                                    <select
                                        name="devise"
                                        className="form-control input"
                                        value={values.devise}
                                        onChange={handleChange}
                                    >
                                        <option value="DZ">DZ (Dinar Algérien)</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="date_peremption" style={{marginLeft:'90px'}}>Date d'achat</label>
                                </div>
                                <div className="form-group">
                                    <input
                                        type="date"
                                        name="date_achat"
                                        value={values.date_achat}
                                        onChange={handleChange}
                                        required
                                        className="form-control input"
                                        placeholderText="date"
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="date_peremption" style={{marginLeft:'90px'}}>Date Péremption (optionnel)</label>
                                </div>
                                <div className="form-group">
                                    <input
                                        type="date"
                                        name="date_peremption"
                                        value={values.date_peremption}
                                        onChange={handleChange}
                                        className="form-control input"
                                        placeholder="Date Péremption (optionnel)"
                                    />

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
                                    onClick={() => setShowModalAchats(false)}
                                >
                                    Fermer
                                </button>
                                <button
                                    type="submit"
                                    className="btn btn-primary"
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

export default GestionAchat;