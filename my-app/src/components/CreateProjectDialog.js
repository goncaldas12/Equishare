import React, { useState } from "react";
import './CreateProjectDialog.css';

const CreateProjectDialog = ({ onCreate }) => {
  const [newProjectName, setNewProjectName] = useState("");
  const [newProjectDescription, setNewProjectDescription] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const handleCreate = () => {
    if (newProjectName.trim() === "") {
      alert("El nombre del proyecto es obligatorio.");
      return;
    }
    onCreate(newProjectName, newProjectDescription); 
    setNewProjectName("");
    setNewProjectDescription("");
    setIsOpen(false);  
  };

  return (
    <div>
      <button id="btnbtn" className="button-primary" onClick={() => setIsOpen(true)}>
        Crear Proyecto
      </button>

      {isOpen && (
        <div className="dialog-overlay">
          <div className="dialog-content">
            <h2 className="dialog-title">Crear nuevo proyecto</h2>
            <div className="form-row">
              <label htmlFor="project-name" className="label">Nombre del proyecto</label>
              <input
                id="project-name"
                value={newProjectName}
                onChange={(e) => setNewProjectName(e.target.value)}
                className="input"
                placeholder="Nombre visible"
              />
            </div>
            <div className="form-row">
              <label htmlFor="project-description" className="label">Descripción</label>
              <textarea
                id="project-description"
                value={newProjectDescription}
                onChange={(e) => setNewProjectDescription(e.target.value)}
                className="textarea"
                placeholder="Descripción del proyecto"
              />
            </div>
            <div className="dialog-footer">
              <button id="botonsec" className="button-secondary" onClick={() => setIsOpen(false)}>Cancelar</button>
              <button id="botonprim" className="button-primary" onClick={handleCreate}>Crear</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateProjectDialog;
