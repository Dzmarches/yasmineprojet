// src/components/Layout.jsx
import React from 'react';
import NavBar from './components/Navbar';
import SideBar from './components/Sidebar';
import './styles.css'

const Layoute = ({ children }) => {
  return (
    <div className="wrapper">
      <NavBar />
      <SideBar />
      <div className="content-wrapper" style={{ backgroundColor: "#faf9f9" }}>
        <div className='content'>
          {children}
        </div>
      </div>
    </div>
  );
};

export default Layoute;