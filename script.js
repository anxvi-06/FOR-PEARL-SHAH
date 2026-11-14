const smoke = document.querySelector(".smoke-screen");
const envelope = document.querySelector(".envelope");
const letter = document.querySelector(".letter-paper");
const modal = document.querySelector(".memory-modal");
const sections = [...document.querySelectorAll("main .section")];
let navigationBusy = false;

function createPetals(amount = 10) {
  for (let i = 0; i < amount; i++) {
    const petal = document.createElement("span");
    petal.className = "petal";
    petal.textContent = Math.random() > .5 ? "✦" : "❧";
    petal.style.left = Math.random() * 100 + "vw";
    petal.style.fontSize = (9 + Math.random() * 12) + "px";
    petal.style.animationDuration = (5 + Math.random() * 6) + "s";
    petal.style.animationDelay = (Math.random() * 1.2) + "s";
    petal.style.setProperty("--drift", (Math.random() * 180 - 90) + "px");
    document.body.appendChild(petal);
    window.setTimeout(() => petal.remove(), 13000);
  }
}

function showPage(id, updateHistory = true) {
  const next = document.getElementById(id);
  if (!next || !next.classList.contains("section")) return;
  if (next.classList.contains("is-active") || navigationBusy) return;
  navigationBusy = true;
  document.body.classList.add("page-transitioning");
  smoke.classList.remove("play");
  void smoke.offsetWidth;
  smoke.classList.add("play");

  window.setTimeout(() => {
    sections.forEach(section => {
      section.classList.remove("is-active", "is-leaving");
      section.setAttribute("aria-hidden", "true");
    });
    next.classList.add("is-active");
    next.setAttribute("aria-hidden", "false");
    window.scrollTo({ top: 0, behavior: "instant" });
    if (updateHistory) history.pushState({ page: id }, "", "#" + id);
  }, 480);

  window.setTimeout(() => {
    smoke.classList.remove("play");
    document.body.classList.remove("page-transitioning");
    navigationBusy = false;
  }, 1250);
}

document.addEventListener("click", event => {
  const link = event.target.closest('a[href^="#"]');
  if (!link) return;
  const id = link.getAttribute("href").slice(1);
  if (!sections.some(section => section.id === id)) return;
  event.preventDefault();
  showPage(id);
});

window.addEventListener("popstate", () => {
  const id = location.hash.slice(1) || "home";
  const target = document.getElementById(id);
  if (!target || !target.classList.contains("section")) return;
  navigationBusy = false;
  sections.forEach(section => {
    section.classList.toggle("is-active", section === target);
    section.setAttribute("aria-hidden", String(section !== target));
  });
  smoke.classList.remove("play");
  document.body.classList.remove("page-transitioning");
  window.scrollTo({ top: 0, behavior: "instant" });
});

const initialId = location.hash.slice(1);
const initialPage = sections.find(section => section.id === initialId) || sections[0];
sections.forEach(section => {
  section.classList.toggle("is-active", section === initialPage);
  section.setAttribute("aria-hidden", String(section !== initialPage));
});

envelope.addEventListener("click", () => {
  const opened = envelope.classList.toggle("is-open");
  envelope.setAttribute("aria-expanded", String(opened));
  if (opened) {
    window.setTimeout(() => {
      letter.classList.add("is-visible");
      letter.setAttribute("aria-hidden", "false");
      if (window.innerWidth < 800) letter.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 450);
  } else {
    letter.classList.remove("is-visible");
    letter.setAttribute("aria-hidden", "true");
  }
});

document.querySelectorAll(".archive-card").forEach(card => {
  card.addEventListener("click", () => {
    modal.querySelector("h2").textContent = card.dataset.title;
    modal.querySelector(".modal-copy").textContent = card.dataset.copy;
    modal.hidden = false;
    document.body.style.overflow = "hidden";
  });
});
function closeModal() {
  modal.hidden = true;
  document.body.style.overflow = "";
}
modal.querySelector(".modal-close").addEventListener("click", closeModal);
modal.addEventListener("click", event => {
  if (event.target === modal) closeModal();
});
document.addEventListener("keydown", event => {
  if (event.key === "Escape") closeModal();
});

createPetals(9);
window.setInterval(() => createPetals(2), 4200);
