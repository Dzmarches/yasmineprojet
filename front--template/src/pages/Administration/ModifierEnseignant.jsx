import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Select from 'react-select';
import { nationalites, Paiement } from '../Administration/OptionSelect';
import edite from '../../assets/imgs/edit.png';
import delet from '../../assets/imgs/delete.png';
import addbtn from '../../assets/imgs/addbtn.png'
// import rh from '../../assets/imgs/employe.png';
import Poste from '../RH/Poste';
import axios from 'axios';
import Service from '../RH/Service';
import moment from 'moment';
import rh from '../../assets/imgs/employe.png';

import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ModifierEmploye = () => {
  const url = "http://localhost:5000"

  const [step, setStep] = useState(1);
  const [PaimentOption, setPaiment] = useState(null);
  const [postes, setPostes] = useState([]); // État pour stocker les postes
  const [services, setServices] = useState([]); // État pour stocker les services
  const [selectedPosteId, setSelectedPosteId] = useState(null); // État pour stocker l'ID du poste sélectionné
  const [selectedServiceId, setSelectedServiceId] = useState(null); // État pour stocker l'ID du service sélectionné
  const [data, setData] = useState([]);
  const { id } = useParams();
  const [matieres, setMatieres] = useState([]);
  const [selectedMatiere, setSelectedMatiere] = useState([]);

  const [sections, setSections] = useState([]);
  const [selectedSections, setSelectedSections] = useState([]);
  const [niveaux, setNiveaux] = useState([]);
  const [selectedNiveaux, setSelectedNiveaux] = useState([]); // Corrigez le nom pour être cohérent
  //find employer par id 
  useEffect(() => {
    if (id) {
      const fetchEmploye = async () => {
        try {
          const token = localStorage.getItem("token");
          if (!token) {
            alert("Vous devez être connecté pour soumettre le formulaire.");
            return;
          }
  
          const response = await axios.get(`http://localhost:5000/enseignant/${id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          });
  
          console.log("Réponse complète du backend:", response.data);
  
          // Initialisation des disponibilités vides par défaut
          let disponibilites = {
            lundi: { disponible: false, heures: [] },
            mardi: { disponible: false, heures: [] },
            mercredi: { disponible: false, heures: [] },
            jeudi: { disponible: false, heures: [] },
            vendredi: { disponible: false, heures: [] },
            samedi: { disponible: false, heures: [] },
            dimanche: { disponible: false, heures: [] }
          };
  
          // Parsing des disponibilités si elles existent
          if (response.data.Enseignant?.disponibilites) {
            try {
              disponibilites = typeof response.data.Enseignant.disponibilites === 'string'
                ? JSON.parse(response.data.Enseignant.disponibilites)
                : response.data.Enseignant.disponibilites;
            } catch (e) {
              console.error("Erreur de parsing des disponibilités:", e);
            }
          }
  
          // Remplir les valeurs pour le formulaire
          const user = response.data.User || {};
          const enseignant = response.data.Enseignant || {};
  
          setData(response.data);
  
          setValues({
            nom: user.nom || '',
            prenom: user.prenom || '',
            nom_arabe: user.nom_ar || '',
            prenom_arabe: user.prenom_ar || '',
            datenaiss: user.datenaiss ? moment(user.datenaiss).format('YYYY-MM-DD') : '',
            tel: user.telephone || '',
            mail: user.email || '',
            nationalite: user.nationalite || '',
            sexe: user.sexe || '',
            Lieunais: user.lieuxnaiss || '',
            lieunaisArabe: user.lieuxnaiss_ar || '',
            sitfamiliale: response.data.sitfamiliale || '',
            nbrenfant: response.data.nbrenfant || 0,
            adresse: user.adresse || '',
            adresse_ar: user.adresse_ar || '',
            TypePI: response.data.TypePI || '',
            NumPI: response.data.NumPI || '',
            NumPC: response.data.NumPC || '',
            NumAS: response.data.NumAS || '',
            daterecru: response.data.daterecru ? moment(response.data.daterecru).format('YYYY-MM-DD') : '',
            NVTetudes: response.data.NVTetudes || '',
            Experience: response.data.Experience || '',
            SalairNeg: response.data.SalairNeg || '',
            TypeContrat: response.data.TypeContrat || '',
            DateFinContrat: response.data.DateFinContrat ? moment(response.data.DateFinContrat).format('YYYY-MM-DD') : '',
            Remarque: response.data.Remarque || '',
            HeureEM: response.data.HeureEM || '',
            HeureSM: response.data.HeureSM || '',
            HeureEAM: response.data.HeureEAM || '',
            HeureSAM: response.data.HeureSAM || '',
            user: user.username || '',
            pwd: '',
            Typepai: response.data.Typepai || '',
            CE: response.data.CE || '',
            npe: enseignant.npe || '',
            pfe: enseignant.pfe || '',
            ddn: enseignant.ddn ? moment(enseignant.ddn).format('YYYY-MM-DD') : '',
            ninn: enseignant.ninn || '',
            poste: response.data.poste || '',
            service: response.data.service || '',
            disponibilites: disponibilites,
          });
  
          // Extraction unique des matières, sections et niveaux
          const uniqueMatieres = {};
          const uniqueSections = {};
          const uniqueNiveaux = {};
  
          response.data.enseignantClasses?.forEach(ec => {
            if (ec.matiere) {
              uniqueMatieres[ec.matiere.id] = {
                value: ec.matiere.id,
                label: ec.matiere.nom
              };
            }
            if (ec.section) {
              uniqueSections[ec.section.id] = {
                value: ec.section.id,
                label: ec.section.classe
              };
            }
            if (ec.niveau) {
              uniqueNiveaux[ec.niveau.id] = {
                value: ec.niveau.id,
                label: ec.niveau.nomniveau
              };
            }
          });
  
          setSelectedMatiere(Object.values(uniqueMatieres));
          setSelectedSections(Object.values(uniqueSections));
          setSelectedNiveaux(Object.values(uniqueNiveaux));
  
          setSelectedPosteId(response.data.poste);
  
        } catch (error) {
          console.error("Erreur lors de la récupération des informations de l'employé :", error);
        }
      };
  
      fetchEmploye();
    }
  }, [id]);  

  if (!id) {
    return <p>Chargement...</p>;
  }
  useEffect(() => {
    // Mettre à jour les matières
    const updatedMatieres = selectedMatiere.map(sm => {
      const matiere = matieres.find(m => m.id === sm.value);
      return { ...sm, label: matiere?.nom || 'Inconnu' };
    });
    setSelectedMatiere(updatedMatieres);

    // Mettre à jour les niveaux
    const updatedNiveaux = selectedNiveaux.map(sn => {
      const niveau = niveaux.find(n => n.id === sn.value);
      return { ...sn, label: niveau?.nomniveau || 'Inconnu' };
    });
    setSelectedNiveaux(updatedNiveaux);
  }, [matieres, niveaux]);

  // Charger les sections quand les niveaux changent
  useEffect(() => {
    const fetchSections = async () => {
      try {
        const token = localStorage.getItem('token');
        const niveauIds = [...new Set(selectedNiveaux.map(n => n.value))];

        const sectionsPromises = niveauIds.map(niveauId =>
          axios.get(`http://localhost:5000/sections/niveau/${niveauId}`, {
            headers: { Authorization: `Bearer ${token}` }
          })
        );

        const results = await Promise.all(sectionsPromises);
        const allSections = results.flatMap(res => res.data);
        setSections(allSections);

        // Mettre à jour les sections après chargement
        const updatedSections = selectedSections.map(ss => {
          const section = allSections.find(s => s.id === ss.value);
          return { ...ss, label: section?.classe || 'Inconnu' };
        });
        setSelectedSections(updatedSections);
      } catch (error) {
        console.error('Erreur chargement sections', error);
      }
    };

    if (selectedNiveaux.length > 0) fetchSections();
  }, [selectedNiveaux]);


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


  });
  const [errors, setErrors] = useState({});
  useEffect(() => {
    handleListPostes(); // Récupérer la liste des postes
    handleListServices(); // Récupérer la liste des services
  }, []);

  useEffect(() => {
    const fetchMatieres = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.error('Aucun token trouvé. Veuillez vous connecter.');
          return;
        }
        const response = await axios.get('http://localhost:5000/matieres', { // Correction ici
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setMatieres(response.data);
      } catch (error) {
        console.error('Erreur lors de la récupération des matières', error);
      }
    };

    fetchMatieres();
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
      console.log('les poste recuperre is ', postesOptions)
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
  
        const niveauIds = selectedNiveaux.map(niveau => niveau.value);
        const matieresIds = selectedMatiere.map(matiere => matiere.value);
        const sectionsIds = selectedSections.map(section => section.value);
  
        const formFile = new FormData();
        
        // Traitement des valeurs du formulaire
        Object.entries(values).forEach(([key, value]) => {
          // Si c'est le champ 'disponibilites', on le convertit en JSON string
          if (key === 'disponibilites') {
            formFile.append(key, JSON.stringify(value));
          } else {
            formFile.append(key, value);
          }
        });
  
        // Ajouter les IDs des matières, sections et niveaux
        formFile.append("matieresIds", JSON.stringify(matieresIds));
        formFile.append("sectionsIds", JSON.stringify(sectionsIds));
        formFile.append("niveauIds", JSON.stringify(niveauIds));
  
        const response = await axios.put(
          `http://localhost:5000/enseignant/modifier/${id}`,
          formFile,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'multipart/form-data',
            },
          }
        );
  
        if (response.status === 200) {
          toast.success('Employé modifié avec succès');
        }
      } catch (error) {
        if (error.response) {
          toast.error(error.response.data.message);
        } else {
          toast.error('Erreur lors de la modification du formulaire');
        }
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

  //generer le mot de passe :
  // const generateUsername = (nom, prenom) => {
  //   if (!nom || !prenom) return '';

  //   const firstLetterNom = nom.charAt(0).toLowerCase();
  //   const firstLetterPrenom = prenom.charAt(0).toLowerCase();

  //   // Générer 4 chiffres aléatoires
  //   const randomDigits = Math.floor(1000 + Math.random() * 9000); // 4 chiffres aléatoires

  //   return `${'employe'}@${firstLetterNom}${firstLetterPrenom}${randomDigits}`;
  // };

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

  // Effet pour générer le username et le password lorsque les champs sont remplis
  // useEffect(() => {
  //   if (values.nom && values.prenom && values.datenaiss) {
  //     const username = generateUsername(values.nom, values.prenom, true);
  //     const password = generatePassword(values.datenaiss);
  //     setValues((prevValues) => ({
  //       ...prevValues,
  //       user: username,
  //       pwd: password,
  //     }));
  //   }
  // }, [values.nom, values.prenom, values.datenaiss]);

  // const ImageProtegee = ({ imagePath }) => {
  //   const [imageSrc, setImageSrc] = useState("");
  //   useEffect(() => {
  //     const fetchImage = async () => {
  //       try {
  //         const response = await fetch(`http://localhost:5000${imagePath}`, {
  //           headers: {
  //             Authorization: `Bearer ${localStorage.getItem('token')}`
  //           }
  //         });

  //         if (!response.ok) {
  //           throw new Error("Erreur lors du chargement de l'image");
  //         }
  //         const imageBlob = await response.blob();
  //         setImageSrc(URL.createObjectURL(imageBlob));
  //       } catch (error) {
  //         console.error(error);
  //       }
  //     };

  //     fetchImage();
  //   }, [imagePath]);

  //   return imageSrc ? <img src={imageSrc} alt="Photo de l'employé" width="60px" /> : <p>Chargement...</p>;
  // };

  const renderStepIndicator = () => {
    return (

      <div className="step-indicator d-flex justify-content-between align-items-center p-3">
        {
          [
            { icon: data.photo, label: 'Profil' },
            { icon: data.photo, label: 'Informations du compte' },
            // {postes.find(poste => poste.value === selectedPosteId)?.label)==="enseignant ")?"":""}
            // {  icon: rh, label: 'Informations du enseignant' },
            ...(postes.find(poste => poste.value === selectedPosteId)?.label === "Enseignant" ? [{ icon: rh, label: 'Informations de l\'enseignant' }] : [])
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

  useEffect(() => {
    const fetchNiveaux = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:5000/niveaux", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setNiveaux(response.data);
      } catch (error) {
        setError("Erreur lors du chargement des niveaux.");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchNiveaux();
  }, []);
  useEffect(() => {
    const fetchSections = async () => {
      try {
        // Vérifiez qu'un niveau est sélectionné et qu'il a une valeur
        if (selectedNiveaux && selectedNiveaux.length > 0) {
          const token = localStorage.getItem("token");

          // Pour chaque niveau sélectionné, faites une requête
          const sectionsPromises = selectedNiveaux.map(async (niveau) => {
            const response = await axios.get(
              `http://localhost:5000/sections/niveau/${niveau.value}`,
              { headers: { Authorization: `Bearer ${token}` } }
            );
            return response.data;
          });

          // Attendez que toutes les requêtes soient terminées
          const sectionsResults = await Promise.all(sectionsPromises);

          // Fusionnez tous les résultats en un seul tableau
          const allSections = sectionsResults.flat();
          setSections(allSections);
        } else {
          setSections([]); // Vider les sections si aucun niveau sélectionné
        }
      } catch (error) {
        console.error("Erreur lors du chargement des sections:", error);
      }
    };

    fetchSections();
  }, [selectedNiveaux]); // Déclenché quand selectedNiveaux change

  return (
    <>

      <nav className="mb-3">
        <Link to="/dashboard" className="text-primary">Accueil</Link>
        <span> / </span>
        <Link to="/enseignant" className="text-primary">Gestion des employes </Link>
        <span> / </span>
        <span>Modifier</span>
      </nav>

      <div className="container">
        <ToastContainer position="top-right" autoClose={1000} />


        <div className="card card-primary card-outline p-4">
          {renderStepIndicator()}

          <div className="form-content mt-3">

            {/* Profil */}
            {step === 1 && (
              <>
                <div className="row">
                  <div className="col-md-4">
                    <label>Nom *</label>
                    <input type="text" name="nom" className="form-control" value={values.nom} onChange={handleChange} />
                    {errors.nom && <div className="text-danger">{errors.nom}</div>}
                  </div>
                  <div className="col-md-4">
                    <label>Prénom *</label>
                    <input type="text" name="prenom" className="form-control" value={values.prenom} onChange={handleChange} />
                    {errors.prenom && <div className="text-danger">{errors.prenom}</div>}
                  </div>
                  <div className="col-md-4">
                    <label>Numéro du téléphone </label>
                    <input type="text" name="tel" className="form-control" value={values.tel} onChange={handleChange} />
                    {errors.tel && <div className="text-danger">{errors.tel}</div>}
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-4">
                    <label>Nom en arabe *</label>
                    <input type="text" name="nom_arabe" className="form-control" value={values.nom_arabe} onChange={handleChange} />
                    {errors.nom_arabe && <div className="text-danger">{errors.nom_arabe}</div>}

                  </div>
                  <div className="col-md-4">
                    <label>Prénom en arabe *</label>
                    <input type="text" name="prenom_arabe" className="form-control" value={values.prenom_arabe} onChange={handleChange} />
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
                    <label>Date de naissance</label>
                    <input type="date" name="datenaiss" className="form-control" value={values.datenaiss} onChange={handleChange} />
                    {errors.datenaiss && <div className="text-danger">{errors.datenaiss}</div>}
                  </div>

                  <div className="col-md-3">
                    <label>Nationalité</label>
                    <Select
                      onChange={handleSelectChange}
                      options={nationalites}
                      styles={customStyles}
                      value={nationalites.find(option => option.value === values.nationalite)}
                      name='nationalite'
                    />
                  </div>
                  <div className="col-md-3">
                    <label>Sexe</label>
                    <select name="sexe" className="form-control" value={values.sexe} onChange={handleChange}>
                      <option value="">Sélectionner...</option>
                      <option value="Masculin">Masculin</option>
                      <option value="Féminin">Féminin</option>
                    </select>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6">
                    <label>Lieu de naissance</label>
                    <input type="text" name="Lieunais" className="form-control" value={values.Lieunais} onChange={handleChange} />
                  </div>
                  <div className="col-md-6">
                    <label>Lieu de naissance en arabe</label>
                    <input type="text" name="lieunaisArabe" className="form-control" value={values.lieunaisArabe} onChange={handleChange} />
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
                    <div className="col-md-6">
                      <label htmlFor="pwd" className="form-label">
                        Mot de passe
                      </label>
                      <input
                        name="pwd"
                        // type="password"
                        type='text'
                        className="form-control"
                        id="pwd"
                        value={values.pwd}
                        onChange={handleChange}
                        required
                      />
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

            {/*Informations professionnelles */}
            {step === 3 && (
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
                            Numéro d'identification national pour la numérisation
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

                      </div>

                      <div className='row'>
                        <div className='col-md-4 mb-3'> {/* Utilisez col-md-4 pour trois colonnes */}
                          <Select
                            isMulti
                            classNamePrefix="react-select"
                            options={niveaux.map(n => ({ value: n.id, label: n.nomniveau }))}
                            // options={niveaux.map(niveau => ({
                            //   value: niveau.id,
                            //   label: niveau.nomniveau,
                            // }))}
                            value={selectedNiveaux}
                            onChange={setSelectedNiveaux}
                            placeholder="Sélectionner les niveaux"
                            styles={{
                              container: (base) => ({
                                ...base,
                                width: '100%', // Utilisez 100% pour s'adapter à la colonne
                              }),
                              control: (base) => ({
                                ...base,
                                backgroundColor: '#F0F2F8',
                                borderRadius: '50px',
                                margin: '10px 0',
                                boxShadow: '2px 2px 8px rgba(0, 0, 0, 0.1)',
                                height: '50px',
                              }),
                              multiValue: (base) => ({
                                ...base,
                                backgroundColor: '#5ACBCF',
                                borderRadius: '10px',
                              }),
                              multiValueLabel: (base) => ({
                                ...base,
                                color: 'white',
                              }),
                              multiValueRemove: (base) => ({
                                ...base,
                                color: 'white',
                                ':hover': {
                                  backgroundColor: '#dc3545',
                                  color: 'white',
                                },
                              }),
                              placeholder: (base) => ({
                                ...base,
                                color: '#A9A9A9',
                              }),
                              input: (base) => ({
                                ...base,
                                color: '#333',
                              }),
                            }}
                          />
                        </div>

                        <div className='col-md-4 mb-3'> {/* Utilisez col-md-4 pour trois colonnes */}
                          <Select
                            isMulti
                            classNamePrefix="react-select"
                            options={sections.map(s => ({ value: s.id, label: s.classe }))}
                            // options={sections.map(section => ({
                            //   value: section.id,
                            //   label: section.classe,
                            // }))}
                            value={selectedSections}
                            onChange={setSelectedSections}
                            placeholder="Sélectionnez des sections"
                            isDisabled={!selectedNiveaux}
                            styles={{
                              container: (base) => ({
                                ...base,
                                width: '100%', // Utilisez 100% pour s'adapter à la colonne
                              }),
                              control: (base) => ({
                                ...base,
                                backgroundColor: '#F0F2F8',
                                borderRadius: '50px',
                                margin: '10px 0',
                                boxShadow: '2px 2px 8px rgba(0, 0, 0, 0.1)',
                                height: '50px',
                              }),
                              multiValue: (base) => ({
                                ...base,
                                backgroundColor: '#5ACBCF',
                                borderRadius: '10px',
                              }),
                              multiValueLabel: (base) => ({
                                ...base,
                                color: 'white',
                              }),
                              multiValueRemove: (base) => ({
                                ...base,
                                color: 'white',
                                ':hover': {
                                  backgroundColor: '#dc3545',
                                  color: 'white',
                                },
                              }),
                              placeholder: (base) => ({
                                ...base,
                                color: '#A9A9A9',
                              }),
                              input: (base) => ({
                                ...base,
                                color: '#333',
                              }),
                            }}
                          />
                        </div>

                        <div className='col-md-4 mb-3'> {/* Utilisez col-md-4 pour trois colonnes */}
                          <Select
                            isMulti
                            classNamePrefix="react-select"
                            options={matieres.map(m => ({ value: m.id, label: m.nom }))}
                            // options={matieres.map(matiere => ({
                            //   value: matiere.id,
                            //   label: matiere.nom,
                            // }))}
                            value={selectedMatiere}
                            onChange={setSelectedMatiere}
                            placeholder="Sélectionner les matières"
                            styles={{
                              container: (base) => ({
                                ...base,
                                width: '100%', // Utilisez 100% pour s'adapter à la colonne
                              }),
                              control: (base) => ({
                                ...base,
                                backgroundColor: '#F0F2F8',
                                borderRadius: '50px',
                                margin: '10px 0',
                                boxShadow: '2px 2px 8px rgba(0, 0, 0, 0.1)',
                                height: '50px',
                              }),
                              multiValue: (base) => ({
                                ...base,
                                backgroundColor: '#5ACBCF',
                                borderRadius: '10px',
                              }),
                              multiValueLabel: (base) => ({
                                ...base,
                                color: 'white',
                              }),
                              multiValueRemove: (base) => ({
                                ...base,
                                color: 'white',
                                ':hover': {
                                  backgroundColor: '#dc3545',
                                  color: 'white',
                                },
                              }),
                              placeholder: (base) => ({
                                ...base,
                                color: '#A9A9A9',
                              }),
                              input: (base) => ({
                                ...base,
                                color: '#333',
                              }),
                            }}
                          />
                        </div>
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

                      <button className="btn btn-secondary mt-3 me-2" onClick={prevStep}>Précédent</button>
                      <button className="btn btn-success mt-3" onClick={handleSubmit}>Soumettre</button>

                    </div>
                    :
                    ''}
              </>
            )}
          </div>
        </div>
      </div >
    </>
  );
};

export default ModifierEmploye;
