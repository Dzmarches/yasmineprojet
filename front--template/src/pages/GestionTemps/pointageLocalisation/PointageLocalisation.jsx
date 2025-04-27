import React, { useEffect, useState } from 'react'
import exportt from '../../../assets/imgs/excel.png'
import print from '../../../assets/imgs/printer.png'
import importt from '../../../assets/imgs/import.png'
import { Link, useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx';
import Select from 'react-select';
import rh from '../../../assets/imgs/employe.png';
import edit from '../../../assets/imgs/edit.png';
import add from '../../../assets/imgs/add.png';
import deletee from '../../../assets/imgs/delete.png';
import absence from '../../../assets/imgs/absenceEmploye.png'
import carte from '../../../assets/imgs/carte.png'
import { StatutPointage } from '../../RH/Employes/OptionSelect'
import axios from 'axios';
import { Modal, Button, Form } from 'react-bootstrap';
import Cart from './Cart';
import L from 'leaflet';
import recherche from '../../../assets/imgs/recherche.png';

const PointageLocalisation = () => {
    const [EcolePosition, setEcolePosition] = useState([]);
    // const [EcolePosition, setEcolePosition] = useState([[36.754012104290325, 5.060882964742418], [36.75396052784538, 5.0610438545450585], [36.75390895136577, 5.061011676584562], [36.75396482588377, 5.06086151276874]]);
    const [showModalStatut, setShowModalStatut] = useState(false);
    const [formData, setFormData] = useState({});
    const [statut, setStatut] = useState({});
    const [selectedPointageId, setSelectedPointageId] = useState(null);

    const today = new Date();
    const options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        hour12: false
    };

    const itemsPerPage = 10;
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedOption, setSelectedOption] = useState(null);
    const Datetoday = today.toLocaleDateString('fr-FR', options);
    const [datapointage, setDatapointage] = useState({ lat: null, long: null, time: null, BTN: null });
    const [mesaageError, setMessageError] = useState('');

    const [PointagesData, setPointagesData] = useState({});
    const [data, setData] = useState([])
    const [comment, setComment] = useState('');
    const [showcart, setShowcart] = useState(false)


    const handleChange = selectedOption => {
        setSelectedOption(selectedOption);
    };



    // console.log('data is ', PointagesData)
    const handleButtonClick = async (BTN) => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(

                (position) => {
                    const lat = position.coords.latitude;
                    const long = position.coords.longitude;
                    const now = new Date();
                    const date = now.toLocaleDateString()
                    const time = now.toLocaleTimeString();
                    setDatapointage({ lat, long, time, BTN });
                    console.log(`Latitude: ${lat}, Longitude: ${long}, Time: ${time}`);
                },
                (error) => {
                    console.error("Error getting location: ", error);
                    if (error.code === error.PERMISSION_DENIED) {
                        alert("La localisation est désactivée. Veuillez l'activer dans les paramètres de votre appareil.");
                    } else {
                        alert("Impossible de récupérer la localisation. Veuillez vérifier vos paramètres.");
                    }
                }
            );
           
        } else {
            console.error("Geolocation is not supported by this browser.");
            alert("La géolocalisation n'est pas supportée par ce navigateur.");
        }


    };

    const EnvoyreDataPointage = async (BTN) => {
        if (
            datapointage.lat !== 0 &&
            datapointage.long !== 0 &&
            datapointage.time
        ) {
            try {

                const token = localStorage.getItem("token");
                if (!token) {
                    alert("Vous devez être connecté ");
                    return;
                }
                const dataToSend = {
                    ...datapointage,
                    comment: comment
                };

                const response = await axios.post(
                    "http://localhost:5000/pointage/ajouter/localisation/",
                    dataToSend,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json",
                        },
                    }
                );
                if (response.status === 201) {
                    alert("Formulaire soumis avec succès!");
                    infoPointageE();
                    findAllpoinates();
                }

                console.log("Pointage créé avec succès", response.data);
            } catch (error) {
                console.error("Erreur lors de l'ajout des pointages par défaut:", error);

                // Afficher un message d'erreur à l'utilisateur
                if (error.response) {
                    alert(`Erreur serveur: ${error.response.data.message}`);
                } else if (error.request) {
                    alert("Erreur de réseau. Veuillez vérifier votre connexion Internet.");
                } else {
                    alert("Une erreur inattendue s'est produite.");
                }
            }
        }

    };
    useEffect(() => {
        if (datapointage.lat !== null && datapointage.long !== null && datapointage.time) {
            EnvoyreDataPointage();
        }
    }, [datapointage]);
    //recuperer les informations du pointage pour l'employé

    const findAllpoinates = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get("http://localhost:5000/pointage/allpointages", {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (response.data && Array.isArray(response.data)) {
                const updatedData = await Promise.all(
                    response.data.map(async (item) => {
                        let addressEMP = "", addressSMP = "", addressEAMP = "", addressSAMP = "";
                        let colorEMP = "", colorSMP = "", colorEAMP = "", colorSAMP = "";

                        if (item.latlogEMP) {
                            const coords = item.latlogEMP.split(";");
                            if (coords.length === 2) {
                                const [latEMP, lonEMP] = coords.map(coord => parseFloat(coord));

                                if (!isNaN(latEMP) && !isNaN(lonEMP)) {
                                    const pointageArray = [latEMP, lonEMP];
                                    const isInEcolePosition = EcolePosition.some(
                                        ([lat, lon]) => lat === latEMP && lon === lonEMP
                                    );
                                    colorEMP = isInEcolePosition ? 'green' : 'red';
                                }
                            }
                        }
                        // Répétez le même processus pour les autres coordonnées (SMP, EAMP, SAMP)
                        if (item.latlogSMP) {
                            const coords = item.latlogSMP.split(";");
                            if (coords.length === 2) {
                                const [latSMP, lonSMP] = coords.map(coord => parseFloat(coord));

                                if (!isNaN(latSMP) && !isNaN(lonSMP)) {
                                    const pointageArray = [latSMP, lonSMP];
                                    const isInEcolePosition = EcolePosition.some(
                                        ([lat, lon]) => lat === latSMP && lon === lonSMP
                                    );

                                    colorSMP = isInEcolePosition ? 'green' : 'red';
                                }
                            }
                        }

                        // Répétez pour EAMP et SAMP...
                        if (item.latlogEAMP) {
                            const coords = item.latlogEAMP.split(";");
                            if (coords.length === 2) {
                                const [latEAMP, lonEAMP] = coords.map(coord => parseFloat(coord));

                                if (!isNaN(latEAMP) && !isNaN(lonEAMP)) {
                                    const pointageArray = [latEAMP, lonEAMP];
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
                                    const pointageArray = [latSAMP, lonSAMP];
                                    const isInEcolePosition = EcolePosition.some(
                                        ([lat, lon]) => lat === latSAMP && lon === lonSAMP
                                    );
                                    colorSAMP = isInEcolePosition ? 'green' : 'red';
                                }
                            }
                        }
                        return {
                            ...item,
                            addressEMP,
                            addressSMP,
                            addressEAMP,
                            addressSAMP,
                            colorEMP,
                            colorSMP,
                            colorEAMP,
                            colorSAMP,
                            statut: item.statut || ''
                        };

                    })
                );
                setData(updatedData);
                setStatut(updatedData.reduce((acc, item) => {
                    acc[item.id] = item.statut; // Assurez-vous que l'ID est correct
                    return acc;
                }, {}));

            } else {
                console.error("⚠️ La réponse de l'API n'est pas un tableau :", response.data);
                setData([]);
            }
        } catch (error) {
            console.error("❌ Erreur lors de la récupération des données de pointage :", error);
            setData([]);
        }
    };

    const infoPointageE = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get("http://localhost:5000/pointage/InfoPointageToday", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (response.data) {
                setPointagesData(response.data);
            } else {
                console.log("Aucune donnée reçue du serveur.");
            }

            // console.log('lesinfo',response.data)
        } catch (error) {
            console.log("Erreur lors de la récupération des données de pointage.");
            console.error(error);
        }
    };

    useEffect(() => {
        infoPointageE();
        findAllpoinates();
    }, []);


    const [adresseclick, setAdresseclick] = useState({ lat: '', long: '', color: '', id: '' });
    //filtrage:
    const [searchTerm, setSearchTerm] = useState('');
    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const filteredData = data.filter(item => {
        // console.log(searchTerm)
        return (item.statut && item.statut.toLowerCase().includes(searchTerm)) ||
            (item.date && item.date.includes(searchTerm)) ||
            (item.HeureEMP && item.HeureEMP.includes(searchTerm)) ||
            (item.HeureSMP && item.HeureSMP.includes(searchTerm)) ||
            (item.HeureEAMP && item.HeureEAMP.includes(searchTerm)) ||
            (item.HeureSAMP && item.HeureSAMP.includes(searchTerm)) ||
            (item.addressEMP && item.addressEMP.includes(searchTerm)) ||
            (item.addressSMP && item.addressSMP.includes(searchTerm)) ||
            (item.addressEAMP && item.addressEAMP.includes(searchTerm)) ||
            (item.addressSAMP && item.addressSAMP.includes(searchTerm))
    });


    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const pageNumbers = [];
    for (let i = Math.max(1, currentPage - 2); i <= Math.min(currentPage + 2, totalPages); i++) {
        pageNumbers.push(i);
    }
    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
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

    const handleChangee = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [selectedPointageId]: {
                ...prevData[selectedPointageId],
                [name]: value,
            },
        }));
    };
    const ModifierPointage = async () => {
        try {
            const token = localStorage.getItem("token");
            const dataToSend = {
                ...formData[selectedPointageId],
                statut: statut[selectedPointageId],
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
                findAllpoinates(); // Rafraîchir les données
            }
        } catch (error) {
            console.error("Erreur lors de la modification du pointage :", error);
            alert("Erreur lors de la modification du pointage.");
        }
    };
    const handleShowModalStatut = () => {
        setShowModalStatut(true);
    };

    const handleCloseModalStatut = () => {
        setShowModalStatut(false);
    };
    const handleStatutChange = (value) => {
        setStatut((prevStatut) => ({
            ...prevStatut,
            [selectedPointageId]: value,
        }));
    };



    //affciher les columns necessaires:
    const [columnVisibility, setColumnVisibility] = useState({
        date: true,
        heureEntreeMatin: true,
        heureSortieMatin: true,
        heureEntreeApresMidi: true,
        heureSortieApresMidi: true,
        statut: true,
        heureSupplementaire: true,
        commentaire: true,
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
    return (
        <>
            <nav>
                <Link to="/dashboard" className="text-primary">Dashboard</Link>
                <span> / </span>
                <Link to="/RessourcesHumaines" className="text-primary">Ressources Humaines</Link>
                <span> / </span>
                <span>  Gestion du  Pointage </span>
            </nav>
            <div className="card card-primary card-outline">
                <div className="card-header d-flex ">
                    <img src={carte} alt="" width="90px" />
                    <p className="card-title mt-5 ml-2 p-2 text-center" style={{ width: '350px', borderRadius: '50px', border: '1px solid rgb(215, 214, 216)' }}>
                        Gestion du  Pointage par localisation
                    </p>
                </div>

                <div className="card-body">
                    <div className="tab-content" id="custom-content-below-tabContent">
                        <div className="tab-pane fade show active" id="listes" role="tabpanel" aria-labelledby="custom-content-below-home-tab">
                            <section className="content mt-2">
                                <div className="container-fluid">
                                    <div className="row">
                                        <div className="col-12">
                                            <div className="card">
                                                <div className="card-header">

                                                    {/* <div className="row">
                            <div className="col-12 text-center mb-5">
                              <h5>Pointage du: {Datetoday}</h5>
                            </div>
                          </div> */}
                                                    <div className="row">
                                                        <div className="col-md-12">
                                                            <div className="card">
                                                                <div className="card-header" style={{ background: "#FFDB56" }}>
                                                                    <h3 className="card-title">Pointage le  {Datetoday}</h3></div>

                                                                <div className="card-body p-0">
                                                                    <div className="d-md-flex">
                                                                        <div className="p-1 flex-fill" style={{ overflow: 'hidden' }}>
                                                                            <div style={{ height: '325px', overflow: 'hidden' }}>
                                                                                <div className="p-4 mt-5">
                                                                                    <p style={{ fontSize: "20px", fontFamily: "revert-layer" }}>Heure d'entrée du matin : <span style={{ color: "#203e76" }}>{PointagesData ? PointagesData.HeureEMP : ''}</span></p>
                                                                                    <p style={{ fontSize: "20px", fontFamily: "revert-layer" }}>Heure de sortie du matin :<span style={{ color: "#203e76" }}>{PointagesData ? PointagesData.HeureSMP : ''}</span></p>
                                                                                    <p style={{ fontSize: "20px", fontFamily: "revert-layer" }}>Heure d'entrée de l'après-midi :<span style={{ color: "#203e76" }}>{PointagesData ? PointagesData.HeureEAMP : ''}</span></p>
                                                                                    <p style={{ fontSize: "20px", fontFamily: "revert-layer" }}>Heure de sortie de l'après-midi :<span style={{ color: "#203e76" }}>{PointagesData ? PointagesData.HeureSAMP : ''}</span></p>
                                                                                </div>
                                                                            </div>

                                                                            <p style={{ fontSize: "20px", fontFamily: "revert-layer", marginLeft: "2px" }}>Commentaire :</p>
                                                                            <textarea
                                                                                value={comment}
                                                                                className="form-control mb-3"
                                                                                onChange={(e) => setComment(e.target.value)}
                                                                                placeholder="Ajouter un commentaire en cas du retard..."
                                                                                style={{
                                                                                    borderRadius: '8px',
                                                                                    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
                                                                                    fontSize: '14px',
                                                                                    padding: '12px',
                                                                                    resize: 'vertical',
                                                                                    borderColor: '#ddd',
                                                                                }}
                                                                            />
                                                                        </div>
                                                                        <div className="card-pane-right pt-2 pb-2 pl-4 pr-4" style={{ background: "#FFDB56" }}>
                                                                            <div className="info-box mb-3 " style={{ backgroundColor: '#4CE166', borderRadius: '8px' }}>

                                                                                < button
                                                                                    className="btn"
                                                                                    onClick={() => handleButtonClick('EMP')}
                                                                                    disabled={PointagesData?.HeureEMP ?? null !== null}
                                                                                    style={{
                                                                                        opacity: PointagesData?.HeureEMP ?? null !== null ? 0.6 : 1,
                                                                                        cursor: PointagesData?.HeureEMP ?? null !== null ? 'not-allowed' : 'pointer',

                                                                                    }}
                                                                                >
                                                                                    <div className="info-box-content">
                                                                                        <p style={{ fontSize: '20px' }}>Pointer Heure d'entrée du matin</p>
                                                                                    </div>
                                                                                </button>
                                                                            </div>
                                                                            <div className="info-box mb-3 " style={{ backgroundColor: '#FF4A4A', borderRadius: '8px' }}>

                                                                                <button
                                                                                    className="btn"
                                                                                    onClick={() => handleButtonClick('SMP')}
                                                                                    disabled={PointagesData?.HeureSMP ?? null !== null} // Désactive le bouton si HeureEMP n'est pas null
                                                                                    style={{
                                                                                        opacity: PointagesData?.HeureSMP ?? null !== null ? 0.6 : 1, // Réduit l'opacité si désactivé
                                                                                        cursor: PointagesData?.HeureSMP ?? null !== null ? 'not-allowed' : 'pointer', // Change le curseur
                                                                                    }}
                                                                                >
                                                                                    <div className="info-box-content">
                                                                                        <p style={{ fontSize: '20px' }}>Heure de sortie du matin</p>
                                                                                    </div>
                                                                                </button>
                                                                            </div>
                                                                            <div className="info-box mb-3 " style={{ backgroundColor: '#4CE166', borderRadius: '8px' }}>

                                                                                <button
                                                                                    className="btn"
                                                                                    onClick={() => handleButtonClick('EAMP')}
                                                                                    disabled={PointagesData?.HeureEAMP ?? null !== null} // Désactive le bouton si HeureEMP n'est pas null
                                                                                    style={{
                                                                                        opacity: PointagesData?.HeureEAMP ?? null !== null ? 0.6 : 1, // Réduit l'opacité si désactivé
                                                                                        cursor: PointagesData?.HeureEAMP ?? null !== null ? 'not-allowed' : 'pointer', // Change le curseur
                                                                                    }}
                                                                                >
                                                                                    <div className="info-box-content" >
                                                                                        <p style={{ fontSize: '20px' }}>Heure d'entrée de l'après-midi</p>
                                                                                    </div>
                                                                                </button>
                                                                            </div>
                                                                            <div className="info-box mb-3 " style={{ backgroundColor: '#FF4A4A', borderRadius: '8px' }}>
                                                                                <button
                                                                                    className="btn"
                                                                                    onClick={() => handleButtonClick('SAMP')}
                                                                                    disabled={PointagesData?.HeureSAMP ?? null !== null}
                                                                                    style={{
                                                                                        opacity: PointagesData?.HeureSAMP ?? null !== null ? 0.6 : 1,
                                                                                        cursor: PointagesData?.HeureSAMP ?? null !== null ? 'not-allowed' : 'pointer',
                                                                                    }}>
                                                                                    <div className="info-box-content">
                                                                                        <p style={{ fontSize: '20px' }}>Heure de sortie de l'après-midi</p>
                                                                                    </div>
                                                                                </button>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="card-body mt-2">
                                                    <div className='row mt-3'>
                                                        <div className="button-container" style={{ marginTop: '20px' }}>
                                                        </div>
                                                        <div className='col-md-4'>
                                                            {/* 
                              <a className='btn btn-app p-1' href="">
                                <img src={print} alt="" width="30px" /><br />Imprimer
                              </a> */}

                                                        </div>
                                                        <div className='col-md-4'>

                                                            <div className="input-group mr-2 mb-3">
                                                                <div className="form-outline" data-mdb-input-init> <input
                                                                    type="search"
                                                                    id="form1"
                                                                    className="form-control"
                                                                    placeholder="Recherche"
                                                                    style={{ height: "38px" }}
                                                                    value={searchTerm}
                                                                    onChange={handleSearchChange} // Mise à jour du terme de recherche
                                                                />
                                                                </div>
                                                                <div style={{ background: "rgb(202, 200, 200)", padding: "3px", height: "37px", borderRadius: "2px" }}>
                                                                    <img src={recherche} alt="" height="30px" width="30px" />

                                                                </div>
                                                               
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <ColumnVisibilityFilter columnVisibility={columnVisibility} setColumnVisibility={setColumnVisibility} />
                                                    <div style={{ overflowX: 'auto', overflowY: 'hidden', scrollBehavior: 'smooth', }}>
                                                        <table id="example2" className="table table-bordered" >
                                                            <thead>
                                                                <tr>
                                                                    {columnVisibility.date && <th>Date</th>}
                                                                    {columnVisibility.heureEntreeMatin && <th>Heure Entrée<br/>(matin)</th>}
                                                                    {columnVisibility.heureSortieMatin && <th>Heure Sortie<br/>(matin)</th>}
                                                                    {columnVisibility.heureEntreeApresMidi && <th>Heure Entrée<br/>(après-midi)</th>}
                                                                    {columnVisibility.heureSortieApresMidi && <th>Heure Sortie<br/>(après-midi)</th>}
                                                                    {columnVisibility.statut && <th>Statut</th>}
                                                                    {columnVisibility.heureSupplementaire && <th>Heure Supplémentaire</th>}
                                                                    {columnVisibility.commentaire && <th>Commentaire</th>}
                                                                    {columnVisibility.actions && <th>Actions</th>}
                                                                </tr>

                                                            </thead>
                                                            <tbody>
                                                                {currentItems.map((item, index) => (
                                                                    <tr key={index}>
                                                                       {columnVisibility.date && <td style={{ writingMode: 'vertical', textOrientation: 'upright', whiteSpace: 'nowrap' }}>
                                                                            {item.date}
                                                                        </td>}
                                                                        {columnVisibility.heureEntreeMatin &&    <td><br />{item.HeureEMP} <br />
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
                                                                        {columnVisibility.heureEntreeApresMidi &&<td>{item.HeureEAMP} <br />
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
                                                                                 width:"90px",
                                                                                 textAlign: 'center',
                                                                             }}
                                                                         >
                                                                             {item.statut}
                                                                         </span>
                                                                         </td>
                                                                         }
                                                                        {columnVisibility.heureSupplementaire && <td>{item.heuresupP} </td>}
                                                                        {columnVisibility.commentaire &&<td>{item.justificationret} </td>}
                                                                      {columnVisibility.acions &&
                                                                       <td>
                                                                            <Button
                                                                                onClick={() => {
                                                                                    handleShowModalStatut(item.id, item.HeureEMP, item.HeureSMP, item.HeureEAMP, item.HeureSAMP, item.statut, item.heuresupP, item.justificationret);
                                                                                    setSelectedPointageId(item.id);

                                                                                    setFormData((prevData) => ({
                                                                                        ...prevData,
                                                                                        [item.id]: {
                                                                                            HeureEMP: item.HeureEMP ? item.HeureEMP : '',
                                                                                            HeureSMP: item.HeureSMP ? item.HeureSMP : '',
                                                                                            HeureEAMP: item.HeureEAMP ? item.HeureEAMP : '',
                                                                                            HeureSAMP: item.HeureSAMP ? item.HeureSAMP : '',
                                                                                            statut: item.statut ? item.statut : '',
                                                                                            heuresupP: item.heuresupP ? item.heuresupP : '',
                                                                                            justificationret: item.justificationret,
                                                                                            latlogEMP: item.latlogEMP ? item.latlogEMP : '',
                                                                                            latlogSMP: item.latlogSMP ? item.latlogSMP : '',
                                                                                            latlogEAMP: item.latlogEAMP ? item.latlogEAMP : '',
                                                                                            latlogSAMP: item.latlogSAMP ? item.latlogSAMP : '',
                                                                                        },
                                                                                    }));
                                                                                }}
                                                                            >
                                                                                Modifier
                                                                            </Button>
                                                                            <Modal show={showModalStatut} onHide={handleCloseModalStatut}>
                                                                                <Modal.Header closeButton>
                                                                                    <Modal.Title>Modifier le pointage</Modal.Title>
                                                                                </Modal.Header>
                                                                                <Modal.Body>
                                                                                    {/* Limitation de la hauteur pour éviter le débordement */}
                                                                                    <div style={{ maxHeight: '60vh', overflowY: 'auto', overflowX: 'hidden' }}>
                                                                                        <div className="row">
                                                                                            <div className="col-12">
                                                                                                {/* Ajout de d-flex et gap-4 pour plus d'espacement */}
                                                                                                <div className="d-flex gap-4">
                                                                                                    <div className="d-flex align-items-center mr-4">
                                                                                                        {console.log(statut[selectedPointageId], 'yahho')}
                                                                                                        <input
                                                                                                            type="radio"
                                                                                                            value="present"
                                                                                                            checked={statut[selectedPointageId] === 'present'}
                                                                                                            onChange={() => handleStatutChange('present')}
                                                                                                        />
                                                                                                        <label >Présent</label>
                                                                                                    </div>
                                                                                                    <div className="d-flex align-items-center mr-4">
                                                                                                        <input
                                                                                                            type="radio"
                                                                                                            value="retard"
                                                                                                            checked={statut[selectedPointageId] === 'retard'}
                                                                                                            onChange={() => handleStatutChange('retard')}
                                                                                                        />
                                                                                                        <label >Retard</label>
                                                                                                    </div>
                                                                                                    <div className="d-flex align-items-center">
                                                                                                        <input
                                                                                                            type="radio"
                                                                                                            value="absent"
                                                                                                            checked={statut[selectedPointageId] === 'absent'}
                                                                                                            onChange={() => handleStatutChange("absent")}
                                                                                                        />
                                                                                                        <label >Absent</label>
                                                                                                    </div>
                                                                                                </div>
                                                                                            </div>
                                                                                        </div>


                                                                                        <input
                                                                                            type="number"
                                                                                            placeholder="Heure supplémentaire"
                                                                                            min={0}
                                                                                            className="form-control mb-3"
                                                                                            name="heuresupP"
                                                                                            value={formData[selectedPointageId]?.heuresupP || ''}
                                                                                            onChange={handleChangee}
                                                                                        />

                                                                                        {/* Champs Latitude & Longitude */}
                                                                                        {["latlogEMP", "latlogSMP", "latlogEAMP", "latlogSAMP"].map((name, index) => (
                                                                                            <Form.Group controlId={name} key={index} className="mb-3">
                                                                                                <Form.Label>
                                                                                                    {name.includes("EMP") ? "Latitude et Longitude d'entrée" : "Latitude et Longitude de sortie"}
                                                                                                    {name.includes("Matin") ? " Matin" : " Après-midi"}
                                                                                                </Form.Label>
                                                                                                <Form.Control
                                                                                                    type="text"
                                                                                                    placeholder="Latitude et Longitude"
                                                                                                    name={name}
                                                                                                    value={formData[selectedPointageId]?.[name] || ''}
                                                                                                    onChange={handleChangee}
                                                                                                />
                                                                                            </Form.Group>
                                                                                        ))}

                                                                                        {/* Champs Heures */}
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
                                                                                                    value={formData[selectedPointageId]?.[name] || ''}
                                                                                                    onChange={handleChangee}
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
                                                                                                value={formData[selectedPointageId]?.justificationret || ''}
                                                                                                onChange={handleChangee}
                                                                                                placeholder="Entrez votre justification ici..."
                                                                                            />
                                                                                        </Form.Group>
                                                                                    </div>
                                                                                </Modal.Body>
                                                                                <Modal.Footer>
                                                                                    <Button variant="secondary" onClick={handleCloseModalStatut}>
                                                                                        Annuler
                                                                                    </Button>
                                                                                    <Button variant="primary" onClick={ModifierPointage}>
                                                                                        Enregistrer
                                                                                    </Button>
                                                                                </Modal.Footer>
                                                                            </Modal>

                                                                        </td>}
                                                                    </tr>
                                                                ))}
                                                            </tbody>
                                                        </table>
                                                    </div>

                                                    {showcart && <Cart lat={adresseclick.lat} lon={adresseclick.long} showcart={showcart} setShowcart={setShowcart}
                                                        EcolePosition={EcolePosition} color={adresseclick.color} id={adresseclick.id} />}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>
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
                        <div className="tab-pane fade" id="formulaire" role="tabpanel" aria-labelledby="custom-content-below-profile-tab">
                            Ajouter
                        </div>
                    </div>
                </div>





            </div>
        </>
    );
}

export default PointageLocalisation;