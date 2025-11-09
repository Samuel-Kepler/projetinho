// Seleciona os elementos
const audio = document.getElementById("audio");
const playBtn = document.getElementById("play");
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");
const progressBar = document.getElementById("progress-bar");
const progress = document.getElementById("progress");
const currentTimeEl = document.getElementById("current");
const durationEl = document.getElementById("duration");
const volumeSlider = document.getElementById("volume");
const heartBtn = document.getElementById("heart");
const titleEl = document.getElementById("title");
const artistEl = document.getElementById("artist");
const coverImg = document.getElementById("cover-img");

// Lista de músicas (pode adicionar mais)
const playlist = [
  {
    title: "Domingas",
    artist: "Jorge Ben Jor",
    src: "assets/domingas.mp3",
    cover: "assets/cover 1.jpg"
  }
];

let currentTrack = 0;
let isPlaying = false;

// Atualiza as informações da faixa
function loadTrack(index) {
  const track = playlist[index];
  audio.src = track.src;
  titleEl.textContent = track.title;
  artistEl.textContent = track.artist;
  coverImg.src = track.cover;
}

// Formata tempo (segundos → mm:ss)
function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
}

// Play/Pause
playBtn.addEventListener("click", () => {
  if (isPlaying) {
    audio.pause();
    playBtn.textContent = "▶️";
  } else {
    audio.play();
    playBtn.textContent = "⏸";
  }
  isPlaying = !isPlaying;
});

// Atualiza barra de progresso
audio.addEventListener("timeupdate", () => {
  const progressPercent = (audio.currentTime / audio.duration) * 100;
  progressBar.style.width = `${progressPercent}%`;

  currentTimeEl.textContent = formatTime(audio.currentTime);
  durationEl.textContent = formatTime(audio.duration);
});

// Clica na barra para mudar tempo
progress.addEventListener("click", (e) => {
  const width = progress.clientWidth;
  const clickX = e.offsetX;
  const duration = audio.duration;

  audio.currentTime = (clickX / width) * duration;
});

// Volume
volumeSlider.addEventListener("input", (e) => {
  audio.volume = e.target.value;
});

// Coração (efeito simbólico)
heartBtn.addEventListener("click", () => {
  heartBtn.classList.toggle("active");
  heartBtn.textContent = heartBtn.classList.contains("active") ? "💞" : "💖";
});

// Música anterior / próxima (opcional se tiver mais faixas)
prevBtn.addEventListener("click", () => {
  currentTrack = (currentTrack - 1 + playlist.length) % playlist.length;
  loadTrack(currentTrack);
  if (isPlaying) audio.play();
});

nextBtn.addEventListener("click", () => {
  currentTrack = (currentTrack + 1) % playlist.length;
  loadTrack(currentTrack);
  if (isPlaying) audio.play();
});

// Quando carregar a página
window.addEventListener("load", () => {
  loadTrack(currentTrack);
});


// // === GALERIA DE IMAGENS ===
// const gallery = document.getElementById("gallery");
// const slides = document.querySelectorAll(".slide");

// let currentSlide = 0;

// // Mostra o carrossel quando a música começar
// audio.addEventListener("play", () => {
//   gallery.classList.remove("hidden");
// });


// // Troca de imagens automática
// function showNextSlide() {
//   slides[currentSlide].classList.remove("active");
//   currentSlide = (currentSlide + 1) % slides.length;
//   slides[currentSlide].classList.add("active");
// }

// setInterval(showNextSlide, 6000); // muda a cada 6 segundos


const messageSection = document.getElementById('message-section');
const typedMessage = document.getElementById('typed-message');

// Função para o efeito de digitação
function typeMessage(text, element, speed = 70, callback) {
  let index = 0;
  element.textContent = "";

  function type() {
    if (index < text.length) {
      element.textContent += text.charAt(index);
      index++;
      setTimeout(type, speed);
    } else if (callback) {
      setTimeout(callback, 1200); // espera 1.2s antes da próxima mensagem
    }
  }

  type();
}

// Quando o áudio começar a tocar
audio.addEventListener('play', () => {
  // Espera alguns segundos antes de iniciar a mensagem (para dar tempo da música começar)
  setTimeout(() => {
    messageSection.classList.remove('hidden');
    messageSection.classList.add('visible');

    // Primeira mensagem
    typeMessage("Desde que te conheci, algo mudou em mim... 💌", typedMessage, 80, () => {
      // Depois que a primeira terminar, espera um pouco e digita a segunda
      setTimeout(() => {
        typedMessage.textContent += "\n\n"; // quebra de linha entre frases
        typeMessage("E cada segundo ao seu lado se tornou meu instante favorito. 🌙", typedMessage, 80);
      }, 1000);
    });
  }, 8000); // inicia após 8 segundos de música
});


// ======= CORAÇÕES FLUTUANTES =======
// garante que o container exista
const heartsContainer = document.getElementById('hearts');

