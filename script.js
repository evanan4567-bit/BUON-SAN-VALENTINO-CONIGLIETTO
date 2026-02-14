// ═══════════════════════════════════════════════════════════════
// 💖 SAN VALENTÍN ULTRA-GOZU — SCRIPT SUPREMO
// Sincronización perfecta: intro → viaje → pregunta → cierre
// ═══════════════════════════════════════════════════════════════

document.addEventListener('DOMContentLoaded', function () {

  // ─────────────────────────────────────────────────
  // 🔧 CONFIGURACIÓN PERSONALIZABLE
  // ─────────────────────────────────────────────────
  const CONFIG = {
    fechaInicio:    '2025-06-21T20:30:00',       // 📅 Fecha de inicio de relación
    nombrePareja:   'Briggith',          // 💕 Nombre de tu pareja
    tuNombre:       'Ivan',     // 🧑 Tu nombre para la firma
    duracionFoto:   5000,               // ⏱️ ms que dura cada foto en el viaje
    duracionVideoMin: 6000,             // ⏱️ ms mínimo para videos
    duracionVideoMax: 15000,            // ⏱️ ms máximo para videos (si el video es más largo, se corta)
    volumenIntro:   0.45,
    volumenLove:    0.40,
    volumenFinal:   0.35,
    fadeMs:         1200,               // ms del fade entre canciones
  };

  // ─────────────────────────────────────────────────
  // 📌 ELEMENTOS DEL DOM
  // ─────────────────────────────────────────────────
  const $ = id => document.getElementById(id);

  const introScreen     = $('introScreen');
  const btnEntrar       = $('btnEntrar');
  const mainWrapper     = $('mainWrapper');
  const avatarDialog    = $('avatarDialog');
  const seccionFinal    = $('seccionFinal');

  // Músicas
  const musicIntro      = $('musicIntro');
  const musicLove       = $('musicLove');
  const musicFinal      = $('musicFinal');
  const musicToggle     = $('musicToggle');

  // Viaje
  const btnViajar       = $('btnViajar');
  const viajeOverlay    = $('viajeOverlay');
  const viajeCarril     = $('viajeCarril');
  const viajeTexto      = $('viajeTexto');
  const btnSalirViaje   = $('btnSalirViaje');
  const viajeItems      = document.querySelectorAll('.viaje-item');
  const viajeContador   = $('viajeContador');
  const viajeTotal      = $('viajeTotal');
  const viajeBarraFill  = $('viajeBarraFill');

  // Finales
  const btnSi           = $('btnSi');
  const btnPensar       = $('btnPensar');
  const finalMsg        = $('finalMsg');

  // Cierre
  const cierreFinal     = $('cierreFinal');
  const cierreCanvas    = $('cierreCanvas');
  const cierreSobre     = $('cierreSobre');
  const cierreFase1     = $('cierreFase1');
  const cierreFase2     = $('cierreFase2');
  const cierreFase3     = $('cierreFase3');
  const cierreFase4     = $('cierreFase4');
  const cierreFase5     = $('cierreFase5');
  const cartaTitulo     = $('cartaTitulo');
  const cartaCuerpo     = $('cartaCuerpo');
  const cartaFirma      = $('cartaFirma');
  const promesasLista   = $('promesasLista');

  // ─────────────────────────────────────────────────
  // ✏️ TEXTOS PERSONALIZABLES
  // ─────────────────────────────────────────────────
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

  // ─────────────────────────────────────────────────
  // 🔊 SISTEMA DE AUDIO CON FADE PROFESIONAL
  // ─────────────────────────────────────────────────
  let musicaActual = null;
  let musicaActiva = false;
  let fadeInterval = null;

  function fadeOut(audio, duracion) {
    return new Promise(resolve => {
      if (!audio || audio.paused) { resolve(); return; }
      const step = audio.volume / (duracion / 30);
      clearInterval(fadeInterval);
      fadeInterval = setInterval(() => {
        if (audio.volume - step <= 0) {
          audio.volume = 0;
          audio.pause();
          clearInterval(fadeInterval);
          resolve();
        } else {
          audio.volume -= step;
        }
      }, 30);
    });
  }

  function fadeIn(audio, volumenTarget, duracion) {
    return new Promise(resolve => {
      audio.volume = 0;
      audio.play().then(() => {
        const step = volumenTarget / (duracion / 30);
        const fi = setInterval(() => {
          if (audio.volume + step >= volumenTarget) {
            audio.volume = volumenTarget;
            clearInterval(fi);
            resolve();
          } else {
            audio.volume += step;
          }
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
    } catch (e) {
      musicaActiva = false;
      musicToggle.classList.add('paused');
    }
  }

  // ─────────────────────────────────────────────────
  // 🌌 CANVAS DE PARTÍCULAS GLOBAL
  // ─────────────────────────────────────────────────
  function initBgCanvas() {
    const canvas = $('bgCanvas');
    const ctx = canvas.getContext('2d');
    let particles = [];
    let mouse = { x: -1000, y: -1000 };

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    document.addEventListener('mousemove', e => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });

    const COLORS = [
      '255,107,157', '255,215,0', '255,194,209',
      '200,150,255', '255,255,255', '0,255,255',
      '255,105,180', '255,20,147'
    ];

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
        // Movimiento base
        this.y += this.vy;
        this.x += this.vx;

        // Twinkle
        this.opacity += this.twSpeed * this.twDir;
        if (this.opacity >= 0.95 || this.opacity <= 0.15) this.twDir *= -1;

        // Reacción al mouse (magia ✨)
        const dx = this.x - mouse.x;
        const dy = this.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          const force = (120 - dist) / 120;
          this.size = this.baseSize + force * 3;
          this.opacity = Math.min(1, this.opacity + force * 0.3);
        } else {
          this.size += (this.baseSize - this.size) * 0.05;
        }

        // Reset al salir
        if (this.y < -10) { this.reset(); this.y = canvas.height + 10; }
        if (this.x < -10 || this.x > canvas.width + 10) { this.reset(); }
      }
      draw() {
        // Glow exterior
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size * 4, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${this.color},${this.opacity * 0.06})`;
        ctx.fill();

        // Partícula
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

      // Líneas entre partículas cercanas
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < 80) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(255,105,180,${0.08 * (1 - d / 80)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      requestAnimationFrame(animate);
    }
    animate();
  }

  // Iniciar canvas inmediatamente
  initBgCanvas();

  // ─────────────────────────────────────────────────
  // ✨ SPARKLES AL CLICK (en todo el sitio)
  // ─────────────────────────────────────────────────
  const sparkleEmojis = ['💖','✨','💕','⭐','💗','🌟','💫','🦋'];

  document.addEventListener('click', e => {
    if (!introScreen.classList.contains('hidden')) return;
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
      position:fixed; left:${x}px; top:${y}px; pointer-events:none; z-index:99998;
      font-size:${Math.random() * 16 + 10}px;
      transition: all 0.8s cubic-bezier(0.23, 1, 0.32, 1);
      opacity:1;
    `;
    document.body.appendChild(el);
    requestAnimationFrame(() => {
      el.style.transform = `translate(${tx}px, ${ty}px) scale(0.2) rotate(${Math.random()*360}deg)`;
      el.style.opacity = '0';
    });
    setTimeout(() => el.remove(), 900);
  }

  // ─────────────────────────────────────────────────
  // 💬 AVATAR: SISTEMA DE DIÁLOGOS INTELIGENTE
  // ─────────────────────────────────────────────────
  let indiceMensaje = 0;

  function cambiarDialogo(texto, duracion) {
    avatarDialog.style.opacity = '0';
    avatarDialog.style.transform = 'translateY(8px)';
    setTimeout(() => {
      avatarDialog.textContent = texto;
      avatarDialog.style.transition = 'all 0.5s ease';
      avatarDialog.style.opacity = '1';
      avatarDialog.style.transform = 'translateY(0)';
    }, 300);
    if (duracion) {
      return new Promise(r => setTimeout(r, duracion));
    }
  }

  function siguienteMensajeAvatar() {
    indiceMensaje = (indiceMensaje + 1) % MENSAJES_AVATAR.length;
    cambiarDialogo(MENSAJES_AVATAR[indiceMensaje]);
  }

  // ─────────────────────────────────────────────────
  // 🚪 ENTRADA AL SITIO
  // ─────────────────────────────────────────────────
  btnEntrar.addEventListener('click', async () => {
    // Efecto de salida de la intro
    introScreen.style.transition = 'opacity 1.2s ease, filter 1.2s ease';
    introScreen.style.opacity = '0';
    introScreen.style.filter = 'blur(10px)';

    setTimeout(() => {
      introScreen.classList.add('hidden');
      mainWrapper.classList.add('visible');

      // Scroll al inicio
      window.scrollTo({ top: 0, behavior: 'instant' });
    }, 1200);

    // Música intro con fade in
    await reproducir(musicIntro);

    // Secuencia de diálogos del avatar
    setTimeout(() => cambiarDialogo(MENSAJES_AVATAR[1]), 4000);
    setTimeout(() => cambiarDialogo(MENSAJES_AVATAR[2]), 9000);
    setTimeout(() => cambiarDialogo(MENSAJES_AVATAR[3]), 15000);
  });

  // ─────────────────────────────────────────────────
  // 🎵 TOGGLE DE MÚSICA
  // ─────────────────────────────────────────────────
  musicToggle.addEventListener('click', async () => {
    if (!musicaActual) {
      await reproducir(musicIntro);
      return;
    }
    if (musicaActiva && !musicaActual.paused) {
      musicaActual.pause();
      musicaActiva = false;
      musicToggle.classList.add('paused');
    } else {
      try {
        await musicaActual.play();
        musicaActiva = true;
        musicToggle.classList.remove('paused');
      } catch(e) {}
    }
  });

  // ─────────────────────────────────────────────────
  // 👀 SCROLL REVEAL (secciones entran con animación)
  // ─────────────────────────────────────────────────
  const observerOpts = { threshold: 0.15, rootMargin: '0px 0px -40px 0px' };

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        sectionObserver.unobserve(entry.target);
      }
    });
  }, observerOpts);

  document.querySelectorAll('.seccion-entrada').forEach(el => sectionObserver.observe(el));

  // ─────────────────────────────────────────────────
  // 🚀 VIAJE ESPACIAL — SISTEMA COMPLETO
  // ─────────────────────────────────────────────────
  let indiceSlide = 0;
  let timeoutViaje = null;
  let viajeActivo = false;

  // Actualizar total de slides
  if (viajeTotal) viajeTotal.textContent = viajeItems.length;

  function actualizarIndicador() {
    if (viajeContador) viajeContador.textContent = indiceSlide + 1;
    if (viajeBarraFill) {
      const pct = ((indiceSlide + 1) / viajeItems.length) * 100;
      viajeBarraFill.style.width = pct + '%';
    }
  }

  function obtenerDuracionItem(item) {
    const video = item.querySelector('video');
    if (!video) return CONFIG.duracionFoto;

    // Si el video tiene duración conocida, úsala (con límites)
    if (video.duration && isFinite(video.duration)) {
      const durMs = video.duration * 1000;
      return Math.min(Math.max(durMs, CONFIG.duracionVideoMin), CONFIG.duracionVideoMax);
    }
    // Fallback: esperar a que cargue la metadata
    return CONFIG.duracionVideoMin;
  }

  function moverCarril() {
    viajeItems.forEach((item, i) => {
      item.style.transition = 'transform 0.9s cubic-bezier(0.23, 1, 0.32, 1)';
      item.style.transform = `translateX(-${indiceSlide * 100}%)`;

      const video = item.querySelector('video');
      if (video) {
        if (i === indiceSlide) {
          video.currentTime = 0;
          video.play().catch(() => {});
        } else {
          video.pause();
          video.currentTime = 0;
        }
      }
    });

    // Texto narrativo
    const textoIdx = Math.floor((indiceSlide / viajeItems.length) * TEXTOS_VIAJE.length);
    const texto = TEXTOS_VIAJE[Math.min(textoIdx, TEXTOS_VIAJE.length - 1)];
    viajeTexto.style.opacity = '0';
    setTimeout(() => {
      viajeTexto.textContent = texto;
      viajeTexto.style.transition = 'opacity 0.6s ease';
      viajeTexto.style.opacity = '1';
    }, 400);

    actualizarIndicador();
  }

  function programarSiguiente() {
    if (!viajeActivo) return;
    const itemActual = viajeItems[indiceSlide];
    const duracion = obtenerDuracionItem(itemActual);

    // Para videos: esperar a que la metadata cargue para obtener duración real
    const video = itemActual.querySelector('video');
    if (video && (!video.duration || !isFinite(video.duration))) {
      video.addEventListener('loadedmetadata', () => {
        if (!viajeActivo) return;
        const durReal = obtenerDuracionItem(itemActual);
        clearTimeout(timeoutViaje);
        timeoutViaje = setTimeout(avanzar, durReal);
      }, { once: true });
    }

    clearTimeout(timeoutViaje);
    timeoutViaje = setTimeout(avanzar, duracion);
  }

  function avanzar() {
    if (!viajeActivo) return;
    indiceSlide++;
    if (indiceSlide >= viajeItems.length) {
      indiceSlide = 0; // loop
    }
    moverCarril();
    programarSiguiente();
  }

  // Botón iniciar viaje
  btnViajar.addEventListener('click', () => {
    viajeOverlay.classList.add('activo');
    viajeActivo = true;

    reproducir(musicLove);
    cambiarDialogo("Prepárate, vamos a viajar por todo lo que hemos vivido Contigo. 🚀");

    indiceSlide = 0;
    moverCarril();
    programarSiguiente();
  });

  // Botón terminar viaje
  btnSalirViaje.addEventListener('click', () => {
    viajeActivo = false;
    clearTimeout(timeoutViaje);
    viajeOverlay.classList.remove('activo');

    // Pausar todos los videos
    viajeItems.forEach(item => {
      const v = item.querySelector('video');
      if (v) { v.pause(); v.currentTime = 0; }
    });

    // Reset visual
    viajeTexto.textContent = "Viajando por un universo lleno de momentos Contigo...";
    if (viajeBarraFill) viajeBarraFill.style.width = '0%';

    cambiarDialogo("¡Qué viaje tan hermoso! Ahora sigue bajando, todavía tengo algo más que preguntarte. ❤️");

    // Volver a música intro
    reproducir(musicIntro);
  });

  // ─────────────────────────────────────────────────
  // 🎵 SCROLL → MÚSICA FINAL (Memories of Heaven)
  // ─────────────────────────────────────────────────
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

  // ─────────────────────────────────────────────────
  // 💝 BOTONES FINALES → ACTIVAR CIERRE
  // ─────────────────────────────────────────────────
  btnSi.addEventListener('click', () => {
    btnSi.style.transform = 'scale(1.1)';
    btnSi.style.boxShadow = '0 0 40px rgba(255,105,180,0.6)';
    finalMsg.textContent = "Sabía que ibas a decir que sí... ahora cierra los ojos un segundo. 💘";
    cambiarDialogo("Prepárate para lo más hermoso que he hecho por ti... 🥹");

    // Explosión de sparkles
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
    finalMsg.textContent = "No importa cuánto lo pienses... la respuesta siempre fue sí. 💫";
    cambiarDialogo("Igual te preparé algo, porque te conozco bien... 🌙");

    // Mover el botón "pensarlo" para que sea divertido
    btnPensar.style.transition = 'transform 0.3s ease';
    btnPensar.style.transform = `translate(${(Math.random()-0.5)*60}px, ${(Math.random()-0.5)*30}px)`;

    setTimeout(() => {
      btnPensar.textContent = "Bueno ya, sí quiero 😍";
      btnPensar.style.transform = 'translate(0,0)';
      btnPensar.onclick = () => {
        finalMsg.textContent = "¡Lo sabía! 💘";
        setTimeout(activarCierre, 2000);
      };
    }, 1500);
  });

  // ═══════════════════════════════════════════════════════
  // 💖 CIERRE FINAL — 5 FASES CINEMATOGRÁFICAS
  // ═══════════════════════════════════════════════════════

  function activarCierre() {
    // Fade out del main
    mainWrapper.style.transition = 'opacity 1.8s ease, filter 1.8s ease';
    mainWrapper.style.opacity = '0';
    mainWrapper.style.filter = 'blur(8px)';

    setTimeout(() => {
      mainWrapper.style.display = 'none';
      cierreFinal.style.display = 'block';
      cierreFinal.style.opacity = '0';
      cierreFinal.style.transition = 'opacity 2.5s ease';

      // Asegurar Memories of Heaven
      if (musicaActual !== musicFinal) {
        reproducir(musicFinal);
      }

      // Scroll al inicio del cierre
      window.scrollTo({ top: 0, behavior: 'instant' });

      requestAnimationFrame(() => {
        cierreFinal.style.opacity = '1';
        initCierreCanvas();
        crearCorazonesCierre();
      });
    }, 2000);
  }

  // ─── Canvas del cierre (estrellas premium) ───
  function initCierreCanvas() {
    const ctx = cierreCanvas.getContext('2d');
    let estrellas = [];

    function resize() {
      cierreCanvas.width = window.innerWidth;
      cierreCanvas.height = window.innerHeight;
    }
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
        this.y += this.vy;
        this.x += this.vx;
        this.op += this.tw * this.td;
        if (this.op >= 1 || this.op <= 0.1) this.td *= -1;
        if (this.y < -10) { this.reset(); this.y = cierreCanvas.height + 10; }
      }
      draw() {
        // Cruz de luz (efecto estrella real)
        ctx.save();
        ctx.globalAlpha = this.op * 0.15;
        ctx.strokeStyle = `rgb(${this.c})`;
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.moveTo(this.x - this.s * 4, this.y);
        ctx.lineTo(this.x + this.s * 4, this.y);
        ctx.moveTo(this.x, this.y - this.s * 4);
        ctx.lineTo(this.x, this.y + this.s * 4);
        ctx.stroke();
        ctx.restore();

        // Glow
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.s * 3.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${this.c},${this.op * 0.07})`;
        ctx.fill();

        // Core
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.s, 0, Math.PI * 2);
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

  // ─── Corazones flotantes del cierre ───
  function crearCorazonesCierre() {
    const cont = $('cierreCorazones');
    const emojis = ['❤️','💕','💖','💗','💓','🌹','✨','💝','🦋','💫','🥀','💘','💞'];

    function spawn() {
      const c = document.createElement('div');
      c.className = 'cierre-corazon-flotante';
      c.textContent = emojis[Math.floor(Math.random() * emojis.length)];
      c.style.left = Math.random() * 100 + '%';
      c.style.fontSize = (Math.random() * 18 + 10) + 'px';
      c.style.animationDuration = (Math.random() * 9 + 7) + 's';
      c.style.animationDelay = Math.random() * 2 + 's';
      cont.appendChild(c);
      setTimeout(() => c.remove(), 18000);
    }

    setInterval(spawn, 800);
    for (let i = 0; i < 12; i++) setTimeout(spawn, i * 200);
  }

  // ─── FASE 1: Sobre ───
  cierreSobre.addEventListener('click', () => {
    cierreSobre.classList.add('abierto');

    // Sparkles del sobre
    const rect = cierreSobre.getBoundingClientRect();
    for (let i = 0; i < 15; i++) {
      setTimeout(() => createSparkle(
        rect.left + rect.width/2,
        rect.top + rect.height/2
      ), i * 60);
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

  // ─── FASE 2: Carta typewriter ───
  function typewriterCarta() {
    let i = 0;
    cartaTitulo.textContent = '';
    cartaCuerpo.textContent = '';

    function escribirTitulo() {
      if (i < CARTA.titulo.length) {
        cartaTitulo.textContent += CARTA.titulo[i];
        i++;
        setTimeout(escribirTitulo, 70);
      } else {
        i = 0;
        setTimeout(escribirCuerpo, 600);
      }
    }

    function escribirCuerpo() {
      if (i < CARTA.cuerpo.length) {
        cartaCuerpo.textContent += CARTA.cuerpo[i];
        i++;
        // Más rápido en espacios y saltos de línea
        const delay = (CARTA.cuerpo[i-1] === ' ' || CARTA.cuerpo[i-1] === '\n') ? 10 : 22;
        setTimeout(escribirCuerpo, delay);
      } else {
        cartaFirma.textContent = CARTA.firma;
        cartaFirma.style.opacity = '0';
        cartaFirma.style.animation = 'cierreFadeIn 1.2s ease forwards';

        // Auto-avanzar a galería
        setTimeout(mostrarFase3, 5000);
      }
    }

    escribirTitulo();
  }

  // ─── FASE 3: Galería Polaroid ───
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

  // ─── FASE 5: GRAN FINAL ───
  function mostrarFase5() {
    cierreFase4.style.transition = 'opacity 1.5s ease';
    cierreFase4.style.opacity = '0';

    setTimeout(() => {
      cierreFase4.style.display = 'none';
      cierreFase5.style.display = 'block';

      // Mega explosión de sparkles
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 3;
      for (let i = 0; i < 30; i++) {
        setTimeout(() => createSparkle(
          cx + (Math.random() - 0.5) * 300,
          cy + (Math.random() - 0.5) * 200
        ), i * 80);
      }

      iniciarContador();
    }, 1600);
  }

  // ─── Contador en vivo ───
  function iniciarContador() {
    const inicio = new Date(CONFIG.fechaInicio);

    function actualizar() {
      const ahora = new Date();
      const diff = ahora - inicio;

      const dias  = Math.floor(diff / 86400000);
      const horas = Math.floor((diff % 86400000) / 3600000);
      const mins  = Math.floor((diff % 3600000) / 60000);
      const segs  = Math.floor((diff % 60000) / 1000);

      animarNumero('cDias', dias);
      animarNumero('cHoras', horas);
      animarNumero('cMins', mins);
      animarNumero('cSegs', segs);
    }

    function animarNumero(id, valor) {
      const el = $(id);
      if (!el) return;
      const actual = parseInt(el.textContent) || 0;
      if (actual !== valor) {
        el.style.transform = 'translateY(-5px)';
        el.style.opacity = '0.5';
        setTimeout(() => {
          el.textContent = valor;
          el.style.transition = 'all 0.3s ease';
          el.style.transform = 'translateY(0)';
          el.style.opacity = '1';
        }, 150);
      }
    }

    actualizar();
    setInterval(actualizar, 1000);
  }

  // ─────────────────────────────────────────────────
  // 🌊 PARALLAX SUAVE EN EL HERO
  // ─────────────────────────────────────────────────
  window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const sections = document.querySelectorAll('.section');
    sections.forEach(sec => {
      const rect = sec.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        const progress = 1 - (rect.top / window.innerHeight);
        sec.style.setProperty('--scroll-progress', progress);
      }
    });
  });

  // ─────────────────────────────────────────────────
  // 🎯 PRECARGAR VIDEOS DEL VIAJE
  // ─────────────────────────────────────────────────
  viajeItems.forEach(item => {
    const video = item.querySelector('video');
    if (video) {
      video.preload = 'metadata';
      video.load();
    }
  });

  // ─────────────────────────────────────────────────
  // 🔄 AUTO-ROTAR MENSAJES DEL AVATAR CADA 20s
  // ─────────────────────────────────────────────────
  let avatarAutoTimer = null;

  function iniciarAutoAvatar() {
    avatarAutoTimer = setInterval(siguienteMensajeAvatar, 20000);
  }

  // Se inicia después de la secuencia inicial de la entrada
  setTimeout(iniciarAutoAvatar, 20000);

  // ─────────────────────────────────────────────────
  // ✅ FIN DEL DOMContentLoaded
  // ─────────────────────────────────────────────────
  console.log('💖 San Valentín Ultra-Gozu cargado correctamente');
  console.log('🎵 Audios: musica_intro, musica_love (Los Panchos), musica_final (Memories of Heaven)');
  console.log('🚀 ¡Todo listo para el amor!');

});
