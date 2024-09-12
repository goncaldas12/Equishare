import React from "react";
import "./HideProjectDialog.css";

const HideProjectDialog2 = ({ isOpen, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <div className="hide-dialog-overlay">
      <div className="hide-dialog-content">
        <h2>Mostrar Proyecto</h2>
        <p>¿Estás seguro de que deseas Mostrar este proyecto? </p>
        <div className="dialog-footer">
          <button onClick={onCancel} className="cancel-button">
            Cancelar
          </button>
          <button onClick={onConfirm} className="confirm-button">
            Mostrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default HideProjectDialog2;
