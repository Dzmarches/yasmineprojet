import React, { useState, useRef, useEffect,useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import Select from "react-select";
import axios from "axios";
import JoditEditor from "jodit-react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import rh from "../../../assets/imgs/employe.png";
import "./document.css";

const DocumentsEmployesModifier = () => {
  const [nom, setNom] = useState("");
  const [description, setDescription] = useState("");
  const [selectedModule, setSelectedModule] = useState(null);
  const [content, setContent] = useState("");
  const [previousContent, setPreviousContent] = useState(""); // Pour stocker le contenu précédent
  const editor = useRef(null);
  const { id } = useParams();

  const moduleOptions = [
    { value: "employe", label: "Employé" },
    { value: "eleve", label: "Élève" },
  ];

  useEffect(() => {
    if (id) {
      fetchAttestationData();
    }
  }, [id]);

  const fetchAttestationData = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
          alert("Vous devez être connecté");
          return;
      }
      const response = await axios.get(`http://localhost:5000/attestation/info/${id}`,
        {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
      },
      }
    );
      const data = response.data;

      setNom(data.nom);
      setDescription(data.description);
      setSelectedModule(moduleOptions.find(option => option.value === data.module));
      setContent(data.modeleTexte); // Set le contenu de Jodit
      setPreviousContent(data.modeleTexte); // Initialiser le contenu précédent
    } catch (error) {
      console.error("Erreur lors de la récupération des données", error);
      alert("Échec de la récupération des données.");
    }
  };

  // Fonction pour extraire les URLs des images
  const extractImageUrls = (htmlContent) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, 'text/html');
    const images = doc.querySelectorAll('img');
    return Array.from(images).map(img => img.src);
  };

  // Fonction pour supprimer les images sur le serveur
  const deleteImagesOnServer = async (imageUrls) => {
    try {
      await axios.post('http://localhost:5000/attestation/deleteImages', { imageUrls });
      console.log('Images supprimées avec succès');
    } catch (error) {
      console.error('Erreur lors de la suppression des images :', error);
    }
  };

  // Gestionnaire de changement de contenu dans Jodit
  const handleEditorChange = (newContent) => {
    // Extraire les URLs des images avant et après la modification
    const previousImages = extractImageUrls(previousContent);
    const currentImages = extractImageUrls(newContent);

    // Trouver les images supprimées
    const deletedImages = previousImages.filter(url => !currentImages.includes(url));

    // Supprimer les fichiers physiques correspondants
    if (deletedImages.length > 0) {
      deleteImagesOnServer(deletedImages);
    }

    // Mettre à jour le contenu précédent et actuel
    setPreviousContent(newContent);
    setContent(newContent);
  };

  // Sauvegarder le document
  const handleSave = async () => {
    if (!nom || !selectedModule || !content) {
      console.log('content is',content)
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }
    try {
      const token = localStorage.getItem("token");
      if (!token) {
          alert("Vous devez être connecté");
          return;
      }
      const response = await axios.put(`http://localhost:5000/attestation/modifier/${id}`, {
        nom,
        description,
        modeleTexte: content,
        module: selectedModule.value,
      },
      { headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
    },}
  );

      alert(response.data.message);
    } catch (error) {
      console.error("Erreur lors de la mise à jour de l'attestation", error);
      alert("Échec de la mise à jour de l'attestation.");
    }
  };

 
  
    const [ModeleDoc, setModeleDoc] = useState("");
      // Liste des champs disponibles
      const availableFields = [
        { field: "[nom]", description: "Nom de l'employé" },
        { field: "[prenom]", description: "Prénom de l'employé" },
        { field: "[datenaiss]", description: "Date de naissance de l'employé" },
        { field: "[Lieunais]", description: "Lieu de naissance de l'employé" },
        { field: "[poste]", description: "Poste de l'employé" },
        { field: "[daterecru]", description: "Date de recrutement de l'employé" },
        { field: "[dateCesT]", description: "Date de cessation de travail" },
        { field: "[dateToday]", description: "Date du jour" },
        { field: "[N°AS]", description: "Numéro de sécurité sociale de l'employé" },
        { field: "[nomecole]", description: "Nom de l'école" },
        { field: "[nomecoleP]", description: "Nom de l'école principale" },
      ];
      const availableFieldsEleve = [
        { field: "[nomE]", description: "Nom de l'élève en FR" },
        { field: "[nomAbE]", description: "Nom de l'élève en AB" },
        { field: "[prenomE]", description: "Prénom de l'élève en FR" },
        { field: "[prenomAbE]", description: "Prénom de l'élève en AB" },
        { field: "[datenaissE]", description: "Date de naissance de l'élève" },
        { field: "[LieunaisE]", description: "Lieu de naissance de l'élève en FR" },
        { field: "[LieunaisAbE]", description: "Lieu de naissance de l'élève en AB" },
        { field: "[AdresseE]", description: "Adresse de l'élève en FR" },
        { field: "[AdresseAbE]", description: "Adresse de l'élève en AB" },
        { field: "[LieunaisAbE]", description: "Lieu de naissance de l'élève en AB" },
        { field: "[dateTodayE]", description: "Date du jour" },
        { field: "[nomecoleE]", description: "Nom de l'école" },
        { field: "[nomecolePE]", description: "Nom de l'école principale" },
        { field: "[adresseE]", description: "adresse de l'école " },
        { field: "[adressePE]", description: "adresse de l'école principale" },
        { field: "[NV]", description: "Niveau de l'élève  " },
        { field: "[nomP]", description: "Nom du responsable de  l'élève" },
        { field: "[prenomP]", description: "Prenom du responsable de  l'élève" },
        { field: "[EmailP]", description: "Email du responsable de  l'élève" },
        { field: "[TelP]", description: "Num Telephone du responsable de  l'élève" },
        { field: "[AdresseP]", description: "Adresse du responsable de  l'élève" },
      ];
      const availableFieldsElevePaiment = [
        { field: "[codeC]", description: "Code du Contrat Eleve" },
        { field: "[AS]", description: "Année Scolaire" },
        { field: "[ddP]", description: "Date Début Paiment Eleve" },
        { field: "[dfP]", description: "Date Fin Paiment Eleve" },
        { field: "[dcC]", description: "Date Création Contrat Eleve" },
        { field: "[totalC]", description: "Total Paiment  Contrat Eleve" },
        { field: "[FraisInsc]", description: "Frais Inscription de l'élève Eleve" },
        { field: "[TypeP]", description: "Type de Paiment Eleve" },
        { field: "[ModeP]", description: "Mode de Paiment Eleve" },
        { field: "[planning]", description: "Planning de Paiment Eleve" },
        { field: "[detail]", description: "Details paiment Eleve" },
        { field: "[dateToday]", description: "Date du jour" },
       
      ];
    
      // Fonction pour insérer un champ dans l'éditeur
      const insertField = (field) => {
        if (editor.current) {
          editor.current.selection.insertHTML(field);
        }
      };

     // Fonction pour ouvrir une modale avec les champs disponibles
     const openFieldModal = (fields) => {

      // Fermer toute ancienne modale si elle existe
      const existingModal = document.getElementById('custom-field-modal');
      if (existingModal) {
        document.body.removeChild(existingModal);
      }
    
      const modal = document.createElement('div');
      modal.id = 'custom-field-modal'; // ID pour gestion unique
      modal.style.position = 'fixed';
      modal.style.top = '50%';
      modal.style.left = '50%';
      modal.style.transform = 'translate(-50%, -50%)';
      modal.style.backgroundColor = 'white';
      modal.style.padding = '20px';
      modal.style.border = '1px solid #ccc';
      modal.style.zIndex = '1000';
      modal.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
      modal.style.maxHeight = '70vh'; 
      modal.style.overflowY = 'auto'; 
    
      const closeModal = () => {
        const modalToRemove = document.getElementById('custom-field-modal');
        if (modalToRemove) {
          document.body.removeChild(modalToRemove);
        }
      };
    
      modal.innerHTML = `
        <div>
          <h3>Champs disponibles</h3>
          <ul style="list-style: none; padding: 0;">
            ${fields.map((field, index) => `
              <li style="cursor: pointer; padding: 5px;" onclick="window.insertFieldIntoEditor('${field.field}')">
                <strong>${field.field}</strong> - ${field.description}
              </li>
            `).join('')}
          </ul>
          <button onclick="window.closeModal()" style="margin-top: 10px;">Fermer</button>
        </div>
      `;
    
      document.body.appendChild(modal);
    
      window.insertFieldIntoEditor = (field) => {
        insertField(field);
        closeModal();
      };
      window.closeModal = closeModal;
    };

    useEffect(()=>{
      document.addEventListener("input", function () {
      const table = document.querySelector("table");
      if (!table) return;
  
      // Récupère toutes les lignes du tableau (sauf l'en-tête)
      const rows = table.querySelectorAll("tr:not(:first-child)");
  
      rows.forEach(row => {
          const cells = row.querySelectorAll("td");
          if (cells.length >= 3) {
              let a = parseFloat(cells[0].innerText) || 0;
              let b = parseFloat(cells[1].innerText) || 0;
              cells[2].innerText = a + b; // Met à jour la colonne résultat
          }
      });
  });
  

    },[])

      const handlePrint = () => {
        // console.log('employe',employeDetails)
        console.log('NomDoc',nom)
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
        // @page { margin: 0 !important; padding: 40px !important; }
        style.innerHTML = `
        @page{margin:0;}
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
          disablePlugins: ["speechRecognize", "video", "print"],
          extraButtons: [
            {
              name: "imprimer",
              tooltip: "Imprimer",
              title: "Documents à imprimer",
              iconURL: "https://img.icons8.com/ios-filled/50/000000/print.png",
              exec: () => {
                handlePrint(); 
              },
            },
            {
              name: 'insertField',
              iconURL: 'https://icon-library.com/images/insert-icon/insert-icon-15.jpg',
              tooltip: 'Insérer un champ',
              exec: function (editor) {
                openFieldModal(); 
              }
            },
            ,  {
              name: 'insertField',
              iconURL: 'https://icon-library.com/images/insert-icon/insert-icon-15.jpg',
              tooltip: 'Insérer les  champs pour Elève ',
              exec: function (editor) {
                openFieldModal(availableFieldsEleve);
              }
            }
            ,  {
              name: 'insertField',
              iconURL: 'https://icon-library.com/images/insert-icon/insert-icon-15.jpg',
              tooltip: 'les chmaps de paiment pour Elève ',
              exec: function (editor) {
                openFieldModal(availableFieldsElevePaiment);
              }
            }
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
            Modifier le document 
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
                          <div className="row mt-3">

                            {/* Nom du document */}
                            <div className="col-6">
                              <label htmlFor="nomdoc">Nom*</label>
                              <input
                                type="text"
                                id="nomdoc"
                                name="nomdoc"
                                className="form-control"
                                value={nom}
                                onChange={(e) => setNom(e.target.value)}
                              />
                            </div>

                            {/* Sélection du module */}
                            <div className="col-6">
                              <label htmlFor="module">Module*</label>
                              <Select
                                options={moduleOptions}
                                value={selectedModule}
                                onChange={setSelectedModule}
                                placeholder="Sélectionnez un module"
                              />
                            </div>

                            {/* Description */}
                            <div className="col-12 mt-3">
                              <label htmlFor="desc">Description</label>
                              <textarea
                                name="description"
                                id="desc"
                                className="form-control"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                              ></textarea>
                            </div>

                            {/* Bouton de sauvegarde */}
                            <div className="col-12 text-center mt-3 mb-3">
                              <button className="btn btn-primary" onClick={handleSave}>
                                Modifier
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Modèle de document (éditeur Jodit) */}
                <div className="col-12 mt-3">
                  <label htmlFor="modeleTexte">Modèle de document :</label>
                  <JoditEditor
                    ref={editor}
                    value={content}
                    config={config}
                    tabIndex={1}
                    onBlur={(newContent) => handleEditorChange(newContent)}
                    onChange={(newContent) => handleEditorChange(newContent)}
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

export default DocumentsEmployesModifier;