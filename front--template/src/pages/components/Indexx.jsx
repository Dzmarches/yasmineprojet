import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import 'animate.css';
import OwlCarousel from 'react-owl-carousel';
import 'owl.carousel/dist/assets/owl.carousel.css';
import 'owl.carousel/dist/assets/owl.theme.default.css';
import gestionEtudiant from '../assets/imgs/stud.png';
import financialAdvisory from '../assets/imgs/cantine.png';
import managements from '../assets/imgs/bibliot.png';
import gestionProf from '../assets/imgs/proff.png';
import ScrollReveal from 'scrollreveal'; 
import Capture from '../assets/imgs/image.png';
import logo from '../assets/imgs/logo.png';


const Index = () => {

  useEffect(() => {
          // Vérifie si jQuery est chargé
          if (typeof $ === 'undefined') {
              console.error('jQuery is not loaded');
              return;
          }
  
          // Initialise Owl Carousel
          $('.header-carousel').owlCarousel({
              items: 1,
              loop: true,
              autoplay: true,
              autoplayTimeout: 3000,
              smartSpeed: 1000,
          });
      }, []);
      useEffect(() => {
        const sr = ScrollReveal({
            reset: true,
            distance: '12px',
            duration: 1000,
            delay: 200,
        });

        sr.reveal('#presentationImg', { origin: 'right' });
        sr.reveal('#presentationText', { origin: 'left' });
        sr.reveal('#contact', { origin: 'bottom' });

        const teamItems = document.querySelectorAll('.team-item');
        teamItems.forEach((item, index) => {
            setTimeout(() => {
                sr.reveal(item, { origin: 'bottom', delay: index * 200 });
            }, 100); 
        });

        return () => {
            sr.destroy();
        };
    }, []);

    const teamData = [
        { name: 'Gestion Etudiant', image: gestionEtudiant },
        { name: 'Food', image: financialAdvisory },
        { name: 'Biblio', image: managements },
        { name: 'Prof', image: gestionProf },
    ];

    const [isVisible, setIsVisible] = useState(false);
    
      
      useEffect(() => {
    
        const toggleVisibility = () => {
    
          if (window.scrollY > 300) {
            setIsVisible(true);
          } else {
            setIsVisible(false);
          }
        };
    
        window.addEventListener("scroll", toggleVisibility);
        return () => window.removeEventListener("scroll", toggleVisibility);
      }, []);
    
      // Fonction pour remonter en haut de la page
      const scrollToTop = () => {
        window.scrollTo({
          top: 0,
          behavior: "smooth", 
        });
      };

  return (
    <>
      <div className="container-fluid topbar bg-light px-5 d-none d-lg-block">
            <div className="row gx-0 align-items-center">
                <div className="col-lg-8 text-center text-lg-start mb-2 mb-lg-0">
                    <div className="d-flex flex-wrap">
                        <a href="#" className="text-muted small me-4"><i className="fas fa-map-marker-alt text me-2" style={{ color: 'rgb(104, 163, 252)'}}></i>Find A Location</a>
                        <a href="tel:+01234567890" className="text-muted small me-4"><i className="fas fa-phone-alt text me-2" style={{ color: 'rgb(104, 163, 252)' }}></i>+01234567890</a>
                        <a href="mailto:example@gmail.com" className="text-muted small me-0"><i className="fas fa-envelope text me-2" style={{ color: 'rgb(104, 163, 252)' }}></i>Example@gmail.com</a>
                    </div>
                </div>
                <div className="col-lg-4 text-center text-lg-end">
                    <div className="d-inline-flex align-items-center p-3" style={{ height: '43px' }}>
                        {['facebook-f', 'twitter', 'instagram', 'linkedin-in'].map((icon, index) => (
                            <a key={index} className="btn btn-light rounded-circle mx-2" href="" style={{ backgroundColor: 'rgb(104, 163, 252)', padding: '-5px' }}>
                                <i className={`fab fa-${icon}`} style={{ color: 'white' }}></i>
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </div>
        <nav className="navbar navbar-expand-lg navbar-light px-4 px-lg-5 py-3 py-lg-0 mt-5">
            <a href="#" className="navbar-brand p-0">
                <img src={logo} alt="Logo" />
            </a>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarCollapse">
                <span className="fa fa-bars"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarCollapse">
                <div className="navbar-nav ms-auto py-0">
                    <a href="/" className="nav-item nav-link active">Accueil</a>
                    <a href="#presentation" className="nav-item nav-link">Presentation</a>
                    <a href="#services" className="nav-item nav-link">Services</a>
                    <a href="#contact" className="nav-item nav-link">Contact</a>
                </div>
                <Link to="/login" className="btn rounded-pill py-2 px-4 my-3 my-lg-0 flex-shrink-0" style={{ backgroundColor: '#0061F2', color: "white" }}>
                    Connexion
                </Link>
            </div>
        </nav>
      <div className="header-carousel owl-carousel">
                  <div className="header-carousel-item">
                      <img src={Capture} className="img-fluid w-60" alt="Image" />
                      <div className="carousel-caption">
                          <div className="container">
                              <div className="row gy-0 gx-5">
                                  <div className="col-xl-5 animated fadeInLeft">
                                      <h4
                                          className="text text-uppercase fw-bold mb-4"
                                          style={{
                                              color: 'rgb(70, 144, 255)',
                                              textAlign: 'center',
                                          }}
                                      >
                                          Education
                                      </h4>
                                      <p className="mb-5 fs-5" style={{ textAlign: 'center' }}>
                                          Découvrez la première plateforme innovante en Algérie, révolutionnant le système éducatif !
                                      </p>
                                      <div className="d-flex justify-content-center">
                                          <a className="btn btn-light rounded-pill py-3 px-4 me-2" href="#" style={{color:'rgb(0,97,242)'}}>
                                              Watch Video
                                          </a>
                                          <a className="btn rounded-pill py-3 px-4 ms-2" style={{ backgroundColor: 'rgb(0,97,242)' }} href="#">
                                              Learn More
                                          </a>
                                      </div>
                                  </div>
                                  <div className="col-lg-0 col-xl-7"></div>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
      <div>
                  {/* about */}
                  <section className="container-fluid about py-5" id='presentation'>
                      <div className="container py-5">
                          <div className="row g-5 align-items-center" id='presentationText'>
                              <div className="col-xl-7" id="presentationText">
                                  <div>
                                      <h4 className="text">About Us</h4>
                                      <p className="mb-4">Notre plateforme est une solution numérique intégrée et intuitive qui centralise la gestion des opérations administratives, académiques et financières d'une école privée. Elle permet d'améliorer l'efficacité, de réduire les erreurs manuelles et de fournir des outils de suivi et d'analyse en temps réel.</p>
                                  </div>
                              </div>
                              <div className="col-xl-5" id="presentationImg">
                                  <div className="bg rounded position-relative overflow-hidden" style={{ backgroundColor: 'rgb(130, 180, 255)' }}>
                                      <img src={Capture} className="img-fluid rounded w-100" alt="" />
                                  </div>
                              </div>
                          </div>
                      </div>
                  </section>
      
                  {/* services */}
                  <section className="container-fluid team pb-5" id='services'>
                      <div className="container pb-5">
                          <div className="text-center mx-auto pb-5" style={{ maxWidth: '800px' }}>
                              <h4 className="text">Our Team</h4>
                              <h1 className="display-5 mb-4">Meet Our Advisers</h1>
                          </div>
                          <div className="row g-4">
                              {teamData.map((member, index) => (
                                  <div className="col-md-6 col-lg-6 col-xl-3" key={index}>
                                      <div className="team-item ">
                                          <div className="team-img">
                                              <img src={member.image} className="img-fluid p-4" alt={member.name} />
                                          </div>
                                          <div className="team-title">
                                              <h4 className="mb-0">{member.name}</h4>
                                          </div>
                                      </div>
                                  </div>
                              ))}
                          </div>
                      </div>
                  </section>
      
      
                  {/* clients */}
                    {/* <!-- Clients--> */}
          <div className="clients ">
              <hr/>
              <div className="container">
                  <div className="row text-center">
                      <div className="col-md-4 mt-4" >
                          <span className="fa-stack fa-4x" >
                              <i className="fas fa-circle fa-stack-2x color-primary"></i>
                              <i className="fas  fa-calendar-check fa-stack-1x fa-inverse " ></i>
                          </span>
                          <h4 className="my-3">Projets</h4>
                          <p className="text-muted">6</p>
                      </div>
                      <div className="col-md-4 mt-4">
                          <span className="fa-stack fa-4x">
                              <i className="fas fa-circle fa-stack-2x color-primary"></i>
                              <i className="fas fa-users fa-stack-1x fa-inverse"></i>
                              
                          </span>
                          <h4 className="my-3 mt-4">Clients</h4>
                          <p className="text-muted">999</p>
                      </div>
                      <div className="col-md-4 mt-4">
                          <span className="fa-stack fa-4x">
                              <i className="fas fa-circle fa-stack-2x color-primary"></i>
                              <i className="fas fa-download fa-stack-1x fa-inverse"></i>
                          </span>
                          <h4 className="my-3">Téléchargements</h4>
                          <p className="text-muted">500</p>
                      </div>
                  </div>
                 
              </div>
              <hr/>
          </div>
      
                  <section className="page-section p-5 d-flex align-items-center justify-content-center" id="contact"  style={{background: "linear-gradient(45deg, #68A3FC, #4B8ED9, #2B6BBF)"}}>
                      <div className="container">
                          <form id="contactForm"  style={{borderRadius:"20px",padding:"5px"}}>
                              <div className="text-center" style={{ color: "white" }}>
                                  <h2 className="section-heading text-uppercase mb-5">Contact</h2>
                              </div>
                              <div className="row align-items-stretch mb-5">
                                  <div className="col-md-8 col-lg-6 mx-auto">
                                      <div className="form-group">
                                          <input className="form-control" id="name" type="text" placeholder="Nom *" required />
                                      </div><br />
                                      <div className="form-group">
                                          <input className="form-control" id="email" type="email" placeholder="Email *" required />
                                      </div><br />
                                      <div className="form-group mb-md-0">
                                          <input className="form-control" id="phone" type="tel" placeholder="Numéro de téléphone*" required />
                                      </div><br />
                                      <div className="form-group form-group-textarea mb-md-0">
                                          <textarea className="form-control" id="message" placeholder="Your Message *" required></textarea>
                                      </div><br />
                                  </div>
                              </div>
                              <div className="text-center">
                                  <button className="btn btn-xl text-uppercase" id="submitButton" type="submit" style={{ color: "white" }}>Envoyer</button>
                              </div>
                          </form>
                      </div>
                  </section>
              </div>
              <div className="container-fluid footer py-5 wow fadeIn " data-wow-delay="0.2s"style={{background:"#17303B",color:"white"}} >  
            <div className="container py-5 border-start-0 border-end-0" style={{ border: '1px solid', borderColor: 'rgba(255, 255, 255, 0.08)' }}>
                <div className="row g-5">
                    <div className="col-md-6 col-lg-6 col-xl-4">
                        <div className="footer-item">
                            <a href="index.html" className="p-0">
                                <h4 className="text-white"><i className="fas fa-search-dollar me-3"></i>Stocker</h4>
                            </a>
                            <p className="mb-4">Dolor amet sit justo amet elitr clita ipsum elitr est.Lorem ipsum dolor sit amet, consectetur adipiscing...</p>
                            <div className="d-flex">
                                <a href="#" className="bg-dark d-flex rounded align-items-center py-2 px-3 me-2" >
                                    <i className="fas fa-apple-alt text-white"></i>
                                    <div className="ms-3">
                                        <small className="text-white">Download on the</small>
                                        <h6 className="text-white">App Store</h6>
                                    </div>
                                </a>
                                <a href="#" className="bg-dark d-flex rounded align-items-center py-2 px-3 ms-2">
                                    <i className="fas fa-play text" style={{ color: '#f49719' }}></i>
                                    <div className="ms-3">
                                        <small className="text-white">Get it on</small>
                                        <h6 className="text-white">Google Play</h6>
                                    </div>
                                </a>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6 col-lg-6 col-xl-2">
                        <div className="footer-item">
                            <h4 className="text-white mb-4">Quick Links</h4>
                            {['About Us', 'Feature', 'Attractions', 'Tickets', 'Blog', 'Contact us'].map((link, index) => (
                                <a href="#" key={index}><i className="fas fa-angle-right me-2"></i> {link}</a>
                            ))}
                        </div>
                    </div>
                    <div className="col-md-6 col-lg-6 col-xl-3">
                        <div className="footer-item">
                            <h4 className="text-white mb-4">Support</h4>
                            {['Privacy Policy', 'Terms & Conditions', 'Disclaimer', 'Support', 'FAQ', 'Help'].map((link, index) => (
                                <a href="#" key={index}><i className="fas fa-angle-right me-2"></i> {link}</a>
                            ))}
                        </div>
                    </div>
                    <div className="col-md-6 col-lg-6 col-xl-3">
                        <div className="footer-item">
                            <h4 className="text-white mb-4">Contact Info</h4>
                            <div className="d-flex align-items-center">
                                <i className="fas fa-map-marker-alt text me-3" style={{ color: '#f49719' }}></i>
                                <p className="text-white mb-0">123 Street New York.USA</p>
                            </div>
                            <div className="d-flex align-items-center">
                                <i className="fas fa-envelope text me-3" style={{ color: '#f49719' }}></i>
                                <p className="text-white mb-0">info@example.com</p>
                            </div>
                            <div className="d-flex align-items-center">
                                <i className="fa fa-phone-alt text me-3" style={{ color: '#f49719' }}></i>
                                <p className="text-white mb-0">(+012) 3456 7890</p>
                            </div>
                            <div className="d-flex align-items-center mb-4">
                                <i className="fab fa-firefox-browser text me-3" style={{ color: '#f49719' }}></i>
                                <p className="text-white mb-0">Yoursite@ex.com</p>
                            </div>
                            <div className="d-flex">
                                {['facebook-f', 'twitter', 'instagram', 'linkedin-in'].map((icon, index) => (
                                    <a key={index} className="btn btn btn-sm-square rounded-circle me-3" href="#"><i className={`fab fa-${icon} text-white`}></i></a>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div className="container-fluid copyright py-4">
            <div className="container">
                <div className="row g-4 align-items-center">
                    <div className="col-md-6 text-center text-md-start mb-md-0">
                        <span className="text-body"><a href="#" className="border-bottom text-white"><i className="fas fa-copyright text-light me-2"></i>Your Site Name</a>, All right reserved.</span>
                    </div>
                    <div className="col-md-6 text-center text-md-end text-body">
                        Designed By <a className="border-bottom text-white" href="https://htmlcodex.com">HTML Codex</a> Distributed By <a className="border-bottom text-white" href="https://themewagon.com">ThemeWagon</a>
                    </div>
                </div>
            </div>
        </div>
        <div>
      {isVisible && (
        <button
          onClick={scrollToTop}
          style={styles.button}
        >
          ↑ 
        </button>
      )}
    </div>
    </>
  );
};
const styles = {
  
  button: {
    position: "fixed",
    bottom: "20px",
    right: "20px",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "50%",
    padding: "10px 15px",
    fontSize: "20px",
    cursor: "pointer",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    zIndex: 1000,
    width:"50px",
    height:"55px"
  },
};

export default Index;