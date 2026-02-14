// Elementos principales
const introScreen = document.getElementById('introScreen');
const btnEntrar = document.getElementById('btnEntrar');
const mainWrapper = document.getElementById('mainWrapper');

// Músicas
const musicIntro = document.getElementById('musicIntro');
const musicLove = document.getElementById('musicLove');      // Contigo
const musicFinal = document.getElementById('musicFinal');    // Escalera al cielo
const musicToggle = document.getElementById('musicToggle');

// Avatar y secciones
const avatarDialog = document.getElementById('avatarDialog');
const seccionFinal = document.getElementById('seccionFinal');

// Viaje espacial
const btnViajar = document.getElementById('btnViajar');
const viajeOverlay = document.getElementById('viajeOverlay');
const viajeCarril = document.getElementById('viajeCarril');
const viajeTexto = document.getElementById('viajeTexto');
const btnSalirViaje = document.getElementById('btnSalirViaje');
const viajeItems = document.querySelectorAll('.viaje-item');

// Botones finales
const btnSi = document.getElementById('btnSi');
const btnPensar = document.getElementById('btnPensar');
const finalMsg = document.getElementById('finalMsg');

// Mensajes del avatar
const mensajes = [
  "Hola, soy tu guía personal de San Valentín. Prometo acompañarte en cada parte de este regalo que hice solo para ti. 💖",
  "Primero, respira... estás entrando a un lugar donde todo está hecho pensando en ti. ✨",
  "Desliza un poquito hacia abajo, tengo algo preparado para ti. 🌌"
];

let indiceMensaje = 0;
let musicaActual = null;
let musicaActiva = false;
let finalActivado = false;

// Viaje espacial
let indiceSlide = 0;
let intervaloViaje = null;

const textosViaje = [
  "Todo empezó con momentos simples, pero que para mí ya eran especiales.",
  "Luego vinieron días que no olvido, porque estabas tú ahí.",
  "Tu sonrisa se volvió mi lugar seguro en este universo.",
  "Entre fotos y videos, siempre hay algo en común: tú.",
  "Y en algún punto del viaje entendí que ya no quería bajarme de esto Contigo."
];

// Reproducir música de fondo
async function reproducir(musica) {
  if (musicaActual && musicaActual !== musica) {
    musicaActual.pause();
    musicaActual.currentTime = 0;
  }
  musicaActual = musica;
  if (!musicaActual) return;

  try {
    await musicaActual.play();
    musicaActiva = true;
    musicToggle.textContent = '🔈 Pausar';
  } catch (e) {
    musicaActiva = false;
    musicToggle.textContent = '🔊 Música';
  }
}

// Cambiar mensaje del avatar
function mostrarSiguienteMensaje() {
  indiceMensaje = (indiceMensaje + 1) % mensajes.length;
  avatarDialog.textContent = mensajes[indiceMensaje];
}

// Avanzar en el viaje (fotos + videos)
function avanzarViaje() {
  if (!viajeItems.length) return;

  viajeItems.forEach((item, index) => {
    item.style.transition = 'transform 0.8s ease';
    item.style.transform = `translateX(-${indiceSlide * 100}%)`;

    const video = item.querySelector('video');
    if (video) {
      if (index === indiceSlide) {
        // Escena visible → intentar reproducir
        video.play().catch(() => {});
      } else {
        // Escenas que no se ven → pausar y resetear
        video.pause();
        video.currentTime = 0;
      }
    }
  });

  const texto = textosViaje[indiceSlide] || textosViaje[textosViaje.length - 1];
  viajeTexto.textContent = texto;

  indiceSlide++;
  if (indiceSlide >= viajeItems.length) {
    indiceSlide = 0;
  }
}

// Evento: pulsar "Entrar"
btnEntrar.addEventListener('click', async () => {
  introScreen.classList.add('hidden');
  mainWrapper.classList.add('visible');

  await reproducir(musicIntro);

  setTimeout(mostrarSiguienteMensaje, 4000);
  setTimeout(mostrarSiguienteMensaje, 9000);
});

// Botón de música
musicToggle.addEventListener('click', async () => {
  if (!musicaActual) {
    await reproducir(musicIntro);
    return;
  }

  if (musicaActiva) {
    musicaActual.pause();
    musicaActiva = false;
    musicToggle.textContent = '🔊 Música';
  } else {
    await reproducir(musicaActual);
  }
});

// Botón "Iniciar viaje espacial"
btnViajar.addEventListener('click', () => {
  viajeOverlay.classList.add('activo');

  reproducir(musicLove); // Contigo
  avatarDialog.textContent = "Prepárate, vamos a viajar por todo lo que hemos vivido Contigo. 🚀";

  indiceSlide = 0;
  avanzarViaje();
  clearInterval(intervaloViaje);
  intervaloViaje = setInterval(avanzarViaje, 4500); // pensado para ~40 escenas en 3 min
});

// Botón "Terminar viaje"
btnSalirViaje.addEventListener('click', () => {
  viajeOverlay.classList.remove('activo');
  clearInterval(intervaloViaje);
  viajeTexto.textContent = "Viajando por un universo lleno de momentos Contigo...";
  avatarDialog.textContent = "Podemos seguir bajando, todavía tengo algo más que preguntarte. ❤️";

  // Pausar cualquier video que haya quedado sonando
  viajeItems.forEach(item => {
    const video = item.querySelector('video');
    if (video) {
      video.pause();
      video.currentTime = 0;
    }
  });
});

// Scroll: cuando llega a la sección final → música final
window.addEventListener('scroll', () => {
  const finalTop = seccionFinal.getBoundingClientRect().top;
  const viewportHeight = window.innerHeight;

  if (!finalActivado && finalTop < viewportHeight * 0.7) {
    finalActivado = true;
    reproducir(musicFinal);
    avatarDialog.textContent = "Llegamos a la parte importante... tengo algo que preguntarte. ❤️";
  }
});

// Botones finales
btnSi.addEventListener('click', () => {
  finalMsg.textContent = "Sabía que ibas a decir que sí. Gracias por ser mi San Valentín. 💘";
  avatarDialog.textContent = "Acabas de hacer muy feliz a la persona que programó todo esto por ti. 🥹";
});

btnPensar.addEventListener('click', () => {
  finalMsg.textContent = "Está bien, tómate tu tiempo... pero en el fondo sé que ya tienes la respuesta. 💫";
  avatarDialog.textContent = "No importa cuánto lo pienses, mi respuesta siempre será la misma: me encantas. 🌙";
});
