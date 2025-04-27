import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useReactToPrint } from 'react-to-print';
import printer from '../../assets/imgs/printer.png';

const GestionAbsence = () => {
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

    const [justificationFiles, setJustificationFiles] = useState({});
    const [showJustificationModal, setShowJustificationModal] = useState(false);
    const [currentEleve, setCurrentEleve] = useState(null);

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
                    `http://localhost:5000/niveaux`,
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
        if (selectedNiveau) {
            const fetchSections = async () => {
                try {
                    const token = localStorage.getItem("token");
                    const response = await axios.get(
                        `http://localhost:5000/sections/niveau/${selectedNiveau}`,
                        { headers: { Authorization: `Bearer ${token}` } }
                    );
                    setSections(response.data);
                    setSelectedSection(null);
                } catch (error) {
                    console.error("Erreur lors du chargement des sections.", error);
                }
            };

            fetchSections();
        }
    }, [selectedNiveau]);

    // 3. Récupérer les élèves quand une section est sélectionnée
    // 3. Récupérer les élèves quand une section est sélectionnée
    const [loadingEleves, setLoadingEleves] = useState(false);

    const fetchEleves = async (sectionId) => {
        setLoadingEleves(true);
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get(
                `http://localhost:5000/eleves/section/${sectionId}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            console.log("Réponse des élèves:", response.data); // Ajoutez ce log
            setEleves(response.data);

            // Initialiser les présences par défaut
            const defaultPresences = {};
            response.data.forEach(eleve => {
                defaultPresences[eleve.id] = {
                    matin: 'present',
                    apres_midi: 'present'
                };
            });
            setPresences(defaultPresences);
        } catch (error) {
            console.error("Erreur lors du chargement des élèves:", error);
        } finally {
            setLoadingEleves(false);
        }
    };

    // useEffect(() => {
    //     if (selectedSection) {
    //         fetchEleves(selectedSection);
    //     }
    // }, [selectedSection]);

    // Charger l'emploi du temps de l'enseignant


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
            // Dans votre fetchExistingPresences
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
                            apres_midi: existing?.apres_midi || 'present',
                            justificationMatin: existing?.justificationMatin || null,
                            justificationApresMidi: existing?.justificationApresMidi || null
                        };
                    });

                    setPresences(newPresences);
                } catch (error) {
                    console.error("Erreur lors de la récupération des présences:", error);
                    const defaultPresences = {};
                    eleves.forEach(eleve => {
                        defaultPresences[eleve.id] = {
                            matin: 'present',
                            apres_midi: 'present',
                            justificationMatin: null,
                            justificationApresMidi: null
                        };
                    });
                    setPresences(defaultPresences);
                }
            };

            fetchExistingPresences();
        }
    }, [eleves, selectedDate]);


    // Modifier la fonction de changement de présence
    const handlePresenceChange = (eleveId, status, period) => {
        // Retirez la vérification de date
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
            const formData = new FormData();

            // Ajouter les présences
            eleves.forEach(eleve => {
                formData.append('presences[]', JSON.stringify({
                    eleveId: eleve.id,
                    matin: presences[eleve.id]?.matin || 'present',
                    apres_midi: presences[eleve.id]?.apres_midi || 'present'
                }));
            });

            // Ajouter les fichiers de justification
            Object.entries(justificationFiles).forEach(([eleveId, periods]) => {
                Object.entries(periods).forEach(([period, file]) => {
                    formData.append(`justification${capitalize(period)}-${eleveId}`, file);
                });
            });

            // Ajouter les autres données
            formData.append('date', selectedDate);
            formData.append('heure', selectedTime);
            formData.append('enseignantId', enseignantId);

            const response = await axios.post('http://localhost:5000/presences', formData, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'multipart/form-data'
                }
            });

            console.log('Fichiers à envoyer:', justificationFiles); // Ajoutez ce log avant l'envoi
            alert('Sauvegarde réussie !');
            console.log('Réponse du serveur:', response.data);
        } catch (error) {
            console.error('Erreur lors de la sauvegarde:', error);
            alert('Erreur lors de la sauvegarde: ' + (error.response?.data?.message || error.message));
        }
    };

    // Helper function
    const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);
    const handleFileChange = (e, eleveId, period) => {
        const file = e.target.files[0];
        if (!file) return;

        setJustificationFiles(prev => {
            const newFiles = { ...prev };
            if (!newFiles[eleveId]) {
                newFiles[eleveId] = {};
            }
            newFiles[eleveId][period] = file;
            return newFiles;
        });
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
                                        {isPastDate ? (
                                            <div className="alert alert-warning">
                                                Vous consultez les présences pour une date passée.
                                            </div>
                                        ) : isFutureDate ? (
                                            <div className="alert alert-info">
                                                Vous préparez les présences pour une date future.
                                            </div>
                                        ) : (
                                            <div className="alert alert-success">
                                                Vous pouvez marquer les présences pour aujourd'hui.
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
                                                    // onClick={() => fetchEleves(section.id)}
                                                    onClick={() => {
                                                        setSelectedSection(section.id);
                                                        fetchEleves(section.id);
                                                    }}
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
                                                    {/* <button
                                                        className="btn btn-success no-print"
                                                        onClick={handleSavePresences}
                                                        disabled={isPastDate || isFutureDate || !isInSchedule}
                                                    >
                                                        Enregistrer
                                                    </button> */}
                                                    <button
                                                        className="btn btn-success no-print"
                                                        onClick={handleSavePresences}
                                                    // disabled={!isInSchedule} // Gardez seulement la vérification d'emploi du temps
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
                                                                <th colSpan="4">Matin</th>
                                                                <th colSpan="4">Après-midi</th>
                                                            </tr>
                                                            <tr>
                                                                <th></th>
                                                                <th></th>
                                                                <th></th>
                                                                <th>Présent</th>
                                                                <th>Retard</th>
                                                                <th>Absent</th>
                                                                <th>Justification</th>
                                                                <th>Présent</th>
                                                                <th>Retard</th>
                                                                <th>Absent</th>
                                                                <th>Justification</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {eleves.length > 0 ? (
                                                                eleves.map((eleve, index) => {
                                                                    const matinStatus = presences[eleve.id]?.matin || 'present';
                                                                    const apresMidiStatus = presences[eleve.id]?.apres_midi || 'present';
                                                                    const hasMatinJustification = !!presences[eleve.id]?.justificationMatin;
                                                                    const hasApresMidiJustification = !!presences[eleve.id]?.justificationApresMidi;

                                                                    return (
                                                                        <tr key={eleve.id}>
                                                                            <td>{index + 1}</td>
                                                                            <td>{eleve.User?.nom || 'N/A'}</td>
                                                                            <td>{eleve.User?.prenom || 'N/A'}</td>

                                                                            {/* Matin */}
                                                                            <td>
                                                                                <input
                                                                                    type="radio"
                                                                                    name={`matin-${eleve.id}`}
                                                                                    checked={matinStatus === 'present'}
                                                                                    onChange={() => handlePresenceChange(eleve.id, 'present', 'matin')}
                                                                                />
                                                                            </td>
                                                                            <td>
                                                                                <input
                                                                                    type="radio"
                                                                                    name={`matin-${eleve.id}`}
                                                                                    checked={matinStatus === 'retard'}
                                                                                    onChange={() => handlePresenceChange(eleve.id, 'retard', 'matin')}
                                                                                />
                                                                            </td>
                                                                            <td>
                                                                                <input
                                                                                    type="radio"
                                                                                    name={`matin-${eleve.id}`}
                                                                                    checked={matinStatus === 'absent'}
                                                                                    onChange={() => handlePresenceChange(eleve.id, 'absent', 'matin')}
                                                                                />
                                                                            </td>
                                                                            <td>
                                                                                {(matinStatus === 'absent' || matinStatus === 'retard') && (
                                                                                    <>
                                                                                        <input
                                                                                            type="file"
                                                                                            accept="image/*,.pdf"
                                                                                            onChange={(e) => handleFileChange(e, eleve.id, 'matin')}
                                                                                        />
                                                                                        {hasMatinJustification ? (
                                                                                            <span style={{ color: 'green' }}>Justifié</span>
                                                                                        ) : justificationFiles[eleve.id]?.matin ? (
                                                                                            <span>{justificationFiles[eleve.id].matin.name}</span>
                                                                                        ) : null}
                                                                                    </>
                                                                                )}
                                                                            </td>

                                                                            {/* Après-midi */}
                                                                            <td>
                                                                                <input
                                                                                    type="radio"
                                                                                    name={`apres_midi-${eleve.id}`}
                                                                                    checked={apresMidiStatus === 'present'}
                                                                                    onChange={() => handlePresenceChange(eleve.id, 'present', 'apres_midi')}
                                                                                />
                                                                            </td>
                                                                            <td>
                                                                                <input
                                                                                    type="radio"
                                                                                    name={`apres_midi-${eleve.id}`}
                                                                                    checked={apresMidiStatus === 'retard'}
                                                                                    onChange={() => handlePresenceChange(eleve.id, 'retard', 'apres_midi')}
                                                                                />
                                                                            </td>
                                                                            <td>
                                                                                <input
                                                                                    type="radio"
                                                                                    name={`apres_midi-${eleve.id}`}
                                                                                    checked={apresMidiStatus === 'absent'}
                                                                                    onChange={() => handlePresenceChange(eleve.id, 'absent', 'apres_midi')}
                                                                                />
                                                                            </td>
                                                                            <td>
                                                                                {(apresMidiStatus === 'absent' || apresMidiStatus === 'retard') && (
                                                                                    <>
                                                                                        <input
                                                                                            type="file"
                                                                                            accept="image/*,.pdf"
                                                                                            onChange={(e) => handleFileChange(e, eleve.id, 'apres_midi')}
                                                                                        />
                                                                                        {hasApresMidiJustification ? (
                                                                                            <span style={{ color: 'green' }}>Justifié</span>
                                                                                        ) : justificationFiles[eleve.id]?.apres_midi ? (
                                                                                            <span>{justificationFiles[eleve.id].apres_midi.name}</span>
                                                                                        ) : null}
                                                                                    </>
                                                                                )}
                                                                            </td>
                                                                        </tr>
                                                                    );
                                                                })
                                                            ) : (
                                                                <tr>
                                                                    <td colSpan="11" className="text-center">Aucun élève trouvé</td>
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
        </div>
    );
};

export default GestionAbsence;