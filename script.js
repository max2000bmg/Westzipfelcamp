// Footer year
const year = document.getElementById("year");
if (year) year.textContent = new Date().getFullYear();

/* =======================
   Mobile Navigation
======================= */
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

/* =======================
   Formular: Validierung + Text erzeugen
======================= */
const form = document.getElementById("inquiryForm");
const emailBtn = document.getElementById("emailBtn");
const whatsappBtn = document.getElementById("whatsappBtn");
const formError = document.getElementById("formError");

function validateForm() {
  if (!form) return false;
  formError.textContent = "";

  const required = ["name", "email", "from", "to"];
  for (const key of required) {
    const el = form.querySelector(`[name="${key}"]`);
    if (!el || !el.value) {
      formError.textContent = "Bitte fülle alle Pflichtfelder aus (Name, E-Mail, Anreise, Abreise).";
      el?.focus();
      return false;
    }
  }

  // simple date check
  const from = form.querySelector('[name="from"]').value;
  const to = form.querySelector('[name="to"]').value;
  if (from && to && to < from) {
    formError.textContent = "Bitte prüfe die Daten: Abreise darf nicht vor Anreise liegen.";
    form.querySelector('[name="to"]').focus();
    return false;
  }

  return true;
}

function buildMessage() {
  const data = new FormData(form);

  const name = (data.get("name") || "").toString().trim();
  const email = (data.get("email") || "").toString().trim();
  const from = (data.get("from") || "").toString().trim();
  const to = (data.get("to") || "").toString().trim();
  const type = (data.get("type") || "").toString().trim();
  const msg = (data.get("message") || "").toString().trim();

  const text =
`Hallo Westzipfelcamp,

ich möchte gerne anfragen:

Name: ${name}
E-Mail: ${email}
Anreise: ${from}
Abreise: ${to}
Camping-Paket: ${type}

Nachricht:
${msg || "-"}

Viele Grüße
${name}`;

  return { name, email, from, to, type, msg, text };
}

/* =======================
   Versand: E-Mail
======================= */
if (emailBtn && form) {
  emailBtn.addEventListener("click", () => {
    if (!validateForm()) return;

    const { from, to, text } = buildMessage();
    const receiver = "info@westzipfelcamp.de";
    const subject = `Anfrage Westzipfelcamp (${from}–${to})`;

    const mailto = `mailto:${encodeURIComponent(receiver)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(text)}`;
    window.location.href = mailto;
  });
}

