import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Select from 'react-select';
import { nationalites, Paiement } from '../pages/RH/Employes/OptionSelect';
import printer from '../assets/imgs/printer.png'
import Poste from '../pages/RH/Poste';
import axios from 'axios';
import Service from '../pages/RH/Service';
import moment from 'moment';
import rh from '../assets/imgs/employe.png'




const ProfileE = () => {
  const url = "http://localhost:5000"

  const [step, setStep] = useState(1);
  const [PaimentOption, setPaiment] = useState(null);
  const [postes, setPostes] = useState([]);
  const [services, setServices] = useState([]);
  const [selectedPosteId, setSelectedPosteId] = useState(null);
  const [selectedServiceId, setSelectedServiceId] = useState(null);
  const [data, setData] = useState([]);
  const [bulletinsp, setbulletinsp] = useState([]);

  useEffect(() => {
    const fetchEmploye = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          alert("Vous devez être connecté pour soumettre le formulaire.");
          return;
        }
        const response = await axios.get('http://localhost:5000/employes/me', {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        console.log('response.data', response.data);
        let disponibilites = {
          lundi: { disponible: false, heures: [] },
          mardi: { disponible: false, heures: [] },
          mercredi: { disponible: false, heures: [] },
          jeudi: { disponible: false, heures: [] },
          vendredi: { disponible: false, heures: [] },
          samedi: { disponible: false, heures: [] },
          dimanche: { disponible: false, heures: [] }
        };
        if (response.data.Enseignant?.disponibilites) {
          try {
            disponibilites = typeof response.data.Enseignant.disponibilites === 'string'
              ? JSON.parse(response.data.Enseignant.disponibilites)
              : response.data.Enseignant.disponibilites;
          } catch (e) {
            console.error("Erreur de parsing des disponibilités:", e);
          }
        }

        console.log('response.data', response.data)

        setData(response.data);
        setValues({
          nom: response.data.User.nom || '',
          prenom: response.data.User.prenom || '',
          nom_arabe: response.data.User.nom_ar || '',
          prenom_arabe: response.data.User.prenom_ar || '',
          datenaiss: moment(response.data.User.datenaiss).format('YYYY-MM-DD') || '',
          tel: response.data.User.telephone || '',
          mail: response.data.User.email || '',
          nationalite: response.data.User.nationalite || '',
          sexe: response.data.User.sexe || '',
          Lieunais: response.data.User.lieuxnaiss || '',
          lieunaisArabe: response.data.User.lieuxnaiss_ar || '',
          sitfamiliale: response.data.sitfamiliale || '',
          nbrenfant: response.data.nbrenfant || 0,
          adresse: response.data.User.adresse || '',
          adresse_ar: response.data.User.adresse_ar || '',
          TypePI: response.data.TypePI || '',
          NumPI: response.data.NumPI || '',
          NumPC: response.data.NumPC || '',
          NumAS: response.data.NumAS || '',
          daterecru: moment(response.data.daterecru).format('YYYY-MM-DD') || '',
          NVTetudes: response.data.NVTetudes || '',
          Experience: response.data.Experience || '',
          SalairNeg: response.data.SalairNeg || '',
          TypeContrat: response.data.TypeContrat || '',
          DateFinContrat: moment(response.data.DateFinContrat).format('YYYY-MM-DD') || '',
          Remarque: response.data.Remarque || '',
          HeureEM: response.data.HeureEM || '',
          HeureSM: response.data.HeureSM || '',
          HeureEAM: response.data.HeureEAM || '',
          HeureSAM: response.data.HeureSAM || '',
          user: response.data.User.username || '',
          pwd: '',
          Typepai: response.data.Typepai || '',
          CE: response.data.CE || '',
          npe: response.data.Enseignant?.npe || '',
          pfe: response.data.Enseignant?.pfe || '',
          ddn: moment(response.data.Enseignant?.ddn).format('YYYY-MM-DD') || '',
          ninn: response.data.Enseignant?.ninn || '',
          poste: response.data.poste || '',
          service: response.data.service || '',
          nbrHeureLegale: response.data.nbrHeureLegale || '',
          Numpai: response.data.Numpai || '',
          nbrJourTravail: response.data.nbrJourTravail || '',
          disponibilites: disponibilites,
          // disponibilites: response.data.Enseignant?.disponibilites || {
          //   lundi: { disponible: false, heures: [] },
          //   mardi: { disponible: false, heures: [] },
          //   mercredi: { disponible: false, heures: [] },
          //   jeudi: { disponible: false, heures: [] },
          //   vendredi: { disponible: false, heures: [] },
          //   samedi: { disponible: false, heures: [] },
          //   dimanche: { disponible: false, heures: [] }
          // },
        });

        setSelectedPosteId(response.data.poste)
        console.log('Disponibilités:', response.data.Enseignant?.disponibilites);
      } catch (error) {
        console.error('Erreur lors de la récupération des informations de l\'employé', error);
      }
    };
    fetchEmploye();

  }, []);

  const handleChangePaiement = PaimentOption => { setPaiment(PaimentOption); };
  // chap obligatoires
  const [values, setValues] = useState({
    nom: '',
    prenom: '',
    nom_arabe: '',
    prenom_arabe: '',
    datenaiss: '',
    tel: '',
    mail: '',
    nationalite: '',
    sexe: '',
    Lieunais: '',
    lieunaisArabe: '',
    sitfamiliale: '',
    nbrenfant: 0,
    adresse: '',
    adresse_ar: '',
    TypePI: '',
    NumPI: '',
    NumPC: '',
    NumAS: '',
    daterecru: '',
    NVTetudes: '',
    Experience: '',
    SalairNeg: '',
    TypeContrat: '',
    DateFinContrat: '',
    Remarque: '',
    HeureEM: '',
    HeureSM: '',
    HeureEAM: '',
    HeureSAM: '',
    user: '',
    pwd: '',
    Typepai: '',
    CE: '',
    npe: '',
    pfe: '',
    ddn: '',
    ninn: '',
    poste: '',
    service: '',
    nbrHeureLegale: '',
    Numpai: '',
    nbrJourTravail: '',
    disponibilites: {
      lundi: { disponible: false, heures: [] },
      mardi: { disponible: false, heures: [] },
      mercredi: { disponible: false, heures: [] },
      jeudi: { disponible: false, heures: [] },
      vendredi: { disponible: false, heures: [] },
      samedi: { disponible: false, heures: [] },
      dimanche: { disponible: false, heures: [] }
    }

  });
  const [errors, setErrors] = useState({});
  useEffect(() => {
    handleListPostes(); // Récupérer la liste des postes
    handleListServices(); // Récupérer la liste des services
  }, []);


  const handleListPostes = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Vous devez être connecté pour soumettre le formulaire.");
        return;
      }
      const response = await axios.get('http://localhost:5000/postes/liste', {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      const postesOptions = response.data.map(poste => ({
        value: poste.id,
        label: poste.poste
      }));
      //   console.log('les poste recuperre is ', postesOptions)
      setPostes(postesOptions);
    } catch (error) {
      console.error('Erreur lors de la récupération des postes', error);
    }
  };
  const handleListServices = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Vous devez être connecté pour soumettre le formulaire.");
      return;
    }
    try {
      const response = await axios.get('http://localhost:5000/services/liste', {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      const servicesOptions = response.data.map(service => ({
        value: service.id, // ID du service
        label: service.service // Nom du service
      }));
      setServices(servicesOptions);
    } catch (error) {
      console.error('Erreur lors de la récupération des services', error);
    }
  };

  const handleSelectPosteChange = (selectedOption) => {
    setSelectedPosteId(selectedOption.value);
    setValues({ ...values, poste: selectedOption.value });
  };
  const handleSelectServiceChange = (selectedOption) => {
    setSelectedServiceId(selectedOption.value);
    setValues({ ...values, service: selectedOption.value });
  };
  //metter a jour les liste lors de l'ajout
  const handlePosteAdded = () => {
    handleListPostes();
  };
  const handleServiceAdd = () => {
    handleListServices();

  }

  const [selectedOption, setSelectedOption] = useState(null);

  const nextStep = () => {
    const newErrors = validateStep(step);
    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) setStep(step + 1);
  };
  const prevStep = () => setStep(step - 1);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    // setValues({ ...values, [name]: value });

    if (type === "file") {
      const photo = e.target.files[0];
      setValues({ ...values, [name]: photo });
    } else {
      const { value } = e.target;
      setValues({ ...values, [name]: value });
    }
    setErrors({ ...errors, [name]: '' });
  };

  const handleSelectChange = (selectedOption) => {
    setSelectedOption(selectedOption);
    setValues({ ...values, nationalite: selectedOption.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateStep(step);
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          alert("Vous devez être connecté pour soumettre le formulaire.");
          return;
        }
        const formFile = new FormData();
        // formFile.append('file',values.file)
        // Ajouter tous les champs automatiquement
        // Object.entries(values).forEach(([key, value]) => {
        //   formFile.append(key, value);
        //   //   console.log(key, value);
        // });
        Object.entries(values).forEach(([key, value]) => {
          // Pour le champ disponibilites, on le convertit en JSON string
          if (key === 'disponibilites') {
            formFile.append(key, JSON.stringify(value));
          } else {
            formFile.append(key, value);
          }
        });

        const response = await axios.put(`http://localhost:5000/employes/modifier/${data.id}`, formFile, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },

        });
        if (response.status === 200) {
          alert('Employé modifié avec succès')
        }
        // console.log('Employé modifié avec succès', response.data);
      } catch (error) {
        if (error.response) {
          console.error('Erreur backend:', error.response.data.message);
        } else if (error.request) {
          console.error('Erreur réseau:', error.request);
        } else {
          console.error('Erreur inconnue:', error.message);
        }
        alert('Erreur lors de la modification du formulaire');
      }
    }
  };

  const validateStep = (step) => {
    const newErrors = {};
    switch (step) {
      case 1:
        if (!values.nom) newErrors.nom = 'Ce champ est requis.';
        if (!values.prenom) newErrors.prenom = 'Ce champ est requis.';
        if (!values.nom_arabe) newErrors.nom_arabe = 'Ce champ est requis.';
        if (!values.prenom_arabe) newErrors.prenom_arabe = 'Ce champ est requis.';
        if (!values.datenaiss) newErrors.datenaiss = 'Ce champ est requis.';
        const fileError = validateFile(values.photo);
        if (fileError) { newErrors.photo = fileError; }
        break;
      case 2:
        // if (!values.ndi) newErrors.ndi = 'Sélectionnez une pièce d\'identité.';
        break;
      case 3:
        if (!values.poste) newErrors.poste = 'Ce champ est requis.';
        if (!values.service) newErrors.service = 'Ce champ est requis.';
        if (!values.daterecru) newErrors.daterecru = 'Ce champ est requis.';
        if (!values.HeureEAM) newErrors.HeureEAM = 'Ce champ est requis.';
        if (!values.HeureEM) newErrors.HeureEM = 'Ce champ est requis.';
        if (!values.HeureSAM) newErrors.HeureSAM = 'Ce champ est requis.';
        if (!values.HeureSM) newErrors.HeureSM = 'Ce champ est requis.';
        if (!values.daterecru) newErrors.daterecru = 'Ce champ est requis.';
        if (!values.DateFinContrat) newErrors.DateFinContrat = 'Ce champ est requis.';
        break;
      case 5:
        if (!values.ninn) newErrors.ninn = 'Ce champ est requis.';
        break;
      default:
        break;
    }
    return newErrors;
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


  // Fonction pour générer le mot de passe
  const generatePassword = (datenaiss) => {
    if (!datenaiss) return '';

    const [year, month, day] = datenaiss.split('-');
    const firstDigitDay = day.charAt(0);
    const firstDigitMonth = month.charAt(0);
    const lastTwoDigitsYear = year.slice(-2);

    // Générer 4 chiffres aléatoires
    const randomDigits = Math.floor(1000 + Math.random() * 9000); // 4 chiffres aléatoires

    return `${firstDigitDay}${firstDigitMonth}${lastTwoDigitsYear}${randomDigits}`;
  };

  const renderStepIndicator = () => {
    return (

      <div className="step-indicator d-flex justify-content-between align-items-center p-3">
        {
          [
            { icon: data.photo, label: 'Profil' },
            { icon: data.photo, label: 'Identifiants administratifs' },
            { icon: data.photo, label: 'Informations professionnelles' },
            { icon: data.photo, label: 'Informations du compte' },
            // {postes.find(poste => poste.value === selectedPosteId)?.label)==="enseignant ")?"":""}
            // {  icon: rh, label: 'Informations du enseignant' },
            ...(postes.find(poste => poste.value === selectedPosteId)?.label === "Enseignant" ? [{ icon: data.photo, label: 'Informations de l\'enseignant' }] : [])
          ]
            .map((item, index) => (
              <div key={index} className={`step ${step === index + 1 ? 'active' : ''} text-center`}>
                {/* <ImageProtegee imagePath={item.icon} alt={`Étape ${index + 1}`} className="step-icon" style={{ width: 50, height: 50 }} /> */}
                <img src={url + item.icon} />
                <p className="mt-2">{item.label}</p>
              </div>
            ))
        }

      </div>
    );
  };

  //verifier type de photo
  const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/jpg"];
  const maxSize = 5 * 1024 * 1024; // 5 Mo
  const validateFile = (file) => {
    if (file) {
      if (!allowedTypes.includes(file.type)) {
        return "Format non autorisé. Veuillez choisir une image";
      }
      if (file.size > maxSize) {
        return "Le fichier est trop volumineux. La taille maximale est de 5 Mo.";
      }
    }
    return "";
  };

  const [showPassword, setShowPassword] = useState(false);
  const togglePasswordVisibility = () => {
    setShowPassword(prevState => !prevState);
  };


  //imprimer

  const [selectedOptions, setSelectedOptions] = useState([]);
  const [showPrintOptions, setShowPrintOptions] = useState(false);
  const [showPrintOptionsME, setShowPrintOptionsME] = useState(false);
  const [selectedPrintOption, setSelectedPrintOption] = useState('');
  const [printOptions, setPrintOptions] = useState([]);

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
        value: doc.id,
        label: doc.nom,
        modele: doc.modeleTexte
      }));

      setPrintOptions(options);
    } catch (error) {
      console.log("Erreur lors de la récupération des attestations", error);
    }
  };

  const handlePrintClickMe = () => {
    setShowPrintOptionsME(!showPrintOptionsME);
  };
  const handlePrintOptionSelectME = (option) => {
    setSelectedPrintOption(option.value);
    setShowPrintOptionsME(false);
    handlePrint(data, option.modele, option.label);
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
      .replace(/\[daterecru\]/g, employe.daterecru ? moment(employe.daterecru).format('DD/MM/YYYY') : "")
      .replace(/\[dateToday\]/g, dateToday)
      .replace(/\[N°AS\]/g, employe.NumAS || "");
    // Créer un iframe pour l'impression
    console.log(modeleTextupdate)
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
// <<<<<<< HEAD


// =======


  //bultein de apie 


  useEffect(() => {
    bulletins()
  }, [])

  const bulletins = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Vous devez être connecté");
        return;
      }
      const response = await axios.get('http://localhost:5000/BultteinPaie/journalPaie/Employe',
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log('responsjj',response.data)
      setbulletinsp(response.data);
    } catch (error) {
      console.log("Erreur lors de la récupération", error);
    }
  };



  const ImprimerBP = (bulletinHTML) => {
    const printWindow = window.open("", "_blank");
    printWindow.document.write(bulletinHTML);
    printWindow.document.close();
    printWindow.print();
  };
