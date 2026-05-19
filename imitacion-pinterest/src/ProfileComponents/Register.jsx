import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUsuarios, postUsuario } from '../funciones.js';

function Register () {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmation, setConfirmation] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Checamos si el nombre de usuario ya existe
    getUsuarios().then((data) => {
      if (data[0]) {
        if (data[1].some(u => u[1] === username.trim())) {
          alert("Error: El nombre de usuario ya está en uso.");
        } else if (password !== confirmation) {
          alert("Error: Las contraseñas no coinciden.");
        } else {
          postUsuario(username.trim(), password ).then((data) => {
            if (data[0]) {
              localStorage.setItem('user_session', JSON.stringify({ id: Date.now(), nombre_de_usuario: username.trim() }));
              navigate('/profile');
            }
            else {
              console.error("Error al registrar el usuario:", data[1]);
              alert("Error al registrar el usuario.");
            }
          });
        }
      } else {
        console.error("Error al obtener los usuarios:", data[1]);
        alert("Error al conectar con el servidor.");
      }
    });
  };

  return (
    <div className="container min-vh-100 d-flex justify-content-center align-items-center">
    <div className="auth-card p-4 mt-5 p-sm-5 text-center">
      <h2 className="fw-bold mb-3">Crear Cuenta</h2>
      <p className="text-muted mb-4 small">Únete para encontrar nuevas ideas para tu próximo proyecto</p>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-3 text-start">
          <label className="form-label small fw-bold">Elige un nombre de usuario</label>
          <input 
            type="text" 
            className="form-control rounded-pill" 
            placeholder="Mínimo 4 caracteres" 
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            maxLength={200}
            minLength={4}
            required 
          />
        </div>
        <div className="mb-4 text-start">
          <label className="form-label small fw-bold">Crea una contraseña</label>
          <input 
            type="password" 
            className="form-control rounded-pill" 
            placeholder="Mínimo 6 caracteres" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            maxLength={30}
            minLength={6}
            required 
          />
        </div>
        <div className="mb-4 text-start">
          <label className="form-label small fw-bold">Confirma tu contraseña</label>
          <input 
            type="password" 
            className="form-control rounded-pill" 
            placeholder="Mínimo 6 caracteres" 
            value={confirmation}
            onChange={(e) => setConfirmation(e.target.value)}
            maxLength={30}
            minLength={6}
            required 
          />
        </div>
        <button type="submit" className="btn btn-primary w-100 rounded-pill mb-3">
          Registrarse
        </button>
      </form>
      
      <p className="small mb-0 text-muted">
        ¿Ya tienes cuenta?{' '}
        <button className="btn btn-link p-0 text-decoration-none fw-bold" onClick={() => navigate('/profile/login')} type="button">
          Inicia sesión
        </button>
      </p>
    </div>
    </div>
  );
};

export default Register;