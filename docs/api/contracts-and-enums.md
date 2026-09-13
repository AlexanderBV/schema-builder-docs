# Enums Tipados de PHP 8.2 🏷️

Para evitar cadenas de texto mágicas y garantizar la máxima seguridad de tipos en tiempo de compilación y en análisis estático con PHPStan, **SchemaBuilder** aprovecha al máximo los **Backed Enums de PHP 8.2**.

Todos los enums implementan valores de respaldo (*string backed*), lo que permite que se serialicen limpiamente a JSON sin transformaciones manuales.

Ubicación del namespace: `Warrior\SchemaBuilder\Enums`.

---

## 📊 `ColumnType`

Define el tipo de dato y la estrategia de renderizado de una columna en `TableSchema` y `DetailField`:

```php
namespace Warrior\SchemaBuilder\Enums;

enum ColumnType: string
{
    case TEXT = 'text';
    case NUMBER = 'number';
    case DATE = 'date';
    case DATETIME = 'datetime';
    case BOOLEAN = 'boolean';
    case BADGE = 'badge';
    case AVATAR = 'avatar';
    case LINK = 'link';
    case CURRENCY = 'currency';
    case JSON = 'json';
    case CUSTOM = 'custom';
}
```

---

## 📝 `FieldType`

Especifica el tipo de control de formulario para `Field` y sus subclases:

```php
namespace Warrior\SchemaBuilder\Enums;

enum FieldType: string
{
    case TEXT = 'text';
    case EMAIL = 'email';
    case PASSWORD = 'password';
    case NUMBER = 'number';
    case TEXTAREA = 'textarea';
    case SELECT = 'select';
    case RADIO = 'radio';
    case CHECKBOX = 'checkbox';
    case SWITCH = 'switch';
    case DATE = 'date';
    case DATETIME = 'datetime';
    case DATE_RANGE = 'dateRange';
    case FILE = 'file';
    case IMAGE = 'image';
    case HIDDEN = 'hidden';
}
```

---

## 📐 `Alignment`

Controla la alineación horizontal de texto y encabezados en columnas de tabla:

```php
namespace Warrior\SchemaBuilder\Enums;

enum Alignment: string
{
    case LEFT = 'left';
    case CENTER = 'center';
    case RIGHT = 'right';
}
```

### Uso
```php
Column::number('stock', 'Inventario')->align(Alignment::RIGHT);
// O usando el string directamente:
Column::number('stock', 'Inventario')->align('right');
```

---

## 📄 `PaginationPosition`

Define la ubicación de los controles de paginación en la tabla:

```php
namespace Warrior\SchemaBuilder\Enums;

enum PaginationPosition: string
{
    case TOP = 'top';
    case BOTTOM = 'bottom';
    case BOTH = 'both';
}
```

### Uso
```php
TableSchema::make()
    ->paginationPosition(PaginationPosition::BOTH);
```

---

## 📑 `TabsPosition`

Determina la orientación de las pestañas en tablas o formularios:

```php
namespace Warrior\SchemaBuilder\Enums;

enum TabsPosition: string
{
    case TOP = 'top';
    case BOTTOM = 'bottom';
    case LEFT = 'left';
    case RIGHT = 'right';
}
```

### Uso
```php
FormSchema::make()
    ->tabsPosition(TabsPosition::LEFT); // Pestañas verticales en el lateral izquierdo
```
