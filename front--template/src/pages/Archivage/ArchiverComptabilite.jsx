import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { Link, useParams } from 'react-router-dom';
import recherche from '../../assets/imgs/recherche.png'
import { FaHistory, FaTrash } from 'react-icons/fa';
import { listePlanning, listeContrat, listeD, listeR, listeTD, listeTR } from './ApiListeArchives.js';

import {
    ArchiverPlanning, RestaurerContrat, ArchiverD, RestaurerD, ArchiverTD,
    RestaurerTD, ArchiverR, RestaurerR, ArchiverTR, RestaurerTR,
} from './ApiRestaureSupprimer.js';
import axios from 'axios';

const ArchiverComptabilite = () => {
    const [activeTab, setActiveTab] = useState('#typeRevenu');
    const [listeTypeRevenu, setListeTypeRevenu] = useState([]);
    const [listeTypeDepense, setListeTypeDepense] = useState([]);
    const [listeRevenu, setListeRevenu] = useState([]);
    const [listeDepense, setListeDepense] = useState([]);
    const [listeContrat, setListeContrat] = useState([]);
    const [listePlanning, setListePlanning] = useState([]);
    const [selectedEcole, setSelectedEcole] = useState(null);
    const [filteredEcoles, setFilteredEcoles] = useState([]);
    const [ecole, setEcoles] = useState([]);

    useEffect(() => {
        const fetchEcoles = async () => {
            try {
               
                const token = localStorage.getItem('token');
                if (!token) {
                    console.error('Aucun token trouvé. Veuillez vous connecter.');
                    return;
                }
                const response = await axios.get('http://localhost:5000/ecoles', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                // Vérifier que les données contiennent bien les champs nécessaires
                const ecolesWithDefaults = response.data.map(ecole => ({
                    ...ecole,
                    nomecole: ecole.nomecole || '',
                    nom_arecole: ecole.nom_arecole || '',
                }));
                setEcoles(ecolesWithDefaults);
                setFilteredEcoles(ecolesWithDefaults);
            } catch (error) {
                console.error('Erreur lors de la récupération des écoles', error);
            }
        };
        fetchEcoles();
    }, []);

    // Récupère le dernier onglet sélectionné au chargement
    useEffect(() => {
        const savedTab = localStorage.getItem('activeTabC') || '#typeRevenu';
        setActiveTab(savedTab);
        console.log('activeTabC', savedTab)
    }, []);

    const handleTabClick = (tabId) => {
        setActiveTab(tabId);
        setCurrentPage(1);
        localStorage.setItem('activeTabC', tabId);
    };

    //recupere les donnéé
    useEffect(() => {
        const fetchData = async () => {
            if (activeTab === '#typeRevenu') {
                const data = await listeTR();
                data ? setListeTypeRevenu(data) : setListeTypeRevenu([]);

            } else if (activeTab === '#typeDepense') {
                const data = await listeTD();
                data ? setListeTypeDepense(data) : setListeTypeDepense([]);

            } else if (activeTab === '#Revenus') {
                const data = await listeR();
                data ? setListeRevenu(data) : setListeRevenu([]);

            } else if (activeTab === '#Depenses') {
                const data = await listeD();
                data ? setListeDepense(data) : setListeDepense([]);

            } else if (activeTab === '#Contrat') {
                const data = await listeContrat();
                console.log('dataContrat', data);
                data ? setListeContrat(data) : setListeContrat([]);

            } else if (activeTab === '#planning') {
                const data = await listePlanning();
                data ? setListePlanning(data) : setListePlanning([]);

            }
        }
        fetchData();
    }, [activeTab]);


    const modules = [
        { to: 'typeRevenu', title: 'Types Revenus', permission: 'Comptabilité-Voir' },
        { to: 'typeDepense', title: 'Types Depenses', permission: 'Comptabilité-Voir' },
        { to: 'Revenus', title: 'Revenus', permission: 'Comptabilité-Voir' },
        { to: 'Depenses', title: 'Depenses', permission: 'Comptabilité-Voir' },
        { to: 'Contrat', title: 'Contrats Paiements  Élèves', permission: 'Comptabilité-Voir' },
        { to: 'planning', title: 'Planning Paiements  Élèves', permission: 'Comptabilité-Voir' },
    ]


    //charger la table selon tab selectionner
    console.log('listeTypeRevenu', listeTypeRevenu);
    const tableConfigs = {
        '#typeRevenu': {
            columns: ['ID', 'Type', 'Remarque', 'Ecole', 'Actions'],
            rows: listeTypeRevenu.map((item, index) => ({
                id: index + 1, type: item.type, remarque: item.remarque,
                Ecole: item.Ecole?.nomecole || '',
                //actions
                Actions: (
                    <div style={{ display: 'flex', justifyContent: '', width: "100px", alignItems: 'center', textAlign: 'center' }}>
                        <button
                            className="btn btn-outline-primary action-btn"
                            onClick={
                                async () => {
                                    await RestaurerTR(emp.id);
                                    const updatedData = await listeTR();
                                    updatedData ? setListeTypeRevenu(updatedData) : setListeTypeRevenu([]);
                                }}
                            title="Restaurer">
                            <FaHistory />
                        </button>
                        <button
                            className="btn btn-outline-danger action-btn"
                            onClick={async () => {
                                await ArchiverTR(emp.id);
                                const updatedData = await listeTR();
                                updatedData ? setListeTypeRevenu(updatedData) : setListeTypeRevenu([]);
                            }}
                            title="Supprimer"><FaTrash />
                        </button>
                    </div>
                )
            }))
        },
        '#typeDepense': {
            columns: ['ID', 'Type', 'Remarque', 'Ecole', 'Actions'],
            rows: listeTypeDepense.map((item, index) => ({
                id: index + 1, type: item.type, remarque: item.remarque,
                Ecole: item.Ecole?.nomecole || '',
                //actions
                Actions: (
                    <div style={{ display: 'flex', justifyContent: '', width: "100px", alignItems: 'center', textAlign: 'center' }}>
                        <button
                            className="btn btn-outline-primary action-btn"
                            onClick={
                                async () => {
                                    await RestaurerTD(emp.id);
                                    const updatedData = await listeTD();
                                    updatedData ? setListeDepense(updatedData) : setListeDepense([]);
                                }}
                            title="Restaurer">
                            <FaHistory />
                        </button>
                        <button
                            className="btn btn-outline-danger action-btn"
                            onClick={async () => {
                                await ArchiverTD(emp.id);
                                const updatedData = await listeTD();
                                updatedData ? setListeDepense(updatedData) : setListeDepense([]);
                            }}
                            title="Supprimer"><FaTrash />
                        </button>
                    </div>
                )
            }))
        }, '#Revenus': {
            columns: ['ID', 'Code', 'Type', 'Libellé du revenu(FR)', 'Libellé du revenu(AB)', 'Montant', 'Date', 'Source(FR)',
                'Mode Paiement', 'Pièce jointe', 'Ecole', 'Actions'],
            rows: listeRevenu.map((item, index) => ({
                id: index + 1, code: item.code, type: item.TypeRevenue?.type, lib: item.cause_fr, libfr: item.cause_ar, montant: item.montant,
                date: item.date ? moment(item.date).format("DD-MM-YYYY") : '', source: item.par_fr, modepaie: item.mode_paie,
                fichier: (<div style={{
                    width: "40px", height: "40px", border: "2px solid gray", display: "flex",
                    alignItems: "center", justifyContent: "center", overflow: "hidden", cursor: "pointer", padding: "5px", marginLeft: '10px',
                }}
                    onClick={() => { if (item?.fichier) { window.open(url + item.fichier, "_blank"); } }}
                >
                    📄
                </div>
                ),


                Ecole: item.Ecole?.nomecole || '',
                //actions
                Actions: (
                    <div style={{ display: 'flex', justifyContent: '', width: "100px", alignItems: 'center', textAlign: 'center' }}>
                        <button
                            className="btn btn-outline-primary action-btn"
                            onClick={
                                async () => {
                                    await RestaurerR(emp.id);
                                    const updatedData = await listeR();
                                    updatedData ? setListeRevenu(updatedData) : setListeRevenu([]);
                                }}
                            title="Restaurer">
                            <FaHistory />
                        </button>
                        <button
                            className="btn btn-outline-danger action-btn"
                            onClick={async () => {
                                await ArchiverR(emp.id);
                                const updatedData = await listeR();
                                updatedData ? setListeRevenu(updatedData) : setListeRevenu([]);
                            }}
                            title="Supprimer"><FaTrash />
                        </button>
                    </div>
                )
            }))
        }
        , '#Depenses': {
            columns: ['ID', 'Code', 'Type', 'Libellé du revenu(FR)', 'Libellé du revenu(AB)', 'Montant', 'Date', 'Source(FR)',
                'Mode Paiement', 'Pièce jointe', 'Ecole', 'Actions'],
            rows: listeDepense.map((item, index) => ({
                id: index + 1, code: item.code, type: item.TypeDepense?.type, lib: item.cause_fr, libfr: item.cause_ar, montant: item.montant,
                date: item.date ? moment(item.date).format("DD-MM-YYYY") : '', source: item.par_fr, modepaie: item.mode_paie,
                fichier: (<div style={{
                    width: "40px", height: "40px", border: "2px solid gray", display: "flex",
                    alignItems: "center", justifyContent: "center", overflow: "hidden", cursor: "pointer", padding: "5px", marginLeft: '10px',
                }}
                    onClick={() => { if (item?.fichier) { window.open(url + item.fichier, "_blank"); } }}
                >  📄
                </div>
                ),
                Ecole: item.Ecole?.nomecole || '',
                //actions
                Actions: (
                    <div style={{ display: 'flex', justifyContent: '', width: "100px", alignItems: 'center', textAlign: 'center' }}>
                        <button
                            className="btn btn-outline-primary action-btn"
                            onClick={
                                async () => {
                                    await RestaurerD(emp.id);
                                    const updatedData = await listeD();
                                    updatedData ? setListeDepense(updatedData) : setListeDepense([]);
                                }}
                            title="Restaurer">
                            <FaHistory />
                        </button>
                        <button
                            className="btn btn-outline-danger action-btn"
                            onClick={async () => {
                                await ArchiverD(emp.id);
                                const updatedData = await listeTD();
                                updatedData ? setListeDepense(updatedData) : setListeDepense([]);
                            }}
                            title="Supprimer"><FaTrash />
                        </button>
                    </div>
                )
            }))
        }
        , '#Contrat': {
            columns: ['ID', 'Code', 'Niveau', 'Année Scolaire', 'Eléve', 'Debut Paiement', 'Fin Paiement',
                'Total a payer', 'Frais Inscription', 'Action'],
            rows: listeContrat.map((item, index) => ({
                id: index + 1, code: item.code, niveau: item.Eleve?.Nivaux.niveauId,
                annee: item.Anneescolaire ? `${moment(item.Anneescolaire.datedebut).format('YYYY')}/${moment(item.Anneescolaire.datefin).format('YYYY')}` : '',
                eleve: `${item.Eleve?.User?.nom} ${item.Eleve?.User?.prenom}`, dateDp: item.date_debut_paiement,
                DateFp: item.date_sortie, total: item.totalApayer, fraisInsc: item.Eleve?.fraixinscription,
                //actions
                Actions: (
                    <div style={{ display: 'flex', justifyContent: '', width: "100px", alignItems: 'center', textAlign: 'center' }}>
                        <button
                            className="btn btn-outline-primary action-btn"
                            onClick={
                                async () => {
                                    await RestaurerD(emp.id);
                                    const updatedData = await listeD();
                                    updatedData ? setListeDepense(updatedData) : setListeDepense([]);
                                }}
                            title="Restaurer">
                            <FaHistory />
                        </button>
                        <button
                            className="btn btn-outline-danger action-btn"
                            onClick={async () => {
                                await ArchiverD(emp.id);
                                const updatedData = await listeTD();
                                updatedData ? setListeDepense(updatedData) : setListeDepense([]);
                            }}
                            title="Supprimer"><FaTrash />
                        </button>
                    </div>
                )
            }))
        }
        , '#Contrat': {
            columns: ['ID', 'Code', 'Type', 'Libellé du revenu(FR)', 'Libellé du revenu(AB)', 'Montant', 'Date', 'Source(FR)',
                'Mode Paiement', 'Pièce jointe', 'Ecole', 'Actions'],
            rows: listeDepense.map((item, index) => ({
                id: index + 1, code: item.code, type: item.TypeDepense?.type, lib: item.cause_fr, libfr: item.cause_ar, montant: item.montant,
                date: item.date ? moment(item.date).format("DD-MM-YYYY") : '', source: item.par_fr, modepaie: item.mode_paie,
                fichier: (<div style={{
                    width: "40px", height: "40px", border: "2px solid gray", display: "flex",
                    alignItems: "center", justifyContent: "center", overflow: "hidden", cursor: "pointer", padding: "5px", marginLeft: '10px',
                }}
                    onClick={() => { if (item?.fichier) { window.open(url + item.fichier, "_blank"); } }}
                >  📄
                </div>
                ),
                Ecole: item.Ecole?.nomecole || '',
                //actions
                Actions: (
                    <div style={{ display: 'flex', justifyContent: '', width: "100px", alignItems: 'center', textAlign: 'center' }}>
                        <button
                            className="btn btn-outline-primary action-btn"
                            onClick={
                                async () => {
                                    await RestaurerD(emp.id);
                                    const updatedData = await listeD();
                                    updatedData ? setListeDepense(updatedData) : setListeDepense([]);
                                }}
                            title="Restaurer">
                            <FaHistory />
                        </button>
                        <button
                            className="btn btn-outline-danger action-btn"
                            onClick={async () => {
                                await ArchiverD(emp.id);
                                const updatedData = await listeTD();
                                updatedData ? setListeDepense(updatedData) : setListeDepense([]);
                            }}
                            title="Supprimer"><FaTrash />
                        </button>
                    </div>
                )
            }))
        }

    };


    //FILETERED SEARTCH
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
    const [filteredData, setFilteredData] = useState({
        '#typeRevenu': [],
    });
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm);
        }, 300);

        return () => {
            clearTimeout(handler);
        };
    }, [searchTerm]);
    const filterData = (data, searchTerm, selectedEcole) => {
        if (!data) return [];
        return data.filter(item => {
            // Convertir l'objet en chaîne pour la recherche
            const itemString = JSON.stringify(item).toLowerCase();
            // Vérifier la correspondance avec le terme de recherche
            const matchesSearch = searchTerm === '' ||
                itemString.includes(searchTerm.toLowerCase());

            // Vérifier la correspondance avec l'école sélectionnée
            const matchesEcole = !selectedEcole ||
                (item.User?.Ecoles?.[0]?.id === selectedEcole ||
                    item.EcolePrincipal?.id === selectedEcole ||
                    item.Ecole?.id === selectedEcole);

            return matchesSearch && matchesEcole;
        });
    };
    // Mettre à jour les données filtrées
    useEffect(() => {
        const filtered = {
            '#typeRevenu': filterData(listeRevenu, debouncedSearchTerm, selectedEcole),

        };
        setFilteredData(filtered);
        setCurrentPage(1);
    }, [debouncedSearchTerm, selectedEcole,
        listeRevenu,]);


    // Pagination
    const itemsPerPage = 15;
    const [currentPage, setCurrentPage] = useState(1);
    // Récupérer les données courantes en fonction de l'onglet actif
    const currentTableConfig = tableConfigs[activeTab] || { rows: [] };
    const currentRows = currentTableConfig.rows || [];
    // Calculer les éléments à afficher
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = currentRows.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(currentRows.length / itemsPerPage);
    // Générer les numéros de page à afficher
    const pageNumbers = [];
    for (let i = Math.max(1, currentPage - 2); i <= Math.min(currentPage + 2, totalPages); i++) {
        pageNumbers.push(i);
    }

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };
    return (
        <div>
            <nav className="mt-5">
                <Link to="/dashboard">Dashboard</Link>
                <span> / </span>
                <Link to="/archives">Archives</Link>
                <span> / </span>
                <span>Les archives du module Comptabilité </span>
            </nav>

            <div className="row mt-2">
                <div className="col-md-12">
                    <div className="card card-tabs">
                        <div className="card-header p-2 pt-1">
                            <ul className="nav nav-tabs custom-tabs" role="tablist">

                                {modules.map((mod, index) => (
                                    <li key={index} className="nav-item">
                                        <a
                                            className={`nav-link ${activeTab === `#${mod.to}` ? 'active' : ''}`}
                                            onClick={() => handleTabClick(`#${mod.to}`)}
                                        >{mod.title}
                                        </a>
                                    </li>))
                                }
                            </ul>
                        </div>

                        <div className="card-body">
                            <div className="tab-content">
                                <div className="tab-pane fade show active">
                                    {/* debut */}
                                    <div className="card-body">
                                        <div className="filters-section mb-4 p-4 bg-light rounded">
                                            <div className="row">
                                                {/* Bloc Élève */}
                                                <div className="col-md-3">
                                                    <div className="form-group">
                                                        <label className="font-weight-bold">Recherche</label>
                                                        <div className="input-group">
                                                            <input
                                                                type="search"
                                                                className="form-control"
                                                                placeholder="nom,code,montant,mode"
                                                                value={searchTerm}
                                                                onChange={(e) => setSearchTerm(e.target.value)}
                                                                aria-label="Recherche"
                                                                style={{ height: "40px" }}
                                                            />
                                                            <div className="input-group-append">
                                                                <span className="input-group-text bg-white">
                                                                    <img src={recherche} alt="Rechercher" style={{ height: "20px", width: "20px", opacity: 0.7 }} />
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                {/* Bloc École */}
                                                <div className="col-md-3 ">
                                                    <div className="form-group">
                                                        <label className="font-weight-bold">École</label>
                                                        <div className="col-md-4" style={{ flex: '1', marginRight: '10px' }}>
                                                            <select
                                                                name="ecole"
                                                                className="form-control"
                                                                required
                                                                style={{ height: '45px', width: '300px' }}
                                                                onChange={(e) => setSelectedEcole(e.target.value)}
                                                                value={selectedEcole || ''}
                                                            >
                                                                <option value="">Sélectionnez une école</option>
                                                                {ecole.map((item) => (
                                                                    <option key={item.id} value={item.id}>
                                                                        {item.nomecole}
                                                                    </option>
                                                                ))}
                                                            </select>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {tableConfigs[activeTab] && (
                                            <div style={{ overflowX: 'auto', overflowY: 'hidden', scrollBehavior: 'smooth' }}>
                                                <table className="table table-bordered table-hover">
                                                    <thead>
                                                        <tr>
                                                            {tableConfigs[activeTab].columns.map((col, idx) => (
                                                                <th key={idx}>{col}</th>
                                                            ))}
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {currentItems.map((row, idx) => (
                                                            console.log('activeTab', activeTab),
                                                            <tr key={idx}>
                                                                {Object.values(row).map((value, i) => (
                                                                    <td key={i}>{value}</td>
                                                                ))}

                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        )}
                                        {/* arhcivage model  */}
                                        {/* <Modal show={showDeleteModal} onHide={handleClose}>
                                                <Modal.Header closeButton>
                                                    <Modal.Title>Confirmer la suppression</Modal.Title>
                                                </Modal.Header>
                                                <Modal.Body>
                                                    <p>Êtes-vous sûr de vouloir supprimer  ?</p>
                                                </Modal.Body>
                                                <Modal.Footer>
                                                    <Button variant="secondary" onClick={handleClose}>
                                                        Annuler
                                                    </Button>
                                                    <Button
                                                        variant="danger"
                                                        onClick={() => {
                                                            Archiver(ppIdDelete);
                                                            handleClose();
                                                        }}
                                                    >
                                                        Supprimer
                                                    </Button>
                                                </Modal.Footer>
                                            </Modal> */}

                                        {/* <div className="pagination">
                                                <button
                                                    className="btn btn-primary"
                                                    onClick={() => handlePageChange(currentPage - 1)}
                                                    disabled={currentPage === 1}
                                                >
                                                    Précédent
                                                </button>
                                                {pageNumbers.map((number) => (
                                                    <button
                                                        key={number}
                                                        className={`btn ${currentPage === number ? 'btn-info' : 'btn-light'}`}
                                                        onClick={() => handlePageChange(number)}
                                                    >
                                                        {number}
                                                    </button>
                                                ))}
                                                <button
                                                    className="btn btn-primary"
                                                    onClick={() => handlePageChange(currentPage + 1)}
                                                    disabled={currentPage === totalPages}
                                                >
                                                    Suivant
                                                </button>
                                            </div> */}
                                    </div>
                                </div>
                                {/* Pagination */}
                                <div className="pagination">
                                    <button
                                        className="btn btn-primary"
                                        onClick={() => handlePageChange(currentPage - 1)}
                                        disabled={currentPage === 1}
                                    >
                                        Précédent
                                    </button>
                                    {pageNumbers.map((number) => (
                                        <button
                                            key={number}
                                            className={`btn ${currentPage === number ? 'btn-info' : 'btn-light'}`}
                                            onClick={() => handlePageChange(number)}
                                        >
                                            {number}
                                        </button>
                                    ))}
                                    <button
                                        className="btn btn-primary"
                                        onClick={() => handlePageChange(currentPage + 1)}
                                        disabled={currentPage === totalPages}
                                    >
                                        Suivant
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ArchiverComptabilite
