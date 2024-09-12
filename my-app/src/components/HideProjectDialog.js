import React from "react";
import "./HideProjectDialog.css";

const HideProjectDialog = ({ isOpen, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <div className="hide-dialog-overlay">
      <div className="hide-dialog-content">
        <h2>Quitar del Home</h2>
        <p>¿Estás seguro de que deseas Archivar este proyecto? Podrás volver a verlo en la lista completa de proyectos archivados.</p>
        <div className="dialog-footer">
          <button onClick={onCancel} className="cancel-button">
            Cancelar
          </button>
          <button onClick={onConfirm} className="confirm-button">
            Archivar
          </button>
        </div>
      </div>
    </div>
  );
};

export default HideProjectDialog;
