from modelos import *
from fastapi import FastAPI, HTTPException, Header
from fastapi.middleware.cors import CORSMiddleware
import psycopg
from conexion import DB_CONNECTION_STRING
from uuid import uuid4
from datetime import datetime
import requests
import os
from dotenv import load_dotenv

app = FastAPI()
load_dotenv()

if not DB_CONNECTION_STRING:
    raise ValueError("La variable de entorno DB_CONNECTION_STRING no está definida")


def usuario_row_to_json(row):
    return {
        "id": row[0],
        "nombre_usuario": row[1]
    }


def post_row_to_json(row):
    return {
        "id": row[0],
        "descripcion": row[1],
        "imagen_url": row[2],
        "id_usuario": row[3],
        "fecha_creacion": row[4]
    }


def comentario_row_to_json(row):
    return {
        "id": row[0],
        "contenido": row[1],
        "id_post": row[2],
        "id_usuario": row[3]
    }


def tablero_row_to_json(row):
    return {
        "id": row[0],
        "nombre_tablero": row[1],
        "id_usuario": row[2],
        "posts": []
    }

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# GET
@app.get("/usuarios", response_model=list[UsuarioRespuesta])
async def get_usuarios():
    with psycopg.connect(DB_CONNECTION_STRING) as conn:
        with conn.cursor() as cur:
            cur.execute("SELECT id, nombre_de_usuario FROM Usuario;")
            datos = cur.fetchall()
            return [usuario_row_to_json(row) for row in datos]

@app.get("/usuarios/{id_usuario}", response_model=UsuarioRespuesta)
async def get_un_usuario(id_usuario: str):
    with psycopg.connect(DB_CONNECTION_STRING) as conn:
        with conn.cursor() as cur:
            cur.execute("SELECT id, nombre_de_usuario FROM Usuario WHERE id = %s;", (id_usuario,))
            datos = cur.fetchall()
            if not datos:
                raise HTTPException(status_code=404, detail="Usuario no encontrado")
            return usuario_row_to_json(datos[0])
        
@app.get("/usuario", response_model=UsuarioRespuesta)
async def get_un_usuario_nom_usuario(nombre_usuario: str, contrasena: str):
    with psycopg.connect(DB_CONNECTION_STRING) as conn:
        with conn.cursor() as cur:
            cur.execute("SELECT id, nombre_de_usuario FROM Usuario WHERE nombre_de_usuario = %s AND contrasena = %s;", (nombre_usuario, contrasena))
            datos = cur.fetchall()
            if not datos:
                raise HTTPException(status_code=404, detail="Usuario no encontrado")
            return usuario_row_to_json(datos[0])

#----------------POSTS------------------------
@app.get("/posts", response_model=list[PostRespuesta])
async def get_posts():
    with psycopg.connect(DB_CONNECTION_STRING) as conn:
        with conn.cursor() as cur:
            cur.execute("SELECT id, descripcion, url_imagen, usuario_id, fecha FROM Post;")
            datos = cur.fetchall()
            return [post_row_to_json(row) for row in datos]

@app.get("/posts/{id_post}", response_model=PostRespuesta)
async def get_un_post(id_post: str):
    with psycopg.connect(DB_CONNECTION_STRING) as conn:
        with conn.cursor() as cur:
            cur.execute("SELECT id, descripcion, url_imagen, usuario_id, fecha FROM Post WHERE id = %s;", (id_post,))
            datos = cur.fetchall()
            if not datos:
                raise HTTPException(status_code=404, detail="Post no encontrado")
            return post_row_to_json(datos[0])
        
@app.get("/posts/recientes", response_model=list[PostRespuesta])
async def get_posts_recientes(post_reciente: PostReciente):
    with psycopg.connect(DB_CONNECTION_STRING) as conn:
        with conn.cursor() as cur:
            cur.execute(
                "SELECT id, descripcion, url_imagen, usuario_id, fecha FROM Post WHERE fecha > %s LIMIT 15;",
                (post_reciente.fecha_creacion,)
            )
            datos = cur.fetchall()
            return [post_row_to_json(row) for row in datos]

