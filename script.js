/* La barra superior se oscurece al bajar */
const nav = document.getElementById('nav');
function updateNav() {
  nav.classList.toggle('is-scrolled', window.scrollY > 24);
}
window.addEventListener('scroll', updateNav, { passive: true });
updateNav();

/* Proyectos: la vista previa de la derecha cambia con el proyecto que se señala */
const list = document.getElementById('proj-list');
const preview = document.getElementById('preview');
const previewImg = preview.querySelector('img');
const projects = [...list.querySelectorAll('.proj')];

function setActive(project) {
  projects.forEach((item) => item.classList.toggle('is-active', item === project));
  previewImg.src = project.querySelector('.proj__img').src;
  const url = project.dataset.url;
  if (url) preview.href = url;
  else preview.removeAttribute('href');
  // reinicia el desplazamiento automático de la captura
  previewImg.style.animation = 'none';
  void previewImg.offsetWidth;
  previewImg.style.animation = '';
}

projects.forEach((project) => {
  project.addEventListener('mouseenter', () => setActive(project));
  project.addEventListener('focusin', () => setActive(project));
});
setActive(projects[0]);

/* Foto: galería con revelado por línea de luz y linterna de color que sigue al puntero */
const shot = document.getElementById('shot');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const photos = [...shot.querySelectorAll('.shot__img')];
const scan = shot.querySelector('.shot__scan');
const dots = document.getElementById('shot-dots');
const EASE = 'cubic-bezier(.65, 0, .35, 1)';
const DURATION = 1500;
let current = 0;
let busy = false;
let autoplay = null;

function setColorLayer() {
  shot.style.setProperty('--photo', `url("${photos[current].getAttribute('src')}")`);
}

function updateDots() {
  [...dots.children].forEach((dot, i) => {
    if (i === current) dot.setAttribute('aria-current', 'true');
    else dot.removeAttribute('aria-current');
  });
}

function showPhoto(next) {
  if (busy || next === current) return;
  const previous = photos[current];
  const incoming = photos[next];
  current = next;
  setColorLayer();
  updateDots();

  if (reduceMotion || !incoming.animate) {
    previous.classList.remove('is-active');
    incoming.classList.add('is-active');
    return;
  }

  busy = true;
  previous.classList.remove('is-active');
  previous.classList.add('is-prev');
  incoming.classList.add('is-active');
  const reveal = incoming.animate(
    [{ clipPath: 'inset(0 0 100% 0)' }, { clipPath: 'inset(0 0 0% 0)' }],
    { duration: DURATION, easing: EASE }
  );
  scan.animate([{ top: '0%' }, { top: '100%' }], { duration: DURATION, easing: EASE });
  scan.animate([{ opacity: 1 }, { opacity: 1, offset: 0.88 }, { opacity: 0 }], { duration: DURATION, easing: 'linear' });
  reveal.finished.then(() => {
    previous.classList.remove('is-prev');
    busy = false;
  });
}

function startAutoplay() {
  if (reduceMotion || photos.length < 2 || autoplay) return;
  autoplay = setInterval(() => {
    if (!document.hidden) showPhoto((current + 1) % photos.length);
  }, 7000);
}
function stopAutoplay() {
  clearInterval(autoplay);
  autoplay = null;
}

photos.forEach((photo, i) => {
  const dot = document.createElement('button');
  dot.type = 'button';
  dot.setAttribute('aria-label', `Foto ${i + 1} de ${photos.length}`);
  dot.addEventListener('click', () => {
    stopAutoplay();
    showPhoto(i);
  });
  dots.append(dot);
});
if (photos.length < 2) dots.hidden = true;
setColorLayer();
updateDots();

if (reduceMotion || !('IntersectionObserver' in window)) {
  shot.classList.add('is-in');
} else {
  const shotObserver = new IntersectionObserver((entries, observer) => {
    if (entries.some((entry) => entry.isIntersecting)) {
      shot.classList.add('is-in');
      observer.disconnect();
      setTimeout(startAutoplay, DURATION + 4500);
    }
  }, { threshold: 0.35 });
  shotObserver.observe(shot);
}

