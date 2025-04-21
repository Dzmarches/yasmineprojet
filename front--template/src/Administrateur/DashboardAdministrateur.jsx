import { useState } from 'react';
import student from '../assets/imgs/students.png';
import parent from '../assets/imgs/family.png';
import teacher from '../assets/imgs/teachera.png';
import school from '../assets/imgs/school.png';
import schooll from '../assets/imgs/school (1).png';
import users from '../assets/imgs/users.png';
import userecole from '../assets/imgs/userecole.png';
import privilege from '../assets/imgs/safety.png';
import settings from '../assets/imgs/settings.png';
import publicitee from '../assets/imgs/social-media (1).png';
import administration from '../assets/imgs/administration.png';
import impos from '../assets/imgs/impos.png';
import phase from '../assets/imgs/phase.png';
import Annee from '../assets/imgs/annee.png'
import Semestre from '../assets/imgs/semester.png'
import NavBarAdministrateur from './NavBarAdministrateur';
import SideBarAdministrateur from './SideBarAdministrateur';

import { FaUserFriends, FaUserGraduate, FaUserTie } from 'react-icons/fa';
import { FaChalkboardUser } from 'react-icons/fa6';


import { Link } from 'react-router-dom';

const DashboardAdministrateur = () => {
  return (
    <div id="dashboard-administrateur">
      <div className="content-header">
        <h1></h1>
      </div>
      <div className="content">
        <div className="container-fluid">
          <div className="row">
            <div className="col-12 col-sm-6 col-md-3">
              <div className="info-box">
                <span className="info-box-icon elevation-1">
                  <img src={school} alt="" />
                </span>
                <div className="info-box-content">
                  <span className="info-box-text">Ecoles principales</span>
                  <span className="info-box-number">40</span>
                </div>
              </div>
            </div>

            <div className="col-12 col-sm-6 col-md-3">
              <div className="info-box mb-3">
                <span className="info-box-icon elevation-1">
                  <img src={teacher} alt="" />
                </span>
                <div className="info-box-content">
                  <span className="info-box-text">Ecoles</span>
                  <span className="info-box-number">12</span>
                </div>
              </div>
            </div>

            <div className="clearfix hidden-md-up"></div>

            <div className="col-12 col-sm-6 col-md-3">
              <div className="info-box mb-3">
                <span className="info-box-icon elevation-1">
                  <img src={users} alt="" />
                </span>
                <div className="info-box-content">
                  <span className="info-box-text">Utilisateurs</span>
                  <span className="info-box-number">200</span>
                </div>
              </div>
            </div>

            <div className="col-12 col-sm-6 col-md-3">
              <div className="info-box mb-3">
                <span className="info-box-icon elevation-1">
                  <img src={userecole} alt="" />
                </span>
                <div className="info-box-content">
                  <span className="info-box-text">Utilisateurs Ecoles</span>
                  <span className="info-box-number">190</span>
                </div>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="container-fluid team pb-5">
              <div className="container pb-5 mt-4">
                <div className="row g-4">
                  <div className="col-12 col-md-6 col-lg-6 col-xl-3 wow fadeInUp" data-wow-delay="0.2s">
                    <div className="team-item">
                      <div className="team-img">
                        <img src={school} className="img-fluid" alt="" />
                      </div>
                      <div className="team-title">
                        <p className="mb-0">Gestion Ecoles</p>
                        <div className="row">
                          <div className="team-icon">
                            <span className="info-box-icon elevation-1 wow fadeInUp">
                              <Link to="/ecole"><img src={schooll} alt="" title='Gestion des ecole' /></Link>
                            </span>
                            <span className="info-box-icon elevation-1">
                              <Link to="/cyclescolaire"><img src={phase} alt="" title='Gestion des cycles scolaire ' /></Link>
                            </span>
                            <span className="info-box-icon elevation-1">
                              <Link to="/annees"><img src={Annee} alt="Année scolaire" title="Année scolaire" /></Link>
                            </span>

                          </div>

                        </div>
                        <div className="row">
                          <div className="team-icon">
                            <span className="info-box-icon elevation-1">
                              <Link to="/Trimeste"><img src={Semestre} alt="Semestre" title="Semestre" /></Link>
                            </span>
                          </div>
                          {/* <div className="team-icon">
                            <span className="info-box-icon elevation-1">
                              <Link to="/privilèges"><img src={teacher} alt="" title='Gestion des privilèges' /></Link>
                            </span>
                          </div>
                          <div className="team-icon">
                            <span className="info-box-icon elevation-1">
                              <Link to="/autorisations"><img src={student} alt="" title='Gestion des autorisation' /></Link>
                            </span>
                          </div> */}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-12 col-md-6 col-lg-6 col-xl-3 wow fadeInUp" data-wow-delay="0.4s">
                    <div className="team-item">
                      <div className="team-img">
                        <img src={privilege} className="img-fluid" alt="" />
                      </div>
                      <div className="team-title">
                        <p className="mb-0">Gestion Privilège</p>
                        <div className="team-icon">
                          <span className="info-box-icon elevation-1">
                            <Link to="/privilege"><img src={privilege} alt="" title='Gestion des autorisation ' /></Link>
                          </span>
                          <span className="info-box-icon elevation-1">
                            <Link to="/Conges"><img src={users} alt="" title=' congés et absences ' /></Link>
                          </span>
                          <span className="info-box-icon elevation-1">
                            <Link to="/mesDemandes"><img src={users} alt="" title='mes demandes des congés et absences ' /></Link>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-12 col-md-6 col-lg-6 col-xl-3 wow fadeInUp" data-wow-delay="0.8s">
                    <div className="team-item">
                      <div className="team-img">
                        <img src={settings} className="img-fluid" alt="" />
                      </div>
                      <div className="team-title">
                        <p className="mb-0">Paramètre</p>
                        <div className="team-icon">
                          <span className="info-box-icon elevation-1">
                            <Link to="/"><img src={users} alt="" title='Gestion Dépenses ' /></Link>
                          </span>
                          <span className="info-box-icon elevation-1">
                            <Link to="/"><img src={users} alt="" title='Gestion Revenus ' /></Link>
                          </span>
                          <span className="info-box-icon elevation-1">
                            <Link to="/IRG"><img src={impos} alt="" title='IRG' /></Link>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-12 col-md-6 col-lg-6 col-xl-3 wow fadeInUp" data-wow-delay="0.6s">
                    <div className="team-item">
                      <div className="team-img">
                        <img src={publicitee} className="img-fluid" alt="" />
                      </div>
                      <div className="team-title">
                        <p className="mb-0">Gestion publicité</p>
                        <div className="team-icon">
                          <span className="info-box-icon elevation-1">
                            <Link to="/"><img src={teacher} alt="" title='Gestion Enseignant ' /></Link>
                          </span>
                          <span className="info-box-icon elevation-1">
                            <Link to="/"><img src={student} alt="" title='Gestion Etudiants ' /></Link>
                          </span>
                          <span className="info-box-icon elevation-1">
                            <Link to="/"><img src={parent} alt="" title='Gestion Parents ' /></Link>
                          </span>
                        </div>
                      </div>
                    </div>
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

export default DashboardAdministrateur;