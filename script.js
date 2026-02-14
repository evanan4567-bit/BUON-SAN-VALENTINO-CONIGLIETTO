// Elementos principales
const introScreen = document.getElementById('introScreen');
const btnEntrar = document.getElementById('btnEntrar');
const mainWrapper = document.getElementById('mainWrapper');

// Músicas
const musicIntro = document.getElementById('musicIntro');
const musicLove = document.getElementById('musicLove');      // Aquí va "Contigo"
const musicFinal = document.getElementById('musicFinal');    // Aquí va "Escalera al cielo"
const musicToggle = document.getElementById('musicToggle');

// Avatar y secciones
const avatarDialog = document.getElementById('avatarDialog');
const seccionLove = document.getElementById('seccionLove');       // viaje espacial
const seccionFinal = document.getElementById('seccionFinal');

// Viaje espacial (slides de recuerdos)
const espacioSlides = document.querySelectorAll('.espacio-slide');
const espacioTexto = document.getElementById('espacioTexto');

// Botones finales
const btnSi = document.getElementById('btnSi');
const btnPensar = document.getElementById('btnPensar');
const finalMsg = document.getElementById('finalMsg');

// Mensajes del avatar
const mensajes = [
  "Hola, soy tu guía personal de San Valentín. Prometo acompañarte en cada parte de este regalo que hice solo para ti. 💖",
  "Primero, respira... estás entrando a un lugar donde todo está hecho pensando en ti. ✨",
  "Desliza un poquito hacia abajo, hay más sorpresas esperándote justo aquí. 🌌"
];

let indiceMensaje = 0;
let musicaActual = null;
let musicaActiva = false;
let loveActivado = false;
let finalActivado = false;

// Viaje espacial: textos para cada recuerdo
let indiceSlide = 0;
const textosViaje = [
  "Todo empezó con momentos simples, pero que para mí ya eran especiales.",
  "Luego vinieron días que no olvido, porque estabas tú ahí.",
  "Tu sonrisa se volvió mi lugar seguro en este universo.",
  "Y en algún punto del viaje entendí que ya no quería bajarme de esto Contigo."
];

// Función para reproducir cualquier música
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

// Avanzar en el viaje espacial
function avanzarViaje() {
  if (!espacioSlides.length) return;

  espacioSlides.forEach((slide) => {
    slide.style.transition = 'transform 0.8s ease';
    slide.style.transform = `translateX(-${indiceSlide * 100}%)`;
  });

  const texto = textosViaje[indiceSlide] || textosViaje[textosViaje.length - 1];
  espacioTexto.textContent = texto;

  indiceSlide++;
  if (indiceSlide >= espacioSlides.length) {
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

// Botón de música (pausar / continuar)
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

// Cambios según scroll (Contigo + final)
window.addEventListener('scroll', () => {
  const loveTop = seccionLove.getBoundingClientRect().top;
  const finalTop = seccionFinal.getBoundingClientRect().top;
  const viewportHeight = window.innerHeight;

  // Cuando entra sección "Viaje espacial / Contigo"
  if (!loveActivado && loveTop < viewportHeight * 0.7) {
    loveActivado = true;
    reproducir(musicLove); // aquí suena Contigo
    avatarDialog.textContent = "Abro este viaje espacial para que recorramos nuestros recuerdos Contigo. 🚀";
    avanzarViaje();
    setInterval(avanzarViaje, 6000); // cambia de recuerdo cada 6 segundos
  }

  // Cuando entra la sección final
  if (!finalActivado && finalTop < viewportHeight * 0.7) {
    finalActivado = true;
    reproducir(musicFinal); // aquí Escalera al cielo
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

