# Trait HasDynamicCrudSchema ⚡

El trait **`HasDynamicCrudSchema`** es el conector que une tus esquemas declarativos de backend con la infraestructura de controladores de Laravel y los componentes de frontend como `<CrudComponent />`.

Al incorporarlo en tus controladores, obtienes inmediatamente:
1. El endpoint automático `GET /api/v1/{resource}/schema`.
2. El helper de validación estricta y actualización parcial `validateWithSchema()`.
3. Fallback inteligente de vistas de detalle (`detailSchema` o `formSchema`).

---

## 🚀 Cómo Implementarlo

Solo necesitas usar el trait en tu controlador e implementar los dos métodos abstractos requeridos:

```php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Schemas\UserSchema;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Warrior\SchemaBuilder\Concerns\HasDynamicCrudSchema;
use Warrior\SchemaBuilder\Form\FormSchema;
use Warrior\SchemaBuilder\Table\TableSchema;

class UserController extends Controller
{
    use HasDynamicCrudSchema;

    /**
     * Define el esquema de la tabla y listado.
     */
    protected function tableSchema(): TableSchema
    {
        return UserSchema::table();
    }

    /**
     * Define el esquema del formulario para crear y editar.
     */
    protected function formSchema(): FormSchema
    {
        return UserSchema::form();
    }
}
```

---

## 📡 El Endpoint Automático `/schema`

Al usar el trait, el método `schema()` queda expuesto automáticamente:

```
GET /api/v1/users/schema
```

### Respuesta JSON Generada

```json
{
  "table": {
    "id": "users-table",
    "title": "Directorio de Usuarios",
    "columns": [ ... ],
    "filters": [ ... ],
    "tabs": [ ... ],
    "softDeletes": { ... }
  },
  "form": {
    "id": "user-form",
    "title": "Formulario de Usuario",
    "endpoint": "/api/v1/users",
    "inputs": [ ... ]
  },
  "detail": {
    "id": "user-form",
    "inputs": [ ... ]
  }
}
```

Cuando el frontend monta el componente `<CrudComponent resource="/api/v1/users" />`, este endpoint es lo primero que se consulta. En una sola petición HTTP ultra-ligera (generalmente menos de 5 KB), el cliente tiene todo lo necesario para renderizar:
- La tabla de datos completa con ordenamientos y filtros.
- El diálogo de creación.
- El diálogo de edición con reglas de validación.
- El panel lateral de inspección de detalle.

---

## 🛡️ Helper de Validación: `validateWithSchema()`

En lugar de crear un archivo `StoreUserRequest` y otro `UpdateUserRequest`, puedes validar el payload HTTP entrante directamente con las reglas compiladas del esquema:

```php
/**
 * 1. Creación de Registro (POST)
 */
public function store(Request $request): JsonResponse
{
    // isUpdate = false: Aplica validación estricta completa
    $validated = $this->validateWithSchema($request, isUpdate: false);

    $user = User::create($validated);

    return response()->json($user, 201);
}

/**
 * 2. Edición con Dirty Tracking (PATCH / PUT) e inyección de reglas custom
 */
public function update(Request $request, User $user): JsonResponse
{
    // isUpdate = true: Convierte 'required' en 'sometimes|required'
    // additionalRules: Permite inyectar o sobreescribir reglas complejas (ej. ignore del ID)
    $validated = $this->validateWithSchema(
        request: $request,
        isUpdate: true,
        additionalRules: [
            'email' => ['sometimes', Rule::unique('users', 'email')->ignore($user->id)],
            'avatar' => ['nullable', 'image', 'max:2048'],
        ]
    );

    $user->update($validated);

    return response()->json($user);
}
```

---

## 👁️ Soporte Opcional para `detailSchema()`

Si deseas proporcionar una vista de detalle personalizada distinta al formulario de edición, simplemente sobreescribe el método:

```php
use Warrior\SchemaBuilder\Detail\DetailSchema;

protected function detailSchema(): ?DetailSchema
{
    return UserSchema::detail();
}
```

Si no defines este método o retorna `null`, el trait entregará automáticamente el `formSchema()` como respaldo, garantizando que el frontend nunca falle.
