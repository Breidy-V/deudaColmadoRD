import { Trash2 } from 'lucide-react';

export function TarjetaCliente({ cliente, onSelect, onEliminar }) {
  const diasVencido = cliente.diasVencido || 0;
  const claseAlerta = diasVencido > 15 ? 'alerta-roja' : 'alerta-naranja';
  
  return (
    <div 
      key={cliente.id_deuda} 
      className={`tarjeta-cliente ${claseAlerta}`}
      role="listitem"
    >
      <button 
        className="btn-info-cliente" 
        onClick={() => onSelect(cliente)}
        aria-label={`Gestionar cuenta de ${cliente.nombre}`}
      >
        <strong>{cliente.nombre} {cliente.apellido}</strong>
        <span>Deuda activa</span>
      </button>
      
      <div className="acciones-cliente">
        <div className="monto-cliente" aria-hidden="true">
          <strong>${cliente.saldo_pendiente}</strong>
        </div>
        <button 
          className="btn-eliminar" 
          aria-label={`Eliminar a ${cliente.nombre} del sistema`}
          onClick={(e) => onEliminar(e, cliente.id_cliente)}
        >
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );
}