# Arquitectura SOLID & Patrones GoF 🏗️

**Laravel SchemaBuilder** no es una colección de helpers desordenados; ha sido construido siguiendo estrictamente los principios de diseño de software empresarial para garantizar robustez, mantenibilidad y cero deuda técnica.

---

## 🏛️ Aplicación de Principios SOLID

### S — Responsabilidad Única (Single Responsibility Principle)
- `TableSchema`: Es responsable exclusivamente de orquestar la especificación de la tabla (columnas, paginación, filtros). No sabe cómo formatear monedas ni cómo validar contraseñas.
- `Field`: Encapsula la definición de un control de formulario y compila sus propias reglas de validación.
- `Column`: Define la representación de una columna y delega el formateo especializado a su objeto Formatter.

### O — Abierto/Cerrado (Open/Closed Principle)
Todas las clases clave (`Field`, `Column`, `TableSchema`, `FormSchema`, `DetailSchema`) utilizan el trait `Illuminate\Support\Traits\Macroable`.

Puedes extender el paquete en tiempo de ejecución sin modificar sus archivos:

```php
// En tu AppServiceProvider:
use Warrior\SchemaBuilder\Table\Column;
use Warrior\SchemaBuilder\Enums\Alignment;

Column::macro('rutChileno', function () {
    /** @var Column $this */
    return $this->align(Alignment::CENTER)->width('120px');
});
```

### L — Sustitución de Liskov (Liskov Substitution Principle)
Cualquier especialización de campo (`TextField`, `SelectField`, `FileField`) implementa el contrato `FieldContract` y puede ser utilizada de forma intercambiable en cualquier contenedor de campos sin alterar el comportamiento de la serialización ni de la validación.

### I — Segregación de Interfaces (Interface Segregation Principle)
En lugar de una interfaz monolítica gigante, el paquete segrega comportamientos en contratos y traits reutilizables:
- `HasOptions`: Solo para inputs que manejan opciones desplegables (`SelectField`, `RadioField`).
- `HasValidationRules`: Solo para elementos que admiten validación.
- `HasPermissions`: Para cualquier elemento que evalúe permisos RBAC (`Column`, `RowAction`, `HeaderAction`).

### D — Inversión de Dependencias (Dependency Inversion Principle)
`FormSchema` depende de las abstracciones `FieldContainerContract` y `FieldContract`, nunca de implementaciones concretas del frontend.

---

## 🎨 Patrones de Diseño GoF Implementados

### 1. Fluent Builder (Creacional)
Permite construir estructuras complejas mediante encadenamiento legible paso a paso:
```php
TableSchema::make('users-table')
    ->title('Usuarios')
    ->fixedHeader()
    ->selectable();
```

### 2. Composite (Estructural)
Trata de forma uniforme a un formulario simple (lista plana de campos) y a un formulario jerárquico dividido en pestañas (`FormTab`) o secciones (`FormSection`).
Al llamar a `$form->toValidationRules()`, el composite root recorre recursivamente todos los nodos hijos y compila un array unificado para Laravel Validator.

### 3. Strategy (Comportamiento)
Encapsula los algoritmos y opciones de formateo de datos en objetos independientes:
- `AvatarFormatter`
- `BadgeFormatter`
- `CurrencyFormatter`
- `DateFormatter`

### 4. Value Object (DDD)
Previene errores de valores mágicos en strings utilizando Enums respaldados tipados de PHP 8.2 (`ColumnType`, `FieldType`, `Alignment`, `PaginationPosition`, `TabsPosition`).
