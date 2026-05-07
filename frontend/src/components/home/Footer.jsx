export function Footer({ year = 2026 }) {
  return (
    <footer className="footer-equipo">
      <p>&copy; 20026 FiadoRD - Gestión de Colmados</p>
      <p className="integrantes">
        Desarrollado por: {INTEGRANTES.join(', ')}.
      </p>
    </footer>
  );
}

const INTEGRANTES = [
  'Jose Ismael Garcia', 
  'Bienvenido Quezada', 
  'Bryan Ramirez', 
  'Deivy Abreu', 
  'Jose Manuel de la Cruz', 
  'Yordani Guerrero', 
  'Gregory Alfonso'
];