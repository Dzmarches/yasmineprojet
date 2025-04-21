import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useReactToPrint } from 'react-to-print';
import printer from '../../assets/imgs/printer.png';
import { Modal, Button } from 'react-bootstrap';

const GestionAbsenceEleve = () => {
    const [niveaux, setNiveaux] = useState([]);
    const [sections, setSections] = useState([]);
    const [selectedNiveau, setSelectedNiveau] = useState(null);
    const [selectedSection, setSelectedSection] = useState(null);
    const [eleves, setEleves] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [presences, setPresences] = useState({});
    const printRef = useRef();
    const [enseignantId, setEnseignantId] = useState(null);
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedTime, setSelectedTime] = useState(new Date().toTimeString().substring(0, 5));
    const [currentDateTime, setCurrentDateTime] = useState('');
    const [isPastDate, setIsPastDate] = useState(false);
    const [isFutureDate, setIsFutureDate] = useState(false);
    const [currentPeriod, setCurrentPeriod] = useState('matin');
    const [isMorningDisabled, setIsMorningDisabled] = useState(false);
    const [isAfternoonDisabled, setIsAfternoonDisabled] = useState(false);
    const [emploiDuTemps, setEmploiDuTemps] = useState([]);
    const [isInSchedule, setIsInSchedule] = useState(false);

    const [commentaire, setCommentaire] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [selectedEleve, setSelectedEleve] = useState(null);


    const handleShowModal = (eleve) => {
        setSelectedEleve(eleve);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedEleve(null);
        setCommentaire('');
    };

    // Récupérer l'ID de l'utilisateur connecté depuis le localStorage
    useEffect(() => {
        const userId = localStorage.getItem("userId");
        if (userId) {
            setEnseignantId(userId);
        }

        // Initialiser la date et heure actuelles
        const now = new Date();
        const formattedDate = now.toISOString().split('T')[0];
        const formattedTime = now.toTimeString().substring(0, 5);
        setCurrentDateTime(`${formattedDate} ${formattedTime}`);
        setSelectedDate(formattedDate);
    }, []);

    // 1. Récupérer les niveaux de l'enseignant
    useEffect(() => {
        const fetchNiveaux = async () => {
            if (!enseignantId) return;

            try {
                setLoading(true);
                const token = localStorage.getItem('token');
                const response = await axios.get(
                    `http://localhost:5000/enseignant/${enseignantId}/niveaux`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                setNiveaux(Array.isArray(response.data) ? response.data : []);
            } catch (error) {
                setError("Erreur lors du chargement des niveaux.");
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchNiveaux();
    }, [enseignantId]);

    // 2. Récupérer les sections quand un niveau est sélectionné
    useEffect(() => {
        const fetchSections = async () => {
            if (selectedNiveau && enseignantId) {
                try {
                    setLoading(true);
                    const token = localStorage.getItem('token');
                    const response = await axios.get(
                        `http://localhost:5000/enseignant/${enseignantId}/niveaux/${selectedNiveau}/sections`,
                        { headers: { Authorization: `Bearer ${token}` } }
                    );
                    setSections(response.data);
                } catch (error) {
                    console.error("Erreur lors de la récupération des sections:", error);
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchSections();
    }, [selectedNiveau, enseignantId]);

    // 3. Récupérer les élèves quand une section est sélectionnée
    const fetchEleves = async (sectionId) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(
                `http://localhost:5000/listClasse/classe/${sectionId}/eleves`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setEleves(response.data);
            setSelectedSection(sectionId);
        } catch (error) {
            console.error('Erreur lors de la récupération des élèves:', error);
        }
    };

    // Charger l'emploi du temps de l'enseignant
    useEffect(() => {
        const fetchEmploiDuTemps = async () => {
            if (!enseignantId) return;

            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(
                    `http://localhost:5000/enseignant/emploi-du-temps/${enseignantId}`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                setEmploiDuTemps(response.data);
            } catch (error) {
                console.error("Erreur lors du chargement de l'emploi du temps:", error);
            }
        };

        fetchEmploiDuTemps();
    }, [enseignantId]);

    // Vérifier si l'enseignant est dans son créneau horaire
    useEffect(() => {
        if (!selectedDate || !selectedTime || !emploiDuTemps.length) return;

        const selectedDay = new Date(selectedDate).toLocaleDateString('fr-FR', { weekday: 'long' });
        const [hours, minutes] = selectedTime.split(':').map(Number);
        const selectedTimeInMinutes = hours * 60 + minutes;

        const currentCreneau = emploiDuTemps.find(creneau => {
            if (creneau.jour.toLowerCase() !== selectedDay.toLowerCase()) return false;

            const [startHours, startMinutes] = creneau.heure.split('-')[0].split(':').map(Number);
            const startTimeInMinutes = startHours * 60 + startMinutes;
            const endTimeInMinutes = startTimeInMinutes + creneau.duree;

            return selectedTimeInMinutes >= startTimeInMinutes &&
                selectedTimeInMinutes <= endTimeInMinutes;
        });

        setIsInSchedule(!!currentCreneau);
    }, [selectedDate, selectedTime, emploiDuTemps]);

    // Vérifier si la date sélectionnée est dans le passé ou le futur
    useEffect(() => {
        if (selectedDate) {
            const selected = new Date(selectedDate);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            selected.setHours(0, 0, 0, 0);

            setIsPastDate(selected < today);
            setIsFutureDate(selected > today);
        }
    }, [selectedDate]);

    useEffect(() => {
        const now = new Date();
        const hours = now.getHours();

        if (hours >= 13) {
            setIsMorningDisabled(true);
            setCurrentPeriod('apres_midi');
        } else {
            setIsAfternoonDisabled(true);
        }
    }, []);

    // Initialiser les présences
    useEffect(() => {
        if (eleves.length > 0 && selectedDate) {
            const fetchExistingPresences = async () => {
                try {
                    const token = localStorage.getItem('token');
                    const response = await axios.get(
                        `http://localhost:5000/presences/date/${selectedDate}`,
                        { headers: { Authorization: `Bearer ${token}` } }
                    );

                    const existingPresences = response.data;
                    const newPresences = {};

                    eleves.forEach(eleve => {
                        const existing = existingPresences.find(p => p.eleveId === eleve.id);
                        newPresences[eleve.id] = {
                            matin: existing?.matin || 'present',
                            apres_midi: existing?.apres_midi || 'present'
                        };
                    });

                    setPresences(newPresences);
                } catch (error) {
                    console.error("Erreur lors de la récupération des présences:", error);
                    const defaultPresences = {};
                    eleves.forEach(eleve => {
                        defaultPresences[eleve.id] = {
                            matin: 'present',
                            apres_midi: 'present'
                        };
                    });
                    setPresences(defaultPresences);
                }
            };

            fetchExistingPresences();
        }
    }, [eleves, selectedDate]);

    const handlePresenceChange = (eleveId, status, period) => {
        if (isPastDate || isFutureDate || !isInSchedule) return;

        setPresences(prev => ({
            ...prev,
            [eleveId]: {
                ...prev[eleveId],
                [period]: status
            }
        }));
    };

    const handleDateChange = (e) => {
        setSelectedDate(e.target.value);
    };

    const handlePrint = () => {
        const printWindow = window.open('', '_blank');
        const currentClass = sections.find(s => s.id === selectedSection)?.classe || '';

        const printContent = `
        <html>
            <head>
                <title>Feuille de présence - ${currentClass}</title>
                <style>
                    @page { size: auto; margin: 5mm; }
                    body { padding: 20px; font-family: Arial, sans-serif; }
                    table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                    th, td { border: 1px solid #ddd; padding: 8px; text-align: center; }
                    th { background-color: #f2f2f2; }
                    .header { text-align: center; margin-bottom: 20px; }
                    .class-info { margin-bottom: 10px; }
                    .date-info { margin-bottom: 10px; }
                    .present { color: green; }
                    .retard { color: orange; }
                    .absent { color: red; }
                </style>
            </head>
            <body>
                <div class="header">
                    <h2>Feuille de présence</h2>
                </div>
                
                <div class="class-info">
                    <strong>Classe:</strong> ${currentClass}
                </div>
                
                <div class="date-info">
                    <strong>Date:</strong> ${selectedDate} 
                    <strong>Heure:</strong> ${selectedTime}
                </div>
                
                <table>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Nom</th>
                            <th>Prénom</th>
                            <th>Matin</th>
                            <th>Après-midi</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${eleves.length > 0 ?
                eleves.map((eleve, index) => {
                    const matinStatus = presences[eleve.id]?.matin || 'present';
                    const apresMidiStatus = presences[eleve.id]?.apres_midi || 'present';

                    return `
                                <tr>
                                    <td>${index + 1}</td>
                                    <td>${eleve.User?.nom || 'N/A'}</td>
                                    <td>${eleve.User?.prenom || 'N/A'}</td>
                                    <td class="${matinStatus}">
                                        ${matinStatus === 'present' ? 'Présent' :
                            matinStatus === 'retard' ? 'Retard' : 'Absent'}
                                    </td>
                                    <td class="${apresMidiStatus}">
                                        ${apresMidiStatus === 'present' ? 'Présent' :
                            apresMidiStatus === 'retard' ? 'Retard' : 'Absent'}
                                    </td>
                                </tr>
                            `;
                }).join('')
                :
                `<tr><td colspan="5" style="text-align: center;">Aucun élève trouvé</td></tr>`
            }
                    </tbody>
                </table>
            </body>
        </html>
        `;

        printWindow.document.write(printContent);
        printWindow.document.close();
        printWindow.focus();
        setTimeout(() => {
            printWindow.print();
            printWindow.close();
        }, 500);
    };

    const handleSavePresences = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) throw new Error('Aucun token trouvé');

            const selectedDay = new Date(selectedDate).toLocaleDateString('fr-FR', { weekday: 'long' });
            const currentCreneau = emploiDuTemps.find(creneau =>
                creneau.jour.toLowerCase() === selectedDay.toLowerCase()
            );

            if (!currentCreneau) {
                throw new Error('Aucun créneau valide trouvé pour cette date');
            }

            const presencesData = eleves.map(eleve => ({
                eleveId: eleve.id,
                matin: presences[eleve.id]?.matin || 'present',
                apres_midi: presences[eleve.id]?.apres_midi || 'present'
            }));

            const response = await axios.post(
                'http://localhost:5000/presences',
                {
                    presences: presencesData,
                    date: selectedDate,
                    heure: selectedTime,
                    enseignantId: enseignantId
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            console.log('Réponse du serveur:', response.data);
            alert('Présences enregistrées avec succès!');
        } catch (error) {
            console.error('Erreur lors de l\'enregistrement:', error);
            alert(`Erreur: ${error.response?.data?.message || error.message}`);
        }
    };

    if (loading) return <p>Chargement ...</p>;
    if (error) return <p style={{ color: "red" }}>{error}</p>;

    return (
        <div style={{ padding: "20px" }}>
            <nav className="mb-2">
                <Link to="/dashboard">Dashboard</Link>
                <span> / </span>
                <span>Gestion des Absences</span>
            </nav>

            <section className="content">
                <div className="container-fluid">
                    <div className="card card-primary card-outline">
                        <div className="card-header">
                            <h3 className="card-title">
                                <i className="fas fa-user-minus mr-2"></i>
                                Gestion des Absences
                            </h3>
                        </div>
                        <div className="card-body">
                            <div className="mb-4">
                                <div className="row align-items-center">
                                    <div className="col-md-3">
                                        <label htmlFor="absenceDate" className="form-label">
                                            Date des absences:
                                        </label>
                                        <input
                                            type="date"
                                            id="absenceDate"
                                            className="form-control"
                                            value={selectedDate}
                                            onChange={handleDateChange}
                                        />
                                    </div>
                                    <div className="col-md-3">
                                        <label htmlFor="absenceTime" className="form-label">
                                            Heure:
                                        </label>
                                        <input
                                            type="time"
                                            id="absenceTime"
                                            className="form-control"
                                            value={selectedTime}
                                            onChange={(e) => setSelectedTime(e.target.value)}
                                        />
                                    </div>
                                </div>

                                {selectedDate && selectedTime && (
                                    <div className="mb-3">
                                        {isInSchedule ? (
                                            <div className="alert alert-success">
                                                Vous pouvez marquer les absences pour ce créneau horaire.
                                                {emploiDuTemps.find(creneau => {
                                                    const selectedDay = new Date(selectedDate).toLocaleDateString('fr-FR', { weekday: 'long' });
                                                    return creneau.jour.toLowerCase() === selectedDay.toLowerCase();
                                                })?.Matiere?.nom && (
                                                        <span> Matière: {emploiDuTemps.find(creneau => {
                                                            const selectedDay = new Date(selectedDate).toLocaleDateString('fr-FR', { weekday: 'long' });
                                                            return creneau.jour.toLowerCase() === selectedDay.toLowerCase();
                                                        })?.Matiere?.nom}</span>
                                                    )}
                                            </div>
                                        ) : (
                                            <div className="alert alert-danger">
                                                Vous ne pouvez marquer les absences que pendant vos créneaux horaires définis dans votre emploi du temps.
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Période:</label>
                                <div className="btn-group" role="group">
                                    <button
                                        type="button"
                                        className={`btn ${currentPeriod === 'matin' ? 'btn-primary' : 'btn-outline-primary'} ${isMorningDisabled ? 'disabled' : ''}`}
                                        onClick={() => setCurrentPeriod('matin')}
                                        disabled={isMorningDisabled}
                                    >
                                        Matin
                                    </button>
                                    <button
                                        type="button"
                                        className={`btn ${currentPeriod === 'apres_midi' ? 'btn-primary' : 'btn-outline-primary'} ${isAfternoonDisabled ? 'disabled' : ''}`}
                                        onClick={() => setCurrentPeriod('apres_midi')}
                                        disabled={isAfternoonDisabled}
                                    >
                                        Après-midi
                                    </button>
                                </div>
                            </div>

                            {/* Sélection du niveau */}
                            <div className="mb-4">
                                <h4>Sélectionnez un niveau :</h4>
                                <div className="d-flex flex-wrap gap-2 mb-4">
                                    {niveaux.length > 0 ? (
                                        niveaux.map((niveau) => (
                                            <button
                                                key={niveau.id}
                                                onClick={() => setSelectedNiveau(niveau.id)}
                                                className={`btn ${selectedNiveau === niveau.id ? 'btn-success' : 'btn-outline-secondary'}`}
                                                style={{
                                                    minWidth: "120px",
                                                    fontWeight: "600",
                                                    boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
                                                }}
                                            >
                                                {niveau.nomniveau}
                                            </button>
                                        ))
                                    ) : (
                                        <p>Aucun niveau trouvé pour cet enseignant.</p>
                                    )}
                                </div>
                            </div>
                            {selectedNiveau && (
                                <div className="mb-4">
                                    <h4>Sélectionnez une section :</h4>
                                    <div className="d-flex flex-wrap gap-2 mb-4">
                                        {sections.length > 0 ? (
                                            sections.map((section) => (
                                                <button
                                                    key={section.id}
                                                    onClick={() => fetchEleves(section.id)}
                                                    className={`btn ${selectedSection === section.id ? 'btn-success' : 'btn-outline-secondary'}`}
                                                    style={{
                                                        minWidth: "120px",
                                                        fontWeight: "600",
                                                        boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
                                                    }}
                                                >
                                                    {section.classe || section.nom || 'Section sans nom'}
                                                </button>
                                            ))
                                        ) : (
                                            <p>Aucune section trouvée pour ce niveau.</p>
                                        )}
                                    </div>
                                </div>
                            )}

                            {selectedSection && (
                                <div className="row">
                                    <div className="col-md-12">
                                        <div className="card">
                                            <div className="card-header bg-info d-flex justify-content-between align-items-center">
                                                <h3 className="card-title mb-0">
                                                    Liste des élèves - {sections.find(s => s.id === selectedSection)?.classe || 'N/A'}
                                                </h3>
                                                <div>
                                                    <button
                                                        onClick={handlePrint}
                                                        className="btn btn-primary no-print mr-2"
                                                    >
                                                        <img src={printer} alt="Imprimer" width="20" className="mr-2" />
                                                        Imprimer
                                                    </button>
                                                    <button
                                                        className="btn btn-success no-print"
                                                        onClick={handleSavePresences}
                                                        disabled={isPastDate || isFutureDate || !isInSchedule}
                                                    >
                                                        Enregistrer
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="card-body p-0">
                                                <div className="table-responsive" ref={printRef}>
                                                    <table className="table table-hover table-striped">
                                                        <thead className="thead-light">
                                                            <tr>
                                                                <th>#</th>
                                                                <th>Nom</th>
                                                                <th>Prénom</th>
                                                                <th colSpan="2">Matin</th>
                                                                <th colSpan="2">Après-midi</th>
                                                                <th>Notification</th>
                                                            </tr>
                                                            <tr>
                                                                <th></th>
                                                                <th></th>
                                                                <th></th>
                                                                <th>Présent</th>
                                                                <th>Absent</th>
                                                                <th>Présent</th>
                                                                <th>Absent</th>
                                                                <th></th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {eleves.length > 0 ? (
                                                                eleves.map((eleve, index) => (
                                                                    <tr key={eleve.id}>
                                                                        <td>{index + 1}</td>
                                                                        <td>{eleve.User?.nom || 'N/A'}</td>
                                                                        <td>{eleve.User?.prenom || 'N/A'}</td>

                                                                        {/* Matin */}
                                                                        <td>
                                                                            <input
                                                                                type="radio"
                                                                                name={`matin-${eleve.id}`}
                                                                                checked={presences[eleve.id]?.matin === 'present'}
                                                                                onChange={() => handlePresenceChange(eleve.id, 'present', 'matin')}
                                                                                disabled={isMorningDisabled || isPastDate || isFutureDate}
                                                                            />
                                                                        </td>
                                                                        <td>
                                                                            <input
                                                                                type="radio"
                                                                                name={`matin-${eleve.id}`}
                                                                                checked={presences[eleve.id]?.matin === 'absent'}
                                                                                onChange={() => handlePresenceChange(eleve.id, 'absent', 'matin')}
                                                                                disabled={isMorningDisabled || isPastDate || isFutureDate}
                                                                            />
                                                                        </td>

                                                                        {/* Après-midi */}
                                                                        <td>
                                                                            <input
                                                                                type="radio"
                                                                                name={`apres_midi-${eleve.id}`}
                                                                                checked={presences[eleve.id]?.apres_midi === 'present'}
                                                                                onChange={() => handlePresenceChange(eleve.id, 'present', 'apres_midi')}
                                                                                disabled={isAfternoonDisabled || isPastDate || isFutureDate}
                                                                            />
                                                                        </td>
                                                                        <td>
                                                                            <input
                                                                                type="radio"
                                                                                name={`apres_midi-${eleve.id}`}
                                                                                checked={presences[eleve.id]?.apres_midi === 'absent'}
                                                                                onChange={() => handlePresenceChange(eleve.id, 'absent', 'apres_midi')}
                                                                                disabled={isAfternoonDisabled || isPastDate || isFutureDate}
                                                                            />
                                                                        </td>

                                                                        {/* Notification */}
                                                                        <td>
                                                                            <button
                                                                                className="btn btn-warning btn-sm"
                                                                                onClick={() => handleShowModal(eleve)}
                                                                            >
                                                                                Notifier
                                                                            </button>
                                                                        </td>
                                                                    </tr>
                                                                ))
                                                            ) : (
                                                                <tr>
                                                                    <td colSpan="8" className="text-center">Aucun élève trouvé</td>
                                                                </tr>
                                                            )}
                                                        </tbody>
                                                    </table>

                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>
            <Modal show={showModal} onHide={handleCloseModal} centered backdrop="static">
                <Modal.Header closeButton className="bg-primary text-white">
                    <Modal.Title>📩 Envoyer une notification</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p className="mb-2">
                        <strong>Élève :</strong> {selectedEleve?.User?.prenom} {selectedEleve?.User?.nom}
                    </p>
                    <textarea
                        className="form-control border-primary shadow-sm"
                        rows="5"
                        value={commentaire}
                        onChange={(e) => setCommentaire(e.target.value)}
                        placeholder="Écris ton commentaire ici..."
                    ></textarea>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        ❌ Annuler
                    </Button>
                    <Button variant="success">
                        ✅ Envoyer
                    </Button>
                </Modal.Footer>
            </Modal>

        </div>


    );
};

export default GestionAbsenceEleve;