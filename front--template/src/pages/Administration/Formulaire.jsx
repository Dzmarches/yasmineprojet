import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Select from 'react-select';
import ParentSection from "./ParentSection";
import { nationalites } from './Nationalite';
import axios from 'axios';
import { Modal, Button } from 'react-bootstrap';
// Importation des icônes
import userIcon from '../../assets/imgs/user.png';
import familyIcon from '../../assets/imgs/family.png';
import healthIcon from '../../assets/imgs/healthcare.png';
import children from '../../assets/imgs/children.png';
import enrollmentIcon from '../../assets/imgs/enrollment.png';
import etudiant from '../../assets/imgs/etudiant.png';
import security from '../../assets/imgs/folder.png';
import studentcard from '../../assets/imgs/student-card.png';
import './PrintStyles.css';
import printer from '../../assets/imgs/printer.png';
import Etudiants from './Etudiants';

const Formulaire = ({ eleveId: propEleveId, onSuccess }) => {
    const navigate = useNavigate();
    const [ecoleId, setEcoleId] = useState(null);
    const [ecoleeId, setEcoleeId] = useState(null);
    const { id: paramId } = useParams();
    const eleveId = propEleveId || paramId; // Utiliser l'ID passé en prop ou celui de l'URL
    const [cycle, setCycle] = useState(""); // Stocker le cycle
    const [cycles, setCycles] = useState([]);
    const [niveaux, setNiveaux] = useState([]);
    const [step, setStep] = useState(1);
    const [values, setValues] = useState({
        // Informations de l'élève
        nom: '',
        prenom: '',
        datenaiss: '', // Format YYYY-MM-DD
        nom_ar: '',
        prenom_ar: '',
        nactnaiss: '', // Numéro d'acte de naissance
        lieuxnaiss: '',
        lieuxnaiss_ar: '',
        adresse: '',
        adresse_ar: '',
        nationalite: '',
        sexe: '', // "Masculin" ou "Féminin"
        etat_social: '',
        antecedents: 'Non', // Enum : "Oui" ou "Non"
        antecedentsDetails: '',
        suiviMedical: 'Non', // Enum : "Oui" ou "Non"
        suiviMedicalDetails: '',
        natureTraitement: 'Non', // Enum : "Oui" ou "Non"
        natureTraitementDetails: '',
        crises: 'Non', // Enum : "Oui" ou "Non"
        crisesDetails: '',
        conduiteTenir: 'Non', // Enum : "Oui" ou "Non"
        conduiteTenirDetails: '',
        operationChirurgical: 'Non', // Enum : "Oui" ou "Non"
        operationChirurgicalDetails: '',
        maladieChronique: 'Non', // Enum : "Oui" ou "Non"
        maladieChroniqueDetails: '',
        dateInscription: '', // Format YYYY-MM-DD
        autreecole: 'Non', // Enum : "Oui" ou "Non"
        nomecole: '',
        redoublant: 'Non', // Enum : "Oui" ou "Non"
        niveauredoublant: '',
        niveaueleve: '',
        numinscription: '',
        numidentnational: '',
        datedinscriptionEncour: '', // Format YYYY-MM-DD
        fraixinscription: 0.00, // Type DECIMAL(10,2)
        photo: '',
        username: '',
        password: '',
        groupeSanguin: '',
        niveauId: '', // Référence à Niveaux
        parentId: '', // Référence à Parent
        annescolaireId: '',

        orphelin: 'vivant', // Pour stocker le choix de l'utilisateur (sansmere, orphelin, sanspere, vivant)
        pere: {
            nomparent: '',
            prenomparent: '',
            datenaissparent: '',
            nom_arparent: '',
            prenom_arparent: '',
            lieuxnaissparent: '',
            lieuxnaiss_arparent: '',
            nationaliteparent: '',
            emailparent: '',
            telephoneparent: '',
            travailleparent: '',
            situation_familiale: '',
            nombreenfant: '',
            adresseparent: '',
            adresse_arparent: '',
            usernameparent: '',
            paswwordparent: '',
            ecoleId: '',
            ecoleeId: ''
        },
        mere: {
            nomparent: '',
            prenomparent: '',
            datenaissparent: '',
            nom_arparent: '',
            prenom_arparent: '',
            lieuxnaissparent: '',
            lieuxnaiss_arparent: '',
            nationaliteparent: '',
            emailparent: '',
            telephoneparent: '',
            travailleparent: '',
            situation_familiale: '',
            nombreenfant: '',
            adresseparent: '',
            adresse_arparent: '',
            usernameparent: '',
            paswwordparent: '',
            ecoleId: '',
            ecoleeId: ''
        },
        tuteur: {
            nomparent: '',
            prenomparent: '',
            datenaissparent: '',
            nom_arparent: '',
            prenom_arparent: '',
            lieuxnaissparent: '',
            lieuxnaiss_arparent: '',
            nationaliteparent: '',
            emailparent: '',
            telephoneparent: '',
            travailleparent: '',
            situation_familiale: '',
            nombreenfant: '',
            adresseparent: '',
            adresse_arparent: '',
            usernameparent: '',
            paswwordparent: '',
            ecoleId: '',
            ecoleeId: ''
        },
        cycle: '',
        ecoleId: '',
        ecoleeId: ''
    });

    const [errors, setErrors] = useState({});
    const [selectedOption, setSelectedOption] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [showProfileModal, setShowProfileModal] = useState(false);
    const [profileInfo, setProfileInfo] = useState(null);
    const handleCloseProfileModal = () => setShowProfileModal(false);
    const [annees, setAnnees] = useState([]);
    const [selectedAnnee, setSelectedAnnee] = useState(null);
    const [filteredAnnees, setFilteredAnnees] = useState([]);

    useEffect(() => {
        const fetchAnnees = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await axios.get(
                    `http://localhost:5000/anneescolaire`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                setAnnees(response.data);
                setFilteredAnnees(response.data);
            } catch (error) {
                console.error('Error fetching annees scolaires', error);
            }
        };
        fetchAnnees();
    }, []);

    // Mettre à jour isEditing lorsque eleveId change
    useEffect(() => {
        setIsEditing(!!eleveId); // isEditing sera true si eleveId existe
    }, [eleveId]);

    const nextStep = (e) => {
        e?.preventDefault();
        const newErrors = validateStep(step); // Valide l'étape actuelle
        setErrors(newErrors);

        if (Object.keys(newErrors).length === 0) {
            setStep(step + 1);
        } else {
            alert("Veuillez remplir tous les champs obligatoires avant de continuer.");
        }
    };

    const prevStep = (e) => {
        e?.preventDefault(); // Utilisation optionnelle de `e` avec `?.`
        setStep(step - 1);
    };
    const generateUsername = (nom, prenom, isEleve) => {
        if (!nom || !prenom) return '';

        const firstLetterNom = nom.charAt(0).toLowerCase();
        const firstLetterPrenom = prenom.charAt(0).toLowerCase();

        // Générer 4 chiffres aléatoires
        const randomDigits = Math.floor(1000 + Math.random() * 9000); // 4 chiffres aléatoires

        return `${isEleve ? 'Eleve' : 'parent'}@${firstLetterNom}${firstLetterPrenom}${randomDigits}`;
    };

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
    // Effet pour générer le username et le password lorsque les champs sont remplis
    useEffect(() => {
        if (!isEditing && values.nom && values.prenom && values.datenaiss) {
            const username = generateUsername(values.nom, values.prenom, true); // true pour élève
            const password = generatePassword(values.datenaiss);
            setValues((prevValues) => ({
                ...prevValues,
                username: username,
                password: password,
            }));
        }
    }, [values.nom, values.prenom, values.datenaiss, isEditing]);

    // Effet pour générer le username et le password pour le père
    useEffect(() => {
        if (!isEditing && values.pere.nomparent && values.pere.prenomparent && values.pere.datenaissparent) {
            const usernamePere = generateUsername(values.pere.nomparent, values.pere.prenomparent, false);
            const passwordPere = generatePassword(values.pere.datenaissparent);
            setValues((prevValues) => ({
                ...prevValues,
                pere: {
                    ...prevValues.pere,
                    usernameparent: usernamePere,
                    paswwordparent: passwordPere,
                },
            }));
        }
    }, [values.pere.nomparent, values.pere.prenomparent, values.pere.datenaissparent, isEditing]);

    // Effet pour générer le username et le password pour la mère
    useEffect(() => {
        if (!isEditing && values.mere.nomparent && values.mere.prenomparent && values.mere.datenaissparent) {
            const usernameMere = generateUsername(values.mere.nomparent, values.mere.prenomparent, false);
            const passwordMere = generatePassword(values.mere.datenaissparent);
            setValues((prevValues) => ({
                ...prevValues,
                mere: {
                    ...prevValues.mere,
                    usernameparent: usernameMere,
                    paswwordparent: passwordMere,
                },
            }));
        }
    }, [values.mere.nomparent, values.mere.prenomparent, values.mere.datenaissparent, isEditing]);

    // Effet pour générer le username et le password pour le tuteur
    useEffect(() => {
        if (!isEditing && values.tuteur.nomparent && values.tuteur.prenomparent && values.tuteur.datenaissparent) {
            const usernameTuteur = generateUsername(values.tuteur.nomparent, values.tuteur.prenomparent, false);
            const passwordTuteur = generatePassword(values.tuteur.datenaissparent);
            setValues((prevValues) => ({
                ...prevValues,
                tuteur: {
                    ...prevValues.tuteur,
                    usernameparent: usernameTuteur,
                    paswwordparent: passwordTuteur,
                },
            }));
        }
    }, [values.tuteur.nomparent, values.tuteur.prenomparent, values.tuteur.datenaissparent, isEditing]);

    const [showPassword, setShowPassword] = useState(false); // State for password visibility

    // Function to toggle password visibility
    const togglePasswordVisibility = () => {
        setShowPassword(prevState => !prevState);
    };


    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        // Update the state based on the name of the input
        setValues((prevValues) => ({
            ...prevValues,
            [name]: type === "checkbox" ? checked : value,
        }));
    };
    const handleRoleChange = (e, role) => {
        const { name, value } = e.target;

        setValues((prevValues) => ({
            ...prevValues,
            [role]: {
                ...prevValues[role],
                [name]: value, // Update the specific field for the specified role
            },
        }));
    };


    const handleSelectChange = (selectedOption) => {
        setSelectedOption(selectedOption);
        setValues({ ...values, nationalite: selectedOption.value });
    };

    // const validateStep = (step) => {
    //     const newErrors = {};
    //     switch (step) {
    //         case 1:
    //             if (!values.nom) newErrors.nom = 'Ce champ est requis.';
    //             if (!values.prenom) newErrors.prenom = 'Ce champ est requis.';
    //             if (!values.datenaiss) newErrors.datenaiss = 'Ce champ est requis.';
    //             break;
    //         case 2:
    //             if (!values.orphelin) newErrors.orphelin = 'Sélectionnez un statut d\'orphelin.';
    //             if (values.orphelin === 'orpholinemère' && !values.nom_pere) newErrors.nom_pere = 'Ce champ est requis.';
    //             if (values.orphelin === 'orpholinepère' && !values.nom_mere) newErrors.nom_mere = 'Ce champ est requis.';
    //             if (values.orphelin === 'orpholinelesdeux' && !values.nom_mere) newErrors.nom_mere = 'Ce champ est requis.';
    //             break;
    //         case 3:
    //             if (!values.maladieChronique) newErrors.maladieChronique = 'Ce champ est requis.';
    //             if (!values.groupeSanguin) newErrors.groupeSanguin = 'Ce champ est requis.';
    //             break;
    //         case 4:
    //             break;
    //         case 5:
    //             if (!values.user) newErrors.user = 'Ce champ est requis.';
    //             if (!values.pwd) newErrors.pwd = 'Ce champ est requis.';
    //             break;
    //         default:
    //             break;
    //     }
    //     return newErrors;
    // };
    const customStyles = {
        control: (provided) => ({
            ...provided,
            minHeight: '30px',  // Hauteur minimale
            height: '30px',      // Hauteur fixe
            padding: '0',        // Supprime le padding interne
        }),
        valueContainer: (provided) => ({
            ...provided,
            padding: '0 6px',    // Ajuste le padding pour réduire la hauteur
            height: '30px',
        }),
        input: (provided) => ({
            ...provided,
            margin: '0px',
            padding: '0px',
        }),
        indicatorsContainer: (provided) => ({
            ...provided,
            height: '30px',     // Ajuste les icônes (ex: flèche du dropdown)
        }),
    };
    // Indicateur d'étapes avec images
    const renderStepIndicator = () => {
        return (
            <div className="step-indicator d-flex justify-content-between align-items-center p-3">
                {[
                    { icon: userIcon, label: 'Profil' },
                    { icon: familyIcon, label: 'Famille' },
                    { icon: healthIcon, label: 'Santé' },
                    { icon: children, label: 'Scolarité' },
                    { icon: enrollmentIcon, label: 'Inscription' },
                ].map((item, index) => (
                    <div
                        key={index}
                        className={`step ${step === index + 1 ? 'active' : ''} text-center`}
                        onClick={() => handleStepClick(index + 1)}
                        style={{ cursor: 'pointer' }} // Ajout du style pour le curseur
                    >
                        <img src={item.icon} alt={`Étape ${index + 1}`} className="step-icon" style={{ width: 50, height: 50 }} />
                        <p className="mt-2">{item.label}</p>
                    </div>
                ))}
            </div>
        );
    };


    const [preview, setPreview] = useState(null);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result);
                setValues({ ...values, photo: file }); // Stocke le fichier pour l'envoi
            };
            reader.readAsDataURL(file);
        }
    };


    const validateStep = (step) => {
        const newErrors = {};
        switch (step) {
            case 1:
                if (!values.nom) newErrors.nom = 'Ce champ est requis.';
                if (!values.prenom) newErrors.prenom = 'Ce champ est requis.';
                if (!values.datenaiss) newErrors.datenaiss = 'Ce champ est requis.';
                break;
            case 2:
                if (!values.orphelin) {
                    newErrors.orphelin = 'Sélectionnez un statut d\'orphelin.';
                } else {
                    // Validation en fonction du statut d'orphelin
                    switch (values.orphelin) {
                        case 'orpholinemère':
                            if (!values.pere.nomparent) newErrors['pere.nomparent'] = 'Ce champ est requis.';
                            if (!values.pere.prenomparent) newErrors['pere.prenomparent'] = 'Ce champ est requis.';
                            if (!values.pere.datenaissparent) newErrors['pere.datenaissparent'] = 'Ce champ est requis.';
                            break;
                        case 'orpholinepère':
                            if (!values.mere.nomparent) newErrors['mere.nomparent'] = 'Ce champ est requis.';
                            if (!values.mere.prenomparent) newErrors['mere.prenomparent'] = 'Ce champ est requis.';
                            if (!values.mere.datenaissparent) newErrors['mere.datenaissparent'] = 'Ce champ est requis.';
                            break;
                        case 'orpholinelesdeux':
                            if (!values.tuteur.nomparent) newErrors['tuteur.nomparent'] = 'Ce champ est requis.';
                            if (!values.tuteur.prenomparent) newErrors['tuteur.prenomparent'] = 'Ce champ est requis.';
                            if (!values.tuteur.datenaissparent) newErrors['tuteur.datenaissparent'] = 'Ce champ est requis.';
                            break;
                        case 'vivant':
                            if (!values.pere.nomparent) newErrors['pere.nomparent'] = 'Ce champ est requis.';
                            if (!values.pere.prenomparent) newErrors['pere.prenomparent'] = 'Ce champ est requis.';
                            if (!values.pere.datenaissparent) newErrors['pere.datenaissparent'] = 'Ce champ est requis.';
                            if (!values.mere.nomparent) newErrors['mere.nomparent'] = 'Ce champ est requis.';
                            if (!values.mere.prenomparent) newErrors['mere.prenomparent'] = 'Ce champ est requis.';
                            if (!values.mere.datenaissparent) newErrors['mere.datenaissparent'] = 'Ce champ est requis.';
                            break;
                    }
                }
                break;
            case 3:
                if (!values.maladieChronique) newErrors.maladieChronique = 'Ce champ est requis.';
                if (!values.groupeSanguin) newErrors.groupeSanguin = 'Ce champ est requis.';
                break;
            case 4:
                break;
            case 5:
                if (!values.username) newErrors.username = 'Ce champ est requis.';
                if (!values.password) newErrors.password = 'Ce champ est requis.';
                break;
            default:
                break;
        }
        return newErrors;
    };

    const validateAllStepsUpTo = (targetStep) => {
        let allErrors = {};
        for (let i = 1; i < targetStep; i++) {
            const stepErrors = validateStep(i);
            if (Object.keys(stepErrors).length > 0) {
                allErrors = { ...allErrors, ...stepErrors };
            }
        }
        return allErrors;
    };
    const handleStepClick = (targetStep) => {
        if (targetStep < step) {
            // Autoriser la navigation vers les étapes précédentes sans validation
            setStep(targetStep);
        } else {
            // Valider toutes les étapes précédentes
            const errors = validateAllStepsUpTo(targetStep);
            if (Object.keys(errors).length === 0) {
                setStep(targetStep);
            } else {
                setErrors(errors);
                alert("Veuillez remplir tous les champs obligatoires des étapes précédentes avant de continuer.");
            }
        }
    };
    useEffect(() => {
        const fetchEleve = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    console.error('Aucun token trouvé. Veuillez vous connecter.');
                    return;
                }
                console.log("eleveId:", eleveId, "isEditing:", isEditing);
                const response = await axios.get(`http://localhost:5000/eleves/${eleveId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                const eleveData = response.data.eleve;
                const userData = eleveData.User;
                if (userData.photo) {
                    setPreview(userData.photo);
                }
                const parentsData = eleveData.Parents || [];

                // Trouver père, mère et tuteur
                const pereData = parentsData.find(parent => parent.typerole === 'Père') || {};
                const mereData = parentsData.find(parent => parent.typerole === 'Mère') || {};
                const tuteurData = parentsData.find(parent => parent.typerole === 'Tuteur') || {};

                setValues(prev => ({
                    ...prev,
                    // Données de l'élève
                    ...eleveData,
                    // Données de l'utilisateur
                    ...userData,
                    username: userData.username || prev.username,
                    password: userData.password || prev.password,
                    // Données des parents
                    pere: {
                        ...prev.pere,
                        nomparent: pereData.User?.nom || '',
                        prenomparent: pereData.User?.prenom || '',
                        datenaissparent: pereData.User?.datenaiss || '',
                        nom_arparent: pereData.User?.nom_ar || '',
                        prenom_arparent: pereData.User?.prenom_ar || '',
                        lieuxnaissparent: pereData.User?.lieuxnaiss || '',
                        lieuxnaiss_arparent: pereData.User?.lieuxnaiss_ar || '',
                        nationaliteparent: pereData.User?.nationalite || '',
                        emailparent: pereData.User?.email || '',
                        telephoneparent: pereData.User?.telephone || '',
                        travailleparent: pereData.travailleparent || '',
                        situation_familiale: pereData.situation_familiale || '',
                        nombreenfant: pereData.nombreenfant || '',
                        adresseparent: pereData.User?.adresse || '',
                        adresse_arparent: pereData.User?.adresse_ar || '',
                        usernameparent: pereData.User?.username || prev.pere.usernameparent,
                        paswwordparent: pereData.User?.password || prev.pere.paswwordparent,
                        ecoleId: pereData.ecoleId || '',
                        ecoleeId: pereData.ecoleeId || ''
                    },
                    mere: {
                        ...prev.mere,
                        nomparent: mereData.User?.nom || '',
                        prenomparent: mereData.User?.prenom || '',
                        datenaissparent: mereData.User?.datenaiss || '',
                        nom_arparent: mereData.User?.nom_ar || '',
                        prenom_arparent: mereData.User?.prenom_ar || '',
                        lieuxnaissparent: mereData.User?.lieuxnaiss || '',
                        lieuxnaiss_arparent: mereData.User?.lieuxnaiss_ar || '',
                        nationaliteparent: mereData.User?.nationalite || '',
                        emailparent: mereData.User?.email || '',
                        telephoneparent: mereData.User?.telephone || '',
                        travailleparent: mereData.travailleparent || '',
                        situation_familiale: mereData.situation_familiale || '',
                        nombreenfant: mereData.nombreenfant || '',
                        adresseparent: mereData.User?.adresse || '',
                        adresse_arparent: mereData.User?.adresse_ar || '',
                        usernameparent: mereData.User?.username || prev.mere.usernameparent,
                        paswwordparent: mereData.User?.password || prev.mere.paswwordparent,
                        ecoleId: mereData.ecoleId || '',
                        ecoleeId: mereData.ecoleeId || ''
                    },
                    tuteur: {
                        ...prev.tuteur,
                        nomparent: tuteurData.User?.nom || '',
                        prenomparent: tuteurData.User?.prenom || '',
                        datenaissparent: tuteurData.User?.datenaiss || '',
                        nom_arparent: tuteurData.User?.nom_ar || '',
                        prenom_arparent: tuteurData.User?.prenom_ar || '',
                        lieuxnaissparent: tuteurData.User?.lieuxnaiss || '',
                        lieuxnaiss_arparent: tuteurData.User?.lieuxnaiss_ar || '',
                        nationaliteparent: tuteurData.User?.nationalite || '',
                        emailparent: tuteurData.User?.email || '',
                        telephoneparent: tuteurData.User?.telephone || '',
                        travailleparent: tuteurData.travailleparent || '',
                        situation_familiale: tuteurData.situation_familiale || '',
                        nombreenfant: tuteurData.nombreenfant || '',
                        adresseparent: tuteurData.User?.adresse || '',
                        adresse_arparent: tuteurData.User?.adresse_ar || '',
                        usernameparent: tuteurData.User?.username || prev.tuteur.usernameparent,
                        paswwordparent: tuteurData.User?.password || prev.tuteur.paswwordparent,
                        ecoleId: tuteurData.ecoleId || '',
                        ecoleeId: tuteurData.ecoleeId || ''
                    },
                    orphelin: eleveData.orphelin || 'vivant'
                }));
            } catch (error) {
                console.error("Erreur lors de la récupération de l'élève:", error);
            }
        };

        if (eleveId) {
            fetchEleve();
        }
    }, [eleveId]); // Déclencher uniquement lorsque eleveId change

    // Soumission du formulaire (Ajout ou Modification)
    const handleSubmit = async (event) => {
        const token = localStorage.getItem('token');
        if (!token) {
            console.error('Aucun token trouvé. Veuillez vous connecter.');
            return;
        }
        event.preventDefault();

        // Log des valeurs de ecoleId et ecoleeId
        console.log("📌 ecoleId :", ecoleId);
        console.log("📌 ecoleeId :", ecoleeId);

        // Préparation des données des parents
        const parentData = [];
        if (values.orphelin === 'orpholinemère' || values.orphelin === 'vivant') {
            parentData.push({ ...values.pere, typerole: 'Père', ecoleId, ecoleeId });
        }
        if (values.orphelin === 'orpholinepère' || values.orphelin === 'vivant') {
            parentData.push({ ...values.mere, typerole: 'Mère', ecoleId, ecoleeId });
        }
        if (values.orphelin === 'orpholinelesdeux') {
            parentData.push({ ...values.tuteur, typerole: 'Tuteur', ecoleId, ecoleeId });
        }

        // Log des données des parents
        console.log("📌 Données des parents préparées :", parentData);

        // Préparation de FormData
        const formData = new FormData();
        formData.append("eleveData", JSON.stringify({
            ...values,
            password: values.password,
            ecoleId, // Inclure ecoleId
            ecoleeId, // Inclure ecoleeId
        }));
        formData.append("parentData", JSON.stringify(parentData));

        // Log des données de l'élève
        console.log("📌 Données de l'élève préparées :", {
            ...values,
            ecoleId,
            ecoleeId,
        });

        // Ajout de la photo si elle existe
        if (values.photo && values.photo instanceof File) {
            formData.append("photo", values.photo);
            console.log("📌 Photo ajoutée :", values.photo);
        }

        try {
            const url = isEditing ? `http://localhost:5000/eleves/${eleveId}` : 'http://localhost:5000/eleves';
            const method = isEditing ? 'put' : 'post';

            console.log(`📢 Envoi des données en ${method.toUpperCase()} à ${url}`);

            const response = await axios[method](url, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`,
                },
            });

            console.log("✅ Réponse serveur :", response.data);
            setProfileInfo({
                User: {
                    nom: values.nom,
                    prenom: values.prenom,
                    username: values.username,
                    password: values.password,
                    photo: preview // ou l'URL de la photo si vous l'uploader
                },
                Parents: [
                    // Ajoutez ici les informations des parents selon le cas
                    values.orphelin === 'orpholinemère' || values.orphelin === 'vivant' ? {
                        User: {
                            nom: values.pere.nomparent,
                            prenom: values.pere.prenomparent,
                            username: values.pere.usernameparent,
                            password: values.pere.paswwordparent
                        }
                    } : null,
                    values.orphelin === 'orpholinepère' || values.orphelin === 'vivant' ? {
                        User: {
                            nom: values.mere.nomparent,
                            prenom: values.mere.prenomparent,
                            username: values.mere.usernameparent,
                            password: values.mere.paswwordparent
                        }
                    } : null
                ].filter(Boolean) // Filtre les valeurs null
            });

            // Ouvrir la modal
            setShowProfileModal(true);
        } catch (error) {
            console.error("❌ Erreur lors de l'envoi des données :", error);
            if (error.response) {
                console.error("📌 Détails de l'erreur :", error.response.data);
            }
        }
    };

    useEffect(() => {
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
        fetchNiveaux();
    }, []);
    useEffect(() => {
        const fetchUser = async () => {
            const token = localStorage.getItem("token");
            if (!token) {
                console.error("❌ Aucun token trouvé. Veuillez vous connecter.");
                return;
            }

            try {
                console.log("🔍 Appel à getMe en cours...");
                const response = await axios.get("http://localhost:5000/getMe", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                console.log("✅ Réponse de getMe :", response.data);
                setEcoleId(response.data.ecoleId);
                setEcoleeId(response.data.ecoleeId);
            } catch (error) {
                console.error("❌ Erreur lors de la récupération des informations de l'utilisateur :", error);
            }
        };

        fetchUser();
    }, []);


    useEffect(() => {
        const fetchCycle = async () => {
            const token = localStorage.getItem("token");
            if (!token) {
                console.error("❌ Aucun token trouvé !");
                return;
            }

            try {
                if (ecoleeId && ecoleeId !== "null" && ecoleeId !== "undefined") {
                    // Récupérer le cycle spécifique à ecoleeId
                    console.log(`🔍 Récupération du cycle pour l'ecoleeId: ${ecoleeId}`);
                    const response = await axios.get(`http://localhost:5000/ecoles/${ecoleeId}`, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });

                    console.log("✅ Cycle récupéré :", response.data.cycle);
                    setCycle(response.data.cycle); // Mettre à jour le cycle spécifique
                    setCycles([{ id: ecoleeId, nomCycle: response.data.cycle }]); // Ajouter le cycle spécifique à la liste des cycles
                } else {
                    // Récupérer tous les cycles disponibles
                    console.log("🔍 Récupération de tous les cycles");
                    const response = await axios.get('http://localhost:5000/cyclescolaires', {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });

                    console.log("✅ Tous les cycles récupérés :", response.data);
                    setCycles(response.data); // Mettre à jour la liste des cycles
                }
            } catch (error) {
                console.error("❌ Erreur lors de la récupération des cycles :", error);
            }
        };

        fetchCycle();
    }, [ecoleeId]); // Dépendance pour exécuter lorsque ecoleeId change
    useEffect(() => {
        if (cycle) {
            setValues((prevValues) => ({
                ...prevValues,
                cycle: cycle,
            }));
        }
    }, [cycle]);
    useEffect(() => {
        const storedEcoleId = localStorage.getItem("ecoleId");
        const storedEcoleeId = localStorage.getItem("ecoleeId");

        if (storedEcoleId) {
            setEcoleId(storedEcoleId);
        }
        if (storedEcoleeId) {
            setEcoleeId(storedEcoleeId);
        }
    }, []);



    const generateNumInscription = () => {
        const randomPart = Math.floor(Math.random() * 1e9); // Génère un nombre aléatoire de 9 chiffres
        const timestampPart = Date.now().toString().slice(-6); // Prend les 6 derniers chiffres du timestamp
        return `${randomPart}${timestampPart}`.padStart(15, "0"); // Assure d'avoir 15 chiffres
    };

    // Génération automatique au chargement du composant
    useEffect(() => {
        setValues((prevValues) => ({
            ...prevValues,
            numinscription: generateNumInscription(),
        }));
    }, []);
    return (
        <>
            {/* Navigation */}
            <nav className="mb-3">
                <Link to="/home" className="text-primary">Accueil</Link>
                <span> / </span>
                <Link to="/eleves" className="text-primary">Gestion des étudiants</Link>
                <span> / </span>
                <span>{isEditing ? "Modifier" : "Ajouter"}</span>
            </nav>

            {/* Contenu principal */}
            <div className="container">
                <form onSubmit={handleSubmit} className="container" encType="multipart/form-data">
                    <h2>{isEditing ? "Modifier un élève" : "Ajouter un élève"}</h2>
                    <div className="card card-primary card-outline p-4">
                        {renderStepIndicator()}
                        <input
                            type="hidden"
                            className="form-control"
                            value={ecoleId || ''}
                            readOnly
                        />
                        <input
                            type="hidden"
                            className="form-control"
                            value={ecoleeId || ''}
                            readOnly
                        />

                        <div className="form-content mt-3">
                            {step === 1 && (
                                <>
                                    <div className='row'>
                                        <div className="col-md-4">
                                            <label>Nom</label>
                                            <input
                                                type="text"
                                                name='nom' // Correspond à values.nom
                                                className="form-control"
                                                value={values.nom}
                                                onChange={(e) => handleChange(e, 'eleve')} // Appel de handleChange
                                            />
                                            {errors.nom && <div className="text-danger">{errors.nom}</div>}
                                        </div>
                                        <div className="col-md-4">
                                            <label>Prénom</label>
                                            <input
                                                type="text"
                                                name='prenom' // Correspond à values.prenom
                                                className="form-control"
                                                value={values.prenom}
                                                onChange={(e) => handleChange(e, 'eleve')} // Appel de handleChange
                                            />
                                            {errors.prenom && <div className="text-danger">{errors.prenom}</div>}
                                        </div>
                                        <div className="col-md-4">
                                            <label>Date Naissance</label>
                                            <input
                                                type="date"
                                                name="datenaiss"
                                                className="form-control"
                                                value={values.datenaiss ? values.datenaiss.split('T')[0] : ''} // Formattage de la date
                                                onChange={(e) => handleChange(e, 'eleve')}
                                            />
                                            {errors.datenaiss && <div className="text-danger">{errors.datenaiss}</div>}
                                        </div>

                                    </div>
                                    <div className='row'>
                                        <div className="col-md-4">
                                            <label>Nom en arabe</label>
                                            <input
                                                type="text"
                                                name='nom_ar' // Correspond à values.nom_ar
                                                className="form-control"
                                                value={values.nom_ar}
                                                onChange={(e) => handleChange(e, 'eleve')} // Appel de handleChange
                                            />
                                        </div>
                                        <div className="col-md-4">
                                            <label>Prénom en arabe</label>
                                            <input
                                                type="text"
                                                name='prenom_ar' // Correspond à values.prenom_ar
                                                className="form-control"
                                                value={values.prenom_ar}
                                                onChange={(e) => handleChange(e, 'eleve')} // Appel de handleChange
                                            />
                                        </div>
                                        <div className="col-md-4">
                                            <label>N° d'acte de naissance</label>
                                            <input
                                                type="text"
                                                name='nactnaiss' // Correspond à values.nactnaiss
                                                className="form-control"
                                                value={values.nactnaiss}
                                                onChange={(e) => handleChange(e, 'eleve')} // Appel de handleChange
                                            />
                                        </div>
                                    </div>
                                    <div className='row'>
                                        <div className="col-md-6">
                                            <label>Lieux de naissance</label>
                                            <input
                                                type="text"
                                                name='lieuxnaiss' // Correspond à values.lieuxnaiss
                                                className="form-control"
                                                value={values.lieuxnaiss}
                                                onChange={(e) => handleChange(e, 'eleve')} // Appel de handleChange
                                            />
                                        </div>
                                        <div className="col-md-6">
                                            <label>Lieux de naissance en arabe</label>
                                            <input
                                                type="text"
                                                name='lieuxnaiss_ar' // Correspond à values.lieuxnaiss_ar
                                                className="form-control"
                                                value={values.lieuxnaiss_ar}
                                                onChange={(e) => handleChange(e, 'eleve')} // Appel de handleChange
                                            />
                                        </div>
                                    </div>
                                    <div className='row'>
                                        <div className="col-md-6">
                                            <label>Adresse</label>
                                            <input
                                                type="text"
                                                name='adresse' // Correspond à values.adresse
                                                className="form-control"
                                                value={values.adresse}
                                                onChange={(e) => handleChange(e, 'eleve')} // Appel de handleChange
                                            />
                                        </div>
                                        <div className="col-md-6">
                                            <label>Adresse en arabe</label>
                                            <input
                                                type="text"
                                                name='adresse_ar' // Correspond à values.adresse_ar
                                                className="form-control"
                                                value={values.adresse_ar}
                                                onChange={(e) => handleChange(e, 'eleve')} // Appel de handleChange
                                            />
                                        </div>
                                    </div>
                                    <div className='row'>
                                        <div className="col-md-4">
                                            <label htmlFor="validationCustom04" className="form-label">Nationalité</label>
                                            <Select
                                                value={selectedOption}
                                                onChange={(selectedOption) => {
                                                    handleSelectChange(selectedOption); // Met à jour la nationalité
                                                    handleRoleChange(selectedOption, 'eleve'); // Exécute la fonction handleRoleChange
                                                }}
                                                options={nationalites}
                                                styles={customStyles}
                                            />
                                        </div>
                                        <div className="col-md-4">
                                            <label>Sexe</label>
                                            <select
                                                className="form-control"
                                                name='sexe' // Correspond à values.sexe
                                                value={values.sexe}
                                                onChange={(e) => handleChange(e, 'eleve')} // Appel de handleChange
                                            >
                                                <option value="">Sélectionner...</option>
                                                <option value="Masculin">Masculin</option>
                                                <option value="Féminin">Féminin</option>
                                            </select>
                                        </div>
                                        <div className="col-md-4">
                                            <label>État social</label>
                                            <input
                                                type="text"
                                                name='etat_social' // Correspond à values.etat_social
                                                className="form-control"
                                                value={values.etat_social}
                                                onChange={(e) => handleChange(e, 'eleve')} // Appel de handleChange
                                            />
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        className="btn btn-primary mt-3"
                                        onClick={nextStep}
                                    >
                                        Suivant
                                    </button>
                                </>
                            )}

                            {step === 2 && (
                                <>
                                    <div className="card-body">
                                        <div className="row">
                                            <div className="col-md-3">
                                                <input
                                                    name="orphelin"
                                                    type="radio"
                                                    id="orpholinemère"
                                                    value="orpholinemère"
                                                    onChange={handleChange}
                                                    checked={values.orphelin === 'orpholinemère'}
                                                    required
                                                />
                                                <label htmlFor="orpholinemère" className="form-label ml-1"> Orphelin mère</label>
                                            </div>

                                            <div className="col-md-3">
                                                <input
                                                    name="orphelin"
                                                    type="radio"
                                                    id="orpholinepère"
                                                    value="orpholinepère"
                                                    onChange={handleChange}
                                                    checked={values.orphelin === 'orpholinepère'}
                                                    required
                                                />
                                                <label htmlFor="orpholinepère" className="form-label ml-1"> Orphelin père</label>
                                            </div>

                                            <div className="col-md-3">
                                                <input
                                                    name="orphelin"
                                                    type="radio"
                                                    id="orpholinelesdeux"
                                                    value="orpholinelesdeux"
                                                    onChange={handleChange}
                                                    checked={values.orphelin === 'orpholinelesdeux'}
                                                    required
                                                />
                                                <label htmlFor="orpholinelesdeux" className="form-label ml-1"> Orphelin des deux parents</label>
                                            </div>

                                            <div className="col-md-3">
                                                <input
                                                    name="orphelin"
                                                    type="radio"
                                                    id="vivant"
                                                    value="vivant"
                                                    onChange={handleChange}
                                                    checked={values.orphelin === 'vivant'}
                                                    required
                                                />
                                                <label htmlFor="vivant" className="form-label ml-1"> Les deux parents vivants</label>
                                            </div>

                                        </div>

                                        {/* Affichage conditionnel des informations du père, de la mère ou du tuteur */}
                                        {values.orphelin === 'orpholinemère' && (
                                            <ParentSection title="Informations Père">
                                                <div className="row">
                                                    <div className="col-md-4">
                                                        <label htmlFor="nom_pere" className="form-label">Nom</label>
                                                        <input
                                                            name="nomparent"
                                                            type="text"
                                                            className="form-control"
                                                            id="nom_pere"
                                                            value={values.pere.nomparent}
                                                            onChange={(e) => handleRoleChange(e, 'pere')}
                                                            required
                                                        />
                                                    </div>
                                                    <div className="col-md-4">
                                                        <label htmlFor="prenom_pere" className="form-label">Prénom</label>
                                                        <input
                                                            name="prenomparent"
                                                            type="text"
                                                            className="form-control"
                                                            id="prenom_pere"
                                                            value={values.pere.prenomparent}
                                                            onChange={(e) => handleRoleChange(e, 'pere')}
                                                            required
                                                        />
                                                    </div>
                                                    <div className="col-md-4">
                                                        <label htmlFor="datenaiss_pere" className="form-label">Date de naissance</label>
                                                        <input
                                                            name="datenaissparent"
                                                            type="date"
                                                            className="form-control"
                                                            id="datenaiss_pere"
                                                            value={values.pere.datenaissparent ? values.pere.datenaissparent.split('T')[0] : ''}
                                                            onChange={(e) => handleRoleChange(e, 'pere')}
                                                            required
                                                        />
                                                    </div>
                                                </div>
                                                <div className="row mt-3">
                                                    {/* Nom et Prénom en arabe */}
                                                    <div className="col-md-4">
                                                        <label htmlFor="nom_ar" className="form-label">Nom en arabe</label>
                                                        <input
                                                            name="nom_arparent"
                                                            type="text"
                                                            className="form-control"
                                                            id="nom_ar"
                                                            value={values.pere.nom_arparent} // Correctly reference values.pere
                                                            onChange={(e) => handleRoleChange(e, 'pere')}
                                                            required
                                                        />
                                                    </div>
                                                    <div className="col-md-4">
                                                        <label htmlFor="prenom_ar" className="form-label">Prénom en arabe</label>
                                                        <input
                                                            name="prenom_arparent"
                                                            type="text"
                                                            className="form-control"
                                                            id="prenom_ar"
                                                            value={values.pere.prenom_arparent} // Correctly reference values.pere
                                                            onChange={(e) => handleRoleChange(e, 'pere')}
                                                            required
                                                        />
                                                    </div>
                                                    <div className="col-md-4">
                                                        <label htmlFor="nationalite" className="form-label">Nationalité</label>
                                                        <Select
                                                            value={selectedOption}
                                                            onClick={handleSelectChange}
                                                            onChange={(e) => handleRoleChange(e, 'pere')}
                                                            options={nationalites}
                                                            styles={customStyles}
                                                            placeholder="Sélectionnez une nationalité"
                                                        />
                                                    </div>
                                                </div>

                                                <div className="row mt-3">
                                                    {/* Adresse en français et arabe */}
                                                    <div className="col-md-6">
                                                        <label htmlFor="adresse" className="form-label">Lieux de naissance</label>
                                                        <input
                                                            name="lieuxnaissparent"
                                                            type="text"
                                                            className="form-control"
                                                            id="adresse"
                                                            value={values.pere.lieuxnaissparent} // Correctly reference values.pere
                                                            onChange={(e) => handleRoleChange(e, 'pere')}
                                                            required
                                                        />
                                                    </div>
                                                    <div className="col-md-6">
                                                        <label htmlFor="adresse_ar" className="form-label">Lieux de naissance en arabe</label>
                                                        <input
                                                            name="lieuxnaiss_arparent"
                                                            type="text"
                                                            className="form-control"
                                                            id="adresse_ar"
                                                            value={values.pere.lieuxnaiss_arparent} // Correctly reference values.pere
                                                            onChange={(e) => handleRoleChange(e, 'pere')}
                                                            required
                                                        />
                                                    </div>
                                                </div>
                                                <div className='row'>
                                                    <div className="col-md-6">
                                                        <label>Adresse</label>
                                                        <input
                                                            type="text"
                                                            name='adresseparent' // Correspond à values.lieux
                                                            className="form-control"
                                                            value={values.adresseparent}
                                                            onChange={(e) => handleChange(e, 'pere')} // Appel de handleChange
                                                        />
                                                    </div>
                                                    <div className="col-md-6">
                                                        <label>Adresse en arabe</label>
                                                        <input
                                                            type="text"
                                                            name='adresse_arparent' // Correspond à values.lieux_arabe
                                                            className="form-control"
                                                            value={values.adresse_arparent}
                                                            onChange={(e) => handleChange(e, 'pere')} // Appel de handleChange
                                                        />
                                                    </div>
                                                </div>
                                                <div className="row mt-3">
                                                    {/* Téléphone et Email */}
                                                    <div className="col-md-6">
                                                        <label htmlFor="tel" className="form-label">Téléphone</label>
                                                        <input
                                                            name="telephoneparent"
                                                            type="text"
                                                            className="form-control"
                                                            id="tel"
                                                            value={values.pere.telephoneparent} // Correctly reference values.pere
                                                            onChange={(e) => handleRoleChange(e, 'pere')}
                                                            required
                                                        />
                                                    </div>
                                                    <div className="col-md-6">
                                                        <label htmlFor="email" className="form-label">Email</label>
                                                        <input
                                                            name="emailparent"
                                                            type="email"
                                                            className="form-control"
                                                            id="email"
                                                            value={values.pere.emailparent} // Correctly reference values.pere
                                                            onChange={(e) => handleRoleChange(e, 'pere')}
                                                            required
                                                        />
                                                    </div>
                                                </div>

                                                <div className="row mt-3">
                                                    {/* Travail et Situation familiale */}
                                                    <div className="col-md-6">
                                                        <label htmlFor="travail" className="form-label">Profession de père</label>
                                                        <input
                                                            name="travailleparent"
                                                            type="text"
                                                            className="form-control"
                                                            id="travail"
                                                            value={values.pere.travailleparent} // Correctly reference values.pere
                                                            onChange={(e) => handleRoleChange(e, 'pere')}
                                                            required
                                                        />
                                                    </div>
                                                    <div className="col-md-6">
                                                        <label htmlFor="situationFamiliale" className="form-label">Situation familiale</label>
                                                        <select
                                                            name="situation_familiale"
                                                            className="form-control"
                                                            id="situationFamiliale"
                                                            value={values.pere.situation_familiale} // Correctly reference values.pere
                                                            onChange={(e) => handleRoleChange(e, 'pere')}
                                                            required
                                                        >
                                                            <option value="">Situation Familiale</option>
                                                            <option value="Marié">Marié</option>
                                                            <option value="Divorcé">Divorcé</option>
                                                        </select>
                                                    </div>
                                                </div>

                                                <div className="row mt-3">
                                                    {/* Nombre d'enfants */}
                                                    <div className="col-md-4">
                                                        <label htmlFor="nmbrenfant" className="form-label">Nombre d'enfants</label>
                                                        <input
                                                            name="nombreenfant"
                                                            type="number"
                                                            className="form-control"
                                                            id="nmbrenfant"
                                                            value={values.pere.nombreenfant} // Correctly reference values.pere
                                                            onChange={(e) => handleRoleChange(e, 'pere')}
                                                            required
                                                        />
                                                    </div>

                                                    {/* Nom d'utilisateur et Mot de passe */}
                                                    <div className="col-md-4">
                                                        <label htmlFor="username_pere" className="form-label">Nom d'utilisateur</label>
                                                        <div className="input-group has-validation">
                                                            <span className="input-group-text" id="inputGroupPrepend">@</span>
                                                            <input
                                                                name="usernameparent"
                                                                type="text"
                                                                className="form-control"
                                                                id="username_pere"
                                                                value={values.pere.usernameparent} // Correctly reference values.pere
                                                                onChange={(e) => handleRoleChange(e, 'pere')}
                                                                required
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="col-md-4">
                                                        <label htmlFor="password_pere" className="form-label">Mot de passe</label>
                                                        <div className="input-group">
                                                            <input
                                                                name="paswwordparent"
                                                                type={showPassword ? "text" : "password"} // Change le type du champ selon l'état
                                                                className="form-control"
                                                                id="password_pere"
                                                                value={values.pere.paswwordparent} // Correctly reference values.pere
                                                                onChange={(e) => handleRoleChange(e, 'pere')}
                                                                required
                                                            />
                                                            <span
                                                                className="input-group-text"
                                                                onClick={togglePasswordVisibility}
                                                                style={{ cursor: 'pointer' }}
                                                            >
                                                                {showPassword ? (
                                                                    <i className="fa fa-eye-slash" aria-hidden="true"></i> // Icone pour masquer
                                                                ) : (
                                                                    <i className="fa fa-eye" aria-hidden="true"></i> // Icone pour afficher
                                                                )}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </ParentSection>
                                        )}

                                        {values.orphelin === 'orpholinepère' && (
                                            <ParentSection title="Informations Mère">
                                                <div className="row">
                                                    <div className="col-md-4">
                                                        <label htmlFor="nom_mere" className="form-label">Nom</label>
                                                        <input
                                                            name="nomparent"
                                                            type="text"
                                                            className="form-control"
                                                            id="nom_mere"
                                                            value={values.mere.nomparent} // Correctly reference values.mere
                                                            onChange={(e) => handleRoleChange(e, 'mere')}
                                                            required
                                                        />
                                                    </div>
                                                    <div className="col-md-4">
                                                        <label htmlFor="prenom_mere" className="form-label">Prénom</label>
                                                        <input
                                                            name="prenomparent"
                                                            type="text"
                                                            className="form-control"
                                                            id="prenom_mere"
                                                            value={values.mere.prenomparent} // Correctly reference values.mere
                                                            onChange={(e) => handleRoleChange(e, 'mere')}
                                                            required
                                                        />
                                                    </div>
                                                    <div className="col-md-4">
                                                        <label htmlFor="datenaiss_mere" className="form-label">Date de naissance</label>
                                                        <input
                                                            name="datenaissparent"
                                                            type="date"
                                                            className="form-control"
                                                            id="datenaiss_mere"
                                                            value={values.mere.datenaissparent ? values.mere.datenaissparent.split('T')[0] : ''}// Correctly reference values.mere
                                                            onChange={(e) => handleRoleChange(e, 'mere')}
                                                            required
                                                        />
                                                    </div>
                                                </div>
                                                <div className="row mt-3">
                                                    {/* Nom et Prénom en arabe */}
                                                    <div className="col-md-4">
                                                        <label htmlFor="nom_ar" className="form-label">Nom en arabe</label>
                                                        <input
                                                            name="nom_arparent"
                                                            type="text"
                                                            className="form-control"
                                                            id="nom_ar"
                                                            value={values.mere.nom_arparent} // Correctly reference values.mere
                                                            onChange={(e) => handleRoleChange(e, 'mere')}
                                                            required
                                                        />
                                                    </div>
                                                    <div className="col-md-4">
                                                        <label htmlFor="prenom_ar" className="form-label">Prénom en arabe</label>
                                                        <input
                                                            name="prenom_arparent"
                                                            type="text"
                                                            className="form-control"
                                                            id="prenom_ar"
                                                            value={values.mere.prenom_arparent} // Correctly reference values.mere
                                                            onChange={(e) => handleRoleChange(e, 'mere')}
                                                            required
                                                        />
                                                    </div>
                                                    <div className="col-md-4">
                                                        <label htmlFor="nationalite" className="form-label">Nationalité</label>
                                                        <Select
                                                            value={selectedOption}
                                                            onClick={handleSelectChange}
                                                            onChange={(e) => handleRoleChange(e, 'mere')}
                                                            options={nationalites}
                                                            styles={customStyles}
                                                            placeholder="Sélectionnez une nationalité"
                                                        />
                                                    </div>
                                                </div>

                                                <div className="row mt-3">
                                                    {/* Adresse en français et arabe */}
                                                    <div className="col-md-6">
                                                        <label htmlFor="adresse" className="form-label">Lieux de naissance</label>
                                                        <input
                                                            name="lieuxnaissparent"
                                                            type="text"
                                                            className="form-control"
                                                            id="adresse"
                                                            value={values.mere.lieuxnaissparent} // Correctly reference values.mere
                                                            onChange={(e) => handleRoleChange(e, 'mere')}
                                                            required
                                                        />
                                                    </div>
                                                    <div className="col-md-6">
                                                        <label htmlFor="adresse_ar" className="form-label">Lieux de naissance en arabe</label>
                                                        <input
                                                            name="lieuxnaiss_arparent"
                                                            type="text"
                                                            className="form-control"
                                                            id="adresse_ar"
                                                            value={values.mere.lieuxnaiss_arparent} // Correctly reference values.mere
                                                            onChange={(e) => handleRoleChange(e, 'mere')}
                                                            required
                                                        />
                                                    </div>
                                                    <input type="hidden" name="typerole" value="Mère" />
                                                </div>
                                                <div className='row'>
                                                    <div className="col-md-6">
                                                        <label>Adresse</label>
                                                        <input
                                                            type="text"
                                                            name='adresseparent' // Correspond à values.lieux
                                                            className="form-control"
                                                            value={values.adresseparent}
                                                            onChange={(e) => handleChange(e, 'mere')} // Appel de handleChange
                                                        />
                                                    </div>
                                                    <div className="col-md-6">
                                                        <label>Adresse en arabe</label>
                                                        <input
                                                            type="text"
                                                            name='adresse_arparent' // Correspond à values.lieux_arabe
                                                            className="form-control"
                                                            value={values.adresse_arparent}
                                                            onChange={(e) => handleChange(e, 'mere')} // Appel de handleChange
                                                        />
                                                    </div>
                                                </div>
                                                <div className="row mt-3">
                                                    {/* Téléphone et Email */}
                                                    <div className="col-md-6">
                                                        <label htmlFor="tel" className="form-label">Téléphone</label>
                                                        <input
                                                            name="telephoneparent"
                                                            type="text"
                                                            className="form-control"
                                                            id="tel"
                                                            value={values.mere.telephoneparent} // Correctly reference values.mere
                                                            onChange={(e) => handleRoleChange(e, 'mere')}
                                                            required
                                                        />
                                                    </div>
                                                    <div className="col-md-6">
                                                        <label htmlFor="email" className="form-label">Email</label>
                                                        <input
                                                            name="emailparent"
                                                            type="email"
                                                            className="form-control"
                                                            id="email"
                                                            value={values.mere.emailparent} // Correctly reference values.m ere
                                                            onChange={(e) => handleRoleChange(e, 'mere')}
                                                            required
                                                        />
                                                    </div>
                                                </div>

                                                <div className="row mt-3">
                                                    {/* Travail et Situation familiale */}
                                                    <div className="col-md-6">
                                                        <label htmlFor="travail" className="form-label">Profession de mère</label>
                                                        <input
                                                            name="travailleparent"
                                                            type="text"
                                                            className="form-control"
                                                            id="travail"
                                                            value={values.mere.travailleparent} // Correctly reference values.mere
                                                            onChange={(e) => handleRoleChange(e, 'mere')}
                                                            required
                                                        />
                                                    </div>
                                                    <div className="col-md-6">
                                                        <label htmlFor="situationFamiliale" className="form-label">Situation familiale</label>
                                                        <select
                                                            name="situation_familiale"
                                                            className="form-control"
                                                            id="situationFamiliale"
                                                            value={values.mere.situation_familiale} // Correctly reference values.mere
                                                            onChange={(e) => handleRoleChange(e, 'mere')}
                                                            required
                                                        >
                                                            <option value="Marié">Marié</option>
                                                            <option value="Divorcé">Divorcé</option>
                                                            <option value="veuve">Veuve</option>
                                                        </select>
                                                    </div>
                                                </div>

                                                <div className="row mt-3">
                                                    {/* Nombre d'enfants */}
                                                    <div className="col-md-4">
                                                        <label htmlFor="nmbrenfant" className="form-label">Nombre d'enfants</label>
                                                        <input
                                                            name="nombreenfant"
                                                            type="number"
                                                            className="form-control"
                                                            id="nmbrenfant"
                                                            value={values.mere.nombreenfant} // Correctly reference values.mere
                                                            onChange={(e) => handleRoleChange(e, 'mere')}
                                                            required
                                                        />
                                                    </div>

                                                    {/* Nom d'utilisateur et Mot de passe */}
                                                    <div className="col-md-4">
                                                        <label htmlFor="username_mere" className="form-label">Nom d'utilisateur</label>
                                                        <div className="input-group has-validation">
                                                            <span className="input-group-text" id="inputGroupPrepend">@</span>
                                                            <input
                                                                name="usernameparent"
                                                                type="text"
                                                                className="form-control"
                                                                id="username_mere"
                                                                value={values.mere.usernameparent} // Correctly reference values.mere
                                                                onChange={(e) => handleRoleChange(e, 'mere')}
                                                                aria-describedby="inputGroupPrepend"
                                                                required
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="col-md-4">
                                                        <label htmlFor="password_mere" className="form-label">Mot de passe</label>
                                                        <div className="input-group has-validation">
                                                            <input
                                                                name="paswwordparent"
                                                                type={showPassword ? "text" : "password"}
                                                                className="form-control"
                                                                id="password_mere"
                                                                value={values.mere.paswwordparent} // Correctly reference values.mere
                                                                onChange={(e) => handleRoleChange(e, 'mere')}
                                                                required
                                                            />
                                                            <span
                                                                className="input-group-text"
                                                                onClick={togglePasswordVisibility}
                                                                style={{ cursor: 'pointer' }}
                                                            >
                                                                {showPassword ? (
                                                                    <i className="fa fa-eye-slash" aria-hidden="true"></i> // Icone pour masquer
                                                                ) : (
                                                                    <i className="fa fa-eye" aria-hidden="true"></i> // Icone pour afficher
                                                                )}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                                {/* Ajoutez d'autres champs pour la mère ici */}
                                            </ParentSection>
                                        )}

                                        {values.orphelin === 'orpholinelesdeux' && (
                                            <ParentSection title="Informations Tuteur">
                                                <div className="row">
                                                    <div className="col-md-4">
                                                        <label htmlFor="nom_tuteur" className="form-label">Nom</label>
                                                        <input
                                                            name="nomparent"
                                                            type="text"
                                                            className="form-control"
                                                            id="nom_tuteur"
                                                            value={values.tuteur.nomparent} // Correctly reference values.tuteur
                                                            onChange={(e) => handleRoleChange(e, 'tuteur')}
                                                            required
                                                        />
                                                    </div>
                                                    <div className="col-md-4">
                                                        <label htmlFor="prenom_tuteur" className="form-label">Prénom</label>
                                                        <input
                                                            name="prenomparent"
                                                            type="text"
                                                            className="form-control"
                                                            id="prenom_tuteur"
                                                            value={values.tuteur.prenomparent} // Correctly reference values.tuteur
                                                            onChange={(e) => handleRoleChange(e, 'tuteur')}
                                                            required
                                                        />
                                                    </div>
                                                    <div className="col-md-4">
                                                        <label htmlFor="datenaiss_tuteur" className="form-label">Date de naissance</label>
                                                        <input
                                                            name="datenaissparent"
                                                            type="date"
                                                            className="form-control"
                                                            id="datenaiss_tuteur"
                                                            value={values.tuteur.datenaissparent ? values.tuteur.datenaissparent.split('T')[0] : ''}// Correctly reference values.tuteur
                                                            onChange={(e) => handleRoleChange(e, 'tuteur')}
                                                            required
                                                        />
                                                    </div>
                                                </div>
                                                <div className="row mt-3">
                                                    {/* Nom et Prénom en arabe */}
                                                    <div className="col-md-4">
                                                        <label htmlFor="nom_ar" className="form-label">Nom en arabe</label>
                                                        <input
                                                            name="nom_arparent"
                                                            type="text"
                                                            className="form-control"
                                                            id="nom_ar"
                                                            value={values.tuteur.nom_arparent} // Correctly reference values.tuteur
                                                            onChange={(e) => handleRoleChange(e, 'tuteur')}
                                                            required
                                                        />
                                                    </div>
                                                    <div className="col-md-4">
                                                        <label htmlFor="prenom_ar" className="form-label">Prénom en arabe</label>
                                                        <input
                                                            name="prenom_arparent"
                                                            type="text"
                                                            className="form-control"
                                                            id="prenom_ar"
                                                            value={values.tuteur.prenom_arparent} // Correctly reference values.tuteur
                                                            onChange={(e) => handleRoleChange(e, 'tuteur')}
                                                            required
                                                        />
                                                    </div>
                                                    <div className="col-md-4">
                                                        <label htmlFor="nationalite" className="form-label">Nationalité</label>
                                                        <Select
                                                            value={selectedOption}
                                                            onClick={handleSelectChange}
                                                            onChange={(e) => handleRoleChange(e, 'tuteur')}
                                                            options={nationalites}
                                                            styles={customStyles}
                                                            placeholder="Sélectionnez une nationalité"
                                                        />
                                                    </div>
                                                </div>

                                                <div className="row mt-3">
                                                    {/* Adresse en français et arabe */}
                                                    <div className="col-md-6">
                                                        <label htmlFor="adresse" className="form-label">Lieux de naissance</label>
                                                        <input
                                                            name="lieuxnaissparent"
                                                            type="text"
                                                            className="form-control"
                                                            id="adresse"
                                                            value={values.tuteur.lieuxnaissparent} // Correctly reference values.tuteur
                                                            onChange={(e) => handleRoleChange(e, 'tuteur')}
                                                            required
                                                        />
                                                    </div>
                                                    <div className="col-md-6">
                                                        <label htmlFor="adresse_ar" className="form-label">Lieux de naissance en arabe</label>
                                                        <input
                                                            name="lieuxnaiss_arparent"
                                                            type="text"
                                                            className="form-control"
                                                            id="adresse_ar"
                                                            value={values.tuteur.lieuxnaiss_arparent} // Correctly reference values.tuteur
                                                            onChange={(e) => handleRoleChange(e, 'tuteur')}
                                                            required
                                                        />
                                                    </div>
                                                    <input type="hidden" name="typerole" value="Tuteur" />
                                                </div>
                                                <div className='row'>
                                                    <div className="col-md-6">
                                                        <label>Adresse</label>
                                                        <input
                                                            type="text"
                                                            name='adresseparent' // Correspond à values.lieux
                                                            className="form-control"
                                                            value={values.adresseparent}
                                                            onChange={(e) => handleChange(e, 'tuteur')} // Appel de handleChange
                                                        />
                                                    </div>
                                                    <div className="col-md-6">
                                                        <label>Adresse en arabe</label>
                                                        <input
                                                            type="text"
                                                            name='adresse_arparent' // Correspond à values.lieux_arabe
                                                            className="form-control"
                                                            value={values.adresse_arparent}
                                                            onChange={(e) => handleChange(e, 'tuteur')} // Appel de handleChange
                                                        />
                                                    </div>
                                                </div>

                                                <div className="row mt-3">
                                                    {/* Téléphone et Email */}
                                                    <div className="col-md-6">
                                                        <label htmlFor="tel" className="form-label">Téléphone</label>
                                                        <input
                                                            name="telephoneparent"
                                                            type="text"
                                                            className="form-control"
                                                            id="tel"
                                                            value={values.tuteur.telephoneparent} // Correctly reference values.tuteur
                                                            onChange={(e) => handleRoleChange(e, 'tuteur')}
                                                            required
                                                        />
                                                    </div>
                                                    <div className="col-md-6">
                                                        <label htmlFor="email" className="form-label">Email</label>
                                                        <input
                                                            name="emailparent"
                                                            type="email"
                                                            className="form-control"
                                                            id="email"
                                                            value={values.tuteur.emailparent} // Correctly reference values.tuteur
                                                            onChange={(e) => handleRoleChange(e, 'tuteur')}
                                                            required
                                                        />
                                                    </div>
                                                </div>

                                                <div className="row mt-3">
                                                    {/* Travail et Situation familiale */}
                                                    <div className="col-md-6">
                                                        <label htmlFor="travail" className="form-label">Profession de tuteur</label>
                                                        <input
                                                            name="travailleparent"
                                                            type="text"
                                                            className="form-control"
                                                            id="travail"
                                                            value={values.tuteur.travailleparent} // Correctly reference values.tuteur
                                                            onChange={(e) => handleRoleChange(e, 'tuteur')}
                                                            required
                                                        />
                                                    </div>
                                                    <div className="col-md-6">
                                                        <label htmlFor="situationFamiliale" className="form-label">Liens de parenté avec élève</label>
                                                        <input
                                                            name="liensparenter"
                                                            type="text"
                                                            className="form-control"
                                                            id="lienparante" value={values.tuteur.liensparenter} // Correctly reference values.tuteur
                                                            onChange={(e) => handleRoleChange(e, 'tuteur')}
                                                            required
                                                        />
                                                    </div>
                                                </div>

                                                <div className="row mt-3">
                                                    {/* Nombre d'enfants */}
                                                    <div className="col-md-4">
                                                        <label htmlFor="nmbrenfant" className="form-label">Nombre d'enfants</label>
                                                        <input
                                                            name="nombreenfant"
                                                            type="number"
                                                            className="form-control"
                                                            id="nmbrenfant"
                                                            value={values.tuteur.nombreenfant} // Correctly reference values.tuteur
                                                            onChange={(e) => handleRoleChange(e, 'tuteur')}
                                                            required
                                                        />
                                                    </div>

                                                    {/* Nom d'utilisateur et Mot de passe */}
                                                    <div className="col-md-4">
                                                        <label htmlFor="username_tuteur" className="form-label">Nom d'utilisateur</label>
                                                        <div className="input-group has-validation">
                                                            <span className="input-group-text" id="inputGroupPrepend">@</span>
                                                            <input
                                                                name="usernameparent"
                                                                type="text"
                                                                className="form-control"
                                                                id="username_tuteur"
                                                                value={values.tuteur.usernameparent} // Correctly reference values.tuteur
                                                                onChange={(e) => handleRoleChange(e, 'tuteur')}
                                                                aria-describedby="inputGroupPrepend"
                                                                required
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="col-md-4">
                                                        <label htmlFor="password_tuteur" className="form-label">Mot de passe</label>
                                                        <div className="input-group has-validation">
                                                            <input
                                                                name="paswwordparent"
                                                                type={showPassword ? "text" : "password"}
                                                                className="form-control"
                                                                id="password_tuteur"
                                                                value={values.tuteur.paswwordparent} // Correctly reference values.tuteur
                                                                onChange={(e) => handleRoleChange(e, 'tuteur')}
                                                                required
                                                            />
                                                            <span
                                                                className="input-group-text"
                                                                onClick={togglePasswordVisibility}
                                                                style={{ cursor: 'pointer' }}
                                                            >
                                                                {showPassword ? (
                                                                    <i className="fa fa-eye-slash" aria-hidden="true"></i> // Icone pour masquer
                                                                ) : (
                                                                    <i className="fa fa-eye" aria-hidden="true"></i> // Icone pour afficher
                                                                )}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                                {/* Ajoutez d'autres champs pour le tuteur ici */}
                                            </ParentSection>
                                        )}
                                        {values.orphelin === 'vivant' && (
                                            <>
                                                <ParentSection title="Informations Père">
                                                    <div className="row">
                                                        <div className="col-md-4">
                                                            <label htmlFor="nom_pere" className="form-label">Nom</label>
                                                            <input
                                                                name="nomparent"
                                                                type="text"
                                                                className="form-control"
                                                                id="nom_pere"
                                                                value={values.pere.nomparent}
                                                                onChange={(e) => handleRoleChange(e, 'pere')}
                                                                required
                                                            />
                                                        </div>
                                                        <div className="col-md-4">
                                                            <label htmlFor="prenom_pere" className="form-label">Prénom</label>
                                                            <input
                                                                name="prenomparent"
                                                                type="text"
                                                                className="form-control"
                                                                id="prenom_pere"
                                                                value={values.pere.prenomparent}
                                                                onChange={(e) => handleRoleChange(e, 'pere')}
                                                                required
                                                            />
                                                        </div>
                                                        <div className="col-md-4">
                                                            <label htmlFor="datenaiss_pere" className="form-label">Date de naissance</label>
                                                            <input
                                                                name="datenaissparent"
                                                                type="date"
                                                                className="form-control"
                                                                id="datenaiss_pere"
                                                                value={values.pere.datenaissparent ? values.pere.datenaissparent.split('T')[0] : ''}
                                                                onChange={(e) => handleRoleChange(e, 'pere')}
                                                                required
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="row mt-3">
                                                        {/* Nom et Prénom en arabe */}
                                                        <div className="col-md-4">
                                                            <label htmlFor="nom_ar" className="form-label">Nom en arabe</label>
                                                            <input
                                                                name="nom_arparent"
                                                                type="text"
                                                                className="form-control"
                                                                id="nom_ar"
                                                                value={values.pere.nom_arparent} // Correctly reference values.pere
                                                                onChange={(e) => handleRoleChange(e, 'pere')}
                                                                required
                                                            />
                                                        </div>
                                                        <div className="col-md-4">
                                                            <label htmlFor="prenom_ar" className="form-label">Prénom en arabe</label>
                                                            <input
                                                                name="prenom_arparent"
                                                                type="text"
                                                                className="form-control"
                                                                id="prenom_ar"
                                                                value={values.pere.prenom_arparent} // Correctly reference values.pere
                                                                onChange={(e) => handleRoleChange(e, 'pere')}
                                                                required
                                                            />
                                                        </div>
                                                        <div className="col-md-4">
                                                            <label htmlFor="nationalite" className="form-label">Nationalité</label>
                                                            <Select
                                                                value={selectedOption}
                                                                onClick={handleSelectChange}
                                                                onChange={(e) => handleRoleChange(e, 'pere')}
                                                                options={nationalites}
                                                                styles={customStyles}
                                                                placeholder="Sélectionnez une nationalité"
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="row mt-3">
                                                        {/* Adresse en français et arabe */}
                                                        <div className="col-md-6">
                                                            <label htmlFor="adresse" className="form-label">Lieux de naissance</label>
                                                            <input
                                                                name="lieuxnaissparent"
                                                                type="text"
                                                                className="form-control"
                                                                id="adresse"
                                                                value={values.pere.lieuxnaissparent} // Correctly reference values.pere
                                                                onChange={(e) => handleRoleChange(e, 'pere')}
                                                                required
                                                            />
                                                        </div>
                                                        <div className="col-md-6">
                                                            <label htmlFor="adresse_ar" className="form-label">Lieux de naissance en arabe</label>
                                                            <input
                                                                name="lieuxnaiss_arparent"
                                                                type="text"
                                                                className="form-control"
                                                                id="adresse_ar"
                                                                value={values.pere.lieuxnaiss_arparent} // Correctly reference values.pere
                                                                onChange={(e) => handleRoleChange(e, 'pere')}
                                                                required
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className='row'>
                                                        <div className="col-md-6">
                                                            <label>Adresse</label>
                                                            <input
                                                                type="text"
                                                                name='adresseparent' // Correspond à values.lieux
                                                                className="form-control"
                                                                value={values.adresseparent}
                                                                onChange={(e) => handleChange(e, 'pere')} // Appel de handleChange
                                                            />
                                                        </div>
                                                        <div className="col-md-6">
                                                            <label>Adresse en arabe</label>
                                                            <input
                                                                type="text"
                                                                name='adresse_arparent' // Correspond à values.lieux_arabe
                                                                className="form-control"
                                                                value={values.adresse_arparent}
                                                                onChange={(e) => handleChange(e, 'pere')} // Appel de handleChange
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="row mt-3">
                                                        {/* Téléphone et Email */}
                                                        <div className="col-md-6">
                                                            <label htmlFor="tel" className="form-label">Téléphone</label>
                                                            <input
                                                                name="telephoneparent"
                                                                type="text"
                                                                className="form-control"
                                                                id="tel"
                                                                value={values.pere.telephoneparent} // Correctly reference values.pere
                                                                onChange={(e) => handleRoleChange(e, 'pere')}
                                                                required
                                                            />
                                                        </div>
                                                        <div className="col-md-6">
                                                            <label htmlFor="email" className="form-label">Email</label>
                                                            <input
                                                                name="emailparent"
                                                                type="email"
                                                                className="form-control"
                                                                id="email"
                                                                value={values.pere.emailparent} // Correctly reference values.pere
                                                                onChange={(e) => handleRoleChange(e, 'pere')}
                                                                required
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="row mt-3">
                                                        {/* Travail et Situation familiale */}
                                                        <div className="col-md-6">
                                                            <label htmlFor="travail" className="form-label">Profession de père</label>
                                                            <input
                                                                name="travailleparent"
                                                                type="text"
                                                                className="form-control"
                                                                id="travail"
                                                                value={values.pere.travailleparent} // Correctly reference values.pere
                                                                onChange={(e) => handleRoleChange(e, 'pere')}
                                                                required
                                                            />
                                                        </div>
                                                        <div className="col-md-6">
                                                            <label htmlFor="situationFamiliale" className="form-label">Situation familiale</label>
                                                            <select
                                                                name="situation_familiale"
                                                                className="form-control"
                                                                id="situationFamiliale"
                                                                value={values.pere.situation_familiale} // Correctly reference values.pere
                                                                onChange={(e) => handleRoleChange(e, 'pere')}
                                                                required
                                                            >
                                                                <option value="">Situation Familiale</option>
                                                                <option value="Marié">Marié</option>
                                                                <option value="Divorcé">Divorcé</option>
                                                                <option value="Célibataire">Célibataire</option>
                                                                <option value="Veuve">Veuve</option>
                                                            </select>
                                                        </div>
                                                    </div>

                                                    <div className="row mt-3">
                                                        {/* Nombre d'enfants */}
                                                        <div className="col-md-4">
                                                            <label htmlFor="nmbrenfant" className="form-label">Nombre d'enfants</label>
                                                            <input
                                                                name="nombreenfant"
                                                                type="number"
                                                                className="form-control"
                                                                id="nmbrenfant"
                                                                value={values.pere.nombreenfant} // Correctly reference values.pere
                                                                onChange={(e) => handleRoleChange(e, 'pere')}
                                                                required
                                                            />
                                                        </div>

                                                        {/* Nom d'utilisateur et Mot de passe */}
                                                        <div className="col-md-4">
                                                            <label htmlFor="username_pere" className="form-label">Nom d'utilisateur</label>
                                                            <div className="input-group has-validation">
                                                                <span className="input-group-text" id="inputGroupPrepend">@</span>
                                                                <input
                                                                    name="usernameparent"
                                                                    type="text"
                                                                    className="form-control"
                                                                    id="username_pere"
                                                                    value={values.pere.usernameparent} // Correctly reference values.pere
                                                                    onChange={(e) => handleRoleChange(e, 'pere')}
                                                                    required
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="col-md-4">
                                                            <label htmlFor="password_pere" className="form-label">Mot de passe</label>
                                                            <div className="input-group">
                                                                <input
                                                                    name="paswwordparent"
                                                                    type={showPassword ? "text" : "password"} // Change le type du champ selon l'état
                                                                    className="form-control"
                                                                    id="password_pere"
                                                                    value={values.pere.paswwordparent} // Correctly reference values.pere
                                                                    onChange={(e) => handleRoleChange(e, 'pere')}
                                                                    required
                                                                />
                                                                <span
                                                                    className="input-group-text"
                                                                    onClick={togglePasswordVisibility}
                                                                    style={{ cursor: 'pointer' }}
                                                                >
                                                                    {showPassword ? (
                                                                        <i className="fa fa-eye-slash" aria-hidden="true"></i> // Icone pour masquer
                                                                    ) : (
                                                                        <i className="fa fa-eye" aria-hidden="true"></i> // Icone pour afficher
                                                                    )}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </ParentSection>
                                                <ParentSection title="Informations Mère">
                                                    <div className="row">
                                                        <div className="col-md-4">
                                                            <label htmlFor="nom_mere" className="form-label">Nom</label>
                                                            <input
                                                                name="nomparent"
                                                                type="text"
                                                                className="form-control"
                                                                id="nom_mere"
                                                                value={values.mere.nomparent} // Correctly reference values.mere
                                                                onChange={(e) => handleRoleChange(e, 'mere')}
                                                                required
                                                            />
                                                        </div>
                                                        <div className="col-md-4">
                                                            <label htmlFor="prenom_mere" className="form-label">Prénom</label>
                                                            <input
                                                                name="prenomparent"
                                                                type="text"
                                                                className="form-control"
                                                                id="prenom_mere"
                                                                value={values.mere.prenomparent} // Correctly reference values.mere
                                                                onChange={(e) => handleRoleChange(e, 'mere')}
                                                                required
                                                            />
                                                        </div>
                                                        <div className="col-md-4">
                                                            <label htmlFor="datenaiss_mere" className="form-label">Date de naissance</label>
                                                            <input
                                                                name="datenaissparent"
                                                                type="date"
                                                                className="form-control"
                                                                id="datenaiss_mere"
                                                                value={values.mere.datenaissparent ? values.mere.datenaissparent.split('T')[0] : ''} // Correctly reference values.mere
                                                                onChange={(e) => handleRoleChange(e, 'mere')}
                                                                required
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="row mt-3">
                                                        {/* Nom et Prénom en arabe */}
                                                        <div className="col-md-4">
                                                            <label htmlFor="nom_ar" className="form-label">Nom en arabe</label>
                                                            <input
                                                                name="nom_arparent"
                                                                type="text"
                                                                className="form-control"
                                                                id="nom_ar"
                                                                value={values.mere.nom_arparent} // Correctly reference values.mere
                                                                onChange={(e) => handleRoleChange(e, 'mere')}
                                                                required
                                                            />
                                                        </div>
                                                        <div className="col-md-4">
                                                            <label htmlFor="prenom_ar" className="form-label">Prénom en arabe</label>
                                                            <input
                                                                name="prenom_arparent"
                                                                type="text"
                                                                className="form-control"
                                                                id="prenom_ar"
                                                                value={values.mere.prenom_arparent} // Correctly reference values.mere
                                                                onChange={(e) => handleRoleChange(e, 'mere')}
                                                                required
                                                            />
                                                        </div>
                                                        <div className="col-md-4">
                                                            <label htmlFor="nationalite" className="form-label">Nationalité</label>
                                                            <Select
                                                                value={selectedOption}
                                                                onClick={handleSelectChange}
                                                                onChange={(e) => handleRoleChange(e, 'mere')}
                                                                options={nationalites}
                                                                styles={customStyles}
                                                                placeholder="Sélectionnez une nationalité"
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="row mt-3">
                                                        {/* Adresse en français et arabe */}
                                                        <div className="col-md-6">
                                                            <label htmlFor="adresse" className="form-label">Lieux de naissance</label>
                                                            <input
                                                                name="lieuxnaissparent"
                                                                type="text"
                                                                className="form-control"
                                                                id="adresse"
                                                                value={values.mere.lieuxnaissparent} // Correctly reference values.mere
                                                                onChange={(e) => handleRoleChange(e, 'mere')}
                                                                required
                                                            />
                                                        </div>
                                                        <div className="col-md-6">
                                                            <label htmlFor="adresse_ar" className="form-label">Lieux de naissance en arabe</label>
                                                            <input
                                                                name="lieuxnaiss_arparent"
                                                                type="text"
                                                                className="form-control"
                                                                id="adresse_ar"
                                                                value={values.mere.lieuxnaiss_arparent} // Correctly reference values.mere
                                                                onChange={(e) => handleRoleChange(e, 'mere')}
                                                                required
                                                            />
                                                        </div>
                                                        <input type="hidden" name="typerole" value="Mère" />
                                                    </div>
                                                    <div className='row'>
                                                        <div className="col-md-6">
                                                            <label>Adresse</label>
                                                            <input
                                                                type="text"
                                                                name='adresseparent' // Correspond à values.lieux
                                                                className="form-control"
                                                                value={values.adresseparent}
                                                                onChange={(e) => handleChange(e, 'mere')} // Appel de handleChange
                                                            />
                                                        </div>
                                                        <div className="col-md-6">
                                                            <label>Adresse en arabe</label>
                                                            <input
                                                                type="text"
                                                                name='adresse_arparent' // Correspond à values.lieux_arabe
                                                                className="form-control"
                                                                value={values.adresse_arparent}
                                                                onChange={(e) => handleChange(e, 'mere')} // Appel de handleChange
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="row mt-3">
                                                        {/* Téléphone et Email */}
                                                        <div className="col-md-6">
                                                            <label htmlFor="tel" className="form-label">Téléphone</label>
                                                            <input
                                                                name="telephoneparent"
                                                                type="text"
                                                                className="form-control"
                                                                id="tel"
                                                                value={values.mere.telephoneparent} // Correctly reference values.mere
                                                                onChange={(e) => handleRoleChange(e, 'mere')}
                                                                required
                                                            />
                                                        </div>
                                                        <div className="col-md-6">
                                                            <label htmlFor="email" className="form-label">Email</label>
                                                            <input
                                                                name="emailparent"
                                                                type="email"
                                                                className="form-control"
                                                                id="email"
                                                                value={values.mere.emailparent} // Correctly reference values.m ere
                                                                onChange={(e) => handleRoleChange(e, 'mere')}
                                                                required
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="row mt-3">
                                                        {/* Travail et Situation familiale */}
                                                        <div className="col-md-6">
                                                            <label htmlFor="travail" className="form-label">Profession de mère</label>
                                                            <input
                                                                name="travailleparent"
                                                                type="text"
                                                                className="form-control"
                                                                id="travail"
                                                                value={values.mere.travailleparent} // Correctly reference values.mere
                                                                onChange={(e) => handleRoleChange(e, 'mere')}
                                                                required
                                                            />
                                                        </div>
                                                        <div className="col-md-6">
                                                            <label htmlFor="situationFamiliale" className="form-label">Situation familiale</label>
                                                            <select
                                                                name="situation_familiale"
                                                                className="form-control"
                                                                id="situationFamiliale"
                                                                value={values.mere.situation_familiale} // Correctly reference values.mere
                                                                onChange={(e) => handleRoleChange(e, 'mere')}
                                                                required
                                                            >
                                                                <option value="">Situation Familiale</option>
                                                                <option value="Marié">Marié</option>
                                                                <option value="Divorcé">Divorcé</option>
                                                                <option value="veuve">Veuve</option>
                                                            </select>
                                                        </div>
                                                    </div>

                                                    <div className="row mt-3">
                                                        {/* Nombre d'enfants */}
                                                        <div className="col-md-4">
                                                            <label htmlFor="nmbrenfant" className="form-label">Nombre d'enfants</label>
                                                            <input
                                                                name="nombreenfant"
                                                                type="number"
                                                                className="form-control"
                                                                id="nmbrenfant"
                                                                value={values.mere.nombreenfant} // Correctly reference values.mere
                                                                onChange={(e) => handleRoleChange(e, 'mere')}
                                                                required
                                                            />
                                                        </div>

                                                        {/* Nom d'utilisateur et Mot de passe */}
                                                        <div className="col-md-4">
                                                            <label htmlFor="username_mere" className="form-label">Nom d'utilisateur</label>
                                                            <div className="input-group has-validation">
                                                                <span className="input-group-text" id="inputGroupPrepend">@</span>
                                                                <input
                                                                    name="usernameparent"
                                                                    type="text"
                                                                    className="form-control"
                                                                    id="username_mere"
                                                                    value={values.mere.usernameparent} // Correctly reference values.mere
                                                                    onChange={(e) => handleRoleChange(e, 'mere')}
                                                                    aria-describedby="inputGroupPrepend"
                                                                    required
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="col-md-4">
                                                            <label htmlFor="password_mere" className="form-label">Mot de passe</label>
                                                            <div className="input-group has-validation">
                                                                <input
                                                                    name="paswwordparent"
                                                                    type={showPassword ? "text" : "password"}
                                                                    className="form-control"
                                                                    id="password_mere"
                                                                    value={values.mere.paswwordparent} // Correctly reference values.mere
                                                                    onChange={(e) => handleRoleChange(e, 'mere')}
                                                                    required
                                                                />
                                                                <span
                                                                    className="input-group-text"
                                                                    onClick={togglePasswordVisibility}
                                                                    style={{ cursor: 'pointer' }}
                                                                >
                                                                    {showPassword ? (
                                                                        <i className="fa fa-eye-slash" aria-hidden="true"></i> // Icone pour masquer
                                                                    ) : (
                                                                        <i className="fa fa-eye" aria-hidden="true"></i> // Icone pour afficher
                                                                    )}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    {/* Ajoutez d'autres champs pour la mère ici */}
                                                </ParentSection>
                                            </>
                                        )}

                                    </div>
                                    <button
                                        type="button"
                                        className="btn btn-secondary mt-3 me-2"
                                        onClick={prevStep}
                                    >
                                        Précédent
                                    </button>
                                    <button
                                        type="button"
                                        className="btn btn-primary mt-3"
                                        onClick={nextStep}
                                    >
                                        Suivant
                                    </button>
                                    {/* <button className="btn btn-secondary mt-3 me-2" onClick={prevStep}>Précédent</button>
                                    <button className="btn btn-primary mt-3" onClick={nextStep}>Suivant</button> */}
                                </>
                            )}

                            {step === 3 && (
                                <>
                                    <div className='card-body'>
                                        <div className='row'>
                                            <div className="col-md-4">
                                                <label htmlFor="antecedents" className="form-label">Votre enfant a-t-il des antécédents de santé ?</label>
                                                <div>
                                                    <input
                                                        type="radio"
                                                        name="antecedents"
                                                        value="Oui"
                                                        checked={values.antecedents === "Oui"}
                                                        onChange={handleChange}
                                                        required
                                                    />
                                                    <label style={{ marginLeft: '5px' }}>Oui</label>
                                                    <input
                                                        type="radio"
                                                        name="antecedents"
                                                        value="Non"
                                                        checked={values.antecedents === "Non"}
                                                        onChange={handleChange}
                                                        required
                                                    />
                                                    <label style={{ marginLeft: '5px' }}>Non</label>
                                                </div>
                                                {values.antecedents === "Oui" && (
                                                    <input
                                                        name='antecedentsDetails'
                                                        type="text"
                                                        className="form-control mt-2"
                                                        placeholder="Détails des antécédents"
                                                        value={values.antecedentsDetails}
                                                        onChange={handleChange}
                                                    />
                                                )}
                                            </div>
                                            <div className="col-md-4">
                                                <label htmlFor="suiviMedical" className="form-label">Est-il (elle) actuellement suivi médicalement ?</label>
                                                <div>
                                                    <input
                                                        type="radio"
                                                        name="suiviMedical"
                                                        value="Oui"
                                                        checked={values.suiviMedical === "Oui"}
                                                        onChange={handleChange}
                                                        required
                                                    />
                                                    <label style={{ marginLeft: '5px' }}>Oui</label>
                                                    <input
                                                        type="radio"
                                                        name="suiviMedical"
                                                        value="Non"
                                                        checked={values.suiviMedical === "Non"}
                                                        onChange={handleChange}
                                                        required
                                                    />
                                                    <label style={{ marginLeft: '5px' }}>Non</label>
                                                </div>
                                                {values.suiviMedical === "Oui" && (
                                                    <input
                                                        name='suiviMedicalDetails'
                                                        type="text"
                                                        className="form-control mt-2"
                                                        placeholder="Détails du suivi médical"
                                                        value={values.suiviMedicalDetails}
                                                        onChange={handleChange}
                                                    />
                                                )}
                                            </div>
                                            <div className="col-md-4">
                                                <label htmlFor="natureTraitement" className="form-label">Quelle est la nature du traitement suivi ?</label>
                                                <div>
                                                    <input
                                                        type="radio"
                                                        name="natureTraitement"
                                                        value="Oui"
                                                        checked={values.natureTraitement === "Oui"}
                                                        onChange={handleChange}
                                                        required
                                                    />
                                                    <label style={{ marginLeft: '5px' }}>Oui</label>
                                                    <input
                                                        type="radio"
                                                        name="natureTraitement"
                                                        value="Non"
                                                        checked={values.natureTraitement === "Non"}
                                                        onChange={handleChange}
                                                        required
                                                    />
                                                    <label style={{ marginLeft: '5px' }}>Non</label>
                                                </div>
                                                {values.natureTraitement === "Oui" && (
                                                    <input
                                                        name='natureTraitementDetails'
                                                        type="text"
                                                        className="form-control mt-2"
                                                        placeholder="Détails du traitement"
                                                        value={values.natureTraitementDetails}
                                                        onChange={handleChange}
                                                    />
                                                )}
                                            </div>
                                        </div>

                                        <div className='row'>
                                            <div className="col-md-4">
                                                <label htmlFor="crises" className="form-label">Est-il (elle) sujet à des crises ?</label>
                                                <div>
                                                    <input
                                                        type="radio"
                                                        name="crises"
                                                        value="Oui"
                                                        checked={values.crises === "Oui"}
                                                        onChange={handleChange}
                                                        required
                                                    />
                                                    <label style={{ marginLeft: '5px' }}>Oui</label>
                                                    <input
                                                        type="radio"
                                                        name="crises"
                                                        value="Non"
                                                        checked={values.crises === "Non"}
                                                        onChange={handleChange}
                                                        required
                                                    />
                                                    <label style={{ marginLeft: '5px' }}>Non</label>
                                                </div>
                                                {values.crises === "Oui" && (
                                                    <input
                                                        name='crisesDetails'
                                                        type="text"
                                                        className="form-control mt-2"
                                                        placeholder="Détails des crises"
                                                        value={values.crisesDetails}
                                                        onChange={handleChange}
                                                    />
                                                )}
                                            </div>
                                            <div className="col-md-4">
                                                <label htmlFor="conduiteTenir" className="form-label">Quelle est la conduite à tenir dans ce cas ?</label>
                                                <div>
                                                    <input
                                                        type="radio"
                                                        name="conduiteTenir"
                                                        value="Oui"
                                                        checked={values.conduiteTenir === "Oui"}
                                                        onChange={handleChange}
                                                        required
                                                    />
                                                    <label style={{ marginLeft: '5px' }}>Oui</label>
                                                    <input
                                                        type="radio"
                                                        name="conduiteTenir"
                                                        value="Non"
                                                        checked={values.conduiteTenir === "Non"}
                                                        onChange={handleChange}
                                                        required
                                                    />
                                                    <label style={{ marginLeft: '5px' }}>Non</label>
                                                </div>
                                                {values.conduiteTenir === "Oui" && (
                                                    <input
                                                        name='conduiteTenirDetails'
                                                        type="text"
                                                        className="form-control mt-2"
                                                        placeholder="Détails de la conduite à tenir"
                                                        value={values.conduiteTenirDetails}
                                                        onChange={handleChange}
                                                    />
                                                )}
                                            </div>
                                            <div className="col-md-4">
                                                <label htmlFor="operationChirurgicale" className="form-label">A-t-il (elle) subi une opération chirurgicale ?</label>
                                                <div>
                                                    <input
                                                        type="radio"
                                                        id="operationChirurgicaleOui"
                                                        name="operationChirurgicale"
                                                        value="Oui"
                                                        checked={values.operationChirurgicale === "Oui"}
                                                        onChange={handleChange}
                                                        required
                                                    />
                                                    <label htmlFor="operationChirurgicaleOui" style={{ marginLeft: '5px', marginRight: '10px' }}>Oui</label>
                                                    <input
                                                        type="radio"
                                                        id="operationChirurgicaleNon"
                                                        name="operationChirurgicale"
                                                        value="Non"
                                                        checked={values.operationChirurgicale === "Non"}
                                                        onChange={handleChange}
                                                        required
                                                    />
                                                    <label htmlFor="operationChirurgicaleNon" style={{ marginLeft: '5px' }}>Non</label>
                                                </div>
                                                {values.operationChirurgicale === "Oui" && (
                                                    <input
                                                        name="operationChirurgicaleDetails"
                                                        type="text"
                                                        className="form-control mt-2"
                                                        placeholder="Détails de l'opération"
                                                        value={values.operationChirurgicaleDetails || ''}
                                                        onChange={handleChange}
                                                    />
                                                )}
                                            </div>
                                        </div>

                                        <div className='row'>
                                            <div className="col-md-4">
                                                <label htmlFor="maladie" className="form-label">Maladie chronique</label>
                                                <div>
                                                    <input
                                                        type="radio"
                                                        name="maladieChronique"
                                                        value="Oui"
                                                        checked={values.maladieChronique === "Oui"}
                                                        onChange={handleChange}
                                                        required
                                                    />
                                                    <label style={{ marginLeft: '5px' }}>Oui</label>
                                                    <input
                                                        type="radio"
                                                        name="maladieChronique"
                                                        value="Non"
                                                        checked={values.maladieChronique === "Non"}
                                                        onChange={handleChange}
                                                        required
                                                    />
                                                    <label style={{ marginLeft: '5px' }}>Non</label>
                                                </div>
                                                {values.maladieChronique === "Oui" && (
                                                    <input
                                                        name='maladieChroniqueDetails'
                                                        type="text"
                                                        className="form-control mt-2"
                                                        placeholder="Détails de la maladie"
                                                        value={values.maladieChroniqueDetails}
                                                        onChange={handleChange}
                                                    />
                                                )}
                                            </div>
                                            <div className="col-md-4">
                                                <label htmlFor="groupeSanguin" className="form-label">Groupe sanguin</label>
                                                <select name="groupeSanguin" id="groupeSanguin" className="form-control" value={values.groupeSanguin} onChange={handleChange} required>
                                                    <option value="">Sélectionnez un groupe sanguin</option>
                                                    <option value="A+">A+</option>
                                                    <option value="A-">A-</option>
                                                    <option value="B+">B+</option>
                                                    <option value="B-">B-</option>
                                                    <option value="AB+">AB+</option>
                                                    <option value="AB-">AB-</option>
                                                    <option value="O+">O+</option>
                                                    <option value="O-">O-</option>
                                                </select>
                                            </div>
                                        </div>

                                    </div>
                                    <button
                                        type="button"
                                        className="btn btn-secondary mt-3 me-2"
                                        onClick={prevStep}
                                    >
                                        Précédent
                                    </button>

                                    <button
                                        type="button"
                                        className="btn btn-primary mt-3"
                                        onClick={nextStep}
                                    >
                                        Suivant
                                    </button>
                                </>
                            )}

                            {step === 4 && (
                                <>
                                    <div className='card-body'>
                                        <div className='row'>
                                            <div className='col-md-4'>
                                                <label htmlFor="dateInscription" className="form-label">Date d'inscription</label>
                                                <input
                                                    name='dateInscription' // Updated to match the model
                                                    type="date"
                                                    className="form-control"
                                                    value={values.dateInscription ? values.dateInscription.split('T')[0] : ''}// Updated to match the model
                                                    onChange={handleChange}
                                                    required
                                                />
                                            </div>
                                            <div className='col-md-4'>
                                                <label className="form-label">Est-il déjà scolarisé dans une autre école?</label> <br />
                                                <input
                                                    name='autreecole' // Updated to match the model
                                                    type="radio"
                                                    value="Oui" // Updated to match the model
                                                    checked={values.autreecole === 'Oui'}
                                                    onChange={handleChange}
                                                    style={{ marginLeft: '5px' }}
                                                    required
                                                />
                                                <label style={{ marginLeft: '5px' }}> Oui</label>
                                                <input
                                                    name='autreecole' // Updated to match the model
                                                    type="radio"
                                                    value="Non" // Updated to match the model
                                                    checked={values.autreecole === 'Non'}
                                                    onChange={handleChange}
                                                    style={{ marginLeft: '5px' }}
                                                    required
                                                />
                                                <label style={{ marginLeft: '5px' }}> Non</label>
                                            </div>
                                            {values.autreecole === 'Oui' && ( // Conditional rendering
                                                <div className='col-md-4'>
                                                    <label htmlFor="nomecole" className="form-label">Nom de l'école</label>
                                                    <input
                                                        name='nomecole' // Updated to match the model
                                                        type="text"
                                                        className="form-control"
                                                        value={values.nomecole} // Updated to match the model
                                                        onChange={handleChange}
                                                        required
                                                    />
                                                </div>
                                            )}
                                        </div>
                                        <div className="row">
                                            <div className="col-md-4">
                                                <label className="form-label">Est-il déjà redoublant?</label> <br />
                                                <input
                                                    name="redoublant" // Updated to match the model
                                                    type="radio"
                                                    value="Oui" // Updated to match the model
                                                    checked={values.redoublant === "Oui"}
                                                    onChange={handleChange}
                                                    style={{ marginLeft: "5px" }}
                                                    required
                                                />
                                                <label style={{ marginLeft: "5px" }}> Oui</label>
                                                <input
                                                    name="redoublant" // Updated to match the model
                                                    type="radio"
                                                    value="Non" // Updated to match the model
                                                    checked={values.redoublant === "Non"}
                                                    onChange={handleChange}
                                                    style={{ marginLeft: "5px" }}
                                                    required
                                                />
                                                <label style={{ marginLeft: "5px" }}> Non</label>
                                            </div>

                                            {/* Affichage conditionnel du champ "Niveau redoublé" */}
                                            {values.redoublant === "Oui" && (
                                                <div className="col-md-4">
                                                    <label htmlFor="niveauredoublant" className="form-label">Niveau redoublé</label>
                                                    <input
                                                        type="text"
                                                        name="niveauredoublant" // Updated to match the model
                                                        value={values.niveauredoublant || ""}
                                                        onChange={handleChange}
                                                        className="form-control"
                                                        required
                                                    />
                                                </div>
                                            )}

                                            <div className="col-md-4">
                                                <label htmlFor="niveaueleve" className="form-label">Son Niveau est-il:</label>
                                                <select
                                                    name="niveaueleve" // Updated to match the model
                                                    value={values.niveaueleve || ""}
                                                    onChange={handleChange}
                                                    className="form-control"
                                                    required
                                                >
                                                    <option value="">Veuillez choisir son niveau</option>
                                                    <option value="excellent">Excellent</option>
                                                    <option value="moyenne">Moyenne</option>
                                                    <option value="faible">Faible</option>
                                                    <option value="redoublant">Redoublant</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className='row'>
                                            <div className='col-md-6'>
                                                <label htmlFor="niveauId" className="form-label">Niveaux</label>
                                                <select
                                                    name="niveauId" // Updated to match the model
                                                    className="form-control"
                                                    value={values.niveauId}
                                                    onChange={handleChange}
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

                                            <div className='col-md-6'>
                                                <label htmlFor="cycleId" className="form-label">Cycle Scolaire</label>
                                                <select
                                                    className="form-control"
                                                    name="cycle"
                                                    value={values.cycle}
                                                    onChange={handleChange}
                                                    style={{ height: '50px', borderRadius: '8px', backgroundColor: '#F8F8F8' }}
                                                    required
                                                >
                                                    <option value="">Sélectionner un cycle</option>
                                                    {cycles.map((cycleItem) => (
                                                        <option key={cycleItem.id} value={cycleItem.nomCycle}>
                                                            {cycleItem.nomCycle}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div> <br />
                                        <div className='row'>
                                            <div className="col-md-6 form-group ml-0" style={{ minWidth: '150px' }}>
                                                <select
                                                    className="form-control input"
                                                    style={{ height: '40px' }}
                                                    value={values.annescolaireId}
                                                    onChange={handleChange}
                                                    name="annescolaireId"
                                                    required // Ajoutez cet attribut
                                                >
                                                    <option value="">Année scolaire</option>
                                                    {annees.map((annee) => {
                                                        // Si l'API renvoie 'id_annee' au lieu de 'id'
                                                        const debut = new Date(annee.datedebut).getFullYear();
                                                        const fin = new Date(annee.datefin).getFullYear();
                                                        return (
                                                            <option key={annee.id} value={annee.id}>
                                                                {debut} - {fin}
                                                            </option>
                                                        );
                                                    })}
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        className="btn btn-secondary mt-3 me-2"
                                        onClick={prevStep}
                                    >
                                        Précédent
                                    </button>

                                    <button
                                        type="button"
                                        className="btn btn-primary mt-3"
                                        onClick={nextStep}
                                    >
                                        Suivant
                                    </button>
                                </>
                            )}

                            {step === 5 && (
                                <>
                                    <div className='card-body'>
                                        <div className="row">
                                            {/* Nom d'utilisateur */}
                                            <div className="col-md-6">
                                                <label htmlFor="username" className="form-label">Nom d'utilisateur</label>
                                                <div className="input-group has-validation">
                                                    <span className="input-group-text" id="inputGroupPrepend">@</span>
                                                    <input
                                                        name="username" // Updated to match the model
                                                        type="text"
                                                        className="form-control"
                                                        id="username"
                                                        value={values.username} // Updated to match the model
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
                                                        name="password" // Updated to match the model
                                                        type={showPassword ? "text" : "password"}
                                                        className="form-control"
                                                        id="password"
                                                        value={values.password} // Updated to match the model
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
                                        <div className='row'>
                                            <div className="col-md-6">
                                                <label htmlFor="numinscription" className="form-label">Numéro d'inscription</label>
                                                <div className="input-group has-validation">
                                                    <input
                                                        name="numinscription"
                                                        type="text"
                                                        className="form-control"
                                                        value={values.numinscription}
                                                        onChange={handleChange}
                                                        required
                                                        readOnly // Empêche la modification manuelle
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <label htmlFor="numidentnational" className="form-label">Numéro d'identification national de l'enfant</label>
                                                <div className="input-group has-validation">
                                                    <input
                                                        name='numidentnational' // Updated to match the model
                                                        type="text"
                                                        className="form-control"
                                                        value={values.numidentnational} // Updated to match the model
                                                        onChange={handleChange}
                                                        required
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className='row'>
                                            <div className="col-md-6">
                                                <label htmlFor="datedinscriptionEncour" className="form-label">Date d'inscription de l'année en cours</label>
                                                <div className="input-group has-validation">
                                                    <input
                                                        name='datedinscriptionEncour' // Updated to match the model
                                                        type="date"
                                                        className="form-control"
                                                        value={values.datedinscriptionEncour ? values.datedinscriptionEncour.split('T')[0] : ''}// Updated to match the model
                                                        onChange={handleChange}
                                                        required
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <label htmlFor="fraixinscription" className="form-label">Frais d'inscription</label>
                                                <div className="input-group has-validation">
                                                    <input
                                                        name='fraixinscription' // Updated to match the model
                                                        type="text"
                                                        className="form-control"
                                                        value={values.fraixinscription} // Updated to match the model
                                                        onChange={handleChange}
                                                        required
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className='row'>
                                            {/* Champ de téléchargement */}
                                            <div className="col-md-6">
                                                <label htmlFor="photo" className="form-label">Photo</label>
                                                <div className="input-group has-validation">
                                                    <input
                                                        name='photo'
                                                        type="file"
                                                        className="form-control"
                                                        accept="image/*"
                                                        onChange={handleFileChange}  // Utilisez handleFileChange au lieu de setValues directement
                                                        required={!isEditing}  // Rendre obligatoire seulement pour la création
                                                    />
                                                </div>
                                            </div>

                                            {/* Aperçu de l'image en cercle */}
                                            <div className="col-md-6 d-flex align-items-center justify-content-center">
                                                <div
                                                    style={{
                                                        width: "120px",
                                                        height: "120px",
                                                        borderRadius: "50%",
                                                        overflow: "hidden",
                                                        border: "2px solid #ccc",
                                                        display: "flex",
                                                        alignItems: "center",
                                                        justifyContent: "center",
                                                        backgroundColor: "#f0f0f0",
                                                    }}
                                                >
                                                    {preview || values.photo ? (
                                                        <img
                                                            src={preview || values.photo}
                                                            alt="Aperçu"
                                                            style={{
                                                                width: "100%",
                                                                height: "100%",
                                                                objectFit: "cover"
                                                            }}
                                                        />
                                                    ) : (
                                                        <span style={{ color: "#888" }}>Aucune image</span>
                                                    )}
                                                </div>


                                            </div>
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        className="btn btn-secondary mt-3 me-2"
                                        onClick={prevStep}
                                    >
                                        Précédent
                                    </button>
                                    <button type="submit" className="btn btn-success mt-3">
                                        {isEditing ? "Modifier" : "Ajouter"}
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </form >
            </div >
            <Modal show={showProfileModal} onHide={handleCloseProfileModal} size="lg">
                <Modal.Header closeButton>
                    <Button variant="transparent" onClick={() => window.print()}>
                        <img src={printer} alt="" width={30} />
                    </Button>
                    <Modal.Title>Profil de l'élève</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {profileInfo ? (
                        <div>
                            {/* Informations de l'élève avec photo */}
                            <div className="card mb-4">
                                <div className="card-header d-flex align-items-center">
                                    <img src={etudiant} alt="" width={30} />
                                    <h5 className="mb-0 ml-2">Informations de l'élève</h5>
                                </div>
                                <div className="card-body">
                                    <div className="row d-flex align-items-center">
                                        {/* Informations texte */}
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
                                        {/* Photo */}
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

                            {/* Informations des parents */}
                            <div className="card">
                                <div className="card-header d-flex align-items-center">
                                    <img src={familyIcon} alt="" width={30} />
                                    <h5 className="mb-0 ml-2">Information parent</h5>
                                </div>
                                <div className="card-body">
                                    <div className="row">
                                        {/* Père */}
                                        {/* Informations de la mère */}
                                        {/* Père */}
                                        {profileInfo.Parents && profileInfo.Parents[0] && (
                                            <div className="col-md-12 mb-4 parent-card">
                                                <div className="card">
                                                    <div className="card-header">
                                                        <h6>Informations du père</h6>
                                                    </div>
                                                    <div className="card-body">
                                                        <div className="row d-flex align-items-center">
                                                            {/* Informations */}
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
                                                            {/* Signature */}
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

                                        {/* Mère */}
                                        {profileInfo.Parents && profileInfo.Parents[1] && (
                                            <div className="col-md-12 mb-4 parent-card">
                                                <div className="card">
                                                    <div className="card-header">
                                                        <h6>Informations de la mère</h6>
                                                    </div>
                                                    <div className="card-body">
                                                        <div className="row d-flex align-items-center">
                                                            {/* Informations */}
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
                                                            {/* Signature */}
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

                            {/* Déclaration de confidentialité */}
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
            </Modal>
            <style>
        {`
          .step {
            cursor: pointer;
            transition: transform 0.2s;
          }

          .step:hover {
            transform: scale(1.05);
          }

          .step.active {
            font-weight: bold;
          }
        `}
      </style>
        </>
    );
};

export default Formulaire;