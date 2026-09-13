# Acciones de Fila, Toolbar & ACL 🛡️

Gestiona quién puede ver, editar o eliminar cada registro mediante una combinación de permisos globales (RBAC) y control de acceso a nivel de fila (ACL).

---

## 🎬 Acciones Estándar de Fila

```php
use Warrior\SchemaBuilder\Table\RowAction;

$table
    ->showAction(enabled: true, permission: 'users.show')
    ->updateAction(enabled: true, permission: 'users.update')
    ->deleteAction(enabled: true, permission: 'users.delete');
```

Si el usuario actual en el frontend carece del permiso `'users.delete'`, el botón de eliminar se elimina del DOM.

---

## 🛠️ Acciones Personalizadas de Fila

Puedes agregar cualquier acción con iconos y colores personalizados:

```php
$table->addRowAction(
    RowAction::make('reset_password', 'Restablecer Clave')
        ->icon('tabler-key')
        ->color('warning')
        ->permission('users.security')
);

$table->addRowAction(
    RowAction::make('impersonate', 'Suplantar Usuario')
        ->icon('tabler-user-check')
        ->color('info')
        ->permission('superadmin')
);
```

---

## 🔒 Control de Acceso por Fila (Row-Level ACL)

¿Qué pasa si un usuario tiene el permiso global `'users.delete'`, pero **no debe poder eliminar a su propio usuario o al Administrador principal**?

Para eso existe el sistema de **ACL Contextual por Fila**:

```php
$table->acl(key: 'acl', actionMap: [
    'show'   => 'show',
    'update' => 'update',
    'delete' => 'delete',
]);
```

Cuando tu API retorna los registros con una clave `acl`:

```json
{
  "id": 1,
  "name": "Super Admin",
  "acl": {
    "show": true,
    "update": true,
    "delete": false
  }
}
```

El frontend (`DynamicDataTable.vue`) evalúa tanto el permiso global como el booleano `item.acl.delete`: si `acl.delete` es `false`, el botón de eliminar se deshabilita u oculta para esa fila específica, impidiendo acciones indebidas.
