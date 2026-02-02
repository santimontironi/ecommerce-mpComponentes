# Configuración de MercadoPago

## ✅ Cambios realizados

1. **Archivo de configuración**: `config/mercadopagoConfig.js` (anteriormente stripeConfig.js)
2. **Controllers actualizados**:
   - `purchase-controller.js` - Compras completas
   - `reservation-controller.js` - Reservas con seña del 30%
3. **Rutas actualizadas**:
   - `purchase-routes.js` - Webhooks de MercadoPago
   - `reservation-routes.js` - Webhooks de reservas

## 🔧 Pasos para completar la configuración

### 1. Obtener credenciales de MercadoPago

1. Ve a [MercadoPago Developers](https://www.mercadopago.com.ar/developers)
2. Inicia sesión o crea una cuenta
3. Ve a **"Tus integraciones"** > **"Credenciales"**
4. Copia tu **Access Token** (usa el de prueba para desarrollo)

### 2. Configurar el archivo .env

Actualiza el archivo `.env` con tu Access Token real:

```env
MERCADOPAGO_ACCESS_TOKEN=APP_USR-tu-access-token-aqui
```

**⚠️ IMPORTANTE**: Reemplaza `YOUR_ACCESS_TOKEN_HERE` con tu token real.

### 3. Agregar BACKEND_URL al .env (para webhooks)

```env
BACKEND_URL=http://localhost:3000
```

Para producción, usa tu URL pública (ej: https://tu-dominio.com)

### 4. Configurar webhooks en MercadoPago

1. Ve a [MercadoPago Developers](https://www.mercadopago.com.ar/developers)
2. Selecciona tu aplicación
3. Ve a **"Webhooks"**
4. Agrega estas URLs:
   - **Compras**: `https://tu-dominio.com/webhook/mercadopago`
   - **Reservas**: `https://tu-dominio.com/reservation/webhook`

**Para desarrollo local**: Usa [ngrok](https://ngrok.com/) para exponer tu servidor local:
```bash
ngrok http 3000
```

Luego usa la URL de ngrok en los webhooks.

## 📝 Diferencias clave con Stripe

### MercadoPago:
- ✅ Soporte completo en Argentina
- ✅ Múltiples métodos de pago (Rapipago, Pago Fácil, etc.)
- ✅ Webhooks vía GET y POST
- ✅ No requiere validación de firma (más simple)
- ✅ Moneda en pesos argentinos sin conversión

### Stripe:
- ❌ Sin soporte en Argentina
- ❌ Solo tarjetas internacionales
- ✅ Webhooks más seguros con firma
- ✅ Requiere precio en centavos

## 🧪 Probar en desarrollo

1. Inicia el servidor:
```bash
npm run dev
```

2. Usa las tarjetas de prueba de MercadoPago:
   - **Aprobada**: 5031 7557 3453 0604
   - **Rechazada**: 5031 4332 1540 6351
   - **Pendiente**: 5031 4332 1540 6351

3. CVV: Cualquier 3 dígitos
4. Fecha de vencimiento: Cualquier fecha futura

## 🚀 URLs finales

- **Compras**: `POST /purchase/checkout`
- **Reservas**: `POST /reservation/reserve`
- **Webhook compras**: `POST/GET /webhook/mercadopago`
- **Webhook reservas**: `POST/GET /reservation/webhook`

## ✅ Integración Frontend completada

El frontend ya está configurado para usar MercadoPago:
- `PurchaseContext.jsx` - Redirige a la página de pago de MercadoPago
- `ReservationContext.jsx` - Maneja reservas con seña del 30%
- `ReservProduct.jsx` - Página de reserva actualizada

## 📧 Notificaciones por email

Los emails de confirmación siguen funcionando igual que antes.
