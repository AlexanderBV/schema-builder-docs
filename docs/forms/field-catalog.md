# Catálogo de los 15 Tipos de Campos 📦

**SchemaBuilder** incluye un catálogo completo y tipado de **15 componentes de formulario** listos para producción. Cada campo encapsula su tipo de control HTML/Vuexy, sus atributos visuales y su compilación de validaciones.

---

## 🛠️ Métodos Universales (Disponibles en Todos los Campos)

Todos los campos heredan de la clase base `Field` y disponen de la siguiente API fluida:

```php
Field::text('campo', 'Etiqueta')
    ->placeholder('Texto de ayuda en el input...')
    ->defaultValue('Valor inicial')
    ->hint('Mensaje de ayuda ubicado debajo del input')
    ->prefix('$')                  // Prefijo visual o ícono
    ->suffix('.00')                // Sufijo visual o unidad
    ->disabled(false)              // Deshabilitar interactividad
    ->readOnly(false)              // Solo lectura
    ->cols(12)->md(6)             // Grid responsive de 12 columnas
    ->required()                   // Regla de validación
    ->extra('customProp', 'valor') // Atributos arbitrarios para el frontend
    ->can('users.edit');           // Control de permisos por rol/permiso
```

---

## 🗂️ Los 15 Tipos de Campos

### 1. `Field::text()` - Campo de Texto
Input de texto convencional para nombres, códigos, descripciones cortas.

```php
Field::text('first_name', 'Nombres')
    ->placeholder('Ej. Juan Carlos')
    ->required()
    ->min(3)
    ->max(50);
```

---

### 2. `Field::email()` - Correo Electrónico
Configura automáticamente el tipo `email` e inyecta la regla de validación `email` de Laravel en el backend.

```php
Field::email('email', 'Correo Electrónico')
    ->placeholder('usuario@empresa.com')
    ->required()
    ->unique('users', 'email');
```

---

### 3. `Field::password()` - Contraseña Oculta
Entrada con máscara de seguridad para contraseñas o tokens sensibles.

```php
Field::password('password', 'Contraseña')
    ->placeholder('••••••••')
    ->required()
    ->min(8)
    ->confirmed(); // Espera el campo password_confirmation en el payload
```

---

### 4. `Field::number()` - Entrada Numérica
Control numérico con soporte para valor mínimo, máximo y paso incremental (`step`).

```php
Field::number('stock', 'Cantidad en Almacén')
    ->min(0)
    ->max(10000)
    ->step(1)
    ->defaultValue(10);
```

---

### 5. `Field::textarea()` - Área de Texto Multilínea
Entrada expandida para notas, observaciones, comentarios o descripciones largas.

```php
Field::textarea('bio', 'Biografía Profesional')
    ->rows(4)
    ->placeholder('Escriba un breve resumen...')
    ->max(500);
```

---

### 6. `Field::select()` - Menú Desplegable (Select)
Selector con soporte para selección múltiple, formato en pastillas (chips) y autocompletado reactivo.

```php
Field::select('department_id', 'Departamento')
    ->options([
        ['label' => 'Tecnología', 'value' => 1],
        ['label' => 'Recursos Humanos', 'value' => 2],
        ['label' => 'Finanzas', 'value' => 3],
    ])
    ->multiple(false)
    ->chips(false)
    ->autocomplete(true)
    ->required();
```

> [!TIP]
> También puedes encadenar opciones individuales mediante `->option('Tecnología', 1)`.

---

### 7. `Field::radio()` - Opciones de Radio Excluyentes
Lista de opciones circulares de selección única.

```php
Field::radio('gender', 'Género')
    ->options([
        ['label' => 'Masculino', 'value' => 'M'],
        ['label' => 'Femenino', 'value' => 'F'],
        ['label' => 'Otro / Prefiero no decir', 'value' => 'O'],
    ])
    ->inline(true)
    ->defaultValue('M');
```

---

### 8. `Field::checkbox()` - Casilla de Verificación Booleana
Ideal para acuerdos de términos, confirmaciones de consentimiento o flags individuales.

