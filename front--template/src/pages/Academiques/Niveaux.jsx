import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import matiereIcon from '../../assets/imgs/niveaux.png';
import add from '../../assets/imgs/add.png';
import edite from '../../assets/imgs/edit.png';
import delet from '../../assets/imgs/archive.png';
import Select from 'react-select';
import './modal.css';

const Niveaux = () => {
    const [values, setValues] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [nomNiveau, setNomNiveau] = useState('');
    const [nomNiveauArabe, setNomNiveauArabe] = useState('');
    const [cycle, setCycle] = useState('');
    const [statutInscription, setStatutInscription] = useState('');
    const [selectedMatiere, setSelectedMatiere] = useState([]);
    const [niveaux, setNiveaux] = useState([]);
    const [matieres, setMatieres] = useState([]);
    const [cycles, setCycles] = useState([]);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [selectedNiveau, setSelectedNiveau] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedNiveaux, setSelectedNiveaux] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(15);
    const [ecoleId, setEcoleId] = useState(null);
    const [ecoleeId, setEcoleeId] = useState(null);
    const [matieresConfessions, setMatieresConfessions] = useState({});

    const fetchMatieres = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                console.error('Aucun token trouvé. Veuillez vous connecter.');
                return;
            }
            const response = await axios.get('http://localhost:5000/matieres', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setMatieres(response.data);
        } catch (error) {
            console.error('Erreur lors de la récupération des matières', error);
        }
    };

    const fetchNiveaux = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                console.error('Aucun token trouvé. Veuillez vous connecter.');
                return;
            }
            const response = await axios.get('http://localhost:5000/niveaux', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setNiveaux(response.data);
        } catch (error) {
            console.error('Erreur lors de la récupération des niveaux', error);
        }
    };

    useEffect(() => {
        fetchMatieres();
        fetchNiveaux();
    }, []);

    // Filtrer les niveaux en fonction de la recherche
    const filteredNiveaux = niveaux.filter(niveau =>
        niveau?.nomniveau?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        niveau?.nomniveuarab?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        niveau?.statutInscription?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Pagination basée sur les données filtrées
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredNiveaux.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredNiveaux.length / itemsPerPage);

    // Réinitialiser à la première page lors d'une nouvelle recherche
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm]);

    const nextPage = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };

    const prevPage = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    const handleShowModal = () => setShowModal(true);
    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedNiveau(null);
        setNomNiveau('');
        setNomNiveauArabe('');
        setCycle('');
        setStatutInscription('');
        setSelectedMatiere([]);
        setError('');
        setSuccess('');
    };

    // const handleEdit = async (niveau) => {
    //     setSelectedNiveau(niveau);
    //     setNomNiveau(niveau.nomniveau);
    //     setNomNiveauArabe(niveau.nomniveuarab);
    //     setCycle(niveau.cycle);
    //     setStatutInscription(niveau.statutInscription);

    //     try {
    //         const response = await axios.get(`http://localhost:5000/niveaux/${niveau.id}`);
    //         const niveauAvecMatieres = response.data;

    //         if (niveauAvecMatieres.Matieres && Array.isArray(niveauAvecMatieres.Matieres)) {
    //             const matièresSelected = niveauAvecMatieres.Matieres.map(matiere => ({
    //                 value: matiere.id,
    //                 label: matiere.nom,
    //             }));
    //             setSelectedMatiere(matièresSelected);
    //         } else {
    //             setSelectedMatiere([]);
    //         }
    //     } catch (error) {
    //         console.error("Erreur lors de la récupération des matières associées :", error);
    //         setSelectedMatiere([]);
    //     }

    //     handleShowModal();
    // };

    const handleEdit = async (niveau) => {
        setSelectedNiveau(niveau);
        setNomNiveau(niveau.nomniveau);
        setNomNiveauArabe(niveau.nomniveuarab);
        setCycle(niveau.cycle);
        setStatutInscription(niveau.statutInscription);

        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`http://localhost:5000/niveaux/${niveau.id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            const niveauAvecMatieres = response.data;

            if (niveauAvecMatieres.Matieres && Array.isArray(niveauAvecMatieres.Matieres)) {
                // Sélectionner les matières
                const matièresSelected = niveauAvecMatieres.Matieres.map(matiere => ({
                    value: matiere.id,
                    label: matiere.nom,
                }));
                setSelectedMatiere(matièresSelected);

                // Initialiser les confessions
                const confessionsInit = {};
                niveauAvecMatieres.Matieres.forEach(matiere => {
                    confessionsInit[matiere.id] = matiere.NiveauxMatieres.matieresConfessions || '';
                });
                setMatieresConfessions(confessionsInit);
            } else {
                setSelectedMatiere([]);
                setMatieresConfessions({});
            }

            handleShowModal();
        } catch (error) {
            console.error("Erreur lors de la récupération du niveau :", error);
            setError("Impossible de charger les données du niveau");
        }
    };


    // const handleSubmit = async (e) => {
    //     e.preventDefault();

    //     if (!nomNiveau || !cycle || !ecoleId) {
    //         setError('Tous les champs sont obligatoires, sauf ecoleeId qui peut être null.');
    //         return;
    //     }

    //     try {
    //         const token = localStorage.getItem('token');
    //         if (!token) {
    //             setError('Aucun token trouvé. Veuillez vous connecter.');
    //             return;
    //         }

    //         const niveauData = {
    //             nomniveau: nomNiveau,
    //             nomniveuarab: nomNiveauArabe,
    //             cycle: cycle,
    //             statutInscription: statutInscription,
    //             ecoleId: ecoleId,
    //             ecoleeId: ecoleeId === 'null' ? null : parseInt(ecoleeId, 10),
    //             niveauMatiere: selectedMatiere.map(matiere => matiere.value),
    //         };

    //         if (selectedNiveau) {
    //             await axios.put(
    //                 `http://localhost:5000/niveaux/${selectedNiveau.id}`,
    //                 niveauData,
    //                 { headers: { Authorization: `Bearer ${token}` } }
    //             );
    //             setSuccess('Niveau modifié avec succès!');
    //         } else {
    //             await axios.post(
    //                 'http://localhost:5000/niveaux',
    //                 niveauData,
    //                 { headers: { Authorization: `Bearer ${token}` } }
    //             );
    //             setSuccess('Niveau ajouté avec succès!');
    //         }

    //         await fetchNiveaux();
    //         handleCloseModal();
    //     } catch (error) {
    //         console.error("Erreur:", error);
    //         setError(error.response?.data?.message || "Erreur lors de l'opération");
    //     }
    // };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!nomNiveau || !cycle || !ecoleId) {
            setError('Tous les champs sont obligatoires, sauf ecoleeId qui peut être null.');
            return;
        }

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setError('Aucun token trouvé. Veuillez vous connecter.');
                return;
            }

            const niveauData = {
                nomniveau: nomNiveau,
                nomniveuarab: nomNiveauArabe,
                cycle: cycle,
                statutInscription: statutInscription,
                ecoleId: ecoleId,
                ecoleeId: ecoleeId === 'null' ? null : parseInt(ecoleeId, 10),
                niveauMatiere: selectedMatiere.map(matiere => matiere.value),
                matieresConfessions: matieresConfessions // Ajout des confessions
            };

            if (selectedNiveau) {
                await axios.put(
                    `http://localhost:5000/niveaux/modifier/${selectedNiveau.id}`,
                    niveauData,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                setSuccess('Niveau modifié avec succès!');
            } else {
                await axios.post(
                    'http://localhost:5000/niveaux',
                    niveauData,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                setSuccess('Niveau ajouté avec succès!');
            }

            await fetchNiveaux();
            handleCloseModal();
        } catch (error) {
            console.error("Erreur:", error);
            setError(error.response?.data?.message || "Erreur lors de l'opération");
        }
    };
    const handleConfessionChange = (matiereId, value) => {
        setMatieresConfessions(prev => ({
            ...prev,
            [matiereId]: value
        }));
    };
    const handleMatiereChange = (selectedOptions) => {
        setSelectedMatiere(selectedOptions);

        // Mettre à jour les confessions pour garder seulement celles des matières sélectionnées
        const newConfessions = {};
        selectedOptions.forEach(option => {
            newConfessions[option.value] = matieresConfessions[option.value] || '';
        });
        setMatieresConfessions(newConfessions);
    };
    const handleDelete = async (id) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setError('Aucun token trouvé. Veuillez vous connecter.');
                return;
            }

            await axios.delete(`http://localhost:5000/niveaux/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            await fetchNiveaux();
            setSuccess('Niveau supprimé avec succès!');
            setTimeout(() => setSuccess(''), 2000);
        } catch (error) {
            setError('Erreur lors de la suppression: ' + (error.response?.data?.message || error.message));
        }
    };

    const handleSelectNiveau = (niveauId) => {
        setSelectedNiveaux((prevSelected) => {
            if (prevSelected.includes(niveauId)) {
                return prevSelected.filter(id => id !== niveauId);
            } else {
                return [...prevSelected, niveauId];
            }
        });
    };

    const handleSelectAllNiveaux = (event) => {
        if (event.target.checked) {
            setSelectedNiveaux(filteredNiveaux.map(niveau => niveau.id));
        } else {
            setSelectedNiveaux([]);
        }
    };

    useEffect(() => {
        const fetchCycle = async () => {
            const token = localStorage.getItem("token");
            if (!token) return;

            try {
                if (ecoleeId && ecoleeId !== "null" && ecoleeId !== "undefined") {
                    const response = await axios.get(`http://localhost:5000/ecoles/${ecoleeId}`, {
                        headers: { Authorization: `Bearer ${token}` },
                    });
                    setCycle(response.data.cycle);
                    setCycles([{ id: ecoleeId, nomCycle: response.data.cycle }]);
                } else {
                    const response = await axios.get('http://localhost:5000/cyclescolaires', {
                        headers: { Authorization: `Bearer ${token}` },
                    });
                    setCycles(response.data);
                }
            } catch (error) {
                console.error("Erreur lors de la récupération des cycles :", error);
            }
        };

        fetchCycle();
    }, [ecoleeId]);

    useEffect(() => {
        if (cycle) {
            setValues((prevValues) => ({
                ...prevValues,
                cycle: cycle,
            }));
        }
    }, [cycle]);

    useEffect(() => {
        const storedEcoleId = localStorage.getItem("ecoleId");
        const storedEcoleeId = localStorage.getItem("ecoleeId");

        if (storedEcoleId) setEcoleId(storedEcoleId);
        if (storedEcoleeId) setEcoleeId(storedEcoleeId);
    }, []);

    return (
        <>
            <nav>
                <Link to="/dashboard" className="text-primary">Accueil</Link>
                <span> / </span>
                <span>Gestion des Niveaux</span>
            </nav>

            <div className="card card-primary card-outline">
                <div className="card-header d-flex" style={{ backgroundColor: '#F8F8F8' }}>
                    <img src={matiereIcon} alt="" width="90px" />
                    <p className="card-title mt-5 ml-2 p-2 text-center"
                        style={{ width: '350px', borderRadius: '50px', border: '1px solid rgb(215, 214, 216)' }}>
                        Gestion des Niveaux
                    </p>
                </div>

                <div className="card-body">
                    <div className="d-flex align-items-center gap-3 mb-3">
                        {error && <div className="alert alert-danger">{error}</div>}
                        {success && <div className="alert alert-success">{success}</div>}
                        <button className="btn btn-app p-1" onClick={handleShowModal}>
                            <img src={add} alt="" width="30px" /><br />
                            Ajouter
                        </button>

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
                                            onChange={handleSelectAllNiveaux}
                                            checked={selectedNiveaux.length === filteredNiveaux.length && filteredNiveaux.length > 0}
                                        />
                                    </th>
                                    <th>Nom</th>
                                    <th>Nom en Arabe</th>
                                    <th>Cycle</th>
                                    <th>Statut Inscription</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentItems.map((niveau, index) => (
                                    <tr key={index}>
                                        <td>
                                            <input
                                                type="checkbox"
                                                checked={selectedNiveaux.includes(niveau.id)}
                                                onChange={() => handleSelectNiveau(niveau.id)}
                                            />
                                        </td>
                                        <td>{niveau.nomniveau}</td>
                                        <td>{niveau.nomniveuarab}</td>
                                        <td>{niveau.cycle}</td>
                                        <td>{niveau.statutInscription}</td>
                                        <td>
                                            <button
                                                className="btn btn-outline-success"
                                                onClick={() => handleEdit(niveau)}>
                                                <img src={edite} alt="modifier" width="22px" />
                                            </button>
                                            &nbsp; &nbsp; &nbsp;
                                            <button
                                                className="btn btn-outline-danger"
                                                onClick={() => handleDelete(niveau.id)}>
                                                <img src={delet} alt="supprimer" width="22px" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="text-center">
                        <p><strong>Total de lignes : </strong>{filteredNiveaux.length}</p>
                    </div>

                    <div className="text-center">
                        <button
                            onClick={prevPage}
                            disabled={currentPage === 1}
                            className="btn btn-outline-primary"
                        >
                            Précédent
                        </button>

                        {Array.from({ length: totalPages }, (_, i) => (
                            <button
                                key={i + 1}
                                onClick={() => setCurrentPage(i + 1)}
                                className={`btn btn-outline-primary ${currentPage === i + 1 ? 'active' : ''}`}
                            >
                                {i + 1}
                            </button>
                        ))}

                        <button
                            onClick={nextPage}
                            disabled={currentPage === totalPages}
                            className="btn btn-outline-primary"
                        >
                            Suivant
                        </button>
                    </div>
                </div>
            </div>

            {/* Modal Bootstrap */}
            <div className={`modal fade ${showModal ? 'show' : ''}`} style={{ display: showModal ? 'block' : 'none' }} id="modal-niveau" tabIndex="-1" role="dialog" aria-labelledby="modalNiveauLabel" aria-hidden={!showModal}>
                <div className="modal-dialog modal-custom" role="document">
                    <div className="modal-content modal-custom-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="modalNiveauLabel">{selectedNiveau ? 'Modifier un Niveau' : 'Ajouter un Niveau'}</h5>
                            <button type="button" className="close" onClick={handleCloseModal} aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body overflow-auto" style={{ maxHeight: '60vh' }}>
                            <form onSubmit={handleSubmit}>
                                <div className="form-group">
                                    <input
                                        type="hidden"
                                        className="form-control input"
                                        value={ecoleId || ''}
                                        readOnly
                                    />
                                    <input
                                        type="hidden"
                                        className="form-control input"
                                        value={ecoleeId || ''}
                                        readOnly
                                    />
                                    <input
                                        type="text"
                                        className="form-control input"
                                        value={nomNiveau}
                                        onChange={(e) => setNomNiveau(e.target.value)}
                                        placeholder="Nom du niveau"
                                    />
                                </div>
                                <div className="form-group">
                                    <input
                                        type="text"
                                        className="form-control input"
                                        value={nomNiveauArabe}
                                        onChange={(e) => setNomNiveauArabe(e.target.value)}
                                        placeholder="الاسم المستوى بالعربية"
                                    />
                                </div>

                                <div className="form-group">
                                    <select
                                        className="form-control input"
                                        name="cycle"
                                        value={cycle}
                                        onChange={(e) => setCycle(e.target.value)}
                                    >
                                        <option value="">Sélectionner un cycle</option>
                                        {cycles.map((cycle) => (
                                            <option key={cycle.id} value={cycle.nomCycle}>
                                                {cycle.nomCycle}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <select
                                        className="form-control input"
                                        value={statutInscription}
                                        onChange={(e) => setStatutInscription(e.target.value)}
                                        placeholder="Statut Inscription"
                                    >
                                        <option value="">Sélectionner un statut</option>
                                        <option value="Ouvert">Ouvert</option>
                                        <option value="Fermer">Fermer</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <Select
                                        isMulti
                                        classNamePrefix="react-select"
                                        options={matieres.map(matiere => ({
                                            value: matiere.id,
                                            label: matiere.nom,
                                        }))}
                                        value={selectedMatiere}
                                        onChange={setSelectedMatiere}
                                        placeholder="Sélectionner les matières"
                                        menuPortalTarget={document.body}  // Important pour le positionnement
                                        menuPosition="fixed"  // Position fixe pour éviter les problèmes de scroll
                                        closeMenuOnSelect={false}  // Permet de garder le menu ouvert
                                        hideSelectedOptions={false}  // Affiche les options sélectionnées
                                        styles={{
                                            container: (base) => ({
                                                ...base,
                                                width: '90%',  // Prend toute la largeur disponible
                                                marginLeft: '60px',
                                            }),
                                            control: (base, state) => ({
                                                ...base,
                                                backgroundColor: '#F0F2F8',
                                                borderRadius: '50px',
                                                margin: '10px 0',
                                                padding: '2px 10px',
                                                boxShadow: state.isFocused ? '0 0 0 2px rgba(90, 203, 207, 0.5)' : '2px 2px 8px rgba(0, 0, 0, 0.1)',
                                                minHeight: '50px',
                                                borderColor: state.isFocused ? '#5ACBCF' : '#ced4da',
                                                '&:hover': {
                                                    borderColor: '#5ACBCF'
                                                },
                                            }),
                                            valueContainer: (base) => ({
                                                ...base,
                                                flexWrap: 'nowrap',  // Empêche le retour à la ligne
                                                overflowX: 'auto',  // Permet le scroll horizontal
                                                maxWidth: '90%',
                                            }),
                                            multiValue: (base) => ({
                                                ...base,
                                                backgroundColor: '#5ACBCF',
                                                borderRadius: '10px',
                                                flexShrink: 0,  // Empêche la réduction des éléments
                                            }),
                                            multiValueLabel: (base) => ({
                                                ...base,
                                                color: 'white',
                                                padding: '2px 6px',
                                            }),
                                            multiValueRemove: (base) => ({
                                                ...base,
                                                color: 'white',
                                                ':hover': {
                                                    backgroundColor: '#dc3545',
                                                    color: 'white',
                                                },
                                            }),
                                            menuPortal: base => ({ ...base, zIndex: 9999 }),
                                            menu: base => ({
                                                ...base,
                                                zIndex: 9999,
                                                width: 'auto',  // S'adapte au contenu
                                                minWidth: '100%',  // Au moins la largeur du contrôle
                                            }),
                                            menuList: base => ({
                                                ...base,
                                                maxHeight: '200px',
                                            }),
                                            placeholder: (base) => ({
                                                ...base,
                                                color: '#A9A9A9',
                                            }),
                                            input: (base) => ({
                                                ...base,
                                                color: '#333',
                                                width: 'auto !important',  // Permet à l'input de s'adapter
                                            }),
                                        }}
                                        components={{
                                            DropdownIndicator: null  // Cache la flèche du dropdown
                                        }}
                                    />
                                </div>
                                {/* Dans la modal, après le Select des matières, ajoutez ce tableau */}
                                <div className="form-group ml-2 scrollable-table">
                                    <table className="table table-bordered">
                                        <thead>
                                            <tr>
                                                <th>Matière</th>
                                                <th>Confession</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {selectedMatiere.map(matiere => (
                                                <tr key={matiere.value}>
                                                    <td>{matiere.label}</td>
                                                    <td>
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            value={matieresConfessions[matiere.value] || ''}
                                                            onChange={(e) => handleConfessionChange(matiere.value, e.target.value)}
                                                            placeholder="Entrez la confession"
                                                        />
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>Fermer</button>
                                    <button type="submit" className="btn btn-primary">{selectedNiveau ? "Modifier" : "Ajouter"}</button>
                                </div>
                            </form>
                        </div>

                    </div>
                </div>
            </div>
        </>
    );
};

export default Niveaux;