import React, { useState } from 'react';
import conge from '../../assets/imgs/leave.png';
import axios from 'axios';
import { useEffect } from 'react';
import moment from 'moment';

const AddAutorisation = ({ listeMesDA }) => {
  const [formData, setFormData] = useState({
    type_demande: "",
    dateDebut: "",
    dateFin: "",
    commentaire: "",
    RaisonA: "",
    fichier: "",
  });

  const [errors, setErrors] = useState({});
 
  const handleChange = (e) => {
    const { name, value, type } = e.target;
    if (type === "file") {
      const fichier = e.target.files[0];
      setFormData({ ...formData, [name]: fichier });
    } else {
      const { value } = e.target;
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };


  //verifier fichier
  const allowedTypes = ["image/jpeg","image/png","image/gif","image/jpg","application/pdf",
    "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
    "text/plain" // .txt
  ];
  const maxSize = 5 * 1024 * 1024; // 5 Mo
  const validateFile = (file) => {
    if (file) {
    if (!allowedTypes.includes(file.type)) {
      return "Format non autorisé. Veuillez choisir une image, un PDF, un document Word ou un fichier texte.";
    }
    if (file.size > maxSize) {
      return "Le fichier est trop volumineux. La taille maximale est de 5 Mo.";
    }
  }
    return ""; 
  };
  
 
  const validateForm = () => {
    const newErrors = {};
    if (!formData.type_demande) newErrors.type_demande = "Le type de demande est requis";
    if (!formData.dateDebut) newErrors.dateDebut = "La date de du est requise";
    if (!formData.dateFin) newErrors.dateFin = "La date a est requise";
    // if (!formData.RaisonA) newErrors.dateFin = "La raison autorisation est requise";
    const dateDebut = moment(formData.dateDebut);
    const dateFin = moment(formData.dateFin);
    if (dateFin.isBefore(dateDebut, 'day')) {newErrors.dateFin = "La date de a doit être supérieure à la date de du"; }

    const fileError = validateFile(formData.fichier);
    if (fileError) newErrors.fichier=fileError;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };



  
  const handleSave = async () => {
    if (!validateForm()) return;

    try {
      const formFile = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        formFile.append(key, value);
        console.log(key, value);
      });
      
      const response = await axios.post('http://localhost:5000/justifications/ajouterDA', formFile, {
        headers: { 'Content-Type': 'multipart/form-data',},
      });
      
      if (response.status === 201) {
        alert('Demande ajoutée avec succès');
        await listeMesDA(2);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="modal fade" id="addAutorisation" tabIndex="-1" aria-labelledby="modal-default-label" aria-hidden="true">
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header bg-info text-white">
            <div className="widget-user-header d-flex align-items-center">
              <div className="widget-user-image">
                <img src={conge} alt="Congé" width="70px" />
              </div>
            </div>
            <button type="button" className="close text-white" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>

          <div className="modal-body">
            <h5 className="custom-title">Ajouter une demande d'autorisation </h5>
            <div className="card shadow-lg border-0 rounded-lg p-3 mb-4">
              <div className="row">
                <div className="col-md-12">
                  <label htmlFor="demande">Type de la demande d'autorisation</label>
                  <select
                    className="form-control"
                    id="demande"
                    required
                    name="type_demande"
                    value={formData.type_demande}
                    onChange={handleChange}>
                    <option value="" disabled>Demande de ...</option>
                    <option value="Maladie">Maladie</option>
                    <option value="Urgence">Urgence</option>
                    <option value="Raisons familiales">Raisons familiales</option>
                    <option value="Autres">Autres</option>
                  </select>
                  {errors.type_demande && <span className="text-danger">{errors.type_demande}</span>}
                </div>
                {(formData.type_demande === 'Autres' &&
                  <input type="text" className='form-control mt-4'
                    placeholder="Raison d'autorisation"
                    name='RaisonA'
                    value={formData.RaisonA}
                    onChange={handleChange}
                  />

                )
                }
              </div>
            </div>
          </div>

          <div className="modal-body">
            <div className="card shadow-lg border-0 rounded-lg p-3 mb-4" style={{ marginTop: "-44px" }}>
              <div className="row">
                <div className="col-md-6 mb-1">
                  <label htmlFor="date_du" className="font-weight-bold">Du</label>
                  <input
                    type="datetime-local"
                    id="date_du"
                    name="dateDebut"
                    className="form-control"
                    value={formData.dateDebut}
                    onChange={handleChange}
                  />
                  {errors.dateDebut && <span className="text-danger">{errors.dateDebut}</span>}
                </div>

                <div className="col-md-6 mb-1">
                  <label htmlFor="date_a" className="font-weight-bold">À</label>
                  <input
                    type="datetime-local"
                    id="date_a"
                    name="dateFin"
                    className="form-control"
                    value={formData.dateFin}
                    onChange={handleChange}
                  />
                  {errors.dateFin && <span className="text-danger">{errors.dateFin}</span>}
                </div>
              </div>

              <div className="row">
                <div className="col-md-12 mb-1">
                  <label htmlFor="commentaire">Commentaire</label>
                  <textarea
                    id="commentaire"
                    name="commentaire"
                    className="form-control"
                    placeholder="Ajouter un commentaire"
                    rows="2"
                    value={formData.commentaire}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="row">
                <div className="col-md-6">
                  <label htmlFor="fichier" className="file-label"> Ajouter une justification</label>
                  <div style={{ border: "1px solid rgb(192, 193, 194)", height: "30px", display: "flex", alignItems: "center", justifyContent: "center", padding: "5px", borderRadius: "5px", cursor: "pointer" }}>
                    <label htmlFor="file" style={{ marginRight: "10px", fontWeight: "bold", cursor: "pointer", color: 'rgb(65, 105, 238)' }}>
                      {!(formData.fichier.name) ? "Ajouter une justification" : <span style={{ marginLeft: "10px", fontSize: "14px" }}>{formData.fichier.name}</span>}

                    </label>
                    <input
                      id="file"
                      type="file"
                      name="fichier"
                      style={{
                        opacity: 0,
                        position: 'absolute',
                        zIndex: -1,
                        width: "100%",
                        height: "100%",
                      }}
                      onChange={handleChange}
                    />
                  </div>
                  {errors.fichier && <span className="text-danger">{errors.fichier}</span>}

                </div>
              </div>



              <div className="row">
                <div className="col-12 text-center mt-4">
                  <div className="modal-footer justify-content-between">
                    <button type="button" className="btn btn-default" data-dismiss="modal">Fermer</button>
                    <button type="button" className="btn btn-outline-primary" onClick={handleSave}>Ajouter</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddAutorisation;