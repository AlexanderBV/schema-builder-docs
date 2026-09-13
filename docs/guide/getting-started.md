# Introducción & Filosofía 🚀

Bienvenido a **Laravel SchemaBuilder**, la solución definitiva para desarrolladores Laravel que buscan crear arquitecturas CRUD modernas, mantenibles y de alto rendimiento sin sacrificar control, elegancia ni tiempo.

---

## 🎯 El Problema que Resolvemos

En el ciclo tradicional de desarrollo de software empresarial, crear una nueva entidad CRUD consume típicamente entre **4 a 8 horas de trabajo repetitivo**:

1. **Migración de Base de Datos**: Creas la tabla y sus columnas.
2. **Modelo Eloquent**: Configuras `$fillable`, casts y relaciones.
3. **FormRequest**: Duplicas los 20 campos con sus reglas de validación (`required`, `email`, `max:100`).
4. **Controlador API**: Creas métodos `index`, `store`, `update`, `show`, `destroy` y aplicas filtros manuales.
5. **Componente de Tabla Frontend**: Declaras encabezados, formatos de moneda, fechas, badges y estilos.
6. **Modal de Formulario Frontend**: Repites los mismos 20 inputs con validaciones en el cliente.
7. **Petición PATCH con Dirty Tracking**: Sufres porque enviar solo los campos modificados hace fallar tus reglas `required`.

> 💥 **El Efecto Cascada**: Cuando el cliente solicita agregar un nuevo campo (ej. `telefono`), tienes que modificar **5 o 6 archivos independientes**. Esto genera inconsistencias, bugs silenciosos y fatiga cognitiva.

---

## 💡 La Solución: Schema Único como Fuente de la Verdad

**Laravel SchemaBuilder** introduce el concepto de **Esquema Unificado y Headless**:

```
                         ┌─────────────────────────────┐
                         │   UserSchema (PHP Fluido)   │
                         └──────────────┬──────────────┘
                                        │
             ┌──────────────────────────┼──────────────────────────┐
             ▼                          ▼                          ▼
   ┌───────────────────┐      ┌───────────────────┐      ┌───────────────────┐
   │    TableSchema    │      │    FormSchema     │      │   DetailSchema    │
   │ (Columnas, Tabs,  │      │ (15 tipos inputs, │      │ (Vista sólo lectura│
   │  Filtros, Sorts)  │      │  Validación auto) │      │  de inspección)   │
   └─────────┬─────────┘      └─────────┬─────────┘      └─────────┬─────────┘
             │                          │                          │
             └──────────────────────────┼──────────────────────────┘
                                        ▼
                         ┌─────────────────────────────┐
                         │   GET /api/v1/users/schema  │
                         │   (JSON Estándar SPEC-002)  │
                         └──────────────┬──────────────┘
                                        ▼
                         ┌─────────────────────────────┐
                         │      Frontend UI Engine     │
                         │  (<CrudComponent />, Vuexy, │
                         │   React, Flutter, Svelte)   │
                         └─────────────────────────────┘
```

1. Describes cómo se ve y cómo se valida tu entidad en **un solo archivo PHP**.
2. Tu backend expone el endpoint `/schema` que entrega el contrato JSON estandarizado.
3. Tu componente frontend consume ese JSON y renderiza automáticamente la tabla, el drawer de filtros avanzados, los modales de creación/edición y los diálogos de confirmación.
4. Tu controlador valida las peticiones HTTP contra el mismo schema, adaptando automáticamente las reglas para mutaciones parciales `PATCH`.

---

## 📦 Requisitos e Instalación

### Requisitos del Sistema
- **PHP**: `^8.2`, `8.3`, `8.4` o `8.5`
- **Laravel / Illuminate**: `^10.0`, `^11.0` o `^12.0`

### Instalación vía Composer

Ejecuta el siguiente comando en la raíz de tu proyecto Laravel:

```bash
composer require warrior/schema-builder
```

El Service Provider (`Warrior\SchemaBuilder\SchemaBuilderServiceProvider`) y el Facade (`Warrior\SchemaBuilder\Facades\SchemaBuilder`) se registran automáticamente.

---

## ⚡ ¿Qué Sigue?

Aprende a construir tu primer CRUD completo en menos de 5 minutos en el siguiente capítulo:

👉 **[Ir a CRUD en 5 Minutos](/guide/crud-in-5-minutes)**
