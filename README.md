# EndoRX · Simulador de Radiología Endodóntica

Aplicación interactiva de una sola página (SPA) para aprender y enseñar radiología dental
con enfoque en **endodoncia** y anatomía de los conductos radiculares.

La radiografía es un **gráfico vectorial SVG** de un molar inferior (pieza 3.6) generado
proceduralmente: incluye esmalte, dentina, cámara pulpar, conductos mesial y distal,
lámina dura, ligamento periodontal, hueso trabecular y una lesión periapical en la raíz mesial.

## Módulos

| Módulo | Descripción |
|---|---|
| **Modo Aprendizaje** | Capas SVG interactivas (hover o botones) que iluminan cada estructura anatómica con su ficha clínica flotante (tooltip). |
| **Simulador de Filtros** | Sliders de brillo y contraste que aplican `filter: brightness() contrast()` en tiempo real sobre la placa, más inversión de imagen. |
| **Quiz de Diagnóstico** | Preguntas de localización: el usuario hace clic directamente sobre la radiografía. Acierto → confeti + borde verde + feedback educativo. Fallo → borde rojo + pista visual parpadeante. |

La barra lateral incluye una **leyenda fija** con los conceptos de *radiopaco* (blanco)
y *radiolúcido* (negro).

## Ejecución

No requiere build ni dependencias (Tailwind se carga por CDN):

```bash
# Opción 1: abrir directamente
open index.html

# Opción 2: servidor local
python3 -m http.server 8080
# → http://localhost:8080
```

## Stack

- HTML5 + SVG vectorial procedural (sin imágenes externas)
- Tailwind CSS (CDN) + CSS propio para animaciones y overlays
- JavaScript vanilla (ES2020), sin frameworks ni build step
