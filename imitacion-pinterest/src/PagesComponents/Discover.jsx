import React, { useState, useEffect } from 'react';
import Pin from '../PinComponents/PinSingle.jsx';
import Mosaic from '../PinComponents/Mosaic.jsx';
import { getPostsDescubrir } from '../funciones.js';
import { data } from 'react-router-dom';

const Discover = () => {
  const [discoverPins, setDiscoverPins] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPostsDescubrir().then((data) => {
      if (data[0]) {
        setDiscoverPins(data[1]);
        setLoading(false);
      } else {
        console.error("Error al obtener los pines de descubrimiento:", data[1]);
        alert("Error al conectar con el servidor.");
      }
    });
  }, []);

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status">
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <div className="mb-4 px-2">
        <h2 className="fw-bold mb-1">Descubrir</h2>
        <p className="text-muted small">Ideas aleatorias de Unsplash.</p>
      </div>
      {console.log("Renderizando Discover con pines:", discoverPins)}
        <Mosaic posts={discoverPins} />
    </div>
  );
};

export default Discover;