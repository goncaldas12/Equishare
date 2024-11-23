import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import './ProjectDetails.css';
import ProjectHistory from './ProjectHistory';

const ProjectDetails = () => {
  const { projectId } = useParams();
  const [project, setProject] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isContributionDialogOpen, setIsContributionDialogOpen] = useState(false);
  const [contributionType, setContributionType] = useState('APORTE');
  const [selectedMember, setSelectedMember] = useState('');
  const [selectedRecipient, setSelectedRecipient] = useState('');
  const [contributionDescription, setContributionDescription] = useState('');
  const [contributionAmount, setContributionAmount] = useState('');
  const [selectedImage, setSelectedImage] = useState(null); 
  const [dropdownOpen, setDropdownOpen] = useState(false); // Control del dropdown
  const [selectedMembers, setSelectedMembers] = useState([]); // Miembros seleccionados

  const toggleMemberSelection = (member) => {
    setSelectedMembers((prevSelected) =>
      prevSelected.includes(member)
        ? prevSelected.filter((m) => m !== member) // Remueve si ya está seleccionado
        : [...prevSelected, member] // Agrega si no está seleccionado
    );
  };


  

  

  const currentUser = localStorage.getItem('username') || 'Usted';

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('currentUser')) || {};
    const storedProjects = storedUser.proyectos || [];

    const currentProject = storedProjects.find(p => p.id === Number(projectId));

    if (currentProject) {
      if (!currentProject.members.includes(currentUser)) {
        currentProject.members.push(currentUser);
        setProject(currentProject);
        updateLocalStorageForAllUsers(currentProject);
      } else {
        setProject(currentProject);
      }
    } else {
      console.error("Proyecto no encontrado");
      setProject(null);
    }
  }, [projectId, currentUser]);

  const handleAddMember = () => {
    const newMember = prompt("Introduce el nombre del nuevo integrante:");
    if (newMember && project && !project.members.includes(newMember)) {
      const updatedProject = {
        ...project,
        members: [...project.members, newMember].sort(),
      };
      setProject(updatedProject);
      updateLocalStorageForAllUsers(updatedProject);
    }
  };

  const toggleDialog = () => {
    setIsDialogOpen(!isDialogOpen);
  };

  const toggleContributionDialog = () => {
    setIsContributionDialogOpen(!isContributionDialogOpen);
  };

  const closeDialogOnOutsideClick = (e) => {
    if (e.target.className.includes("dialog-overlay")) {
      setIsDialogOpen(false);
      setIsContributionDialogOpen(false);
    }
  };

  const updateLocalStorageForAllUsers = (updatedProject) => {
    const allUsers = JSON.parse(localStorage.getItem('usuarios')) || [];
    const updatedUsers = allUsers.map(user => {
      if (user.proyectos) {
        const updatedProjects = user.proyectos.map(p =>
          p.id === updatedProject.id ? updatedProject : p
        );
        return { ...user, proyectos: updatedProjects };
      }
      return user;
    });

    localStorage.setItem('usuarios', JSON.stringify(updatedUsers));

    const storedUser = JSON.parse(localStorage.getItem('currentUser')) || {};
    const updatedCurrentUserProjects = storedUser.proyectos.map(p =>
      p.id === updatedProject.id ? updatedProject : p
    );
    storedUser.proyectos = updatedCurrentUserProjects;
    localStorage.setItem('currentUser', JSON.stringify(storedUser));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0]; 
    if (file) {
      const reader = new FileReader(); // Usar FileReader para convertir la imagen a base64
      reader.onloadend = () => {
        setSelectedImage(reader.result); 
      };
      reader.readAsDataURL(file); // Leer el archivo como una URL base64
    }
  };

  const handleAddContribution = () => {
    const amount = parseFloat(contributionAmount);
    if (!contributionDescription || isNaN(amount) || amount <= 0 || !selectedMember) return;
  
    const contributor = selectedMember;
    const recipient = contributionType === 'SALDAR DEUDA' ? selectedRecipient : null;
  
    const newContribution = {
      type: contributionType,
      member: contributor,
      recipient: recipient || null,
      description: contributionDescription,
      amount,
      date: new Date(),
      image: selectedImage || null
    };
  
    
    const updatedHistorial = project.historial ? [...project.historial, newContribution] : [newContribution];
  
    const updatedTotal = contributionType === 'APORTE'
      ? (project.total || 0) + amount
      : (project.total || 0);
  
    const updatedProject = {
      ...project,
      total: updatedTotal,
      contributions: {
        ...project.contributions,
        [contributor]: (project.contributions[contributor] || 0) + amount,
        ...(recipient && { [recipient]: (project.contributions[recipient] || 0) - amount })
      },
      historial: updatedHistorial, 
    };
  
    setProject(updatedProject);
    updateLocalStorageForAllUsers(updatedProject);
  
    setIsContributionDialogOpen(false);
    setContributionDescription('');
    setContributionAmount('');
    setSelectedMember('');
    setSelectedRecipient('');
    setSelectedImage(null);
  };
  
  const isContributionValid = () => {
    const amount = parseFloat(contributionAmount);
    if (!contributionDescription || isNaN(amount) || amount <= 0 || !selectedMember) return false;
    if (contributionType === 'SALDAR DEUDA' && !selectedRecipient) return false;
    return true;
  };

  if (!project) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="project-details-wrapper">
      <div className="header-row">
        <button className="open-dialog-btn" onClick={toggleDialog}>
          Ver Integrantes
        </button>

        <div className="project-header">
          <h1 className="project-title">{project.name}</h1>
          <p className="project-description">{project.description}</p>
          <p>Dinero total gastado: {project.total}</p>
        </div>

        <button className="new-contribution-btn" onClick={toggleContributionDialog}>
          Nueva Contribución
        </button>
      </div>
      


  <div className="content-wrapper">
    <ProjectHistory historial={project.historial} />
  </div>

      {/* Dialogo para mostrar los integrantes */}
      {isDialogOpen && (
        <div className="dialog-overlay" onClick={closeDialogOnOutsideClick}>
          <div className="dialog">
            <h2>Integrantes del Proyecto</h2>
            <ul className="members-list">
              {project.members.map((member, index) => (
                <li className="member-item" key={index}>
                  {member}{" "}
                  {member !== currentUser}
                </li>
              ))}
            </ul>
            <button className="confirm-contribution-btn" onClick={handleAddMember}>Agregar Integrante</button>
            <button className="close-dialog-btn" onClick={toggleDialog}>Cerrar</button>
          </div>
        </div>
      )}
      {/* Dialogo para nueva contribución */}
      {isContributionDialogOpen && (
  <div className="dialog-overlay" onClick={closeDialogOnOutsideClick}>
    <div className="dialog">
      <h2>Nueva Contribución</h2>
      
      {/* Selección de tipo de contribución */}
      <div className="contribution-type">
        <label>Tipo de contribución:</label>
        <select
          value={contributionType}
          onChange={(e) => setContributionType(e.target.value)}
        >
          <option value="APORTE">Gasto (Aporte)</option>
          <option value="SALDAR DEUDA">Saldar Deuda</option>
        </select>
      </div>

      {contributionType === "APORTE" && (
  <form className="contribution-form">
    <label>Monto:</label>
    <input
      type="number"
      value={contributionAmount}
      onChange={(e) => setContributionAmount(e.target.value)}
    />

    <label>Descripción:</label>
    <input
      type="text"
      value={contributionDescription}
      onChange={(e) => setContributionDescription(e.target.value)}
    />

<label>Excluir miembros:</label>
<div className="dropdown-container">
  <button
    type="button"
    className="dropdown-toggle"
    onClick={() => setDropdownOpen(!dropdownOpen)}
  >
    {selectedMembers.length > 0
        ? selectedMembers.slice(0, 3).join(", ") +
          (selectedMembers.length > 3 ? ` (+${selectedMembers.length - 3})` : "")
        : "Seleccionar miembros a excluir"}
  </button>
  {dropdownOpen && (
    <ul className="dropdown-menu scrollable">
      {project.members
        .filter((member) => member !== currentUser)
        .sort() // Ordena alfabéticamente
        .map((member, index) => (
          <li
            key={index}
            className={`dropdown-item ${
              selectedMembers.includes(member) ? "selected" : ""
            }`}
            onClick={() => toggleMemberSelection(member)}
          >
            {member}
          </li>
        ))}
    </ul>
  )}
</div>
    <label>Subir imagen:</label>
    <input type="file" onChange={handleImageUpload} />
  </form>
)}


      {contributionType === "SALDAR DEUDA" && (
        <form className="contribution-form">
          <label>Monto:</label>
          <input
            type="number"
            value={contributionAmount}
            onChange={(e) => setContributionAmount(e.target.value)}
          />

          <label>Selecciona destinatario:</label>
          <select
            value={selectedRecipient}
            onChange={(e) => setSelectedRecipient(e.target.value)}
          >
            <option value="">--Seleccionar--</option>
            {project.members
              .filter(member => member !== currentUser)
              .map((member, index) => (
                <option key={index} value={member}>
                  {member}
                </option>
              ))}
          </select>
        </form>
      )}

      <button
        className="confirm-contribution-btn"
        onClick={handleAddContribution}
        disabled={!isContributionValid()}
      >
        Confirmar
      </button>
      <button className="close-dialog-btn" onClick={toggleContributionDialog}>
        Cancelar
      </button>
    </div>
  </div>
)}

    </div>
  );
};

export default ProjectDetails;
