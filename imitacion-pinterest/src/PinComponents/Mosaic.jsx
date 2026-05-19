import Pin from "./PinSingle";
import {useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { getPosts, getPostsRecientes } from "../funciones";

const STORAGE_KEY_POSTS     = "feed_posts";
const STORAGE_KEY_TIMESTAMP = "feed_timestamp";

function Mosaic() {
    const [posts, setPosts] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
    const cargarPosts = async () => {
      const postsGuardados    = localStorage.getItem(STORAGE_KEY_POSTS);
      const timestampGuardado = localStorage.getItem(STORAGE_KEY_TIMESTAMP);
      let posts;

      if (postsGuardados && timestampGuardado) {
        const nuevos = await getPostsRecientes(timestampGuardado);
        const cache = JSON.parse(postsGuardados);
        posts = nuevos && nuevos[0] ? [...nuevos, ...cache] : cache;
      } else {
        posts = await getPosts();
      }

      if (posts) {
        localStorage.setItem(STORAGE_KEY_POSTS, JSON.stringify(posts));
        localStorage.setItem(STORAGE_KEY_TIMESTAMP, new Date().toISOString());
        setPosts(posts);
      }
    };
    cargarPosts();
    }, []);

    return (
        <>
            {posts[0] ? (
            <div className="cascade-grid">
                {posts.map(post => 
                <Pin key={post.id} id={post.id} descripcion={post.descripcion} url_imagen={post.url_imagen} nav={() => navigate(`/pin/${post.id}`)}/>
                )}
            </div>
            ) : (
            <h2 className="text-center mt-5">No hay pines para mostrar</h2>
            )}
        </>
    )
}

export default Mosaic;