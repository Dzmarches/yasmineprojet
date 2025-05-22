import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Card, Button, Spinner, Alert, Table } from 'react-bootstrap';
import notesIcon from '../../assets/imgs/note.png';
import moment from 'moment';

const NotesEleve = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userId, setUserId] = useState(null);

    const [anneesScolaires, setAnneesScolaires] = useState([]);
    const [selectedAnnee, setSelectedAnnee] = useState(null);
    const [trimestres, setTrimestres] = useState([]);
    const [selectedTrimestre, setSelectedTrimestre] = useState(null);
    const [notes, setNotes] = useState([]);
    const [loadingNotes, setLoadingNotes] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            setError('Utilisateur non authentifié.');
            return;
        }

        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            console.log("Token payload :", payload);
            setUserId(payload.userId);
            fetchAnneesScolaires(payload.userId);
        } catch (err) {
            console.error('Erreur de décodage du token:', err);
            setError("Erreur d'identification.");
        }
    }, []);

    const fetchAnneesScolaires = async (eleveId) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`http://localhost:5000/elevess/enfant/${eleveId}/annees-scolaires`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setAnneesScolaires(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Erreur lors de la récupération des années scolaires:', error);
            setError('Erreur lors du chargement des années scolaires.');
            setLoading(false);
        }
    };

    const fetchTrimestres = async (eleveId, anneeId) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`http://localhost:5000/elevess/enfant/${eleveId}/annee/${anneeId}/trimestres`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setTrimestres(response.data);
            setSelectedAnnee(anneesScolaires.find(a => a.id === anneeId));
        } catch (error) {
            console.error('Erreur lors de la récupération des trimestres:', error);
            setError('Erreur lors du chargement des trimestres.');
        }
    };

    const fetchNotes = async (eleveId, trimestreId) => {
        try {
            setLoadingNotes(true);
            const token = localStorage.getItem('token');
            const response = await axios.get(`http://localhost:5000/elevess/enfant/${eleveId}/trimestre/${trimestreId}/notes`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setNotes(response.data);
            setSelectedTrimestre(trimestres.find(t => t.trimestId === trimestreId));
            setLoadingNotes(false);
        } catch (error) {
            console.error('Erreur lors de la récupération des notes:', error);
            setError('Erreur lors du chargement des notes.');
            setLoadingNotes(false);
        }
    };

    const getColumnsByCycle = (cycle) => {
        switch (cycle) {
            case 'Primaire':
                return {
                    regular: [
                        {
                            id: 'eval_continue',
                            label: 'التقويم المستمر / Évaluation continue',
                            subColumns: [
                                { id: 'expression_orale', label: 'التعبير و التواصل الشفوي / Expression et communication orale' },
                                { id: 'lecture', label: 'القراءة و المحفوظات / Lecture et archives' },
                                { id: 'production_ecrite', label: 'الإنتاج الكتابي / Production écrite' }
                            ]
                        },
                        { id: 'moyenne_eval', label: 'معدل التقويم المستمر / Moyenne évaluation continue' },
                        { id: 'examens', label: 'الإختبارات / Examens' },
                        { id: 'moyenne', label: 'معدل / Moyenne' },
                        { id: 'remarque', label: 'Remarque' }
                    ],
                    math: [
                        {
                            id: 'eval_continue_math',
                            label: 'التقويم المستمر / Évaluation continue (Maths)',
                            subColumns: [
                                { id: 'calcul', label: 'الحساب /10' },
                                { id: 'grandeurs_mesures', label: 'المقادير و القياس /10' },
                                { id: 'organisation_donnees', label: 'تنظيم المعطيات /10' },
                                { id: 'espace_geometrie', label: 'الفضاء و الهندسة /10' }
                            ]
                        },
                        { id: 'moyenne_eval_math', label: 'معدل التقويم المستمر / Moyenne évaluation continue' },
                        { id: 'examens_math', label: 'الإختبارات / Examens' },
                        { id: 'moyenne_math', label: 'معدل / Moyenne' },
                        { id: 'remarque_math', label: 'Remarque' }
                    ]
                };
            case 'Cem':
                return {
                    regular: [
                        { id: 'eval_continue', label: 'التقويم المستمر / Évaluation continue' },
                        { id: 'devoir1', label: 'الفرض الأول / Devoir 1' },
                        { id: 'devoir2', label: 'الفرض الثاني / Devoir 2' },
                        { id: 'moyenne_eval', label: 'معدل التقويم / Moyenne évaluation' },
                        { id: 'examens', label: 'الإختبارات / Examens' },
                        { id: 'moyenne', label: 'معدل / Moyenne' },
                        { id: 'coefficient', label: 'معامل / Coefficient' },
                        { id: 'moyenne_total', label: 'Moyenne totale' }
                    ]
                };
            case 'Lycée':
                return {
                    regular: [
                        { id: 'eval_continue', label: 'التقويم المستمر / Évaluation continue' },
                        { id: 'travaux_pratiques', label: 'أعمال التطبيقية / Travaux pratiques' },
                        { id: 'moyenne_devoirs', label: 'معدل الفروض / Moyenne devoirs' },
                        { id: 'examens', label: 'الإختبارات / Examens' },
                        { id: 'moyenne', label: 'معدل / Moyenne' },
                        { id: 'coefficient', label: 'معامل / Coefficient' },
                        { id: 'moyenne_total', label: 'Moyenne totale' }
                    ]
                };
            default:
                return { regular: [] };
        }
    };

    const NoteTable = ({ notes, columns }) => {
        const flattenedColumns = columns.flatMap(col =>
            col.subColumns ? col.subColumns : [col]
        );

        return (

            <div className="table-responsive" style={{ marginBottom: '20px' }}>
                <Table striped bordered hover>
                    <thead style={{ backgroundColor: '#2c3e50', color: 'white' }}>
                        <tr>
                            <th style={{ padding: '12px 15px' }}>Matière</th>
                            {flattenedColumns.map(col => (
                                <th key={col.id} style={{ padding: '12px 15px' }}>{col.label}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {notes.map(note => (
                            <tr key={note.id}>
                                <td style={{ padding: '12px 15px', fontWeight: '500' }}>
                                    {note.Matiere?.nom}
                                </td>
                                {flattenedColumns.map(col => (
                                    <td key={col.id} style={{ padding: '12px 15px' }}>
                                        {note[col.id] ?? '-'}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </div>
        );
    };

    return (
        <>
            <nav>
                <Link to="/elevesinterface" className="text-primary">Accueil</Link>
                <span> / Mes notes</span>
            </nav>
            <div className="container py-4">
                {/* En-tête avec image et titre */}
                <div className="card card-primary card-outline mb-4">
                    <div className="card-header d-flex align-items-center" style={{ backgroundColor: '#F8F8F8' }}>
                        <img src={notesIcon} alt="Notes" width="90px" />
                        <p className="card-title mt-4 ml-3 p-2 text-center"
                            style={{
                                width: '350px',
                                borderRadius: '50px',
                                border: '1px solid rgb(215, 214, 216)'
                            }}>
                            Mes Notes
                        </p>
                    </div>
                    <div className='card card-body'>
                        {loading ? (
                            <div className="text-center">
                                <Spinner animation="border" />
                                <p>Chargement en cours...</p>
                            </div>
                        ) : error ? (
                            <Alert variant="danger">{error}</Alert>
                        ) : (
                            <>
                                {/* Section Années scolaires */}
                                <div className="mb-4">
                                    <h4>Années scolaires</h4>
                                    {anneesScolaires.length === 0 ? (
                                        <Alert variant="info">Aucune année scolaire trouvée.</Alert>
                                    ) : (
                                        <div className="d-flex flex-wrap gap-2">
                                            {anneesScolaires.map(annee => (
                                                <Button
                                                    key={annee.id}
                                                    variant={selectedAnnee?.id === annee.id ? 'primary' : 'outline-primary'}
                                                    onClick={() => fetchTrimestres(userId, annee.id)}
                                                    style={{ margin: '5px' }}
                                                >
                                                    {new Date(annee.datedebut).getFullYear()} - {new Date(annee.datefin).getFullYear()}
                                                </Button>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Section Trimestres */}
                                {selectedAnnee && (
                                    <div className="mb-4">
                                        <h4>Trimestres</h4>
                                        {trimestres.length === 0 ? (
                                            <Alert variant="info">Aucun trimestre trouvé pour cette année scolaire.</Alert>
                                        ) : (
                                            <div className="d-flex flex-wrap gap-2">
                                                {trimestres.map(trimestre => {
                                                    const moyenne = trimestre.moyenne;
                                                    const moyenneFormatee = typeof moyenne === 'number'
                                                        ? moyenne.toFixed(2)
                                                        : (typeof moyenne === 'string' && !isNaN(parseFloat(moyenne)))
                                                            ? parseFloat(moyenne).toFixed(2)
                                                            : 'N/A';

                                                    return (
                                                        <Button
                                                            key={trimestre.id}
                                                            variant={selectedTrimestre?.trimestId === trimestre.trimestId ? 'success' : 'outline-success'}
                                                            onClick={() => fetchNotes(userId, trimestre.trimestId)}
                                                            style={{ minWidth: '200px', position: 'relative' }}
                                                            disabled={!trimestre.status}
                                                        >
                                                            <div>{trimestre.Trimest.titre}</div>
                                                            <div>Moyenne: {moyenneFormatee}</div>
                                                            {!trimestre.status && (
                                                                <small className="text-muted">(Non publié)</small>
                                                            )}
                                                            {trimestre.status && (
                                                                <small className="text-success">(Publié)</small>
                                                            )}
                                                        </Button>
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Section Notes */}
                                {selectedTrimestre && (
                                    <div className="mt-4">
                                        <h4>
                                            Notes du {selectedTrimestre.Trimest.titre} -
                                            Année {moment(selectedAnnee.datedebut).format('YYYY')}/{moment(selectedAnnee.datefin).format('YYYY')}
                                        </h4>

                                        {loadingNotes ? (
                                            <div className="text-center">
                                                <Spinner animation="border" />
                                                <p>Chargement des notes...</p>
                                            </div>
                                        ) : notes.length === 0 ? (
                                            <Alert variant="info">Aucune note trouvée pour ce trimestre.</Alert>
                                        ) : (
                                            <div>
                                                {(() => {
                                                    const cycle = notes[0]?.cycle || 'Primaire';
                                                    const columnsConfig = getColumnsByCycle(cycle);

                                                    // Séparer les notes de mathématiques des autres notes
                                                    const mathNotes = notes.filter(note =>
                                                        note.Matiere.nom.toLowerCase().includes('math') ||
                                                        note.Matiere.nomarabe.toLowerCase().includes('رياضيات')
                                                    );
                                                    const otherNotes = notes.filter(note =>
                                                        !note.Matiere.nom.toLowerCase().includes('math') &&
                                                        !note.Matiere.nomarabe.toLowerCase().includes('رياضيات')
                                                    );

                                                    return (
                                                        <>
                                                            {cycle === 'Primaire' && mathNotes.length > 0 && (
                                                                <>
                                                                    <h5 className="mt-3">Mathématiques</h5>
                                                                    <NoteTable
                                                                        notes={mathNotes}
                                                                        columns={columnsConfig.math || []}
                                                                    />
                                                                </>
                                                            )}

                                                            {otherNotes.length > 0 && (
                                                                <>
                                                                    <h5 className="mt-3" style={{ display: cycle === 'Primaire' ? 'block' : 'none' }}>
                                                                        Autres matières
                                                                    </h5>
                                                                    <NoteTable
                                                                        notes={otherNotes}
                                                                        columns={columnsConfig.regular}
                                                                    />
                                                                </>
                                                            )}
                                                        </>
                                                    );
                                                })()}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default NotesEleve;