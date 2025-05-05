import React, { useState, useEffect } from 'react';
import axios from 'axios';
import moment from 'moment';
import Select from 'react-select';
import { Modal, Button, Form, Row, Col, CardBody, Card, Container, CardTitle } from 'react-bootstrap';
import excel from '../../../assets/imgs/excel.png';

export const StatsComptabilite = () => {
  const [stats, setStats] = useState({
    totalPaye: 0,
    totalNonPaye: 0,
    total: 0,
    parAnneeScolaire: [],
    loading: true,
    error: null
  });

  const [selectedAnnee, setSelectedAnnee] = useState(null);
  const [anneesOptions, setAnneesOptions] = useState([]);
  const [showTable, setShowTable] = useState(() => {
    const saved = localStorage.getItem("showStatsTable");
    return saved === null ? true : JSON.parse(saved);
  });

  useEffect(() => {
    const fetchAnneesScolaires = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get('http://localhost:5000/anneescolaire/', {
          headers: { Authorization: `Bearer ${token}` }
        });

        const options = response.data
          .filter(item => item.archiver === 0)
          .map(item => ({
            value: item.id,
            label: `${moment(item.datedebut).format('YYYY')}/${moment(item.datefin).format('YYYY')}`
          }));

        setAnneesOptions(options);
      } catch (error) {
        console.error("Erreur lors de la récupération des années", error);
      }
    };

    fetchAnneesScolaires();
  }, []);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setStats(prev => ({ ...prev, loading: true, error: null }));
        const token = localStorage.getItem("token");

        let url = 'http://localhost:5000/contrat/stats';
        if (selectedAnnee) {
          url += `?annee=${selectedAnnee}`;
        }

        const response = await axios.get(url, {
          headers: { Authorization: `Bearer ${token}` }
        });

        setStats({
          ...response.data,
          loading: false,
          error: null
        });
      } catch (error) {
        console.error("Erreur lors du chargement des stats", error);
        setStats(prev => ({
          ...prev,
          loading: false,
          error: "Erreur lors du chargement des statistiques"
        }));
      }
    };

    fetchStats();
  }, [selectedAnnee]);


  const toggleTableVisibility = () => {
    const newState = !showTable;
    setShowTable(newState);
    localStorage.setItem("showStatsTable", JSON.stringify(newState));
  };

  if (stats.loading) {
    return (
      <div className="card mt-4">
        <div className="card-body text-center">
          <div className="spinner-border text-primary" role="status" />
          <p>Chargement des statistiques...</p>
        </div>
      </div>
    );
  }
  if (stats.error) {
    return (
      <div className="card mt-4">
        <div className="card-body text-center text-danger">
          {stats.error}
        </div>
      </div>
    );
  }
  return (
    <Card className="shadow mb-4 border-0">
      <div className="card-header d-flex justify-content-between align-items-center">
        <h5 className="mb-0" style={{ fontFamily: 'Times New Roman',color:'#84abbf',fontWeight:700 }}>
          Statistiques Paiement des Élèves
        </h5>
        <Button
          variant={showTable ? "outline-danger" : "outline-success"}
          size="sm"
          className="ml-auto"
          onClick={toggleTableVisibility}
          title={showTable ? "Masquer les détails" : "Afficher les détails"}
        >
          <i className={`fas ${showTable ? 'fa-eye-slash' : 'fa-eye'}`}></i>
        </Button>
      </div>
      <CardBody>
        <Row>
          <Col xl="4" md="6">
            <Card className="bg-light border-success">
              <CardBody>
                <Row>
                  <div className="col">
                    <CardTitle tag="h5" className="text-muted mb-0">💰 Total</CardTitle>
                    <span className="h4 font-weight-bold text-success ml-4">
                      {(stats.totalContrat).toLocaleString('fr-FR', {
                        minimumFractionDigits: 2
                      })} DZ
                    </span>
                  </div>
                </Row>
              </CardBody>
            </Card>
          </Col>

          <Col xl="4" md="6">
            <Card className="bg-light border-info">
              <CardBody>
                <Row>
                  <div className="col">
                    <CardTitle tag="h5" className="text-muted mb-0">✔️ Total Payé</CardTitle>
                    <span className="h4 font-weight-bold text-info ml-4">
                      {stats.totalPaye.toLocaleString('fr-FR', {
                        minimumFractionDigits: 2
                      })} DZ
                    </span>
                  </div>

                </Row>
              </CardBody>
            </Card>
          </Col>

          <Col xl="4" md="6">
            <Card className="bg-light border-danger">
              <CardBody>
                <Row>
                  <div className="col">
                    <CardTitle tag="h5" className="text-muted mb-0">❌ Total Non Payé</CardTitle>
                    <span className="h4 font-weight-bold text-danger ml-4">
                      {stats.totalNonPaye.toLocaleString('fr-FR', {
                        minimumFractionDigits: 2
                      })} DZ
                    </span>
                  </div>
                </Row>
              </CardBody>
            </Card>
          </Col>
        </Row>

        {showTable && (
          <>
            <hr className="my-4" />
            <h6 className="heading-small text-muted mb-4 mt-3">Par Année Scolaire</h6>
            {stats.parAnneeScolaire.length > 0 ? (
              <div className="table-responsive">
                <table className="table align-items-center table-hover">
                  <thead className="thead-light">
                    <tr>
                      <th>Année</th>
                      <th>Total</th>
                      <th>Payé</th>
                      <th>Non Payé</th>
                      <th>Taux</th>
                      <th>Contrats</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.parAnneeScolaire.map((item, index) => (
                      <tr key={index}>
                        <td>{item.annee}</td>
                        <td className="text-primary">{item.totalContrat.toLocaleString('fr-FR')} DZ</td>
                        <td className="text-success">{item.paye.toLocaleString('fr-FR')} DZ</td>
                        <td className="text-danger">{item.nonPaye.toLocaleString('fr-FR')} DZ</td>
                        <td>
                          <div className="d-flex align-items-center">
                            <span className="mr-2">{item.taux}%</span>
                            <div className="progress w-100">
                              <div
                                className="progress-bar bg-gradient-success"
                                role="progressbar"
                                style={{ width: `${item.taux}%` }}
                              />
                            </div>
                          </div>
                        </td>
                        <td>{item.contrats}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="alert alert-info mt-3">Aucune donnée statistique disponible.</div>
            )}
          </>
        )}
      </CardBody>

      <div className="card-footer text-muted">
        📅 Mis à jour le {new Date().toLocaleDateString('fr-FR')}
      </div>
    </Card>
  );
};
