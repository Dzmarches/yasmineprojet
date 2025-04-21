// src/components/Can.js
import React from 'react';
import { useAuth } from './components/AuthContext';
import { PERMISSIONS } from './permission';

const Can = ({ 
  permission, 
  children, 
  fallback = null,
  or = [] 
}) => {
  const { user } = useAuth();

  if (!user || !user.permissions) {
    return fallback;
  }

  // Vérifie la permission principale ou les permissions alternatives
  const hasPermission = user.permissions.includes(permission) || 
                       or.some(p => user.permissions.includes(p));
  
  return hasPermission ? children : fallback;
};

export default Can;
// import React from 'react';
// import { useAuth } from './components/AuthContext';

// const Can = ({ permission, children }) => {
//   const { user } = useAuth();

//   // Vérifiez si user et user.permissions existent
//   if (user && user.permissions && user.permissions.includes(permission)) {
//     return children;
//   }

//   return null;
// };

// export default Can;