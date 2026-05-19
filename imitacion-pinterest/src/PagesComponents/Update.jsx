import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Mosaic from '../PinComponents/Mosaic.jsx';
import Placeholder from '../assets/placeholder.png';
import { 
  getPostPorId, 
  getUsuarioPorId, 
  getTableroPorId,
  getTablerosPorUsuario,
  getPostsPorTablero,
  patchPost,
  patchTablero,
  deletePost,
  deleteTablero
} from '../funciones.js';

function Update({type}) {
  const {id} = useParams();
  const navigate = useNavigate();
  
  // Estados para los datos
  const [loading, setLoading] = useState(true);
  const [pin, setPin] = useState(null);
  const [board, setBoard] = useState(null);
  const [usuario, setUsuario] = useState(null);
  const [userBoards, setUserBoards] = useState([]);
  const [pines, setPines] = useState([]);
  const [tableroActual, setTableroActual] = useState(null);
  const [auth, setAuth] = useState(false);
  
  // Estados para los formularios
  const [descripcion, setDescripcion] = useState('');
  const [urlImagen, setUrlImagen] = useState('');
  const [tableroId, setTableroId] = useState('');
  const [nombre, setNombre] = useState('');

  const userLog = JSON.parse(localStorage.getItem('user_session')) || null;

  useEffect(() => {
    if (type === "pin") {
      // Cargar datos del pin
      getPostPorId(id).then((data) => {
        if (data[0]) {
          const pinData = data[1];
          setPin(pinData);
          
          // Verificar autenticación
          if (userLog && pinData.usuario_id === userLog.id) {
            setAuth(true);
            
            // Cargar usuario
            getUsuarioPorId(pinData.usuario_id).then((userData) => {
              if (userData[0]) {
                setUsuario(userData[1]);
                
                // Cargar tableros del usuario
                getTablerosPorUsuario(pinData.usuario_id).then((boardsData) => {
                  if (boardsData[0]) {
                    setUserBoards(boardsData[1]);
                    
                    // Encontrar el tablero actual del pin
                    const tableroDelPin = boardsData[1].find(b => 
                      b.posts && b.posts.some(p => p.id === parseInt(id))
                    );
                    if (tableroDelPin) {
                      setTableroActual(tableroDelPin);
                      setTableroId(tableroDelPin.id);
                    }
                  }
                  setLoading(false);
                });
              }
            });
          } else {
            setAuth(false);
            setLoading(false);
          }
        } else {
          console.error("Error al obtener el pin:", data[1]);
          setLoading(false);
        }
      });
    } else if (type === "board") {
      // Cargar datos del tablero
      getTableroPorId(id).then((data) => {
        if (data[0]) {
          const boardData = data[1];
          setBoard(boardData);
          
          // Verificar autenticación
          if (userLog && boardData.usuario_id === userLog.id) {
            setAuth(true);
            
            // Cargar usuario
            getUsuarioPorId(boardData.usuario_id).then((userData) => {
              if (userData[0]) {
                setUsuario(userData[1]);
              }
            });
            
            // Cargar pines del tablero
            getPostsPorTablero(id).then((pinesData) => {
              if (pinesData[0]) {
                setPines(pinesData[1]);
              }
              setLoading(false);
            });
          } else {
            setAuth(false);
            setLoading(false);
          }
        } else {
          console.error("Error al obtener el tablero:", data[1]);
          setLoading(false);
        }
      });
    }
  }, [id, type]);

  const handleSubmitPin = async (e) => {
    e.preventDefault();
    
    // Actualizar descripción si cambió
    if (descripcion.trim() !== "" && descripcion !== pin.descripcion) {
      const result = await patchPost(descripcion, parseInt(id), userLog.id);
      if (!result[0]) {
        alert("Error al actualizar la descripción: " + result[1]);
        return;
      }
    }
    
    // Actualizar tablero si cambió
    if (tableroId !== "" && tableroId !== tableroActual?.id) {
      const result = await patchTablero("", parseInt(id), tableroId, userLog.id);
      if (!result[0]) {
        alert("Error al cambiar de tablero: " + result[1]);
        return;
      }
    }
    
    alert("Pin actualizado exitosamente");
    navigate(-1);
  };

  const handleSubmitBoard = async (e) => {
    e.preventDefault();
    
    if (nombre.trim() !== "" && nombre !== board.nombre) {
      const result = await patchTablero(nombre, undefined, parseInt(id), userLog.id);
      if (!result[0]) {
        alert("Error al actualizar el tablero: " + result[1]);
        return;
      }
      alert("Tablero actualizado exitosamente");
      navigate(-1);
    }
  };

  const handleDeletePin = async () => {
    if (window.confirm("¿Estás seguro de que quieres eliminar este pin?")) {
      const result = await deletePost(parseInt(id));
      if (result[0]) {
        alert("Pin eliminado exitosamente");
        navigate('/');
      } else {
        alert("Error al eliminar el pin: " + result[1]);
      }
    }
  };

  const handleDeleteBoard = async () => {
    if (window.confirm("¿Estás seguro de que quieres eliminar este tablero?")) {
      const result = await deleteTablero(parseInt(id));
      if (result[0]) {
        alert("Tablero eliminado exitosamente");
        navigate('/');
      } else {
        alert("Error al eliminar el tablero: " + result[1]);
      }
    }
  };

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status">
        </div>
      </div>
    );
  }

  if (!auth || (type === "pin" && !pin) || (type === "board" && !board)) {
    return (
      <div className="container py-5 text-center">
        <h2 className="text-danger">Error 404</h2>
        <p className="text-muted">
          {type === "pin" 
            ? `El pin con ID ${id} no pertenece a tu colección.`
            : `El tablero con ID ${id} no pertenece a tu colección.`
          }
        </p>
        <button className="btn btn-primary rounded-pill" onClick={() => navigate('/')}>
          Volver al menú principal
        </button>
      </div>
    );
  }

  if (type === "pin") {
    return (
      <div className="container py-5">
        <button className="btn btn-outline-secondary rounded-pill mb-4 px-4 dm-button" onClick={() => navigate(-1)}>
          ← Volver
        </button>

        <div className="detail-card shadow-lg">
          <div className="row g-0">
            <div className="col-12 col-md-6">
              <img 
                src={pin.imagen_url} 
                className="detail-image" 
                alt={pin.descripcion} 
              />
            </div>
            <div className="col-12 col-md-6 d-flex flex-column p-4 p-lg-5">
              
              <div className="d-flex justify-content-between align-items-center mb-4">
                <div className="author-info d-flex align-items-center">
                  <div className="author-avatar me-2">
                    {usuario?.nombre_usuario?.charAt(0).toUpperCase() || "U"}
                  </div>
                  <span className="fw-bold">{usuario?.nombre_usuario || "Usuario"}</span>
                </div>
              </div>
              
              <form onSubmit={handleSubmitPin} className="mb-4">
                <div className="pin-content mb-auto">
                  <label className="form-label small fw-bold">Descripción del pin</label>
                  <input 
                    type="text"
                    className="form-control"
                    placeholder={pin.descripcion}
                    value={descripcion}
                    onChange={(e) => setDescripcion(e.target.value)}
                  />
                  
                  <label className="form-label small fw-bold mt-3">Tablero del pin</label>
                  <select 
                    className="form-select" 
                    value={tableroId} 
                    onChange={(e) => {
                      const valorInstancia = e.target.value;
                      setTableroId(valorInstancia === "" ? "" : parseInt(valorInstancia, 10));
                    }}
                  >
                    <option value="">Selecciona un tablero</option>
                    {userBoards.map(b => (
                      <option key={b.id} value={b.id}>{b.nombre}</option>
                    ))}
                  </select>
                </div>
                <button type="submit" className="btn btn-primary w-100 rounded-pill mt-4">
                  Guardar cambios
                </button>
              </form>
              
              <button 
                className="btn btn-outline-danger btn-sm rounded-pill px-3" 
                onClick={handleDeletePin}
              >
                Borrar pin
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  } else if (type === "board") {
    return (
      <>
        <div className="container py-5">
          <button className="btn btn-outline-secondary rounded-pill mb-4 px-4 dm-button" onClick={() => navigate(-1)}>
            ← Volver
          </button>

          <div className="detail-card shadow-lg">
            <div className="row g-0">
              <div className="col-12 col-md-6">
                <img 
                  src={pines[0]?.imagen_url || Placeholder} 
                  className="detail-image" 
                  alt={"Imagen del tablero"} 
                />
              </div>
              <div className="col-12 col-md-6 d-flex flex-column p-4 p-lg-5">
                
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <div className="author-info d-flex align-items-center">
                    <div className="author-avatar me-2">
                      {usuario?.nombre_usuario?.charAt(0).toUpperCase() || "U"}
                    </div>
                    <span className="fw-bold">{usuario?.nombre_usuario || "Usuario"}</span>
                  </div>
                </div>
                
                <form onSubmit={handleSubmitBoard} className="mb-4">
                  <div className="pin-content mb-auto">
                    <label className="form-label small fw-bold">Nombre del tablero</label>
                    <input 
                      type="text"
                      className="form-control"
                      placeholder={board.nombre}
                      value={nombre}
                      onChange={(e) => setNombre(e.target.value)}
                    />
                  </div>
                  <button type="submit" className="btn btn-primary w-100 rounded-pill mt-4">
                    Guardar cambios
                  </button>
                </form>
                
                <button 
                  className="btn btn-outline-danger btn-sm rounded-pill px-3" 
                  onClick={handleDeleteBoard}
                >
                  Borrar tablero
                </button>
              </div>
            </div>
          </div>
        </div>
        <Mosaic posts={pines} />
      </>
    );
  }
}

export default Update;