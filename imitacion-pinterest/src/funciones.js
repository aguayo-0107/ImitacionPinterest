const url_base = ""

// Get /usuarios
async function getUsuarios() {
    try {
        const response = await fetch(url_base + "/usuarios", {
            method: "GET",
            headers: {"Content-Type": "application/json"}
        })
        if (response.ok) {
            const info = await response.json()
            return [true, info]
        } else {
            const info = await response.text()
            return [false, JSON.parse(info).detail[0].msg ?? JSON.parse(info).detail]
        }
    }
    catch (error) {
        return [false, error.message]
    }
}

// Get /posts
async function getPosts() {
    try {
        const response = await fetch(url_base + "/posts", {
            method: "GET",
            headers: {"Content-Type": "application/json"}
        })
        if (response.ok) {
            const info = await response.json()
            return [true, info]
        } else {
            const info = await response.text()
            return [false, JSON.parse(info).detail[0].msg ?? JSON.parse(info).detail]
        }
    }
    catch (error) {
        return [false, error.message]
    }
}

// Get /comentarios
async function getComentarios() {
    try {
        const response = await fetch(url_base + "/comentarios", {
            method: "GET",
            headers: {"Content-Type": "application/json"}
        })
        if (response.ok) {
            const info = await response.json()
            return [true, info]
        } else {
            const info = await response.text()
            return [false, JSON.parse(info).detail[0].msg ?? JSON.parse(info).detail]
        }
    }
    catch (error) {
        return [false, error.message]
    }
}

// Get /tableros
async function getTableros() {
    try {
        const response = await fetch(url_base + "/tableros", {
            method: "GET",
            headers: {"Content-Type": "application/json"}
        })
        if (response.ok) {
            const info = await response.json()
            return [true, info]
        } else {
            const info = await response.text()
            return [false, JSON.parse(info).detail[0].msg ?? JSON.parse(info).detail]
        }
    }
    catch (error) {
        return [false, error.message]
    }
}

// Get /postsTablero/id_tablero
async function getPostsPorTablero(id) {
    try {
        const response = await fetch(url_base + "/postsTablero/" + id, {
            method: "GET",
            headers: {"Content-Type": "application/json"}
        })
        if (response.ok) {
            const info = await response.json()
            return [true, info]
        } else {
            const info = await response.text()
            return [false, JSON.parse(info).detail[0].msg ?? JSON.parse(info).detail]
        }
    }
    catch (error) {
        return [false, error.message]
    }
}

// Get /tablerosUsuario/id_usuario
async function getTablerosPorUsuario(id) {
    try {
        const response = await fetch(url_base + "/tablerosUsuario/" + id, {
            method: "GET",
            headers: {"Content-Type": "application/json"}
        })
        if (response.ok) {
            const info = await response.json()
            return [true, info]
        } else {
            const info = await response.text()
            return [false, JSON.parse(info).detail[0].msg ?? JSON.parse(info).detail]
        }
    }
    catch (error) {
        return [false, error.message]
    }
}

// Get /comentariosPost/id_post
async function getComentariosPorPost(id) {
    try {
        const response = await fetch(url_base + "/comentariosPost/" + id, {
            method: "GET",
            headers: {"Content-Type": "application/json"}
        })
        if (response.ok) {
            const info = await response.json()
            return [true, info]
        } else {
            const info = await response.text()
            return [false, JSON.parse(info).detail[0].msg ?? JSON.parse(info).detail]
        }
    }
    catch (error) {
        return [false, error.message]
    }
}

// Post /usuarios (nombre_usuario, contrasena)
async function postUsuario(nombre_usuario, contrasena) {
    try {
        const response = await fetch(url_base + "/usuarios", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({ nombre_usuario, contrasena })
        })
        if (response.ok) {
            const info = await response.json()
            return [true, info]
        } else {
            const info = await response.text()
            return [false, JSON.parse(info).detail[0].msg ?? JSON.parse(info).detail]
        }
    }
    catch (error) {
        return [false, error.message]
    }
}

// Post /posts (descripcion, imagen_url, usuario-id [header])
async function postPost(descripcion, imagen_url, usuario_id) {
    try {
        const response = await fetch(url_base + "/posts", {
            method: "POST",
            headers: {"Content-Type": "application/json", "usuario-id": usuario_id},
            body: JSON.stringify({ descripcion, imagen_url })
        })
        if (response.ok) {
            const info = await response.json()
            return [true, info]
        } else {
            const info = await response.text()
            return [false, JSON.parse(info).detail[0].msg ?? JSON.parse(info).detail]
        }
    }
    catch (error) {
        return [false, error.message]
    }
}

