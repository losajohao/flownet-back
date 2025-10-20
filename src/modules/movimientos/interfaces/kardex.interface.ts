export interface KardexItem {
  id: number;
  fecha: Date;
  tipo: 'entrada' | 'salida';
  descripcion: string;
  monto_unitario: number;
  cantidad: number;
  total: number;
  saldo: number;
}

export interface KardexResumen {
  total_entradas: number;
  total_salidas: number;
  saldo_global: number;
  movimientos: KardexItem[];
}

