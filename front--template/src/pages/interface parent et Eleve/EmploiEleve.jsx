import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Table, Spinner, Alert } from 'react-bootstrap';
import moment from 'moment';
import emploii from '../../assets/imgs/emploi.png';


const jours = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi'];

// Utilitaire : génère une couleur unique pour chaque matière
const getColor = (matiere) => {
    let hash = 0;
    for (let i = 0; i < matiere.length; i++) {
        hash = matiere.charCodeAt(i) + ((hash << 5) - hash);
    }
    const color = `hsl(${hash % 360}, 65%, 80%)`;
    return color;
};

const EmploiDuTempsEleve = () => {
    const [loading, setLoading] = useState(true);
    const [emploi, setEmploi] = useState({});
    const [periodes, setPeriodes] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchEmploi = async () => {
            try {
                const token = localStorage.getItem('token');
                const payload = JSON.parse(atob(token.split('.')[1]));
                const userId = payload.userId;

                const res = await axios.get(`http://localhost:5000/elevess/eleve/${userId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                console.log('periode', res.data.periodes);
                console.log('emploi', res.data.emploi);

                // Convertir sousPeriodes de chaîne JSON à tableau d'objets
                const periodesAvecSousPeriodes = res.data.periodes.map((periode) => {
                    if (typeof periode.sousPeriodes === 'string') {
                        // Si sousPeriodes est une chaîne JSON, la parser
                        periode.sousPeriodes = JSON.parse(periode.sousPeriodes);
                    }
                    return periode;
                });

                setPeriodes(periodesAvecSousPeriodes);
                setEmploi(res.data.emploi);
                setLoading(false);
            } catch (err) {
                console.error(err);
                setError('Erreur lors du chargement de l’emploi du temps.');
                setLoading(false);
            }
        };

        fetchEmploi();
    }, []);

    // Fonction pour récupérer la matière pour une sous-période spécifique
    const getMatiere = (jour, sousPeriode) => {
        const seancesJour = emploi[jour] || [];
        const match = seancesJour.find(
            (e) =>
                e.heure === `${sousPeriode.debut}-${sousPeriode.fin}` &&
                e.duree === moment.duration(moment(sousPeriode.fin, 'HH:mm').diff(moment(sousPeriode.debut, 'HH:mm'))).asMinutes()
        );
        return match?.matiere || ''; // Retourne la matière ou un string vide
    };

    // Aplatir les sous-périodes pour les afficher dans le tableau
    const getSousPeriodes = () => {
        return periodes.flatMap((periode) => {
            // Vérifier que 'sousPeriodes' est un tableau
            if (Array.isArray(periode.sousPeriodes)) {
                return periode.sousPeriodes.map((sp) => ({
                    ...sp,
                    parentLabel: periode.label || `${periode.heureDebut} - ${periode.heureFin}`,
                }));
            }
            return []; // Si 'sousPeriodes' n'est pas un tableau, on renvoie un tableau vide
        });
    };

    return (
        <>
            <nav>
                <Link to="/elevesinterface" className="text-primary">Accueil</Link>
                <span> / Emploi du temps</span>
            </nav>
            <div className="container py-4">
                {/* En-tête avec image et titre */}
                <div className="card card-primary card-outline mb-4">
                    <div className="card-header d-flex align-items-center" style={{ backgroundColor: '#F8F8F8' }}>
                        <img src={emploii} alt="Notes" width="90px" />
                        <p className="card-title mt-4 ml-3 p-2 text-center"
                            style={{
                                width: '350px',
                                borderRadius: '50px',
                                border: '1px solid rgb(215, 214, 216)'
                            }}>
                            Emploi Du Temps
                        </p>
                    </div>
                    <div className='card card-body'>
                        {loading ? (
                            <div className="text-center">
                                <Spinner animation="border" />
                            </div>
                        ) : error ? (
                            <Alert variant="danger">{error}</Alert>
                        ) : (
                            <div className="table-responsive">
                                <Table bordered hover>
                                    <thead style={{ backgroundColor: '#f0f0f0' }}>
                                        <tr>
                                            <th>Jour</th>
                                            {getSousPeriodes().map((sp, idx) => (
                                                <th key={idx}>
                                                    {moment(sp.debut, 'HH:mm').format('HH:mm')} - {moment(sp.fin, 'HH:mm').format('HH:mm')}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {jours.map((jour, idx) => (
                                            <tr key={idx}>
                                                <td style={{ fontWeight: 'bold' }}>{jour}</td>
                                                {getSousPeriodes().map((sousPeriode, i) => {
                                                    const matiere = getMatiere(jour, sousPeriode);
                                                    return (
                                                        <td key={i} style={{
                                                            backgroundColor: matiere ? getColor(matiere.nom) : '#f9f9f9',
                                                            textAlign: 'center',
                                                            fontWeight: '500',
                                                        }}>
                                                            {matiere.nom || '-'}<br />
                                                            <span style={{ fontSize: '0.8em', color: '#555' }}>{matiere.nomarabe || '-'}</span>
                                                        </td>
                                                    );
                                                })}
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};
export default EmploiDuTempsEleve;