// Post /posts/{post_id}/comentarios (contenido, usuario-id [header])
async function postComentario(contenido, post_id, usuario_id) {
    try {
        const response = await fetch(url_base + "/posts/" + post_id + "/comentarios", {
            method: "POST",
            headers: {"Content-Type": "application/json", "usuario-id": usuario_id},
            body: JSON.stringify({ contenido })
        })
        if (response.ok) {
            const info = await response.json()
            return [true, info]
        } else {
            const info = await response.text()
            return [false, JSON.parse(info).detail[0].msg ?? JSON.parse(info).detail]
        }
    }
    catch (error) {
        return [false, error.message]
    }
}

// Post /tableros (nombre_tablero, usuario-id [header])
async function postTablero(nombre_tablero, usuario_id) {
    try {
        const response = await fetch(url_base + "/tableros", {
            method: "POST",
            headers: {"Content-Type": "application/json", "usuario-id": usuario_id},
            body: JSON.stringify({ nombre_tablero })
        })
        if (response.ok) {
            const info = await response.json()
            return [true, info]
        } else {
            const info = await response.text()
            return [false, JSON.parse(info).detail[0].msg ?? JSON.parse(info).detail]
        }
    }
    catch (error) {
        return [false, error.message]
    }
}

// Patch /posts/{post_id} (descripcion, post_id, usuario-id [header])
async function patchPost(descripcion, post_id, usuario_id) {
    try {
        const response = await fetch(url_base + "/posts/" + post_id, {
            method: "PATCH",
            headers: {"Content-Type": "application/json", "usuario-id": usuario_id},
            body: JSON.stringify({ descripcion })
        })
        if (response.ok) {
            const info = await response.json()
            return [true, info]
        } else {
            const info = await response.text()
            return [false, JSON.parse(info).detail[0].msg ?? JSON.parse(info).detail]
        }
    }
    catch (error) {
        return [false, error.message]
    }
}

// Patch /usuarios/{id_usuario} (nombre, contrasena)
async function patchUsuario(nombre_usuario, contrasena, id_usuario) {
    try {
        const response = await fetch(url_base + "/usuarios/" + id_usuario, {
            method: "PATCH",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({ nombre_usuario, contrasena })
        })
        if (response.ok) {
            const info = await response.json()
            return [true, info]
        } else {
            const info = await response.text()
            return [false, JSON.parse(info).detail[0].msg ?? JSON.parse(info).detail]
        }
    }
    catch (error) {
        return [false, error.message]
    }
}

// Patch /tableros/{tablero_id} (nombre_tablero, id_post, id usuario [header])
async function patchTablero(nombre_tablero, id_post, tablero_id, usuario_id) {
    nombre_tablero = nombre_tablero === "" ? undefined : nombre_tablero
    try {
        const response = await fetch(url_base + "/tableros/" + tablero_id, {
            method: "PATCH",
            headers: {"Content-Type": "application/json", "usuario-id": usuario_id},
            body: JSON.stringify({ nombre_tablero, id_post })
        })
        if (response.ok) {
            const info = await response.json()
            return [true, info]
        } else {
            const info = await response.text()
            return [false, JSON.parse(info).detail[0].msg ?? JSON.parse(info).detail]
        }
    }
    catch (error) {
        return [false, error.message]
    }
}

// Delete /usuarios/{id_usuario}
async function deleteUsuario(id_usuario) {
    try {
        const response = await fetch(url_base + "/usuarios/" + id_usuario, {
            method: "DELETE",
            headers: {"Content-Type": "application/json"}
        })
        if (response.ok) {
            return [true, null]
        } else {
            const info = await response.text()
            return [false, JSON.parse(info).detail[0].msg ?? JSON.parse(info).detail]
        }
    }
    catch (error) {
        return [false, error.message]
    }
}

// Delete /posts/{id_post}
async function deletePost(id_post) {
    try {
        const response = await fetch(url_base + "/posts/" + id_post, {
            method: "DELETE",
            headers: {"Content-Type": "application/json"}
        })
        if (response.ok) {
            return [true, null]
        } else {
            const info = await response.text()
            return [false, JSON.parse(info).detail[0].msg ?? JSON.parse(info).detail]
        }
    }
    catch (error) {
        return [false, error.message]
    }
}

// Delete /tableros/{tablero_id}
async function deleteTablero(id_tablero) {
    try {
        const response = await fetch(url_base + "/tableros/" + id_tablero, {
            method: "DELETE",
            headers: {"Content-Type": "application/json"}
        })
        if (response.ok) {
            return [true, null]
        } else {
            const info = await response.text()
            return [false, JSON.parse(info).detail[0].msg ?? JSON.parse(info).detail]
        }
    }
    catch (error) {
        return [false, error.message]
    }
}

// Delete /comentarios/{comentario_id}
async function deleteComentario(id_comentario) {
    try {
        const response = await fetch(url_base + "/comentarios/" + id_comentario, {
            method: "DELETE",
            headers: {"Content-Type": "application/json"}
        })
        if (response.ok) {
            return [true, null]
        } else {
            const info = await response.text()
            return [false, JSON.parse(info).detail[0].msg ?? JSON.parse(info).detail]
        }
    }
    catch (error) {
        return [false, error.message]
    }
}