// >>>>>>> dounia
  return (
    <>
      <nav>
      </nav>

      <div className="container mt-5">
        <div className="card card-primary card-outline p-4">
          {renderStepIndicator()}
          <div className="form-content mt-3">
            {/* Profil */}
            {step === 1 && (
              <>
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
                <div className="row">
                  <div className="col-md-4">
                    <label>Nom *</label>
                    <input type="text" name="nom" className="form-control" readOnly value={values.nom} onChange={handleChange} />
                    {errors.nom && <div className="text-danger">{errors.nom}</div>}
                  </div>
                  <div className="col-md-4">
                    <label>Prénom *</label>
                    <input type="text" name="prenom" className="form-control"  readOnly value={values.prenom} onChange={handleChange} />
                    {errors.prenom && <div className="text-danger">{errors.prenom}</div>}
                  </div>
                  <div className="col-md-4">
                    <label>Numéro du téléphone </label>
                    <input type="text" name="tel" className="form-control" readOnly value={values.tel} onChange={handleChange} />
                    {errors.tel && <div className="text-danger">{errors.tel}</div>}
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-4">
                    <label>Nom en arabe *</label>
                    <input type="text" name="nom_arabe"  readOnly className="form-control" value={values.nom_arabe} onChange={handleChange} />
                    {errors.nom_arabe && <div className="text-danger">{errors.nom_arabe}</div>}

                  </div>
                  <div className="col-md-4">
                    <label>Prénom en arabe *</label>
                    <input type="text" name="prenom_arabe" className="form-control" readOnly value={values.prenom_arabe} onChange={handleChange} />
                    {errors.prenom_arabe && <div className="text-danger">{errors.prenom_arabe}</div>}

                  </div>
                  <div className="col-md-4">
                    <label>Email</label>
                    <input type="gmail" name="mail" className="form-control" value={values.mail} onChange={handleChange} />
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-3">
                    <label htmlFor="file" className="file-label"> Photo</label>
                    <div style={{ border: "1px solid rgb(192, 193, 194)", height: "30px", display: "flex", alignItems: "center", justifyContent: "center", padding: "5px", borderRadius: "5px", cursor: "pointer" }}>
                      <label htmlFor="file" style={{ marginRight: "10px", fontWeight: "bold", cursor: "pointer", color: 'rgb(65, 105, 238)' }}>
                        {!(values.photo) ? "Choisir une photo" : <span style={{ marginLeft: "10px", fontSize: "14px" }}>{values.photo.name}</span>}
                      </label>
                      <input
                        id="file"
                        type="file"
                        name="photo"
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
                    {errors.photo && <div className="text-danger">{errors.photo}</div>}

                  </div>
                  <div className="col-md-3">
                    <label>Date de naissance *</label>
                    <input type="date" name="datenaiss" readOnly className="form-control" value={values.datenaiss} onChange={handleChange} />
                    {errors.datenaiss && <div className="text-danger">{errors.datenaiss}</div>}
                  </div>

                  <div className="col-md-3">
                    <label>Nationalité</label>
                    <Select
                      isDisabled
                      onChange={handleSelectChange}
                      options={nationalites}
                      styles={customStyles}
                      value={nationalites.find(option => option.value === values.nationalite)}
                      name='nationalite'
                    />
                  </div>
                  <div className="col-md-3">
                    <label>Sexe</label>
                    <select name="sexe" className="form-control" value={values.sexe}   disabled onChange={handleChange}>
                      <option value="">Sélectionner...</option>
                      <option value="Masculin">Masculin</option>
                      <option value="Féminin">Féminin</option>
                    </select>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6">
                    <label>Lieu de naissance</label>
                    <input type="text" readOnly name="Lieunais" className="form-control" value={values.Lieunais} onChange={handleChange} />
                  </div>
                  <div className="col-md-6">
                    <label>Lieu de naissance en arabe</label>
                    <input type="text" readOnly name="lieunaisArabe" className="form-control" value={values.lieunaisArabe} onChange={handleChange} />
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-4">
                    <label htmlFor="sitfamiliale" >
                      Situation familiale
                    </label>

                    <select value={values.sitfamiliale} onChange={handleChange}
                      name="sitfamiliale"
                      className="form-control"
                      id="sitfamiliale"
                      disabled
                    >
                      <option value="">Sélectionner...</option>
                      <option value="Marié">Marié</option>
                      <option value="Divorcé">Divorcé</option>
                      <option value="Célibataire">Célibataire</option>
                    </select>

                  </div>
                  <div className="col-md-4">
                    <label htmlFor="nbrenfant">Nombre d'enfants</label>
                    <div className="input-group has-validation">
                      <input
                       readOnly
                        name='nbrenfant'
                        type="number"
                        className="form-control"
                        id="nbrenfant"
                        min={0}
                        step="any"
                        value={values.nbrenfant} onChange={handleChange}

                      />
                    </div>
                  </div>
                  <div className="col-md-4">
                    <label htmlFor="idr" >Adresse</label>
                    <div className="input-group has-validation">
                      <input
                        readOnly
                        name='adresse'
                        type="text"
                        className="form-control"
                        id="adr"
                        value={values.adresse} onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="col-md-4">
                    <label htmlFor="idr" >Adresse en arabe</label>
                    <div className="input-group has-validation">
                      <input
                        readOnly
                        name='adresse_ar'
                        type="text"
                        className="form-control"
                        id="adr"
                        value={values.adresse_ar} onChange={handleChange}
                      />
                    </div>
                  </div>


                </div>
                <button className="btn btn-primary mt-3" onClick={nextStep}>Suivant</button>
              </>
            )}

            {/*  Identifiants administratifs */}
            {step === 2 && (
              <>
                <div className="card-body">
                  <div className="row">
                    <div className="col-md-6">
                      <label>Type de pièce d'identité</label>
                      <select name="TypePI" className="form-control" value={values.TypePI} 
                      onChange={handleChange}  disabled>
                        <option value="">Sélectionner...</option>
                        <option value="Carte d'identité nationale">Carte d'identité nationale</option>
                        <option value="Passeport">Passeport</option>
                        <option value="Carte de résident">Carte de résident</option>
                      </select>
                    </div>

                    <div className="col-md-6">
                      <label>Numéro d'identification</label>
                      <input
                        readOnly
                        type="text"
                        name="NumPI"
                        className="form-control"
                        value={values.NumPI}
                        onChange={handleChange} />
                    </div>

                  </div>
                  <div className="row">
                    <div className="col-md-6">
                      <label htmlFor="NumPC">Numéro de permis de conduire</label>
                      <div className="input-group has-validation">
                        <input name='NumPC' readOnly type="text" className="form-control"
                          value={values.NumPC}
                          onChange={handleChange} />
                      </div>
                    </div>

                    <div className="col-md-6">
                      <label htmlFor="NumAS">Numéro d'assurance sociale</label>
                      <div className="input-group has-validation">
                        <input name='NumAS' readOnly type="text" className="form-control"
                          value={values.NumAS}
                          onChange={handleChange} />
                      </div>
                    </div>
                  </div>
                  <button className="btn btn-secondary mt-3 me-2" onClick={prevStep}>Précédent</button>
                  <button className="btn btn-primary mt-3" onClick={nextStep}>Suivant</button>
                </div>
              </>
            )}

            {/*Informations professionnelles */}
            {step === 3 && (
              <>
                <div className="card-body">
                  <div className="row">

                    <div className="col-md-4  ">
                      <label>Poste attribué *

                      </label>
                      <Select
                        isDisabled
                        name='poste'
                        options={postes}
                        onChange={handleSelectPosteChange}
                        styles={customStyles}
                        value={postes.find(option => option.value === values.poste)}
                      />
                      {errors.poste && <div className="text-danger">{errors.poste}</div>}

                    </div>

                    <div className="col-md-4">
                      <label>Service *
                      </label>
                      <Select
                      isDisabled
                        name='service'
                        options={services}
                        onChange={handleSelectServiceChange}
                        styles={customStyles}
                        value={services.find(option => option.value === values.service)}
                      />
                      {errors.service && <div className="text-danger">{errors.service}</div>}
                    </div>
                    <div className="col-md-4">
                      <label htmlFor="CE" >Code d'employé</label>
                      <input name='CE' className="form-control" id="CE"
                      readOnly
                        value={values.CE}
                        onChange={handleChange} />
                    </div>



                  </div>
                  <div className="row">
                    <div className="col-md-4">
                      <label>Date du recrutement *</label>
                      <input type="date" name="daterecru" className="form-control" value={values.daterecru}
                        onChange={handleChange} readOnly />
                    </div>
                    <div className="col-md-4">
                      <label htmlFor="TypeContrat" >Type de Contrat *</label>
                      <div className="input-group has-validation">
                        <input name='TypeContrat' type="text" className="form-control"
                          value={values.TypeContrat}
                          onChange={handleChange} readOnly />
                      </div>
                    </div>
                    <div className="col-md-4">
                      <label htmlFor="DateFinContrat" >Date fin du contrat</label>
                      <input
                      readOnly
                        name='DateFinContrat'
                        type="date"
                        className="form-control"
                        id="date"
                        value={values.DateFinContrat}
                        onChange={handleChange}
                      />
                      {errors.DateFinContrat && <div className="text-danger">{errors.DateFinContrat}</div>}

                    </div>


                  </div>
                  <div className="row">
                    <div className="col-md-4">
                      <label htmlFor="NVTetudes" >Niveau  et type d'etudes</label>
                      <input name='NVTetudes' type="NVTetudes" className="form-control" value={values.NVTetudes}
                        onChange={handleChange}  readOnly/>
                    </div>
                    <div className="col-md-4">
                      <label htmlFor="Experience">Expériences </label>
                      <input name='Experience' type="text" className="form-control" id="Experience" value={values.Experience}
                        onChange={handleChange} readOnly/>
                    </div>
                    <div className="col-md-4">
                      <label htmlFor="SalairNeg" readOnly>Salaire de Base *</label>
                      <div className="input-group has-validation">
                        <input name='SalairNeg' readOnly type="text" className="form-control" value={values.SalairNeg}
                          onChange={handleChange} />
                      </div>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-3">
                      <label htmlFor="Typepai">Type de paiement</label>
                      <select name='Typepai' className="form-control" value={values.Typepai} 
                      onChange={handleChange} disabled>
                        <option value="paiement en espéces">paiement en espéces</option>
                        <option value="virement bancaire">virement bancaire</option>
                        <option value="CCP">CCP</option>
                      </select>
                    </div>

                    <div className="col-md-3">
                      <label htmlFor="Numpai"  >Numéro de Paiement  </label>
                      <input name='Numpai' className="form-control" id="Numpai"
                        value={values.Numpai} readOnly
                        onChange={handleChange} />
                      <small className="text-muted">Indiquez le numéro CCP ou RIB selon le type de paiement</small>
                    </div>
                    <div className="col-md-3">
                      <label htmlFor="nbrJourTravail">Nombre de jours travaillés</label>
                      <input
                      readOnly
                        name="nbrJourTravail"
                        className="form-control"
                        id="nbrJourTravail"
                        value={values.nbrJourTravail}
                        onChange={handleChange}
                      />
                      {errors.nbrJourTravail && <div className="text-danger">{errors.nbrJourTravail}</div>}

                    </div>

                    <div className="col-md-3">
                      <label htmlFor="nbrHeureLegale">Nombre d'heures légales</label>
                      <input
                      readOnly
                        name="nbrHeureLegale"
                        className="form-control"
                        id="nbrHeureLegale"
                        value={values.nbrHeureLegale}
                        onChange={handleChange}
                      />
                      {errors.nbrHeureLegale && <div className="text-danger">{errors.nbrHeureLegale}</div>}

                    </div>

                  </div>
                  <div className="row mt-3 mb-3">
                    <div className="col-md-3">
                      <label>Heure d'entrée du matin *</label>
                      <input type="time" readOnly className="form-control custom-input" name='HeureEM'
                        value={values.HeureEM}
                        onChange={handleChange} />
                    </div>
                    <div className="col-md-3">
                      <label>Heure de sortie du matin *</label>
                      <input type="time"readOnly className="form-control custom-input" name='HeureSM'
                        value={values.HeureSM}
                        onChange={handleChange} />

                      {errors.HeureSM && <div className="text-danger">{errors.HeureSM}</div>}
                    </div>

                    <div className="col-md-3">
                      <label>Heure d'entrée de l'après-midi *</label>
                      <input type="time" readOnly className="form-control custom-input" name='HeureEAM'
                        value={values.HeureEAM}
                        onChange={handleChange} />

                      {errors.HeureEAM && <div className="text-danger">{errors.HeureEAM}</div>}

                    </div>
                    <div className="col-md-3">
                      <label>Heure de sortie de l'après-midi *</label>
                      <input type="time"readOnly className="form-control custom-input" name='HeureSAM'
                        value={values.HeureSAM}
                        onChange={handleChange} />
                      {errors.HeureSAM && <div className="text-danger">{errors.HeureSAM}</div>}

                    </div>
                  </div>
               
                </div>
                <button className="btn btn-secondary mt-3 me-2" onClick={prevStep}>Précédent</button>
                <button className="btn btn-primary mt-3" onClick={nextStep}>Suivant</button>
                <Poste onPosteAdded={handlePosteAdded} />
                <Service onServiceAdded={handleServiceAdd} />
              </>
            )}

            {/* Informations du compte */}
            {step === 4 && (
              <>
                <div className="card-body">
                  <div className="row">
                    <div className="col-md-6">
                      <label htmlFor="username" className="form-label">
                        Nom d'utilisateur
                      </label>
                      <div className="input-group has-validation">
                        <span className="input-group-text" id="inputGroupPrepend">
                          @
                        </span>
                        <input
                          name="user"
                          type="text"
                          className="form-control"
                          id="username"
                          value={values.user}
                          onChange={handleChange}
                          aria-describedby="inputGroupPrepend"
                          required
                        />
                      </div>
                    </div>
                    {/* Mot de passe */}
                    <div className="col-md-6">
                      <label htmlFor="password" className="form-label">Mot de passe</label>
                      <div className="input-group">
                        <input
                          name="pwd" // Updated to match the model
                          type={showPassword ? "text" : "password"}
                          className="form-control"
                          id="password"
                          value={values.pwd} // Updated to match the model
                          onChange={handleChange}
                          required
                        />
                        <span
                          className="input-group-text"
                          onClick={togglePasswordVisibility}
                          style={{ cursor: "pointer" }}
                        >
                          {showPassword ? (
                            <i className="fa fa-eye-slash" aria-hidden="true"></i> // Icône pour masquer
                          ) : (
                            <i className="fa fa-eye" aria-hidden="true"></i> // Icône pour afficher
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <button className="btn btn-secondary mt-3 me-2" onClick={prevStep}>Précédent</button>
                {postes.find(poste => poste.value === selectedPosteId)?.label === "Enseignant" && (
                  <button className="btn btn-primary mt-3" onClick={nextStep}>Suivant</button>

                )}
                {!(postes.find(poste => poste.value === selectedPosteId)?.label === "Enseignant") && (
                  <button className="btn btn-success mt-3" onClick={handleSubmit}>Soumettre</button>
                )}

              </>
            )}

            {/* champs enseignants */}
            {/* Informations du compte */}
            {step === 5 && (
              <>
                {
                  ((postes.find(poste => poste.value === selectedPosteId)?.label) === "Enseignant") ?

                    <div className="card-body">
                      <div className="row">
                        {/* <div className="col-md-4">
              <label htmlFor="mutualisme">
               Mutualisme
              </label>
              <div className="input-group has-validation">
                <input
                  name="mutualisme" 
                  type="text"
                  className="form-control"
                  id="mutualisme"
                  value={values.mutualisme} 
                  onChange={handleChange} 
                  aria-describedby="inputGroupPrepend"
                  required
                />
              </div>
            </div> */}
                        <div className="col-md-6">
                          <label htmlFor="ddn">
                            Date de décision de nomination
                          </label>
                          <input
                            name="ddn"
                            type='date'
                            className="form-control"
                            id="ddn"
                            value={values.ddn}
                            onChange={handleChange}
                            required
                          />
                        </div>
                        <div className="col-md-6">
                          <label htmlFor="cadre">
                            Numéro d'identification national pour la numérisation *
                          </label>
                          <input
                            name="ninn"
                            type='text'
                            className="form-control"
                            id="ninn"
                            value={values.ninn}
                            onChange={handleChange}
                            required
                          />
                          {errors.ninn && <div className="text-danger">{errors.ninn}</div>}

                        </div>


                      </div>
                      <div className="row">
                        {/* <div className="col-md-4">
              <label htmlFor="NITN">
               Date de premier recrutement
              </label>
              <input
                name="dpr" 
                type='date'
                className="form-control"
                id="dpr" 
                value={values.dpr} 
                onChange={handleChange} 
                required
              />
            </div> */}


                      </div>

                      <div className="row">
                        <div className="col-6">
                          <label htmlFor="npe">Nom et Prénom d'épouse </label>
                          <input type="text" className="form-control" name='npe' value={values.npe}
                            onChange={handleChange} />
                        </div>
                        <div className="col-6">
                          <label htmlFor="pfe">Profession de l'épouse</label>
                          <input type="text" className='form-control' name='pfe' value={values.pfe}
                            onChange={handleChange} />
                        </div>

                        <div className="card-body">
                          <h5>Disponibilités</h5>
                          {['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche'].map((jour) => {
                            const dispoJour = values.disponibilites[jour] || {
                              disponible: false,
                              heures: []
                            };

                            return (
                              <div key={jour} className="row mb-3">
                                <div className="col-md-2">
                                  <div className="form-check">
                                    <input
                                      className="form-check-input"
                                      type="checkbox"
                                      id={`dispo-${jour}`}
                                      checked={dispoJour.disponible || false}
                                      onChange={(e) => {
                                        const newDispo = {
                                          ...values.disponibilites,
                                          [jour]: {
                                            ...dispoJour,
                                            disponible: e.target.checked,
                                            heures: e.target.checked ? [...dispoJour.heures, { debut: '', fin: '' }] : []
                                          }
                                        };
                                        setValues({ ...values, disponibilites: newDispo });
                                      }}
                                    />
                                    <label className="form-check-label" htmlFor={`dispo-${jour}`}>
                                      {jour.charAt(0).toUpperCase() + jour.slice(1)}
                                    </label>
                                  </div>
                                </div>

                                {dispoJour.disponible && (
                                  <div className="col-md-10">
                                    {dispoJour.heures.map((heure, index) => (
                                      <div key={index} className="row mb-2">
                                        <div className="col-md-5">
                                          <label>Heure de début</label>
                                          <input
                                            type="time"
                                            className="form-control"
                                            value={heure.debut || ''}
                                            onChange={(e) => {
                                              const newHeures = [...dispoJour.heures];
                                              newHeures[index] = {
                                                ...newHeures[index],
                                                debut: e.target.value
                                              };

                                              const newDispo = {
                                                ...values.disponibilites,
                                                [jour]: {
                                                  ...dispoJour,
                                                  heures: newHeures
                                                }
                                              };
                                              setValues({ ...values, disponibilites: newDispo });
                                            }}
                                          />
                                        </div>
                                        <div className="col-md-5">
                                          <label>Heure de fin</label>
                                          <input
                                            type="time"
                                            className="form-control"
                                            value={heure.fin || ''}
                                            onChange={(e) => {
                                              const newHeures = [...dispoJour.heures];
                                              newHeures[index] = {
                                                ...newHeures[index],
                                                fin: e.target.value
                                              };

                                              const newDispo = {
                                                ...values.disponibilites,
                                                [jour]: {
                                                  ...dispoJour,
                                                  heures: newHeures
                                                }
                                              };
                                              setValues({ ...values, disponibilites: newDispo });
                                            }}
                                          />
                                        </div>
                                        {/* Bouton de suppression pour toutes les plages sauf la première */}
                                        {index > 0 && (
                                          <div className="col-md-2 d-flex align-items-end">
                                            <button
                                              type="button"
                                              className="btn btn-sm btn-outline-danger"
                                              onClick={() => {
                                                const newHeures = [...dispoJour.heures];
                                                newHeures.splice(index, 1);

                                                const newDispo = {
                                                  ...values.disponibilites,
                                                  [jour]: {
                                                    ...dispoJour,
                                                    heures: newHeures
                                                  }
                                                };
                                                setValues({ ...values, disponibilites: newDispo });
                                              }}
                                            >
                                              Supprimer
                                            </button>
                                          </div>
                                        )}
                                      </div>
                                    ))}

                                    <button
                                      type="button"
                                      className="btn btn-sm btn-outline-primary mt-2"
                                      onClick={() => {
                                        const newHeures = [...dispoJour.heures, { debut: '', fin: '' }];
                                        const newDispo = {
                                          ...values.disponibilites,
                                          [jour]: {
                                            ...dispoJour,
                                            heures: newHeures
                                          }
                                        };
                                        setValues({ ...values, disponibilites: newDispo });
                                      }}
                                    >
                                      Ajouter une plage horaire
                                    </button>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>

                      </div>

                      <button className="btn btn-secondary mt-3 me-2" onClick={prevStep}>Précédent</button>
                      <button className="btn btn-success mt-3" onClick={handleSubmit}>Soumettre</button>

                    </div>
                    :
                    ''}

              </>
            )}
          </div>
        </div>

        {/* mes bulteins de paie  */}
        <div className="card card-primary card-outline p-4">
          <div className="form-content mt-3">
            <h4>Mes bulteins de paie </h4>
          </div>


          <table id="example2" className="table table-bordered">
            <thead>
              <tr>
                <th>Id</th>
                <th>Periode de paie</th>
                <th>Nom et Prénom</th>
                <th>Salaire de Base</th>
                <th>Salaire Net</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>

              {bulletinsp.map((item, index) => (
                <tr key={index}>
                  <td>{ index + 1}</td>
                  <td>
                    {new Date(item.PeriodePaie?.dateDebut).toLocaleDateString('fr-FR', { month: 'long' }).toUpperCase()}-
                    {new Date(item.PeriodePaie?.dateFin).toLocaleDateString('fr-FR', { month: 'long' }).toUpperCase()}
                  </td>
                  <td>{item.nom_prenom}</td>
                  <td>{item.salaireBase}</td>
                  <td>{item.salaireNet}</td>
                  <td>
                    <a className="btn btn-outline-secondary p-2"
                      onClick={() => ImprimerBP(item.bulletin_html)} >
                      <img src={printer} alt="" width="27px" title="Supprimer" />
                    </a>
                  </td>
                </tr>

              ))}
            </tbody>



          </table>

        </div>
      </div >
    </>
  );
};

export default ProfileE;