import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Button, Modal, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const AbsenceRemarqueRow = ({ eleve, matieres, enseignantsParMatiere, selectedSection, selectedTrimestre, trimestreDates }) => {
    const [absences, setAbsences] = useState(0);
    const [retards, setRetards] = useState(0);
    const [justifications, setJustifications] = useState([]);
    const [remarques, setRemarques] = useState({});
    const [decisionFinale, setDecisionFinale] = useState('');

    useEffect(() => {
        const fetchPresences = async () => {
            if (!selectedTrimestre || !trimestreDates) return;
            
            try {
                const token = localStorage.getItem("token");
                const response = await axios.get(
                    `http://localhost:5000/presences/eleve/${eleve.id}`,
                    { 
                        params: {
                            startDate: trimestreDates.debut,
                            endDate: trimestreDates.fin
                        },
                        headers: { Authorization: `Bearer ${token}` } 
                    }
                );

                const presences = response.data;
                let absCount = 0;
                let retCount = 0;
                const justifs = [];

                presences.forEach(p => {
                    if (p.matin === 'absent') absCount++;
                    if (p.apres_midi === 'absent') absCount++;
                    if (p.matin === 'retard') retCount++;
                    if (p.apres_midi === 'retard') retCount++;
                    if (p.justificationMatin) justifs.push(p.justificationMatin);
                    if (p.justificationApresMidi) justifs.push(p.justificationApresMidi);
                });

                setAbsences(absCount);
                setRetards(retCount);
                setJustifications(justifs);
            } catch (error) {
                console.error("Erreur lors du chargement des présences:", error);
            }
        };

        fetchPresences();
    }, [eleve.id, selectedTrimestre, trimestreDates]);

    const handleRemarqueChange = (matiereId, value) => {
        setRemarques(prev => ({
            ...prev,
            [matiereId]: value
        }));
    };

    const saveRemarques = async () => {
        try {
            const token = localStorage.getItem("token");
            await axios.post(
                "http://localhost:5000/remarques/bulk",
                {
                    eleveId: eleve.id,
                    sectionId: selectedSection,
                    trimestId: selectedTrimestre,
                    remarques: Object.entries(remarques).map(([matiereId, texte]) => ({
                        matiereId,
                        texte,
                        enseignantId: enseignantsParMatiere[matiereId]?.id
                    })),
                    decisionFinale
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            alert("Remarques enregistrées avec succès!");
        } catch (error) {
            console.error("Erreur lors de l'enregistrement:", error);
            alert("Erreur lors de l'enregistrement");
        }
    };

    return (
        <tr>
            <td>{eleve.numidentnational}</td>
            <td>{eleve.User?.prenom} {eleve.User?.nom}</td>
            <td>{absences}</td>
            <td>{retards}</td>
            <td>
                {justifications.length > 0 ? (
                    <ul>
                        {justifications.map((j, i) => <li key={i}>{j}</li>)}
                    </ul>
                ) : 'Aucune'}
            </td>
            
            {matieres.map((matiere) => (
                <td key={matiere.Matiere.id}>
                    <Form.Control
                        as="textarea"
                        rows={2}
                        value={remarques[matiere.Matiere.id] || ''}
                        onChange={(e) => handleRemarqueChange(matiere.Matiere.id, e.target.value)}
                        placeholder={`Remarque pour ${matiere.Matiere.nom}`}
                    />
                </td>
            ))}
            
            <td>
                <Form.Control
                    as="textarea"
                    rows={3}
                    value={decisionFinale}
                    onChange={(e) => setDecisionFinale(e.target.value)}
                    placeholder="Décision finale de l'administration"
                />
                <Button 
                    variant="primary" 
                    size="sm" 
                    className="mt-2"
                    onClick={saveRemarques}
                >
                    Enregistrer
                </Button>
            </td>
        </tr>
    );
};
export default AbsenceRemarqueRow;