import Placeholder from '../assets/placeholder.png';
import { useEffect, useState } from 'react';
import { getPostsPorTablero } from '../funciones.js';
import { useNavigate } from 'react-router-dom';

function Board({id, nombre}) {
  const [pines, setPines] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    getPostsPorTablero(id)
      .then(data => {
        if (data[0]) {
          setPines(data[1]);
        }
        else {
          console.error("Error al obtener pines para el tablero:", nombre);
        }
      });
  }, [id, nombre]);

  return (
        <div style={{ cursor: 'pointer' }} onClick={() => navigate(`/modboard/${id}`)}>
        <div key={id} className="board-card">
          <div className="board-card-inner">
          <img src={pines[0]?.imagen_url || Placeholder} className="card-image" alt={pines[0]?.descripcion || "No disponible"} />
          </div>
        </div>
        <div className="card-body">
            <h5 className="card-text">{nombre}</h5>
        </div>
        </div>
  );
}

export default Board;