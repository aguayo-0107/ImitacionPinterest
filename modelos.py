from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class UsuarioCrear(BaseModel):
    nombre_usuario: str = Field(min_length=5, max_length=200)
    contrasena: str = Field(min_length=3, max_length=30)

class UsuarioRespuesta(BaseModel):
    id: str
    nombre_usuario: str

class UsuarioActualizar(BaseModel):
    nombre_usuario: Optional[str] = Field(default=None, min_length=5, max_length=200)
    contrasena: Optional[str] = Field(default=None, min_length=3, max_length=30)

class PostCrear(BaseModel):
    descripcion: Optional[str] = Field(default=None, max_length=500)
    imagen_url: str = Field(max_length=700)
    fecha_creacion: datetime = Field(default_factory=datetime.now)
    
class PostReciente(BaseModel):
    fecha_creacion: datetime
    
class PostRespuesta(BaseModel):
    id: str
    descripcion: Optional[str]
    imagen_url: str
    fecha_creacion: datetime
    id_usuario: str

class PostActualizar(BaseModel):
    descripcion: Optional[str] = Field(default=None, max_length=500)
    
class ComentarioCrear(BaseModel):
    contenido: str = Field(max_length=900)
    #id post se obtiene del header

class ComentarioRespuesta(BaseModel):
    id: str 
    contenido: str
    id_post: str
    id_usuario: str

class TableroCrear(BaseModel):
    nombre_tablero: str = Field(max_length=200)

class TableroRespuesta(BaseModel):
    id: str
    nombre_tablero: str
    id_usuario: str
    posts: Optional[list[dict]] = None

class TableroActualizar(BaseModel):
    nombre_tablero: Optional[str] = Field(default=None, max_length=200)
    id_post: str