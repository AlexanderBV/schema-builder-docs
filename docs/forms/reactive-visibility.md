# Visibilidad Reactiva & Grid Responsive 🎨

Un formulario profesional no es una lista estática de campos. En aplicaciones del mundo real, los campos deben adaptarse dinámicamente al tamaño de pantalla del dispositivo y mostrarse u ocultarse según las respuestas previas del usuario.

**SchemaBuilder** resuelve esto mediante un sistema de dos capas: **seguridad en el servidor** y **reactividad instantánea en el cliente**, combinado con un **sistema de grid de 12 columnas**.

---

## 🔒 Capa 1: Visibilidad en Servidor (Zero-Trust & RBAC)

Cuando un campo contiene información sensible (como un selector de roles para administradores o un campo de comisión interna), **no debe enviarse al navegador de un usuario no autorizado bajo ningún concepto**.

### Métodos de Evaluación en Servidor

```php
// 1. Condición booleana o Closure evaluado al vuelo:
Field::text('salary', 'Salario Base')
    ->visible(fn () => auth()->user()->isAdmin());

// 2. Método inverso hidden():
Field::text('internal_notes', 'Notas Internas')
    ->hidden(fn () => auth()->user()->isClient());

// 3. Modificación condicional con when():
Field::select('tenant_id', 'Empresa')
    ->when(auth()->user()->isSuperAdmin(), function ($field) {
        $field->options(Tenant::pluck('name', 'id')->toArray())->required();
    });

// 4. Verificación de permisos y roles con can():
Field::select('role_id', 'Rol de Acceso')
    ->can('users.assign_roles');
```

> [!IMPORTANT]
> Si la condición en servidor evalúa a `false`, el campo **se extirpa completamente de la salida JSON**. El cliente frontend ni siquiera sabrá que dicho campo existe, garantizando seguridad absoluta (Zero-Trust).

---

## ⚡ Capa 2: Visibilidad Reactiva en Cliente (`visibleWhen`)

¿Qué ocurre cuando un campo debe aparecer o desaparecer según lo que el usuario esté seleccionando en pantalla (por ejemplo, mostrar *"Razón Social"* solo si *"Tipo de Documento"* es *"RUC"* o *"CIF"*)?

Para esto existe **`visibleWhen`**:

```php
Field::select('document_type', 'Tipo de Documento')
    ->options([
        ['label' => 'DNI / Cédula', 'value' => 'DNI'],
        ['label' => 'RUC / Empresa', 'value' => 'RUC'],
        ['label' => 'Pasaporte', 'value' => 'PASSPORT'],
    ])
    ->defaultValue('DNI')
    ->cols(12)->md(4),

// Este campo solo es visible reactivamente si document_type === 'RUC'
Field::text('company_name', 'Razón Social de la Empresa')
    ->placeholder('Ej. Corporación Tecnológica S.A.C.')
    ->visibleWhen('document_type', 'RUC')
    ->cols(12)->md(8),

// Este campo solo es visible reactivamente si document_type !== 'RUC'
Field::text('first_name', 'Nombres de la Persona')
    ->visibleWhen('document_type', 'RUC', '!==')
    ->cols(12)->md(4),
```

### ¿Cómo lo procesa el Frontend?

El método `visibleWhen()` genera esta especificación en el JSON:

```json
{
  "name": "company_name",
  "label": "Razón Social de la Empresa",
  "type": "text",
  "visibleWhen": {
    "field": "document_type",
    "is": "RUC",
    "operator": "==="
  }
}
```

Tu componente frontend (por ejemplo, en Vue 3) evalúa la condición de manera inmediata:

```vue
<!-- En el renderizador dinámico de Vue 3 -->
<template v-for="field in form.inputs" :key="field.name">
  <div 
    v-if="checkVisibility(field, formModel)"
    :class="resolveGridClasses(field)"
  >
    <component :is="resolveComponent(field.type)" v-model="formModel[field.name]" />
  </div>
</template>
```

¡Cero peticiones HTTP adicionales al servidor y una experiencia de usuario instantánea a 60 FPS!

---

## 📐 Grid Responsive de 12 Columnas

Cada campo en `FormSchema` se posiciona dentro de un sistema de rejilla (*grid*) estándar de **12 columnas**, idéntico al de Tailwind CSS, Bootstrap o Vuetify.

### Breakpoints Soportados

| Método | Breakpoint | Ancho Mínimo de Pantalla | Caso de Uso Habitual |
| :--- | :--- | :--- | :--- |
| `->cols(12)` | Móvil (Base) | Default / 0px | Ocupa el ancho completo en smartphones. |
| `->sm(6)` | Pequeño (sm) | ≥ 640px | Tablets verticales o phablets. |
| `->md(4)` | Mediano (md) | ≥ 768px | Laptops y tablets horizontales. |
| `->lg(3)` | Grande (lg) | ≥ 1024px | Pantallas de escritorio estándar. |
| `->xl(2)` | Extra Grande (xl) | ≥ 1280px | Monitores panorámicos. |

### Ejemplo: Layout Adaptable

```php
// Móvil: 1 columna por fila (12 cols)
// Tablet: 2 columnas por fila (sm: 6 cols)
// Desktop: 3 columnas por fila (md: 4 cols)
Field::text('first_name', 'Nombres')->cols(12)->sm(6)->md(4),
Field::text('middle_name', 'Segundo Nombre')->cols(12)->sm(6)->md(4),
Field::text('last_name', 'Apellidos')->cols(12)->sm(12)->md(4),

// Fila con ancho 2/3 y 1/3 en pantallas medianas en adelante:
Field::text('address', 'Dirección Principal')->cols(12)->md(8),
Field::text('zip_code', 'Código Postal')->cols(12)->md(4),
```

En la salida JSON, estos valores se serializan en el objeto del campo:

```json
{
  "name": "address",
  "cols": 12,
  "sm": null,
  "md": 8,
  "lg": null,
  "xl": null
}
```

Esto permite a tu framework frontend aplicar automáticamente clases como `col-12 md:col-8` (Tailwind) o `<VCol cols="12" md="8">` (Vuetify) sin necesidad de configurar nada manualmente.
