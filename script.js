const introScreen = document.getElementById('introScreen');
const btnEntrar = document.getElementById('btnEntrar');
const mainWrapper = document.getElementById('mainWrapper');
const bgMusic = document.getElementById('bgMusic');
const musicToggle = document.getElementById('musicToggle');
const avatarDialog = document.getElementById('avatarDialog');

const mensajes = [
  "Hola, soy tu San Vale8k personal. Prometo guiarte por todo este regalo que hice solo para ti. 💖",
  "Primero, respira... estás entrando a un lugar donde todo está hecho pensando en ti. ✨",
  "Desliza un poquito hacia abajo, hay más sorpresas esperándote justo aquí. 🌌"
];

let indiceMensaje = 0;

function mostrarSiguienteMensaje() {
  indiceMensaje = (indiceMensaje + 1) % mensajes.length;
  avatarDialog.textContent = mensajes[indiceMensaje];
}

btnEntrar.addEventListener('click', async () => {
  introScreen.classList.add('hidden');
  mainWrapper.classList.add('visible');

  try {
    await bgMusic.play();
    musicToggle.textContent = '🔈 Pausar';
  } catch (e) {
    // Si el navegador bloquea el autoplay, el botón quedará para que ella lo active.
    musicToggle.textContent = '🔊 Música';
  }

  setTimeout(mostrarSiguienteMensaje, 4000);
  setTimeout(mostrarSiguienteMensaje, 9000);
});

musicToggle.addEventListener('click', async () => {
  if (bgMusic.paused) {
    await bgMusic.play();
    musicToggle.textContent = '🔈 Pausar';
  } else {
    bgMusic.pause();
    musicToggle.textContent = '🔊 Música';
  }
});
