document.getElementById("year").textContent = new Date().getFullYear();

document.getElementById("inquiryForm").addEventListener("submit", function(e){
  e.preventDefault();

  const data = new FormData(this);

  const subject = "Anfrage Westzipfelcamp";
  const body = `
Name: ${data.get("name")}
E-Mail: ${data.get("email")}
Anreise: ${data.get("from")}
Abreise: ${data.get("to")}
Paket: ${data.get("type")}

Nachricht:
${data.get("message")}
`;

  window.location.href = `mailto:info@westzipfelcamp.de?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
});
