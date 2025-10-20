export interface AhorroResumen {
  usuario_id: number;
  saldo_actual: number;
  total_depositos: number;
  total_retiros: number;
  cantidad_movimientos: number;
}

export interface AhorroDetalle {
  id: number;
  fecha: Date;
  tipo: 'deposito' | 'retiro';
  monto: number;
  saldo_acumulado: number;
}

export interface AhorroHistorial {
  usuario_id: number;
  saldo_actual: number;
  total_depositos: number;
  total_retiros: number;
  movimientos: AhorroDetalle[];
}

