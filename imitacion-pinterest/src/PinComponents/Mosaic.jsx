import Pin from "./PinSingle";
import { useNavigate } from 'react-router-dom';

function Mosaic({posts}) {
    const navigate = useNavigate();
    
    return (
    <>
      { posts !== undefined && posts[0] ? (
        <div className="cascade-grid">
          {posts.map(post => 
            <Pin key={post.id} id={post.id} descripcion={post.descripcion} url_imagen={post.imagen_url} nav={() => navigate(`/pin/${post.id}`)}/>
          )}
        </div>
      ) : (
        <h2 className="text-center mt-5">No hay pines para mostrar</h2>
      )}
    </>
  );
}

export default Mosaic;