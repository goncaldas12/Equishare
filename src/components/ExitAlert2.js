import React, { useState, useRef, useEffect } from "react";
import AlertDialog from "./AlertDialog";
import EditProjectDialog from "./EditProjectDialog";
import "./ExitAlert.css";

const ExitAlert2 = ({ project, onExit, onEdit, onHide }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isExitDialogOpen, setIsExitDialogOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleEditClick = () => {
    setIsDropdownOpen(false);
    setIsEditDialogOpen(true);
  };

  const handleExitClick = () => {
    setIsDropdownOpen(false);
    setIsExitDialogOpen(true);
  };

  const handleSaveProject = (newName, newDescription) => {
    onEdit(newName, newDescription);
    setIsEditDialogOpen(false);
  };

  // Funciones para salir del proyecto
  const handleCancelExit = () => {
    setIsExitDialogOpen(false);
  };

  const handleConfirmExit = () => {
    onExit(project.id); // Ejecuta la función para salir del proyecto
    setIsExitDialogOpen(false);
  };

  //  clic fuera del dropdown y que se cierre
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

  return (
    <div className="exit-alert" ref={dropdownRef}>
      <button onClick={toggleDropdown} className="three-dots-button">
        &#8230;
      </button>

      {isDropdownOpen && (
        <div className="dropdown-menu">
          <button className="dropdown-item" onClick={handleEditClick}>
            Editar 
          </button>
          <button className="dropdown-item exit" onClick={handleExitClick}>
            Salir
          </button>
        </div>
      )}

      {/* Diálogo de Editar Proyecto */}
      {isEditDialogOpen && (
        <EditProjectDialog
          project={project}
          onSave={handleSaveProject}
          onCancel={() => setIsEditDialogOpen(false)}
        />
      )}

      {/* Diálogo de Salir */}
      {isExitDialogOpen && (
        <AlertDialog
          isOpen={isExitDialogOpen}
          onConfirm={handleConfirmExit}
          onCancel={handleCancelExit}
          message="¿Estás seguro de que deseas salir del proyecto?"
        />
      )}
    </div>
  );
};

export default ExitAlert2;
