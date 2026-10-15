/**
 * BODA DE EDÉN & JULIETA - 16 DE ENERO DE 2027
 * JavaScript interactivo para la invitación digital
 * 100% en Español
 */

document.addEventListener('DOMContentLoaded', () => {
  initCountdown();
  initPetals();
  initAudioPlayer();
  initRsvpForm();
  initGalleryLightbox();
  initCalendarButtons();
  initCopyAddress();
  initWelcomeModal();
});

/* ==========================================================================
   1. CUENTA REGRESIVA EN VIVO (LIVE COUNTDOWN)
   Fecha: 16 de Enero de 2027 a las 13:00 hrs (Hora Rodeo, Dgo. UTC-6)
   ========================================================================== */
function initCountdown() {
  const daysEl = document.getElementById('days');
  const hoursEl = document.getElementById('hours');
  const minutesEl = document.getElementById('minutes');
  const secondsEl = document.getElementById('seconds');
  const countdownContainer = document.getElementById('countdown-timer');

  if (!daysEl || !hoursEl || !minutesEl || !secondsEl) return;

  // Fecha del evento: 16 de enero de 2027 a las 13:00
  const weddingDate = new Date(2027, 0, 16, 13, 0, 0).getTime();

  function updateTimer() {
    const now = new Date().getTime();
    const distance = weddingDate - now;

    if (distance < 0) {
      if (countdownContainer) {
        countdownContainer.innerHTML = `
          <div style="grid-column: 1 / -1; padding: 20px; font-family: var(--font-serif); font-size: 1.8rem; color: var(--primary-gold); font-weight: 600;">
            ¡Hoy es el gran día! ¡Celebremos el amor de Edén y Julieta! 💍✨
          </div>
        `;
      }
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    daysEl.textContent = String(days).padStart(2, '0');
    hoursEl.textContent = String(hours).padStart(2, '0');
    minutesEl.textContent = String(minutes).padStart(2, '0');
    secondsEl.textContent = String(seconds).padStart(2, '0');
  }

  updateTimer();
  setInterval(updateTimer, 1000);
}

/* ==========================================================================
   2. REPRODUCTOR DE MÚSICA & SÍNTESIS ROMÁNTICA WEB AUDIO
   Permite ambientación musical suave y confiable en cualquier navegador
   ========================================================================== */
let audioCtx = null;
let isPlaying = false;
let synthTimer = null;

function initAudioPlayer() {
  const toggleBtn = document.getElementById('music-toggle-btn');
  const bgAudio = document.getElementById('wedding-audio');

  if (!toggleBtn) return;

  // Secuencia armónica romántica (Canon / balada nupcial suave)
  const chords = [
    [261.63, 329.63, 392.00], // Do mayor (C)
    [196.00, 246.94, 293.66], // Sol mayor (G)
    [220.00, 261.63, 329.63], // La menor (Am)
    [164.81, 196.00, 246.94], // Mi menor (Em)
    [174.61, 220.00, 261.63], // Fa mayor (F)
    [130.81, 164.81, 196.00], // Do mayor bajo
    [174.61, 220.00, 261.63], // Fa mayor
    [196.00, 246.94, 293.66]  // Sol mayor
  ];

  let chordIndex = 0;

  function playHarmonicChord() {
    if (!isPlaying || !audioCtx) return;
    const now = audioCtx.currentTime;
    const chord = chords[chordIndex % chords.length];
    chordIndex++;

    chord.forEach((freq, idx) => {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      const filter = audioCtx.createBiquadFilter();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq * (idx === 0 ? 1 : 1.002), now);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(800, now);

      // Envelope suave
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.06 / (idx + 1), now + 0.5 + idx * 0.15);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 3.4);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start(now + idx * 0.15);
      osc.stop(now + 3.6);
    });

    synthTimer = setTimeout(playHarmonicChord, 3400);
  }

  function startMusic() {
    // Si hay un archivo de audio local con pista, intentamos reproducirlo
    if (bgAudio && bgAudio.src && !bgAudio.src.endsWith('#')) {
      bgAudio.play().then(() => {
        isPlaying = true;
        updateMusicUI(true);
      }).catch(() => {
        startWebAudioFallback();
      });
    } else {
      startWebAudioFallback();
    }
  }

  function startWebAudioFallback() {
    try {
      if (!audioCtx) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        audioCtx = new AudioContext();
      }
      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }
      isPlaying = true;
      updateMusicUI(true);
      playHarmonicChord();
    } catch (e) {
      console.warn('Audio contextual no disponible', e);
    }
  }

  function stopMusic() {
    isPlaying = false;
    updateMusicUI(false);
    if (bgAudio) {
      bgAudio.pause();
    }
    if (synthTimer) {
      clearTimeout(synthTimer);
      synthTimer = null;
    }
  }

  function updateMusicUI(active) {
    if (active) {
      toggleBtn.classList.add('playing');
      toggleBtn.setAttribute('title', 'Pausar música romántica');
      toggleBtn.setAttribute('aria-label', 'Pausar música');
    } else {
      toggleBtn.classList.remove('playing');
      toggleBtn.setAttribute('title', 'Reproducir música romántica');
      toggleBtn.setAttribute('aria-label', 'Reproducir música');
    }
  }

  toggleBtn.addEventListener('click', () => {
    if (isPlaying) {
      stopMusic();
    } else {
      startMusic();
    }
  });

  // Exponer a nivel global para el botón de bienvenida
  window.startWeddingMusic = startMusic;
}

