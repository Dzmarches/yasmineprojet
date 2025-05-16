import React from 'react';
import { Link } from 'react-router-dom';
import Can from '../../can';

import fournisseurIcon from '../../assets/imgs/supplier.png';
import achatIcon from '../../assets/imgs/add-to-cart.png';
import articleIcon from '../../assets/imgs/checklist.png';
import categorieIcon from '../../assets/imgs/categories.png';
import stock from '../../assets/imgs/stock.png'

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
            to: "/categorie",
            img: categorieIcon,
            title: "Gestion catégorie",
            permission: "Academique-Trimestre-Voir"
        },
        {
            id: 2,
            to: "/article",
            img: articleIcon,
            title: "Gestion article",
            permission: "Academique-Trimestre-Voir"
        },
        {
            id: 3,
            to: "/achat",
            img: achatIcon,
            title: "Gestion achats",
            permission: "Academique-Sections-Voir"
        },
        {
            id: 4,
            to: "/categorie",
            img: fournisseurIcon,
            title: "Gestion catégorie",
            permission: "Academique-Niveaux-Voir"
        }
    ];

    return (
        <div style={styles.mainContainer}>
            <nav>
                <Link to="/dashboard">Accueil</Link> / Autres éléments Académiques
            </nav>
            <div className="card card-primary card-outline">
                <div className="card-header d-flex " style={{ backgroundColor: '#F8F8F8' }}>
                    <img src={stock} alt="" width="90px" />
                    <p className="card-title mt-5 ml-2 p-2 text-center" style={{ width: '350px', borderRadius: '50px', border: '1px solid rgb(215, 214, 216)' }}>
                        Gestion Stocks
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
