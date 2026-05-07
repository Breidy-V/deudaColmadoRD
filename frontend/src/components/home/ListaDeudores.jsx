import { TarjetaCliente } from './TarjetaCliente';

export function ListaDeudores({ deudores, onSelectCliente, onEliminarCliente }) {
  return (
    <section className="lista-deudores" aria-labelledby="titulo-lista">
      <div className="encabezado-lista">
        <h3 id="titulo-lista">Estado de Cuentas</h3>
        <select className="filtro-select" aria-label="Filtrar lista de deudores">
          <option>Mayor a menor deuda</option>
          <option>Por proximidad</option>
          <option>Fecha</option>
        </select>
      </div>

      <div className="deudores-contenedor" role="list">
        {deudores.map((cliente) => (
          <TarjetaCliente
            key={cliente.id_deuda}
            cliente={cliente}
            onSelect={onSelectCliente}
            onEliminar={onEliminarCliente}
          />
        ))}
      </div>
    </section>
  );
}