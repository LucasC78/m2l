
import './Bootstrap.css';
import './Responsive.css';
import './Style.css';
import { Routes, Route, Link } from "react-router-dom";
import Logo1 from './img/logo.png'

function NavbarConnexion(){
    return(
        <header className="header_section">
        <div className="container-fluid">
          <nav className="navbar navbar-expand-lg custom_nav-container ">
            <Link className="navbar-brand" to="/Connexion">
              <img className='sizelogo' src={Logo1} alt=""/>
            </Link>
  
            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
              <span> </span>
            </button>
  
            <div className="collapse navbar-collapse" id="navbarSupportedContent">
              <ul className="navbar-nav">
                <li className="nav-item active">
                  
                  <Link className="nav-link" to="/Connexion">Se Connecter <span className="sr-only">(current)</span></Link>
                 
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/Inscription"> S'inscrire </Link>
                </li>
              </ul>
              <div className="user_option-box">
                <Link to="/Inscription">
                  <i className="fa fa-user" aria-hidden="true"></i>
                </Link>
              
              </div>
            </div>
          </nav>
        </div>
      </header>

 )
};
export default NavbarConnexion;