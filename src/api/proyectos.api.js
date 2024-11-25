const BASE_URL = "http://localhost:8080/api/proyecto";


export const createProject = async (projectData) => {
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "jwt": sessionStorage.getItem("access-token"), 
    },
    body: JSON.stringify(projectData), 
    redirect: "follow",
  };

  try {
    const response = await fetch(BASE_URL, requestOptions);
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Error al crear el proyecto.");
    }
    return await response.json(); 
  } catch (error) {
    console.error("Error en createProject:", error);
    throw error;
  }
};


export const updateProject = async (idProyecto, updates) => {
    try {
        const { nombre, descripcion } = updates;
        if (typeof nombre !== "string" || typeof descripcion !== "string") {
            throw new Error("Los datos enviados deben incluir 'nombre' y 'descripcion' como cadenas.");
        }

        const response = await fetch(`http://localhost:8080/api/proyecto/${idProyecto}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                jwt: sessionStorage.getItem("access-token"), 
            },
            body: JSON.stringify({ nombre, descripcion }), 
        });

        if (!response.ok) {
            throw new Error(`Error al actualizar proyecto: ${response.statusText}`);
        }

        return await response.json(); 
    } catch (error) {
        console.error("updateProject: Error en la solicitud:", error);
        throw error;
    }
};

