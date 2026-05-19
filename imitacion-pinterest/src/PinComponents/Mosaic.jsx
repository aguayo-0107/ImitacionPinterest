import Pin from "./PinSingle";
import { useNavigate } from 'react-router-dom';

function Mosaic({posts}) {
    const navigate = useNavigate();
    
    return (
    <>
      { posts !== undefined && posts[0] ? (
        <div className="cascade-grid">
          {posts.map(post => 
            <Pin key={post[0]} id={post[0]} descripcion={post[1]} url_imagen={post[2]} nav={() => navigate(`/pin/${post[0]}`)}/>
          )}
        </div>
      ) : (
        <h2 className="text-center mt-5">No hay pines para mostrar</h2>
      )}
    </>
  );
}

export default Mosaic;