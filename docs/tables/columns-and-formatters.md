# Columnas & Formatters Visuales 🎨

En lugar de programar celdas personalizadas a mano en Vue o React para cada entidad, las columnas de `warrior/schema-builder` incorporan **estrategias de formateo visual preconstruidas**.

---

## 🧩 Catálogo de Formatters

### 1. Formatter de Avatar (`ColumnType::AVATAR`)
Renderiza un avatar visual con iniciales o foto, acompañado de título y subtítulo:

```php
Column::make('user', 'Usuario')
    ->avatar(
        avatarKey: 'avatar_url',  // Clave de la URL de la imagen
        titleKey: 'full_name',    // Clave del texto principal
        subtitleKey: 'email'      // Clave del texto secundario
    )
    ->sortable();
```

### 2. Formatter de Badge (`ColumnType::BADGE`)
Renderiza un chip coloreado semántico según el valor de la columna:

```php
Column::make('status', 'Estado')->badge([
    'active'    => 'success',
    'pending'   => 'warning',
    'suspended' => 'secondary',
    'banned'    => 'error',
]);
```

### 3. Formatter de Moneda (`ColumnType::CURRENCY`)
Alinea automáticamente el texto a la derecha y formatea valores monetarios mediante `Intl.NumberFormat`:

```php
Column::make('total_amount', 'Total Facturado')
    ->currency(
        currency: 'USD',    // 'USD', 'EUR', 'PEN', 'MXN', 'COP'
        locale: 'en-US',    // Localización
        decimals: 2         // Número de decimales
    )
    ->sortable();
```

### 4. Formatter de Fecha y Hora (`ColumnType::DATE` / `DATETIME`)
Formatea fechas de forma legible respetando la zona horaria:

```php
// Fecha corta
Column::make('birth_date', 'Cumpleaños')->date('DD/MM/YYYY');

// Fecha y hora completa
Column::make('created_at', 'Fecha de Registro')->datetime('DD/MM/YYYY HH:mm');
```

### 5. Formatters Adicionales
```php
// Booleano: renderiza icono de check verde o cruz roja
Column::make('is_verified', 'Verificado')->boolean();

// Enlace externo clicable
Column::make('website', 'Sitio Web')->link();

// JSON: visor estructurado de objetos complejos
Column::make('metadata', 'Detalles Técnicos')->json();
```

---

## 📐 Propiedades de Columna

```php
use Warrior\SchemaBuilder\Table\Column;
use Warrior\SchemaBuilder\Enums\Alignment;

Column::make('dni', 'Documento')
    ->sortable(true)                // Habilita ordenamiento en servidor
    ->align(Alignment::CENTER)       // START, CENTER, END
    ->width('140px')                // Ancho sugerido de columna
    ->visible(true)                 // Control de visibilidad
    ->permission('users.view_dni'); // Control de acceso RBAC
```
