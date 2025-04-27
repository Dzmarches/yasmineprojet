import React, { useState } from 'react';
import logo from '../../assets/imgs/etudiant.png';
import { MdEast, MdFastForward, MdFastRewind, MdHomeWork, MdNoFood, MdNoMeals, MdOutlineBusAlert, MdOutlineDateRange, MdOutlineLibraryBooks, MdOutlineSettings } from 'react-icons/md';
import { IoIosPeople } from "react-icons/io";
import { IoFastFoodSharp, IoLibraryOutline, IoStatsChartOutline, IoStatsChartSharp } from "react-icons/io5";
import { VscFolderLibrary } from 'react-icons/vsc';
import { PiCertificateBold } from "react-icons/pi";
import { TbReportSearch, TbUserScreen } from 'react-icons/tb';
import { MdOutlineFoodBank } from "react-icons/md";
import { LiaMapMarkedAltSolid } from 'react-icons/lia';
import { GrBus, GrUserSettings } from "react-icons/gr";
import { BsBusFrontFill } from 'react-icons/bs';
import { TiBusinessCard } from 'react-icons/ti';
import { FaBusinessTime, FaChartBar, FaUserLock, FaUsersCog } from 'react-icons/fa';
import { Link, Route, useNavigate } from 'react-router-dom';
import { FaMoneyBillTransfer, FaUsersGear } from 'react-icons/fa6';
import { BiSliderAlt } from 'react-icons/bi';
import { AiFillReconciliation } from 'react-icons/ai';
import { RiHome2Line } from 'react-icons/ri';
import Can from '../../can';
import {useAuth } from '../../components/AuthContext';


import axios from 'axios';

