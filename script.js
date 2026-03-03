// Mobile Nav
const toggle = document.querySelector(".nav-toggle");
const nav = document.querySelector(".nav");

if (toggle && nav) {
  toggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("nav--open");
    toggle.setAttribute("aria-expanded", String(isOpen));
  });

  // Close nav when clicking a link
  nav.querySelectorAll("a").forEach(a => {
    a.addEventListener("click", () => {
      nav.classList.remove("nav--open");
      toggle.setAttribute("aria-expanded", "false");
    });
  });
}

// Year in footer
const year = document.getElementById("year");
if (year) year.textContent = new Date().getFullYear();

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
      "Bitte ergänze hier dein Impressum (Betreiber, Adresse, Kontakt, ggf. USt-ID). Wenn du mir die Daten gibst, formuliere ich dir eine passende Vorlage."
    );
  });
}
if (datenschutzLink) {
  datenschutzLink.addEventListener("click", (e) => {
    e.preventDefault();
    openLegal(
      "Datenschutz (Platzhalter)",
      "Bitte ergänze hier deine Datenschutzerklärung. Diese Seite nutzt aktuell keine Tracking-Tools; eingebettet ist nur eine OpenStreetMap-Karte. Wenn du mir sagst, ob du Analytics/Fonts/YouTube nutzen willst, erstelle ich dir den passenden Text."
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

    // TODO: Hier deine echte E-Mail eintragen:
    const receiver = "DEINE_EMAIL@BEISPIEL.DE";

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
Camping-Art: ${type}

Nachricht:
${message}

Viele Grüße
${name}`;

    const mailto = `mailto:${encodeURIComponent(receiver)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailto;
  });
}
