import { useState, useEffect } from "react";
import { getPosts, getPostsRecientes } from "../funciones";
import Mosaic from "../PinComponents/Mosaic";

const STORAGE_KEY_POSTS     = "feed_posts";
const STORAGE_KEY_TIMESTAMP = "feed_timestamp";

function Feed() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const cargarPosts = async () => {
      const postsGuardados    = localStorage.getItem(STORAGE_KEY_POSTS);
      const timestampGuardado = localStorage.getItem(STORAGE_KEY_TIMESTAMP);

      let posts;

      if (postsGuardados && timestampGuardado && postsGuardados !== "undefined" && timestampGuardado !== "undefined") {
        const cache  = JSON.parse(postsGuardados);
        const nuevos = await getPostsRecientes(timestampGuardado);
        posts = nuevos[0] && nuevos[1] ? [...nuevos[1], ...cache] : cache;
      } else {
        posts = await getPosts();
      }
      if (posts) {
        localStorage.setItem(STORAGE_KEY_POSTS,     JSON.stringify(posts[1]));
        localStorage.setItem(STORAGE_KEY_TIMESTAMP, new Date().toISOString());
        setPosts(posts);
      }
    };

    cargarPosts();
  }, []);

  return <Mosaic posts={posts[1]} />;
}

export default Feed;