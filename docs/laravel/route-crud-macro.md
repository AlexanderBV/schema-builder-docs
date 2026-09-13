# Macro Route::crud() 🛣️

En una arquitectura Fullstack moderna orientada a componentes dinámicos, el estándar `Route::resource()` de Laravel se queda corto: no contempla el endpoint `/schema`, no incluye las acciones de recuperación de papelera (*Soft Deletes*) y suele causar problemas al subir archivos con `PUT` vía `FormData`.

**SchemaBuilder** registra automáticamente la macro **`Route::crud()`** en el Router de Laravel para resolver este problema en una sola línea de código.

---

## ⚡ Registro en Una Sola Línea

En tu archivo `routes/api.php`:

```php
use App\Http\Controllers\Api\UserController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->middleware('auth:sanctum')->group(function () {
    // Registra automáticamente las 8 rutas del ecosistema CRUD
    Route::crud('users', UserController::class);
});
```

---

## 📋 Las 8 Rutas Generadas Automáticamente

La macro expande de inmediato las siguientes rutas optimizadas con sus nombres canónicos:

| Verbo HTTP | URI | Acción del Controlador | Nombre de la Ruta | Propósito |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/v1/users/schema` | `UserController@schema` | `v1.users.schema` | Entrega la metadata unificada al frontend. |
| `GET` | `/v1/users` | `UserController@index` | `v1.users.index` | Listado paginado con filtros y búsqueda. |
| `POST` | `/v1/users` | `UserController@store` | `v1.users.store` | Creación de un nuevo recurso. |
| `GET` | `/v1/users/{id}` | `UserController@show` | `v1.users.show` | Consulta o inspección de un registro. |
| `PATCH` \| `PUT` \| `POST` | `/v1/users/{id}` | `UserController@update` | `v1.users.update` | Actualización con soporte de archivos. |
| `DELETE` | `/v1/users/{id}` | `UserController@destroy` | `v1.users.destroy` | Eliminación suave (*Soft Delete*). |
| `POST` | `/v1/users/{id}/restore` | `UserController@restore` | `v1.users.restore` | Restauración desde la papelera. |
| `DELETE` | `/v1/users/{id}/force` | `UserController@forceDelete` | `v1.users.forceDelete` | Purga o eliminación definitiva física. |

---

## 🎯 Ventajas Clave sobre `Route::resource()`

### 1. Soporte Nativo para Formularios con Archivos (`multipart/form-data`)
PHP nativo no procesa correctamente cargas de archivos multipart enviadas mediante verbos `PUT` directos. Por esta razón, la ruta de actualización de `Route::crud()` acepta `match(['put', 'patch', 'post'])`, permitiendo que clientes frontend envíen un `POST` con `_method=PUT` o directamente a la misma URL sin bloqueos del servidor.

### 2. Ciclo de Vida Completo de Papelera (Soft Deletes)
Al activar la pestaña de papelera en tu `TableSchema` con `softDeletes()`, el frontend envía solicitudes a `{id}/restore` o `{id}/force`. Con `Route::crud()`, estas rutas ya están conectadas y disponibles sin tener que agregarlas manualmente a cada entidad.

### 3. Nombres de Rutas Consistentes
Los nombres de las rutas se normalizan automáticamente reemplazando barras diagonales por puntos (ej. `admin/products` genera `admin.products.index`, `admin.products.schema`, etc.).
