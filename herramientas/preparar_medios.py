"""Copia y optimiza para la web los medios que salen del resto del proyecto.

Fuentes (carpeta "Diseño del Producto"): renders de Blender, tomas animadas, comercial, láminas, planos,
PDFs de entrega y el visor 3D. Destino: img/, media/, descargas/ y visor/ dentro de web_proyecto.
Se vuelve a correr cada vez que cambia algo de origen; no editar a mano lo que genera.

    ~/.venvs/funda_cq/bin/python web_proyecto/herramientas/preparar_medios.py
"""
import re
import shutil
import subprocess
from pathlib import Path

import numpy as np
from PIL import Image

WEB = Path(__file__).resolve().parents[1]
RAIZ = WEB.parent
A3D = RAIZ / "3D_Alternativa_A"
SAL = A3D / "salidas"
LAM = RAIZ / "Objetivos_G_a_J_2026-10-16" / "laminas" / "assets"
EF = RAIZ / "Objetivo_F_Seleccion_2026-10-15"
COM = RAIZ / "video_comercial"


def jpg(src, dst, ancho=1600, calidad=84, fondo="white"):
    im = Image.open(src)
    if im.mode in ("RGBA", "LA"):
        base = Image.new("RGB", im.size, fondo)
        base.paste(im, mask=im.split()[-1])
        im = base
    im = im.convert("RGB")
    im.thumbnail((ancho, ancho * 2), Image.LANCZOS)
    dst.parent.mkdir(parents=True, exist_ok=True)
    im.save(dst, quality=calidad, optimize=True, progressive=True)


def png(src, dst, ancho=1400):
    im = Image.open(src)
    im.thumbnail((ancho, ancho * 2), Image.LANCZOS)
    dst.parent.mkdir(parents=True, exist_ok=True)
    im.save(dst, optimize=True)


def ffmpeg(*args):
    subprocess.run(["ffmpeg", "-v", "error", "-y", *args], check=True)


def imagenes():
    img = WEB / "img"
    for n in ("A_SM_heroe", "A_SM_detalle_malla", "A_SM_conjunto_modulo2", "A_talles_familia"):
        jpg(SAL / "renders_foto" / f"{n}.png", img / "producto" / f"{n}.jpg", 2000)
    png(SAL / "renders_foto" / "A_SM_explotado.png", img / "producto" / "explotado.png", 1300)
    for n in ("molde", "corte_long", "transparente", "m2_despiece", "trasera"):
        jpg(LAM / f"{n}.png", img / "ingenieria" / f"{n}.jpg", 1400)
    for i in (1, 2, 3):
        shutil.copy2(LAM / f"colocacion_{i}.jpg", img / "producto" / f"colocacion_{i}.jpg")
    # cada lámina y plano va también en 800 px de ancho (mini/): la grilla los muestra a un tercio de pantalla
    # y el visor de imágenes abre el grande
    for f in sorted((EF / "Laminas").glob("*.png")):
        jpg(f, img / "alternativas" / f"{f.stem}.jpg", 1800, 86)
        jpg(f, img / "alternativas" / "mini" / f"{f.stem}.jpg", 800, 82)
    for f in sorted((SAL / "planos").glob("*.png")):
        jpg(f, img / "planos" / f"{f.stem}.jpg", 1800, 88)
        jpg(f, img / "planos" / "mini" / f"{f.stem}.jpg", 800, 84)
    estuche(img / "marca" / "estuche.jpg")


def estuche(dst):
    """Frente y dorso del estuche, recortados de la lámina J (página 16 del PDF de G a J)."""
    tmp = WEB / "herramientas" / "_pagina_estuche"
    pdf = RAIZ / "Objetivos_G_a_J_2026-10-16" / "Objetivos G a J - Grupo 10.pdf"
    subprocess.run(["pdftoppm", "-r", "150", "-png", "-f", "16", "-l", "16", "-singlefile", str(pdf), str(tmp)], check=True)
    im = Image.open(f"{tmp}.png").convert("RGB")
    w, h = im.size
    # la tarjeta del estuche es la columna izquierda; se recorta a las cajas por color (no blanco del fondo de la tarjeta)
    col = im.crop((int(w * 0.03), int(h * 0.16), int(w * 0.5), int(h * 0.95)))
    # las cajas se ubican por color: frente verde petróleo y dorso crema (la tarjeta de fondo es blanca)
    a = np.asarray(col).astype(int)
    petroleo = (abs(a[..., 0] - 0x1F) < 14) & (abs(a[..., 1] - 0x5E) < 14) & (abs(a[..., 2] - 0x5B) < 14)
    crema = (abs(a[..., 0] - 0xFB) < 3) & (abs(a[..., 1] - 0xF8) < 3) & (abs(a[..., 2] - 0xF2) < 3)
    ys, xs = np.nonzero(petroleo | crema)
    x0, y0, x1, y1 = xs.min(), ys.min(), xs.max(), ys.max()
    caja = col.crop((max(0, x0 - 40), max(0, y0 - 30), min(col.width, x1 + 40), min(col.height, y1 + 22)))
    dst.parent.mkdir(parents=True, exist_ok=True)
    fondo = Image.new("RGB", caja.size, "white")
    fondo.paste(caja)
    fondo.save(dst, quality=88)
    Path(f"{tmp}.png").unlink()


