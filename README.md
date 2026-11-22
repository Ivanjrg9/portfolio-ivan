# Portfolio de Iván Ramos Gamarra

Portfolio personal hecho a mano con HTML, CSS y JavaScript, sin librerías ni proceso de compilación.

## Cómo verlo en local

Necesita servirse por HTTP (el globo en WebGL carga una imagen). Desde esta carpeta:

```bash
python3 -m http.server 8765
```

y abre <http://localhost:8765/>.

## Estructura

- `index.html`: contenido (portada, quién soy, experiencia, formación, proyectos y contacto).
- `style.css`: estilos, mobile-first.
- `script.js`: globo terráqueo en WebGL, galería de fotos, lista de proyectos con vista previa y barra superior.
- `assets/`: fotos, capturas de los proyectos y el mapa nocturno de la Tierra.

## Cómo tocar cosas habituales

- **Añadir un proyecto:** copia un bloque `<li class="proj">` de la sección Proyectos, cambia el texto, el enlace (`data-url` y `href`) y la captura en `assets/`. Si todavía no tiene web pública, deja `data-url=""` y usa un `<div class="proj__row">` en lugar de un `<a>`.
- **Añadir una foto a la galería:** añade un `<img class="shot__img">` dentro de `#shot` (formato 4:5, unos 1080×1350). Los puntos de la galería se generan solos.
- **Enlace a RamoStudio:** bloque `.promo` al final de Proyectos y entrada de experiencia.

## Créditos

- Diseño inspirado en la plantilla «Tech Website Dark Theme» de Prasad Lakhara.
- Mapa nocturno de la Tierra: NASA Earth Observatory, «Black Marble» (dominio público).
- Tipografía: Poppins (Google Fonts).
