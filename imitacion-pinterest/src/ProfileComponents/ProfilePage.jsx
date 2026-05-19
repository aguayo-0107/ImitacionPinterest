import React, { useState, useEffect, use } from 'react';
import { useNavigate } from 'react-router-dom';
import Login from './Login.jsx'
import Register from './Register.jsx'
import ProfileContent from './ProfileContent.jsx'
import { getTablerosPorUsuario, getPosts } from '../funciones.js';

function ProfilePage() {
  const navigate = useNavigate();
  const [userSession, setUserSession] = useState(() => {
    const saved = sessionStorage.getItem('user_session');
    return saved ? JSON.parse(saved) : null;
  });
  const isLoggedIn = !!userSession;
  console.log("Cargando sesión de usuario desde sessionStorage:", userSession);
  
  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/profile/login');
      console.log('Usuario no autenticado');
    }
  }, [isLoggedIn, navigate]);

  const [userPin, setUserPin] = useState([]);
  const [userBoards, setUserBoards] = useState([]);
  
  useEffect(() => {
    if (isLoggedIn) {
      getTablerosPorUsuario(userSession?.id).then(data => {
        if (data[0]) {
          setUserBoards(data[1].map(u => ({
            id: u[0],
            nombre: u[1],
            usuario_id: u[2]
          })));
        }
        else {
          console.error("Error al obtener tableros del usuario:", data[1]);
        }
      });
      getPosts().then(data => {
        if (data[0]) {
          setUserPin(data[1].filter(p => p[3] === userSession?.id).map(p => ({
            id: p[0],
            descripcion: p[1],
            url_imagen: p[2],
            usuario_id: p[3]
          })));
        }
        else {
          console.error("Error al obtener pines del usuario:", data[1]);
        }
      });
    }
  }, [isLoggedIn, userSession?.id]);

  if (isLoggedIn) {
    return (
      <>
        <ProfileContent 
          user={userSession} 
          boards={userBoards}
          pins={userPin}
          useState={useState}
        />
      </>
    );
  }
  else {
    <>
    </>
  }
};

export default ProfilePage;