import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import moment from 'moment';

const ListeAbsences = () => {
    const [presences, setPresences] = useState([]);
    const [filterDate, setFilterDate] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [editingId, setEditingId] = useState(null);
    const [justification, setJustification] = useState({ matin: '', apres_midi: '' });
    const [files, setFiles] = useState({ matin: null, apres_midi: null });

    useEffect(() => {
        fetchAbsences();
    }, [filterDate, searchTerm]);

    const fetchAbsences = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:5000/presences/filtered', {
                headers: { Authorization: `Bearer ${token}` },
                params: {
                    date: filterDate,
                    search: searchTerm
                }
            });
            setPresences(response.data);
        } catch (error) {
            console.error('Erreur lors du chargement:', error);
        }
    };

    const handleEdit = (presence) => {
        setEditingId(presence.id);
        setJustification({
            matin: presence.justificationTextMatin || '',
            apres_midi: presence.justificationTextApresMidi || ''
        });
    };

    // Modifiez la fonction handleSave pour envoyer correctement les fichiers
    const handleSave = async (presence) => {
        try {
            const formData = new FormData();
            formData.append('matinJustification', justification.matin);
            formData.append('apresMidiJustification', justification.apres_midi);

            // Utilisez les noms corrects pour les fichiers
            if (files.matin) formData.append('matinFile', files.matin);
            if (files.apres_midi) formData.append('apresMidiFile', files.apres_midi);

            const token = localStorage.getItem('token');
            await axios.put(`http://localhost:5000/presences/${presence.id}`, formData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });

            setEditingId(null);
            setFiles({ matin: null, apres_midi: null });
            fetchAbsences();
        } catch (error) {
            console.error('Erreur lors de la mise à jour:', error);
        }
    };

    const getStatus = (periode, status) => {
        if (status === 'absent') return 'Absent';
        if (status === 'retard') return 'Retard';
        return null;
    };

    return (
        <div style={{ padding: "20px" }}>
            <nav className="mb-2">
                <Link to="/dashboard">Dashboard</Link>
                <span> / </span>
                <span>Liste des Absences et Retards</span>
            </nav>

            <div className="card">
                <div className="card-header">
                    <h3 className="card-title">Filtres</h3>
                </div>
                <div className="card-body">
                    <div className="row">
                        <div className="col-md-4">
                            <input
                                type="date"
                                className="form-control"
                                value={filterDate}
                                onChange={(e) => setFilterDate(e.target.value)}
                            />
                        </div>
                        <div className="col-md-4">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Rechercher par nom/prénom"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="card mt-4">
                <div className="card-body">
                    <div className="table-responsive">
                        <table className="table table-bordered">
                            <thead>
                                <tr>
                                    <th>Élève</th>
                                    <th>Date</th>
                                    <th>Matin</th>
                                    <th>Après-midi</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {presences.map(presence => (
                                    <tr key={presence.id}>
                                        <td>{presence.eleve?.User?.nom} {presence.eleve?.User?.prenom}</td>
                                        <td>{moment(presence.date).format('DD/MM/YYYY')}</td>

                                        {/* Colonne Matin */}
                                        <td>
                                            <div className="d-flex flex-column">
                                                <span>{getStatus('matin', presence.matin)}</span>
                                                {editingId === presence.id ? (
                                                    <>
                                                        <input
                                                            type="text"
                                                            className="form-control mt-1"
                                                            value={justification.matin}
                                                            onChange={(e) => setJustification(prev => ({
                                                                ...prev,
                                                                matin: e.target.value
                                                            }))}
                                                        />
                                                        <input
                                                            type="file"
                                                            className="form-control mt-1"
                                                            onChange={(e) => setFiles(prev => ({
                                                                ...prev,
                                                                matin: e.target.files[0]
                                                            }))}
                                                        />
                                                    </>
                                                ) : (
                                                    presence.justificationTextMatin ||
                                                    (presence.justificationMatin && (
                                                        <a href={`http://localhost:5000/uploads/${presence.justificationMatin}`}
                                                            target="_blank"
                                                            rel="noopener noreferrer">
                                                            Voir fichier
                                                        </a>
                                                    ))
                                                )}
                                            </div>
                                        </td>

                                        {/* Colonne Après-midi */}
                                        <td>
                                            <div className="d-flex flex-column">
                                                <span>{getStatus('apres_midi', presence.apres_midi)}</span>
                                                {editingId === presence.id ? (
                                                    <>
                                                        <input
                                                            type="text"
                                                            className="form-control mt-1"
                                                            value={justification.apres_midi}
                                                            onChange={(e) => setJustification(prev => ({
                                                                ...prev,
                                                                apres_midi: e.target.value
                                                            }))}
                                                        />
                                                        <input
                                                            type="file"
                                                            className="form-control mt-1"
                                                            onChange={(e) => setFiles(prev => ({
                                                                ...prev,
                                                                apres_midi: e.target.files[0]
                                                            }))}
                                                        />
                                                    </>
                                                ) : (
                                                    presence.justificationTextApresMidi ||
                                                    (presence.justificationApresMidi && (
                                                        <a href={`http://localhost:5000/uploads/${presence.justificationApresMidi}`}
                                                            target="_blank"
                                                            rel="noopener noreferrer">
                                                            Voir fichier
                                                        </a>
                                                    ))
                                                )}
                                            </div>
                                        </td>

                                        <td>
                                            {editingId === presence.id ? (
                                                <button
                                                    className="btn btn-success"
                                                    onClick={() => handleSave(presence)}
                                                >
                                                    Enregistrer
                                                </button>
                                            ) : (
                                                <button
                                                    className="btn btn-primary"
                                                    onClick={() => handleEdit(presence)}
                                                >
                                                    Modifier
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ListeAbsences;