import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { Table, Button, Modal, Form } from 'react-bootstrap';
import { jwtDecode } from 'jwt-decode';
import { FaChevronUp, FaChevronDown } from 'react-icons/fa';
import privilegeImg from '../../assets/imgs/permission (1).png';
import permission from '../../assets/imgs/authorization.png';
import edite from '../../assets/imgs/edit.png';

const ListeUser = () => {
    const [users, setUsers] = useState([]);
    const [showPermissionsModal, setShowPermissionsModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [permissions, setPermissions] = useState({});
    const [selectedPermissions, setSelectedPermissions] = useState({});
    const [expandedGestion, setExpandedGestion] = useState(null);
    const [userRoles, setUserRoles] = useState([]);
    const [selectedRoleId, setSelectedRoleId] = useState(null);
    const [defaultPermissions, setDefaultPermissions] = useState([]);

    const navigate = useNavigate();

    const handleEditUser = (userId) => {
        navigate(`/edit-user/${userId}`);
    };

    useEffect(() => {
        const fetchUsers = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                console.error('Aucun token trouvé. Veuillez vous connecter.');
                return;
            }

            try {
                const response = await axios.get('http://localhost:5000/apii/users', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setUsers(response.data);
            } catch (error) {
                console.error('Erreur lors de la récupération des utilisateurs:', error);
                if (error.response) {
                    console.error('Réponse du serveur:', error.response.data);
                }
            }
        };

        fetchUsers();
    }, []);

    const handleManagePermissions = async (user) => {
        setSelectedUser(user);
        setUserRoles(user.roles);
        setSelectedRoleId(user.roles[0]?.id);
    
        const token = localStorage.getItem('token');
        if (!token) return;
    
        try {
            const decodedToken = jwtDecode(token);
            const isEmploye = user.roles.some(role => role.name === "Employé");
    
            // Récupérer les permissions de l'utilisateur connecté et de l'utilisateur sélectionné
            const response = await axios.get(`http://localhost:5000/apii/user/permission/${user.id}/${user.roles[0]?.id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
    
            if (!response.data || !response.data.userPermissionNames) {
                throw new Error("La réponse de l'API est mal structurée.");
            }
    
            const { connectedPermissionNames, userPermissionNames } = response.data;
            
            // Définir les permissions par défaut pour les employés
            const defaultEmployePermissions = [
                "Ressources Humaines-Voir",
                "Ressources Humaines-Gestion de mes demande de congé-Ajouter",
                "Ressources Humaines-Gestion de mes demande de congé-Modifier",
                "Ressources Humaines-Gestion de mes demande de congé-Supprimer",
                "Ressources Humaines-Gestion de mes demande de congé-Voir",
                "Ressources Humaines-Gestion de mes pointage-Voir",
                "Ressources Humaines-Gestion de mes pointage-Supprimer",
                "Ressources Humaines-Gestion de mes pointage-Modifier",
                "Ressources Humaines-Gestion de mes pointage-Ajouter"
            ];
            setDefaultPermissions(defaultEmployePermissions);
            
            // Formater les permissions de l'utilisateur sélectionné (pour les cases cochées)
            const formattedPermissions = formatPermissions(userPermissionNames);
            
            // Si c'est un employé, ajouter les permissions par défaut
            if (isEmploye) {
                const defaultPermissionsFormatted = formatPermissions(defaultEmployePermissions);
                // Fusionner les permissions existantes avec les permissions par défaut
                const mergedPermissions = mergePermissions(defaultPermissionsFormatted, formattedPermissions);
                setSelectedPermissions(mergedPermissions);
            } else {
                setSelectedPermissions(formattedPermissions);
            }
            
            // Formater toutes les permissions disponibles (de l'utilisateur connecté + permissions par défaut si employé)
            const allPermissions = {};
            
            // D'abord ajouter les permissions de l'utilisateur connecté
            connectedPermissionNames.forEach(permission => {
                const [gestion, sousGestion, action] = permission.split('-');
                if (!allPermissions[gestion]) {
                    allPermissions[gestion] = {};
                }
                if (sousGestion) {
                    if (!allPermissions[gestion][sousGestion]) {
                        allPermissions[gestion][sousGestion] = {};
                    }
                    allPermissions[gestion][sousGestion][action] = true;
                } else {
                    allPermissions[gestion][action] = true;
                }
            });
    
            // Si c'est un employé, ajouter les permissions par défaut qui ne sont pas déjà présentes
            if (isEmploye) {
                defaultEmployePermissions.forEach(permission => {
                    const [gestion, sousGestion, action] = permission.split('-');
                    if (!allPermissions[gestion]) {
                        allPermissions[gestion] = {};
                    }
                    if (sousGestion) {
                        if (!allPermissions[gestion][sousGestion]) {
                            allPermissions[gestion][sousGestion] = {};
                        }
                        if (action && !allPermissions[gestion][sousGestion][action]) {
                            allPermissions[gestion][sousGestion][action] = true;
                        }
                    } else {
                        if (sousGestion && !allPermissions[gestion][sousGestion]) {
                            allPermissions[gestion][sousGestion] = true;
                        }
                    }
                });
            }
    
            setPermissions(allPermissions);
            setShowPermissionsModal(true);
    
        } catch (error) {
            console.error('Erreur lors de la récupération des permissions:', error);
            alert("Erreur lors de la récupération des permissions.");
        }
    };

    // Fonction pour fusionner les permissions par défaut avec les permissions existantes
    const mergePermissions = (defaultPerms, existingPerms) => {
        const merged = {...defaultPerms};
        
        // Parcourir les permissions existantes et les ajouter au résultat fusionné
        for (const gestion in existingPerms) {
            if (!merged[gestion]) {
                merged[gestion] = {};
            }
            
            for (const key in existingPerms[gestion]) {
                if (key === 'Ajouter' || key === 'Modifier' || key === 'Supprimer' || key === 'Voir') {
                    merged[gestion][key] = existingPerms[gestion][key];
                } else {
                    if (!merged[gestion][key]) {
                        merged[gestion][key] = {};
                    }
                    
                    for (const action in existingPerms[gestion][key]) {
                        merged[gestion][key][action] = existingPerms[gestion][key][action];
                    }
                }
            }
        }
        
        return merged;
    };

    const formatPermissions = (permissionNames) => {
        const formattedPermissions = {};
        permissionNames.forEach(permission => {
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
        return formattedPermissions;
    };

    const handleClosePermissionsModal = () => {
        setShowPermissionsModal(false);
        setSelectedUser(null);
        setPermissions({});
        setSelectedPermissions({});
    };

    const handlePermissionChange = (gestion, sousGestion, action, checked) => {
        setSelectedPermissions(prevPermissions => {
            const newPermissions = { ...prevPermissions };

            if (!newPermissions[gestion]) {
                newPermissions[gestion] = {};
            }

            if (sousGestion) {
                if (!newPermissions[gestion][sousGestion]) {
                    newPermissions[gestion][sousGestion] = {};
                }
                newPermissions[gestion][sousGestion][action] = checked;
            } else {
                newPermissions[gestion][action] = checked;
            }

            return newPermissions;
        });
    };

    const handleToggleGestion = (gestion) => {
        setExpandedGestion(expandedGestion === gestion ? null : gestion);
    };

    const handleSavePermissions = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            console.error('Aucun token trouvé. Veuillez vous connecter.');
            return;
        }

        try {
            const formattedPermissions = [];
            for (const gestion in selectedPermissions) {
                for (const action in selectedPermissions[gestion]) {
                    if (action === 'Ajouter' || action === 'Modifier' || action === 'Supprimer' || action === 'Voir') {
                        if (selectedPermissions[gestion][action]) {
                            formattedPermissions.push(`${gestion}-${action}`);
                        }
                    } else {
                        for (const sousAction in selectedPermissions[gestion][action]) {
                            if (selectedPermissions[gestion][action][sousAction]) {
                                formattedPermissions.push(`${gestion}-${action}-${sousAction}`);
                            }
                        }
                    }
                }
            }

            const response = await axios.post(
                'http://localhost:5000/api/save-permission',
                {
                    userId: selectedUser.id,
                    roleId: selectedRoleId,
                    permissions: formattedPermissions,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            alert('Permissions sauvegardées avec succès !');
            handleClosePermissionsModal();
        } catch (error) {
            console.error('Erreur lors de la sauvegarde des permissions:', error);
            alert('Erreur lors de la sauvegarde des permissions.');
        }
    };

    const handleRoleChange = async (roleId) => {
        const token = localStorage.getItem('token');
        if (!token || !selectedUser) return;
    
        try {
            const selectedRole = userRoles.find(role => role.id === parseInt(roleId));
            const isEmploye = selectedRole?.name === "Employé";
    
            const response = await axios.get(`http://localhost:5000/apii/user/permission/${selectedUser.id}/${roleId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
    
            if (!response.data || !response.data.userPermissionNames) {
                throw new Error("La réponse de l'API est mal structurée.");
            }
    
            const { connectedPermissionNames, userPermissionNames } = response.data;
            const formattedPermissions = formatPermissions(userPermissionNames);
    
            // Si c'est un employé, ajouter les permissions par défaut
            if (isEmploye) {
                const defaultPermissionsFormatted = formatPermissions(defaultPermissions);
                const mergedPermissions = mergePermissions(defaultPermissionsFormatted, formattedPermissions);
                setSelectedPermissions(mergedPermissions);
                
                // Mettre à jour les permissions affichées pour inclure les permissions par défaut
                const allPermissions = {...permissions};
                defaultPermissions.forEach(permission => {
                    const [gestion, sousGestion, action] = permission.split('-');
                    if (!allPermissions[gestion]) {
                        allPermissions[gestion] = {};
                    }
                    if (sousGestion) {
                        if (!allPermissions[gestion][sousGestion]) {
                            allPermissions[gestion][sousGestion] = {};
                        }
                        if (action && !allPermissions[gestion][sousGestion][action]) {
                            allPermissions[gestion][sousGestion][action] = true;
                        }
                    } else {
                        if (sousGestion && !allPermissions[gestion][sousGestion]) {
                            allPermissions[gestion][sousGestion] = true;
                        }
                    }
                });
                setPermissions(allPermissions);
            } else {
                setSelectedPermissions(formattedPermissions);
            }
            
        } catch (error) {
            console.error('Erreur lors de la récupération des permissions:', error);
            alert("Erreur lors de la récupération des permissions.");
        }
    };

    const isMainGestion = (gestion) => {
        const isEmploye = selectedUser?.roles.some(role => role.name === "Employé");
        if (isEmploye) return false;
        
        const gestionPermissions = permissions[gestion];
        return !Object.keys(gestionPermissions).some(key => 
            key !== 'Ajouter' && key !== 'Modifier' && key !== 'Supprimer' && key !== 'Voir'
        );
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
                        Gestion des Utilisateur & Permission
                    </p>
                </div>
                <div className="card-body">
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>Nom</th>
                                <th>Prénom</th>
                                <th>Email</th>
                                <th>Rôles</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(user => (
                                <tr key={user.id}>
                                    <td>{user.nom}</td>
                                    <td>{user.prenom}</td>
                                    <td>{user.email}</td>
                                    <td>
                                        {user.roles.map(role => (
                                            <div key={role.id}>
                                                {role.name}
                                            </div>
                                        ))}
                                    </td>
                                    <td>
                                        <button className="btn btn-outline-primary" onClick={() => handleManagePermissions(user)}>
                                            <img src={permission} alt="" />
                                        </button>
                                        <button
                                            className="btn btn-outline-success" onClick={() => handleEditUser(user.id)}>
                                            <img src={edite} alt="supprimer" width="22px" title="Supprimer" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </div>
            </div>
            <Modal show={showPermissionsModal} onHide={handleClosePermissionsModal} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>
                        Gestion des Permissions pour {selectedUser?.nom} {selectedUser?.prenom}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {userRoles.length > 1 && (
                        <Form.Group controlId="roleSelect">
                            <Form.Label>Sélectionner un rôle</Form.Label>
                            <Form.Control
                                as="select"
                                value={selectedRoleId || ''}
                                onChange={(e) => {
                                    const roleId = e.target.value;
                                    setSelectedRoleId(roleId);
                                    handleRoleChange(roleId);
                                }}
                                style={{ height: '50px' }}
                            >
                                {userRoles.map(role => (
                                    <option key={role.id} value={role.id}>
                                        {role.name}
                                    </option>
                                ))}
                            </Form.Control>
                        </Form.Group>
                    )}
                    
                    {selectedUser?.roles.some(role => role.name === "Employé") && (
                        <div className="alert alert-info mb-3">
                            <strong>Mode Employé:</strong> Les permissions par défaut pour les employés sont automatiquement ajoutées.
                        </div>
                    )}
                    
                    {Object.keys(permissions).length === 0 ? (
                        <p>Aucune permission trouvée pour cet utilisateur.</p>
                    ) : (
                        <Table striped bordered hover>
                            <thead>
                                <tr>
                                    <th>Gestion</th>
                                    <th>Ajouter</th>
                                    <th>Modifier</th>
                                    <th>Supprimer</th>
                                    <th>Voir</th>
                                </tr>
                            </thead>
                            <tbody>
                                {Object.keys(permissions).map(gestion => (
                                    <React.Fragment key={gestion}>
                                        <tr>
                                            <td onClick={() => handleToggleGestion(gestion)} style={{ cursor: 'pointer' }}>
                                                {gestion} {expandedGestion === gestion ? <FaChevronUp /> : <FaChevronDown />}
                                            </td>
                                            <td>
                                                <Form.Check
                                                    type="checkbox"
                                                    checked={selectedPermissions[gestion]?.Ajouter || false}
                                                    onChange={(e) => handlePermissionChange(gestion, null, 'Ajouter', e.target.checked)}
                                                    disabled={isMainGestion(gestion)}
                                                />
                                            </td>
                                            <td>
                                                <Form.Check
                                                    type="checkbox"
                                                    checked={selectedPermissions[gestion]?.Modifier || false}
                                                    onChange={(e) => handlePermissionChange(gestion, null, 'Modifier', e.target.checked)}
                                                    disabled={isMainGestion(gestion)}
                                                />
                                            </td>
                                            <td>
                                                <Form.Check
                                                    type="checkbox"
                                                    checked={selectedPermissions[gestion]?.Supprimer || false}
                                                    onChange={(e) => handlePermissionChange(gestion, null, 'Supprimer', e.target.checked)}
                                                    disabled={isMainGestion(gestion)}
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
                                        {expandedGestion === gestion && Object.keys(permissions[gestion]).map(sousGestion => {
                                            if (sousGestion !== 'Ajouter' && sousGestion !== 'Modifier' && sousGestion !== 'Supprimer' && sousGestion !== 'Voir') {
                                                return (
                                                    <tr key={sousGestion}>
                                                        <td style={{ paddingLeft: '30px' }}>{sousGestion}</td>
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
                    )}
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

export default ListeUser;