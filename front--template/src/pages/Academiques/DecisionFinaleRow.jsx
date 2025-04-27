import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Form } from 'react-bootstrap';

const DecisionFinaleRow = ({ eleve, selectedAnnee, selectedNiveau, selectedSection, cycle }) => {
    const [moyennes, setMoyennes] = useState({
        trim1: null,
        trim2: null,
        trim3: null,
        annuelle: null,
        decision: ''
    });
    const [loading, setLoading] = useState(true);

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
                        moyennesData.decision = moyennesData.annuelle >= 5.0 ? 'Passé(e)' : 'Ajourné(e)';
                    } else if (cycle === 'Cem' || cycle === 'Lycée') {
                        moyennesData.decision = moyennesData.annuelle >= 10.0 ? 'Passé(e)' : 'Ajourné(e)';
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
    }, [eleve.id, selectedAnnee, selectedSection, cycle]);

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
            <td className={moyennes.decision === 'Passé(e)' ? 'text-success' : 'text-danger'}>
                {moyennes.decision || 'N/A'}
            </td>
        </tr>
    );
};

export default DecisionFinaleRow;