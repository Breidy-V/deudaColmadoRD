import { Search } from 'lucide-react';

export function Buscador({ value, onChange, placeholder = "Buscar cliente..." }) {
  return (
    <div className="buscador-container">
      <Search className="buscador-icon" size={18} />
      <input 
        type="search" 
        placeholder={placeholder} 
        className="buscador-input" 
        aria-label="Buscar clientes por nombre"
        value={value}
        onChange={onChange}
      />
    </div>
  );
}