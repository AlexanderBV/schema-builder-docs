# Pestañas Contextuales & Soft Deletes 📑

Organiza la vista de tu tabla en pestañas de segmentación rápida y gestiona registros eliminados de forma transparente.

---

## 🗂️ Pestañas Contextuales (`TableTab`)

Las pestañas permiten a los usuarios segmentar los datos de la tabla en 1 solo clic sin abrir el drawer de filtros:

```php
use Warrior\SchemaBuilder\Table\TableTab;

$table->tabs([
    TableTab::make('all', 'Todos los Registros')
        ->icon('tabler-list'),

    TableTab::make('active', 'Activos')
        ->icon('tabler-circle-check')
        ->badge(24, 'success')
        ->filter(['status' => 'active']),

    TableTab::make('pending', 'Pendientes de Aprobación')
        ->icon('tabler-clock')
        ->badge(5, 'warning')
        ->filter(['status' => 'pending']),
]);
```

### Ubicación de Pestañas
Puedes ubicar las pestañas en la barra superior o en la propia toolbar de acciones:

```php
use Warrior\SchemaBuilder\Enums\TabsPosition;

$table->tabsPosition(TabsPosition::TOOLBAR); // o TabsPosition::TOP
```

---

## 🗑️ Soporte Integrado de Soft Deletes

Para modelos de Laravel que utilizan el trait `Illuminate\Database\Eloquent\SoftDeletes`, puedes activar la papelera con 3 líneas:

```php
$table->softDeletes(fn ($sd) => $sd
    ->enable(true)
    ->queryParam('trashed') // Nombre del parámetro query string
    ->endpoints(
        restore: '/api/v1/users/{id}/restore',
        forceDelete: '/api/v1/users/{id}/force'
    )
);
```

### Comportamiento Automático:
1. En el frontend, se añaden automáticamente las pestañas **[ Activos ]** y **[ Papelera ]**.
2. Al estar en la papelera, los botones de editar se reemplazan automáticamente por **Restaurar** y **Eliminar Definitivamente**.
3. El método `getAllowedFilters()` incluye automáticamente `'trashed'` en la lista blanca de filtros autorizados del servidor.
