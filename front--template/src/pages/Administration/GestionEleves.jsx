import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const GestionEleves = () => {
    const [niveaux, setNiveaux] = useState([]);
    const [selectedNiveau, setSelectedNiveau] = useState(null);
    const [eleves, setEleves] = useState([]);
    const [sections, setSections] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedSection, setSelectedSection] = useState(null);
    const [selectedEleves, setSelectedEleves] = useState([]);
    const [isSaving, setIsSaving] = useState(false);
    const [allData, setAllData] = useState([]);
    const [elevesBySection, setElevesBySection] = useState({});

    const fetchElevesBySection = async (sectionId) => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get(`http://localhost:5000/eleves/section/${sectionId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return response.data;
        } catch (error) {
            console.error("Erreur lors de la récupération des élèves:", error);
            return [];
        }
    };

    const fetchAllData = async () => {
        try {
            const token = localStorage.getItem("token");

            // Récupérer les niveaux
            const niveauxResponse = await axios.get("http://localhost:5000/niveaux", {
                headers: { Authorization: `Bearer ${token}` }
            });
            setNiveaux(niveauxResponse.data);

            // Récupérer les données pour chaque niveau
            const dataPromises = niveauxResponse.data.map(async (niveau) => {
                const sectionsResponse = await axios.get(`http://localhost:5000/sections/niveau/${niveau.id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                const sectionsWithEleves = await Promise.all(
                    sectionsResponse.data.map(async (section) => {
                        const eleves = await fetchElevesBySection(section.id);
                        return {
                            ...section,
                            eleves
                        };
                    })
                );

                return {
                    niveau,
                    sections: sectionsResponse.data,
                    sectionsWithEleves
                };
            });

            const allDataResult = await Promise.all(dataPromises);
            setAllData(allDataResult);
        } catch (error) {
            setError("Erreur lors du chargement des données.");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAllData();
    }, []);

    useEffect(() => {
        if (selectedNiveau) {
            const fetchData = async () => {
                try {
                    const token = localStorage.getItem("token");
                    const [elevesResponse, sectionsResponse] = await Promise.all([
                        axios.get(`http://localhost:5000/eleves/niveau/${selectedNiveau}`, {
                            headers: { Authorization: `Bearer ${token}` }
                        }),
                        axios.get(`http://localhost:5000/sections/niveau/${selectedNiveau}`, {
                            headers: { Authorization: `Bearer ${token}` }
                        })
                    ]);

                    // Filtrer les élèves qui n'ont pas de section affectée
                    const elevesSansSection = elevesResponse.data.filter(eleve => !eleve.classeId);
                    setEleves(elevesSansSection);
                    setSections(sectionsResponse.data);
                    setSelectedSection(null);
                    setSelectedEleves([]);
                } catch (error) {
                    setError("Erreur lors du chargement des données.");
                    console.error(error);
                }
            };

            fetchData();
        }
    }, [selectedNiveau]);

    const handleNiveauClick = (niveauId) => {
        setSelectedNiveau(niveauId);
    };

    const handleSectionSelection = (sectionId) => {
        setSelectedSection(sectionId === selectedSection ? null : sectionId);
    };

    const toggleEleveSelection = (eleveId) => {
        setSelectedEleves(prev =>
            prev.includes(eleveId)
                ? prev.filter(id => id !== eleveId)
                : [...prev, eleveId]
        );
    };

    const toggleAllEleves = () => {
        if (selectedEleves.length === eleves.length) {
            setSelectedEleves([]);
        } else {
            setSelectedEleves(eleves.map(eleve => eleve.id));
        }
    };

    const assignSectionToStudents = async () => {
        if (!selectedSection || selectedEleves.length === 0) return;

        setIsSaving(true);
        try {
            const token = localStorage.getItem("token");
            await Promise.all(selectedEleves.map(eleveId => {
                return axios.put(`http://localhost:5000/eleves/${eleveId}/classe`, {
                    classeId: selectedSection
                }, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            }));
            
            // Mettre à jour les données après affectation
            await fetchAllData();
            
            // Recharger les élèves du niveau sélectionné
            if (selectedNiveau) {
                const token = localStorage.getItem("token");
                const elevesResponse = await axios.get(`http://localhost:5000/eleves/niveau/${selectedNiveau}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const elevesSansSection = elevesResponse.data.filter(eleve => !eleve.classeId);
                setEleves(elevesSansSection);
            }
            
            alert("Sections attribuées avec succès !");
            setSelectedEleves([]);
            setSelectedSection(null);
        } catch (error) {
            console.error("❌ Erreur lors de l'attribution :", error);
            if (error.response) {
                alert(`Erreur : ${error.response.data.message}`);
            } else {
                alert("Une erreur s'est produite. Vérifiez votre serveur.");
            }
        } finally {
            setIsSaving(false);
        }
    };

    const handleUnassignStudent = async (eleveId) => {
        try {
            const token = localStorage.getItem("token");
            await axios.put(`http://localhost:5000/eleves/${eleveId}/classe`, {
                classeId: null
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            // Mettre à jour les données après désaffectation
            await fetchAllData();
            
            // Recharger les élèves du niveau correspondant
            if (selectedNiveau) {
                const token = localStorage.getItem("token");
                const elevesResponse = await axios.get(`http://localhost:5000/eleves/niveau/${selectedNiveau}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const elevesSansSection = elevesResponse.data.filter(eleve => !eleve.classeId);
                setEleves(elevesSansSection);
            }
            
            alert("Élève désaffecté avec succès !");
        } catch (error) {
            console.error("❌ Erreur lors de la désaffectation :", error);
            alert("Une erreur s'est produite lors de la désaffectation.");
        }
    };

    if (loading) return <p>Chargement ...</p>;
    if (error) return <p style={{ color: "red" }}>{error}</p>;

    // Calculer le nombre total d'élèves dans le niveau sélectionné
    const totalElevesInNiveau = selectedNiveau 
        ? allData.find(data => data.niveau.id === selectedNiveau)?.sectionsWithEleves
            .flatMap(section => section.eleves).length || 0
        : 0;

    return (
        <div style={{ padding: "20px" }}>
            <nav className="mb-2">
                <Link to="/dashboard">Dashboard</Link>
                <span> / </span>
                <span>Gestion des élèves</span>
            </nav>

            <section className="content">
                <div className="container-fluid">
                    <div className="card card-primary card-outline">
                        <div className="card-header">
                            <h3 className="card-title">
                                <i className="fas fa-layer-group mr-2"></i>
                                Liste des niveaux
                            </h3>
                        </div>
                        <div className="card-body">
                            <div className="d-flex flex-wrap gap-2 mb-4">
                                {niveaux.map((niveau) => (
                                    <button
                                        key={niveau.id}
                                        onClick={() => handleNiveauClick(niveau.id)}
                                        className={`btn ${selectedNiveau === niveau.id ? 'btn-success' : 'btn-outline-secondary'}`}
                                        style={{
                                            minWidth: "120px",
                                            fontWeight: "600",
                                            boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
                                        }}
                                    >
                                        {niveau.nomniveau}
                                    </button>
                                ))}
                            </div>

                            {selectedNiveau && (
                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="card">
                                            <div className="card-header bg-info d-flex justify-content-between align-items-center">
                                                <h3 className="card-title mb-0">Sections</h3>
                                                <button
                                                    className="btn btn-sm btn-success"
                                                    onClick={assignSectionToStudents}
                                                    disabled={!selectedSection || selectedEleves.length === 0 || isSaving}
                                                >
                                                    {isSaving ? (
                                                        <>
                                                            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                                            <span className="sr-only">Enregistrement...</span>
                                                        </>
                                                    ) : (
                                                        "Attribuer la section"
                                                    )}
                                                </button>
                                            </div>
                                            <div className="card-body p-0">
                                                <ul className="list-group list-group-flush">
                                                    {sections.map((section) => (
                                                        <li
                                                            key={section.id}
                                                            className={`list-group-item d-flex justify-content-between align-items-center ${selectedSection === section.id ? 'active' : ''}`}
                                                            onClick={() => handleSectionSelection(section.id)}
                                                            style={{ cursor: 'pointer' }}
                                                        >
                                                            <div>
                                                                <span>{section.classe}</span>
                                                            </div>
                                                            <span className="badge bg-primary">{section.classearab}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-md-6">
                                        <div className="card">
                                            <div className="card-header bg-info d-flex justify-content-between align-items-center">
                                                <div className="form-check">
                                                    <input
                                                        type="checkbox"
                                                        className="form-check-input"
                                                        checked={selectedEleves.length === eleves.length && eleves.length > 0}
                                                        onChange={toggleAllEleves}
                                                        disabled={eleves.length === 0}
                                                    />
                                                    <label className="form-check-label">Tout sélectionner</label>
                                                </div>
                                                <h3 className="card-title mb-0">
                                                    Élèves ({totalElevesInNiveau} total, {eleves.length} non affectés)
                                                </h3>
                                            </div>
                                            <div className="card-body p-0">
                                                <div className="table-responsive">
                                                    <table className="table table-hover table-striped">
                                                        <thead className="thead-light">
                                                            <tr>
                                                                <th>
                                                                    <input
                                                                        type="checkbox"
                                                                        checked={selectedEleves.length === eleves.length && eleves.length > 0}
                                                                        onChange={toggleAllEleves}
                                                                        disabled={eleves.length === 0}
                                                                    />
                                                                </th>
                                                                <th>Nom</th>
                                                                <th>Prénom</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {eleves.map((eleve) => (
                                                                <tr key={eleve.id}>
                                                                    <td>
                                                                        <input
                                                                            type="checkbox"
                                                                            checked={selectedEleves.includes(eleve.id)}
                                                                            onChange={() => toggleEleveSelection(eleve.id)}
                                                                        />
                                                                    </td>
                                                                    <td>{eleve.User?.nom}</td>
                                                                    <td>{eleve.User?.prenom}</td>
                                                                </tr>
                                                            ))}
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

                    <div className="card mt-4">
                        <div className="card-header bg-info">
                            <h3 className="card-title">Détails des Niveaux, Sections et Élèves</h3>
                        </div>
                        <div className="card-body">
                            <div className="table-responsive">
                                <table className="table table-bordered">
                                    <thead>
                                        <tr>
                                            <th>Niveau</th>
                                            <th>Section</th>
                                            <th>Élèves</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {allData.map((niveauData) => {
                                            if (niveauData.sections.length === 0) {
                                                return (
                                                    <tr key={`niveau-${niveauData.niveau.id}`}>
                                                        <td>{niveauData.niveau.nomniveau}</td>
                                                        <td colSpan="2">Aucune section</td>
                                                    </tr>
                                                );
                                            }

                                            return niveauData.sections.map((section, sectionIndex) => {
                                                const sectionWithEleves = niveauData.sectionsWithEleves?.find(s => s.id === section.id);
                                                const elevesDeLaSection = sectionWithEleves?.eleves || [];

                                                return (
                                                    <tr key={`section-${section.id}`}>
                                                        {sectionIndex === 0 && (
                                                            <td rowSpan={niveauData.sections.length} className="align-middle">
                                                                {niveauData.niveau.nomniveau}
                                                            </td>
                                                        )}
                                                        <td>
                                                            {section.classe} ({section.classearab})
                                                        </td>
                                                        <td>
                                                            {elevesDeLaSection.length > 0 ? (
                                                                <div className="d-flex flex-wrap gap-1">
                                                                    {elevesDeLaSection.map(eleve => (
                                                                        <span 
                                                                            key={eleve.id} 
                                                                            className="badge bg-secondary me-1 mb-1 ml-1"
                                                                            style={{ cursor: 'pointer' }}
                                                                            onClick={() => handleUnassignStudent(eleve.id)}
                                                                            title="Cliquer pour désaffecter"
                                                                        >
                                                                            {eleve.User?.prenom} {eleve.User?.nom}
                                                                        </span>
                                                                    ))}
                                                                </div>
                                                            ) : (
                                                                <span className="text-muted">Aucun élève</span>
                                                            )}
                                                        </td>
                                                    </tr>
                                                );
                                            });
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default GestionEleves;