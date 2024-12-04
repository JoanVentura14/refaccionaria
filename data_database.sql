
-- Tabla de roles
CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE -- Común, Mayoreo, Administrador
);

-- Tabla de usuarios
CREATE TABLE users (
    id SERIAL PRIMARY KEY, -- Identificador interno único
    auth_id UUID NOT NULL UNIQUE, -- Relación con el ID del usuario en Supabase Auth
    name VARCHAR(255) NOT NULL, -- Nombre del usuario
    email VARCHAR(255) UNIQUE, -- Correo electrónico (opcional, ya está en Supabase Auth)
    role_id INT NOT NULL REFERENCES roles(id), -- Relación con roles
    created_at TIMESTAMP DEFAULT NOW(), -- Fecha de creación
    updated_at TIMESTAMP DEFAULT NOW() ON UPDATE CURRENT_TIMESTAMP, -- Fecha de última modificación
    active BOOLEAN DEFAULT TRUE
);


-- Tabla de productos
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL, -- Nombre de la pieza (ej. "Filtro de aire")
    description TEXT, -- Descripción detallada
    imagen VARCHAR(255),
    price DECIMAL(10, 2) NOT NULL, -- Precio de la pieza
    stock INT DEFAULT 0, -- Cantidad disponible
    category_id INT NOT NULL REFERENCES categories(id) ON DELETE CASCADE, -- Categoría de la pieza
    created_at TIMESTAMP DEFAULT NOW(), -- Fecha de creación
    updated_at TIMESTAMP DEFAULT NOW() ON UPDATE CURRENT_TIMESTAMP -- Fecha de última modificación
    active BOOLEAN DEFAULT TRUE
);



-- Tabla de órdenes
CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id), -- Usuario que realizó la orden
    total DECIMAL(10, 2) NOT NULL, -- Total de la orden
    created_at TIMESTAMP DEFAULT NOW(), -- Fecha de creación
    status_order TEXT NOT NULL CHECK (status IN ('carrito', 'pagada', 'cancelada')), -- Estado de la orden
    paid_at TIMESTAMP -- Fecha de pago, NULL si no se ha pagado
);

-- Detalles de los productos en cada orden
CREATE TABLE order_items (
    id SERIAL PRIMARY KEY,
    order_id INT NOT NULL REFERENCES orders(id),
    product_id INT NOT NULL REFERENCES products(id),
    quantity INT NOT NULL,
    price DECIMAL(10, 2) NOT NULL -- Precio final del producto (puede variar según el rol)
);

-- Tabla de puntos para usuarios comunes
CREATE TABLE points (
    id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id),
    points INT NOT NULL DEFAULT 0,
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Tabla de descuentos
CREATE TABLE discounts (
    id SERIAL PRIMARY KEY,
    points_required INT NOT NULL,
    discount_percentage_comun DECIMAL(5, 2) NOT NULL,
    discount_percentage_mayorist DECIMAL(5, 2) NOT NULL
);

--Tabla categorias
CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE, -- Nombre de la categoría
    description TEXT -- Descripción opcional de la categoría
);

--Tabla vehicles
CREATE TABLE vehicles (
    id SERIAL PRIMARY KEY,
    brand VARCHAR(100) NOT NULL, -- Marca del vehículo
    model VARCHAR(100) NOT NULL, -- Modelo del vehículo
    year INT NOT NULL, -- Año del vehículo
    UNIQUE (brand, model, year) -- Evita duplicados
);

--Tabla product_vehicle_compatibilit
CREATE TABLE product_vehicle_compatibility (
    id SERIAL PRIMARY KEY,
    product_id INT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    vehicle_id INT NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
    UNIQUE (product_id, vehicle_id) -- Evita duplicados
);

-- Crear la tabla tipo_envio
CREATE TABLE tipo_envio (
    id SERIAL PRIMARY KEY,
    type VARCHAR(6)  NOT NULL, -- Texto para indicar el tipo de envío (Full, Común, etc.)
    price DECIMAL(3, 2) NOT NULL -- Precio del envío
);

-- Tabla de subcategorías
CREATE TABLE subcategories (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL, -- Nombre de la subcategoría (ej: dados, matracas)
    category_id INT NOT NULL REFERENCES categories(id)
);


INSERT INTO product_vehicle_compatibility (product_id, vehicle_id) VALUES
(1, 1), -- Compatible con Toyota Corolla 2020
(1, 2), -- Compatible con Toyota Corolla 2021
(1, 3); -- Compatible con Ford Mustang 2020


Opciones para integración con Supabase:
Webhooks o triggers:

Puedes configurar triggers en la tabla auth.users para insertar automáticamente un registro en users cada vez que un nuevo usuario se registre.

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO users (auth_id, email, role_id)
    VALUES (NEW.id, NEW.email, 1); -- Rol predeterminado (común)
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION handle_new_user();