@app.get("/posts/descubrir")
async def get_posts_descubrir():
    llave_acceso = os.getenv('UNSPLASH_KEY') #la llave está en .env
    res = requests.get(
        'https://api.unsplash.com/photos?per_page=15&order_by=latest', #regresa las 15 fotos más recientes
        headers={
            'Authorization': f'Client-ID {llave_acceso}'
        }) 
    posts = res.json()
    ret_posts = []
    for post in posts:
        ret_posts.append(
            {
                'id': post['id'],
                'descripcion': post.get('description'),
                'imagen_url': post['links']['html'],
                'fecha_creacion': post['created_at'],
                'id_usuario': post['user']['id']
            }
        )
    return ret_posts
    
@app.get("/comentarios", response_model=list[ComentarioRespuesta])
async def get_comentarios():
    with psycopg.connect(DB_CONNECTION_STRING) as conn:
        with conn.cursor() as cur:
            cur.execute("SELECT id, texto, post_id, usuario_id FROM Comentario;")
            datos = cur.fetchall()
            return [comentario_row_to_json(row) for row in datos]

@app.get("/comentarios/{id_comentario}", response_model=ComentarioRespuesta)
async def get_un_comentario(id_comentario: str):
    with psycopg.connect(DB_CONNECTION_STRING) as conn:
        with conn.cursor() as cur:
            cur.execute("SELECT id, texto, post_id, usuario_id FROM Comentario WHERE id = %s;", (id_comentario,))
            datos = cur.fetchall()
            if not datos:
                raise HTTPException(status_code=404, detail="Comentario no encontrado")
            return comentario_row_to_json(datos[0])

@app.get("/tableros", response_model=list[TableroRespuesta])
async def get_tableros():
    with psycopg.connect(DB_CONNECTION_STRING) as conn:
        with conn.cursor() as cur:
            cur.execute("SELECT id, nombre, usuario_id FROM Tablero;")
            datos = cur.fetchall()
            return [tablero_row_to_json(row) for row in datos]

@app.get("/tableros/{id_tablero}", response_model=TableroRespuesta)
async def get_un_tablero(id_tablero: str):
    with psycopg.connect(DB_CONNECTION_STRING) as conn:
        with conn.cursor() as cur:
            cur.execute("SELECT id, nombre, usuario_id FROM Tablero WHERE id = %s;", (id_tablero,))
            datos = cur.fetchall()
            if not datos:
                raise HTTPException(status_code=404, detail="Tablero no encontrado")
            return tablero_row_to_json(datos[0])

@app.get("/postsTablero/{id_tablero}", response_model=list[PostRespuesta])
async def get_posts_tablero(id_tablero: str):
    with psycopg.connect(DB_CONNECTION_STRING) as conn:
        with conn.cursor() as cur:
            cur.execute(
                "SELECT Post.id, Post.descripcion, Post.url_imagen, Post.usuario_id, Post.fecha FROM TableroPosts JOIN Post ON TableroPosts.post_id = Post.id WHERE TableroPosts.tablero_id = %s;",
                (id_tablero,)
            )
            datos = cur.fetchall()
            return [post_row_to_json(row) for row in datos]

@app.get("/tablerosUsuario/{id_usuario}", response_model=list[TableroRespuesta])
async def get_tableros_usuario(id_usuario: str):
    with psycopg.connect(DB_CONNECTION_STRING) as conn:
        with conn.cursor() as cur:
            cur.execute("SELECT id, nombre, usuario_id FROM Tablero WHERE usuario_id = %s;", (id_usuario,))
            datos = cur.fetchall()
            return [tablero_row_to_json(row) for row in datos]
        
@app.get("/comentariosPost/{id_post}", response_model=list[ComentarioRespuesta])
async def get_comentarios_post(id_post: str):
    with psycopg.connect(DB_CONNECTION_STRING) as conn:
        with conn.cursor() as cur:
            cur.execute("SELECT id, texto, post_id, usuario_id FROM Comentario WHERE post_id = %s;", (id_post,))
            datos = cur.fetchall()
            return [comentario_row_to_json(row) for row in datos]
        
# POST
@app.post("/usuarios", status_code=201, response_model=UsuarioRespuesta)
async def crear_usuario(usuario: UsuarioCrear):
    with psycopg.connect(DB_CONNECTION_STRING) as conn:
        with conn.cursor() as cur:
            id_usuario = str(uuid4())
            cur.execute("INSERT INTO Usuario (id, nombre_de_usuario, contrasena) VALUES (%s, %s, %s);", (id_usuario, usuario.nombre_usuario, usuario.contrasena))
            conn.commit()
            return {
                "id": id_usuario, 
                "nombre_usuario": usuario.nombre_usuario
            }