function moveSpot(event) {
  const box = shot.getBoundingClientRect();
  shot.style.setProperty('--mx', `${event.clientX - box.left}px`);
  shot.style.setProperty('--my', `${event.clientY - box.top}px`);
}
shot.addEventListener('pointermove', moveSpot);
shot.addEventListener('pointerdown', (event) => {
  if (event.pointerType === 'touch') {
    moveSpot(event);
    shot.classList.add('is-touching');
  }
});
['pointerup', 'pointercancel'].forEach((name) => {
  shot.addEventListener(name, () => shot.classList.remove('is-touching'));
});

document.getElementById('year').textContent = new Date().getFullYear();

/* Globo terráqueo en WebGL (sin librerías): esfera inclinada con atmósfera, luces de ciudades y estrellas */
(function setupGlobe() {
  const hero = document.getElementById('top');
  const reference = hero.querySelector('.earth');
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const canvas = document.createElement('canvas');
  canvas.className = 'hero__gl';
  canvas.setAttribute('aria-hidden', 'true');
  const gl = canvas.getContext('webgl', { alpha: true, premultipliedAlpha: true, antialias: false });
  if (!gl || gl.getParameter(gl.MAX_TEXTURE_SIZE) < 4096) return;

  const vertexSource = `
    attribute vec2 aPos;
    void main() { gl_Position = vec4(aPos, 0.0, 1.0); }`;

  const fragmentSource = `
    precision highp float;
    uniform vec2 uRes;
    uniform vec2 uCenter;
    uniform float uR;
    uniform float uSpin;
    uniform float uTime;
    uniform float uTilt;
    uniform vec2 uMouse;
    uniform float uMouseOn;
    uniform sampler2D uTex;
    const float PI = 3.14159265359;

    float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }

    void main() {
      vec2 p = vec2(gl_FragCoord.x, uRes.y - gl_FragCoord.y);
      vec2 d = (p - uCenter) / uR;
      float rr = length(d);

      // estrellas
      vec2 cell = floor(p / 2.0);
      float h = hash(cell);
      float star = step(0.9994, h) * (0.3 + 0.7 * hash(cell + 7.0));
      star *= 0.7 + 0.3 * sin(uTime * 1.4 + h * 80.0);
      star *= smoothstep(1.02, 1.08, rr);
      star *= smoothstep(0.30, 0.38, abs(p.x / uRes.x - 0.5));
      vec3 col = vec3(star);
      float alpha = star;

      // resplandor atmosférico exterior
      float g = clamp(1.0 - max(rr - 1.0, 0.0) / 0.11, 0.0, 1.0);
      float outer = pow(g, 3.2) * 0.75;
      col += vec3(0.24, 0.50, 1.0) * outer;
      alpha = max(alpha, outer);

      // superficie
      float edge = 1.0 - smoothstep(1.0 - 2.0 / uR, 1.0, rr);
      if (edge > 0.0) {
        float z = sqrt(max(0.0, 1.0 - rr * rr));
        vec3 n = vec3(d.x, -d.y, z);
        float c = cos(uTilt);
        float s = sin(uTilt);
        vec3 m = vec3(n.x, n.y * c - n.z * s, n.y * s + n.z * c);
        float lon = atan(m.x, m.z) - uSpin;
        float lat = asin(clamp(m.y, -1.0, 1.0));
        vec2 uv = vec2(lon / (2.0 * PI) + 0.5, 0.5 - lat / PI);
        vec3 tex = texture2D(uTex, uv).rgb;

        float luma = dot(tex, vec3(0.299, 0.587, 0.114));
        float lit = smoothstep(0.16, 0.65, luma);
        float twinkle = 0.88 + 0.12 * sin(uTime * 2.2 + hash(floor(uv * 1800.0)) * 6.2831);
        vec3 city = pow(tex, vec3(0.8)) * 1.35 * lit * mix(1.0, twinkle, lit) * vec3(1.0, 0.84, 0.58);
        vec3 surface = tex * 1.4 + city;

        float md = length(p - uMouse) / (uR * 0.24);
        float halo = exp(-md * md) * uMouseOn;
        surface *= 1.0 + halo * 1.5;
        surface += vec3(0.10, 0.22, 0.55) * halo * 0.55;

        float limb = pow(1.0 - z, 2.0);
        surface *= 1.0 - 0.5 * limb;
        surface += vec3(0.14, 0.34, 0.9) * pow(1.0 - z, 4.5) * 1.1;

        col = mix(col, surface, edge);
        alpha = mix(alpha, 1.0, edge);
      }
      gl_FragColor = vec4(col, alpha);
    }`;

  function compile(type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    return gl.getShaderParameter(shader, gl.COMPILE_STATUS) ? shader : null;
  }
  const vs = compile(gl.VERTEX_SHADER, vertexSource);
  const fs = compile(gl.FRAGMENT_SHADER, fragmentSource);
  if (!vs || !fs) return;
  const program = gl.createProgram();
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;
  gl.useProgram(program);

  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
  const position = gl.getAttribLocation(program, 'aPos');
  gl.enableVertexAttribArray(position);
  gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

  const uniforms = {};
  ['uRes', 'uCenter', 'uR', 'uSpin', 'uTime', 'uTilt', 'uMouse', 'uMouseOn', 'uTex'].forEach((name) => {
    uniforms[name] = gl.getUniformLocation(program, name);
  });

  let visible = true;
  let start = null;
  const BASE_TILT = 0.436;
  const aim = { x: 0.5, y: 0.5, on: 0, px: 0, py: 0 };
  const view = { x: 0.5, y: 0.5, on: 0 };

  if (!prefersReduced) {
    window.addEventListener('pointermove', (event) => {
      if (event.pointerType === 'touch') return;
      const box = hero.getBoundingClientRect();
      const inside = event.clientY >= box.top && event.clientY <= box.bottom;
      aim.on = inside ? 1 : 0;
      if (!inside) return;
      aim.x = event.clientX / window.innerWidth;
      aim.y = (event.clientY - box.top) / box.height;
      aim.px = event.clientX - box.left;
      aim.py = event.clientY - box.top;
    });
    document.addEventListener('pointerleave', () => { aim.on = 0; });
  }

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    const heroBox = hero.getBoundingClientRect();
    const earthBox = reference.getBoundingClientRect();
    const radius = earthBox.width / 2;
    canvas.width = Math.round(heroBox.width * dpr);
    canvas.height = Math.round(heroBox.height * dpr);
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.uniform2f(uniforms.uRes, canvas.width, canvas.height);
    gl.uniform2f(uniforms.uCenter, (earthBox.left - heroBox.left + radius) * dpr, (earthBox.top - heroBox.top + radius) * dpr);
    gl.uniform1f(uniforms.uR, radius * dpr);
  }

  function draw(time) {
    if (start === null) start = time;
    const seconds = (time - start) / 1000;
    const dpr = canvas.width / hero.getBoundingClientRect().width;
    // el globo sigue al cursor con suavizado; sin cursor vuelve a su posición de reposo
    const targetX = aim.on ? aim.x : 0.5;
    const targetY = aim.on ? aim.y : 0.5;
    view.x += (targetX - view.x) * 0.045;
    view.y += (targetY - view.y) * 0.045;
    view.on += (aim.on - view.on) * 0.08;
    const spin = seconds * 0.014 + (view.x - 0.5) * 1.1;
    const tilt = BASE_TILT + (0.5 - view.y) * 0.22;
    gl.uniform1f(uniforms.uSpin, prefersReduced ? 0 : spin);
    gl.uniform1f(uniforms.uTime, prefersReduced ? 0 : seconds);
    gl.uniform1f(uniforms.uTilt, prefersReduced ? BASE_TILT : tilt);
    gl.uniform2f(uniforms.uMouse, aim.px * dpr, aim.py * dpr);
    gl.uniform1f(uniforms.uMouseOn, prefersReduced ? 0 : view.on);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  }

  function loop(time) {
    if (visible) draw(time);
    requestAnimationFrame(loop);
  }

  const image = new Image();
  image.onload = () => {
    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.uniform1i(uniforms.uTex, 0);

    hero.append(canvas);
    hero.classList.add('has-gl');
    resize();
    if ('ResizeObserver' in window) new ResizeObserver(() => { resize(); if (prefersReduced) draw(0); }).observe(hero);
    else window.addEventListener('resize', resize);
    new IntersectionObserver((entries) => { visible = entries[0].isIntersecting; }).observe(hero);

    if (prefersReduced) draw(0);
    else requestAnimationFrame(loop);
  };
  image.src = 'assets/earth-night.jpg';
})();
