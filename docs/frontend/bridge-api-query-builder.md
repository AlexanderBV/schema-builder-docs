# La Receta del Bridge (ApiQueryBuilder) 🌉

Una de las sinergias más potentes del ecosistema es combinar **`warrior/schema-builder`** con **`warrior/api-query-builder`**.

Sin embargo, para respetar los principios de **Bajo Acoplamiento (Low Coupling)** y **Responsabilidad Única (SRP)**, ambos paquetes son **100% independientes**:
- `schema-builder` no requiere ni instala `api-query-builder`.
- `api-query-builder` no requiere ni instala `schema-builder`.

La conexión entre ambos se logra mediante una **receta de usuario (Userland Recipe)** sumamente elegante en tu `AppServiceProvider`.

---

## 🏛️ Filosofía de Desacoplamiento (Zero-Coupling)

::: tip 💡 ¿Por qué no incluir el Bridge directamente dentro del paquete?
1. **Ligereza**: Si un desarrollador solo necesita construir esquemas para un frontend en React con filtros manuales, no debe ser forzado a instalar librerías de consulta de base de datos.
2. **Libertad de Elección**: Puedes usar `schema-builder` con `warrior/api-query-builder`, `spatie/laravel-query-builder`, o tus propios scopes de Eloquent.
3. **Mantenimiento**: Cada paquete evoluciona a su propio ritmo sin generar dependencias cruzadas en Composer.
:::

---

## 📋 La Receta del Bridge en `AppServiceProvider`

Para conectar ambos paquetes en tu proyecto Laravel, define la macro `applySchema` en tu `AppServiceProvider`:

```php
// app/Providers/AppServiceProvider.php
namespace App\Providers;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\ServiceProvider;
use Warrior\ApiQueryBuilder\ApiQueryBuilder;
use Warrior\SchemaBuilder\Table\TableSchema;

class AppServiceProvider extends ServiceProvider
{
    public function boot(): void
    {
        /**
         * Macro fluida para aplicar las restricciones de un TableSchema
         * a cualquier consulta Eloquent mediante ApiQueryBuilder.
         */
        Builder::macro('applySchema', function (TableSchema $schema) {
            /** @var Builder $this */
            return ApiQueryBuilder::for($this)
                ->allowSorts($schema->getAllowedSorts())
                ->allowFilters($schema->getAllowedFilters())
                ->allowSearch($schema->getAllowedSearch())
                ->build();
        });
    }
}
```

---

## 🔍 ¿Cómo Funciona la Introspección Pura?

Gracias a los métodos de introspección desacoplada de `TableSchema`:

1. **`$schema->getAllowedSorts()`**: Recorre todas las columnas de la tabla y recopila únicamente las que tienen `->sortable()`.
2. **`$schema->getAllowedFilters()`**: Recorre los filtros del drawer lateral declarados en `->filters()` y extrae sus nombres de campo.
3. **`$schema->getAllowedSearch()`**: Recorre las columnas y extrae aquellas marcadas explícitamente con `->searchable()`.

---

## 🚀 El Resultado en tus Controladores: La Magia de 1 Sola Línea

Tu método `index()` en cualquier controlador de Laravel se convierte en una obra de arte concisa y segura:

```php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Schemas\UserSchema;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class UserController extends Controller
{
    /**
     * Listado con filtrado, ordenamiento dinámico y búsqueda global.
     */
    public function index(Request $request): JsonResponse
    {
        $users = User::query()
            ->applySchema(UserSchema::table())
            ->paginate($request->integer('per_page', 15));

        return response()->json($users);
    }
}
```

---

## 🛡️ Beneficios de Seguridad y Cero Duplicidad

| Característica | Enfoque Tradicional | Con SchemaBuilder + ApiQueryBuilder |
| :--- | :--- | :--- |
| **Whitelisting de Ordenamiento** | Escribir `$allowedSorts = ['name', 'email']` en el controlador. | **Automático**: Se deduce de las columnas con `->sortable()`. |
| **Protección contra Inyección SQL** | Revisar manualmente que los parámetros `?sort=` y `?filter=` sean seguros. | **Total**: `ApiQueryBuilder` rechaza cualquier columna no permitida con HTTP 422. |
| **Mantenimiento** | Agregar una columna implica modificar la migración, el modelo, el controlador y el frontend. | **1 Solo Cambio**: Marcas la columna como `->sortable()` en `UserSchema` y el backend y el frontend se sincronizan al instante. |
| **Búsqueda Global** | Escribir bloques complejos de `where(orWhere(...))` manuales. | **Automático**: Busca en todas las columnas marcadas con `->searchable()`. |
