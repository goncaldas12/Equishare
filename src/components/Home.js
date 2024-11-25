import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ExitAlert from "./ExitAlert";
import CreateProjectDialog from "./CreateProjectDialog";
import { fetchProyectosUsuario, deleteMiembroProyecto } from "../api/proyectosUsuario.api"; 
import './Home.css';
import { updateProject } from "../api/proyectos.api";

const Home = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [projects, setProjects] = useState([]);
  const [sortOrder, setSortOrder] = useState("alphabetical");
  const [currentUserId] = useState(() => sessionStorage.getItem("idUsuario"));
  const projectsPerPage = 5;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const proyectos = await fetchProyectosUsuario(currentUserId);
        setProjects(proyectos);
      } catch (error) {
      }
    };

    if (currentUserId) {
      fetchProjects();
    }
  }, [currentUserId]);

  const handleSortChange = (event) => {
    setSortOrder(event.target.value);
  };

  const sortedProjects = [...projects]
    .sort((a, b) => {
      if (sortOrder === "alphabetical") {
        return a.nombre.localeCompare(b.nombre);
      } else if (sortOrder === "newest") {
        return new Date(b.fechaCreacion) - new Date(a.fechaCreacion);
      } else if (sortOrder === "oldest") {
        return new Date(a.fechaCreacion) - new Date(b.fechaCreacion);
      }
      return 0;
    });

  const totalPages = Math.ceil(sortedProjects.length / projectsPerPage);
  const indexOfLastProject = currentPage * projectsPerPage;
  const indexOfFirstProject = indexOfLastProject - projectsPerPage;
  const currentProjects = sortedProjects.slice(indexOfFirstProject, indexOfLastProject);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleProjectClick = (projectId) => {
    navigate(`/home/project/${projectId}`);
  };


  const handleEditProject = async (projectId, { nombre, descripcion }) => {

    try {
        const updatedProject = await updateProject(projectId, { nombre, descripcion });
        setProjects((prevProjects) =>
            prevProjects.map((project) =>
                project.idProyecto === projectId ? { ...project, ...updatedProject } : project
            )
        );
    } catch (error) {
        console.error("Error al editar proyecto:", error);
    }
};



  const handleExit = async (projectId) => {
    const currentUserId = sessionStorage.getItem("idUsuario");
    try {
      await deleteMiembroProyecto(projectId, currentUserId);
      setProjects((prevProjects) =>
        prevProjects.filter((project) => project.idProyecto !== projectId)
      );
      const remainingProjectsOnPage = projects.slice(
        (currentPage - 1) * projectsPerPage,
        currentPage * projectsPerPage
      );

      if (remainingProjectsOnPage.length === 0 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
    } catch (error) {
      console.error("Error al salir del proyecto:", error);
    }
  };

  return (
    <div className="home">
      <h1 id="tittulo">Bienvenido a EquiShare</h1>
      <h3 id="subtitt">Crea proyectos para tus viajes, reuniones, regalos o lo que necesites</h3>
      
      <div className="controls">
        <select value={sortOrder} onChange={handleSortChange}>
          <option value="alphabetical">Orden alfabético</option>
          <option value="newest">Más nuevos</option>
          <option value="oldest">Más viejos</option>
        </select>

        <CreateProjectDialog onCreate={() => { /* Implementar lógica si es necesario */ }} />
      </div>

      <div className="proyectos">
        <h2>TUS PROYECTOS</h2>

        {projects.length === 0 && <p>No hay proyectos. Crea uno nuevo con el botón "Crear Proyecto"</p>}

        {currentProjects.map((project) => (
          <div key={project.idProyecto} className="project-item">
            <span id="abrir" onClick={() => handleProjectClick(project.idProyecto)}>✚ </span>
            <span id="nombbre" onClick={() => handleProjectClick(project.idProyecto)}>
              {project.nombre}
            </span>
            <ExitAlert
            project={project}
            onExit={() => handleExit(project.idProyecto)}
            onEdit={(projectId, data) => handleEditProject(projectId, data)} 
          />
          </div>
        ))}
      </div>

      {sortedProjects.length > projectsPerPage && (
        <div className="pagination">
          <button id="anterior" onClick={handlePreviousPage} disabled={currentPage === 1}>
            Anterior
          </button>
          <span>Página {currentPage} de {totalPages}</span>
          <button id="siguiente" onClick={handleNextPage} disabled={currentPage === totalPages}>
            Siguiente
          </button>
        </div>
      )}
    </div>
  );
};

export default Home;
