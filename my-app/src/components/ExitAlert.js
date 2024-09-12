import React, { useState, useRef, useEffect } from "react";
import AlertDialog from "./AlertDialog";
import EditProjectDialog from "./EditProjectDialog";
import HideProjectDialog from "./HideProjectDialog"; // Importa el nuevo diálogo de ocultar
import "./ExitAlert.css";

const ExitAlert = ({ project, onExit, onEdit, onHide }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isExitDialogOpen, setIsExitDialogOpen] = useState(false);
  const [isHideDialogOpen, setIsHideDialogOpen] = useState(false); // Estado para "Ocultar del Home"
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

  const handleHideClick = () => {
    setIsDropdownOpen(false);
    setIsHideDialogOpen(true); // Abrir el diálogo para ocultar del Home
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

  // Funciones para ocultar el proyecto del Home
  const handleCancelHide = () => {
    setIsHideDialogOpen(false);
  };

  const handleConfirmHide = () => {
    onHide(project.id); // Ejecuta la función para ocultar del Home
    setIsHideDialogOpen(false);
  };

  // Manejo de clic fuera del dropdown
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
          <button className="dropdown-item hide" onClick={handleHideClick}>
            Archivar 
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

      {/* Diálogo de Quitar del Home */}
      {isHideDialogOpen && (
        <HideProjectDialog
          isOpen={isHideDialogOpen}
          onConfirm={handleConfirmHide}
          onCancel={handleCancelHide}
        />
      )}
    </div>
  );
};

export default ExitAlert;
