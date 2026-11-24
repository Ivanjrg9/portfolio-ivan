/* Portfolio de Iván Ramos: dos estados (portada y proyectos) con una animación de cámara entre ambos,
   más un panel con todo el contenido (sobre mí, experiencia, formación, proyectos y contacto). */
(() => {
  'use strict';

  const $ = (id) => document.getElementById(id);
  const qa = (sel, root = document) => [...root.querySelectorAll(sel)];
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  const stage = $('stage');
  const plateH = $('plate-h1');
  const plateS2 = $('plate-s2');
  const cam = $('cam');
  const fg = $('fg');
  const word = $('word');
  const letters = qa('#word-in i');
  const mL = $('mound-l');
  const mR = $('mound-r');
  const titleIn = qa('.in', $('h1-title'))[0];
  const bodyIn = qa('.in', $('h1-body'))[0];
    const capRows = qa('.cap .mi');
  const navLinks = qa('#links a');
  const cta = qa('.cta')[0];
  const glyphs = $('glyphs');

  const ASSET = (id, w) => 'https://images.higgs.ai/?default=1&output=webp&url=' + encodeURIComponent('https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/' + id + '.png') + '&w=' + w + '&q=85';
  const MOUNDS_SRC = ASSET('hf_20261123_071757_11ac0e5d-35f5-4e49-bdab-2cee6a7a2ae3', 1344);
  const VIDEO_SRC = 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20261123_061238_19527355-b1cd-46dc-b72e-6eb7e0efd788.mp4';

  const QOUT = 'cubic-bezier(.25,1,.5,1)';
  const COUT = 'cubic-bezier(.33,1,.68,1)';
  const CIN = 'cubic-bezier(.32,0,.67,0)';

  /* ---------------------------------------------------------------- Proyectos (panel) */
  const works = [
    { title: 'Carol T’', type: 'Tienda online', desc: 'Tienda online de ropa, bolsos y bisutería de Alicante, con catálogo y compra por WhatsApp.', tags: ['React', 'Vite', 'Tailwind', 'Cloudflare Pages'], image: 'assets/carol-t.jpg', url: 'https://carolt.es/', label: 'Visitar carolt.es' },
    { title: 'Aperitivos Gisbert', type: 'Web de vinoteca', desc: 'Web de una vinoteca de Alicante con cestas de regalo y vinos D.O.P. Catálogo sin precios y botón directo a WhatsApp.', tags: ['HTML', 'CSS', 'JavaScript'], image: 'assets/aperitivos-gisbert.jpg', url: 'https://www.aperitivosgisbert.com/', label: 'Visitar aperitivosgisbert.com' },
    { title: 'ComisionaTe', type: 'Plataforma web', desc: 'Plataforma web que conecta a empresas de placas solares con comerciales a comisión. Proyecto propio con autenticación y base de datos.', tags: ['Next.js', 'TypeScript', 'Supabase'], image: 'assets/comisionate.jpg', url: 'https://github.com/Ivanjrg9/comisionate', label: 'Ver el código en GitHub' },
    { title: 'Ohm Electricistas', type: 'Web de servicios', desc: 'Web para un electricista autorizado de Alicante: urgencias, boletines y presupuesto por WhatsApp.', tags: ['Astro', 'Tailwind'], image: 'assets/ohm-electricistas.jpg', url: '', label: 'Aún sin publicar' },
    { title: 'HOOD LINE', type: 'Estudio de tatuajes', desc: 'Web para un estudio de tatuajes de El Campello: estilos, artistas, piercing, proceso, merch y cita por WhatsApp, con la tipografía propia del cliente.', tags: ['HTML', 'CSS', 'JavaScript'], image: 'assets/hoodline.jpg', url: '', label: 'Propuesta en revisión' }
  ];
  const slidesEl = $('slides');
  const host = (u) => (u ? u.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '') : 'próximamente');
  const nn = (k) => String(k + 1).padStart(2, '0');
  slidesEl.innerHTML = works.map((w, k) => `
    <article class="slide${k % 2 ? ' slide--flip' : ''}" aria-label="Proyecto ${k + 1} de ${works.length}: ${w.title}">
      <span class="slide__bg" aria-hidden="true">${nn(k)}</span>
      <div class="slide__in">
        <div class="slide__stage">
          <div class="slide__frame">
            <div class="slide__bar"><i></i><i></i><i></i><span>${host(w.url)}</span></div>
            <img src="${w.image}" alt="Captura de la web ${w.title}" loading="lazy" width="1200" height="750">
          </div>
        </div>
        <div class="slide__info">
          <p class="slide__n"><b>${nn(k)}</b> / ${nn(works.length - 1)}</p>
          <p class="slide__type">${w.type}</p>
          <h3>${w.title}</h3>
          <p>${w.desc}</p>
          <ul class="chips">${w.tags.map((t) => `<li>${t}</li>`).join('')}</ul>
          <p class="slide__link">${w.url ? `<a class="btn" href="${w.url}" target="_blank" rel="noreferrer noopener">${w.label} ↗<span class="vh"> (se abre en una pestaña nueva)</span></a>` : `<em>${w.label}</em>`}</p>
        </div>
      </div>
    </article>`).join('');
  // Cada proyecto se apila sobre el anterior: el que queda debajo se encoge y se apaga, el que entra se endereza
  const slideEls = qa('.slide', slidesEl);
  function slideFx() {
    const vh = innerHeight;
    slideEls.forEach((s, k) => {
      const top = s.getBoundingClientRect().top;
      const enter = clamp(1 - top / vh, 0, 1);
      const next = slideEls[k + 1];
      const cover = next ? clamp(1 - next.getBoundingClientRect().top / vh, 0, 1) : 0;
      s.style.setProperty('--enter', enter.toFixed(3));
      s.style.setProperty('--cover', cover.toFixed(3));
    });
  }
  addEventListener('scroll', slideFx, { passive: true });
  addEventListener('resize', slideFx);
  slideFx();
  $('year').textContent = new Date().getFullYear();

  /* ---------------------------------------------------------------- Animaciones */
  const live = new Set();
  function play(el, frames, { delay = 0, duration, easing = 'linear' }) {
    const a = el.animate(frames, { delay, duration, easing, fill: 'both' });
    live.add(a);
    return a;
  }
  function commitAll() { // cada transición parte de la pose exacta en que se quedó la anterior
    live.forEach((a) => { try { a.commitStyles(); } catch (e) { /* elemento oculto */ } a.cancel(); });
    live.clear();
  }

  function heroIn(base, full) {
    const B = base;
    play(mR, [{ transform: 'translateX(45%)' }, { transform: 'none' }], { delay: B, duration: 1700, easing: QOUT });
    play(mL, [{ transform: 'translateX(-45%)' }, { transform: 'none' }], { delay: B + 40, duration: 1700, easing: QOUT });
    play(titleIn, [{ transform: 'translateY(-100%)' }, { transform: 'none' }], { delay: B + 390, duration: 950, easing: COUT });
    play(bodyIn, [{ transform: 'translateY(100%)' }, { transform: 'none' }], { delay: B + 450, duration: 900, easing: COUT });
    letters.forEach((l, i) => play(l, [{ opacity: 0, transform: 'translateY(.06em)' }, { opacity: 1, transform: 'none' }], { delay: B + 630 + i * 55, duration: 450, easing: COUT }));
    [730, 870, 970, 1000].forEach((d, i) => play(capRows[i], [{ transform: 'translateY(100%)' }, { transform: 'none' }], { delay: B + d, duration: 220, easing: COUT }));
    if (!full) return;
    play(plateH, [{ transform: 'scale(1.3)' }, { transform: 'none' }], { duration: 1350, easing: QOUT });
    navLinks.forEach((a, i) => play(a, [{ transform: 'translateY(-110%)' }, { transform: 'none' }], { delay: 100 * (i + 1), duration: 300, easing: COUT }));
    play(cta, [{ opacity: 0 }, { opacity: 1 }], { delay: 530, duration: 200 });
    play(glyphs, [{ opacity: 0, transform: 'translateX(10px)' }, { opacity: 1, transform: 'none' }], { delay: 600, duration: 400, easing: COUT });
  }

  /* ---------------------------------------------------------------- Cámara: caché de fotogramas */
  const cache = { blobs: [], ready: false };

  function parseMp4(buf) {
    const dv = new DataView(buf), u8 = new Uint8Array(buf);
    const boxes = (start, end) => {
      const out = []; let p = start;
      while (p + 8 <= end) {
        let size = dv.getUint32(p), hdr = 8;
        const type = String.fromCharCode(u8[p + 4], u8[p + 5], u8[p + 6], u8[p + 7]);
        if (size === 1) { size = Number(dv.getBigUint64(p + 8)); hdr = 16; } else if (size === 0) size = end - p;
        out.push({ type, body: p + hdr, end: p + size });
        p += size;
      }
      return out;
    };
    const kids = (b) => boxes(b.body, b.end);
    const get = (list, t) => list.find((x) => x.type === t);
    const moov = get(boxes(0, buf.byteLength), 'moov');
    const trak = kids(moov).filter((t) => t.type === 'trak').find((t) => {
      const h = get(kids(get(kids(t), 'mdia')), 'hdlr');
      return String.fromCharCode(...u8.slice(h.body + 8, h.body + 12)) === 'vide';
    });
    const mdia = kids(get(kids(trak), 'mdia'));
    const mdhd = get(mdia, 'mdhd');
    const timescale = dv.getUint32(mdhd.body + (u8[mdhd.body] === 1 ? 20 : 12));
    const stbl = kids(get(kids(get(mdia, 'minf')), 'stbl'));
    const stsd = get(stbl, 'stsd');
    const entry = boxes(stsd.body + 8, stsd.end)[0];
    const avcC = get(boxes(entry.body + 78, entry.end), 'avcC');
    const description = u8.slice(avcC.body, avcC.end);
    const hex = (n) => n.toString(16).padStart(2, '0');
    const codec = 'avc1.' + hex(description[1]) + hex(description[2]) + hex(description[3]);
    const width = dv.getUint16(entry.body + 24), height = dv.getUint16(entry.body + 26);

    const stsz = get(stbl, 'stsz'), uniform = dv.getUint32(stsz.body + 4), count = dv.getUint32(stsz.body + 8);
    const sizes = Array.from({ length: count }, (_, i) => (uniform || dv.getUint32(stsz.body + 12 + i * 4)));
    const stsc = get(stbl, 'stsc'), nsc = dv.getUint32(stsc.body + 4);
    const runs = Array.from({ length: nsc }, (_, i) => [dv.getUint32(stsc.body + 8 + i * 12), dv.getUint32(stsc.body + 12 + i * 12)]);
    const co = get(stbl, 'stco') || get(stbl, 'co64'), is64 = co.type === 'co64', nco = dv.getUint32(co.body + 4);
    const chunkOff = (i) => (is64 ? Number(dv.getBigUint64(co.body + 8 + i * 8)) : dv.getUint32(co.body + 8 + i * 4));
    const stss = get(stbl, 'stss');
    const keys = new Set(stss ? Array.from({ length: dv.getUint32(stss.body + 4) }, (_, i) => dv.getUint32(stss.body + 8 + i * 4) - 1) : [...Array(count).keys()]);
    const stts = get(stbl, 'stts');
    const dts = []; let acc = 0;
    for (let i = 0, n = dv.getUint32(stts.body + 4); i < n; i++) {
      const c = dv.getUint32(stts.body + 8 + i * 8), d = dv.getUint32(stts.body + 12 + i * 8);
      for (let k = 0; k < c; k++) { dts.push(acc); acc += d; }
    }
    const ctts = get(stbl, 'ctts'), cto = [];
    if (ctts) for (let i = 0, n = dv.getUint32(ctts.body + 4); i < n; i++) {
      const c = dv.getUint32(ctts.body + 8 + i * 8), o = dv.getInt32(ctts.body + 12 + i * 8);
      for (let k = 0; k < c; k++) cto.push(o);
    }
    const samples = []; let si = 0, ri = 0;
    for (let ch = 0; ch < nco && si < count; ch++) {
      while (ri + 1 < nsc && runs[ri + 1][0] <= ch + 1) ri++;
      let off = chunkOff(ch);
      for (let k = 0; k < runs[ri][1] && si < count; k++, si++) {
        samples.push({ off, size: sizes[si], key: keys.has(si), ts: Math.round(((dts[si] || 0) + (cto[si] || 0)) / timescale * 1e6) });
        off += sizes[si];
      }
    }
    return { u8, codec, description, width, height, samples };
  }

  async function cacheWithWebCodecs(buf) {
    const m = parseMp4(buf);
    const cfg = { codec: m.codec, description: m.description, codedWidth: m.width, codedHeight: m.height };
    if (!(await VideoDecoder.isConfigSupported(cfg)).supported) throw new Error('codec');
    const c = document.createElement('canvas'); c.width = 1280; c.height = 720;
    const ctx = c.getContext('2d');
    const jobs = [];
    const dec = new VideoDecoder({
      output: (fr) => { ctx.drawImage(fr, 0, 0, 1280, 720); const ts = fr.timestamp; fr.close(); jobs.push(new Promise((r) => c.toBlob((b) => r({ ts, b }), 'image/jpeg', 0.86))); },
      error: () => {}
    });
    dec.configure(cfg);
    for (const s of m.samples) {
      while (dec.decodeQueueSize > 8) await new Promise((r) => setTimeout(r, 4));
      dec.decode(new EncodedVideoChunk({ type: s.key ? 'key' : 'delta', timestamp: s.ts, data: m.u8.subarray(s.off, s.off + s.size) }));
    }
    await dec.flush(); dec.close();
    return (await Promise.all(jobs)).sort((a, b) => a.ts - b.ts).map((x) => x.b);
  }

  async function cacheWithVideo() { // plan B: reproducir un vídeo oculto y capturar cada fotograma presentado
    const v = document.createElement('video');
    v.muted = true; v.playsInline = true; v.crossOrigin = 'anonymous'; v.src = VIDEO_SRC; v.playbackRate = 2;
    await new Promise((res, rej) => { v.onloadeddata = res; v.onerror = rej; });
    const c = document.createElement('canvas'); c.width = 1280; c.height = 720;
    const ctx = c.getContext('2d'); const jobs = [];
    return new Promise((resolve, reject) => {
      const grab = (now, meta) => {
        ctx.drawImage(v, 0, 0, 1280, 720);
        jobs.push(new Promise((r) => c.toBlob((b) => r({ ts: meta.mediaTime, b }), 'image/jpeg', 0.86)));
        if (!v.ended) v.requestVideoFrameCallback(grab);
      };
      v.requestVideoFrameCallback(grab);
      v.onended = async () => resolve((await Promise.all(jobs)).sort((a, b) => a.ts - b.ts).map((x) => x.b));
      v.play().catch(reject);
    });
  }

  async function buildCache() {
    await buildCacheInner();
    if (cache.ready) { for (let k = 0; k < 7; k++) want(k); lastP = -1; apply(); }
  }
  async function buildCacheInner() {
    try {
      const blobs = ('VideoDecoder' in window && 'EncodedVideoChunk' in window)
        ? await fetch(VIDEO_SRC, { mode: 'cors' }).then((r) => r.arrayBuffer()).then(cacheWithWebCodecs)
        : await cacheWithVideo();
      cache.blobs = blobs; cache.ready = blobs.length > 20;
    } catch (e) {
      try { const blobs = await cacheWithVideo(); cache.blobs = blobs; cache.ready = blobs.length > 20; } catch (e2) { cache.ready = false; }
    }
  }

  // Reproducción por scrub
  const camCtx = cam.getContext('2d');
  const bmps = new Map(), pending = new Map();
  let inflight = 0;
  function want(i) {
    if (bmps.has(i)) return Promise.resolve();
    if (pending.has(i)) return pending.get(i);
    if (inflight >= 4) return Promise.resolve();
    inflight++;
    const p = createImageBitmap(cache.blobs[i]).then((b) => { bmps.set(i, b); }).catch(() => {}).finally(() => { inflight--; pending.delete(i); });
    pending.set(i, p);
    return p;
  }
  function drawProgress(p, dir) {
    const n = cache.blobs.length, t = Math.round(clamp(p, 0, 1) * (n - 1));
    for (let k = 0; k <= 6; k++) want(clamp(t + dir * k, 0, n - 1));
    for (let j = t; j >= 0 && j < n; j -= dir) if (bmps.has(j)) { camCtx.drawImage(bmps.get(j), 0, 0, 1280, 720); break; }
    if (bmps.size > 24) bmps.forEach((b, i) => { if (Math.abs(i - t) > 10) { b.close(); bmps.delete(i); } });
  }
  /* ---------------------------------------------------------------- Scroll: la portada se desmonta al bajar */
  const veil = $('veil');
  const embersCv = $('embers');
  const c01 = (x) => clamp(x, 0, 1);
  let D = 0, lastP = -1, camOn = false, controlled = false;
  const measure = () => { D = fg.getBoundingClientRect().bottom - word.getBoundingClientRect().top + 8; };
  function apply() {
    const p = c01(scrollY / (innerHeight * 0.8));
    if (p === lastP) return;
    const dir = p >= lastP ? 1 : -1;
    lastP = p;
    if (!controlled) return;
    titleIn.style.transform = `translateY(${-100 * c01(p / 0.2)}%)`;
    bodyIn.style.transform = `translateY(${100 * c01((p - 0.02) / 0.2)}%)`;
    capRows.forEach((r, i) => { r.style.transform = `translateY(${100 * c01((p - i * 0.012) / 0.2)}%)`; });
    letters.forEach((l, i) => { const x = c01((p - i * 0.03) / 0.5); l.style.transform = `translateY(${D * x * x}px)`; });
    const mx = (k, d) => { const x = c01((p - d) / 0.45); return k * x * x; };
    mL.style.transform = `translateX(${mx(-51, 0.02)}%)`;
    mR.style.transform = `translateX(${mx(51, 0.08)}%)`;
    glyphs.style.opacity = 1 - c01(p / 0.25);
    veil.style.opacity = c01((p - 0.5) / 0.5);
    embersCv.style.opacity = 1 - c01(p / 0.5);
    stage.classList.toggle('scrolled', p > 0.3);
    const cp = c01((p - 0.06) / 0.92);
    if (cache.ready && !reduce) {
      if (cp > 0.002) { if (!camOn) { camOn = true; stage.classList.add('cam-on'); } drawProgress(cp, dir); }
      else if (camOn) { camOn = false; stage.classList.remove('cam-on'); }
      plateS2.style.opacity = cp >= 1 ? '1' : '0';
    } else {
      plateS2.style.opacity = String(c01((p - 0.25) / 0.6));
    }
  }
  let ticking = false;
  addEventListener('scroll', () => { if (ticking) return; ticking = true; requestAnimationFrame(() => { ticking = false; apply(); }); }, { passive: true });
  addEventListener('resize', () => { measure(); lastP = -1; apply(); });

  // Enlaces internos con desplazamiento suave y marca del apartado visible
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    const id = a.getAttribute('href').slice(1);
    const target = id ? $(id) : null;
    if (id && !target) return;
    e.preventDefault();
    scrollTo({ top: target ? target.getBoundingClientRect().top + scrollY : 0, behavior: reduce ? 'auto' : 'smooth' });
  });
  const spy = new IntersectionObserver((entries) => {
    entries.forEach((en) => { if (en.isIntersecting) qa('#links a').forEach((l) => l.setAttribute('aria-current', l.getAttribute('href') === '#' + en.target.id)); });
  }, { rootMargin: '-40% 0px -55% 0px' });
  qa('.sec').forEach((s) => spy.observe(s));
  const reveal = new IntersectionObserver((entries) => entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add('in'); reveal.unobserve(en.target); } }), { rootMargin: '0px 0px -8% 0px' });
  qa('.reveal').forEach((r) => reveal.observe(r));

  /* ---------------------------------------------------------------- Chispas de las brasas */
  function embers() {
    const c = $('embers'), x = c.getContext('2d');
    let W = 0, H = 0, run = true;
    const P = [];
    const size = () => { W = c.width = innerWidth; H = c.height = innerHeight; };
    size(); addEventListener('resize', size);
    const spawn = (p, first) => {
      const left = Math.random() < 0.5;
      p.x = W * (left ? 0.285 : 0.715) + (Math.random() - 0.5) * W * 0.05;
      p.y = H * (first ? 0.45 + Math.random() * 0.45 : 0.62 + Math.random() * 0.08);
      p.vx = (Math.random() - 0.5) * 0.35; p.vy = -(0.25 + Math.random() * 0.7);
      p.r = 0.6 + Math.random() * 1.7; p.life = first ? Math.random() : 0; p.sp = 0.0025 + Math.random() * 0.004; p.ph = Math.random() * 6.28;
      return p;
    };
    for (let i = 0; i < 70; i++) P.push(spawn({}, true));
    document.addEventListener('visibilitychange', () => { run = !document.hidden; if (run) requestAnimationFrame(tick); });
    function tick() {
      if (!run) return;
      x.clearRect(0, 0, W, H);
      if (scrollY < innerHeight) {
        x.globalCompositeOperation = 'lighter';
        for (const p of P) {
          p.life += p.sp; p.ph += 0.03; p.x += p.vx + Math.sin(p.ph) * 0.25; p.y += p.vy;
          if (p.life >= 1 || p.y < -10) { spawn(p, false); continue; }
          const a = Math.sin(p.life * Math.PI) * 0.85, g = x.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 5);
          g.addColorStop(0, `rgba(255,190,120,${a})`); g.addColorStop(0.35, `rgba(197,121,75,${a * 0.5})`); g.addColorStop(1, 'rgba(197,121,75,0)');
          x.fillStyle = g; x.beginPath(); x.arc(p.x, p.y, p.r * 5, 0, 6.28); x.fill();
        }
      }
      requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }
  if (!reduce) embers();

  /* ---------------------------------------------------------------- Carga */
  // La palabra gigante se ajusta para ocupar el ancho de la escena, sea cual sea su longitud
  function fitWord() {
    const s = innerWidth / 1440;
    stage.style.setProperty('--wfs', 100);
    const w = $('word-in').getBoundingClientRect().width;
    if (!w) return;
    const fs = 100 * (1180 * s) / w;
    stage.style.setProperty('--wfs', fs.toFixed(2));
    stage.style.setProperty('--wtop', (600 - 0.834 * fs).toFixed(2));
  }
  addEventListener('resize', () => { fitWord(); });

  // Limpia el borde verde que deja el recorte de los montículos y comparte el resultado con ambas imágenes
  function loadMounds() {
    const decodeBoth = (src) => Promise.all([mL, mR].map((im) => { im.src = src; return im.decode().catch(() => {}); }));
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        try {
          const c = document.createElement('canvas'); c.width = img.naturalWidth; c.height = img.naturalHeight;
          const x = c.getContext('2d'); x.drawImage(img, 0, 0);
          const d = x.getImageData(0, 0, c.width, c.height), px = d.data;
          for (let i = 0; i < px.length; i += 4) {
            if (!px[i + 3]) continue;
            const m = Math.max(px[i], px[i + 2]), dd = (px[i + 1] - m) / 255;
            if (dd > 0) {
              const t = clamp((dd - 0.10) / (0.38 - 0.10), 0, 1), sm = t * t * (3 - 2 * t);
              px[i + 3] *= 1 - sm; px[i + 1] = Math.min(px[i + 1], m * 0.96);
            }
          }
          x.putImageData(d, 0, 0);
          c.toBlob((b) => decodeBoth(URL.createObjectURL(b)).then(resolve), 'image/png');
        } catch (e) { decodeBoth(MOUNDS_SRC).then(resolve); }
      };
      img.onerror = () => decodeBoth(MOUNDS_SRC).then(resolve);
      img.src = MOUNDS_SRC;
    });
  }

  function done() {
    commitAll(); controlled = true; measure(); lastP = -1;
    document.documentElement.classList.remove('lock');
    apply();
    const t = location.hash && $(location.hash.slice(1));
    if (t) scrollTo({ top: t.getBoundingClientRect().top + scrollY, behavior: 'auto' });
  }
  function begin() {
    fitWord();
    stage.classList.remove('pre');
    if (reduce) { done(); return; }
    heroIn(0, true);
    setTimeout(done, 1800);
  }

  if (reduce) { stage.classList.add('rm'); document.body.classList.add('rm'); }
  const fonts = document.fonts ? Promise.all([document.fonts.load('600 100px "Archivo Wide"'), document.fonts.load('400 14px "Onest"'), document.fonts.ready]).catch(() => {}) : Promise.resolve();
  const plateReady = plateH.decode ? plateH.decode().catch(() => {}) : Promise.resolve();
  let started = false;
  const start = () => { if (started) return; started = true; requestAnimationFrame(() => requestAnimationFrame(begin)); };
  Promise.all([fonts, plateReady, loadMounds()]).then(start);
  setTimeout(start, 2500);
  if (!reduce) setTimeout(buildCache, 1200);
})();
