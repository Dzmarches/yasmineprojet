import React, { useState, useRef, useEffect, useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import Select from "react-select";
import axios from "axios";
import JoditEditor from "jodit-react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import moment from "moment";
import rh from "../../../assets/imgs/employe.png";
import logo from "../../../assets/imgs/logo.png";
import "../GestionDocuments/document.css";

const MesdocImprimer = () => {
  const [employes, setEmployes] = useState([]);
  const [selectedEmploye, setSelectedEmploye] = useState(null);
  const [employeDetails, setEmployeDetails] = useState({
    nom: "",
    prenom: "",
    dateNaissance: "",
    lieuNaissance: "",
    poste: "",
    dateRecrutement: "",
    dateFinRecrutement: "",
    nomecole: "",
    nomecoleP: "",
    NumAS:"",
    DCT:"",
  
  });

  const editor = useRef(null);
  const [content, setContent] = useState("");
  const [previousContent, setPreviousContent] = useState("");
  const location = useLocation();
  const selectedOption = location.state?.selectedOption;
  const id = selectedOption?.value;
  const [ModeleDoc, setModeleDoc] = useState("");
  
  useEffect(() => {
    if (id) {
      fetchAttestationData();
    }
  }, [id]);

  useEffect(() => {
    handleListeEmploye();
  }, []);


  const fetchAttestationData = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
          alert("Vous devez être connecté");
          return;
      }
      const response = await axios.get(`http://localhost:5000/attestation/monattestation/${id}`,
        { headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
    },}
  );
      const data = response.data;
      setModeleDoc(data.modeleTexte || "");
      
      if (editor.current) {
        editor.current.value = data.modeleTexte || "";
        setContent(data.modeleTexte || "");
        setPreviousContent(data.modeleTexte || "");
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des données", error);
      // alert("Échec de la récupération des données.");
    }
  };
 
  const handleListeEmploye = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
          alert("Vous devez être connecté");
          return;
      }
      const response = await axios.get('http://localhost:5000/employes/liste',
        {headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
    },}
  );
    console.log('liste des employe',response.data)
      setEmployes(response.data);
    } catch (error) {
      console.error("Erreur lors de la récupération des employés", error);
    }
  };
  const handleEmployeSelect = (selectedOption) => {
    setSelectedEmploye(selectedOption);
    const employe = employes.find(emp => emp.id === selectedOption.value);
    if (employe) {
      setEmployeDetails({
        nom: employe.User.nom || "",
        prenom: employe.User.prenom || "",
        dateNaissance: moment(employe.User.datenaiss).format('DD/MM/YYYY') || "",
        lieuNaissance: employe.User.lieuxnaiss || "",
        poste: employe.Poste.poste || "",
        dateRecrutement: moment(employe.daterecru).format('DD/MM/YYYY') || "",
        dateFinContrat: moment(employe.DateFinContrat).format('DD/MM/YYYY') || "",
        NumAS: employe.NumAS || "",
        nomecoleP: employe.User?.EcolePrincipal?.nomecole || "", 
        nomecole:  employe.User?.Ecoles?.map(ecole => ecole.nomecole).join(', ') || "",
        DCT:  employe.User?.dateAD? moment(employe.User.dateAD).format('DD/MM/YYYY') : "",
      });
  
      console.log('employyyye',employe)
      const dateToday = moment().format('DD/MM/YYYY');
      const updatedDocument = ModeleDoc
      .replace(/\[nomecole\]/g, employe.User?.Ecoles?.map(ecole => ecole.nomecole).join(', ') || "")
      .replace(/\[nomecoleP\]/g, employe.User?.EcolePrincipal?.nomecole || "" || "")
        .replace(/\[nom\]/g, employe.User.nom || "")
        .replace(/\[prenom\]/g, employe.User.prenom || "")
        .replace(/\[datenaiss\]/g, moment(employe.User.datenaiss).format('DD/MM/YYYY') || "")
        .replace(/\[Lieunais\]/g,employe.User.lieuxnaiss  || "")
        .replace(/\[poste\]/g, employe.Poste.poste.toLowerCase() || "")
        .replace(/\[daterecru\]/g, moment(employe.daterecru).format('DD/MM/YYYY') || "")
        .replace(/\[dateCesT\]/g, employe.User?.dateAD? moment(employe.User?.dateAD).format('DD/MM/YYYY') : "")
        .replace(/\[dateCesT\]/g, dateToday || "")
        .replace(/\[N°AS\]/g, employe.User?.dateAD || "");

      if (editor.current) {
        editor.current.value = updatedDocument;
        setContent(updatedDocument);
     
      }
    }
  };

  const handlePrint = () => {
    // console.log('employe',employeDetails)
    // console.log('NomDoc',NomDoc)
    const originalTitle = document.title; 
    document.title = "Documents"; 
    const contentToPrint = editor.current.value; 
    // Créer un iframe pour l'impression
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    document.body.appendChild(iframe);
    const iframeDocument = iframe.contentWindow.document;

    // Ajouter les styles pour l'impression
    const style = iframeDocument.createElement('style');
    //  @page{margin:0;}
    style.innerHTML = `
     @media print {
     
    body { margin: 0 !important; padding: 40px !important; }
    table {
      border-collapse: collapse;
      width: 100%;
    }
    table, th, td {
      border: 1px solid #EBEBEB;
    }
  }
`;
    iframeDocument.head.appendChild(style);
    // Ajouter le contenu de l'éditeur Jodit
    iframeDocument.body.innerHTML = contentToPrint;
  
    // Imprimer le document
    iframe.contentWindow.focus();
    // iframe.contentWindow.print();
    setTimeout(() => {
      iframe.contentWindow.print();
      document.title = originalTitle; 
    }, 500);
  
    // Nettoyer l'iframe après l'impression
    // document.body.removeChild(iframe);
    setTimeout(() => document.body.removeChild(iframe), 1000);
  };
  const config = useMemo(
    () => ({
      readonly: false,
      placeholder: "",
      
      uploader: {
        url: 'http://localhost:5000/attestation/uploadImagemodele',
        format: 'json',
        method: 'POST',
        headers: {
          "X-Requested-With": "XMLHttpRequest",
        },
        filesVariableName: () => "image",
        isSuccess: (resp) => resp.success,
        getMessage: (resp) => resp.message || "Image uploaded successfully",
        process: (resp) => {
          console.log('Server response:', resp);
          return {
            files: resp.files,
            error: resp.error,
            message: resp.message,
          };
        },
        defaultHandlerSuccess: function (data) {
          if (data.files && data.files.length) {
            this.selection.insertImage(data.files[0]);
          }
        },
        error: function (e) {
          console.error('Upload error:', e);
        },
      },
      removeButtons: ['speechRecognize', 'video','print'],
      disablePlugins: ["speechRecognize", "video", "print"], // Désactive complètement ces modules

      extraButtons: [
        {
          name: "imprimer",
          tooltip: "Imprimer",
          title: "Documents à imprimer",
          iconURL: "https://img.icons8.com/ios-filled/50/000000/print.png",
          exec: (editor) => {
            handlePrint(); 
          },
        },
      ],
      language: "fr",
    }),
    []
  );

 
  return (
    <>
      <nav>
        <Link to="/dashboard" className="text-primary">Accueil</Link>
        <span> / </span>
        <span>Gestion des ressources humaines</span>
      </nav>
      <div className="card card-primary card-outline">
        <div className="card-header d-flex">
          <img src={rh} alt="" width="90px" />
          <p className="card-title mt-5 ml-2 p-2 text-center"
            style={{ width: "350px", borderRadius: "50px", border: "1px solid rgb(215, 214, 216)" }}>
            Imprimer le document
          </p>
        </div>
        <div className="card-body">
          <div className="tab-content">
            <div className="tab-pane fade show active" id="listes">
              <section className="content mt-2">
                <div className="container-fluid">
                  <div className="row">
                    <div className="col-12">
                      <div className="card">
                        <div className="card-header p-2" style={{ backgroundColor: "#f8f8f8" }}>
                          <div className="row mt-3 mb-3">
                            {/* Sélection d'un employé */}
                            <div className="col-md-12">
                              <label>Employé</label>
                              <Select
                                value={selectedEmploye}
                                onChange={handleEmployeSelect}
                                options={employes.map(emp => ({
                                  value: emp.id,
                                  label: `${emp.User.nom}  ${emp.User.prenom}   date de naissance :${moment(emp.datenaiss).format('YYYY-MM-DD')}`,
                                }))}
                                placeholder="Sélectionner un employé"
                              />
                            </div>
                            {/* Champs pour les détails de l'employé */}
                            <div className="col-md-3">
                              <label>Nom</label>
                              <input
                                type="text"
                                className="form-control"
                                value={employeDetails.nom?employeDetails.nom:''}
                                readOnly
                              />
                            </div>
                            <div className="col-md-3">
                              <label>Prénom</label>
                              <input
                                type="text"
                                className="form-control"
                                value={employeDetails.prenom?employeDetails.prenom:''}
                                readOnly
                              />
                            </div>
                            <div className="col-md-3">
                              <label>Date de naissance</label>
                              <input
                                type="text"
                                className="form-control"
                                value={employeDetails.dateNaissance?employeDetails.dateNaissance:''}
                                readOnly
                              />
                            </div>
                            <div className="col-md-3">
                              <label>Lieu de naissance</label>
                              <input
                                type="text"
                                className="form-control"
                                value={employeDetails.lieuNaissance?employeDetails.lieuNaissance:''}
                                readOnly
                              />
                            </div>
                            <div className="col-md-3">
                              <label>Poste</label>
                              <input
                                type="text"
                                className="form-control"
                                value={employeDetails.poste?employeDetails.poste:''}
                                readOnly
                              />
                            </div>
                            <div className="col-md-3">
                              <label>Date de recrutement</label>
                              <input
                                type="text"
                                className="form-control"
                                value={employeDetails.dateRecrutement?employeDetails.dateRecrutement:''}
                                readOnly
                              />
                            </div>
                            <div className="col-md-3">
                              <label>Date de fin du contrat</label>
                              <input
                                type="text"
                                className="form-control"
                                value={employeDetails.dateFinContrat?employeDetails.dateFinContrat:''}
                                readOnly
                              />
                            </div>
                            <div className="col-md-3">
                              <label>N° sécurité sociale</label>
                              <input
                                type="text"
                                className="form-control"
                                value={employeDetails.NumAS?employeDetails.NumAS:''}
                                readOnly
                              />
                            </div>
                            <div className="col-md-3">
                              <label>Date de cessation de travail</label>
                              <input
                                type="text"
                                className="form-control"
                                value={employeDetails.DCT?employeDetails.DCT:''}
                                readOnly
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Éditeur Jodit */}
                <div className="col-12 mt-3">
                  <label htmlFor="modeleTexte">Modèle de document :</label>
                 
                  <JoditEditor
  ref={editor}
  value={content}
  config={config}
  tabIndex={1}
  onBlur={(newContent) => setContent(newContent)}
  onChange={(newContent) => setContent(newContent)}
/>

                  
                </div>
              </section>
            </div>
          </div>
          <ToastContainer />
        </div>
      </div>
    </>
  );
};
export default MesdocImprimer;