import React, { useState } from 'react';
import conge from '../../../../assets/imgs/leave.png';
import axios from 'axios';
import { useEffect } from 'react';
import moment from 'moment'

const AddEmployeCA = ({ listeMesCA }) => {

  const [formData, setFormData] = useState({
    type_demande: "",
    dateDebut: "",
    dateFin: "",
    commentaire: "",
    fichier:"",
    idcongeAnnuel:null
    
  });

  const [errorMessage, setErrorMessage] = useState("");
  const [jourConge, setJourConge] = useState(null);
  const [CAouvert, setCAouvert] = useState(false);
  const [dateDebutC, setdateDebutC] = useState('');
  const [dateFinC, setdateFinC] = useState('');
  const [errors, setErrors] = useState({});
  const [fileName, setFileName] = useState(""); 

 
  const handleChange = (e) => {
    const { name, value,type  } = e.target;

  if (type === "file") {
    const fichier = e.target.files[0]; 
    setFileName(fichier.name);
    setFormData({ ...formData, [name]: fichier });
  } else {
    const { value } = e.target;
    setFormData({ ...formData, [name]: value });
    setFileName("");
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
      if (!formData.dateDebut) newErrors.dateDebut = "La date de début est requise";
      if (!formData.dateFin) newErrors.dateFin = "La date de fin est requise";
    
      const dateDebut = moment(formData.dateDebut);
      const dateFin = moment(formData.dateFin);
    
      if (dateFin.isBefore(dateDebut, 'day')) {
        newErrors.dateFin = "La date de fin doit être supérieure à la date de début";
      }
    
      const fileError = validateFile(formData.fichier);
      if (fileError) {
        newErrors.fichier = fileError; // Ajoute fileError à newErrors
      }
    
      if (formData.type_demande === "Congé Annuel") {
        const dateDebutCBDD = moment(dateDebutC);
        const dateFinCBDD = moment(dateFinC);
    
        if (dateDebut.isBefore(dateDebutCBDD, 'day') || dateFin.isAfter(dateFinCBDD, 'day')) {
          setErrorMessage(`Veuillez choisir une date entre ${moment(dateDebutCBDD).format('YYYY-MM-DD')} et ${moment(dateFinCBDD).format('YYYY-MM-DD')}`);
          return false;
        }
      }
    
      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    };



  const handleSave = async () => {
    if (!validateForm()) return;
    try {
      const formFile=new FormData();
      Object.entries(formData).forEach(([key, value]) => {
      formFile.append(key, value);
    
    });
    const token = localStorage.getItem("token");
    if (!token) {
        alert("Vous devez être connecté ");
        return;
    }
      const response = await axios.post('http://localhost:5000/congeAbsence/ajouter', formFile,{
        headers:{   Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data',}
      });

      if (response.status === 201) {
        alert('Demande ajoutée avec succès');
        await listeMesCA();
        console.log(response.data);
      }
    else if (response.status === 203) {
      alert(response.data.message); 
    }
    } catch (error) {
      console.log("Erreur lors de l'ajout du congé :", error);
      if (error.response) {
        console.log('error',error.response)
        const status = error.response.status;
        const message = error.response.data.message || "Erreur inconnue.";
  
        if (status === 203) {
          alert(message); 
        } else if (status === 500) {
          alert("Erreur serveur : " + message);
        } else {
          alert("Erreur : " + message);
        }
      } else {
        alert("Erreur réseau ou de configuration.");
      }
    }}
  //verifier si la date correspand a la date des demande de conge 
  const DateCongeOuvert = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Vous devez être connecté ");
        return;
      }
      const response = await axios.get("http://localhost:5000/congeAbsence/verifierDateCongeAnnuel", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
  
      if (response.status === 200) {
        setCAouvert(true);
        // Accéder au premier élément du tableau `conge`
        setdateDebutC(response.data.conge[0].dateDebut);
        setdateFinC(response.data.conge[0].dateFin);
        setFormData(prev => ({...prev,idcongeAnnuel: response.data.conge[0].id }));
        console.log('setdateDebutC', response.data.conge[0].dateDebut);
        console.log('setdateFinC', response.data.conge[0].dateFin);
      } else {
        setCAouvert(false);
      }
    } catch (error) {
      console.error("❌ Erreur lors de la requête :", error);
      if (error.response) {
        console.log("Erreur API:", error.response.data.message || "Aucun message d'erreur");
      } else {
        console.log("Erreur inconnue !");
      }
      setCAouvert(false);
    }
  };

  // Exécuter au chargement de la page
  useEffect(() => {
    DateCongeOuvert();
  }, []);


  return (
    <div className="modal fade" id="addemployeca" tabIndex="-1" aria-labelledby="modal-default-label" aria-hidden="true">
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
            <h5 className="custom-title">Ajouter une demande </h5>
            <div className="card shadow-lg border-0 rounded-lg p-3 mb-4">
              <div className="row">
                <div className="col-md-12">
                  <label htmlFor="demande">Type de la demande *</label>
                  <select
                    className="form-control"
                    id="demande"
                    required
                    name="type_demande"
                    value={formData.type_demande}
                    onChange={handleChange}
                  >
                    <option value="" disabled>Demande de ...</option>
                    <option value="Congé Annuel" disabled={!CAouvert}>Congé Annuel</option>
                    <option value="Congé Maternité">Congé Maternité</option>
                    <option value="Arrêt Maladie">Arrêt Maladie</option>
                    <option value="Absence justifiée">Absence justifiée</option>
                    <option value="Absence non justifiée">Absence non justifiée</option>
                  </select>
                </div>
                {errors.type_demande && <span className="text-danger">{errors.type_demande}</span>}
              </div>
            </div>
          </div>

          <div className="modal-body">
            <div className="card shadow-lg border-0 rounded-lg p-3 mb-4" style={{ marginTop: "-44px" }}>
              <div className="row">
                <div className="col-md-6 mb-1">
                  <label htmlFor="date_du" className="font-weight-bold">Du</label>
                  <input
                    type="date"
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
                    type="date"
                    id="date_a"
                    name="dateFin"
                    className="form-control"
                    value={formData.dateFin}
                    onChange={handleChange}
                  />
                 {errors.dateFin && <span className="text-danger">{errors.dateFin}</span>}

                </div>
              </div>

              {errorMessage && (
                <div className="alert alert-danger mt-4 ">
                  {errorMessage}
                </div>
              )}

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


                <div className="col-md-12 mb-3 mt-3" style={{ border: "1px solid rgb(192, 193, 194)", height: "40px", display: "flex", alignItems: "center", justifyContent: "center", padding: "5px", borderRadius: "5px", cursor: "pointer" }}>
                  <label htmlFor="file" style={{ marginRight: "10px", fontWeight: "bold", cursor: "pointer", color: 'rgb(65, 105, 238)' }}>
                    {!(fileName) ? "Ajouter une justification" : <span style={{ marginLeft: "10px", fontSize: "14px" }}>{fileName}</span>}
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

export default AddEmployeCA;
