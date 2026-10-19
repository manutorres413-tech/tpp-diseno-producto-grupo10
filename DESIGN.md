---
name: AURA
description: Página del proyecto AURA, funda de silicona para procesadores auditivos. Grupo 10, Diseño del Producto, UTN FRBA.
colors:
  petroleo: "#1F5E5B"
  petroleo-hondo: "#133B39"
  petroleo-claro: "#DCE7E4"
  arena: "#E8DCC8"
  arena-suave: "#D6CDBB"
  arena-clara: "#EDE8DF"
  papel: "#F7F3EC"
  blanco: "#FFFFFF"
  grafito: "#2B2B2B"
  grafito-2: "#5C5A55"
  grafito-suave: "#B9B3A8"
  coral: "#F08A3C"
  placa: "#E9E7E3"
  rc-fondo: "#D6D7D8"
  rc-texto: "#45443F"
typography:
  logo:
    fontFamily: "Nunito, ui-rounded, system-ui, sans-serif"
    fontSize: "clamp(5.5rem, 13vw, 9.5rem)"
    fontWeight: 900
    lineHeight: 0.9
    letterSpacing: "-0.03em"
  display:
    fontFamily: "Nunito, ui-rounded, system-ui, sans-serif"
    fontSize: "clamp(2.1rem, 4.4vw, 3.5rem)"
    fontWeight: 800
    lineHeight: 1.04
    letterSpacing: "-0.025em"
  headline:
    fontFamily: "Nunito, ui-rounded, system-ui, sans-serif"
    fontSize: "clamp(1.3rem, 2vw, 1.6rem)"
    fontWeight: 800
    lineHeight: 1.15
    letterSpacing: "-0.015em"
  cifra:
    fontFamily: "Nunito, ui-rounded, system-ui, sans-serif"
    fontSize: "clamp(2.3rem, 4.5vw, 3.3rem)"
    fontWeight: 900
    lineHeight: 1
    letterSpacing: "-0.03em"
  lede:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Segoe UI', Roboto, sans-serif"
    fontSize: "clamp(1.1rem, 1.6vw, 1.3rem)"
    fontWeight: 400
    lineHeight: 1.5
  body:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Segoe UI', Roboto, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.55
  label:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Segoe UI', Roboto, sans-serif"
    fontSize: "0.8125rem"
    fontWeight: 500
    lineHeight: 1.3
    letterSpacing: "0.01em"
rounded:
  sm: "8px"
  md: "14px"
  xl: "28px"
  pill: "999px"
spacing:
  gutter: "clamp(1rem, 4vw, 2.5rem)"
  ancho: "1180px"
  barra: "3.5rem"
  capitulo: "clamp(4.5rem, 10vw, 8rem)"
components:
  boton-arena:
    backgroundColor: "{colors.arena}"
    textColor: "{colors.petroleo-hondo}"
    rounded: "{rounded.pill}"
    padding: "0.7rem 1.35rem"
    height: "2.9rem"
  boton-petroleo:
    backgroundColor: "{colors.petroleo}"
    textColor: "{colors.blanco}"
    rounded: "{rounded.pill}"
    padding: "0.7rem 1.35rem"
    height: "2.9rem"
  etapa:
    backgroundColor: "{colors.petroleo}"
    textColor: "{colors.arena}"
    rounded: "{rounded.md}"
    size: "3.4rem"
  etapa-indice-activa:
    backgroundColor: "{colors.coral}"
    textColor: "{colors.grafito}"
    rounded: "{rounded.sm}"
    size: "1.45rem"
  panel:
    backgroundColor: "{colors.blanco}"
    rounded: "{rounded.xl}"
    padding: "clamp(1.4rem, 3vw, 2.2rem)"
  barra-dato:
    backgroundColor: "{colors.grafito-suave}"
    rounded: "{rounded.pill}"
    height: "0.5rem"
---

# Design System: AURA

## Overview

**Creative North Star: "El estuche desplegado"**

La página se lee como el estuche de AURA abierto sobre la mesa: tapa petróleo con el logo, interior de papel claro y cada objetivo del trabajo práctico (A a J) en su propio compartimento. El público son los docentes de la cátedra, así que manda la evidencia: cifras grandes, tablas legibles, láminas que se amplían y el modelo 3D. La marca aporta calma y calidez, nunca ruido.

La referencia de oficio es la de Apple: mucho aire, una sola idea por bloque, fotos de producto sobre fondos neutros y movimiento solo donde explica algo. Hay dos tramos atados al scroll y los dos explican el producto: la funda que se calza (colocación) y el recorrido de cinco escenas.

**Orden de la página:** tapa, comercial, A·B problema, C sondeo, C mercado, D brief, E alternativas, F selección, la funda, colocación, recorrido, visor 3D y pie. G maqueta, H ingeniería, I costos, J marca y descargas van después del visor cuando se publiquen (hoy están sólo en la rama local `completa`). A·B, C, D y F se muestran plegados: cabeza visible y botón «Ver todo el objetivo».

