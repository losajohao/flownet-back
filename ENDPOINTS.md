# 📡 Documentación de Endpoints - Flownet Backend

## 🔐 Módulo de Autenticación

### `POST /api/auth/login`
Inicia sesión con email y contraseña.

**Body:**
```json
{
  "email": "usuario@ejemplo.com",
  "pwd": "contraseña123"
}
```

**Respuesta exitosa (200):**
```json
{
  "id": 1,
  "nombre": "Juan Pérez",
  "email": "usuario@ejemplo.com",
  "negocio_id": 1,
  "message": "Inicio de sesión exitoso"
}
```

**Errores:**
- `401 Unauthorized`: Credenciales inválidas
- `400 Bad Request`: Datos de entrada inválidos

**Nota:** Para crear usuarios, usar el endpoint `POST /api/usuarios` del módulo de Usuarios.

---

## 🏢 Módulo de Negocios

### `GET /negocios`
Obtiene todos los negocios registrados.

**Respuesta:**
```json
[
  {
    "id": 1,
    "nombre": "Negocio Principal",
    "descripcion": "Descripción del negocio",
    "activo": true,
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-01T00:00:00.000Z"
  }
]
```

### `GET /negocios/activos`
Obtiene solo los negocios activos.

### `GET /negocios/:id`
Obtiene un negocio por ID.

### `POST /negocios`
Crea un nuevo negocio.

**Body:**
```json
{
  "nombre": "Mi Negocio",
  "descripcion": "Descripción opcional",
  "activo": true
}
```

### `PUT /negocios/:id`
Actualiza un negocio existente.

### `PATCH /negocios/:id/toggle-activo`
Activa o desactiva un negocio.

### `DELETE /negocios/:id`
Elimina un negocio.

---

## 📦 Módulo de Movimientos (Kardex Multi-Negocio)

### `GET /movimientos`
Obtiene todos los movimientos.

### `GET /movimientos/:id`
Obtiene un movimiento por ID.

### `GET /movimientos/negocio/:negocioId`
Obtiene todos los movimientos de un negocio específico.

### `GET /movimientos/kardex/:negocioId`
Obtiene el kardex completo de un negocio con saldo acumulado.

**Respuesta:**
```json
{
  "total_entradas": 5000,
  "total_salidas": 2000,
  "saldo_global": 3000,
  "movimientos": [
    {
      "id": 1,
      "fecha": "2024-01-01",
      "tipo": "entrada",
      "descripcion": "Venta de producto X",
      "monto_unitario": 100,
      "cantidad": 10,
      "total": 1000,
      "saldo": 1000
    }
  ]
}
```

### `GET /movimientos/kardex/:negocioId/saldo`
Obtiene solo el saldo actual de un negocio.

**Respuesta:**
```json
{
  "negocio_id": 1,
  "saldo": 3000,
  "total_entradas": 5000,
  "total_salidas": 2000
}
```

### `GET /movimientos/kardex/:negocioId/producto/:productoId`
Obtiene el kardex de un producto específico dentro de un negocio.

### `GET /movimientos/negocio/:negocioId/tipo/:tipo`
Filtra movimientos por negocio y tipo (entrada/salida).

**Parámetros:**
- `tipo`: `entrada` o `salida`

### `GET /movimientos/negocio/:negocioId/rango?fechaInicio=YYYY-MM-DD&fechaFin=YYYY-MM-DD`
Filtra movimientos por negocio y rango de fechas.

### `POST /movimientos`
Crea un nuevo movimiento.

**Body:**
```json
{
  "negocio_id": 1,
  "tipo": "entrada",
  "producto_id": 5,
  "descripcion_producto": "Producto sin ID",
  "cantidad": 10,
  "monto_unitario": 100,
  "total": 1000,
  "fecha": "2024-01-01",
  "observaciones": "Notas opcionales"
}
```

**Nota:** Si `producto_id` es null, entonces `descripcion_producto` debe tener valor.

### `PUT /movimientos/:id`
Actualiza un movimiento existente.

