// Shared behaviour for the separate pages of Pearl's birthday site.
const smoke = document.querySelector(".smoke-screen");
function createPetals(amount = 8) {
  for (let i = 0; i < amount; i++) {
    const petal = document.createElement("span");
    petal.className = "petal";
    petal.textContent = Math.random() > .5 ? "✦" : "❧";
    petal.style.left = Math.random() * 100 + "vw";
    petal.style.fontSize = (9 + Math.random() * 12) + "px";
    petal.style.animationDuration = (6 + Math.random() * 5) + "s";
    petal.style.setProperty("--drift", (Math.random() * 140 - 70) + "px");
    document.body.appendChild(petal);
    window.setTimeout(() => petal.remove(), 12000);
  }
}

// A page arrives behind the smoke, then the smoke clears.
if (new URLSearchParams(location.search).has("transition") && smoke) {
  smoke.classList.add("arrive");
  history.replaceState({}, "", location.pathname);
}

// Links load a genuinely different HTML document, with smoke covering the handoff.
document.addEventListener("click", event => {
  const link = event.target.closest("a[data-page-link]");
  if (!link || !smoke || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
  const target = new URL(link.href, location.href);
  if (target.origin !== location.origin || !target.pathname.endsWith(".html")) return;
  event.preventDefault();
  smoke.classList.remove("arrive", "play");
  void smoke.offsetWidth;
  smoke.classList.add("play");
  window.setTimeout(() => {
    target.searchParams.set("transition", "1");
    location.href = target.href;
  }, 850);
});

// Letter page: envelope opens the parchment.
const envelope = document.querySelector(".envelope");
const letter = document.querySelector(".letter-paper");
if (envelope && letter) {
  envelope.addEventListener("click", () => {
    const opened = envelope.classList.toggle("is-open");
    envelope.setAttribute("aria-expanded", String(opened));
    if (opened) {
      window.setTimeout(() => {
        letter.classList.add("is-visible");
        letter.setAttribute("aria-hidden", "false");
      }, 450);
    } else {
      letter.classList.remove("is-visible");
      letter.setAttribute("aria-hidden", "true");
    }
  });
}
createPetals(7);
window.setInterval(() => createPetals(2), 5000);


// Invitation -> letter: reveal the next screen without navigating to another HTML page.
const invitationScreen = document.querySelector(".invitation");
const letterScreen = document.querySelector("#letter-screen");
const nextToLetter = document.querySelector("#next-to-letter");
const letterNav = document.querySelector("#letter-nav");
function revealLetterScreen() {
  if (!invitationScreen || !letterScreen || letterScreen.classList.contains("screen-active")) return;
  if (smoke) {
    smoke.classList.remove("arrive", "play");
    void smoke.offsetWidth;
    smoke.classList.add("play");
  }
  window.setTimeout(() => {
    invitationScreen.classList.add("screen-away");
    letterScreen.classList.add("screen-active");
    letterScreen.setAttribute("aria-hidden", "false");
    window.scrollTo({top:0,behavior:"instant"});
  }, 420);
}
if (nextToLetter) nextToLetter.addEventListener("click", revealLetterScreen);
if (letterNav) letterNav.addEventListener("click", event => {
  event.preventDefault();
  revealLetterScreen();
});
