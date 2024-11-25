import React, { useState, useRef, useEffect } from "react";
import AlertDialog from "./AlertDialog";
import EditProjectDialog from "./EditProjectDialog";
import "./ExitAlert.css";

const ExitAlert = ({ project, onExit, onEdit }) => {
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

  const handleSaveProject = async ({ nombre, descripcion }) => {
  
  
    try {
      await onEdit(project.idProyecto, { nombre, descripcion }); 
      setIsEditDialogOpen(false);
    } catch (error) {
    }
  };
  






  const handleConfirmExit = async () => {
    try {
      await onExit(project.idProyecto);
      setIsExitDialogOpen(false);
    } catch (error) {
    }
  };

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

      {isEditDialogOpen && (
        <EditProjectDialog
          project={project} 
          onSave={handleSaveProject}
          onCancel={() => setIsEditDialogOpen(false)}
        />
      )}

      {isExitDialogOpen && (
        <AlertDialog
          isOpen={isExitDialogOpen}
          onConfirm={handleConfirmExit}
          onCancel={() => setIsExitDialogOpen(false)}
          message="¿Estás seguro de que deseas salir del proyecto?"
        />
      )}
    </div>
  );
};

export default ExitAlert;

