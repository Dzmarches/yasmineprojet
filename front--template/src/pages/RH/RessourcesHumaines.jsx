import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Can from '../../can';

// Import des images
import conge from '../../assets/imgs/leave.png';
import employe from '../../assets/imgs/employe.png';
import absence from '../../assets/imgs/absenceEmploye.png';
import attestation from '../../assets/imgs/document-atteste.png';
import localisation from '../../assets/imgs/carte.png';
import rapport from '../../assets/imgs/details.png';
import axios from 'axios';

const RessourcesHumaines = () => {
  const [employes, setemployes] = useState(null);
  const [retard, setretard] = useState(null);
  const [absent, setabsent] = useState(null);
  const [present, setpresent] = useState(null);



  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          alert("Vous devez être connecté pour accéder à ces informations.");
          return;
        }

        const [employes, pointages] = await Promise.all([
          axios.get(`http://localhost:5000/employes/liste`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`http://localhost:5000/pointage/liste`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        const employePactif = employes.data.filter((item) => item.User?.statuscompte === "activer")
        setemployes(employePactif.length);

        const employeabsent = pointages.data.filter((item) => item.statut === "absent");
        setabsent(employeabsent.length)

        const employepresent = pointages.data.filter((item) => item.statut === "present");
        setpresent(employepresent.length)

        const employeretard = pointages.data.filter((item) => item.statut === "retard");
        setretard(employeretard.length)

      } catch (error) {
        console.error("Erreur lors de la récupération des données", error);
      }
    };
    fetchData();

  }, []);

  const styles = {

    mainContainer: {
      padding: "20px",
      maxWidth: "1200px",
      margin: "0 auto"
    },
    cardContainer: {
      padding: "150px",
      display: "grid",
      gridTemplateColumns: "repeat(4, 1fr)", // 4 colonnes
      gap: "20px",
      marginTop: "20px",
      // "@media (max-width: 1000px)": {
      //     gridTemplateColumns: "repeat(3, 1fr)" // 3 colonnes sur tablette
      // },
      // "@media (max-width: 768px)": {
      //     gridTemplateColumns: "repeat(2, 1fr)" // 2 colonnes sur mobile
      // },
      // "@media (max-width: 480px)": {
      //     gridTemplateColumns: "1fr" // 1 colonne sur petit mobile
      // }
    },
    card: {
      width: "100%", // S'adapte à la largeur de la colonne
      aspectRatio: "1/1", // Carré
      background: "white",
      border: "solid 2px rgb(150, 148, 148)",
      borderRadius: "8px",
      textAlign: "center",
      padding: "15px",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      transition: "transform 0.2s",
      "&:hover": {
        transform: "scale(1.05)"
      }
    },

    image: {
      width: "60px",
      height: "60px",
      objectFit: "contain"
    },
    title: {
      marginTop: "10px",
      fontSize: "13px",
      fontWeight: "500"
    },
    sectionTitle: {
      textAlign: "center",
      margin: "30px ",
      marginBottom: "-90px ",
      fontSize: "24px",
      color: "#333"
    }
  };

  // Liste des cartes avec leurs permissions
  const cards = [
    {
      id: 1,
      to: "/employes",
      img: employe,
      title: "Gestion Employés",
      permission: "Ressources Humaines-Gestion des employées-Voir"
    },
    {
      id: 2,
      to: "/Conges",
      img: conge,
      title: "Gestion congés et absences",
      permission: "Ressources Humaines-Gestion demande de congé-Voir"
    },
    {
      id: 3,
      to: "/rapportConges",
      img: rapport,
      title: "Rapport Conges",
      permission: "Ressources Humaines-Gestion demande de congé-Voir"
    },
    {
      id: 4,
      to: "/gestionTemps",
      img: absence,
      title: "Gestion Pointage Manuel",
      permission: "Ressources Humaines-Gestion pointage-Voir"
    },
    {
      id: 5,
      to: "/rapportPointage",
      img: rapport,
      title: "Rapport Pointages",
      permission: "Ressources Humaines-rapports pointage-Voir"
    },
    {
      id: 6,
      to: "/pointage/localisation",
      img: localisation,
      title: "Pointage par Localisation",
      permission: "Ressources Humaines-Gestion de mes pointage-Voir"
    },
    {
      id: 7,
      to: "/mesDemandes",
      img: conge,
      title: "Mes demandes",
      permission: "Ressources Humaines-Gestion de mes demande de congé-Voir"
    }

  ];

  return (
    <div style={styles.mainContainer}>
      <nav>
        <Link to="/dashboard">Accueil</Link> / Gestion RH
      </nav>
      <section className="content mt-4">
        <div className="container-fluid">
          <div className="row g-3">
            {[
              { label: "Employés", value: employes },
              { label: "Présents", value: present },
              { label: "En Retards", value: retard },
              { label: "Absents", value: absent }, 
            ].map((item, index) => (
              <div className="col-12 col-sm-6 col-md-3" key={index}>
                <div className="info-box  p-2 bg-white rounded hover-effect">
                  <span className="info-box-icon d-flex align-items-center justify-content-center bg-light me-3" style={{ width: 60, height: 60 }}>
                    <img src={employe} alt="" style={{ width: 40, height: 40 }} />
                  </span>
                  <div className="info-box-content">
                    <span className="info-box-text text-muted">{item.label}</span>
                    <span className="info-box-number fs-4 fw-bold">{item.value}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>


      <h2 style={styles.sectionTitle}>Gestion des Ressources Humaines</h2>

      {/* Conteneur Flex pour les cartes */}
      <div style={styles.cardContainer}>
        {cards.map((card) => (
          <Can permission={card.permission} key={card.id}>
            <Link to={card.to} style={{ textDecoration: "none", color: 'black' }}>
              <div style={styles.card}>
                <img src={card.img} alt={card.title} style={styles.image} />
                <p style={styles.title}>{card.title}</p>
              </div>
            </Link>
          </Can>
        ))}
      </div>
    </div>
  );
};

export default RessourcesHumaines;