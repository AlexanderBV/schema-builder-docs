# Anatomía de TableSchema 📊

`TableSchema` es el builder maestro encargado de orquestar la vista de tabla para componentes como `<DynamicDataTable />` y `<CrudComponent />`.

---

## 🏗️ Estructura Completa de Configuración

```php
use Warrior\SchemaBuilder\Table\TableSchema;
use Warrior\SchemaBuilder\Table\Column;
use Warrior\SchemaBuilder\Enums\TabsPosition;
use Warrior\SchemaBuilder\Enums\PaginationPosition;

$table = TableSchema::make('users-table', 'Directorio de Empleados')
    ->subtitle('Consulta y administración de personal')
    ->endpoint('/api/v1/users')
    ->fixedHeader()                     // Encabezado fijo durante scroll (activo por defecto: true)
    ->height(null)                      // Altura fija (opcional)
    ->maxHeight('600px')                // Altura máxima sugerida
    ->selectable(true, 'id')            // Habilita checkboxes con clave primaria 'id'
    ->tabsPosition(TabsPosition::TOOLBAR) // Ubicación de tabs: 'toolbar' o 'top'
    ->search(true, 'Buscar por nombre, email o DNI...', ['name', 'email', 'dni'])
    ->pagination(fn ($p) => $p
        ->defaultPerPage(25)
        ->perPageOptions([10, 25, 50, 100])
        ->defaultSort('created_at', 'desc')
        ->position(PaginationPosition::BOTH) // Paginación arriba y abajo
    )
    ->softDeletes(fn ($sd) => $sd
        ->enable(true)
        ->queryParam('trashed')
        ->endpoints(
            restore: '/api/v1/users/{id}/restore',
            forceDelete: '/api/v1/users/{id}/force'
        )
    );
```

---

## 📋 Métodos Disponibles en `TableSchema`

| Método | Tipo / Parámetros | Descripción |
| :--- | :--- | :--- |
| `endpoint(string $url)` | `string` | URL base para la consulta de datos en servidor. |
| `fixedHeader(bool $fixed = true)` | `bool` | Mantiene las cabeceras de columna visibles durante el scroll vertical (**activo por defecto en true**). Pasa false si deseas desactivarlo. |
| `maxHeight(?string $height)` | `string` | Define la altura máxima de la tabla (ej. `'500px'`). |
| `selectable(bool $enabled = true, string $key = 'id')` | `bool, string` | Habilita checkboxes para selección masiva. |
| `tabs(array $tabs)` | `array<TableTab>` | Pestañas contextuales de segmentación de datos. |
| `search(bool $enabled, string $placeholder, array $fields)` | `bool, string, array` | Configura el buscador con autocompletado y campos de backend. |
| `pagination(callable\|PaginationConfig $config)` | `PaginationConfig` | Configuración de opciones de paginación del servidor. |
| `softDeletes(bool\|callable $config)` | `SoftDeletesConfig` | Configura papelera, endpoint de restauración y purga física. |
| `columns(array $columns)` | `array<Column>` | Lista de columnas visuales de la tabla. |
| `filters(array $filters)` | `array<Field>` | Filtros avanzados renderizados en el Drawer lateral. |
| `rowActions(bool $enabled = true)` | `bool` | Habilita o deshabilita la columna de acciones por fila. |
| `headerActions(array $actions)` | `array<HeaderAction>` | Botones en la toolbar superior (ej. 'Nuevo', 'Exportar'). |
| `bulkActions(array $actions)` | `array<BulkAction>` | Acciones aplicables sobre las filas seleccionadas. |
