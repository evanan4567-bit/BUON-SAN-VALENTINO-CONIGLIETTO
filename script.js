// ═══════════════════════════════════════════════════════════════
// 💖 SAN VALENTÍN ULTRA-GOZU — SCRIPT FINAL CORREGIDO + WARP
// Versión blindada: sin duplicaciones, sin superposiciones
// ═══════════════════════════════════════════════════════════════

document.addEventListener('DOMContentLoaded', function () {

  // ─── CONFIGURACIÓN ───
  const CONFIG = {
    fechaInicio:      '2025-06-21T20:30:00',
    duracionFoto:     5000,
    duracionVideoMin: 6000,
    duracionVideoMax: 15000,
    volumenIntro:     0.45,
    volumenLove:      0.40,
    volumenFinal:     0.35,
    fadeMs:           1200,
  };

  // ─── ELEMENTOS ───
  const $ = id => document.getElementById(id);

  const introScreen   = $('introScreen');
  const btnEntrar     = $('btnEntrar');
  const mainWrapper   = $('mainWrapper');
  const avatarDialog  = $('avatarDialog');
  const seccionFinal  = $('seccionFinal');

  const musicIntro    = $('musicIntro');
  const musicLove     = $('musicLove');
  const musicFinal    = $('musicFinal');
  const musicToggle   = $('musicToggle');

  const btnViajar     = $('btnViajar');
  const viajeOverlay  = $('viajeOverlay');
  const viajeItems    = document.querySelectorAll('.viaje-item');
  const viajeTexto    = $('viajeTexto');
  const btnSalirViaje = $('btnSalirViaje');
  const viajeContador = $('viajeContador');
  const viajeTotal    = $('viajeTotal');
  const viajeBarraFill= $('viajeBarraFill');

  const btnSi         = $('btnSi');
  const btnPensar     = $('btnPensar');
  const finalMsg      = $('finalMsg');

  const cierreFinal   = $('cierreFinal');
  const cierreCanvas  = $('cierreCanvas');
  const cierreSobre   = $('cierreSobre');
  const cierreFase1   = $('cierreFase1');
  const cierreFase2   = $('cierreFase2');
  const cierreFase3   = $('cierreFase3');
  const cierreFase4   = $('cierreFase4');
  const cierreFase5   = $('cierreFase5');
  const cartaTitulo   = $('cartaTitulo');
  const cartaCuerpo   = $('cartaCuerpo');
  const cartaFirma    = $('cartaFirma');
  const promesasLista = $('promesasLista');

  // ─── TEXTOS ───
  const MENSAJES_AVATAR = [
    "Hola, soy tu guía personal de San Valentín. Prometo acompañarte en cada parte de este regalo que hice solo para ti. 💖",
    "Primero, respira... estás entrando a un lugar donde todo está hecho pensando en ti. ✨",
    "Desliza un poquito hacia abajo, tengo algo preparado para ti. 🌌",
    "¿Ya viste la sección del viaje? Dale, atrévete a pulsar ese botón. 🚀",
    "Cada recuerdo que vas a ver fue elegido con todo el corazón. 💕"
  ];

  const TEXTOS_VIAJE = [
    "Todo empezó con momentos simples, pero que para mí ya eran especiales.",
    "Luego vinieron días que no olvido, porque estabas tú ahí.",
    "Tu sonrisa se volvió mi lugar seguro en este universo.",
    "Entre fotos y videos, siempre hay algo en común: tú.",
    "Cada segundo Contigo es un tesoro que guardo para siempre.",
    "Y en algún punto del viaje entendí que ya no quería bajarme de esto Contigo.",
    "Mira cómo hemos crecido juntos... es hermoso.",
    "No cambiaría ni un solo momento de nuestra historia."
  ];

  const CARTA = {
    titulo: 'Mi amor hermoso...',
    cuerpo: `Sé que no somos perfectos. Sé que hay días difíciles, peleas que duelen, silencios que pesan. Pero también sé algo que vale más que todo eso: que cada vez que nos caemos, nos levantamos juntos.

Tú eres mi fuerza cuando no puedo más. Eres esa persona que me hace querer ser mejor cada día. No te elegí solo para los momentos bonitos, te elegí para TODO. Para las risas y las lágrimas, para las peleas y las reconciliaciones, para hoy y para siempre.

Gracias por no rendirte conmigo. Gracias por amarme tal como soy. Gracias por ser mi hogar.

Te amo con cada parte de mi ser. Hasta el final. 💕`,
    firma: 'Tu enamorado, siempre ❤️'
  };

  const PROMESAS = [
    "Prometo amarte incluso cuando estemos enojados",
    "Prometo nunca irme a dormir sin arreglar las cosas",
    "Prometo ser tu refugio cuando el mundo sea demasiado",
    "Prometo elegirte todos los días, no solo los fáciles",
    "Prometo hacerte reír hasta en tus peores días",
    "Prometo luchar por nosotros, siempre",
    "Prometo nunca dejar de conquistarte",
    "Prometo estar contigo hasta el final 💍"
  ];

  // ═══════════════════════════════════════════════════
  // 🔒 CANDADOS ANTI-DUPLICACIÓN
  // ═══════════════════════════════════════════════════
  let cartaIniciada = false;
  let clicSiEfectuado = false;
  let clicPensarEfectuado = false;
  let sobreAbierto = false;
  let cierreActivado = false;

  // ═══════════════════════════════════════════════════
  // 🔊 SISTEMA DE AUDIO CON FADE
  // ═══════════════════════════════════════════════════
  let musicaActual = null;
  let musicaActiva = false;
  let fadeInterval = null;

  function fadeOut(audio, dur) {
    return new Promise(resolve => {
      if (!audio || audio.paused) { resolve(); return; }
      const step = audio.volume / (dur / 30);
      clearInterval(fadeInterval);
      fadeInterval = setInterval(() => {
        if (audio.volume - step <= 0) {
          audio.volume = 0; audio.pause();
          clearInterval(fadeInterval); resolve();
        } else { audio.volume -= step; }
      }, 30);
    });
  }

  function fadeIn(audio, vol, dur) {
    return new Promise(resolve => {
      audio.volume = 0;
      audio.play().then(() => {
        const step = vol / (dur / 30);
        const fi = setInterval(() => {
          if (audio.volume + step >= vol) {
            audio.volume = vol; clearInterval(fi); resolve();
          } else { audio.volume += step; }
        }, 30);
      }).catch(() => resolve());
    });
  }

  async function reproducir(musica) {
    if (musicaActual === musica && !musica.paused) return;
    if (musicaActual && musicaActual !== musica) {
      await fadeOut(musicaActual, CONFIG.fadeMs);
      musicaActual.currentTime = 0;
    }
    musicaActual = musica;
    if (!musicaActual) return;
    let vol = CONFIG.volumenIntro;
    if (musica === musicLove)  vol = CONFIG.volumenLove;
    if (musica === musicFinal) vol = CONFIG.volumenFinal;
    try {
      await fadeIn(musica, vol, CONFIG.fadeMs);
      musicaActiva = true;
      musicToggle.classList.remove('paused');
    } catch(e) {
      musicaActiva = false;
      musicToggle.classList.add('paused');
    }
  }

  // ═══════════════════════════════════════════════════
  // 🌌 CANVAS DE PARTÍCULAS GLOBAL
  // ═══════════════════════════════════════════════════
  function initBgCanvas() {
    const canvas = $('bgCanvas');
    const ctx = canvas.getContext('2d');
    let particles = [];
    let mouse = { x: -1000, y: -1000 };

    function resize() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
    resize();
    window.addEventListener('resize', resize);
    document.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; });

    const COLORS = ['255,107,157','255,215,0','255,194,209','200,150,255','255,255,255','0,255,255','255,105,180'];

    class Particle {
      constructor() { this.reset(); }
      reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.baseSize = Math.random() * 2 + 0.4;
        this.size = this.baseSize;
        this.vy = -(Math.random() * 0.25 + 0.05);
        this.vx = (Math.random() - 0.5) * 0.15;
        this.opacity = Math.random() * 0.7 + 0.2;
        this.twSpeed = Math.random() * 0.012 + 0.004;
        this.twDir = 1;
        this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
      }
      update() {
        this.y += this.vy; this.x += this.vx;
        this.opacity += this.twSpeed * this.twDir;
        if (this.opacity >= 0.95 || this.opacity <= 0.15) this.twDir *= -1;
        const dx = this.x - mouse.x, dy = this.y - mouse.y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        if (dist < 120) {
          const force = (120 - dist) / 120;
          this.size = this.baseSize + force * 3;
          this.opacity = Math.min(1, this.opacity + force * 0.3);
        } else { this.size += (this.baseSize - this.size) * 0.05; }
        if (this.y < -10) { this.reset(); this.y = canvas.height + 10; }
        if (this.x < -10 || this.x > canvas.width + 10) this.reset();
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size * 4, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${this.color},${this.opacity * 0.06})`;
        ctx.fill();
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${this.color},${this.opacity})`;
        ctx.fill();
      }
    }

    for (let i = 0; i < 100; i++) particles.push(new Particle());

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => { p.update(); p.draw(); });
      for (let i = 0; i < particles.length; i++) {
        for (let j = i+1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const d = Math.sqrt(dx*dx + dy*dy);
          if (d < 80) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(255,105,180,${0.08*(1-d/80)})`;
            ctx.lineWidth = 0.5; ctx.stroke();
          }
        }
      }
      requestAnimationFrame(animate);
    }
    animate();
  }
  initBgCanvas();

  // ═══════════════════════════════════════════════════
  // ✨ SPARKLES AL CLICK
  // ═══════════════════════════════════════════════════
  const sparkleEmojis = ['💖','✨','💕','⭐','💗','🌟','💫','🦋'];

  document.addEventListener('click', e => {
    if (introScreen && !introScreen.classList.contains('hidden')) return;
    for (let i = 0; i < 7; i++) createSparkle(e.clientX, e.clientY);
  });

  function createSparkle(x, y) {
    const el = document.createElement('div');
    el.textContent = sparkleEmojis[Math.floor(Math.random() * sparkleEmojis.length)];
    const angle = Math.random() * Math.PI * 2;
    const dist = Math.random() * 90 + 30;
    const tx = Math.cos(angle) * dist;
    const ty = Math.sin(angle) * dist;
    el.style.cssText = `
      position:fixed;left:${x}px;top:${y}px;pointer-events:none;z-index:99998;
      font-size:${Math.random()*16+10}px;transition:all 0.8s cubic-bezier(0.23,1,0.32,1);opacity:1;
    `;
    document.body.appendChild(el);
    requestAnimationFrame(() => {
      el.style.transform = `translate(${tx}px,${ty}px) scale(0.2) rotate(${Math.random()*360}deg)`;
      el.style.opacity = '0';
    });
    setTimeout(() => el.remove(), 900);
  }

  // ═══════════════════════════════════════════════════
  // 💬 AVATAR
  // ═══════════════════════════════════════════════════
  let indiceMensaje = 0;
  let avatarAutoTimer = null;

  function cambiarDialogo(texto) {
    if (!avatarDialog) return;
    avatarDialog.style.opacity = '0';
    avatarDialog.style.transform = 'translateY(8px)';
    setTimeout(() => {
      avatarDialog.textContent = texto;
      avatarDialog.style.transition = 'all 0.5s ease';
      avatarDialog.style.opacity = '1';
      avatarDialog.style.transform = 'translateY(0)';
    }, 300);
  }

  function siguienteMensajeAvatar() {
    indiceMensaje = (indiceMensaje + 1) % MENSAJES_AVATAR.length;
    cambiarDialogo(MENSAJES_AVATAR[indiceMensaje]);
  }

  function iniciarAutoAvatar() {
    avatarAutoTimer = setInterval(siguienteMensajeAvatar, 20000);
  }

  function detenerAutoAvatar() {
    if (avatarAutoTimer) {
      clearInterval(avatarAutoTimer);
      avatarAutoTimer = null;
    }
  }

  // ═══════════════════════════════════════════════════
  // 🚪 ENTRADA
  // ═══════════════════════════════════════════════════
  btnEntrar.addEventListener('click', async () => {
    introScreen.style.transition = 'opacity 1.2s ease, filter 1.2s ease';
    introScreen.style.opacity = '0';
    introScreen.style.filter = 'blur(10px)';
    setTimeout(() => {
      introScreen.classList.add('hidden');
      mainWrapper.classList.add('visible');
      window.scrollTo({ top: 0, behavior: 'instant' });
    }, 1200);
    await reproducir(musicIntro);
    setTimeout(() => cambiarDialogo(MENSAJES_AVATAR[1]), 4000);
    setTimeout(() => cambiarDialogo(MENSAJES_AVATAR[2]), 9000);
    setTimeout(() => cambiarDialogo(MENSAJES_AVATAR[3]), 15000);
    setTimeout(iniciarAutoAvatar, 20000);
  });

  // ═══════════════════════════════════════════════════
  // 🎵 TOGGLE MÚSICA
  // ═══════════════════════════════════════════════════
  musicToggle.addEventListener('click', async () => {
    if (!musicaActual) { await reproducir(musicIntro); return; }
    if (musicaActiva && !musicaActual.paused) {
      musicaActual.pause(); musicaActiva = false;
      musicToggle.classList.add('paused');
    } else {
      try { await musicaActual.play(); musicaActiva = true; musicToggle.classList.remove('paused'); }
      catch(e) {}
    }
  });

  // ═══════════════════════════════════════════════════
  // 👀 SCROLL REVEAL
  // ═══════════════════════════════════════════════════
  const sectionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        sectionObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
  document.querySelectorAll('.seccion-entrada').forEach(el => sectionObserver.observe(el));

  // ═══════════════════════════════════════════════════
  // 🚀 VIAJE ESPACIAL WARP
  // ═══════════════════════════════════════════════════
  let warpCtx, warpStars = [], warpSpeed = 0, warpTarget = 0, warpRAF;
  let indiceRecuerdo = 0, viajeEnCurso = false, recuerdoTimeout = null;

  if (viajeTotal) viajeTotal.textContent = viajeItems.length;

  const recuerdoContainer = document.createElement('div');
  recuerdoContainer.className = 'recuerdo-flotante';
  recuerdoContainer.innerHTML = '<div class="recuerdo-marco"></div>';

  function initWarpCanvas() {
    const c = $('warpCanvas');
    if (!c) return;
    warpCtx = c.getContext('2d');
    warpStars = [];

    function resize() { c.width = window.innerWidth; c.height = window.innerHeight; }
    resize();
    window.addEventListener('resize', resize);

    const cx = () => c.width / 2;
    const cy = () => c.height / 2;

    class WarpStar {
      constructor() { this.reset(); }
      reset() {
        this.x = (Math.random() - 0.5) * c.width * 2;
        this.y = (Math.random() - 0.5) * c.height * 2;
        this.z = Math.random() * c.width;
        this.pz = this.z;
        const cols = ['255,255,255','255,182,255','255,215,0','200,150,255','255,105,180','0,255,255'];
        this.color = cols[Math.floor(Math.random() * cols.length)];
      }
      update(speed) {
        this.pz = this.z;
        this.z -= speed;
        if (this.z < 1) this.reset();
      }
      draw() {
        const sx = (this.x / this.z) * cx() + cx();
        const sy = (this.y / this.z) * cy() + cy();
        const px = (this.x / this.pz) * cx() + cx();
        const py = (this.y / this.pz) * cy() + cy();
        const size = Math.max(0, (1 - this.z / c.width) * 3);
        const alpha = Math.max(0, Math.min(1, (1 - this.z / c.width) * 1.5));

        if (warpSpeed > 3) {
          warpCtx.beginPath();
          warpCtx.moveTo(px, py);
          warpCtx.lineTo(sx, sy);
          warpCtx.strokeStyle = `rgba(${this.color},${alpha})`;
          warpCtx.lineWidth = size * 0.8;
          warpCtx.stroke();
        }
        warpCtx.beginPath();
        warpCtx.arc(sx, sy, size, 0, Math.PI * 2);
        warpCtx.fillStyle = `rgba(${this.color},${alpha})`;
        warpCtx.fill();
        if (size > 1) {
          warpCtx.beginPath();
          warpCtx.arc(sx, sy, size * 3, 0, Math.PI * 2);
          warpCtx.fillStyle = `rgba(${this.color},${alpha * 0.08})`;
          warpCtx.fill();
        }
      }
    }

    for (let i = 0; i < 600; i++) warpStars.push(new WarpStar());

    function animate() {
      warpSpeed += (warpTarget - warpSpeed) * 0.04;
      warpCtx.fillStyle = `rgba(0,0,0,${warpSpeed > 3 ? 0.15 : 0.3})`;
      warpCtx.fillRect(0, 0, c.width, c.height);
      warpStars.forEach(s => { s.update(warpSpeed); s.draw(); });
      warpRAF = requestAnimationFrame(animate);
    }
    animate();
  }

  function setWarpSpeed(speed) { warpTarget = speed; }

  btnViajar.addEventListener('click', () => {
    viajeOverlay.classList.add('activo');
    viajeEnCurso = true;
    indiceRecuerdo = 0;

    const contenido = viajeOverlay.querySelector('.viaje-contenido');
    if (!contenido.contains(recuerdoContainer)) contenido.appendChild(recuerdoContainer);

    reproducir(musicLove);
    cambiarDialogo("Prepárate, vamos a viajar por todo lo que hemos vivido Contigo. 🚀");
    initWarpCanvas();

    setTimeout(() => {
      setWarpSpeed(15);
      viajeOverlay.classList.add('warp-speed');
      recuerdoTimeout = setTimeout(() => mostrarRecuerdo(), 3000);
    }, 800);
  });

  function mostrarRecuerdo() {
    if (!viajeEnCurso || indiceRecuerdo >= viajeItems.length) {
      if (viajeEnCurso) { indiceRecuerdo = 0; mostrarRecuerdo(); }
      return;
    }

    setWarpSpeed(0.3);
    viajeOverlay.classList.remove('warp-speed');

    const item = viajeItems[indiceRecuerdo];
    const img = item.querySelector('img');
    const video = item.querySelector('video');
    const textoOriginal = item.querySelector('span')?.textContent || '';
    const esVideo = !!video;

    const marco = recuerdoContainer.querySelector('.recuerdo-marco');
    marco.innerHTML = '';

    let media;
    if (esVideo) {
      media = document.createElement('video');
      media.src = video.src;
      media.muted = true; media.loop = true;
      media.playsInline = true; media.autoplay = true;
      marco.appendChild(media);
      media.play().catch(() => {});
    } else {
      media = document.createElement('img');
      media.src = img.src;
      media.alt = img.alt || 'Recuerdo';
      marco.appendChild(media);
    }

    const textoDiv = document.createElement('div');
    textoDiv.className = 'recuerdo-texto';
    textoDiv.innerHTML = `<p>${textoOriginal}</p><span class="recuerdo-numero">${indiceRecuerdo+1} / ${viajeItems.length}</span>`;
    marco.appendChild(textoDiv);

    recuerdoContainer.classList.remove('saliendo');
    requestAnimationFrame(() => recuerdoContainer.classList.add('visible'));

    if (viajeContador) viajeContador.textContent = indiceRecuerdo + 1;
    if (viajeBarraFill) viajeBarraFill.style.width = ((indiceRecuerdo+1)/viajeItems.length*100)+'%';

    const textoIdx = Math.floor((indiceRecuerdo / viajeItems.length) * TEXTOS_VIAJE.length);
    const narrativo = TEXTOS_VIAJE[Math.min(textoIdx, TEXTOS_VIAJE.length - 1)];
    viajeTexto.style.opacity = '0';
    setTimeout(() => { viajeTexto.textContent = narrativo; viajeTexto.style.opacity = '1'; }, 500);

    let duracion = CONFIG.duracionFoto;
    if (esVideo) {
      if (media.duration && isFinite(media.duration)) {
        duracion = Math.min(Math.max(media.duration * 1000, CONFIG.duracionVideoMin), CONFIG.duracionVideoMax);
      } else {
        duracion = CONFIG.duracionVideoMin;
        media.addEventListener('loadedmetadata', () => {
          if (!viajeEnCurso) return;
          clearTimeout(recuerdoTimeout);
          recuerdoTimeout = setTimeout(() => ocultarRecuerdoYAvanzar(),
            Math.min(Math.max(media.duration*1000, CONFIG.duracionVideoMin), CONFIG.duracionVideoMax));
        }, { once: true });
      }
    }
    recuerdoTimeout = setTimeout(() => ocultarRecuerdoYAvanzar(), duracion);
  }

  function ocultarRecuerdoYAvanzar() {
    if (!viajeEnCurso) return;
    recuerdoContainer.classList.remove('visible');
    recuerdoContainer.classList.add('saliendo');
    const vid = recuerdoContainer.querySelector('video');
    if (vid) { vid.pause(); vid.currentTime = 0; }
    setWarpSpeed(15);
    viajeOverlay.classList.add('warp-speed');
    indiceRecuerdo++;
    recuerdoTimeout = setTimeout(() => mostrarRecuerdo(), 2500);
  }

  btnSalirViaje.addEventListener('click', () => {
    viajeEnCurso = false;
    clearTimeout(recuerdoTimeout);
    setWarpSpeed(0);
    recuerdoContainer.classList.remove('visible');
    recuerdoContainer.classList.add('saliendo');
    const vid = recuerdoContainer.querySelector('video');
    if (vid) vid.pause();
    viajeOverlay.classList.remove('activo', 'warp-speed');
    if (warpRAF) cancelAnimationFrame(warpRAF);
    if (viajeBarraFill) viajeBarraFill.style.width = '0%';
    viajeTexto.textContent = "Viajando por un universo lleno de momentos Contigo...";
    cambiarDialogo("¡Qué viaje tan hermoso! Ahora sigue bajando, todavía tengo algo más que preguntarte. ❤️");
    reproducir(musicIntro);
  });

  // ═══════════════════════════════════════════════════
  // 🎵 SCROLL → MÚSICA FINAL
  // ═══════════════════════════════════════════════════
  let finalActivado = false;
  window.addEventListener('scroll', () => {
    if (!seccionFinal || finalActivado) return;
    const rect = seccionFinal.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.65) {
      finalActivado = true;
      reproducir(musicFinal);
      cambiarDialogo("Llegamos a la parte importante... tengo algo que preguntarte. ❤️");
    }
  });

  // ═══════════════════════════════════════════════════
  // 💝 BOTONES FINALES — BLINDADOS
  // ═══════════════════════════════════════════════════
  btnSi.addEventListener('click', () => {
    if (clicSiEfectuado) return;
    clicSiEfectuado = true;

    btnSi.style.transform = 'scale(1.1)';
    btnSi.style.boxShadow = '0 0 40px rgba(255,105,180,0.6)';
    finalMsg.textContent = "Sabía que ibas a decir que sí... ahora cierra los ojos un segundo. 💘";
    cambiarDialogo("Prepárate para lo más hermoso que he hecho por ti... 🥹");
    const rect = btnSi.getBoundingClientRect();
    for (let i = 0; i < 20; i++) {
      setTimeout(() => createSparkle(
        rect.left + rect.width/2 + (Math.random()-0.5)*100,
        rect.top + rect.height/2 + (Math.random()-0.5)*100
      ), i * 50);
    }
    setTimeout(activarCierre, 3000);
  });

  btnPensar.addEventListener('click', () => {
    if (clicPensarEfectuado) return;
    clicPensarEfectuado = true;

    finalMsg.textContent = "No importa cuánto lo pienses... la respuesta siempre fue sí. 💫";
    cambiarDialogo("Igual te preparé algo, porque te conozco bien... 🌙");
    btnPensar.style.transition = 'transform 0.3s ease';
    btnPensar.style.transform = `translate(${(Math.random()-0.5)*60}px, ${(Math.random()-0.5)*30}px)`;
    setTimeout(() => {
      btnPensar.textContent = "Bueno ya, sí quiero 😍";
      btnPensar.style.transform = 'translate(0,0)';
      btnPensar.onclick = () => {
        if (cierreActivado) return;
        finalMsg.textContent = "¡Lo sabía! 💘";
        setTimeout(activarCierre, 2000);
      };
    }, 1500);
  });

  // ═══════════════════════════════════════════════════
  // 💖 CIERRE FINAL — BLINDADO
  // ═══════════════════════════════════════════════════
  function activarCierre() {
    if (cierreActivado) return;
    cierreActivado = true;

    // DETENER avatar auto-rotación
    detenerAutoAvatar();

    mainWrapper.style.transition = 'opacity 1.8s ease, filter 1.8s ease';
    mainWrapper.style.opacity = '0';
    mainWrapper.style.filter = 'blur(8px)';
    setTimeout(() => {
      mainWrapper.style.display = 'none';
      cierreFinal.style.display = 'block';
      cierreFinal.style.opacity = '0';
      cierreFinal.style.transition = 'opacity 2.5s ease';
      if (musicaActual !== musicFinal) reproducir(musicFinal);
      window.scrollTo({ top: 0, behavior: 'instant' });
      requestAnimationFrame(() => {
        cierreFinal.style.opacity = '1';
        initCierreCanvas();
        crearCorazonesCierre();
      });
    }, 2000);
  }

  function initCierreCanvas() {
    const ctx = cierreCanvas.getContext('2d');
    let estrellas = [];
    function resize() { cierreCanvas.width = window.innerWidth; cierreCanvas.height = window.innerHeight; }
    resize();
    window.addEventListener('resize', resize);
    const COLS = ['255,107,157','255,215,0','255,194,209','200,150,255','255,255,255','255,105,180','0,255,255'];
    class Star {
      constructor() { this.reset(); }
      reset() {
        this.x = Math.random() * cierreCanvas.width;
        this.y = Math.random() * cierreCanvas.height;
        this.s = Math.random() * 2.5 + 0.3;
        this.vy = -(Math.random() * 0.2 + 0.03);
        this.vx = (Math.random() - 0.5) * 0.12;
        this.op = Math.random() * 0.8 + 0.2;
        this.tw = Math.random() * 0.015 + 0.004;
        this.td = 1;
        this.c = COLS[Math.floor(Math.random() * COLS.length)];
      }
      update() {
        this.y += this.vy; this.x += this.vx;
        this.op += this.tw * this.td;
        if (this.op >= 1 || this.op <= 0.1) this.td *= -1;
        if (this.y < -10) { this.reset(); this.y = cierreCanvas.height + 10; }
      }
      draw() {
        ctx.save();
        ctx.globalAlpha = this.op * 0.15;
        ctx.strokeStyle = `rgb(${this.c})`;
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.moveTo(this.x - this.s*4, this.y); ctx.lineTo(this.x + this.s*4, this.y);
        ctx.moveTo(this.x, this.y - this.s*4); ctx.lineTo(this.x, this.y + this.s*4);
        ctx.stroke(); ctx.restore();
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.s*3.5, 0, Math.PI*2);
        ctx.fillStyle = `rgba(${this.c},${this.op*0.07})`;
        ctx.fill();
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.s, 0, Math.PI*2);
        ctx.fillStyle = `rgba(${this.c},${this.op})`;
        ctx.fill();
      }
    }
    for (let i = 0; i < 180; i++) estrellas.push(new Star());
    function loop() {
      ctx.clearRect(0, 0, cierreCanvas.width, cierreCanvas.height);
      estrellas.forEach(s => { s.update(); s.draw(); });
      requestAnimationFrame(loop);
    }
    loop();
  }

  function crearCorazonesCierre() {
    const cont = $('cierreCorazones');
    const emojis = ['❤️','💕','💖','💗','💓','🌹','✨','💝','🦋','💫','🥀','💘','💞'];
    function spawn() {
      const c = document.createElement('div');
      c.className = 'cierre-corazon-flotante';
      c.textContent = emojis[Math.floor(Math.random() * emojis.length)];
      c.style.left = Math.random()*100 + '%';
      c.style.fontSize = (Math.random()*18+10) + 'px';
      c.style.animationDuration = (Math.random()*9+7) + 's';
      c.style.animationDelay = Math.random()*2 + 's';
      cont.appendChild(c);
      setTimeout(() => c.remove(), 18000);
    }
    setInterval(spawn, 800);
    for (let i = 0; i < 12; i++) setTimeout(spawn, i*200);
  }

  // ─── FASE 1: Sobre — BLINDADO ───
  cierreSobre.addEventListener('click', () => {
    if (sobreAbierto) return;
    sobreAbierto = true;

    cierreSobre.classList.add('abierto');
    const rect = cierreSobre.getBoundingClientRect();
    for (let i = 0; i < 15; i++) {
      setTimeout(() => createSparkle(rect.left+rect.width/2, rect.top+rect.height/2), i*60);
    }
    setTimeout(() => {
      cierreFase1.style.transition = 'opacity 0.8s ease';
      cierreFase1.style.opacity = '0';
      setTimeout(() => {
        cierreFase1.style.display = 'none';
        cierreFase2.style.display = 'block';
        typewriterCarta();
      }, 900);
    }, 1200);
  });

  // ─── FASE 2: Carta — BLINDADA con substring ───
  function typewriterCarta() {
    if (cartaIniciada) return;
    cartaIniciada = true;

    let i = 0;
    cartaTitulo.textContent = '';
    cartaCuerpo.textContent = '';
    cartaCuerpo.innerText = '';
    cartaFirma.textContent = '';
    cartaFirma.style.opacity = '0';

    function escribirTitulo() {
      if (i < CARTA.titulo.length) {
        cartaTitulo.textContent = CARTA.titulo.substring(0, i + 1);
        i++;
        setTimeout(escribirTitulo, 70);
      } else {
        i = 0;
        setTimeout(escribirCuerpo, 600);
      }
    }

    function escribirCuerpo() {
      if (i < CARTA.cuerpo.length) {
        cartaCuerpo.innerText = CARTA.cuerpo.substring(0, i + 1);
        i++;
        let charActual = CARTA.cuerpo[i - 1];
        let delay = 35;
        if (charActual === '.') delay = 400;
        else if (charActual === ',') delay = 200;
        else if (charActual === '\n') delay = 300;
        setTimeout(escribirCuerpo, delay);
      } else {
        cartaFirma.textContent = CARTA.firma;
        cartaFirma.style.transition = 'opacity 2s ease';
        cartaFirma.style.opacity = '1';
        setTimeout(mostrarFase3, 12000);
      }
    }

    escribirTitulo();
  }

  // ─── FASE 3: Galería ───
  function mostrarFase3() {
    cierreFase2.style.transition = 'opacity 1.2s ease, transform 1.2s ease';
    cierreFase2.style.opacity = '0';
    cierreFase2.style.transform = 'translateY(-30px)';
    setTimeout(() => {
      cierreFase2.style.display = 'none';
      cierreFase3.style.display = 'block';
      setTimeout(mostrarFase4, 6000);
    }, 1300);
  }

  // ─── FASE 4: Promesas ───
  function mostrarFase4() {
    cierreFase3.style.transition = 'opacity 1.2s ease';
    cierreFase3.style.opacity = '0';
    setTimeout(() => {
      cierreFase3.style.display = 'none';
      cierreFase4.style.display = 'block';
      PROMESAS.forEach((p, idx) => {
        const div = document.createElement('div');
        div.className = 'promesa-item';
        div.innerHTML = `<span>✦</span> ${p}`;
        promesasLista.appendChild(div);
        setTimeout(() => div.classList.add('visible'), idx * 700);
      });
      setTimeout(mostrarFase5, PROMESAS.length * 700 + 3500);
    }, 1300);
  }

  // ─── FASE 5: Gran Final ───
  function mostrarFase5() {
    cierreFase4.style.transition = 'opacity 1.5s ease';
    cierreFase4.style.opacity = '0';
    setTimeout(() => {
      cierreFase4.style.display = 'none';
      cierreFase5.style.display = 'block';
      const cx = window.innerWidth / 2, cy = window.innerHeight / 3;
      for (let i = 0; i < 30; i++) {
        setTimeout(() => createSparkle(
          cx + (Math.random()-0.5)*300, cy + (Math.random()-0.5)*200
        ), i * 80);
      }
      iniciarContador();
    }, 1600);
  }

  // ─── Contador ───
  function iniciarContador() {
    const inicio = new Date(CONFIG.fechaInicio);
    function actualizar() {
      const diff = new Date() - inicio;
      animarNumero('cDias',  Math.floor(diff / 86400000));
      animarNumero('cHoras', Math.floor((diff % 86400000) / 3600000));
      animarNumero('cMins',  Math.floor((diff % 3600000) / 60000));
      animarNumero('cSegs',  Math.floor((diff % 60000) / 1000));
    }
    function animarNumero(id, valor) {
      const el = $(id); if (!el) return;
      if ((parseInt(el.textContent)||0) !== valor) {
        el.style.transform = 'translateY(-5px)'; el.style.opacity = '0.5';
        setTimeout(() => {
          el.textContent = valor;
          el.style.transition = 'all 0.3s ease';
          el.style.transform = 'translateY(0)'; el.style.opacity = '1';
        }, 150);
      }
    }
    actualizar();
    setInterval(actualizar, 1000);
  }

  // ─── PRECARGAR VIDEOS ───
  viajeItems.forEach(item => {
    const v = item.querySelector('video');
    if (v) { v.preload = 'metadata'; v.load(); }
  });

  console.log('💖 San Valentín Ultra-Gozu FINAL BLINDADO cargado');
});
