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

/* ===== Swipe Galerie ===== */
const gallery = document.querySelector("[data-gallery]");
const dotsWrap = document.querySelector("[data-gallery-dots]");
const prevBtn = document.querySelector("[data-gallery-prev]");
const nextBtn = document.querySelector("[data-gallery-next]");

if (gallery) {
  const slides = Array.from(gallery.querySelectorAll(".slide"));

  // Dots erstellen
  if (dotsWrap) {
    dotsWrap.innerHTML = "";
    slides.forEach((_, i) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "dot";
      b.setAttribute("aria-label", `Bild ${i + 1}`);
      b.addEventListener("click", () => scrollToSlide(i));
      dotsWrap.appendChild(b);
    });
  }

  function getCurrentIndex() {
    const gRect = gallery.getBoundingClientRect();
    const center = gRect.left + gRect.width / 2;

    let bestIdx = 0;
    let bestDist = Infinity;

    slides.forEach((s, i) => {
      const r = s.getBoundingClientRect();
      const sCenter = r.left + r.width / 2;
      const dist = Math.abs(sCenter - center);
      if (dist < bestDist) { bestDist = dist; bestIdx = i; }
    });

    return bestIdx;
  }

  function setActiveDot(i) {
    if (!dotsWrap) return;
    dotsWrap.querySelectorAll(".dot").forEach((d, idx) => {
      d.classList.toggle("is-active", idx === i);
    });
  }

  function scrollToSlide(i) {
    const target = slides[i];
    if (!target) return;
    target.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
    setActiveDot(i);
  }

  function scrollByOne(dir) {
    const idx = getCurrentIndex();
    const next = Math.max(0, Math.min(slides.length - 1, idx + dir));
    scrollToSlide(next);
  }

  prevBtn?.addEventListener("click", () => scrollByOne(-1));
  nextBtn?.addEventListener("click", () => scrollByOne(1));

  // Dot-Highlight beim Scrollen
  let t;
  gallery.addEventListener("scroll", () => {
    window.clearTimeout(t);
    t = window.setTimeout(() => setActiveDot(getCurrentIndex()), 80);
  });

  // Initial
  setActiveDot(0);
}
