# RadioDent · Radiología Dental Interactiva

Aplicación de una sola página (SPA) para **aprender y enseñar radiología dental**.
Combina un atlas anatómico interactivo de endodoncia con un módulo de IA que analiza
tus propias radiografías (capturas o documentos JPG/PNG/WEBP/PDF tomados en la clínica).

## Módulos

| Módulo | Descripción |
|---|---|
| **Modo Aprendizaje** | Radiografía vectorial SVG de un molar inferior con capas anatómicas interactivas (hover o botones) y fichas clínicas flotantes. |
| **Simulador de Filtros** | Sliders de brillo y contraste que aplican `filter: brightness() contrast()` en tiempo real, más inversión de imagen. |
| **Quiz de Diagnóstico** | Preguntas de localización por clic sobre la imagen, con confeti, feedback educativo y pistas visuales. |
| **Mi Radiografía (IA)** | Sube una radiografía real y obtén un informe educativo generado por la API de Claude: tipo de imagen, estructuras anatómicas, hallazgos (cordales y su angulación, coronas, endodoncias, ortodoncia, sospechas patológicas) y puntos didácticos. |

La barra lateral incluye una **leyenda fija** con los conceptos de *radiopaco* (blanco)
y *radiolúcido* (negro).

## Módulo de IA — cómo funciona

- Acepta **JPG, PNG, WEBP y PDF** (la primera página del PDF se renderiza a imagen con pdf.js).
- La imagen se procesa **localmente en el navegador** y se envía directamente a la API de
  Anthropic mediante `anthropic-dangerous-direct-browser-access`. La respuesta llega en
  **streaming** (modelo `claude-opus-4-8`, *thinking* adaptativo).
- La **clave API** se guarda solo en `localStorage` del navegador; no hay servidor intermedio.
- **Uso educativo**: no sustituye el diagnóstico profesional. Anonimiza las imágenes
  (nombres, fechas, identificadores del paciente) antes de subirlas.

## Ejecución local

No requiere build en runtime (Tailwind se compila a un CSS estático):

```bash
# Servir como sitio estático
python3 -m http.server 8080      # → http://localhost:8080

# Recompilar Tailwind tras cambiar clases
npm install
npm run build                    # genera dist/tailwind.css
```

## Despliegue

Es un sitio estático: `index.html`, `app.js`, `styles.css`, `dist/` y `vendor/`.
`vercel.json` lo configura sin paso de build. Para desplegar en Vercel basta con
importar el repositorio o ejecutar `vercel`.

## Stack

- HTML5 + SVG vectorial procedural (sin imágenes externas para la radiografía demo)
- Tailwind CSS compilado estáticamente + CSS propio para animaciones
- JavaScript vanilla (ES2020), sin frameworks ni build en runtime
- pdf.js (build legacy vendorizado) para renderizar PDFs
- API de Claude (visión + streaming) para el análisis de radiografías reales
