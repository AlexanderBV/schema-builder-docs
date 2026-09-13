# Anatomía de FormSchema 📝

El motor de formularios de **SchemaBuilder** resuelve de raíz el problema de duplicidad más costoso del desarrollo web: tener que definir las reglas de validación en el backend (FormRequest) y volver a escribir manualmente los inputs, placeholders, tipos y validaciones en el frontend (Vue, React o Blade).

Con **`FormSchema`**, defines la estructura, comportamiento visual y reglas de validación en **un único punto canónico**.

---

## 💡 El Problema Tradicional vs. FormSchema

::: danger 😫 El Enfoque Tradicional (Fragilidad & Desincronización)
1. Creas un `UpdateUserRequest` en Laravel con 15 reglas de validación.
2. Abres un componente de Vue/React y programas a mano 15 campos `<VTextField>`, `<VSelect>`, con sus labels y validaciones en VeeValidate.
3. Si cambias un campo de `nullable` a `required`, debes acordarte de actualizar el backend y el frontend.
4. En endpoints `PATCH`, si el usuario sólo actualiza el teléfono, las reglas `required` de Laravel lanzan un error `422 Unprocessable Entity` porque faltan el resto de campos.
:::

::: tip 🚀 La Solución de SchemaBuilder (Fuente Única de Verdad)
- **Un solo esquema**: Declaras el formulario una sola vez en PHP.
- **Frontend agnóstico**: El endpoint `/schema` expone la especificación JSON completa. Tu componente dinámico (`<DynamicForm />`) renderiza los inputs automáticamente.
- **Validación nativa compilada**: El controlador extrae las reglas directamente del esquema mediante `$schema->toValidationRules()`.
- **Soporte transparente para PATCH**: Las mutaciones parciales convierten automáticamente reglas `required` a `sometimes|required`.
:::

---

## 🏗️ Anatomía de una Definición de Formulario

Veamos un ejemplo de un formulario completo con diseño en grid y validaciones:

```php
namespace App\Schemas;

use Warrior\SchemaBuilder\Enums\FieldType;
use Warrior\SchemaBuilder\Form\Field;
use Warrior\SchemaBuilder\Form\FormSchema;

class UserSchema
{
    public static function form(): FormSchema
    {
        return FormSchema::make('user-form', 'Gestión de Usuario')
            ->description('Complete los datos personales y de acceso del usuario.')
            ->endpoint('/api/v1/users')
            ->httpMethod('POST')
            ->submitLabel('Guardar Usuario')
            ->cancelLabel('Cancelar')
            ->fields([
                Field::text('first_name', 'Nombres')
                    ->placeholder('Ej. Carlos')
                    ->required()
                    ->min(2)
                    ->cols(12)
                    ->md(6),

                Field::text('last_name', 'Apellidos')
                    ->placeholder('Ej. Mendoza')
                    ->required()
                    ->min(2)
                    ->cols(12)
                    ->md(6),

                Field::email('email', 'Correo Electrónico')
                    ->placeholder('carlos@empresa.com')
                    ->required()
                    ->unique('users', 'email')
                    ->cols(12)
                    ->md(6),

                Field::password('password', 'Contraseña')
                    ->placeholder('Mínimo 8 caracteres')
                    ->required()
                    ->min(8)
                    ->cols(12)
                    ->md(6),

                Field::select('role_id', 'Rol Asignado')
                    ->options([
                        ['label' => 'Administrador', 'value' => 1],
                        ['label' => 'Operador', 'value' => 2],
                        ['label' => 'Auditor', 'value' => 3],
                    ])
                    ->required()
                    ->cols(12)
                    ->md(6),

                Field::switch('is_active', 'Estado Activo')
                    ->defaultValue(true)
                    ->cols(12)
                    ->md(6),
            ]);
    }
}
```

---

## 📐 Modos de Maquetación del Formulario

`FormSchema` soporta **3 estrategias de organización** visual según la complejidad de la entidad:

