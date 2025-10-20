export interface UsuarioResponse {
  id: number;
  negocio_id: number;
  nombre: string;
  email: string;
}

export interface UsuarioWithNegocio extends UsuarioResponse {
  negocio: {
    id: number;
    nombre: string;
  };
}