// função que cria um coração com propriedades aleatórias
function createHeart() {
  if (!heartsContainer) return;

  const heart = document.createElement('div');
  heart.classList.add('heart', 'animated');

  // variações: tamanho
  const sizeRand = Math.random();
  if (sizeRand < 0.35) heart.classList.add('small');
  else if (sizeRand > 0.85) heart.classList.add('big');

  // posição horizontal inicial (em %)
  const left = Math.random() * 100; // 0% - 100%
  heart.style.left = left + '%';

  // leve deslocamento inicial usado pela animação (em px)
  const sway = Math.floor(15 + Math.random() * 50); // 15 - 65px
  heart.style.setProperty('--sway', sway + 'px');

  // escala (tamanho visual)
  const scale = (0.8 + Math.random() * 0.8).toFixed(2); // 0.8 - 1.6
  heart.style.setProperty('--s', scale);

  // animação duração aleatória (mais lento ou mais rápido)
  const duration = (4 + Math.random() * 6).toFixed(2); // 4s - 10s
  heart.style.animationDuration = duration + 's';

  // pequena variação na fase horizontal (para balanço)
  heart.style.setProperty('--start-x', '0px');

  heartsContainer.appendChild(heart);

  // remover depois de terminar a animação para não encher o DOM
  heart.addEventListener('animationend', () => {
    heart.remove();
  });
}

// controle: cria corações periodicamente enquanto o áudio toca
let heartsIntervalId = null;

// função para iniciar o efeito (spawn a cada X ms)
function startHearts(frequency = 800) {
  // já iniciado?
  if (heartsIntervalId) return;
  // cria um pequeno estouro inicial de corações
  for (let i = 0; i < 6; i++) {
    setTimeout(createHeart, i * 120);
  }
  heartsIntervalId = setInterval(() => {
    // cria 1-2 corações por intervalo
    createHeart();
    if (Math.random() > 0.75) createHeart();
  }, frequency);
}

// função para parar o spawn
function stopHearts() {
  if (heartsIntervalId) {
    clearInterval(heartsIntervalId);
    heartsIntervalId = null;
  }
}

// liga/desliga com o áudio
// (usa a variável `audio` que você já possui no script)
if (typeof audio !== 'undefined') {
  audio.addEventListener('play', () => startHearts(900)); // ajustar frequência se quiser
  audio.addEventListener('pause', () => stopHearts());
  audio.addEventListener('ended', () => stopHearts());
}

// opcional: start/stop quando o usuário clicar no botão play (caso autoplay seja bloqueado)
const playToggleBtn = document.getElementById('play');
if (playToggleBtn) {
  playToggleBtn.addEventListener('click', () => {
    setTimeout(() => {
      // verifica estado real do áudio
      if (!audio.paused) startHearts(900);
      else stopHearts();
    }, 80);
  });
}

// ======= BOTÃO DE REVELAÇÃO =======
const revealBtn = document.getElementById('reveal-btn');
const finalMessage = document.getElementById('final-message');

if (revealBtn && finalMessage) {
  revealBtn.addEventListener('click', () => {
    finalMessage.classList.add('show');
  });

  // (opcional) clique fora da caixa para fechar
  finalMessage.addEventListener('click', (e) => {
    if (e.target === finalMessage) {
      finalMessage.classList.remove('show');
    }
  });
}

// // ======= FECHAMENTO E REPLAY =======
// const closing = document.getElementById('closing');
// const replayBtn = document.getElementById('replay-btn');

// // Mostrar fechamento após revelar a mensagem
// if (finalMessage) {
//   finalMessage.addEventListener('transitionend', () => {
//     closing.classList.add('show');
//   });
// }

// // Replay da experiência
// if (replayBtn) {
//   replayBtn.addEventListener('click', () => {
//     // Reseta player de música
//     const audio = document.querySelector('audio');
//     if (audio) {
//       audio.currentTime = 0;
//       audio.pause();
//     }

//     // Esconde seções e reinicia a animação
//     document.getElementById('final-message').classList.remove('show');
//     closing.classList.remove('show');

//     // Rola até o topo
//     window.scrollTo({ top: 0, behavior: 'smooth' });
//   });
// }

// ======= GALERIA DE IMAGENS (CARROSSEL) =======
const gallery = document.getElementById('gallery');
const slides = document.querySelectorAll('.slide');
let currentSlide = 0;

// Garante que a galeria comece escondida
if (gallery) {
  gallery.classList.add('hidden');
}

// Quando a música começar a tocar
audio.addEventListener('play', () => {
  if (gallery) {
    gallery.classList.remove('hidden');
  }

  // Começa o carrossel se ainda não estiver rodando
  if (slides.length > 0) {
    slides[currentSlide].classList.add('active');

    setInterval(() => {
      slides[currentSlide].classList.remove('active');
      currentSlide = (currentSlide + 1) % slides.length;
      slides[currentSlide].classList.add('active');
    }, 6000); // muda a imagem a cada 6 segundos
  }
});
