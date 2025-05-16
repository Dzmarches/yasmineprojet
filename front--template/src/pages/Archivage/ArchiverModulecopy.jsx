import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { Link, useParams } from 'react-router-dom';
import recherche from '../../assets/imgs/recherche.png'
import { FaHistory, FaTrash } from 'react-icons/fa';
import {
    archiveremployes, archiverCA, archiverPrimes, archiverHeureSup, archiverheureRetard,
    archiveCongeAnnuel, archiverJournalpaie, archiverPeriodePaie, archiverPointages,
    archiverServices, archiverPostes
}
    from './ApiListeArchives.js';

import {
    SupprimerEmploye, ArchiverEmploye, RestaurerEmploye, RestaurerCA, ArchiverCAs,
    RestaurerPrime, ArchiverPrime, ArchiverHR, RestaurerHR, ArchiverHS, RestaurerHS,
    RestaurerCAnnuel, ArchiverCAnnuel, RestaurerJP, ArchiverJP, RestaurerPP, ArchiverPP,
    RestaurerPoint, ArchiverPoint, RestaurerPost, ArchiverPost, RestaurerService, ArchiverService
} from './ApiRestaureSupprimer.js';
import axios from 'axios';

const ArchiverModule = () => {
    const { module } = useParams();
    const [activeTab, setActiveTab] = useState('#employes');
    const [listearchives, setListearchives] = useState([]);
    const [listearchivesCA, setListearchivesCA] = useState([]);
    const [listearchivesPrimes, setListearchivesPrimes] = useState([]);
    const [listeHS, setListeHS] = useState([]);
    const [listeHR, setListeHR] = useState([]);
    const [listeCongeAnnuel, setListeCongeAnnuel] = useState([]);
    const [listeJournalpaie, setListeJournalpaie] = useState([]);
    const [listePeriodePaie, setListePeriodePaie] = useState([]);
    const [listePointage, setListePointage] = useState([]);
    const [listePoste, setListePoste] = useState([]);
    const [listeService, setListeService] = useState([]);

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
        const savedTab = localStorage.getItem('activeTab3') || '#employes';
        setActiveTab(savedTab);
    }, []);

    const handleTabClick = (tabId) => {
        setActiveTab(tabId);
        setCurrentPage(1);
        localStorage.setItem('activeTab3', tabId);
    };

    //recupere les donnéé
    useEffect(() => {
        const fetchData = async () => {
            if (activeTab === '#employes') {
                const data = await archiveremployes();
                data ? setListearchives(data) : setListearchives([]);

            } else if (activeTab === '#congesAbsences') {
                const data = await archiverCA();
                data ? setListearchivesCA(data) : setListearchivesCA([]);

            } else if (activeTab === '#primes') {
                const data = await archiverPrimes();
                data ? setListearchivesPrimes(data) : setListearchivesPrimes([]);

            } else if (activeTab === '#heureSup') {
                const data = await archiverHeureSup();
                data ? setListeHS(data) : setListeHS([]);

            } else if (activeTab === '#parametreRetard') {
                const data = await archiverheureRetard();
                data ? setListeHR(data) : setListeHR([]);

            } else if (activeTab === '#congeannuels') {
                const data = await archiveCongeAnnuel();
                data ? setListeCongeAnnuel(data) : setListeCongeAnnuel([]);

            } else if (activeTab === '#journalpaie') {
                const data = await archiverJournalpaie();
                data ? setListeJournalpaie(data) : setListeJournalpaie([]);

            } else if (activeTab === '#periodePaie') {
                const data = await archiverPeriodePaie();
                data ? setListePeriodePaie(data) : setListePeriodePaie([]);

            } else if (activeTab === '#pointages') {
                const data = await archiverPointages();
                data ? setListePointage(data) : setListePointage([]);
            } else if (activeTab === '#poste') {
                const data = await archiverPostes();
                data ? setListePoste(data) : setListePoste([]);
            } else if (activeTab === '#service') {
                const data = await archiverServices();
                data ? setListeService(data) : setListeService([]);
            };
        }
        fetchData();
    }, [activeTab]);

    let modules = [];
    switch (module) {
        case "Administration":
            modules = [
                { to: '/employes', title: 'Enseignants', permission: 'Ressources Humaines-Gestion des employées-Voir' },
                { to: '/Conges', title: 'Elèves', permission: 'Ressources Humaines-Gestion demande de congé-Voir' },
                { to: '/rapportConges', title: 'Parents', permission: 'Ressources Humaines-Gestion demande de congé-Voir' },
            ];
            break;
        case "Ressources Humaines":
            modules = [
                { to: 'employes', title: 'Employés', permission: 'Ressources Humaines-Gestion des employées-Voir' },
                { to: 'congeannuels', title: 'Congé Annuels', permission: 'Ressources Humaines-Gestion demande de congé-Voir' },
                { to: 'congesAbsences', title: 'Congés et absences', permission: 'Ressources Humaines-Gestion demande de congé-Voir' },
                { to: 'pointages', title: 'Pointages', permission: 'Ressources Humaines-Gestion demande de congé-Voir' },
                { to: 'poste', title: 'Postes', permission: 'Ressources Humaines-Gestion demande de congé-Voir' },
                { to: 'service', title: 'Services', permission: 'Ressources Humaines-Gestion demande de congé-Voir' },
                { to: 'primes', title: 'Primes', permission: 'Ressources Humaines-Gestion des employées-Voir' },
                { to: 'periodePaie', title: 'Périodes de paie', permission: 'Ressources Humaines-Gestion demande de congé-Voir' },
                { to: 'journalpaie', title: 'Journal de paie', permission: 'Ressources Humaines-Gestion demande de congé-Voir' },
                { to: 'parametreRetard', title: 'Paramétre des retards', permission: 'Ressources Humaines-Gestion demande de congé-Voir' },
                { to: 'heureSup', title: 'Heures supplémentaires', permission: 'Ressources Humaines-Gestion demande de congé-Voir' },
            ]
            break;
        default:
            break;
    }
    //charger la table selon tab selectionner
    const tableConfigs = {
        '#employes': {
            columns: ['ID', 'Code', 'Nom & Prénom', 'Email', 'Numéro de téléphone',
                'Poste', 'Service', 'Actuellement employé', 'Déclaration CNAS', 'Ecole', 'Actions'],
            rows: listearchives.map((emp, index) => ({
                id: index + 1, code: emp.CE, nomprenom: `${emp.User?.nom || ''} - ${emp.User?.prenom || ''}`,
                email: emp.User?.email || '', tel: emp.User?.telephone || '', poste: emp.Poste?.poste || '', service: emp.Service?.service || '',
                statuscompte: emp.User?.statuscompte === 'activer' ? 'Oui' : 'Non',
                dec: emp.declaration === true || emp.declaration === 1 ? 'Oui' : 'Non',
                Ecole: emp.User?.Ecoles?.[0]?.nomecole || '',
                //actions
                Actions: (
                    <div style={{ display: 'flex', justifyContent: '', width: "100px", alignItems: 'center', textAlign: 'center' }}>
                        <button
                            className="btn btn-outline-primary action-btn"
                            onClick={
                                async () => {
                                    await RestaurerEmploye(emp.id);
                                    const updatedData = await archiveremployes();
                                    updatedData ? setListearchives(updatedData) : setListearchives([]);
                                }}
                            title="Restaurer">
                            <FaHistory />
                        </button>
                        <button
                            className="btn btn-outline-danger action-btn"
                            onClick={async () => {
                                await ArchiverEmploye(emp.id);
                                const updatedData = await archiveremployes();
                                updatedData ? setListearchives(updatedData) : setListearchives([]);
                            }}
                            title="Supprimer"><FaTrash />
                        </button>
                        <button
                            className="btn btn-outline-dark action-btn"
                            onClick={async () => {
                                await SupprimerEmploye(emp.id);
                                const updatedData = await archiveremployes();
                                updatedData ? setListearchives(updatedData) : setListearchives([]);
                            }}
                            title="supprimer définitivement"><FaTrash />
                        </button>
                    </div>
                )
            }))
        },
        '#congesAbsences': {
            columns: ['ID', 'Code Employé', 'Nom & Prénom', 'Poste attribué', 'Demande type', 'Date début',
                'Date fin', 'Durée', 'Statut', 'Ecole', 'Actions'],
            rows: listearchivesCA.map((ca, index) => ({
                id: index + 1, code: ca.Employe?.CE, nomprenom: `${ca.Employe?.User?.nom || ''} - ${ca.Employe?.User?.prenom || ''}`,
                poste: ca.Employe?.Poste?.poste || '',
                DT: ca.type_demande || '',
                dateDebut: ca.dateDebut ? moment(ca.dateDebut).format('DD-MM-YYYY') : '',
                dateFin: ca.dateFin ? moment(ca.dateFin).format('DD-MM-YYYY') : '',
                Durée: (ca.dateDebut && ca.dateFin)
                    ? moment(ca.dateFin).diff(moment(ca.dateDebut), 'days') + 1
                    : '',
                statut: ca.statut, Ecole: ca.Employe?.User?.Ecoles?.[0]?.nomecole || '',
                //actions
                Actions: (
                    <div style={{ display: 'flex', justifyContent: '', width: "100px", alignItems: 'center', textAlign: 'center' }}>
                        <button
                            className="btn btn-outline-primary action-btn"
                            onClick={
                                async () => {
                                    await RestaurerCA(ca.id);
                                    const updatedData = await archiverCA();
                                    updatedData ? setListearchivesCA(updatedData) : setListearchivesCA([]);
                                }}
                            title="Restaurer">
                            <FaHistory />
                        </button>
                        <button
                            className="btn btn-outline-danger action-btn"
                            onClick={async () => {
                                await ArchiverCAs(ca.id);
                                const updatedData = await archiverCA();
                                updatedData ? setListearchivesCA(updatedData) : setListearchivesCA([]);
                            }}
                            title="Supprimer"><FaTrash />
                        </button>
                    </div>
                )
            }))
        },
        '#congeannuels': {
            columns: ['ID', 'Date Debut', 'Date Fin', 'Ecole Principale', 'Ecole', 'Actions'],
            rows: listeCongeAnnuel.map((item, index) => ({
                id: index + 1, dateDebut: item.dateDebut ? moment(item.dateDebut).format('DD-MM-YYYY') : '',
                dateFin: item.dateFin ? moment(item.dateFin).format('DD-MM-YYYY') : '',
                EcolePrincipal: item.EcolePrincipal?.nomecole || '', Ecole: item.Ecole?.nomecole || '',
                //actions
                Actions: (
                    <div style={{ display: 'flex', justifyContent: '', width: "100px", alignItems: 'center', textAlign: 'center' }}>
                        <button
                            className="btn btn-outline-primary action-btn"
                            onClick={
                                async () => {
                                    await RestaurerCAnnuel(item.id);
                                    const updatedData = await archiveCongeAnnuel();
                                    updatedData ? setListeCongeAnnuel(updatedData) : setListeCongeAnnuel([]);
                                }}
                            title="Restaurer">
                            <FaHistory />
                        </button>
                        <button
                            className="btn btn-outline-danger action-btn"
                            onClick={async () => {
                                await ArchiverCAnnuel(item.id);
                                const updatedData = await archiveCongeAnnuel();
                                updatedData ? setListeCongeAnnuel(updatedData) : setListeCongeAnnuel([]);
                            }}
                            title="Supprimer"><FaTrash />
                        </button>
                    </div>
                )
            }))
        },
        '#heureSup': {
            columns: ['ID', 'Libellé ', 'Taux', 'Ecole Principale', 'Actions'],
            rows: listeHS.map((item, index) => ({
                id: index + 1, nom: item.nom, taux: item.taux, Ecole: item.EcolePrincipal?.nomecole,
                Actions: (
                    <div style={{ display: 'flex', justifyContent: '', width: "100px", alignItems: 'center', textAlign: 'center' }}>
                        <button
                            className="btn btn-outline-primary action-btn"
                            onClick={
                                async () => {
                                    await RestaurerHS(item.id);
                                    const updatedData = await archiverHeureSup();
                                    updatedData ? setListeHS(updatedData) : setListeHS([]);
                                }}
                            title="Restaurer">
                            <FaHistory />
                        </button>
                        <button
                            className="btn btn-outline-danger action-btn"
                            onClick={async () => {
                                await ArchiverHS(item.id);
                                const updatedData = await archiverHeureSup();
                                updatedData ? setListeHS(updatedData) : setListeHS([]);
                            }}
                            title="Supprimer"><FaTrash />
                        </button>
                    </div>
                )
            }))
        },
        '#primes': {
            columns: ['ID', 'Identifiant Special', 'Code', 'Prime type', 'Montant', 'Prime Cotisable', 'Prime Imposable	',
                'Calculer en fonction des jours de présence ', 'Ecole Principale', 'Actions'],
            rows: listearchivesPrimes.map((prime, index) => ({
                id: index + 1, ID: prime.identifiant_special, code: prime.code,
                type_prime: prime.type_prime, montant: prime.montant,
                pc: prime.prime_cotisable ? 'Oui' : 'Non',
                pi: prime.prime_imposable ? 'Oui' : 'Non', jourpreson: prime.deduire ? 'Oui' : 'Non',
                Ecole: prime.EcolePrincipal?.nomecole || '',
                Actions: (
                    <div style={{ display: 'flex', justifyContent: '', width: "100px", alignItems: 'center', textAlign: 'center' }}>
                        <button
                            className="btn btn-outline-primary action-btn"
                            onClick={
                                async () => {
                                    await RestaurerPrime(prime.id);
                                    const updatedData = await archiverPrimes();
                                    updatedData ? setListearchivesPrimes(updatedData) : setListearchivesPrimes([]);
                                }}
                            title="Restaurer">
                            <FaHistory />
                        </button>
                        <button
                            className="btn btn-outline-danger action-btn"
                            onClick={async () => {
                                await ArchiverPrime(prime.id);
                                const updatedData = await archiverPrimes();
                                updatedData ? setListearchivesPrimes(updatedData) : setListearchivesPrimes([]);
                            }}
                            title="Supprimer"><FaTrash />
                        </button>
                    </div>
                )
            }))
        },
        '#parametreRetard': {
            columns: ['ID', 'Retard Min (<)', 'Retard Max (>=)', 'Equivalent temps à déduire', 'Ecole Principale', 'Actions'],
            rows: listeHR.map((item, index) => ({
                id: index + 1, Rmin: item.Rmin, Rmax: item.Rmax,
                statut: (<>{item.statut}<br />{item.statut === 'autre' && (
                    <span
                        style={{
                            backgroundColor: '#ff4d4d', color: 'white', borderRadius: '15px',
                            padding: '1px 10px', display: 'inline-block', textAlign: 'center',
                        }}>  {item.HE} </span>)}  </>),

                Ecole: item.EcolePrincipal?.nomecole || '',
                Actions: (
                    <div style={{ display: 'flex', justifyContent: '', width: "100px", alignItems: 'center', textAlign: 'center' }}>
                        <button
                            className="btn btn-outline-primary action-btn"
                            onClick={
                                async () => {
                                    await RestaurerHR(item.id);
                                    const updatedData = await archiverheureRetard();
                                    updatedData ? setListeHR(updatedData) : setListeHR([]);
                                }}
                            title="Restaurer">
                            <FaHistory />
                        </button>
                        <button
                            className="btn btn-outline-danger action-btn"
                            onClick={async () => {
                                await ArchiverHR(item.id);
                                const updatedData = await archiverheureRetard();
                                updatedData ? setListeHR(updatedData) : setListeHR([]);
                            }}
                            title="Supprimer"><FaTrash />
                        </button>
                    </div>
                )
            }))
        },
        '#journalpaie': {
            columns: ['ID', 'Periode de paie', 'Code Periode de paie', 'Code Employé', 'Nom et Prénom', 'Déclaration CNAS', 'Actuellement employé',
                'Salaire Net', 'Date', 'Ecole Principale', 'Actions'],
            rows: listeJournalpaie.map((item, index) => ({
                id: index + 1,
                PP: `${new Date(item.PeriodePaie?.dateDebut).toLocaleDateString('fr-FR', { month: 'long' }).toUpperCase()}-
                 ${new Date(item.PeriodePaie?.dateFin).toLocaleDateString('fr-FR', { month: 'long' }).toUpperCase()} `,
                Code: item.PeriodePaie?.code, CodeEmploye: item.Employe?.CE,
                employe: `${item.nom_prenom}`, declaration: item.Employe?.declaration == 1 ? 'Oui' : 'Non',
                statuscompte: item.Employe?.User?.statuscompte === 'activer' ? 'Employé' : 'Non Employé',
                salairenet: item.salaireNet, date: item.date ? moment(item.date).format('DD-MM-YYYY') : '',
                EcolePrincipal: item.PeriodePaie?.EcolePrincipal?.nomecole || '',
                Actions: (
                    <div style={{ display: 'flex', justifyContent: '', width: "100px", alignItems: 'center', textAlign: 'center' }}>
                        <button
                            className="btn btn-outline-primary action-btn"
                            onClick={
                                async () => {
                                    await RestaurerJP(item.id);
                                    const updatedData = await archiverJournalpaie();
                                    updatedData ? setListeJournalpaie(updatedData) : setListeJournalpaie([]);
                                }}
                            title="Restaurer">
                            <FaHistory />
                        </button>
                        <button
                            className="btn btn-outline-danger action-btn"
                            onClick={async () => {
                                await ArchiverJP(item.id);
                                const updatedData = await archiverJournalpaie();
                                updatedData ? setListeJournalpaie(updatedData) : setListeJournalpaie([]);
                            }}
                            title="Supprimer"><FaTrash />
                        </button>
                    </div>
                )
            }))
        },
        '#periodePaie': {
            columns: ['ID', 'Periode de paie', 'Code Periode de paie', 'Date Début', 'Date Fin', 'Statut',
                'Ecole Principale', 'Actions'],
            rows: listePeriodePaie.map((item, index) => ({
                id: index + 1, PP: `${new Date(item.dateDebut).toLocaleDateString('fr-FR', { month: 'long' }).toUpperCase()}-
                 ${new Date(item.dateFin).toLocaleDateString('fr-FR', { month: 'long' }).toUpperCase()} `,
                code: item.code, dateDebut: item.dateDebut ? moment(item.dateDebut).format('DD-MM-YYYY') : '',
                dateFin: item.dateFin ? moment(item.dateFin).format('DD-MM-YYYY') : '',
                statut: item.statut, EcolePrincipal: item.EcolePrincipal?.nomecole || '',
                Actions: (
                    <div style={{ display: 'flex', justifyContent: '', width: "100px", alignItems: 'center', textAlign: 'center' }}>
                        <button
                            className="btn btn-outline-primary action-btn"
                            onClick={
                                async () => {
                                    await RestaurerPP(item.id);
                                    const updatedData = await archiverPeriodePaie();
                                    updatedData ? setListePeriodePaie(updatedData) : setListePeriodePaie([]);
                                }}
                            title="Restaurer">
                            <FaHistory />
                        </button>
                        <button
                            className="btn btn-outline-danger action-btn"
                            onClick={async () => {
                                await ArchiverPP(item.id);
                                const updatedData = await archiverPeriodePaie();
                                updatedData ? setListePeriodePaie(updatedData) : setListePeriodePaie([]);
                            }}
                            title="Supprimer"><FaTrash />
                        </button>
                    </div>
                )
            }))
        },
        '#pointages': {
            columns: [
                'ID', 'Code Employé', 'Nom et Prénom', 'Poste', 'Date', 'Heure Entrée(matin)', 'Heure Sortie(matin)',
                'Heure Entrée(après-midi)', 'Heure Sortie(après-midi)', 'Statut', 'Type pointage', 'Ecole', 'Actions'
            ],
            rows: listePointage.map((item, index) => ({
                id: index + 1, code: item.Employe?.CE, employe: `${item.Employe?.User?.nom} ${item.Employe?.User?.prenom}`,
                poste: item.Employe?.Poste?.poste, date: item.date ? moment(item.date).format('DD-MM-YYYY') : '',
                HeureEMP: item.HeureEMP, HeureSMP: item.HeureSMP, HeureEAMP: item.HeureEAMP,
                HeureSAMP: item.HeureSAMP, statut: item.statut, type: item.type_pointage, Ecole: item.Employe?.User?.Ecoles[0]?.nomecole,
                Actions: (
                    <div style={{ display: 'flex', justifyContent: '', width: "100px", alignItems: 'center', textAlign: 'center' }}>
                        <button
                            className="btn btn-outline-primary action-btn"
                            onClick={
                                async () => {
                                    await RestaurerPoint(item.id);
                                    const updatedData = await archiverPointages();
                                    updatedData ? setListePointage(updatedData) : setListePointage([]);
                                }}
                            title="Restaurer">
                            <FaHistory />
                        </button>
                        <button
                            className="btn btn-outline-danger action-btn"
                            onClick={async () => {
                                await ArchiverPoint(item.id);
                                const updatedData = await archiverPointages();
                                updatedData ? setListePointage(updatedData) : setListePointage([]);
                            }}
                            title="Supprimer"><FaTrash />
                        </button>
                    </div>
                )
            }))
        },
        '#service': {
            columns: ['ID', 'Service', 'Ecole', 'Actions'],
            rows: listeService.map((item, index) => ({
                id: index + 1, service: item.service, Ecole: item.Ecole_SEcole_Services[0]?.Ecole?.nomecole,
                Actions: (
                    <div style={{ display: 'flex', justifyContent: '', width: "100px", alignItems: 'center', textAlign: 'center' }}>
                        <button
                            className="btn btn-outline-primary action-btn"
                            onClick={
                                async () => {
                                    await RestaurerService(item.id);
                                    const updatedData = await archiverServices();
                                    updatedData ? setListeService(updatedData) : setListeService([]);
                                }}
                            title="Restaurer">
                            <FaHistory />
                        </button>
                        <button
                            className="btn btn-outline-danger action-btn"
                            onClick={async () => {
                                await ArchiverService(item.id);
                                const updatedData = await archiverServices();
                                updatedData ? setListeService(updatedData) : setListeService([]);
                            }}
                            title="Supprimer"><FaTrash />
                        </button>
                    </div>
                )
            }))
        },
        '#poste': {
            columns: ['ID', 'Poste', 'Ecole', 'Actions'],
            rows: listePoste.map((item, index) => ({
                id: index + 1, poste: item.poste, Ecole: item.Ecole_SEcole_Postes[0]?.Ecole?.nomecole,
                Actions: (
                    <div style={{ display: 'flex', justifyContent: '', width: "100px", alignItems: 'center', textAlign: 'center' }}>
                        <button className="btn btn-outline-primary action-btn"
                            onClick={
                                async () => {
                                    await RestaurerPost(item.id);
                                    const updatedData = await archiverPostes();
                                    updatedData ? setListePoste(updatedData) : setListePoste([]);
                                }}
                            title="Restaurer"> <FaHistory />
                        </button>
                        <button className="btn btn-outline-danger action-btn"
                            onClick={async () => {
                                await ArchiverPost(item.id);
                                const updatedData = await archiverPostes();
                                updatedData ? setListePoste(updatedData) : setListePoste([]);
                            }}
                            title="Supprimer"><FaTrash />
                        </button>
                    </div>
                )
            }))
        },


    };
  

    //FILETERED SEARTCH
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
    const [filteredData, setFilteredData] = useState({
        '#employes': [], '#congesAbsences': [],
        '#primes': [], '#heureSup': [],
        '#parametreRetard': [],'#congeannuels': [],
        '#journalpaie': [],'#periodePaie': [],
        '#pointages': [],'#service': [], '#poste': []
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
        '#employes': filterData(listearchives, debouncedSearchTerm, selectedEcole),
        '#congesAbsences': filterData(listearchivesCA, debouncedSearchTerm, selectedEcole),
        '#primes': filterData(listearchivesPrimes, debouncedSearchTerm, selectedEcole),
        '#heureSup': filterData(listeHS, debouncedSearchTerm, selectedEcole),
        '#parametreRetard': filterData(listeHR, debouncedSearchTerm, selectedEcole),
        '#congeannuels': filterData(listeCongeAnnuel, debouncedSearchTerm, selectedEcole),
        '#journalpaie': filterData(listeJournalpaie, debouncedSearchTerm, selectedEcole),
        '#periodePaie': filterData(listePeriodePaie, debouncedSearchTerm, selectedEcole),
        '#pointages': filterData(listePointage, debouncedSearchTerm, selectedEcole),
        '#service': filterData(listeService, debouncedSearchTerm, selectedEcole),
        '#poste': filterData(listePoste, debouncedSearchTerm, selectedEcole)
    };
    setFilteredData(filtered);
    setCurrentPage(1);
}, [debouncedSearchTerm, selectedEcole, 
    listearchives, listearchivesCA, listearchivesPrimes, 
    listeHS, listeHR, listeCongeAnnuel, listeJournalpaie, 
    listePeriodePaie, listePointage, listeService, listePoste]);
  

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
                <span>les archives du module {module}</span>
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

export default ArchiverModule;
