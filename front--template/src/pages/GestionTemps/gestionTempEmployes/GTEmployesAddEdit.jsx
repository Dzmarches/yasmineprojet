
import React, { useState } from 'react';
import Select from 'react-select';
import rh from '../../../assets/imgs/employe.png';
import { Link, useParams } from 'react-router-dom';

const GTEmployesAddEdit = () => {
  return (
    <>
     <nav className='mb-2'>
        <Link to="/">Accueil</Link>
        <span> / </span>
        <Link to="/employes">Gestion des ressource humaines</Link>
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
              <img src="" width={40} className='p-2' />
              <label>Informations Personnels</label>
            </div><hr className='bg-primary' />

          </div>
          <div className='card'>
            <div className='cadr-header mt-2'>
              <img src="" width={40} className='p-2' />
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
        </div>
      </div>

    </>
  )
}

export default GTEmployesAddEdit
