import React, { useState, useEffect } from 'react';
import excel from '../../../assets/imgs/excel.png';
import importexel from '../../../assets/imgs/import.png';
import printer from '../../../assets/imgs/printer.png';
import add from '../../../assets/imgs/add.png';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Modal, Button } from 'react-bootstrap';
import * as XLSX from 'xlsx';
import Select from 'react-select';
import ProfileEmploye from '../Employes/ProfileEmploye.jsx';
import rh from '../../../assets/imgs/employe.png';
import edit from '../../../assets/imgs/edit.png';
import archive from '../../../assets/imgs/archive.png';
import recherche from '../../../assets/imgs/recherche.png';
import show from '../../../assets/imgs/vu.png';
import axios from 'axios';
import moment from 'moment';
import utilisateur from '../../../assets/imgs/utilisateur.png';


const VoirFichesPaie = () => {
  const url = "http://localhost:5000"
  const [data, setdata] = useState([])
  const [selectedBulletins, setSelectedBulletins] = useState([]);
  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedEmployeId, setSelectedEmployeId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [periodeSelectionnee, setPeriodeSelectionnee] = useState(null);
  const [periodesPaie, setPeriodesPaie] = useState([]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handlePeriodeChange = (selectedOption) => {
    setPeriodeSelectionnee(selectedOption.value);
  }


  const filteredData = data.filter(item => {
    const matchesPeriode = !periodeSelectionnee || item.PeriodePaie?.id === periodeSelectionnee;

    const periodePaieString = item.PeriodePaie
        ? `${new Date(item.PeriodePaie.dateDebut).toLocaleDateString('fr-FR', { month: 'long' }).toUpperCase()} - ${new Date(item.PeriodePaie.dateFin).toLocaleDateString('fr-FR', { month: 'long' }).toUpperCase()}`
        : '';

    const search = searchTerm.toLowerCase().trim();

    const matchesSearchTerm = search === '' || (
      (item.nom_prenom && item.nom_prenom.toLowerCase().includes(searchTerm.toLowerCase().trim())) ||
      (item?.Employe?.daterecru && item.Employe.daterecru.toString().includes(searchTerm.toLowerCase().trim())) ||
      (item.salaireBase && item.salaireBase.toString().includes(searchTerm.toLowerCase().trim())) ||
      (item?.salaireNet && item?.salaireNet.toLowerCase().includes(searchTerm.toLowerCase().trim())) ||
      (item?.salaireNet && item?.salaireNet.toLowerCase().includes(searchTerm.toLowerCase().trim())) ||
      (periodePaieString && periodePaieString.toLowerCase().includes(searchTerm.toLowerCase().trim())) ||
      (item?.statut && item?.statut.toLowerCase().includes(searchTerm.toLowerCase().trim())) ||
      (item.Employe?.Poste?.poste && item.Employe?.Poste?.poste.toLowerCase().includes(searchTerm.toLowerCase().trim()))||
        (
            item.Employe?.declaration !== undefined &&
            (
                (search === 'oui' && item.Employe.declaration === true) ||
                (search === 'non' && item.Employe.declaration === false)
            )
        ) ||
        (
            item.Employe?.User?.statuscompte !== undefined &&
            (
                (search === 'employé' && item.Employe.User.statuscompte.toLowerCase() === 'activer') ||
                (search === 'non employé' && item.Employe.User.statuscompte.toLowerCase() === 'désactiver')
            )
        )
    );

    return matchesPeriode && matchesSearchTerm;
});

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(data.length / itemsPerPage);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const pageNumbers = [];
  for (let i = Math.max(1, currentPage - 2); i <= Math.min(currentPage + 2, totalPages); i++) {
    pageNumbers.push(i);
  }

  const handlePrint = (bulletinHTML) => {
    const printWindow = window.open("", "_blank");
    printWindow.document.write(bulletinHTML);
    printWindow.document.close();
    printWindow.print();
  };

  const handleCheckboxChange = (bulletinId) => {
    setSelectedBulletins(prev => {
      if (prev.includes(bulletinId)) {
        return prev.filter(id => id !== bulletinId);
      } else {
        return [...prev, bulletinId];
      }
    });
  };

  const toggleSelectAll = () => {
    const currentPageIds = filteredData
      .slice(indexOfFirstItem, indexOfLastItem)
      .map(item => item.id);

    if (currentPageIds.every(id => selectedBulletins.includes(id))) {
      setSelectedBulletins(prev => prev.filter(id => !currentPageIds.includes(id)));
    } else {
      setSelectedBulletins(prev => [
        ...prev,
        ...currentPageIds.filter(id => !prev.includes(id))
      ]);
    }
  };

  const handlePrintSelected = () => {
    if (selectedBulletins.length === 0) {
      alert("Veuillez sélectionner au moins un bulletin à imprimer");
      return;
    }
    const printWindow = window.open("", "_blank");
    let htmlContent = `
      <html>
        <head>
          <title>Bulletins de paie sélectionnés</title>
          <style>
            .bulletin-container { margin-bottom: 50px; page-break-after: always; }
            .bulletin-container:last-child { page-break-after: auto; }
          </style>
        </head>
        <body>
    `;

    data
      .filter(item => selectedBulletins.includes(item.id))
      .forEach(item => {
        htmlContent += `
          <div class="bulletin-container">
            ${item.bulletin_html || "<p>Contenu du bulletin non disponible</p>"}
          </div>
        `;
      });

    htmlContent += `</body></html>`;
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    printWindow.print();
  };

  const handleSave = async (idEmploye) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Vous devez être connecté pour effectuer cette action.");
      return;
    }
    try {
      const response = await axios.get('http://localhost:5000/BultteinPaie/journalPaie/VoirFichesPaie', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.status === 200) {
        setdata(response.data);
      }
    } catch (error) {
      console.error("Erreur lors de l'enregistrement du bulletin de paie", error);
      alert("Une erreur s'est produite lors de l'enregistrement.");
    }
  };
  const fetchPeriodesPaie = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Vous devez être connecté");
        return;
      }
      const response = await axios.get("http://localhost:5000/PeriodePaie/liste", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      const donnees = response.data.filter(item => item.statut === 'Clôturée');
      setPeriodesPaie(donnees);

    } catch (error) {
      console.error("Erreur lors de la récupération des périodes de paie", error);
    }
  };

  useEffect(() => {
    handleSave();
    fetchPeriodesPaie();
  }, []);

  const handlePublierSelected = async () => {
    if (selectedBulletins.length === 0) {
      alert("Veuillez sélectionner au moins un bulletin à publier.");
      return;
    }
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Vous devez être connecté");
      return;
    }
    try {
      const response = await axios.put(
        "http://localhost:5000/BultteinPaie/journalPaie/publier",
        { bulletins: selectedBulletins },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (response.status === 200) {
        alert("Les bulletins ont été publiés avec succès !");
        handleSave();
        setSelectedBulletins([]);
      }
    } catch (error) {
      console.error("Erreur lors de la publication des bulletins", error);
      alert("Une erreur est survenue lors de la publication.");
    }
  };

  const handlePublier = async (bulletinId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Vous devez être connecté");
      return;
    }
    try {
      const response = await axios.put(
        "http://localhost:5000/BultteinPaie/journalPaie/publier",
        { bulletins: [bulletinId] },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (response.status === 200) {
        alert("Le bulletin a été publié avec succès !");
        handleSave();
      }
    } catch (error) {
      console.error("Erreur lors de la publication du bulletin", error);
      alert("Une erreur est survenue lors de la publication.");
    }
  };

  return (
    <>
      <nav>
        <Link to="/dashboard" className="text-primary">Dashboard</Link>
        <span> / </span>
        <Link to="/Gpaiement" className="text-primary">Gestion Paie</Link>
        <span> / </span>
        <span> Liste des employés avec leur bulletin de paie  </span>
      </nav>
      <div className="card card-primary card-outline">
        <div className="card-header d-flex ">
          <img src={rh} alt="" width="90px" />
          <p className="card-title mt-5 ml-2 p-2 text-center" style={{ width: '350px', borderRadius: '50px', border: '1px solid rgb(215, 214, 216)' }}>
            les  Bulletins de paie des employés
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
                        <div className="card-header p-2" style={{ backgroundColor: "#f8f8f8" }}>
                          <div className='row mt-3'>
                            <div className="col-md-4">
                              <button
                                className="btn btn-primary-outline border"
                                onClick={handlePrintSelected}
                                disabled={selectedBulletins.length === 0}>
                                <img src={printer} alt="imprimer" width="20px" style={{ marginRight: '5px' }} title='imprimer' />
                                ({selectedBulletins.length})
                              </button>

                              <button
                                className="btn btn-primary-outline ml-2 border"
                                onClick={handlePublierSelected}
                                disabled={selectedBulletins.length === 0}
                              >
                                <img src={show} alt="publlier" width="20px" style={{ marginRight: '5px' }} title='publier' />
                                ({selectedBulletins.length})
                              </button>
                            </div>

                            <div className="col-md-4" style={{ flex: '1', marginRight: '10px' }}>
                              <div className="input-group mr-2">
                                <div className="form-outline" data-mdb-input-init> <input
                                  type="search"
                                  id="form1"
                                  className="form-control"
                                  placeholder="Recherche"
                                  style={{ height: "38px" }}
                                  value={searchTerm}
                                  onChange={handleSearchChange}
                                />
                                </div>
                                <div style={{ background: "rgb(202, 200, 200)", padding: "3px", height: "37px", borderRadius: "2px" }}>
                                  <img src={recherche} alt="" height="30px" width="30px" />
                                </div>
                              </div>
                            </div>

                            <div className="col-md-4">
                              <div className="mb-3">
                                <Select
                                  id="periode-select"
                                  options={periodesPaie.map((periode) => ({
                                    value: periode.id,
                                    label: `
                                    ${new Date(periode?.dateDebut).toLocaleDateString('fr-FR', { month: 'long' }).toUpperCase()}-
                                     ${new Date(periode?.dateFin).toLocaleDateString('fr-FR', { month: 'long' }).toUpperCase()}
                                      `,
                                  }))}
                                  onChange={handlePeriodeChange}
                                  placeholder="Sélectionnez une période"
                                />
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="card-body mt-2">
                          <table id="example2" className="table table-bordered ">
                            <thead>
                              <tr>
                                <th>
                                  <input
                                    type="checkbox"
                                    onChange={toggleSelectAll}
                                    checked={filteredData
                                      .slice(indexOfFirstItem, indexOfLastItem)
                                      .every(item => selectedBulletins.includes(item.id))}
                                  />
                                </th>
                                <th>Id</th>
                                <th>Photo</th>
                                <th>Nom Prénom</th>
                                <th>Poste attribué</th>
                                <th>Date du recrutement</th>
                                <th>Salaire de base</th>
                                <th>Période</th>
                                <th>Salaire Net</th>
                                <th>Statut</th>
                                <th>Déclaration CNAS</th>
                                 <th>Actuellement employé</th>
                                <th>Action</th>
                              </tr>
                            </thead>
                            <tbody>
                              {filteredData.slice(indexOfFirstItem, indexOfLastItem).map((item, index) => (
                                <tr key={index} className="p-1 align-middle">
                                  <td>
                                    <input
                                      type="checkbox"
                                      checked={selectedBulletins.includes(item.id)}
                                      onChange={() => handleCheckboxChange(item.id)}
                                    />
                                  </td>
                                  <td>{indexOfFirstItem + index + 1}</td>
                                  <td>
                                    <img className="ronde" src={item.Employe?.photo ? url + item.Employe?.photo : utilisateur} alt="Photo de l'employé" />
                                  </td>
                                  <td> {item.nom_prenom} </td>
                                  <td>{item.Employe?.Poste ? item.Employe?.Poste.poste : 'Poste non défini'}</td>
                                  <td>{moment(item.Employe?.daterecru).format('YYYY-MM-DD')}</td>
                                  <td>{item.salaireBase} DZD</td>
                                  <td>
                                    {new Date(item.PeriodePaie?.dateDebut).toLocaleDateString('fr-FR', { month: 'long' }).toUpperCase()} -
                                    {new Date(item.PeriodePaie?.dateFin).toLocaleDateString('fr-FR', { month: 'long' }).toUpperCase()}
                                  </td>
                                  <td>{item.salaireNet} DZD</td>
                                  <td>{item.statut}</td>
                                  <td>{item.Employe.declaration == 1 ? 'Oui' : 'Non'}</td>
                                  <td>{item.Employe?.User?.statuscompte==='activer' ? 'Employé':'Non Employé'}</td>
                                  <td className="d-flex align-items-center gap-1">
                                    <button className="btn btn-outline d-flex justify-content-center align-items-center p-1"
                                      style={{ width: "35px", height: "35px", marginRight: '12px' }}
                                      onClick={() => handlePrint(item.bulletin_html)}>
                                      <img src={printer} alt="imprimer" width="22px" title=' Imprimer le  Bultein de paie' />
                                    </button>

                                    <button className="btn btn-outline d-flex justify-content-center align-items-center p-1"
                                      style={{ width: "35px", height: "35px", marginRight: '12px' }}
                                      onClick={() => handlePublier(item.id)}>
                                      <img src={show} alt="publier" width="22px" title='publier' />
                                    </button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
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
          </div>
        </div>
      </div>
    </>
  );
}

export default VoirFichesPaie;