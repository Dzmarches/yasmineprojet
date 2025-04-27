import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Select from 'react-select';
import { nationalites, Paiement } from './OptionSelect';
import edite from '../../../assets/imgs/edit.png';
import delet from '../../../assets/imgs/delete.png';
import addbtn from '../../../assets/imgs/addbtn.png'
// import rh from '../../assets/imgs/addbtn.png';
import rh from '../../../assets/imgs/employe.png'
import Poste from '../Poste';
import axios from 'axios';
import Service from '../Service';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AjouterModifierEmploye = () => {

  const [step, setStep] = useState(1);
  const [PaimentOption, setPaiment] = useState(null);
  const [postes, setPostes] = useState([]); // État pour stocker les postes
  const [services, setServices] = useState([]); // État pour stocker les services
  const [selectedPosteId, setSelectedPosteId] = useState(null); // État pour stocker l'ID du poste sélectionné
  const [selectedServiceId, setSelectedServiceId] = useState(null); // État pour stocker l'ID du service sélectionné

  const navigate=useNavigate();

  const handleChangePaiement = PaimentOption => { setPaiment(PaimentOption); };
  // chap obligatoires

  const [values, setValues] = useState({
    nom: '', prenom: '', nom_arabe: '',
    prenom_arabe: '', datenaiss: '', tel: '', mail: '',
    nationalite: '', sexe: '', photo: '', Lieunais: '',
    lieunaisArabe: '', sitfamiliale: '', nbrenfant: 0, adresse: '',
    adresse_ar: '', TypePI: '', NumPI: '', NumPC: '', NumAS: '',
    daterecru: '', NVTetudes: '', Experience: '', SalairNeg: '',
    TypeContrat: '', DateFinContrat: '', Remarque: '', HeureEM: '', HeureSM: '', HeureEAM: '', HeureSAM: '',
    user: '', pwd: '', Typepai: '',
    CE: '', npe: '', pfe: '', ddn: '', ninn: '',
    nbrHeureLegale: 173.33, nbrJourTravail: 22, Numpai: '',
    dateabt: null, notify: false, tauxabt: 0,
    abattement: 'non', declaration: true,
  });

  const [errors, setErrors] = useState({});
  useEffect(() => {
    handleListPostes();
    handleListServices();
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
      const postesOptions = response.data
        .filter(poste => poste.archiver === 0)
        .map(poste => ({
          value: poste.id,
          label: poste.poste
        }));
      setPostes(postesOptions);
    } catch (error) {
      console.error('Erreur lors de la récupération des postes', error);
      alert('Une erreur est survenue lors de la récupération des postes');
    }
  };

  const handleListServices = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Vous devez être connecté pour soumettre le formulaire.");
        return;
      }
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
      alert('Une erreur est survenue lors de la récupération des services');
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
  // const handleChange = (e) => {
  //   const { name, value, type } = e.target;
  //   // setValues({ ...values, [name]: value });
  //   if (type === "file") {
  //     const photo = e.target.files[0];
  //     setValues({ ...values, [name]: photo });
  //   } else {
  //     const { value } = e.target;
  //     setValues({ ...values, [name]: value });
  //   }
  //   setErrors({ ...errors, [name]: '' });
  // };


  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === "file") {
      const file = files[0];
      setValues((prev) => ({ ...prev, [name]: file }));
    } else if (type === "checkbox") {
      setValues((prev) => ({ ...prev, [name]: checked }));
    } else {
      setValues((prev) => ({ ...prev, [name]: value }));
    }
    // Réinitialiser les erreurs si besoin
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleSelectChange = (selectedOption) => {
    setSelectedOption(selectedOption);
    setValues({ ...values, nationalite: selectedOption.value });
  };
  // const handlePaiementChange = (selectedOption) => {
  //   setPaimentOption(selectedOption);
  //   setValues({ ...values, paiement: selectedOption.value });
  // };


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
        Object.entries(values).forEach(([key, value]) => {
          formFile.append(key, value);
          console.log(key, value);
        });

        const response = await axios.post('http://localhost:5000/employes/ajouter', formFile, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        });
        if (response.status === 201) {
          // toast.success("Formulaire soumis avec succès! !");
          alert("Formulaire soumis avec succès! !");
          navigate('/employes');
          

        }

      } catch (error) {
        if (error.response) {
          // Erreur côté serveur (code 400, 500, etc.)
          // alert(`Erreur backend:', ${error.response.data.message}`)
          alert(`Erreur !', ${error.response.data.message}`)
          console.error('Erreur backend:', error.response.data.message);
          // setError(error.response.data.message); // Affichez le message d'erreur dans l'UI
        } else if (error.request) {
          // Erreur lors de l'envoi de la requête (ex. serveur non accessible)
          alert('Erreur réseau:', error.request);
        } else {
          // Autres erreurs
          alert('Erreur inconnue:', error.message);
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
        // if (!values.mail) newErrors.mail = 'Ce champ est requis.';
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
        if (!values.nbrHeureLegale) newErrors.nbrHeureLegale = 'Ce champ est requis.';
        if (!values.nbrJourTravail) newErrors.nbrJourTravail = 'Ce champ est requis.';
        if (!values.SalairNeg) newErrors.SalairNeg = 'Ce champ est requis.';
        break;
      case 5:
        if (!values.ninn) newErrors.ninn = 'Ce champ est requis.';
        if (!values.ddn) newErrors.ddn = 'Ce champ est requis.';
        // if (!values.pwd) newErrors.pwd = 'Ce champ est requis.';
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
  const generateUsername = (nom, prenom) => {
    if (!nom || !prenom) return '';

    const firstLetterNom = nom.charAt(0).toLowerCase();
    const firstLetterPrenom = prenom.charAt(0).toLowerCase();

    // Générer 4 chiffres aléatoires
    const randomDigits = Math.floor(1000 + Math.random() * 9000); // 4 chiffres aléatoires

    return `${'employe'}@${firstLetterNom}${firstLetterPrenom}${randomDigits}`;
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

  // Effet pour générer le username et le password lorsque les champs sont remplis
  useEffect(() => {
    if (values.nom && values.prenom && values.datenaiss) {
      const username = generateUsername(values.nom, values.prenom, true);
      const password = generatePassword(values.datenaiss);
      setValues((prevValues) => ({
        ...prevValues,
        user: username,
        pwd: password,
      }));
    }
  }, [values.nom, values.prenom, values.datenaiss]);

  const renderStepIndicator = () => {
    return (
      <div className="step-indicator d-flex justify-content-between align-items-center p-3">
        {
          [
            { icon: rh, label: 'Profil' },
            { icon: rh, label: 'Identifiants administratifs' },
            { icon: rh, label: 'Informations professionnelles' },
            { icon: rh, label: 'Informations du compte' },
            // {postes.find(poste => poste.value === selectedPosteId)?.label)==="enseignant ")?"":""}
            // {  icon: rh, label: 'Informations du enseignant' },
            ...(postes.find(poste => poste.value === selectedPosteId)?.label === "Enseignant" ? [{ icon: rh, label: 'Informations de l\'enseignant' }] : [])

          ]
            .map((item, index) => (
              <div key={index} className={`step ${step === index + 1 ? 'active' : ''} text-center`}>
                <img src={item.icon} alt={`Étape ${index + 1}`} className="step-icon" style={{ width: 50, height: 50 }} />
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


  return (
    <>
      <nav>
        <Link to="/dashboard" className="text-primary">Dashboard</Link>
        <span> / </span>
        <Link to="/RessourcesHumaines" className="text-primary">Ressources Humaines</Link>
        <span> / </span>
        <Link to="/employes" className="text-primary">Gestion des employes</Link>
        <span> / </span>
        <span>Ajouter</span>

      </nav>
      <div className="container">
        <ToastContainer />
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
                    <input type="email" name="mail" className="form-control" value={values.mail} onChange={handleChange} />
                    {errors.mail && <div className="text-danger">{errors.mail}</div>}
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-3">
                    {/* <label htmlFor='file'>Photo</label>
                    <div>
                    <input id='file' type="file" className="form-control"  name="photo"  onChange={handleChange} />
                    </div> */}
                    <label htmlFor="file" className="file-label"> Photo</label>
                    <div style={{ border: "1px solid rgb(192, 193, 194)", height: "30px", display: "flex", alignItems: "center", justifyContent: "center", padding: "5px", borderRadius: "5px", cursor: "pointer" }}>
                      <label htmlFor="file" style={{ marginRight: "10px", fontWeight: "bold", cursor: "pointer", color: 'rgb(65, 105, 238)' }}>
                        {!(values.photo.name) ? "Choisir une photo" : <span style={{ marginLeft: "10px", fontSize: "14px" }}>{values.photo.name}</span>}
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
                    <input type="date" name="datenaiss" className="form-control" value={values.datenaiss} onChange={handleChange} />
                    {errors.datenaiss && <div className="text-danger">{errors.datenaiss}</div>}
                  </div>

                  <div className="col-md-3">
                    <label>Nationalité</label>
                    <Select
                      value={selectedOption}
                      onChange={handleSelectChange}
                      options={nationalites}
                      styles={customStyles}
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
                  <div className="col-md-6">
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
                  <div className="col-md-6">
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
                  <div className="col-md-6">
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
                  <div className="col-md-6">
                    <label htmlFor="idra" >Adresse en arabe</label>
                    <div className="input-group has-validation">
                      <input
                        name='adresse_ar'
                        type="text"
                        className="form-control"
                        id="adra"
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
                      <select name="TypePI" className="form-control" value={values.TypePI} onChange={handleChange}>
                        <option value="">Sélectionner...</option>
                        <option value="Carte d'identité nationale">Carte d'identité nationale</option>
                        <option value="Passeport">Passeport</option>
                        <option value="Carte de résident">Carte de résident</option>
                      </select>
                    </div>

                    <div className="col-md-6">
                      <label>Numéro d'identification</label>
                      <input
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
                        <input name='NumPC' type="text" className="form-control"
                          value={values.NumPC}
                          onChange={handleChange} />
                      </div>
                    </div>

                    <div className="col-md-6">
                      <label htmlFor="NumAS">Numéro d'assurance sociale</label>
                      <div className="input-group has-validation">
                        <input name='NumAS' type="text" className="form-control"
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
                        <a data-toggle="modal" data-target="#modal-post">
                          <img src={addbtn} alt="" width="30px" title='ajouter un poste' />
                        </a>
                      </label>
                      <Select
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
                        <a data-toggle="modal" data-target="#modal-service">
                          <img src={addbtn} alt="" width="30px" title='ajouter un service' />
                        </a>
                      </label>
                      <Select
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
                        value={values.CE}
                        onChange={handleChange} />
                    </div>
                  </div>
                  {/*  */}
                  <div className="row">
                    <div className="col-md-4">
                      <label>Date du recrutement *</label>
                      <input type="date" name="daterecru"
                        className="form-control" value={values.daterecru}
                        onChange={handleChange}
                      />
                      {errors.daterecru && <div className="text-danger">{errors.daterecru}</div>}
                    </div>

                    <div className="col-md-4">
                      <label htmlFor="TypeContrat" >Type de Contrat</label>
                      <div className="input-group has-validation">
                        <input name='TypeContrat' type="text" className="form-control"
                          value={values.TypeContrat}
                          onChange={handleChange} />
                      </div>
                    </div>

                    <div className="col-md-4">
                      <label htmlFor="DateFinContrat" >Date fin du contrat *</label>
                      <input
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
                        onChange={handleChange} />
                    </div>
                    <div className="col-md-4">
                      <label htmlFor="Experience">Expériences </label>
                      <input name='Experience' type="text" className="form-control" id="Experience" value={values.Experience}
                        onChange={handleChange} />
                    </div>
                    <div className="col-md-4">
                      <label htmlFor="SalairNeg" >Salaire de Base *</label>
                      <div className="input-group has-validation">
                        <input name='SalairNeg' type="text" className="form-control" value={values.SalairNeg}
                          onChange={handleChange} />
                      </div>
                      {errors.SalairNeg && <div className="text-danger">{errors.SalairNeg}</div>}
                    </div>

                  </div>
                  <div className="row">
                    <div className="col-md-3">
                      <label htmlFor="Typepai" >Type de paiement</label>
                      <select name='Typepai' className="form-control" value={values.Typepai} onChange={handleChange}>
                        <option value="paiement en espéces">paiement en espéces</option>
                        <option value="virement bancaire">virement bancaire</option>
                        <option value="CCP">CCP</option>
                        <option value="Chèques">Chèques</option>
                      </select>
                    </div>

                    <div className="col-md-3">
                      <label htmlFor="Numpai" >Numéro de compte </label>
                      <input name='Numpai' className="form-control" id="Numpai"
                        value={values.Numpai}
                        onChange={handleChange} />
                      <small className="text-muted">Indiquez le numéro CCP ou RIB selon le type de paiement</small>
                    </div>
                    <div className="col-md-3">
                      <label htmlFor="nbrJourTravail">Nombre de jours de travail</label>
                      <input
                        name="nbrJourTravail"
                        className="form-control"
                        id="nbrJourTravail"
                        value={values.nbrJourTravail}
                        onChange={handleChange}
                      />
                      {errors.nbrJourTravail && <div className="text-danger">{errors.nbrJourTravail}</div>}

                    </div>

                    <div className="col-md-3">
                      <label htmlFor="nbrHeureLegale" >heures légale mensuelle du travail</label>
                      <input
                        name="nbrHeureLegale"
                        className="form-control"
                        id="nbrHeureLegale"
                        value={values.nbrHeureLegale}
                        onChange={handleChange}
                      />
                      {errors.nbrHeureLegale && <div className="text-danger">{errors.nbrHeureLegale}</div>}

                    </div>

                  </div>
                  <div className="row mt-3 mb-5">
                    <div className="col-md-3">
                      <label>Heure Entrée (matin) *</label>
                      <input type="time" className="form-control custom-input" name='HeureEM'
                        value={values.HeureEM}
                        onChange={handleChange} />
                      {errors.HeureEM && <div className="text-danger">{errors.HeureEM}</div>}
                    </div>
                    <div className="col-md-3">
                      <label>Heure Sortie (matin) *</label>
                      <input type="time" className="form-control custom-input" name='HeureSM'
                        value={values.HeureSM}
                        onChange={handleChange} />
                      {errors.HeureSM && <div className="text-danger">{errors.HeureSM}</div>}
                    </div>

                    <div className="col-md-3">
                      <label>Heure Entrée (après-midi)*</label>
                      <input type="time" className="form-control custom-input" name='HeureEAM'
                        value={values.HeureEAM}
                        onChange={handleChange} />
                      {errors.HeureEAM && <div className="text-danger">{errors.HeureEAM}</div>}

                    </div>
                    <div className="col-md-3">
                      <label>Heure Sortie (après-midi) *</label>
                      <input type="time" className="form-control custom-input" name='HeureSAM'
                        value={values.HeureSAM}
                        onChange={handleChange} />
                      {errors.HeureSAM && <div className="text-danger">{errors.HeureSAM}</div>}
                    </div>

                    <div className="col-md-6 mt-4 " style={{ color: '#13b103' }}>
                      <div className="form-check mt-4">
                        <input
                          type="checkbox"
                          id="declaration"
                          className="form-check-input"
                          name="declaration"
                          checked={values.declaration}
                          onChange={handleChange}
                        />
                        <label htmlFor="declaration" className="form-check-label" style={{ fontSize: '18px' }}>
                          L’employé est-il déclaré à la CNAS ?
                        </label>
                      </div>
                    </div>

                  </div>

                  {/* Abattement */}
                  <hr />
                  <div className="row mt-5 mb-3 p-3" style={{
                    border: '2px solid #13b103',
                    borderRadius: '8px',
                    backgroundColor: '#f8fff8',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                  }}>
                    <div className="col-md-2">
                      <label className="d-block fw-bold">Abattement</label>
                      <div className="form-check form-check-inline">
                        <input
                          type="radio"
                          id="abattementOui"
                          name="abattement"
                          value="oui"
                          className="form-check-input"
                          onChange={handleChange}
                          checked={values.abattement === "oui"}
                          style={{ accentColor: '#13b103' }}
                        />
                        <label htmlFor="abattementOui" className="form-check-label">Oui</label>
                      </div>
                      <div className="form-check form-check-inline">
                        <input
                          type="radio"
                          id="abattementNon"
                          name="abattement"
                          value="non"
                          className="form-check-input"
                          onChange={handleChange}
                          checked={values.abattement === "non"}
                          style={{ accentColor: '#13b103' }}
                        />
                        <label htmlFor="abattementNon" className="form-check-label">Non</label>
                      </div>
                    </div>

                    {values.abattement === "oui" && (
                      <>
                        <div className="col-md-3">
                          <label htmlFor="tauxabt" className="fw-bold">Taux d'abattement</label>
                          <input
                            type="number"
                            id="tauxabt"
                            className="form-control custom-input"
                            name="tauxabt"
                            value={values.tauxabt}
                            onChange={handleChange}
                            style={{ borderColor: '#13b103' }}
                          />
                        </div>

                        <div className="col-md-3">
                          <label htmlFor="dateabt" className="fw-bold">Date de fin de l’abattement</label>
                          <input
                            type="date"
                            id="dateabt"
                            className="form-control custom-input"
                            name="dateabt"
                            value={values.dateabt}
                            onChange={handleChange}
                            style={{ borderColor: '#13b103' }}
                          />
                        </div>

                        <div className="col-md-3 mt-4" style={{ color: '#13b103' }}>
                          <div className="form-check mt-4">
                            <input
                              type="checkbox"
                              id="notify"
                              className="form-check-input"
                              name="notify"
                              checked={values.notify}
                              onChange={handleChange}
                              style={{ accentColor: '#13b103' }}
                            />
                            <label htmlFor="notify" className="form-check-label fw-bold" style={{ fontSize: '18px' }}>
                              Activer les notifications
                            </label>
                          </div>
                        </div>
                      </>
                    )}
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
                  <div className="row">
                    <div className="col-md-12 mt-3">
                      <label htmlFor="Remarque" >Remarque</label>
                      <textarea name='Remarque' className="form-control" id="autres" rows={1}
                        value={values.Remarque}
                        onChange={handleChange} />
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
            {step === 5 && (
              <>
                {
                  ((postes.find(poste => poste.value === selectedPosteId)?.label) === "Enseignant") ?

                    <div className="card-body">
                      <div className="row">
                        <div className="col-md-6">
                          <label htmlFor="ddn">
                            Date de décision de nomination *
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
                          {errors.ddn && <div className="text-danger">{errors.ddn}</div>}

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
                        <div className="col-6">
                          <label htmlFor="npe">Nom et Prénom du conjoint(e) </label>
                          <input type="text" className="form-control" name='npe' value={values.npe}
                            onChange={handleChange} />

                        </div>
                        <div className="col-6">
                          <label htmlFor="pfe">Profession du conjoint(e) </label>
                          <input type="text" className='form-control' name='pfe' value={values.pfe}
                            onChange={handleChange} />
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
      </div >
    </>
  );
};

export default AjouterModifierEmploye;
