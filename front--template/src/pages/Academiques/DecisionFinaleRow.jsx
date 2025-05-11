import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Form } from 'react-bootstrap';

const DecisionFinaleRow = ({
    eleve,
    selectedAnnee,
    selectedNiveau,
    selectedSection,
    cycle,
    niveaux,
    sections,
    isSelected,
    onSelect,
    allSelected
}) => {
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
                        ) / 3).toFixed(2);

                    // Détermination de la décision
                    if (cycle === 'Primaire') {
                        moyennesData.decision = moyennesData.annuelle >= 5.0 ? 'Admis(e)' : 'Ajourné(e)';
                    } else if (cycle === 'Cem' || cycle === 'Lycée') {
                        moyennesData.decision = moyennesData.annuelle >= 10.0 ? 'Admis(e)' : 'Ajourné(e)';
                    }

                    // Calculer l'année suivante (currentYear + 1)
                    if (selectedAnnee) {
                        const currentYear = new Date(selectedAnnee.datedebut).getFullYear();
                        setNextAnnee(`${currentYear + 1}-${currentYear + 2}`);
                    }

                    // Trouver le niveau suivant si l'élève est admis
                    if (moyennesData.decision === 'Admis(e)') {
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
        return <tr><td colSpan="8">Chargement...</td></tr>;
    }

    return (
        <tr>
            <td>
                <Form.Check
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => onSelect(eleve.id)}
                />
            </td>
            <td>{eleve.numidentnational}</td>
            <td>{eleve.User?.prenom} {eleve.User?.nom}</td>
            <td>{moyennes.trim1 || 'N/A'}</td>
            <td>{moyennes.trim2 || 'N/A'}</td>
            <td>{moyennes.trim3 || 'N/A'}</td>
            <td>{moyennes.annuelle || 'N/A'}</td>
            <td className={moyennes.decision === 'Admis(e)' ? 'text-success' : 'text-danger'}>
                {moyennes.decision || 'N/A'}
                {moyennes.decision === 'Admis(e)' && nextNiveau && (
                    <div className="small mt-1">
                        <div>Niveau: {nextNiveau.nomniveau}</div>
                        <div>Année: {nextAnnee}</div>
                    </div>
                )}
            </td>
        </tr>
    );
};

export default DecisionFinaleRow;  