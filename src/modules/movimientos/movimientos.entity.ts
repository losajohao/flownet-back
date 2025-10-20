export class Movimiento {
  id: number;
  negocio_id: number;
  producto_id?: number;
  descripcion?: string;
  tipo_movimiento: string;
  cantidad: number;
  precio_unitario: number;
  monto: number;
  fecha_hora: Date;
}

