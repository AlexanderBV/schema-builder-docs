import { defineConfig } from 'vitepress'

export default defineConfig({
  base: '/schema-builder-docs/',
  title: 'Laravel SchemaBuilder',
  description: 'Constructor declarativo, headless y desacoplado de esquemas para tablas, formularios y CRUDs dinámicos en Laravel',
  lang: 'es-ES',
  lastUpdated: true,
  cleanUrls: true,
  vite: {
    server: {
      allowedHosts: true
    }
  },

  themeConfig: {
    logo: '/logo.svg',
    siteTitle: 'SchemaBuilder',

    search: {
      provider: 'local',
      options: {
        locales: {
          root: {
            translations: {
              button: {
                buttonText: 'Buscar en la documentación...',
                buttonAriaLabel: 'Buscar'
              },
              modal: {
                noResultsText: 'No se encontraron resultados para',
                resetButtonTitle: 'Limpiar búsqueda',
                footer: {
                  selectText: 'para seleccionar',
                  navigateText: 'para navegar',
                  closeText: 'para cerrar'
                }
              }
            }
          }
        }
      }
    },

    nav: [
      { text: 'Guía', link: '/guide/getting-started', activeMatch: '/guide/' },
      { text: 'Tablas', link: '/tables/overview', activeMatch: '/tables/' },
      { text: 'Formularios', link: '/forms/overview', activeMatch: '/forms/' },
      { text: 'Detalle', link: '/detail/overview', activeMatch: '/detail/' },
      { text: 'Laravel', link: '/laravel/has-dynamic-crud-schema', activeMatch: '/laravel/' },
      { text: 'Bridge', link: '/frontend/bridge-api-query-builder', activeMatch: '/frontend/' },
      { text: 'API', link: '/api/overview', activeMatch: '/api/' },
      {
        text: 'v1.0.0',
        items: [
          { text: 'Repositorio en GitHub', link: 'https://github.com/AlexanderBV/schema-builder' },
          { text: 'Issues & Soporte', link: 'https://github.com/AlexanderBV/schema-builder/issues' },
          { text: 'Packagist', link: 'https://packagist.org/packages/warrior/schema-builder' }
        ]
      }
    ],

    sidebar: [
      {
        text: '🚀 Primeros Pasos',
        items: [
          { text: 'Introducción & Filosofía', link: '/guide/getting-started' },
          { text: 'CRUD en 5 Minutos', link: '/guide/crud-in-5-minutes' },
          { text: 'Arquitectura SOLID & Patrones', link: '/guide/architecture-and-solid' }
        ]
      },
      {
        text: '📊 Motor de Tablas (TableSchema)',
        items: [
          { text: 'Anatomía de TableSchema', link: '/tables/overview' },
          { text: 'Columnas & Formatters Visuales', link: '/tables/columns-and-formatters' },
          { text: 'Pestañas Contextuales & Soft Deletes', link: '/tables/tabs-and-soft-deletes' },
          { text: 'Filtros de Drawer & Búsqueda', link: '/tables/filters-and-search' },
          { text: 'Acciones de Fila, Toolbar & ACL', link: '/tables/actions-and-acl' },
          { text: 'Introspección Pura (Zero-Coupling)', link: '/tables/pure-introspection' }
        ]
      },
      {
        text: '📝 Motor de Formularios (FormSchema)',
        items: [
          { text: 'Anatomía de FormSchema', link: '/forms/overview' },
          { text: 'Catálogo de los 15 Tipos de Campos', link: '/forms/field-catalog' },
          { text: 'Validaciones & Dirty Tracking (PATCH)', link: '/forms/validation-rules' },
          { text: 'Pestañas (Tabs) & Secciones', link: '/forms/tabs-and-sections' },
          { text: 'Visibilidad Reactiva & Grid Responsive', link: '/forms/reactive-visibility' }
        ]
      },
      {
        text: '👁️ Motor de Detalle (DetailSchema)',
        items: [
          { text: 'Vistas de Sólo Lectura', link: '/detail/overview' }
        ]
      },
      {
        text: '⚡ Integración con Laravel',
        items: [
          { text: 'Trait HasDynamicCrudSchema', link: '/laravel/has-dynamic-crud-schema' },
          { text: 'Macro Route::crud()', link: '/laravel/route-crud-macro' },
          { text: 'Facade SchemaBuilder', link: '/laravel/facade' }
        ]
      },
      {
        text: '🧩 Frontend & Sinergia',
        items: [
          { text: 'Ecosistema Vuexy & Frontend Agnostic', link: '/frontend/vuexy-integration' },
          { text: 'La Receta del Bridge (ApiQueryBuilder)', link: '/frontend/bridge-api-query-builder' }
        ]
      },
      {
        text: '📖 Referencia Técnica',
        items: [
          { text: 'Clases, Traits y Contratos', link: '/api/overview' },
          { text: 'Enums Tipados de PHP 8.2', link: '/api/contracts-and-enums' }
        ]
      }
    ],

    footer: {
      message: 'Liberado bajo la Licencia MIT.',
      copyright: 'Copyright © 2026 Warrior. Diseñado para la comunidad de Laravel.'
    },

    docFooter: {
      prev: 'Página anterior',
      next: 'Siguiente página'
    }
  }
})
