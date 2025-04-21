import React, { useState, useEffect } from 'react';
import excel from '../../assets/imgs/excel.png';
import importexel from '../../assets/imgs/import.png';
import printer from '../../assets/imgs/printer.png';
import add from '../../assets/imgs/add.png';
import { Link, useNavigate } from 'react-router-dom';
import { Modal, Button } from 'react-bootstrap';
import * as XLSX from 'xlsx';
import Select from 'react-select';
import ProfileEmploye from './ProfileEnseignant';
import rh from '../../assets/imgs/employe.png';
import edit from '../../assets/imgs/edit.png';
import archive from '../../assets/imgs/archive.png';
import recherche from '../../assets/imgs/recherche.png';
import axios from 'axios';
import moment from 'moment';
import classesIcon  from '../../assets/imgs/section.png';


const Employes = () => {
  const url = "http://localhost:5000"

  const [data, setdata] = useState([])
  const [showModal, setShowModal] = useState(false);
  const [fileName, setFileName] = useState('');
  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedEmployeId, setSelectedEmployeId] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [showPrintOptions, setShowPrintOptions] = useState(false);
  const [showPrintOptionsME, setShowPrintOptionsME] = useState(false);
  const [selectedPrintOption, setSelectedPrintOption] = useState('');
  const [printOptions, setPrintOptions] = useState([]);
  const [EmployeConnecte, setEmployeConnecte] = useState(null);
  const [ModeleDoc, setModeleDoc] = useState([]);
  const navigate = useNavigate();
  const [matieres, setMatieres] = useState([]);

  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };
  const filteredData = data.filter(item => {
    // Vous pouvez filtrer en fonction de n'importe quel champ. Exemple ici : 'nom' et 'prenom'
    return (item.User?.nom && item.User?.nom.toLowerCase().includes(searchTerm.toLowerCase().trim())) ||
      (item.User?.prenom && item.User?.prenom.toLowerCase().includes(searchTerm.toLowerCase().trim())) ||
      (item.User?.email && item.User?.email.toLowerCase().includes(searchTerm.toLowerCase().trim())) || // Filtrage par nom, prénom et mail
      (item.User?.telephone && item.User?.telephone.includes(searchTerm)) || // Filtrage par nom, prénom et mail
      (item.Poste.poste && item.Poste.poste.toLowerCase().includes(searchTerm.toLowerCase().trim()));
  });

  const handleProfileClick = (id) => {
    setSelectedEmployeId(id);
  };

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  const handleDownloadTemplate = () => {
    const ws = XLSX.utils.aoa_to_sheet([["Nom", "Prénom", "Email"]]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Etudiants");
    XLSX.writeFile(wb, "etudiants_template.xlsx");
  };
  const handleFileChange = (event) => {
    setFileName(event.target.files[0].name);
  };
  const handleImport = () => {
    alert('Importation en cours...');
  };

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




  // const handleChangePostes = (selected) => {
  //   setSelectedOptions(selected);
  // };
  // Personnaliser le rendu des options dans le menu déroulant
  const formatOptionLabel = ({ label, value }, { context }) => {
    // Si l'option est sélectionnée, appliquer un style bleu
    if (context === 'menu' && selectedOptions.some((opt) => opt.value === value)) {
      return <div style={{ color: 'blue' }}>{label}</div>;
    }
    // Sinon, retourner le label normal
    return label;

  };
  const handleExport = () => {
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Liste des employés");
    XLSX.writeFile(wb, "liste_employes.xlsx");
  };

  //-------------------------- call-backend ------------------------------------//

  useEffect(() => {
    handleListeEmploye()
    //  handleListePostes();
  }, [])

  const handleListeEmploye = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Vous devez être connecté");
        return;
      }
      const response = await axios.get('http://localhost:5000/enseignant/liste', {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      console.log('liste des employe', response.data)
      setdata(response.data)
      // setFilteredData(response.data);
    } catch (error) {
      console.log("Erreur lors de la récupération des employes", error)
    }

  }




  const ArchiverEmploye = async (id) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Vous devez être connecté");
        return;
      }
      const response = await axios.patch(`http://localhost:5000/enseignant/archiver/${id}`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      await handleListeEmploye();
      console.log(response.data)
      // setdata(response.data)
      // setFilteredData(response.data);
    } catch (error) {
      console.log("Erreur", error)
    }
  }
  //imprimeeeerrrr
  useEffect(() => {
    handleListeDE()
  }, [])


  const handleListeDE = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Vous devez être connecté");
        return;
      }
      const response = await axios.get('http://localhost:5000/attestation/liste',
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log(response.data);

      // Transformer les données reçues en format { value: '...', label: '...' }
      const options = response.data.map((doc) => ({
        value: doc.id, // Utilisez l'ID ou un autre champ unique comme valeur
        label: doc.nom, // Utilisez le nom du document comme libellé
        modele: doc.modeleTexte
      }));

      setPrintOptions(options); // Mettre à jour l'état des options d'impression
    } catch (error) {
      console.log("Erreur lors de la récupération des attestations", error);
    }
  };
  // Gérer le clic sur le bouton "Imprimer"
  const handlePrintClick = () => {
    setShowPrintOptions(!showPrintOptions);
  };
  const handlePrintClickMe = () => {
    setShowPrintOptionsME(!showPrintOptionsME);
  };

  // Gérer la sélection d'un modèle
  const handlePrintOptionSelect = (option) => {
    setSelectedPrintOption(option.value);
    setShowPrintOptions(false); // Masquer la liste déroulante après la sélection
    navigate('/documentImprimer', { state: { selectedOption: option } });
    // alert(`Vous avez sélectionné : ${option.label}`); // Afficher un message (à remplacer par votre logique)
  };

  const handlePrintOptionSelectME = (option) => {
    setSelectedPrintOption(option.value);
    setShowPrintOptionsME(false);

    handlePrint(EmployeConnecte, option.modele, option.label);
    // navigate('/mesdocs', { state: { selectedOption: option } });

  };

  const handlePrint = (employe, modeleText, nomDoc) => {
    if (!employe || !modeleText || !nomDoc) {
      console.error("Employé ou modèle de texte non défini");
      return;
    }
    const dateToday = moment().format('DD/MM/YYYY');

    const modeleTextupdate = modeleText
      .replace(/\[nomecole\]/g, employe.User?.Ecoles?.map(ecole => ecole.nomecole).join(', ') || "")
      .replace(/\[nomecoleP\]/g, employe.User?.EcolePrincipal?.nomecole || "" || "")
      .replace(/\[nom\]/g, employe.User.nom || "")
      .replace(/\[prenom\]/g, employe.User.prenom || "")
      .replace(/\[datenaiss\]/g, employe.User.datenaiss ? moment(employe.datenaiss).format('DD/MM/YYYY') : "")
      .replace(/\[Lieunais\]/g, employe.User.Lieunais || "")
      .replace(/\[poste\]/g, employe.Poste?.poste?.toLowerCase() || "")
      .replace(/\[daterecru\]/g, employe.daterecru ? moment(employe.daterecru).format('DD/MM/YYYY') : "")
      .replace(/\[dateToday\]/g, dateToday)
      .replace(/\[N°AS\]/g, employe.NumAS || "");
    // Créer un iframe pour l'impression
    console.log(modeleTextupdate)
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    document.body.appendChild(iframe);

    const iframeDocument = iframe.contentWindow.document;
    iframeDocument.open();
    // @page{ margin: 0;}
    iframeDocument.write(`
        <html>
          <head>
            <title>${employe.nom}.${employe.prenom}</title>
            <style>
              @media print {
                body { margin: 0 !important ; padding: 40px !important ; }
                table {
                  border-collapse: collapse;
                  width: 100%;
                }
                table, th, td {
                  border: 1px solid #EBEBEB;
                }
              }
            </style>
          </head>
          <body>
          <body>
            <div class="containerEditor">
              <div class="ql-editor">
                ${modeleTextupdate}
              </div>
            </div>
          </body>
        </html>
      `);
    iframeDocument.close();
    const originalTitle = document.title;
    // const nomDocc=nomDoc.replace(/\s+/g, '').toUpperCase();
    document.title = `${nomDoc.toUpperCase()}_${employe.nom}.${employe.prenom}`;
    setTimeout(() => {
      iframe.contentWindow.focus();
      iframe.contentWindow.print();
      document.title = originalTitle;
      document.body.removeChild(iframe);
    }, 1000);
  };

  const fetchEmployeConnecte = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Vous devez être connecté ");
        return;
      }
      console.log('heare')
      const response = await axios.get('http://localhost:5000/enseignant/me', {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      console.log('employes', response.data)
      setEmployeConnecte(response.data);
      console.log(response.data)

    } catch (error) {
      console.error("Erreur lors de la récupération des informations de l'employé :", error);
      // alert(error.response?.data?.message || "Une erreur est survenue. Veuillez réessayer.");
    }
  };

  useEffect(() => {
    fetchEmployeConnecte();
  }, []);


  //securisé les images 

  // const ImageProtegee = ({ imagePath }) => {
  //     const [imageSrc, setImageSrc] = useState("");

  //     useEffect(() => {
  //         const fetchImage = async () => {
  //             try {
  //                 const response = await fetch(`http://localhost:5000${imagePath}`, {
  //                     headers: {
  //                         Authorization: `Bearer ${localStorage.getItem('token')}`
  //                     }
  //                 });

  //                 if (!response.ok) {
  //                     throw new Error("Erreur lors du chargement de l'image");
  //                 }
  //                 const imageBlob = await response.blob();
  //                 setImageSrc(URL.createObjectURL(imageBlob));
  //             } catch (error) {
  //                 console.error(error);
  //             }
  //         };

  //         fetchImage();
  //     }, [imagePath]);

  //     return imageSrc ? <img src={imageSrc} alt="Photo de l'employé" width="60px"/> : <p>Chargement...</p>;
  // };



  

  return (
    <>
      <nav>

        <Link to="/dashboard" className="text-primary">Accueil</Link>
        <span> / </span>
        <span>Gestion des  enseignant</span>
      </nav>
      <div className="card card-primary card-outline">
        <div className="card-header d-flex ">
          <img src={rh} alt="" width="90px" />
          <p className="card-title mt-5 ml-2 p-2 text-center" style={{ width: '350px', borderRadius: '50px', border: '1px solid rgb(215, 214, 216)' }}>
            Gestion des  enseignant
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
                            <div className="button-container" style={{ marginTop: '20px' }}>
                            </div>
                            <div className='col-md-4'>
                              <div className="btn-group">
                                <button className='btn btn-app p-1' onClick={handlePrintClickMe}>
                                  <img src={printer} alt="" width="30px" /><br />Mes documents
                                </button>
                                {showPrintOptionsME && (
                                  <div className="dropdown-menu show">
                                    {printOptions.map((option) => (
                                      <button
                                        key={option.value}
                                        className="dropdown-item"
                                        onClick={() => { handlePrintOptionSelectME(option) }}
                                      >
                                        {option.label}
                                      </button>
                                    ))}
                                  </div>
                                )}
                              </div>

                              <div className="btn-group">
                                <button className='btn btn-app p-1' onClick={handlePrintClick}>
                                  <img src={printer} alt="" width="30px" /><br />Imprimer
                                </button>
                                {showPrintOptions && (
                                  <div className="dropdown-menu show">
                                    {printOptions.map((option) => (
                                      <button
                                        key={option.value}
                                        className="dropdown-item"
                                        onClick={() => { handlePrintOptionSelect(option) }}
                                      >
                                        {option.label}
                                      </button>
                                    ))}
                                  </div>
                                )}
                              </div>



                              {/* <a className='btn btn-app p-1' href="#" onClick={handleShowModal}>
                                <img src={importexel} alt="" width="30px" /><br />Importer
                              </a> */}
                              <Modal show={showModal} onHide={handleCloseModal}>
                                <Modal.Header className="text-center">
                                  <Modal.Title>Importer des étudiants</Modal.Title>
                                  <button
                                    type="button"
                                    className="btn-close"
                                    aria-label="Close"
                                    onClick={handleCloseModal}
                                    style={{ background: "none", border: "none" }}
                                  ></button>
                                </Modal.Header>
                                <Modal.Body>
                                  <div className="text-center">
                                    <button
                                      className="btn btn-success mb-3"
                                      onClick={handleDownloadTemplate}
                                    >
                                      Créer et télécharger le formulaire d'importation
                                    </button>
                                    <div className="custom-file mb-3">
                                      <input
                                        type="file"
                                        className="custom-file-input"
                                        id="customFile"
                                        onChange={handleFileChange}
                                      />
                                      <label className="custom-file-label" htmlFor="customFile">
                                        {fileName || "aucun fichier choisi"}
                                      </label>
                                    </div>
                                    <button
                                      className="btn btn-primary mb-3"
                                      onClick={handleImport}
                                    >
                                      Début de l'importation
                                    </button>
                                  </div>
                                  <div className="modal-footer">
                                    <button
                                      className="btn btn-secondary"
                                      onClick={handleCloseModal}
                                    >
                                      Annuler
                                    </button>
                                  </div>
                                </Modal.Body>
                              </Modal>
                              <a className='btn btn-app p-1' href="#" onClick={handleExport}>
                                <img src={excel} alt="" width="25px" /><br />Exporter
                              </a>
                            </div>
                            <div className='col-md-4'>

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
                          </div>
                        </div>
                        <div className="card-body mt-2">
                          <table id="example2" className="table table-bordered ">
                            <thead>
                              <tr>
                                <th>Id</th>
                                <th>Photo</th>
                                <th>Nom Prénom</th>
                                <th>Email</th>
                                <th>Numéro de téléphone</th>
                                <th>Poste attribué</th>
                                <th>Action</th>
                              </tr>
                            </thead>
                            <tbody>
                              {filteredData.slice(indexOfFirstItem, indexOfLastItem).map((item, index) => (
                                // {currentItems.map((item, index) => (
                                <tr key={index}>
                                  <td>{indexOfFirstItem + index + 1}</td>
                                  <td>
                                    {/* <ImageProtegee imagePath={item.photo} /> */}
                                    <p></p>
                                    <img src={url + item.photo} alt="Photo de l'employé" width="60px" />
                                  </td>
                                  <td>{item.User?.nom} {item.User?.prenom}</td>
                                  <td>{item.User?.email}</td>
                                  <td>{item.User?.telephone}</td>
                                  <td>{item.Poste ? item.Poste.poste : 'Poste non défini'}</td>
                                  <td>
                                    <button className='btn btn-outline-primary ' data-toggle="modal" data-target="#modal-default">
                                      <img src={rh} alt="" width="22px" title='profile' onClick={() => handleProfileClick(item.id)} />
                                    </button>&nbsp; &nbsp; &nbsp;
                                    <Link className="btn btn-outline-success" to={`/enseignant/modifier/${item.id}`} style={{ height: "45px" }}>
                                      <img src={edit} alt="" width="24px" title='modifier' />
                                    </Link>
                                    &nbsp; &nbsp; &nbsp;
                                    <button className='btn btn-outline-warning'>
                                      <img src={archive} alt="" width="22px" title='Archiver' onClick={() => ArchiverEmploye(item.id)} />
                                    </button>
                                    &nbsp; &nbsp; &nbsp;
                                    {/* Nouveau bouton pour afficher les classes et les élèves */}
                                    <Link className="btn btn-outline-info" to={`/listClasse/enseignant/classes/${item.id}`} style={{ height: "45px" }}>
                                      <img src={classesIcon} alt="" width="24px" title='Voir les classes' />
                                    </Link>
                                  </td>
                                  <td>
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
            <div className="tab-pane fade" id="formulaire" role="tabpanel" aria-labelledby="custom-content-below-profile-tab">
              Ajouter
            </div>
          </div>
        </div>
        {/* <ProfileEmploye /> */}
        {selectedEmployeId ? (
          <ProfileEmploye employeId={selectedEmployeId} />
        ) : (
          ''
        )}
        {/* modal supprimer */}
        <div className="modal fade" id="modal-delete">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">

                <h4 className="modal-title">Confirmer l'archivage</h4>
                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <p> Êtes-vous sûr de vouloir archiver cet élément ? </p>
              </div>
              <div className="modal-footer justify-content-between">
                <button type="button" className="btn btn-default" data-dismiss="modal">Annuler</button>
                <button type="button" className="btn btn-danger">Archiver</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Employes;