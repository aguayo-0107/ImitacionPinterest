import Board from "./Board";
import { useEffect } from "react";
import { useNavigate } from 'react-router-dom';

function BoardMosaic({boards}) {
    
    return (
    <div className="cascade-grid">
        {boards.map(board => 
            <Board key={board.id} id={board.id} nombre={board.nombre_tablero} descripcion={board.descripcion} /> 
        )}
    </div>
    )
}

export default BoardMosaic;