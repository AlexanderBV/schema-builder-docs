# Clases, Traits y Contratos 📖

La arquitectura de **SchemaBuilder** está diseñada siguiendo estrictamente los principios **SOLID**, desacoplando responsabilidades mediante interfaces atómicas y reutilizando comportamientos compartidos a través de traits limpios.

A continuación se detalla el mapa técnico de la librería en el espacio de nombres `Warrior\SchemaBuilder`.

---

## 🏛️ Contratos (Interfaces)

Todas las interfaces se encuentran ubicadas en `Warrior\SchemaBuilder\Contracts`:

### 1. `SchemaContract`
Define el contrato canónico para cualquier esquema serializable (`TableSchema`, `FormSchema`, `DetailSchema`):
```php
interface SchemaContract extends Arrayable, JsonSerializable
{
    public function getId(): ?string;
    public function getTitle(): ?string;
    public function isVisible(): bool;
    public function toArray(): array;
}
```

### 2. `FieldContainerContract`
Implementado por cualquier contenedor que agrupe campos (como `FormSchema`, `FormTab`, `FormSection`):
```php
interface FieldContainerContract
{
    public function addField(FieldContract $field): static;
    public function getFields(): array;
}
```

### 3. `FieldContract`
Contrato para cualquier input o campo de formulario:
```php
interface FieldContract extends Arrayable, JsonSerializable, ValidationExtractableContract
{
    public function getName(): string;
    public function getType(): FieldType;
}
```

### 4. `ColumnContract`
Contrato para columnas de visualización en tablas:
```php
interface ColumnContract extends Arrayable, JsonSerializable
{
    public function getKey(): string;
    public function getLabel(): string;
    public function getType(): ColumnType;
}
```

### 5. `ColumnFormatterContract`
Contrato para formatters visuales de columna (`AvatarFormatter`, `BadgeFormatter`, `CurrencyFormatter`, etc.):
```php
interface ColumnFormatterContract
{
    public function getOptions(): array;
    public function getType(): ColumnType;
}
```

### 6. `ValidationExtractableContract`
Implementado por componentes capaces de compilar reglas para el validador de Laravel:
```php
interface ValidationExtractableContract
{
    public function toValidationRules(bool $isUpdate = false): array;
}
```

---

## 🧩 Concerns (Traits Reutilizables)

Ubicados en `Warrior\SchemaBuilder\Concerns`:

### `Makeable`
Proporciona el método estático de factoría fluida `::make(...$args)`.

### `HasIdAndTitle`
Maneja identificadores únicos (`id`), títulos legibles (`title`) y textos descriptivos (`description`).

### `HasVisibility`
Gestiona tanto la visibilidad en servidor (`visible()`, `hidden()`, `when()`, `unless()`) como la visibilidad reactiva en cliente (`visibleWhen()`).

### `HasPermissions`
Permite adjuntar permisos o roles requeridos (`can()`) para control de acceso basado en roles (RBAC).

### `HasValidationRules`
API fluida para declarar y compilar reglas de validación nativas de Laravel, incluyendo adaptación para mutaciones parciales PATCH (`sometimes|required`).

### `HasOptions`
Provee métodos para manipular listas de opciones en componentes de selección (`options()`, `option()`).

### `HasDynamicCrudSchema`
Trait de conveniencia para controladores API de Laravel. Expone automáticamente el endpoint `GET /schema` y el método protegido `validateWithSchema()`.

---

## 🗂️ Jerarquía de Clases Principales

```
Warrior\SchemaBuilder\
├── Table\
│   ├── TableSchema (Builder principal de tablas)
│   ├── Column (Definición de columnas)
│   ├── Filter (Definición de filtros de drawer)
│   ├── TableTab (Pestañas contextuales)
│   ├── BulkAction (Acciones masivas de fila)
│   ├── HeaderAction (Botones de la cabecera)
│   ├── RowAction (Botones por fila de datos)
│   └── Formatters\ (Avatar, Badge, Currency, Date)
├── Form\
│   ├── FormSchema (Builder principal de formularios)
│   ├── Field (Clase base de campos)
│   ├── FormTab (Pestaña de formulario)
│   ├── FormSection (Sección agrupada de campos)
│   └── Fields\ (TextField, EmailField, SelectField, etc.)
├── Detail\
│   ├── DetailSchema (Builder de vistas de inspección)
│   ├── DetailField (Campo de sólo lectura)
│   └── DetailTab (Pestaña de inspección)
└── Facades\
    └── SchemaBuilder (Fachada estática para Laravel)
```
