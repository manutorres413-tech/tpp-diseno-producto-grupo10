// Prueba la web y el visor antes de publicar, en compu (1440 px) y celular (375 px).
//
//   python3 -m http.server 8000            (en la raíz del repo, en otra terminal)
//   node herramientas/probar_web.js                                        (local)
//   node herramientas/probar_web.js https://manutorres413-tech.github.io/tpp-diseno-producto-grupo10/   (en línea)
//
// Necesita Playwright con Chromium. En las sesiones de Claude Code en la nube ya está instalado; en otra
// máquina: npm i -g playwright && npx playwright install chromium.
// Las capturas quedan en herramientas/_capturas/ (no se suben: ver .gitignore).

const fs = require('fs');
const path = require('path');

function cargarPlaywright() {
  // local del repo, global de npm (Node no mira ahí solo, ni en Windows) o el de las sesiones en la nube
  let global = null;
  try { global = path.join(require('child_process').execSync('npm root -g', { encoding: 'utf8' }).trim(), 'playwright'); } catch {}
  for (const ruta of ['playwright', global, '/opt/node-tools/node_modules/playwright'].filter(Boolean)) {
    try { return require(ruta); } catch {}
  }
  throw new Error('No encuentro Playwright: npm i -g playwright && npx playwright install chromium');
}
const { chromium } = cargarPlaywright();

const BASE = (process.argv[2] || 'http://localhost:8000/').replace(/\/?$/, '/');
const OUT = path.join(__dirname, '_capturas');
fs.mkdirSync(OUT, { recursive: true });

let fallas = 0;
const ok = (c, m) => { if (!c) fallas++; console.log(`${c ? 'OK   ' : 'FALLA'} ${m}`); };
const nc = '?nc=' + Date.now();   // evita la caché de GitHub Pages

function escuchar(page) {
  const errores = [];
  page.on('console', m => { if (m.type() === 'error') errores.push(m.text()); });
  page.on('pageerror', e => errores.push('pageerror: ' + e.message));
  page.on('response', r => { if (r.status() >= 400) errores.push(`${r.status()} ${r.url()}`); });
  return errores;
}

