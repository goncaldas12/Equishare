import React from 'react';
import { Link } from 'react-router-dom';
import FeatureBox from './FeatureBox';
import Boxes from './Boxes';
import EmblaCarousel from './EmblaCarousel';
import imagen from '../images/Diseño sin título (5).png';
import imagen2 from '../images/Diseño sin título (6).png';
import imagen3 from '../images/Diseño sin título (7).png';
import cesar from '../images/Diseño sin título (11).png';
import lucas from '../images/Lucas.png';
import pareja from '../images/Pareja.png';
import laura from '../images/Laura.png';
import elena from '../images/Elena.png';
import marcos from '../images/Marcos.png';
import './Features.css';
import './base.css';
import './sandbox.css';
import './embla.css';


const OPTIONS = { loop: true };
const SLIDES = [
  cesar,
  elena,
  lucas,
  pareja, 
  marcos,
  laura
];

const Features = () => {
  return (
    <section className="features">
      <div className="custom-shape-divider-top-1724909139">
        <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" className="shape-fill"></path>
        </svg>
      </div>
      <div className="container">
        <div className="feature-row" id='prim'>
          <FeatureBox
            title="Cálculo Automático de Contribuciones"
            description="Dividimos los gastos por ti. Calcula automáticamente cuánto debe pagar o recibir cada miembro, con un desglose detallado de cada contribución."
            imgSrc={imagen}
          />
          <FeatureBox 
            title="Asignación Inteligente de Gastos"
            description="Personaliza cómo se dividen los gastos. Elige entre dividir equitativamente o asignar porcentajes específicos según las necesidades del proyecto."
            imgSrc={imagen2}
          />
          <FeatureBox
            title="Creación y Gestión de Proyectos"
            description="Crea proyectos y gestiona fácilmente los gastos compartidos. Asigna un nombre, una descripción y controla quiénes son parte del proyecto."
            imgSrc={imagen3}
          />
        </div>
        <EmblaCarousel slides={SLIDES} options={OPTIONS} />
        <Link to="/register">
          <button className="segundo" type="button" >Registrarse</button>
        </Link>
        <div className="feature-row">
          <Boxes
            title="Historial y Reportes Detallados"
            description="Consulta un historial completo de todos los gastos y tickets registrados. Verifica quién ha pagado qué."
          />
          <Boxes
            title="Sube y Registra tus Tickets de Compra"
            description="Publica tus gastos subiendo fotos de los tickets o ingresando los datos manualmente para llevar un control."
          />
        </div>
        <div className="feature-row">
          <Boxes
            title="Gestión de Usuarios Simplificada"
            description="Administra tu perfil con facilidad. Crea, edita o elimina tu cuenta y actualiza tu información personal cuando lo necesites."
          />
          <Boxes
            title="Notificaciones y Recordatorios"
            description="Mantente al día con recordatorios automáticos sobre saldos pendientes, enviados directamente a tu correo u otros medios."
          />
        </div>
      </div>
    </section>
  );
};

export default Features;
