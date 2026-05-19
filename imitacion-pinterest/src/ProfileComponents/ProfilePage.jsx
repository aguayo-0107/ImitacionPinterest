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
            id: u.id,
            nombre_tablero: u.nombre_tablero,
            usuario_id: u.id_usuario
          })));
        }
        else {
          console.error("Error al obtener tableros del usuario:", data[1]);
        }
      });
      getPosts().then(data => {
        if (data[0]) {
          setUserPin(data[1].filter(p => p.id_usuario === userSession?.id).map(p => ({
            id: p.id,
            descripcion: p.descripcion,
            url_imagen: p.imagen_url,
            usuario_id: p.id_usuario
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
          pins={userPin}
          totalBoards={userBoards.length}
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