/* ==========================================================================
   3. PANTALLA DE BIENVENIDA / ABRIR INVITACIÓN (OPEN ENVELOPE)
   ========================================================================== */
function initWelcomeModal() {
  const overlay = document.getElementById('welcome-overlay');
  const openBtn = document.getElementById('btn-open-invitation');

  if (!overlay || !openBtn) return;

  openBtn.addEventListener('click', () => {
    overlay.classList.add('hidden');
    // Iniciar suavemente música
    if (window.startWeddingMusic) {
      window.startWeddingMusic();
    }
    // Desplazar suavemente a inicio
    window.scrollTo({ top: 0, behavior: 'smooth' });
    showToast('¡Bienvenidos a la boda de Edén y Julieta!');
  });
}

/* ==========================================================================
   4. EFECTO DE PÉTALOS FLOTANTES (CANVAS PARTICLES)
   ========================================================================== */
function initPetals() {
  const canvas = document.getElementById('petals-canvas');
  const togglePetalsBtn = document.getElementById('petals-toggle-btn');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);
  let animationActive = true;

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const petalsCount = window.innerWidth < 768 ? 22 : 36;
  const petals = [];

  class Petal {
    constructor() {
      this.reset();
      this.y = Math.random() * height; // dispersión inicial
    }

    reset() {
      this.x = Math.random() * width;
      this.y = -20;
      this.size = Math.random() * 9 + 8;
      this.speedY = Math.random() * 1.2 + 0.6;
      this.speedX = Math.random() * 0.8 - 0.4;
      this.angle = Math.random() * 360;
      this.angularSpeed = (Math.random() - 0.5) * 1.5;
      this.opacity = Math.random() * 0.5 + 0.35;
      // Colores suaves: rosa pétalo, crema suave y toque dorado
      const hues = [
        'rgba(242, 214, 204, ', // blush
        'rgba(235, 198, 184, ', // rose
        'rgba(247, 230, 206, ', // champagne
        'rgba(223, 186, 115, '  // gold
      ];
      this.colorBase = hues[Math.floor(Math.random() * hues.length)];
    }

    update() {
      this.y += this.speedY;
      this.x += Math.sin(this.y * 0.01) * 0.7 + this.speedX;
      this.angle += this.angularSpeed;

      if (this.y > height + 20 || this.x < -30 || this.x > width + 30) {
        this.reset();
      }
    }

    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate((this.angle * Math.PI) / 180);
      ctx.beginPath();
      ctx.ellipse(0, 0, this.size, this.size * 0.6, 0, 0, Math.PI * 2);
      ctx.fillStyle = this.colorBase + this.opacity + ')';
      ctx.fill();
      ctx.restore();
    }
  }

  for (let i = 0; i < petalsCount; i++) {
    petals.push(new Petal());
  }

  function render() {
    if (!animationActive) return;
    ctx.clearRect(0, 0, width, height);
    for (const petal of petals) {
      petal.update();
      petal.draw();
    }
    requestAnimationFrame(render);
  }
  render();

  if (togglePetalsBtn) {
    togglePetalsBtn.addEventListener('click', () => {
      animationActive = !animationActive;
      if (animationActive) {
        togglePetalsBtn.style.opacity = '1';
        togglePetalsBtn.setAttribute('title', 'Desactivar lluvia de pétalos');
        render();
        showToast('Pétalos activados');
      } else {
        ctx.clearRect(0, 0, width, height);
        togglePetalsBtn.style.opacity = '0.5';
        togglePetalsBtn.setAttribute('title', 'Activar lluvia de pétalos');
        showToast('Pétalos en pausa');
      }
    });
  }
}

