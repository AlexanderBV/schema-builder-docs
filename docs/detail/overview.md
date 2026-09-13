# Vistas de Sólo Lectura (DetailSchema) 👁️

En muchos sistemas empresariales, la vista de consulta o inspección (*Show / Detail*) tiene requerimientos muy distintos al formulario de edición:

- No muestra inputs interactivos, sino **etiquetas formateadas, insignias (badges), avatares y fechas humanizadas**.
- Permite visualizar campos sensibles o de sólo lectura que **nunca** deberían ser editables (ej. `id`, `uuid`, `created_at`, `ip_address`, `last_login_at`).
- Puede organizarse en pestañas de auditoría o trazabilidad.

**`DetailSchema`** es el motor declarativo de SchemaBuilder para generar especificaciones JSON de paneles y vistas de inspección.

---

## 🎯 Fallback Automático: Cero Código Extra si no lo Necesitas

Si tu entidad es sencilla y no deseas escribir un esquema de detalle específico, **no estás obligado a hacerlo**.

El trait [`HasDynamicCrudSchema`](/laravel/has-dynamic-crud-schema) comprueba si existe un `detailSchema()`. Si retorna `null`, el endpoint `/schema` automáticamente entrega el `formSchema()`:

```php
// En HasDynamicCrudSchema:
public function schema(): JsonResponse
{
    $detail = $this->detailSchema();

    return response()->json([
        'table'  => $this->tableSchema()->toArray(),
        'form'   => $this->formSchema()->toArray(),
        'detail' => $detail?->toArray() ?? $this->formSchema()->toArray(),
    ]);
}
```

El componente `<CrudComponent />` en el frontend detecta este fallback y renderiza los campos del formulario en modo estricto de sólo lectura (`disabled: true`).

---

## 🏗️ Creando un `DetailSchema` Dedicado

Cuando deseas una experiencia de inspección de primer nivel, defines un `DetailSchema`:

```php
namespace App\Schemas;

use Warrior\SchemaBuilder\Detail\DetailField;
use Warrior\SchemaBuilder\Detail\DetailSchema;
use Warrior\SchemaBuilder\Detail\DetailTab;

class InvoiceSchema
{
    public static function detail(): DetailSchema
    {
        return DetailSchema::make('invoice-detail', 'Detalle de Factura Electrónica')
            ->tabs([
                DetailTab::make('general', 'Comprobante')
                    ->icon('tabler-receipt-2')
                    ->fields([
                        DetailField::make('series_number', 'Comprobante')
                            ->cols(12)->md(4),

                        DetailField::make('issue_date', 'Fecha de Emisión')
                            ->date('DD/MM/YYYY')
                            ->cols(12)->md(4),

                        DetailField::make('status', 'Estado SUNAT')
                            ->badge([
                                'accepted' => 'success',
                                'rejected' => 'error',
                                'pending'  => 'warning',
                            ])
                            ->cols(12)->md(4),

                        DetailField::make('total', 'Importe Total')
                            ->currency('USD', 'en-US', 2)
                            ->cols(12)->md(6),

                        DetailField::make('hash', 'Firma Digital / Hash')
                            ->cols(12)->md(6),
                    ]),

                DetailTab::make('audit', 'Auditoría & Trazabilidad')
                    ->icon('tabler-history')
                    ->fields([
                        DetailField::make('created_at', 'Creado El')
                            ->datetime('DD/MM/YYYY HH:mm:ss')
                            ->cols(6),

                        DetailField::make('updated_at', 'Última Modificación')
                            ->datetime('DD/MM/YYYY HH:mm:ss')
                            ->cols(6),

                        DetailField::make('metadata', 'Payload JSON Original')
                            ->json()
                            ->cols(12),
                    ]),
            ]);
    }
}
```

---

## 📦 Métodos de `DetailField`

Cada celda de detalle hereda de `DetailField` y dispone de los mismos formatters visuales de alto rendimiento del motor de tablas:

### Formatters Disponibles

- `->avatar(?string $avatarKey = null, ?string $subtitleKey = null)`: Renderiza un avatar circular con título y subtítulo.
- `->badge(array $colorMap = [], array $labelMap = [])`: Convierte estados o enums en pastillas coloreadas.
- `->currency(string $currency = 'USD', string $locale = 'en-US', int $decimals = 2)`: Formatea montos monetarios según el estándar `Intl.NumberFormat`.
- `->date(string $format = 'DD/MM/YYYY')`: Formato visual de fecha.
- `->datetime(string $format = 'DD/MM/YYYY HH:mm')`: Formato visual de fecha y hora.
- `->boolean()`: Renderiza un chip o check visual booleano.
- `->link()`: Renderiza el valor como un enlace clicable.
- `->json()`: Renderiza el contenido en un visor formateado tipo árbol JSON.

### Grid Responsive

Al igual que en los formularios, puedes definir el ancho en grid de 12 columnas:
- `->cols(12)`
- `->sm(6)`
- `->md(4)`
- `->lg(3)`

---

## ⚡ Conexión con `<CrudComponent />`

Cuando el usuario hace clic en el botón de ver detalle [👁] en la fila de una tabla:

1. El componente solicita el registro vía `GET /api/v1/invoices/{id}`.
2. Consulta la especificación `detail` recibida previamente en `GET /api/v1/invoices/schema`.
3. Muestra un drawer lateral o un diálogo modal proyectando cada campo con su formatter respectivo (`badge`, `currency`, `avatar`, etc.).

¡El desarrollador frontend no tiene que diseñar una vista de detalle manualmente para cada tabla de la base de datos!
