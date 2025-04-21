import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import add from '../../assets/imgs/add.png';
import edit from '../../assets/imgs/edit.png';
import delet from '../../assets/imgs/delete.png';
import matiereIcon from '../../assets/imgs/section.png';
import './modal.css';

const Section = () => {
    const [showModal, setShowModal] = useState(false);
    const [selectedSections, setSelectedSections] = useState([]);
    const [sections, setSections] = useState([]);
    const [filteredSections, setFilteredSections] = useState([]);
    const [niveaux, setNiveaux] = useState([]);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [selectedSection, setSelectedSection] = useState(null);
    const [classe, setClasse] = useState('');
    const [classearab, setClassearab] = useState('');
    const [niveaunum, setNiveaunum] = useState('');
    const [numregime, setNumregime] = useState('');
    const [niveauxId, setNiveauxId] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(5);
    const [ecoleId, setEcoleId] = useState(null);
    const [ecoleeId, setEcoleeId] = useState(null);

    useEffect(() => {
        const filtered = sections.filter(section => {
            const niveau = niveaux.find(n => n.id === section.niveauxId);
            return (
                section.classe.toLowerCase().includes(searchTerm.toLowerCase()) ||
                section.classearab.toLowerCase().includes(searchTerm.toLowerCase()) ||
                section.niveaunum.toLowerCase().includes(searchTerm.toLowerCase()) ||
                section.numregime.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (niveau?.nomniveau.toLowerCase().includes(searchTerm.toLowerCase()))
            );
        });
        setFilteredSections(filtered);
        setCurrentPage(1); // Reset à la première page lors du filtrage
    }, [searchTerm, sections, niveaux]);

    const fetchSections = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) throw new Error('Aucun token trouvé. Veuillez vous connecter.');

            const response = await axios.get('http://localhost:5000/sections', {
                headers: { Authorization: `Bearer ${token}` },
            });

            setSections(response.data);
            setFilteredSections(response.data);
        } catch (error) {
            console.error('Erreur lors de la récupération des sections', error);
        }
    };
    useEffect(() => {
        const fetchNiveaux = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) throw new Error('Aucun token trouvé. Veuillez vous connecter.');

                const response = await axios.get('http://localhost:5000/niveaux', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setNiveaux(response.data);
            } catch (error) {
                console.error('Erreur lors de la récupération des niveaux', error);
            }
        };

        fetchSections();
        fetchNiveaux();
    }, []);

    const handleShowModal = () => setShowModal(true);
    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedSection(null);
        setClasse('');
        setClassearab('');
        setNiveaunum('');
        setNumregime('');
        setNiveauxId('');
        setError('');
        setSuccess('');
    };

    const handleEdit = (section) => {
        setSelectedSection(section);
        setClasse(section.classe);
        setClassearab(section.classearab);
        setNiveaunum(section.niveaunum);
        setNumregime(section.numregime);
        setNiveauxId(section.niveauxId);
        handleShowModal();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!classe || !niveauxId || !ecoleId) {
            setError('Tous les champs sont obligatoires');
            return;
        }

        try {
            const token = localStorage.getItem('token');
            if (!token) throw new Error('Aucun token trouvé');

            const data = {
                classe,
                classearab,
                niveaunum,
                numregime,
                niveauxId,
                ecoleId,
                ecoleeId: ecoleeId === "null" ? null : ecoleeId,
            };

            if (selectedSection) {
                await axios.put(
                    `http://localhost:5000/sections/${selectedSection.id}`,
                    data,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                setSuccess('Section modifiée avec succès!');
            } else {
                await axios.post(
                    'http://localhost:5000/sections',
                    data,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                setSuccess('Section ajoutée avec succès!');
            }

            // Recharger les données après l'opération
            await fetchSections();

            // Réinitialisation et fermeture
            setClasse('');
            setClassearab('');
            setNiveaunum('');
            setNumregime('');
            setNiveauxId('');
            setError('');
            handleCloseModal();

        } catch (error) {
            setError(error.response?.data?.message || "Erreur lors de l'opération");
            console.error("Erreur:", error);
        }
    };

    const handleDelete = async (id) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) throw new Error('Aucun token trouvé');

            await axios.delete(`http://localhost:5000/sections/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            // Recharger les données après suppression
            await fetchSections();
            setSuccess('Section supprimée avec succès!');

            setTimeout(() => setSuccess(''), 2000);

        } catch (error) {
            setError(error.response?.data?.message || "Erreur de suppression");
        }
    };

    const handleSelectAll = (event) => {
        if (event.target.checked) {
            setSelectedSections(filteredSections.map(section => section.id));
        } else {
            setSelectedSections([]);
        }
    };

    const handleSelect = (id) => {
        setSelectedSections((prevSelected) => {
            if (prevSelected.includes(id)) {
                return prevSelected.filter(sectionId => sectionId !== id);
            } else {
                return [...prevSelected, id];
            }
        });
    };
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = niveaux.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(niveaux.length / itemsPerPage);

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
    return (
        <>
            <nav>
                <Link to="/dashboard" className="text-primary">Accueil</Link>
                <span> / </span>
                <span>Gestion des Classes</span>
            </nav>
            <div className="card card-primary card-outline">
                <div className="card-header d-flex" style={{ backgroundColor: '#F8F8F8' }}>
                    <img src={matiereIcon} alt="" width="90px" />
                    <p className="card-title mt-5 ml-2 p-2 text-center"
                        style={{ width: '350px', borderRadius: '50px', border: '1px solid rgb(215, 214, 216)' }}>
                        Gestion des classes
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
                                placeholder="Rechercher une classe"
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
                                            onChange={handleSelectAll}
                                            checked={selectedSections.length === filteredSections.length && filteredSections.length > 0}
                                        />
                                    </th>
                                    <th>Niveau</th>
                                    <th>Classe</th>
                                    <th>Classe (Arabe)</th>
                                    <th>Niveau Num</th>
                                    <th>Numéro de Régime</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                
                                {filteredSections.map((section, index) => (
                                    <tr key={index}>
                                        <td>
                                            <input
                                                type="checkbox"
                                                checked={selectedSections.includes(section.id)}
                                                onChange={() => handleSelect(section.id)}
                                            />
                                        </td>
                                        <td>{niveaux.find(niveau => niveau.id === section.niveauxId)?.nomniveau || 'N/A'}</td>
                                        <td>{section.classe}</td>
                                        <td>{section.classearab}</td>
                                        <td>{section.niveaunum}</td>
                                        <td>{section.numregime}</td>
                                        <td>
                                            <button
                                                className="btn btn-outline-success"
                                                onClick={() => handleEdit(section)}
                                            >
                                                <img src={edit} alt="modifier" width="22px" title="Modifier" />
                                            </button>
                                            &nbsp; &nbsp; &nbsp;
                                            <button
                                                className="btn btn-outline-danger"
                                                onClick={() => handleDelete(section.id)}
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
                        <p>Total Classes: {filteredSections.length}</p>
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

                    {/* Modal Bootstrap classique */}
                    <div className={`modal fade ${showModal ? 'show' : ''}`} style={{ display: showModal ? 'block' : 'none' }} id="modal-section" tabIndex="-1" role="dialog" aria-labelledby="modalSectionLabel" aria-hidden={!showModal}>
                        <div className="modal-dialog modal-custom" role="document">
                            <div className="modal-content modal-custom-content">
                                <div className="modal-header">
                                    <h5 className="modal-title" id="modalSectionLabel">{selectedSection ? 'Modifier une Classe' : 'Ajouter une Classe'}</h5>
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
                                        </div>
                                        <div className="form-group">
                                            <input
                                                type="text"
                                                value={classe}
                                                onChange={(e) => setClasse(e.target.value)}
                                                placeholder="Classe"
                                                className="form-control input"
                                            />
                                        </div>

                                        <div className="form-group">
                                            <input
                                                type="text"
                                                value={classearab}
                                                onChange={(e) => setClassearab(e.target.value)}
                                                placeholder="Classe en arabe"
                                                className="form-control input"
                                            />
                                        </div>

                                        <div className="form-group">
                                            <select
                                                value={niveauxId}
                                                onChange={(e) => setNiveauxId(e.target.value)}
                                                className="form-control input"
                                            >
                                                <option value="">Sélectionnez un niveau</option>
                                                {niveaux.map((niveau) => (
                                                    <option key={niveau.id} value={niveau.id}>
                                                        {niveau.nomniveau}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className="form-group">
                                            <select
                                                value={niveaunum}
                                                onChange={(e) => setNiveaunum(e.target.value)}
                                                className="form-control input"
                                            >
                                                <option value="">Sélectionner un niveau</option>
                                                <option value="تحضيري">تحضيري</option>
                                                <option value="أولى ابتدائي">أولى ابتدائي</option>
                                                <option value="ثانية ابتدائي">ثانية ابتدائي</option>
                                                <option value="ثالثة ابتدائي">ثالثة ابتدائي</option>
                                                <option value="رابعة ابتدائي">رابعة ابتدائي</option>
                                                <option value="خامسة ابتدائي">خامسة ابتدائي</option>
                                                <option value="أولى متوسط">أولى متوسط</option>
                                                <option value="ثانية متوسط">ثانية متوسط</option>
                                                <option value="ثالثة متوسط">ثالثة متوسط</option>
                                                <option value="رابعة متوسط">رابعة متوسط</option>
                                                <option value="أولى ثانوي جدع مشترك علوم وتكنولوجيا">أولى ثانوي جدع مشترك علوم وتكنولوجيا</option>
                                                <option value="أولى ثانوي جدع مشترك آداب">أولى ثانوي جدع مشترك آداب</option>
                                                <option value="ثانية ثانوي تسيير واقتصاد">ثانية ثانوي تسيير واقتصاد</option>
                                                <option value="ثانية ثانوي علوم تجريبية">ثانية ثانوي علوم تجريبية</option>
                                                <option value="ثانية ثانوي لغات أجنبية">ثانية ثانوي لغات أجنبية</option>
                                                <option value="ثانية ثانوي تقني رياضي">ثانية ثانوي تقني رياضي</option>
                                                <option value="ثانية ثانوي رياضيات">ثانية ثانوي رياضيات</option>
                                                <option value="ثانية ثانوي آداب وفلسفة">ثانية ثانوي آداب وفلسفة</option>
                                                <option value="ثالثة ثانوي تسيير واقتصاد">ثالثة ثانوي تسيير واقتصاد</option>
                                                <option value="ثالثة ثانوي علوم تجريبية">ثالثة ثانوي علوم تجريبية</option>
                                                <option value="ثالثة ثانوي لغات أجنبية">ثالثة ثانوي لغات أجنبية</option>
                                                <option value="ثالثة ثانوي تقني رياضي">ثالثة ثانوي تقني رياضي</option>
                                                <option value="ثالثة ثانوي رياضيات">ثالثة ثانوي رياضيات</option>
                                                <option value="ثالثة ثانوي آداب وفلسفة">ثالثة ثانوي آداب وفلسفة</option>
                                            </select>
                                        </div>

                                        <div className="form-group">
                                            <input
                                                type="text"
                                                value={numregime}
                                                onChange={(e) => setNumregime(e.target.value)}
                                                placeholder="Numéro de régimement/ الفوج"
                                                className="form-control input"
                                            />
                                        </div>

                                        {error && <p className="text-danger">{error}</p>}
                                        {success && <p className="text-success">{success}</p>}
                                        <div className="modal-footer">
                                            <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>
                                                Fermer
                                            </button>
                                            <button type="submit" className="btn btn-primary">
                                                {selectedSection ? 'Modifier' : 'Ajouter'}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Section;