import { UserPlus, PenLine, Wallet } from 'lucide-react';

export function BotonesAccion({ onAddCliente, onNuevoFiado, onResumenCaja }) {
  return (
    <div className="botones-grid">
      <button 
        className="btn-accion" 
        onClick={onAddCliente}
        aria-label="Añadir nuevo cliente"
      >
        <UserPlus size={20} /> Añadir Cliente
      </button>
      <button 
        className="btn-accion" 
        onClick={onNuevoFiado}
        aria-label="Registrar nuevo fiado"
      >
        <PenLine size={20} /> Nuevo Fiado
      </button>
      <button 
        className="btn-accion" 
        onClick={onResumenCaja}
        aria-label="Ver resumen de caja"
      >
        <Wallet size={20} /> Resumen Caja
      </button>
    </div>
  );
}