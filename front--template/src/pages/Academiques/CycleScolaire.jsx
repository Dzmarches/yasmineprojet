import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import add from '../../assets/imgs/add.png';
import phase from '../../assets/imgs/phase.png';
import editIcon from '../../assets/imgs/edit.png';
import deleteIcon from '../../assets/imgs/archive.png';
import './modal.css';

const CycleScolaire = () => {
    const [showModal, setShowModal] = useState(false);
    const [classement, setClassement] = useState('');
    const [nomCycle, setNomCycle] = useState('');
    const [nomCycleArabe, setNomCycleArabe] = useState('');
    const [cycles, setCycles] = useState([]);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [selectedCycle, setSelectedCycle] = useState(null);
    const [selectedCycles, setSelectedCycles] = useState([]); // État pour les cycles sélectionnés
    const [searchTerm, setSearchTerm] = useState('');

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(5);

    useEffect(() => {
        const fetchCycles = async () => {
            try {
                const response = await axios.get('http://localhost:5000/cyclescolaires');
                setCycles(response.data);
            } catch (error) {
                console.error('Erreur lors de la récupération des cycles scolaires', error);
            }
        };
        fetchCycles();
    }, []);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = cycles.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(cycles.length / itemsPerPage);

    const nextPage = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };

    const prevPage = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    const paginationButtons = [];
    for (let i = 1; i <= totalPages; i++) {
        paginationButtons.push(
            <button
                key={i}
                onClick={() => setCurrentPage(i)}
                className={`btn btn-outline-primary ${i === currentPage ? 'active' : ''}`}
            >
                {i}
            </button>
        );
    }

    const handleShowModal = () => {
        setShowModal(true);
        setSelectedCycle(null);
        setClassement('');
        setNomCycle('');
        setNomCycleArabe('');
        setError('');
        setSuccess('');
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedCycle(null);
    };

    const handleEdit = (cycle) => {
        setSelectedCycle(cycle);
        setClassement(cycle.classement);
        setNomCycle(cycle.nomCycle);
        setNomCycleArabe(cycle.nomCycleArabe);
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!classement || !nomCycle || !nomCycleArabe) {
            setError('Tous les champs sont obligatoires');
            return;
        }
        try {
            let updatedCycles;
            if (selectedCycle) {
                const response = await axios.put(`http://localhost:5000/cyclescolaires/${selectedCycle.id}`, {
                    classement,
                    nomCycle,
                    nomCycleArabe,
                });
                updatedCycles = cycles.map((cycle) =>
                    cycle.id === selectedCycle.id ? response.data.cycle : cycle
                );
                setSuccess('Cycle modifié avec succès!');
            } else {
                const response = await axios.post('http://localhost:5000/cyclescolaires', {
                    classement,
                    nomCycle,
                    nomCycleArabe,
                });
                updatedCycles = [...cycles, response.data.cycle];
                setSuccess('Cycle ajouté avec succès!');
            }
            setCycles(updatedCycles);
            handleCloseModal();
        } catch (error) {
            setError("Erreur lors de l'ajout/modification du cycle");
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/cyclescolaires/${id}`);
            setCycles((prevCycles) => prevCycles.filter((cycle) => cycle.id !== id));
            setSuccess('Cycle supprimé avec succès!');
        } catch (error) {
            setError('Erreur lors de la suppression du cycle');
        }
    };

    const handleSelectCycle = (cycleId) => {
        setSelectedCycles((prevSelected) => {
            if (prevSelected.includes(cycleId)) {
                return prevSelected.filter(id => id !== cycleId);
            } else {
                return [...prevSelected, cycleId];
            }
        });
    };

    const handleSelectAllCycles = (event) => {
        if (event.target.checked) {
            setSelectedCycles(cycles.map(cycle => cycle.id));
        } else {
            setSelectedCycles([]);
        }
    };

    const filteredCycles = cycles.filter(cycle =>
        cycle.nomCycle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cycle.nomCycleArabe.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cycle.classement.toString().includes(searchTerm)
    );

    return (
        <>
            <nav>
                <Link to="/home" className="text-primary">Accueil</Link>
                <span> / Gestion des Cycles Scolaires</span>
            </nav>
            <div className="card card-primary card-outline">
                <div className="card-header d-flex" style={{ backgroundColor: '#F8F8F8' }}>
                    <img src={phase} alt="" width="90px" />
                    <p className="card-title mt-5 ml-2 p-2 text-center"
                        style={{ width: '350px', borderRadius: '50px', border: '1px solid rgb(215, 214, 216)' }}>
                        Gestion des Cycles Scolaires
                    </p>
                </div>
                <div className="card-body">
                    <div className="d-flex align-items-center gap-3 mb-3">
                        {/* Bouton Ajouter */}
                        <button className="btn btn-app p-1" onClick={handleShowModal}>
                            <img src={add} alt="" width="30px" /><br />
                            Ajouter
                        </button>

                        {/* Champ de recherche avec icône */}
                        <div className="input-group" style={{ maxWidth: '300px' }}>
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Rechercher une section"
                                className="form-control"
                                style={{ borderRadius: '8px', height: '50px', marginLeft: '20px', marginTop: '-10px' }}
                            />
                        </div>
                    </div>
                    <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                        <table className="table table-striped">
                            <thead>
                                <tr>
                                    <th>
                                        <input
                                            type="checkbox"
                                            onChange={handleSelectAllCycles}
                                            checked={selectedCycles.length === filteredCycles.length && filteredCycles.length > 0}
                                        />
                                    </th>
                                    <th>Classement</th>
                                    <th>Nom</th>
                                    <th>Nom en Arabe</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredCycles.map((cycle, index) => (
                                    <tr key={index}>
                                        <td>
                                            <input
                                                type="checkbox"
                                                checked={selectedCycles.includes(cycle.id)}
                                                onChange={() => handleSelectCycle(cycle.id)}
                                            />
                                        </td>
                                        <td>{cycle.classement}</td>
                                        <td>{cycle.nomCycle}</td>
                                        <td>{cycle.nomCycleArabe}</td>
                                        <td>
                                            <button className="btn btn-outline-success" onClick={() => handleEdit(cycle)}>
                                                <img src={editIcon} alt="Modifier" width="22px" />
                                            </button>
                                            &nbsp; &nbsp;
                                            <button className="btn btn-outline-danger" onClick={() => handleDelete(cycle.id)}>
                                                <img src={deleteIcon} alt="Supprimer" width="22px" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="text-center">
                        <p><strong>Total de lignes : </strong>{filteredCycles.length}</p>
                    </div>

                    {/* Pagination */}
                    <div className="text-center">
                        <button onClick={prevPage} className="btn btn-outline-primary">Précédent</button>
                        {paginationButtons}
                        <button onClick={nextPage} className="btn btn-outline-primary">Suivant</button>
                    </div>
                </div>
            </div>

            {/* Modal Bootstrap */}
            <div className={`modal fade ${showModal ? 'show' : ''}`} style={{ display: showModal ? 'block' : 'none' }} id="modal-cycle" tabIndex="-1" role="dialog" aria-labelledby="modalCycleLabel" aria-hidden={!showModal}>
                <div className="modal-dialog modal-custom" role="document">
                    <div className="modal-content modal-custom-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="modalCycleLabel">{selectedCycle ? "Modifier un Cycle" : "Ajouter un Cycle"}</h5>
                            <button type="button" className="close" onClick={handleCloseModal} aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            {error && <div className="alert alert-danger">{error}</div>}
                            {success && <div className="alert alert-success">{success}</div>}
                            <form onSubmit={handleSubmit}>
                                <div className="form-group">
                                    <input
                                        type="text"
                                        className="form-control input"
                                        value={classement}
                                        onChange={(e) => setClassement(e.target.value)}
                                        placeholder="Classement"
                                    />
                                </div>
                                <div className="form-group">
                                    <input
                                        type="text"
                                        className="form-control input"
                                        value={nomCycle}
                                        onChange={(e) => setNomCycle(e.target.value)}
                                        placeholder="Nom du Cycle"
                                    />
                                </div>
                                <div className="form-group">
                                    <input
                                        type="text"
                                        className="form-control input"
                                        value={nomCycleArabe}
                                        onChange={(e) => setNomCycleArabe(e.target.value)}
                                        placeholder="الاسم بالعربية"
                                    />
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>Fermer</button>
                                    <button type="submit" className="btn btn-primary">{selectedCycle ? "Modifier" : "Ajouter"}</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default CycleScolaire;