**Key Characteristics:**
- Capítulos alternan papel, blanco, arena, petróleo y grafito para marcar ritmo sin bordes.
- Cada capítulo abre con la etapa (letra del objetivo) y un título Nunito 800.
- Coral escaso: estado activo del índice, el PVP en la curva, la Q en la cebolla y el arco del logo.
- Renders de producto propios, nunca stock.

## Colors

Petróleo profundo y arena cálida sobre papel; el coral aparece como una chispa.

### Primary
- **Verde petróleo** (#1F5E5B): tapa, capítulos oscuros, etapas, dato clave de cada barra y botón principal sobre claro.
- **Petróleo hondo** (#133B39): la capa más interna de la cebolla y el fondo sólido de la barra cuando el sistema pide menos transparencia.

### Secondary
- **Arena** (#E8DCC8): texto sobre petróleo, botón principal sobre oscuro y fondo del capítulo de precio.
- **Arena suave** (#D6CDBB): texto secundario sobre petróleo (4,7:1).
- **Arena clara** (#EDE8DF): texto sobre grafito (comercial y pie) y pie del visor de imágenes.

### Tertiary
- **Coral** (#F08A3C): arco del logo, etapa activa del índice, el punto de precio elegido y la Q. Sobre petróleo da 3:1, así que va solo en gráficos o texto grande.

### Neutral
- **Papel** (#F7F3EC): fondo base de la página.
- **Blanco** (#FFFFFF): capítulos alternos, paneles y placas de las vistas técnicas.
- **Grafito** (#2B2B2B): texto principal y la sección del comercial.
- **Grafito 2** (#5C5A55): texto secundario sobre claro.
- **Grafito suave** (#B9B3A8): texto secundario sobre grafito y relleno de las barras que no son el dato clave.
- **Petróleo claro** (#DCE7E4): fila destacada de AURA en tablas.
- **Placa** (#E9E7E3): fondo detrás de los renders.
- **Fondo del recorrido** (#D6D7D8) y **texto del recorrido** (#45443F): el gris de estudio de las tomas, para que el escenario y el video sean un mismo plano.

### Named Rules
**La regla de la chispa.** El coral nunca pinta superficies grandes ni texto de cuerpo. Marca una sola cosa por vista.

## Typography

**Display Font:** Nunito 800/900 (con ui-rounded y system-ui)
**Body Font:** fuente del sistema (-apple-system, SF Pro Text, Segoe UI, Roboto)

**Character:** Nunito redondeada y gruesa repite la forma del logo y suaviza un tema médico; el cuerpo en la fuente del sistema se lee como un informe técnico limpio.

### Hierarchy
- **Logo** (900, clamp(5.5rem, 13vw, 9.5rem), 0.9): solo en la tapa y en Marca.
- **Display** (800, clamp(2.1rem, 4.4vw, 3.5rem), 1.04): título de cada capítulo.
- **Headline** (800, clamp(1.3rem, 2vw, 1.6rem), 1.15): subtítulos y títulos de panel.
- **Cifra** (900, clamp(2.3rem, 4.5vw, 3.3rem), 1, tabular): porcentajes y montos, también el costo de reposición del problema.
- **Lede** (400, clamp(1.1rem, 1.6vw, 1.3rem), 1.5, máximo 46rem): bajada de cada capítulo.
- **Body** (400, 1.0625rem, 1.55): texto corrido, máximo 40rem. Tablas a 0.95rem con interlínea 1.4.
- **Label** (500, 0.8125rem, +0.01em): índice superior, encabezados de tabla, notas y epígrafes.

### Named Rules
**La regla del interletrado.** Los títulos grandes van con tracking negativo (-0.025em), el cuerpo en 0 y la letra chica en +0.01em. Nunca un mismo valor para todos los tamaños.

**La regla del espacio duro.** Entre número y unidad va `&nbsp;` (0,8&nbsp;mm, 63,6&nbsp;%, ≤&nbsp;2,5&nbsp;dB) para que nunca queden en líneas distintas.

## Layout

Contenido centrado en 1180px con margen lateral clamp(1rem, 4vw, 2.5rem). La barra superior usa el mismo marco: el logo arranca donde arranca el texto. Cada capítulo lleva padding vertical clamp(4.5rem, 10vw, 8rem). La cabeza de capítulo es una grilla de 3.75rem más el título, así todos los títulos empiezan en la misma columna aunque la etapa diga "A·B". Grillas con `minmax(0, 1fr)` para que ninguna tabla ensanche la página.

Cortes: 1000px (pestañas del sondeo en fila con scroll), 860px (recorrido en vertical, clips y cuadros de teléfono), 820px (grillas de dos columnas a una, cifras a dos columnas) y 560px (etapa sobre el título, índice solo con letras salvo el activo, cebolla compacta con el número arriba).

## Elevation & Depth

Sistema plano. La profundidad sale del cambio de fondo entre capítulos y de dos materiales translúcidos: la barra superior (rgba(19, 59, 57, 0.9) con blur de 20px) y la ruta del recorrido (blanco al 55 % con blur de 12px). Con `prefers-reduced-transparency` los dos pasan a sólidos. Las tablas llevan un outline de 1px hacia adentro: queda encima del fondo del encabezado y se ve en alto contraste.

## Shapes

Esquinas redondeadas generosas, coherentes con la silicona: 8px en chips y pestañas, 14px en etapas, tablas e imágenes ampliables, 28px en paneles y placas de render, píldora en botones y barras. Las imágenes heredan el radio de su botón para que el contorno de 1px siga la curva.

## Components

### Buttons
- **Shape:** píldora (999px), alto mínimo 2.9rem; ícono a 1.1rem con trazo de 2.75.
- **Primary:** arena sobre petróleo hondo en la tapa; petróleo con texto blanco sobre fondos claros.
- **Ghost:** borde arena al 45 % sobre petróleo.
- **Press:** escala a 0.96 en 150ms ease-out; con movimiento reducido, opacidad 0.85. Foco con contorno de 2px y separación de 3px.

### Navigation
Barra fija translúcida con el logo chico y el índice como chips (letra en un cuadro de 8px más el nombre), cada enlace de 44px como mínimo. Un scroll-spy marca la última parte cuyo comienzo pasó la mitad de la pantalla; la colocación, el recorrido y el visor marcan "La funda" (chip ●), y la tapa y el comercial no marcan nada. El activo lleva la letra en coral y se centra en la tira. En celular solo el activo muestra el nombre; los demás lo conservan para el lector de pantalla. Las tiras con scroll lateral (índice, pestañas, tablas) se esfuman 1.75rem del lado donde queda contenido.

### Etapa
Cuadro petróleo de 3.4rem con la letra del objetivo en Nunito 900 arena. En capítulos oscuros se invierte (arena con letra petróleo). Siempre a la izquierda del título; en celular queda arriba, sin estirarse.

### Barras de datos
Todas iguales en la página: píldora de 0.5rem sobre una pista petróleo al 10 %. El dato clave va en petróleo (y su valor también); el resto en grafito suave. Vale para el sondeo, el puntaje de las alternativas, la escalera del PVP y la viabilidad.

### Cebolla de mercado
Seis capas anidadas que van de claro a oscuro: #F4EEE3, #E7E9E1, #C9DAD5, #8FB2AC, petróleo y petróleo hondo, con la Q en coral. Los colores de texto se aplican por hijo directo, nunca por descendiente.

### Secuencia de colocación
Con el scroll (clase `viva`): lienzo fijo durante 320vh (290vh en celular) que dibuja 120 cuadros WebP, de 1200 × 900 en escritorio y 800 × 600 en el teléfono. Tres pasos de texto cambian en 0, 0.3 y 0.72: el que sale se apaga en 150ms sin moverse y el que entra espera 120ms y sube 14px en 300ms.

### Recorrido
Cinco escenas a pantalla completa (técnica de scroll-world, MIT): el scroll adelanta el tiempo de cada clip, suavizado al 18 % por cuadro de 60 Hz sin importar la frecuencia de la pantalla. El texto entra en el primer cuarto de la escena y sale en el último, sobre un velo del color del escenario. La ruta de puntos salta directo si la escena elegida está a más de una de distancia.

### Visor de imágenes
Diálogo nativo con la cruz arriba de la imagen, sobre el fondo oscuro. Entra en 220ms (opacidad y escala desde 0.97) y sale en 150ms; con movimiento reducido solo cambia la opacidad. Mientras está abierto la página no se desplaza.

### Modo quieto
Con `prefers-reduced-motion`, con la pantalla de menos de 520px de alto o con la letra raíz por encima de 20px, la colocación y el recorrido quedan apilados: foto o cuadro final y texto, sin nada fijo.

## Do's and Don'ts

### Do:
- **Do** abrir cada capítulo con etapa, título y lede, en ese orden.
- **Do** mostrar cifras con `font-variant-numeric: tabular-nums` y coma decimal.
- **Do** usar renders propios sobre placa #E9E7E3 o papel, y las vistas técnicas en placas blancas de 3:2.
- **Do** detener el movimiento con `prefers-reduced-motion` y dejar el estado final visible.
- **Do** cargar láminas y planos desde `mini/` (800px) y abrir el original en el visor.

### Don't:
- **Don't** usar coral en texto chico sobre petróleo (3:1).
- **Don't** usar selectores descendientes en componentes anidados como la cebolla de mercado: el color de una capa se filtra a las internas.
- **Don't** escribir texto dentro de los cuadros renderizados; el texto va en HTML.
- **Don't** activar `scroll-behavior: smooth`: un salto largo pasaría por todos los cuadros de la colocación y del recorrido.
- **Don't** usar raya larga en los textos; se usa guion o coma.
