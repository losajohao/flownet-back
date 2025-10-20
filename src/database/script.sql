-- =====================================
-- TABLA: negocios
-- =====================================
CREATE TABLE negocios (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL
);

-- =====================================
-- TABLA: categorias (agrupamiento por negocio)
-- =====================================
CREATE TABLE categorias (
    id SERIAL PRIMARY KEY,
    negocio_id INT REFERENCES negocios(id),
    nombre VARCHAR(50) NOT NULL
);

-- =====================================
-- TABLA: productos (deriva de categorias)
-- =====================================
CREATE TABLE productos (
    id SERIAL PRIMARY KEY,
    categoria_id INT REFERENCES categorias(id),
    nombre VARCHAR(100) NOT NULL
);

-- =====================================
-- TABLA: usuarios (multiusuario + auth básica)
-- =====================================
CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    pwd VARCHAR(255) NOT NULL,   -- contraseña encriptada
    negocio_id INT REFERENCES negocios(id)
);

-- =====================================
-- TABLA: movimientos (Kardex por montos)
-- =====================================
CREATE TABLE movimientos (
    id SERIAL PRIMARY KEY,
    negocio_id INT REFERENCES negocios(id),
    producto_id INT REFERENCES productos(id), -- opcional
    descripcion VARCHAR(100), -- descripción libre si no hay producto_id
    tipo_movimiento VARCHAR(10) NOT NULL, -- 'entrada' o 'salida'
    cantidad NUMERIC(10,2),
    precio_unitario NUMERIC(10,2),
    monto NUMERIC(10,2),
    fecha_hora TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================
-- TABLA: ahorros (por usuario)
-- =====================================
CREATE TABLE ahorros (
    id SERIAL PRIMARY KEY,
    usuario_id INT REFERENCES usuarios(id),
    tipo_movimiento VARCHAR(10) NOT NULL, -- 'deposito' o 'retiro'
    monto NUMERIC(10,2),
    fecha_hora TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
