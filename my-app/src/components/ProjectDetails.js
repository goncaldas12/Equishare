import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import './ProjectDetails.css';
import ProjectHistory from './ProjectHistory';

const ProjectDetails = () => {
  const { projectId } = useParams();
  const [project, setProject] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [isContributionDialogOpen, setIsContributionDialogOpen] = useState(false); 
  const [memberToRemove, setMemberToRemove] = useState(null);
  const [contributionType, setContributionType] = useState('APORTE');
  const [selectedMember, setSelectedMember] = useState('');
  const [selectedRecipient, setSelectedRecipient] = useState('');
  const [contributionDescription, setContributionDescription] = useState('');
  const [contributionAmount, setContributionAmount] = useState('');
  const [selectedImage, setSelectedImage] = useState(null); //CAMBIO: Estado para almacenar la imagen seleccionada
  const currentUser = localStorage.getItem('username') || 'Tú';

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

  const handleRemoveMember = (member) => {
    if (member === currentUser) {
      alert("No puedes eliminarte a ti mismo del proyecto.");
      return;
    }
    setMemberToRemove(member);
    setIsConfirmDialogOpen(true);
  };

  const confirmRemoveMember = () => {
    if (project) {
      const updatedProject = {
        ...project,
        members: project.members.filter(member => member !== memberToRemove),
      };
      setProject(updatedProject);
      updateLocalStorageForAllUsers(updatedProject);
    }
    setIsConfirmDialogOpen(false);
    setMemberToRemove(null);
  };

  const cancelRemoveMember = () => {
    setIsConfirmDialogOpen(false);
    setMemberToRemove(null);
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

  //CAMBIO: Función para manejar la carga de imagen
  const handleImageUpload = (e) => {
    const file = e.target.files[0]; // Obtener el archivo seleccionado
    if (file) {
      const reader = new FileReader(); // Usar FileReader para convertir la imagen a base64
      reader.onloadend = () => {
        setSelectedImage(reader.result); // Guardar la imagen en el estado como base64
      };
      reader.readAsDataURL(file); // Leer el archivo como una URL base64
    }
  };

  const handleAddContribution = () => {
    const amount = parseFloat(contributionAmount);
    if (!contributionDescription || isNaN(amount) || amount <= 0 || !selectedMember) return;
  
    const contributor = selectedMember; // El que está pagando
    const recipient = contributionType === 'SALDAR DEUDA' ? selectedRecipient : null; // El que está recibiendo (solo si es SALDAR DEUDA)
  
    const newContribution = {
      type: contributionType,
      member: contributor,
      recipient: recipient || null,
      description: contributionDescription,
      amount,
      date: new Date(),
      image: selectedImage || null //CAMBIO: Incluye la imagen en los datos de la contribución
    };

     // Actualizar el total del proyecto
    const updatedTotal = contributionType === 'APORTE'
      ? (project.total || 0) + amount
      : (project.total || 0); // Si es SALDAR DEUDA, el total no cambia
  
    const updatedProject = {
      ...project,
      total: updatedTotal, // Actualiza el total
      contributions: {
        ...project.contributions,
        [contributor]: (project.contributions[contributor] || 0) + amount,
        ...(recipient && { [recipient]: (project.contributions[recipient] || 0) - amount })
      },
      historial: [...project.historial, newContribution], //CAMBIO: Agrega la contribución al historial
    };
  
    setProject(updatedProject);
    updateLocalStorageForAllUsers(updatedProject);
  
    // Resetear campos del formulario
    setIsContributionDialogOpen(false);
    setContributionDescription('');
    setContributionAmount('');
    setSelectedMember('');
    setSelectedRecipient('');
    setSelectedImage(null); //CAMBIO: Limpiar la imagen seleccionada
  };

  const availableRecipients = project ? project.members.filter(member => member !== selectedMember) : [];

  const isContributionValid = () => {
    const amount = parseFloat(contributionAmount);
    if (!contributionDescription || isNaN(amount) || amount <= 0 || !selectedMember) return false;

    if (contributionType === 'SALDAR DEUDA' && !selectedRecipient) return false;

    return true;
  };

  if (!project) {
    return <div>Cargando...</div>;
  }





  const calculateBalance = (total, members) => {
    const average = total / members.length;
    return members.map(member => {
      const contribution = project.contributions[member] || 0;
      const balance = contribution - average;
      return {
        member,
        contribution,
        balance
      };
    });
  };

  const balanceData = project ? calculateBalance(project.total, project.members) : [];
















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
        {/* Lista de balance de integrantes */}
        <div className="members-balance">
          <h2 id="gol">Balance de integrantes</h2>
          <ul>
              {balanceData
                .filter(({ balance }) => balance !== 0) // Filtra miembros con balance 0
                .map(({ member, balance }, index) => (
                  <li 
                    key={index}
                    className={balance > 0 ? 'positive-balance' : 'negative-balance'}
                  >
                    {balance > 0 
                      ? `${member} debe recibir ${balance.toFixed(2)}`
                      : `${member} debe pagar ${(balance * -1).toFixed(2)}`}
                  </li>
              ))}
          </ul>
        </div>
        <ProjectHistory history={project.historial} />
      </div>
      {isDialogOpen && (
        <div className="dialog-overlay" onClick={closeDialogOnOutsideClick}>
          <div className="dialog-content">
            <h2 className="members-title">Integrantes</h2>
            <ul className="members-list">
              {project.members.length > 0 ? (
                project.members.map((member, index) => (
                  <li key={index} className="member-item">
                    {member}
                    {member !== currentUser && (
                      <button
                        className="remove-member-btn"
                        onClick={() => handleRemoveMember(member)}
                      >
                        Eliminar
                      </button>
                    )}
                  </li>
                ))
              ) : (
                <p className="no-members">No hay integrantes en este proyecto.</p>
              )}
            </ul>
            <button className="close-dialog-btn" onClick={toggleDialog}>Cerrar</button>
            <button className="add-member-btn" onClick={handleAddMember}>
              Añadir integrante
            </button>
          </div>
        </div>
      )}

      {isContributionDialogOpen && (
        <div className="dialog-overlay" onClick={closeDialogOnOutsideClick}>
          <div className="dialog-content">
            <h2 className="contribution-title">Nueva Contribución</h2>
            <label>Tipo de contribución:</label>
            <select
              value={contributionType}
              onChange={(e) => setContributionType(e.target.value)}
            >
              <option value="APORTE">Aporte</option>
              <option value="SALDAR DEUDA">Saldar Deuda</option>
            </select>

            <label>Selecciona quien esta aportando:</label>
            <select
              value={selectedMember}
              onChange={(e) => setSelectedMember(e.target.value)}
            >
              <option value="">Seleccionar miembro</option>
              {project.members.map((member, index) => (
                <option key={index} value={member}>
                  {member}
                </option>
              ))}
            </select>

            {contributionType === 'SALDAR DEUDA' && (
              <>
                <label>Selecciona quien está recibiendo:</label>
                <select
                  value={selectedRecipient}
                  onChange={(e) => setSelectedRecipient(e.target.value)}
                >
                  <option value="">Seleccionar destinatario</option>
                  {availableRecipients.map((member, index) => (
                    <option key={index} value={member}>
                      {member}
                    </option>
                  ))}
                </select>
              </>
            )}

            <label>Descripción:</label>
            <input
              type="text"
              value={contributionDescription}
              onChange={(e) => setContributionDescription(e.target.value)}
            />

            <label>Monto:</label>
            <input
              type="number"
              value={contributionAmount}
              onChange={(e) => setContributionAmount(e.target.value)}
            />

            <label>Subir imagen (opcional):</label> {/* CAMBIO: Input para subir la imagen */}
            <input type="file" accept="image/*" onChange={handleImageUpload} /> {/* CAMBIO: Manejar la subida de archivos */}

            <button
              className="add-contribution-btn"
              onClick={handleAddContribution}
              disabled={!isContributionValid()}
            >
              Añadir Contribución
            </button>

            <button className="close-dialog-btn" onClick={toggleContributionDialog}>
              Cerrar
            </button>
          </div>
        </div>
      )}

      {isConfirmDialogOpen && (
        <div className="dialog-overlay" onClick={closeDialogOnOutsideClick}>
          <div className="dialog-content">
            <h2 className="confirm-title">Confirmar eliminación</h2>
            <p>¿Estás seguro de que quieres eliminar a {memberToRemove} del proyecto?</p>
            <button className="confirm-remove-btn" onClick={confirmRemoveMember}>
              Eliminar
            </button>
            <button className="cancel-remove-btn" onClick={cancelRemoveMember}>
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectDetails;