async function probarPagina(ctx, nombre) {
  const page = await ctx.newPage();
  const errores = escuchar(page);
  await page.goto(BASE + nc, { waitUntil: 'load' });
  await page.waitForTimeout(1500);

  // Publicado hasta I: sin J ni Descargas
  ok(!(await page.content()).includes('Entregas y planos'), 'sin botón "Entregas y planos"');
  for (const id of ['marca', 'descargas']) ok(await page.locator(`#${id}`).count() === 0, `sin sección #${id}`);
  const ids = await page.$$eval('section[id]', s => s.map(x => x.id));
  ok(ids.slice(-4).join() === 'visor,maqueta,ingenieria,costos', `después del visor vienen G, H e I (${ids.join(', ')})`);
  for (const id of ['maqueta', 'ingenieria', 'costos']) ok(await page.locator(`.indice a[href="#${id}"]`).count() === 1, `#${id} en el índice`);

  // Módulo 2 descartado y comercial retirado hasta nuevo aviso (sus videos siguen en media/, sin referencia)
  const html = await page.content();
  ok(!/Módulo 2|modulo2|M2_Funda|funda de bobina|recorrido\/conjunto/i.test(html), 'sin rastros del Módulo 2');
  ok(await page.locator('#comercial').count() === 0 && !/href="#comercial"|comercial_(16x9|9x16)/.test(html), 'sin el comercial ni enlaces a él');
  ok(await page.locator('.rc-escena').count() === 4, 'recorrido con cuatro escenas');

  // Objetivos de relleno plegados
  for (const id of ['problema', 'sondeo', 'mercado', 'brief', 'seleccion']) {
    const pl = page.locator(`#pl-${id}`), btn = page.locator(`button[aria-controls="pl-${id}"]`);
    const oculto = await pl.evaluate(e => e.hidden), txt = (await btn.textContent()).trim();
    await btn.scrollIntoViewIfNeeded();
    await btn.click();
    ok(oculto && txt === 'Ver todo el objetivo' && await pl.evaluate(e => !e.hidden), `#${id} plegado y se abre`);
  }
  for (const id of ['alternativas', 'funda', 'maqueta', 'ingenieria']) ok(await page.locator(`#${id} .btn-plegar`).count() === 0, `#${id} abierto`);

  // Cifras oficiales (ver la tabla de CLAUDE.md)
  const curva = await page.$eval('svg.curva', s => ({
    v: [...s.querySelectorAll('text.v')].map(t => t.textContent.replace(/ /g, ' ')),
    coral: s.querySelector('circle[fill="#F08A3C"]')?.getAttribute('cx'),
  }));
  ok(JSON.stringify(curva.v) === JSON.stringify(['83,3 %', '59,1 %', '36,4 %', '10,6 %']), `curva de demanda ${curva.v.join(' / ')}`);
  ok(curva.coral === '320', 'punto destacado en $60.000');
  const texto = await page.evaluate(() => document.body.innerText);
  for (const t of ['$60.000', '$80.000', '$39.000', '$52.000', '$26.000', 'Q = 1.850 ventas por año', '53.000', '145.500']) ok(texto.includes(t), `aparece "${t}"`);

  // Enlaces a archivos: se abren en otra pestaña, nunca se descargan
  const archivos = await page.$$eval('a[href]', as => as
    .filter(a => /\.(pdf|xlsx?|docx?|zip|png|jpe?g|webp)$/i.test(a.getAttribute('href')) || a.hasAttribute('download'))
    .filter(a => a.hasAttribute('download') || a.target !== '_blank')
    .map(a => a.getAttribute('href')));
  ok(archivos.length === 0, `archivos en pestaña nueva y sin download${archivos.length ? ': ' + archivos.join(', ') : ''}`);

  const [ancho, vista] = await page.evaluate(() => [document.documentElement.scrollWidth, innerWidth]);
  ok(ancho <= vista, `sin scroll horizontal (${ancho} px en ${vista} px)`);

  // Recorrer toda la página para que carguen las imágenes diferidas antes de mirar la consola
  await page.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 600) { scrollTo(0, y); await new Promise(r => setTimeout(r, 60)); } });
  await page.waitForTimeout(1500);
  await page.evaluate(() => scrollTo(0, 0));
  await page.screenshot({ path: path.join(OUT, `${nombre}-tapa.png`) });
  ok(errores.length === 0, `página sin errores en consola${errores.length ? ':\n      ' + errores.join('\n      ') : ''}`);
  await page.close();
}

async function probarVisor(ctx, nombre) {
  const v = await ctx.newPage();
  const errores = escuchar(v);
  const r = await v.goto(BASE + 'visor/index.html' + nc, { waitUntil: 'load' });
  const listo = () => v.waitForFunction(() => getComputedStyle(document.getElementById('cargando')).display === 'none', null, { timeout: 60000 });
  await listo();
  ok(r.status() === 200 && await v.locator('canvas').count() > 0, 'visor carga y dibuja');

  ok(await v.$eval('#talles button.activo', b => b.textContent.startsWith('XS')), 'el visor abre en XS');
  await v.click('#talles button >> nth=2'); await listo();   // M/L Naída: sin colocación todavía
  ok(await v.$eval('#colocar', b => getComputedStyle(b).display === 'none'), 'Naída: sin botón de colocar');
  await v.click('#talles button >> nth=1'); await listo();   // S/M: tampoco
  ok(await v.$eval('#colocar', b => getComputedStyle(b).display === 'none'), 'S/M: sin botón de colocar');
  await v.click('#talles button >> nth=3'); await listo();   // M/L Sonnet: colocación de implante (abrigo)
  await v.click('#colocar'); await v.waitForTimeout(400);
  ok(await v.$eval('#pasos', e => e.classList.contains('visible') && e.children.length === 4), 'Sonnet: colocación con cuatro pasos');
  await v.waitForTimeout(6000);
  ok((await v.textContent('#colocar span')).trim() === 'Repetir colocación', 'Sonnet: la colocación termina');
  await v.click('#talles button >> nth=0'); await listo();   // XS: la colocación tipo bota
  await v.click('#colocar');
  await v.waitForTimeout(400);
  ok(await v.$eval('#pasos', e => e.classList.contains('visible')), 'colocar funda muestra los pasos');
  await v.waitForTimeout(5500);
  ok((await v.textContent('#colocar span')).trim() === 'Repetir colocación', 'la colocación termina y se puede repetir');

  ok(await v.locator('#mallas').count() === 0 && (await v.textContent('#ley-malla-txt')).includes('ePTFE'), 'banda sólo de ePTFE, sin selector de malla');
  await v.check('#cordon'); await v.check('#corte');
  await v.waitForTimeout(500);
  ok((await v.textContent('#rotulo')).includes('en corte'), 'vista en corte');
  await v.locator('#escena').screenshot({ path: path.join(OUT, `${nombre}-visor.png`) }).catch(() => {});

  // el Módulo 2 (funda de bobina) se descartó el 04/11/2026: el visor tiene sólo los cuatro talles
  const talles = await v.$$eval('#talles button', bs => bs.map(b => b.textContent));
  ok(talles.length === 4 && !talles.some(t => /Módulo|bobina/i.test(t)), `visor con cuatro talles y sin Módulo 2 (${talles.length})`);
  // el link guarda talle y vista en corte
  await v.goto(BASE + 'visor/index.html?nc=link' + Date.now() + '#talle=MLS&corte=1', { waitUntil: 'load' }); await listo();
  const rot = await v.textContent('#rotulo');
  ok(rot.includes('Sonnet') && rot.includes('en corte'), `link del visor con talle y corte (${rot.trim()})`);
  ok(errores.length === 0, `visor sin errores en consola${errores.length ? ':\n      ' + errores.join('\n      ') : ''}`);
  await v.close();
}

