import React from "react";
import "./AlertDialog.css";

const AlertDialog = ({ onConfirm, onCancel, isOpen }) => {
  if (!isOpen) return null; 

  return (
    <div className="alert-dialog-overlay">
      <div className="alert-dialog">
        <h2>¿Estás seguro?</h2>
        <p>¿Realmente quieres salir de este proyecto? Esta acción no se puede deshacer.</p>
        <div className="alert-dialog-buttons">
          <button onClick={onCancel} className="cancel-button">
            Cancelar
          </button>
          <button id="salir" onClick={onConfirm} className="confirm-button">
            Salir
          </button>
        </div>
      </div>
    </div>
  );
};

export default AlertDialog;
