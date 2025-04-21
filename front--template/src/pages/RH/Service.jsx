import React, { useState, useEffect } from 'react';
import axios from 'axios';
import addbtn from '../../assets/imgs/addbtn.png';
import edite from '../../assets/imgs/edit.png';
import delet from '../../assets/imgs/delete.png';
import archive from '../../assets/imgs/archive.png';
import './Poste.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

  const Service = ({onServiceAdded}) => {
  const [service, setService] = useState("");  
  const [services, setServices] = useState([]); 
  const [editingServiceId, setEditingServiceId] = useState(null);

  useEffect(() => {
    handleListServices();
  }, []);

  const handleListServices = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) { alert("Vous devez être connecté pour soumettre le formulaire."); return;}

      const response = await axios.get('http://localhost:5000/services/liste',{
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
    });
      setServices(response.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des services', error);
      alert('Une erreur est survenue lors de la récupération des services');
    }
  };

  const handleUpdateService = async () => {
    if (!service) {
      alert('Veuillez entrer un service');
      return;
    }
    try {
      const token = localStorage.getItem("token");
      if (!token) { alert("Vous devez être connecté pour soumettre le formulaire."); return;}

      const response = await axios.put(`http://localhost:5000/services/modifier/${editingServiceId}`, { service }
        ,{
          headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
          },
      }
      );
      if (response.status === 200) {
        toast.success('Service modifié avec succès');
        setServices(services.map(item => (item.id === editingServiceId ? { ...item, service } : item))); 
        setService(''); 
        setEditingServiceId(null); 
      }
    } catch (error) {
      console.error('Erreur lors de la modification du service', error);
      alert('Une erreur est survenue lors de la modification du service');
    }
  };

  const handleAddService = async () => {
    if (!service) {
      alert('Veuillez entrer un service');
      return;
    }
    try {
      const token = localStorage.getItem("token");
      if (!token) { alert("Vous devez être connecté pour soumettre le formulaire."); return;}

      const response = await axios.post('http://localhost:5000/services/ajouter', { service },
        {
          headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
          },
      }
      );
      if (response.status === 201) {
        // toast.success('Service ajouté avec succès');
        setServices([...services, response.data.service]); 
        setService('');  
        onServiceAdded();
      }
    } catch (error) {
      // console.error('Erreur lors de l\'ajout du service', error);
      // alert('Une erreur est survenue lors de l\'ajout du service');
      if (error.response && error.response.status === 400) {
        console.log(error.response.data.message)
        alert(error.response.data.message); 
      } else {
        console.error('Erreur lors de l\'ajout du service', error);
        alert('Une erreur est survenue lors de l\'ajout du service');
      }
    }
  };

  const handleArchiveService = async (id) => {
    try {
      console.log('idservice',id)
      const token = localStorage.getItem("token");
      if (!token) { alert("Vous devez être connecté pour soumettre le formulaire."); return;}
      console.log('token',token)
      await axios.patch(`http://localhost:5000/services/archiver/${id}`,{},
        {
          headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
          },
      }
      );
      // toast.success('Service archivé avec succès');
      setServices(services.filter(item => item.id !== id)); 
    } catch (error) {
      console.error("Erreur lors de l'archivage du service", error);
      alert("Une erreur est survenue lors de l'archivage du service");
    }
  };

  return (
    <div className="modal fade" id="modal-service">
      <div className="modal-dialog">
        <div className="modal-content">
            
          <div className="modal-header">
            <h5 className="modal-title">Gestion des services</h5>
            {/* <button type="button" className="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button> */}
          </div>
          <div className="modal-body">
            <p className='mbp'>{editingServiceId ? 'Modifier un service' : 'Ajouter un service'}</p>
            <div className="input">
              <input 
                type="text" 
                value={service} 
                onChange={(e) => setService(e.target.value)} 
                placeholder={`Nom du service`} 
              />
              {editingServiceId ? (
                <a href="#" onClick={handleUpdateService}>
                  <img src={addbtn} alt="Modifier" width="35px" />
                </a>
              ) : (
                <a href="#" onClick={handleAddService}>
                  <img src={addbtn} alt="Ajouter" width="35px" />
                </a>
              )}
            </div>
            <hr />
            <div className='list-item'>
              {services.length > 0 ? (
                services.map((item, index) => (
                  <div className='item' key={index}>
                    <p>{item.service}</p>
                    <div className='item-btn'>
                      <button onClick={() => { setEditingServiceId(item.id); setService(item.service); }}>
                        <img src={edite} alt="Editer" />
                      </button>
                      <button onClick={() => handleArchiveService(item.id)}>
                        <img src={archive} alt="archiver" />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p>Aucun service ajouté.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Service;