/* =======================
   Versand: WhatsApp
======================= */
if (whatsappBtn && form) {
  whatsappBtn.addEventListener("click", () => {
    if (!validateForm()) return;

    const { text } = buildMessage();
    const phoneNumber = "491786065840"; // WhatsApp: ohne +, ohne Leerzeichen
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(text)}`;

    window.open(url, "_blank");
  });
}

/* =======================
   Galerie (Auto + Swipe)
======================= */
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
    if (!isPaused && !isLightboxOpen) nextFn();
  }, INTERVAL_MS);
}

function pauseAutoTemp() {
  isPaused = true;
  setTimeout(() => (isPaused = false), 8000);
}

if (gallery) {
  const slides = Array.from(gallery.querySelectorAll(".slide"));

  function getCurrentIndex() {
    const w = gallery.clientWidth || 1;
    return Math.round(gallery.scrollLeft / w);
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

  if (dotsWrap) {
    dotsWrap.innerHTML = "";
    slides.forEach((_, i) => {
      const dot = document.createElement("button");
      dot.className = "dot";
      dot.setAttribute("aria-label", `Bild ${i + 1}`);
      dot.addEventListener("click", () => {
        pauseAutoTemp();
        scrollToSlide(i);
      });
      dotsWrap.appendChild(dot);
    });
  }

  prevBtn?.addEventListener("click", () => { pauseAutoTemp(); prev(); });
  nextBtn?.addEventListener("click", () => { pauseAutoTemp(); next(); });

  let t;
  gallery.addEventListener("scroll", () => {
    clearTimeout(t);
    t = setTimeout(() => setActiveDot(getCurrentIndex()), 80);
  });

  gallery.addEventListener("touchstart", pauseAutoTemp, { passive: true });

  setActiveDot(0);
  startAuto(next);
}

/* =======================
   Lightbox (Vollbild + Swipe) + Auto stoppen
======================= */
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
    const cap = fig.querySelector("figcaption")?.textContent?.trim() || "";
    return { src: img?.getAttribute("src") || "", alt: img?.getAttribute("alt") || "", cap };
  });

  figures.forEach((fig, i) => {
    fig.querySelector("[data-lightbox-open]")?.addEventListener("click", () => openLightbox(i));
  });
}

function setLightbox(index) {
  if (!lbItems.length) return;
  lbIndex = (index + lbItems.length) % lbItems.length;

  const item = lbItems[lbIndex];
  lightboxImg.src = item.src;
  lightboxImg.alt = item.alt;
  lightboxCap.textContent = item.cap;
}

function openLightbox(index) {
  if (!lightbox) return;
  isLightboxOpen = true;

  // Auto-Slider komplett stoppen, damit sich im Hintergrund nichts ändert
  stopAuto();

  setLightbox(index);
  lightbox.showModal();
}

function closeLightbox() {
  if (!lightbox) return;
  lightbox.close();

  isLightboxOpen = false;

  // Auto-Slider wieder starten (nur wenn Galerie existiert)
  if (gallery) {
    startAuto(() => {
      const w = gallery.clientWidth || 1;
      gallery.scrollBy({ left: w, behavior: "smooth" });
    });
  }
}

lbClose?.addEventListener("click", closeLightbox);
lbPrev?.addEventListener("click", () => setLightbox(lbIndex - 1));
lbNext?.addEventListener("click", () => setLightbox(lbIndex + 1));

lightbox?.addEventListener("click", (e) => {
  // Klick auf den dunklen Hintergrund schließt
  if (e.target === lightbox) closeLightbox();
});

window.addEventListener("keydown", (e) => {
  if (!lightbox || !lightbox.open) return;
  if (e.key === "Escape") closeLightbox();
  if (e.key === "ArrowLeft") setLightbox(lbIndex - 1);
  if (e.key === "ArrowRight") setLightbox(lbIndex + 1);
});

/* Swipe im Vollbild */
let startX = 0;

lightboxImg?.addEventListener("touchstart", (e) => {
  startX = e.changedTouches[0].clientX;
}, { passive: true });

lightboxImg?.addEventListener("touchend", (e) => {
  const endX = e.changedTouches[0].clientX;
  const diff = startX - endX;

  if (Math.abs(diff) > 50) {
    if (diff > 0) setLightbox(lbIndex + 1);
    else setLightbox(lbIndex - 1);
  }
}, { passive: true });
/* =======================
   Rezensionen Slider (Auto + Swipe)
======================= */
const reviews = document.querySelector("[data-reviews]");
const reviewsDotsWrap = document.querySelector("[data-reviews-dots]");
const reviewsPrevBtn = document.querySelector("[data-reviews-prev]");
const reviewsNextBtn = document.querySelector("[data-reviews-next]");

let reviewsTimer = null;
let reviewsPaused = false;

// nutzt dieselbe Variable aus deinem Lightbox-Code:
// let isLightboxOpen = false;

function stopReviewsAuto(){
  if (reviewsTimer) clearInterval(reviewsTimer);
  reviewsTimer = null;
}

function startReviewsAuto(nextFn){
  stopReviewsAuto();
  reviewsTimer = setInterval(() => {
    if (!reviewsPaused && !isLightboxOpen) nextFn();
  }, 5200);
}

function pauseReviewsTemp(){
  reviewsPaused = true;
  setTimeout(() => reviewsPaused = false, 8000);
}

if (reviews) {
  const slides = Array.from(reviews.querySelectorAll(".review-slide"));

  function getIndex(){
    const w = reviews.clientWidth || 1;
    return Math.round(reviews.scrollLeft / w);
  }

  function setDot(i){
    if (!reviewsDotsWrap) return;
    reviewsDotsWrap.querySelectorAll(".dot").forEach((d, idx) => {
      d.classList.toggle("is-active", idx === i);
    });
  }

  function scrollTo(i){
    const idx = (i + slides.length) % slides.length;
    reviews.scrollTo({ left: idx * reviews.clientWidth, behavior: "smooth" });
    setDot(idx);
  }

  function next(){ scrollTo(getIndex() + 1); }
  function prev(){ scrollTo(getIndex() - 1); }

  if (reviewsDotsWrap) {
    reviewsDotsWrap.innerHTML = "";
    slides.forEach((_, i) => {
      const dot = document.createElement("button");
      dot.className = "dot";
      dot.setAttribute("aria-label", `Rezension ${i + 1}`);
      dot.addEventListener("click", () => { pauseReviewsTemp(); scrollTo(i); });
      reviewsDotsWrap.appendChild(dot);
    });
  }

  reviewsPrevBtn?.addEventListener("click", () => { pauseReviewsTemp(); prev(); });
  reviewsNextBtn?.addEventListener("click", () => { pauseReviewsTemp(); next(); });

  let t;
  reviews.addEventListener("scroll", () => {
    clearTimeout(t);
    t = setTimeout(() => setDot(getIndex()), 80);
  });

  reviews.addEventListener("mouseenter", () => reviewsPaused = true);
  reviews.addEventListener("mouseleave", () => reviewsPaused = false);
  reviews.addEventListener("touchstart", () => pauseReviewsTemp(), { passive: true });

  setDot(0);
  startReviewsAuto(next);
}
