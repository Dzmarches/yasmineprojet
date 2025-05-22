import React from 'react';
import { Link } from 'react-router-dom';
import '../Archivage/Archiver.css';

import note from '../../assets/imgs/note.png';
import devoir from '../../assets/imgs/duty.png';
import emploi from '../../assets/imgs/emploi.png'

const Archiver = () => {
    const modules = [
        { to: 'noteeleve', title: 'Note', image: note },
        { to: 'devoireleve', title: 'Devoir', image: devoir },
        { to: 'emploieleve', title: 'Emploi Du Temps', image: emploi },
        // { to: 'Académique', title: 'Académique', image: note },
        // { to: 'Parametres', title: 'Paramètres', image: note }
    ];

    return (
        <div className="container py-4">
            <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
                {modules.map((mod, idx) => (
                    <div className="col mb-3" key={idx}>
                        <Link to={`/${mod.to}`} className="text-decoration-none text-secondary">
                            <div className="cardModule card h-100 shadow-sm transition-all hover-transform">
                                <div className="card-body text-center p-4 d-flex flex-column align-items-center">
                                    <div className="icon-wrapper bg-light rounded-circle p-3 mb-3">
                                        <img
                                            src={mod.image}
                                            alt={mod.title}
                                            style={{ width: '60px', height: '60px', objectFit: 'contain' }}
                                        />
                                    </div>
                                    <h5 className="card-title mb-0">{mod.title}</h5>
                                </div>
                            </div>
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Archiver;
