import React, { useState } from 'react'
import Select from 'react-select/base';
import { StatutPointage } from '../../RH/Employes/OptionSelect'
import conge from '../../../assets/imgs/leave.png'



const AddEditConge = () => {
    const [selectedOption, setSelectedOption] = useState(null);
   
  
    const handleChange = selectedOption => {
      setSelectedOption(selectedOption);
    };
  
  return (
    <div className="modal fade" id="addEditConge" tabIndex="-1" aria-labelledby="modal-default-label" aria-hidden="true">
      <div className="modal-dialog modal-lg ">
        <div className="modal-content">
          <div className="modal-header bg-info text-white">
            <div className="widget-user-header d-flex align-items-center">
              <div className="widget-user-image">
                <img  src={conge} alt="Congé"  width="70px"/>
              </div>
          </div>
          
          <button type="button" className="close text-white" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>

        <div className="modal-body ">
                    <h5 className="custom-title ">Ajouter un Congé</h5>
          <div className="card shadow-lg border-0 rounded-lg p-3 mb-4">
            <div className="row">
              <div className="col-md-12">
                <label >Employé</label>
                <Select
                  value=""
                  options=""
                />
              </div>
            </div>
        
            <div className="row">
              <div className="col-md-12">
                <label>Type du congé</label>
                <Select
                  value=""
                  options=""
                />
              </div>
            </div>
          </div>
        </div>
        <div className="modal-body">
            <div className="card shadow-lg border-0 rounded-lg  p-4 mb-4" style={{marginTop:"-44px"}}>
            <div className="row">
                <div className="col-md-4 mb-3">
                  <label htmlFor="dateDebut" className="font-weight-bold">Du</label>
                  <input
                    type="datetime-local"
                    id="dateDebut"
                    name="dateDebut"
                    className="form-control"
                  />
                </div>
                <div className="col-md-4 mb-3">
                  <label htmlFor="dateFin" className="font-weight-bold">À</label>
                  <input
                    type="datetime-local"
                    id="dateFin"
                    name="dateFin"
                    className="form-control"
                  />
                </div>
                <div className="col-md-4 mb-3">
                  <label htmlFor="statut">Statut</label>
                  <Select
                    id="statut"
                    value={selectedOption}
                    onChange={handleChange}
                    options={StatutPointage}
                    placeholder="Sélectionner un statut"
                    className="react-select"
                  />
                </div>
              </div>

              <div className="row">
                <div className="col-md-12 mb-3">
                  <label htmlFor="remarque">Remarque</label>
                  <textarea
                    id="remarque"
                    name="remarque"
                    className="form-control"
                    placeholder="Ajouter une remarque"
                    rows="3"
                  />
                </div>
              </div>
              <div className="row">
                <div className="col-12 text-center ">
                <button className='btn btn-outline-primary'>Ajouter</button>
                </div>
              </div>
            </div>
          </div>

        
      </div>
    </div>
  </div>
  )
}

export default AddEditConge
