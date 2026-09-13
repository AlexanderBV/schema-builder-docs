# Integración con Cualquier Frontend 🌐

**SchemaBuilder** fue concebido bajo un principio innegociable: **cero ataduras con un framework o plantilla de frontend en particular**.

Al emitir una especificación limpia y estandarizada en formato **JSON Schema**, cualquier librería de componentes moderna (**BootstrapVue**, **Vue 3**, **React**, **Svelte**, o **Blade con Alpine.js**) puede consumir el endpoint `/schema` y construir interfaces ricas, reactivas y dinámicas en cuestión de minutos.

---

## 📡 El Contrato JSON que Entrega el Backend

Cuando tu frontend realiza un `GET /api/v1/{recurso}/schema`, el backend responde con un objeto estructurado:

```json
{
  "table": {
    "id": "users-table",
    "title": "Directorio de Usuarios",
    "columns": [
      { "key": "id", "label": "ID", "type": "number", "sortable": true },
      { "key": "name", "label": "Nombre Completo", "type": "text", "sortable": true, "searchable": true },
      { "key": "status", "label": "Estado", "type": "badge", "formatOptions": { "colorMap": { "active": "success" } } }
    ],
    "filters": [ ... ],
    "tabs": [ ... ],
    "softDeletes": { "enabled": true }
  },
  "form": {
    "id": "user-form",
    "title": "Formulario de Usuario",
    "endpoint": "/api/v1/users",
    "inputs": [
      { "name": "name", "label": "Nombre", "type": "text", "cols": 12, "md": 6, "required": true },
      { "name": "email", "label": "Correo", "type": "email", "cols": 12, "md": 6, "required": true }
    ]
  },
  "detail": {
    "id": "user-detail",
    "fields": [ ... ]
  }
}
```

---

## 💚 Ejemplo 1: Integración con BootstrapVue / Bootstrap

Si utilizas **BootstrapVue** (o Bootstrap 5 en Vue), mapear las columnas y los datos del schema es sumamente directo:

```vue
<!-- UsersIndex.vue con BootstrapVue -->
<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const schema = ref(null);
const users = ref([]);
const loading = ref(true);

onMounted(async () => {
  // 1. Descarga el schema con la definición de columnas
  const { data } = await axios.get('/api/v1/users/schema');
  schema.value = data;

  // 2. Consulta los datos de la entidad
  const response = await axios.get('/api/v1/users');
  users.value = response.data.data;
  loading.value = false;
});
</script>

<template>
  <b-container fluid class="py-4">
    <b-card v-if="schema" :title="schema.table.title" class="shadow-sm">
      <!-- Tabla dinámica con columnas y ordenamiento definidos por el backend -->
      <b-table
        :items="users"
        :fields="schema.table.columns"
        :busy="loading"
        hover
        responsive
      >
        <!-- Slot dinámico para renderizar columnas de tipo badge -->
        <template #cell(status)="data">
          <b-badge :variant="data.item.status === 'active' ? 'success' : 'secondary'">
            {{ data.value }}
          </b-badge>
        </template>

        <!-- Slot dinámico para acciones de fila -->
        <template #cell(actions)="data">
          <b-button size="sm" variant="outline-primary" @click="openEditModal(data.item)">
            Editar
          </b-button>
        </template>
      </b-table>
    </b-card>
  </b-container>
</template>
```

---

## ⚛️ Ejemplo 2: Integración con React / Tailwind / Material-UI

En el ecosistema de **React**, un hook reutilizable `useSchema` simplifica enormemente el consumo:

```tsx
// useSchema.ts
import { useState, useEffect } from 'react';
import axios from 'axios';

export function useSchema(resourceEndpoint: string) {
  const [schema, setSchema] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${resourceEndpoint}/schema`).then((res) => {
      setSchema(res.data);
      setLoading(false);
    });
  }, [resourceEndpoint]);

  return { schema, loading };
}
```

Luego en tu página de React:

```tsx
// UsersPage.tsx
import React from 'react';
import { useSchema } from './useSchema';

export function UsersPage() {
  const { schema, loading } = useSchema('/api/v1/users');

  if (loading) return <div>Cargando especificación...</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">{schema.table.title}</h1>
      <table className="min-w-full divide-y divide-gray-200">
        <thead>
          <tr>
            {schema.table.columns.map((col: any) => (
              <th key={col.key} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        {/* Cuerpo de tabla alimentado con los registros */}
      </table>
    </div>
  );
}
```

---

## 🚀 Cómo Renderizar Formularios Dinámicos con `DynamicForm`

Ya sea con BootstrapVue, Tailwind o Vuetify, el renderizador dinámico de formulario sigue un patrón común de 3 pasos:

### 1. Resuelve el Componente según `field.type`
Un diccionario o función mapea el tipo de campo (`text`, `select`, `date`, `switch`, etc.) al componente visual correspondiente:

```javascript
const componentMap = {
  text: 'b-form-input',
  email: 'b-form-input',
  password: 'b-form-input',
  textarea: 'b-form-textarea',
  select: 'b-form-select',
  checkbox: 'b-form-checkbox',
  switch: 'b-form-checkbox',
};
```

### 2. Respeta la Visibilidad Reactiva (`visibleWhen`)
Evalúa en el cliente si el campo debe ser visible en base a los valores del formulario sin consultar al servidor:

```javascript
function isFieldVisible(field, formValues) {
  if (!field.visibleWhen) return true;
  
  const parentValue = formValues[field.visibleWhen.field];
  const expectedValue = field.visibleWhen.is;
  const operator = field.visibleWhen.operator || '===';

  if (operator === '===') return parentValue === expectedValue;
  if (operator === '!==') return parentValue !== expectedValue;
  if (operator === 'in') return Array.isArray(expectedValue) && expectedValue.includes(parentValue);

  return true;
}
```

### 3. Implementa Dirty Tracking en Actualizaciones (PATCH)
Al guardar los cambios en un registro existente, extrae únicamente los campos que cambiaron respecto a su valor inicial y envíalos mediante `PATCH`:

```javascript
function getDirtyPayload(initialValues, currentValues) {
  const dirty = {};
  for (const [key, value] of Object.entries(currentValues)) {
    if (value !== initialValues[key]) {
      dirty[key] = value;
    }
  }
  return dirty;
}

// En el envío del formulario de edición:
const payload = getDirtyPayload(initialItem, formModel);
await axios.patch(`${schema.form.endpoint}/${editingId}`, payload);
```

¡Gracias al soporte de Dirty Tracking de SchemaBuilder en el backend, los campos obligatorios omitidos en `payload` son ignorados y no producen errores 422!
