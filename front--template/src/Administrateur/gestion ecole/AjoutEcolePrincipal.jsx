import React, { useState, useEffect, useRef } from 'react'; // Ajoutez useRef ici
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AiOutlineFile } from 'react-icons/ai';
import scool from '../../assets/imgs/school.png';
import map from '../../assets/imgs/map.png';
import users from '../../assets/imgs/user.png';
import school from '../../assets/imgs/school (1).png';
import socialmedia from '../../assets/imgs/social-media.png';
import { MapContainer, TileLayer, Polygon, FeatureGroup } from 'react-leaflet';
import { EditControl } from 'react-leaflet-draw';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';
import { Marker, Popup } from 'react-leaflet';
import axios from 'axios';

const AjoutEcole = () => {
    const [values, setValues] = useState({}); // Initialiser comme un objet vide
    const location = useLocation();
    const navigate = useNavigate();
    const { ecole } = location.state || {}; // Récupérer l'école à modifier
    const isEditMode = !!ecole;
    const [coordinates, setCoordinates] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [nomecole, setNomecole] = useState(ecole ? ecole.nomecole : ''); // Utiliser nomecole
    const [nom_arecole, setNomArecole] = useState(ecole ? ecole.nom_arecole : ''); // Utiliser nom_arecole
    const [adresse, setAdresse] = useState(ecole ? ecole.adresse : '');
    const [emailecole, setEmailecole] = useState(ecole ? ecole.emailecole : ''); // Utiliser emailecole
    const [telephoneecole, setTelephoneecole] = useState(ecole ? ecole.telephoneecole : ''); // Utiliser telephoneecole
    const [fix, setFix] = useState(ecole ? ecole.fix : '');
    const [maps, setMaps] = useState(ecole ? ecole.maps : '');
    const [facebook, setFacebook] = useState(ecole ? ecole.facebook : '');
    const [insta, setInsta] = useState(ecole ? ecole.insta : '');
    const [linkdin, setLinkdin] = useState(ecole ? ecole.linkdin : '');
    const [rib, setRib] = useState(ecole ? ecole.rib : '');
    const [nif, setNif] = useState(ecole ? ecole.nif : '');
    const [rc, setRc] = useState(ecole ? ecole.rc : '');
    const [polygonCoords, setPolygonCoords] = useState(ecole ? JSON.parse(ecole.maps) : []);
    const [mapType, setMapType] = useState('default');
    const [id, setId] = useState(ecole ? ecole.id : null);
    const [logo, setLogo] = useState(null);
    const [username, setUsername] = useState(ecole ? ecole.username : '');
    const [password, setPassword] = useState(ecole ? ecole.password : '');
    const [nom, setNom] = useState(ecole ? ecole.nom : '');
    const [prenom, setPrenom] = useState(ecole ? ecole.prenom : '');
    const [email, setEmail] = useState(ecole ? ecole.email : '');
    const [telephone, setTelephone] = useState(ecole ? ecole.telephone : '');
    const [markerPosition, setMarkerPosition] = useState(null);
    const mapRef = useRef(null);
    const [user, setUser] = useState(null); // Ajoutez un état pour l'utilisateur associé
    const [showPassword, setShowPassword] = useState(false); // Pour afficher/masquer le mot de passe
    const [numerodagrimo, setNumerodagrimo] = useState(ecole ? ecole.numerodagrimo : '');
    const [dateFinDagrimo, setDateFinDagrimo] = useState(ecole ? ecole.dateFinDagrimo : '');


    // Fonction pour générer le username et le password
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

    // Effet pour générer les credentials lorsque le nom de l'école change
    useEffect(() => {
        generateCredentials(nomecole);
    }, [nomecole]);


    const fetchUserByEcoleId = async (ecoleId) => {
        try {
            const response = await axios.get(`http://localhost:5000/ecole/user/${ecoleId}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });

            // Affichez la réponse pour voir sa structure
            console.log('Réponse utilisateur:', response.data);

            // Stockez directement l'objet utilisateur
            setUser(response.data);
        } catch (error) {
            console.error('Erreur lors de la récupération de l\'utilisateur :', error);
        }
    };

    // Effet pour récupérer l'utilisateur associé lors de la modification
    useEffect(() => {
        if (isEditMode && ecole.id) {
            fetchUserByEcoleId(ecole.id); // Récupérer l'utilisateur associé à l'école
        }
    }, [isEditMode, ecole]);
    // Fonction pour ajouter une école
    const handleAddEcole = async (e) => {
        e.preventDefault();

        const token = localStorage.getItem('token');
        if (!token) {
            console.error('Aucun token trouvé. Veuillez vous connecter.');
            return;
        }

        const formData = new FormData();
        formData.append('nomecole', nomecole);
        formData.append('nom_arecole', nom_arecole);
        formData.append('adresse', adresse);
        formData.append('emailecole', emailecole);
        formData.append('telephoneecole', telephoneecole);
        formData.append('fix', fix);
        formData.append('maps', maps);
        formData.append('rc', rc);
        formData.append('rib', rib);
        formData.append('nif', nif);
        formData.append('username', username);
        formData.append('password', password);
        formData.append('nom', nom);
        formData.append('prenom', prenom);
        formData.append('email', email);
        formData.append('telephone', telephone);
        formData.append('facebook', facebook);
        formData.append('insta', insta);
        formData.append('linkdin', linkdin);
        formData.append('numerodagrimo', numerodagrimo);
        formData.append('dateFinDagrimo', dateFinDagrimo);
        if (logo) {
            formData.append('logo', logo);
        }

        try {
            let response;
            if (isEditMode) {
                // En mode modification, utilisez une requête PUT
                console.log('ID de l\'école à modifier :', ecole.id); // Ajoutez ce log
                response = await axios.put(`http://localhost:5000/ecole/${ecole.id}`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        Authorization: `Bearer ${token}`,
                    },
                });
            } else {
                // En mode ajout, utilisez une requête POST
                response = await axios.post('http://localhost:5000/ecole', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        Authorization: `Bearer ${token}`,
                    },
                });
            }
            console.log('École sauvegardée avec succès:', response.data);
            navigate('/ecole'); // Rediriger vers la liste des écoles
            resetForm();
        } catch (error) {
            console.error('Erreur lors de l\'ajout de l\'école:', error);
            if (error.response) {
                console.error('Réponse du serveur:', error.response.data);
            }
        }
    };

    // Fonction pour réinitialiser le formulaire
    const resetForm = () => {
        setNomecole('');
        setNomArecole('');
        setAdresse('');
        setEmailecole('');
        setTelephoneecole('');
        setFix('');
        setMaps('');
        setFacebook('');
        setLinkedin('');
        setInstagram('');
        setRib('');
        setNif('');
        setRc('');
        setLogo(null);
        setUsername('');
        setPassword('');
        setNom('');
        setPrenom('');
        setEmail('');
        setTelephone('');
        setPolygonCoords([]);
        setId(null);
    };

    // Fonctions pour gérer la carte
    const handleShowModal = () => setShowModal(true);
    const handleCloseModal = () => setShowModal(false);
    const toggleMapType = () => setMapType(mapType === 'default' ? 'satellite' : 'default');
    const handleDrawCreate = (e) => {
        const { layerType, layer } = e;
        if (layerType === 'polygon') {
            const coords = layer.getLatLngs()[0].map(latlng => [latlng.lat, latlng.lng]);
            setPolygonCoords(coords);
            setMaps(JSON.stringify(coords));
        }
    };
    useEffect(() => {
        if (coordinates) {
            const [lat, lng] = coordinates.split(',').map(Number);
            if (!isNaN(lat) && !isNaN(lng)) {
                const newCenter = [lat, lng];
                if (mapRef.current) {
                    mapRef.current.setView(newCenter, 13); // 13 est le niveau de zoom
                }
            }
        }
    }, [coordinates]);
    const handleChange = (e) => {
        const { name, value, type } = e.target;
        if (type === "file") {
            const logo = e.target.files[0]; // Récupérer le fichier
            setValues((prevValues) => ({ ...prevValues, [name]: logo })); // Mettre à jour l'état immuablement
        } else {
            setValues((prevValues) => ({ ...prevValues, [name]: value })); // Mettre à jour l'état immuablement
        }
    };
    useEffect(() => {
        if (user) {
            setNom(user.nom || '');
            setPrenom(user.prenom || '');
            setEmail(user.email || '');
            setTelephone(user.telephone || '');
            setUsername(user.username || '');
            // Ne mettez pas à jour le mot de passe ici pour des raisons de sécurité
        }
    }, [user]);
    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setLogo(e.target.files[0]); // Stockez directement le fichier
            setValues(prev => ({ ...prev, logo: e.target.files[0].name })); // Pour afficher le nom
        }
    };
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
                                        <label htmlFor="numerodagrimo" className="form-label">Numéro D'agriment</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="numerodagrimo"
                                            value={numerodagrimo}
                                            onChange={(e) => setNumerodagrimo(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="col-md-4">
                                        <label htmlFor="dateFinDagrimo" className="form-label">Date Fin D'agrément</label>
                                        <input
                                            type="date"
                                            className="form-control"
                                            id="dateFinDagrimo"
                                            value={dateFinDagrimo ? dateFinDagrimo.split('T')[0] : ''}
                                            onChange={(e) => setDateFinDagrimo(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="col-md-4">
                                        <label htmlFor="logo" className="form-label">Logo</label>
                                        <input
                                            type="file"
                                            className="form-control"
                                            id="logo"
                                            onChange={handleFileChange}// Utiliser handleChange pour gérer le fichier
                                            required
                                        />
                                        {values.logo && <span>{values.logo.name}</span>} {/* Afficher le nom du fichier si disponible */}
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

                                </div>
                            </div>
                        </div>

                        {/* Réseaux sociaux */}
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
                        {/* Informations de compte */}
                        <div className='card mb-3'>
                            <div className='card-header d-flex align-items-center'>
                                <img src={users} width={50} className='p-2' />
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
                                            value={nom || ''}
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
                                            value={prenom || ''}
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
                                            value={email || ''}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className='row'>
                                    <div className="col-md-4">
                                        <label htmlFor="telephone" className="form-label">Téléphone</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="telephone"
                                            value={telephone || ''}
                                            onChange={(e) => setTelephone(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="col-md-4">
                                        <label htmlFor="username" className="form-label">Username</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="username"
                                            value={username || ''}
                                            onChange={(e) => setUsername(e.target.value)}
                                        />
                                    </div>
                                    <div className="col-md-4">
                                        <label htmlFor="password" className="form-label">Password</label>
                                        <div className="d-flex align-items-center">
                                            <input
                                                type={showPassword ? "text" : "password"}
                                                className="form-control"
                                                id="password"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                            />
                                            <button
                                                type="button"
                                                className="btn btn-outline-secondary ms-2"
                                                onClick={() => setShowPassword(!showPassword)}
                                            >
                                                <i className={`bi bi-eye${showPassword ? "-slash" : ""}`}></i>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <button className='btn bt-primary' style={{ backgroundColor: 'blue', color: 'white' }} type="submit">{isEditMode ? 'Modifier École' : 'Ajouter École'}</button>
                    </form>
                </div>
            </div>

            {/* Modal pour la sélection de la carte */}
            {showModal && (
                <div className="modal" style={{ display: 'block' }}>
                    <div className="modal-content">
                        <span className="close" onClick={handleCloseModal}>&times;</span>
                        <h2>Sélectionner une zone sur la carte</h2>

                        {/* Champ unique pour les coordonnées */}
                        <div className="mb-3">
                            <label htmlFor="coordinates" className="form-label">Coordonnées (latitude,longitude)</label>
                            <input
                                type="text"
                                className="form-control"
                                id="coordinates"
                                placeholder="Exemple: 28.0339,1.6596"
                                value={coordinates}
                                onChange={(e) => setCoordinates(e.target.value)}
                            />
                        </div>
                        <button
                            className="btn btn-primary mb-2"
                            onClick={() => {
                                const [lat, lng] = coordinates.split(',').map(Number);
                                if (!isNaN(lat) && !isNaN(lng)) {
                                    const newCenter = [lat, lng];
                                    setMarkerPosition(newCenter); // Mettre à jour la position du marqueur
                                    if (mapRef.current) {
                                        mapRef.current.setView(newCenter, 13); // Centrer la carte sur la nouvelle position
                                    }
                                } else {
                                    alert("Veuillez entrer des coordonnées valides (exemple: 28.0339,1.6596)");
                                }
                            }}
                        >
                            Centrer sur les coordonnées
                        </button>
                        <button className="btn btn-secondary mb-2" onClick={toggleMapType}>
                            Basculer en {mapType === 'default' ? 'Satellite' : 'Carte par défaut'}
                        </button>

                        <MapContainer
                            center={[28.0339, 1.6596]}
                            zoom={6}
                            style={{ height: '300px', width: '100%' }}
                            whenCreated={mapInstance => mapRef.current = mapInstance}
                        >
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
                            {markerPosition && ( // Afficher le marqueur si markerPosition est défini
                                <Marker position={markerPosition}>
                                    <Popup>
                                        Position sélectionnée : <br />
                                        Latitude: {markerPosition[0]}, Longitude: {markerPosition[1]}
                                    </Popup>
                                </Marker>
                            )}
                        </MapContainer>
                        {maps && <div className="coordinates">Coordonnées: {maps}</div>}
                        <button className="btn btn-success " onClick={handleCloseModal}>Valider</button>
                    </div>
                </div>
            )}
        </>
    );
};

export default AjoutEcole;