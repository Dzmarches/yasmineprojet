import React, { useEffect, useState } from 'react';
import axios from 'axios';
import addbtn from '../../assets/imgs/addbtn.png';
import edite from '../../assets/imgs/edit.png';
import delet from '../../assets/imgs/delete.png';
import archive from '../../assets/imgs/archive.png';
import './Poste.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Poste = ({ onPosteAdded }) => {
  
  const [poste, setPoste] = useState("");
  const [postes, setPostes] = useState([]);
  const [editingPosteId, setEditingPosteId] = useState(null);

  const handleListPostes = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) { alert("Vous devez être connecté pour soumettre le formulaire."); return;}
      const response = await axios.get('http://localhost:5000/postes/liste',
        {
          headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
          },
      }
      );
      setPostes(response.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des postes', error);
      alert('Une erreur est survenue lors de la récupération des postes');
    }
  };
  useEffect(() => {
    handleListPostes();
  }, []);

  const handleEditPoste = (id, currentPoste) => {
    setEditingPosteId(id);
    setPoste(currentPoste);
  };

  const handleUpdatePoste = async () => {
    
    if (!poste) {
      alert('Veuillez entrer un poste');
      return;
    }
    try {
      const token = localStorage.getItem("token");
      if (!token) {
          alert("Vous devez être connecté pour soumettre le formulaire.");
          return;
      }
      const response = await axios.put(`http://localhost:5000/postes/modifier/${editingPosteId}`, { poste },
        {
          headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
          },
      }
      );
      if (response.status === 200) {
        // toast.success('Poste modifié avec succès',{autoClose: 2000});
        setPostes(postes.map(item => (item.id === editingPosteId ? { ...item, poste } : item)));
        setPoste('');
        setEditingPosteId(null);
      }
    } catch (error) {
      console.error('Erreur lors de la modification du poste', error);
      alert('Une erreur est survenue lors de la modification du poste');
    }
  };

  const handleAddPoste = async () => {
    if (!poste) {
      alert('Veuillez entrer un poste');
      return;
    }
    try {
      const token = localStorage.getItem("token");
      if (!token) {
          alert("Vous devez être connecté pour soumettre le formulaire.");
          return;
      }
      const response = await axios.post('http://localhost:5000/postes/ajouter', { poste },
        {
          headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
          },
      }
      );
      if (response.status === 201) {
        // toast.success('Poste ajouté avec succès',{autoClose: 2000});
        setPostes([...postes, response.data.poste]);
        setPoste('');
        onPosteAdded();
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
             console.log(error.response.data.message)
             alert(error.response.data.message); 
           } else {
             console.error('Erreur lors de l\'ajout du poste', error);
             alert('Une erreur est survenue lors de l\'ajout du poste');
           }
    }
  };


  const handleArchivePoste = async (id) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
          alert("Vous devez être connecté pour soumettre le formulaire.");
          return;
      }
      const response = await axios.patch(`http://localhost:5000/postes/archiver/${id}`, 
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      
  
        if (response.status === 200) {
        // toast.success('Poste archivé avec succès');
        // setPostes(response.data);
        setPostes(postes.filter(item => item.id !== id)); 
      }
    } catch (error) {
      console.error("Erreur lors de l'archivage du poste", error);
      alert("Une erreur est survenue lors de l'archivage du poste");
    }
  };
  
  return (
    <div className="modal fade" id="modal-post">
      <div className="modal-dialog">
        <div className="modal-content">
             <ToastContainer />
          <div className="modal-header">
            <h5 className="modal-title">Gestion des postes</h5>
            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div className="modal-body">
            <p className='mbp'>{editingPosteId ? 'Modifier un Poste' : 'Ajouter un Poste'}</p>
            <div className="input">
              <input
                type="text"
                value={poste}
                onChange={(e) => setPoste(e.target.value)}
                placeholder={`Nom du Poste`}
              />
              {editingPosteId ? (
                <button onClick={handleUpdatePoste}>
                  <img src={addbtn} alt="Modifier" width="35px" />
                </button>
              ) : (
                <button onClick={handleAddPoste}>
                  <img src={addbtn} alt="Ajouter" width="35px" />
                </button>
              )}
            </div>
            <hr />
            <div className='list-item'>
              {postes.length > 0 ? (
                postes.map((item, index) => (
                  <div className='item' key={index}>
                    <p>{item.poste}</p>
                    {(item.poste != 'Enseignant' &&
                      <div className='item-btn'>
                        <button onClick={() => handleEditPoste(item.id, item.poste)}>
                          <img src={edite} alt="modifier" title='modifier' />
                        </button>

                        <button onClick={() => handleArchivePoste(item.id)}>
                          <img src={archive} alt="archiver" />
                        </button>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <p>Aucun poste ajouté.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Poste;