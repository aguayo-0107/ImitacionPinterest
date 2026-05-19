import Board from "./Board";
import { useEffect } from "react";
import { useNavigate } from 'react-router-dom';

function BoardMosaic({boards}) {
    const navigate = useNavigate();
    
    return (
    <div className="cascade-grid">
        {boards.map(board => 
            <Board key={board.id} id={board.id} nombre={board.nombre} descripcion={board.descripcion} />
        )}
    </div>
    )
}

export default BoardMosaic;