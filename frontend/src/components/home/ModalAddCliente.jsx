export function ModalAddCliente({ mostrar, form, onChange, onSubmit, onClose }) {
  if (!mostrar) return null;

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="titulo-modal-add">
      <div className="modal-content">
        <h2 id="titulo-modal-add">Añadir Nuevo Cliente</h2>
        <form className="formulario-modal" onSubmit={onSubmit}>
          <input
            type="text"
            name="nombre"
            placeholder="Nombre"
            value={form.nombre}
            onChange={onChange}
            required
          />
          <input
            type="text"
            name="apellido"
            placeholder="Apellido"
            value={form.apellido}
            onChange={onChange}
            required
          />
          <input type="date" />
          <input
            type="text"
            name="direccion"
            placeholder="Dirección"
            value={form.direccion}
            onChange={onChange}
            required
          />
          <input
            type="tel"
            name="telefono"
            placeholder="Teléfono"
            value={form.telefono}
            onChange={onChange}
            required
          />
          <input
            type="number"
            name="deuda"
            placeholder="Deuda Inicial (Opcional)"
            value={form.deuda}
            onChange={onChange}
          />
          
          <div className="modal-botones">
            <button type="button" className="btn-cancelar" onClick={onClose}>Cancelar</button>
            <button type="submit" className="btn-guardar">Registrar</button>
          </div>
        </form>
      </div>
    </div>
  );
}