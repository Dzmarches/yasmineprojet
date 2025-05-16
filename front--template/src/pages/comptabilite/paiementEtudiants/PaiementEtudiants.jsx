import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ContratEleve from './ContratEleve';
import PlanningPaiment from './PlanningPaiment';

const PaiementEtudiants = () => {
  const [activeTab2, setActiveTab2] = useState('#GCE');

  useEffect(() => {
    const savedTab = localStorage.getItem('activeTab2') || '#GCE';
    setActiveTab2(savedTab);
  }, []);

  const handleTabClick = (tabId) => {
    setActiveTab2(tabId);
    localStorage.setItem('activeTab2', tabId);
  };

  return (
    <div>
      <nav className="mt-5">
        <Link to="/dashboard">Dashboard</Link>
        <span> / </span>
        <span>Gestion Paiements Élèves</span>
      </nav>

      <div className="row mt-2">
        <div className="col-md-12">
          <div className="card card-tabs">
            <div className="card-header p-2 pt-1" style={{ position: 'relative' }}>
              <ul className="nav nav-tabs custom-tabs" role="tablist">
                <li className="nav-item">
                  <button
                    className={`nav-link ${activeTab2 === '#GCE' ? 'active' : ''}`}
                    onClick={() => handleTabClick('#GCE')}
                  >
                    Gestion Contrats Élèves
                  </button>
                </li>
                <li className="nav-item">
                  <button
                    className={`nav-link ${activeTab2 === '#PPE' ? 'active' : ''}`}
                    onClick={() => handleTabClick('#PPE')}
                  >
                    Planning
                  </button>
                </li>
              </ul>

              {/* Légende des couleurs */}
              <div style={{
                position: 'absolute',
                right: '0',
                display: 'flex',
                marginTop: '5px',
                marginBottom: '5px',
                marginRight: '35px',
                gap: '12px',
                alignItems: 'center',
                flexWrap: 'wrap',
                fontFamily: 'Arial, sans-serif',
              }}>
                <div style={{ backgroundColor: '#A9DFBF', padding: '6px 10px', borderRadius: '15px', minWidth: '150px' }}>
                  🟢 Payé
                </div>
                <div style={{ backgroundColor: '#F5B7B1', padding: '6px 10px', borderRadius: '15px', minWidth: '150px' }}>
                  🔴 Retard &gt; 7 jours
                </div>
                <div style={{ backgroundColor: '#FAD7A0', padding: '6px 10px', borderRadius: '15px', minWidth: '150px' }}>
                  🟠 Retard ≤ 7 jours
                </div>
                <div style={{ backgroundColor: '#FCF3CF', padding: '6px 10px', borderRadius: '15px', minWidth: '150px' }}>
                  🟡 À venir ≤ 7 jours
                </div>
              </div>
            </div>

            <div className="card-body">
              <div className="tab-content">
                {activeTab2 === '#GCE' && (
                  <div className="tab-pane fade show active">
                    <ContratEleve />
                  </div>
                )}
                {activeTab2 === '#PPE' && (
                  <div className="tab-pane fade show active">
                    <PlanningPaiment />
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default PaiementEtudiants;
