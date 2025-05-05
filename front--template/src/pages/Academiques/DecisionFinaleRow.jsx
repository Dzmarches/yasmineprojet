import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Form } from 'react-bootstrap';

const DecisionFinaleRow = ({ eleve, selectedAnnee, selectedNiveau, selectedSection, cycle, niveaux, sections }) => {
    const [moyennes, setMoyennes] = useState({
        trim1: null,
        trim2: null,
        trim3: null,
        annuelle: null,
        decision: ''
    });
    const [loading, setLoading] = useState(true);
    const [nextAnnee, setNextAnnee] = useState(null);
    const [nextNiveau, setNextNiveau] = useState(null);
    const [nextSection, setNextSection] = useState(null);
    const [updating, setUpdating] = useState(false);

    // Trouver le niveau suivant
    const findNextNiveau = (currentNiveauId) => {
        if (!niveaux || !currentNiveauId) return null;
        
        const currentNiveau = niveaux.find(n => n.id === parseInt(currentNiveauId));
        if (!currentNiveau) return null;

        // Trouver le niveau suivant dans le même cycle
        const next = niveaux.find(n => 
            n.cycle === currentNiveau.cycle && 
            n.ordre > currentNiveau.ordre
        );

        return next || null;
    };

    // Trouver la première section du niveau suivant
    const findNextSection = (niveauId) => {
        if (!sections || !niveauId) return null;
        return sections.find(s => s.niveauId === parseInt(niveauId)) || null;
    };

    // Mettre à jour l'élève dans la base de données
    const updateEleve = async () => {
        if (!nextNiveau || !nextSection || !selectedAnnee) {
            alert('Impossible de déterminer le niveau/section suivant');
            return;
        }

        setUpdating(true);
        try {
            const token = localStorage.getItem('token');
            await axios.put(
                `http://localhost:5000/eleves/${eleve.id}/update-niveau`,
                {
                    niveauId: nextNiveau.id,
                    classeId: nextSection.id,
                    annescolaireId: selectedAnnee.id + 1 // On suppose que l'ID est séquentiel
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            alert('Élève mis à jour avec succès!');
        } catch (error) {
            console.error('Erreur lors de la mise à jour:', error);
            alert('Erreur lors de la mise à jour');
        } finally {
            setUpdating(false);
        }
    };

    useEffect(() => {
        const fetchMoyennes = async () => {
            if (!selectedAnnee || !selectedSection) return;
            
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(
                    `http://localhost:5000/moyenne/eleve/${eleve.id}/${selectedAnnee.id}/${selectedSection}`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );

                const data = response.data;
                const moyennesData = {
                    trim1: data.find(item => item.trimestId === 1)?.moyenne || null,
                    trim2: data.find(item => item.trimestId === 2)?.moyenne || null,
                    trim3: data.find(item => item.trimestId === 3)?.moyenne || null,
                    annuelle: null,
                    decision: ''
                };

                // Calcul de la moyenne annuelle si les 3 trimestres sont disponibles
                if (moyennesData.trim1 && moyennesData.trim2 && moyennesData.trim3) {
                    moyennesData.annuelle = (
                        (parseFloat(moyennesData.trim1) + 
                        parseFloat(moyennesData.trim2) + 
                        parseFloat(moyennesData.trim3)
                    ) / 3);

                    // Détermination de la décision
                    if (cycle === 'Primaire') {
                        moyennesData.decision = moyennesData.annuelle >= 5.0 ? 'Admin(e)' : 'Ajourné(e)';
                    } else if (cycle === 'Cem' || cycle === 'Lycée') {
                        moyennesData.decision = moyennesData.annuelle >= 10.0 ? 'Admin(e)' : 'Ajourné(e)';
                    }

                    // Calculer l'année suivante (currentYear + 1)
                    if (selectedAnnee) {
                        const currentYear = new Date(selectedAnnee.datedebut).getFullYear();
                        setNextAnnee(`${currentYear + 1}-${currentYear + 2}`);
                    }

                    // Trouver le niveau suivant si l'élève est admis
                    if (moyennesData.decision === 'Admin(e)') {
                        const nextNiv = findNextNiveau(selectedNiveau);
                        setNextNiveau(nextNiv);
                        
                        if (nextNiv) {
                            const nextSec = findNextSection(nextNiv.id);
                            setNextSection(nextSec);
                        }
                    }
                }

                setMoyennes(moyennesData);
            } catch (error) {
                console.error('Erreur lors du chargement des moyennes', error);
            } finally {
                setLoading(false);
            }
        };

        fetchMoyennes();
    }, [eleve.id, selectedAnnee, selectedNiveau, selectedSection, cycle, niveaux, sections]);

    if (loading) {
        return <tr><td colSpan="7">Chargement...</td></tr>;
    }

    return (
        <tr>
            <td>{eleve.numidentnational}</td>
            <td>{eleve.User?.prenom} {eleve.User?.nom}</td>
            <td>{moyennes.trim1 ? parseFloat(moyennes.trim1).toFixed(2) : 'N/A'}</td>
            <td>{moyennes.trim2 ? parseFloat(moyennes.trim2).toFixed(2) : 'N/A'}</td>
            <td>{moyennes.trim3 ? parseFloat(moyennes.trim3).toFixed(2) : 'N/A'}</td>
            <td>
                {moyennes.annuelle ? parseFloat(moyennes.annuelle).toFixed(2) : 'N/A'}
            </td>
            <td className={moyennes.decision === 'Admin(e)' ? 'text-success' : 'text-danger'}>
                {moyennes.decision || 'N/A'}
                {moyennes.decision && (
                    <div className="mt-2 small">
                        {moyennes.decision === 'Admin(e)' ? (
                            <>
                                <div>Année scolaire: {nextAnnee}</div>
                                <div>Niveau: {nextNiveau?.nomniveau || 'N/A'}</div>
                                <div>Section: {nextSection?.classe || 'N/A'}</div>
                                <button 
                                    className="btn btn-sm btn-primary mt-1"
                                    onClick={updateEleve}
                                    disabled={updating || !nextNiveau || !nextSection}
                                >
                                    {updating ? 'Mise à jour...' : 'Mettre à jour'}
                                </button>
                            </>
                        ) : (
                            <div>Année scolaire: {nextAnnee}</div>
                        )}
                    </div>
                )}
            </td>
        </tr>
    );
};

export default DecisionFinaleRow;