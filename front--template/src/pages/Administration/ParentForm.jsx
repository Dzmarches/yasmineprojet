import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Modal, Button } from 'react-bootstrap';
import Select from 'react-select';

const ParentForm = ({ isEditing }) => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [values, setValues] = useState({
        nom: '',
        prenom: '',
        datenaiss: '',
        nom_ar: '',
        prenom_ar: '',
        lieuxnaiss: '',
        lieuxnaiss_ar: '',
        nationalite: '',
        email: '',
        telephone: '',
        travaille: '',
        situation_familiale: '',
        nombreenfant: '',
        adresse: '',
        adresse_ar: '',
        username: '',
        password: '',
        typerole: 'Père'
    });

    const [showPassword, setShowPassword] = useState(false);
    const [nationalites, setNationalites] = useState([]);
    const [selectedOption, setSelectedOption] = useState(null);

    useEffect(() => {
        const fetchNationalites = async () => {
            try {
                const response = await axios.get('http://localhost:5000/nationalites');
                setNationalites(response.data.map(nat => ({
                    value: nat.id,
                    label: nat.nom
                })));
            } catch (error) {
                console.error("Erreur lors de la récupération des nationalités:", error);
            }
        };

        fetchNationalites();
    }, []);

    useEffect(() => {
        const fetchParent = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    console.error('Aucun token trouvé. Veuillez vous connecter.');
                    return;
                }

                const response = await axios.get(`http://localhost:5000/parents/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                const parentData = response.data;
                setValues({
                    nom: parentData.nom || '',
                    prenom: parentData.prenom || '',
                    datenaiss: parentData.datenaiss ? parentData.datenaiss.split('T')[0] : '',
                    nom_ar: parentData.nom_ar || '',
                    prenom_ar: parentData.prenom_ar || '',
                    lieuxnaiss: parentData.lieuxnaiss || '',
                    lieuxnaiss_ar: parentData.lieuxnaiss_ar || '',
                    nationalite: parentData.nationalite || '',
                    email: parentData.email || '',
                    telephone: parentData.telephone || '',
                    travaille: parentData.Parent?.travaille || '',
                    situation_familiale: parentData.Parent?.situation_familiale || '',
                    nombreenfant: parentData.Parent?.nombreenfant || '',
                    adresse: parentData.adresse || '',
                    adresse_ar: parentData.adresse_ar || '',
                    username: parentData.username || '',
                    password: parentData.password || '',
                    typerole: parentData.Parent?.typerole || 'Père'
                });

                if (parentData.nationalite) {
                    setSelectedOption({
                        value: parentData.nationalite,
                        label: parentData.nationalite
                    });
                }
            } catch (error) {
                console.error("Erreur lors de la récupération du parent:", error);
            }
        };

        if (isEditing && id) {
            fetchParent();
        }
    }, [id, isEditing]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setValues(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSelectChange = (selectedOption) => {
        setSelectedOption(selectedOption);
        setValues(prev => ({
            ...prev,
            nationalite: selectedOption.label
        }));
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                console.error('Aucun token trouvé. Veuillez vous connecter.');
                return;
            }

            const parentData = {
                nom: values.nom,
                prenom: values.prenom,
                datenaiss: values.datenaiss,
                nom_ar: values.nom_ar,
                prenom_ar: values.prenom_ar,
                lieuxnaiss: values.lieuxnaiss,
                lieuxnaiss_ar: values.lieuxnaiss_ar,
                nationalite: values.nationalite,
                email: values.email,
                telephone: values.telephone,
                adresse: values.adresse,
                adresse_ar: values.adresse_ar,
                username: values.username,
                password: values.password,
                typerole: values.typerole,
                travaille: values.travaille,
                situation_familiale: values.situation_familiale,
                nombreenfant: values.nombreenfant
            };

            if (isEditing) {
                await axios.put(`http://localhost:5000/parents/${id}`, parentData, {
                    headers: { Authorization: `Bearer ${token}` },
                });
            } else {
                await axios.post('http://localhost:5000/parents', parentData, {
                    headers: { Authorization: `Bearer ${token}` },
                });
            }

            navigate('/parents');
        } catch (error) {
            console.error("Erreur lors de l'enregistrement du parent:", error);
        }
    };

    const customStyles = {
        control: (provided) => ({
            ...provided,
            height: '38px',
            minHeight: '38px'
        })
    };

    return (
        <>
            <nav className="mb-3">
                <Link to="/home" className="text-primary">Accueil</Link>
                <span> / </span>
                <Link to="/etudiants" className="text-primary">Gestion des étudiants</Link>
                <span> / </span>
                <span>{isEditing ? "Modifier" : "Ajouter"}</span>
            </nav>
            <div className='container'>
                <div className="card card-primary">
                    <div className="card-header">
                        <h3 className="card-title">{isEditing ? 'Modifier Parent' : 'Ajouter Parent'}</h3>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className="card-body">
                            <div className="row">
                                <div className="col-md-4">
                                    <div className="form-group">
                                        <label>Type de rôle</label>
                                        <select
                                            name="typerole"
                                            className="form-control"
                                            value={values.typerole}
                                            onChange={handleChange}
                                            required
                                        >
                                            <option value="Père">Père</option>
                                            <option value="Mère">Mère</option>
                                            <option value="Tuteur">Tuteur</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div className="row mt-3">
                                <div className="col-md-4">
                                    <div className="form-group">
                                        <label>Nom</label>
                                        <input
                                            type="text"
                                            name="nom"
                                            className="form-control"
                                            value={values.nom}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="form-group">
                                        <label>Prénom</label>
                                        <input
                                            type="text"
                                            name="prenom"
                                            className="form-control"
                                            value={values.prenom}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="form-group">
                                        <label>Date de naissance</label>
                                        <input
                                            type="date"
                                            name="datenaiss"
                                            className="form-control"
                                            value={values.datenaiss}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="row mt-3">
                                <div className="col-md-4">
                                    <div className="form-group">
                                        <label>Nom en arabe</label>
                                        <input
                                            type="text"
                                            name="nom_ar"
                                            className="form-control"
                                            value={values.nom_ar}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="form-group">
                                        <label>Prénom en arabe</label>
                                        <input
                                            type="text"
                                            name="prenom_ar"
                                            className="form-control"
                                            value={values.prenom_ar}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="form-group">
                                        <label>Nationalité</label>
                                        <Select
                                            value={selectedOption}
                                            onChange={handleSelectChange}
                                            options={nationalites}
                                            styles={customStyles}
                                            placeholder="Sélectionnez une nationalité"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="row mt-3">
                                <div className="col-md-6">
                                    <div className="form-group">
                                        <label>Lieu de naissance</label>
                                        <input
                                            type="text"
                                            name="lieuxnaiss"
                                            className="form-control"
                                            value={values.lieuxnaiss}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="form-group">
                                        <label>Lieu de naissance en arabe</label>
                                        <input
                                            type="text"
                                            name="lieuxnaiss_ar"
                                            className="form-control"
                                            value={values.lieuxnaiss_ar}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="row mt-3">
                                <div className="col-md-6">
                                    <div className="form-group">
                                        <label>Adresse</label>
                                        <input
                                            type="text"
                                            name="adresse"
                                            className="form-control"
                                            value={values.adresse}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="form-group">
                                        <label>Adresse en arabe</label>
                                        <input
                                            type="text"
                                            name="adresse_ar"
                                            className="form-control"
                                            value={values.adresse_ar}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="row mt-3">
                                <div className="col-md-6">
                                    <div className="form-group">
                                        <label>Téléphone</label>
                                        <input
                                            type="text"
                                            name="telephone"
                                            className="form-control"
                                            value={values.telephone}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="form-group">
                                        <label>Email</label>
                                        <input
                                            type="email"
                                            name="email"
                                            className="form-control"
                                            value={values.email}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="row mt-3">
                                <div className="col-md-6">
                                    <div className="form-group">
                                        <label>Profession</label>
                                        <input
                                            type="text"
                                            name="travaille"
                                            className="form-control"
                                            value={values.travaille}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="form-group">
                                        <label>Situation familiale</label>
                                        <select
                                            name="situation_familiale"
                                            className="form-control"
                                            value={values.situation_familiale}
                                            onChange={handleChange}
                                            required
                                        >
                                            <option value="">Sélectionnez</option>
                                            <option value="Marié">Marié</option>
                                            <option value="Divorcé">Divorcé</option>
                                            <option value="Célibataire">Célibataire</option>
                                            <option value="Veuve">Veuve</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div className="row mt-3">
                                <div className="col-md-4">
                                    <div className="form-group">
                                        <label>Nombre d'enfants</label>
                                        <input
                                            type="number"
                                            name="nombreenfant"
                                            className="form-control"
                                            value={values.nombreenfant}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="form-group">
                                        <label>Nom d'utilisateur</label>
                                        <div className="input-group">
                                            <span className="input-group-text">@</span>
                                            <input
                                                type="text"
                                                name="username"
                                                className="form-control"
                                                value={values.username}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="form-group">
                                        <label>Mot de passe</label>
                                        <div className="input-group">
                                            <input
                                                type={showPassword ? "text" : "password"}
                                                name="password"
                                                className="form-control"
                                                value={values.password}
                                                onChange={handleChange}
                                                required
                                            />
                                            <span
                                                className="input-group-text"
                                                onClick={togglePasswordVisibility}
                                                style={{ cursor: 'pointer' }}
                                            >
                                                {showPassword ? (
                                                    <i className="fa fa-eye-slash" aria-hidden="true"></i>
                                                ) : (
                                                    <i className="fa fa-eye" aria-hidden="true"></i>
                                                )}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="card-footer">
                            <button type="submit" className="btn btn-primary">
                                {isEditing ? 'Mettre à jour' : 'Ajouter'}
                            </button>
                            <button
                                type="button"
                                className="btn btn-default ml-2"
                                onClick={() => navigate('/parents')}
                            >
                                Annuler
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>

    );
};

export default ParentForm;