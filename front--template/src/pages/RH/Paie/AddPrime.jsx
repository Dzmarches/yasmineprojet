import React, { useState } from 'react';
import prime from '../../../assets/imgs/prime.png';
import axios from 'axios';
import { useEffect } from 'react';
import moment from 'moment';

const AddPrime = ({ ListePrimes }) => {
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    code: "",
    type_prime: "",commentaire: "", montant: "",
    prime_cotisable: false,prime_imposable: false,
    montantType: "montant",identifiant_special: "",
    deduire: false,
  });


  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };


  const validateForm = () => {
    const newErrors = {};
    if (!formData.code) newErrors.code = "Le code est requis";
    if (!formData.type_prime) newErrors.type_prime = "Le type de prime est requis";
    if (!formData.montant && formData.montantType === 'montant') {
      newErrors.montant = "Le montant est requis";
    } else if (formData.montantType === 'pourcentage' && (isNaN(formData.montant) || parseFloat(formData.montant) <= 0 || parseFloat(formData.montant) > 100)) {
      newErrors.montant = "Le pourcentage doit être un nombre valide entre 0 et 100";
    } else if (formData.montantType === 'montant' && (isNaN(formData.montant) || parseFloat(formData.montant) <= 0)) {
      newErrors.montant = "Le montant doit être un nombre valide et supérieur à 0";
    }
    if (!formData.identifiant_special) newErrors.identifiant_special = "L'identifiant spécial est requis";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Vous devez être connecté");
        return;
      }
      // const payload = {
      //   ...formData,
      //   montant: formData.montantType === 'pourcentage' ? (parseFloat(formData.montant) / 100) * 1000 : parseFloat(formData.montant), // Exemple de calcul, remplacez "1000" par un montant réel si nécessaire
      // };
      // console.log("Données envoyées :", payload);
      const response = await axios.post('http://localhost:5000/primes/ajouter', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.status === 201) {
        alert('Prime ajoutée avec succès');
        setFormData({
          code: "",
          type_prime: "",
          commentaire: "",
          montant: "",
          prime_cotisable: false,
          prime_imposable: false,
          deduire: false,
          montantType: "montant",
          identifiant_special: "",

        });
        await ListePrimes();
        console.log(response.data);
      }
    } catch (error) {
      console.error("❌ Erreur Axios :", error);
      if (error.response) {
        console.log("📥 Réponse erreur serveur :", error.response);
        alert(`❌ Erreur ${error.response.status}: ${error.response.data.message || "Problème inconnu"}`);
      } else if (error.request) {
        console.log("❌ Aucune réponse reçue du serveur !");
        alert("❌ Erreur : Le serveur ne répond pas !");
      } else {
        console.log("❌ Erreur lors de la requête :", error.message);
        alert("❌ Une erreur est survenue !");
      }
    }
  };

  return (
    <div className="modal fade" id="addprime" tabIndex="-1" aria-labelledby="modal-default-label" aria-hidden="true">
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header bg-info text-white d-flex align-items-center justify-content-between" style={{ maxHeight: "70px" }}>
            <img src={prime} alt="Congé" width="50px" className="rounded-circle" />
            <button type="button" className="close text-white" data-dismiss="modal" aria-label="Close">
              &times;
            </button>
          </div>
          <div className="modal-body">
            <h5 className="custom-title mb-4">Ajouter une prime </h5>
          </div>
          <div className="modal-body">
            <div className="card shadow-lg border-0 rounded-lg p-3 mb-4" style={{ marginTop: "-44px" }}>
              <div className="row">
                <div className="col-md-4 mb-1">
                  <label>Code *</label>
                  <input type="text" className="form-control" name='code' value={formData.code} onChange={handleChange} />
                  {errors.code && <span className="text-danger">{errors.code}</span>}
                </div>

                <div className="col-md-4 mb-1">
                  <label>Identifiant spécial *</label>
                  <input
                    type="text"
                    className="form-control"
                    name="identifiant_special"
                    placeholder=""
                    value={formData.identifiant_special}
                    onChange={handleChange}
                  />
                  {errors.identifiant_special && <span className="text-danger">{errors.identifiant_special}</span>}
                </div>

                <div className="col-md-4 mb-1">
                  <label>Type *</label>
                  <input type="text" className="form-control" name='type_prime' value={formData.type_prime} onChange={handleChange} />
                  {errors.type_prime && <span className="text-danger">{errors.type_prime}</span>}
                </div>
              </div>
              <hr />

              <div className="row">
                <div className="col-md-12 mb-1">
                  <label>Montant, Pourcentage ou Jour *</label>
                  <div className="d-flex align-items-center gap-4 mt-2 mb-2">
                    <div className="form-check">
                      <input
                        type="radio"
                        id="montant"
                        name="montantType"
                        value="montant"
                        checked={formData.montantType === 'montant'}
                        onChange={handleChange}
                        className="form-check-input"
                        style={{ appearance: 'auto' }}
                      />
                      <label htmlFor="montant" className="form-check-label">
                        Montant
                      </label>
                      <small className='text-muted d-block'>
                        Le montant sera additionné.
                      </small>
                    </div>

                    <div className="form-check">
                      <input
                        type="radio"
                        id="pourcentage"
                        name="montantType"
                        value="pourcentage"
                        checked={formData.montantType === 'pourcentage'}
                        onChange={handleChange}
                        className="form-check-input"
                        style={{ appearance: 'auto' }}
                      />
                      <label htmlFor="pourcentage" className="form-check-label">
                        Pourcentage
                      </label>
                      <small className='text-muted d-block'>
                        Le salaire de base sera multiplié <br /> par le pourcentage.
                      </small>
                    </div>

                    <div className="form-check">
                      <input
                        type="radio"
                        id="jour"
                        name="montantType"
                        value="jour"
                        checked={formData.montantType === 'jour'}
                        onChange={handleChange}
                        className="form-check-input"
                        style={{ appearance: 'auto' }}
                      />
                      <label htmlFor="jour" className="form-check-label">
                        Jour
                      </label>
                      <small className='text-muted d-block'>
                        Le montant sera multiplié par le nombre de <br />jours de travail.
                      </small>
                    </div>
                  </div>

                  <div className="row mt-4">
                    {formData.montantType === "pourcentage" && (
                      <input
                        type="number"
                        className="form-control"
                        name="montant"
                        placeholder="Entrez une valeur en décimal (ex : 20% → 0.2)"
                        value={formData.montant}
                        onChange={handleChange}
                      />
                    )}

                    {formData.montantType === "montant" && (
                      <input
                        type="number"
                        className="form-control"
                        name="montant"
                        placeholder="Montant "
                        value={formData.montant}
                        onChange={handleChange}
                      />
                    )}

                    {formData.montantType === "jour" && (
                      <input
                        type="number"
                        className="form-control"
                        name="montant"
                        placeholder="montant de la prime de la journnée"
                        value={formData.montant}
                        onChange={handleChange}
                      />
                    )}
                  </div>
                  {errors.montant && <span className="text-danger">{errors.montant}</span>}
                </div>
              </div>

              <hr />
              <div className="row">
                <div className="col-md-4 mb-1">
                  <label>
                    <input
                      type="checkbox"
                      name="prime_cotisable"
                      checked={formData.prime_cotisable}
                      onChange={handleChange}
                    />
                    &nbsp;Prime Cotisable
                  </label>
                </div>
                <div className="col-md-4 mb-1">
                  <label>
                    <input
                      type="checkbox"
                      name="prime_imposable"
                      checked={formData.prime_imposable}
                      onChange={handleChange}
                    />
                    &nbsp; Prime Imposable
                  </label>
                </div>

                {(formData.montantType !== "montant" &&
                  <div className="col-md-4 mb-1">
                    <label>
                      <input
                        type="checkbox"
                        name="deduire"
                        checked={formData.deduire}
                        onChange={handleChange}
                      />
                      &nbsp;  Calculer en fonction des jours de présence
                    </label>
                    {/* <small className="text-muted d-block">
                   Calculer en fonction des jours de présence 
                  </small> */}
                  </div>

                )}

              </div>
              <div className="row">
                <div className="col-12 text-center mt-4">
                  <div className="modal-footer justify-content-between">
                    <button type="button" className="btn btn-default" data-dismiss="modal">Fermer</button>
                    <button type="button" className="btn btn-outline-primary" onClick={handleSave}>Ajouter</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddPrime;
