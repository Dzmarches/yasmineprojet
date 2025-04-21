import React, { useEffect, useState } from 'react';
import axios from 'axios';
import conge from '../../assets/imgs/leave.png';
import moment from 'moment';
import fichier from '../../assets/imgs/fichier.png';


const DetailAutorisations = ({ demandeId }) => {

    const url = 'http://localhost:5000'

    const [demandeDetails, setDemandeDetails] = useState(null);

    useEffect(() => {
        const fetchDemandeDetails = async () => {
            if (demandeId) {
                try {
                    const response = await axios.get(`http://localhost:5000/justifications/detailDA/${demandeId}`);
                    console.log(response.data)
                    setDemandeDetails(response.data);
                } catch (error) {
                    console.error("Erreur lors de la récupération des détails de la demande:", error);
                }
            }
        };
        fetchDemandeDetails();
    }, [demandeId]);

    const isImage = (filename) => {
        return /\.(jpg|jpeg|png|gif)$/i.test(filename);
    };
    return (
        <div className="modal fade" id="detailemployeca" tabIndex="-1" aria-labelledby="modal-default-label" aria-hidden="true">
            <div className="modal-dialog modal-lg ">
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
                        <h5 className="custom-title ">Détails de la demande </h5>
                        <div className="card shadow-lg border-0 rounded-lg p-3 mb-4 mt-3">
                            <div className="row">
                                <div className="col-md-3">
                                    <label >Type de la demande :</label>
                                    <p> {demandeDetails ? demandeDetails.type_demande : "Chargement..."}</p>
                                </div>
                                <div className="col-md-3 mb-1">
                                    <label htmlFor="dateFin" >Statut</label>
                                    <p>{demandeDetails ?demandeDetails.statut:"Chargements..." }</p>
                                </div>
                                <div className="col-md-3 mb-1">
                                    <label htmlFor="dateDebut" >Du</label>
                                    <p>{demandeDetails ? moment(demandeDetails.dateDebut).format('YYYY-MM-DD') : "Chargement..."}</p>
                                </div>
                                <div className="col-md-3 mb-1">
                                    <label htmlFor="dateFin" >À</label>
                                    <p>{demandeDetails ? moment(demandeDetails.dateFin).format('YYYY-MM-DD') : "Chargement..."}</p>
                                </div>


                            </div>
                        </div>
                    </div>
                    <div className="modal-body">
                        <div className="card shadow-lg border-0 rounded-lg p-3 mb-4" style={{ marginTop: "-44px" }}>
                            <div className="row">
                            <div className="col-md-6 mb-1">
                                    <label htmlFor="commentaire">Commentaire</label>
                                    <p>{demandeDetails ? demandeDetails.commentaire : "Chargement..."}</p>
                                </div>
                                <div className="col-md-6 mb-1">
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
                                            demandeDetails ? window.open(url + demandeDetails.file, "_blank") : ''
                                        }}
                                    >
                                         {demandeDetails && demandeDetails.file ? (
                                                    isImage(demandeDetails.file) ? (
                                                        <img
                                                            src={url + demandeDetails.file}
                                                            alt="image"
                                                            style={{
                                                                width: "100%",
                                                                height: "100%",
                                                                objectFit: "cover",
                                                            }}
                                                        />
                                                    ) : (
                                                        <img
                                                            src= {fichier}
                                                            alt="Document"
                                                            style={{
                                                                width: "50px",
                                                                height: "50px",
                                                            }}
                                                        />)
                                                ) : null}
                                    </div>
                                </div>
                               
                            </div>
                            <div className="row">
                                <div className="col-12 text-center mt-4 ">
                                    <div className="modal-footer justify-content-between">
                                        <button type="button" className="btn btn-default" data-dismiss="modal">Fermer</button>
                                        <button type="button" className="btn btn-outline-primary">Ajouter</button>
                                    </div>
                                </div>
                            </div>
                            <hr/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DetailAutorisations;