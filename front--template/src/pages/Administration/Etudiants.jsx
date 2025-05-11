import React, { useState, useEffect } from 'react';
import axios from 'axios';
import QRCode from 'react-qr-code';

import etudiant from '../../assets/imgs/etudiant.png';
import edite from '../../assets/imgs/edit.png';
import delet from '../../assets/imgs/delete.png';
import excel from '../../assets/imgs/excel.png';
import importexel from '../../assets/imgs/import.png';
import printer from '../../assets/imgs/printer.png';
import add from '../../assets/imgs/add.png';
import sante from '../../assets/imgs/healthcare.png';
import User from '../../assets/imgs/user.png';
import familyIcon from '../../assets/imgs/family.png';
import healthIcon from '../../assets/imgs/healthcare.png';
import security from '../../assets/imgs/folder.png';
import studentcard from '../../assets/imgs/student-card.png';
import classe from '../../assets/imgs/classe.png';
import { Link, useNavigate } from 'react-router-dom';
import { Modal, Button } from 'react-bootstrap';
import * as XLSX from 'xlsx';
import Select from 'react-select';
import ProfileEmploye from './profil';
import './PrintStyles.css';
import moment from 'moment';
// Définir les colonnes par défaut en dehors du composant
const defaultColumns = [
  { key: 'photo', label: 'photo' },
  { key: 'nom', label: 'Nom & Prénom' },
  { key: 'prenom', label: 'Nom & Prénom (Arabe)' },
  { key: 'numinscription', label: 'Numéro d\'inscription' },
  { key: 'cycle', label: 'Cycle' },
  { key: 'numidentnational', label: 'Numéro d\'Identification National' },
];
const Etudiants = () => {

  const [ecoleInfo, setEcoleInfo] = useState(null);
  const [showCard, setShowCard] = useState(false);
  const [selectedEleve, setSelectedEleve] = useState(null);
  const [showHealthModal, setShowHealthModal] = useState(false);
  const [healthInfo, setHealthInfo] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [fileName, setFileName] = useState('');
  const [niveaux, setNiveaux] = useState([]);
  const [ecole, setEcoles] = useState([]);
  const [sections, setSections] = useState([]);
  const [infos, setInfos] = useState(null);
  const [eleves, setEleves] = useState([]);
  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [additionalColumns, setAdditionalColumns] = useState([]);
  const navigate = useNavigate();
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [profileInfo, setProfileInfo] = useState(null);
  const [showPrintOptions, setShowPrintOptions] = useState(false);
  const [showPrintOptionsME, setShowPrintOptionsME] = useState(false);
  const [selectedPrintOption, setSelectedPrintOption] = useState('');
  const [printOptions, setPrintOptions] = useState([]);
  const [selectedEcole, setSelectedEcole] = useState(null);
  const [filteredEleves, setFilteredEleves] = useState([]);
  const [filteredEcoles, setFilteredEcoles] = useState([]);

  const [selectedEleves, setSelectedEleves] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  // Combiner les colonnes par défaut et les colonnes supplémentaires
  const columns = [...defaultColumns, ...additionalColumns];

  const infosOptions = [
    { value: 'A', label: 'Elève sans Section' },
    { value: 'B', label: 'Elève sans Compte' },
  ];

  const options = [
    { value: 'sans_section', label: 'Élève sans section' },
    { value: 'sans_compte', label: 'Élève sans compte' },
  ];

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);



  const handleSelectEleve = (id) => {
    setSelectedEleves(prev =>
      prev.includes(id)
        ? prev.filter(eleveId => eleveId !== id)
        : [...prev, id]
    );

  };

  const handleSelectAll = (e) => {
    const isChecked = e.target.checked;
    setSelectAll(isChecked);
    if (isChecked) {
      setSelectedEleves(currentItems.map(eleve => eleve.id));
    } else {
      setSelectedEleves([]);
    }
  };
  const handleDownloadTemplate = () => {
    const ws = XLSX.utils.aoa_to_sheet([["Nom", "Prénom", "Email"]]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Etudiants");
    XLSX.writeFile(wb, "etudiants_template.xlsx");
  };

  const handleFileChange = (event) => {
    setFileName(event.target.files[0].name);
  };

  const handleImport = () => {
    alert('Importation en cours...');
  };

  // const indexOfLastItem = currentPage * itemsPerPage;
  // const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  // const currentItems = Array.isArray(eleves) ? eleves.slice(indexOfFirstItem, indexOfLastItem) : [];

  // const totalPages = Math.ceil(eleves.length / itemsPerPage);

  const displayedEleves = filteredEleves.length > 0 ? filteredEleves : eleves;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = Array.isArray(filteredEleves)
    ? filteredEleves.slice(indexOfFirstItem, indexOfLastItem)
    : [];
  const totalPages = Math.ceil(displayedEleves.length / itemsPerPage);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const pageNumbers = [];
  for (let i = Math.max(1, currentPage - 2); i <= Math.min(currentPage + 2, totalPages); i++) {
    pageNumbers.push(i);
  }

  useEffect(() => {
    const fetchSections = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.error('Aucun token trouvé. Veuillez vous connecter.');
          return;
        }

        const response = await axios.get('http://localhost:5000/sections', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setSections(response.data);
      } catch (error) {
        console.error('Erreur lors de la récupération des sections', error);
      }
    };

    const fetchNiveaux = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.error('Aucun token trouvé. Veuillez vous connecter.');
          return;
        }

        const response = await axios.get('http://localhost:5000/niveaux', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setNiveaux(response.data);
      } catch (error) {
        console.error('Erreur lors de la récupération des niveaux', error);
      }
    };

    const fetchEleves = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.error('Aucun token trouvé. Veuillez vous connecter.');
          return;
        }

        console.log("🟢 Envoi de la requête GET /eleves");
        const response = await axios.get('http://localhost:5000/eleves', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // if (response.data && response.data.listeEleves) {
        //   console.log("✅ Réponse reçue :", response.data);
        //   setEleves(response.data.listeEleves);
        //   setFilteredEleves(response.data.listeEleves); // Initialisez filteredEleves
        // } 
        console.log('les eleves', response.data.listeEleves)
        if (response.data && response.data.listeEleves) {
          setEleves(response.data.listeEleves);
          setFilteredEleves(response.data.listeEleves); // Initialiser filteredEleves
        } else {
          console.error('Aucun élève trouvé');
        }
      } catch (error) {
        if (error.response) {
          console.error('Erreur serveur:', error.response.data);
        } else if (error.request) {
          console.error('Pas de réponse du serveur');
        } else {
          console.error('Erreur lors de la configuration de la requête:', error.message);
        }
      }
    };
    fetchSections();
    fetchNiveaux();
    fetchEleves();
  }, []);

  const handleInfosChange = (selectedOption) => {
    setInfos(selectedOption);
  };

  const handleChange = (selected) => {
    setSelectedOptions(selected);
    setAdditionalColumns(selected.map(option => ({ key: option.value, label: option.label })));
  };

  const formatOptionLabel = ({ label, value }, { context }) => {
    if (context === 'menu' && selectedOptions.some((opt) => opt.value === value)) {
      return <div style={{ color: 'blue' }}>{label}</div>;
    }
    return label;
  };

  const handleExport = () => {
    const ws = XLSX.utils.json_to_sheet(eleves);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Etudiants");
    XLSX.writeFile(wb, "etudiants_export.xlsx");
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('Aucun token trouvé. Veuillez vous connecter.');
        return;
      }

      await axios.delete(`http://localhost:5000/eleves/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Mettre à jour la liste des élèves après suppression
      setEleves(prev => prev.filter(eleve => eleve.id !== id));
    } catch (error) {
      console.error("Erreur lors de la suppression de l'élève", error);
    }
  };

  const handleEdit = async (id) => {
    console.log("🟢 ID de l'élève cliqué :", id);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('Aucun token trouvé. Veuillez vous connecter.');
        return;
      }

      const response = await axios.get(`http://localhost:5000/eleves/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("📌 Réponse complète de l'API :", response.data);

      const eleve = response.data.eleve;

      if (eleve && eleve.id) {
        console.log("✅ ID extrait :", eleve.id);
        navigate(`/etudiants/modifiereleve/${eleve.id}`);
      } else {
        console.error("❌ ID de l'élève manquant !");
      }
    } catch (error) {
      console.error("❌ Erreur lors de la récupération de l'élève :", error);
    }
  };

  const handleShowHealthModal = async (id) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Aucun token trouvé. Veuillez vous connecter.');

      const response = await axios.get(`http://localhost:5000/eleves/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("Données de l'élève reçues :", response.data); // Vérifiez ici
      setHealthInfo(response.data.eleve); // Assurez-vous que c'est bien `response.data.eleve`
      setShowHealthModal(true);
    } catch (error) {
      console.error("Erreur lors de la récupération des informations de santé", error);
    }
  };

  const handleCloseHealthModal = () => {
    setShowHealthModal(false);
    setHealthInfo(null);
  };
  const handleShowProfileModal = async (id) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Aucun token trouvé. Veuillez vous connecter.');

      // Récupérer les informations de base de l'élève
      const eleveResponse = await axios.get(`http://localhost:5000/eleves/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Récupérer les informations de mot de passe
      const passwordsResponse = await axios.get(`http://localhost:5000/eleves/${id}/passwords`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Fusionner les données
      const profileData = {
        ...eleveResponse.data.eleve,
        passwords: passwordsResponse.data
      };

      console.log("Données complètes reçues :", {
        ...profileData,
        // Affichage des mots de passe dans la console (pour débogage seulement)
        User: {
          ...profileData.User,
          password: `[HASH:${profileData.User?.password?.substring(0, 8)}...]`
        },
        Parents: profileData.Parents?.map(parent => ({
          ...parent,
          User: {
            ...parent.User,
            password: `[HASH:${parent.User?.password?.substring(0, 8)}...]`
          }
        }))
      });

      setProfileInfo(profileData);
      setShowProfileModal(true);
    } catch (error) {
      console.error("Erreur lors de la récupération des informations de l'élève :", error);
    }
  };

  const handleCloseProfileModal = () => {
    setShowProfileModal(false);
    setProfileInfo(null);
  };


  const handleCloseCard = () => {
    setShowCard(false);
    setSelectedEleve(null);
  };


  const fetchEcoleInfo = async (ecoleId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('Aucun token trouvé. Veuillez vous connecter.');
        return;
      }

      const response = await axios.get(`http://localhost:5000/ecole/${ecoleId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setEcoleInfo(response.data);
      console.log('infos ecole', response.data)
    } catch (error) {
      console.error('Erreur lors de la récupération des informations de l\'école', error);
    }
  };

  // Modifiez handleShowCard pour inclure la récupération des infos de l'école
  const handleShowCard = async (eleve) => {
    setSelectedEleve(eleve);
    setShowCard(true);

    setEcoleInfo(null);  // Réinitialisation pour éviter d'anciennes données

    if (eleve.ecoleId) {
      await fetchEcoleInfo(eleve.ecoleId); // Assure la récupération AVANT d'afficher
    }
  };


  useEffect(() => {
    const fetchEcoles = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.error('Aucun token trouvé. Veuillez vous connecter.');
          return;
        }

        const response = await axios.get('http://localhost:5000/ecoles', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Vérifier que les données contiennent bien les champs nécessaires
        const ecolesWithDefaults = response.data.map(ecole => ({
          ...ecole,
          nomecole: ecole.nomecole || '', // Valeur par défaut si undefined
          nom_arecole: ecole.nom_arecole || '', // Valeur par défaut si undefined
        }));

        setEcoles(ecolesWithDefaults);
        setFilteredEcoles(ecolesWithDefaults);
      } catch (error) {
        console.error('Erreur lors de la récupération des écoles', error);
      }
    };
    fetchEcoles();
  }, []);
  const filterElevesByEcole = async (ecoleId) => {
    if (!ecoleId) {
      setFilteredEleves(eleves);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `http://localhost:5000/eleves/ecole/${ecoleId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Formater les données comme dans la route principale
      const elevesFormatted = response.data.listeEleves.map(eleve => {
        let ecoleInfo = null;

        if (eleve.EcolePrincipale) {
          ecoleInfo = {
            id: eleve.EcolePrincipale.id,
            nomecole: eleve.EcolePrincipale.nomecole,
            logo: eleve.EcolePrincipale.logo
          };
        } else if (eleve.UserEcoles && eleve.UserEcoles.length > 0) {
          const userEcole = eleve.UserEcoles[0];
          if (userEcole.EcoleAssociee) {
            ecoleInfo = {
              id: userEcole.EcoleAssociee.id,
              nomecole: userEcole.EcoleAssociee.nomecole,
              logo: userEcole.EcoleAssociee.logo
            };
          }
        }
        return {
          ...eleve,
          ecoleInfo,
          ecoleName: ecoleInfo ? ecoleInfo.nomecole : 'N/A'
        };
      });

      setFilteredEleves(elevesFormatted || []);
    } catch (error) {
      console.error("Erreur lors du filtrage par école", error);
      setFilteredEleves([]);
    }
  };

  const handleToggleStatus = async (eleveId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert("Vous devez être connecté");
        return;
      }

      // Trouver l'élève dans les données
      const eleveToUpdate = eleves.find(e => e.id === eleveId);
      if (!eleveToUpdate) {
        console.error("Élève non trouvé");
        return;
      }

      // Nouveau statut
      const currentStatus = eleveToUpdate.statuscompte;
      const newStatus = currentStatus === "activer" ? "désactiver" : "activer";

      // Appel API pour mettre à jour le statut
      await axios.put(
        `http://localhost:5000/eleves/users/${eleveId}/statut`, // Utilise eleveId ici
        { statuscompte: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      // Mise à jour locale
      const updatedEleves = eleves.map(eleve => {
        if (eleve.id === eleveId) {
          return {
            ...eleve,
            statuscompte: newStatus,
            dateAD: newStatus === 'désactiver' ? new Date().toISOString() : null
          };
        }
        return eleve;
      });

      setEleves(updatedEleves);
      setFilteredEleves(updatedEleves);

    } catch (error) {
      console.error("Erreur lors de la mise à jour du statut:", error);
      alert("Une erreur est survenue lors de la mise à jour du statut");
    }
  };




  //dounia
  useEffect(() => {
    handleListeDE()
  }, [])

  const handleListeDE = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Vous devez être connecté");
        return;
      }
      const response = await axios.get('http://localhost:5000/attestation/liste',
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      const filteredDocs = response.data.filter((doc) => doc.module === "eleve" && doc.code === "RPE");
      const options = filteredDocs.map((doc) => ({
        value: doc.id,
        label: doc.nom,
        modele: doc.modeleTexte
      }));

      const ttdoc = response.data.filter((doc) => doc.module === "eleve");
      const optionsttdoc = ttdoc.map((doc) => ({
        value: doc.id,
        label: doc.nom,
        modele: doc.modeleTexte
      }));

      setPrintOptions(optionsttdoc);
      return options
    } catch (error) {
      console.log("Erreur lors de la récupération des attestations", error);
    }
  };

  const printrecu = async (id) => {
    const eleve = eleves.find(plan => plan.id === id);
    console.log('selectedPlan', eleve);
    const reponse = await handleListeDE();

    const modeleText = reponse[0].modele;

    let nomR = "", prenomR = "", emailR = "", telR = "", adresseR = "";
    const pere = eleve?.Eleve?.Parents?.find(p => p.typerole === "Père");
    const mere = eleve?.Eleve?.Parents?.find(p => p.typerole === "Mère");
    const tuteur = eleve?.Eleve?.Parents?.find(p => p.typerole === "Tuteur");

    let responsable = null;
    if (tuteur) {
      responsable = tuteur;
    } else if (pere && mere) {
      responsable = pere;
    } else if (pere) {
      responsable = pere;
    } else if (mere) {
      responsable = mere;
    }
    if (responsable?.User) {
      nomR = responsable.User.nom || "";
      prenomR = responsable.User.prenom || "";
      emailR = responsable.User.email || "";
      telR = responsable.User.telephone || "";
      adresseR = responsable.User.adresse || "";
    }

    if (!eleve || !modeleText) {
      alert('plannig ou model du contrat non défini')
      return;
    }
    const modeleTextupdate = modeleText
      .replace(/\[nomecolePE\]/g, eleve?.EcolePrincipal?.nomecole || "")
      .replace(/\[logoecoleP\]/g,
        `<img src="http://localhost:5000${eleve?.EcolePrincipal?.logo}" alt="Logo de l'école" style="max-width: 70px; max-height: 70px;">`
      )
      .replace(/\[adressePE\]/g, eleve?.EcolePrincipal?.adresse || "")
      .replace(/\[nomE\]/g, eleve?.nom || "")
      .replace(/\[nomAbE\]/g, eleve?.nom_ar || "")
      .replace(/\[prenomE\]/g, eleve?.prenom || "")
      .replace(/\[prenomAbE\]/g, eleve?.prenom_ar || "")
      .replace(/\[LieunaisE\]/g, eleve?.lieuxnaiss || "")
      .replace(/\[LieunaisAbE\]/g, eleve?.adresse || "")
      .replace(/\[AdresseE\]/g, eleve?.prenom_ar || "")
      .replace(/\[AdresseAbE\]/g, eleve?.adresse_ar || "")
      .replace(/\[datenaissE\]/g, eleve?.datenaiss ? moment(eleve.datenaiss).format("DD/MM/YYYY") : "")
      .replace(/\[numInscription\]/g, eleve?.numinscription || "")
      .replace(/\[FraisInsc\]/g, eleve?.fraixinscription || "")
      .replace(/\[NV\]/g, `${eleve?.Niveaux?.nomniveau} ${eleve?.Niveaux?.cycle} ` || "")
      //responsable
      .replace(/\[nomP\]/g, nomR || "")
      .replace(/\[prenomP\]/g, prenomR || "")
      .replace(/\[EmailP\]/g, emailR || "")
      .replace(/\[TelP\]/g, telR || "")
      .replace(/\[AdresseP\]/g, adresseR || "")
      .replace(/\[dateToday\]/g, moment().format("DD/MM/YYYY"))
      //contrat
      .replace(/\[totalC\]/g, eleve?.Eleve.fraixinscription || "")
      .replace(/\[ModeP\]/g, eleve?.Eleve?.mode_paiement || "")
      .replace(/\[detail\]/g, `Frais d'Inscription `
      )

    //plannig
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    document.body.appendChild(iframe);
    const iframeDocument = iframe.contentWindow.document;
    iframeDocument.open();
    // @page{ margin: 0;}
    iframeDocument.write(`
                  <html>
                    <head>
                      <title>${eleve?.nom}${eleve?.prenom}</title>
                      <style>
                        @media print {
                          body { margin: 0 !important ; padding: 40px !important ; }
                          table {
                            border-collapse: collapse;
                            width: 100%;
                          }
                          table, th, td {
                            border: 1px solid #EBEBEB;
                          }
                        }
                      </style>
                    </head>
                    <body>
                    <body>
                      <div class="containerEditor">
                        <div class="ql-editor">
                          ${modeleTextupdate}
                        </div>
                      </div>
                    </body>
                  </html>
                `);
    iframeDocument.close();
    const originalTitle = document.title;
    document.title = `${eleve?.nom}.${eleve?.prenom}`;
    setTimeout(() => {
      iframe.contentWindow.focus();
      iframe.contentWindow.print();
      document.title = originalTitle;
      document.body.removeChild(iframe);
    }, 1000);
  };
  // imprimer
  // Gérer le clic sur le bouton "Imprimer"
  const handlePrintClick = () => {
    setShowPrintOptions(!showPrintOptions);
  };
  const handlePrintOptionSelect = (option) => {
    if (selectedEleves.length === 0) {
      alert("Veuillez sélectionner au moins un élève");
      return;
    }
    // Trouver le modèle complet dans printOptions
    const selectedDoc = printOptions.find(doc => doc.value === option.value);
    if (selectedDoc) {
      handlePrintSelected(selectedEleves, selectedDoc.modele, selectedDoc.label);
    }
    setShowPrintOptions(false);
  };


  const handlePrintSelected = (selectedElevesIds, modele, label) => {
    if (selectedElevesIds.length === 0) {
      alert("Veuillez sélectionner au moins un élève");
      return;
    }
    // Ouvrir une nouvelle fenêtre pour l'impression
    const printWindow = window.open("", "_blank");
    let htmlContent = `
        <html>
          <head>
            <title>${label}</title>
            <style>
              @page { margin: 0; }
              body { padding: 20px; }
              .document-container { 
                margin-bottom: 50px; 
                page-break-after: always;
              }
              .document-container:last-child { 
                page-break-after: auto; 
              }
            </style>
          </head>
          <body>
      `;

    // Pour chaque élève sélectionné
    selectedElevesIds.forEach(id => {
      const eleve = eleves.find(e => e.id === id);
      if (!eleve) return;



      let nomR = "", prenomR = "", emailR = "", telR = "", adresseR = "";
      const pere = eleve?.Eleve?.Parents?.find(p => p.typerole === "Père");
      const mere = eleve?.Eleve?.Parents?.find(p => p.typerole === "Mère");
      const tuteur = eleve?.Eleve?.Parents?.find(p => p.typerole === "Tuteur");

      let responsable = null;
      if (tuteur) {
        responsable = tuteur;
      } else if (pere && mere) {
        responsable = pere;
      } else if (pere) {
        responsable = pere;
      } else if (mere) {
        responsable = mere;
      }
      if (responsable?.User) {
        nomR = responsable.User.nom || "";
        prenomR = responsable.User.prenom || "";
        emailR = responsable.User.email || "";
        telR = responsable.User.telephone || "";
        adresseR = responsable.User.adresse || "";
      }

      console.log('eleve', eleve)
      let modeleText = modele
        .replace(/\[nomecolePE\]/g, eleve?.EcolePrincipal?.nomecole || "")
        .replace(/\[logoecoleP\]/g,
          `<img src="http://localhost:5000${eleve?.EcolePrincipal?.logo}" alt="Logo de l'école" style="max-width: 70px; max-height: 70px;">`
        )
        .replace(/\[adressePE\]/g, eleve?.EcolePrincipal?.adresse || "")
        .replace(/\[nomE\]/g, eleve?.nom || "")
        .replace(/\[nomAbE\]/g, eleve?.nom_ar || "")
        .replace(/\[prenomE\]/g, eleve?.prenom || "")
        .replace(/\[prenomAbE\]/g, eleve?.prenom_ar || "")
        .replace(/\[LieunaisE\]/g, eleve?.lieuxnaiss || "")
        .replace(/\[LieunaisAbE\]/g, eleve?.adresse || "")
        .replace(/\[AdresseE\]/g, eleve?.prenom_ar || "")
        .replace(/\[AdresseAbE\]/g, eleve?.adresse_ar || "")
        .replace(/\[datenaissE\]/g, eleve?.datenaiss ? moment(eleve.datenaiss).format("DD/MM/YYYY") : "")
        .replace(/\[numInscription\]/g, eleve?.numinscription || "")
        .replace(/\[FraisInsc\]/g, eleve?.fraixinscription || "")
        .replace(/\[NV\]/g, `${eleve?.Niveaux?.nomniveau} ${eleve?.Niveaux?.cycle} ` || "")
        //responsable
        .replace(/\[nomP\]/g, nomR || "")
        .replace(/\[prenomP\]/g, prenomR || "")
        .replace(/\[EmailP\]/g, emailR || "")
        .replace(/\[TelP\]/g, telR || "")
        .replace(/\[AdresseP\]/g, adresseR || "")
        .replace(/\[dateToday\]/g, moment().format("DD/MM/YYYY"))
        //contrat
        .replace(/\[totalC\]/g, eleve?.Eleve.fraixinscription || "")
        .replace(/\[ModeP\]/g, eleve?.Eleve?.mode_paiement || "")
        .replace(/\[detail\]/g, `Frais d'Inscription `
        )

      htmlContent += `
          <div class="document-container">
            ${modeleText}
          </div>
        `;
    });

    htmlContent += `</body></html>`;

    printWindow.document.write(htmlContent);
    printWindow.document.close();

    // Délai pour permettre le chargement avant impression
    setTimeout(() => {
      printWindow.focus();
      printWindow.print();
    }, 500);
  };
  return (
    <>

      <style>
        {`
        .td-photo {
          padding: 0;
          transition: transform 0.5s ease;
        }

        .td-photo .photo-circle {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          overflow: hidden;
          margin: auto;
          transition: transform 0.5s ease;
        }

        .td-photo .photo-circle img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s ease;
        }

        .td-photo:hover .photo-circle {
          transform: scale(2.5);
          z-index: 20;
          position: relative;
        }
      `}
      </style>
      <nav>
        <Link to="/dashboard" className="text-primary">Accueil</Link>
        <span> / </span>
        <span>Gestion des étudiants</span>
      </nav>
      <div className="card card-primary card-outline">
        <div className="card-header d-flex " style={{ backgroundColor: '#F8F8F8' }}>
          <img src={etudiant} alt="" width="90px" />
          <p className="card-title mt-5 ml-2 p-2 text-center" style={{ width: '350px', borderRadius: '50px', border: '1px solid rgb(215, 214, 216)' }}>
            Gestion des Elèves
          </p>
        </div>

        <div className="card-body">
          <div className="tab-content" id="custom-content-below-tabContent">
            <div className="tab-pane fade show active" id="listes" role="tabpanel" aria-labelledby="custom-content-below-home-tab">
              <section className="content mt-2">
                <div className="container-fluid">
                  <div className="row">
                    <div className="col-12">
                      <div className="card">
                        <div className="card-header" style={{ backgroundColor: 'rgb(238, 237, 237)' }} >
                          <div className="row" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                            <div className="col-md-3" style={{ flex: '1', marginRight: '10px' }}>
                              <select
                                name="niveau"
                                className="form-control"
                                required
                                style={{ height: '50px', borderRadius: '8px', backgroundColor: '#F8F8F8' }}
                              >
                                <option value="">Sélectionnez un niveau</option>
                                {niveaux.length > 0 ? (
                                  niveaux.map((niveau) => (
                                    <option key={niveau.id} value={niveau.id}>{niveau.nomniveau}</option>
                                  ))
                                ) : (
                                  <option value="" disabled>Aucun niveau disponible</option>
                                )}
                              </select>
                            </div>
                            <div className="col-md-3" style={{ flex: '1', marginRight: '10px' }}>
                              <select
                                name="sections"
                                className="form-control"
                                required
                                style={{ height: '50px', borderRadius: '8px', backgroundColor: '#F8F8F8' }}
                              >
                                <option value="">Sélectionnez une section</option>
                                {sections.length > 0 ? (
                                  sections.map((section) => (
                                    <option key={section.id} value={section.id}>{section.classe}</option>
                                  ))
                                ) : (
                                  <option value="" disabled>Aucune section disponible</option>
                                )}
                              </select>
                            </div>
                            <div className="col-md-3" style={{ flex: '1', marginRight: '10px' }}>
                              <Select
                                id="infos"
                                value={infos}
                                onChange={handleInfosChange}
                                options={infosOptions}
                                placeholder="Élève sans infos"
                              />
                            </div>
                            <div className="col-md-3" style={{ flex: '1', marginRight: '10px' }}>
                              <select
                                name="ecole"
                                className="form-control"
                                required
                                style={{ height: '50px', borderRadius: '8px', backgroundColor: '#F8F8F8' }}
                                onChange={(e) => {
                                  const ecoleId = e.target.value;
                                  setSelectedEcole(ecoleId);
                                  filterElevesByEcole(ecoleId);
                                }}
                                value={selectedEcole || ''}
                              >
                                <option value="">Sélectionnez une école</option>
                                {ecole.length > 0 ? (
                                  ecole.map((item) => (
                                    <option key={item.id} value={item.id}>
                                      {item.nomecole}
                                    </option>
                                  ))
                                ) : (
                                  <option value="" disabled>Aucune école disponible</option>
                                )}
                              </select>
                            </div>
                          </div>
                          <div className='row'>
                            <div className="button-container" style={{ marginTop: '20px' }}>
                            </div>
                            <div className='col-md-4'>
                              <Link className="btn btn-app p-1" to="/etudiants/formulaire">
                                <img src={add} alt="" width="30px" /><br />
                                Ajouter
                              </Link>
                              {/* imprimer documents */}
                              <div className="btn-group">
                                <button className='btn btn-app p-1' onClick={handlePrintClick}>
                                  <img src={printer} alt="" width="30px" /><br />Imprimer
                                </button>
                                {showPrintOptions && (
                                  <div className="dropdown-menu show" style={{ display: 'block' }}>
                                    {printOptions.map((option) => (
                                      <button
                                        key={option.value}
                                        className="dropdown-item"
                                        onClick={() => {
                                          handlePrintOptionSelect(option);
                                          setShowPrintOptions(false);
                                        }}
                                      >
                                        {option.label}
                                      </button>
                                    ))}
                                  </div>
                                )}
                              </div>
                              <a className='btn btn-app p-1' href="#" onClick={handleShowModal}>
                                <img src={importexel} alt="" width="30px" /><br />Importer
                              </a>
                              <Modal show={showModal} onHide={handleCloseModal}>
                                <Modal.Header className="text-center">
                                  <Modal.Title>Importer des étudiants</Modal.Title>
                                  <button
                                    type="button"
                                    className="btn-close"
                                    aria-label="Close"
                                    onClick={handleCloseModal}
                                    style={{ background: "none", border: "none" }}
                                  ></button>
                                </Modal.Header>
                                <Modal.Body>
                                  <div className="text-center">
                                    <button
                                      className="btn btn-success mb-3"
                                      onClick={handleDownloadTemplate}
                                    >
                                      Créer et télécharger le formulaire d'importation
                                    </button>
                                    <div className="custom-file mb-3">
                                      <input
                                        type="file"
                                        className="custom-file-input"
                                        id="customFile"
                                        onChange={handleFileChange}
                                      />
                                      <label className="custom-file-label" htmlFor="customFile">
                                        {fileName || "aucun fichier choisi"}
                                      </label>
                                    </div>
                                    <button
                                      className="btn btn-primary mb-3"
                                      onClick={handleImport}
                                    >
                                      Début de l'importation
                                    </button>
                                  </div>
                                  <div className="modal-footer">
                                    <button
                                      className="btn btn-secondary"
                                      onClick={handleCloseModal}
                                    >
                                      Annuler
                                    </button>
                                  </div>
                                </Modal.Body>
                              </Modal>
                              <a className='btn btn-app p-1' href="#" onClick={handleExport}>
                                <img src={excel} alt="" width="25px" /><br />Exporter
                              </a>
                              <Link to="/affecterclasse" className='btn btn-app p-1'>
                                <img src={classe} alt="" width="25px" /><br />
                                affecter classe
                              </Link>
                            </div>
                            <div className='col-md-4'>
                              <div className="input-group mr-2">
                                <div className="form-outline" data-mdb-input-init>
                                  <input type="search" id="form1" width={100} style={{ height: '38px' }} className="form-control" placeholder="Recherche" />
                                </div>
                                <button type="button" className="btn btn-primary" data-mdb-ripple-init>
                                  <i className="fas fa-search"></i>
                                </button>
                              </div>
                            </div>
                            <div className="col-md-4" style={{ flex: '1', marginRight: '10px' }}>
                              <Select
                                isMulti
                                options={options}
                                value={selectedOptions}
                                onChange={handleChange}
                                placeholder="Colonnes"
                                formatOptionLabel={formatOptionLabel}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="table-responsive">
                          <table className="table table-bordered table-hover">
                            <thead>
                              <tr>
                                <th>
                                  <input
                                    type="checkbox"
                                    checked={selectAll}
                                    onChange={handleSelectAll}
                                  />
                                </th>
                                {columns.map((column, index) => (
                                  <th key={index}>{column.label}</th>
                                ))}
                                <th>Année / Niveau / Classe</th>
                                <th>Status</th>
                                <th>Ecole</th>
                                <th style={{ width: '250px' }}>Action</th>
                              </tr>
                            </thead>
                            <tbody>
                              {currentItems.map((eleve, index) => (
                                <tr key={eleve.id}>
                                  <td>
                                    <input
                                      type="checkbox"
                                      checked={selectedEleves.includes(eleve.id)}
                                      onChange={() => handleSelectEleve(eleve.id)}
                                    />
                                  </td>
                                  {columns.map((column, colIndex) => (
                                    <td key={colIndex} className={column.key === 'photo' ? 'td-photo' : ''}>
                                      {column.key === 'photo' ? (
                                        <div className="photo-circle">
                                          <img
                                            src={
                                              eleve[column.key]
                                                ? `http://localhost:5000${eleve[column.key]}`
                                                : eleve.Eleve?.[column.key]
                                                  ? `http://localhost:5000${eleve.Eleve[column.key]}`
                                                  : 'http://localhost:5000/images/Eleve/default.png'
                                            }
                                            alt="photo élève"
                                          />
                                        </div>
                                      ) : (
                                        eleve[column.key] ||
                                        (eleve.Eleve && eleve.Eleve[column.key]) ||
                                        'N/A'
                                      )}
                                    </td>

                                  ))}
                                  <td>
                                    {eleve.Eleve?.Anneescolaire?.datedebut && eleve.Eleve?.Anneescolaire?.datefin
                                      ? `${new Date(eleve.Eleve.Anneescolaire.datedebut).getFullYear()} - ${new Date(eleve.Eleve.Anneescolaire.datefin).getFullYear()}`
                                      : 'N/A'
                                    }
                                    <br />
                                    {eleve.Eleve?.Niveaux?.nomniveau || 'N/A'}<br />
                                    {eleve.Eleve?.Section?.classe || 'N/A'}
                                  </td>
                                  <td style={{ padding: "4px", verticalAlign: "middle" }}>
                                    <label className="switch small-switch">
                                      <input
                                        type="checkbox"
                                        checked={eleve.statuscompte === "activer"}
                                        onChange={() => handleToggleStatus(eleve.id)}
                                      />
                                      <span className="slider round"></span>
                                    </label>
                                    <br />
                                    {eleve.User?.dateAD && (
                                      <p style={{ margin: 0, fontSize: "15px" }}>
                                        {new Date(eleve.User.dateAD).toLocaleDateString()}
                                      </p>
                                    )}
                                  </td>
                                  <td>
                                    {eleve.ecoleName || 'N/A'}
                                  </td>

                                  <td style={{ width: '250px' }}>
                                    <button
                                      className="btn btn-outline-success btn-sm p-1 me-1 ml-1"
                                      style={{ minWidth: '28px', minHeight: '28px' }}
                                      onClick={() => handleEdit(eleve.id)}
                                    >
                                      <img src={edite} alt="modifier" width="10px" title="Modifier" />
                                    </button>

                                    <button
                                      className="btn btn-outline-danger btn-sm p-1 me-1 ml-1"
                                      style={{ minWidth: '28px', minHeight: '28px' }}
                                      onClick={() => handleDelete(eleve.id)}
                                    >
                                      <img src={delet} alt="Supprimer" width="10px" />
                                    </button>

                                    <button
                                      className="btn btn-outline-info btn-sm p-1 me-1 ml-1"
                                      style={{ minWidth: '28px', minHeight: '28px' }}
                                      onClick={() => handleShowHealthModal(eleve.id)}
                                    >
                                      <img src={sante} width="10px" />
                                    </button>

                                    <button
                                      className="btn btn-outline-secondary btn-sm p-1 ml-1"
                                      style={{ minWidth: '28px', minHeight: '28px' }}
                                      onClick={() => handleShowCard(eleve)}
                                    >
                                      <img src={studentcard} alt="Carte étudiant" width="10px" />
                                    </button>
                                    <button
                                      className="btn btn-outline-secondary btn-sm p-1 ml-1"
                                      style={{ minWidth: '28px', minHeight: '28px' }}
                                      onClick={() => printrecu(eleve.id)}
                                    >
                                      <img src={printer} alt="imptimer" width="10px" />
                                    </button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
              {/* Pagination */}
              <div className="pagination">
                <button
                  className="btn btn-primary"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  Précédent
                </button>
                {pageNumbers.map((number) => (
                  <button
                    key={number}
                    className={`btn ${currentPage === number ? 'btn-info' : 'btn-light'}`}
                    onClick={() => handlePageChange(number)}
                  >
                    {number}
                  </button>
                ))}
                <button
                  className="btn btn-primary"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Suivant
                </button>
              </div>
            </div>
            <div className="tab-pane fade" id="formulaire" role="tabpanel" aria-labelledby="custom-content-below-profile-tab">
              Ajouter
            </div>
          </div>
        </div>
        <ProfileEmploye />
      </div>
      <Modal show={showHealthModal} onHide={handleCloseHealthModal}>
        <Modal.Header closeButton>
          <Button variant="transparent" onClick={() => window.print()}>
            <img src={printer} alt="" width={30} />
          </Button>
          <Modal.Title>Informations de santé</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {healthInfo ? (
            <div>
              {/* Informations de l'élève */}
              <div className='card mb-3'>
                <div className='card-header d-flex align-items-center'>
                  <img src={etudiant} alt="" width={30} />
                  <h5>Informations de l'élève</h5>
                </div>
                <div className='card-body'>
                  {healthInfo.User ? (
                    <div className='d-flex justify-content-between'>
                      <p><strong>Nom :</strong> {healthInfo.User.nom}</p>
                      <p><strong>Prénom :</strong> {healthInfo.User.prenom}</p>
                    </div>
                  ) : (
                    <p>Aucune information sur l'élève disponible.</p>
                  )}
                </div>
              </div>

              {/* Informations des parents */}
              <div className='card mb-3'>
                <div className='card-header'>
                  <img src={familyIcon} alt="" width={30} />
                  <h5>Informations des parents</h5>
                </div>
                <div className='card-body'>
                  {healthInfo.Parents && healthInfo.Parents.length > 0 ? (
                    <div className='row'>
                      {/* Père à gauche */}
                      <div className='col-md-6'>
                        <h6>Informations du mère</h6>
                        {healthInfo.Parents[0]?.User ? (
                          <>
                            <p><strong>Nom :</strong> {healthInfo.Parents[0].User.nom}</p>
                            <p><strong>Prénom :</strong> {healthInfo.Parents[0].User.prenom}</p>
                            <p><strong>Email :</strong> {healthInfo.Parents[0].User.email}</p>
                            <p><strong>Téléphone :</strong> {healthInfo.Parents[0].User.telephone}</p>
                            <p><strong>Type :</strong> {healthInfo.Parents[0].typerole}</p>
                          </>
                        ) : (
                          <p>Aucune information sur le père disponible.</p>
                        )}
                      </div>

                      {/* Mère à droite */}
                      <div className='col-md-6'>
                        <h6>Informations de la père</h6>
                        {healthInfo.Parents[1]?.User ? (
                          <>
                            <p><strong>Nom :</strong> {healthInfo.Parents[1].User.nom}</p>
                            <p><strong>Prénom :</strong> {healthInfo.Parents[1].User.prenom}</p>
                            <p><strong>Email :</strong> {healthInfo.Parents[1].User.email}</p>
                            <p><strong>Téléphone :</strong> {healthInfo.Parents[1].User.telephone}</p>
                            <p><strong>Type :</strong> {healthInfo.Parents[1].typerole}</p>
                          </>
                        ) : (
                          <p>Aucune information sur la mère disponible.</p>
                        )}
                      </div>
                    </div>
                  ) : (
                    <p>Aucune information sur les parents disponible.</p>
                  )}
                </div>
              </div>

              {/* Informations de santé */}
              <div className='card mb-3'>
                <div className='card-header'>
                  <img src={healthIcon} alt="" width={30} />
                  <h5>Informations de santé</h5>
                </div>
                <div className='card-body'>
                  <p><strong>Antécédents médicaux :</strong> {healthInfo.antecedents}</p>
                  <p><strong>Détails des antécédents :</strong> {healthInfo.antecedentsDetails}</p>
                  <p><strong>Suivi médical :</strong> {healthInfo.suiviMedical}</p>
                  <p><strong>Détails du suivi médical :</strong> {healthInfo.suiviMedicalDetails}</p>
                  <p><strong>Traitement en cours :</strong> {healthInfo.natureTraitement}</p>
                  <p><strong>Détails du traitement :</strong> {healthInfo.natureTraitementDetails}</p>
                  <p><strong>Crises :</strong> {healthInfo.crises}</p>
                  <p><strong>Détails des crises :</strong> {healthInfo.crisesDetails}</p>
                  <p><strong>Conduite à tenir :</strong> {healthInfo.conduiteTenir}</p>
                  <p><strong>Détails de la conduite à tenir :</strong> {healthInfo.conduiteTenirDetails}</p>
                  <p><strong>Opération chirurgicale :</strong> {healthInfo.operationChirurgical}</p>
                  <p><strong>Détails de l'opération :</strong> {healthInfo.operationChirurgicalDetails}</p>
                  <p><strong>Maladie chronique :</strong> {healthInfo.maladieChronique}</p>
                  <p><strong>Détails de la maladie chronique :</strong> {healthInfo.maladieChroniqueDetails}</p>
                </div>
              </div>
            </div>
          ) : (
            <p>Chargement des informations de santé...</p>
          )}
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseHealthModal}>
            Fermer
          </Button>
          <Button variant="primary" onClick={() => window.print()}>
            <img src={printer} alt="" width={50} />
          </Button>
        </Modal.Footer>
      </Modal>

      {showCard && selectedEleve && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content" style={{
              borderRadius: '15px',
              boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
              overflow: 'hidden'
            }}>
              {/* En-tête avec logo et infos école */}
              <div className="modal-header" style={{
                background: 'linear-gradient(135deg, #2c3e50, #3498db)',
                color: 'white',
                borderBottom: 'none',
                padding: '1.5rem'
              }}>
                <div className="d-flex justify-content-between w-100 align-items-center">
                  {ecoleInfo?.logo && (
                    <img
                      src={`http://localhost:5000${ecoleInfo.logo}`}
                      alt="Logo école"
                      style={{
                        width: '60px',
                        height: '60px',
                        objectFit: 'contain',
                        borderRadius: '8px'
                      }}
                    />
                  )}
                  <div className="text-center mx-3">
                    <h2 className="mb-0" style={{ fontWeight: '600', letterSpacing: '1px' }}>
                      {ecoleInfo?.nomecole || "Établissement Scolaire"}
                    </h2>
                    <p className="mb-0" style={{ fontSize: '0.9em', opacity: '0.9' }}>
                      Carte d'Identité Scolaire
                    </p>
                  </div>
                  <button
                    type="button"
                    className="close"
                    onClick={handleCloseCard}
                    style={{ color: 'white', opacity: '1', fontSize: '2rem' }}
                  >
                    &times;
                  </button>
                </div>
              </div>

              {/* Corps de la modal */}
              <div className="modal-body" style={{ padding: '2rem' }}>
                <div className="row">
                  {/* Colonne Photo + Info élève */}
                  <div className="col-md-8">
                    <div className="d-flex align-items-start mb-4">
                      {/* Photo élève */}
                      <div className="mr-4" style={{ position: 'relative' }}>
                        <div style={{
                          width: '120px',
                          height: '120px',
                          borderRadius: '50%',
                          border: '3px solid #3498db',
                          overflow: 'hidden',
                          background: '#f8f9fa'
                        }}>
                          <img
                            src={
                              selectedEleve.Eleve?.photo
                                ? `http://localhost:5000${selectedEleve.Eleve?.photo}`
                                : 'http://localhost:5000/images/Eleve/default.png'
                            }
                            alt="Photo élève"
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover'
                            }}
                          />
                        </div>
                        {/* <div style={{
                          position: 'absolute',
                          bottom: '-10px',
                          right: '-10px',
                          background: '#3498db',
                          color: 'white',
                          borderRadius: '50%',
                          width: '40px',
                          height: '40px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '0.8em',
                          fontWeight: 'bold',
                          boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
                        }}>
                          {selectedEleve.niveau || 'N/A'}
                        </div> */}
                      </div>

                      {/* Info texte */}
                      <div style={{ flex: 1 }}>
                        <h3 style={{
                          color: '#2c3e50',
                          marginBottom: '0.5rem',
                          fontWeight: '600'
                        }}>
                          {selectedEleve.nom} {selectedEleve.prenom}
                        </h3>

                        <div className="mb-2">
                          <div className="d-flex align-items-center" style={{ marginBottom: '0.3rem' }}>
                            <span className="mr-2" style={{ minWidth: '120px', color: '#7f8c8d' }}>N° Inscription:</span>
                            <strong style={{ color: '#2c3e50' }}>{selectedEleve.Eleve?.numinscription || 'N/A'}</strong>
                          </div>
                          <div className="d-flex align-items-center" style={{ marginBottom: '0.3rem' }}>
                            <span className="mr-2" style={{ minWidth: '120px', color: '#7f8c8d' }}>Date Naissance:</span>
                            <strong style={{ color: '#2c3e50' }}>
                              {new Date(selectedEleve.dateNaiss).toLocaleDateString() || 'N/A'}
                            </strong>
                          </div>
                          <div className="d-flex align-items-center">
                            <span className="mr-2" style={{ minWidth: '120px', color: '#7f8c8d' }}>Identité Nationale:</span>
                            <strong style={{ color: '#2c3e50' }}>{selectedEleve.Eleve?.numidentnational || 'N/A'}</strong>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Section supplémentaire */}
                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <div style={{
                          background: '#f8f9fa',
                          borderRadius: '10px',
                          padding: '1rem',
                          height: '100%'
                        }}>
                          <h6 style={{ color: '#3498db', borderBottom: '2px solid #3498db', paddingBottom: '0.5rem' }}>
                            <i className="fas fa-school mr-2"></i>
                            Scolarité
                          </h6>
                          <div className="mt-2">
                            <p className="mb-1"><strong>Cycle:</strong> {selectedEleve.Eleve?.cycle || 'N/A'}</p>
                            <p className="mb-1"><strong>Niveau:</strong> {selectedEleve.Eleve?.Niveaux?.nomniveau || 'N/A'}</p>
                            <p className="mb-1"><strong>Section:</strong> {selectedEleve.Eleve?.Section?.classe || 'N/A'}</p>
                            <p className="mb-0"><strong>Année Scolaire:</strong> {selectedEleve.Eleve?.Anneescolaire?.annee || 'N/A'}</p>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6 mb-3">
                        <div style={{
                          background: '#f8f9fa',
                          borderRadius: '10px',
                          padding: '1rem',
                          height: '100%'
                        }}>
                          <h6 style={{ color: '#3498db', borderBottom: '2px solid #3498db', paddingBottom: '0.5rem' }}>
                            <i className="fas fa-id-card mr-2"></i>
                            Authentification
                          </h6>
                          <div className="mt-2">
                            <p className="mb-1"><strong>Identifiant:</strong> {selectedEleve.username || 'N/A'}</p>
                            <p className="mb-0"><strong>Code Accès:</strong> •••••••••</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Colonne QR Code */}
                  <div className="col-md-4">
                    <div style={{
                      background: '#f8f9fa',
                      borderRadius: '12px',
                      padding: '1.5rem',
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <QRCode
                        value={JSON.stringify({
                          id: selectedEleve.id,
                          nom: selectedEleve.nom,
                          prenom: selectedEleve.prenom,
                          numinscription: selectedEleve.numinscription
                        })}
                        size={160}
                        level="H"
                        fgColor="#2c3e50"
                        bgColor="transparent"
                      />
                      <div className="mt-3 text-center">
                        <small style={{ color: '#7f8c8d', display: 'block' }}>
                          Scannez ce code pour vérifier l'authenticité
                        </small>
                        <div style={{
                          marginTop: '0.5rem',
                          color: '#3498db',
                          fontSize: '0.8em',
                          fontWeight: '500'
                        }}>
                          <i className="fas fa-shield-alt mr-2"></i>
                          Certifié Numérique
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Pied de modal */}
              <div className="modal-footer" style={{
                background: '#f8f9fa',
                borderTop: 'none',
                padding: '1rem 2rem',
                justifyContent: 'space-between'
              }}>
                <small style={{ color: '#7f8c8d' }}>
                  <i className="fas fa-info-circle mr-2"></i>
                  Carte valide jusqu'au 31/08/2024
                </small>
                <button
                  className="btn btn-link text-primary"
                  onClick={() => window.print()}
                >
                  <i className="fas fa-print mr-2"></i>Imprimer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}


    </>
  );
}

