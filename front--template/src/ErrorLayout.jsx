// src/layouts/ErrorLayout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';

const ErrorLayout = () => {
  return (
    <div style={{ minHeight: '100vh' }}>
      {/* Vous pouvez ajouter un header ou footer spécifique ici si besoin */}
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default ErrorLayout;