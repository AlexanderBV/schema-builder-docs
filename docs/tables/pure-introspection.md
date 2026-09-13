# Introspección Pura (Zero-Coupling) 🔌

Uno de los mayores logros de arquitectura de **Laravel SchemaBuilder** es su **total y absoluto desacoplamiento** de cualquier librería de base de datos o Query Builder.

---

## 🎯 El Principio de Pureza

`warrior/schema-builder` **no contiene** dependencias de ORMs pesados ni macros automáticas que contaminen tu entorno.

Para evitar que debas duplicar en tu controlador las listas de columnas que pueden ordenarse o filtrarse, `TableSchema` provee métodos puros que retornan arrays estándar de PHP (`array<string>`):

```php
$schema = UserSchema::table();

// 1. Columnas donde configuraste ->sortable(true)
$sorts = $schema->getAllowedSorts();
// ['name', 'price', 'created_at']

// 2. Filtros del Drawer lateral + Filtros de Pestañas + 'trashed' (si aplica)
$filters = $schema->getAllowedFilters();
// ['category', 'status', 'trashed']

// 3. Campos autorizados para búsqueda global
$search = $schema->getAllowedSearch();
// ['name', 'email', 'sku']
```

---

## 🚀 Uso en Diferentes Motores

### Con `warrior/api-query-builder` (rest-procesor):
```php
return User::apiQuery()
    ->allowedSorts($schema->getAllowedSorts())
    ->allowedFilters($schema->getAllowedFilters())
    ->allowedSearch($schema->getAllowedSearch())
    ->response();
```

### Con `spatie/laravel-query-builder`:
```php
return QueryBuilder::for(User::class)
    ->allowedSorts($schema->getAllowedSorts())
    ->allowedFilters($schema->getAllowedFilters())
    ->paginate();
```

### Con Eloquent Nativo:
```php
$query = User::query();

// Ordenamiento seguro validado contra el schema
if ($request->filled('sort')) {
    $col = ltrim($request->input('sort'), '-');
    if (in_array($col, $schema->getAllowedSorts(), true)) {
        $query->orderBy($col, str_starts_with($request->input('sort'), '-') ? 'desc' : 'asc');
    }
}
```
