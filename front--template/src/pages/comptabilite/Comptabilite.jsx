import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import Typerevenue from './Typerevenue'
import Typedepense from './Typedepense'
import DepensesC from './DepensesC'
import RevenusC from './RevenusC'

const Comptabilite = () => {

    useEffect(() => {
        
        const savedTab = localStorage.getItem('activeTab')||'#TypeRevenus';
        if (savedTab) {
            const tabTrigger = document.querySelector(`a[href="${savedTab}"]`);
            if (tabTrigger) {
                new window.bootstrap.Tab(tabTrigger).show();
            }
        }
    }, []);

    return (
        <div>
            <nav classNameName="mt-5">
                <Link to="/dashboard">Dashboard</Link>
                <span> / </span>
                <span>Gestion des Dépenses et des Revenus</span>
            </nav>

            <div className="row mt-2">
                <div className="col-md-12">
                    <div className="card  card-tabs">
                        <div className="card-header p-2 pt-1">
                            <ul className="nav nav-tabs custom-tabs " id="custom-tabs-five-tab" role="tablist" >
                                {/* type revenus */}
                                <li className="nav-item">
                                    <a
                                        className="nav-link"
                                        id="custom-tabs-five-normal-tab"
                                        //pill ajoute ou supprime la classe active
                                        data-toggle="pill"
                                        href="#TypeRevenus"
                                        role="tab"
                                        aria-controls="custom-tabs-five-overlay"
                                        aria-selected="true"
                                        onClick={() => localStorage.setItem('activeTab', '#TypeRevenus')}
                                        >
                                        Gestion Types Revenus
                                    </a>
                                </li>

                                {/* Type depenses */}
                                <li className="nav-item">
                                    <a
                                        className="nav-link"
                                        id="custom-tabs-five-normal-tab"
                                        data-toggle="pill"
                                        href="#TypeDepense"
                                        role="tab"
                                        aria-controls="custom-tabs-five-overlay"
                                        aria-selected="false"
                                        onClick={() => localStorage.setItem('activeTab', '#TypeDepense')}
                                    > Gestion Types Dépenses</a>
                                </li>

                                {/* Revenus */}
                                <li className="nav-item">
                                    <a
                                        className="nav-link"
                                        id="custom-tabs-five-normal-tab"
                                        data-toggle="pill"
                                        href="#revenus"
                                        role="tab"
                                        aria-controls="custom-tabs-five-overlay"
                                        aria-selected="false"
                                        onClick={() => localStorage.setItem('activeTab', '#revenus')}
                                    > Gestion Revenus</a>
                                </li>
                                {/* Depenses */}
                                <li className="nav-item">
                                    <a
                                        className="nav-link"
                                        id="custom-tabs-five-normal-tab"
                                        data-toggle="pill"
                                        href="#depenses"
                                        role="tab"
                                        aria-controls="custom-tabs-five-overlay"
                                        aria-selected="false"
                                        onClick={() => localStorage.setItem('activeTab', '#depenses')}
                                    >Gestion Dépenses</a>
                            </li>
                        </ul>
                    </div>
                    <div className="card-body">
                        <div className="tab-content" id="custom-tabs-five-tabContent">
                            {/* types revenus */}
                            <div className="tab-pane fade show active" id="TypeRevenus" role="tabpanel" aria-labelledby="custom-tabs-five-normal-tab">
                                <Typerevenue />
                            </div>
                            {/* types depenses */}
                            <div className="tab-pane fade" id="TypeDepense" role="tabpanel" aria-labelledby="custom-tabs-five-normal-tab">
                                <Typedepense />
                            </div>
                            {/* Revenus */}
                            <div className="tab-pane fade" id="revenus" role="tabpanel" aria-labelledby="custom-tabs-five-normal-tab">
                                <RevenusC />
                            </div>
                            {/* depenses */}
                            <div className="tab-pane fade" id="depenses" role="tabpanel" aria-labelledby="custom-tabs-five-normal-tab">
                                <DepensesC />
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>

        </div >
    )
}

export default Comptabilite
