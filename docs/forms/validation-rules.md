# Validaciones & Dirty Tracking (PATCH) 🛡️

Uno de los mayores dolores de cabeza en el desarrollo de APIs RESTful en Laravel es la discordancia entre la creación (**POST**) y la actualización parcial (**PATCH**).

Cuando el frontend moderno implementa **Dirty Tracking** (enviando a la API únicamente los campos que el usuario modificó), las reglas tradicionales de validación de Laravel fallan estrepitosamente con errores `422 Unprocessable Entity` porque los campos obligatorios ausentes en el payload no pasan la regla `required`.

**SchemaBuilder** resuelve este dilema con su motor de compilación inteligente de reglas.

---

## ⚡ Métodos Fluidos de Validación

Cada campo en `FormSchema` expone una API fluida para declarar reglas nativas de Laravel sin strings propensos a errores tipográficos:

```php
Field::text('username', 'Usuario')
    ->required()                     // 'required'
    ->nullable()                     // 'nullable'
    ->string()                       // 'string'
    ->integer()                      // 'integer'
    ->numeric()                      // 'numeric'
    ->boolean()                      // 'boolean'
    ->asEmail()                      // 'email'
    ->min(3)                         // 'min:3'
    ->max(255)                       // 'max:255'
    ->confirmed()                    // 'confirmed'
    ->regex('/^[A-Za-z0-9_]+$/')     // 'regex:/^[A-Za-z0-9_]+$/'
    ->unique('users', 'username');   // 'unique:users,username'
```

### Reglas Personalizadas o Arbitrarias con `rules()`

Para reglas avanzadas de Laravel o clases `Rule` personalizadas, utiliza `->rules()`:

```php
use App\Rules\ValidTaxId;
use Illuminate\Validation\Rule;

Field::text('tax_id', 'RUC / CIF')
    ->rules(['string', new ValidTaxId()]);

// También puedes usar la sintaxis pipe tradicional:
Field::text('code', 'Código')
    ->rules('alpha_num|size:8');
```

---

## 🧩 El Dilema de las Mutaciones PATCH (Dirty Tracking)

Imagina un formulario de usuario con 10 campos obligatorios (`name`, `email`, `role_id`, `department_id`, etc.).

### ❌ El Problema en Laravel Tradicional
Un usuario abre la vista de edición y cambia únicamente su número telefónico:

```json
// PAYLOAD ENVIADO POR EL FRONTEND (PATCH /api/v1/users/5)
{
  "phone": "+51 987654321"
}
```

Si tu validador ejecuta las reglas estándar:

```php
$rules = [
    'first_name' => ['required', 'string'],
    'email'      => ['required', 'email'],
    'phone'      => ['required', 'string'],
];
```

Laravel rechazará la petición con un error `422`:
```json
{
  "message": "The first_name field is required. (and 1 more error)",
  "errors": {
    "first_name": ["The first_name field is required."],
    "email": ["The email field is required."]
  }
}
```

El desarrollador normalmente recurre a duplicar código creando dos FormRequests: `CreateUserRequest` y `UpdateUserRequest`, llenando este último de condicionales frágiles.

---

## ✨ La Solución Inteligente: `toValidationRules(isUpdate: true)`

En **SchemaBuilder**, la misma definición de formulario sirve tanto para la creación como para la edición:

```php
// 1. Para Creación (POST): Reglas estrictas completas
$createRules = $formSchema->toValidationRules(isUpdate: false);
/*
Resultado:
[
    'first_name' => ['required', 'string', 'min:2'],
    'email'      => ['required', 'email'],
    'phone'      => ['required', 'string'],
]
*/

// 2. Para Actualización (PATCH con Dirty Tracking):
$updateRules = $formSchema->toValidationRules(isUpdate: true);
/*
Resultado Inteligente:
[
    'first_name' => ['sometimes', 'required', 'string', 'min:2'],
    'email'      => ['sometimes', 'required', 'email'],
    'phone'      => ['sometimes', 'required', 'string'],
]
*/
```

### ¿Cómo funciona bajo el capó?
Cuando `isUpdate` es `true`:
1. SchemaBuilder analiza cada campo.
2. Si el campo contiene la regla `'required'`, la transforma en `['sometimes', 'required']`.
3. **Efecto en Laravel**: Si el campo **no viene** en el request, la validación se omite sin error. Pero si el campo **sí viene** en el request (porque el usuario lo modificó), ¡la regla `required` y todas sus validaciones asociadas se aplican con la máxima rigurosidad!

---

## 🎯 Ejemplo Completo en un Controlador

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
     * Creación de usuario (POST).
     */
    public function store(Request $request): JsonResponse
    {
        $schema = UserSchema::form();
        
        // Validación estricta (todos los required son obligatorios)
        $validated = $request->validate($schema->toValidationRules(isUpdate: false));

        $user = User::create($validated);

        return response()->json($user, 201);
    }

    /**
     * Actualización parcial con Dirty Tracking (PATCH).
     */
    public function update(Request $request, User $user): JsonResponse
    {
        $schema = UserSchema::form();

        // Validación inteligente: los required ausentes se ignoran
        $validated = $request->validate($schema->toValidationRules(isUpdate: true));

        $user->update($validated);

        return response()->json($user);
    }
}
```

> [!TIP]
> Si tu controlador usa el trait [`HasDynamicCrudSchema`](/laravel/has-dynamic-crud-schema), puedes resumir la llamada a una sola línea:
> ```php
> $validated = $this->validateWithSchema($request, isUpdate: true);
> ```
