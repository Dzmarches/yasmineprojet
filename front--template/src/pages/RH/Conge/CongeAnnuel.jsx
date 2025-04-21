import React, { useEffect, useState } from 'react';
import axios from 'axios';
import conge from '../../../assets/imgs/leave.png';
import edit from '../../../assets/imgs/edit.png';
import archive from '../../../assets/imgs/archive.png';

const CongeAnnuel = () => {
    const [errorMessage, setErrorMessage] = useState("");
    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState(data);
    const [values, setValues] = useState({
        dateDebut: '',
        dateFin: ''
    });
    const [filterValues, setFilterValues] = useState({
        filterDateDebut: '',
        filterDateFin: ''
    });

    const [editingId, setEditingId] = useState(null);
    const [editValues, setEditValues] = useState({ dateDebut: '', dateFin: '' });

    
    const handleChange = (e) => {
        setValues({ ...values, [e.target.name]: e.target.value });
    };

    const handleFilterChange = (e) => {
        setFilterValues({ ...filterValues, [e.target.name]: e.target.value });
    };

    const handleEditChange = (e) => {
        setEditValues({ ...editValues, [e.target.name]: e.target.value });
    };

    const filterData = () => {
        const { filterDateDebut, filterDateFin } = filterValues;
        const filtered = data.filter(item => {
            const itemDateDebut = new Date(item.dateDebut);
            const itemDateFin = new Date(item.dateFin);
            const startDate = new Date(filterDateDebut);
            const endDate = new Date(filterDateFin);
            return (!filterDateDebut || itemDateDebut >= startDate) && 
                   (!filterDateFin || itemDateFin <= endDate);
        });
        setFilteredData(filtered);
    };

    const validateDates = (dateDebut, dateFin) => {
        const startDate = new Date(dateDebut);
        const endDate = new Date(dateFin);
        if (startDate >= endDate) {
            setErrorMessage("La date de début doit être inférieure à la date de fin.");
            return false;
        }
        setErrorMessage("");
        return true;
    };

    const AjouterCA = async () => {
        try {
            
            if (!validateDates(values.dateDebut, values.dateFin)) return;

            const token = localStorage.getItem("token");
            if (!token) {
                alert("Vous devez être connecté ");
                return;
            }
            const response = await axios.post('http://localhost:5000/congeAbsence/AjouterCAnnuel', values, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });
            if (response.status === 201) {
                alert("Formulaire soumis avec succès!");
                setValues({
                    dateDebut: '',
                    dateFin: '',
                });
                ListeCA(); 
                
            }
        } catch (error) {
            console.error("Erreur lors de l'ajout des congés annuels par défaut:", error);
            if (error.response) {
                alert(`Erreur serveur: ${error.response.data.message}`);
            } else if (error.request) {
                alert("Erreur de réseau. Veuillez vérifier votre connexion Internet.");
            } else {
                alert("Une erreur inattendue s'est produite.");
            }
        }
    };

    const ListeCA = async () => {
        try {
               
            const token = localStorage.getItem("token");
            if (!token) {
                alert("Vous devez être connecté ");
                return;
            }
            const response = await axios.get('http://localhost:5000/congeAbsence/ListeCAnnuel',
               { 
                headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",

            },}
            );
            setData(response.data);
            setFilteredData(response.data); 
        } catch (error) {
            console.error("Erreur lors de la récupération", error);
        }
    };

    const handleEdit = (item) => {
        setEditingId(item.id);
        setEditValues({ dateDebut: item.dateDebut, dateFin: item.dateFin });
    };

    const handleSaveEdit = async (id) => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                alert("Vous devez être connecté ");
                return;
            }
            if (!validateDates(editValues.dateDebut, editValues.dateFin)) return;
            const response = await axios.put(`http://localhost:5000/congeAbsence/ModifierCAnnuel/${id}`, editValues,
                { 
                    headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                    
                },}
            );
            if (response.status === 200) {
                alert("Congé annuel modifié avec succès!");
                setEditingId(null); // Masquer le formulaire d'édition
                ListeCA(); // Rafraîchir la liste
            }
        } catch (error) {
            console.error("Erreur lors de la modification du congé annuel:", error);
            if (error.response) {
                alert(`Erreur serveur: ${error.response.data.message}`);
            } else if (error.request) {
                alert("Erreur de réseau. Veuillez vérifier votre connexion Internet.");
            } else {
                alert("Une erreur inattendue s'est produite.");
            }
        }
    };

    const ArchiverCAnnuel = async (id) => {
      try {
        const token = localStorage.getItem("token");
            if (!token) {
                alert("Vous devez être connecté ");
                return;
            }
            const response = await axios.patch(
                `http://localhost:5000/congeAbsence/ArchiverCAnnuel/${id}`,
                {}, 
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                  },
                }
              );
        console.log(response.data)
        if(response.status===200){

           ListeCA();
        }
        // setdata(response.data)
        // setFilteredData(response.data);
      } catch (error) {
        console.log("Erreur", error)
      }
  
    }

    useEffect(() => {
        ListeCA();
    }, []);

    useEffect(() => {
        filterData(); 
    }, [data, filterValues]);


    // Pagination
    const itemsPerPage = 6;
    const [currentPage, setCurrentPage] = useState(1);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };
    const pageNumbers = [];
    for (let i = Math.max(1, currentPage - 2); i <= Math.min(currentPage + 2, totalPages); i++) {
        pageNumbers.push(i);
    }


    return (
        // modal-dialog-scrollable
        <div className="modal fade" id="congeAnnuel" tabIndex="-1" aria-labelledby="modal-default-label" aria-hidden="true">
            <div className="modal-dialog modal-lg ">
                <div className="modal-content">
                    <div className="modal-header bg-info text-white">
                        <div className="widget-user-header d-flex align-items-center">
                            <div className="widget-user-image">
                                <img src={conge} alt="Congé" width="70px" />
                            </div>
                        </div>
                        <button type="button" className="close text-white" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div className="modal-body"  >
                        <h5 className="custom-title">Ajouter une période pour le congé annuel</h5>
                        <div className="card shadow-lg border-0 rounded-lg p-3 ">
                            <div className="row">
                                <div className="col-md-6 mb-3">
                                    <label htmlFor="dateDebut" className="font-weight-bold">Date début :</label>
                                    <input
                                        type="date"
                                        id="dateDebut"
                                        name="dateDebut"
                                        value={values.dateDebut} 
                                        className="form-control"
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label htmlFor="dateFin" className="font-weight-bold">Date fin :</label>
                                    <input
                                        type="date"
                                        id="dateFin"
                                        name="dateFin"
                                        value={values.dateFin}
                                        className="form-control"
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                            {errorMessage && (
                                <div className="alert alert-danger ">
                                    {errorMessage}
                                </div>
                            )}
                            <div className="col-12 text-center ">
                                <button className='btn btn-outline-primary' onClick={AjouterCA}>Ajouter</button>
                            </div>
                        </div>
                    </div>
                    <div className="modal-body">
                        <h5 className="custom-title">Filtrer par dates</h5>
                        <div className="card shadow-lg border-0 rounded-lg p-3 ">
                            <div className="row">
                                <div className="col-md-6 mb-3">
                                    <label htmlFor="filterDateDebut" className="font-weight-bold">Date début :</label>
                                    <input
                                        type="date"
                                        id="filterDateDebut"
                                        name="filterDateDebut"
                                        className="form-control"
                                        onChange={handleFilterChange}
                                    />
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label htmlFor="filterDateFin" className="font-weight-bold">Date fin :</label>
                                    <input
                                        type="date"
                                        id="filterDateFin"
                                        name="filterDateFin"
                                        className="form-control"
                                        onChange={handleFilterChange}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="modal-body" >
                        <div className="card shadow-lg border-0 rounded-lg  " style={{ marginTop: "-44px" }}>
                            <table id="example2" className="table table-bordered">
                                <thead>
                                    <tr>
                                        <th>Id</th>
                                        <th>Date Début</th>
                                        <th>Date Fin</th>
                                        <th>Ecole</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentItems.map((item, index) => (
                                        <tr key={index}>
                                            <td>{indexOfFirstItem + index + 1}</td>
                                            {editingId === item.id ? (
                                                <>
                                                    <td>
                                                        <input
                                                            type="date"
                                                            name="dateDebut"
                                                            value={editValues.dateDebut}
                                                            onChange={handleEditChange}
                                                            className="form-control"
                                                        />
                                                    </td>
                                                    <td>
                                                        <input
                                                            type="date"
                                                            name="dateFin"
                                                            value={editValues.dateFin}
                                                            onChange={handleEditChange}
                                                            className="form-control"
                                                        />
                                                    </td>
                                                    <td>
                                                        <button className="btn btn-outline-success" onClick={() => handleSaveEdit(item.id)}>Enregistrer</button>
                                                        <button className="btn btn-outline-secondary ml-2" onClick={() => setEditingId(null)}>Annuler</button>
                                                    </td>
                                                </>
                                            ) : (
                                                <>
                                                    <td>{item.dateDebut}</td>
                                                    <td>{item.dateFin}</td>
                                                    <td>{item.EcolePrincipal?.nomecole}</td>
                                                    <td>
                                                        <button className="btn btn-outline-success" onClick={() => handleEdit(item)}>
                                                            <img src={edit} alt="" width="24px" title='modifier' />
                                                        </button>
                                                        &nbsp; &nbsp; &nbsp;
                                                        <button className='btn btn-outline-warning' >
                                                            <img src={archive} alt="" width="22px" title='Archiver' onClick={() => ArchiverCAnnuel(item.id)}  />
                                                        </button>
                                                    </td>
                                                </>
                                            )}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                         {/* Pagination */}
                    <div className="pagination d-flex justify-content-end">
                        <button
                            className="btn btn-outline-primary"
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                        >
                            Previous
                        </button>
                        {pageNumbers.map((number) => (
                            <button
                                key={number}
                                className={`btn ${currentPage === number ? 'btn-outline-primary' : 'btn-light'}`}
                                onClick={() => handlePageChange(number)}
                            >
                                {number}
                            </button>
                        ))}
                        <button
                            className="btn btn-outline-primary"
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                        >
                            Next
                        </button>
                    </div>
                    </div>
                   
                </div>
            </div>
        </div>
    );
};

export default CongeAnnuel;