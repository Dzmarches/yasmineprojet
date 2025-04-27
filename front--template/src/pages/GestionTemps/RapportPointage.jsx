import React, { useEffect, useState } from 'react';
import exportIcon from '../../assets/imgs/excel.png';
import printIcon from '../../assets/imgs/printer.png';
import { Link } from 'react-router-dom';
import Select from 'react-select';
import axios from 'axios';
import moment from 'moment';
import * as XLSX from 'xlsx';
import { Modal, Button, Form } from 'react-bootstrap';
import Cart from './pointageLocalisation/Cart';
import recherche from '../../assets/imgs/recherche.png';

const RapportPointage = () => {
    const [employees, setEmployees] = useState([]);
    const [selectedEmployees, setSelectedEmployees] = useState([]); // Stocker plusieurs employés sélectionnés
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [allPointages, setAllPointages] = useState([]); // Stocker tous les pointages
    const [filteredPointages, setFilteredPointages] = useState([]); // Pointages filtrés
    const [EcolePosition, setEcolePosition] = useState([]);
    const [adresseclick, setAdresseclick] = useState({ lat: '', long: '', color: '', id: '' });
    const [showcart, setShowcart] = useState(false);
    const [heuresSupplementaires, setHeuresSupplementaires] = useState([]);



    const [selectedEcole, setSelectedEcole] = useState(null);
    const [filteredEcoles, setFilteredEcoles] = useState([]);
    const [ecole, setEcoles] = useState([]);
    useEffect(() => {
        const fetchEcoles = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    console.error('Aucun token trouvé. Veuillez vous connecter.');
                    return;
                }

                const response = await axios.get('http://localhost:5000/ecoles', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                // Vérifier que les données contiennent bien les champs nécessaires
                const ecolesWithDefaults = response.data.map(ecole => ({
                    ...ecole,
                    nomecole: ecole.nomecole || '', // Valeur par défaut si undefined
                    nom_arecole: ecole.nom_arecole || '', // Valeur par défaut si undefined
                }));
                setEcoles(ecolesWithDefaults);
                setFilteredEcoles(ecolesWithDefaults);
            } catch (error) {
                console.error('Erreur lors de la récupération des écoles', error);
            }
        };
        fetchEcoles();
    }, []);

    // Récupérer la liste des employés
    useEffect(() => {
        const fetchEmployees = async () => {
            const token = localStorage.getItem("token");
            if (!token) {
                alert("Vous devez être connecté");
                return;
            }
            const response = await axios.get('http://localhost:5000/employes/liste', {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });
            const employeeOptions = response.data.map(emp => ({
                value: emp.id,
                label: `${emp.User.nom} ${emp.User.prenom}`
            }));
            setEmployees(employeeOptions);
        };
        fetchEmployees();
    }, []);

    // Récupérer tous les pointages

    const fetchPointages = async () => {
        const token = localStorage.getItem("token");
        const response = await axios.get('http://localhost:5000/pointage/ListepointageRapport', {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });

        if (response.data && Array.isArray(response.data)) {
            const updatedData = await Promise.all(
                response.data.map(async (item) => {
                    let colorEMP = "", colorSMP = "", colorEAMP = "", colorSAMP = "";

                    if (item.latlogEMP) {
                        const coords = item.latlogEMP.split(";");
                        if (coords.length === 2) {
                            const [latEMP, lonEMP] = coords.map(coord => parseFloat(coord));

                            if (!isNaN(latEMP) && !isNaN(lonEMP)) {
                                const isInEcolePosition = EcolePosition.some(
                                    ([lat, lon]) => lat === latEMP && lon === lonEMP
                                );
                                colorEMP = isInEcolePosition ? 'green' : 'red';
                            }
                        }
                    }

                    if (item.latlogSMP) {
                        const coords = item.latlogSMP.split(";");
                        if (coords.length === 2) {
                            const [latSMP, lonSMP] = coords.map(coord => parseFloat(coord));

                            if (!isNaN(latSMP) && !isNaN(lonSMP)) {
                                const isInEcolePosition = EcolePosition.some(
                                    ([lat, lon]) => lat === latSMP && lon === lonSMP
                                );
                                colorSMP = isInEcolePosition ? 'green' : 'red';
                            }
                        }
                    }

                    if (item.latlogEAMP) {
                        const coords = item.latlogEAMP.split(";");
                        if (coords.length === 2) {
                            const [latEAMP, lonEAMP] = coords.map(coord => parseFloat(coord));

                            if (!isNaN(latEAMP) && !isNaN(lonEAMP)) {
                                const isInEcolePosition = EcolePosition.some(
                                    ([lat, lon]) => lat === latEAMP && lon === lonEAMP
                                );
                                colorEAMP = isInEcolePosition ? 'green' : 'red';
                            }
                        }
                    }

                    if (item.latlogSAMP) {
                        const coords = item.latlogSAMP.split(";");
                        if (coords.length === 2) {
                            const [latSAMP, lonSAMP] = coords.map(coord => parseFloat(coord));

                            if (!isNaN(latSAMP) && !isNaN(lonSAMP)) {
                                const isInEcolePosition = EcolePosition.some(
                                    ([lat, lon]) => lat === latSAMP && lon === lonSAMP
                                );
                                colorSAMP = isInEcolePosition ? 'green' : 'red';
                            }
                        }
                    }

                    return {
                        ...item,
                        colorEMP,
                        colorSMP,
                        colorEAMP,
                        colorSAMP,
                        statut: item.statut || ''
                    };
                })
            );

            setAllPointages(updatedData);
            setFilteredPointages(updatedData);
        } else {
            console.error("⚠️ La réponse de l'API n'est pas un tableau :", response.data);
            setAllPointages([]);
            setFilteredPointages([]);
        }
    };
    useEffect(() => {

        fetchPointages();
    }, [EcolePosition]);

    // // Filtrer les pointages en fonction des sélections
    // useEffect(() => {
    //     const filtered = allPointages.filter(item => {
    //         const isEmployeeMatch = selectedEmployees.length > 0
    //             ? selectedEmployees.some(emp => emp.value === item.Employe.id)
    //             : true; // Si aucun employé n'est sélectionné, inclure tous les pointages
    //         const isDateMatch = (!startDate || moment(item.date).isSameOrAfter(moment(startDate))) &&
    //             (!endDate || moment(item.date).isSameOrBefore(moment(endDate)));
    //         return isEmployeeMatch && isDateMatch;
    //     });
    //     setFilteredPointages(filtered);
    // }, [selectedEmployees, startDate, endDate, allPointages]);

    // Gérer l'impression
    const handlePrint = () => {
        const printWindow = window.open("", "", "width=800,height=600");
        printWindow.document.write(`
            <html>
                <head>
                    <title>Rapport de Pointage</title>
                    <style>
                        @page { margin: 0; }
                        body {
                            font-family: Arial, sans-serif;
                            padding: 20px;
                            background-color: #f9f9f9;
                        }
                        h5 {
                            text-align: center;
                            font-size: 18px;
                            color: #333;
                            margin-bottom: 20px;
                        }
                        table {
                            margin:15px;
                            width: 100%;
                            border-collapse: collapse;
                            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                            background-color: #fff;
                            margin-bottom: 20px;
                        }
                        th, td {
                            border: 1px solid #ddd;
                            padding: 12px;
                            text-align: left;
                        }
                        th {
                            background-color: #f4f4f4;
                            font-weight: bold;
                            color: #333;
                            text-transform: uppercase;
                            font-size: 14px;
                        }
                        td {
                            color: #555;
                            font-size: 14px;
                        }
                        tr:nth-child(even) {
                            background-color: #f9f9f9;
                        }
                        tr:hover {
                            background-color: #f1f1f1;
                        }
                    </style>
                </head>
                <body>
                    <h5>Rapport des Pointages</h5>
                    <table>
                        <thead>
                            <tr>
                                <th>Nom Prénom</th>
                                <th>Poste</th>
                                <th>Date</th>
                                <th>Heure d'entrée <br/> Matin</th>
                                <th>Heure de sortie <br/> Matin</th>
                                <th>Heure d'entrée <br/> Après-midi</th>
                                <th>Heure de sortie <br/> Après-midi</th>
                                <th>Statut</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${filteredPointages.map(item => `
                                <tr>
                                    <td>${item.Employe?.User?.nom} ${item.Employe.User.prenom}</td>
                                    <td>${item.Employe?.Poste?.poste}</td>
                                    <td>${moment(item.date).format('YYYY-MM-DD')}</td>
                                    <td>${item.HeureEMP}</td>
                                    <td>${item.HeureSMP}</td>
                                    <td>${item.HeureEAMP}</td>
                                    <td>${item.HeureSAMP}</td>
                                    <td>${item.statut}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </body>
            </html>
        `);
        printWindow.document.close();
        printWindow.print();
    };
    // Fonction pour exporter les données vers Excel
    const handleExport = () => {
        const ws = XLSX.utils.json_to_sheet(filteredPointages.map(item => ({
            "Nom et Prénom": `${item.Employe.User?.nom} ${item.Employe?.User?.prenom}`,
            "Poste": item.Employe.Poste.poste,
            "Date": moment(item.date).format('YYYY-MM-DD'),
            "Heure d'entrée": item.HeureEMP,
            "Heure de sortie": item.HeureSMP,
            "Heure d'entrée  après-midi": item.HeureEAMP,
            "Heure de sortie après-midi": item.HeureSAMP,
            "statut": item.statut,

        })));

        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Pointages");
        XLSX.writeFile(wb, "rapport_pointage.xlsx");
    };


    //////modifier :
    const [showModal, setShowModal] = useState(false);
    const [selectedPointage, setSelectedPointage] = useState(null);
    const [formData, setFormData] = useState({});
    const [statut, setStatut] = useState({});
    const [showModalStatut, setShowModalStatut] = useState(false);
    const [selectedPointageId, setSelectedPointageId] = useState(null);


    const handleCloseModalStatut = () => {
        setShowModalStatut(false);
        setSelectedPointageId(null);
        setFormData({});
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleStatutChange = (value) => {
        setFormData((prevData) => ({
            ...prevData,
            statut: value,
        }));
    };

    //recuperre la liste des heure supplimentaires :
    useEffect(() => {
        fetchHeuresSupplementaires();
    }, []);

    const fetchHeuresSupplementaires = async () => {
        const token = localStorage.getItem("token");
        try {
            const response = await axios.get('http://localhost:5000/HeureSup/liste/', {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });
            setHeuresSupplementaires(response.data);
        } catch (error) {
            console.error("Erreur lors du chargement des heures supplémentaires:", error);
        }
    };

    const handleSave = async () => {
        try {
            const token = localStorage.getItem("token");
            const heuresSup = parseInt(formData.heuresupP) || 0;
            const typeHeureSup = formData.IdHeureSup;

            if (heuresSup > 0 && !typeHeureSup) {
                alert("Veuillez sélectionner un type d'heure supplémentaire lorsque le nombre d'heures est supérieur à 0");
                return;
            }
            const dataToSend = {
                ...formData,
                IdHeureSup: formData.IdHeureSup === "" ? null : formData.IdHeureSup,
                heuresupP: formData.heuresupP === "" ? null : formData.heuresupP
            };

            const response = await axios.put(
                `http://localhost:5000/pointage/modifier/${selectedPointageId}`,
                dataToSend,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );
            if (response.status === 200) {
                alert("Pointage modifié avec succès !");
                handleCloseModalStatut();
                // Rafraîchir les données
                const updatedPointages = allPointages.map(item =>
                    item.id === selectedPointageId ? { ...item, ...formData } : item
                );
                setAllPointages(updatedPointages);
                // setFilteredPointages(updatedPointages);
                fetchPointages();



            }
        } catch (error) {
            console.error("Erreur lors de la modification du pointage :", error);
            alert("Erreur lors de la modification du pointage.");
        }
    };

    ///viibility
    const [columnVisibility, setColumnVisibility] = useState({
        date: true,
        heureEntreeMatin: true,
        heureSortieMatin: true,
        heureEntreeApresMidi: true,
        heureSortieApresMidi: true,
        statut: true,
        heureSupplementaire: false,
        commentaire: false,
        action: true,
        // actions: true,
    });

    const ColumnVisibilityFilter = ({ columnVisibility, setColumnVisibility }) => {
        const columns = [
            { key: "date", label: "Date" },
            { key: "heureEntreeMatin", label: "Heure d'entrée Matin" },
            { key: "heureSortieMatin", label: "Heure de sortie Matin" },
            { key: "heureEntreeApresMidi", label: "Heure d'entrée Après-Midi" },
            { key: "heureSortieApresMidi", label: "Heure de sortie Après-Midi" },
            { key: "statut", label: "Statut" },
            { key: "heureSupplementaire", label: "Heure Supplémentaire" },
            { key: "commentaire", label: "Commentaire" },
            { key: "action", label: "Action" },
            // { key: "actions", label: "Actions" },
        ];

        // Fonction pour gérer la sélection/désélection des colonnes
        const handleSelectChange = (selectedOptions) => {
            const newColumnVisibility = { ...columnVisibility };
            // Met à jour l'état columnVisibility en fonction des options sélectionnées
            columns.forEach(({ key }) => {
                newColumnVisibility[key] = selectedOptions.some(option => option.value === key);
            });
            setColumnVisibility(newColumnVisibility);
        };
        return (
            <div className="mb-3 p-3">
                <h6>Choisir les colonnes à afficher :</h6>
                <Select
                    isMulti
                    options={columns.map(({ key, label }) => ({
                        value: key,
                        label: label,
                    }))}
                    value={columns
                        .filter(({ key }) => columnVisibility[key])
                        .map(({ key, label }) => ({
                            value: key,
                            label: label,
                        }))}
                    onChange={handleSelectChange}
                    placeholder="Choisir les colonnes à afficher"
                    isClearable={false}
                />
            </div>
        );
    };

    const mapEcole = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                alert("Vous devez être connecté ");
                return;
            }
            const response = await axios.get('http://localhost:5000/pointage/ecoleD',
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    }
                }
            );
            if (response.status === 200) {
                let ecoleData = response.data.maps;
                // Vérifier si `ecoleData` est une chaîne et la convertir en tableau
                if (typeof ecoleData === "string") {
                    try {
                        ecoleData = JSON.parse(ecoleData);
                    } catch (error) {
                        console.error("❌ Erreur lors du parsing JSON :", error);
                        return;
                    }
                }
                // Vérifier si c'est bien un tableau, sinon log une erreur
                if (!Array.isArray(ecoleData)) {
                    console.error("❌ ecoleData n'est pas un tableau après conversion !");
                    return;
                }

                // Mettre à jour l'état avec le bon format
                setEcolePosition(ecoleData);

                console.log('✅ ecoleData après conversion:', ecoleData);
                // console.log('✅ Type après conversion:', typeof(ecoleData));
            }
        } catch (error) {
            console.log("❌ Erreur lors de la récupération des écoles :", error);
        }
    };
    useEffect(() => {
        mapEcole();
    }, []);

    //pagination

    const itemsPerPage = 10;
    const [currentPage, setCurrentPage] = useState(1);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredPointages.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredPointages.length / itemsPerPage);
    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };
    const pageNumbers = [];
    for (let i = Math.max(1, currentPage - 2); i <= Math.min(currentPage + 2, totalPages); i++) {
        pageNumbers.push(i);
    }

    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

    useEffect(() => {
        const timerId = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm);
        }, 500);

        return () => {
            clearTimeout(timerId);
        };
    }, [searchTerm]);

    // Utilisez debouncedSearchTerm dans applyFilters au lieu de searchTerm

    const applyFilters = () => {
        let filtered = allPointages.filter(item => {
            // Filtre par employés sélectionnés
            const isEmployeeMatch = selectedEmployees.length > 0
                ? selectedEmployees.some(emp => emp.value === item.Employe.id)
                : true;

            // Filtre par date
            const isDateMatch = (!startDate || moment(item.date).isSameOrAfter(moment(startDate))) &&
                (!endDate || moment(item.date).isSameOrBefore(moment(endDate)));

            // Filtre par recherche
            const isSearchMatch = searchTerm === '' ||
                (item.Employe.User?.nom && item.Employe.User?.nom.toLowerCase().includes(searchTerm.toLowerCase().trim())) ||
                (item.Employe.User?.prenom && item.Employe.User?.prenom.toLowerCase().includes(searchTerm.toLowerCase().trim())) ||
                (item.Employe.Poste.poste && item.Employe.Poste.poste.toLowerCase().includes(searchTerm.toLowerCase().trim())) ||
                (item.HeureSMP && item.HeureSMP.includes(searchTerm)) ||
                (item.HeureEAMP && item.HeureEAMP.includes(searchTerm)) ||
                (item.HeureEMP && item.HeureEMP.includes(searchTerm)) ||
                (item.HeureSAMP && item.HeureSAMP.includes(searchTerm)) ||
                (item.statut && item.statut.includes(searchTerm));

            // Filtre par école
            const matchesEcole = !selectedEcole ||
                (item.Employe?.User?.Ecoles.some(ecole => ecole.id === parseInt(selectedEcole))) ||
                (item.Employe?.User?.Ecoles[0]?.id === parseInt(selectedEcole));


            return isEmployeeMatch && isDateMatch && isSearchMatch && matchesEcole;
        });

        setFilteredPointages(filtered);
        setCurrentPage(1); // Réinitialiser la pagination quand les filtres changent
    };
    useEffect(() => {
        applyFilters();
    }, [selectedEmployees, startDate, endDate, allPointages, searchTerm,selectedEcole, ecole]);

    return (
        <>
            <nav>
                <Link to="/dashboard" className="text-primary">Dashboard</Link>
                <span> / </span>
                <Link to="/RessourcesHumaines" className="text-primary">Ressources Humaines</Link>
                <span> / </span>
                <span>  Rapport du Pointage </span>
            </nav>
            <div className="card card-primary card-outline">
                <div className="card-header d-flex  p-4">
                    <h5>Rapport du Pointage</h5>
                </div>
                <div className="card-body">
                    {/* Section Filtres */}
                    <div className="filters-section mb-4 p-3 bg-light rounded">
                        <div className="row align-items-end">
                            {/* Dates */}
                            <div className="col-md-5">
                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label className="font-weight-bold">Date Début</label>
                                            <input
                                                type="date"
                                                className="form-control border-primary"
                                                value={startDate}
                                                onChange={(e) => setStartDate(e.target.value)}
                                                style={{ height: "40px" }}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label className="font-weight-bold">Date Fin</label>
                                            <input
                                                type="date"
                                                className="form-control border-primary"
                                                value={endDate}
                                                onChange={(e) => setEndDate(e.target.value)}
                                                style={{ height: "40px" }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Sélection Employés */}
                            <div className="col-md-4">
                                <div className="form-group">
                                    <label className="font-weight-bold">Employés</label>
                                    <Select
                                        options={employees}
                                        onChange={setSelectedEmployees}
                                        placeholder="Sélectionner un ou plusieurs employés"
                                        isClearable
                                        isMulti
                                        className="react-select-container"
                                        classNamePrefix="react-select"
                                    />
                                </div>
                            </div>

                            {/* Recherche */}
                            <div className="col-md-3">
                                <div className="form-group">
                                    <label className="font-weight-bold">Recherche</label>
                                    <div className="input-group search-box">
                                        <input
                                            type="search"
                                            className="form-control"
                                            placeholder="Nom, poste, heure..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            aria-label="Recherche"
                                            style={{ height: "40px" }}
                                        />
                                        <div className="input-group-append">
                                            <span className="input-group-text bg-white">
                                                <img src={recherche} alt="Rechercher" style={{ height: "20px", width: "20px", opacity: 0.7 }} />
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-4" style={{ width: '100%' }}>
                                <select
                                    name="ecole"
                                    className="form-control"
                                    required
                                    style={{ height: '38px', borderRadius: '8px', backgroundColor: '#F8F8F8' }}
                                    onChange={(e) => setSelectedEcole(e.target.value)}
                                    value={selectedEcole || ''}
                                >
                                    <option value="">Sélectionnez une école</option>
                                    {ecole.map((item) => (
                                        <option key={item.id} value={item.id}>
                                            {item.nomecole}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>
                    <div className="row mb-3">
                        <div className="col-md-4">
                            <button className='btn btn-app p-1' onClick={handlePrint}>
                                <img src={printIcon} alt="" width="30px" /><br />Imprimer
                            </button>
                            <button className='btn btn-app p-1' onClick={handleExport}>
                                <img src={exportIcon} alt="" width="25px" /><br />Exporter
                            </button>
                        </div>
                    </div>




                    <ColumnVisibilityFilter columnVisibility={columnVisibility} setColumnVisibility={setColumnVisibility} />
                    <div style={{ overflowX: 'auto', overflowY: 'hidden', scrollBehavior: 'smooth', }}>
                        <table className="table table-bordered mt-3">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>nom et Pénom</th>
                                    <th>Poste</th>
                                    {columnVisibility.date && <th>Date</th>}
                                    {columnVisibility.heureEntreeMatin && <th>Heure Entrée<br />(matin)</th>}
                                    {columnVisibility.heureSortieMatin && <th>Heure Sortie <br /> (matin)</th>}
                                    {columnVisibility.heureEntreeApresMidi && <th>Heure Entrée<br /> (après-midi)</th>}
                                    {columnVisibility.heureSortieApresMidi && <th>Heure Sortie<br /> (après-midi)</th>}
                                    {columnVisibility.statut && <th>Statut</th>}
                                    {columnVisibility.heureSupplementaire && <th>Heure Supplémentaire</th>}
                                    <th>Ecole</th>
                                    {columnVisibility.commentaire && <th>Commentaire</th>}
                                    <th>Type pointage</th>
                                    {columnVisibility.action && <th>Actions</th>}
                                </tr>
                            </thead>
                            <tbody>
                                {currentItems.map((item, index) => (
                                    <tr key={item.id}>
                                        <td>{index + 1}</td>
                                        <td>{item.Employe?.User.nom} {item.Employe?.User.prenom}</td>
                                        <td>{item.Employe?.Poste.poste}</td>
                                        {/* <td>{item.Employe?.User?.EcolePrincipal.Ecole?.id}</td> */}
                                        {columnVisibility.date && <td>{moment(item.date).format('YYYY-MM-DD')}</td>}
                                        {columnVisibility.heureEntreeMatin && <td><br />{item.HeureEMP} <br />
                                            {(item.latlogEMP ?
                                                <a className="btn btn-outline-warning"
                                                    style={{ cursor: 'pointer', color: item.colorEMP }}
                                                    onClick={() => {
                                                        setAdresseclick({
                                                            lat: item.latlogEMP.split(';')[0],
                                                            long: item.latlogEMP.split(';')[1],
                                                            color: item.colorEMP,
                                                            id: item.id
                                                        });
                                                        setShowcart(true);

                                                    }}
                                                >
                                                    {"lat:" + (item.latlogEMP ? item.latlogEMP.split(';')[0] : '')}<br />
                                                    {"lon:" + (item.latlogEMP ? item.latlogEMP.split(';')[1] : '')}

                                                </a>
                                                : <a className="btn btn-outline-warning" />
                                            )}
                                        </td>}
                                        {columnVisibility.heureSortieMatin && <td>{item.HeureSMP}<br />
                                            {(item.latlogSMP ?
                                                <a
                                                    className="btn btn-outline-warning"
                                                    style={{ cursor: 'pointer', color: item.colorSMP }}
                                                    onClick={() => {
                                                        setAdresseclick({
                                                            lat: item.latlogSMP.split(';')[0],
                                                            long: item.latlogSMP.split(';')[1],
                                                            color: item.colorSMP,
                                                            id: item.id
                                                        });
                                                        setShowcart(true);
                                                    }}
                                                >
                                                    {"lat:" + (item.latlogSMP ? item.latlogSMP.split(';')[0] : '')}<br />
                                                    {"lon:" + (item.latlogSMP ? item.latlogSMP.split(';')[1] : '')}

                                                </a>
                                                : <a className="btn btn-outline-warning" />
                                            )}
                                        </td>}
                                        {columnVisibility.heureEntreeApresMidi && <td>{item.HeureEAMP} <br />
                                            {(item.latlogEAMP ?
                                                <a
                                                    className="btn btn-outline-warning"
                                                    style={{ cursor: 'pointer', color: item.colorEAMP }}
                                                    onClick={() => {
                                                        setAdresseclick({
                                                            lat: item.latlogEAMP.split(';')[0],
                                                            long: item.latlogEAMP.split(';')[1],
                                                            color: item.colorEAMP,
                                                            id: item.id
                                                        });
                                                        setShowcart(true);
                                                    }}
                                                >
                                                    {/* {item.latlogEAMP} */}
                                                    {"lat:" + (item.latlogEAMP ? item.latlogEAMP.split(';')[0] : '')}<br />
                                                    {"lon:" + (item.latlogEAMP ? item.latlogEAMP.split(';')[1] : '')}

                                                </a>
                                                : <a className="btn btn-outline-warning" />
                                            )}
                                        </td>}
                                        {columnVisibility.heureSortieApresMidi && <td>{item.HeureSAMP} <br />
                                            {(item.latlogSAMP ?
                                                <a
                                                    className="btn btn-outline-warning"
                                                    style={{ cursor: 'pointer', color: item.colorSAMP }}
                                                    onClick={() => {
                                                        setAdresseclick({
                                                            lat: item.latlogSAMP.split(';')[0],
                                                            long: item.latlogSAMP.split(';')[1],
                                                            color: item.colorSAMP,
                                                            id: item.id
                                                        });
                                                        setShowcart(true);
                                                    }}
                                                >
                                                    {"lat:" + item.latlogSAMP.split(';')[0]}<br />
                                                    {"lon:" + item.latlogSAMP.split(';')[1]}
                                                </a>
                                                : <a className="btn btn-outline-warning" />
                                            )}
                                        </td>}
                                        {columnVisibility.statut &&
                                            <td>
                                                <span
                                                    style={{
                                                        backgroundColor:
                                                            item.statut === 'present'
                                                                ? 'green'
                                                                : item.statut === 'retard'
                                                                    ? 'orange'
                                                                    : item.statut === 'absent'
                                                                        ? 'red'
                                                                        : 'gray',
                                                        color: 'white',
                                                        borderRadius: '15px',
                                                        padding: '1px 10px',
                                                        display: 'inline-block',
                                                        width: "90px",
                                                        textAlign: 'center',
                                                    }}
                                                >
                                                    {item.statut}
                                                </span>
                                            </td>}

                                        {columnVisibility.heureSupplementaire && <td>{item.heuresupP} <br />
                                            <small style={{ color: 'green' }}>{item.HeuresSup?.nom}</small>
                                        </td>}
                                        <td>{item.Employe?.User?.Ecoles ? item.Employe?.User?.Ecoles[0]?.nomecole : ''}</td>
                                        {columnVisibility.commentaire && <td>{item.justificationret}</td>}
                                        <td>{item.type_pointage}</td>
                                        {columnVisibility.action && <td>
                                            <Button
                                                onClick={() => {
                                                    // Récupérer toutes les informations du pointage
                                                    const pointageData = {
                                                        HeureEMP: item.HeureEMP || null,
                                                        HeureSMP: item.HeureSMP || null,
                                                        HeureEAMP: item.HeureEAMP || null,
                                                        HeureSAMP: item.HeureSAMP || null,
                                                        statut: item.statut || '', // Valeur par défaut
                                                        heuresupP: item.heuresupP || null,
                                                        justificationret: item.justificationret || '',
                                                        latlogEMP: item.latlogEMP || '',
                                                        latlogSMP: item.latlogSMP || '',
                                                        latlogEAMP: item.latlogEAMP || '',
                                                        latlogSAMP: item.latlogSAMP || '',
                                                        IdHeureSup: item.IdHeureSup || '',
                                                    };
                                                    // Stocker les données dans formData
                                                    setFormData(pointageData);
                                                    // Stocker l'ID du pointage sélectionné
                                                    setSelectedPointageId(item.id);
                                                    // Ouvrir la modal
                                                    setShowModalStatut(true);
                                                }}
                                            >
                                                Modifier
                                            </Button>
                                        </td>}

                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {showcart && <Cart lat={adresseclick.lat} lon={adresseclick.long} showcart={showcart} setShowcart={setShowcart}
                        EcolePosition={EcolePosition} color={adresseclick.color} id={adresseclick.id} />}

                    {/* Pagination */}
                    <div className="pagination">
                        <button
                            className="btn btn-primary"
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                        >
                            Précédent
                        </button>
                        {pageNumbers.map((number) => (
                            <button
                                key={number}
                                className={`btn ${currentPage === number ? 'btn-info' : 'btn-light'}`}
                                onClick={() => handlePageChange(number)}
                            >
                                {number}
                            </button>
                        ))}
                        <button
                            className="btn btn-primary"
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                        >
                            Suivant
                        </button>
                    </div>
                </div>

            </div>
            {/* Modal pour modifier le pointage */}
            <Modal show={showModalStatut} onHide={handleCloseModalStatut} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Modifier le pointage</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div style={{ maxHeight: '60vh', overflowY: 'auto', overflowX: 'hidden' }}>
                        {/* Statut (Présent, Retard, Absent) */}
                        <div className="row">
                            <div className="col-12">
                                <div className="d-flex gap-4">
                                    <div className="d-flex align-items-center mr-4">
                                        <input
                                            type="radio"
                                            value="present"
                                            checked={formData.statut === 'present'}
                                            onChange={() => handleStatutChange('present')}
                                        />
                                        <label>Présent</label>
                                    </div>
                                    <div className="d-flex align-items-center mr-4">
                                        <input
                                            type="radio"
                                            value="retard"
                                            checked={formData.statut === 'retard'}
                                            onChange={() => handleStatutChange('retard')}
                                        />
                                        <label>Retard</label>
                                    </div>
                                    <div className="d-flex align-items-center">
                                        <input
                                            type="radio"
                                            value="absent"
                                            checked={formData.statut === 'absent'}
                                            onChange={() => handleStatutChange('absent')}
                                        />
                                        <label>Absent</label>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Heure supplémentaire */}

                        <div className="mb-3">

                            <label>Heure supplémentaire</label>
                            <div className="row">
                                <div className="col-md-6">
                                    <input
                                        type="number"
                                        placeholder="Nombre d'heures"
                                        min={0}
                                        className="form-control"
                                        name="heuresupP"
                                        value={formData.heuresupP || ''}
                                        onChange={handleChange}
                                    />

                                </div>
                                <div className="col-md-6">
                                    <select
                                        className="form-control"
                                        name="IdHeureSup"
                                        value={formData.IdHeureSup || ''}
                                        onChange={(e) => setFormData({ ...formData, IdHeureSup: e.target.value })}
                                        disabled={!formData.heuresupP || parseInt(formData?.heuresupP) === 0}
                                    >
                                        <option value="">Sélectionner le type</option>
                                        {heuresSupplementaires.map((hs) => (
                                            <option key={hs.id} value={hs.id}>
                                                {hs.nom} (Taux: {hs.taux})
                                            </option>
                                        ))}
                                    </select>

                                </div>
                            </div>
                        </div>



                        {/* Coordonnées GPS */}
                        {["latlogEMP", "latlogSMP", "latlogEAMP", "latlogSAMP"].map((name, index) => {
                            const [lat, lon] = formData[name] ? formData[name].split(';') : ['', ''];
                            return (
                                <Form.Group controlId={name} key={index} className="mb-3">
                                    <Form.Label>
                                        {name.includes("EMP") ? "Latitude et Longitude d'entrée" : "Latitude et Longitude de sortie"}
                                        {name.includes("Matin") ? " Matin" : " Après-midi"}
                                    </Form.Label>
                                    <div className="d-flex gap-2">
                                        <Form.Control
                                            type="text"
                                            placeholder="Latitude"
                                            value={lat}
                                            onChange={(e) => {
                                                const newLat = e.target.value;
                                                const newValue = `${newLat};${lon}`;
                                                setFormData((prevData) => ({
                                                    ...prevData,
                                                    [name]: newValue,
                                                }));
                                            }}
                                        />
                                        <Form.Control
                                            type="text"
                                            placeholder="Longitude"
                                            value={lon}
                                            onChange={(e) => {
                                                const newLon = e.target.value;
                                                const newValue = `${lat};${newLon}`;
                                                setFormData((prevData) => ({
                                                    ...prevData,
                                                    [name]: newValue,
                                                }));
                                            }}
                                        />
                                    </div>
                                </Form.Group>
                            );
                        })}

                        {/* Heures */}
                        {[
                            { label: "Heure d'entrée Matin", name: "HeureEMP" },
                            { label: "Heure de sortie Matin", name: "HeureSMP" },
                            { label: "Heure d'entrée Après-midi", name: "HeureEAMP" },
                            { label: "Heure de sortie Après-midi", name: "HeureSAMP" }
                        ].map(({ label, name }, index) => (
                            <Form.Group controlId={name} key={index} className="mb-3">
                                <Form.Label>{label}</Form.Label>
                                <Form.Control
                                    type="time"
                                    name={name}
                                    value={formData[name] || ''}
                                    onChange={handleChange}
                                />
                            </Form.Group>
                        ))}

                        {/* Justification du retard */}
                        <Form.Group controlId="justification" className="mb-3">
                            <Form.Label>Justification du retard</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                name="justificationret"
                                maxLength={200}
                                style={{ resize: 'none', overflow: 'auto' }}
                                value={formData.justificationret || ''}
                                onChange={handleChange}
                                placeholder="Entrez votre justification ici..."
                            />
                        </Form.Group>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModalStatut}>
                        Annuler
                    </Button>
                    <Button variant="primary" onClick={handleSave}>
                        Enregistrer
                    </Button>
                </Modal.Footer>
            </Modal>

        </>
    );
};

export default RapportPointage;