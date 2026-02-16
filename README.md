## MpComponentes
E-commerce para venta de componentes de hardware. Proyecto fullstack con stack MERN + Context API, TailwindCSS y pasarela de pago MercadoPago.

## URL
- Sitio: https://www.mpcomponentes.com

## Stack Tecnologico
- Frontend: React (Vite), Context API, React Router, React Hook Form, TailwindCSS
- Backend: Node.js, Express, JWT, bcrypt, Multer
- Base de datos: MongoDB + Mongoose
- Integraciones: MercadoPago, Cloudinary, Nodemailer

## Funcionalidades
- Catalogo de productos con busqueda, filtros y detalle
- Carrito persistente y flujo de compra
- Login de administrador y panel de gestion
- Gestion de categorias, subcategorias y productos
- Importacion de productos por archivo
- Reservas con seña y notificaciones por webhook
- Contacto por formulario con envio de email

## Arquitectura
- frontend/: SPA en React con estado global via Context API
- backend/: API REST con Express y controladores por recurso
- bd/: conexion MongoDB
- config/: integraciones (Cloudinary, MercadoPago, Nodemailer)
- routes/: endpoints organizados por dominio

## Instalacion y ejecucion local
1) Backend
- Ir a la carpeta backend
- Instalar dependencias: npm install
- Ejecutar en desarrollo: npm run dev

2) Frontend
- Ir a la carpeta frontend
- Instalar dependencias: npm install
- Ejecutar en desarrollo: npm run dev

## Variables de entorno (backend)
Crear un archivo .env en backend/ con:
- PORT
- FRONTEND_URL
- MONGO_URL
- JWT_SECRET
- NODE_ENV
- MERCADOPAGO_ACCESS_TOKEN
- CLOUDINARY_CLOUD_NAME
- CLOUDINARY_API_KEY
- CLOUDINARY_API_SECRET
- EMAIL_USER
- EMAIL_PASSWORD

## Scripts
- Backend
	- dev: levanta el servidor con nodemon
	- test: ejecuta Jest
- Frontend
	- dev: servidor Vite
	- build: build de produccion
	- lint: ESLint
	- preview: preview de build

## Endpoints principales
Base URL: / (sin prefijo). Webhooks con prefijo /webhook.

### Admin
- POST /login
- POST /logout
- GET /dashboard (requiere cookie token)

### Categorias
- GET /getAllCategories
- GET /getAllCategoriesWithoutParents
- GET /getSubCategories/:id
- GET /getCategory/:id
- POST /addCategory (requiere cookie token, multipart/form-data con image)
- PATCH /editCategory/:id (requiere cookie token, multipart/form-data con image)
- DELETE /deleteCategory/:id (requiere cookie token)

### Productos
- GET /getProducts/:categoryId
- GET /getProductsAdmin/:categoryId (requiere cookie token)
- GET /getAllProducts
- GET /getProduct/:id
- GET /getProductAdmin/:id (requiere cookie token)
- GET /getAllProductsWithoutStock (requiere cookie token)
- POST /addProduct (requiere cookie token, multipart/form-data con image)
- POST /importProducts (requiere cookie token, multipart/form-data con file)
- POST /orderProduct
- PATCH /editProduct/:id (requiere cookie token, multipart/form-data con image)
- DELETE /deleteProduct/:id (requiere cookie token)

### Compras (MercadoPago)
- POST /purchase/create-preference

### Reservas
- POST /reservation/reserve

### Webhooks MercadoPago
- POST /webhook/mercadopago
- GET /webhook/mercadopago
- POST /webhook/mercadopago/reservation
- GET /webhook/mercadopago/reservation

### Contacto
- POST /sendContactMessage

## Notas
- El backend usa cookies httpOnly para el token de admin.
- CORS permite el frontend definido en FRONTEND_URL.
