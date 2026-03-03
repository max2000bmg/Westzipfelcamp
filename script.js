document.getElementById("year").textContent=new Date().getFullYear();

const gallery=document.querySelector("[data-gallery]");
let gIndex=0;

setInterval(()=>{
gIndex=(gIndex+1)%gallery.children.length;
gallery.scrollTo({left:gIndex*gallery.clientWidth,behavior:"smooth"});
},4000);

const reviews=document.querySelector("[data-reviews]");
let rIndex=0;

setInterval(()=>{
rIndex=(rIndex+1)%reviews.children.length;
reviews.scrollTo({left:rIndex*reviews.clientWidth,behavior:"smooth"});
},5000);

const form=document.getElementById("form");

document.getElementById("emailBtn").onclick=()=>{
const data=new FormData(form);
const text=`Anfrage Westzipfelcamp

Name: ${data.get("name")}
E-Mail: ${data.get("email")}
Anreise: ${data.get("from")}
Abreise: ${data.get("to")}
Paket: ${data.get("type")}

Nachricht:
${data.get("message")}`;

window.location.href=`mailto:info@westzipfelcamp.de?subject=Anfrage&body=${encodeURIComponent(text)}`;
};

document.getElementById("waBtn").onclick=()=>{
const data=new FormData(form);
const text=`Hallo Westzipfelcamp,

Name: ${data.get("name")}
Anreise: ${data.get("from")}
Abreise: ${data.get("to")}
Paket: ${data.get("type")}
${data.get("message")}`;

window.open(`https://wa.me/491786065840?text=${encodeURIComponent(text)}`,"_blank");
};
