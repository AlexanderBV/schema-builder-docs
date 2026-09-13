# Facade SchemaBuilder & Macros 🛠️

Laravel ofrece una experiencia de desarrollo elegante a través de Facades. **SchemaBuilder** incluye la fachada `Warrior\SchemaBuilder\Facades\SchemaBuilder` como punto de entrada unificado para crear tablas, formularios y vistas de detalle.

---

## ⚡ Uso del Facade

Puedes instanciar cualquiera de los 3 motores mediante la fachada:

```php
use Warrior\SchemaBuilder\Facades\SchemaBuilder;

// 1. Instanciar una tabla
$table = SchemaBuilder::table('users-table', 'Listado de Usuarios')
    ->columns([ ... ]);

// 2. Instanciar un formulario
$form = SchemaBuilder::form('user-form', 'Crear Usuario')
    ->fields([ ... ]);

// 3. Instanciar una vista de detalle
$detail = SchemaBuilder::detail('user-detail', 'Detalle de Usuario')
    ->fields([ ... ]);
```

> [!NOTE]
> `SchemaBuilder::table()` y `TableSchema::make()` son funcionalmente idénticos. Puedes utilizar el estilo que mejor se adapte a las convenciones de tu equipo.

---

## 🧩 Extensibilidad Total con Macros (`Macroable`)

Todas las clases centrales de **SchemaBuilder** implementan el trait `Illuminate\Support\Traits\Macroable`:
- `TableSchema`
- `Column`
- `Filter`
- `FormSchema`
- `Field`
- `FormTab`
- `FormSection`
- `DetailSchema`
- `DetailField`

Esto te permite agregar métodos personalizados a la librería en tiempo de ejecución desde tu `AppServiceProvider` sin tocar el código fuente del paquete.

### Ejemplo 1: Macro de Campo de Documento de Identidad (DNI/RUC)

```php
// app/Providers/AppServiceProvider.php
namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Warrior\SchemaBuilder\Form\Field;

class AppServiceProvider extends ServiceProvider
{
    public function boot(): void
    {
        Field::macro('dni', function (string $name = 'dni', string $label = 'DNI') {
            /** @var Field $this */
            return Field::text($name, $label)
                ->placeholder('8 dígitos numéricos')
                ->rules('digits:8')
                ->cols(12)->md(6);
        });

        Field::macro('ruc', function (string $name = 'ruc', string $label = 'RUC') {
            /** @var Field $this */
            return Field::text($name, $label)
                ->placeholder('11 dígitos numéricos')
                ->rules('digits:11')
                ->cols(12)->md(6);
        });
    }
}
```

Ahora en cualquier esquema de tu aplicación puedes hacer:

```php
return FormSchema::make()
    ->fields([
        Field::dni(),
        Field::ruc(),
    ]);
```

---

### Ejemplo 2: Macro de Columnas de Auditoría Estándar

¿Todas tus tablas en la base de datos incluyen `created_at` y `updated_at`? Puedes estandarizarlas con una macro:

```php
// app/Providers/AppServiceProvider.php
use Warrior\SchemaBuilder\Table\Column;
use Warrior\SchemaBuilder\Table\TableSchema;

TableSchema::macro('withAuditColumns', function () {
    /** @var TableSchema $this */
    return $this->addColumn(
        Column::date('created_at', 'Fecha Creación')->sortable()
    )->addColumn(
        Column::date('updated_at', 'Última Actualización')->sortable()
    );
});
```

Uso en tu esquema:

```php
return TableSchema::make('products-table', 'Catálogo')
    ->columns([
        Column::text('sku', 'SKU'),
        Column::text('name', 'Producto'),
    ])
    ->withAuditColumns(); // Inyecta created_at y updated_at automáticamente
```
