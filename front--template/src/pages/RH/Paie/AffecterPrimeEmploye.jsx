import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import affecter from '../../../assets/imgs/affecter.png'
import { Spinner } from 'react-bootstrap';

const AffecterPrimeEmploye = () => {
  const [employees, setEmployees] = useState([]);
  const [primes, setPrimes] = useState([]);
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [selectedPrimes, setSelectedPrimes] = useState([]);
  const [assignedPrimes, setAssignedPrimes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [postes, setPostes] = useState([]);
  const [selectedPoste, setSelectedPoste] = useState(null);
  const [expandedPostes, setExpandedPostes] = useState({});

  // Récupérer les données initiales
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const [employeesData, primesData, assignedPrimesData, postesData] = await Promise.all([
          axios.get("http://localhost:5000/employes/liste", { headers: { Authorization: `Bearer ${token}` } }),
          axios.get("http://localhost:5000/primes/liste", { headers: { Authorization: `Bearer ${token}` } }),
          axios.get("http://localhost:5000/primes/assigned", { headers: { Authorization: `Bearer ${token}` } }),
          axios.get("http://localhost:5000/postes/liste", { headers: { Authorization: `Bearer ${token}` } }),
        ]);

        const employeactif=employeesData.data.filter((item)=>item.User?.statuscompte==="activer");
        const assignedPrimesDataActif=assignedPrimesData.data.filter((item)=>item.User?.statuscompte==="activer")
        // setEmployees(employeesData.data);
        setEmployees(employeactif);
        setPrimes(primesData.data);
        // setAssignedPrimes(assignedPrimesData.data);
        setAssignedPrimes(assignedPrimesDataActif);
        setPostes(postesData.data);

        // Initialiser l'état expandedPostes
        const initialExpanded = {};
        postesData.data.forEach(poste => {
          initialExpanded[poste.id] = false;
        });
        setExpandedPostes(initialExpanded);
      } catch (error) {
        setError("Erreur lors du chargement des données.");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Grouper les employés par poste
  const employeesByPoste = employees.reduce((acc, employee) => {
    const posteId = employee.poste;
    if (!acc[posteId]) {
      acc[posteId] = [];
    }
    acc[posteId].push(employee);
    return acc;
  }, {});

  // Gestion de la sélection des employés
  const handleEmployeeSelection = (employeeId) => {
    setSelectedEmployees((prevSelected) =>
      prevSelected.includes(employeeId)
        ? prevSelected.filter((id) => id !== employeeId)
        : [...prevSelected, employeeId]
    );
  };

  // Sélectionner tous les employés d'un poste
  // const handleSelectAllEmployeesInPoste = (posteId) => {
  //   const employeesInPoste = employeesByPoste[posteId] || [];
  //   const employeeIdsInPoste = employeesInPoste.map(emp => emp.id);

  //   // Vérifier si tous sont déjà sélectionnés
  //   const allSelected = employeeIdsInPoste.every(id => selectedEmployees.includes(id));

  //   if (allSelected) {
  //     // Désélectionner tous
  //     setSelectedEmployees(prev => prev.filter(id => !employeeIdsInPoste.includes(id)));
  //   } else {
  //     // Sélectionner tous
  //     setSelectedEmployees(prev => [...new Set([...prev, ...employeeIdsInPoste])]);
  //   }
  // };

  const handleSelectAllEmployeesInPoste = (posteId) => {
    const employeesInPoste = employeesByPoste[posteId] || [];

    // Si le poste n'a pas d'employés, ne rien faire
    if (employeesInPoste.length === 0) {
      return;
    }

    const employeeIdsInPoste = employeesInPoste.map(emp => emp.id);

    // Vérifier si tous sont déjà sélectionnés
    const allSelected = employeeIdsInPoste.every(id => selectedEmployees.includes(id));

    if (allSelected) {
      // Désélectionner tous
      setSelectedEmployees(prev => prev.filter(id => !employeeIdsInPoste.includes(id)));
    } else {
      // Sélectionner tous
      setSelectedEmployees(prev => [...new Set([...prev, ...employeeIdsInPoste])]);
    }
  };

  // Basculer l'état développé/replié d'un poste
  const togglePosteExpansion = (posteId) => {
    setExpandedPostes(prev => ({
      ...prev,
      [posteId]: !prev[posteId]
    }));
  };

  // Gestion de la sélection des primes
  const handlePrimeSelection = (primeId) => {
    setSelectedPrimes((prevSelected) =>
      prevSelected.includes(primeId)
        ? prevSelected.filter((id) => id !== primeId)
        : [...prevSelected, primeId]
    );
  };

  // Envoi des données au backend pour affectation
  const handleAssignPrimes = async () => {
    if (selectedPrimes.length === 0 || selectedEmployees.length === 0) {
      alert("Sélectionnez au moins un employé et une prime.");
      return;
    }
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:5000/primes/assign",
        { primeIds: selectedPrimes, employeeIds: selectedEmployees },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Primes affectées avec succès !");
      setSelectedPrimes([]);
      setSelectedEmployees([]);

      // Rafraîchir les primes affectées après assignation
      const assignedPrimesData = await axios.get("http://localhost:5000/primes/assigned", {
        headers: { Authorization: `Bearer ${token}` },
      });


      setAssignedPrimes(assignedPrimesData.data);
    } catch (error) {
      alert("Erreur lors de l'affectation.");
      console.error(error);
    }
  };

  // Envoi des données au backend pour désaffectation
  const handleUnassignPrimes = async () => {
    if (selectedPrimes.length === 0 || selectedEmployees.length === 0) {
      alert("Sélectionnez au moins un employé et une prime à désaffecter.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:5000/primes/unassign",
        { primeIds: selectedPrimes, employeeIds: selectedEmployees },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Primes désaffectées avec succès !");
      setSelectedPrimes([]);
      setSelectedEmployees([]);

      // Rafraîchir les primes affectées après désaffectation
      const assignedPrimesData = await axios.get("http://localhost:5000/primes/assigned", {
        headers: { Authorization: `Bearer ${token}` },
      });
   
      setAssignedPrimes(assignedPrimesData.data);
    } catch (error) {
      alert("Erreur lors de la désaffectation.");
      console.error(error);
    }
  };
    if (loading) return <Spinner animation="border" variant="primary" style={{ marginTop: '20%', marginLeft: '50%' }} />
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div style={{ padding: "20px" }}>
      <nav className="mb-2">
        <Link to="/dashboard">Dashboard</Link>
        <span> / </span>
        <Link to="/Gpaiement" className="text-primary">Gestion Paie</Link>
        <span> / </span>
        <span>Affecter les primes aux employés</span>
      </nav>

      <div className="card card-primary card-outline">
        <div className="card-header d-flex">
          <img src={affecter} alt="" width="90px" />
          <p className="card-title mt-5 ml-2 p-2 text-center" style={{ width: '350px', borderRadius: '50px', border: '1px solid rgb(215, 214, 216)' }}>
            Affecter/Désaffecter les primes aux employés
          </p>
        </div>
      </div>

      <div style={{ display: "flex", gap: "20px", marginBottom: "20px", backgroundColor: "white" }}>
        {/* Liste des employés groupés par poste */}
        <div style={{ flex: 1, padding: "10px", border: "1px solid #ccc", borderRadius: "5px" }}>
          <p>Employés par Poste</p>
          <ul style={{ listStyle: "none", padding: 0, maxHeight: "900px", overflowY: "auto", marginTop: '14px' }}>
            {postes.map((poste) => (
              <li key={poste.id} style={{ marginBottom: "10px" }}>
                <div style={{ display: "flex", alignItems: "center", marginBottom: "5px" }}>
                  <button
                    onClick={() => togglePosteExpansion(poste.id)}
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      marginRight: "10px",
                      fontSize: "16px"
                    }}
                  >
                    {expandedPostes[poste.id] ? "▼" : "►"}
                  </button>
                  <label style={{ display: "flex", alignItems: "center", flex: 1 }}>
                    {/* <input
                      type="checkbox"
                      checked={(employeesByPoste[poste.id] || []).every(emp => selectedEmployees.includes(emp.id))}
                      onChange={() => handleSelectAllEmployeesInPoste(poste.id)}
                      style={{ marginRight: "10px" }}
                    /> */}
                    <input
                      type="checkbox"
                      checked={(employeesByPoste[poste.id] || []).length > 0 &&
                        (employeesByPoste[poste.id] || []).every(emp => selectedEmployees.includes(emp.id))}
                      onChange={() => handleSelectAllEmployeesInPoste(poste.id)}
                      disabled={(employeesByPoste[poste.id] || []).length === 0}
                      style={{ marginRight: "10px" }}
                    />
                    <strong>{poste.poste}</strong>
                    <small style={{ marginLeft: "5px", color: "#666" }}>
                      ({(employeesByPoste[poste.id] || []).length} employés)
                    </small>
                  </label>
                </div>

                {expandedPostes[poste.id] && (
                  <ul style={{ listStyle: "none", paddingLeft: "30px", marginTop: "5px" }}>
                    {(employeesByPoste[poste.id] || []).map((employee) => (
                      <li key={employee.id} style={{ marginBottom: "5px" }}>
                        <label style={{ display: "flex", alignItems: "center", fontFamily: "Arial, sans-serif", fontSize: "14px" }}>
                          <input
                            type="checkbox"
                            checked={selectedEmployees.includes(employee.id)}
                            onChange={() => handleEmployeeSelection(employee.id)}
                            style={{ marginRight: "10px" }}
                          />
                          {employee.User?.nom} {employee.User?.prenom}
                        </label>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </div>

        {/* Liste des primes */}
        <div style={{ flex: 1, padding: "10px", border: "1px solid #ccc", borderRadius: "5px" }}>
          <p>Primes</p>
          <ul style={{ listStyle: "none", padding: 0, maxHeight: "900px", overflowY: "auto", marginTop: '14px' }}>
            {primes.map((prime) => (
              <li key={prime.id} style={{ marginBottom: "10px" }}>
                <label style={{ display: "flex", alignItems: "center", fontFamily: "Arial, sans-serif", fontSize: "12px" }}>
                  <input
                    type="checkbox"
                    checked={selectedPrimes.includes(prime.id)}
                    onChange={() => handlePrimeSelection(prime.id)}
                    style={{ marginRight: "10px" }}
                  />
                  {prime.type_prime}
                  <small className="text-muted ml-1 mr-2"> identifiant :{prime.identifiant_special}</small>
                  ( {prime.montant})
                </label>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Boutons d'affectation et désaffectation */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        <button
          onClick={handleAssignPrimes}
          style={{
            padding: "10px 20px",
            backgroundColor: "#54a5fc",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
          disabled={selectedPrimes.length === 0 || selectedEmployees.length === 0}
        >
          Affecter les primes
        </button>

        <button
          onClick={handleUnassignPrimes}
          style={{
            padding: "10px 20px",
            backgroundColor: "#f55858",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
          disabled={selectedPrimes.length === 0 || selectedEmployees.length === 0}
        >
          Désaffecter les primes
        </button>
      </div>

      {/* Tableau des primes affectées */}
      <div style={{ padding: "20px", border: "1px solid #ccc", borderRadius: "5px", backgroundColor: "white" }}>
        <p>Employés et leurs Primes Affectées</p>
        <table style={{ width: "100%", maxHeight: "900px", overflowY: "auto", borderCollapse: "collapse", marginTop: "10px" }}>
          <thead>
            <tr>
              <th style={tableHeaderStyle}>Employé</th>
              <th style={tableHeaderStyle}>Poste</th>
              <th style={tableHeaderStyle}>Primes Affectées</th>
            </tr>
          </thead>
          <tbody>
            {assignedPrimes.map((employee) => {
              const poste = postes.find(p => p.id === employee.poste);
              return (
                <tr key={employee.id}>
                  <td style={tableCellStyle}>{employee.User?.nom} {employee.User?.prenom}</td>
                  <td style={tableCellStyle}>{poste?.poste || 'Non défini'}</td>
                  <td style={tableCellStyle}>
                    {employee.Primes.length > 0
                      ? employee.Primes.map((prime) => `${prime.type_prime} - ${prime.montant}`).join(", ")
                      : "Aucune prime"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Styles pour le tableau
const tableHeaderStyle = {
  border: "1px solid #ddd",
  padding: "10px",
  backgroundColor: "#f2f2f2",
  textAlign: "left",
  marginBottom: "14px"
};

const tableCellStyle = {
  border: "1px solid #ddd",
  padding: "10px",
};

export default AffecterPrimeEmploye;