(async () => {
  const executablePath = fs.existsSync('/opt/pw-browsers/chromium') ? '/opt/pw-browsers/chromium' : undefined;
  // swiftshader: WebGL por software, para que el visor ande sin placa de video (servidores, nube)
  const browser = await chromium.launch({ executablePath, args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
  // Si la red no deja llegar a jsdelivr (algunas sesiones en la nube), THREE_LOCAL apunta a una copia de three@0.160.0
  // (la carpeta node_modules/three de un npm i three@0.160.0) y el visor la usa en su lugar.
  const threeLocal = process.env.THREE_LOCAL;
  const rutearThree = ctx => threeLocal && ctx.route('https://cdn.jsdelivr.net/npm/three@0.160.0/**', r =>
    r.fulfill({ path: path.join(threeLocal, r.request().url().split('three@0.160.0/')[1]), contentType: 'text/javascript' }));
  console.log(`Probando ${BASE}`);
  for (const [nombre, vp, movil] of [['compu', { width: 1440, height: 900 }, false], ['celular', { width: 375, height: 812 }, true]]) {
    console.log(`\n== ${nombre} (${vp.width} px) ==`);
    const ctx = await browser.newContext({ viewport: vp, isMobile: movil, hasTouch: movil, deviceScaleFactor: movil ? 2 : 1 });
    await rutearThree(ctx);
    await probarPagina(ctx, nombre);
    await probarVisor(ctx, nombre);
    await ctx.close();
  }

  console.log('\n== archivos retirados (J, Descargas y Módulo 2) ==');
  const ctx = await browser.newContext();
  for (const p of ['descargas/Objetivos_G_a_J_Grupo10.pdf', 'img/marca/estuche.jpg', 'img/ingenieria/m2_despiece.jpg',
    'img/alternativas/M2_Funda_bobina.jpg', 'img/producto/A_SM_conjunto_modulo2.jpg', 'img/planos/plano_modulo2_bobina.jpg',
    'descargas/plano_modulo2_bobina.pdf', 'media/recorrido/conjunto.mp4', 'media/recorrido/conjunto-m.mp4', 'visor/GLB/modulo2_bobina.glb']) {
    const r = await ctx.request.get(BASE + p + nc);
    ok(r.status() === 404, `${p} da ${r.status()}`);
  }
  // el comercial sale de la página pero sus videos se quedan en el repo hasta que vuelva
  for (const p of ['media/comercial_16x9.mp4', 'media/comercial_9x16.mp4']) {
    const r = await ctx.request.head(BASE + p + nc);
    ok(r.status() === 200, `${p} sigue en el repo (${r.status()})`);
  }
  await browser.close();
  console.log(fallas ? `\n${fallas} FALLA(S). No publicar hasta resolverlas.` : '\nTodo OK. Capturas en herramientas/_capturas/.');
  process.exit(fallas ? 1 : 0);
})();
