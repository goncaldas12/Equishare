import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ExitAlert2 from "./ExitAlert2";
import './Projects.css';

const Projects = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [projects, setProjects] = useState([]);
  const [sortOrder, setSortOrder] = useState("alphabetical");
  const [currentUser, setCurrentUser] = useState(null);
  const projectsPerPage = 8;
  const navigate = useNavigate();

  useEffect(() => {
    // Cargar el usuario actual desde localStorage
    const user = JSON.parse(localStorage.getItem('currentUser'));

    if (user) {
      setCurrentUser(user); 
      setProjects(user.proyectos || []);  // Cargar los proyectos del usuario actual o inicializar con array vacío
    }
  }, []);

  const updateUserProjects = (updatedProjects) => {
    const updatedUser = { ...currentUser, proyectos: updatedProjects };

    // Actualizar la lista de usuarios con el usuario actualizado
    const storedUsers = JSON.parse(localStorage.getItem('usuarios')) || [];
    const updatedUsers = storedUsers.map(user =>
      user.id === updatedUser.id ? updatedUser : user
    );

    // Guardar el usuario actualizado y la lista de usuarios en el localStorage
    localStorage.setItem('usuarios', JSON.stringify(updatedUsers));
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    localStorage.setItem('projects', JSON.stringify(updatedProjects)); // Guardar una copia independiente de los proyectos

    setProjects(updatedProjects);
    setCurrentUser(updatedUser);
  };

  const handleMoveToHome = (projectId) => {
    const updatedProjects = projects.map((project) =>
      project.id === projectId ? { ...project, hidden: false } : project
    );
    updateUserProjects(updatedProjects);
  };

  const handleExit = (projectId) => {
    const updatedProjects = projects.filter((project) => project.id !== projectId);
    updateUserProjects(updatedProjects);

    const remainingProjectsOnPage = updatedProjects.slice(
      (currentPage - 1) * projectsPerPage,
      currentPage * projectsPerPage
    );

    if (remainingProjectsOnPage.length === 0 && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  
  
  const handleEditProject = (projectId, newName, newDescription) => {
    const updatedProjects = projects.map((project) =>
      project.id === projectId ? { ...project, name: newName, description: newDescription } : project
    );
    updateUserProjects(updatedProjects);
  };

  const handleSortChange = (event) => {
    setSortOrder(event.target.value);
  };

  const sortedProjects = [...projects]
    .filter((project) => project.hidden)
    .sort((a, b) => {
      if (sortOrder === "alphabetical") {
        return a.name.localeCompare(b.name);
      } else if (sortOrder === "oldest") {
        return a.createdAt - b.createdAt;
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

  return (
    <div className="home">
      <h1 id="tittulo">Proyectos Archivados</h1>
      
      <div className="controls">
        <select value={sortOrder} onChange={handleSortChange}>
          <option value="alphabetical">Orden alfabético</option>
          <option value="oldest">Más viejos</option>
        </select>

      </div>

      <div className="archivados" >

        {projects.length === 0 && <p>No hay proyectos archivados.</p>}

        {currentProjects.map((project) => (
          <div 
            key={project.id} 
            className="project-item-a" 
          > <span id="abrir" onClick={() => handleProjectClick(project.id)}>✚ </span>
            <span id="nombbre" onClick={() => handleProjectClick(project.id)}>{project.name}</span>
            <ExitAlert2
              project={project}
              onExit={() => handleExit(project.id)}
              onEdit={(newName, newDescription) =>
                handleEditProject(project.id, newName, newDescription)
              }
              onHide={() => handleMoveToHome(project.id)}
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

export default Projects;