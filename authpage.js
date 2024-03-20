import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Authentification() {
  const [identifiant, setIdentifiant] = useState('');
  const [motDePasse, setMotDePasse] = useState('');
  const [erreur, setErreur] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Ajout de l'état de connexion

  useEffect(() => {
    // Vérifier si l'utilisateur est déjà connecté
    axios.get('/api/isLoggedIn')
      .then(response => {
        setIsLoggedIn(true); // Définir l'état de connexion sur true si l'utilisateur est connecté
      })
      .catch(error => {
        console.error('Erreur lors de la vérification de la connexion :', error);
      });
  }, []); // Effectuer cette vérification une seule fois lors du chargement initial de la page

  const handleLogin = () => {
    axios.post('/api/login', { identifiant, motDePasse })
      .then(response => {
        // Si l'authentification est réussie, définissez l'état de connexion sur true
        setIsLoggedIn(true);
        // Redirigez l'utilisateur vers la page d'accueil
        window.location.href = '/accueil';
      })
      .catch(error => {
        console.error('Erreur lors de l\'authentification :', error);
        setErreur('Identifiant ou mot de passe incorrect');
      });
  };

  const handleLogout = () => {
    axios.post('/api/logout') // Envoyer une requête de déconnexion au serveur
      .then(response => {
        // Déconnectez l'utilisateur en définissant l'état de connexion sur false
        setIsLoggedIn(false);
        // Redirigez l'utilisateur vers la page de connexion
        window.location.href = '/connexion';
      })
      .catch(error => {
        console.error('Erreur lors de la déconnexion :', error);
      });
  };

  return (
    <div>
      <h2>Connexion</h2>
      {erreur && <p style={{ color: 'red' }}>{erreur}</p>}
      <input
        type="text"
        placeholder="Identifiant"
        value={identifiant}
        onChange={(e) => setIdentifiant(e.target.value)}
      />
      <input
        type="password"
        placeholder="Mot de passe"
        value={motDePasse}
        onChange={(e) => setMotDePasse(e.target.value)}
      />
      <button onClick={handleLogin}>Se connecter</button>
      {isLoggedIn && <button onClick={handleLogout}>Se déconnecter</button>} {/* Afficher le bouton de déconnexion si l'utilisateur est connecté */}
    </div>
  );
}

export default Authentification;
