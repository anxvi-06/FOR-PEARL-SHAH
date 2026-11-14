const smoke = document.querySelector(".smoke-screen");
const envelope = document.querySelector(".envelope");
const letter = document.querySelector(".letter-paper");
const modal = document.querySelector(".memory-modal");
let smokeBusy = false;

function createPetals(amount = 13) {
  for (let i = 0; i < amount; i++) {
    const petal = document.createElement("span");
    petal.className = "petal";
    petal.textContent = Math.random() > .5 ? "✦" : "❧";
    petal.style.left = Math.random() * 100 + "vw";
    petal.style.fontSize = (9 + Math.random() * 12) + "px";
    petal.style.animationDuration = (5 + Math.random() * 6) + "s";
    petal.style.animationDelay = (Math.random() * 1.8) + "s";
    petal.style.setProperty("--drift", (Math.random() * 180 - 90) + "px");
    document.body.appendChild(petal);
    window.setTimeout(() => petal.remove(), 13000);
  }
}

function smokeNavigate(event) {
  const link = event.target.closest('a[href^="#"]');
  if (!link) return;
  const target = document.querySelector(link.getAttribute("href"));
  if (!target) return;
  event.preventDefault();
  if (smokeBusy) return;
  smokeBusy = true;
  smoke.classList.remove("play");
  void smoke.offsetWidth;
  smoke.classList.add("play");
  window.setTimeout(() => {
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  }, 420);
  window.setTimeout(() => {
    smoke.classList.remove("play");
    smokeBusy = false;
  }, 1200);
}
document.addEventListener("click", smokeNavigate);

envelope.addEventListener("click", () => {
  const opened = envelope.classList.toggle("is-open");
  envelope.setAttribute("aria-expanded", String(opened));
  if (opened) {
    window.setTimeout(() => {
      letter.classList.add("is-visible");
      letter.setAttribute("aria-hidden", "false");
      if (window.innerWidth < 800) {
        letter.scrollIntoView({ behavior: "smooth", block: "center" });
      }
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
