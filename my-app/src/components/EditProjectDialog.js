import React, { useState } from "react";
import './EditProjectDialog.css'; // Importar estilos CSS separados

const EditProjectDialog = ({ project, onSave, onCancel }) => {
  const [projectName, setProjectName] = useState(project.name);
  const [projectDescription, setProjectDescription] = useState(project.description);

  const handleSave = () => {
    if (projectName.trim() === "") {
      alert("El nombre del proyecto es obligatorio.");
      return;
    }
    onSave(projectName, projectDescription);
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
