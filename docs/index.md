---
layout: home

hero:
  name: "Laravel SchemaBuilder"
  text: "Esquemas Headless y Declarativos para CRUDs"
  tagline: "Despídete de duplicar campos entre migraciones, FormRequests, controladores y componentes de Vue/React. Diseña tu entidad en un único archivo Schema fluido en PHP y genera tablas, formularios y APIs listas para producción en menos de 5 minutos."
  image:
    src: /logo.svg
    alt: Laravel SchemaBuilder
  actions:
    - theme: brand
      text: CRUD en 5 Minutos 🚀
      link: /guide/crud-in-5-minutes
    - theme: alt
      text: Catálogo de 15 Campos 📝
      link: /forms/field-catalog
    - theme: alt
      text: Ver en GitHub 📦
      link: https://github.com/AlexanderBV/schema-builder

features:
  - icon: 🚀
    title: De 500 líneas dispersas a 1 Schema Único
    details: Define tus columnas, inputs, pestañas, acciones y validaciones en un único archivo PHP fluido. La única fuente de verdad para todo tu stack.
  - icon: 🛡️
    title: Extracción Automática de Validaciones
    details: Olvídate de crear FormRequests manuales repetitivos. El motor compila automáticamente las reglas para Laravel Validator y soporta mutaciones parciales PATCH (dirty tracking).
  - icon: 📊
    title: Motor de Tablas de Alta Productividad
    details: Columnas visuales formateadas (avatars, badges, monedas, fechas), filtros en drawer lateral, búsqueda en vivo, cabeceras fijas, selección masiva y Soft Deletes.
  - icon: 🧩
    title: 100% Agnóstico al Frontend
    details: Genera un contrato JSON limpio y estandarizado (SPEC-002) que alimenta directamente el ecosistema Vuexy, componentes de React, Svelte o apps móviles.
  - icon: ⚡
    title: Cero Dependencias Obligatorias
    details: No te ata a ningún ORM ni Query Builder específico. Provee introspección pura (getAllowedSorts, getAllowedFilters) compatible con cualquier motor.
  - icon: 🏗️
    title: Arquitectura SOLID & Patrones GoF
    details: Diseñado como una obra de ingeniería con Fluent Builder, Composite (tabs/secciones), Strategy (formatters de celda) y Value Objects (Enums tipados de PHP 8.2).
---

<div class="tip custom-block" style="margin-top: 2.5rem;">
  <p class="custom-block-title">¿POR QUÉ CONSTRUIR CRUDS SIGUE SIENDO TAN LENTO Y REPETITIVO?</p>
  <p>
    En la mayoría de proyectos Laravel, crear un CRUD implica <b>hacer el mismo trabajo 5 veces</b>: crear la migración, escribir el FormRequest con 30 reglas, configurar el controlador, diseñar la tabla en el frontend y armar los modales con inputs repetidos. Si agregas un campo nuevo, debes tocar 5 archivos distintos.
    <br><br>
    <b>Con Laravel SchemaBuilder, escribes tu Schema una sola vez en PHP y el sistema resuelve el resto:</b>
  </p>
</div>

::: code-group

```php [1. Define tu Schema Único (Users)]
// app/Schemas/UserSchema.php
namespace App\Schemas;

use Warrior\SchemaBuilder\Table\TableSchema;
use Warrior\SchemaBuilder\Table\Column;
use Warrior\SchemaBuilder\Form\FormSchema;
use Warrior\SchemaBuilder\Form\Field;

class UserSchema
{
    public static function table(): TableSchema
    {
        return TableSchema::make('users-table', 'Usuarios')
            ->endpoint('/api/v1/users')
            ->columns([
                Column::make('name', 'Nombre')->avatar('avatar', 'name', 'email')->sortable(),
                Column::make('role', 'Rol')->badge(['admin' => 'primary', 'user' => 'info'])->sortable(),
                Column::make('balance', 'Saldo')->currency('USD')->sortable(),
                Column::make('created_at', 'Registro')->date()->sortable(),
            ]);
    }

    public static function form(): FormSchema
    {
        return FormSchema::make('user-form', 'Expediente')
            ->fields([
                Field::text('name', 'Nombre')->required()->string()->maxLength(100)->cols(12),
                Field::email('email', 'Correo')->required()->cols(12),
                Field::select('role', 'Rol')->options(['admin' => 'Admin', 'user' => 'User'])->required()->cols(6),
                Field::number('balance', 'Saldo')->min(0)->cols(6),
            ]);
    }
}
```

```php [2. Controlador en 5 Líneas]
// app/Http/Controllers/Api/UserController.php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Schemas\UserSchema;
use Warrior\SchemaBuilder\Concerns\HasDynamicCrudSchema;

class UserController extends Controller
{
    use HasDynamicCrudSchema;

    protected function tableSchema() { return UserSchema::table(); }
    protected function formSchema() { return UserSchema::form(); }

    public function store(Request $request)
    {
        // ¡Validación extraída automáticamente desde tu FormSchema!
        $validated = $this->validateWithSchema($request);
        return response()->json(['data' => User::create($validated)], 201);
    }
}
```

```php [3. Rutas en 1 Sola Línea]
// routes/api.php
use App\Http\Controllers\Api\UserController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function () {
    // ¡Expande automáticamente /schema, /index, /store, /show, /update, /destroy, /restore y /force!
    Route::crud('users', UserController::class);
});
```

```vue [4. En el Frontend (Vuexy / React / Vue 3)]
<!-- resources/js/pages/users.vue -->
<script setup>
import { CrudComponent } from '@/components/dynamic-table'
</script>

<template>
  <!-- CrudComponent consume /api/v1/users/schema y renderiza la tabla, filtros y modales automáticamente -->
  <CrudComponent schema-url="/api/v1/users/schema" />
</template>
```

:::

<div class="warning custom-block" style="margin-top: 2rem;">
  <p class="custom-block-title">COMPATIBILIDAD Y RENDIMIENTO GARANTIZADO</p>
  <p>
    Diseñado para <b>PHP 8.2, 8.3, 8.4 y 8.5</b> con <b>Laravel 10, 11 y 12</b>. Verificado al 100% con <b>PHPStan en Nivel 8</b> (análisis estático estricto) y suites completas de pruebas unitarias y de integración.
  </p>
</div>
