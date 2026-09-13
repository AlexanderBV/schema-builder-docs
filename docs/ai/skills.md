---
title: Agentes de IA & Skills (Codex, Cursor, Claude, Gemini, Antigravity)
description: Suite oficial de skills, reglas e instrucciones para Agentes de IA (OpenAI Codex, Cursor, Claude Code, Gemini CLI, Antigravity, Windsurf) para Laravel SchemaBuilder.
---

# 🤖 Agentes de IA & Skills Oficiales

Acelera tu flujo de trabajo y dile adiós a la configuración manual de prompts. Diseñado específicamente para que los asistentes de inteligencia artificial más avanzados entiendan las convenciones, patrones de diseño y contratos JSON de **`warrior/schema-builder`** con precisión quirúrgica.

El paquete oficial [**`schema-builder-skills`**](https://github.com/AlexanderBV/schema-builder-skills) proporciona un conjunto exhaustivo de instrucciones, validadores, ejemplos y contratos tipados listos para importar en tus herramientas de desarrollo con IA preferidas.

---

## 📥 Opciones de Descarga e Integración

Elige el método que mejor se adapte a tu entorno de trabajo:

### Opción 1: Descarga Manual Directa (.ZIP)
Si prefieres no usar Git ni la terminal para instalar las skills, puedes descargar el archivo comprimido directamente:

👉 [**📦 Descargar schema-builder-skills.zip (Última versión)**](https://github.com/AlexanderBV/schema-builder-skills/archive/refs/heads/main.zip)

Descomprime el archivo y copia los archivos según el agente que utilices (revisa las secciones de abajo).

---

### Opción 2: Descarga Rápida con cURL (1 Solo Comando, sin clonar Git)

Descarga directamente el archivo de configuración que necesitas en la raíz de tu proyecto Laravel:

::: code-group
```bash [OpenAI Codex (.codex)]
mkdir -p .codex/schema-builder
curl -sSL https://raw.githubusercontent.com/AlexanderBV/schema-builder-skills/main/skills/schema-builder/SKILL.md -o .codex/schema-builder/SKILL.md
```

```bash [Cursor & Windsurf (.cursorrules)]
curl -sSL https://raw.githubusercontent.com/AlexanderBV/schema-builder-skills/main/rules/.cursorrules -o .cursorrules
```

```bash [Claude Code (CLAUDE.md)]
curl -sSL https://raw.githubusercontent.com/AlexanderBV/schema-builder-skills/main/rules/CLAUDE.md -o CLAUDE.md
```

```bash [Estándar Universal (AGENTS.md)]
curl -sSL https://raw.githubusercontent.com/AlexanderBV/schema-builder-skills/main/rules/AGENTS.md -o AGENTS.md
```
:::

---

### Opción 3: Clonar el Repositorio de Skills

```bash
git clone https://github.com/AlexanderBV/schema-builder-skills.git
```

---

## 🛠️ Guía de Integración por Herramienta de IA

### 1. OpenAI Codex (`.codex/`)

Si tu proyecto o flujo de trabajo utiliza la CLI de OpenAI Codex o la convención de carpeta `.codex/`:

1. Crea la carpeta de la skill dentro de tu proyecto Laravel:
   ```bash
   mkdir -p .codex/schema-builder
   ```
2. Descarga o copia `SKILL.md` dentro de ella:
   ```bash
   curl -sSL https://raw.githubusercontent.com/AlexanderBV/schema-builder-skills/main/skills/schema-builder/SKILL.md -o .codex/schema-builder/SKILL.md
   ```
3. O si descargaste el ZIP, simplemente arrastra la carpeta `skills/schema-builder/` a `.codex/schema-builder/`.

Codex indexará automáticamente la skill y podrá ejecutar:
```bash
# Crear un nuevo esquema con el scaffold oficial:
php artisan make:schema ClientSchema --model=Client

# Inspeccionar el esquema en la terminal:
php artisan schema:inspect "App\Schemas\ClientSchema"
```

---

### 2. Google Gemini CLI / Google Antigravity

Si utilizas el ecosistema de agentes de Google (Gemini Code Assist, Antigravity CLI o extensiones de terminal):

::: code-group
```bash [Global (Recomendado)]
# Clona e instala la skill globalmente en tu máquina:
mkdir -p ~/.gemini/config/skills
git clone https://github.com/AlexanderBV/schema-builder-skills.git /tmp/sb-skills
cp -r /tmp/sb-skills/skills/schema-builder ~/.gemini/config/skills/
rm -rf /tmp/sb-skills
```

```bash [Por Proyecto]
# O instálalo en el directorio .agents de tu proyecto Laravel:
mkdir -p .agents/skills
git clone https://github.com/AlexanderBV/schema-builder-skills.git .agents/skills/schema-builder-skills
```
:::

A partir de este momento, el agente activará automáticamente la skill cuando solicites crear esquemas, tablas con formateadores, formularios reactivos o controladores CRUD con `warrior/schema-builder`.

---

### 3. Cursor IDE & Windsurf

Para que Cursor o Windsurf apliquen siempre las convenciones correctas al generar código en tu proyecto:

1. Clona o descarga el archivo [`.cursorrules`](https://github.com/AlexanderBV/schema-builder-skills/blob/main/rules/.cursorrules).
2. Cópialo en la raíz de tu proyecto Laravel:

```bash
curl -o .cursorrules https://raw.githubusercontent.com/AlexanderBV/schema-builder-skills/main/rules/.cursorrules
```

O agrégalo a tu archivo existente `.cursorrules` o `.windsurfrules`.

---

### 4. Claude Code / Anthropic CLI

Para usuarios de Claude Code en terminal:

1. Copia el archivo [`CLAUDE.md`](https://github.com/AlexanderBV/schema-builder-skills/blob/main/rules/CLAUDE.md) en la raíz de tu repositorio:

```bash
curl -o CLAUDE.md https://raw.githubusercontent.com/AlexanderBV/schema-builder-skills/main/rules/CLAUDE.md
```

Claude Code leerá automáticamente las directivas y generará código respetando:
- El uso de `Field::[type]()` en lugar de strings arbitrarios.
- La configuración de `fixedHeader()` por defecto en tablas.
- El trait `HasDynamicCrudSchema` en controladores con `$this->validateWithSchema($request)`.
- El aprovechamiento de la pura introspección (`getAllowedSorts()`, `getAllowedFilters()`, `getAllowedSearch()`).

---

### 5. Integración Manual: Copiar y Pegar Prompt del Sistema

Si utilizas la interfaz web de **ChatGPT**, **Claude.ai**, **GitHub Copilot Chat** o las Instrucciones Personalizadas (Custom Instructions) de tu IDE, copia y pega el siguiente bloque de directivas maestras:

::: details 📋 Haz clic aquí para copiar el Prompt de Instrucciones Personalizadas
```text
Eres un ingeniero experto en Laravel especializado en la librería oficial "warrior/schema-builder".
Sigue siempre las siguientes reglas de arquitectura y diseño:

1. ESQUEMAS UNIFICADOS:
   - Todo esquema debe extender Warrior\SchemaBuilder\Schema e implementar table() y form() (y opcionalmente detail()).
   - Los esquemas se ubican en app/Schemas/ y actúan como única fuente de la verdad para tablas, formularios y validación.

2. MOTOR DE FORMULARIOS:
   - Usa los métodos fábrica de Field:: (Field::text, Field::email, Field::password, Field::number, Field::textarea, Field::select, Field::dynamicSelect, Field::radio, Field::checkbox, Field::switch, Field::date, Field::datetime, Field::file, Field::color, Field::hidden).
   - Para selects remotos o en cascada, usa siempre Field::dynamicSelect('field', 'Label')->endpoint('/url')->dependsOn('parent_field')->queryParams([...]).
   - Aplica el grid de 12 columnas con ->colSpan(1..12).
   - Para visibilidad reactiva usa ->visibleWhen('campo', 'valor') o ->visibleWhen('campo', 'in', [...]).
   - Asigna reglas con ->rules([...]) o ->required().

3. MOTOR DE TABLAS:
   - Declara columnas con Column::make('campo', 'Label').
   - Formateadores visuales disponibles: AvatarFormatter, BadgeFormatter, CurrencyFormatter, DateFormatter, DateTimeFormatter, NumberFormatter, BooleanFormatter, LinkFormatter, CustomFormatter.
   - Las cabeceras fijas vienen habilitadas por defecto (fixedHeader = true).
   - Configura ->striped(), ->hover(), ->bordered(), ->pagination(15), ->tabs([...]), ->softDeletes().

4. CONTROLADORES:
   - Usa el trait Warrior\SchemaBuilder\Traits\HasDynamicCrudSchema.
   - Declara: protected string $schemaClass = TuSchema::class;
   - En store() y update() valida con $this->validateWithSchema($request, $id, additionalRules: [...]).
   - Esto expone automáticamente los endpoints /schema y /schema/ui.

5. SINERGIA CON API QUERY BUILDER:
   - No dupliques filtros ni ordenamientos. Usa introspección pura:
     $table = (new TuSchema())->table();
     TuModelo::apiQuery($request)
         ->allowedSorts($table->getAllowedSorts())
         ->allowedFilters($table->getAllowedFilters())
         ->allowedSearch($table->getAllowedSearch())
         ->response();

6. RUTAS:
   - Registra CRUD y esquemas en una sola línea: Route::crud('/recurso', RecursoController::class);
```
:::

---

## 🎯 ¿Qué Aprende el Agente de IA con esta Skill?

Al dotar a tu agente de esta skill, evitarás los errores típicos de las IAs al generar código:

| Sin la Skill ❌ | Con SchemaBuilder Skill ✅ |
| :--- | :--- |
| Inventa métodos inexistentes como `Field::customInput()` | Utiliza los **15 tipos oficiales de campo** (`Field::text()`, `Field::dynamicSelect()`, etc.) |
| Configura selects remotos con lógica manual de frontend | Usa `Field::dynamicSelect()->endpoint()->dependsOn()` serializando el contrato `optionsSource` |
| Duplica reglas en FormRequests y controladores | Extrae reglas limpiamente con `$this->validateWithSchema($request)` |
| Duplica filtros y ordenamientos en controladores | Aplica **introspección pura** con `$table->getAllowedSorts()` y el bridge de `api-query-builder` |
| Olvida fijar el header de tablas | Configura `fixedHeader()` automáticamente para tablas de alta densidad |

---

## 💡 Ejemplos de Prompts Listos para Usar

Una vez instalada la skill en tu entorno, puedes pedirle a tu agente tareas de alto nivel como:

### Ejemplo 1: Generar un Esquema Completo con Selects Dependientes
> *"Crea un ClientSchema para Laravel que administre clientes corporativos. Necesito columnas de tabla con AvatarFormatter para el logo, BadgeFormatter para el estado y DateFormatter para la fecha de registro. En el formulario, incluye campos de contacto y un dynamicSelect para ciudades dependiente de departamento."*

### Ejemplo 2: Controlador CRUD con Validación Introspectiva
> *"Genera un ClientController en Laravel que implemente HasDynamicCrudSchema para ClientSchema. En store() y update() valida con el schema asegurando que el tax_id sea único ignorando el ID actual en updates."*

### Ejemplo 3: Sinergia Total con ApiQueryBuilder
> *"Implementa el método index() de ClientController conectando ClientSchema con Client::apiQuery() usando introspección pura para filtros, ordenamientos y búsqueda global."*

---

## 🧪 Pruebas de Consistencia Automatizadas

El repositorio de skills incluye un script de validación que puedes ejecutar en cualquier momento para comprobar que todas las referencias, sintaxis PHP y contratos de evaluación estén intactos:

```bash
bash scripts/run-tests.sh
```

Salida esperada:
```text
=== Running SchemaBuilder Skill Verification Suite ===

✅ PASS: SKILL.md exists
✅ PASS: SKILL.md has valid name in frontmatter
✅ PASS: SKILL.md has description block in frontmatter
✅ PASS: Referenced file 'references/fields-and-forms.md' exists
✅ PASS: Referenced file 'references/tables-and-formatters.md' exists
✅ PASS: Referenced file 'references/laravel-and-bridge.md' exists
✅ PASS: Referenced file 'examples/UserSchema.php' exists
✅ PASS: Referenced file 'examples/UserController.php' exists
✅ PASS: Referenced file 'examples/UserRequest.php' exists
✅ PASS: PHP syntax check passes for UserSchema.php
✅ PASS: PHP syntax check passes for UserController.php
✅ PASS: PHP syntax check passes for UserRequest.php
✅ PASS: Rule / Eval file 'AGENTS.md' exists
✅ PASS: Rule / Eval file 'CLAUDE.md' exists
✅ PASS: Rule / Eval file '.cursorrules' exists
✅ PASS: Rule / Eval file 'test_cases.json' exists

--------------------------------------------------
Results: 16 assertions passed.
🎉 ALL CHECKS PASSED SUCCESSFULLY!
```
