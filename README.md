# Aurora — Pet Plant Finder �

Aplicación web interactiva que, a través de unas preguntas simples, sugiere la planta que mejor representa a tu mascota. Incluye navegación por secciones con bullets, animaciones suaves y un resultado con animación de carga.

## ✨ Características

- Flujo en 5 secciones: datos básicos, detalles de tu mascota, entorno, y resultado.
- Navbar de bullets con scroll suave y estados activos.
- Animaciones GSAP (ScrollTrigger, ScrollSmoother) y tipografía Playfair Display.
- Carga animada con íconos de mascotas en triángulo.
- 100% estático, responsive y listo para GitHub Pages.

## 🛠️ Tecnologías

- HTML5, CSS3 (aurora-general.css, prevention-style.css)
- JavaScript ES6+ (prevention.js)
- GSAP: ScrollTrigger, ScrollSmoother
- Phosphor Icons, Google Fonts

## 📁 Estructura

```
plan-prevencion/
├── prevention.html
├── README.md
├── assets/
│   ├── favicon.png
│   ├── imgs/
│   │   ├── logo.png
│   │   ├── icon-*.svg
│   │   ├── pets/* (png)
│   │   └── plants/* (png)
│   └── vids/
│       ├── 1.mp4
│       └── 2.mp4
├── css/
│   ├── aurora-general.css
│   └── prevention-style.css
└── js/
      └── prevention.js
```

Archivos “copy” (por ejemplo, `prevention copy.html`, `prevention copy.js`) son respaldos y no se usan en producción.

## 🚀 Uso

1) Abre `prevention.html` directamente en tu navegador.

Opcional (desarrollo): usa Live Server (VS Code) para recarga en caliente.

## � Deploy en GitHub Pages

1) Configura en GitHub: Settings → Pages → Deploy from a branch → main / root.
2) Guarda. La página quedará disponible en `https://<tu-usuario>.github.io/aurora-prevention-plan/`.

## 🧩 SEO y Favicon

- Ya incluye meta tags básicos (description, OG/Twitter) y `./assets/favicon.png`.
- Para personalizar vista previa, actualiza `./assets/imgs/logo.png` y los meta en `prevention.html`.

## 🧪 Notas de desarrollo

- Atajos de prueba (si están habilitados en `prevention.js`):
   - Ctrl+T: desbloquea la sección de resultado.
   - Ctrl+5: salta a la sección 5.
- Para desactivarlos, elimina el bloque marcado como “TEMPORARY TESTING BYPASS”.

## � Créditos

- Íconos: Phosphor Icons
- Animaciones: GSAP
- Tipografía: Google Fonts (Playfair Display)

© 2025 Aurora. Todos los derechos reservados.