def videos():
    media = WEB / "media"
    media.mkdir(exist_ok=True)
    for fmt in ("16x9", "9x16"):
        proyecto = "aura-comercial" if fmt == "16x9" else "aura-comercial-vertical"
        src = COM / proyecto / "renders" / f"aura_comercial_{fmt}.mp4"
        shutil.copy2(src, media / f"comercial_{fmt}.mp4")
        ffmpeg("-ss", "38.5", "-i", str(src), "-frames:v", "1", "-q:v", "3", str(media / f"comercial_{fmt}.jpg"))


RECORRIDO = ("orbita", "malla", "cordon", "talles", "conjunto")


def recorrido():
    """Clips del recorrido que la página adelanta con el scroll (técnica de scroll-world, licencia MIT).

    Salen de los cuadros PNG de Blender, no del MP4 del comercial, para no recomprimir dos veces.
    Escritorio: 1920 x 1080 nativo, crf 20, GOP 8. Celular: el render vertical nativo a 720 de ancho,
    crf 23, GOP 4, porque en el teléfono cada búsqueda cuesta los cuadros que la separan de la clave.
    El primer cuadro de cada toma queda como póster hasta que el video pinta.
    """
    destino = WEB / "media" / "recorrido"
    destino.mkdir(parents=True, exist_ok=True)
    variantes = (("16x9", "", 1920, "20", "8"), ("9x16", "-m", 720, "23", "4"))
    for toma in RECORRIDO:
        for fmt, sufijo, ancho, crf, gop in variantes:
            cuadros = SAL / "video_tomas" / fmt / toma
            ffmpeg("-framerate", "24", "-i", str(cuadros / "f_%04d.png"), "-vf", f"scale={ancho}:-2",
                   "-c:v", "libx264", "-preset", "slow", "-crf", crf, "-pix_fmt", "yuv420p",
                   "-g", gop, "-keyint_min", gop, "-sc_threshold", "0", "-an", "-movflags", "+faststart",
                   str(destino / f"{toma}{sufijo}.mp4"))
            poster = Image.open(cuadros / "f_0001.png").convert("RGB")
            poster = poster.resize((ancho, round(poster.height * ancho / poster.width)), Image.LANCZOS)
            poster.save(destino / f"{toma}{sufijo}.webp", quality=82, method=6)


def secuencia_scroll():
    """Cuadros de la colocación que la página avanza con el scroll: WebP con transparencia.

    Escritorio 1200 x 900 en media/scroll; celular 800 x 600 en media/scroll-m, la mitad de peso.
    """
    origen = SAL / "scroll_colocacion"
    for carpeta, tam in (("scroll", (1200, 900)), ("scroll-m", (800, 600))):
        destino = WEB / "media" / carpeta
        destino.mkdir(parents=True, exist_ok=True)
        for f in sorted(origen.glob("*.png")):
            im = Image.open(f).convert("RGBA").resize(tam, Image.LANCZOS)
            im.save(destino / f"{f.stem}.webp", quality=78, alpha_quality=85, method=6)


def pdf_liviano(src, dst, limite=20_000_000):
    """GitHub no acepta archivos de más de 25 MB por la web: si el PDF pasa el límite, se recomprimen sus imágenes."""
    if src.stat().st_size <= limite:
        shutil.copy2(src, dst)
        return
    import pymupdf
    doc = pymupdf.open(src)
    doc.rewrite_images(dpi_threshold=170, dpi_target=150, quality=80)
    doc.save(dst, garbage=4, deflate=True)


def descargas():
    d = WEB / "descargas"
    d.mkdir(exist_ok=True)
    copias = {
        EF / "Objetivo E-F - 5 alternativas y seleccion - Grupo 10.pdf": "Objetivo_E-F_Alternativas_y_seleccion_Grupo10.pdf",
        RAIZ / "Objetivos_G_a_J_2026-10-16" / "Objetivos G a J - Grupo 10.pdf": "Objetivos_G_a_J_Grupo10.pdf",
        A3D / "Informe_Alternativa_A.pdf": "Informe_desarrollo_Alternativa_A.pdf",
        SAL / "AURA_planos_y_modelado.zip": "AURA_planos_y_modelado.zip",
    }
    for f in sorted((SAL / "planos").glob("*.pdf")):
        copias[f] = f.name
    for src, nombre in copias.items():
        pdf_liviano(src, d / nombre) if src.suffix == ".pdf" else shutil.copy2(src, d / nombre)


def visor():
    v = WEB / "visor"
    (v / "GLB").mkdir(parents=True, exist_ok=True)
    html = (A3D / "web" / "index.html").read_text(encoding="utf-8")
    html, n = re.subn(r'const GLB = "\.\./salidas/GLB/";', 'const GLB = "GLB/";', html)
    assert n == 1, "cambió la ruta de los GLB en el visor"
    (v / "index.html").write_text(html, encoding="utf-8")
    for f in (SAL / "GLB").glob("*.glb"):
        if f.stem.startswith(("funda_A_", "equipo_", "modulo2")) and not f.stem.endswith("_puesta"):
            shutil.copy2(f, v / "GLB" / f.name)


if __name__ == "__main__":
    imagenes()
    videos()
    descargas()
    visor()
    secuencia_scroll()
    recorrido()
    print("MEDIOS_LISTOS")
