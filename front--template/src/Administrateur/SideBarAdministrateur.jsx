import React, { useState } from 'react';
import logo from '../assets/imgs/etudiant.png';
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
import { Link, Route, useNavigate } from 'react-router-dom'; // Ajoutez useNavigate ici
import { FaMoneyBillTransfer, FaSchoolFlag, FaUsersGear } from 'react-icons/fa6';
import { BiSliderAlt } from 'react-icons/bi';
import { AiFillReconciliation } from 'react-icons/ai';
import { RiHome2Line } from 'react-icons/ri';
import { TfiAnnouncement } from "react-icons/tfi";
import axios from 'axios';

const SideBarAdministrateur = () => {
  const [openSection, setOpenSection] = useState(null);
  const username = localStorage.getItem('username') || 'Administrateur';
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
      // Appel à l'endpoint de déconnexion du backend
      await axios.post('http://localhost:5000/api/logout', {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (error) {
      console.error("Erreur lors de la déconnexion", error);
    }
    // Suppression du token et des informations de session du localStorage
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
          <img src={logo} className="userImg" alt="User Image" width={50} />
          <div className="info text-center">
            <a href="#" className="d-block">{username}</a>
          </div>
        </div>

        <div className="user-panel mt-3 pb-3 mb-3 d-flex">
          <div className="box-date">
            <p> <MdOutlineDateRange /> &nbsp;{formattedDate}</p>
          </div>
        </div>

        <nav className="mt-2">
          <ul className="nav nav-pills nav-sidebar flex-column" data-widget="treeview" role="menu" data-accordion="false">
            <li className="nav-item">
              <a href="/DashboardAdministrateur" className="nav-link">
                <i className="nav-icon fas fa-home"></i>
                <p>Tableau de bord</p>
              </a>
            </li>

            <li className="nav-header">GESTION ADMINISTRATEUR</li>
            <li className="nav-item" onClick={() => toggleSection('admin')}>
              <a href="#" className="nav-link">
                <MdOutlineSettings className="nav-icon" />
                <p>
                  Gestion des privilèges
                  {openSection === 'admin' ? <i className="right fas fa-angle-down"></i> : <i className="fas fa-angle-left right"></i>}
                </p>
              </a>
              {openSection === 'admin' && (
                <ul className="nav nav-treeview" style={{ display: "block" }}>
                  <li className="nav-item">
                    <a href="pages/mailbox/compose.html" className="nav-link">
                      <GrUserSettings className='nav-icon' />
                      <p>Gestion Utilisateurs</p>
                    </a>
                  </li>
                  <li className="nav-item">
                    <a href="pages/mailbox/read-mail.html" className="nav-link">
                      <GrUserSettings className='nav-icon' />
                      <p>Gestion Roles</p>
                    </a>
                  </li>
                  <li className="nav-item">
                    <a href="pages/mailbox/read-mail.html" className="nav-link">
                      <GrUserSettings className='nav-icon' />
                      <p>Gestion permissions</p>
                    </a>
                  </li>
                  <li className="nav-item">
                    <a href="pages/mailbox/read-mail.html" className="nav-link">
                      <GrUserSettings className='nav-icon' />
                      <p>Gestion comptes</p>
                    </a>
                  </li>
                </ul>
              )}
            </li>

            <li className="nav-header">GESTION DES ECOLES</li>
            <li className="nav-item" onClick={() => toggleSection('ecole')}>
              <a href="#" className="nav-link">
                <MdOutlineSettings className="nav-icon" />
                <p>
                  Gestion Ecoles
                  {openSection === 'ecole' ? <i className="right fas fa-angle-down"></i> : <i className="fas fa-angle-left right"></i>}
                </p>
              </a>
              {openSection === 'ecole' && (
                <ul className="nav nav-treeview" style={{ display: "block" }}>
                  <li className="nav-item">
                    <a href="pages/mailbox/compose.html" className="nav-link">
                      <FaSchoolFlag className='nav-icon' />
                      <p>Ecoles principales</p>
                    </a>
                  </li>
                  <li className="nav-item">
                    <a href="pages/mailbox/read-mail.html" className="nav-link">
                      <FaSchoolFlag className='nav-icon' />
                      <p>Ecoles</p>
                    </a>
                  </li>
                  <li className="nav-item">
                    <a href="pages/mailbox/read-mail.html" className="nav-link">
                      <TbReportSearch className='nav-icon' />
                      <p>Rapports</p>
                    </a>
                  </li>
                </ul>
              )}
            </li>

            <li className="nav-item" onClick={() => toggleSection('parametres')}>
              <a href="#" className="nav-link">
                <MdOutlineSettings className="nav-icon" />
                <p>
                  Gestion Paramètres
                  {openSection === 'parametres' ? <i className="right fas fa-angle-down"></i> : <i className="fas fa-angle-left right"></i>}
                </p>
              </a>
              {openSection === 'parametres' && (
                <ul className="nav nav-treeview" style={{ display: "block" }}>
                  <li className="nav-item">
                    <a href="pages/mailbox/compose.html" className="nav-link">
                      <FaSchoolFlag className='nav-icon' />
                      <p>Paramètres Ecole</p>
                    </a>
                  </li>
                </ul>
              )}
            </li>

            <li className="nav-item" onClick={() => toggleSection('GEP')}>
              <a href="#" className="nav-link">
                <MdOutlineSettings className="nav-icon" />
                <p>
                  Espace publicitaire
                  {openSection === 'GEP' ? <i className="right fas fa-angle-down"></i> : <i className="fas fa-angle-left right"></i>}
                </p>
              </a>
              {openSection === 'GEP' && (
                <ul className="nav nav-treeview" style={{ display: "block" }}>
                  <li className="nav-item">
                    <a href="pages/mailbox/compose.html" className="nav-link">
                      <TfiAnnouncement className="nav-icon" />
                      <p>Espace publicitaire</p>
                    </a>
                  </li>
                </ul>
              )}
            </li>

            <li className="nav-item" onClick={() => toggleSection('stat')}>
              <a href="#" className="nav-link">
                <FaChartBar className='nav-icon' />
                <p>
                  Statistiques
                  {openSection === 'stat' ? <i className="right fas fa-angle-down"></i> : <i className="fas fa-angle-left right"></i>}
                </p>
              </a>
              {openSection === 'stat' && (
                <ul className="nav nav-treeview" style={{ display: "block" }}>
                  <li className="nav-item">
                    <a href="pages/mailbox/compose.html" className="nav-link">
                      <FaChartBar className='nav-icon' />
                      <p>Ecole</p>
                    </a>
                  </li>
                  <li className="nav-item">
                    <a href="pages/mailbox/compose.html" className="nav-link">
                      <FaChartBar className='nav-icon' />
                      <p>Application</p>
                    </a>
                  </li>
                </ul>
              )}
            </li>

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

export default SideBarAdministrateur;