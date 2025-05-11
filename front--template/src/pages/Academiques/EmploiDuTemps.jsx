import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Select from 'react-select';
import { Modal, Button, Form, Row, Col, Alert, Table } from "react-bootstrap";
// Modifiez vos imports comme ceci :
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from 'xlsx';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

const EmploiDuTemps = () => {
    // États pour les données de base
    const [niveaux, setNiveaux] = useState([]);
    const [sections, setSections] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [periodes, setPeriodes] = useState([]);
    const [emploiDuTemps, setEmploiDuTemps] = useState([]);
    const [enseignants, setEnseignants] = useState([]);
    const [enseignantDisponibilites, setEnseignantDisponibilites] = useState({});
    // États pour les modales
    const [showPeriodModal, setShowPeriodModal] = useState(false);
    const [showMatieresModal, setShowMatieresModal] = useState(false);
    const [matieresNiveau, setMatieresNiveau] = useState([]);
    const [durees, setDurees] = useState({});
    const [ecoleId, setEcoleId] = useState(null);
    const [ecoleeId, setEcoleeId] = useState(null);
    const [cycle, setCycle] = useState(""); // Stocker le cycle
    const [cycles, setCycles] = useState([]);
    const [values, setValues] = useState({ cycle: '' });
    const filteredNiveaux = niveaux.filter(niveau => niveau.cycle === values.cycle);
    // États pour la sélection dans les modales
    const [selectedModalNiveau, setSelectedModalNiveau] = useState("");
    const [selectedModalSection, setSelectedModalSection] = useState("");

    const [selectedModalNiveaux, setSelectedModalNiveaux] = useState([]); // Notez le pluriel
    const [selectedModalSections, setSelectedModalSections] = useState([]); // Notez le pluriel

    const [loadedPeriodes, setLoadedPeriodes] = useState(null);

    const [emploiDuTempsData, setEmploiDuTempsData] = useState({});
    const [selectedCycle, setSelectedCycle] = useState("");
    const [selectedNiveau, setSelectedNiveau] = useState("");
    const [selectedSection, setSelectedSection] = useState("");
    const [sectionsForSelectedNiveau, setSectionsForSelectedNiveau] = useState([]);


    // Remplacez cette partie dans votre code
    useEffect(() => {
        const fetchPeriodesAndNiveaux = async () => {
            if (selectedCycle) {  // Utilisez selectedCycle au lieu de values.cycle
                try {
                    const token = localStorage.getItem("token");

                    // Trouvez le cycle correspondant dans votre liste de cycles
                    const selectedCycleObj = cycles.find(c => c.nomCycle === selectedCycle);

                    if (!selectedCycleObj) {
                        console.warn("Aucun cycle correspondant trouvé.");
                        return;
                    }

                    const response = await axios.get(
                        `http://localhost:5000/emploi-du-temps/periodes/${selectedCycleObj.id}`,
                        { headers: { Authorization: `Bearer ${token}` } }
                    );

                    console.log("Réponse reçue :", response.data);

                    if (response.data && response.data.length > 0) {
                        console.log("Périodes reçues :", response.data);
                        const newFormData = {
                            matin: { debut: '08:00', fin: '12:00', sousPeriodes: [] },
                            dejeuner: { debut: '12:00', fin: '13:00', label: 'Déjeuner' },
                            apres_midi: { debut: '13:00', fin: '16:00', sousPeriodes: [] }
                        };

                        response.data.forEach(periode => {
                            if (periode.type === 'matin') {
                                newFormData.matin = {
                                    debut: periode.heureDebut,
                                    fin: periode.heureFin,
                                    sousPeriodes: periode.sousPeriodes ? JSON.parse(periode.sousPeriodes) : []
                                };
                            } else if (periode.type === 'dejeuner') {
                                newFormData.dejeuner = {
                                    debut: periode.heureDebut,
                                    fin: periode.heureFin,
                                    label: periode.label || 'Déjeuner'
                                };
                            } else if (periode.type === 'apres_midi') {
                                newFormData.apres_midi = {
                                    debut: periode.heureDebut,
                                    fin: periode.heureFin,
                                    sousPeriodes: periode.sousPeriodes ? JSON.parse(periode.sousPeriodes) : []
                                };
                            }
                        });

                        console.log("FormData généré :", newFormData);
                        setFormData(newFormData);
                        setPeriodes(response.data);
                    } else {
                        console.warn("Aucune période reçue.");
                        setFormData({
                            matin: { debut: '08:00', fin: '12:00', sousPeriodes: [] },
                            dejeuner: { debut: '12:00', fin: '13:00', label: 'Déjeuner' },
                            apres_midi: { debut: '13:00', fin: '16:00', sousPeriodes: [] }
                        });
                    }
                } catch (error) {
                    console.error("Erreur lors du chargement des périodes:", error);
                    setFormData({
                        matin: { debut: '08:00', fin: '12:00', sousPeriodes: [] },
                        dejeuner: { debut: '12:00', fin: '13:00', label: 'Déjeuner' },
                        apres_midi: { debut: '13:00', fin: '16:00', sousPeriodes: [] }
                    });
                }
            }
        };
        fetchPeriodesAndNiveaux();
    }, [selectedCycle, cycles]);  // Déclenchez cet effet quand selectedCycle change

    useEffect(() => {
        setValues(prev => ({ ...prev, cycle: selectedCycle }));
    }, [selectedCycle]);

    useEffect(() => {
        const fetchNiveauxWithSections = async () => {
            if (selectedCycle) {
                try {
                    const token = localStorage.getItem("token");
                    const response = await axios.get(
                        `http://localhost:5000/niveaux/by-cycle-with-sections/${selectedCycle}`,
                        { headers: { Authorization: `Bearer ${token}` } }
                    );
                    setNiveaux(response.data);
                } catch (error) {
                    setError("Erreur lors du chargement des niveaux et sections.");
                    console.error(error);
                } finally {
                    setLoading(false);
                }
            }
        };
        fetchNiveauxWithSections();
    }, [selectedCycle]);

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
                    setError("Erreur lors du chargement des sections.");
                    console.error(error);
                }
            };

            fetchSections();
        }
    }, [selectedNiveau]);
    // Charger les emplois du temps quand une section est sélectionnée
    // Charger les emplois du temps pour une section
    const fetchEmploiDuTemps = async (sectionId) => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get(
                `http://localhost:5000/emploi-du-temps/section/${sectionId}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            // Organiser les données par jour et heure pour un accès facile
            const emploiOrganise = {};
            response.data.forEach(item => {
                if (!emploiOrganise[item.jour]) {
                    emploiOrganise[item.jour] = {};
                }
                emploiOrganise[item.jour][item.heure] = {
                    matiere: item.Matiere,
                    enseignant: item.Enseignant?.Employe?.User || null
                };
            });

            setEmploiDuTempsData(prev => ({
                ...prev,
                [sectionId]: emploiOrganise
            }));

        } catch (error) {
            console.error("Erreur lors du chargement de l'emploi du temps:", error);
        }
    };
    useEffect(() => {
        if (selectedModalSections.length > 0) {
            selectedModalSections.forEach(sectionId => {
                fetchEmploiDuTemps(sectionId);
            });
        } else {
            setEmploiDuTempsData({});
        }
    }, [selectedModalSections]);
    useEffect(() => {
        if (selectedNiveau && niveaux.length > 0) {
            const selectedNiveauData = niveaux.find(n => n.id === selectedNiveau);
            if (selectedNiveauData && selectedNiveauData.Sections) {
                setSectionsForSelectedNiveau(selectedNiveauData.Sections);
            } else {
                setSectionsForSelectedNiveau([]);
            }
        } else {
            setSectionsForSelectedNiveau([]);
        }
        setSelectedSection(""); // Réinitialiser la sélection de section
    }, [selectedNiveau, niveaux]);


    const handleChange = (e) => {
        const { name, value } = e.target;
        setValues(prev => ({ ...prev, [name]: value }));
    };

    // États pour la configuration des périodes
    const [formData, setFormData] = useState({
        matin: { debut: '08:00', fin: '12:00', sousPeriodes: [] },
        dejeuner: { debut: '12:00', fin: '13:00', label: 'Déjeuner', sousPeriodes: [] },
        apres_midi: { debut: '13:00', fin: '16:00', sousPeriodes: [] }
    });

    const jours = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi'];

    const [generationStatus, setGenerationStatus] = useState({
        loading: false,
        success: null,
        message: ''
    });

    // Gestion des périodes
    const handleTimeChange = (periode, field, value) => {
        setFormData(prev => ({
            ...prev,
            [periode]: {
                ...prev[periode],
                [field]: value
            }
        }));
    };

    const handleDejeunerLabelChange = (value) => {
        setFormData(prev => ({
            ...prev,
            dejeuner: {
                ...prev.dejeuner,
                label: value
            }
        }));
    };

    const handleAddSubPeriod = (periode) => {
        setFormData(prev => ({
            ...prev,
            [periode]: {
                ...prev[periode],
                sousPeriodes: [
                    ...prev[periode].sousPeriodes,
                    { debut: '', fin: '', label: '' }
                ]
            }
        }));
    };


    // Générer les heures basées sur les périodes configurées
    // Modifiez la fonction generateHeures pour mieux gérer les sous-périodes
    const formatTime = (timeString) => {
        if (!timeString) return '';
        // Si le temps est déjà au format HH:MM, retournez-le tel quel
        if (timeString.length === 5) return timeString;
        // Sinon, convertissez HH:MM:SS en HH:MM
        return timeString.substring(0, 5);
    };

    // Utilisez cette fonction pour formater les heures dans generateHeures()
    const generateHeures = () => {
        let heures = [];

        // Matin
        if (formData.matin.sousPeriodes?.length > 0) {
            formData.matin.sousPeriodes.forEach(sp => {
                heures.push({
                    plage: `${formatTime(sp.debut)}-${formatTime(sp.fin)}`,
                    label: sp.label || '',
                    type: 'matin'
                });
            });
        } else if (formData.matin.debut && formData.matin.fin) {
            heures.push({
                plage: `${formatTime(formData.matin.debut)}-${formatTime(formData.matin.fin)}`,
                label: '',
                type: 'matin'
            });
        }

        // Déjeuner
        if (formData.dejeuner.debut && formData.dejeuner.fin) {
            heures.push({
                plage: `${formatTime(formData.dejeuner.debut)}-${formatTime(formData.dejeuner.fin)}`,
                label: formData.dejeuner.label || 'Déjeuner',
                type: 'dejeuner'
            });
        }

        // Après-midi
        if (formData.apres_midi.sousPeriodes?.length > 0) {
            formData.apres_midi.sousPeriodes.forEach(sp => {
                heures.push({
                    plage: `${formatTime(sp.debut)}-${formatTime(sp.fin)}`,
                    label: sp.label || '',
                    type: 'apres_midi'
                });
            });
        } else if (formData.apres_midi.debut && formData.apres_midi.fin) {
            heures.push({
                plage: `${formatTime(formData.apres_midi.debut)}-${formatTime(formData.apres_midi.fin)}`,
                label: '',
                type: 'apres_midi'
            });
        }

        return heures;
    };

    // Ajoutez un useEffect pour suivre les changements de formData
    useEffect(() => {
        console.log("FormData mis à jour:", formData);
        // Cela vous aidera à déboguer et voir si les périodes sont bien mises à jour
    }, [formData]);
    // Gestion des changements dans le formulaire des matières
    const handleFieldChange = (id, field, value) => {
        setDurees(prev => ({
            ...prev,
            [id]: {
                ...prev[id],
                [field]: value
            }
        }));
    };

    useEffect(() => {
        if (values.cycle && filteredNiveaux.length > 0) {
            filteredNiveaux.forEach(niveau => {
                if (niveau.Sections && niveau.Sections.length > 0) {
                    niveau.Sections.forEach(section => {
                        fetchEmploiDuTemps(section.id);
                    });
                }
            });
        }
    }, [values.cycle, filteredNiveaux]);

    useEffect(() => {
        const fetchCycle = async () => {
            const token = localStorage.getItem("token");
            if (!token) {
                console.error("❌ Aucun token trouvé !");
                return;
            }

            try {
                if (ecoleeId && ecoleeId !== "null" && ecoleeId !== "undefined") {
                    // Récupérer le cycle spécifique à ecoleeId
                    console.log(`🔍 Récupération du cycle pour l'ecoleeId: ${ecoleeId}`);
                    const response = await axios.get(`http://localhost:5000/ecoles/${ecoleeId}`, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });

                    console.log("✅ Cycle récupéré :", response.data.cycle);
                    setCycle(response.data.cycle); // Mettre à jour le cycle spécifique
                    setCycles([{ id: ecoleeId, nomCycle: response.data.cycle }]); // Ajouter le cycle spécifique à la liste des cycles
                } else {
                    // Récupérer tous les cycles disponibles
                    console.log("🔍 Récupération de tous les cycles");
                    const response = await axios.get('http://localhost:5000/cyclescolaires', {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });

                    console.log("✅ Tous les cycles récupérés :", response.data);
                    setCycles(response.data); // Mettre à jour la liste des cycles
                }
            } catch (error) {
                console.error("❌ Erreur lors de la récupération des cycles :", error);
            }
        };

        fetchCycle();
    }, [ecoleeId]); // Dépendance pour exécuter lorsque ecoleeId change
    useEffect(() => {
        if (cycle) {
            setValues((prevValues) => ({
                ...prevValues,
                cycle: cycle,
            }));
        }
    }, [cycle]);

    const exportToPDF = () => {
        if (!selectedSection) return;
    
        const doc = new jsPDF({
            orientation: 'landscape'
        });
    
        const section = sections.find(s => s.id === selectedSection);
        const title = `Emploi du temps - ${section?.classe}`;
        
        // Titre du document
        doc.setFontSize(16);
        doc.setFont('helvetica', 'bold');
        doc.text(title, 14, 15);
        
        // Préparation des données pour le tableau
        const heures = generateHeures();
        const headers = ['Heures/Jours', ...jours];
        
        const data = heures.map(heure => {
            const row = [heure.plage + (heure.label ? `\n${heure.label}` : '')];
            
            jours.forEach(jour => {
                if (heure.type === 'dejeuner') {
                    row.push({
                        content: heure.label,
                        styles: { fillColor: [255, 242, 204], textColor: [0, 0, 0] } // Jaune clair
                    });
                } else {
                    const sectionData = emploiDuTempsData[selectedSection] || {};
                    const jourData = sectionData[jour] || {};
                    const cours = jourData[heure.plage];
                    
                    if (cours) {
                        const matiere = cours.matiere?.nom || cours.Matiere?.nom || 'Matière inconnue';
                        const enseignant = cours.enseignant 
                            ? `${cours.enseignant.nom} ${cours.enseignant.prenom}`
                            : cours.Enseignant?.Employe?.User 
                                ? `${cours.Enseignant.Employe.User.nom} ${cours.Enseignant.Employe.User.prenom}`
                                : 'Enseignant non assigné';
                        row.push({
                            content: `${matiere}\n${enseignant}`,
                            styles: { fillColor: [226, 239, 218], textColor: [0, 0, 0] } // Vert clair
                        });
                    } else {
                        row.push({
                            content: '-',
                            styles: { fillColor: [255, 255, 255], textColor: [0, 0, 0] }
                        });
                    }
                }
            });
            
            return row;
        });
    
        // Génération du tableau
        autoTable(doc, {
            head: [headers.map(header => ({
                content: header,
                styles: { 
                    fillColor: [68, 114, 196], // Bleu
                    textColor: [255, 255, 255], // Blanc
                    fontStyle: 'bold'
                }
            }))],
            body: data,
            startY: 25,
            styles: {
                fontSize: 8,
                cellPadding: 2,
                valign: 'middle',
                halign: 'center'
            },
            columnStyles: {
                0: {
                    cellWidth: 25,
                    fillColor: [217, 225, 242], // Bleu très clair
                    fontStyle: 'bold'
                }
            },
            didDrawPage: (data) => {
                // Footer
                doc.setFontSize(10);
                doc.setTextColor(150);
                doc.text('Généré le ' + new Date().toLocaleDateString(), data.settings.margin.left, doc.internal.pageSize.height - 10);
            }
        });
    
        doc.save(`EmploiDuTemps_${section?.classe}.pdf`);
    };

    // Fonction pour exporter en Excel
    const exportToExcel = async () => {
        if (!selectedSection) return;
    
        const section = sections.find(s => s.id === selectedSection);
        const title = `Emploi du temps - ${section?.classe}`;
        const heures = generateHeures();
    
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("Emploi du temps");
    
        const joursRow = ['Heures/Jours', ...jours];
    
        // Titre fusionné
        worksheet.mergeCells(1, 1, 1, jours.length + 1);
        const titleCell = worksheet.getCell('A1');
        titleCell.value = title;
        titleCell.font = { bold: true, size: 16 };
        titleCell.alignment = { horizontal: 'center' };
        titleCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'D9E1F2' } };
    
        // Ligne des entêtes
        const headerRow = worksheet.addRow(joursRow);
        headerRow.eachCell((cell) => {
            cell.font = { bold: true, color: { argb: 'FFFFFF' } };
            cell.alignment = { horizontal: 'center' };
            cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '4472C4' } };
        });
    
        // Ajout des lignes de données
        heures.forEach((heure) => {
            const row = [];
            row.push(heure.plage + (heure.label ? ` (${heure.label})` : ''));
    
            jours.forEach((jour) => {
                if (heure.type === 'dejeuner') {
                    row.push(heure.label);
                } else {
                    const sectionData = emploiDuTempsData[selectedSection] || {};
                    const jourData = sectionData[jour] || {};
                    const cours = jourData[heure.plage];
    
                    if (cours) {
                        const matiere = cours.matiere?.nom || cours.Matiere?.nom || 'Matière inconnue';
                        const enseignant = cours.enseignant 
                            ? `${cours.enseignant.nom} ${cours.enseignant.prenom}`
                            : cours.Enseignant?.Employe?.User 
                                ? `${cours.Enseignant.Employe.User.nom} ${cours.Enseignant.Employe.User.prenom}`
                                : 'Enseignant non assigné';
                        row.push(`${matiere}\n${enseignant}`);
                    } else {
                        row.push('-');
                    }
                }
            });
    
            const addedRow = worksheet.addRow(row);
            addedRow.eachCell((cell, colNumber) => {
                cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
    
                if (colNumber === 1) {
                    // Première colonne : heures
                    cell.font = { bold: true };
                    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'D9E1F2' } };
                } else if (heure.type === 'dejeuner') {
                    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF2CC' } };
                } else {
                    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'E2EFDA' } };
                }
            });
        });
    
        // Ajustement des colonnes
        worksheet.columns.forEach(column => {
            column.width = 25;
        });
    
        // Génération et téléchargement du fichier
        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        saveAs(blob, `EmploiDuTemps_${section?.classe}.xlsx`);
    };

    return (
        <div className="container-fluid py-3">
            <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                    <li className="breadcrumb-item"><Link to="/dashboard">Dashboard</Link></li>
                    <li className="breadcrumb-item active">Emploi du temps V2</li>
                </ol>
            </nav>

            <div className="card shadow">
                <div className="card-header bg-primary text-white">
                    <h3 className="card-title mb-0">
                        <i className="fas fa-calendar-alt mr-2"></i>
                        Gestion des emplois du temps
                    </h3>
                </div>
                <div className="card-body">
                    <div className="row mb-4">
                        <div className="col-md-4">
                            <label>Cycle scolaire</label>
                            <select
                                className="form-control"
                                value={selectedCycle}
                                onChange={(e) => setSelectedCycle(e.target.value)}
                                disabled={loading.cycles}
                            >
                                <option value="">Sélectionnez un cycle</option>
                                {cycles.map(cycle => (
                                    <option key={cycle.id} value={cycle.nomCycle}>
                                        {cycle.nomCycle}
                                    </option>
                                ))}
                            </select>
                            {loading.cycles && <small>Chargement...</small>}
                        </div>

                        <div className="col-md-4">
                            <label>Niveau</label>
                            <select
                                className="form-control"
                                value={selectedNiveau}
                                onChange={(e) => setSelectedNiveau(e.target.value)}
                                disabled={!selectedCycle || loading.niveaux}
                            >
                                <option value="">Sélectionnez un niveau</option>
                                {niveaux.map(niveau => (
                                    <option key={niveau.id} value={niveau.id}>
                                        {niveau.nomniveau} {niveau.nomniveuarab && `(${niveau.nomniveuarab})`}
                                    </option>
                                ))}
                            </select>
                            {loading.niveaux && <small>Chargement...</small>}
                        </div>

                        <div className="col-md-4">
                            <label>Section</label>
                            <select
                                className="form-control"
                                value={selectedSection}
                                onChange={(e) => setSelectedSection(e.target.value)}
                                disabled={!selectedNiveau || loading.sections}
                            >
                                <option value="">Sélectionnez une section</option>
                                {sections.map(section => (
                                    <option key={section.id} value={section.id}>
                                        {section.classe} {section.classearab && `(${section.classearab})`}
                                    </option>
                                ))}
                            </select>
                            {loading.sections && <small>Chargement...</small>}
                        </div>
                    </div>

                    {selectedSection && (
                        <div className="mt-4">
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <h4 className="mb-0">
                                    Emploi du temps - {sections.find(s => s.id === selectedSection)?.classe}
                                </h4>
                            </div>

                            <div className="table-responsive">
                                <table className="table table-bordered table-hover">
                                    <thead className="thead-light">
                                        <tr>
                                            <th style={{ width: '15%' }}>Heures/Jours</th>
                                            {jours.map((jour) => (
                                                <th key={jour} className="text-center">{jour}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {generateHeures().map((heure, idx) => (
                                            <tr key={idx} className={heure.type === 'dejeuner' ? 'table-warning' : ''}>
                                                <td>
                                                    {heure.plage}
                                                    {heure.label && <div className="text-muted small">{heure.label}</div>}
                                                </td>
                                                {jours.map((jour) => {
                                                    // Pour le déjeuner, on affiche juste le label
                                                    if (heure.type === 'dejeuner') {
                                                        return (
                                                            <td key={`${jour}-${idx}`} className="align-middle text-center">
                                                                <div className="text-muted fst-italic">
                                                                    {heure.label}
                                                                </div>
                                                            </td>
                                                        );
                                                    }

                                                    const sectionData = emploiDuTempsData[selectedSection] || {};
                                                    const jourData = sectionData[jour] || {};
                                                    const cours = jourData[heure.plage];

                                                    return (
                                                        <td key={`${jour}-${idx}`} className="align-middle">
                                                            {cours ? (
                                                                <div className="text-center p-2 bg-light rounded">
                                                                    <strong className="d-block">
                                                                        {cours.matiere?.nom || cours.Matiere?.nom || 'Matière inconnue'}
                                                                    </strong>
                                                                    {cours.enseignant ? (
                                                                        <span className="text-muted">
                                                                            {cours.enseignant.nom} {cours.enseignant.prenom}
                                                                        </span>
                                                                    ) : cours.Enseignant?.Employe?.User ? (
                                                                        <span className="text-muted">
                                                                            {cours.Enseignant.Employe.User.nom} {cours.Enseignant.Employe.User.prenom}
                                                                        </span>
                                                                    ) : (
                                                                        <span className="text-muted">Enseignant non assigné</span>
                                                                    )}
                                                                </div>
                                                            ) : (
                                                                <div className="text-center text-muted">-</div>
                                                            )}
                                                        </td>
                                                    );
                                                })}
                                            </tr>
                                        ))}

                                    </tbody>
                                </table>
                            </div>

                            {/* Boutons d'action */}
                            <div className="mt-3 d-flex justify-content-end gap-2">
                                <button className="btn btn-primary" onClick={exportToPDF}>
                                    <i className="fas fa-file-pdf mr-2"></i>
                                    PDF
                                </button>
                                <button className="btn btn-success" onClick={exportToExcel}>
                                    <i className="fas fa-file-excel mr-2"></i>
                                    Excel
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
export default EmploiDuTemps;