import React, { useEffect, useRef, useState } from 'react';
import rh from '../../../assets/imgs/employe.png';
import axios from 'axios';
import moment from 'moment'
import printer from '../../../assets/imgs/printer.png';
const ProfileEmploye = ({ employeId }) => {

    const [employe, setEmploye] = useState(null);
    console.log('profileEmploye');

    const url = "http://localhost:5000"
    useEffect(() => {
        if (employeId) {

            const fetchEmploye = async () => {
                try {
                    const token = localStorage.getItem("token");
                    if (!token) {
                        alert("Vous devez être connecté pour soumettre le formulaire.");
                        return;
                    }
                    const response = await axios.get(`http://localhost:5000/employes/employe/${employeId}`, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json",
                        },
                    });
                    setEmploye(response.data);
                } catch (error) {
                    console.error('Erreur lors de la récupération des informations de l\'employé', error);
                }
            };
            fetchEmploye();
        }
    }, [employeId]);
    if (!employe) {
        return <p>Chargement...</p>;
    }

    const handlePrint = () => {
        const printWindow = window.open('', '', 'width=1000,height=800');
        printWindow.document.write(`
            <html>
              <head>
                <title>Profil de l'employé</title>
                <style>
                @page{margin:0}
                  body {
                    font-family: "Times New Roman";
                    padding: 10px;
                    background-color: #f9f9f9;
                    
                  }
                  .print-container {
                    border: 2px solid #333;
                    padding: 10px;
                    border-radius: 10px;
                    background-color: #fff;
                  }
                  h2, h4 {
                    text-align: center;
                    margin-bottom: 2px;
                  }
                  h5 {
                    background-color: #007bff;
                    color: white;
                    padding: 2px;
                    border-radius: 5px;
                  }
                  table {
                    width: 100%;
                    border-collapse: collapse;
                    margin-bottom: 10px;
                  }
                  table, th, td {
                    border: 1px solid #ccc;
                  }
                  th, td {
                    padding: 5px;
                    text-align: left;
                  }
                  .section {
                    margin-top: 10px;
                  }
                  img.profile {
                    width: 80px;
                    border-radius: 50%;
                  }
                  .header-row {
                    display: flex;
                    align-items: center;
                    gap: 20px;
                    margin-bottom: 10px;
                  }
                </style>
              </head>
              <body>
                <div class="print-container">
                  <div class="header-row">
                    <img class="profile" src="${url + employe.photo}" alt="Photo de l'employé" />
                    <div>
                      <h2>Profil de ${employe.User?.nom} ${employe.User?.prenom}</h2>
                      <p>Poste : ${employe?.Poste?.poste}</p>
                    </div>
                  </div>
    
                  <div class="section">
                    <h5>Informations Personnelles</h5>
                    <table>
                      <tr>
                        <th>Nom</th>
                        <td>${employe.User?.nom}</td>
                        <th>Prénom</th>
                        <td>${employe.User?.prenom}</td>
                      </tr>
                      <tr>
                        <th>Nom en arabe</th>
                        <td>${employe.User?.nom_ar}</td>
                        <th>Prénom en arabe</th>
                        <td>${employe.User?.prenom_ar}</td>
                      </tr>
                      <tr>
                        <th>Téléphone</th>
                        <td>${employe.User?.telephone}</td>
                        <th>Email</th>
                        <td>${employe.User?.email}</td>
                      </tr>
                      <tr>
                        <th>Date de naissance</th>
                        <td>${moment(employe.User?.datenaiss).format('YYYY-MM-DD')}</td>
                        <th>Lieu de naissance</th>
                        <td>${employe.User?.lieuxnaiss}</td>
                      </tr>
                      <tr>
                        <th>Nationalité</th>
                        <td>${employe.User?.nationalite}</td>
                        <th>Situation familiale</th>
                        <td>${employe.sitfamiliale}</td>
                      </tr>
                      <tr>
                        <th>Adresse</th>
                        <td>${employe.User?.adresse}</td>
                        <th>Adresse (arabe)</th>
                        <td>${employe.User?.adresse_ar}</td>
                      </tr>
                    </table>
                  </div>
    
                  <div class="section">
                    <h5>Identifiants Administratifs</h5>
                    <table>
                      <tr>
                        <th>Type de pièce d'identité</th>
                        <td>${employe.TypePI}</td>
                        <th>Numéro de la pièce</th>
                        <td>${employe.NumPI}</td>
                      </tr>
                      <tr>
                        <th>Numéro de permis de conduire</th>
                        <td>${employe.NumPC}</td>
                        <th>Numéro d'assurance sociale</th>
                        <td>${employe.NumAS}</td>
                      </tr>
                    </table>
                  </div>
    
                  <div class="section">
                    <h5>Informations Professionnelles</h5>
                    <table>
                      <tr>
                        <th>Poste</th>
                        <td>${employe.Poste?.poste}</td>
                        <th>Service</th>
                        <td>${employe.Service?.service}</td>
                      </tr>
                      <tr>
                        <th>Date de recrutement</th>
                        <td>${moment(employe.daterecru).format('YYYY-MM-DD')}</td>
                        <th>Type de contrat</th>
                        <td>${employe.TypeContrat}</td>
                      </tr>
                      <tr>
                        <th>Date fin contrat</th>
                        <td>${moment(employe.DateFinContrat).format('YYYY-MM-DD')}</td>
                        <th>Niveau / Type d'études</th>
                        <td>${employe.NVTetudes}</td>
                      </tr>
                      <tr>
                        <th>Expériences</th>
                        <td>${employe.Experience}</td>
                        <th>Salaire négocié</th>
                        <td>${employe.SalairNeg}</td>
                      </tr>
                      <tr>
                        <th>Type de paiement</th>
                        <td>${employe.Typepai}</td>
                        <th>Numéro de compte</th>
                        <td>FR123456789</td>
                      </tr>
                      <tr>
                        <th>Nom d'utilisateur</th>
                        <td>${employe.User?.username}</td>
                        <th></th>
                        <td></td>
                      </tr>
                    </table>
                  </div>
    
                  <div class="section">
                    <h5>Horaires</h5>
                    <table>
                      <tr>
                        <th>Entrée matin</th>
                        <td>${employe.HeureEM}</td>
                        <th>Sortie matin</th>
                        <td>${employe.HeureSM}</td>
                      </tr>
                      <tr>
                        <th>Entrée après-midi</th>
                        <td>${employe.HeureEAM}</td>
                        <th>Sortie après-midi</th>
                        <td>${employe.HeureSAM}</td>
                      </tr>
                    </table>
                  </div>
                    <div class="section">
                    <h5>Abattement</h5>
                    <table>
                      <tr>
                        <th>Appliquer l'abattement</th>
                        <td>${employe.abattement}</td>
                       <th>Taux d'abattement</th>
                        <td>${employe.tauxabt}</td>
                      </tr>
                      <tr>
                        <th>Date d'abattement</th>
                        <td>${employe.dateabt?moment(employe.dateabt).format('YYYY-MM-DD'):''}</td>
                        <th>Declaration a la CNAS</th>
                        <td>${employe.declaration==1?'Oui':'Non'}</td>
                      </tr>
                    </table>
                  </div>
    
                  <div class="section">
                    <h5>Remarques</h5>
                    <p>${employe.remarque || "Aucune remarque."}</p>
                  </div>
    
                </div>
              </body>
            </html>
        `);
        printWindow.document.close();
        printWindow.focus();
        printWindow.print();
        printWindow.close();
    };
    
    
    

    //  const ImageProtegee = ({ imagePath }) => {
    //           const [imageSrc, setImageSrc] = useState("");

    //           useEffect(() => {
    //               const fetchImage = async () => {
    //                   try {
    //                       const response = await fetch(`http://localhost:5000${imagePath}`, {
    //                           headers: {
    //                               Authorization: `Bearer ${localStorage.getItem('token')}`
    //                           }
    //                       });

    //                       if (!response.ok) {
    //                           throw new Error("Erreur lors du chargement de l'image");
    //                       }
    //                       const imageBlob = await response.blob();
    //                       setImageSrc(URL.createObjectURL(imageBlob));
    //                   } catch (error) {
    //                       console.error(error);
    //                   }
    //               };

    //               fetchImage();
    //           }, [imagePath]);

    //           return imageSrc ? <img  className="img-circle elevation-2" src={imageSrc} alt="Photo de l'employé" width="60px"/> : <p>Chargement...</p>;
    //       };
    return (
        <div className="modal fade" id="modal-default" tabIndex="-1" aria-labelledby="modal-default-label" aria-hidden="true">
            <div className="modal-dialog modal-lg modal-dialog-scrollable">
                <div className="modal-content">

                    <div className="modal-header widget-user-2 bg-info text-white">
                        <div className="widget-user-header d-flex justify-content-start align-items-center">
                            <div className="">
                                {/* <ImageProtegee imagePath={employe.photo} /> */}
                                <img src={url + employe.photo} alt="Photo de l'employé" width="90px" style={{borderRadius: '50%'}}/>
                            </div>
                            <div className="ml-3">
                                <h5 className="widget-user-username">Profile du :{employe.User?.nom} {employe.User.prenom}</h5>
                                <p className="widget-user-desc">Poste : {employe?.Poste.poste}</p>
                                <p className="widget-user-desc">Staut : {employe?.User?.statuscompte}</p>
                            </div>
                        </div>


                      
                        <button className='btn btn-outline-secondary mt-5 ml-5' >
                            <img src={printer} alt="" width="22px" title='Imprimer le profile' onClick={() => handlePrint()} />
                        </button>
                        <button type="button" className="close text-white" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>

                    </div>

                    <div className="modal-body" >
                        {/* Informations Personnelles */}
                        <h5 className="custom-title mb-4">Informations Personnelles</h5>
                       
                        <div className="card shadow-lg border-0 rounded-lg p-4 mb-4">
                            <div className="row">
                                <div className="col-md-4">
                                    <h6 className="font-weight-bold">Nom</h6>
                                    <p>{employe.User?.nom}</p>
                                </div>
                                <div className="col-md-4">
                                    <h6 className="font-weight-bold">Prénom</h6>
                                    <p>{employe.User?.prenom}</p>
                                </div>
                                <div className="col-md-4">
                                    <h6 className="font-weight-bold">Numéro de téléphone</h6>
                                    <p>{employe.User?.telephone}</p>
                                </div>
                            </div>
                            <hr />
                            <div className="row">
                                <div className="col-md-4">
                                    <h6 className="font-weight-bold">Nom en arabe</h6>
                                    <p>{employe.User?.nom_ar}</p>
                                </div>
                                <div className="col-md-4">
                                    <h6 className="font-weight-bold">Prénom en arabe</h6>
                                    <p>{employe.User?.prenom_ar}</p>
                                </div>
                                <div className="col-md-4">
                                    <h6 className="font-weight-bold">Email</h6>
                                    <p>{employe.User?.email}</p>
                                </div>
                            </div>
                            <hr />
                            <div className="row">
                                <div className="col-md-4">
                                    <h6 className="font-weight-bold">Date de naissance</h6>
                                    <p>{moment(employe.User?.datenaiss).format('YYYY-MM-DD')}</p>
                                </div>
                                <div className="col-md-4">
                                    <h6 className="font-weight-bold">Lieu de naissance</h6>
                                    <p>{employe.User?.lieuxnaiss}</p>
                                </div>
                                <div className="col-md-4">
                                    <h6 className="font-weight-bold">Lieu de naissance en arabe</h6>
                                    <p>{employe.User?.lieuxnaiss_ar}</p>
                                </div>
                            </div>
                            <hr />
                            <div className="row">
                                <div className="col-md-4">
                                    <h6 className="font-weight-bold">Nationalité</h6>
                                    <p>{employe.User?.nationalite}</p>
                                </div>
                                <div className="col-md-4">
                                    <h6 className="font-weight-bold">Nombre d'enfants</h6>
                                    <p>{employe.nbrenfant}</p>
                                </div>
                                <div className="col-md-4">
                                    <h6 className="font-weight-bold">Situation familiale</h6>
                                    <p>{employe.sitfamiliale}</p>
                                </div>
                            </div>
                            <hr />
                            <div className="row">
                                <div className="col-md-4">
                                    <h6 className="font-weight-bold">Sexe</h6>
                                    <p>{employe.User?.sexe}</p>
                                </div>
                                <div className="col-md-4">
                                    <h6 className="font-weight-bold">Adresse</h6>
                                    <p>{employe.User?.adresse}</p>
                                </div>
                                <div className="col-md-4">
                                    <h6 className="font-weight-bold">Adresse en arabe</h6>
                                    <p>{employe.User?.adresse_ar}</p>
                                </div>
                            </div>
                        </div>
                        {/* Identifiants Administratifs */}
                        <h5 className="custom-title mb-4">Identifiants Administratifs</h5>
                        <div className="card shadow-lg border-0 rounded-lg p-4 mb-4">
                            <div className="row">
                                <div className="col-md-4">
                                    <h6 className="font-weight-bold">Type de pièce d'identité</h6>
                                    <p>{employe.TypePI}</p>
                                </div>
                                <div className="col-md-4">
                                    <h6 className="font-weight-bold">Numéro d'identification de la piéce</h6>
                                    <p>{employe.NumPI}</p>
                                </div>
                                <div className="col-md-4">
                                    <h6 className="font-weight-bold">Numéro de permis de conduire</h6>
                                    <p>{employe.NumPC}</p>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-4">
                                    <h6 className="font-weight-bold">Numero d'assurance sociale</h6>
                                    <p>{employe.NumAS}</p>
                                </div>
                            </div>
                        </div>

                        {/* Informations Professionnelles */}
                        <h5 className="custom-title mb-4">Informations Professionnelles</h5>
                        <div className="card shadow-lg border-0 rounded-lg p-4">
                            <div className="row">
                                <div className="col-md-4">
                                    <h6 className="font-weight-bold">Poste attribué</h6>
                                    <p>{employe.Poste ? employe.Poste.poste : 'pas  de poste '}</p>
                                </div>
                                <div className="col-md-4">
                                    <h6 className="font-weight-bold">Service</h6>
                                    {/* <p>{employe.Service? employe.Service.service :"pas de  service"}</p> */}
                                    <p>{employe.Service.service}</p>

                                </div>
                                <div className="col-md-4">
                                    <h6 className="font-weight-bold">Date de recrutement</h6>
                                    <p>{moment(employe.daterecru).format('YYYY-MM-DD')}</p>
                                </div>
                            </div>
                            <hr />
                            <div className="row">
                                <div className="col-md-4">
                                    <h6 className="font-weight-bold">Niveau et type d'études</h6>
                                    <p>{employe.NVTetudes}</p>
                                </div>
                                <div className="col-md-4">
                                    <h6 className="font-weight-bold">Expériences</h6>
                                    <p>{employe.Experience}</p>
                                </div>
                                <div className="col-md-4">
                                    <h6 className="font-weight-bold">Salaire négocié</h6>
                                    <p>{employe.SalairNeg}</p>
                                </div>
                            </div>
                            <hr />
                            <div className="row">
                                <div className="col-md-4">
                                    <h6 className="font-weight-bold">Type de paiement</h6>
                                    <p>{employe.Typepai}</p>
                                </div>
                                <div className="col-md-4">
                                    <h6 className="font-weight-bold">Numéro de compte</h6>
                                    <p>FR123456789</p>
                                </div>
                                <div className="col-md-4">
                                    <h6 className="font-weight-bold">Nom d'utilisateur</h6>
                                    <p>{employe.User?.username}</p>
                                </div>
                            </div>
                            <hr />

                            <div className="row">
                                <div className="col-md-4">
                                    <h6 className="font-weight-bold">Type du contrat</h6>
                                    <p>{employe.TypeContrat}</p>
                                </div>
                                <div className="col-md-4">
                                    <h6 className="font-weight-bold">Date de fin du contrat</h6>
                                    <p>{moment(employe.DateFinContrat).format('YYYY-MM-DD')}</p>
                                </div>
                            </div>
                            <hr />
                            <div className="row">
                                <div className="col-md-3">
                                    <h6 className="font-weight-bold">Heure entrée matin</h6>
                                    <p>{employe.HeureEM}</p>

                                </div>
                                <div className="col-md-3">
                                    <h6 className="font-weight-bold">Heure sortie matin</h6>
                                    <p>{employe.HeureSM}</p>

                                </div>
                                <div className="col-md-3">
                                    <h6 className="font-weight-bold">Heure entrée aprés matin</h6>
                                    <p>{employe.HeureEAM}</p>

                                </div>
                                <div className="col-md-3">
                                    <h6 className="font-weight-bold">Heure sortie aprés matin</h6>
                                    <p>{employe.HeureSAM}</p>

                                </div>
                            </div>
                            <hr />
                            <div className="row">
                                <div className="col-md-3">
                                    <h6 className="font-weight-bold">Appliquer l'abattement</h6>
                                    <p>{employe.abattement}</p>

                                </div>
                                <div className="col-md-3">
                                    <h6 className="font-weight-bold">Taux d'abattement</h6>
                                    <p>{employe.tauxabt}</p>
                                </div>
                                <div className="col-md-3">
                                    <h6 className="font-weight-bold">Date d'abattement</h6>
                                    <p>{employe.dateabt?moment(employe.dateabt).format('YYYY-MM-DD'):''}</p>

                                </div>
                                <div className="col-md-3">
                                    <h6 className="font-weight-bold">Declaration a la CNAS</h6>
                                    <p>{employe.declaration==1?'Oui':'Non'}</p>

                                </div>
                            </div>
                            <hr/>
                            <div className="row">
                                <div className="col-md-12">
                                    <h6 className="font-weight-bold">Remarque</h6>
                                    <p>{employe.remarque}</p>


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
