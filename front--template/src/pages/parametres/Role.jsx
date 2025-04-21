import React, { useEffect, useState } from 'react';
import axios from 'axios';
import addbtn from '../../assets/imgs/addbtn.png';
import edite from '../../assets/imgs/edit.png';
import delet from '../../assets/imgs/delete.png';
import archive from '../../assets/imgs/archive.png';
import './Role.css'; // Assurez-vous que ce fichier CSS est adapté ou renommé si nécessaire
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Role = ({ onRoleAdded }) => {
  const [role, setRole] = useState("");
  const [roles, setRoles] = useState([]);
  const [editingRoleId, setEditingRoleId] = useState(null);

  const handleListRoles = async () => {
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
    handleListRoles();
  }, []);

  const handleEditRole = (id, currentRole) => {
    setEditingRoleId(id);
    setRole(currentRole);
  };

  const handleUpdateRole = async () => {
    if (!role) {
      alert('Veuillez entrer un rôle');
      return;
    }
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      
      const response = await axios.put(
        `http://localhost:5000/roles/modifier/${editingRoleId}`,
        { name: role },
        { headers: { Authorization: `Bearer ${token}` }}
      );
      
      if (response.status === 200) {
        toast.success("Rôle modifié avec succès");
        setRoles(roles.map((item) =>
          item.id === editingRoleId ? { ...item, name: role } : item
        ));
        setRole('');
        setEditingRoleId(null);
        onRoleAdded(); // Rafraîchir les données parentes
        $('#modal-role').modal('hide'); // Fermer la modal
      }
    } catch (error) {
      console.error('Erreur lors de la modification du rôle', error);
      toast.error(error.response?.data?.message || 'Erreur lors de la modification');
    }
  };

  const handleAddRole = async () => {
    if (!role) {
      alert('Veuillez entrer un rôle');
      return;
    }
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      
      const response = await axios.post(
        'http://localhost:5000/roles/ajouter',
        { name: role },
        { headers: { Authorization: `Bearer ${token}` }}
      );
      
      if (response.status === 201) {
        toast.success("Rôle ajouté avec succès");
        setRoles([...roles, response.data.role]);
        setRole('');
        onRoleAdded(); // Appeler cette fonction pour rafraîchir la liste dans EditUser
        $('#modal-role').modal('hide'); // Fermer la modal
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Erreur lors de l\'ajout');
    }
  };

  const handleArchiveRole = async (id) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      
      const response = await axios.patch(
        `http://localhost:5000/roles/archiver/${id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` }}
      );
      
      if (response.status === 200) {
        toast.success("Rôle archivé avec succès");
        setRoles(roles.filter(item => item.id !== id));
        onRoleAdded(); // Rafraîchir la liste dans EditUser
      }
    } catch (error) {
      toast.error("Erreur lors de l'archivage");
    }
  };

  return (
    <div className="modal fade" id="modal-role">
      <div className="modal-dialog">
        <div className="modal-content">
          <ToastContainer />
          <div className="modal-header">
            <h5 className="modal-title">Gestion des rôles</h5>
            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div className="modal-body">
            <p className='mbp'>{editingRoleId ? 'Modifier un Rôle' : 'Ajouter un Rôle'}</p>
            <div className="input">
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder={`Nom du Rôle`}
              />
              {editingRoleId ? (
                <button onClick={handleUpdateRole}>
                  <img src={addbtn} alt="Modifier" width="35px" />
                </button>
              ) : (
                <button onClick={handleAddRole}>
                  <img src={addbtn} alt="Ajouter" width="35px" />
                </button>
              )}
            </div>
            <hr />
            <div className="list-item">
              {roles.length > 0 ? (
                roles.map((item, index) => (
                  item && item.name ? (  // Vérification si item et item.name existent
                    <div className="item" key={index}>
                      <p>{item.name}</p>
                      {item.name !== 'Administrateur' && (
                        <div className="item-btn">
                          <button onClick={() => handleEditRole(item.id, item.name)}>
                            <img src={edite} alt="modifier" title="modifier" />
                          </button>
                          <button onClick={() => handleArchiveRole(item.id)}>
                            <img src={archive} alt="archiver" />
                          </button>
                        </div>
                      )}
                    </div>
                  ) : null
                ))
              ) : (
                <p>Aucun rôle ajouté.</p>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Role;