| Estrategia | Método | Cuándo Usarlo | Salida JSON |
| :--- | :--- | :--- | :--- |
| **Plano (Flat)** | `->fields([...])` | Formularios simples o modales rápidos (login, contacto, CRUD básico). | `"inputs": [...]` |
| **Pestañas (Tabs)** | `->tabs([...])` | Entidades densas con muchas áreas (Datos Generales, Facturación, Seguridad). | `"tabs": [...]` |
| **Secciones (Sections)** | `->sections([...])` | Formularios largos verticales divididos en bloques temáticos o tarjetas. | `"sections": [...]` |

> [!NOTE]
> Cada una de estas estructuras implementa el patrón de diseño **Composite**: sin importar si agrupas campos en pestañas o secciones, `$form->getFields()` y `$form->toValidationRules()` siempre resuelven la lista plana de todos los campos contenidos automáticamente.

---

## ⚙️ Métodos Principales de `FormSchema`

### Configuración del Formulario

- `FormSchema::make(?string $id = null, ?string $title = null)`: Factoría estática para instanciar el esquema.
- `->id(string $id)`: Asigna el identificador único del formulario.
- `->title(string $title)`: Asigna el título visible en el encabezado o modal.
- `->description(string $description)`: Texto descriptivo o instrucciones de llenado.
- `->endpoint(string $endpoint)`: URL a la que el frontend enviará la mutación (`POST`, `PUT` o `PATCH`).
- `->httpMethod(string $method)`: Método HTTP esperado (`POST`, `PUT`, `PATCH`).
- `->submitLabel(string $label)`: Texto del botón principal (ej. *"Crear Registro"*, *"Actualizar Datos"*).
- `->cancelLabel(string $label)`: Texto del botón secundario o cancelar.
- `->tabsPosition(TabsPosition|string $position)`: Ubicación de las pestañas (`TabsPosition::Top` o `TabsPosition::Left`).

### Agrupación de Campos

- `->fields(array $fields)`: Define una lista plana de campos (`FieldContract[]`).
- `->addField(FieldContract $field)`: Agrega un campo individual a la lista.
- `->tabs(array $tabs)`: Define una lista de pestañas (`FormTab[]`).
- `->addTab(FormTab $tab)`: Agrega una pestaña individual.
- `->sections(array $sections)`: Define una lista de secciones (`FormSection[]`).
- `->addSection(FormSection $section)`: Agrega una sección individual.

### Extracción de Reglas y Serialización

- `->toValidationRules(bool $isUpdate = false): array`: Compila las reglas de todos los campos a un formato entendible por `Validator::make()`. En modo `$isUpdate = true`, convierte `required` en `sometimes|required`.
- `->getFields(): array`: Retorna todos los campos recursivamente sin importar su nivel de anidación.
- `->toArray(): array`: Serializa el esquema a JSON Schema cumpliendo el contrato SPEC-002.
- `->jsonSerialize(): array`: Implementación de la interfaz `JsonSerializable` de PHP.

---

## 🚀 Uso en Controladores de Laravel

En tu controlador API no necesitas clases `FormRequest` redundantes si no lo deseas. Puedes validar directamente con el esquema:

```php
use App\Models\User;
use App\Schemas\UserSchema;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class UserController extends Controller
{
    // 1. Endpoint que entrega la especificación al frontend
    public function schema(): JsonResponse
    {
        return response()->json([
            'form' => UserSchema::form()->toArray(),
        ]);
    }

    // 2. Creación con validación estricta (POST)
    public function store(Request $request): JsonResponse
    {
        $schema = UserSchema::form();
        $validated = $request->validate($schema->toValidationRules(isUpdate: false));

        $user = User::create($validated);

        return response()->json($user, 201);
    }

    // 3. Edición parcial con Dirty Tracking (PATCH)
    public function update(Request $request, User $user): JsonResponse
    {
        $schema = UserSchema::form();
        
        // isUpdate = true convierte las reglas required en sometimes|required
        $validated = $request->validate($schema->toValidationRules(isUpdate: true));

        $user->update($validated);

        return response()->json($user);
    }
}
```

> [!TIP]
> Si tu controlador utiliza el trait [`HasDynamicCrudSchema`](/laravel/has-dynamic-crud-schema), todo este proceso se reduce a llamar a `$this->validateWithSchema($request, isUpdate: true)`.
