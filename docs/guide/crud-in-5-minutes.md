# CRUD en 5 Minutos ⚡

En esta guía construiremos un CRUD completo de **Gestión de Productos** con columnas formateadas, filtros avanzados, validación automática y soporte para `PATCH`.

---

## Paso 1: Crea tu archivo Schema

Crea el archivo `app/Schemas/ProductSchema.php`:

```php
namespace App\Schemas;

use Warrior\SchemaBuilder\Table\TableSchema;
use Warrior\SchemaBuilder\Table\Column;
use Warrior\SchemaBuilder\Form\FormSchema;
use Warrior\SchemaBuilder\Form\FormTab;
use Warrior\SchemaBuilder\Form\Field;

class ProductSchema
{
    /**
     * Define la tabla visual y los criterios de consulta.
     */
    public static function table(): TableSchema
    {
        return TableSchema::make('products-table', 'Catálogo de Productos')
            ->subtitle('Inventario general de mercancía')
            ->endpoint('/api/v1/products')
            ->fixedHeader()
            ->selectable(true, 'id')
            ->columns([
                Column::make('name', 'Producto')->sortable(),
                Column::make('category', 'Categoría')->sortable(),
                Column::make('price', 'Precio')->currency('USD')->sortable(),
                Column::make('stock', 'Existencias')->sortable(),
                Column::make('status', 'Estado')->badge([
                    'active' => 'success',
                    'out_of_stock' => 'error',
                ]),
                Column::make('created_at', 'Registrado')->date()->sortable(),
            ])
            ->filters([
                Field::select('category', 'Filtrar por Categoría')->options([
                    'electronics' => 'Electrónica',
                    'fashion' => 'Moda y Ropa',
                    'home' => 'Hogar',
                ]),
                Field::select('status', 'Filtrar por Estado')->options([
                    'active' => 'Disponible',
                    'out_of_stock' => 'Agotado',
                ]),
            ]);
    }

    /**
     * Define los formularios de creación y edición.
     */
    public static function form(): FormSchema
    {
        return FormSchema::make('product-form', 'Expediente del Producto')
            ->tabs([
                FormTab::make('general', 'Información Básica')
                    ->icon('tabler-box')
                    ->fields([
                        Field::text('name', 'Nombre del Producto')->required()->string()->max(150)->cols(12),
                        Field::select('category', 'Categoría')->options([
                            'electronics' => 'Electrónica',
                            'fashion' => 'Moda y Ropa',
                            'home' => 'Hogar',
                        ])->required()->cols(6),
                        Field::number('price', 'Precio Unitario')->required()->min(0)->cols(6),
                    ]),

                FormTab::make('inventory', 'Inventario y Almacén')
                    ->icon('tabler-building-warehouse')
                    ->fields([
                        Field::number('stock', 'Stock Disponible')->required()->integer()->min(0)->cols(6),
                        Field::select('status', 'Estado')->options([
                            'active' => 'Disponible',
                            'out_of_stock' => 'Agotado',
                        ])->required()->cols(6),
                        Field::textarea('description', 'Notas del Producto')->rows(3)->cols(12),
                    ]),
            ]);
    }
}
```

---

## Paso 2: Crea el Controlador API

Usa el trait `HasDynamicCrudSchema`:

```php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Schemas\ProductSchema;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Warrior\SchemaBuilder\Concerns\HasDynamicCrudSchema;

class ProductController extends Controller
{
    use HasDynamicCrudSchema;

    protected function tableSchema() { return ProductSchema::table(); }
    protected function formSchema() { return ProductSchema::form(); }

    /**
     * GET /api/v1/products
     */
    public function index(Request $request): JsonResponse
    {
        $query = Product::query();

        // Puedes usar los métodos puros del schema para autorizar ordenamientos y filtros:
        $schema = $this->tableSchema();

        if ($request->filled('sort') && in_array(ltrim($request->input('sort'), '-'), $schema->getAllowedSorts(), true)) {
            $desc = str_starts_with($request->input('sort'), '-');
            $query->orderBy(ltrim($request->input('sort'), '-'), $desc ? 'desc' : 'asc');
        }

        return response()->json($query->paginate($request->input('per_page', 10)));
    }

    /**
     * POST /api/v1/products (Creación)
     */
    public function store(Request $request): JsonResponse
    {
        // Valida automáticamente contra ProductSchema::form()
        $validated = $this->validateWithSchema($request, isUpdate: false);
        $product = Product::create($validated);

        return response()->json(['message' => 'Producto creado', 'data' => $product], 201);
    }

    /**
     * PATCH /api/v1/products/{id} (Edición con Dirty Tracking)
     */
    public function update(Request $request, int $id): JsonResponse
    {
        // En PATCH, campos no enviados no provocan error de validación
        $validated = $this->validateWithSchema($request, isUpdate: true);
        $product = Product::findOrFail($id);
        $product->update($validated);

        return response()->json(['message' => 'Producto actualizado', 'data' => $product]);
    }

    /**
     * DELETE /api/v1/products/{id}
     */
    public function destroy(int $id): JsonResponse
    {
        Product::findOrFail($id)->delete();
        return response()->json(['message' => 'Producto eliminado']);
    }
}
```

---

## Paso 3: Define la Ruta con `Route::crud()`

En `routes/api.php`:

```php
use App\Http\Controllers\Api\ProductController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function () {
    Route::crud('products', ProductController::class);
});
```

---

## Paso 4: Renderiza en el Frontend (Vuexy / Vue 3)

En tu página de Vue:

```vue
<script setup>
import { CrudComponent } from '@/components/dynamic-table'
</script>

<template>
  <CrudComponent schema-url="/api/v1/products/schema" />
</template>
```

🎉 **¡Listo!** En menos de 5 minutos tienes una tabla con paginación en servidor, filtros en Drawer, búsqueda, modal de creación en pestañas, edición parcial PATCH y eliminación con confirmación accesible.
