import { useState } from 'react';
import { CheckCircle, PlusCircle, MinusCircle, X, History, DollarSign } from 'lucide-react';

export function ModalGestionarDeuda({ cliente, onClose, onSaldar, onAbonar, onSumar, onActualizar }) {
  const [modo, setModo] = useState(null);
  const [monto, setMonto] = useState('');
  const [cargando, setCargando] = useState(false);

  if (!cliente) return null;

  const diasVencido = cliente.diasVencido || 0;
  const saldoPendiente = cliente.saldo_pendiente || 0;
  const montoTotal = cliente.monto_total || 0;
  const totalPagado = cliente.total_pagado || 0;

  const handleConfirmar = async () => {
    if (!monto || isNaN(Number(monto))) return;
    
    setCargando(true);
    try {
      if (modo === 'saldar') {
        await onSaldar(saldoPendiente);
      } else if (modo === 'abonar') {
        await onAbonar(Number(monto));
      } else if (modo === 'sumar') {
        await onSumar(Number(monto));
      }
      onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setCargando(false);
    }
  };

  const handleMontoChange = (e) => {
    const value = e.target.value.replace(/[^0-9.]/g, '');
    setMonto(value);
  };

  const renderInputMonto = () => {
    if (!modo) return null;

    let botonConfirmarTexto = '';
    let placeholder = '';
    
    switch (modo) {
      case 'saldar':
        botonConfirmarTexto = `Pagar $${saldoPendiente.toFixed(2)}`;
        placeholder = 'Monto a pagar';
        break;
      case 'abonar':
        botonConfirmarTexto = 'Registrar Abono';
        placeholder = 'Monto a abonar';
        break;
      case 'sumar':
        botonConfirmarTexto = 'Sumar a Deuda';
        placeholder = 'Monto a agregar';
        break;
    }

    return (
      <div className="modal-monto-input">
        <div className="input-group">
          <span className="input-prefix">$</span>
          <input
            type="number"
            value={monto}
            onChange={handleMontoChange}
            placeholder={placeholder}
            min="0"
            step="0.01"
            className="monto-input"
            autoFocus
          />
        </div>
        
        {modo !== 'saldar' && (
          <button 
            className="btn-confirmar-monto" 
            onClick={handleConfirmar}
            disabled={cargando || !monto || Number(monto) <= 0}
          >
            <DollarSign size={18} /> {botonConfirmarTexto}
          </button>
        )}
        
        {modo === 'saldar' && Number(monto) >= saldoPendiente && (
          <button 
            className="btn-confirmar-monto" 
            onClick={handleConfirmar}
            disabled={cargando || Number(monto) < saldoPendiente}
          >
            <CheckCircle size={18} /> {botonConfirmarTexto}
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="titulo-modal-gestion">
      <div className="modal-content">
        <button className="btn-cerrar-flotante" onClick={onClose} aria-label="Cerrar">
          <X size={20} />
        </button>

        <h2 id="titulo-modal-gestion">
          {cliente.nombre} {cliente.apellido}
        </h2>

        <div className="deuda-resumen">
          <div className="deuda-item">
            <span className="deuda-label">Deuda Original</span>
            <span className="deuda-value">${montoTotal.toFixed(2)}</span>
          </div>
          <div className="deuda-item">
            <span className="deuda-label">Total Pagado</span>
            <span className="deuda-value pagado">${totalPagado.toFixed(2)}</span>
          </div>
          <div className="deuda-item saldo">
            <span className="deuda-label">Saldo Pendiente</span>
            <span className="deuda-value">${saldoPendiente.toFixed(2)}</span>
          </div>
        </div>

        <div className="historial-mini">
          <p><History size={14} /> Último movimiento: Fiado (hace {diasVencido} días)</p>
        </div>

        {renderInputMonto()}

        <div className="botones-gestion">
          {!modo && (
            <>
              <button 
                className="btn-gestion saldar" 
                onClick={() => setModo('saldar')}
                disabled={saldoPendiente <= 0}
              >
                <CheckCircle size={18} /> Saldar Completo
              </button>
              <button 
                className="btn-gestion abonar" 
                onClick={() => setModo('abonar')}
              >
                <MinusCircle size={18} /> Abonar Cantidad
              </button>
              <button 
                className="btn-gestion sumar" 
                onClick={() => setModo('sumar')}
              >
                <PlusCircle size={18} /> Sumar a la Deuda
              </button>
            </>
          )}
          
          {modo && (
            <button 
              className="btn-gestion cancelar" 
              onClick={() => { setModo(null); setMonto(''); }}
            >
              <X size={18} /> Cancelar
            </button>
          )}
        </div>
      </div>
    </div>
  );
}