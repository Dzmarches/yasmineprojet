import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Typerevenue from './Typerevenue';
import Typedepense from './Typedepense';
import DepensesC from './DepensesC';
import RevenusC from './RevenusC';

const Comptabilite = () => {
  const [activeTab, setActiveTab] = useState('#TypeRevenus');

  // Récupère le dernier onglet sélectionné au chargement
  useEffect(() => {
    const savedTab = localStorage.getItem('activeTab') || '#TypeRevenus';
    setActiveTab(savedTab);
  }, []);

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
    localStorage.setItem('activeTab', tabId);
  };

  return (
    <div>
      <nav className="mt-5">
        <Link to="/dashboard">Dashboard</Link>
        <span> / </span>
        <span>Gestion des Dépenses et des Revenus</span>
      </nav>

      <div className="row mt-2">
        <div className="col-md-12">
          <div className="card card-tabs">
            <div className="card-header p-2 pt-1">
              <ul className="nav nav-tabs custom-tabs" role="tablist">
                <li className="nav-item">
                  <a
                    className={`nav-link ${activeTab === '#TypeRevenus' ? 'active' : ''}`}
                    onClick={() => handleTabClick('#TypeRevenus')}
                  >
                    Gestion Types Revenus
                  </a>
                </li>
                <li className="nav-item">
                  <a
                    className={`nav-link ${activeTab === '#TypeDepense' ? 'active' : ''}`}
                    onClick={() => handleTabClick('#TypeDepense')}
                  >
                    Gestion Types Dépenses
                  </a>
                </li>
                <li className="nav-item">
                  <a
                    className={`nav-link ${activeTab === '#revenus' ? 'active' : ''}`}
                    onClick={() => handleTabClick('#revenus')}
                  >
                    Gestion Revenus
                  </a>
                </li>
                <li className="nav-item">
                  <a
                    className={`nav-link ${activeTab === '#depenses' ? 'active' : ''}`}
                    onClick={() => handleTabClick('#depenses')}
                  >
                    Gestion Dépenses
                  </a>
                </li>
              </ul>
            </div>

            <div className="card-body">
              <div className="tab-content">
                {activeTab === '#TypeRevenus' && (
                  <div className="tab-pane fade show active">
                    <Typerevenue />
                  </div>
                )}
                {activeTab === '#TypeDepense' && (
                  <div className="tab-pane fade show active">
                    <Typedepense />
                  </div>
                )}
                {activeTab === '#revenus' && (
                  <div className="tab-pane fade show active">
                    <RevenusC />
                  </div>
                )}
                {activeTab === '#depenses' && (
                  <div className="tab-pane fade show active">
                    <DepensesC />
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

export default Comptabilite;
