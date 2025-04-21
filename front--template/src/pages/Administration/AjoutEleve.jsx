import React, { useState } from 'react';
import { nationalites } from './Nationalite';
import Select from 'react-select';
import profil from '../../assets/imgs/verified.png'
import etudiant from '../../assets/imgs/etudiant.png'
import family from '../../assets/imgs/family.png'
import health from '../../assets/imgs/healthcare.png'
import inscription from '../../assets/imgs/enrollment.png'
import user from '../../assets/imgs/user.png'
import { Link } from 'react-router-dom';
import ParentSection from "./ParentSection";

const ajoutEleve = () => {

    const [preview, setPreview] = useState(null);

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

    const handleSectionChange = (section) => {
        setActiveSection(section);
    };
    const [selectedOption, setSelectedOption] = useState(null);

    const options = [
        { value: 'chocolate', label: 'Chocolate' },
        { value: 'strawberry', label: 'Strawberry' },
        { value: 'vanilla', label: 'Vanilla' }
    ];

    const handleChange = selectedOption => {
        setSelectedOption(selectedOption);
    };
    return (
        <>
            <nav>
                <Link to="/home" className="text-primary">Accueil</Link>
                <span> / </span>
                <Link to="/etudiants" className="text-primary">Gestion des étudiants</Link>
                <span> / </span>
                <span>Ajouter</span>
            </nav>
            <div className="card card-primary card-outline">
                <div className="card-header d-flex ">
                    <img src={etudiant} alt="" width="90px" />
                    <p className="card-title mt-5 ml-2 p-2 text-center" style={{ width: '300px', borderRadius: '50px', border: '1px solid rgb(215, 214, 216)' }}>
                        Gestion des Elèves
                    </p>
                </div>
                <div className="card-body">
                    <div className='card'>
                        <div className='cadr-header mt-2'>
                            <img src={user} width={40} className='p-2' />
                            <label>Informations Personnels</label>
                        </div><hr className='bg-primary' />

                        <div className='card-body'>
                            <div className='row'>
                                <div className="col-md-4">
                                    <label htmlFor="nom" className="form-label"  >Nom</label>
                                    <input
                                        name='nom'
                                        type="text"
                                        className="form-control"
                                        id="nom"
                                        required
                                    />
                                </div>
                                <div className="col-md-4">
                                    <label htmlFor="prenom" className="form-label">Prénom</label>
                                    <input
                                        name='prenom'
                                        type="text"
                                        className="form-control"
                                        id="prenom"
                                        required
                                    />
                                </div>
                                <div className="col-md-4">
                                    <label htmlFor="tel" className="form-label">Date Naiss</label>
                                    <div className="input-group has-validation">
                                        <input
                                            name='datenaiss'
                                            type="date"
                                            className="form-control"
                                            id="datenaiss"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className='row'>
                                <div className="col-md-4">
                                    <label htmlFor="nom" className="form-label"  >Nom en arab</label>
                                    <input
                                        name='nom'
                                        type="text"
                                        className="form-control"
                                        id="nom"
                                        required
                                    />
                                </div>
                                <div className="col-md-4">
                                    <label htmlFor="prenom" className="form-label">Prénom en arab</label>
                                    <input
                                        name='prenom'
                                        type="text"
                                        className="form-control"
                                        id="prenom"
                                        required
                                    />
                                </div>
                                <div className="col-md-4">
                                    <label htmlFor="email" className="form-label">N° d'acte de naissance</label>
                                    <div className="input-group has-validation">
                                        <input
                                            name='nactnaiss'
                                            type="text"
                                            className="form-control"
                                            id="nactnaiss"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className='row'>
                                <div className="col-md-6">
                                    <label htmlFor="tel" className="form-label">Lieux</label>
                                    <div className="input-group has-validation">
                                        <input
                                            name='lieux'
                                            type="text"
                                            className="form-control"
                                            id="lieux"
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <label htmlFor="tel" className="form-label">Lieux en arabe</label>
                                    <div className="input-group has-validation">
                                        <input
                                            name='lieux'
                                            type="text"
                                            className="form-control"
                                            id="lieux"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className='row'>
                                <div className="col-md-6">
                                    <label htmlFor="tel" className="form-label">Adresse</label>
                                    <div className="input-group has-validation">
                                        <input
                                            name='lieux'
                                            type="text"
                                            className="form-control"
                                            id="lieux"
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <label htmlFor="tel" className="form-label">Adresse en arabe</label>
                                    <div className="input-group has-validation">
                                        <input
                                            name='lieux'
                                            type="text"
                                            className="form-control"
                                            id="lieux"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className='row'>
                                <div className="col-md-4">
                                    <label htmlFor="validationCustom04" className="form-label">Nationalité</label>
                                    <Select height='50'
                                        value={selectedOption}
                                        onChange={handleChange}
                                        options={nationalites}
                                        styles={customStyles}
                                    />
                                </div>
                                <div className="col-md-4">
                                    <label htmlFor="validationCustom04" className="form-label">Sexe</label>
                                    <select className="form-control" id="validationCustom04" required name='sexe'>
                                        <option value="" disabled selected>Sexe...</option>
                                        <option>Masculin</option>
                                        <option>Féminin</option>
                                    </select>
                                </div>
                                <div className="col-md-4">
                                    <label htmlFor="email" className="form-label">état social</label>
                                    <div className="input-group has-validation">
                                        <input
                                            name='etat'
                                            type="text"
                                            className="form-control"
                                            id="etat"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='card'>
                        <div className='cadr-header mt-2'>
                            <img src={user} width={40} className='p-2' />
                            <label>Informations de compte</label>
                        </div><hr className='bg-primary' />
                        <div className='card-body'>
                            <div className='row'>
                                <div className="col-md-6">
                                    <label htmlFor="validationCustomUsername" className="form-label">Nom d'utilisateur</label>
                                    <div className="input-group has-validation">
                                        <span className="input-group-text" id="inputGroupPrepend">@</span>
                                        <input
                                            name='user'
                                            type="text"
                                            className="form-control"
                                            id="validationCustomUsername"
                                            aria-describedby="inputGroupPrepend"
                                            required
                                        />
                                        <div className="invalid-feedback">Please choose a username.</div>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <label htmlFor="mdp" className="form-label">Mot de passe</label>
                                    <input
                                        name='pwd'
                                        type="text"
                                        className="form-control"
                                        id="mdp"
                                        required
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='card'>
                        <div className='cadr-header mt-2'>
                            <img src={family} width={40} className='p-2' />
                            <label>Informations des parents</label>
                        </div><hr className='bg-primary' />
                        <div className="card-body">
                            {/* Section Père */}
                            <ParentSection title="Informations Père">
                                <div className="row">
                                    {/* Nom et Prénom en français */}
                                    <div className="col-md-4">
                                        <label htmlFor="nom" className="form-label">
                                            Nom
                                        </label>
                                        <input
                                            name="nom"
                                            type="text"
                                            className="form-control"
                                            id="nom"
                                            required
                                        />
                                    </div>
                                    <div className="col-md-4">
                                        <label htmlFor="prenom" className="form-label">
                                            Prénom
                                        </label>
                                        <input
                                            name="prenom"
                                            type="text"
                                            className="form-control"
                                            id="prenom"
                                            required
                                        />
                                    </div>
                                    <div className="col-md-4">
                                        <label htmlFor="datenaiss" className="form-label">
                                            Date de naissance
                                        </label>
                                        <input
                                            name="datenaiss"
                                            type="date"
                                            className="form-control"
                                            id="datenaiss"
                                            required
                                        />
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
                            </ParentSection>

                            {/* Section Mère */}
                            <ParentSection title="Informations Mère">
                                <div className="row">
                                    {/* Nom et Prénom en français */}
                                    <div className="col-md-4">
                                        <label htmlFor="nom_mere" className="form-label">
                                            Nom
                                        </label>
                                        <input
                                            name="nom_mere"
                                            type="text"
                                            className="form-control"
                                            id="nom_mere"
                                            required
                                        />
                                    </div>
                                    <div className="col-md-4">
                                        <label htmlFor="prenom_mere" className="form-label">
                                            Prénom
                                        </label>
                                        <input
                                            name="prenom_mere"
                                            type="text"
                                            className="form-control"
                                            id="prenom_mere"
                                            required
                                        />
                                    </div>
                                    <div className="col-md-4">
                                        <label htmlFor="datenaiss_mere" className="form-label">
                                            Date de naissance
                                        </label>
                                        <input
                                            name="datenaiss_mere"
                                            type="date"
                                            className="form-control"
                                            id="datenaiss_mere"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="row mt-3">
                                    {/* Nom et Prénom en arabe */}
                                    <div className="col-md-4">
                                        <label htmlFor="nom_ar_mere" className="form-label">
                                            Nom en arabe
                                        </label>
                                        <input
                                            name="nom_ar_mere"
                                            type="text"
                                            className="form-control"
                                            id="nom_ar_mere"
                                            required
                                        />
                                    </div>
                                    <div className="col-md-4">
                                        <label htmlFor="prenom_ar_mere" className="form-label">
                                            Prénom en arabe
                                        </label>
                                        <input
                                            name="prenom_ar_mere"
                                            type="text"
                                            className="form-control"
                                            id="prenom_ar_mere"
                                            required
                                        />
                                    </div>
                                    <div className="col-md-4">
                                        <label htmlFor="nationalite_mere" className="form-label">
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
                                        <label htmlFor="adresse_mere" className="form-label">
                                            Lieux
                                        </label>
                                        <input
                                            name="adresse_mere"
                                            type="text"
                                            className="form-control"
                                            id="adresse_mere"
                                            required
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <label htmlFor="adresse_ar_mere" className="form-label">
                                            Lieux en arabe
                                        </label>
                                        <input
                                            name="adresse_ar_mere"
                                            type="text"
                                            className="form-control"
                                            id="adresse_ar_mere"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="row mt-3">
                                    {/* Téléphone et Email */}
                                    <div className="col-md-6">
                                        <label htmlFor="tel_mere" className="form-label">
                                            Téléphone
                                        </label>
                                        <input
                                            name="tel_mere"
                                            type="text"
                                            className="form-control"
                                            id="tel_mere"
                                            required
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <label htmlFor="email_mere" className="form-label">
                                            Email
                                        </label>
                                        <input
                                            name="email_mere"
                                            type="email"
                                            className="form-control"
                                            id="email_mere"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="row mt-3">
                                    {/* Travail et Situation familiale */}
                                    <div className="col-md-6">
                                        <label htmlFor="travail_mere" className="form-label">
                                            Travail
                                        </label>
                                        <input
                                            name="travail_mere"
                                            type="text"
                                            className="form-control"
                                            id="travail_mere"
                                            required
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <label htmlFor="situationFamiliale_mere" className="form-label">
                                            Situation familiale
                                        </label>
                                        <select
                                            name="situationFamiliale_mere"
                                            className="form-control"
                                            id="situationFamiliale_mere"
                                            required
                                        >
                                            <option value="Mariée">Mariée</option>
                                            <option value="Divorcée">Divorcée</option>
                                            <option value="Célibataire">Célibataire</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="row mt-3">
                                    {/* Nombre d'enfants */}
                                    <div className="col-md-4">
                                        <label htmlFor="nmbrenfant_mere" className="form-label">
                                            Nombre d'enfants
                                        </label>
                                        <input
                                            name="nmbrenfant_mere"
                                            type="number"
                                            className="form-control"
                                            id="nmbrenfant_mere"
                                            required
                                        />
                                    </div>

                                    {/* Nom d'utilisateur et Mot de passe */}
                                    <div className="col-md-4">
                                        <label htmlFor="username_mere" className="form-label">
                                            Nom d'utilisateur
                                        </label>
                                        <div className="input-group has-validation">
                                            <span className="input-group-text" id="inputGroupPrepend">
                                                @
                                            </span>
                                            <input
                                                name="username_mere"
                                                type="text"
                                                className="form-control"
                                                id="username_mere"
                                                aria-describedby="inputGroupPrepend"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <label htmlFor="password_mere" className="form-label">
                                            Mot de passe
                                        </label>
                                        <input
                                            name="password_mere"
                                            type="password"
                                            className="form-control"
                                            id="password_mere"
                                            required
                                        />
                                    </div>
                                </div>
                            </ParentSection>

                            {/* Section Tuteur */}
                            <ParentSection title="Informations Tuteur">
                                <div className="row">
                                    {/* Nom et Prénom en français */}
                                    <div className="col-md-4">
                                        <label htmlFor="nom_tuteur" className="form-label">
                                            Nom
                                        </label>
                                        <input
                                            name="nom_tuteur"
                                            type="text"
                                            className="form-control"
                                            id="nom_tuteur"
                                            required
                                        />
                                    </div>
                                    <div className="col-md-4">
                                        <label htmlFor="prenom_tuteur" className="form-label">
                                            Prénom
                                        </label>
                                        <input
                                            name="prenom_tuteur"
                                            type="text"
                                            className="form-control"
                                            id="prenom_tuteur"
                                            required
                                        />
                                    </div>
                                    <div className="col-md-4">
                                        <label htmlFor="datenaiss_tuteur" className="form-label">
                                            Date de naissance
                                        </label>
                                        <input
                                            name="datenaiss_tuteur"
                                            type="date"
                                            className="form-control"
                                            id="datenaiss_tuteur"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="row mt-3">
                                    {/* Nom et Prénom en arabe */}
                                    <div className="col-md-4">
                                        <label htmlFor="nom_ar_tuteur" className="form-label">
                                            Nom en arabe
                                        </label>
                                        <input
                                            name="nom_ar_tuteur"
                                            type="text"
                                            className="form-control"
                                            id="nom_ar_tuteur"
                                            required
                                        />
                                    </div>
                                    <div className="col-md-4">
                                        <label htmlFor="prenom_ar_tuteur" className="form-label">
                                            Prénom en arabe
                                        </label>
                                        <input
                                            name="prenom_ar_tuteur"
                                            type="text"
                                            className="form-control"
                                            id="prenom_ar_tuteur"
                                            required
                                        />
                                    </div>
                                    <div className="col-md-4">
                                        <label htmlFor="nationalite_tuteur" className="form-label">
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
                                        <label htmlFor="adresse_tuteur" className="form-label">
                                            Lieux
                                        </label>
                                        <input
                                            name="adresse_tuteur"
                                            type="text"
                                            className="form-control"
                                            id="adresse_tuteur"
                                            required
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <label htmlFor="adresse_ar_tuteur" className="form-label">
                                            Lieux en arabe
                                        </label>
                                        <input
                                            name="adresse_ar_tuteur"
                                            type="text"
                                            className="form-control"
                                            id="adresse_ar_tuteur"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="row mt-3">
                                    {/* Téléphone et Email */}
                                    <div className="col-md-6">
                                        <label htmlFor="tel_tuteur" className="form-label">
                                            Téléphone
                                        </label>
                                        <input
                                            name="tel_tuteur"
                                            type="text"
                                            className="form-control"
                                            id="tel_tuteur"
                                            required
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <label htmlFor="email_tuteur" className="form-label">
                                            Email
                                        </label>
                                        <input
                                            name="email_tuteur"
                                            type="email"
                                            className="form-control"
                                            id="email_tuteur"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="row mt-3">
                                    {/* Travail et Situation familiale */}
                                    <div className="col-md-6">
                                        <label htmlFor="travail_tuteur" className="form-label">
                                            Travail
                                        </label>
                                        <input
                                            name="travail_tuteur"
                                            type="text"
                                            className="form-control"
                                            id="travail_tuteur"
                                            required
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <label htmlFor="situationFamiliale_tuteur" className="form-label">
                                            Situation familiale
                                        </label>
                                        <select
                                            name="situationFamiliale_tuteur"
                                            className="form-control"
                                            id="situationFamiliale_tuteur"
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
                                        <label htmlFor="nmbrenfant_tuteur" className="form-label">
                                            Nombre d'enfants
                                        </label>
                                        <input
                                            name="nmbrenfant_tuteur"
                                            type="number"
                                            className="form-control"
                                            id="nmbrenfant_tuteur"
                                            required
                                        />
                                    </div>

                                    {/* Nom d'utilisateur et Mot de passe */}
                                    <div className="col-md-4">
                                        <label htmlFor="username_tuteur" className="form-label">
                                            Nom d'utilisateur
                                        </label>
                                        <div className="input-group has-validation">
                                            <span className="input-group-text" id="inputGroupPrepend">
                                                @
                                            </span>
                                            <input
                                                name="username_tuteur"
                                                type="text"
                                                className="form-control"
                                                id="username_tuteur"
                                                aria-describedby="inputGroupPrepend"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <label htmlFor="password_tuteur" className="form-label">
                                            Mot de passe
                                        </label>
                                        <input
                                            name="password_tuteur"
                                            type="password"
                                            className="form-control"
                                            id="password_tuteur"
                                            required
                                        />
                                    </div>
                                </div>
                            </ParentSection>
                        </div>
                    </div>
                    <div className='card'>
                        <div className='cadr-header mt-2'>
                            <img src={health} width={40} className='p-2' />
                            <label>Informations de santé</label>
                        </div><hr className='bg-primary' />
                        <div className='card-body'>
                            <div className='row'>
                                <div className="col-md-6">
                                    <label htmlFor="ni" className="form-label">Maladie chronique</label>
                                    <div className="input-group has-validation">
                                        <input name='maladie' type="text" className="form-control" required />
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <label htmlFor="groupeSanguin" className="form-label">Groupe sanguin</label>
                                    <div className="input-group has-validation">
                                        <select name="groupeSanguin" id="groupeSanguin" className="form-control" required>
                                            <option value="" disabled selected>Sélectionnez un groupe sanguin</option>
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
                        </div>
                    </div>

                    <div className='card'>
                        <div className='cadr-header mt-2'>
                            <img src={inscription} width={40} className='p-2' />
                            <label>Informations d'inscription</label>
                        </div><hr className='bg-primary' />
                        <div className='card-body'>
                            <div className='row'>
                                <div className="col-md-6">
                                    <label htmlFor="validationCustom04" className="form-label">Numero d'inscriptio</label>
                                    <div className="input-group has-validation">
                                        <input name='cdident' type="text" className="form-control" required />
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <label htmlFor="ni" className="form-label">Numéro d'identification nationel de l'enfant</label>
                                    <div className="input-group has-validation">
                                        <input name='nidentnationel' type="text" className="form-control" required />
                                    </div>
                                </div>
                            </div>
                            <div className='row'>
                                <div className="col-md-6">
                                    <label htmlFor="pc" className="form-label">date d'inscription</label>
                                    <div className="input-group has-validation">
                                        <input name='dateenregistrement' type="date" className="form-control" required />
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
                                            onChange={handleFileChange}
                                            required
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
                                        {preview ? (
                                            <img
                                                src={preview}
                                                alt="Aperçu"
                                                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                            />
                                        ) : (
                                            <span style={{ color: "#888" }}>Aucune image</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </>
    )
}

export default ajoutEleve
