export interface NegocioResumen {
  id: number;
  nombre: string;
  descripcion?: string;
  activo: boolean;
  saldo_actual: number;
  total_entradas: number;
  total_salidas: number;
  cantidad_movimientos: number;
}

