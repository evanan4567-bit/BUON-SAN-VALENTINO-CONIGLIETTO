const introScreen = document.getElementById('introScreen');
const btnEntrar = document.getElementById('btnEntrar');
const mainWrapper = document.getElementById('mainWrapper');

const musicIntro = document.getElementById('musicIntro');
const musicLove = document.getElementById('musicLove');
const musicFinal = document.getElementById('musicFinal');
const musicToggle = document.getElementById('musicToggle');

const avatarDialog = document.getElementById('avatarDialog');
const seccionLove = document.getElementById('seccionLove');
const seccionFinal = document.getElementById('seccionFinal');
const btnSi = document.getElementById('btnSi');
const btnPensar = document.getElementById('btnPensar');
const finalMsg = document.getElementById('finalMsg');

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

function mostrarSiguienteMensaje() {
  indiceMensaje = (indiceMensaje + 1) % mensajes.length;
  avatarDialog.textContent = mensajes[indiceMensaje];
}

// Al pulsar "Entrar" → aparece la página y suena música de intro
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

// Cambios de música según scroll

window.addEventListener('scroll', () => {
  const loveTop = seccionLove.getBoundingClientRect().top;
  const finalTop = seccionFinal.getBoundingClientRect().top;
  const viewportHeight = window.innerHeight;

  if (!loveActivado && loveTop < viewportHeight * 0.7) {
    loveActivado = true;
    reproducir(musicLove);
    avatarDialog.textContent = "Esta parte es mi favorita: hablarte de lo que siento por ti. 💌";
  }

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

