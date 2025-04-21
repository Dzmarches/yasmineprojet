
import React, { useState } from 'react';
import Select from 'react-select';
import rh from '../../assets/imgs/employe.png';
import { Link, useParams } from 'react-router-dom';
import { nationalites, Paiement } from './Nationalite';
import user from '../../assets/imgs/user.png'



const AjoutEnseignants = ({ type }) => {

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
  console.log("le type", type)

  const [activeSection, setActiveSection] = useState('profile');
  const [selectedOption, setSelectedOption] = useState(null);
  const [PaimentOption, setPaiment] = useState(null);

  const [ChampsObligatoire, setChampsObligatoire] = useState(false);
  const HandleChampsObligatoire = () => {
    const nom = document.getElementById("nom").value;
    const prenom = document.getElementById("prenom").value;
    const tel = document.getElementById("tel").value;
    if (nom && prenom && tel) {
      setChampsObligatoire(true);
    } else {
      setChampsObligatoire(false);
    }

  }


  const handleSectionChange = (section) => { setActiveSection(section); };
  const handleChangePaiement = PaimentOption => { setPaiment(PaimentOption); };
  const handleChange = selectedOption => { setSelectedOption(selectedOption); };


  return (
    <>

      <nav className='mb-2'>
        <Link to="/">Accueil</Link>
        <span> / </span>
        <Link to="/enseignants">Gestion des ressource humaines</Link>
        <span> / </span>

        {type === "modifier" ? <span>Modifier un Employé</span> :
          type === "ajouter" ? <span>Ajouter un Employé</span> : ""}


      </nav>

      <div className="card card-primary card-outline">
        <div className="card-header d-flex ">
          <img src={rh} alt="" width="90px" />
          <p className="card-title mt-5 ml-2 p-2 text-center" style={{ width: '300px', borderRadius: '50px', border: '1px solid rgb(215, 214, 216)' }}>
            Gestion des ressource humaines
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
                  <label htmlFor="nom" className="form-label">Nom *</label>
                  <input
                    name='nom'
                    type="text"
                    className="form-control"
                    id="nom"
                    required
                  />
                </div>
                <div className="col-md-4">
                  <label htmlFor="prenom" className="form-label">Prénom *</label>
                  <input
                    name='prenom'
                    type="text"
                    className="form-control"
                    id="prenom"
                    required
                  />
                </div>
                <div className="col-md-4">
                  <label htmlFor="tel" className="form-label">Numéro de téléphone * </label>
                  <div className="input-group has-validation">
                    <input
                      name='tel'
                      type="text"
                      className="form-control"
                      id="tel"
                      required
                    />
                  </div>
                </div>
              </div>
              <div className='row'>
                <div className="col-md-4">
                  <label htmlFor="nomab" className="form-label"  >Nom en arabe *</label>
                  <input
                    name='nomab'
                    type="text"
                    className="form-control"
                    id="nomab"
                    required
                  />
                </div>
                <div className="col-md-4">
                  <label htmlFor="prenomab" className="form-label">Prénom en arabe *</label>
                  <input
                    name='prenomab'
                    type="text"
                    className="form-control"
                    id="prenomab"
                    required
                  />
                </div>
                <div className="col-md-4">
                  <label htmlFor="email" className="form-label">Mail </label>
                  <div className="input-group has-validation">
                    <input
                      name='email'
                      type="email"
                      className="form-control"
                      id="email"

                    />
                  </div>
                </div>
              </div>
              <div className='row'>

                <div className="col-md-4">
                  <label htmlFor="date" className="form-label">Date de naissance</label>
                  <input
                    name='datenais'
                    type="date"
                    className="form-control"
                    id="date"

                  />
                </div>
                <div className="col-md-4">
                  <label htmlFor="lieu" className="form-label">Lieu de naissance</label>
                  <div className="input-group has-validation">
                    <input
                      name='lieu'
                      type="text"
                      className="form-control"
                      id="lieu"
                      required
                    />
                  </div>
                </div>
                <div className="col-md-4">
                  <label htmlFor="lieuab" className="form-label">Lieu de naissance en arabe</label>
                  <div className="input-group has-validation">
                    <input
                      name='lieuab'
                      type="text"
                      className="form-control"
                      id="lieuab"
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
                  <Select  
                  styles={customStyles}
                    value={selectedOption}
                    onChange={handleChange}
                    options={nationalites}
                  />
                </div>
                <div className="col-md-4">
                  <label htmlFor="validationCustom04" className="form-label">Sexe</label>
                  <select className="form-control" id="validationCustom04" required name='sexe'>
                    <option value="" disabled>Sexe...</option>
                    <option>Masculin</option>
                    <option>Féminin</option>
                  </select>
                </div>
                <div className="col-md-4">
                  <label htmlFor="st" className="form-label">Situation familiale</label>
                  <div className="input-group has-validation">
                    <input
                      name='st'
                      type="text"
                      className="form-control"
                      id="st"
                    />
                  </div>
                </div>
                <div className="col-md-4">
                  <label htmlFor="nbe" className="form-label">nombre d'enfants</label>
                  <div className="input-group has-validation">
                    <input
                      name='nbe'
                      type="number"
                      className="form-control"
                      id="nbe"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className='card'>
            <div className='cadr-header mt-2'>
              <img src={user} width={40} className='p-2' />
              <label>Informations du compte</label>
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
              <img src="" width={40} className='p-2' />
              <label>Identifiants administratifs</label>
            </div><hr className='bg-primary' />
            <div className='card-body'>
              <div className='row'>
                <div className="col-md-4">
                  <label htmlFor="validationCustom04" className="form-label"> Type de pièce d'identité</label>
                  <select className="form-control" id="validationCustom04" name='sexe'>
                    <option value="" disabled>Type de pièce d'identité</option>
                    <option>Carte d'identité nationale</option>
                    <option>Passeport</option>
                    <option>Permis de conduire</option>
                    <option>Carte de résident</option>

                  </select>
                </div>
                <div className="col-md-4">
                  <label htmlFor="ni" className="form-label">Numéro d'identification </label>
                  <div className="input-group has-validation">
                    <input name='ni' type="number" className="form-control" />
                  </div>
                </div>

                <div className="col-md-4">
                  <label htmlFor="pc" className="form-label">Numéro de permis de conduire</label>
                  <div className="input-group has-validation">
                    <input name='pc' type="number" className="form-control" />
                  </div>
                </div>

                <div className="col-md-4">
                  <label htmlFor="pc" className="form-label">Numéro d'assurance sociale</label>
                  <div className="input-group has-validation">
                    <input name='pc' type="number" className="form-control" />
                  </div>
                </div>


              </div>

            </div>
          </div>



          <div className='card'>
            <div className='cadr-header mt-2'>
              <img src="" width={40} className='p-2' />
              <label>Informations professionnelles</label>
            </div><hr className='bg-primary' />

            <div className='card-body p-2'>
              <div className='row'>

                <div className="col-md-4">
                  <label htmlFor="validationCustom04" className="form-label">Poste attribué</label>
                  <select className="form-control" id="validationCustom04" name='sexe'>
                    <option value="" disabled>Poste</option>
                  </select>
                </div>
                <div className="col-md-4">
                  <label htmlFor="validationCustom04" className="form-label"> Service</label>
                  <select className="form-control" id="validationCustom04" name='sexe'>
                    <option value="" disabled>Service</option>
                  </select>
                </div>

                <div className="col-md-4">
                  <label htmlFor="daterc" className="form-label">Date de recrutement </label>
                  <input
                    name='daterc'
                    type="date"
                    className="form-control"
                    id="daterc"

                  />
                </div>

                <div />
                <div />
              </div>

              <div className="row">
                <div className="col-md-4">
                  <label htmlFor="nve" className="form-label">Niveau  et type d'etudes</label>
                  <input name='nve' type="nve" className="form-control" />
                </div>
                <div className="col-md-4">
                  <label htmlFor="expr" className="form-label">Expériences </label>
                  <input name='expr' type="number" className="form-control" id="expr" />
                </div>
                <div className="col-md-4">
                  <label htmlFor="salaire" className="form-label">Salaire négocié</label>
                  <div className="input-group has-validation">
                    <input name='salaire' type="number" className="form-control" />
                  </div>
                </div>

              </div>
              <div className="row">
                <div className="col-md-4">
                  <label htmlFor="pc" className="form-label">Type de paiement</label>
                  <Select
                    value={PaimentOption}
                    onChange={handleChangePaiement}
                    options={Paiement}
                  />
                </div>

                <div className="col-md-4">
                  <label htmlFor="ccp" className="form-label">Numéro</label>
                  <div className="input-group has-validation">
                    <input name='ccp' type="number" className="form-control" />
                  </div>
                </div>


                <div className="col-md-4">
                  <label htmlFor="rq" className="form-label">Remarque</label>
                  <textarea name='rm' className="form-control" id="autres" rows={2} />
                </div>
              </div>
             
             <div className="row">
             <button type="button" className="btn btn-outline-info ">Enregistrer</button>
             </div>

            </div>
          </div>
        </div>

        



      </div>
    </>
  )
}

export default AjoutEnseignants
