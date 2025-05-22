import React from 'react';
import { Link } from 'react-router-dom';
import Can from '../../can';
import emploi from '../../assets/imgs/emploi.png';
import emploie from '../../assets/imgs/timetable.png';
import disponibility from '../../assets/imgs/availability.png';

const GestionEmploiDuTemps = () => {
    const styles = {
        mainContainer: {
            padding: "5px",
            maxWidth: "1200px",
            margin: "0 auto"
        },
        cardContainer: {
            padding: "150px",
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "20px",
            marginTop: "-50px"
        },
        card: {
            width: "100%",
            aspectRatio: "1/1",
            background: "white",
            // border: "solid 2px rgb(150, 148, 148)",
            borderRadius: "8px",
            textAlign: "center",
            padding: "0px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            transition: "all 0.3s ease-in-out"
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
        }
    };

    const cards = [
        {
            id: 1,
            to: "/EmploiDuTempsv2",
            img: emploi,
            title: "Organisation éducative",
            permission: "Academique-Voir"
        },
        {
            id: 2,
            to: "/EmploiDuTemps",
            img: emploie,
            title: "Emploi du Temps",
            permission: "Academique-Voir"
        },
        {
            id: 3,
            to: "/disponibilites-enseignants",
            img: disponibility,
            title: "Disponibilité des enseignants",
            permission: "Academique-Voir"
        }
    ];

    return (
        <div style={styles.mainContainer}>
            {/* 👉 Style d'animation hover injecté ici */}
            <style>{`
    .customCard {
        border: 2px solid rgb(150, 148, 148); /* style par défaut ici */
        cursor: pointer;
    }

    .customCard:hover {
        transform: scale(1.05);
        border: 2px solid rgb(52, 54, 129);
        box-shadow: 0 6px 15px rgba(0, 0, 0, 0.15);
    }
`}</style>

            <nav>
                <Link to="/dashboard">Accueil</Link> / Emploi du Temps
            </nav>
            <div className="card card-primary card-outline">
                <div className="card-header d-flex" style={{ backgroundColor: '#F8F8F8' }}>
                    <img src={emploi} alt="" width="90px" />
                    <p className="card-title mt-5 ml-2 p-2 text-center" style={{ width: '350px', borderRadius: '50px', border: '1px solid rgb(215, 214, 216)' }}>
                        Planification Académique
                    </p>
                </div>

                <div className="card-body">
                    <div className="tab-content">
                        <div className="tab-pane fade show active" id="listes">
                            <div style={styles.cardContainer}>
                                {cards.map((card) => (
                                    <Can permission={card.permission} key={card.id}>
                                        <Link to={card.to} style={{ textDecoration: "none", color: "black" }}>
                                            <div style={styles.card} className="customCard">
                                                <img src={card.img} alt={card.title} style={styles.image} />
                                                <p style={styles.title}>{card.title}</p>
                                            </div>
                                        </Link>
                                    </Can>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GestionEmploiDuTemps;
