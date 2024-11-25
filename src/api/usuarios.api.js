const BASE_URL = "http://localhost:8080/api/usuarios";

// Obtener todos los usuarios
export const fetchUsuarios = async () => {
  const requestOptions = {
    method: "GET",
    redirect: "follow",
  };

  try {
    const response = await fetch(BASE_URL, requestOptions);
    if (!response.ok) throw new Error("Error al obtener usuarios");
    return await response.json();
  } catch (error) {
    console.error("Error en fetchUsuarios:", error);
    throw error;
  }
};

// Obtener un usuario por email
export const fetchUsuarioByEmail = async (email) => {
  const requestOptions = {
    method: "GET",
    redirect: "follow",
  };

  try {
    const response = await fetch(`${BASE_URL}/email/email?email=${email}`, requestOptions);
    if (!response.ok) throw new Error("Error al obtener usuario por email");
    return await response.json();
  } catch (error) {
    console.error("Error en fetchUsuarioByEmail:", error);
    throw error;
  }
};

// Obtener un usuario por ID
export const fetchUsuarioById = async (id) => {
  const requestOptions = {
    method: "GET",
    redirect: "follow",
  };

  try {
    const response = await fetch(`${BASE_URL}/${id}`, requestOptions);
    if (!response.ok) throw new Error("Error al obtener usuario por ID");
    return await response.json();
  } catch (error) {
    console.error("Error en fetchUsuarioById:", error);
    throw error;
  }
};

export const createUsuario = async (usuarioData) => {
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(usuarioData), // Convertir los datos del usuario a JSON
      redirect: "follow",
    };
  
    try {
      const response = await fetch(BASE_URL, requestOptions);
      if (!response.ok) {
        // Manejo de errores basados en el código de respuesta
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al crear el usuario.");
      }
      return await response.json(); // Retornar el usuario creado
    } catch (error) {
      console.error("Error en createUsuario:", error);
      throw error;
    }
  };