/* ==========================================================================
   5. CONFIRMACIÓN DE ASISTENCIA VÍA WHATSAPP (RSVP)
   Generador dinámico de mensaje y enlace formal
   ========================================================================== */
function initRsvpForm() {
  const form = document.getElementById('wedding-rsvp-form');
  const nameInput = document.getElementById('rsvp-name');
  const passesInput = document.getElementById('rsvp-passes');
  const messageInput = document.getElementById('rsvp-message');
  const phoneSettingInput = document.getElementById('rsvp-phone');
  const previewTextEl = document.getElementById('rsvp-preview-text');

  if (!form) return;

  function getSelectedAttendance() {
    const checked = document.querySelector('input[name="attendance"]:checked');
    return checked ? checked.value : 'si';
  }

  function updatePreview() {
    const name = nameInput.value.trim() || '[Tu Nombre y Apellido]';
    const attendance = getSelectedAttendance();
    const passes = passesInput.value;
    const customMsg = messageInput.value.trim();

    const isAttending = attendance === 'si';
    const statusText = isAttending
      ? '✅ ¡Sí, asistiré con mucha alegría a celebrar con ustedes!'
      : '🤍 Lamentablemente no podré acompañarlos, pero les deseo lo mejor.';

    const passesText = isAttending
      ? `\n👥 Pases confirmados: ${passes} persona(s)`
      : '';

    const messageText = customMsg
      ? `\n💌 Mensaje: "${customMsg}"`
      : '';

    const previewMsg = `¡Hola Edén y Julieta! 💍✨

${statusText}

👤 Invitado(s): ${name}${passesText}${messageText}

¡Muchas felicidades y bendiciones en su matrimonio! 🥂`;

    if (previewTextEl) {
      previewTextEl.textContent = previewMsg;
    }

    return previewMsg;
  }

  // Escuchar cambios en campos para vista previa en vivo
  nameInput.addEventListener('input', updatePreview);
  passesInput.addEventListener('change', updatePreview);
  messageInput.addEventListener('input', updatePreview);

  const radioLabels = document.querySelectorAll('.attendance-label');
  radioLabels.forEach(label => {
    label.addEventListener('click', () => {
      radioLabels.forEach(l => l.classList.remove('selected'));
      label.classList.add('selected');
      setTimeout(updatePreview, 50);
    });
  });

  updatePreview();

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = nameInput.value.trim();
    if (!name) {
      alert('Por favor, ingresa tu nombre completo para confirmar tu asistencia.');
      nameInput.focus();
      return;
    }

    const message = updatePreview();
    const encodedMessage = encodeURIComponent(message);

    // Obtener número de WhatsApp de destino (opcionalmente configurable)
    let phoneNumber = phoneSettingInput ? phoneSettingInput.value.trim().replace(/\D/g, '') : '';
    
    // Si no se proporcionó número específico de los novios, se abre el selector de WhatsApp universal
    let whatsappUrl = '';
    if (phoneNumber && phoneNumber.length >= 10) {
      whatsappUrl = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodedMessage}`;
    } else {
      // Abre WhatsApp con el mensaje listo para elegir contacto de Edén o Julieta
      whatsappUrl = `https://api.whatsapp.com/send?text=${encodedMessage}`;
    }

    showToast('Abriendo WhatsApp para enviar confirmación...');
    window.open(whatsappUrl, '_blank');
  });
}

/* ==========================================================================
   6. VISOR DE FOTOS LIGHTBOX (PHOTO GALLERY)
   ========================================================================== */
