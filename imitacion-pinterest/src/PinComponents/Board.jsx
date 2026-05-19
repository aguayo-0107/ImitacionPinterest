import Placeholder from '../assets/placeholder.png';
import { useEffect, useState } from 'react';
import { getPostsPorTablero } from '../funciones.js';

function Board({id, nombre, nav}) {
  const [pines, setPines] = useState([]);
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
        <div className='card-container' style={{ cursor: 'pointer' }} onClick={nav}>
        <div key={id} className="card">
          <img src={pines[0]?.imagen_url || Placeholder} className="card-image" alt={pines[0]?.descripcion || "No disponible"} />
        </div>
        <div className="card-body">
            <h5 className="card-text">{nombre}</h5>
        </div>
        </div>
  );
}

export default Board;