export default Etudiants;



{/* <Modal show={showProfileModal} onHide={handleCloseProfileModal} size="lg">
        <Modal.Header closeButton>
          <Button variant="transparent" onClick={() => window.print()}>
            <img src={printer} alt="" width={30} />
          </Button>
          <Modal.Title>Profil de l'élève</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {profileInfo ? (
            <div>
              <div className="card mb-4">
                <div className="card-header d-flex align-items-center">
                  <img src={etudiant} alt="" width={30} />
                  <h5 className="mb-0 ml-2">Informations de l'élève</h5>
                </div>
                <div className="card-body">
                  <div className="row d-flex align-items-center">
                    <div className="col-md-8">
                      <div className="row">
                        <div className="col-md-6">
                          <p><strong>Nom :</strong> {profileInfo.User?.nom}</p>
                          <p><strong>Prénom :</strong> {profileInfo.User?.prenom}</p>
                        </div>
                        <div className="col-md-6">
                          <p><strong>Nom d'utilisateur :</strong> {profileInfo.User?.username}</p>
                          <p><strong>Mot de passe :</strong> {profileInfo.User?.password}</p>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-4 text-center">
                      {profileInfo.User?.photo ? (
                        <img
                          src={profileInfo.User.photo}
                          alt="Photo de l'élève"
                          className="img-fluid rounded"
                          style={{ maxHeight: '150px' }}
                        />
                      ) : (
                        <div className="bg-light p-4 rounded">
                          <p>Pas de photo</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="card">
                <div className="card-header d-flex align-items-center">
                  <img src={familyIcon} alt="" width={30} />
                  <h5 className="mb-0 ml-2">Information parent</h5>
                </div>
                <div className="card-body">
                  <div className="row">
                    {profileInfo.Parents && profileInfo.Parents[0] && (
                      <div className="col-md-12 mb-4 parent-card">
                        <div className="card">
                          <div className="card-header">
                            <h6>Informations du père</h6>
                          </div>
                          <div className="card-body">
                            <div className="row d-flex align-items-center">
                              <div className="col-md-8">
                                <div className="row">
                                  <div className="col-md-6">
                                    <p><strong>Nom :</strong> {profileInfo.Parents[0].User?.nom || 'Non spécifié'}</p>
                                    <p><strong>Prénom :</strong> {profileInfo.Parents[0].User?.prenom || 'Non spécifié'}</p>
                                  </div>
                                  <div className="col-md-6">
                                    <p><strong>Nom d'utilisateur :</strong> {profileInfo.Parents[0].User?.username || 'Non spécifié'}</p>
                                    <p><strong>Mot de passe :</strong> {profileInfo.Parents[0].User?.password}</p>
                                  </div>
                                </div>
                              </div>
                              <div className="col-md-4">
                                <div className="signature-area">
                                  <p className="text-center mb-2"><strong>Signature</strong></p>
                                  <div style={{
                                    height: '80px',
                                    border: '1px solid #000',
                                    marginBottom: '10px'
                                  }}></div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {profileInfo.Parents && profileInfo.Parents[1] && (
                      <div className="col-md-12 mb-4 parent-card">
                        <div className="card">
                          <div className="card-header">
                            <h6>Informations de la mère</h6>
                          </div>
                          <div className="card-body">
                            <div className="row d-flex align-items-center">
                              <div className="col-md-8">
                                <div className="row">
                                  <div className="col-md-6">
                                    <p><strong>Nom :</strong> {profileInfo.Parents[1].User?.nom || 'Non spécifié'}</p>
                                    <p><strong>Prénom :</strong> {profileInfo.Parents[1].User?.prenom || 'Non spécifié'}</p>
                                  </div>
                                  <div className="col-md-6">
                                    <p><strong>Nom d'utilisateur :</strong> {profileInfo.Parents[1].User?.username || 'Non spécifié'}</p>
                                    <p><strong>Mot de passe :</strong> {profileInfo.Parents[1].User?.password}</p>
                                  </div>
                                </div>
                              </div>
                              <div className="col-md-4">
                                <div className="signature-area">
                                  <p className="text-center mb-2"><strong>Signature</strong></p>
                                  <div style={{
                                    height: '80px',
                                    border: '1px solid #000',
                                    marginBottom: '10px'
                                  }}></div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="card mt-4">
                <div className="card-header d-flex align-items-center">
                  <img src={security} alt="" width={30} />
                  <h5>  Déclaration de confidentialité</h5>
                </div>
                <div className="card-body">
                  <div className="alert alert-warning mt-3">
                    <strong>⚠️ Avis de confidentialité :</strong> Les informations affichées dans ce document, y compris les identifiants et les mots de passe, sont strictement confidentielles.
                    En tant que parent, il est de votre responsabilité de protéger ces données sensibles et de veiller à ce qu'elles ne soient pas partagées ou utilisées de manière inappropriée.
                    Assurez-vous de la sécurité de ces informations pour la protection de votre enfant.
                  </div>
                  <div className="mt-4 row">
                    <div className="col-md-6">
                      <p className="text-center"><strong>Signature de l'administrateur</strong></p>
                      <div className="signature-box" style={{ height: '60px', borderBottom: '1px solid #000' }}></div>
                    </div>
                  </div>
                  <div className="mt-4 text-right">
                    <p>Fait à ______________, le {new Date().toLocaleDateString('fr-FR')}</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <p>Chargement des informations de l'élève...</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseProfileModal}>
            Fermer
          </Button>
          <Button variant="primary" onClick={() => window.print()}>
            <img src={printer} alt="" width={30} />
          </Button>
        </Modal.Footer>
      </Modal> */}