const Sidebar = () => {
  const [openSection, setOpenSection] = useState(null);
  const username = localStorage.getItem('username');
  const { user } = useAuth(); // Utilisation du hook pour obtenir l'utilisateur

  const navigate = useNavigate();

  const today = new Date();
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  const formattedDate = today.toLocaleDateString('fr-FR', options);

  const toggleSection = (section) => {
    setOpenSection(openSection === section ? null : section);
  };

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      await axios.post('http://localhost:5000/api/logout', {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (error) {
      console.error("Erreur lors de la déconnexion", error);
    }
    localStorage.removeItem('accessToken');
    localStorage.removeItem('username');
    navigate('/login');
  };

  return (
    <aside className="main-sidebar sidebar-dark-primary elevation-4">
      <a href="index3.html" className="brand-link">
        <img src={logo} alt="Logo" className="brand-image img-circle elevation-3" style={{ opacity: 0.8 }} />
        <span className="brand-text font-weight-light">Education</span>
      </a>
      <div className="sidebar">
        <div className="use-panel mt-2 d-flex flex-column align-items-center">
          <img src={logo} className="userImg" alt="User Image" />
          <div className="info text-center">
            <a href="#" className="d-block">{user ? user.username : 'Utilisateur'}</a>
          </div>
          <div className="info text-center">
            <a href="#" className="d-block">{user && user.roles ? user.roles.join(', ') : 'Aucun rôle'}</a>
          </div>

        </div>

        <div className="user-panel mt-3 pb-3 mb-3 d-flex">
          <div className="box-date">
            <p><MdOutlineDateRange /> &nbsp;{formattedDate}</p>
          </div>
        </div>

        <nav className="mt-2">
          <ul className="nav nav-pills nav-sidebar flex-column" data-widget="treeview" role="menu" data-accordion="false">
            {/* Tableau de bord */}
            <Can permission="Tableau de bord-Voir">
              <li className="nav-item">
                <Link to="/home" className="nav-link">
                  <i className="nav-icon fas fa-home"></i>
                  <p>Tableau de bord</p>
                </Link>
              </li>
            </Can>

            <li className="nav-header">GESTION ECOLE</li>

            {/* Utilisateurs */}
            <Can permission="Utilisateurs-Voir">
              <li className="nav-item">
                <Link to="/utilisateurs" className="nav-link">
                  <FaUsersGear className="nav-icon" />
                  <p>&nbsp;Utilisateurs</p>
                </Link>
              </li>
            </Can>

            {/* Administration */}
            <Can permission="Administration-Voir">
              <li className="nav-item" onClick={() => toggleSection('admin')}>
                <a href="#" className="nav-link">
                  <MdOutlineSettings className="nav-icon" />
                  <p>
                    Administration
                    {openSection === 'admin' ? <i className="right fas fa-angle-down"></i> : <i className="fas fa-angle-left right"></i>}
                  </p>
                </a>
                {openSection === 'admin' && (
                  <ul className="nav nav-treeview" style={{ display: "block" }}>
                    <Can permission="Administration-Gestion enseignant-Voir">
                      <li className="nav-item">
                        <Link to="/enseignants" className="nav-link">
                          <IoIosPeople className='nav-icon' />
                          <p>Enseignants</p>
                        </Link>
                      </li>
                    </Can>
                    <Can permission="Administration-Gestion élève-Voir">
                      <li className="nav-item">
                        <Link to="/eleves" className="nav-link">
                          <IoIosPeople className='nav-icon' />
                          <p>Étudiants</p>
                        </Link>
                      </li>
                    </Can>
                    <Can permission="Administration-Gestion parent-Voir">
                      <li className="nav-item">
                        <Link to="/parents" className="nav-link">
                          <IoIosPeople className='nav-icon' />
                          <p>Parents</p>
                        </Link>
                      </li>
                    </Can>
                    <Can permission="Administration-Gestion privilège-Voir">
                      <li className="nav-item">
                        <Link to="/privilèges" className="nav-link">
                          <IoIosPeople className='nav-icon' />
                          <p>Privilèges</p>
                        </Link>
                      </li>
                    </Can>
                  </ul>
                )}
              </li>
            </Can>

            {/* Ressources Humaines */}
            <Can permission="Ressources Humaines-Voir">
              <li className="nav-item" onClick={() => toggleSection('RH')}>
                <a href="#" className="nav-link">
                  <GrUserSettings className='nav-icon' />
                  <p>
                    Ressources Humaines
                    {openSection === 'RH' ? <i className="right fas fa-angle-down"></i> : <i className="fas fa-angle-left right"></i>}
                  </p>
                </a>
                {openSection === 'RH' && (
                  <ul className="nav nav-treeview" style={{ display: "block" }}>
                    <Can permission="Ressources Humaines-Gestion employés-Voir">
                      <li className="nav-item">
                        <Link to="/employes" className="nav-link">
                          <IoIosPeople className='nav-icon' />
                          <p>Employés</p>
                        </Link>
                      </li>
                    </Can>
                    <Can permission="Ressources Humaines-Gestion congés-Voir">
                      <li className="nav-item">
                        <Link to="/Conges" className="nav-link">
                          <MdHomeWork className='nav-icon' />
                          <p>Congés</p>
                        </Link>
                      </li>
                    </Can>
                    <Can permission="Ressources Humaines-Mes demandes-Voir">
                      <li className="nav-item">
                        <Link to="/mesDemandes" className="nav-link">
                          <MdHomeWork className='nav-icon' />
                          <p>Mes Demandes</p>
                        </Link>
                      </li>
                    </Can>
                    <Can permission="Ressources Humaines-Gestion pointage-Voir">
                      <li className="nav-item">
                        <Link to="/gestionTemps" className="nav-link">
                          <TbReportSearch className='nav-icon' />
                          <p>Pointage</p>
                        </Link>
                      </li>
                    </Can>
                    <Can permission="Ressources Humaines-Attestations-Voir">
                      <li className="nav-item">
                        <Link to="/documents" className="nav-link">
                          <TbReportSearch className='nav-icon' />
                          <p>Attestations</p>
                        </Link>
                      </li>
                    </Can>
                  </ul>
                )}
              </li>
            </Can>

            {/* Comptabilité */}
            <Can permission="Comptabilité-Voir">
              <li className="nav-item" onClick={() => toggleSection('comp')}>
                <a href="#" className="nav-link">
                  <FaMoneyBillTransfer className='nav-icon' />
                  <p>
                    Comptabilité
                    {openSection === 'comp' ? <i className="right fas fa-angle-down"></i> : <i className="fas fa-angle-left right"></i>}
                  </p>
                </a>
                {openSection === 'comp' && (
                  <ul className="nav nav-treeview" style={{ display: "block" }}>
                    <Can permission="Comptabilité-Gestion dépenses-Voir">
                      <li className="nav-item">
                        <Link to="/depenses" className="nav-link">
                          <MdFastRewind className='nav-icon' />
                          <p>Dépenses</p>
                        </Link>
                      </li>
                    </Can>
                    <Can permission="Comptabilité-Gestion revenus-Voir">
                      <li className="nav-item">
                        <Link to="/revenus" className="nav-link">
                          <MdFastForward className='nav-icon' />
                          <p>Revenus</p>
                        </Link>
                      </li>
                    </Can>
                    <Can permission="Comptabilité-Rapports-Voir">
                      <li className="nav-item">
                        <Link to="/rapports-comptabilite" className="nav-link">
                          <TbReportSearch className='nav-icon' />
                          <p>Rapports</p>
                        </Link>
                      </li>
                    </Can>
                  </ul>
                )}
              </li>
            </Can>

            {/* Gestion Académique */}
            <Can permission="Gestion Académique-Voir">
              <li className="nav-item" onClick={() => toggleSection('academi')}>
                <a href="#" className="nav-link">
                  <AiFillReconciliation className='nav-icon' />
                  <p>
                    Gestion Académique
                    {openSection === 'academi' ? <i className="right fas fa-angle-down"></i> : <i className="fas fa-angle-left right"></i>}
                  </p>
                </a>
                {openSection === 'academi' && (
                  <ul className="nav nav-treeview" style={{ display: "block" }}>
                    <Can permission="Gestion Académique-Niveaux-Voir">
                      <li className="nav-item">
                        <Link to="/niveaux" className="nav-link">
                          <BiSliderAlt className='nav-icon' />
                          <p>Niveaux</p>
                        </Link>
                      </li>
                    </Can>
                    <Can permission="Gestion Académique-Sections-Voir">
                      <li className="nav-item">
                        <Link to="/sections" className="nav-link">
                          <BiSliderAlt className='nav-icon' />
                          <p>Sections</p>
                        </Link>
                      </li>
                    </Can>
                    <Can permission="Gestion Académique-Matières-Voir">
                      <li className="nav-item">
                        <Link to="/matiere" className="nav-link">
                          <BiSliderAlt className='nav-icon' />
                          <p>Matières</p>
                        </Link>
                      </li>
                    </Can>
                    <Can permission="Gestion Académique-Trimestre-Voir">
                      <li className="nav-item">
                        <Link to="/trimestre" className="nav-link">
                          <BiSliderAlt className='nav-icon' />
                          <p>Trimestre</p>
                        </Link>
                      </li>
                    </Can>
                    <Can permission="Gestion Académique-Promotion-Voir">
                      <li className="nav-item">
                        <Link to="/promotion" className="nav-link">
                          <BiSliderAlt className='nav-icon' />
                          <p>Promotion</p>
                        </Link>
                      </li>
                    </Can>
                    <Can permission="Gestion Académique-Diplôme-Voir">
                      <li className="nav-item">
                        <Link to="/diplome" className="nav-link">
                          <BiSliderAlt className='nav-icon' />
                          <p>Diplôme</p>
                        </Link>
                      </li>
                    </Can>
                    <Can permission="Gestion Académique-Présence-Voir">
                      <li className="nav-item">
                        <Link to="/presence" className="nav-link">
                          <BiSliderAlt className='nav-icon' />
                          <p>Présence</p>
                        </Link>
                      </li>
                    </Can>
                    <Can permission="Gestion Académique-Emploi du temps-Voir">
                      <li className="nav-item">
                        <Link to="/emploi-du-temps" className="nav-link">
                          <BiSliderAlt className='nav-icon' />
                          <p>Emploi du temps</p>
                        </Link>
                      </li>
                    </Can>
                  </ul>
                )}
              </li>
            </Can>

            {/* Cantine Scolaire */}
            <Can permission="Cantine Scolaire-Voir">
              <li className="nav-item" onClick={() => toggleSection('cantine')}>
                <a href="#" className="nav-link">
                  <MdNoMeals className='nav-icon' />
                  <p>
                    Cantine Scolaire
                    {openSection === 'cantine' ? <i className="right fas fa-angle-down"></i> : <i className="fas fa-angle-left right"></i>}
                  </p>
                </a>
                {openSection === 'cantine' && (
                  <ul className="nav nav-treeview" style={{ display: "block" }}>
                    <Can permission="Cantine Scolaire-Menu-Voir">
                      <li className="nav-item">
                        <Link to="/menu-cantine" className="nav-link">
                          <MdOutlineFoodBank className='nav-icon' />
                          <p>Menu</p>
                        </Link>
                      </li>
                    </Can>
                    <Can permission="Cantine Scolaire-Stock-Voir">
                      <li className="nav-item">
                        <Link to="/stock-cantine" className="nav-link">
                          <RiHome2Line className='nav-icon' />
                          <p>Stock</p>
                        </Link>
                      </li>
                    </Can>
                  </ul>
                )}
              </li>
            </Can>

            {/* Bibliothèque */}
            <Can permission="Bibliothèque-Voir">
              <li className="nav-item" onClick={() => toggleSection('library')}>
                <a href="#" className="nav-link">
                  <IoLibraryOutline className="nav-icon" />
                  <p>
                    Bibliothèque
                    {openSection === 'library' ? <i className="right fas fa-angle-down"></i> : <i className="fas fa-angle-left right"></i>}
                  </p>
                </a>
                {openSection === 'library' && (
                  <ul className="nav nav-treeview" style={{ display: "block" }}>
                    <Can permission="Bibliothèque-Catégories-Voir">
                      <li className="nav-item">
                        <Link to="/categories-livres" className="nav-link">
                          <MdOutlineLibraryBooks className='nav-icon' />
                          <p>Catégories</p>
                        </Link>
                      </li>
                    </Can>
                    <Can permission="Bibliothèque-Gestion livres-Voir">
                      <li className="nav-item">
                        <Link to="/gestion-livres" className="nav-link">
                          <VscFolderLibrary className='nav-icon' />
                          <p>Gestion Livres</p>
                        </Link>
                      </li>
                    </Can>
                    <Can permission="Bibliothèque-Cartes-Voir">
                      <li className="nav-item">
                        <Link to="/cartes-bibliotheque" className="nav-link">
                          <PiCertificateBold className="nav-icon" />
                          <p>Cartes</p>
                        </Link>
                      </li>
                    </Can>
                    <Can permission="Bibliothèque-Rapports-Voir">
                      <li className="nav-item">
                        <Link to="/rapports-bibliotheque" className="nav-link">
                          <TbReportSearch className='nav-icon' />
                          <p>Rapports</p>
                        </Link>
                      </li>
                    </Can>
                  </ul>
                )}
              </li>
            </Can>

            {/* Transport */}
            <Can permission="Transport-Voir">
              <li className="nav-item" onClick={() => toggleSection('transport')}>
                <a href="#" className="nav-link">
                  <BsBusFrontFill className='nav-icon' />
                  <p>
                    Transport
                    {openSection === 'transport' ? <i className="right fas fa-angle-down"></i> : <i className="fas fa-angle-left right"></i>}
                  </p>
                </a>
                {openSection === 'transport' && (
                  <ul className="nav nav-treeview" style={{ display: "block" }}>
                    <Can permission="Transport-Chauffeurs-Voir">
                      <li className="nav-item">
                        <Link to="/chauffeurs-vehicules" className="nav-link">
                          <TbUserScreen className='nav-icon' />
                          <p>Chauffeurs / Véhicules</p>
                        </Link>
                      </li>
                    </Can>
                    <li className="nav-item">
                      <Link to="/lignes-transport" className="nav-link">
                        <LiaMapMarkedAltSolid className='nav-icon' />
                        <p>Lignes de Transport</p>
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link to="/suivi-bus" className="nav-link">
                        <MdOutlineBusAlert className='nav-icon' />
                        <p>Suivi Bus</p>
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link to="/cartes-chauffeurs" className="nav-link">
                        <TiBusinessCard className="nav-icon" />
                        <p>Cartes Chauffeurs</p>
                      </Link>
                    </li>
                  </ul>
                )}
              </li>
            </Can>
            {/* Statistiques */}
            <li className="nav-item">
              <Link to="/statistiques" className="nav-link">
                <FaChartBar className='nav-icon' />
                <p>Statistiques</p>
              </Link>
            </li>

            {/* Déconnexion */}
            <li className="nav-item">
              <a href="#" className="nav-link" onClick={(e) => { e.preventDefault(); handleLogout(); }}>
                <i className="nav-icon fas fa-sign-out-alt"></i>
                <p>Déconnexion</p>
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;