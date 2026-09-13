---
title: Agentes de IA & Skills (Cursor, Claude, Gemini, Antigravity)
description: Suite oficial de skills, reglas e instrucciones para Agentes de IA (Cursor, Claude Code, Gemini CLI, Antigravity, Windsurf) para Laravel SchemaBuilder.
---

# 🤖 Agentes de IA & Skills Oficiales

Acelera tu flujo de trabajo y dile adiós a la configuración manual de prompts. Diseñado específicamente para que los asistentes de inteligencia artificial más avanzados entiendan las convenciones, patrones de diseño y contratos JSON de **`warrior/schema-builder`** con precisión quirúrgica.

El paquete oficial [**`schema-builder-skills`**](https://github.com/AlexanderBV/schema-builder-skills) proporciona un conjunto exhaustivo de instrucciones, validadores, ejemplos y contratos tipados listos para importar en tus herramientas de desarrollo con IA preferidas.

---

## 📦 Repositorio Oficial

El código fuente de las skills, suites de evaluación y reglas de contexto está disponible públicamente en GitHub:

👉 [**GitHub: AlexanderBV/schema-builder-skills**](https://github.com/AlexanderBV/schema-builder-skills)

```text
schema-builder-skills/
├── skills/
│   └── schema-builder/
│       ├── SKILL.md                  # Skill principal con frontmatter YAML
│       ├── references/
│       │   ├── fields-and-forms.md   # Catálogo de 15 campos, dynamicSelect, grid y validación
│       │   ├── tables-and-formatters.md # Columnas, formateadores y pura introspección
│       │   └── laravel-and-bridge.md # HasDynamicCrudSchema, Route::crud y puente ApiQueryBuilder
│       └── examples/
│           ├── UserSchema.php        # Esquema empresarial completo
│           ├── UserController.php    # Controlador con validación y puente
│           └── UserRequest.php       # FormRequest con extracción de reglas
├── rules/
│   ├── AGENTS.md                     # Estándar universal para agentes autónomos
│   ├── CLAUDE.md                     # Instrucciones específicas para Claude Code
│   └── .cursorrules                  # Reglas para Cursor IDE y Windsurf
├── scripts/
│   └── run-tests.sh                  # Runner de pruebas automatizadas
└── tests/
    ├── validate_skill.php            # Validador de consistencia y sintaxis PHP
    └── evals/                        # Suite de evaluación con prompts y casos de prueba
```

---

## 🚀 Guía de Instalación Rápida

### 1. Google Gemini CLI / Google Antigravity

Si utilizas el ecosistema de agentes de Google (Gemini Code Assist, Antigravity CLI o extensiones de terminal):

::: code-group
```bash [Global (Recomendado)]
# Clona e instala la skill globalmente en tu máquina:
git clone https://github.com/AlexanderBV/schema-builder-skills.git /tmp/schema-builder-skills
mkdir -p ~/.gemini/config/skills
cp -r /tmp/schema-builder-skills/skills/schema-builder ~/.gemini/config/skills/
```

```bash [Por Proyecto]
# O instálalo en el directorio .agents de tu proyecto Laravel:
mkdir -p .agents/skills
git clone https://github.com/AlexanderBV/schema-builder-skills.git .agents/skills/schema-builder-skills
```
:::

A partir de este momento, el agente activará automáticamente la skill cuando solicites crear esquemas, tablas con formateadores, formularios reactivos o controladores CRUD con `warrior/schema-builder`.

---

### 2. Cursor IDE & Windsurf

Para que Cursor o Windsurf apliquen siempre las convenciones correctas al generar código en tu proyecto:

1. Clona o descarga el archivo [`.cursorrules`](https://github.com/AlexanderBV/schema-builder-skills/blob/main/rules/.cursorrules).
2. Cópialo en la raíz de tu proyecto Laravel:

```bash
curl -o .cursorrules https://raw.githubusercontent.com/AlexanderBV/schema-builder-skills/main/rules/.cursorrules
```

O agrégalo a tu archivo existente `.cursorrules` o `.windsurfrules`.

---

### 3. Claude Code / Anthropic CLI

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

### 4. GitHub Copilot & Agentes Universales (`AGENTS.md`)

El archivo [`AGENTS.md`](https://github.com/AlexanderBV/schema-builder-skills/blob/main/rules/AGENTS.md) sigue el estándar universal de contexto para LLMs:

```bash
curl -o AGENTS.md https://raw.githubusercontent.com/AlexanderBV/schema-builder-skills/main/rules/AGENTS.md
```

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
