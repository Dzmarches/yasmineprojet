// src/components/Forbidden.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import './Forbidden.css'; // Assurez-vous d'importer le fichier CSS


const Forbidden = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 text-center px-6 mt-2 p-3">
      <div className="bg-white shadow-lg rounded-2xl p-5 max-w-lg w-full">
        <div className="circle-animation">
          <h1 className="text-5xl font-bold text-red-600">403</h1>
        </div>
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Accès Refusé</h2>
        <p className="text-gray-600 mb-6">
          Vous n'avez pas les permissions nécessaires pour accéder à cette page.
        </p> <br />
        
        <Link 
          to="/dashboard"
          className="p-3 bg-red text-white rounded-lg shadow-md hover:bg-blue-700 transition duration-300 ease-in-out"
        >
          Retour au tableau de bord
        </Link>
        
      </div>
    </div>
  );
};

export default Forbidden;