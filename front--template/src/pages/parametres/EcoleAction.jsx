import React from 'react';
import { useParams } from 'react-router-dom';
import AjoutEcole from './AjoutEcole';

const EcoleAction = () => {
  const { action } = useParams();

  if (action === 'ajoutecolee') {
    return <AjoutEcole />;
  } else if (action === 'modifierecole') {
    return <AjoutEcole />;
  } else {
    return <div>Action non reconnue</div>;
  }
};

export default EcoleAction;