```php
Field::checkbox('accept_terms', 'Acepto los términos y condiciones del servicio')
    ->required()
    ->boolean();
```

---

### 9. `Field::switch()` - Interruptor Toggle Reactivo
Interruptor tipo switch estilizado con soporte de etiquetas para estados activo/inactivo.

```php
Field::switch('is_active', 'Estado de la Cuenta')
    ->defaultValue(true)
    ->trueLabel('Activo')
    ->falseLabel('Inactivo');
```

---

### 10. `Field::date()` - Selector de Fecha
Picker de fecha con formato personalizable y restricciones de rango mínimo y máximo.

```php
Field::date('birth_date', 'Fecha de Nacimiento')
    ->format('YYYY-MM-DD')
    ->minDate('1900-01-01')
    ->maxDate(now()->toDateString())
    ->required();
```

---

### 11. `Field::datetime()` - Selector de Fecha y Hora
Picker combinado de fecha y hora para agendamientos, citas o eventos cronológicos.

```php
Field::datetime('scheduled_at', 'Fecha y Hora del Evento')
    ->format('YYYY-MM-DD HH:mm:ss')
    ->required();
```

---

### 12. `Field::dateRange()` - Selector de Rango de Fechas
Control de selección de intervalo (fecha de inicio y fin) para reportes y filtros avanzados.

```php
Field::dateRange('fiscal_period', 'Periodo Fiscal')
    ->format('YYYY-MM-DD');
```

---

### 13. `Field::file()` - Carga de Archivos
Control de carga con validación de tipo MIME y tamaño máximo en kilobytes.

```php
Field::file('curriculum', 'CV en Formato PDF')
    ->accept('application/pdf')
    ->maxSize(5120) // Máximo 5 MB (se traduce automáticamente a regla max:5120 en Laravel)
    ->multiple(false);
```

---

### 14. `Field::image()` - Carga de Imágenes con Previsualización
Especializado para avatares, fotos de productos y logos corporativos con previsualización en miniatura.

```php
Field::image('avatar', 'Foto de Perfil')
    ->accept('image/jpeg,image/png,image/webp')
    ->maxSize(2048);
```

---

### 15. `Field::hidden()` - Campo Oculto
Campo invisible en la interfaz que transporta identificadores foráneos o tokens en el payload.

```php
Field::hidden('company_id', 42);
```

---

## 📊 Resumen Rápido de la API de Campos

| Helper Estático | Clase Instanciada | Tipo JSON | Métodos Especializados |
| :--- | :--- | :--- | :--- |
| `Field::text()` | `TextField` | `'text'` | `placeholder()`, `prefix()`, `suffix()` |
| `Field::email()` | `EmailField` | `'email'` | Regla `email` automática |
| `Field::password()` | `PasswordField` | `'password'` | `confirmed()` |
| `Field::number()` | `NumberField` | `'number'` | `min()`, `max()`, `step()` |
| `Field::textarea()` | `TextareaField` | `'textarea'` | `rows()` |
| `Field::select()` | `SelectField` | `'select'` | `options()`, `multiple()`, `chips()`, `autocomplete()` |
| `Field::radio()` | `RadioField` | `'radio'` | `options()`, `inline()` |
| `Field::checkbox()` | `CheckboxField` | `'checkbox'` | `boolean()` |
| `Field::switch()` | `SwitchField` | `'switch'` | `trueLabel()`, `falseLabel()` |
| `Field::date()` | `DateField` | `'date'` | `format()`, `minDate()`, `maxDate()` |
| `Field::datetime()` | `DateTimeField` | `'datetime'` | `format()` |
| `Field::dateRange()` | `DateRangeField` | `'dateRange'` | `format()` |
| `Field::file()` | `FileField` | `'file'` | `accept()`, `maxSize()`, `multiple()` |
| `Field::image()` | `ImageField` | `'image'` | `accept()`, `maxSize()` |
| `Field::hidden()` | `HiddenField` | `'hidden'` | `value()` |
