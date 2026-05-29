# 🖥️ Inventory Frontend — Angular 18+

Aplicación web SPA para el Sistema de Gestión de Inventario.

---

## 🛠️ Stack

| Capa | Tecnología |
|---|---|
| Framework | Angular 18+ |
| Lenguaje | TypeScript |
| UI Components | Angular Material (Azure/Blue) |
| Estilos | CSS + Angular Material |
| Formularios | Reactive Forms |
| HTTP | HttpClient con interceptores |
| Notificaciones | MatSnackBar |
| Loading | ngx-spinner |
| Autenticación | JWT con guards e interceptores |

---

## ⚙️ Requisitos previos

- Node.js 18.19+
- Angular CLI 18+
- Backend corriendo en `http://localhost:8080`

---

## 🚀 Levantar el proyecto en desarrollo

```bash
cd inventory-frontend
ng serve
```

La aplicación estará disponible en: `http://localhost:4200`

> El archivo `proxy.conf.json` redirige automáticamente todas las llamadas `/api/*` al backend en `localhost:8080`, evitando problemas de CORS en desarrollo.

---

## 👤 Usuarios de prueba

| Usuario | Contraseña | Rol |
|---|---|---|
| admin | admin123 | ADMIN |
| empleado1 | emp123 | EMPLOYEE |

---

## 📐 Arquitectura del proyecto

```
src/app/
├── core/
│   ├── models/                   ← Interfaces y enums TypeScript
│   │   ├── auth.model.ts
│   │   ├── category.model.ts
│   │   ├── product.model.ts
│   │   ├── supplier.model.ts
│   │   ├── stock-movement.model.ts
│   │   └── index.ts
│   ├── services/                 ← Servicios HTTP con inject()
│   │   ├── auth.service.ts
│   │   ├── category.service.ts
│   │   ├── product.service.ts
│   │   ├── supplier.service.ts
│   │   ├── stock-movement.service.ts
│   │   ├── notification.service.ts
│   │   ├── loading.service.ts
│   │   └── index.ts
│   ├── interceptors/             ← Interceptores HTTP
│   │   ├── auth.interceptor.ts   ← Agrega Bearer token
│   │   ├── loading.interceptor.ts← Muestra/oculta spinner
│   │   └── error.interceptor.ts  ← Maneja errores 401/403/500
│   └── guards/
│       └── auth.guard.ts         ← Protege rutas autenticadas
├── shared/
│   └── components/
│       └── loading-spinner/      ← Spinner global con ngx-spinner
├── features/
│   ├── auth/
│   │   └── login/                ← Página de login
│   ├── dashboard/                ← Métricas y resumen
│   ├── products/
│   │   ├── product-list/         ← Tabla de productos
│   │   └── product-dialog/       ← Formulario crear/editar
│   ├── categories/
│   │   ├── category-list/        ← Tabla de categorías
│   │   └── category-dialog/      ← Formulario crear/editar
│   ├── suppliers/
│   │   ├── supplier-list/        ← Tabla de proveedores
│   │   └── supplier-dialog/      ← Formulario crear/editar
│   ├── stock-movements/
│   │   ├── stock-movement-list/  ← Historial de movimientos
│   │   └── stock-movement-dialog/← Formulario registrar movimiento
│   └── not-found/                ← Página 404
└── layout/                       ← Sidebar + navbar principal
```

---

## 🔐 Autenticación

El sistema usa JWT para autenticación:

1. El usuario inicia sesión en `/login`
2. El backend devuelve un token JWT
3. El `authInterceptor` agrega el token en cada petición HTTP
4. El `authGuard` protege todas las rutas excepto `/login`
5. El `errorInterceptor` maneja el 401 cerrando la sesión automáticamente

---

## 🌐 Rutas

| Ruta | Componente | Protegida |
|---|---|---|
| /login | LoginComponent | No |
| /dashboard | DashboardComponent | Sí |
| /products | ProductListComponent | Sí |
| /categories | CategoryListComponent | Sí |
| /suppliers | SupplierListComponent | Sí |
| /stock-movements | StockMovementListComponent | Sí |
| /** | NotFoundComponent | No |

---

## ✅ Buenas prácticas aplicadas

- `ChangeDetectionStrategy.OnPush` en todos los componentes
- `provideExperimentalZonelessChangeDetection()` — sin Zone.js
- `inject()` en lugar de constructor para inyección de dependencias
- Signals y `computed()` para reactividad
- `Record<K,V>` como única fuente de verdad para labels
- Enums en lugar de union types
- Lazy loading en todas las rutas
- Componentes standalone
- Reactive Forms con validaciones
- Interceptores HTTP para auth, loading y errores
- Separación en 3 archivos por componente (.ts, .html, .css)

---

## 🐳 Docker

```bash
# Construir imagen
docker build -t inventory-backend-frontend:latest .

# Correr con docker compose (desde inventory-backend)
docker compose up -d
```

---

## ☸️ Kubernetes

```bash
# Reconstruir y desplegar
docker build -t inventory-backend-frontend:latest .
kubectl scale deployment frontend -n inventory --replicas=0
minikube image rm docker.io/library/inventory-backend-frontend:latest
minikube image load inventory-backend-frontend:latest
kubectl scale deployment frontend -n inventory --replicas=1
kubectl rollout restart deployment/frontend -n inventory

# Obtener URL
minikube service frontend -n inventory --url
```

---

## 🗺️ Próximos pasos

- ⏳ Migración a Tailwind CSS
- ⏳ Mejoras de UI y diseño
