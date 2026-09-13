# Pestañas (Tabs) & Secciones 📑

Cuando un recurso contiene más de 10 o 15 atributos (como un Cliente con datos de facturación, contactos, direcciones y límites de crédito), presentar todos los campos en un solo scroll vertical crea **fatiga cognitiva** y empeora drásticamente la experiencia de usuario (UX).

**SchemaBuilder** incluye dos primitivas estructurales de alto nivel: **`FormTab`** (Pestañas) y **`FormSection`** (Secciones en Tarjetas o Bloques).

---

## 🗂️ Pestañas con `FormTab`

Las pestañas permiten dividir el formulario en vistas temáticas navegables. Cada pestaña puede tener su propio ícono, insignia numérica (*badge*) y lista de campos:

```php
use Warrior\SchemaBuilder\Enums\TabsPosition;
use Warrior\SchemaBuilder\Form\Field;
use Warrior\SchemaBuilder\Form\FormSchema;
use Warrior\SchemaBuilder\Form\FormTab;

return FormSchema::make('client-form', 'Expediente de Cliente')
    ->tabsPosition(TabsPosition::Left) // Pestañas verticales en el lateral izquierdo
    ->tabs([
        FormTab::make('general', 'Datos Generales')
            ->icon('tabler-user')
            ->fields([
                Field::text('first_name', 'Nombres')->required()->cols(6),
                Field::text('last_name', 'Apellidos')->required()->cols(6),
                Field::email('email', 'Correo')->required()->cols(12),
            ]),

        FormTab::make('billing', 'Facturación & Fiscal')
            ->icon('tabler-receipt-2')
            ->badge(1, 'warning') // Badge de alerta si faltan campos
            ->fields([
                Field::text('tax_id', 'RUC / CIF')->required()->cols(6),
                Field::text('company_name', 'Razón Social')->required()->cols(6),
                Field::textarea('fiscal_address', 'Dirección Fiscal')->cols(12),
            ]),

        FormTab::make('security', 'Seguridad & Acceso')
            ->icon('tabler-shield-lock')
            ->fields([
                Field::password('password', 'Contraseña')->min(8)->cols(6),
                Field::switch('is_active', 'Cuenta Activa')->defaultValue(true)->cols(6),
            ]),
    ]);
```

### Métodos de `FormTab`

- `FormTab::make(string $id, ?string $title = null)`: Instancia la pestaña. Si `$title` se omite, se deduce automáticamente formateando el `$id`.
- `->icon(string $icon)`: Nombre del ícono (ej. Tabler Icons, Feather o FontAwesome).
- `->badge(?int $badge, ?string $color = null)`: Contador numérico o indicador visual (ej. número de errores o pendientes).
- `->fields(array $fields)`: Colección de campos contenidos dentro de la pestaña.
- `->addField(FieldContract $field)`: Agrega un campo individual a la pestaña.
- `->can(string|array $permissions)`: Oculta la pestaña completa si el usuario no tiene los permisos requeridos.

---

## 📦 Secciones Agrupadas con `FormSection`

Si prefieres mantener un formulario vertical continuo pero estructurado en **bloques o tarjetas independientes**, utiliza `FormSection`:

```php
use Warrior\SchemaBuilder\Form\Field;
use Warrior\SchemaBuilder\Form\FormSchema;
use Warrior\SchemaBuilder\Form\FormSection;

return FormSchema::make('product-form', 'Crear Producto')
    ->sections([
        FormSection::make('Información Básica')
            ->description('Datos principales de identificación y catalogación.')
            ->icon('tabler-package')
            ->cols(12)
            ->fields([
                Field::text('sku', 'Código SKU')->required()->cols(4),
                Field::text('name', 'Nombre Comercial')->required()->cols(8),
                Field::textarea('description', 'Descripción')->cols(12),
            ]),

        FormSection::make('Precios e Inventario')
            ->description('Defina el precio de venta y las alertas de stock.')
            ->icon('tabler-currency-dollar')
            ->cols(12)
            ->fields([
                Field::number('price', 'Precio de Venta')->step(0.01)->prefix('$')->required()->cols(6),
                Field::number('stock', 'Stock Inicial')->defaultValue(0)->required()->cols(6),
            ]),
    ]);
```

---

## 🏛️ Transparencia Total mediante el Patrón Composite

Una de las joyas arquitectónicas de **SchemaBuilder** es la implementación del patrón **Composite**.

Tanto `FormTab` como `FormSection` implementan `FieldContainerContract`. Esto significa que `FormSchema` puede extraer campos y compilar reglas de validación **de manera completamente transparente**:

```php
$schema = ProductSchema::form(); // Formulario organizado en 3 pestañas con 20 campos en total

// 1. Extrae automáticamente TODOS los campos de todas las pestañas:
$allFields = $schema->getFields(); // array de 20 FieldContract

// 2. Compila automáticamente las reglas de TODAS las pestañas en un solo array:
$rules = $schema->toValidationRules(isUpdate: false);
// [
//   'sku' => ['required', 'string'],
//   'price' => ['required', 'numeric'],
//   ...
// ]
```

Tu controlador de Laravel no necesita saber si el formulario en el frontend tiene 1 pestaña, 5 pestañas o 3 secciones: la lógica de validación e inserción permanece **100% idéntica y limpia**.
