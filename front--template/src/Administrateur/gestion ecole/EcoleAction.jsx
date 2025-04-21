import React from 'react';
import { useParams, useLocation } from 'react-router-dom';
import AjoutEcolePrincipal from './AjoutEcolePrincipal';

const EcoleAction = () => {
    const { action } = useParams(); // Récupérer l'action (ajoutecole ou modifier)
    const location = useLocation(); // Récupérer les données passées via navigate()

    // Récupérer l'école à modifier depuis l'état de la navigation
    const ecole = location.state?.ecole;

    if (action === 'ajoutecole') {
        return <AjoutEcolePrincipal />;
    } else if (action === 'modifier') {
        return <AjoutEcolePrincipal ecole={ecole} />; // Passer l'école à modifier
    } else {
        return <div>Action non reconnue</div>;
    }
};

export default EcoleAction;