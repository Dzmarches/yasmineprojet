
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AiOutlineFile } from 'react-icons/ai';
import scool from '../../assets/imgs/school.png';
import map from '../../assets/imgs/map.png';
import user from '../../assets/imgs/user.png';
import school from '../../assets/imgs/school (1).png';
import socialmedia from '../../assets/imgs/social-media.png';
import { MapContainer, TileLayer, Polygon, FeatureGroup } from 'react-leaflet';
import { EditControl } from 'react-leaflet-draw';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { FaChevronUp, FaChevronDown } from 'react-icons/fa';
import { Table, Form, Button, Modal } from 'react-bootstrap';

const AjoutEcole = () => {
    const location = useLocation();
    const [expandedGestion, setExpandedGestion] = useState(null);
    const [permissions, setPermissions] = useState({});
    const [selectedPermissions, setSelectedPermissions] = useState({});
    const { ecole } = location.state || {};
    const [userId, setUserId] = useState(null);
    const [ecoleId, setEcoleId] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [nomecole, setNomecole] = useState(ecole ? ecole.nomecole : '');
    const [nom_arecole, setNomArecole] = useState(ecole ? ecole.nom_arecole : '');
    const [adresse, setAdresse] = useState(ecole ? ecole.adresse : '');
    const [emailecole, setEmailecole] = useState(ecole ? ecole.emailecole : '');
    const [telephoneecole, setTelephoneecole] = useState(ecole ? ecole.telephoneecole : '');
    const [fix, setFix] = useState(ecole ? ecole.fix : '');
    const [cycle, setCycle] = useState(ecole ? ecole.cycle : '');
    const [maps, setMaps] = useState(ecole ? ecole.maps : '');
    const [facebook, setFacebook] = useState(ecole ? ecole.facebook : '');
    const [insta, setInsta] = useState(ecole ? ecole.insta : '');
    const [linkdin, setLinkdin] = useState(ecole ? ecole.linkdin : '');
    const [rib, setRib] = useState(ecole ? ecole.rib : '');
    const [nif, setNif] = useState(ecole ? ecole.nif : '');
    const [rc, setRc] = useState(ecole ? ecole.rc : '');
    const [polygonCoords, setPolygonCoords] = useState(
        ecole && ecole.maps && ecole.maps.trim() !== '' ? JSON.parse(ecole.maps) : []
    );
    const [mapType, setMapType] = useState('default');
    const [id, setId] = useState(ecole ? ecole.id : null);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [nom, setNom] = useState('');
    const [prenom, setPrenom] = useState('');
    const [email, setEmail] = useState('');
    const [telephone, setTelephone] = useState('');
    const [showPermissionsModal, setShowPermissionsModal] = useState(false);
    const [userPermissions, setUserPermissions] = useState([]);
    const navigate = useNavigate();


    const sousGestions = {
        "Administration": ["Gestion élève", "Gestion parents", "Gestion enseignant", "Gestion privilège"],
        "Academique": ["Trimestre", "Salle", "Niveaux", "Matière", "Sections", "Gestion emploi de temps"],
        "Gestion Evaluation & bulletin": [],
        "Ressources Humaines": ["Gestion des employées", "Gestion demande de congé", "Gestion de mes demande de congé", "Gestion pointage", "Gestion de mes pointage", "gestion attestation", "rapports pointage", "gestion de la paye"],
        "Comptabilité": [],
        "Cantine scolaire": [],
        "Bibliothèque": [],
        "Transport": ["Suivi les bus"],
        "Elearning": [],
        "Statistique": [],
        "Communication": ["Gestion des annonces", "Envoi de notifications", "Messagerie interne", "Envoie d'email"],
        "Parametre": ["Gestion écoles"],
    };

    const handleToggleGestion = (gestion) => {
        setExpandedGestion(expandedGestion === gestion ? null : gestion);
    };

    const generateCredentials = (nomecole) => {
        if (nomecole) {
            const randomLetters = Math.random().toString(36).substring(2, 5).toUpperCase();
            const randomNumbers = Math.floor(100 + Math.random() * 900);
            const generatedUsername = `Ecole@${nomecole.substring(0, 3).toUpperCase()}${randomLetters}${randomNumbers}`;
            const generatedPassword = `${nomecole.substring(0, 3).toUpperCase()}${Math.floor(1000 + Math.random() * 9000)}`;
            setUsername(generatedUsername);
            setPassword(generatedPassword);
        }
    };

    useEffect(() => {
        generateCredentials(nomecole);
    }, [nomecole]);

    useEffect(() => {
        const fetchUser = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                console.error('Aucun token trouvé. Veuillez vous connecter.');
                return;
            }

            try {
                const response = await axios.get('http://localhost:5000/getMe', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setUserId(response.data.userId);
                setEcoleId(response.data.ecoleId);
            } catch (error) {
                console.error('Erreur lors de la récupération des informations de l\'utilisateur:', error);
            }
        };

        fetchUser();
    }, []);

    useEffect(() => {
        const storedEcoleId = localStorage.getItem('ecoleId');
        if (storedEcoleId) {
            setEcoleId(storedEcoleId);
        }
    }, []);

    const formatPermissions = (permissions) => {
        const formattedPermissions = [];

        for (const gestion in permissions) {
            for (const key in permissions[gestion]) {
                if (key === 'Voir' || key === 'Ajouter' || key === 'Modifier' || key === 'Supprimer') {
                    if (permissions[gestion][key]) {
                        formattedPermissions.push(`${gestion}-${key}`);
                    }
                } else {
                    for (const action in permissions[gestion][key]) {
                        if (permissions[gestion][key][action]) {
                            formattedPermissions.push(`${gestion}-${key}-${action}`);
                        }
                    }
                }
            }
        }

        return formattedPermissions;
    };

    const resetForm = () => {
        setNomecole('');
        setNomArecole('');
        setAdresse('');
        setEmailecole('');
        setTelephoneecole('');
        setFix('');
        setCycle('');
        setMaps('');
        setFacebook('');
        setInsta('');
        setLinkdin('');
        setRib('');
        setNif('');
        setRc('');
        setUsername('');
        setPassword('');
        setNom('');
        setPrenom('');
        setEmail('');
        setTelephone('');
        setPolygonCoords([]);
        setId(null);
    };

    const handleShowModal = () => setShowModal(true);
    const toggleMapType = () => setMapType(mapType === 'default' ? 'satellite' : 'default');
    const handleDrawCreate = (e) => {
        const { layerType, layer } = e;
        if (layerType === 'polygon') {
            const coords = layer.getLatLngs()[0].map(latlng => [latlng.lat, latlng.lng]);
            setPolygonCoords(coords);
            setMaps(JSON.stringify(coords));
        }
    };
    const handleCloseModal = () => setShowModal(false);
    const handleClosePermissionsModal = () => {
        setSelectedPermissions(permissions); // Réinitialiser selectedPermissions
        setShowPermissionsModal(false); // Fermer la modal
    };
    useEffect(() => {
        if (!showPermissionsModal) {
            setPermissions({ ...selectedPermissions }); // Mise à jour forcée
        }
    }, [showPermissionsModal]);


    const fetchUserPermissions = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            console.error('Aucun token trouvé. Veuillez vous connecter.');
            return;
        }

        try {
            const decodedToken = jwtDecode(token);
            const userId = decodedToken.userId;
            const roleId = decodedToken.roleIds[0];

            if (!userId || !roleId) {
                throw new Error('userId ou roleId non trouvé dans le token.');
            }

            const response = await axios.get(`http://localhost:5000/apii/users/permissions/${userId}/${roleId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            const formattedPermissions = {};
            response.data.permissionNames.forEach(permission => {
                const parts = permission.split('-');
                const gestion = parts[0];
                const sousGestion = parts.length > 2 ? parts[1] : null;
                const action = parts.length > 2 ? parts[2] : parts[1];

                if (!formattedPermissions[gestion]) {
                    formattedPermissions[gestion] = {};
                }

                if (sousGestion) {
                    if (!formattedPermissions[gestion][sousGestion]) {
                        formattedPermissions[gestion][sousGestion] = {};
                    }
                    formattedPermissions[gestion][sousGestion][action] = true;
                } else {
                    formattedPermissions[gestion][action] = true;
                }
            });

            // Ne réinitialiser selectedPermissions que s'il n'a pas encore été modifié
            if (Object.keys(selectedPermissions).length === 0) {
                setSelectedPermissions(formattedPermissions);
            }

            setPermissions(formattedPermissions); // Mettre à jour les permissions globales
            setShowPermissionsModal(true); // Ouvrir la modal
        } catch (error) {
            console.error('Erreur lors de la récupération des permissions:', error);
            alert('Erreur lors de la récupération des permissions.');
        }
    };
    // const handleSavePermissions = () => {
    //     setPermissions(selectedPermissions); // Mettre à jour l'état global avec les permissions sélectionnées
    //     console.log('Permissions sauvegardées:', selectedPermissions); // Vérifier les permissions sauvegardées
    //     handleClosePermissionsModal(); // Fermer la modal
    // };
    const handleSavePermissions = () => {
        // Créer une copie profonde des permissions sélectionnées
        const deepCopy = JSON.parse(JSON.stringify(selectedPermissions));
        setPermissions(deepCopy);
        handleClosePermissionsModal();
    };
    const handleAddEcole = async (e) => {
        e.preventDefault();
    
        const token = localStorage.getItem('token');
        if (!token) {
            console.error('Aucun token trouvé. Veuillez vous connecter.');
            return;
        }
    
        // Formater les permissions
        const formattedPermissions = [];
        for (const gestion in permissions) {
            for (const key in permissions[gestion]) {
                if (['Voir', 'Ajouter', 'Modifier', 'Supprimer'].includes(key)) {
                    if (permissions[gestion][key]) {
                        formattedPermissions.push(`${gestion}-${key}`);
                    }
                } else {
                    // Sous-gestion
                    for (const action in permissions[gestion][key]) {
                        if (permissions[gestion][key][action]) {
                            formattedPermissions.push(`${gestion}-${key}-${action}`);
                        }
                    }
                }
            }
        }
    
        const formData = {
            nomecole,
            nom_arecole,
            adresse,
            emailecole,
            telephoneecole,
            fix,
            cycle,
            maps,
            facebook,
            insta,
            linkdin,
            rc,
            rib,
            nif,
            nom,
            prenom,
            email,
            telephone,
            username,
            password,
            ecoleId,
            permissions: formattedPermissions,
        };
    
        try {
            let response;
            if (id) {
                // Modification
                response = await axios.put(`http://localhost:5000/ecoles/${id}`, formData, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
            } else {
                // Ajout
                response = await axios.post('http://localhost:5000/ecoles', formData, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
            }
    
            console.log('Opération réussie:', response.data);
            resetForm();
            navigate('/ecoles'); // Rediriger vers la liste des écoles
        } catch (error) {
            console.error('Erreur:', error);
            if (error.response) {
                console.error('Réponse du serveur:', error.response.data);
                alert(`Erreur: ${error.response.data.message || 'Une erreur est survenue'}`);
            } else {
                alert('Une erreur est survenue lors de la connexion au serveur');
            }
        }
    };

    const handlePermissionChange = (gestion, sousGestion, action, checked) => {
        setSelectedPermissions(prevPermissions => {
            const newPermissions = { ...prevPermissions };

            if (sousGestion) {
                if (!newPermissions[gestion]) newPermissions[gestion] = {};
                if (!newPermissions[gestion][sousGestion]) newPermissions[gestion][sousGestion] = {};
                newPermissions[gestion][sousGestion][action] = checked;
            } else {
                if (!newPermissions[gestion]) newPermissions[gestion] = {};
                newPermissions[gestion][action] = checked;
            }

            return newPermissions;
        });
    };

    useEffect(() => {
        if (ecole) {
            setNomecole(ecole.nomecole || '');
            setNomArecole(ecole.nom_arecole || '');
            setAdresse(ecole.adresse || '');
            setEmailecole(ecole.emailecole || '');
            setTelephoneecole(ecole.telephoneecole || '');
            setFix(ecole.fix || '');
            setCycle(ecole.cycle || '');
            setMaps(ecole.maps || '');
            setFacebook(ecole.facebook || '');
            setInsta(ecole.insta || '');
            setLinkdin(ecole.linkdin || '');
            setRib(ecole.rib || '');
            setNif(ecole.nif || '');
            setRc(ecole.rc || '');

            // Coordonnées de la carte
            if (ecole.maps && ecole.maps.trim() !== '') {
                setPolygonCoords(JSON.parse(ecole.maps));
            }

            // Informations du compte - check if Users array exists and has at least one user
            const user = ecole.Users && ecole.Users.length > 0 ? ecole.Users[0] : null;
            setNom(user?.nom || '');
            setPrenom(user?.prenom || '');
            setEmail(user?.email || '');
            setTelephone(user?.telephone || '');
            setUsername(user?.username || '');
            setId(ecole.id || null);

            // Permissions
            if (ecole.permissions) {
                setPermissions(ecole.permissions);
                setSelectedPermissions(ecole.permissions);
            }
        }
    }, [ecole]);


    return (
        <>
            <nav>
                <Link to="/home" className="text-primary">Accueil</Link>
                <span> / </span>
                <Link to="/ecole" className="text-primary">Gestion des Écoles</Link>
                <span> / </span>
                <span>{id ? 'Modifier une école' : 'Ajouter une école'}</span>
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
                    <form onSubmit={handleAddEcole}>
                        <input
                            type="hidden"
                            className="form-control"
                            value={ecoleId || ''}
                            readOnly
                        />
                        {/* Informations de l'école */}
                        <div className='card mb-3'>
                            <div className='card-header d-flex align-items-center'>
                                <img src={school} width={50} className='p-2' />
                                <h5>Informations de l'École</h5>
                            </div>
                            <div className='card-body'>
                                <div className='row'>
                                    <div className="col-md-4">
                                        <label htmlFor="nomecole" className="form-label">Nom</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="nomecole"
                                            value={nomecole}
                                            onChange={(e) => setNomecole(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="col-md-4">
                                        <label htmlFor="nom_arecole" className="form-label">Nom (Arabe)</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="nom_arecole"
                                            value={nom_arecole}
                                            onChange={(e) => setNomArecole(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="col-md-4">
                                        <label htmlFor="adresse" className="form-label">Adresse</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="adresse"
                                            value={adresse}
                                            onChange={(e) => setAdresse(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className='row'>
                                    <div className="col-md-4">
                                        <label htmlFor="emailecole" className="form-label">Email</label>
                                        <input
                                            type="email"
                                            className="form-control"
                                            id="emailecole"
                                            value={emailecole}
                                            onChange={(e) => setEmailecole(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="col-md-4">
                                        <label htmlFor="telephoneecole" className="form-label">Téléphone</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="telephoneecole"
                                            value={telephoneecole}
                                            onChange={(e) => setTelephoneecole(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="col-md-4">
                                        <label htmlFor="fix" className="form-label">Fix</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="fix"
                                            value={fix}
                                            onChange={(e) => setFix(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className='row'>
                                    <div className="col-md-4">
                                        <label htmlFor="maps" className="form-label">Coordonnées</label>
                                        <input type="text" className="form-control" id="maps" value={maps} readOnly />
                                    </div>
                                    <div className="col-md-4">
                                        <button type="button" className="btn btn-primary m-4" onClick={handleShowModal}>
                                            <img src={map} width={40} className='p-2' />
                                            Sélectionner une carte
                                        </button>
                                    </div>
                                    <div className='col-md-4'>
                                        <label htmlFor="cycle" className="form-label">Cycle Scolaire</label> <br />
                                        <select className="form-control" id="cycle" value={cycle} onChange={(e) => setCycle(e.target.value)}>
                                            <option value="">Sélectionnez le cycle</option>
                                            <option value="Primaire">Primaire</option>
                                            <option value="CEM">CEM</option>
                                            <option value="Lycée">Lycée</option>
                                        </select>
                                    </div>

                                </div>
                            </div>
                        </div>

                        {/* Réseaux sociaux */}
                        <div className='card mb-3'>
                            <div className='card-header d-flex align-items-center'>
                                <img src={socialmedia} width={50} className='p-2' />
                                <h5>Réseaux Sociaux</h5>
                            </div>
                            <div className='card-body'>
                                <div className='row'>
                                    <div className="col-md-4">
                                        <label htmlFor="facebook" className="form-label">Facebook</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="facebook"
                                            value={facebook}
                                            onChange={(e) => setFacebook(e.target.value)}
                                        />
                                    </div>
                                    <div className="col-md-4">
                                        <label htmlFor="insta" className="form-label">Instagram</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="insta"
                                            value={insta}
                                            onChange={(e) => setInsta(e.target.value)}
                                        />
                                    </div>
                                    <div className="col-md-4">
                                        <label htmlFor="linkdin" className="form-label">LinkedIn</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="linkdin"
                                            value={linkdin}
                                            onChange={(e) => setLinkdin(e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Informations fiscales */}
                        <div className='card mb-3'>
                            <div className='card-header d-flex align-items-center'>
                                <AiOutlineFile size={30} className='mr-2' />
                                <h5>Informations Fiscales</h5>
                            </div>
                            <div className='card-body'>
                                <div className='row'>
                                    <div className="col-md-4">
                                        <label htmlFor="rib" className="form-label">RIB</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="rib"
                                            value={rib}
                                            onChange={(e) => setRib(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="col-md-4">
                                        <label htmlFor="nif" className="form-label">NIF</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="nif"
                                            value={nif}
                                            onChange={(e) => setNif(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="col-md-4">
                                        <label htmlFor="rc" className="form-label">RC</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="rc"
                                            value={rc}
                                            onChange={(e) => setRc(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Informations de compte */}
                        <div className='card mb-3'>
                            <div className='card-header d-flex align-items-center'>
                                <img src={user} width={50} className='p-2' />
                                <h5>Informations de Compte</h5>
                            </div>
                            <div className='card-body'>
                                <div className='row'>
                                    <div className="col-md-4">
                                        <label htmlFor="nom" className="form-label">Nom</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="nom"
                                            value={nom}
                                            onChange={(e) => setNom(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="col-md-4">
                                        <label htmlFor="prenom" className="form-label">Prénom</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="prenom"
                                            value={prenom}
                                            onChange={(e) => setPrenom(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="col-md-4">
                                        <label htmlFor="email" className="form-label">Email</label>
                                        <input
                                            type="email"
                                            className="form-control"
                                            id="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className='row'>
                                    <div className="col-md-3">
                                        <label htmlFor="telephone" className="form-label">Téléphone</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="telephone"
                                            value={telephone}
                                            onChange={(e) => setTelephone(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="col-md-3">
                                        <label htmlFor="username" className="form-label">Username</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="username"
                                            value={username}
                                            onChange={(e) => setUsername(e.target.value)}
                                        />
                                    </div>
                                    <div className="col-md-3">
                                        <label htmlFor="password" className="form-label">Password</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                        />
                                    </div>

                                    <div className='col-md-3'>
                                        <button type="button" style={{ marginTop: "40px" }} className="btn btn-info" onClick={fetchUserPermissions}>
                                            Gérer les permission
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <button type="submit" className="btn btn-success">{id ? 'Modifier École' : 'Ajouter École'}</button>
                    </form>
                </div>
            </div>

            {/* Modal pour la sélection de la carte */}
            {showModal && (
                <div className="modal" style={{ display: 'block' }}>
                    <div className="modal-content">
                        <span className="close" onClick={handleCloseModal}>&times;</span>
                        <h2>Sélectionner une zone sur la carte</h2>
                        <button className="btn btn-secondary mb-2" onClick={toggleMapType}>
                            Basculer en {mapType === 'default' ? 'Satellite' : 'Carte par défaut'}
                        </button>
                        <MapContainer center={[28.0339, 1.6596]} zoom={6} style={{ height: '400px', width: '100%' }}>
                            {mapType === 'default' ? (
                                <TileLayer
                                    url="https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}"
                                    attribution='&copy; Google Maps'
                                />
                            ) : (
                                <TileLayer
                                    url="https://mt1.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}"
                                    attribution='&copy; Google Maps'
                                />
                            )}
                            <FeatureGroup>
                                <EditControl
                                    position='topright'
                                    onCreated={handleDrawCreate}
                                    draw={{
                                        rectangle: false,
                                        polygon: true,
                                        circle: false,
                                        marker: false,
                                        polyline: false,
                                        circlemarker: false,
                                    }}
                                />
                            </FeatureGroup>
                            {polygonCoords.length > 0 && <Polygon positions={polygonCoords} color="blue" />}
                        </MapContainer>
                        {maps && <div className="coordinates">Coordonnées: {maps}</div>}
                        <button className="btn btn-success" onClick={handleCloseModal}>Valider</button>
                    </div>
                </div>
            )}
            <Modal show={showPermissionsModal} onHide={handleClosePermissionsModal} size="lg">
                <Modal.Header closeButton className="custom-modal-header">
                    <Modal.Title>Gestion des Privilèges</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>Gestion</th>
                                <th>Select All</th>
                                <th>Ajouter</th>
                                <th>Modifier</th>
                                <th>Supprimer</th>
                                <th>Voir</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Object.keys(selectedPermissions).map(gestion => (
                                <React.Fragment key={gestion}>
                                    <tr>
                                        <td onClick={() => handleToggleGestion(gestion)} style={{ cursor: 'pointer' }}>
                                            {gestion} {expandedGestion === gestion ? <FaChevronUp /> : <FaChevronDown />}
                                        </td>
                                        <td>
                                            <Form.Check
                                                type="checkbox"
                                                checked={
                                                    sousGestions[gestion] &&
                                                    sousGestions[gestion].every(sousGestion =>
                                                        selectedPermissions[gestion]?.[sousGestion]?.Ajouter &&
                                                        selectedPermissions[gestion]?.[sousGestion]?.Modifier &&
                                                        selectedPermissions[gestion]?.[sousGestion]?.Supprimer &&
                                                        selectedPermissions[gestion]?.[sousGestion]?.Voir
                                                    )
                                                }
                                                onChange={(e) => {
                                                    const isChecked = e.target.checked;
                                                    if (sousGestions[gestion]) {
                                                        sousGestions[gestion].forEach(sousGestion => {
                                                            ['Ajouter', 'Modifier', 'Supprimer', 'Voir'].forEach(action => {
                                                                handlePermissionChange(gestion, sousGestion, action, isChecked);
                                                            });
                                                        });
                                                    }
                                                }}
                                                disabled={!sousGestions[gestion] || sousGestions[gestion].length === 0}
                                            />
                                        </td>
                                        <td>
                                            <Form.Check
                                                type="checkbox"
                                                checked={selectedPermissions[gestion]?.Ajouter || false}
                                                onChange={(e) => handlePermissionChange(gestion, null, 'Ajouter', e.target.checked)}
                                                disabled
                                            />
                                        </td>
                                        <td>
                                            <Form.Check
                                                type="checkbox"
                                                checked={selectedPermissions[gestion]?.Modifier || false}
                                                onChange={(e) => handlePermissionChange(gestion, null, 'Modifier', e.target.checked)}
                                                disabled
                                            />
                                        </td>
                                        <td>
                                            <Form.Check
                                                type="checkbox"
                                                checked={selectedPermissions[gestion]?.Supprimer || false}
                                                onChange={(e) => handlePermissionChange(gestion, null, 'Supprimer', e.target.checked)}
                                                disabled
                                            />
                                        </td>
                                        <td>
                                            <Form.Check
                                                type="checkbox"
                                                checked={selectedPermissions[gestion]?.Voir || false}
                                                onChange={(e) => handlePermissionChange(gestion, null, 'Voir', e.target.checked)}
                                            />
                                        </td>
                                    </tr>
                                    {expandedGestion === gestion && Object.keys(selectedPermissions[gestion]).map(sousGestion => {
                                        if (sousGestion !== 'Ajouter' && sousGestion !== 'Modifier' && sousGestion !== 'Supprimer' && sousGestion !== 'Voir') {
                                            return (
                                                <tr key={sousGestion}>
                                                    <td style={{ paddingLeft: '30px' }}>{sousGestion}</td>
                                                    <td>
                                                        <Form.Check
                                                            type="checkbox"
                                                            checked={
                                                                selectedPermissions[gestion]?.[sousGestion]?.Ajouter &&
                                                                selectedPermissions[gestion]?.[sousGestion]?.Modifier &&
                                                                selectedPermissions[gestion]?.[sousGestion]?.Supprimer &&
                                                                selectedPermissions[gestion]?.[sousGestion]?.Voir
                                                            }
                                                            onChange={(e) => {
                                                                const isChecked = e.target.checked;
                                                                ['Ajouter', 'Modifier', 'Supprimer', 'Voir'].forEach(action => {
                                                                    handlePermissionChange(gestion, sousGestion, action, isChecked);
                                                                });
                                                            }}
                                                        />
                                                    </td>
                                                    <td>
                                                        <Form.Check
                                                            type="checkbox"
                                                            checked={selectedPermissions[gestion]?.[sousGestion]?.Ajouter || false}
                                                            onChange={(e) => handlePermissionChange(gestion, sousGestion, 'Ajouter', e.target.checked)}
                                                        />
                                                    </td>
                                                    <td>
                                                        <Form.Check
                                                            type="checkbox"
                                                            checked={selectedPermissions[gestion]?.[sousGestion]?.Modifier || false}
                                                            onChange={(e) => handlePermissionChange(gestion, sousGestion, 'Modifier', e.target.checked)}
                                                        />
                                                    </td>
                                                    <td>
                                                        <Form.Check
                                                            type="checkbox"
                                                            checked={selectedPermissions[gestion]?.[sousGestion]?.Supprimer || false}
                                                            onChange={(e) => handlePermissionChange(gestion, sousGestion, 'Supprimer', e.target.checked)}
                                                        />
                                                    </td>
                                                    <td>
                                                        <Form.Check
                                                            type="checkbox"
                                                            checked={selectedPermissions[gestion]?.[sousGestion]?.Voir || false}
                                                            onChange={(e) => handlePermissionChange(gestion, sousGestion, 'Voir', e.target.checked)}
                                                        />
                                                    </td>
                                                </tr>
                                            );
                                        }
                                        return null;
                                    })}
                                </React.Fragment>
                            ))}
                        </tbody>
                    </Table>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClosePermissionsModal}>
                        Fermer
                    </Button>
                    <Button variant="primary" onClick={handleSavePermissions}>
                        Enregistrer
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default AjoutEcole;