@app.post("/posts", status_code=201, response_model=PostRespuesta)
async def crear_post(post: PostCrear, usuario_id: str = Header(...)):
    with psycopg.connect(DB_CONNECTION_STRING) as conn:
        with conn.cursor() as cur:
            id_post = str(uuid4())
            cur.execute("INSERT INTO Post (id, descripcion, url_imagen, usuario_id, fecha) VALUES (%s, %s, %s, %s, %s);", (id_post, post.descripcion, post.imagen_url, usuario_id, post.fecha_creacion))
            conn.commit()
            return {
                "id": id_post, 
                "descripcion": post.descripcion,
                "imagen_url": post.imagen_url,
                "fecha_creacion": post.fecha_creacion,
                "id_usuario": usuario_id
            }

@app.post("/posts/{post_id}/comentarios", status_code=201, response_model=ComentarioRespuesta)
async def crear_comentario(comentario: ComentarioCrear, post_id: str, usuario_id: str = Header(...)):
    with psycopg.connect(DB_CONNECTION_STRING) as conn:
        with conn.cursor() as cur:
            id_comentario = str(uuid4())
            cur.execute("INSERT INTO Comentario (id, texto, post_id, usuario_id) VALUES (%s, %s, %s, %s);", (id_comentario, comentario.contenido, post_id, usuario_id))
            conn.commit()
            return {
                "id": id_comentario, 
                "contenido": comentario.contenido,
                "id_post": post_id,
                "id_usuario": usuario_id
            }

@app.post("/tableros", status_code=201, response_model=TableroRespuesta)
async def crear_tablero(tablero: TableroCrear, usuario_id: str = Header(...)):
    with psycopg.connect(DB_CONNECTION_STRING) as conn:
        with conn.cursor() as cur:
            id_tablero = str(uuid4())
            cur.execute("INSERT INTO Tablero (id, nombre, usuario_id) VALUES (%s, %s, %s);", (id_tablero, tablero.nombre_tablero, usuario_id))
            conn.commit()
            return {
                "id": id_tablero, 
                "nombre_tablero": tablero.nombre_tablero,
                "id_usuario": usuario_id,
                "posts": []
            }
            
# PATCH
@app.patch("/posts/{post_id}", response_model=PostRespuesta)
async def actualizar_post(post_id: str, post: PostActualizar, usuario_id: str = Header(...)):
    with psycopg.connect(DB_CONNECTION_STRING) as conn:
        with conn.cursor() as cur:
            # Actualizamos la descripción del post
            if post.descripcion is not None:
                cur.execute("UPDATE Post SET descripcion = %s WHERE id = %s;", (post.descripcion, post_id))
                conn.commit()
            
            # Obtenemos la información actualizada del post
            cur.execute("SELECT descripcion, url_imagen, fecha FROM Post WHERE id = %s;", (post_id,))
            res = cur.fetchall()
            if not res:
                raise HTTPException(status_code=404, detail="Post no encontrado")
            
            descripcion = res[0][0]
            imagen_url = res[0][1]
            fecha = res[0][2]
            
            return {
                "id": post_id, 
                "descripcion": descripcion,
                "imagen_url": imagen_url,
                "fecha_creacion": fecha,
                "id_usuario": usuario_id
            }
 
@app.patch("/usuarios/{id_usuario}", response_model=UsuarioRespuesta)
async def actualizar_usuario(id_usuario: str, usuario: UsuarioActualizar):
    with psycopg.connect(DB_CONNECTION_STRING) as conn:
        with conn.cursor() as cur:
            # Actualizamos solo los campos que no son None
            if usuario.nombre_usuario is not None:
                cur.execute("UPDATE Usuario SET nombre_de_usuario = %s WHERE id = %s;", (usuario.nombre_usuario, id_usuario))
            if usuario.contrasena is not None:
                cur.execute("UPDATE Usuario SET contrasena = %s WHERE id = %s;", (usuario.contrasena, id_usuario))
            conn.commit()
            
            # Obtenemos el nombre_usuario actualizado
            cur.execute("SELECT nombre_de_usuario FROM Usuario WHERE id = %s;", (id_usuario,))
            res = cur.fetchall()
            nombre_usuario = res[0][0]
            
            return {
                "id": id_usuario, 
                "nombre_usuario": nombre_usuario
            }          
            
