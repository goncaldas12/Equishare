const BASE_URL = "http://localhost:8080/api";

// Obtener proyectos de un usuario
export const fetchProyectosUsuario = async (idUsuario) => {
  const authToken = sessionStorage.getItem("access-token");
  if (!authToken) {
    throw new Error("Token de autenticación no encontrado.");
  }

  const requestOptions = {
    method: "GET",
    headers: {
      "jwt": authToken,
    },
    redirect: "follow",
  };

  try {
    const response = await fetch(`${BASE_URL}/miembroProyecto/usuario/${idUsuario}/proyectos`, requestOptions);
    if (!response.ok) throw new Error("Error al obtener proyectos del usuario");
    return await response.json();
  } catch (error) {
    console.error("Error en fetchProyectosUsuario:", error);
    throw error;
  }
};

// Eliminar un miembro de un proyecto
export const deleteMiembroProyecto = async (idProyecto, idUsuario) => {
  const authToken = sessionStorage.getItem("access-token");
  if (!authToken) {
    throw new Error("Token de autenticación no encontrado.");
  }

  const requestOptions = {
    method: "DELETE",
    headers: {
      "jwt": authToken,
    },
    redirect: "follow",
  };

  try {
    const response = await fetch(`${BASE_URL}/miembroProyecto/${idProyecto}/miembros/${idUsuario}`, requestOptions);
    if (!response.ok) throw new Error("Error al eliminar miembro del proyecto");
    return await response.json();
  } catch (error) {
    console.error("Error en deleteMiembroProyecto:", error);
    throw error;
  }
};
