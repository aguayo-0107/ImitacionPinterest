import React, {useState} from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Comment from '../GeneralComponents/Comment.jsx';
import pinesData from '../datos/pines.json';
import userData from '../datos/usuarios.json';
import boardData from '../datos/boards.json';
import commentData from '../datos/comentarios.json';
import { getPostPorId, getUsuarioPorId, getComentariosPorPost, postComentario } from '../funciones.js';

const PinDetail = () => {
  const {id} = useParams();
  const navigate = useNavigate();
  const [comentario, setComentario] = useState('');
  const handleSubmit = (e) => {
    e.preventDefault();
    const parsedSession = JSON.parse(sessionStorage.getItem('user_session')) || null;
    if (!parsedSession) {
      alert("Debes iniciar sesión para comentar.");
      return;
    }
    else if (comentario.trim() === '') {
      alert("El comentario no puede estar vacío.");
      return;
    }
    else {
      postComentario(comentario, id, parsedSession.id).then((data) => {
        if (data[0]) {
          console.log("Comentario enviado:", comentario);
          setComentario('');
        } else {
          console.error("Error al publicar el comentario:", data[1]);
          alert("Error al conectar con el servidor.");
        }
      });
    }
  }
  const [pin, setPin] = useState(null);
  const [usuario, setUsuario] = useState(null);
  const [comentarios, setComentarios] = useState([]);
  const [loading, isLoading] = useState(true);
  
  React.useEffect(() => {
    isLoading(true);
    getPostPorId(id).then((data) => {
      if (data[0]) {
        setPin(data[1]);
        getUsuarioPorId(data[1].id_usuario).then((userData) => {
          if (userData[0]) {
            setUsuario(userData[1]);
            getComentariosPorPost(id).then((comentariosData) => {
              if (comentariosData[0]) {
                setComentarios(comentariosData[1]);
              } else {
                console.error("Error al obtener los comentarios:", comentariosData[1]);
                alert("Error al conectar con el servidor.");
              }
            });
          } else {
            console.error("Error al obtener el usuario:", userData[1]);
            alert("Error al conectar con el servidor.");
          }
          isLoading(false);
        });
      } else {
        console.error("Error al obtener el pin:", data[1]);
        alert("Error al conectar con el servidor.");
        isLoading(false);
      }
    });
  }, [id]);

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status">
        </div>
      </div>
    );
  }
  else if (!pin) {
    return (
      <div className="container py-5 text-center">
        <h2 className="text-danger">Error 404</h2>
        <p className="text-muted">El pin con ID {id} no pertenece a nuestra colección.</p>
        <button className="btn btn-primary rounded-pill" onClick={() => navigate('/')}>Volver al menú principal</button>
      </div>
    );
  }

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
                  {usuario.nombre_usuario.charAt(0).toUpperCase()}
                </div>
                <span className="fw-bold">{usuario.nombre_usuario}</span>
              </div>
            </div>
            <div className="pin-content mb-auto">
              <p>{pin.descripcion}</p>
            </div>
            <div className="comments-section mt-4">
              <h5 className="fw-bold mb-3">Comentarios</h5>
              <div className="comments-list mb-3">
                {comentarios.slice(0, 3).map((comentario) => (
                  <Comment 
                    key={comentario.id} 
                    id={comentario.id} 
                    usuario={comentario.nombre_usuario} 
                    texto={comentario.contenido} 
                  />
                ))}
              </div>
                <form onSubmit={handleSubmit}>
                <div className="rows comment-input-wrapper d-flex align-items-center">
                <input 
                  type="text" 
                  className="col form-control rounded-pill bg-light border-0" 
                  placeholder="Añadir un comentario"
                  value={comentario}
                  onChange={(e) => setComentario(e.target.value)} 
                />
                
                  <button type="submit" className="col btn comment-btn rounded-pill mb-3 gx-1">
                    <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" className="bi bi-arrow-right-circle" viewBox="0 0 16 16">
                    <path fillRule="evenodd" d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8m15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0M4.5 7.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5z"/>
                    </svg>
                </button>
                </div>
                </form>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default PinDetail;