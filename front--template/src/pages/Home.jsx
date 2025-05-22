import React, { useState, useEffect } from 'react';
import { FaUserFriends, FaUserGraduate, FaUserTie } from 'react-icons/fa';
import { FaChalkboardUser } from 'react-icons/fa6';

import administration from '../assets/imgs/administration.png';
import transport from '../assets/imgs/transport.png'
import rh from '../assets/imgs/rh2.png'
import finance from '../assets/imgs/Finance2.png'
import biblio from '../assets/imgs/bibliot.png'
import Academie from '../assets/imgs/acad.png'
import cantine from '../assets/imgs/cantine.png'
import statistics from '../assets/imgs/statistics.png'
import teacher from '../assets/imgs/teachera.png'
import settings from '../assets/imgs/settings.png';
import users from '../assets/imgs/users.png';
import schooll from '../assets/imgs/school (1).png';
import employe from '../assets/imgs/employe.png'
import student from '../assets/imgs/students.png'
import parent from '../assets/imgs/family.png'
import conge from '../assets/imgs/leave.png'
import report from '../assets/imgs/details.png'
import revenu from '../assets/imgs/cost.png'
import menu from '../assets/imgs/food2.png'
import categoryBook from '../assets/imgs/category.png'
import Book from '../assets/imgs/livre.png'
import card from '../assets/imgs/card.png'
import driver from '../assets/imgs/driver.png'
import bus from '../assets/imgs/autobus.png'
import chemin from '../assets/imgs/ligne.png'
import chart from '../assets/imgs/chart2.png'
import stock from '../assets/imgs/stock.png'
import depense from '../assets/imgs/budget.png'
import role from '../assets/imgs/safety.png'
import absence from '../assets/imgs/absenceEmploye.png'
import { Link } from 'react-router-dom';
import Calenderie from '../pages/components/Calenderier';
import attestation from '../assets/imgs/document-atteste.png';
import Annee from '../assets/imgs/annee.png'
import Semestre from '../assets/imgs/semester.png'
import Section from '../assets/imgs/section.png'
import Niveaux from '../assets/imgs/niveaux.png'
import Matiere from '../assets/imgs/matiere.png'
import Salle from '../assets/imgs/classe.png';
import privilege from '../assets/imgs/permission (1).png';
import paiement from '../assets/imgs/paiement.png';
import emploi from '../assets/imgs/emploi.png';
import exam from '../assets/imgs/exam.png';
// import stock from '../assets/imgs/monitoring.png'
import fournisseurIcon from '../assets/imgs/supplier.png';
import achatIcon from '../assets/imgs/add-to-cart.png';
import articleIcon from '../assets/imgs/checklist.png';
import categorieIcon from '../assets/imgs/categories.png';

import note from '../assets/imgs/note.png';

import absencee from '../assets/imgs/absence.png';
import jf from '../assets/imgs/timetable (2).png';
import paieEtudiant from '../assets/imgs/paieEtudiant.png';
import archives from '../assets/imgs/archive.png';
import Elearning from '../assets/imgs/elearning.png';
import chat from '../assets/imgs/chat.png';
import site from '../assets/imgs/www.png';
import web from '../assets/imgs/web.png';
import mail from '../assets/imgs/mail.png';
import sms from '../assets/imgs/chat (1).png';
import pedagogique from '../assets/imgs/supplies.png';
import restauration from '../assets/imgs/groceries.png';
import divers from '../assets/imgs/shopping-cart (1).png';

import Can from '../can';
import axios from 'axios';