@app.patch("/tableros/{tablero_id}", response_model=TableroRespuesta)
async def actualizar_tablero(tablero_id: str, tablero: TableroActualizar, usuario_id: str = Header(...)):
    with psycopg.connect(DB_CONNECTION_STRING) as conn:
        with conn.cursor() as cur:
            # Primero agregamos el post al tablero
            if tablero.id_post is not None:
                cur.execute("INSERT INTO TableroPosts(post_id, tablero_id) VALUES(%s, %s);", (tablero.id_post, tablero_id))
                conn.commit()
            
            # Encontramos el nombre del tablero
            cur.execute("SELECT nombre FROM Tablero WHERE id = %s;", (tablero_id,))
            res = cur.fetchall()
            if not res:
                raise HTTPException(status_code=404, detail="Tablero no encontrado")
            
            nombre_tablero = res[0][0]
            
            # Si se actualiza el nombre del tablero
            if tablero.nombre_tablero is not None:
                nombre_tablero = tablero.nombre_tablero
                cur.execute("UPDATE Tablero SET nombre = %s WHERE id = %s;", (nombre_tablero, tablero_id))
                conn.commit()
            
            # Obtenemos la lista de posts del tablero
            cur.execute("SELECT post_id FROM TableroPosts WHERE tablero_id = %s;", (tablero_id,))
            posts_tablero = cur.fetchall()
            posts_lista_ret = []
            for post in posts_tablero:
                cur.execute("SELECT descripcion, url_imagen, fecha, usuario_id FROM Post WHERE id = %s;", (post[0],))
                res = cur.fetchall()
                descripcion = res[0][0]
                imagen_url = res[0][1]
                fecha_creacion = res[0][2]
                usuario_id_post = res[0][3]
                posts_lista_ret.append({
                    "id": post[0],
                    "descripcion": descripcion,
                    "fecha_creacion": fecha_creacion,
                    "imagen_url": imagen_url,
                    "id_usuario": usuario_id_post
                })
            
            return {
                "id": tablero_id, 
                "nombre_tablero": nombre_tablero,
                "id_usuario": usuario_id,
                "posts": posts_lista_ret
            }

# DELETE
@app.delete("/usuarios/{id_usuario}", status_code=204)
async def eliminar_usuario(id_usuario: str):
    with psycopg.connect(DB_CONNECTION_STRING) as conn:
        with conn.cursor() as cur:
            cur.execute("DELETE FROM Usuario WHERE id = %s;", (id_usuario,))
            conn.commit()

@app.delete("/posts/{id_post}", status_code=204)
async def eliminar_post(id_post: str):
    with psycopg.connect(DB_CONNECTION_STRING) as conn:
        with conn.cursor() as cur:
            cur.execute("DELETE FROM Post WHERE id = %s;", (id_post,))
            conn.commit()
            
@app.delete("/tableros/{id_tablero}", status_code=204)
async def eliminar_tablero(id_tablero: str):
    with psycopg.connect(DB_CONNECTION_STRING) as conn:
        with conn.cursor() as cur:
            cur.execute("DELETE FROM Tablero WHERE id = %s;", (id_tablero,))
            conn.commit()

@app.delete("/comentarios/{id_comentario}", status_code=204)
async def eliminar_comentario(id_comentario: str):
    with psycopg.connect(DB_CONNECTION_STRING) as conn:
        with conn.cursor() as cur:
            cur.execute("DELETE FROM Comentario WHERE id = %s;", (id_comentario,))
            conn.commit()
            

# HEALTH 
@app.get("/health")
async def health():
    # Verifica la base de datos
    try:
        with psycopg.connect(DB_CONNECTION_STRING) as conn:
            with conn.cursor() as cur:
                cur.execute("SELECT 1;")
        db_status = "ok"
    except Exception as e:
        db_status = f"error: {str(e)}"

    # Verifica la API de Unsplash
    try:
        llave_acceso = os.getenv('UNSPLASH_KEY')
        res = requests.get(
            'https://api.unsplash.com/photos?per_page=1',
            headers={'Authorization': f'Client-ID {llave_acceso}'}
        )
        unsplash_status = "ok" if res.status_code == 200 else f"error: {res.status_code}"
    except Exception as e:
        unsplash_status = f"error: {str(e)}"

    todo_ok = db_status == "ok" and unsplash_status == "ok"

    return {
        "status":    "ok" if todo_ok else "degraded",
        "timestamp": datetime.now().isoformat(),
        "services": {
            "database": db_status,
            "unsplash": unsplash_status
        }
    }