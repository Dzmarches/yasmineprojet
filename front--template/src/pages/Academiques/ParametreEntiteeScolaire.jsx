import React from 'react';
import { Link } from 'react-router-dom';
import Can from '../../can';

import Annee from '../../assets/imgs/annee.png'
import Semestre from '../../assets/imgs/semester.png'
import Section from '../../assets/imgs/section.png'
import Niveaux from '../../assets/imgs/niveaux.png'
import Matiere from '../../assets/imgs/matiere.png'
import Salle from '../../assets/imgs/classe.png';

const GestionAcademiqueAutres = () => {
    const styles = {
        mainContainer: {
            padding: "5px",
            maxWidth: "1200px",
            margin: "0 auto"
        },
        cardContainer: {
            padding: "150px",
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)", // 4 colonnes
            gap: "20px",
            marginTop: "-50px",
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
            padding: "0px",
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
            margin: "0px ",
            marginBottom: "-70px ",
            fontSize: "24px",
            color: "#333"
        }
    };

    const cards = [
        {
            id: 1,
            to: "/annee",
            img: Annee,
            title: "Année Scolaire",
            permission: "Academique-Trimestre-Voir"
        },
        {
            id: 2,
            to: "/Trimest",
            img: Semestre,
            title: "Trimestres",
            permission: "Academique-Trimestre-Voir"
        },
        {
            id: 3,
            to: "/sections",
            img: Section,
            title: "Sections",
            permission: "Academique-Sections-Voir"
        },
        {
            id: 4,
            to: "/niveaux",
            img: Niveaux,
            title: "Niveaux",
            permission: "Academique-Niveaux-Voir"
        },
        {
            id: 5,
            to: "/matiere",
            img: Matiere,
            title: "Matières",
            permission: "Academique-Matière-Voir"
        },
        {
            id: 6,
            to: "/salle",
            img: Salle,
            title: "Salles de classe",
            permission: "Academique-Salle-Voir"
        }
    ];

    return (
        <div style={styles.mainContainer}>
            <nav>
                <Link to="/dashboard">Accueil</Link> / Autres éléments Académiques
            </nav>
            <div className="card card-primary card-outline">
                <div className="card-header d-flex " style={{ backgroundColor: '#F8F8F8' }}>
                    <img src={Niveaux} alt="" width="90px" />
                    <p className="card-title mt-5 ml-2 p-2 text-center" style={{ width: '350px', borderRadius: '50px', border: '1px solid rgb(215, 214, 216)' }}>
                        Paramètre Des entitées Scolaire
                    </p>
                </div>

                <div className="card-body">
                    <div className="tab-content" id="custom-content-below-tabContent">
                        <div className="tab-pane fade show active" id="listes" role="tabpanel" aria-labelledby="custom-content-below-home-tab">
                            <div style={styles.cardContainer}>
                                {cards.map((card) => (
                                    <Can permission={card.permission} key={card.id}>
                                        <Link to={card.to} style={{ textDecoration: "none", color: "black" }}>
                                            <div style={styles.card}>
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

export default GestionAcademiqueAutres;
