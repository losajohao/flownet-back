# 🌊 Flownet Backend

Sistema de gestión comercial con kardex valorizado desarrollado con NestJS y Supabase.

## 📋 Descripción

Flownet es un sistema backend modular para la gestión de productos, categorías y movimientos monetarios. Implementa un kardex valorizado que registra entradas y salidas de productos con sus respectivos montos, permitiendo el cálculo de saldos globales y por producto.

## 🚀 Características

- ✅ Arquitectura modular con NestJS
- ✅ Conexión directa a PostgreSQL
- ✅ Validación de datos con class-validator
- ✅ Kardex valorizado con cálculo de saldos
- ✅ Gestión de productos y categorías
- ✅ Registro de movimientos (entradas/salidas)
- ✅ API REST con prefijo global `/api`
- ✅ CORS habilitado
- ✅ Manejo global de errores

## 📁 Estructura del Proyecto

```
src/
├── common/
│   ├── constants/       # Constantes globales
│   ├── dto/            # DTOs compartidos
│   ├── interfaces/     # Interfaces compartidas
│   ├── middleware/     # Middlewares globales
│   ├── filters/        # Filtros de excepciones
│   └── utils/          # Utilidades
├── database/
│   └── database.module.ts  # Configuración de Supabase
├── modules/
│   ├── productos/      # Módulo de productos
│   ├── categorias/     # Módulo de categorías
│   └── movimientos/    # Módulo de movimientos
├── app.module.ts
└── main.ts
```

## 🛠️ Instalación

1. **Clonar el repositorio**
```bash
git clone <repository-url>
cd flownet-back
```

2. **Instalar dependencias**
```bash
npm install
npm install pg class-validator class-transformer
npm install -D @types/pg
```

3. **Configurar variables de entorno**

Crea un archivo `.env` en la raíz del proyecto:
```env
# PostgreSQL Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=flownet_db
DB_USER=postgres
DB_PASSWORD=tu_contraseña

# Application Configuration
PORT=3000
NODE_ENV=development
```

4. **Configurar la base de datos**

Crea la base de datos en PostgreSQL y ejecuta los scripts SQL para crear las tablas (ver sección Scripts SQL más abajo).

## 🏃 Ejecutar el Proyecto

```bash
# Modo desarrollo
npm run start:dev

# Modo producción
npm run build
npm run start:prod
```

El servidor estará disponible en `http://localhost:3000/api`

## 📚 API Endpoints

### Categorías (`/api/categorias`)
- `GET /` - Listar todas
- `GET /:id` - Obtener por ID
- `POST /` - Crear nueva
- `PUT /:id` - Actualizar
- `DELETE /:id` - Eliminar

### Productos (`/api/productos`)
- `GET /` - Listar todos
- `GET /:id` - Obtener por ID
- `GET /categoria/:categoriaId` - Listar por categoría
- `POST /` - Crear nuevo
- `PUT /:id` - Actualizar
- `DELETE /:id` - Eliminar

### Movimientos (`/api/movimientos`)
- `GET /` - Listar todos
- `GET /:id` - Obtener por ID
- `GET /kardex` - Obtener kardex global
- `GET /kardex/producto/:productoId` - Kardex por producto
- `GET /tipo/:tipo` - Listar por tipo (entrada/salida)
- `GET /rango?fechaInicio=...&fechaFin=...` - Por rango de fechas
- `POST /` - Crear nuevo
- `PUT /:id` - Actualizar
- `DELETE /:id` - Eliminar

## 🧪 Tests

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## 🗄️ Scripts SQL

### Crear las tablas en PostgreSQL

```sql
-- Tabla de Categorías
CREATE TABLE categorias (
  id BIGSERIAL PRIMARY KEY,
  nombre VARCHAR(255) NOT NULL,
  descripcion TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_categorias_nombre ON categorias(nombre);

-- Tabla de Productos
CREATE TABLE productos (
  id BIGSERIAL PRIMARY KEY,
  nombre VARCHAR(255) NOT NULL,
  descripcion TEXT,
  categoria_id BIGINT REFERENCES categorias(id) ON DELETE SET NULL,
  precio_referencia DECIMAL(10, 2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_productos_categoria ON productos(categoria_id);
CREATE INDEX idx_productos_nombre ON productos(nombre);

-- Tabla de Movimientos
CREATE TABLE movimientos (
  id BIGSERIAL PRIMARY KEY,
  tipo VARCHAR(10) NOT NULL CHECK (tipo IN ('entrada', 'salida')),
  producto_id BIGINT REFERENCES productos(id) ON DELETE SET NULL,
  descripcion TEXT,
  monto_unitario DECIMAL(10, 2) NOT NULL,
  cantidad DECIMAL(10, 2) NOT NULL,
  total DECIMAL(10, 2) NOT NULL,
  fecha TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_movimientos_tipo ON movimientos(tipo);
CREATE INDEX idx_movimientos_fecha ON movimientos(fecha);
CREATE INDEX idx_movimientos_producto ON movimientos(producto_id);

-- Triggers para updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_categorias_updated_at BEFORE UPDATE ON categorias
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_productos_updated_at BEFORE UPDATE ON productos
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_movimientos_updated_at BEFORE UPDATE ON movimientos
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

## 📖 Documentación Adicional

- Ver `.cursor/rules.mdc` para las reglas de desarrollo del proyecto

## 🛡️ Tecnologías

- [NestJS](https://nestjs.com/) - Framework de Node.js
- [PostgreSQL](https://www.postgresql.org/) - Base de datos relacional
- [node-postgres (pg)](https://node-postgres.com/) - Cliente de PostgreSQL para Node.js
- [TypeScript](https://www.typescriptlang.org/) - Lenguaje de programación
- [class-validator](https://github.com/typestack/class-validator) - Validación de datos

## 📝 Licencia

Este proyecto es privado y no tiene licencia pública.
