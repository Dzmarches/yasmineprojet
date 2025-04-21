import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import privilegeImg from '../../assets/imgs/safety.png';
import { Table, Form, Button, Modal } from 'react-bootstrap';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { FaMapMarkerAlt } from "react-icons/fa";

const Privilege = () => {
    const navigate = useNavigate();
    const [usersWithEcole, setUsersWithEcole] = useState([]);
    const [usersWithoutEcole, setUsersWithoutEcole] = useState([]);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [expandedGestion, setExpandedGestion] = useState(null);
    const [permissions, setPermissions] = useState({});

    const sousGestions = {
        "Administration": ["Gestion élève", "Gestion parents", "Gestion enseignant", "Gestion privilège"],
        "Academique": ["Trimestre", "Salle", "Niveaux", "Matière", "Sections", "Gestion emploi de temps"],
        "Gestion Evaluation & bulletin": [],
        "Ressources Humaines": ["Gestion des employées", "Gestion demande de congé",
            "Gestion de mes demande de congé", "Gestion pointage", "Gestion de mes pointage",
            "gestion attestation", "rapports pointage", "gestion de la paye"],
        "Comptabilité": [],
        "Cantine scolaire": [],
        "Bibliothèque": [],
        "Transport": ["Suivi les bus"],
        "Elearning": [],
        "Statistique": [],
        "Communication": ["Gestion des annonces", "Envoi de notifications", "Messagerie interne", "Envoie d'email"],
        "Parametre": ["Gestion écoles"],
    };

    // Ouvrir/fermer les sous-gestions
    const handleToggleGestion = (gestion) => {
        setExpandedGestion(expandedGestion === gestion ? null : gestion);
    };

    // Mise à jour des permissions.
    // Pour la ligne principale (sousGestion === null), seule l'action "Voir" est interactive.
    // Pour les sous-gestions, on met à jour normalement.
    // De plus, si on décoche "Voir" dans une sous-gestion et qu'aucune autre sous-gestion n'a "Voir" true,
    // on décoche la case principale "Voir" de la gestion.
    const handlePermissionChange = (gestion, sousGestion, action, value) => {
        if (sousGestion === null) {
            // Modification de la ligne principale.
            setPermissions(prevPermissions => ({
                ...prevPermissions,
                [gestion]: {
                    ...prevPermissions[gestion],
                    [action]: value,
                },
            }));
        } else {
            setPermissions(prevPermissions => {
                // Mise à jour de la sous-gestion
                const updatedSub = {
                    ...prevPermissions[gestion]?.[sousGestion],
                    [action]: value,
                };

                let updatedGestion = {
                    ...prevPermissions[gestion],
                    [sousGestion]: updatedSub,
                };

                if (action === 'Voir') {
                    if (value) {
                        // Si on coche "Voir" dans une sous-gestion, on force la case principale "Voir" à true.
                        updatedGestion['Voir'] = true;
                    } else {
                        // Si on décoche "Voir" dans une sous-gestion,
                        // vérifier si aucune sous-gestion de cette gestion n'a "Voir" cochée.
                        let anyVoir = false;
                        const subGestionNames = sousGestions[gestion] || [];
                        for (let subName of subGestionNames) {
                            // Pour la sous-gestion en cours, utiliser la valeur mise à jour.
                            if (subName === sousGestion) {
                                if (updatedSub['Voir']) {
                                    anyVoir = true;
                                    break;
                                }
                            } else if (
                                prevPermissions[gestion] &&
                                prevPermissions[gestion][subName] &&
                                prevPermissions[gestion][subName]['Voir']
                            ) {
                                anyVoir = true;
                                break;
                            }
                        }
                        updatedGestion['Voir'] = anyVoir;
                    }
                }

                return {
                    ...prevPermissions,
                    [gestion]: updatedGestion,
                };
            });
        }
    };

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    console.error('Aucun token trouvé. Veuillez vous connecter.');
                    return;
                }
                const response = await axios.get('http://localhost:5000/api/users-with-ecole', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setUsersWithEcole(response.data.usersWithEcole);
                setUsersWithoutEcole(response.data.usersWithoutEcole);
            } catch (error) {
                console.error('Erreur lors de la récupération des utilisateurs', error);
            }
        };
        fetchUsers();
    }, []);

    const handleSelectUser = (userId) => {
        setSelectedUsers(prevSelected =>
            prevSelected.includes(userId)
                ? prevSelected.filter(id => id !== userId)
                : [...prevSelected, userId]
        );
    };

    const handleSelectAll = (e) => {
        if (e.target.checked) {
            const allUserIds = [...usersWithEcole, ...usersWithoutEcole].map(user => user.id);
            setSelectedUsers(allUserIds);
        } else {
            setSelectedUsers([]);
        }
    };

    const handleActivatePrivileges = () => {
        navigate('/activate-privileges', { state: { selectedUsers } });
    };

    const handleOpenModal = async (user) => {
        try {
            const token = localStorage.getItem('token');

            // Récupération du roleId de l'utilisateur
            const roleResponse = await axios.get(`http://localhost:5000/api/user/${user.id}/role`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (roleResponse.status === 404) {
                alert('Cet utilisateur n\'a pas de rôle défini. Veuillez lui attribuer un rôle.');
                return;
            }

            const roleId = roleResponse.data.roleId;

            // Récupération des permissions de l'utilisateur
            const permissionsResponse = await axios.get(`http://localhost:5000/api/user/${user.id}/permissions`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            const userPermissions = permissionsResponse.data.permissions;

            // Formater les permissions pour les afficher dans la modal
            const formattedPermissions = {};
            userPermissions.forEach(permission => {
                const [gestion, sousGestion, action] = permission.name.split('-');
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

            // Mettre à jour l'état des permissions et ouvrir la modal
            setPermissions(formattedPermissions);
            setSelectedUser({ ...user, roleId });
            setShowModal(true);
        } catch (error) {
            console.error('Erreur lors de la récupération des données:', error);
            if (error.response && error.response.status === 404) {
                alert('Cet utilisateur n\'a pas de rôle ou de permissions définis.');
            } else {
                alert('Une erreur est survenue lors de la récupération des données.');
            }
        }
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    // Formatage des permissions avant envoi au back-end
    const handleSavePermissions = async () => {
        const token = localStorage.getItem('token');
        if (!selectedUser) {
            alert('Aucun utilisateur sélectionné');
            return;
        }
        try {
            const formattedPermissions = [];
            const mainActions = ['Ajouter', 'Modifier', 'Supprimer', 'Voir'];
            for (const gestion in permissions) {
                for (const key in permissions[gestion]) {
                    if (mainActions.includes(key)) {
                        // Permission de la ligne principale
                        if (permissions[gestion][key]) {
                            formattedPermissions.push({ permissionId: `${gestion}-${key}` });
                        }
                    } else {
                        // Permissions des sous-gestions
                        for (const action in permissions[gestion][key]) {
                            if (permissions[gestion][key][action]) {
                                formattedPermissions.push({ permissionId: `${gestion}-${key}-${action}` });
                            }
                        }
                    }
                }
            }

            if (!selectedUser.roleId) {
                alert('Le rôle de l\'utilisateur n\'est pas défini');
                return;
            }

            console.log('Données envoyées au backend:', {
                userId: selectedUser.id,
                roleId: selectedUser.roleId,
                permissions: formattedPermissions,
            });

            const response = await axios.post(
                'http://localhost:5000/api/save-permissions',
                {
                    userId: selectedUser.id,
                    roleId: selectedUser.roleId,
                    permissions: formattedPermissions,
                },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            console.log('Réponse du backend:', response.data);

            if (response.status === 200) {
                alert('Permissions enregistrées avec succès');
                setShowModal(false);
            } else {
                alert('Erreur lors de l\'enregistrement des permissions');
            }
        } catch (error) {
            console.error('Erreur lors de l\'enregistrement des permissions', error);
            alert('Une erreur est survenue lors de l\'enregistrement des permissions');
        }
    };

    return (
        <>
            <nav>
                <Link to="/home" className="text-primary">Accueil</Link>
                <span> / </span>
                <span>Gestion des Privilèges</span>
            </nav>
            <div className="card card-primary card-outline">
                <div className="card-header d-flex" style={{ backgroundColor: '#F8F8F8' }}>
                    <img src={privilegeImg} alt="" width="90px" />
                    <p className="card-title mt-5 ml-2 p-2 text-center"
                        style={{ width: '350px', borderRadius: '50px', border: '1px solid rgb(215, 214, 216)' }}>
                        Gestion des Privilèges
                    </p>
                </div>
                <div className="card-body">
                    <div className="d-flex align-items-center gap-3 mb-3">
                        <Button variant="primary" onClick={handleActivatePrivileges}>
                            Activer les Privilèges
                        </Button>
                    </div>
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>
                                    <input type="checkbox" onChange={handleSelectAll} />
                                </th>
                                <th>Nom École</th>
                                <th>Nom et Prénom</th>
                                <th>Dernière connexion <br /> @ip localisation</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {usersWithEcole && usersWithEcole.map(user => (
                                <tr key={user.id}>
                                    <td>
                                        <input type="checkbox"
                                            checked={selectedUsers.includes(user.id)}
                                            onChange={() => handleSelectUser(user.id)} />
                                    </td>
                                    <td>{user.EcolePrincipal ? user.EcolePrincipal.nomecole : 'Aucune école'}</td>
                                    <td>{user.nom} {user.prenom}</td>
                                    <td>{user.lastLogin} <br />{user.lastIp} <br />
                                        {/* Lien Google Maps */}
                                        {user.latitude && user.longitude ? (
                                            <a
                                                href={`https://www.google.com/maps?q=${user.latitude},${user.longitude}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                title="Voir sur Google Maps"
                                            >
                                                <FaMapMarkerAlt style={{ color: 'red', fontSize: '30px', cursor: 'pointer', border: '1px solid blue', backgroundColor: 'blue', padding: '5px' }} />
                                            </a>
                                        ) : (
                                            <span>Aucune localisation</span>
                                        )}
                                    </td>
                                    <td>
                                        <Button variant="info" onClick={() => handleOpenModal(user)}>Gérer</Button>
                                    </td>
                                </tr>
                            ))}
                            {usersWithoutEcole && usersWithoutEcole.map(user => (
                                <tr key={user.id}>
                                    <td>
                                        <Form.Check
                                            type="checkbox"
                                            checked={selectedUsers.includes(user.id)}
                                            onChange={() => handleSelectUser(user.id)}
                                        />
                                    </td>
                                    <td>Aucune école</td>
                                    <td>{user.nom} {user.prenom}</td>
                                    <td>
                                        <Button variant="info" onClick={() => handleOpenModal(user)}>Gérer</Button>
                                    </td>
                                    <td>
                                        {/* Lien Google Maps */}
                                        {user.latitude && user.longitude ? (
                                            <a
                                                href={`https://www.google.com/maps?q=${user.latitude},${user.longitude}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                title="Voir sur Google Maps"
                                            >
                                                <FaMapMarkerAlt style={{ color: 'red', fontSize: '20px', cursor: 'pointer' }} />
                                            </a>
                                        ) : (
                                            <span>Aucune localisation</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </div>
            </div>

            <Modal show={showModal} onHide={handleCloseModal} size="lg">
                <Modal.Header closeButton className="custom-modal-header">
                    <Modal.Title>Gestion des Privilèges pour {selectedUser?.nom} {selectedUser?.prenom}</Modal.Title>
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
                            {Object.keys(sousGestions).map(gestion => (
                                <React.Fragment key={gestion}>
                                    <tr>
                                        <td onClick={() => handleToggleGestion(gestion)} style={{ cursor: 'pointer' }}>
                                            {gestion} {expandedGestion === gestion ? <FaChevronUp /> : <FaChevronDown />}
                                        </td>
                                        <td>
                                            <Form.Check
                                                type="checkbox"
                                                checked={
                                                    sousGestions[gestion].every(sousGestion =>
                                                        permissions[gestion]?.[sousGestion]?.Ajouter &&
                                                        permissions[gestion]?.[sousGestion]?.Modifier &&
                                                        permissions[gestion]?.[sousGestion]?.Supprimer &&
                                                        permissions[gestion]?.[sousGestion]?.Voir
                                                    )
                                                }
                                                onChange={(e) => {
                                                    const isChecked = e.target.checked;
                                                    sousGestions[gestion].forEach(sousGestion => {
                                                        handlePermissionChange(gestion, sousGestion, 'Ajouter', isChecked);
                                                        handlePermissionChange(gestion, sousGestion, 'Modifier', isChecked);
                                                        handlePermissionChange(gestion, sousGestion, 'Supprimer', isChecked);
                                                        handlePermissionChange(gestion, sousGestion, 'Voir', isChecked);
                                                    });
                                                }}
                                            />
                                        </td>
                                        <td>
                                            <Form.Check
                                                type="checkbox"
                                                checked={permissions[gestion]?.Ajouter || false}
                                                disabled
                                            />
                                        </td>
                                        <td>
                                            <Form.Check
                                                type="checkbox"
                                                checked={permissions[gestion]?.Modifier || false}
                                                disabled
                                            />
                                        </td>
                                        <td>
                                            <Form.Check
                                                type="checkbox"
                                                checked={permissions[gestion]?.Supprimer || false}
                                                disabled
                                            />
                                        </td>
                                        <td>
                                            <Form.Check
                                                type="checkbox"
                                                checked={permissions[gestion]?.Voir || false}
                                                onChange={(e) => handlePermissionChange(gestion, null, 'Voir', e.target.checked)}
                                            />
                                        </td>
                                    </tr>
                                    {expandedGestion === gestion && sousGestions[gestion].map(sousGestion => (
                                        <tr key={sousGestion}>
                                            <td style={{ paddingLeft: '30px' }}>{sousGestion}</td>
                                            <td>
                                                <Form.Check
                                                    type="checkbox"
                                                    checked={
                                                        permissions[gestion]?.[sousGestion]?.Ajouter &&
                                                        permissions[gestion]?.[sousGestion]?.Modifier &&
                                                        permissions[gestion]?.[sousGestion]?.Supprimer &&
                                                        permissions[gestion]?.[sousGestion]?.Voir
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
                                                    checked={permissions[gestion]?.[sousGestion]?.Ajouter || false}
                                                    onChange={(e) => handlePermissionChange(gestion, sousGestion, 'Ajouter', e.target.checked)}
                                                />
                                            </td>
                                            <td>
                                                <Form.Check
                                                    type="checkbox"
                                                    checked={permissions[gestion]?.[sousGestion]?.Modifier || false}
                                                    onChange={(e) => handlePermissionChange(gestion, sousGestion, 'Modifier', e.target.checked)}
                                                />
                                            </td>
                                            <td>
                                                <Form.Check
                                                    type="checkbox"
                                                    checked={permissions[gestion]?.[sousGestion]?.Supprimer || false}
                                                    onChange={(e) => handlePermissionChange(gestion, sousGestion, 'Supprimer', e.target.checked)}
                                                />
                                            </td>
                                            <td>
                                                <Form.Check
                                                    type="checkbox"
                                                    checked={permissions[gestion]?.[sousGestion]?.Voir || false}
                                                    onChange={(e) => handlePermissionChange(gestion, sousGestion, 'Voir', e.target.checked)}
                                                />
                                            </td>
                                        </tr>
                                    ))}
                                </React.Fragment>
                            ))}
                        </tbody>
                    </Table>
                </Modal.Body>


                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
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

export default Privilege;
