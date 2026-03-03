// Footer year
const year = document.getElementById("year");
if (year) year.textContent = new Date().getFullYear();

/* =========================================
   Mobile Navigation
========================================= */
const toggle = document.querySelector(".nav-toggle");
const nav = document.querySelector(".nav");

if (toggle && nav) {
  toggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("nav--open");
    toggle.setAttribute("aria-expanded", String(isOpen));
  });

  nav.querySelectorAll("a").forEach(a => {
    a.addEventListener("click", () => {
      nav.classList.remove("nav--open");
      toggle.setAttribute("aria-expanded", "false");
    });
  });
}

/* =========================================
   Anfrageformular (mailto)
========================================= */
const form = document.getElementById("inquiryForm");
if (form) {
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const receiver = "info@westzipfelcamp.de";
    const data = new FormData(form);

    const subject = `Anfrage Westzipfelcamp (${data.get("from")}–${data.get("to")})`;

    const body =
`Hallo Westzipfelcamp-Team,

ich möchte gerne anfragen:

Name: ${data.get("name")}
E-Mail: ${data.get("email")}
Anreise: ${data.get("from")}
Abreise: ${data.get("to")}
Camping-Paket: ${data.get("type")}

Nachricht:
${data.get("message")}

Viele Grüße
${data.get("name")}`;

    const mailto = `mailto:${encodeURIComponent(receiver)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailto;
  });
}

/* =========================================
   Galerie (Auto + Swipe)
========================================= */
const gallery = document.querySelector("[data-gallery]");
const dotsWrap = document.querySelector("[data-gallery-dots]");
const prevBtn = document.querySelector("[data-gallery-prev]");
const nextBtn = document.querySelector("[data-gallery-next]");

let autoTimer = null;
let isPaused = false;
let isLightboxOpen = false;
const INTERVAL_MS = 4500;

function stopAuto() {
  if (autoTimer) clearInterval(autoTimer);
  autoTimer = null;
}

function startAuto(nextFn) {
  stopAuto();
  autoTimer = setInterval(() => {
    if (!isPaused && !isLightboxOpen) {
      nextFn();
    }
  }, INTERVAL_MS);
}

function pauseAuto() {
  isPaused = true;
  setTimeout(() => isPaused = false, 8000);
}

if (gallery) {
  const slides = Array.from(gallery.querySelectorAll(".slide"));

  function getCurrentIndex() {
    return Math.round(gallery.scrollLeft / gallery.clientWidth);
  }

  function setActiveDot(i) {
    if (!dotsWrap) return;
    dotsWrap.querySelectorAll(".dot").forEach((d, idx) => {
      d.classList.toggle("is-active", idx === i);
    });
  }

  function scrollToSlide(i) {
    const index = (i + slides.length) % slides.length;
    gallery.scrollTo({ left: index * gallery.clientWidth, behavior: "smooth" });
    setActiveDot(index);
  }

  function next() { scrollToSlide(getCurrentIndex() + 1); }
  function prev() { scrollToSlide(getCurrentIndex() - 1); }

  // Dots
  if (dotsWrap) {
    dotsWrap.innerHTML = "";
    slides.forEach((_, i) => {
      const dot = document.createElement("button");
      dot.className = "dot";
      dot.addEventListener("click", () => {
        pauseAuto();
        scrollToSlide(i);
      });
      dotsWrap.appendChild(dot);
    });
  }

  prevBtn?.addEventListener("click", () => { pauseAuto(); prev(); });
  nextBtn?.addEventListener("click", () => { pauseAuto(); next(); });

  gallery.addEventListener("scroll", () => {
    setActiveDot(getCurrentIndex());
  });

  gallery.addEventListener("touchstart", pauseAuto, { passive: true });

  setActiveDot(0);
  startAuto(next);
}

/* =========================================
   LIGHTBOX (Vollbild + Swipe)
========================================= */
const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightboxImg");
const lightboxCap = document.getElementById("lightboxCap");
const lbClose = document.querySelector("[data-lightbox-close]");
const lbPrev = document.querySelector("[data-lightbox-prev]");
const lbNext = document.querySelector("[data-lightbox-next]");

let lbIndex = 0;
let lbItems = [];

if (gallery) {
  const figures = Array.from(gallery.querySelectorAll(".slide"));

  lbItems = figures.map(fig => {
    const img = fig.querySelector("img");
    const cap = fig.querySelector("figcaption")?.textContent || "";
    return { src: img.src, alt: img.alt, cap };
  });

  figures.forEach((fig, i) => {
    const btn = fig.querySelector("[data-lightbox-open]");
    btn?.addEventListener("click", () => openLightbox(i));
  });
}

function setLightbox(index) {
  lbIndex = (index + lbItems.length) % lbItems.length;
  const item = lbItems[lbIndex];
  lightboxImg.src = item.src;
  lightboxImg.alt = item.alt;
  lightboxCap.textContent = item.cap;
}

function openLightbox(index) {
  isLightboxOpen = true;
  stopAuto();   // 🔴 Auto-Slider komplett stoppen
  setLightbox(index);
  lightbox.showModal();
}

function closeLightbox() {
  lightbox.close();
  isLightboxOpen = false;
  startAuto(() => {
    const g = document.querySelector("[data-gallery]");
    if (g) g.scrollBy({ left: g.clientWidth, behavior: "smooth" });
  }); // ▶️ Auto wieder starten
}

lbClose?.addEventListener("click", closeLightbox);
lbPrev?.addEventListener("click", () => setLightbox(lbIndex - 1));
lbNext?.addEventListener("click", () => setLightbox(lbIndex + 1));

/* Klick außerhalb schließt */
lightbox?.addEventListener("click", (e) => {
  if (e.target === lightbox) closeLightbox();
});

/* Tastatursteuerung */
window.addEventListener("keydown", (e) => {
  if (!lightbox.open) return;
  if (e.key === "Escape") closeLightbox();
  if (e.key === "ArrowLeft") setLightbox(lbIndex - 1);
  if (e.key === "ArrowRight") setLightbox(lbIndex + 1);
});

/* =========================================
   Swipe im Vollbild (Touch)
========================================= */
let startX = 0;
let endX = 0;

lightboxImg?.addEventListener("touchstart", (e) => {
  startX = e.changedTouches[0].clientX;
}, { passive: true });

lightboxImg?.addEventListener("touchend", (e) => {
  endX = e.changedTouches[0].clientX;
  const diff = startX - endX;

  if (Math.abs(diff) > 50) { // Mindest-Wischdistanz
    if (diff > 0) {
      setLightbox(lbIndex + 1); // nach links wischen = nächstes Bild
    } else {
      setLightbox(lbIndex - 1); // nach rechts wischen = vorheriges Bild
    }
  }
}, { passive: true });
