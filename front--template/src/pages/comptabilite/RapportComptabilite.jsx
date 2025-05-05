import React, { useEffect, useState } from 'react';
import {
  Card, Row, Col, Form, Table, ProgressBar, Button, Container, Tab, Tabs,
  CardFooter
} from 'react-bootstrap';
import { Link } from 'react-router-dom'
import {
  CashStack, CreditCard, PeopleFill,
  Building, Calendar, CurrencyDollar, GraphUp, PieChart, FileText,
  Circle,

} from 'react-bootstrap-icons';
import axios from 'axios';
import moment from 'moment';

const RapportComptabilite = () => {
  
  const [activeTab, setActiveTab] = useState('revenus');


  //les mois-------------------------
  const months = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
  ];
  const  mois=parseInt(moment().format('MM'));
  const  cemois=months[mois-1];
  const [selectedMonth, setSelectedMonth] = useState(cemois);
  // ---------------------------------------

  //recuperés les annee scolaire
  const [years, setYears] = useState([]);
  const [selectedYear, setSelectedYear] = useState(null);
  useEffect(() => {
    const fetchAnneesScolaires = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get('http://localhost:5000/anneescolaire/', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const now = moment();
        const options = response.data
          .filter(item => item.archiver === 0)
          .map(item => ({
            value: item.id,
            label: `${moment(item.datedebut).format('YYYY')}/${moment(item.datefin).format('YYYY')}`,
            debut: moment(item.datedebut),
            fin: moment(item.datefin)
          }));
        // Trouver l'année scolaire active
        const active = options.find(opt => now.isBetween(opt.debut, opt.fin, 'day', '[]'));
        setYears(options);
        if (active) {
          setSelectedYear(active.value);
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des années", error);
      }
    };
    fetchAnneesScolaires();
  }, []);

  const [data,setdata]=useState([]);

  useEffect(() => {
    const DashboardCompt = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.post(
          'http://localhost:5000/contrat/dashboard',
          { selectedMonth, selectedYear },
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
        if (response.status === 200) {
          console.log('response.data', response.data);
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des données du dashboard", error);
      }
    };
    if (selectedMonth && selectedYear) {
      DashboardCompt();
    }
  }, [selectedMonth, selectedYear]); 






  // Données simulées
  const stats = {
    totalRevenu: 1250000,
    totalDepense: 850000,
    payementPaye: 950000,
    payementNonPaye: 300000,
    depensesParCategorie: [
      { categorie: 'Salaires', montant: 500000, pourcentage: 58.8, paye: 450000, nonPaye: 50000 },
      { categorie: 'Loyer', montant: 150000, pourcentage: 17.6, paye: 150000, nonPaye: 0 },
      { categorie: 'Fournitures', montant: 100000, pourcentage: 11.8, paye: 100000, nonPaye: 0 },
      { categorie: 'Services', montant: 50000, pourcentage: 5.9, paye: 50000, nonPaye: 0 },
      { categorie: 'Autres', montant: 50000, pourcentage: 5.9, paye: 50000, nonPaye: 0 }
    ],
    employes: [
      { id: 1, nom: 'Mohamed Ali', poste: 'Enseignant', salaire: 80000, paye: 80000 },
      { id: 2, nom: 'Fatima Zohra', poste: 'Secrétaire', salaire: 60000, paye: 60000 },
      { id: 3, nom: 'Karim Benzema', poste: 'Directeur', salaire: 120000, paye: 100000 },
      { id: 4, nom: 'Amina Belkacem', poste: 'Comptable', salaire: 70000, paye: 70000 },
      { id: 5, nom: 'Youssef Khan', poste: 'Maintenance', salaire: 50000, paye: 50000 }
    ],
    revenusParMois: [
      { mois: 'Janvier', montant: 200000 },
      { mois: 'Février', montant: 180000 },
      { mois: 'Mars', montant: 220000 },
      { mois: 'Avril', montant: 210000 },
      { mois: 'Mai', montant: 230000 },
      { mois: 'Juin', montant: 210000 }
    ]
  };




  return (

    <>
      <nav className="mt-5">
        <Link to="/dashboard">Dashboard</Link>
        <span> / </span>
        <span>Rapport comptabilité</span>
      </nav>
      <Container fluid className="mt-4 p-3">

        {/* En-tête avec sélecteurs */}

        <Row className="mb-4 mt-5">
          <Col className='mt-5 ml-3' md={6} >
            <h2 className="text-primary">
              Tableau de Bord Comptable
            </h2>
            <p className="text-muted">Vue d’ensemble des revenus, des dépenses et des paiements des élèves pour le mois en cours </p>
          </Col>

          <Col md={2}>
            <Form.Group controlId="formYear">
              <Form.Label>Année</Form.Label>
              <Form.Select
                className='form-control'
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
              >
                  {years.map((year) => (
                    <option key={year.value} value={year.value}>
                      {year.label}
                    </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>
          <Col md={2}>
            <Form.Group controlId="formMonth">
              <Form.Label>Mois</Form.Label>
              <Form.Select
                className='form-control'
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
              >
                {months.map((month, index) => (
                  <option key={index} value={month}>{month}</option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>
        {/* Cartes de statistiques */}
        <Row className="mb-4">
          {/* revenus */}
          <Col xl={3} md={6} className="mb-4">
            <Card className="border-start border-success border-3 shadow-sm h-100 hover-effect">
              <Card.Body className="py-3">
                {/* En-tête */}
                <div className="d-flex align-items-center mb-3">
                  <div className="icon-circle bg-success-light">
                    <CreditCard size={20} className="text-success" />
                  </div>
                  <h5 className="text-muted mb-0 ms-3 ml-2">Total Revenu</h5>
                </div>
                {/* Montant principal */}
                <h2 className="text-success mb-3">
                  {stats.totalRevenu.toLocaleString('fr-FR')} <small className="fs-6">DZD</small>
                </h2>

                {/* Détails des revenus */}
                <div className="revenue-breakdown">
                  {/* Ligne Élèves */}
                  <div className="revenue-item d-flex justify-content-between align-items-center mb-2 py-2">
                    <div className="d-flex align-items-center">
                      <div className="dot-indicator bg-success me-2"></div>
                      <div>
                        <span className="text-muted small">Frais de scolarité Élèves:</span>
                        <div className="fw-semibold">660,000 DZD</div>
                      </div>
                    </div>
                    <div className="percentage-value text-success">
                      <GraphUp size={14} className="me-1" />
                      75%
                    </div>
                  </div>
                  <div className="revenue-item d-flex justify-content-between align-items-center mb-2 py-2">
                    <div className="d-flex align-items-center">
                      <div className="dot-indicator bg-success me-2"></div>
                      <div>
                        <span className="text-muted small">Frais de inscription Élèves:</span>
                        <div className="fw-semibold">660,000 DZD</div>
                      </div>
                    </div>
                    <div className="percentage-value text-success">
                      <GraphUp size={14} className="me-1" />
                      75%
                    </div>
                  </div>

                  {/* Ligne Autres Revenus */}
                  <div className="revenue-item d-flex justify-content-between align-items-center py-2">
                    <div className="d-flex align-items-center">
                      <div className="dot-indicator bg-info me-2"></div>
                      <div>
                        <span className="text-muted small">Autres Revenus:</span>
                        <div className="fw-semibold">590,000 DZD</div>
                      </div>
                    </div>
                    <div className="percentage-value text-danger">
                      <GraphUp size={14} className="me-1" />
                      8%
                    </div>
                  </div>
                </div>
              </Card.Body>
              <CardFooter>
                <small className="text-muted">
                  <i className="fas fa-calendar-alt me-1"></i> Mois
                </small>
              </CardFooter>
            </Card>
          </Col>

          {/* depenses */}
          <Col xl={3} md={6} className="mb-4">
            <Card className="border-start border-success border-3 shadow-sm h-100 hover-effect">
              <Card.Body className="py-3">
                {/* En-tête */}
                <div className="d-flex align-items-center mb-3">
                  <div className="icon-circle bg-success-light">
                    <CreditCard size={20} className="text-danger" />
                  </div>
                  <h5 className="text-muted mb-0 ms-3 ml-2">Total Dépense</h5>
                </div>
                {/* Montant principal */}
                <h2 className="text-danger mb-3">
                  {stats.totalRevenu.toLocaleString('fr-FR')} <small className="fs-6">DZD</small>
                </h2>

                {/* Détails des revenus */}

                <div className="revenue-breakdown">
                  {/* Ligne paiments des employes */}
                  <div className="revenue-item d-flex justify-content-between align-items-center py-2">
                    <div className="d-flex align-items-center">
                      <div className="dot-indicator bg-danger me-2"></div>
                      <div>
                        <span className="text-muted small">Dépenses salariales:</span>
                        <div className="fw-semibold">590,000 DZD</div>
                      </div>
                    </div>
                    <div className="percentage-value text-danger">
                      <GraphUp size={14} className="me-1" />
                      8%
                    </div>
                  </div>
                </div>
                <div className="revenue-breakdown">

                  {/* Ligne Autres depenses */}
                  <div className="revenue-item d-flex justify-content-between align-items-center py-2">
                    <div className="d-flex align-items-center">
                      <div className="dot-indicator bg-info me-2"></div>
                      <div>
                        <span className="text-muted small">Autres dépense:</span>
                        <div className="fw-semibold">590,000 DZD</div>
                      </div>
                    </div>
                    <div className="percentage-value text-danger">
                      <GraphUp size={14} className="me-1" />
                      8%
                    </div>
                  </div>
                </div>

                {/* Pied de carte */}

              </Card.Body>
              <CardFooter>
                <small className="text-muted">
                  <i className="fas fa-calendar-alt me-1"></i> Mois
                </small>
              </CardFooter>
            </Card>
          </Col>
          {/* payé */}
          <Col xl={3} md={6} className="mb-4">
            <Card className="border-start border-success border-3 shadow-sm h-100 hover-effect">
              <Card.Body className="py-3">
                {/* En-tête */}
                <div className="d-flex align-items-center mb-3">
                  <div className="icon-circle bg-success-light">
                    <CreditCard size={20} className="text-success" />
                  </div>
                  <h5 className="text-muted mb-0 ms-3 ml-2">Total Frais Scolarité  </h5>
                </div>
                {/* Montant principal */}
                <h2 className="text-success mb-3">
                  {stats.totalRevenu.toLocaleString('fr-FR')} <small className="fs-6">DZD</small>
                </h2>

                {/* Détails des revenus */}
                <div className="revenue-breakdown">
                  {/* Ligne Élèves */}
                  <div className="revenue-item d-flex justify-content-between align-items-center mb-2 py-2">
                    <div className="d-flex align-items-center">
                      <div className="dot-indicator bg-success me-2"></div>
                      <div>
                        <span className="text-muted small">Frais Scolarité Payés </span>
                        <div className="fw-semibold">660,000 DZD</div>
                      </div>
                    </div>
                    <div className="percentage-value text-success">
                      <GraphUp size={14} className="me-1" />
                      75%
                    </div>
                  </div>

                </div>
              </Card.Body>
              <CardFooter>
                <small className="text-muted">
                  <i className="fas fa-calendar-alt me-1"></i> Mois
                </small>
              </CardFooter>
            </Card>
          </Col>

          {/* non payé */}
          <Col xl={3} md={6} className="mb-4">
            <Card className="border-start border-success border-3 shadow-sm h-100 hover-effect">
              <Card.Body className="py-3">
                {/* En-tête */}
                <div className="d-flex align-items-center mb-3">
                  <div className="icon-circle bg-success-light">
                    <CreditCard size={20} className="text-danger" />
                  </div>
                  <h5 className="text-muted mb-0 ms-3 ml-2">Frais Scolarité Impayés</h5>
                </div>
                {/* Montant principal */}
                <h2 className="text-danger mb-3">
                  {stats.totalRevenu.toLocaleString('fr-FR')} <small className="fs-6">DZD</small>
                </h2>

                {/* Détails des revenus */}
                <div className="revenue-breakdown">
                  {/* Ligne Autres Revenus */}
                  <div className="revenue-item d-flex justify-content-between align-items-center py-2">
                    <div className="d-flex align-items-center">
                      <div className="dot-indicator bg-info me-2"></div>
                      <div>
                        <span className="text-muted small"> Total Paiements Élèves (En Retard) :</span>
                        <div className="fw-semibold">590,000 DZD</div>
                      </div>
                    </div>
                    <div className="percentage-value text-danger">
                      <GraphUp size={14} className="me-1" />
                      8%
                    </div>
                  </div>
                </div>

                {/* Pied de carte */}

              </Card.Body>
              <CardFooter>
                <small className="text-muted">
                  <i className="fas fa-calendar-alt me-1"></i> Mois
                </small>
              </CardFooter>
            </Card>
          </Col>
        </Row>
        {/* Onglets pour les détails */}
        {/* les tables */}
        <Tabs
          activeKey={activeTab}
          onSelect={(k) => setActiveTab(k)}
          className="mb-3"
        >
          <Tab eventKey="revenus" title="Revenus">
            <Card className="shadow-sm mt-3">
              <Card.Header className="bg-light">
                <h5 className="mb-0">
                  <GraphUp className="me-2 mr-3" />
                  Détails des Revenus
                </h5>
              </Card.Header>
              <Card.Body>
                <Table striped hover responsive>
                  <thead>
                    <tr>
                      <th>Code</th>
                      <th>Cause</th>
                      <th>Montant</th>
                      <th>% du Montant</th>
                      <th>Progression</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.revenusParMois.map((item, index) => (
                      <tr key={index}>
                        <td>{item.mois}</td>
                        <td>{item.montant.toLocaleString('fr-FR')}</td>
                        <td>{item.montant.toLocaleString('fr-FR')}</td>
                        <td>{((item.montant / stats.totalRevenu) * 100)}%</td>
                        <td>
                          <ProgressBar
                            now={(item.montant / stats.totalRevenu) * 100}
                            variant="primary"
                            style={{ height: '6px' }}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          </Tab>

          <Tab eventKey="depenses" title="Dépenses">
            <Card className="shadow-sm mt-3">
              <Card.Header className="bg-light">
                <h5 className="mb-0">
                  <CreditCard className="me-2" />
                  Détails des Dépenses par Catégorie
                </h5>
              </Card.Header>
              <Card.Body>
                <Row>
                  <Col md={12}>
                  <Table striped hover responsive>
                  <thead>
                    <tr>
                      <th>Code</th>
                      <th>Cause</th>
                      <th>Montant</th>
                      <th>% du Montant</th>
                      <th>Progression</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.revenusParMois.map((item, index) => (
                      <tr key={index}>
                        <td>{item.mois}</td>
                        <td>{item.montant.toLocaleString('fr-FR')}</td>
                        <td>{item.montant.toLocaleString('fr-FR')}</td>
                        <td>{((item.montant / stats.totalRevenu) * 100)}%</td>
                        <td>
                          <ProgressBar
                            now={(item.montant / stats.totalRevenu) * 100}
                            variant="primary"
                            style={{ height: '6px' }}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Tab>

          <Tab eventKey="salaires" title="Salaires">
            <Card className="shadow-sm mt-3">
              <Card.Header className="bg-light">
                <h5 className="mb-0">
                  <PeopleFill className="me-2" />
                  Détails des Salaires
                </h5>
              </Card.Header>
              <Card.Body>
                <Table striped hover responsive>
                  <thead>
                    <tr>
                      <th>Employé</th>
                      <th>Poste</th>
                      <th>Salaire (DZ)</th>
                      <th>Payé (DZ)</th>
                      <th>Reste (DZ)</th>
                     
                    </tr>
                  </thead>
                  <tbody>
                    {stats.employes.map((employe) => (
                      <tr key={employe.id}>
                        <td>{employe.nom}</td>
                        <td>{employe.poste}</td>
                        <td>{employe.salaire.toLocaleString('fr-FR')}</td>
                        <td>{employe.paye.toLocaleString('fr-FR')}</td>
                        <td>{(employe.salaire - employe.paye).toLocaleString('fr-FR')}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="fw-bold">
                      <td colSpan="2">Total</td>
                      <td>
                        {stats.employes.reduce((sum, emp) => sum + emp.salaire, 0).toLocaleString('fr-FR')} DZ
                      </td>
                      <td>
                        {stats.employes.reduce((sum, emp) => sum + emp.paye, 0).toLocaleString('fr-FR')} DZ
                      </td>
                      <td>
                        {stats.employes.reduce((sum, emp) => sum + (emp.salaire - emp.paye), 0).toLocaleString('fr-FR')} DZ
                      </td>
                      <td></td>
                    </tr>
                  </tfoot>
                </Table>
              </Card.Body>
            </Card>
          </Tab>
        </Tabs>

        {/* Résumé mensuel */}
        <Card className="shadow-sm mt-3">
          <Card.Header className="bg-light d-flex justify-content-between align-items-center">
            <h5 className="mb-0">
              <Calendar className="me-2" />
              Résumé Mensuel
            </h5>
            <Button variant="outline-primary" size="sm">
              Exporter PDF
            </Button>
          </Card.Header>
          <Card.Body>
            <Row>
              <Col md={6}>
                <h6 className="text-muted">Revenus vs Dépenses</h6>
                <div className="bg-light p-3 rounded text-center">
                  <PieChart size={100} className="text-primary" />
                  <div className="mt-2">
                    <span className="badge bg-primary me-2">Revenus: {stats.totalRevenu.toLocaleString('fr-FR')} DZ</span>
                    <span className="badge bg-warning">Dépenses: {stats.totalDepense.toLocaleString('fr-FR')} DZ</span>
                  </div>
                </div>
              </Col>
              <Col md={6}>
                <h6 className="text-muted">Balance</h6>
                <div className="p-3 rounded bg-light">
                  <h3 className={stats.totalRevenu - stats.totalDepense >= 0 ? "text-success" : "text-danger"}>
                    {(stats.totalRevenu - stats.totalDepense).toLocaleString('fr-FR')} DZ
                  </h3>
                  <p className="mb-0">
                    {stats.totalRevenu - stats.totalDepense >= 0 ? (
                      <span className="text-success">Bénéfice ce mois-ci</span>
                    ) : (
                      <span className="text-danger">Déficit ce mois-ci</span>
                    )}
                  </p>
                </div>
              </Col>
            </Row>
          </Card.Body>
          <Card.Footer className="text-muted text-center">
            Mis à jour le {new Date().toLocaleDateString('fr-FR')} à {new Date().toLocaleTimeString('fr-FR')}
          </Card.Footer>
        </Card>
      </Container>
    </>
  );
};

export default RapportComptabilite;

// <div>
//   <span className="text-muted small">Autres Revenus :</span>

//   <div className="d-flex justify-content-between align-items-center fw-semibold">
//     <span>590,000 DZD</span>
//     <small className="text-danger d-flex align-items-center">
//       <GraphUp className="me-1" />
//       8%
//     </small>
//   </div>
// </div>
