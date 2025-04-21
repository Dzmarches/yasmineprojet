// src/components/Layout.jsx
import React from 'react';
import NavBarAdministrateur from './NavBarAdministrateur';
import SideBarAdministrateur from './SideBarAdministrateur';
import './style.css'

const Layout = ({ children }) => {
  return (
    <div className="wrapper">
      <NavBarAdministrateur />
      <SideBarAdministrateur />
      <div className="content-wrapper" style={{ backgroundColor: "#faf9f9" }}>
        {children}
      </div>
    </div>
  );
};

export default Layout;