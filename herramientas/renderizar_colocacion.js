// Renderiza los cuadros de la colocación con scroll de la web (sección #colocacion) desde el visor 3D, con la
// colocación tipo bota del talle XS (Phonak Audéo I-R). Así la animación de la página es la misma que la del visor.
//
//   python3 -m http.server 8000            (en la raíz del repo, en otra terminal)
//   node herramientas/renderizar_colocacion.js
//
// Escribe media/scroll/0001.webp…0120.webp (1200 × 900) y media/scroll-m/ (800 × 600), sobre el papel de la página.
// Si jsdelivr no está accesible, THREE_LOCAL apunta a node_modules/three de un npm i three@0.160.0 (como en
// probar_web.js). Necesita Playwright con Chromium.
//
// Reparto del scroll (los pasos de texto cambian en 0,3 y 0,72):
//   0 a 0,3     el audífono solo, como sale de la caja
//   0,3 a 0,4   desaparece y aparece abajo de la funda, girado, con el cable estirado
//   0,4 a 0,78  la colocación del visor
//   0,78 a 1    puesto
// La cámara gira despacio de punta a punta.

const fs = require('fs');
const path = require('path');

function cargarPlaywright() {
  let global = null;
  try { global = path.join(require('child_process').execSync('npm root -g', { encoding: 'utf8' }).trim(), 'playwright'); } catch {}
  for (const ruta of ['playwright', global, '/opt/node-tools/node_modules/playwright'].filter(Boolean)) {
    try { return require(ruta); } catch {}
  }
  throw new Error('No encuentro Playwright: npm i -g playwright && npx playwright install chromium');
}
const { chromium } = cargarPlaywright();

const BASE = 'http://localhost:8000/';
const RAIZ = path.join(__dirname, '..');
const CUADROS = 120;
const TAMANOS = [['media/scroll', 1200, 900], ['media/scroll-m', 800, 600]];

// El visor no expone nada: se le agrega, sólo para este script, un acceso a sus funciones internas.
const ACCESO = `window.__render = { THREE, renderer, scene, camera, controls, raiz, estado, TALLES, cargar, aplicar, armarTalles,
  pose, poseEntrada, opacidad, pararAnim, get coloc() { return coloc; }, get funda() { return fundaObj; }, get equipo() { return equipoObj; } };
const camaraGuardada =`;

(async () => {
  const executablePath = fs.existsSync('/opt/pw-browsers/chromium') ? '/opt/pw-browsers/chromium' : undefined;
  const browser = await chromium.launch({ executablePath, args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
  const page = await browser.newPage({ viewport: { width: 1400, height: 1000 } });
  page.on('pageerror', e => console.log('error en el visor:', e.message));
  if (process.env.THREE_LOCAL) await page.route('https://cdn.jsdelivr.net/npm/three@0.160.0/**', r =>
    r.fulfill({ path: path.join(process.env.THREE_LOCAL, r.request().url().split('three@0.160.0/')[1]), contentType: 'text/javascript' }));
  const fuente = fs.readFileSync(path.join(RAIZ, 'visor/index.html'), 'utf8');
  if (!fuente.includes('const camaraGuardada =')) throw new Error('No encuentro dónde enganchar el visor (const camaraGuardada).');
  await page.route(BASE + 'visor/index.html', r => r.fulfill({ body: fuente.replace('const camaraGuardada =', ACCESO), contentType: 'text/html' }));
  await page.goto(BASE + 'visor/index.html', { waitUntil: 'load' });
  await page.waitForFunction(() => window.__render && getComputedStyle(document.getElementById('cargando')).display === 'none', null, { timeout: 60000 });

  // XS con el Audéo I-R, funda colocada, sin transparencia, corte ni cordón
  await page.evaluate(async () => {
    const v = window.__render;
    v.estado.talle = v.TALLES.find(t => t.id === 'XS'); v.estado.equipo = 'AUDEO_IR';
    Object.assign(v.estado, { vista: 'ambos', transp: false, corte: false, cordon: false });
    v.armarTalles(); await v.cargar(); v.aplicar();
    v.renderer.setAnimationLoop(null);
    v.scene.background = new v.THREE.Color('#F7F3EC');      // el papel de la página
  });

  for (const [carpeta, W, H] of TAMANOS) {
    const dir = path.join(RAIZ, carpeta);
    fs.mkdirSync(dir, { recursive: true });
    await page.evaluate(({ W, H }) => {
      const v = window.__render, T = v.THREE, c = v.coloc;
      v.renderer.setPixelRatio(1); v.renderer.setSize(W, H, false);
      v.camera.aspect = W / H;
      // encuadre fijo: el equipo puesto y el equipo en su punto de partida, con aire para el giro de la cámara
      v.pararAnim();
      const caja = new T.Box3().setFromObject(v.raiz);
      v.pose(0.07); v.raiz.updateMatrixWorld(true);
      caja.union(new T.Box3().setFromObject(v.equipo));
      v.pararAnim();
      const centro = caja.getCenter(new T.Vector3()), tam = caja.getSize(new T.Vector3());
      const tan = Math.tan(T.MathUtils.degToRad(v.camera.fov / 2));
      const dist = 1.08 * Math.max(tam.y / 2 / tan, Math.max(tam.x, tam.z) / 2 / (tan * v.camera.aspect)) + Math.min(tam.x, tam.z) / 2;
      window.__encuadre = { centro, dist };
      v.camera.near = dist / 50; v.camera.far = dist * 10;
      v.camera.updateProjectionMatrix();
    }, { W, H });

    for (let i = 0; i < CUADROS; i++) {
      const datos = await page.evaluate(({ i, n }) => {
        const v = window.__render, T = v.THREE, p = i / (n - 1);
        const tramo = (x, a, b) => Math.min(1, Math.max(0, (x - a) / (b - a)));
        const suave = x => x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
        v.pararAnim();
        if (p < 0.34) {                                      // el audífono solo; al final se desvanece
          v.funda.visible = false;
          v.opacidad(v.equipo, 1 - suave(tramo(p, 0.3, 0.34)), () => 1);
        } else if (p < 0.4) {                                // reaparece abajo, girado, y la funda aparece en su lugar
          v.pose(0.07);
          const f = suave(tramo(p, 0.34, 0.4));
          v.opacidad(v.equipo, f, () => 1);
          v.funda.visible = true;
          v.opacidad(v.funda, f, () => 1);
        } else if (p < 0.78) {
          v.pose(0.07 + 0.9295 * tramo(p, 0.4, 0.78));
        }                                                    // después: puesta (pararAnim la dejó así)
        // la cámara gira 40° despacio alrededor del equipo
        const { centro, dist } = window.__encuadre, a = T.MathUtils.degToRad(-20 + 40 * p);
        const dir = new T.Vector3(0.35, 0.15, 1).normalize().applyAxisAngle(new T.Vector3(0, 1, 0), a);
        v.camera.position.copy(centro).addScaledVector(dir, dist);
        v.camera.lookAt(centro);
        v.renderer.render(v.scene, v.camera);
        return v.renderer.domElement.toDataURL('image/webp', 0.86);
      }, { i, n: CUADROS });
      fs.writeFileSync(path.join(dir, String(i + 1).padStart(4, '0') + '.webp'), Buffer.from(datos.split(',')[1], 'base64'));
    }
    const peso = fs.readdirSync(dir).reduce((s, f) => s + fs.statSync(path.join(dir, f)).size, 0);
    console.log(`${carpeta}: ${CUADROS} cuadros de ${W} × ${H}, ${(peso / 1e6).toFixed(1)} MB en total`);
  }
  await browser.close();
})();
