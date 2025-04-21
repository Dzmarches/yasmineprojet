import React, { useEffect, useState } from 'react'
import Select from 'react-select';
import { StatutPointage } from '../../RH/Employes/OptionSelect'
import conge from '../../../assets/imgs/leave.png'
import axios from 'axios';
import moment from 'moment';
import fichier from '../../../assets/imgs/fichier.png';


const ModifierCA = ({ IDemande, IDEmploye }) => {
    const url = 'http://localhost:5000'


    const [demandeEmploye, setDemandeEmploye] = useState(null);
    const [selectedStatut, setSelectedStatut] = useState(null);
    const [remarque, setRemarque] = useState('');
    const [droitsConges, setDroitsConges] = useState(null);
    const [deduireCongeAnnuel, setDeduireCongeAnnuel] = useState(false); // État pour le checkbox

    const handleStatutChange = (selectedOption) => {
        setSelectedStatut(selectedOption);
        console.log("Statut sélectionné:", selectedOption);
    };

    const statutOptions = [
        { value: 'Accepté', label: 'Accepté' },
        { value: 'Refusé', label: 'Refusé' },
        { value: 'En attente', label: 'En attente' }
    ];

    useEffect(() => {
        const fetchDemandeDetails = async () => {
            if (IDemande) {
                try {
                    const token = localStorage.getItem("token");
                    if (!token) {
                        alert("Vous devez être connecté ");
                        return;
                    }
                    const response = await axios.get(`http://localhost:5000/congeAbsence/demandeEmploye/${IDemande}`,
                        {
                            headers: {
                                Authorization: `Bearer ${token}`,
                                "Content-Type": "application/json",
                            },
                        }
                    );
                    setDemandeEmploye(response.data);
                    console.log("data state", demandeEmploye);
                } catch (error) {
                    console.error("Erreur lors de la récupération des détails de la demande:", error);
                }
            }
        };

        fetchDemandeDetails();
    }, [IDemande]);

    // les droit du conges
    // useEffect(() => {
    //     const fetchConges = async () => {
    //         try {
    //             const response = await axios.get(`http://localhost:5000/congeAbsence/CongesDroit/${IDemande}`);
    //             setDroitsConges(response.data.jours_de_conge);
    //             console.log('wvwvw',response.data.jours_de_conge)
    //             // alert(response.data.message)
    //         } catch (error) {
    //             console.error('Erreur lors de la récupération des congés:', error);
    //         }
    //     };

    //     fetchConges();
    // }, [IDEmploye]);


    //traaiter la demande t modifer

    const handleSubmit = async () => {

        if (!selectedStatut) {
            alert("Veuillez sélectionner un statut.");
            return;
        }
        const updatedData = {
            statut: selectedStatut.value,
            remarque: remarque,
            deduireCongeAnnuel: deduireCongeAnnuel,
        };
        console.log('Remarque:', updatedData.remarque);

        try {
            const token = localStorage.getItem("token");
            if (!token) {
                alert("Vous devez être connecté ");
                return;
            }
            const response = await axios.put(
                `http://localhost:5000/congeAbsence/ModifierStautdemande/${IDemande}`,
                updatedData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            if (response.status === 200) {
                alert("Demande mise à jour avec succès.");
            }


        } catch (error) {
            if (error.status === 404) {
                alert(error.response.data.message);
            } else {
                alert("Erreur lors de la mise à jour de la demande.");
            }

        }

    };

    const isImage = (filename) => {
        return /\.(jpg|jpeg|png|gif)$/i.test(filename);
    };

    return (
        <div className="modal fade" id="ModifierCA" tabIndex="-1" aria-labelledby="modal-default-label" aria-hidden="true">
            <div className="modal-dialog modal-lg">
                <div className="modal-content">
                    <div className="modal-header bg-info text-white">
                        <div className="widget-user-header d-flex align-items-center">
                            <div className="widget-user-image">
                                <img src={conge} alt="Congé" width="70px" />
                            </div>
                        </div>
                        <button type="button" className="close text-white" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>

                    <div className="modal-body ">
                        <h5 className="custom-title ">Traiter la demande </h5>
                    </div>

                    <div className="modal-body ">
                        <div className="card shadow-lg border-0 rounded-lg p-4 mb-4 mt-2" style={{ marginTop: "-44px" }}>
                            <div className="row">
                                <div className="col-md-4 mb-3">
                                    <label htmlFor="dateDebut" className="font-weight-bold">Nom et Prénom</label>
                                    <p>{demandeEmploye ? (demandeEmploye.Employe?.User.nom + " " + demandeEmploye.Employe?.User.prenom) : ''}</p>
                                </div>
                                <div className="col-md-4 mb-3">
                                    <label htmlFor="dateFin" className="font-weight-bold">Poste</label>
                                    <p>{demandeEmploye ? demandeEmploye.Employe.Poste.poste : ''} </p>
                                </div>
                                <div className="col-md-4 mb-3">
                                    <label htmlFor="dateFin" className="font-weight-bold">Numéro du téléphone</label>
                                    <p>{demandeEmploye ? demandeEmploye.Employe.User.telephone : ''} </p>
                                </div>

                            </div>
                            <hr />
                            <div className="row">
                                <div className="col-md-3 mb-3">
                                    <label htmlFor="dateDebut" className="font-weight-bold">Type de la demande</label>
                                    <p>{demandeEmploye ? (demandeEmploye.type_demande) : ''}</p>
                                </div>
                                <div className="col-md-3 mb-3">
                                    <label htmlFor="dateFin" className="font-weight-bold">Du</label>
                                    <p>{demandeEmploye ? moment(demandeEmploye.dateDebut).format('YYYY-MM-DD') : ''} </p>
                                </div>
                                <div className="col-md-3 mb-3">
                                    <label htmlFor="dateFin" className="font-weight-bold">à</label>
                                    <p>{demandeEmploye ? moment(demandeEmploye.dateFin).format('YYYY-MM-DD') : ''} </p>
                                </div>
                                <div className="col-md-3 mb-3">
                                    <label htmlFor="dateFin" className="font-weight-bold">Nombre du jour a consommé</label>
                                    <p>
                                        {demandeEmploye ?
                                            `${moment(demandeEmploye.dateFin).diff(moment(demandeEmploye.dateDebut), 'days') + 1} jours`
                                            : ''
                                        }
                                    </p>
                                </div>
                            </div>
                            <hr />
                            <div className="row">

                                {/* <div className="col-md-4 mb-3">
                                    <label >Droit du congé</label>
                                    <p>{droitsConges ? `${droitsConges} jours` : 'Droit de congé non disponible'}</p>
                                </div> */}


                                <div className="col-md-4 mb-3">
                                    <label htmlFor="dateFin" className="font-weight-bold">Statut</label>
                                    <p>{demandeEmploye ? demandeEmploye.statut : ''} </p>
                                </div>
                                <div className="col-md-4 mb-3">
                                    <label htmlFor="dateFin" className="font-weight-bold">jours restant</label>
                                    <p>{demandeEmploye ? demandeEmploye.jour_restant : ''} </p>
                                </div>

                                <div className="col-md-4 mb-1">
                                    <label htmlFor="justif">ma justifictaion</label>
                                    <div
                                        style={{
                                            width: "80px",
                                            height: "80px",
                                            border: "2px solid gray",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            overflow: "hidden",
                                            cursor: "pointer",
                                            padding: "5px",
                                        }}
                                        onClick={() => {
                                            demandeEmploye ? window.open(url + demandeEmploye.fichier, "_blank") : ''
                                        }}
                                    >
                                        {demandeEmploye && demandeEmploye.fichier ? (
                                            isImage(demandeEmploye.fichier) ? (
                                                <img
                                                    src={url + demandeEmploye.fichier}
                                                    alt="image"
                                                    style={{
                                                        width: "100%",
                                                        height: "100%",
                                                        objectFit: "cover",
                                                    }}
                                                />
                                            ) : (
                                                <img
                                                    src={fichier}
                                                    alt="Document"
                                                    style={{
                                                        width: "50px",
                                                        height: "50px",
                                                    }}
                                                />
                                            )
                                        ) : null}
                                    </div>
                                </div>

                            </div>
                            <hr />
                            <div className="row">
                                <div className="col-12 mb-3">
                                    <label htmlFor="dateFin" className="font-weight-bold">Commentaire</label>
                                    <p>{demandeEmploye ? demandeEmploye.commentaire : ''} </p>
                                </div>
                            </div>
                            <hr />
                            <div className="row">
                                <div className="col-md-12 mb-3">
                                    <label htmlFor="remarque">Remarque</label>
                                    <p>{demandeEmploye ? demandeEmploye.motif : ''} </p>
                                </div>
                            </div>
                            <hr />

                            <div className="row">
                                {(demandeEmploye?.statut != 'Accepté') &&(
                                    
                                    <div className="col-md-4">
                                        <label >Changer le statut</label>
                                        <Select
                                            id="status"
                                            value={selectedStatut}
                                            onChange={handleStatutChange}
                                            options={statutOptions}
                                            placeholder="Sélectionner un statut"
                                            name='status'
                                        />
                                    </div>
                                )}
                                <div className="col-md-8 mb-3">
                                    <label htmlFor="remarque">Remarque</label>
                                    <textarea
                                        id="remarque"
                                        name="remarque"
                                        className="form-control"
                                        placeholder="Ajouter une remarque"
                                        rows="2"
                                        value={remarque}
                                        onChange={(e) => setRemarque(e.target.value)}
                                    />
                                </div>

                                {demandeEmploye?.type_demande !== 'Congé Annuel' && (
                                    <div className="row">
                                        <div className="col-md-12 mb-3">
                                            <label>
                                                <input
                                                    type="checkbox"
                                                    checked={deduireCongeAnnuel}
                                                    onChange={(e) => setDeduireCongeAnnuel(e.target.checked)}
                                                />
                                                Déduire les jours de congé annuel
                                            </label>
                                        </div>
                                    </div>
                                )}

                            </div>
                            <div className="row">
                                <div className="col-12 text-center">
                                    <button className='btn btn-outline-primary mt-3' onClick={handleSubmit}>Modifier</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ModifierCA;
