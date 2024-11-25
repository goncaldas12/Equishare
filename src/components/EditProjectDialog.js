import React, { useState } from "react";
import "./EditProjectDialog.css";

const EditProjectDialog = ({ project, onSave, onCancel }) => {
  const [projectName, setProjectName] = useState(project.nombre); 
  const [projectDescription, setProjectDescription] = useState(project.descripcion || ""); 

  const handleSave = () => {
  
    if (typeof projectName !== "string" || typeof projectDescription !== "string") {
      return;
    }
  
    onSave({ nombre: projectName.trim(), descripcion: projectDescription.trim() }); 
  };
  



  return (
    <div className="dialog-overlay">
      <div className="dialog-content">
        <h2 className="dialog-title">Editar proyecto</h2>
        <div className="form-row">
          <label htmlFor="edit-project-name" className="label">Nombre del proyecto</label>
          <input
            id="edit-project-name"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            className="input"
            placeholder="Nombre visible"
          />
        </div>
        <div className="form-row">
          <label htmlFor="edit-project-description" className="label">Descripción (opcional)</label>
          <textarea
            id="edit-project-description"
            value={projectDescription}
            onChange={(e) => setProjectDescription(e.target.value)}
            className="textarea"
            placeholder="Descripción del proyecto"
          />
        </div>
        <div className="dialog-footer">
          <button className="button-secondary" onClick={onCancel}>
            Cancelar
          </button>
          <button className="button-primary" onClick={handleSave}>
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditProjectDialog;