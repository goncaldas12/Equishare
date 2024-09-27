import React, { useState } from "react";
import './ProjectHistory.css';

const ProjectHistory = ({ historial }) => {
  const [selectedImage, setSelectedImage] = useState(null);

  
  const safeHistory = Array.isArray(historial) ? historial : [];

  const openImageModal = (image) => {
    setSelectedImage(image);
  };

  const closeImageModal = () => {
    setSelectedImage(null);
  };

  return (
    <div className="history-container">
      <h2 id="historial">Historial de Contribuciones</h2>
      {safeHistory.length > 0 ? (
        <ul className="history-list">
          {safeHistory.slice().reverse().map((item, index) => (
            <li
              key={index}
              className={`history-item ${
                item.type === "APORTE" ? "aporte-bg" : "saldar-deuda-bg"
              }`}
            >
              <p><strong>{item.type}:</strong> {item.description}</p>
              <p>
                <strong>Miembro:</strong> {item.member}
                {item.type === "SALDAR DEUDA" && (
                  <>
                    <br />
                    <strong>Receptor:</strong> {item.recipient}
                  </>
                )}
              </p>
              <p><strong>Monto:</strong> {item.amount}</p>
              <p><strong>Fecha:</strong> {new Date(item.date).toLocaleString()}</p>

              {/* Mostrar la imagen si existe */}
              {item.image && (
                <button
                  className="toggle-image-btn"
                  onClick={() => openImageModal(item.image)}
                >
                  Ver imagen
                </button>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p>No hay contribuciones registradas.</p>
      )}

      {/* Modal para la imagen */}
      {selectedImage && (
        <div className="image-modal-overlay" onClick={closeImageModal}>
          <div className="image-modal-content">
            <img src={selectedImage} alt="Comprobante" className="modal-image" />
            <button className="close-modal-btn" onClick={closeImageModal}>Cerrar</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectHistory;
