import React from 'react';
import rh from '../../assets/imgs/employe.png';

const ProfileEmploye = () => {
    return (
        <div className="modal fade" id="modal-default" tabIndex="-1" aria-labelledby="modal-default-label" aria-hidden="true">
            <div className="modal-dialog modal-lg modal-dialog-scrollable">
                <div className="modal-content">
                    <div className="modal-header widget-user-2 bg-info text-white">
                        <div className="widget-user-header d-flex justify-content-start align-items-center">
                            <div className="widget-user-image">
                                <img className="img-circle elevation-2" src={rh} alt="Profile" />
                            </div>
                            <div className="ml-3">
                                <h3 className="widget-user-username">Chikh Dounia</h3>
                                <h5 className="widget-user-desc">Enseignant</h5>
                            </div>
                        </div>
                        <button type="button" className="close text-white" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>

                    <div className="modal-body">
                        {/* Informations Personnelles */}
                        <h5 className="custom-title mb-4">Informations Personnelles</h5>
                        <div className="card shadow-lg border-0 rounded-lg p-4 mb-4">
                            <div className="row">
                                <div className="col-md-4">
                                    <h6 className="font-weight-bold">Nom</h6>
                                    <p>Chika</p>
                                </div>
                                <div className="col-md-4">
                                    <h6 className="font-weight-bold">Prénom</h6>
                                    <p>Dounia</p>
                                </div>
                                <div className="col-md-4">
                                    <h6 className="font-weight-bold">Numéro de téléphone</h6>
                                    <p>079998123</p>
                                </div>
                            </div>
                            <hr />
                            <div className="row">
                            <div className="col-md-4">
                                    <h6 className="font-weight-bold">Nom en français</h6>
                                    <p>Chika</p>
                                </div>
                                <div className="col-md-4">
                                    <h6 className="font-weight-bold">Prénom en français</h6>
                                    <p>Dounia</p>
                                </div>
                                <div className="col-md-4">
                                    <h6 className="font-weight-bold">Email</h6>
                                    <p>dounia@gmail.com</p>
                                </div>
                            </div>
                            <hr />
                            <div className="row">
                               

                                <div className="col-md-4">
                                    <h6 className="font-weight-bold">Date de naissance</h6>
                                    <p>01/01/1995</p>
                                </div>
                                <div className="col-md-4">
                                    <h6 className="font-weight-bold">Lieu de naissance</h6>
                                    <p>Alger</p>
                                </div>
                                <div className="col-md-4">
                                    <h6 className="font-weight-bold">Lieu de naissance en arabe</h6>
                                    <p>Alger</p>
                                </div>
                            </div>
                            <hr />
                            <div className="row">
                            <div className="col-md-4">
                                    <h6 className="font-weight-bold">Nationalité</h6>
                                    <p>Française</p>
                                </div>
                                <div className="col-md-4">
                                    <h6 className="font-weight-bold">Nombre d'enfants</h6>
                                    <p>3</p>
                                </div>
                                <div className="col-md-4">
                                    <h6 className="font-weight-bold">Situation familiale</h6>
                                    <p>Mariée</p>
                                </div>
                            </div>
                            <hr/>
                            <div className="row">
                            <div className="col-md-4">
                                    <h6 className="font-weight-bold">Sexe</h6>
                                    <p>lorem</p>
                                </div>
                            
                            <div className="col-md-8">
                                    <h6 className="font-weight-bold">Adresse</h6>
                                    <p>ahhhhdd</p>
                                </div>
                            </div>
                        </div>

                        {/* Identifiants Administratifs */}
                        <h5 className="custom-title mb-4">Identifiants Administratifs</h5>
                        <div className="card shadow-lg border-0 rounded-lg p-4 mb-4">
                            <div className="row">
                                <div className="col-md-4">
                                    <h6 className="font-weight-bold">Type de pièce d'identité</h6>
                                    <p>CIN</p>
                                </div>
                                <div className="col-md-4">
                                    <h6 className="font-weight-bold">Numéro d'identification</h6>
                                    <p>1234567890</p>
                                </div>
                                <div className="col-md-4">
                                    <h6 className="font-weight-bold">Numéro de permis de conduire</h6>
                                    <p>A1234567</p>
                                </div>
                               
                            </div>
                            <div className="row">
                            <div className="col-md-4">
                                    <h6 className="font-weight-bold">Numero d'assurance sociale</h6>
                                    <p>A1234567</p>
                                </div>
                            </div>
                        </div>

                        {/* Informations Professionnelles */}
                        <h5 className="custom-title mb-4">Informations Professionnelles</h5>
                        <div className="card shadow-lg border-0 rounded-lg p-4">
                            <div className="row">
                                <div className="col-md-4">
                                    <h6 className="font-weight-bold">Poste attribué</h6>
                                    <p>Professeur</p>
                                </div>
                                <div className="col-md-4">
                                    <h6 className="font-weight-bold">Service</h6>
                                    <p>Mathematiques</p>
                                </div>
                                <div className="col-md-4">
                                    <h6 className="font-weight-bold">Date de recrutement</h6>
                                    <p>01/09/2019</p>
                                </div>
                            </div>
                            <hr />
                            <div className="row">
                                <div className="col-md-4">
                                    <h6 className="font-weight-bold">Niveau et type d'études</h6>
                                    <p>Licence en Mathématiques</p>
                                </div>
                                <div className="col-md-4">
                                    <h6 className="font-weight-bold">Expériences</h6>
                                    <p>5 ans dans l'enseignement</p>
                                </div>
                                <div className="col-md-4">
                                    <h6 className="font-weight-bold">Salaire négocié</h6>
                                    <p>2500€</p>
                                </div>
                            </div>
                            <hr />
                            <div className="row">
                                <div className="col-md-4">
                                    <h6 className="font-weight-bold">Type de paiement</h6>
                                    <p>Virement bancaire</p>
                                </div>
                                <div className="col-md-4">
                                    <h6 className="font-weight-bold">Numéro de compte</h6>
                                    <p>FR123456789</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProfileEmploye;