function initGalleryLightbox() {
  const modal = document.getElementById('lightbox-modal');
  const modalImg = document.getElementById('lightbox-img');
  const modalCaption = document.getElementById('lightbox-caption');
  const closeBtn = document.getElementById('lightbox-close');
  const galleryCards = document.querySelectorAll('.gallery-card');

  if (!modal || !modalImg) return;

  galleryCards.forEach(card => {
    card.addEventListener('click', () => {
      const img = card.querySelector('img');
      const caption = card.querySelector('.gallery-caption');
      if (img) {
        modalImg.src = img.src;
        modalImg.alt = img.alt || 'Foto de los novios';
        if (modalCaption && caption) {
          modalCaption.textContent = caption.textContent;
        }
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });
}

/* ==========================================================================
   7. AGREGAR A CALENDARIO (GOOGLE & APPLE .ICS)
   ========================================================================== */
function initCalendarButtons() {
  const googleBtn = document.getElementById('btn-add-google');
  const icsBtn = document.getElementById('btn-add-ics');

  const title = encodeURIComponent('Boda de Edén y Julieta 💍✨');
  const details = encodeURIComponent(
    'Celebración del matrimonio de Edén y Julieta.\n' +
    '13:00 - Discurso bíblico (C. Durango, Rodeo, Dgo.)\n' +
    '14:30 - Recepción y Fiesta (Quinta Ohana, Rodeo, Dgo.)\n' +
    '¡Esperamos contar con tu valiosa compañía!'
  );
  const location = encodeURIComponent('Rodeo, Durango, México');
  // Fecha UTC: 16 de enero de 2027 a las 13:00 Rodeo (UTC-6) -> 19:00 UTC
  // Hasta las 23:00 Rodeo -> 05:00 UTC del 17 de enero
  const dates = '20270116T190000Z/20270117T050000Z';

  if (googleBtn) {
    googleBtn.href = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${dates}&details=${details}&location=${location}`;
    googleBtn.target = '_blank';
  }

  if (icsBtn) {
    icsBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const icsContent = 
`BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Edén y Julieta//Boda Nupcial//ES
CALSCALE:GREGORIAN
BEGIN:VEVENT
SUMMARY:Boda de Edén y Julieta 💍✨
DESCRIPTION:Celebración de la boda de Edén y Julieta. 13:00 Discurso bíblico, 14:30 Recepción en Quinta Ohana.
LOCATION:Rodeo, Durango, México
DTSTART:20270116T190000Z
DTEND:20270117T050000Z
STATUS:CONFIRMED
END:VEVENT
END:VCALENDAR`;

      const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
      const url = window.URL.createObjectURL(blob);
      const tempLink = document.createElement('a');
      tempLink.href = url;
      tempLink.setAttribute('download', 'Boda_Eden_y_Julieta_2027.ics');
      document.body.appendChild(tempLink);
      tempLink.click();
      document.body.removeChild(tempLink);
      showToast('Descargando evento de calendario...');
    });
  }
}

/* ==========================================================================
   8. COPIAR DIRECCIÓN AL PORTAPAPELES
   ========================================================================== */
function initCopyAddress() {
  const copyBtns = document.querySelectorAll('.btn-copy-address');
  copyBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const address = btn.getAttribute('data-address');
      if (address && navigator.clipboard) {
        navigator.clipboard.writeText(address).then(() => {
          showToast('¡Dirección copiada al portapapeles!');
        }).catch(() => {
          fallbackCopyText(address);
        });
      } else if (address) {
        fallbackCopyText(address);
      }
    });
  });

  function fallbackCopyText(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    try {
      document.execCommand('copy');
      showToast('¡Dirección copiada!');
    } catch (err) {
      showToast('Dirección: ' + text);
    }
    document.body.removeChild(textArea);
  }
}

/* ==========================================================================
   9. MENSAJE FLOTANTE TOAST
   ========================================================================== */
function showToast(message) {
  let toast = document.getElementById('toast-notice');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast-notice';
    toast.className = 'toast-notice';
    document.body.appendChild(toast);
  }
  toast.innerHTML = `<span>✨</span> <span>${message}</span>`;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 3500);
}
