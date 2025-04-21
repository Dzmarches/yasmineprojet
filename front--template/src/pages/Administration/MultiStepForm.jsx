import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Select from 'react-select';
import ParentSection from "./ParentSection";
import { nationalites } from './Nationalite';
// Importation des icônes
import userIcon from '../../assets/imgs/user.png';
import familyIcon from '../../assets/imgs/family.png';
import healthIcon from '../../assets/imgs/healthcare.png';
import enrollmentIcon from '../../assets/imgs/enrollment.png';

const MultiStepForm = () => {
    const [step, setStep] = useState(1);
    const [values, setValues] = useState({
        nom: '',
        prenom: '',
        datenaiss: '',
        nom_arabe: '',
        prenom_arabe: '',
        nactnaiss: '',
        lieux: '',
        lieux_arabe: '',
        nationalite: '',
        sexe: '',
        etat: '',
        // Informations du père
        nom_pere: '',
        prenom_pere: '',
        datenaiss_pere: '',
        nom_ar_pere: '',
        prenom_ar_pere: '',
        nationalite_pere: '',
        adresse_pere: '',
        adresse_ar_pere: '',
        tel_pere: '',
        email_pere: '',
        travail_pere: '',
        situationFamiliale_pere: '',
        nmbrenfant_pere: '',
        username_pere: '',
        password_pere: '',
        // Informations de la mère
        nom_mere: '',
        prenom_mere: '',
        datenaiss_mere: '',
        nom_ar_mere: '',
        prenom_ar_mere: '',
        nationalite_mere: '',
        adresse_mere: '',
        adresse_ar_mere: '',
        tel_mere: '',
        email_mere: '',
        travail_mere: '',
        situationFamiliale_mere: '',
        nmbrenfant_mere: '',
        username_mere: '',
        password_mere: '',
        // Informations du tuteur
        nom_tuteur: '',
        prenom_tuteur: '',
        datenaiss_tuteur: '',
        nom_ar_tuteur: '',
        prenom_ar_tuteur: '',
        nationalite_tuteur: '',
        adresse_tuteur: '',
        adresse_ar_tuteur: '',
        tel_tuteur: '',
        email_tuteur: '',
        travail_tuteur: '',
        situationFamiliale_tuteur: '',
        nmbrenfant_tuteur: '',
        username_tuteur: '',
        password_tuteur: '',
        // Informations médicales
        maladie: '',
        groupeSanguin: '',
        // Informations de connexion
        user: '',
        pwd: '',
        orphelin: '', // Nouveau champ pour le statut d'orphelin
    });
    const [errors, setErrors] = useState({});
    const [selectedOption, setSelectedOption] = useState(null);

    const nextStep = () => {
        const newErrors = validateStep(step);
        setErrors(newErrors);
        if (Object.keys(newErrors).length === 0) setStep(step + 1);
    };

    const prevStep = () => setStep(step - 1);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setValues({ ...values, [name]: value });
        setErrors({ ...errors, [name]: '' });
    };

    const handleSelectChange = (selectedOption) => {
        setSelectedOption(selectedOption);
        setValues({ ...values, nationalite: selectedOption.value });
    };

    const handleSubmit = () => {
        const newErrors = validateStep(step);
        setErrors(newErrors);
        if (Object.keys(newErrors).length === 0) {
            alert('Formulaire soumis avec succès!');
            console.log(values);
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
                if (!values.orphelin) newErrors.orphelin = 'Sélectionnez un statut d\'orphelin.';
                if (values.orphelin === 'sansmere' && !values.nom_pere) newErrors.nom_pere = 'Ce champ est requis.';
                if (values.orphelin === 'orphelin' && !values.nom_mere) newErrors.nom_mere = 'Ce champ est requis.';
                if (values.orphelin === 'sanspere' && !values.nom_mere) newErrors.nom_mere = 'Ce champ est requis.';
                break;
            case 3:
                if (!values.maladie) newErrors.maladie = 'Ce champ est requis.';
                if (!values.groupeSanguin) newErrors.groupeSanguin = 'Ce champ est requis.';
                break;
            case 4:
                if (!values.user) newErrors.user = 'Ce champ est requis.';
                if (!values.pwd) newErrors.pwd = 'Ce champ est requis.';
                break;
            default:
                break;
        }
        return newErrors;
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
    // Indicateur d'étapes avec images
    const renderStepIndicator = () => {
        return (
            <div className="step-indicator d-flex justify-content-between align-items-center p-3">
                {[
                    { icon: userIcon, label: 'Profil' },
                    { icon: familyIcon, label: 'Famille' },
                    { icon: healthIcon, label: 'Santé' },
                    { icon: enrollmentIcon, label: 'Inscription' },
                ].map((item, index) => (
                    <div key={index} className={`step ${step === index + 1 ? 'active' : ''} text-center`}>
                        <img src={item.icon} alt={`Étape ${index + 1}`} className="step-icon" style={{ width: 50, height: 50 }} />
                        <p className="mt-2">{item.label}</p>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <>
            {/* Navigation */}
            <nav className="mb-3">
                <Link to="/home" className="text-primary">Accueil</Link>
                <span> / </span>
                <Link to="/etudiants" className="text-primary">Gestion des étudiants</Link>
                <span> / </span>
                <span>Ajouter</span>
            </nav>

            {/* Contenu principal */}
            <div className="container">
                <div className="card card-primary card-outline p-4">
                    {renderStepIndicator()}

                    <div className="form-content mt-3">
                        {step === 1 && (
                            <>
                                <div className='row'>
                                    <div className="col-md-4">
                                        <label>Nom</label>
                                        <input type="text" name='nom' className="form-control" value={values.nom} onChange={handleChange} />
                                        {errors.nom && <div className="text-danger">{errors.nom}</div>}
                                    </div>
                                    <div className="col-md-4">
                                        <label>Prénom</label>
                                        <input type="text" name='prenom' className="form-control" value={values.prenom} onChange={handleChange} />
                                        {errors.prenom && <div className="text-danger">{errors.prenom}</div>}
                                    </div>
                                    <div className="col-md-4">
                                        <label>Date Naissance</label>
                                        <input type="date" name='datenaiss' className="form-control" value={values.datenaiss} onChange={handleChange} />
                                        {errors.datenaiss && <div className="text-danger">{errors.datenaiss}</div>}
                                    </div>
                                </div>
                                <div className='row'>
                                    <div className="col-md-4">
                                        <label>Nom en arabe</label>
                                        <input type="text" name='nom_arabe' className="form-control" value={values.nom_arabe} onChange={handleChange} />
                                    </div>
                                    <div className="col-md-4">
                                        <label>Prénom en arabe</label>
                                        <input type="text" name='prenom_arabe' className="form-control" value={values.prenom_arabe} onChange={handleChange} />
                                    </div>
                                    <div className="col-md-4">
                                        <label>N° d'acte de naissance</label>
                                        <input type="text" name='nactnaiss' className="form-control" value={values.nactnaiss} onChange={handleChange} />
                                    </div>
                                </div>
                                <div className='row'>
                                    <div className="col-md-6">
                                        <label>Lieux</label>
                                        <input type="text" name='lieux' className="form-control" value={values.lieux} onChange={handleChange} />
                                    </div>
                                    <div className="col-md-6">
                                        <label>Lieux en arabe</label>
                                        <input type="text" name='lieux_arabe' className="form-control" value={values.lieux_arabe} onChange={handleChange} />
                                    </div>
                                </div>
                                <div className='row'>
                                    <div className="col-md-4">
                                        <label htmlFor="validationCustom04" className="form-label">Nationalité</label>
                                        <Select
                                            value={selectedOption}
                                            onChange={handleSelectChange}
                                            options={nationalites}
                                            styles={customStyles}
                                        />
                                    </div>
                                    <div className="col-md-4">
                                        <label>Sexe</label>
                                        <select className="form-control" name='sexe' value={values.sexe} onChange={handleChange}>
                                            <option value="">Sélectionner...</option>
                                            <option value="Masculin">Masculin</option>
                                            <option value="Féminin">Féminin</option>
                                        </select>
                                    </div>
                                    <div className="col-md-4">
                                        <label>État social</label>
                                        <input type="text" name='etat' className="form-control" value={values.etat} onChange={handleChange} />
                                    </div>
                                </div>
                                <button className="btn btn-primary mt-3" onClick={nextStep}>Suivant</button>
                            </>
                        )}

                        {step === 2 && (
                            <>
                                <div className="card-body">
                                    <div className="row">
                                        <div className="col-md-4">
                                            <input
                                                name='orphelin'
                                                type="radio"
                                                id="sansmere"
                                                value="sansmere"
                                                onChange={handleChange}
                                                required
                                            />
                                            <label htmlFor="sansmere" className="form-label ml-1"> Orphelin mère</label>
                                        </div>
                                        <div className="col-md-4">
                                            <input
                                                name='orphelin'
                                                type="radio"
                                                id="orphelin"
                                                value="orphelin"
                                                onChange={handleChange}
                                                required
                                            />
                                            <label htmlFor="orphelin" className="form-label ml-1"> Orphelin père</label>
                                        </div>
                                        <div className="col-md-4">
                                            <input
                                                name='orphelin'
                                                type="radio"
                                                id="sanspere"
                                                value="sanspere"
                                                onChange={handleChange}
                                                required
                                            />
                                            <label htmlFor="sanspere" className="form-label ml-1"> Orphelin les deux</label>
                                        </div>
                                    </div>

                                    {/* Affichage conditionnel des informations du père, de la mère ou du tuteur */}
                                    {values.orphelin === 'sansmere' && (
                                        <ParentSection title="Informations Père">
                                            <div className="row">
                                                <div className="col-md-4">
                                                    <label htmlFor="nom_pere" className="form-label">Nom</label>
                                                    <input name="nom_pere" type="text" className="form-control" id="nom_pere" value={values.nom_pere} onChange={handleChange} required />
                                                </div>
                                                <div className="col-md-4">
                                                    <label htmlFor="prenom_pere" className="form-label">Prénom</label>
                                                    <input name="prenom_pere" type="text" className="form-control" id="prenom_pere" value={values.prenom_pere} onChange={handleChange} required />
                                                </div>
                                                <div className="col-md-4">
                                                    <label htmlFor="datenaiss_pere" className="form-label">Date de naissance</label>
                                                    <input name="datenaiss_pere" type="date" className="form-control" id="datenaiss_pere" value={values.datenaiss_pere} onChange={handleChange} required />
                                                </div>
                                            </div>
                                            <div className="row mt-3">
                                                {/* Nom et Prénom en arabe */}
                                                <div className="col-md-4">
                                                    <label htmlFor="nom_ar" className="form-label">
                                                        Nom en arabe
                                                    </label>
                                                    <input
                                                        name="nom_ar"
                                                        type="text"
                                                        className="form-control"
                                                        id="nom_ar"
                                                        required
                                                    />
                                                </div>
                                                <div className="col-md-4">
                                                    <label htmlFor="prenom_ar" className="form-label">
                                                        Prénom en arabe
                                                    </label>
                                                    <input
                                                        name="prenom_ar"
                                                        type="text"
                                                        className="form-control"
                                                        id="prenom_ar"
                                                        required
                                                    />
                                                </div>
                                                <div className="col-md-4">
                                                    <label htmlFor="nationalite" className="form-label">
                                                        Nationalité
                                                    </label>
                                                    <Select
                                                        value={selectedOption}
                                                        onChange={handleChange}
                                                        options={nationalites}
                                                        styles={customStyles}
                                                        placeholder="Sélectionnez une nationalité"
                                                    />
                                                </div>
                                            </div>

                                            <div className="row mt-3">
                                                {/* Adresse en français et arabe */}
                                                <div className="col-md-6">
                                                    <label htmlFor="adresse" className="form-label">
                                                        Lieux
                                                    </label>
                                                    <input
                                                        name="adresse"
                                                        type="text"
                                                        className="form-control"
                                                        id="adresse"
                                                        required
                                                    />
                                                </div>
                                                <div className="col-md-6">
                                                    <label htmlFor="adresse_ar" className="form-label">
                                                        Lieux en arabe
                                                    </label>
                                                    <input
                                                        name="adresse_ar"
                                                        type="text"
                                                        className="form-control"
                                                        id="adresse_ar"
                                                        required
                                                    />
                                                </div>
                                            </div>

                                            <div className="row mt-3">
                                                {/* Téléphone et Email */}
                                                <div className="col-md-6">
                                                    <label htmlFor="tel" className="form-label">
                                                        Téléphone
                                                    </label>
                                                    <input
                                                        name="tel"
                                                        type="text"
                                                        className="form-control"
                                                        id="tel"
                                                        required
                                                    />
                                                </div>
                                                <div className="col-md-6">
                                                    <label htmlFor="email" className="form-label">
                                                        Email
                                                    </label>
                                                    <input
                                                        name="email"
                                                        type="email"
                                                        className="form-control"
                                                        id="email"
                                                        required
                                                    />
                                                </div>
                                            </div>

                                            <div className="row mt-3">
                                                {/* Travail et Situation familiale */}
                                                <div className="col-md-6">
                                                    <label htmlFor="travail" className="form-label">
                                                        Travail
                                                    </label>
                                                    <input
                                                        name="travail"
                                                        type="text"
                                                        className="form-control"
                                                        id="travail"
                                                        required
                                                    />
                                                </div>
                                                <div className="col-md-6">
                                                    <label htmlFor="situationFamiliale" className="form-label">
                                                        Situation familiale
                                                    </label>
                                                    <select
                                                        name="situationFamiliale"
                                                        className="form-control"
                                                        id="situationFamiliale"
                                                        required
                                                    >
                                                        <option value="Marié">Marié</option>
                                                        <option value="Divorcé">Divorcé</option>
                                                        <option value="Célibataire">Célibataire</option>
                                                    </select>
                                                </div>
                                            </div>

                                            <div className="row mt-3">
                                                {/* Nombre d'enfants */}
                                                <div className="col-md-4">
                                                    <label htmlFor="nmbrenfant" className="form-label">
                                                        Nombre d'enfants
                                                    </label>
                                                    <input
                                                        name="nmbrenfant"
                                                        type="number"
                                                        className="form-control"
                                                        id="nmbrenfant"
                                                        required
                                                    />
                                                </div>

                                                {/* Nom d'utilisateur et Mot de passe */}
                                                <div className="col-md-4">
                                                    <label htmlFor="username" className="form-label">
                                                        Nom d'utilisateur
                                                    </label>
                                                    <div className="input-group has-validation">
                                                        <span className="input-group-text" id="inputGroupPrepend">
                                                            @
                                                        </span>
                                                        <input
                                                            name="username"
                                                            type="text"
                                                            className="form-control"
                                                            id="username"
                                                            aria-describedby="inputGroupPrepend"
                                                            required
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-md-4">
                                                    <label htmlFor="password" className="form-label">
                                                        Mot de passe
                                                    </label>
                                                    <input
                                                        name="password"
                                                        type="password"
                                                        className="form-control"
                                                        id="password"
                                                        required
                                                    />
                                                </div>
                                            </div>
                                            {/* Ajoutez d'autres champs pour le père ici */}
                                        </ParentSection>
                                    )}

                                    {values.orphelin === 'orphelin' && (
                                        <ParentSection title="Informations Mère">
                                            <div className="row">
                                                <div className="col-md-4">
                                                    <label htmlFor="nom_mere" className="form-label">Nom</label>
                                                    <input name="nom_mere" type="text" className="form-control" id="nom_mere" value={values.nom_mere} onChange={handleChange} required />
                                                </div>
                                                <div className="col-md-4">
                                                    <label htmlFor="prenom_mere" className="form-label">Prénom</label>
                                                    <input name="prenom_mere" type="text" className="form-control" id="prenom_mere" value={values.prenom_mere} onChange={handleChange} required />
                                                </div>
                                                <div className="col-md-4">
                                                    <label htmlFor="datenaiss_mere" className="form-label">Date de naissance</label>
                                                    <input name="datenaiss_mere" type="date" className="form-control" id="datenaiss_mere" value={values.datenaiss_mere} onChange={handleChange} required />
                                                </div>
                                            </div>
                                            <div className="row mt-3">
                                                {/* Nom et Prénom en arabe */}
                                                <div className="col-md-4">
                                                    <label htmlFor="nom_ar" className="form-label">
                                                        Nom en arabe
                                                    </label>
                                                    <input
                                                        name="nom_ar"
                                                        type="text"
                                                        className="form-control"
                                                        id="nom_ar"
                                                        required
                                                    />
                                                </div>
                                                <div className="col-md-4">
                                                    <label htmlFor="prenom_ar" className="form-label">
                                                        Prénom en arabe
                                                    </label>
                                                    <input
                                                        name="prenom_ar"
                                                        type="text"
                                                        className="form-control"
                                                        id="prenom_ar"
                                                        required
                                                    />
                                                </div>
                                                <div className="col-md-4">
                                                    <label htmlFor="nationalite" className="form-label">
                                                        Nationalité
                                                    </label>
                                                    <Select
                                                        value={selectedOption}
                                                        onChange={handleChange}
                                                        options={nationalites}
                                                        styles={customStyles}
                                                        placeholder="Sélectionnez une nationalité"
                                                    />
                                                </div>
                                            </div>

                                            <div className="row mt-3">
                                                {/* Adresse en français et arabe */}
                                                <div className="col-md-6">
                                                    <label htmlFor="adresse" className="form-label">
                                                        Lieux
                                                    </label>
                                                    <input
                                                        name="adresse"
                                                        type="text"
                                                        className="form-control"
                                                        id="adresse"
                                                        required
                                                    />
                                                </div>
                                                <div className="col-md-6">
                                                    <label htmlFor="adresse_ar" className="form-label">
                                                        Lieux en arabe
                                                    </label>
                                                    <input
                                                        name="adresse_ar"
                                                        type="text"
                                                        className="form-control"
                                                        id="adresse_ar"
                                                        required
                                                    />
                                                </div>
                                            </div>

                                            <div className="row mt-3">
                                                {/* Téléphone et Email */}
                                                <div className="col-md-6">
                                                    <label htmlFor="tel" className="form-label">
                                                        Téléphone
                                                    </label>
                                                    <input
                                                        name="tel"
                                                        type="text"
                                                        className="form-control"
                                                        id="tel"
                                                        required
                                                    />
                                                </div>
                                                <div className="col-md-6">
                                                    <label htmlFor="email" className="form-label">
                                                        Email
                                                    </label>
                                                    <input
                                                        name="email"
                                                        type="email"
                                                        className="form-control"
                                                        id="email"
                                                        required
                                                    />
                                                </div>
                                            </div>

                                            <div className="row mt-3">
                                                {/* Travail et Situation familiale */}
                                                <div className="col-md-6">
                                                    <label htmlFor="travail" className="form-label">
                                                        Travail
                                                    </label>
                                                    <input
                                                        name="travail"
                                                        type="text"
                                                        className="form-control"
                                                        id="travail"
                                                        required
                                                    />
                                                </div>
                                                <div className="col-md-6">
                                                    <label htmlFor="situationFamiliale" className="form-label">
                                                        Situation familiale
                                                    </label>
                                                    <select
                                                        name="situationFamiliale"
                                                        className="form-control"
                                                        id="situationFamiliale"
                                                        required
                                                    >
                                                        <option value="Marié">Marié</option>
                                                        <option value="Divorcé">Divorcé</option>
                                                        <option value="Célibataire">Célibataire</option>
                                                    </select>
                                                </div>
                                            </div>

                                            <div className="row mt-3">
                                                {/* Nombre d'enfants */}
                                                <div className="col-md-4">
                                                    <label htmlFor="nmbrenfant" className="form-label">
                                                        Nombre d'enfants
                                                    </label>
                                                    <input
                                                        name="nmbrenfant"
                                                        type="number"
                                                        className="form-control"
                                                        id="nmbrenfant"
                                                        required
                                                    />
                                                </div>

                                                {/* Nom d'utilisateur et Mot de passe */}
                                                <div className="col-md-4">
                                                    <label htmlFor="username" className="form-label">
                                                        Nom d'utilisateur
                                                    </label>
                                                    <div className="input-group has-validation">
                                                        <span className="input-group-text" id="inputGroupPrepend">
                                                            @
                                                        </span>
                                                        <input
                                                            name="username"
                                                            type="text"
                                                            className="form-control"
                                                            id="username"
                                                            aria-describedby="inputGroupPrepend"
                                                            required
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-md-4">
                                                    <label htmlFor="password" className="form-label">
                                                        Mot de passe
                                                    </label>
                                                    <input
                                                        name="password"
                                                        type="password"
                                                        className="form-control"
                                                        id="password"
                                                        required
                                                    />
                                                </div>
                                            </div>
                                            {/* Ajoutez d'autres champs pour la mère ici */}
                                        </ParentSection>
                                    )}

                                    {values.orphelin === 'sanspere' && (
                                        <ParentSection title="Informations Tuteur">
                                            <div className="row">
                                                <div className="col-md-4">
                                                    <label htmlFor="nom_tuteur" className="form-label">Nom</label>
                                                    <input name="nom_tuteur" type="text" className="form-control" id="nom_tuteur" value={values.nom_tuteur} onChange={handleChange} required />
                                                </div>
                                                <div className="col-md-4">
                                                    <label htmlFor="prenom_tuteur" className="form-label">Prénom</label>
                                                    <input name="prenom_tuteur" type="text" className="form-control" id="prenom_tuteur" value={values.prenom_tuteur} onChange={handleChange} required />
                                                </div>
                                                <div className="col-md-4">
                                                    <label htmlFor="datenaiss_tuteur" className="form-label">Date de naissance</label>
                                                    <input name="datenaiss_tuteur" type="date" className="form-control" id="datenaiss_tuteur" value={values.datenaiss_tuteur} onChange={handleChange} required />
                                                </div>
                                            </div>
                                            <div className="row mt-3">
                                                {/* Nom et Prénom en arabe */}
                                                <div className="col-md-4">
                                                    <label htmlFor="nom_ar" className="form-label">
                                                        Nom en arabe
                                                    </label>
                                                    <input
                                                        name="nom_ar"
                                                        type="text"
                                                        className="form-control"
                                                        id="nom_ar"
                                                        required
                                                    />
                                                </div>
                                                <div className="col-md-4">
                                                    <label htmlFor="prenom_ar" className="form-label">
                                                        Prénom en arabe
                                                    </label>
                                                    <input
                                                        name="prenom_ar"
                                                        type="text"
                                                        className="form-control"
                                                        id="prenom_ar"
                                                        required
                                                    />
                                                </div>
                                                <div className="col-md-4">
                                                    <label htmlFor="nationalite" className="form-label">
                                                        Nationalité
                                                    </label>
                                                    <Select
                                                        value={selectedOption}
                                                        onChange={handleChange}
                                                        options={nationalites}
                                                        styles={customStyles}
                                                        placeholder="Sélectionnez une nationalité"
                                                    />
                                                </div>
                                            </div>

                                            <div className="row mt-3">
                                                {/* Adresse en français et arabe */}
                                                <div className="col-md-6">
                                                    <label htmlFor="adresse" className="form-label">
                                                        Lieux
                                                    </label>
                                                    <input
                                                        name="adresse"
                                                        type="text"
                                                        className="form-control"
                                                        id="adresse"
                                                        required
                                                    />
                                                </div>
                                                <div className="col-md-6">
                                                    <label htmlFor="adresse_ar" className="form-label">
                                                        Lieux en arabe
                                                    </label>
                                                    <input
                                                        name="adresse_ar"
                                                        type="text"
                                                        className="form-control"
                                                        id="adresse_ar"
                                                        required
                                                    />
                                                </div>
                                            </div>

                                            <div className="row mt-3">
                                                {/* Téléphone et Email */}
                                                <div className="col-md-6">
                                                    <label htmlFor="tel" className="form-label">
                                                        Téléphone
                                                    </label>
                                                    <input
                                                        name="tel"
                                                        type="text"
                                                        className="form-control"
                                                        id="tel"
                                                        required
                                                    />
                                                </div>
                                                <div className="col-md-6">
                                                    <label htmlFor="email" className="form-label">
                                                        Email
                                                    </label>
                                                    <input
                                                        name="email"
                                                        type="email"
                                                        className="form-control"
                                                        id="email"
                                                        required
                                                    />
                                                </div>
                                            </div>

                                            <div className="row mt-3">
                                                {/* Travail et Situation familiale */}
                                                <div className="col-md-6">
                                                    <label htmlFor="travail" className="form-label">
                                                        Travail
                                                    </label>
                                                    <input
                                                        name="travail"
                                                        type="text"
                                                        className="form-control"
                                                        id="travail"
                                                        required
                                                    />
                                                </div>
                                                <div className="col-md-6">
                                                    <label htmlFor="situationFamiliale" className="form-label">
                                                        Situation familiale
                                                    </label>
                                                    <select
                                                        name="situationFamiliale"
                                                        className="form-control"
                                                        id="situationFamiliale"
                                                        required
                                                    >
                                                        <option value="Marié">Marié</option>
                                                        <option value="Divorcé">Divorcé</option>
                                                        <option value="Célibataire">Célibataire</option>
                                                    </select>
                                                </div>
                                            </div>

                                            <div className="row mt-3">
                                                {/* Nombre d'enfants */}
                                                <div className="col-md-4">
                                                    <label htmlFor="nmbrenfant" className="form-label">
                                                        Nombre d'enfants
                                                    </label>
                                                    <input
                                                        name="nmbrenfant"
                                                        type="number"
                                                        className="form-control"
                                                        id="nmbrenfant"
                                                        required
                                                    />
                                                </div>

                                                {/* Nom d'utilisateur et Mot de passe */}
                                                <div className="col-md-4">
                                                    <label htmlFor="username" className="form-label">
                                                        Nom d'utilisateur
                                                    </label>
                                                    <div className="input-group has-validation">
                                                        <span className="input-group-text" id="inputGroupPrepend">
                                                            @
                                                        </span>
                                                        <input
                                                            name="username"
                                                            type="text"
                                                            className="form-control"
                                                            id="username"
                                                            aria-describedby="inputGroupPrepend"
                                                            required
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-md-4">
                                                    <label htmlFor="password" className="form-label">
                                                        Mot de passe
                                                    </label>
                                                    <input
                                                        name="password"
                                                        type="password"
                                                        className="form-control"
                                                        id="password"
                                                        required
                                                    />
                                                </div>
                                            </div>
                                            {/* Ajoutez d'autres champs pour le tuteur ici */}
                                        </ParentSection>
                                    )}
                                </div>
                                <button className="btn btn-secondary mt-3 me-2" onClick={prevStep}>Précédent</button>
                                <button className="btn btn-primary mt-3" onClick={nextStep}>Suivant</button>
                            </>
                        )}

                        {step === 3 && (
                            <>
                                <div className='card-body'>
                                    <div className='row'>
                                        <div className="col-md-4">
                                            <label htmlFor="antecedents" className="form-label">Votre enfant a-t-il des antécédents de santé ?</label>
                                            <input name='antecedents' type="text" className="form-control" value={values.antecedents} onChange={handleChange} required />
                                        </div>
                                        <div className="col-md-4">
                                            <label htmlFor="suiviMedical" className="form-label">Est-il (elle) actuellement suivi médicalement ?</label>
                                            <select name="suiviMedical" id="suiviMedical" className="form-control" value={values.suiviMedical} onChange={handleChange} required>
                                                <option value="" disabled>Sélectionnez une option</option>
                                                <option value="Oui">Oui</option>
                                                <option value="Non">Non</option>
                                            </select>
                                        </div>
                                        <div className="col-md-4">
                                            <label htmlFor="natureTraitement" className="form-label">Quelle est la nature du traitement suivi ?</label>
                                            <input name='natureTraitement' type="text" className="form-control" value={values.natureTraitement} onChange={handleChange} required />
                                        </div>
                                    </div>

                                    <div className='row'>
                                        <div className="col-md-4">
                                            <label htmlFor="crises" className="form-label">Est-il (elle) sujet à des crises ? Comment apparaissent-elles ?</label>
                                            <input name='crises' type="text" className="form-control" value={values.crises} onChange={handleChange} required />
                                        </div>
                                        <div className="col-md-4">
                                            <label htmlFor="conduiteTenir" className="form-label">Quelle est la conduite à tenir dans ce cas ?</label>
                                            <input name='conduiteTenir' type="text" className="form-control" value={values.conduiteTenir} onChange={handleChange} required />
                                        </div>
                                        <div className="col-md-4">
                                            <label htmlFor="operationChirurgicale" className="form-label">A-t-il (elle) subi une opération chirurgicale ? Laquelle ?</label>
                                            <input name='operationChirurgicale' type="text" className="form-control" value={values.operationChirurgicale} onChange={handleChange} required />
                                        </div>
                                    </div>

                                    <div className='row'>
                                        <div className="col-md-4">
                                            <label htmlFor="maladie" className="form-label">Maladie chronique</label>
                                            <input name='maladie' type="text" className="form-control" value={values.maladie} onChange={handleChange} required />
                                        </div>
                                        <div className="col-md-4">
                                            <label htmlFor="groupeSanguin" className="form-label">Groupe sanguin</label>
                                            <select name="groupeSanguin" id="groupeSanguin" className="form-control" value={values.groupeSanguin} onChange={handleChange} required>
                                                <option value="" disabled>Sélectionnez un groupe sanguin</option>
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
                                <button className="btn btn-secondary mt-3 me-2" onClick={prevStep}>Précédent</button>
                                <button className="btn btn-primary mt-3" onClick={nextStep}>Suivant</button>
                            </>
                        )}

                        {step === 4 && (
                            <>
                                <div className='card-body'>
                                    <div className='row'>
                                        <div className="col-md-6">
                                            <label htmlFor="user" className="form-label">Nom d'utilisateur</label>
                                            <input name='user' type="text" className="form-control" id="user" value={values.user} onChange={handleChange} required />
                                        </div>
                                        <div className="col-md-6">
                                            <label htmlFor="pwd" className="form-label">Mot de passe</label>
                                            <input name='pwd' type="password" className="form-control" id="pwd" value={values.pwd} onChange={handleChange} required />
                                        </div>
                                    </div>
                                </div>
                                <button className="btn btn-secondary mt-3 me-2" onClick={prevStep}>Précédent</button>
                                <button className="btn btn-success mt-3" onClick={handleSubmit}>Soumettre</button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default MultiStepForm;