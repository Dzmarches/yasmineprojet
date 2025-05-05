
import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import ParametreRetard from './ParametreRetard';
import HeureSup from '../HeureSup';



const Parameterpaie = () => {

    useEffect(() => {
        const savedTab = localStorage.getItem('activeTabPP')|| '#GCE';
        if (savedTab) {
            const tabTrigger = document.querySelector(`a[href="${savedTab}"]`);
            if (tabTrigger) {
                new window.bootstrap.Tab(tabTrigger).show();
            }
        }
    }, []);

    return (
        <div>
            <nav className="mt-5">
                <Link to="/dashboard">Dashboard</Link>
                <span> / </span>
                <span>Paramètres de paie</span>
            </nav>

            <div className="row mt-2">
                <div className="col-md-12">
                    <div className="card  card-tabs">
                        <div className="card-header p-2 pt-1">
                            <ul className="nav nav-tabs custom-tabs " id="custom-tabs-five-tab" role="tablist" >
                                <li className="nav-item">
                                    <a
                                        className="nav-link"
                                        id="custom-tabs-five-normal-tab"
                                        data-toggle="pill"
                                        href="#GCE"
                                        role="tab"
                                        aria-controls="custom-tabs-five-overlay"
                                        aria-selected="true"
                                        onClick={() => localStorage.setItem('activeTabPP', '#GCE')}
                                    >
                                       Heures supplémentaires
                                    </a>
                                </li>

                                <li className="nav-item">
                                    <a
                                        className="nav-link"
                                        id="custom-tabs-five-normal-tab"
                                        data-toggle="pill"
                                        href="#PPE"
                                        role="tab"
                                        aria-controls="custom-tabs-five-overlay"
                                        aria-selected="false"
                                        onClick={() => localStorage.setItem('activeTabPP', '#PPE')}
                                    > paramétrer les retards</a>
                                </li>
                            </ul>
                        </div>
                        <div className="card-body">
                            <div className="tab-content" id="custom-tabs-five-tabContent">
                                {/* gestiondescontrat */}
                                <div className="tab-pane fade show active" id="GCE" role="tabpanel" aria-labelledby="custom-tabs-five-normal-tab">
                                    <HeureSup/>
                                 </div>
                                {/* paimeeleve */}
                                <div className="tab-pane fade" id="PPE" role="tabpanel" aria-labelledby="custom-tabs-five-normal-tab">
                                     <ParametreRetard/>
                                     </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>

        </div >
    )
}

export default Parameterpaie


