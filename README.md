# Segundo Proyecto IDW
## Imitación de Pinterest
### Autores
 * Aniel Orihuela
 * Kyrie Flores
 * Mariana Aguayo
## Resumen del producto

Esta aplicación es una página web Full-Stack inspirada en el funcionamiento y la estética visual de Pinterest. El frontend está estructurado  utilizando **React**, **JavaScript** y **Bootstrap**, lo que permite una interfaz de usuario dinámica y responsiva. Entre sus características principales destacan:

* **Autenticación y Perfiles:** Gestión de inicio de sesión de usuarios y despliegue de páginas de perfil personalizadas.
* **Gestión de Estado y Persistencia:** Integración nativa con el *Local Storage* del navegador para retener configuraciones de sesión y preferencias visuales, como el Modo Oscuro.
* **Consumo Dinámico de Datos:** Implementación de paginación asíncrona e integración robusta con la API de Unsplash para la carga optimizada de imágenes (pines/posts) y su organización interactiva en tableros.

Por su parte, el backend está diseñado en Python bajo una arquitectura modular (evidenciado por la separación en `main.py`, `modelos.py` para la definición del esquema de la base de datos y `conexion.py` para la capa de persistencia). Esta separación de responsabilidades asegura que el código sea escalable, mantenible y siga principios de diseño sólido.

---

## Instrucciones de cómo levantar el frontend

El código correspondiente a la interfaz de usuario se encuentra encapsulado en el directorio `imitacion-pinterest/`. Para inicializar el entorno de desarrollo local, sigue estos pasos:

1.  **Navega al directorio del cliente:**
    Abre tu terminal y ubícate en la carpeta correspondiente al frontend.
    ```bash
    cd imitacion-pinterest
    ```
2.  **Instala las dependencias del ecosistema Node:**
    Este comando leerá el archivo `package.json` para descargar los paquetes necesarios (React, Bootstrap, enrutadores, etc.) dentro del directorio `node_modules`.
    ```bash
    npm install
    ```
3.  **Configura las variables de entorno (Recomendado):**
    Dado el consumo de APIs externas (Unsplash), es ideal crear un archivo `.env` en la raíz de `imitacion-pinterest` para alojar tus credenciales de forma segura.
    ```env
    REACT_APP_UNSPLASH_ACCESS_KEY=tu_clave_aqui
    ```
4.  **Inicia el servidor de desarrollo:**
    Este comando compilará el código y abrirá la aplicación en tu navegador (típicamente en `http://localhost:3000`). El entorno cuenta con *Hot-Reload*, por lo que se recargará automáticamente frente a cualquier cambio en el código.
    ```bash
    npm run dev
    ```

---

## Instrucciones de cómo levantar el backend

El backend en Python maneja la lógica de negocio y los endpoints. Como buena práctica de desarrollo, y para evitar conflictos con otras librerías globales del sistema, es fundamental usar un entorno virtual.

1.  **Crea y activa el entorno virtual:**
    Desde la raíz principal del repositorio:
    * **En Windows:**
        ```bash
        python -m venv venv
        venv\Scripts\activate
        ```
    * **En macOS/Linux:**
        ```bash
        python3 -m venv venv
        source venv/bin/activate
        ```

2.  **Configura las dependencias (`requirements.txt`):**
    Para asegurar que el backend se pueda replicar exactamente igual en cualquier entorno, es indispensable no borrar el archivo `requirements.txt`. Instala todas las dependencias declaradas ejecutando el siguiente comando:
    ```bash
    pip install -r requirements.txt
    ```

3.  **Levanta el servidor web:**
    Finalmente, para exponer los endpoints y conectar tu lógica alojada en `main.py`, debes ejecutar el servidor. Si estás utilizando un framework ASGI moderno como FastAPI, el comando estándar para inicializar el servidor con recarga automática es:
    ```bash
    fastapi dev main.py 
    ```
