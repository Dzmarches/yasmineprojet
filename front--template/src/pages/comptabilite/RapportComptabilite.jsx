import React, { useEffect, useState } from 'react';
import {
  Card, Row, Col, Form, Table, ProgressBar, Button, Container, Tab, Tabs,
  CardFooter, Spinner
} from 'react-bootstrap';
import { Link } from 'react-router-dom'
import {
  CashStack, CreditCard, PeopleFill,
  Building, Calendar, CurrencyDollar, GraphUp, FileText,
  Circle,

} from 'react-bootstrap-icons';
import axios from 'axios';
import moment from 'moment';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

const RapportComptabilite = () => {
  const [activeTab, setActiveTab] = useState('revenus');
  const [loading, setLoading] = useState(true);

  // -----------------sousecole--------------
  const [selectedEcole, setSelectedEcole] = useState(null);
  const [filteredEcoles, setFilteredEcoles] = useState([]);
  const [roles, setRoles] = useState([]);
  const [ecole, setEcoles] = useState([]);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("❌ Aucun token trouvé. Veuillez vous connecter.");
        return;
      }
      try {
        const response = await axios.get("http://localhost:5000/getMe", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setRoles(response.data.roles || []);
      } catch (error) {
        console.error("❌ Erreur lors de la récupération des informations de l'utilisateur :", error);
      }
    };
    fetchUser();
  }, []);

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


  //les mois-------------------------
  const months = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
  ];
  const mois = parseInt(moment().format('MM'));
  const cemois = months[mois - 1];
  // const [selectedMonth, setSelectedMonth] = useState(cemois);
  const [selectedMonth, setSelectedMonth] = useState('Avril');
  // ---------------------------------------

  //recuperés les annee scolaire
  const [years, setYears] = useState([]);
  const [selectedYear, setSelectedYear] = useState(null);
  const [error, setError] = useState(null);

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

  const [data, setdata] = useState([]);


  const DashboardCompt = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        'http://localhost:5000/contrat/dashboard',
        {
          selectedMonth,
          selectedYear,
          ecoleeId: selectedEcole || null
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      if (response.status === 200) {
        console.log('response.data', response.data);
        setdata(response.data);
        setLoading(false);
      }
    } catch (error) {
      setError("Erreur lors du chargement des données.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const DashboardComptAll = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        'http://localhost:5000/contrat/dashboard/all',
        {
          selectedMonth,
          selectedYear,
          ecoleeId: selectedEcole || null
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      if (response.status === 200) {
        setdata(response.data);
        setLoading(false);
      }
    } catch (error) {
      setError("Erreur lors du chargement des données.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedMonth && selectedYear && !roles.includes("AdminPrincipal")) {
      DashboardCompt();
    } else if (selectedMonth && selectedYear && roles.includes("AdminPrincipal") && selectedEcole) {
      DashboardCompt();
    }
  }, [selectedMonth, selectedYear,selectedEcole],roles);

  useEffect(() => {
    if (selectedMonth && selectedYear && roles.includes("AdminPrincipal") && !selectedEcole) {
      DashboardComptAll();
    }
  }, [selectedMonth, selectedYear,selectedEcole,roles]);

  const total = (parseFloat(data?.AutreRevenus?.totalRevenus) || 0) +
    (parseFloat(data?.AutresDepenses?.totaldepenses) || 0);
  const chartData = [
    {
      name: 'Revenus',
      value: parseFloat(data?.AutreRevenus?.totalRevenus) || 0,
      percent: total ? Math.round((parseFloat(data?.AutreRevenus?.totalRevenus) / total) * 100) : 0
    },
    {
      name: 'Dépenses',
      value: parseFloat(data?.AutresDepenses?.totaldepenses) || 0,
      percent: total ? Math.round((parseFloat(data?.AutresDepenses?.totaldepenses) / total) * 100) : 0
    }
  ];

  const COLORS = ['#28a745', '#dc3545'];
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (loading) return <Spinner animation="border" variant="primary" style={{ marginTop: '20%', marginLeft: '50%' }} />
  //detecter le role de user

  return (
    <>
      <nav className="mt-5">
        <Link to="/dashboard">Dashboard</Link>
        <span> / </span>
        <span>Rapport comptabilité</span>
      </nav>
      <Container fluid className="mt-4 p-3">

        {/* En-tête avec sélecteurs */}

        <Row className="mb-4  ">
          <Col className='mt-2 ml-3 mr-5' md={4} >
            <h1 className="text-primary">
              Tableau de Bord Comptable
            </h1>
            <p className="text-muted">Vue d’ensemble des revenus, des dépenses et des paiements des élèves pour le mois en cours </p>
          </Col>
          <Col md={2} className='mt-5 ml-5'  >
            <Form.Group controlId="formYear">
              <Form.Label>Année</Form.Label>
              <Form.Select
                style={{ minHeight: '40px' }}
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
          <Col md={2} className='mt-5 '>
            <Form.Group controlId="formMonth">
              <Form.Label>Mois</Form.Label>
              <Form.Select
                style={{ minHeight: '40px' }}
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
          {/* {roles.includes("AdminPrincipal") ? (
            <Col md={2} className='mt-5'>
              <Form.Group controlId="formMonth">
                <Form.Label>Ecole</Form.Label>
                <Form.Select
                  style={{ minHeight: '40px' }}
                  className='form-control'
                  value={selectedEcole || ''}
                  onChange={(e) => {
                    const value = e.target.value;
                    setSelectedEcole(value === "null" ? null : value);
                  }}  >
                 
                  <option value="" disabled>Sélectionnez une ecole</option>
                  <option value="null">Ecole Principale</option>
                  {ecole.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.nomecole}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
          ) : ''} */}

          {roles.includes("AdminPrincipal") ? (
            <Col md={2} className='mt-5'>
              <Form.Group controlId="formMonth">
                <Form.Label>Ecole</Form.Label>
                <Form.Select
                  style={{ minHeight: '40px' }}
                  className='form-control'
                  value={selectedEcole || ''}
                  onChange={(e) => setSelectedEcole(e.target.value)}
                >
                  <option value="" disabled>Sélectionnez une école</option>
                  <option value="EP">Ecole Principale</option>
                  {ecole.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.nomecole}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
          ) : ''}

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
                <h4 className="text-success mb-3">
                  {/* {stats.totalRevenu.toLocaleString('fr-FR')}  */}
                  {(data.AutreRevenus?.totalRevenus || 0)}
                  <small className="fs-6">DZD</small>
                </h4>

                {/* Détails des revenus */}
                <div className="revenue-breakdown">
                  {/* Ligne Élèves */}
                  <div className="revenue-item d-flex justify-content-between align-items-center mb-2 py-2">
                    <div className="d-flex align-items-center">
                      <div className="dot-indicator bg-success me-2"></div>
                      <div>
                        <span className="text-muted small">Frais de scolarité Élèves:</span>
                        <div className="fw-semibold">{data.FraiScolarite?.totalPaye || 0} DZD</div>
                      </div>
                    </div>
                    <div className="percentage-value text-success">
                      <GraphUp size={14} className="me-1" />
                      {data.FraiScolarite?.totalPaye && data.AutreRevenus?.totalRevenus
                        && data.AutreRevenus?.totalRevenus != 0.00
                        ? Math.round((data?.FraiScolarite?.totalPaye / data?.AutreRevenus?.totalRevenus) * 100) + '%'
                        : '0.00%'}
                    </div>
                  </div>
                  <div className="revenue-item d-flex justify-content-between align-items-center mb-2 py-2">
                    <div className="d-flex align-items-center">
                      <div className="dot-indicator bg-success me-2"></div>
                      <div>
                        <span className="text-muted small">Frais de inscription Élèves:</span>
                        <div className="fw-semibold">{data.FraiScolarite?.totalFraisInscription || 0}  DZD</div>
                      </div>
                    </div>
                    <div className="percentage-value text-success">
                      <GraphUp size={14} className="me-1" />
                      {data.FraiScolarite?.totalFraisInscription && data.AutreRevenus?.totalRevenus
                        && data.AutreRevenus?.totalRevenus != 0.00
                        ? Math.round((data.FraiScolarite?.totalFraisInscription / data?.AutreRevenus?.totalRevenus) * 100) + '%'
                        : '0.00%'}
                    </div>
                  </div>

                  {/* Ligne Autres Revenus */}
                  <div className="revenue-item d-flex justify-content-between align-items-center py-2">
                    <div className="d-flex align-items-center">
                      <div className="dot-indicator bg-info me-2"></div>
                      <div>
                        <span className="text-muted small">Autres Revenus:</span>
                        <div className="fw-semibold">{data.AutreRevenus?.total || 0} DZD</div>
                      </div>
                    </div>
                    <div className="percentage-value text-success">
                      <GraphUp size={14} className="me-1" />
                      {data.AutreRevenus?.total && data.AutreRevenus?.totalRevenus
                        && data.AutreRevenus?.totalRevenus != 0.00
                        ? Math.round((data.AutreRevenus?.total / data.AutreRevenus?.totalRevenus) * 100) + '%'
                        : '0.00%'}
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
                  <h5 className="text-muted mb-0 ms-3 ml-2">Total Dépense </h5>
                </div>
                {/* Montant principal */}
                <h4 className="text-danger mb-3">
                  {data.AutresDepenses?.totaldepenses || 0} <small className="fs-6">DZD</small>
                </h4>
                {/* Détails des revenus */}
                <div className="revenue-breakdown">
                  {/* Ligne paiments des employes */}
                  <div className="revenue-item d-flex justify-content-between align-items-center py-2">
                    <div className="d-flex align-items-center">
                      <div className="dot-indicator bg-danger me-2"></div>
                      <div>
                        <span className="text-muted small">Dépenses salariales:</span>
                        <div className="fw-semibold">{data.Salaires?.total || 0} DZD</div>
                      </div>
                    </div>
                    <div className="percentage-value text-danger">
                      <GraphUp size={14} className="me-1" />
                      {data.Salaires?.total && data.AutresDepenses?.totaldepenses
                        && data.AutresDepenses.totaldepenses != 0.00
                        ? Math.round((data.Salaires?.total / data.AutresDepenses?.totaldepenses) * 100) + '%'
                        : '0.00%'}
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
                        <div className="fw-semibold">{data.AutresDepenses?.total || 0} DZD</div>
                      </div>
                    </div>
                    <div className="percentage-value text-danger">
                      <GraphUp size={14} className="me-1" />
                      {data.AutresDepenses?.total && data.AutresDepenses?.totaldepenses
                        && data.AutresDepenses?.totaldepenses != 0.00
                        ? Math.round((data.AutresDepenses?.total / data.AutresDepenses?.totaldepenses) * 100) + '%'
                        : '0.00'}
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
                  <h5 className="text-muted mb-0 ms-3 ml-2">
                    Frais Scolarité Payés <br />
                    < small className='text-muted'>
                      {years.find((item) => item.value === selectedYear)?.label || ""
                      }</small>

                  </h5>
                </div>
                {/* Montant principal */}
                <h4 className="text-success mb-3">
                  {data.Contrat?.totalPayeC} <small className="fs-6">DZD</small>
                </h4>

                {/* Détails des revenus */}
                <div className="revenue-breakdown">
                  {/* Ligne Élèves */}
                  <div className="revenue-item d-flex justify-content-between align-items-center mb-2 py-2">
                    <div className="d-flex align-items-center">
                      <div className="dot-indicator bg-success me-2"></div>
                      <div>
                        <span className="text-muted small">Frais Scolarité Payés </span>
                        <div className="fw-semibold">{data.FraiScolarite?.totalPaye} DZD</div>
                      </div>
                    </div>
                    <div className="percentage-value text-success">
                      <GraphUp size={14} className="me-1" />
                      {data.FraiScolarite?.totalPaye && data.Contrat?.totalPayeC
                        ? Math.round((data.FraiScolarite?.totalPaye / data.Contrat?.totalPayeC) * 100) + '%'
                        : '0.00%'}
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
                  <h5 className="text-muted mb-0 ms-3 ml-2">
                    Frais Scolarité Impayés
                    <br />
                    < small className='text-muted'>
                      {years.find((item) => item.value === selectedYear)?.label || ""
                      }</small>
                  </h5>
                </div>
                {/* Montant principal */}
                <h4 className="text-danger mb-3">
                  {data.Contrat?.totalNonPayeC || 0} <small className="fs-6">DZD</small>
                </h4>
                {/* Détails des revenus */}
                <div className="revenue-breakdown">
                  {/* Ligne Autres Revenus */}
                  <div className="revenue-item d-flex justify-content-between align-items-center py-2">
                    <div className="d-flex align-items-center">
                      <div className="dot-indicator bg-info me-2"></div>
                      <div>
                        <span className="text-muted small">Total Paiements (En Retard) :</span>
                        <div className="fw-semibold">{data.FraiScolarite?.totalNonPaye} DZD</div>
                      </div>
                    </div>
                    <div className="percentage-value text-danger">
                      <GraphUp size={14} className="me-1" />
                      {data.FraiScolarite?.totalNonPaye && data.Contrat?.totalNonPayeC
                        ? Math.round((data.FraiScolarite?.totalNonPaye / data.Contrat?.totalNonPayeC) * 100) + '%'
                        : '0.00%'}
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
                <Table striped hover responsive style={{ maxHeight: '150px', overflowY: 'auto' }}>
                  <thead>
                    <tr>
                      <th>Code</th>
                      <th>Cause</th>
                      <th>Montant</th>
                      <th>% du Montant</th>
                      <th>Progression</th>
                      <th>Ecole</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data?.AutreRevenus?.liste.map((item, index) => (
                      <tr key={index}>
                        <td>{item.code}</td>
                        <td>{item.cause_fr}</td>
                        <td>{item.montant.toLocaleString('fr-FR')}</td>
                        <td>{Math.round((item.montant / data.AutreRevenus?.total) * 100)}%</td>
                        <td>
                          <ProgressBar
                            now={(item.montant / data?.AutreRevenus?.total) * 100}
                            variant="primary"
                            style={{ height: '6px' }}
                          />
                        </td>
                        <td>{item.Ecole?.nomecole}</td>
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
                  &nbsp;&nbsp;Détails des Dépenses
                </h5>
              </Card.Header>
              <Card.Body>
                <Row>
                  <Col md={12}>
                    <Table striped hover responsive style={{ maxHeight: '150px', overflowY: 'auto' }}>
                      <thead>
                        <tr>
                          <th>Code</th>
                          <th>Cause</th>
                          <th>Montant</th>
                          <th>% du Montant</th>
                          <th>Progression</th>
                          <th>Ecole</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data?.AutresDepenses?.liste.map((item, index) => (
                          <tr key={index}>
                            <td>{item.code}</td>
                            <td>{item.cause_fr}</td>
                            <td>{item.montant.toLocaleString('fr-FR')}</td>
                            <td>{Math.round((item.montant / data.AutresDepenses?.total) * 100)}%</td>
                            <td>
                              <ProgressBar
                                now={(item.montant / data.AutresDepenses?.total) * 100}
                                variant="primary"
                                style={{ height: '6px' }}
                              />
                            </td>
                            <td>{item.Ecole?.nomecole}</td>
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
              <Card.Body >
                <Table striped hover responsive style={{ maxHeight: '150px', overflowY: 'auto' }}>
                  <thead>
                    <tr>
                      <th>Code employé</th>
                      <th>Employé</th>
                      <th>Poste</th>
                      <th>Salaire (DZ)</th>
                      <th>Date</th>
                      <th>Ecole</th>

                    </tr>
                  </thead>
                  <tbody>
                    {data?.Salaires?.liste.map((employe) => (
                      <tr key={employe.id}>
                        <td>{employe.Employe?.CE}</td>
                        <td>
                          {employe.Employe?.User?.nom}
                          {employe.Employe?.User?.prenom}
                        </td>
                        <td>{employe.Employe?.Poste?.poste}</td>
                        <td>{employe.salaireNet}</td>
                        {/* <td>
                          {employe.PeriodePaie?.dateDebut && employe.PeriodePaie?.dateFin
                            ? `${moment(employe.PeriodePaie.dateDebut).format('DD-MM-YYYY')} / ${moment(employe.PeriodePaie.dateFin).format('DD-MM-YYYY')}`
                            : ''}
                        </td> */}
                        <td>{employe.date ? moment(employe.date).format('DD-MM-YYYY') : ''}</td>
                        <td>{employe.Employe?.User?.Ecoles[0]?.nomecole}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colSpan="6" style={{ textAlign: 'right', paddingTop: '10px' }}>
                        <strong style={{
                          fontSize: '16px',
                          color: '#2c3e50',
                          backgroundColor: '#ecf0f1',
                          padding: '8px 12px',
                          borderRadius: '6px',
                          display: 'inline-block',
                          marginTop: '7px'
                        }}>
                          Total : {data.Salaires?.total?.toLocaleString('fr-DZ')} DZD
                        </strong>
                      </td>
                    </tr>
                  </tfoot>
                </Table>
              </Card.Body>
            </Card>
          </Tab>
        </Tabs>

        {/* Résumé mensuel */}
        {/* Résumé mensuel */}
        <Card className="shadow-sm mt-3">
          <Card.Header className="bg-light d-flex justify-content-between align-items-center">
            <h5 className="mb-0">
              <Calendar className="me-2 mr-2" />
              Résumé Mensuel
            </h5>
          </Card.Header>
          <Card.Body>
            <Row>
              <Col md={6}>
                <h6 className="text-muted">Revenus vs Dépenses</h6>
                <div className="bg-light p-3 rounded d-flex flex-column justify-content-center align-items-center" style={{ minHeight: '300px' }}>
                  {chartData.some(item => item.value > 0) ? (
                    <>
                      <PieChart width={300} height={250}>
                        <Pie
                          data={chartData}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          label={({ percent }) => `${(percent)}%`}
                          labelLine={false}
                        >
                          {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index]} />
                          ))}
                        </Pie>
                        <Tooltip
                          formatter={(value, name, props) => [
                            `${value.toLocaleString('fr-FR')} DZD`,
                            name
                          ]}
                        />
                        <Legend />
                      </PieChart>
                      <div className="mt-2 d-flex flex-wrap justify-content-center">
                        {chartData.map((item, index) => (
                          <span
                            key={index}
                            className={`badge ${index === 0 ? 'bg-success' : 'bg-danger'} me-2 mb-2`}
                          >
                            {item.name}: {item.value.toLocaleString('fr-FR')} DZ ({item.percent}%)
                          </span>
                        ))}
                      </div>
                    </>
                  ) : (
                    <div className="text-muted p-4 text-center">
                      Aucune donnée disponible pour afficher le graphique
                    </div>
                  )}
                </div>
              </Col>

              <Col md={6}>
                <h6 className="text-muted">Balance</h6>
                <div className="p-3 rounded bg-light">
                  <h3 className={data.AutreRevenus?.totalRevenus - data.AutresDepenses?.totaldepenses >= 0 ? "text-success" : "text-danger"}>
                    {((data.AutreRevenus?.totalRevenus || 0) - (data.AutresDepenses?.totaldepenses || 0)).toLocaleString('fr-FR')} DZ
                  </h3>
                  <p className="mb-0">
                    {(data.AutreRevenus?.totalRevenus || 0) - (data.AutresDepenses?.totaldepenses || 0) >= 0 ? (
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
