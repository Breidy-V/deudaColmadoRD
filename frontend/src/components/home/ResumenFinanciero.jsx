import { DollarSign } from 'lucide-react';

export function ResumenFinanciero({ total }) {
  return (
    <div className="resumen-financiero">
      <p>Total de Deudas Activas</p>
      <h1><DollarSign size={24} />{total.toFixed(2)}</h1>
    </div>
  );
}