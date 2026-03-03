// Footer year
const year = document.getElementById("year");
if (year) year.textContent = new Date().getFullYear();

// Mobile nav
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

// Legal dialog placeholders
const legalDialog = document.getElementById("legalDialog");
const legalTitle = document.getElementById("legalTitle");
const legalText = document.getElementById("legalText");
const closeDialog = document.getElementById("closeDialog");
const impressumLink = document.getElementById("impressumLink");
const datenschutzLink = document.getElementById("datenschutzLink");

function openLegal(title, text) {
  if (!legalDialog) return;
  legalTitle.textContent = title;
  legalText.textContent = text;
  legalDialog.showModal();
}

if (impressumLink) {
  impressumLink.addEventListener("click", (e) => {
    e.preventDefault();
    openLegal(
      "Impressum (Platzhalter)",
      "Bitte ergänze hier dein Impressum (Betreiber, Adresse, Kontakt, ggf. USt-ID). Wenn du mir Betreibername/Adresse gibst, formuliere ich dir eine passende Vorlage."
    );
  });
}
if (datenschutzLink) {
  datenschutzLink.addEventListener("click", (e) => {
    e.preventDefault();
    openLegal(
      "Datenschutz (Platzhalter)",
      "Bitte ergänze hier deine Datenschutzerklärung. Eingebettet ist eine OpenStreetMap-Karte. Wenn du Tools wie Analytics/YouTube nutzt, kann ich dir den Text passend erstellen."
    );
  });
}
if (closeDialog && legalDialog) {
  closeDialog.addEventListener("click", () => legalDialog.close());
}

// Inquiry form -> mailto
const form = document.getElementById("inquiryForm");
if (form) {
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const receiver = "info@westzipfelcamp.de";

    const data = new FormData(form);
    const name = data.get("name") || "";
    const email = data.get("email") || "";
    const from = data.get("from") || "";
    const to = data.get("to") || "";
    const type = data.get("type") || "";
    const message = data.get("message") || "";

    const subject = `Anfrage Westzipfelcamp (${from}–${to})`;
    const body =
`Hallo Westzipfelcamp-Team,

ich möchte gerne anfragen:

Name: ${name}
E-Mail: ${email}
Anreise: ${from}
Abreise: ${to}
Camping-Paket: ${type}

Nachricht:
${message}

Viele Grüße
${name}`;

    const mailto = `mailto:${encodeURIComponent(receiver)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailto;
  });
}

/* ===== Galerie: Auto + Swipe (1 Bild) ===== */
const gallery = document.querySelector("[data-gallery]");
const dotsWrap = document.querySelector("[data-gallery-dots]");
const prevBtn = document.querySelector("[data-gallery-prev]");
const nextBtn = document.querySelector("[data-gallery-next]");

if (gallery) {
  const slides = Array.from(gallery.querySelectorAll(".slide"));
  let autoTimer = null;
  let isPaused = false;
  const INTERVAL_MS = 4500;

  // Dots erstellen
  if (dotsWrap) {
    dotsWrap.innerHTML = "";
    slides.forEach((_, i) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "dot";
      b.setAttribute("aria-label", `Bild ${i + 1}`);
      b.addEventListener("click", () => {
        pauseAuto(true);
        scrollToSlide(i);
      });
      dotsWrap.appendChild(b);
    });
  }

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
    const clamped = Math.max(0, Math.min(slides.length - 1, i));
    gallery.scrollTo({ left: clamped * gallery.clientWidth, behavior: "smooth" });
    setActiveDot(clamped);
  }

  function next() {
    const idx = getCurrentIndex();
    const nxt = (idx + 1) % slides.length;
    scrollToSlide(nxt);
  }

  function prev() {
    const idx = getCurrentIndex();
    const prv = (idx - 1 + slides.length) % slides.length;
    scrollToSlide(prv);
  }

  prevBtn?.addEventListener("click", () => { pauseAuto(true); prev(); });
  nextBtn?.addEventListener("click", () => { pauseAuto(true); next(); });

  // Bei Scroll (Swipe/Trackpad) aktiven Dot nachziehen
  let t;
  gallery.addEventListener("scroll", () => {
    window.clearTimeout(t);
    t = window.setTimeout(() => setActiveDot(getCurrentIndex()), 80);
  });

  // Auto-Play
  function startAuto() {
    stopAuto();
    autoTimer = window.setInterval(() => {
      if (!isPaused) next();
    }, INTERVAL_MS);
  }
  function stopAuto() {
    if (autoTimer) window.clearInterval(autoTimer);
    autoTimer = null;
  }
  function pauseAuto(temp) {
    isPaused = true;
    if (temp) window.setTimeout(() => { isPaused = false; }, 8000);
  }

  // Pause bei Interaktion
  gallery.addEventListener("mouseenter", () => isPaused = true);
  gallery.addEventListener("mouseleave", () => isPaused = false);
  gallery.addEventListener("touchstart", () => pauseAuto(true), { passive: true });

  // Bei Resize ausrichten
  window.addEventListener("resize", () => {
    scrollToSlide(getCurrentIndex());
  });

  // Initial
  setActiveDot(0);
  startAuto();
}
