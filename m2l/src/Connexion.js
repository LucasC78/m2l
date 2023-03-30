// import { useState, useEffect } from 'react';
import './Bootstrap.css';
import './Responsive.css';
import './Style.css';
import React, { useState, useEffect } from 'react';
import { Routes, Route, Link } from "react-router-dom";
import Add from './img/account.png';
import Inscription from './Inscription';
import axios from 'axios';


function Connexion() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (event) => {
    event.preventDefault();
    console.log('connexion')
    const response = await axios.post('http://localhost:8000/Connexion', {
      email,
      password,
    });
    console.log(response.data);
    // console.log("vous etes co");
  };
    return (
    
      <div><br/>
        <section className="contact_section">
        <div className="container">
                  <div className="row">
                      <div className="col-md-6">
                          <div className="form_container">
                              <div className="heading_container">
                                  <h2>
                                      J'ai déja un compte !
                                  </h2>
                              </div>
                              <form onSubmit={handleSubmit}>
                          
                                  <div>
                                      <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)}/>
                                  </div>
                                  <div>
                                      <input type="password" placeholder="Mot de passe" value={password} onChange={(e) => setPassword(e.target.value)}/>
                                 
                                  </div>
                                  <div className="d-flex ">
                                      <button type='submit'>
                                          Se Connecter
                                      </button>
                                  </div>
                              </form>
                          </div>
                      </div>
                      
 
                      <div className="col-md-6">
                          <div className="form_container">
                                <div className="heading_container">
                                  <h2>
                                      Clique sur l'icone si tu veux créer ton compte !
                                  </h2>
                                </div>
                                <Link to="/Inscription">
                                    <img src={Add} alt=""/>
                                </Link>
                          </div>
                      
                      </div>
                  </div>
              </div>
              </section><br/><br/>
      </div>
    )
  }
  export default Connexion;