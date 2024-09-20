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
  const [divisionType, setDivisionType] = useState('equitativo'); // 'equitativo' o 'porcentajes'
  const [percentages, setPercentages] = useState({}); // Porcentajes asignados a cada miembro

  

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
  
    // Asegurarnos de que el historial esté inicializado
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
      historial: updatedHistorial, // Asegurarnos de que siempre haya un array
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
  

  const handlePercentageChange = (member, value) => {
    const newPercentages = { ...percentages, [member]: value };
    const totalPercentage = Object.values(newPercentages).reduce((sum, p) => sum + parseFloat(p || 0), 0);

    if (totalPercentage <= 100) {
      setPercentages(newPercentages);
    } else {
      alert("La suma de los porcentajes no puede exceder el 100%");
    }
  };

  const calculateBalance = (total, members) => {
    if (divisionType === 'equitativo') {
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
    } else {
      const remainingPercentage = 100 - Object.values(percentages).reduce((sum, p) => sum + parseFloat(p || 0), 0);
      const unassignedMembers = members.filter(member => !percentages[member]);
      const unassignedPercentage = remainingPercentage / unassignedMembers.length;

      return members.map(member => {
        const memberPercentage = percentages[member] || unassignedPercentage;
        const memberShare = (total * memberPercentage) / 100;
        const contribution = project.contributions[member] || 0;
        const balance = contribution - memberShare;
        return {
          member,
          contribution,
          balance
        };
      });
    }
  };

  const balanceData = project ? calculateBalance(project.total, project.members) : [];

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
      


    <div className="division-settings">
    <label>Selecciona el tipo de división:</label>
    <select value={divisionType} onChange={(e) => setDivisionType(e.target.value)}>
      <option value="equitativo">División equitativa</option>
      <option value="porcentajes">División por porcentajes</option>
    </select>

    {/* Campos para asignar porcentajes si se selecciona "porcentajes" */}
    {divisionType === 'porcentajes' && (
      <div className="percentage-inputs">
        {project.members.map((member, index) => (
          <div key={index} className="percentage-field">
            <label>{member}</label>
            <input
              type="number"
              value={percentages[member] || ''}
              onChange={(e) => handlePercentageChange(member, e.target.value)}
              min="0"
              max="100"
              className="percentage-input"
            />%
          </div>
        ))}
      </div>
    )}
  </div>


      <div className="division-settings">
        <label>Selecciona el tipo de división:</label>
        <select value={divisionType} onChange={(e) => setDivisionType(e.target.value)}>
          <option value="equitativo">División equitativa</option>
          <option value="porcentajes">División por porcentajes</option>
        </select>

        {/* Campos para asignar porcentajes si se selecciona "porcentajes" */}
        {divisionType === 'porcentajes' && (
          <div className="percentage-inputs">
            {project.members.map((member, index) => (
              <div key={index} className="percentage-field">
                <label>{member}</label>
                <input
                  type="number"
                  value={percentages[member] || ''}
                  onChange={(e) => handlePercentageChange(member, e.target.value)}
                  min="0"
                  max="100"
                />%
              </div>
            ))}
          </div>
        )}
      </div>


    <div className="content-wrapper">
      <div className="members-balance">
        <h2 id="gol">Balance de integrantes</h2>
        <ul>
          {balanceData
            .filter(({ balance }) => balance !== 0)
            .map(({ member, balance }, index) => (
              <li key={index} className={balance > 0 ? 'positive-balance' : 'negative-balance'}>
                {member}: {balance > 0 ? `Debe recibir $${balance}` : `Debe pagar $${Math.abs(balance)}`}
              </li>
            ))}
        </ul>
      </div>
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
                  {member !== currentUser && (
                    <button className="remove-member-btn" onClick={() => handleRemoveMember(member)}>Eliminar</button>
                  )}
                </li>
              ))}
            </ul>
            <button className="confirm-contribution-btn" onClick={handleAddMember}>Agregar Integrante</button>
            <button className="close-dialog-btn" onClick={toggleDialog}>Cerrar</button>
          </div>
        </div>
      )}

      {/* Confirmar eliminación */}
      {isConfirmDialogOpen && (
        <div className="dialog-overlay" onClick={closeDialogOnOutsideClick}>
          <div className="dialog">
            <h3>¿Estás seguro de que deseas eliminar a {memberToRemove} del proyecto?</h3>
            <button onClick={confirmRemoveMember}>Sí</button>
            <button onClick={cancelRemoveMember}>No</button>
          </div>
        </div>
      )}

      {/* Dialogo para nueva contribución */}
      {isContributionDialogOpen && (
        <div className="dialog-overlay" onClick={closeDialogOnOutsideClick}>
          <div className="dialog">
            <h2>Nueva Contribución</h2>
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

            <label>Tipo de contribución:</label>
            <select
              value={contributionType}
              onChange={(e) => setContributionType(e.target.value)}
            >
              <option value="APORTE">Aporte</option>
              <option value="SALDAR DEUDA">Saldar deuda</option>
            </select>

            {contributionType === 'APORTE' && (
              <>
                <label>Miembro que aporta:</label>
                <select
                  value={selectedMember}
                  onChange={(e) => setSelectedMember(e.target.value)}
                >
                  <option value="">Selecciona un miembro</option>
                  {project.members.map((member, index) => (
                    <option key={index} value={member}>{member}</option>
                  ))}
                </select>
              </>
            )}

            {contributionType === 'SALDAR DEUDA' && (
              <>
                <label>Miembro que paga la deuda:</label>
                <select
                  value={selectedMember}
                  onChange={(e) => setSelectedMember(e.target.value)}
                >
                  <option value="">Selecciona un miembro</option>
                  {project.members.map((member, index) => (
                    <option key={index} value={member}>{member}</option>
                  ))}
                </select>

                <label>Miembro que recibe el pago:</label>
                <select
                  value={selectedRecipient}
                  onChange={(e) => setSelectedRecipient(e.target.value)}
                >
                  <option value="">Selecciona un miembro</option>
                  {availableRecipients.map((member, index) => (
                    <option key={index} value={member}>{member}</option>
                  ))}
                </select>
              </>
            )}

            <label>Selecciona una imagen (opcional):</label>
            <input type="file" accept="image/*" onChange={handleImageUpload} />

            <button onClick={handleAddContribution} disabled={!isContributionValid()}>
              Añadir Contribución
            </button>
            <button className="close-dialog-btn" onClick={toggleContributionDialog}>Cancelar</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectDetails;
