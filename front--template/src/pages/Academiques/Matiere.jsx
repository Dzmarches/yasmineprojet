import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Select from 'react-select';
import matiere from '../../assets/imgs/matiere.png';
import arabeIcon from '../../assets/imgs/arabe.png';
import mathsIcon from '../../assets/imgs/math.png';
import sportIcon from '../../assets/imgs/running.png';
import scienceIslamiqueIcon from '../../assets/imgs/islam.png';
import anglaisIcon from '../../assets/imgs/en.png';
import francaisIcon from '../../assets/imgs/français.png';
import scienceIcon from '../../assets/imgs/science.png';
import histoireIcon from '../../assets/imgs/education.png';
import geographieIcon from '../../assets/imgs/globe.png';
import tamazightIcon from '../../assets/imgs/tamazight.jpg';
import add from '../../assets/imgs/add.png';
import edite from '../../assets/imgs/edit.png';
import delet from '../../assets/imgs/archive.png';
import axios from 'axios';

const Matiere = () => {
    const [values, setValues] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [nomMatiere, setNomMatiere] = useState('');
    const [nomMatiereArabe, setNomMatiereArabe] = useState('');
    const [selectedImage, setSelectedImage] = useState(null);
    const [matieres, setMatieres] = useState([]);
    const [filteredMatieres, setFilteredMatieres] = useState([]);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [selectedMatiere, setSelectedMatiere] = useState(null);
    const [currentPage, setCurrentPage] = useState(1); const [itemsPerPage] = useState(5);
    const [searchTerm, setSearchTerm] = useState('');
    const [cycle, setCycle] = useState('');
    const [ecoleId, setEcoleId] = useState(null);
    const [ecoleeId, setEcoleeId] = useState(null);

    useEffect(() => {
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
                setFilteredMatieres(response.data);
            } catch (error) {
                console.error('Erreur lors de la récupération des matières', error);
            }
        };

        fetchMatieres();
    }, []);


    useEffect(() => {
        const filtered = matieres.filter(matiere =>
            matiere.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
            matiere.nomarabe.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredMatieres(filtered);
    }, [searchTerm, matieres]);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredMatieres.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredMatieres.length / itemsPerPage);

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

    const handleShowModal = () => setShowModal(true);
    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedMatiere(null);
        setNomMatiere('');
        setNomMatiereArabe('');
        setSelectedImage(null);
        setError('');
        setSuccess('');
    };

    const handleEdit = (matiere) => {
        setSelectedMatiere(matiere);
        setNomMatiere(matiere.nom);
        setNomMatiereArabe(matiere.nomarabe);
        setSelectedImage(imageOptions.find(option => option.value === matiere.image.split('.')[0]));
        handleShowModal();
    };

    const imageOptions = [
        { value: 'arabe', label: 'Arabe', icon: arabeIcon },
        { value: 'maths', label: 'Maths', icon: mathsIcon },
        { value: 'science-islamique', label: 'Science Islamique', icon: scienceIslamiqueIcon },
        { value: 'anglais', label: 'Anglais', icon: anglaisIcon },
        { value: 'francais', label: 'Français', icon: francaisIcon },
        { value: 'science', label: 'Science', icon: scienceIcon },
        { value: 'histoire', label: 'Histoire', icon: histoireIcon },
        { value: 'geographie', label: 'Géographie', icon: geographieIcon },
        { value: 'sport', label: 'Sport', icon: sportIcon },
        { value: 'tamazight', label: 'Tamazight', icon: tamazightIcon },
    ];

    const formatOptionLabel = ({ label, icon }) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
            <img src={icon} alt={label} style={{ width: '20px', marginRight: '10px' }} />
            {label}
        </div>
    );

    // const handleSubmit = async (e) => {
    //     e.preventDefault();

    //     // Convertir ecoleeId en null si c'est la chaîne "null"
    //     const ecoleeIdFinal = ecoleeId === "null" ? null : ecoleeId;

    //     if (!nomMatiere || !nomMatiereArabe || !selectedImage || !ecoleId) {
    //         setError('Tous les champs sont obligatoires');
    //         return;
    //     }

    //     try {
    //         const token = localStorage.getItem('token');
    //         if (!token) {
    //             console.error('Aucun token trouvé. Veuillez vous connecter.');
    //             return;
    //         }

    //         // Créer un objet FormData pour envoyer les fichiers
    //         const formData = new FormData();
    //         formData.append('nom', nomMatiere);
    //         formData.append('nomarabe', nomMatiereArabe);
    //         formData.append('ecoleId', ecoleId);
    //         formData.append('ecoleeId', ecoleeIdFinal);

    //         // Ajouter l'image sélectionnée
    //         if (selectedImage) {
    //             formData.append('image', selectedImage); // Assurez-vous que selectedImage est un fichier
    //         }

    //         const config = {
    //             headers: {
    //                 Authorization: `Bearer ${token}`,
    //                 'Content-Type': 'multipart/form-data', // Important pour les fichiers
    //             },
    //         };

    //         // Afficher les données envoyées
    //         console.log("Données envoyées au serveur :", {
    //             nom: nomMatiere,
    //             nomarabe: nomMatiereArabe,
    //             image: selectedImage ? selectedImage.name : null,
    //             ecoleId,
    //             ecoleeId: ecoleeIdFinal,
    //         });

    //         let response;
    //         if (selectedMatiere) {
    //             response = await axios.put(
    //                 `http://localhost:5000/matieres/${selectedMatiere.id}`,
    //                 formData,
    //                 config
    //             );

    //             // Afficher la réponse du serveur
    //             console.log("Réponse du serveur (modification) :", response.data);

    //             setMatieres(matieres.map((matiere) =>
    //                 matiere.id === selectedMatiere.id ? response.data.matiere : matiere
    //             ));

    //             setSuccess('Matière modifiée avec succès!');
    //         } else {
    //             response = await axios.post(
    //                 'http://localhost:5000/matieres',
    //                 formData,
    //                 config
    //             );

    //             // Afficher la réponse du serveur
    //             console.log("Réponse du serveur (ajout) :", response.data);

    //             setMatieres([...matieres, response.data.matiere]);
    //             setSuccess('Matière ajoutée avec succès!');
    //         }

    //         // Réinitialiser le formulaire
    //         setNomMatiere('');
    //         setNomMatiereArabe('');
    //         setSelectedImage(null);
    //         setEcoleId('');
    //         setEcoleeId('');
    //         setError('');
    //         handleCloseModal();
    //     } catch (error) {
    //         setSuccess('');
    //         setError("Erreur lors de l'ajout/modification de la matière");

    //         // Afficher l'erreur détaillée
    //         console.error("Erreur lors de la requête :", error.response ? error.response.data : error.message);
    //     }
    // };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!nomMatiere) { // Seul le nom est obligatoire comme vous le souhaitez
            setError('Le nom de la matière est obligatoire');
            return;
        }

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                console.error('Aucun token trouvé. Veuillez vous connecter.');
                return;
            }

            const formData = new FormData();
            formData.append('nom', nomMatiere);
            if (nomMatiereArabe) formData.append('nomarabe', nomMatiereArabe);
            if (ecoleId) formData.append('ecoleId', ecoleId);
            if (ecoleeId && ecoleeId !== "null") formData.append('ecoleeId', ecoleeId);
            if (selectedImage) formData.append('image', selectedImage);

            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            };

            let response;
            if (selectedMatiere) {
                // Modification
                response = await axios.put(
                    `http://localhost:5000/matieres/${selectedMatiere.id}`,
                    formData,
                    config
                );

                // Mise à jour optimiste de l'état
                setMatieres(prevMatieres =>
                    prevMatieres.map(m =>
                        m.id === selectedMatiere.id ? response.data.matiere : m
                    )
                );
                setSuccess('Matière modifiée avec succès!');
            } else {
                // Ajout
                response = await axios.post(
                    'http://localhost:5000/matieres',
                    formData,
                    config
                );

                // Mise à jour optimiste de l'état
                setMatieres(prevMatieres => [...prevMatieres, response.data.matiere]);
                setSuccess('Matière ajoutée avec succès!');
            }

            // Réinitialisation complète
            setNomMatiere('');
            setNomMatiereArabe('');
            setSelectedImage(null);
            setError('');

            // Fermeture du modal après un court délai pour voir le message de succès
            setTimeout(handleCloseModal, 1000);

        } catch (error) {
            setSuccess('');
            setError(error.response?.data?.message || "Erreur lors de l'opération");
            console.error("Erreur:", error);
        }
    };
    const handleDelete = async (id) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                console.error('Aucun token trouvé. Veuillez vous connecter.');
                return;
            }
            const response = await axios.delete(`http://localhost:5000/matieres/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setMatieres(matieres.filter((matiere) => matiere.id !== id));
            setSuccess(response.data.message);
        } catch (error) {
            setError('Erreur lors de la suppression de la matière');
        }
    };

    const [selectedMatieresIds, setSelectedMatieresIds] = useState([]);
    const [selectAll, setSelectAll] = useState(false);

    const handleSelectAll = () => {
        if (selectAll) {
            setSelectedMatieresIds([]);
        } else {
            setSelectedMatieresIds(filteredMatieres.map((matiere) => matiere.id));
        }
        setSelectAll(!selectAll);
    };

    const handleSelect = (id) => {
        setSelectedMatieresIds((prevSelected) => {
            if (prevSelected.includes(id)) {
                return prevSelected.filter((matiereId) => matiereId !== id);
            } else {
                return [...prevSelected, id];
            }
        });
    };

    useEffect(() => {
        if (ecoleeId) {
            const fetchCycle = async () => {
                const token = localStorage.getItem("token");
                if (!token) {
                    console.error("❌ Aucun token trouvé !");
                    return;
                }

                try {
                    console.log(`🔍 Récupération du cycle pour l'ecoleeId: ${ecoleeId}`);
                    const response = await axios.get(`http://localhost:5000/ecoles/${ecoleeId}`, { // Correction ici
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });

                    console.log("✅ Cycle récupéré :", response.data.cycle);
                    setCycle(response.data.cycle);
                } catch (error) {
                    console.error("❌ Erreur lors de la récupération du cycle :", error);
                }
            };

            fetchCycle();
        }
    }, [ecoleeId]); // Dépendance pour exécuter lorsque ecoleeId est défini
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

        if (storedEcoleId) {
            setEcoleId(storedEcoleId);
        }
        if (storedEcoleeId) {
            setEcoleeId(storedEcoleeId);
        }
    }, []);

    const handleImageChange = async (selectedOption) => {
        if (selectedOption) {
            // Convertir l'icône sélectionnée en fichier
            const response = await fetch(selectedOption.icon);
            const blob = await response.blob();
            const file = new File([blob], `${selectedOption.value}.png`, { type: 'image/png' });

            setSelectedImage(file);
        } else {
            setSelectedImage(null);
        }
    };

    return (
        <>
            <nav>
                <Link to="/dashboard" className="text-primary">Accueil</Link>
                <span> / </span>
                <span>Gestion des Matières</span>
            </nav>
            <div className="card card-primary card-outline">
                <div className="card-header d-flex" style={{ backgroundColor: '#F8F8F8' }}>
                    <img src={matiere} alt="" width="90px" />
                    <p className="card-title mt-5 ml-2 p-2 text-center"
                        style={{ width: '350px', borderRadius: '50px', border: '1px solid rgb(215, 214, 216)' }}>
                        Gestion des Matières
                    </p>
                </div>
                <div className="card-body">
                    <div className="d-flex align-items-center gap-3 mb-3">
                        {error && <div className="alert alert-danger">{error}</div>}
                        {success && <div className="alert alert-success">{success}</div>}
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
                                            checked={selectAll}
                                            onChange={handleSelectAll}
                                        />
                                    </th>
                                    <th>Nom</th>
                                    <th>Nom en Arabe</th>
                                    <th>Icône</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentItems.map((matiere, index) => (
                                    <tr key={index}>
                                        <td>
                                            <input
                                                type="checkbox"
                                                checked={selectedMatieresIds.includes(matiere.id)}
                                                onChange={() => handleSelect(matiere.id)}
                                            />
                                        </td>
                                        <td>{matiere.nom}</td>
                                        <td>{matiere.nomarabe}</td>
                                        <td>
                                            <img
                                                src={`http://localhost:5000/images/matiere/${matiere.image}`}
                                                alt={matiere.image}
                                                width="30"
                                            />
                                        </td>
                                        <td>
                                            <button
                                                className="btn btn-outline-success"
                                                onClick={() => handleEdit(matiere)}
                                            >
                                                <img src={edite} alt="modifier" width="22px" title="Modifier" />
                                            </button>
                                            &nbsp; &nbsp; &nbsp;
                                            <button
                                                className="btn btn-outline-danger"
                                                onClick={() => handleDelete(matiere.id)}
                                            >
                                                <img src={delet} alt="supprimer" width="22px" title="Supprimer" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="text-center">
                        <p><strong>Total de lignes : </strong>{filteredMatieres.length}</p>
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
            {/* Modal Bootstrap classique */}
            {/* Modal Bootstrap classique */}
            <div className={`modal fade ${showModal ? 'show' : ''}`} style={{ display: showModal ? 'block' : 'none' }} id="modal-matiere" tabIndex="-1" role="dialog" aria-labelledby="modalMatiereLabel" aria-hidden={!showModal}>
                <div className="modal-dialog modal-custom" role="document">
                    <div className="modal-content modal-custom-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="modalMatiereLabel">{selectedMatiere ? 'Modifier une Matière' : 'Ajouter une Matière'}</h5>
                            <button type="button" className="close" onClick={handleCloseModal} aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">

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
                                        value={nomMatiere}
                                        onChange={(e) => setNomMatiere(e.target.value)}
                                        placeholder="Nom de la matière"
                                    />
                                </div>
                                <div className="form-group">
                                    <input
                                        type="text"
                                        className="form-control input"
                                        value={nomMatiereArabe}
                                        onChange={(e) => setNomMatiereArabe(e.target.value)}
                                        placeholder="الاسم المادة بالعربية"
                                    />
                                </div>
                                <div className="form-group">
                                    <Select
                                        options={imageOptions}
                                        value={selectedImage ? imageOptions.find(option => option.value === selectedImage.name.split('.')[0]) : null}
                                        onChange={handleImageChange}
                                        getOptionLabel={formatOptionLabel}
                                        placeholder="Icône de la matière"
                                        menuPortalTarget={document.body} // Ceci rend le menu en dehors de la modal
                                        menuPosition="fixed" // Position fixe pour éviter les problèmes de défilement
                                        styles={{
                                            container: (base) => ({
                                                ...base,
                                                width: '90%',
                                                marginLeft: '60px',
                                            }),
                                            control: (base) => ({
                                                ...base,
                                                backgroundColor: '#F0F2F8',
                                                borderRadius: '50px',
                                                margin: '10px 0',
                                                padding: '5px',
                                                boxShadow: '2px 2px 8px rgba(0, 0, 0, 0.1)',
                                                height: '50px',
                                            }),
                                            menuPortal: base => ({ ...base, zIndex: 9999 }), // S'assurer que le menu est au-dessus de tout
                                            menu: base => ({
                                                ...base,
                                                zIndex: 9999,
                                                maxHeight: '300px', // Hauteur maximale du menu
                                            }),
                                            menuList: base => ({
                                                ...base,
                                                maxHeight: '300px',
                                                padding: 0,
                                            }),
                                            option: (base, { isFocused }) => ({
                                                ...base,
                                                backgroundColor: isFocused ? '#e9ecef' : 'white',
                                                color: '#333',
                                            }),
                                        }}
                                    />
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>
                                        Fermer
                                    </button>
                                    <button type="submit" className="btn btn-primary">
                                        {selectedMatiere ? 'Modifier' : 'Ajouter'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Matiere;