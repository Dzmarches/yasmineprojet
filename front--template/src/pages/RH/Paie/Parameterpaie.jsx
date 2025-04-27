
import React from 'react';
import { Link } from 'react-router-dom';
import Can from '../../../can';

// Import des images
import time from '../../../assets/imgs/time.png';
import parametre from '../../../assets/imgs/parametres.png';
import retard from '../../../assets/imgs/en-retard.png';


const Parameterpaie = () => {
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
            to: "/heuresSup", 
            img: time, 
            title: "Heures supplémentaires", 
            permission: "Ressources Humaines-gestion de la paye-Voir" 
        },
        { 
            id: 2, 
            to: "/parametreRetard", 
            img:retard, 
            title: "paramétrer les retards", 
            permission: "Ressources Humaines-gestion de la paye-Voir" 
        },
       
       
    ];

    return (
        <div style={styles.mainContainer}>
            <nav>
                <Link to="/dashboard" className="text-primary">Accueil</Link>
                <span> / </span>
                <Link to="/Gpaiement" className="text-primary">Gestion Paie</Link>
                <span> / </span>
                <span>Paramètres de paie</span>
            </nav>

  

            <h2 style={styles.sectionTitle}>Paramètres de paie</h2>

            {/* Conteneur Grid pour les cartes */}
            <div style={styles.cardContainer}>
                {cards.map((card) => (
                    <Can permission={card.permission} key={card.id}>
                        <Link to={card.to} style={{ textDecoration: "none" ,color:'black'}}>
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

export default Parameterpaie;
