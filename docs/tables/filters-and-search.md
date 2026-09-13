# Filtros de Drawer & Búsqueda 🔍

Para tablas con muchos criterios de consulta, `warrior/schema-builder` conecta directamente con el componente `DynamicTableFilterDrawer.vue` para ofrecer una experiencia de filtrado avanzada.

---

## 🎛️ Filtros Avanzados (Drawer Lateral)

Los filtros se definen usando los mismos objetos `Field` del motor de formularios, reutilizando al 100% las opciones y componentes:

```php
use Warrior\SchemaBuilder\Form\Field;

$table->filters([
    Field::select('role', 'Rol del Usuario')->options([
        'admin'  => 'Administrador',
        'editor' => 'Editor de Contenido',
        'user'   => 'Usuario Estándar',
    ]),

    Field::select('status', 'Estado de la Cuenta')->options([
        'active'   => 'Activa',
        'inactive' => 'Inactiva',
    ]),

    Field::dateRange('created_between', 'Rango de Registro'),
]);
```

### Cómo se envía al Servidor
Cuando el usuario presiona "Aplicar Filtros" en el Drawer, el cliente emite los parámetros en formato estándar compatible con `warrior/api-query-builder` o cualquier backend:

```http
GET /api/v1/users?filter[role]=admin&filter[status]=active&filter[created_between]=2026-01-01,2026-03-31
```

---

## ⚡ Búsqueda Global Concurrente

La búsqueda en la toolbar soporta debounce reactivo (350ms) en el frontend y consulta multi-columna en el backend:

```php
$table->search(
    enabled: true,
    placeholder: 'Buscar por nombre, correo o identificación...',
    fields: ['name', 'email', 'dni'] // Columnas autorizadas para búsqueda
);
```

El frontend emite:
```http
GET /api/v1/users?search=alejandro
```
