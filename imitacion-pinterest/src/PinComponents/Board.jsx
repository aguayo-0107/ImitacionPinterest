import Placeholder from '../assets/placeholder.png';
import { useEffect, useState } from 'react';
import { getPostsPorTablero, getPostPorId } from '../funciones.js';

function Board({id, nombre, nav}) {
  const [pines, setPines] = useState([]);
  const [primerPin, setPrimerPin] = useState(null);
  useEffect(() => {
    getPostsPorTablero(id)
      .then(data => {
        if (data[0]) {
          setPines(data[1].map(p => ({
            pin_id: p[0],
            tablero_id: p[1]
          })));
          getPostPorId(data[1][0][0]).then(pin => {
            if (pin[0]) {
              setPrimerPin({
                id: pin[1][0],
                descripcion: pin[1][1],
                url_imagen: pin[1][2],
                usuario_id: pin[1][3],
                fecha: pin[1][4]
              });
            } else {
              console.error("Error al obtener el primer pin del tablero:", nombre)
            }
          });
        }
        else {
          console.error("Error al obtener pines para el tablero:", nombre);
        }
      });
  }, [id, nombre]);

  console.log(`Pines encontrados para el tablero ${nombre} (ID: ${id}):`, pines);
  return (
        <div className='card-container' style={{ cursor: 'pointer' }} onClick={nav}>
        <div key={id} className="card">
          <img src={primerPin?.url_imagen || Placeholder} className="card-image" alt={primerPin?.descripcion || "No disponible"} />
        </div>
        <div className="card-body">
            <h5 className="card-text">{nombre}</h5>
        </div>
        </div>
  );
}

export default Board;