### `DELETE /movimientos/:id`
Elimina un movimiento.

---

## 💰 Módulo de Ahorros (Multiusuario)

### `GET /ahorros`
Obtiene todos los ahorros.

### `GET /ahorros/:id`
Obtiene un ahorro por ID.

### `GET /ahorros/usuario/:usuarioId`
Obtiene todos los ahorros de un usuario.

### `GET /ahorros/saldo/:usuarioId`
Obtiene el saldo actual de un usuario.

**Respuesta:**
```json
{
  "usuario_id": "user123",
  "saldo_actual": 5000,
  "total_depositos": 8000,
  "total_retiros": 3000,
  "cantidad_movimientos": 15
}
```

### `GET /ahorros/historial/:usuarioId`
Obtiene el historial completo de ahorros con saldo acumulado.

**Respuesta:**
```json
{
  "usuario_id": "user123",
  "saldo_actual": 5000,
  "total_depositos": 8000,
  "total_retiros": 3000,
  "movimientos": [
    {
      "id": 1,
      "fecha": "2024-01-01",
      "tipo": "deposito",
      "monto": 1000,
      "descripcion": "Ahorro mensual",
      "categoria": "Emergencia",
      "saldo_acumulado": 1000
    }
  ]
}
```

### `GET /ahorros/usuario/:usuarioId/tipo/:tipo`
Filtra ahorros por usuario y tipo (deposito/retiro).

**Parámetros:**
- `tipo`: `deposito` o `retiro`

### `GET /ahorros/usuario/:usuarioId/rango?fechaInicio=YYYY-MM-DD&fechaFin=YYYY-MM-DD`
Filtra ahorros por usuario y rango de fechas.

### `GET /ahorros/usuario/:usuarioId/categoria/:categoria`
Filtra ahorros por usuario y categoría.

### `POST /ahorros`
Crea un nuevo registro de ahorro.

**Body:**
```json
{
  "usuario_id": "user123",
  "tipo": "deposito",
  "monto": 1000,
  "fecha": "2024-01-01",
  "descripcion": "Ahorro mensual",
  "categoria": "Emergencia"
}
```

**Validación:** Si el tipo es `retiro`, se valida que el saldo no quede negativo.

### `PUT /ahorros/:id`
Actualiza un registro de ahorro.

### `DELETE /ahorros/:id`
Elimina un registro de ahorro.

---

## 📦 Módulo de Productos

### `GET /productos`
Obtiene todos los productos.

### `GET /productos/:id`
Obtiene un producto por ID.

### `GET /productos/categoria/:categoriaId`
Obtiene productos por categoría.

### `POST /productos`
Crea un nuevo producto.

### `PUT /productos/:id`
Actualiza un producto.

### `DELETE /productos/:id`
Elimina un producto.

---

## 🏷️ Módulo de Categorías

### `GET /categorias`
Obtiene todas las categorías.

### `GET /categorias/:id`
Obtiene una categoría por ID.

### `POST /categorias`
Crea una nueva categoría.

### `PUT /categorias/:id`
Actualiza una categoría.

### `DELETE /categorias/:id`
Elimina una categoría.

---

## 📝 Notas Importantes

### Separación de Dominios
- **Kardex (Movimientos):** Sistema multi-negocio para gestión comercial
- **Ahorros:** Sistema multiusuario para gestión personal, completamente independiente del Kardex

### Validaciones Clave
1. **Movimientos:** Si `producto_id` es null, `descripcion_producto` debe tener valor
2. **Ahorros:** No se permiten retiros que dejen el saldo negativo
3. **Saldos:** Se calculan por negocio en Kardex y por usuario en Ahorros

### Estructura de Respuestas
Todos los endpoints siguen el formato estándar de NestJS con manejo de errores HTTP:
- `200 OK`: Operación exitosa
- `201 Created`: Recurso creado
- `400 Bad Request`: Validación fallida
- `404 Not Found`: Recurso no encontrado
- `500 Internal Server Error`: Error del servidor

