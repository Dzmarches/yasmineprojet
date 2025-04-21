import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { useReactToPrint } from 'react-to-print';
import printer from '../../assets/imgs/printer.png';

const EnseignantClasses = () => {
    const { enseignantId } = useParams();
    const [niveaux, setNiveaux] = useState([]);
    const [sections, setSections] = useState([]);
    const [selectedNiveau, setSelectedNiveau] = useState(null);
    const [selectedSection, setSelectedSection] = useState(null);
    const [eleves, setEleves] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const printRef = useRef();

    const handlePrint = () => {
        const printWindow = window.open('', '_blank');
        const printContent = `
            <html>
                <head>
                    <title>Liste des élèves</title>
                    <style>
                        @page { size: auto; margin: 5mm; }
                        body { padding: 20px; }
                        table { width: 100%; border-collapse: collapse; }
                        th, td { border: 1px solid #ddd; padding: 8px; }
                        th { background-color: #f2f2f2; }
                        tr:nth-child(even) { background-color: #f9f9f9; }
                    </style>
                </head>
                <body>
                    <h2>Liste des élèves - ${sections.find(s => s.id === selectedSection)?.classe || 'N/A'}</h2>
                    <table>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Nom</th>
                                <th>Prénom</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${eleves.length > 0 ? 
                                eleves.map((eleve, index) => `
                                    <tr>
                                        <td>${index + 1}</td>
                                        <td>${eleve.User?.nom || 'N/A'}</td>
                                        <td>${eleve.User?.prenom || 'N/A'}</td>
                                    </tr>
                                `).join('') : 
                                `<tr><td colspan="3" class="text-center">Aucun élève trouvé</td></tr>`
                            }
                        </tbody>
                    </table>
                </body>
            </html>
        `;
    
        printWindow.document.write(printContent);
        printWindow.document.close();
        printWindow.print();
    };

    // 1. Récupérer les niveaux de l'enseignant
    useEffect(() => {
        const fetchNiveaux = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) throw new Error('Aucun token trouvé. Veuillez vous connecter.');

                const response = await axios.get(`http://localhost:5000/enseignant/${enseignantId}/niveaux`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

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
            if (selectedNiveau) {
                try {
                    setLoading(true);
                    const token = localStorage.getItem('token');
                    const response = await axios.get(`http://localhost:5000/enseignant/${enseignantId}/niveaux/${selectedNiveau}/sections`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    setSections(response.data);
                } catch (error) {
                    console.error("Erreur lors de la récupération des sections:", error);
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchSections();
    }, [enseignantId, selectedNiveau]);

    // 3. Récupérer les élèves quand une section est sélectionnée
    const fetchEleves = async (sectionId) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) throw new Error('Aucun token trouvé. Veuillez vous connecter.');

            const response = await axios.get(`http://localhost:5000/listClasse/classe/${sectionId}/eleves`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setEleves(response.data);
            setSelectedSection(sectionId);
        } catch (error) {
            console.error('Erreur lors de la récupération des élèves:', error);
        }
    };

    if (loading) return <p>Chargement ...</p>;
    if (error) return <p style={{ color: "red" }}>{error}</p>;

    return (
        <div style={{ padding: "20px" }}>
            <nav className="mb-2">
                <Link to="/dashboard">Dashboard</Link>
                <span> / </span>
                <span>Gestion des Sections</span>
            </nav>

            <section className="content">
                <div className="container-fluid">
                    <div className="card card-primary card-outline">
                        <div className="card-header">
                            <h3 className="card-title">
                                <i className="fas fa-layer-group mr-2"></i>
                                Mes Classes
                            </h3>
                        </div>
                        <div className="card-body">
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

                            {/* Sélection de la section */}
                            {selectedNiveau && sections.length > 0 && (
                                <div className="mb-4">
                                    <h4>Sélectionnez une section :</h4>
                                    <div className="d-flex flex-wrap gap-2 mb-4">
                                        {sections.map((section) => (
                                            <button
                                                key={section.id}
                                                onClick={() => fetchEleves(section.id)}
                                                className={`btn ${selectedSection === section.id ? 'btn-primary' : 'btn-outline-secondary'}`}
                                                style={{
                                                    minWidth: "120px",
                                                    fontWeight: "600",
                                                    boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
                                                }}
                                            >
                                                {section.classe}
                                                {section.classearab && (
                                                    <div style={{ fontSize: "0.8em" }}>
                                                        {section.classearab}
                                                    </div>
                                                )}
                                            </button>
                                        ))}
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
                                                <button 
                                                    onClick={handlePrint}
                                                    className="btn btn-primary no-print"
                                                >
                                                    <img src={printer} alt="Imprimer" width="20" className="mr-2" />
                                                    Imprimer
                                                </button>
                                            </div>
                                            <div className="card-body p-0">
                                                <div className="table-responsive" ref={printRef}>
                                                    <table className="table table-hover table-striped">
                                                        <thead className="thead-light">
                                                            <tr>
                                                                <th>#</th>
                                                                <th>Nom</th>
                                                                <th>Prénom</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {eleves.length > 0 ? (
                                                                eleves.map((eleve, index) => (
                                                                    <tr key={eleve.id}>
                                                                        <td>{index + 1}</td>
                                                                        <td>{eleve.User?.nom || 'N/A'}</td>
                                                                        <td>{eleve.User?.prenom || 'N/A'}</td>
                                                                    </tr>
                                                                ))
                                                            ) : (
                                                                <tr>
                                                                    <td colSpan="3" className="text-center">Aucun élève trouvé</td>
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

export default EnseignantClasses;