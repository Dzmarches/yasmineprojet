import React, { useState, useEffect } from 'react';
import { nationalites } from './Nationalite';
import Select from 'react-select';
import profil from '../../assets/imgs/verified.png'
import etudiant from '../../assets/imgs/family.png'
import health from '../../assets/imgs/healthcare.png'
import inscription from '../../assets/imgs/enrollment.png'
import user from '../../assets/imgs/user.png'
import ParentSection from "./ParentSection";
import { Link } from 'react-router-dom';

const ajoutParent = () => {

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
    
            // Références aux autres tables
            cycleId: '', // Référence à CycleScolaire
            niveauId: '', // Référence à Niveaux
            parentId: '', // Référence à Parent
    
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
            },
        });
        const [selectedOption, setSelectedOption] = useState(null);
        const [errors, setErrors] = useState({});
        const [isEditing, setIsEditing] = useState(false);
    
    const [preview, setPreview] = useState(null);


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

    useEffect(() => {
            if (values.pere.nomparent && values.pere.prenomparent && values.pere.datenaissparent) {
                const usernamePere = generateUsername(values.pere.nomparent, values.pere.prenomparent, false); // false pour père
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
        }, [values.pere.nomparent, values.pere.prenomparent, values.pere.datenaissparent]);
    
    
        // Effet pour générer le username et le password pour la mère
        useEffect(() => {
            if (values.mere.nomparent && values.mere.prenomparent && values.mere.datenaissparent) {
                const usernameMere = generateUsername(values.mere.nomparent, values.mere.prenomparent, false); // false pour mère
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
        }, [values.mere.nomparent, values.mere.prenomparent, values.mere.datenaissparent]);
    
        // Effet pour générer le username et le password pour le tuteur
        useEffect(() => {
            if (values.tuteur.nomparent && values.tuteur.prenomparent && values.tuteur.datenaissparent) {
                const usernameTuteur = generateUsername(values.tuteur.nomparent, values.tuteur.prenomparent, false); // false pour tuteur
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
        }, [values.tuteur.nomparent, values.tuteur.prenomparent, values.tuteur.datenaissparent]);
    
        const [showPassword, setShowPassword] = useState(false); // State for password visibility
    
        // Function to toggle password visibility
        const togglePasswordVisibility = () => {
            setShowPassword(prevState => !prevState);
        };
    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };
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
    const [activeSection, setActiveSection] = useState('profile');

    const handleSelectChange = (selectedOption) => {
        setSelectedOption(selectedOption);
        setValues({ ...values, nationalite: selectedOption.value });
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
    return (
        <>
            <nav>
                <Link to="/home" className="text-primary">Accueil</Link>
                <span> / </span>
                <Link to="/parents" className="text-primary">Gestion des parents</Link>
                <span> / </span>
                <span>Modifier</span>
            </nav>
            <div className="card card-primary card-outline">
                <div className="card-header d-flex ">
                    <img src={etudiant} alt="" width="90px" />
                    <p className="card-title mt-5 ml-2 p-2 text-center" style={{ width: '300px', borderRadius: '50px', border: '1px solid rgb(215, 214, 216)' }}>
                        Gestion des Parents
                    </p>
                </div>
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
                                        value={values.pere.datenaissparent}
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
                                        value={values.mere.datenaissparent} // Correctly reference values.mere
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
                                        value={values.tuteur.datenaissparent} // Correctly reference values.tuteur
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
                                            value={values.pere.datenaissparent}
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
                                            value={values.mere.datenaissparent} // Correctly reference values.mere
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
                        </>
                    )}

                </div>

            </div>
        </>
    )
}

export default ajoutParent
