import React from 'react';
import { Link } from 'react-router-dom';
import Can from '../../can';
import {
    FaBuilding,
    FaUserTie,
    FaCalculator,
    FaGraduationCap,
    FaUtensils,
    FaBook,
    FaBus,
    FaUserClock,
    FaClipboardList,
    FaArchive
} from 'react-icons/fa';
import './Archiver.css'

const Archiver = () => {

    const modules = [
        { to: 'Administration', title: 'Administration', icon: <FaBuilding size={24} />, permission: 'Ressources Humaines-Gestion des employées-Voir' },
        { to: 'Ressources Humaines', title: 'Ressources Humaines', icon: <FaUserTie size={24} />, permission: 'Ressources Humaines-Gestion demande de congé-Voir' },
        { to: 'Comptabilité', title: 'Comptabilité', icon: <FaCalculator size={24} />, permission: 'Ressources Humaines-Gestion demande de congé-Voir' },
        { to: 'Académique', title: 'Académique', icon: <FaGraduationCap size={24} />, permission: 'Ressources Humaines-Gestion pointage-Voir' },
        { to: 'Cantine', title: 'Cantine', icon: <FaUtensils size={24} />, permission: 'Ressources Humaines-rapports pointage-Voir' },
        { to: 'Bibliothèque', title: 'Bibliothèque', icon: <FaBook size={24} />, permission: 'Ressources Humaines-Gestion de mes pointage-Voir' },
        { to: 'Transport', title: 'Transport', icon: <FaBus size={24} />, permission: 'Ressources Humaines-Gestion de mes demande de congé-Voir' },
        { to: 'Absences', title: 'Absences', icon: <FaUserClock size={24} />, permission: 'Ressources Humaines-Gestion de mes demande de congé-Voir' },
        { to: 'Notes', title: 'Notes', icon: <FaClipboardList size={24} />, permission: 'Ressources Humaines-Gestion de mes demande de congé-Voir' },
        { to: 'Parametres', title: 'Paremétres', icon: <FaClipboardList size={24} />, permission: 'Ressources Humaines-Gestion de mes demande de congé-Voir' }
    ];
    return (
        <div className="container py-4">
            <nav>
                <Link to="/dashboard">Dashboard</Link> / Arhcives
            </nav>
            {/* En-tête avec icône */}
            <div className="d-flex align-items-center justify-content-center mb-5">
                {/* <FaArchive className="text-primary me-3" size={28} /> */}
                <h2 className="mb-0 text-center"> Les Archives</h2>
            </div>

            {/* Grille de cartes améliorée */}
            <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
                {modules.map((mod, idx) => (
                    <Can permission={mod.permission} key={idx}>
                        <div className="col mb-3" >
                        <Link to={`/archivemodule/${mod.to}`} className="text-decoration-none text-secondary">
                        <div className="cardModule card h-100  shadow-sm transition-all hover-transform" >
                                    <div className="card-body text-center p-4 d-flex flex-column align-items-center  " >
                                        <div className="icon-wrapper bg-light rounded-circle p-3 mb-3">
                                            <span className="text-secondary">{mod.icon}</span>
                                        </div>
                                        <h5 className="card-title mb-0">{mod.title}</h5>
                                        {/* <small className="text-muted mt-2">Accéder aux archives</small> */}
                                    </div>
                                </div>
                            </Link>
                        </div>
                    </Can>
                ))}
            </div>
        </div>
    );
};

export default Archiver;