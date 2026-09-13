# Laravel SchemaBuilder - Documentación Oficial ⚡

Sitio de documentación interactivo construido con [VitePress](https://vitepress.dev/) para el paquete [`warrior/schema-builder`](https://github.com/AlexanderBV/schema-builder).

> 🌐 **Sitio en Vivo:**  
> **[https://alexanderbv.github.io/schema-builder-docs/](https://alexanderbv.github.io/schema-builder-docs/)**

---

## 🚀 Desarrollo Local

```bash
# 1. Instalar dependencias de Node.js
npm install

# 2. Iniciar servidor de desarrollo en vivo con Hot Reload
npm run docs:dev

# 3. Compilar para producción (genera bundle estático en docs/.vitepress/dist)
npm run docs:build

# 4. Previsualizar la compilación de producción localmente
npm run docs:preview
```

---

## 📦 Despliegue Automático en GitHub Pages

Este repositorio incluye un flujo de trabajo de GitHub Actions en `.github/workflows/deploy.yml`.

Para activarlo en GitHub:
1. Ve al repositorio en GitHub: **Settings** ➔ **Pages**.
2. En **Build and deployment** ➔ **Source**, selecciona **GitHub Actions**.
3. Cada vez que hagas `git push origin main`, el sitio se compilará y publicará automáticamente.
