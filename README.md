# Guía de Recursos LGTBIQ+ del Ayuntamiento de Burlada | Burlatako Udalaren LGTBIQ+ Baliabideen Gida

Portal web **estático** (HTML + CSS + JavaScript sin base de datos ni servicios externos), bilingüe castellano/euskera adaptable a otros idiomas. Se prepara para el árabe.

## Estructura
```
index.html          Página única (navegación por #/es/... y #/eu/...)
css/style.css       Diseño (modo claro/oscuro, responsive)
js/app.js           Lógica: rutas, buscador, filtros, fichas
data/resources.json Recursos (aquí se edita el contenido)
data/categories.json Categorías, subcategorías, colectivos, ámbitos, enlaces de interés
data/i18n.json      Textos de la interfaz ES/EU
assets/logo.svg     Logotipo e icono
```

## Probar en local
Los navegadores no cargan JSON desde `file://`. Desde esta carpeta:
`python3 -m http.server 8000` → abrir http://localhost:8000

## Manual: añadir, modificar y eliminar recursos
Edite solo `data/resources.json`. Cada recurso es un bloque `{ ... }` dentro de `"resources": [ ... ]`, separado por comas.
- **Añadir:** copie un bloque existente, cambie `id` (único, sin espacios ni tildes) y los textos.
- **Modificar:** cambie el texto entre comillas. Los campos con `es` y `eu` son bilingües.
- **Desactivar (recomendado):** `"active": false`. No se muestra pero se conserva.
- **Eliminar:** borre el bloque entero (cuide las comas).
- **Destacar en portada:** `"featured": true`.
- **Campos opcionales:** si omite `address`, `phone`, `email`, `web`, `social`, `schedule`, `access`, `services` o `tags`, no aparecen en la ficha.
- `category` y `subcategory`: use los `id` de `categories.json`. `scope`: municipal, comarcal, foral o estatal. `audiences`: ids de `categories.json`.
- `map`: enlace opcional a un mapa; si no existe se genera uno desde `address`.
- `demo: true` muestra el aviso de "recurso de demostración"; elimínelo en recursos reales.
- Nuevas categorías, subcategorías, colectivos o ámbitos: `categories.json`. Textos de interfaz: `i18n.json`.
Tras editar, valide el JSON en cualquier validador y recargue (Ctrl+F5).

## Salida rápida
El botón rojo flotante cierra la pestaña si el navegador lo permite y, si no, sustituye la página por https://www.google.es. Para cambiar el destino, edite la URL en `js/app.js` (busque `location.replace`).

## Instalar como app (pantalla de inicio)
Ya incluye `manifest.webmanifest`, iconos PNG (`assets/icon-*.png`, `apple-touch-icon.png`) y el nombre "Guía de recursos LGTBIQ+". Requiere HTTPS en producción. iPhone: Safari → Compartir → "Añadir a pantalla de inicio". Android: Chrome → menú ⋮ → "Instalar app". Para cambiar el icono, sustituya los PNG manteniendo nombre y tamaño (512, 192 y 180 px, sin transparencia).

## Publicar
Copie la carpeta completa al servidor (FTP/SFTP) o súbala a un alojamiento estático (Apache, Nginx, IIS, GitHub Pages, Netlify…). No requiere PHP ni base de datos. Si va en un subdirectorio funciona igual (rutas relativas). Recomendado: HTTPS y compresión gzip.

## Estado y límites
- Accesibilidad: enlace de salto, etiquetas, foco visible, contraste cuidado, lang por idioma, anuncio de resultados. 

