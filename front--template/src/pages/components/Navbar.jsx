import axios from 'axios';
import React, { useEffect, useState } from 'react'

const Navbar = () => {

  const [roles, setRoles] = useState([]);
  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("❌ Aucun token trouvé. Veuillez vous connecter.");
        return;
      }
      try {
        const response = await axios.get("http://localhost:5000/getMe", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        // console.log("✅ Réponse roles :", response.data.roles);
        setRoles(response.data.roles);
      } catch (error) {
        console.error("❌ Erreur lors de la récupération des informations de l'utilisateur :", error);
      }
    };
    fetchUser();
  }, []);

  return (
    <nav className="main-header navbar navbar-expand navbar-white navbar-light">
  
    <ul className="navbar-nav">
      <li className="nav-item">
        <a className="nav-link" data-widget="pushmenu" href="#" role="button"><i className="fas fa-bars"></i></a>
      </li>
      <li className="nav-item d-none d-sm-inline-block">
        <a href="/dashboard" className="nav-link">Tableau de bord</a>
      </li>
      <li className="nav-item d-none d-sm-inline-block">
        <a href="/dashboard" className="nav-link">Acceuil</a>
      </li>
      {roles.includes("Employé") ? (
      <li className="nav-item d-none d-sm-inline-block">
        <a href="/profile" className="nav-link">Profile</a>
      </li>
      ):''}
    </ul>

  
    <ul className="navbar-nav ml-auto">
      <li className="nav-item dropdown">
        <a className="nav-link" data-toggle="dropdown" href="#">
          <i className="far fa-comments"></i>
          <span className="badge badge-danger navbar-badge">3</span>
        </a>
        <div className="dropdown-menu dropdown-menu-lg dropdown-menu-right">
          <a href="#" className="dropdown-item">
           
            <div className="media">
              <img src="dist/img/user1-128x128.jpg" alt="User Avatar" className="img-size-50 mr-3 img-circle"/>
              <div className="media-body">
                <h3 className="dropdown-item-title">
                  Brad Diesel
                  <span className="float-right text-sm text-danger"><i className="fas fa-star"></i></span>
                </h3>
                <p className="text-sm">Call me whenever you can...</p>
                <p className="text-sm text-muted"><i className="far fa-clock mr-1"></i> 4 Hours Ago</p>
              </div>
            </div>
           
          </a>
          <div className="dropdown-divider"></div>
          <a href="#" className="dropdown-item">
          
            <div className="media">
              <img src="dist/img/user8-128x128.jpg" alt="User Avatar" className="img-size-50 img-circle mr-3"/>
              <div className="media-body">
                <h3 className="dropdown-item-title">
                  John Pierce
                  <span className="float-right text-sm text-muted"><i className="fas fa-star"></i></span>
                </h3>
                <p className="text-sm">I got your message bro</p>
                <p className="text-sm text-muted"><i className="far fa-clock mr-1"></i> 4 Hours Ago</p>
              </div>
            </div>
           
          </a>
          <div className="dropdown-divider"></div>
          <a href="#" className="dropdown-item">
           
            <div className="media">
              <img src="dist/img/user3-128x128.jpg" alt="User Avatar" className="img-size-50 img-circle mr-3"/>
              <div className="media-body">
                <h3 className="dropdown-item-title">
                  Nora Silvester
                  <span className="float-right text-sm text-warning"><i className="fas fa-star"></i></span>
                </h3>
                <p className="text-sm">The subject goes here</p>
                <p className="text-sm text-muted"><i className="far fa-clock mr-1"></i> 4 Hours Ago</p>
              </div>
            </div>
          
          </a>
          <div className="dropdown-divider"></div>
          <a href="#" className="dropdown-item dropdown-footer">See All Messages</a>
        </div>
      </li>
  
      <li className="nav-item dropdown">
        <a className="nav-link" data-toggle="dropdown" href="#">
          <i className="far fa-bell"></i>
          <span className="badge badge-warning navbar-badge">15</span>
        </a>
        <div className="dropdown-menu dropdown-menu-lg dropdown-menu-right">
          <span className="dropdown-item dropdown-header">15 Notifications</span>
          <div className="dropdown-divider"></div>
          <a href="#" className="dropdown-item">
            <i className="fas fa-envelope mr-2"></i> 4 new messages
            <span className="float-right text-muted text-sm">3 mins</span>
          </a>
          <div className="dropdown-divider"></div>
          <a href="#" className="dropdown-item">
            <i className="fas fa-users mr-2"></i> 8 friend requests
            <span className="float-right text-muted text-sm">12 hours</span>
          </a>
          <div className="dropdown-divider"></div>
          <a href="#" className="dropdown-item">
            <i className="fas fa-file mr-2"></i> 3 new reports
            <span className="float-right text-muted text-sm">2 days</span>
          </a>
          <div className="dropdown-divider"></div>
          <a href="#" className="dropdown-item dropdown-footer">See All Notifications</a>
        </div>
      </li>
      <li className="nav-item">
        <a className="nav-link" data-widget="fullscreen" href="#" role="button">
          <i className="fas fa-expand-arrows-alt"></i>
        </a>
      </li>
    
    </ul>
  </nav>
  )
}

export default Navbar