const Home = () => {

  const [roles, setRoles] = useState([]);
  const [poste, setPoste] = useState(null);
  const [loading, setLoading] = useState(true);

  const CanPoste = ({ poste, requiredPoste, permission, children }) => {
    const hasPermission = roles.some(role =>
      role.permissions && Array.isArray(role.permissions) && role.permissions.includes(permission)
    );
    const hasRightPoste = poste === requiredPoste;

    // Allow access if the user has the AdminPrincipal or Admin role
    const isAdmin = roles.includes("AdminPrincipal") || roles.includes("Admin");

    return (hasRightPoste || hasPermission || isAdmin) ? children : null;
  };

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const response = await axios.get("http://localhost:5000/enseignant/me", {
          headers: { Authorization: `Bearer ${token}` }
        });

        console.log("Données employeMe:", response.data);
        setRoles(response.data.roles || []);
        setPoste(response.data.employe?.poste || null); // Récupérer le poste
      } catch (error) {
        console.error("Erreur:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  return (
    <div >
      <div className="content-header">
        <h1></h1>
      </div>
      <section className=" content">
        <div className="container-fluid">
          <div className="row">
            <div className="col-12 col-sm-6 col-md-3">
              <div className="info-box">
                <span className="info-box-icon   elevation-1">

                  <img src={employe} alt="" />
                </span>

                <div className="info-box-content">
                  <span className="info-box-text">Employés</span>
                  <span className="info-box-number" >
                    40
                  </span>
                </div>
              </div>
            </div>

            <div className="col-12 col-sm-6 col-md-3">
              <div className="info-box mb-3">
                <span className="info-box-icon  elevation-1">

                  <img src={teacher} alt="" />
                </span>

                <div className="info-box-content">
                  <span className="info-box-text">Enseignants</span>
                  <span className="info-box-number">12</span>
                </div>
              </div>
            </div>

            <div className="clearfix hidden-md-up"></div>

            <div className="col-12 col-sm-6 col-md-3">
              <div className="info-box mb-3">
                <span className="info-box-icon  elevation-1">

                  <img src={student} alt="" />
                </span>

                <div className="info-box-content">
                  <span className="info-box-text">Etudiants</span>
                  <span className="info-box-number">200 </span>

                </div>
              </div>
            </div>

            <div className="col-12 col-sm-6 col-md-3">
              <div className="info-box mb-3">
                <span className="info-box-icon  elevation-1">
                  <img src={parent} alt="" />
                </span>
                <div className="info-box-content">
                  <span className="info-box-text">Parents</span>
                  <span className="info-box-number">190</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="row">
        <div className="container-fluid team pb-5">
          <div className="container pb-5 mt-4">
            <div className="row g-4">

              {/* Administration Section */}
              <Can permission="Administration-Voir">
                <div className="col-12 col-md-6 col-lg-6 col-xl-3 wow fadeInUp" data-wow-delay="0.2s">
                  <div className="team-item">
                    <div className="team-img">
                      <img src={administration} className="img-fluid" alt="" />
                    </div>
                    <div className="team-title">
                      <p className="mb-0">Administration</p>
                      <div className="row">
                        <div className="team-icon">
                          <Can permission="Administration-Gestion enseignant-Voir">
                            <span className="info-box-icon elevation-1">
                              <Link to="/enseignant"><img src={teacher} alt="" title='Gestion des enseignants' /></Link>
                            </span>
                          </Can>
                          <Can permission="Administration-Gestion élève-Voir">
                            <span className="info-box-icon elevation-1">
                              <Link to="/eleves"><img src={student} alt="" title='Gestion Etudiants ' /></Link>
                            </span>
                          </Can>
                          <Can permission="Administration-Gestion parents-Voir">
                            <span className="info-box-icon elevation-1">
                              <Link to="/parents"><img src={parent} alt="" title='Gestion Parents ' /></Link>
                            </span>
                          </Can>
                        </div>
                      </div>
                      <div className="row">
                        <div className="team-icon">
                          <Can permission="Parametre-Voir">
                            <span className="info-box-icon elevation-1">
                              <Link to="/gestionabsence">
                                <img src={absence} alt="" title="Gestion des Absences" />
                              </Link>
                            </span>
                          </Can>
                          <Can permission="Parametre-Voir">
                            <span className="info-box-icon elevation-1">
                              <Link to="/listeabsence">
                                <img src={absence} alt="" title="Liste des Absences" />
                              </Link>
                            </span>
                          </Can>
                        </div>
                      </div>

                    </div>
                  </div>
                </div>
              </Can>

              {/* Ressources Humaines Section */}
              <Can permission="Ressources Humaines-Voir">
                <div className="col-12 col-md-6 col-lg-6 col-xl-3 wow fadeInUp" data-wow-delay="0.4s">
                  <div className="team-item">
                    <div className="team-img">
                      <img src={rh} className="img-fluid" alt="" />
                    </div>
                    <div className="row d-flex justify-content-center align-items-center text-center">
                      <div className="team-title">
                        <p className="mb-0">Ressources Humaines</p>
                        <div className="team-icon d-flex justify-content-center">
                          <Can permission="Ressources Humaines-Voir">
                            <span className="info-box-icon elevation-1">
                              <Link to="/RessourcesHumaines">
                                <img src={employe} alt="" title="Gestion RH" />
                              </Link>
                            </span>
                          </Can>

                          <Can permission="Ressources Humaines-gestion de la paye-Voir">
                            <span className="info-box-icon elevation-1">
                              <Link to="/Gpaiement">
                                <img src={paiement} alt="" title="Gestion Paie" />
                              </Link>
                            </span>
                          </Can>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Can>

              {/* Comptabilité Section */}
              <Can permission="Comptabilité-Voir">
                <div className="col-12 col-md-6 col-lg-6 col-xl-3 wow fadeInUp" data-wow-delay="0.2s">
                  <div className="team-item">
                    <div className="team-img">
                      <img src={finance} className="img-fluid" alt="" />
                    </div>
                    <div className="team-title">
                      <p className="mb-0">Comptabilité</p>
                      <div className="row">
                        <div className="team-icon">
                          <span className="info-box-icon elevation-1">
                            <Link to="/comptabilite"><img src={revenu} alt="" title='Gestion Revenus et Dépenses' /></Link>
                          </span>
                          <span className="info-box-icon elevation-1">
                            <Link to="/paiementEleves"><img src={paieEtudiant} alt="" title='Gestion Dépenses ' /></Link>
                          </span>
                          <span className="info-box-icon elevation-1">
                            <Link to="/rapportComptabilite"><img src={report} alt="" title='Rapport Comptabilité' /></Link>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Can>
              {/* Gestion Académique Section */}
              <Can permission="Academique-Voir">
                <div className="col-12 col-md-6 col-lg-6 col-xl-3 wow fadeInUp" data-wow-delay="0.6s">
                  <div className="team-item">
                    <div className="team-img">
                      <img src={Annee} className="img-fluid" alt="Gestion Académique" width={90} />
                    </div>
                    <div className="team-title">
                      <p className="mb-0">Gestion Académique</p>
                      <div className="team-icon">
                        <span className="info-box-icon elevation-1">
                          <Link to="/PlanificationAcadémique"><img src={Annee} alt="Année scolaire" title="Planification Academique" /></Link>
                        </span>
                        <Can permission="Academique-Niveaux-Voir">
                          <span className="info-box-icon elevation-1">
                            <Link to="/ParametreEntiteeScolaire"><img src={Niveaux} alt="Niveaux" title="Paramatre Des Entités Scolaire" /></Link>
                          </span>
                        </Can>
                        <Can permission="Parametre-Voir">
                          <span className="info-box-icon elevation-1">
                            <Link to="/GestionDesNotes">
                              <img src={note} alt="" title="Gestion des notes et bulletin" />
                            </Link>
                          </span>
                        </Can>
                      </div>
                    </div>
                  </div>
                </div>
              </Can>

              {/* Cantine Scolaire Section */}
              <Can permission="Cantine scolaire-Voir">
                <div className="col-12 col-md-6 col-lg-6 col-xl-3 wow fadeInUp" data-wow-delay="0.2s">
                  <div className="team-item">
                    <div className="team-img">
                      <img src={cantine} className="img-fluid" alt="" />
                    </div>
                    <div className="team-title">
                      <p className="mb-0">Cantine Scolaire</p>
                      <div className="row">
                        <div className="team-icon">
                          <span className="info-box-icon elevation-1">
                            <Link to="/"><img width="100px" src={menu} alt="" title='Cantine Scolaire ' /></Link>
                          </span>
                          <span className="info-box-icon elevation-1">
                            <Link to="/gestionstock"><img width="100px" src={stock} alt="" title='Gestion du stock ' /></Link>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Can>

              {/* Bibliothèque Section */}
              <Can permission="Bibliothèque-Voir">
                <div className="col-12 col-md-6 col-lg-6 col-xl-3 wow fadeInUp" data-wow-delay="0.4s">
                  <div className="team-item">
                    <div className="team-img">
                      <img src={biblio} className="img-fluid" alt="" />
                    </div>
                    <div className="team-title">
                      <p className="mb-0">Bibliothèque</p>
                      <div className="row">
                        <div className="team-icon">
                          <Can permission="Bibliothèque-Categories livres">
                            <span className="info-box-icon elevation-1">
                              <Link to="/"><img src={categoryBook} alt="" title='Categories livres ' /></Link>
                            </span>
                          </Can>
                          <Can permission="Bibliothèque-Gestion livres">
                            <span className="info-box-icon elevation-1">
                              <Link to="/"><img src={Book} alt="" title='Gestion livres ' /></Link>
                            </span>
                          </Can>
                          <Can permission="Bibliothèque-Cartes">
                            <span className="info-box-icon elevation-1">
                              <Link to="/"><img src={card} alt="" title='Cartes' /></Link>
                            </span>
                          </Can>
                        </div>
                      </div>
                      <div className="row">
                        <div className="team-icon">
                          <Can permission="Bibliothèque-Rapports">
                            <span className="info-box-icon elevation-1">
                              <Link to="/"><img src={report} alt="" title='Rapports ' /></Link>
                            </span>
                          </Can>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Can>

              {/* Transport Section */}
              <Can permission="Transport-Voir">
                <div className="col-12 col-md-6 col-lg-6 col-xl-3 wow fadeInUp" data-wow-delay="0.6s">
                  <div className="team-item">
                    <div className="team-img">
                      <img src={transport} className="img-fluid" alt="" />
                    </div>
                    <div className="team-title">
                      <p className="mb-0">Transport</p>
                      <div className="row">
                        <div className="team-icon">
                          <Can permission="Transport-Chauffeurs / Véhicules">
                            <span className="info-box-icon elevation-1">
                              <Link to="/"><img src={driver} alt="" title='Chauffeurs / Véhicules' /></Link>
                            </span>
                          </Can>
                          <Can permission="Transport-Ligne de Transport">
                            <span className="info-box-icon elevation-1">
                              <Link to="/"><img src={chemin} alt="" title='Ligne de Transport' /></Link>
                            </span>
                          </Can>
                          <Can permission="Transport-Suivi Bus">
                            <span className="info-box-icon elevation-1">
                              <Link to="/"><img src={bus} alt="" title='Suivi Bus' /></Link>
                            </span>
                          </Can>
                        </div>
                      </div>
                      <div className="row">
                        <div className="team-icon">
                          <Can permission="Transport-Cartes chauffeurs">
                            <span className="info-box-icon elevation-1">
                              <Link to="/"><img src={card} alt="" title='Cartes chauffeurs ' /></Link>
                            </span>
                          </Can>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Can>

              {/* Section spécifique pour les enseignants */}
              <CanPoste poste={poste} requiredPoste="Enseignant" permission="Parametre-Voir">
                {poste === "Enseignant" && (
                  <div className="col-12 col-md-6 col-lg-6 col-xl-3 wow fadeInUp" data-wow-delay="0.8s">
                    <div className="team-item">
                      <div className="team-img">
                        <img src={absencee} className="img-fluid" alt="" />
                      </div>
                      <div className="team-title">
                        <p className="mb-0">Gestion Des Absence</p>
                        <div className="team-icon">
                          {poste === "Enseignant" && (
                            <span className="info-box-icon elevation-1">
                              <Link to="/absenceeleve">
                                <img src={absencee} alt="" title="Gestion absence" />
                              </Link>
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </CanPoste>
              <CanPoste poste={poste} requiredPoste="Enseignant" permission="Parametre-Voir">
                {poste === "Enseignant" && (
                  <div className="col-12 col-md-6 col-lg-6 col-xl-3 wow fadeInUp" data-wow-delay="0.8s">
                    <div className="team-item">
                      <div className="team-img">
                        <img src={absencee} className="img-fluid" alt="" />
                      </div>
                      <div className="team-title">
                        <p className="mb-0">Gestion Des Absence</p>
                        <div className="team-icon">
                          {poste === "Enseignant" && (
                            <span className="info-box-icon elevation-1">
                              <Link to="/GestionDesNotesEnseignant">
                                <img src={note} alt="" title="Gestion absence" />
                              </Link>
                            </span>
                          )}
                          {poste === "Enseignant" && (
                            <span className="info-box-icon elevation-1">
                              <Link to="/GestionDevoire">
                                <img src={exam} alt="" title="Gestion absence" />
                              </Link>
                            </span>
                          )}
                          {poste === "Enseignant" && (
                            <span className="info-box-icon elevation-1">
                              <Link to="/EmploiDuTempsEnseignant">
                                <img src={emploi} alt="" title="Gestion absence" />
                              </Link>
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </CanPoste>
              {/* fin de section de l'enseignant */}

              {/* gestion magasin */}
              <Can permission="Cantine scolaire-Voir">
                <div className="col-12 col-md-6 col-lg-6 col-xl-3 wow fadeInUp" data-wow-delay="0.2s">
                  <div className="team-item">
                    <div className="team-img">
                      <img src={stock} className="img-fluid" alt="" width={70} />
                    </div>
                    <div className="team-title">
                      <p className="mb-0">Gestion Des Magasin</p>
                      <div className="row">
                        <div className="team-icon">
                          <span className="info-box-icon elevation-1">
                            <Link to="/magasinpedagogique"><img width="100px" src={pedagogique} alt="" title='Magasin pédagogique ' /></Link>
                          </span>
                          <span className="info-box-icon elevation-1">
                            <Link to="/magasinrestauration"><img width="100px" src={restauration} alt="" title='Magasin de réstauration ' /></Link>
                          </span>
                          <span className="info-box-icon elevation-1">
                            <Link to="/magasindivers"><img width="100px" src={divers} alt="" title="Magasin divers " /></Link>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Can>
              {/* Paramètre Section */}
              <Can permission="Parametre-Voir">
                <div className="col-12 col-md-6 col-lg-6 col-xl-3 wow fadeInUp" data-wow-delay="0.8s">
                  <div className="team-item">
                    <div className="team-img">
                      <img src={settings} className="img-fluid" alt="" width={85}/>
                    </div>
                    <div className="team-title">
                      <p className="mb-0">Paramètre</p>
                      <div className="team-icon">
                        <Can permission="Parametre-Gestion écoles-Voir">
                          <span className="info-box-icon elevation-1">
                            <Link to="/ecoles"><img src={schooll} alt="" title='Gestion Ecole ' /></Link>
                          </span>
                        </Can>
                        <span className="info-box-icon elevation-1">
                          <Link to="/listeUser"><img src={privilege} alt="" title='Gestion utilisateurs & permission ' /></Link>
                        </span>

                        <span className="info-box-icon elevation-1">
                          <Link to="/documents"><img src={attestation} alt="" title='Gestion Documents' /></Link>
                        </span>
                      </div>
                      <div className='row'>
                        <div className="team-icon">
                          <span className="info-box-icon elevation-1">
                            <Link to="/"><img src={chart} alt="" title='Gestion Parents ' /></Link>
                          </span>
                          <span className="info-box-icon elevation-1">
                            <Link to="/joursferies"><img src={jf} alt="" title='Jours Feriés' /></Link>
                          </span>
                          <span className="info-box-icon elevation-1">
                            <Link to="/archives"><img src={archives} alt="" title='Archives' /></Link>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Can>
              {/* Communication */}
              <Can permission="Cantine scolaire-Voir">
                <div className="col-12 col-md-6 col-lg-6 col-xl-3 wow fadeInUp" data-wow-delay="0.2s">
                  <div className="team-item">
                    <div className="team-img">
                      <img src={chat} className="img-fluid" alt="" width={70} />
                    </div>
                    <div className="team-title">
                      <p className="mb-0">Communication</p>
                      <div className="row">
                        <div className="team-icon">
                          <span className="info-box-icon elevation-1">
                            <Link to="/communication"><img width="100px" src={mail} alt="" title='Cantine Scolaire ' /></Link>
                          </span>
                          <span className="info-box-icon elevation-1">
                            <Link to="/gestionstock"><img width="100px" src={sms} alt="" title='Gestion du stock ' /></Link>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Can>
              {/* Elearning */}
              <Can permission="Cantine scolaire-Voir">
                <div className="col-12 col-md-6 col-lg-6 col-xl-3 wow fadeInUp" data-wow-delay="0.2s">
                  <div className="team-item">
                    <div className="team-img">
                      <img src={Elearning} className="img-fluid" alt="" width={80} />
                    </div>
                    <div className="team-title">
                      <p className="mb-0">Elearning</p>
                      <div className="row">
                        <div className="team-icon">
                          <span className="info-box-icon elevation-1">
                            <Link to="/"><img width="100px" src={menu} alt="" title='Cantine Scolaire ' /></Link>
                          </span>
                          <span className="info-box-icon elevation-1">
                            <Link to="/gestionstock"><img width="100px" src={stock} alt="" title='Gestion du stock ' /></Link>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Can>
              {/* Site */}
              <Can permission="Cantine scolaire-Voir">
                <div className="col-12 col-md-6 col-lg-6 col-xl-3 wow fadeInUp" data-wow-delay="0.2s">
                  <div className="team-item">
                    <div className="team-img">
                      <img src={site} className="img-fluid" alt="" />
                    </div>
                    <div className="team-title">
                      <p className="mb-0">Site</p>
                      <div className="row">
                        <div className="team-icon">
                          <span className="info-box-icon elevation-1">
                            <Link to="/"><img width="100px" src={web} alt="" title='Cantine Scolaire ' /></Link>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Can>

              {/* <Can permission="Parametre-Voir">
                <div className="col-12 col-md-6 col-lg-6 col-xl-3 wow fadeInUp" data-wow-delay="0.8s">
                  <div className="team-item">
                    <div className="team-img">
                      <img src={stock} className="img-fluid" alt="" />
                    </div>
                    <div className="team-title">
                      <p className="mb-0">Gestion Stocks</p>
                      <div className="team-icon">
                        <span className="info-box-icon elevation-1">
                          <Link to="/categorie"><img src={categorieIcon} alt="" title='Gestion catégorie ' /></Link>
                        </span>
                        <span className="info-box-icon elevation-1">
                          <Link to="/article"><img src={articleIcon} alt="" title='Gesttion article ' /></Link>
                        </span>

                        <span className="info-box-icon elevation-1">
                          <Link to="/achat"><img src={achatIcon} alt="" title='Gestion achat' /></Link>
                        </span>

                      </div>
                      <div className="team-icon">
                        <span className="info-box-icon elevation-1">
                          <Link to="/categorie"><img src={fournisseurIcon} alt="" title='Gestion fournisseur ' /></Link>
                        </span>

                      </div>
                    </div>
                  </div>
                </div>
              </Can> */}

              {/* <Can permission="Parametre-Voir">
                <div className="col-12 col-md-6 col-lg-6 col-xl-3 wow fadeInUp" data-wow-delay="0.8s">
                  <div className="team-item">
                    <div className="team-img">
                      <img src={note} className="img-fluid" alt="" />
                    </div>
                    <div className="team-title">
                      <p className="mb-0">Gestion des notes</p>
                      <div className="team-icon">
                        <Can permission="Parametre-Gestion écoles-Voir">
                          <span className="info-box-icon elevation-1">
                            <Link to="/GestionDesNotes"><img src={schooll} alt="" title='Gestion Des notes ' /></Link>
                          </span>
                        </Can>
                        <span className="info-box-icon elevation-1">
                          <Link to="/listeUser"><img src={privilege} alt="" title='Gestion utilisateurs & permission ' /></Link>
                        </span>
                        
                      </div>
                    </div>
                  </div>
                </div>
              </Can>

              <Can permission="Parametre-Voir">
                <div className="col-12 col-md-6 col-lg-6 col-xl-3 wow fadeInUp" data-wow-delay="0.8s">
                  <div className="team-item">
                    <div className="team-img">
                      <img src={absencee} className="img-fluid" alt="" />
                    </div>
                    <div className="team-title">
                      <p className="mb-0">Gestion des absence eleve</p>
                      <div className="team-icon">
                        <Can permission="Parametre-Gestion écoles-Voir">
                          <span className="info-box-icon elevation-1">
                            <Link to="/GestionAbsence"><img src={absencee} alt="" title='Gestion absence ' /></Link>
                          </span>
                        </Can>
                        <span className="info-box-icon elevation-1">
                          <Link to="/listeUser"><img src={privilege} alt="" title='Gestion utilisateurs & permission ' /></Link>
                        </span>
                        
                      </div>
                    </div>
                  </div>
                </div>
              </Can> */}

            </div>
          </div>
        </div>
      </div>
      <Calenderie />
    </div >

  )
}

export default Home
