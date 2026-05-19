import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { postUsuario } from '../funciones.js';

function Register () {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmation, setConfirmation] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Checamos si el nombre de usuario ya existe
    if (password !== confirmation) {
      alert("Error: Las contraseñas no coinciden.");
    } else {
      postUsuario(username.trim(), password ).then((data) => {
        if (data[0]) {
          sessionStorage.setItem('user_session', JSON.stringify({ id: data[1].id, nombre_de_usuario: username.trim() }));
          navigate('/profile');
        }
        else {
          console.error("Error al registrar el usuario:", data[1]);
          alert("Error al registrar el usuario.");
        }
      });
    }
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