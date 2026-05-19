import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { postPost, patchTablero, postTablero, getTablerosPorUsuario } from '../funciones.js';

function Create() {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('pin');
  const [userBoards, setUserBoards] = useState([]);
  const [userSession, setUserSession] = useState(null);

  const [pinLink, setPinLink] = useState('');
  const [pinDescription, setPinDescription] = useState('');
  const [pinImage, setPinImage] = useState('');
  const [selectedBoard, setSelectedBoard] = useState('');

  const [boardName, setBoardName] = useState('');

  useEffect(() => {
    const session = sessionStorage.getItem('user_session');
    if (session) {
      const parsedSession = JSON.parse(session);
      setUserSession(parsedSession);
      getTablerosPorUsuario(parsedSession.id).then((tableros) => {
        if (tableros[0]) {
          setUserBoards(tableros[1]);
        } else {
          alert("Error al cargar tus tableros.");
        }
      });
    } else {
      navigate('/profile');
    }
  }, [navigate]);

  const handleCreatePin = (e) => {
    e.preventDefault();

    if (!userSession) {
      alert('Debe iniciar sesión para crear un pin.');
      navigate('/profile');
      return;
    }
    if (selectedBoard === '') {
      alert("Seleccione un tablero o la opción 'Ninguno' para guardar el pin.");
    }
    else {
      postPost(pinDescription, pinImage, userSession.id).then((data) => {
        if (data[0]) {
          if (selectedBoard === 'none') {
            alert(`¡Pin "${pinDescription}" creado con éxito en tu colección!`);
            navigate('/profile');
          } else {
            const newPinId = data[1].id;
            patchTablero('', newPinId, selectedBoard, userSession.id).then((res) => {
              if (res[0]) {
                alert(`¡Pin "${pinDescription}" creado con éxito en tu colección!`);
              } else {
                alert("Error al agregar el pin al tablero.");
              }
              navigate('/profile');
            });
          }
        } else {
          alert("Error al crear el pin.");
        }
      });
    }
    
    // Resetear formulario y redirigir al perfil para ver los cambios
    setPinDescription('');
    setPinImage('');
    setSelectedBoard('');
  };

  const handleCreateBoard = (e) => {
    e.preventDefault();

    if (!userSession) {
      alert('Debe iniciar sesión para crear un tablero.');
      navigate('/profile');
      return;
    }
    postTablero(boardName, userSession.id).then((data) => {
      if (data[0]) {
        alert(`¡Tablero "${boardName}" creado con éxito!`);
      } else {
        alert("Error al crear el tablero.");
      }
    });
    
    setBoardName('');
    navigate('/profile');
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-12 col-md-8 col-lg-6">
          
          <div className="d-flex justify-content-center gap-3 mb-5">
            <button 
              className={`btn rounded-pill px-4 fw-bold ${activeTab === 'pin' ? 'btn-primary' : 'btn-outline-secondary'}`}
              onClick={() => setActiveTab('pin')}
            >
              Crear Pin
            </button>
            <button 
              className={`btn rounded-pill px-4 fw-bold ${activeTab === 'board' ? 'btn-primary' : 'btn-outline-secondary'}`}
              onClick={() => setActiveTab('board')}
            >
              Crear Tablero
            </button>
          </div>

          <div className="card-container rounded-4 p-4 p-sm-5 shadow-sm">
            {activeTab === 'pin' && (
              <form onSubmit={handleCreatePin}>
                <h3 className="fw-bold mb-4 text-center">Crear un nuevo Pin</h3>
                <div className="mb-3">
                  <label className="form-label small fw-bold">Descripción</label>
                  <textarea 
                    className="form-control rounded-3" 
                    rows="3"
                    placeholder="¿De qué trata este pin?"
                    value={pinDescription}
                    onChange={(e) => setPinDescription(e.target.value)}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label small fw-bold">URL de la Imagen (Unsplash o Web)</label>
                  <input 
                    type="url" 
                    className="form-control rounded-pill" 
                    placeholder="https://example.com/imagen.jpg"
                    value={pinImage}
                    onChange={(e) => setPinImage(e.target.value)}
                    required 
                  />
                </div>

                <div className="mb-4">
                  <label className="form-label small fw-bold">Guardar en el Tablero</label>
                  <select 
                    className="form-select rounded-pill"
                    value={selectedBoard}
                    onChange={(e) => setSelectedBoard(e.target.value)}
                    required
                  >
                    <option value="none">Ninguno</option>
                    <option value="">Selecciona un tablero destino</option>
                    {userBoards.map(board => (
                      <option key={board.id} value={board.id.toString()}>{board.nombre_tablero}</option>
                    ))}
                  </select>
                </div>

                <button type="submit" className="btn btn-primary w-100 rounded-pill py-2 fw-bold">
                  Publicar Pin
                </button>
              </form>
            )}

            {activeTab === 'board' && (
              <form onSubmit={handleCreateBoard}>
                <h3 className="fw-bold mb-4 text-center">Crear un nuevo Tablero</h3>
                
                <div className="mb-3">
                  <label className="form-label small fw-bold">Nombre del Tablero</label>
                  <input 
                    type="text" 
                    className="form-control rounded-pill" 
                    placeholder='Ej. "Circuitos de Control" o "UI Glassmorphism"'
                    value={boardName}
                    onChange={(e) => setBoardName(e.target.value)}
                    required 
                  />
                </div>
                <button type="submit" className="btn btn-primary w-100 rounded-pill py-2 fw-bold">
                  Crear Colección
                </button>
              </form>
            )}

          </div>

        </div>
      </div>
    </div>
  );
};

export default Create;