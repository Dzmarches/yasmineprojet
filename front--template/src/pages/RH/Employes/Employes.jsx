import React, { useState, useEffect } from 'react';
import excel from '../../../assets/imgs/excel.png';
import importexel from '../../../assets/imgs/import.png';
import printer from '../../../assets/imgs/printer.png';
import add from '../../../assets/imgs/add.png';
import { Link, useNavigate } from 'react-router-dom';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import * as XLSX from 'xlsx';
import Select from 'react-select';
import ProfileEmploye from './ProfileEmploye';
import rh from '../../../assets/imgs/employe.png';
import edit from '../../../assets/imgs/edit.png';
import archive from '../../../assets/imgs/delete.png';
import recherche from '../../../assets/imgs/recherche.png';
import utilisateur from '../../../assets/imgs/utilisateur.png';
import fichier from '../../../assets/imgs/fichier.png';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import download from 'downloadjs';
import axios from 'axios';
import moment from 'moment';


const Employes = () => {
  const url = "http://localhost:5000"
  const [data, setdata] = useState([])
  const [showModal, setShowModal] = useState(false);
  const [fileName, setFileName] = useState('');
  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedEmployeId, setSelectedEmployeId] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [showPrintOptions, setShowPrintOptions] = useState(false);
  const [showPrintOptionsME, setShowPrintOptionsME] = useState(false);
  const [selectedPrintOption, setSelectedPrintOption] = useState('');
  const [printOptions, setPrintOptions] = useState([]);
  const [EmployeConnecte, setEmployeConnecte] = useState(null);
  const [ModeleDoc, setModeleDoc] = useState([]);
  const [ListeBTP, setListeBTP] = useState([]);
  const navigate = useNavigate();

  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [signataire, setsignataire] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredBulletins, setFilteredBulletins] = useState([]);
  const [isExterne, setIsExterne] = useState(false);


  const [selectedEcole, setSelectedEcole] = useState(null);
  const [filteredEcoles, setFilteredEcoles] = useState([]);
  const [ecole, setEcoles] = useState([]);
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
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const [roles, setRoles] = useState([]);
  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("❌ Aucun token trouvé. Veuillez vous connecter.");
        return;
      }
      try {
        const response = await axios.get("http://localhost:5000/getMe", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        // console.log("✅ Réponse roles :", response.data.roles);
        setRoles(response.data.roles || []);
      } catch (error) {
        console.error("❌ Erreur lors de la récupération des informations de l'utilisateur :", error);
      }
    };
    fetchUser();
  }, []);

  const fetchEmployeConnecte = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Vous devez être connecté ");
        return;
      }
      const response = await axios.get('http://localhost:5000/employes/me', {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      setEmployeConnecte(response.data);
    } catch (error) {
      console.error("Erreur lors de la récupération des informations de l'employé :", error);
      // alert(error.response?.data?.message || "Une erreur est survenue. Veuillez réessayer.");
    }
  };
  useEffect(() => {
    if (Array.isArray(roles) && roles.includes("Employé")) {
      fetchEmployeConnecte();
    }
  }, [roles]);
  
  const filteredData = data.filter(item => {
    const search = searchTerm.toLowerCase().trim();
    // Filtre par recherche texte
    const matchesSearchTerm = search === '' || (
      (item.User?.nom && item.User?.nom.toLowerCase().includes(searchTerm.toLowerCase().trim())) ||
      (item.User?.prenom && item.User?.prenom.toLowerCase().includes(searchTerm.toLowerCase().trim())) ||
      (item.User?.email && item.User?.email.toLowerCase().includes(searchTerm.toLowerCase().trim())) ||
      (item.User?.telephone && item.User?.telephone.includes(searchTerm)) ||
      (item.Poste?.poste && item.Poste.poste.toLowerCase().includes(searchTerm.toLowerCase().trim())) ||
      (item.CE && item.CE.toLowerCase().includes(searchTerm.toLowerCase().trim())) ||
      (
        item.declaration !== undefined &&
        (
          (search === 'oui' && item.declaration === true) ||
          (search === 'non' && item.declaration === false)
        )
      )||
      (
        item.User?.nom && item.User?.prenom &&
        (`${item.User?.nom} ${item.User?.prenom}`).includes(searchTerm)
      )
    );

    // Filtre par école
    const matchesEcole = !selectedEcole ||
      (item.User?.Ecoles?.some(ecole => ecole.id === parseInt(selectedEcole))) ||
      (item.User?.Ecoles[0]?.id === parseInt(selectedEcole));

    // Les deux conditions doivent être vraies
    return matchesSearchTerm && matchesEcole;
  });


  const handleProfileClick = (id) => {
    setSelectedEmployeId(id);
  };

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

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

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(data.length / itemsPerPage);
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };
  const pageNumbers = [];
  for (let i = Math.max(1, currentPage - 2); i <= Math.min(currentPage + 2, totalPages); i++) {
    pageNumbers.push(i);
  }


  // const handleChangePostes = (selected) => {
  //   setSelectedOptions(selected);
  // };
  // Personnaliser le rendu des options dans le menu déroulant
  const formatOptionLabel = ({ label, value }, { context }) => {
    // Si l'option est sélectionnée, appliquer un style bleu
    if (context === 'menu' && selectedOptions.some((opt) => opt.value === value)) {
      return <div style={{ color: 'blue' }}>{label}</div>;
    }
    // Sinon, retourner le label normal
    return label;

  };

  const handleExport = () => {
    const ws = XLSX.utils.json_to_sheet(data.map(item => ({
      "Nom et Prénom": `${item.User?.nom} ${item.User?.prenom}`,
      "Poste": item.Poste?.poste,
      "Email": item.User?.email,
      "Numéro de téléphone": item.User?.telephone,
      "Déclaré à la CNAS":  item.declaration == 1 ? 'Déclaré' : 'Non déclaré' ,
      "Date de recrutement": item.daterecru ? moment(item.daterecru).format('DD-MM-YYYY') : '',
      "Date de cessation de travail": item.User?.dateAD,
      "Ecole Principale": item.User?.EcolePrincipal?.nomecole,
      "Ecole": item.User?.Ecoles[0]?.nomecole,
    }
    )));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Liste des employés");
    XLSX.writeFile(wb, "liste_employes.xlsx");
  };

  //-------------------------- call-backend ------------------------------------//

  useEffect(() => {
    handleListeEmploye()
    //  handleListePostes();
  }, [])

  const handleListeEmploye = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Vous devez être connecté");
        return;
      }
      const response = await axios.get('http://localhost:5000/employes/liste', {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const employeeOptions = response.data
      .filter(emp => emp.declaration == 1)
      .map(emp => ({
        value: emp.id,
        label: (
          <div>
           {emp.User.nom} {emp.User.prenom}{"    "}
            <small className='muted'>
              {emp.CE || ''}
            </small>
          </div>
        )
      }));

      setEmployees(employeeOptions);
      // console.log('liste des employe', response.data)
      setdata(response.data)
      // setFilteredData(response.data);
    } catch (error) {
      console.log("Erreur lors de la récupération des employes", error)
    }
  }
  const ArchiverEmploye = async (id) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Vous devez être connecté");
        return;
      }
      const response = await axios.patch(`http://localhost:5000/employes/archiver/${id}`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      await handleListeEmploye();
      // setdata(response.data)
      // setFilteredData(response.data);
    } catch (error) {
      console.log("Erreur", error)
    }
  }
  //imprimeeeerrrr
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
      const filteredDocs = response.data.filter((doc) => doc.module === "employe");
      // Transformer les données reçues en format { value: '...', label: '...' }
      const options = filteredDocs.map((doc) => ({
        value: doc.id, // Utilisez l'ID ou un autre champ unique comme valeur
        label: doc.nom, // Utilisez le nom du document comme libellé
        modele: doc.modeleTexte
      }));

      setPrintOptions(options); // Mettre à jour l'état des options d'impression
    } catch (error) {
      console.log("Erreur lors de la récupération des attestations", error);
    }
  };
  // Gérer le clic sur le bouton "Imprimer"
  const handlePrintClick = () => {
    setShowPrintOptions(!showPrintOptions);
  };
  const handlePrintClickMe = () => {
    setShowPrintOptionsME(!showPrintOptionsME);
  };

  // Gérer la sélection d'un modèle
  const handlePrintOptionSelect = (option) => {
    setSelectedPrintOption(option.value);
    setShowPrintOptions(false); // Masquer la liste déroulante après la sélection
    navigate('/documentImprimer', { state: { selectedOption: option } });
    // alert(`Vous avez sélectionné : ${option.label}`); // Afficher un message (à remplacer par votre logique)
  };

  const handlePrintOptionSelectME = (option) => {
    setSelectedPrintOption(option.value);
    setShowPrintOptionsME(false);
    handlePrint(EmployeConnecte, option.modele, option.label);
    // navigate('/mesdocs', { state: { selectedOption: option } });

  };

  const handlePrint = (employe, modeleText, nomDoc) => {
    if (!employe || !modeleText || !nomDoc) {
      console.error("Employé ou modèle de texte non défini");
      return;
    }
    const dateToday = moment().format('DD/MM/YYYY');

    const modeleTextupdate = modeleText
      .replace(/\[nomecole\]/g, employe.User?.Ecoles?.map(ecole => ecole.nomecole).join(', ') || "")
      .replace(/\[nomecoleP\]/g, employe.User?.EcolePrincipal?.nomecole || "" || "")
      .replace(/\[nom\]/g, employe.User.nom || "")
      .replace(/\[prenom\]/g, employe.User.prenom || "")
      .replace(/\[datenaiss\]/g, employe.User.datenaiss ? moment(employe.datenaiss).format('DD/MM/YYYY') : "")
      .replace(/\[Lieunais\]/g, employe.User.Lieunais || "")
      .replace(/\[poste\]/g, employe.Poste?.poste?.toLowerCase() || "")
      .replace(/\[dateCesT\]/g, employe.User?.dateAD ? moment(employe.User?.dateAD).format('DD/MM/YYYY') : "")
      .replace(/\[daterecru\]/g, employe.daterecru ? moment(employe.daterecru).format('DD/MM/YYYY') : "")
      .replace(/\[dateToday\]/g, dateToday)
      .replace(/\[N°AS\]/g, employe.NumAS || "");
    // Créer un iframe pour l'impression
 
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    document.body.appendChild(iframe);

    const iframeDocument = iframe.contentWindow.document;
    iframeDocument.open();
    // @page{ margin: 0;}
    iframeDocument.write(`
        <html>
          <head>
            <title>${employe.nom}.${employe.prenom}</title>
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
    // const nomDocc=nomDoc.replace(/\s+/g, '').toUpperCase();
    document.title = `${nomDoc.toUpperCase()}_${employe.nom}.${employe.prenom}`;
    setTimeout(() => {
      iframe.contentWindow.focus();
      iframe.contentWindow.print();
      document.title = originalTitle;
      document.body.removeChild(iframe);
    }, 1000);
  };




  //securisé les images 

  // const ImageProtegee = ({ imagePath }) => {
  //     const [imageSrc, setImageSrc] = useState("");

  //     useEffect(() => {
  //         const fetchImage = async () => {
  //             try {
  //                 const response = await fetch(`http://localhost:5000${imagePath}`, {
  //                     headers: {
  //                         Authorization: `Bearer ${localStorage.getItem('token')}`
  //                     }
  //                 });

  //                 if (!response.ok) {
  //                     throw new Error("Erreur lors du chargement de l'image");
  //                 }
  //                 const imageBlob = await response.blob();
  //                 setImageSrc(URL.createObjectURL(imageBlob));
  //             } catch (error) {
  //                 console.error(error);
  //             }
  //         };

  //         fetchImage();
  //     }, [imagePath]);

  //     return imageSrc ? <img src={imageSrc} alt="Photo de l'employé" width="60px"/> : <p>Chargement...</p>;
  // };




  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [demandeIdToDelete, setDemandeIdToDelete] = useState(null);

  const handleClose = () => setShowDeleteModal(false);
  const handleShow = (id) => {
    setDemandeIdToDelete(id);
    setShowDeleteModal(true);
  };


  const handleToggleStatus = async (userId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Vous devez être connecté");
        return;
      }
      // Trouver l'employé dans les données
      const employeeToUpdate = data.find(item => item.User?.id === userId);
      if (!employeeToUpdate) {
        console.error("Employé non trouvé");
        return;
      }
      // Déterminer le nouveau statut
      const newStatus = employeeToUpdate.User?.statuscompte === "activer"
        ? "désactiver"
        : "activer";
      // Appel API pour mettre à jour le statut
      await axios.put(
        `http://localhost:5000/apii/users/modifier/statut/${userId}`,
        { statuscompte: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      // Mettre à jour les données locales
      const updatedData = data.map(item => {
        if (item.User?.id === userId) {
          return {
            ...item,
            User: {
              ...item.User,
              statuscompte: newStatus,
            },
          };
        }
        return item;
      });
      setdata(updatedData);
      await handleListeEmploye();

      console.log("Statut mis à jour avec succès");

    } catch (error) {
      console.error("Erreur lors de la mise à jour du statut:", error);
      alert("Une erreur est survenue lors de la mise à jour du statut");
    }
  };

  //ATS
  const [showATS, setShowATS] = useState(false);
  const handleATS = () => setShowATS(true);
  const closeATS = () => setShowATS(false);


  const [formDataATS, setFormDataATS] = useState({
    dateDebut: '',
    dateFin: '',
    typeFichier: 'PDF',
    employe: '',
    dernierJourTravail: '',
    dateRepriseTravail: '',
    dateNonReprise: '',
    raisonArret: 'courte',
    joursTravail: '',
    heuresTravail: '',
    periodeDebut: '',
    periodeFin: '',
    Signataire: '',
    repriseTravail: '',
    faitA: '',
    AdE: '', RSEmp: '', adressEmp: '', nomPE: ''

  });
  const handleChangeATS = (e) => {
    const { name, value } = e.target;
    setFormDataATS(prev => ({ ...prev, [name]: value }));
  };


  const handleSubmitATS = () => {
    onSubmit(formDataATS);
    onHide();
  };


  const ListeJP = async (employeId, dateDebut, dateFin) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Vous devez être connecté ");
        return [];
      }
      const response = await axios.post('http://localhost:5000/BultteinPaie/journalPaie/ats', {
        employeId,
        dateDebut,
        dateFin
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
  
      if (response.status === 200 && Array.isArray(response.data)) {
        setListeBTP(response.data); // Si tu veux aussi mettre à jour l’état
        console.log('data', response.data);
        return response.data;
      } else {
        console.error("Les données ne sont pas un tableau !");
        return [];
      }
    } catch (error) {
      console.log(error);
      return [];
    }
  };
  
  const genererATS = async (formDataATS) => {
    if (!selectedEmployee) {
      alert('Aucun employé sélectionné');
      return;
    }
    if (!formDataATS.dateDebut || !formDataATS.dateFin) {
      alert('Veuillez renseigner la date de début et la date de fin.');
      return;
    }

    // Attendre les données de la liste si nécessaire
   
  const btpData = await ListeJP(selectedEmployee.id, formDataATS.dateDebut, formDataATS.dateFin);


    const existingPdfBytes = await fetch('/ATSS.pdf').then(res => res.arrayBuffer());
    const pdfDoc = await PDFDocument.load(existingPdfBytes);
    const pages = pdfDoc.getPages();
    const page1 = pages[0];
    let page2 = pages[1];

    const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const helveticaBoldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    const drawText = (text, x, y, bold = false) => {
      page1.drawText(text, {
        x,
        y,
        size: 13,
        font: bold ? helveticaBoldFont : helveticaFont,
        color: rgb(12 / 255, 6 / 255, 6 / 255),
      });
    };

    // Employeur
    drawText(` ${formDataATS.nomPE}`, 100, 630, true);
    drawText(` ${formDataATS.AdE}`, 230, 603, true);
    drawText(` ${formDataATS.RSEmp}`, 100, 587, true);
    drawText(` ${formDataATS.adressEmp}`, 100, 570, true);

    // Utiliser les données de l'employé sélectionné
    drawText(`${selectedEmployee.User?.nom} ${selectedEmployee.User?.prenom}`, 120, 500, true);
    drawText(`${selectedEmployee.NumAS ? selectedEmployee.NumAS : ''}`, 250, 470, true);
    drawText(`${selectedEmployee.User?.datenaiss ? moment(selectedEmployee.User.datenaiss).format('DD-MM-YYYY') : ''}`,
      100, 450, true);
    drawText(`${selectedEmployee.User ? selectedEmployee.User.lieuxnaiss : ''}`,
      100, 430, true);
    drawText(` ${selectedEmployee.Poste?.poste}`, 100, 410, true);
    drawText(` ${selectedEmployee.daterecru ? moment(selectedEmployee.daterecru).format('DD-MM-YYYY') : ''}`
      , 250, 347, true);

    drawText(`${formDataATS.dernierJourTravail ? moment(formDataATS.dernierJourTravail).format('DD-MM-YYYY') : ''}`, 250, 330, true);
    drawText(`${formDataATS.dateRepriseTravail ? moment(formDataATS.dateRepriseTravail).format('DD-MM-YYYY') : ''}`, 250, 310, true);
    drawText(`${formDataATS.dateNonReprise ? moment(formDataATS.dateNonReprise).format('DD-MM-YYYY') : ''}`, 250, 290, true);

    //raison d'arret courte ou maternite ou longue
    if (formDataATS.raisonArret === 'courte') {
      drawText(`${formDataATS.joursTravail}`, 210, 230, true);
      drawText(` ${formDataATS.heuresTravail}`, 260, 230, true);
      drawText(`${formDataATS.periodeDebut ? moment(formDataATS.periodeDebut).format('DD-MM-YYYY') : ''}`, 60, 210, true);
      drawText(`${formDataATS.periodeFin ? moment(formDataATS.periodeFin).format('DD-MM-YYYY') : ''}`, 190, 210, true);
    } else {
      drawText(`${formDataATS.joursTravail}`, 200, 78, true);
      drawText(` ${formDataATS.heuresTravail}`, 260, 79, true);
      drawText(`${formDataATS.periodeDebut ? moment(formDataATS.periodeDebut).format('DD-MM-YYYY') : ''}`, 60, 60, true);
      drawText(`${formDataATS.periodeFin ? moment(formDataATS.periodeFin).format('DD-MM-YYYY') : ''}`, 190, 60, true);
    }

    //   // 💡 Gestion de la deuxième page (tableau BTP)
    let y = 750;
    const drawTextPage2 = (text, x, y) => {
      page2.drawText(text.toString(), {
        x,
        y,
        size: 12,
        font: helveticaFont,
        color: rgb(0, 0, 0),
      });
    };

  
    if (btpData && Array.isArray(btpData)) {
      let y = 560;
      for (let item of btpData) {
        if (y < 50) {
          page2 = pdfDoc.addPage([595, 842]);
          y = 560;
        }
        drawTextPage2(`${new Date(item.PeriodePaie?.dateDebut).toLocaleDateString('fr-FR', { month: 'long' }).toUpperCase()}-${new Date(item.PeriodePaie?.dateFin).toLocaleDateString('fr-FR', { month: 'long' }).toUpperCase()} `, 20, y);
        drawTextPage2(`${item.nbrJrTrvMois}`, 150, y);
        drawTextPage2(`${item.cotisations}`, 380, y);
        drawTextPage2(`${item.RetenueSS}`, 480, y);
        y -= 16;
      }
    }

    const pdfBytes = await pdfDoc.save();
    // Créer un Blob à partir des octets du PDF
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    window.open(url);
    // Optionnel : libérer l'URL après un certain temps
    setTimeout(() => URL.revokeObjectURL(url), 100); // Libérer l'URL après 100 ms
  };


  const [showDRT, setShowDRT] = useState(false);
  const handleDRT = () => setShowDRT(true);
  const closeDRT = () => setShowDRT(false);

  const handleChangeDRT = (e) => {
    const { name, value } = e.target;
    setFormDataATS(prev => ({ ...prev, [name]: value }));
  };
  const handleSubmitDRT = () => {
    onSubmit(formDataATS);
    onHide();
  };

  const genererDRT = async (formDataATS) => {
    if (!selectedEmployee) {
      alert('Aucun employé sélectionné');
      return;
    }
    if (!signataire) {
      alert('Aucun signataire sélectionné');
      return;
    }

    // if (!formDataATS.dernierJourTravail || !formDataATS.dateRepriseTravail|| formDataATS.dateNonReprise ) {
    //   alert('Veuillez saisir tous les champs obligatoires.');
    //   return;
    // }

    const existingPdfBytes = await fetch('/DRT.pdf').then(res => res.arrayBuffer());
    const pdfDoc = await PDFDocument.load(existingPdfBytes);
    const page = pdfDoc.getPages()[0];

    const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const helveticaBoldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    const drawText = (text, x, y, bold = false) => {
      page.drawText(text, {
        x,
        y,
        size: 13,
        font: bold ? helveticaBoldFont : helveticaFont,
        color: rgb(12 / 255, 6 / 255, 6 / 255),
      });
    };
    const day = selectedEmployee.User
      ? moment(selectedEmployee.User.datenaiss).format('DD')
      : "";

    const month = selectedEmployee.User
      ? moment(selectedEmployee.User.datenaiss).format('MM')
      : "";

    const year = selectedEmployee.User
      ? moment(selectedEmployee.User.datenaiss).format('YYYY')
      : "";

    // console.log('dernierJourTravail', formDataATS.dernierJourTravail)

    // Utiliser les données de l'employé sélectionné
    drawText(` ${selectedEmployee.User ? selectedEmployee.User.nom : ""} `, 150, 590, true);
    drawText(` ${selectedEmployee.User ? selectedEmployee.User.prenom : ""} `, 150, 565, true);
    drawText(` ${day} `, 123, 540, true);
    drawText(` ${month} `, 163, 540, true);
    drawText(` ${year} `, 195, 540, true);
    drawText(` ${selectedEmployee.User ? selectedEmployee.User.lieuxnaiss : ""} `, 270, 536);
    drawText(` ${selectedEmployee.CE ? selectedEmployee.CE : ""} `, 350, 580, true);
    drawText(` ${formDataATS.dernierJourTravail ?
      moment(formDataATS.dernierJourTravail).format('DD  MM   YYYY') : ""
      } `, 230, 510, true);


    // Si l'employé a repris le travail
    if (formDataATS.repriseTravail === 'oui' && formDataATS.dateRepriseTravail) {
      drawText(`${moment(formDataATS.dateRepriseTravail).format('DD  MM  YYYY')}`, 420, 490, true);
    }

    // Si l'employé n'a pas repris le travail
    if (formDataATS.repriseTravail === 'non' && formDataATS.dateNonReprise) {
      drawText(`${moment(formDataATS.dateNonReprise).format('DD   MM  YYYY')}`, 420, 460, true);
    }
    if (formDataATS.repriseTravail === 'non' && formDataATS.dateNonReprise) {
      drawText(`X`, 200, 460, true);
    } else if (formDataATS.repriseTravail === 'oui' && formDataATS.dateRepriseTravail) {
      drawText(`X`, 200, 480, true);

    }
    drawText(`${formDataATS.faitA || ""}`, 320, 426, true);
    drawText(`${moment().format('DD-MM-YYYY')}`, 430, 426, true);
    // drawText(` ${signataire.User ? signataire.User.nom : ""} ${signataire.User ? signataire.User?.prenom : ""}`, 280, 380, true);
    // drawText(` ${signataire.Poste ? signataire.Poste.poste : ""}`, 280, 360, true);

    if (signataire && signataire.User) {
      // Cas où le signataire est un employé interne
      drawText(` ${signataire.User.nom} ${signataire.User.prenom}`, 280, 380, true);
      drawText(` ${signataire.Poste ? signataire.Poste.poste : ""}`, 280, 360, true);
    } else if (signataire && signataire.nom) {
      drawText(`${signataire.nom}`, 280, 380, true);
    }



    const pdfBytes = await pdfDoc.save();
    // Créer un Blob à partir des octets du PDF
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);

    // Ouvrir le PDF dans un nouvel onglet
    window.open(url);

    // Optionnel : libérer l'URL après un certain temps
    setTimeout(() => URL.revokeObjectURL(url), 100);
    // download(pdfBytes, 'Attestation-Travail-Salaire.pdf', 'application/pdf');
  };

  const customStyles = {
    control: (provided) => ({
      ...provided,
      minHeight: '30px',
      height: '30px',
      padding: '0',
    }),
    valueContainer: (provided) => ({
      ...provided,
      padding: '0 6px',
      height: '30px',
    }),
    input: (provided) => ({
      ...provided,
      margin: '0px',
      padding: '0px',
    }),
    indicatorsContainer: (provided) => ({
      ...provided,
      height: '30px',
    }),
  };

  return (
    <>
      <nav>
        <Link to="/dashboard" className="text-primary">Dashboard</Link>
        <span> / </span>
        <Link to="/RessourcesHumaines" className="text-primary">Ressources Humaines</Link>
        <span> / </span>
        <span>Gestion des ressource humaines</span>
      </nav>
      <div className="card card-primary card-outline">
        <div className="card-header d-flex ">
          <img src={rh} alt="" width="90px" />
          <p className="card-title mt-5 ml-2 p-2 text-center" style={{ width: '350px', borderRadius: '50px', border: '1px solid rgb(215, 214, 216)' }}>
            Gestion des  employés

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
                        <div className="card-header p-2" style={{ backgroundColor: "#f8f8f8" }}>
                          <div className='row mt-3'>
                            <div className="button-container" style={{ marginTop: '20px' }}>
                            </div>
                            <div className='col-md-4'>
                              <Link className="btn btn-app p-1" to="/employes/ajouter">
                                <img src={add} alt="" width="30px" /><br />
                                Ajouter
                              </Link>
                              {roles.includes("Employé") ? (
                                <div className="btn-group">
                                  <button className='btn btn-app p-1' onClick={handlePrintClickMe}>
                                    <img src={printer} alt="" width="30px" /><br />Mes documents
                                  </button>
                                  {showPrintOptionsME && (
                                    <div className="dropdown-menu show">
                                      {printOptions.map((option) => (
                                        <button
                                          key={option.value}
                                          className="dropdown-item"
                                          onClick={() => { handlePrintOptionSelectME(option) }}
                                        >
                                          {option.label}
                                        </button>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              ) : ''}

                              <div className="btn-group">
                                <button className='btn btn-app p-1' onClick={handlePrintClick}>
                                  <img src={printer} alt="" width="30px" /><br />Imprimer
                                </button>
                                {showPrintOptions && (
                                  <div className="dropdown-menu show">
                                    {printOptions.map((option) => (
                                      <button
                                        key={option.value}
                                        className="dropdown-item"
                                        onClick={() => { handlePrintOptionSelect(option) }}
                                      >
                                        {option.label}
                                      </button>
                                    ))}
                                  </div>
                                )}
                              </div>

                              <div className="btn-group">
                                <button className='btn btn-app p-1' onClick={handleATS}>
                                  <img src={fichier} alt="" width="30px" /><br />ATS
                                </button>
                              </div>

                              <div className="btn-group">
                                <button className='btn btn-app p-1' onClick={handleDRT}>
                                  <img src={fichier} alt="" width="30px" /><br />DRT
                                </button>
                              </div>

                              {/* <a className='btn btn-app p-1' href="#" onClick={handleShowModal}>
                                <img src={importexel} alt="" width="30px" /><br />Importer
                              </a> */}
                              <Modal show={showModal} onHide={handleCloseModal}>
                                <Modal.Header className="text-center">
                                  <Modal.Title>Importer les employes</Modal.Title>
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
                              <button className='btn btn-app p-1' onClick={handleExport}>
                                <img src={excel} alt="" width="25px" /><br />Exporter
                              </button>
                            </div>

                            <div className="col-md-4" style={{ flex: '1', marginRight: '10px' }}>
                              <div className="input-group mr-2">
                                <div className="form-outline" data-mdb-input-init> <input
                                  type="search"
                                  id="form1"
                                  className="form-control"
                                  placeholder="Recherche"
                                  style={{ height: "38px" }}
                                  value={searchTerm}
                                  onChange={handleSearchChange}
                                />
                                </div>
                                <div style={{ background: "rgb(202, 200, 200)", padding: "3px", height: "37px", borderRadius: "2px" }}>
                                  <img src={recherche} alt="" height="30px" width="30px" />
                                </div>
                              </div>
                            </div>

                            <div className="col-md-4" style={{ flex: '1', marginRight: '10px' }}>
                              <select
                                name="ecole"
                                className="form-control"
                                required
                                style={{ height: '50px', borderRadius: '8px', backgroundColor: '#F8F8F8' }}
                                onChange={(e) => setSelectedEcole(e.target.value)}
                                value={selectedEcole || ''}
                              >
                                <option value="">Sélectionnez une école</option>
                                {ecole.map((item) => (
                                  <option key={item.id} value={item.id}>
                                    {item.nomecole}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>
                        </div>
                        <div className="card-body mt-2" style={{ overflowX: 'auto', overflowY: 'hidden', scrollBehavior: 'smooth', }}>
                          <table id="example2" className="table table-bordered ">
                            <thead>
                              <tr>
                                <th>Id</th>
                                <th>Photo</th>
                                <th>Code</th>
                                <th>Nom Prénom</th>
                                <th>Email</th>
                                <th>Numéro de téléphone</th>
                                <th>Poste attribué</th>
                                <th>Actuellement employé</th>
                                <th>Déclaration CNAS</th>
                                <th>Ecole</th>
                                <th>Action</th>
                              </tr>
                            </thead>
                            <tbody>
                              {filteredData.slice(indexOfFirstItem, indexOfLastItem).map((item, index) => (
                                // {currentItems.map((item, index) => (
                                <tr key={index} className="p-1 align-middle">
                                  <td>{indexOfFirstItem + index + 1}</td>
                                  <td>
                                    <img className="ronde" src={item.photo ? url + item.photo : utilisateur} alt="Photo de l'employé" />
                                  </td>
                                  <td>{item.CE}</td>
                                  <td>{item.User?.nom} {item.User?.prenom}</td>
                                  <td>{item.User?.email}</td>
                                  <td>{item.User?.telephone}</td>
                                  <td>{item.Poste ? item.Poste.poste : 'Poste non défini'}</td>
                                  <td style={{ padding: "4px", verticalAlign: "middle" }}>
                                    <label className="switch small-switch">
                                      <input
                                        type="checkbox"
                                        checked={item.User?.statuscompte === "activer"}
                                        onChange={() => handleToggleStatus(item.User?.id)}
                                      />
                                      <span className="slider round"></span>
                                    </label>
                                    <br />
                                    {item.User?.dateAD && (
                                      <p style={{ margin: 0, fontSize: "15px" }}>
                                        {moment(item.User?.dateAD).format("YYYY-MM-DD")}
                                      </p>
                                    )}
                                  </td>
                                  <td>{item.declaration == 1 ? 'Oui' : 'Non'}</td>
                                  <td>{item.User?.Ecoles ? item.User?.Ecoles[0]?.nomecole : ''}</td>
                                  <td className="d-flex align-items-center gap-1">
                                    {/* Bouton Profil */}
                                    <button className="btn btn-outline-primary d-flex justify-content-center align-items-center p-1 mr-2"
                                      data-toggle="modal" data-target="#modal-default"
                                      style={{ width: "35px", height: "35px" }}
                                      onClick={() => handleProfileClick(item.id)}>
                                      <img src={rh} alt="" width="22px" title='profile' />
                                    </button>
                                    {/* Bouton Modifier */}
                                    <Link className="btn btn-outline-success d-flex justify-content-center align-items-center p-1  mr-2"
                                      to={`/employes/modifier/${item.id}`}
                                      style={{ width: "35px", height: "35px" }}>
                                      <img src={edit} alt="" width="100%" title='modifier' />
                                    </Link>

                                    {/* Bouton Archiver */}
                                    <button className="btn btn-outline-danger d-flex justify-content-center align-items-center p-1"
                                      style={{ width: "35px", height: "35px" }}
                                      onClick={() => handleShow(item.id)}>
                                      <img src={archive} alt="" width="22px" title='Archiver' />
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
        {/* <ProfileEmploye /> */}
        {selectedEmployeId ? (
          <ProfileEmploye employeId={selectedEmployeId} />
        ) : (
          ''
        )}
        {/* modal supprimer */}
        <Modal show={showDeleteModal} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Confirmer la suppression</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>Êtes-vous sûr de vouloir supprimer  ?</p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Annuler
            </Button>
            <Button
              variant="danger"
              onClick={() => {
                ArchiverEmploye(demandeIdToDelete);
                handleClose();
              }}
            >
              Supprimer
            </Button>
          </Modal.Footer>
        </Modal>


        {/* ATS */}
        <Modal show={showATS} onHide={closeATS} size="xl">
          <Modal.Header closeButton>
            <Modal.Title style={{ font: 'Times Nex Roman', fontSize: '20px', color: '#0056b3', textTransform: 'uppercase' }}>
              Attestation de travail et de salaire</Modal.Title>
          </Modal.Header>
          <Modal.Body className='border p-5'>
            <Form>

              <Row className="mb-3">
                <Col>
                  <Form.Group>
                    <Form.Label> Nom et Prénom Employeur</Form.Label>
                    <Form.Control type="text" name="nomPE" onChange={handleChangeATS} />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group>
                    <Form.Label>N° Adhérent Employeur(CNAS) </Form.Label>
                    <Form.Control type="text" name="AdE" onChange={handleChangeATS} />
                  </Form.Group>
                </Col>

              </Row>
              <Row className="mb-3">
                <Col>
                  <Form.Group>
                    <Form.Label>Raison sociale</Form.Label>
                    <Form.Control type="text" name="RSEmp" onChange={handleChangeATS} />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group>
                    <Form.Label>Adresse</Form.Label>
                    <Form.Control type="text" name="adressEmp" onChange={handleChangeATS} />
                  </Form.Group>
                </Col>
              </Row>

              <hr />
              <Row className="mb-3">
                <Col>
                  <Form.Group>
                    <Form.Label>Date de Début *</Form.Label>
                    <Form.Control type="date" name="dateDebut" onChange={handleChangeATS} />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group>
                    <Form.Label>Date de Fin *</Form.Label>
                    <Form.Control type="date" name="dateFin" onChange={handleChangeATS} />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group>
                    <Form.Label>Employé(s) *</Form.Label>
                    <div className="col-md-12">
                      <Select
                        styles={customStyles}
                        options={employees}
                        onChange={(selected) => {
                          setSelectedEmployee(selected);
                          // Si vous souhaitez également stocker les données de l'employé sélectionné
                          const selectedEmployeeData = data.find(emp => emp.id === selected.value);
                          setSelectedEmployee(selectedEmployeeData); // Ajoutez cet état pour stocker l'employé sélectionné
                        }}
                        placeholder="Sélectionner un employé"
                      />
                    </div>
                  </Form.Group>

                </Col>
              </Row>

              <hr />
              <h6 style={{ color: '#0056b3' }}>Renseignements nécessaires à l'étude des droits</h6>
              <Row className="mb-3">
                <Col>
                  <Form.Group>
                    <Form.Label>Dernier jour de travail</Form.Label>
                    <Form.Control type="date" name="dernierJourTravail" onChange={handleChangeATS} />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group>
                    <Form.Label>Date de reprise de travail</Form.Label>
                    <Form.Control type="date" name="dateRepriseTravail" onChange={handleChangeATS} />
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group className="mb-3">
                <Form.Label>L'intéressé(e) n'a pas repris son travail à ce jour</Form.Label>
                <Form.Control type="date" name="dateNonReprise" onChange={handleChangeATS} />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Check
                  type="radio"
                  label="Cas d'arrêt de travail d'une durée inférieure à 6 mois et en cas de maternité"
                  name="raisonArret"
                  value="courte"
                  checked={formDataATS.raisonArret === 'courte'}
                  onChange={handleChangeATS}
                />
                <Form.Check
                  type="radio"
                  label="Cas d'arrêt de travail d'une durée dépassant 6 mois et en cas d'invalidité"
                  name="raisonArret"
                  value="longue"
                  checked={formDataATS.raisonArret === 'longue'}
                  onChange={handleChangeATS}
                />
              </Form.Group>

              <p className="fw-bold">
                Au cours des 3 mois ou des 12 mois de date à date précédant la constatation de la maladie ou de la grossesse l’assuré(e) a travaillé pendant
              </p>

              <Row className="mb-3">
                <Col>
                  <Form.Group>
                    <Form.Label>Nombre de jours</Form.Label>
                    <Form.Control type="number" name="joursTravail" onChange={handleChangeATS} />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group>
                    <Form.Label>Nombre d’heures</Form.Label>
                    <Form.Control type="number" name="heuresTravail" onChange={handleChangeATS} />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Form.Group>
                    <Form.Label>Date début</Form.Label>
                    <Form.Control type="date" name="periodeDebut" onChange={handleChangeATS} />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group>
                    <Form.Label>Date fin</Form.Label>
                    <Form.Control type="date" name="periodeFin" onChange={handleChangeATS} />
                  </Form.Group>
                </Col>
              </Row>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={closeATS}>
              Annuler
            </Button>
            <Button onClick={() => genererATS(formDataATS)}>
              Générer ATS
            </Button>

          </Modal.Footer>
        </Modal>
        {/* DRT */}
        <Modal show={showDRT} onHide={closeDRT} size="lg">
          <Modal.Header closeButton>
            <Modal.Title style={{ font: 'Times Nex Roman', fontSize: '20px', color: '#0056b3', textTransform: 'uppercase' }}>
              DECLARATION DE REPRISE OU DE NON REPRISE DE TRAVAIL
            </Modal.Title>
          </Modal.Header>


          <Modal.Body className='border p-5'>
            <Form>
              <Row className="mb-3">
                <Col>
                  <Form.Group>
                    <Form.Label>Employé *</Form.Label>
                    <Select
                      options={employees}
                      onChange={(selected) => {
                        setSelectedEmployee(selected);
                        const selectedEmployeeData = data.find(emp => emp.id === selected.value);
                        setSelectedEmployee(selectedEmployeeData);
                      }}
                      placeholder="Sélectionner un employé"
                    />
                  </Form.Group>
                </Col>
              </Row>

              <hr />
              <h6 style={{ color: '#0056b3' }}>Renseignements nécessaires à l'étude des droits</h6>

              <Row className="mb-3">
                <Col>
                  <Form.Group>
                    <Form.Label>Ayant cessé le travail le *</Form.Label>
                    <Form.Control type="date" name="dernierJourTravail" onChange={handleChangeDRT} />
                  </Form.Group>
                </Col>
              </Row>

              {/* Radio Buttons */}
              <Form.Group className="mb-3">
                <Form.Check
                  type="radio"
                  label="A repris le travail"
                  name="repriseTravail"
                  value="oui"
                  checked={formDataATS.repriseTravail === 'oui'}
                  onChange={() => setFormDataATS({ ...formDataATS, repriseTravail: 'oui' })}
                />
                <Form.Check
                  type="radio"
                  label="N’a pas repris le travail"
                  name="repriseTravail"
                  value="non"
                  checked={formDataATS.repriseTravail === 'non'}
                  onChange={() => setFormDataATS({ ...formDataATS, repriseTravail: 'non' })}
                />
              </Form.Group>

              {/* Champs conditionnels */}
              {formDataATS.repriseTravail === 'oui' && (
                <Form.Group className="mb-3">
                  <Form.Label>Date de reprise de travail</Form.Label>
                  <Form.Control type="date" name="dateRepriseTravail" onChange={handleChangeDRT} />
                </Form.Group>
              )}

              {formDataATS.repriseTravail === 'non' && (
                <Form.Group className="mb-3">
                  <Form.Label>N’a pas repris le travail le</Form.Label>
                  <Form.Control type="date" name="dateNonReprise" onChange={handleChangeDRT} />
                </Form.Group>
              )}

              <hr />
              <h6 style={{ color: '#0056b3' }}>Signature</h6>
              <Row className="mb-3">
                <Col>
                  <Form.Group>
                    <Form.Label>Fait à</Form.Label>
                    <Form.Control
                      type="text"
                      name="faitA"
                      value={formDataATS.faitA || ""}
                      onChange={handleChangeDRT}
                    />
                  </Form.Group>
                </Col>

                <Col>
                  <Form.Group>
                    <Form.Label>Signataire *</Form.Label>

                    {/* Radios */}
                    <div className="mb-2">
                      <Form.Check
                        inline
                        type="radio"
                        label="Employé"
                        name="signataireType"
                        checked={!isExterne}
                        onChange={() => {
                          setIsExterne(false);
                          setsignataire(null);
                        }}
                      />
                      <Form.Check
                        inline
                        type="radio"
                        label="Externe"
                        name="signataireType"
                        checked={isExterne}
                        onChange={() => {
                          setIsExterne(true);
                          setsignataire(null);
                        }}
                      />
                    </div>

                    {/* Affichage conditionnel */}
                    {!isExterne ? (
                      <Select
                        styles={customStyles}
                        options={employees}
                        onChange={(selected) => {
                          const selectedSignataireData = data.find(emp => emp.id === selected.value);
                          setsignataire(selectedSignataireData);
                        }}
                        placeholder="Sélectionner un signataire"
                      />
                    ) : (
                      <Form.Control
                        type="text"
                        placeholder="Nom et Prénom et Poste du signataire externe"
                        onChange={(e) => setsignataire({ nom: e.target.value })}

                      />
                    )}
                  </Form.Group>
                </Col>
              </Row>
            </Form>
          </Modal.Body>

          <Modal.Footer>
            <Button variant="secondary" onClick={closeDRT}>
              Annuler
            </Button>
            <Button onClick={() => genererDRT(formDataATS)}>
              Générer DRT
            </Button>
          </Modal.Footer>
        </Modal>



      </div>
    </>
  );
}

export default Employes;