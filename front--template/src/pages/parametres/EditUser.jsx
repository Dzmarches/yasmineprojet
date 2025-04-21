import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import addbtn from '../../assets/imgs/addbtn.png';
import Role from './Role';
import Select from 'react-select';

const EditUser = () => {
    const { userId } = useParams();
    const navigate = useNavigate();

    const [user, setUser] = useState({
        nom: '',
        prenom: '',
        nom_ar: '',
        prenom_ar: '',
        datenaiss: '',
        lieuxnaiss: '',
        lieuxnaiss_ar: '',
        adresse: '',
        adresse_ar: '',
        sexe: '',
        telephone: '',
        email: '',
        nationalite: '',
        username: '',
        password: '',
        type: '',
        ecoleId: '',
        lastLogin: '',
        lastIp: '',
        lastMac: '',
        lastLocation: '',
        latitude: '',
        longitude: '',
        roleId: null,
        roles: [],
    });

    const [roles, setRoles] = useState([]);
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(true);

    const fetchRoles = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                alert("Vous devez être connecté pour soumettre le formulaire.");
                return;
            }

            const response = await axios.get('http://localhost:5000/roles/liste', {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            setRoles(response.data);
        } catch (error) {
            console.error('Erreur lors de la récupération des rôles', error);
            alert('Une erreur est survenue lors de la récupération des rôles');
        }
    };

    useEffect(() => {
        const fetchUserData = async () => {
            const token = localStorage.getItem('token');
            try {
                setLoading(true);

                // Vérifiez que userId est bien défini
                if (!userId) {
                    console.error('ID utilisateur non défini');
                    return;
                }

                const response = await axios.get(`http://localhost:5000/apii/users/${userId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                // Ajoutez des logs pour déboguer
                console.log('Réponse de l\'API:', response.data);

                if (response.data && response.data.user) {
                    const userData = response.data.user;
                    setUser({
                        ...userData,
                        roles: Array.isArray(userData.roles) ? userData.roles : [],
                        // Assurez-vous que le mot de passe n'est pas renvoyé par l'API
                        password: '' // Réinitialisez le mot de passe pour des raisons de sécurité
                    });
                } else {
                    console.error('Données utilisateur non trouvées dans la réponse');
                }
            } catch (error) {
                console.error('Erreur lors de la récupération des données utilisateur:', error);
                alert("Erreur lors de la récupération des données utilisateur");
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
        fetchRoles();
    }, [userId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        try {
            if (!user.username) {
                console.error('Le nom d\'utilisateur est requis');
                return;
            }

            const userData = {
                nom: user.nom,
                prenom: user.prenom,
                nom_ar: user.nom_ar,
                prenom_ar: user.prenom_ar,
                datenaiss: user.datenaiss,
                lieuxnaiss: user.lieuxnaiss,
                lieuxnaiss_ar: user.lieuxnaiss_ar,
                telephone: user.telephone,
                email: user.email,
                username: user.username,
                ...(user.password && { password: user.password }),
                roles: user.roles,
            };

            const response = await axios.put(
                `http://localhost:5000/apii/users/modifier/${userId}`,
                userData,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (response.data.message === "Ce nom d'utilisateur est déjà utilisé.") {
                console.error("Ce nom d'utilisateur est déjà utilisé");
                return;
            }

            console.log("Utilisateur modifié avec succès");
            navigate('/listeUser'); // Redirection immédiate
        } catch (error) {
            console.error('Erreur lors de la modification:', error);
            console.error(error.response?.data?.message || 'Erreur lors de la modification');
        }
    };

    const handleRoleAdded = () => {
        fetchRoles();
    };

    if (loading) {
        return <div className="container mt-4">Chargement...</div>;
    }

    return (
        <div className="container mt-4">

            <h2 className="mb-4">Modifier l'utilisateur</h2>
            <form onSubmit={handleSubmit}>
                {/* Nom et Prénom */}
                <div className="row mb-3">
                    <div className="col-md-6">
                        <label htmlFor="nom" className="form-label">Nom *</label>
                        <input
                            type="text"
                            id="nom"
                            name="nom"
                            value={user.nom}
                            onChange={handleChange}
                            className="form-control"
                            required
                        />
                    </div>
                    <div className="col-md-6">
                        <label htmlFor="prenom" className="form-label">Prénom *</label>
                        <input
                            type="text"
                            id="prenom"
                            name="prenom"
                            value={user.prenom}
                            onChange={handleChange}
                            className="form-control"
                            required
                        />
                    </div>
                </div>

                {/* Nom et Prénom en Arabe */}
                <div className="row mb-3">
                    <div className="col-md-6">
                        <label htmlFor="nom_ar" className="form-label">Nom en arabe *</label>
                        <input
                            type="text"
                            id="nom_ar"
                            name="nom_ar"
                            value={user.nom_ar}
                            onChange={handleChange}
                            className="form-control"
                            required
                        />
                    </div>
                    <div className="col-md-6">
                        <label htmlFor="prenom_ar" className="form-label">Prénom en arabe *</label>
                        <input
                            type="text"
                            id="prenom_ar"
                            name="prenom_ar"
                            value={user.prenom_ar}
                            onChange={handleChange}
                            className="form-control"
                            required
                        />
                    </div>
                </div>

                {/* Email et Téléphone */}
                <div className="row mb-3">
                    <div className="col-md-6">
                        <label htmlFor="email" className="form-label">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={user.email}
                            onChange={handleChange}
                            className="form-control"
                        />
                    </div>
                    <div className="col-md-6">
                        <label htmlFor="telephone" className="form-label">Téléphone</label>
                        <input
                            type="text"
                            id="telephone"
                            name="telephone"
                            value={user.telephone}
                            onChange={handleChange}
                            className="form-control"
                        />
                    </div>
                </div>

                {/* Date de Naissance et Lieu de Naissance */}
                <div className="row mb-3">
                    <div className="col-md-6">
                        <label htmlFor="datenaiss" className="form-label">Date de naissance</label>
                        <input
                            type="date"
                            id="datenaiss"
                            name="datenaiss"
                            value={user.datenaiss ? user.datenaiss.split('T')[0] : ''}
                            onChange={handleChange}
                            className="form-control"
                        />
                    </div>
                    <div className="col-md-6">
                        <label htmlFor="lieuxnaiss" className="form-label">Lieu de naissance</label>
                        <input
                            type="text"
                            id="lieuxnaiss"
                            name="lieuxnaiss"
                            value={user.lieuxnaiss}
                            onChange={handleChange}
                            className="form-control"
                        />
                    </div>
                </div>

                {/* Rôle */}
                <div className="row mb-3">
                    <div className="col-md-6">
                        <label htmlFor="role" className="form-label">Rôle
                            <a data-toggle="modal" data-target="#modal-role">
                                <img src={addbtn} alt="" width="30px" title='ajouter un rôle' />
                            </a>
                        </label> <br />
                        <Select
                            isMulti
                            classNamePrefix="react-select"
                            options={roles.filter(r => r != null).map(role => ({ value: role.id, label: role.name }))}
                            value={
                                Array.isArray(user.roles)
                                    ? roles
                                        .filter(role => role != null && user.roles.some(userRole => userRole && userRole.id === role.id))
                                        .map(role => ({ value: role.id, label: role.name }))
                                    : []
                            }

                            onChange={(selectedOptions) => {
                                setUser(prevState => ({
                                    ...prevState,
                                    roles: selectedOptions.map(option => ({ id: option.value, name: option.label }))
                                }));
                            }}
                            placeholder="Sélectionner les rôles"
                        />
                    </div>
                </div>

                {/* Username et Password */}
                {/* Username et Password */}
                <div className="row mb-3">
                    <div className="col-md-6">
                        <label htmlFor="username" className="form-label">Username</label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            value={user.username || ''}
                            onChange={handleChange}
                            className="form-control"
                            required
                        />
                    </div>
                    <div className="col-md-6">
                        <label htmlFor="password" className="form-label">Password</label>
                        <div className="input-group">
                            <input
                                type={showPassword ? "text" : "password"}
                                id="password"
                                name="password"
                                value={user.password || ''}
                                onChange={handleChange}
                                className="form-control"
                                placeholder="Changer password"
                            />
                            <button
                                type="button"
                                className="btn btn-outline-secondary"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? "Masquer" : "Afficher"}
                            </button>
                        </div>
                    </div>
                </div>
                <Role onRoleAdded={handleRoleAdded} />
                {/* Bouton Enregistrer */}
                <button type="submit" className="btn btn-primary mt-3">
                    Enregistrer
                </button>
            </form>
        </div>
    );
};

export default EditUser;