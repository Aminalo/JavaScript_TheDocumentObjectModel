// Cache important elements
const form = document.getElementById("dash-form");
const playerInput = document.getElementById("player");
const roundsInput = document.getElementById("rounds");
const arenaSelect = document.getElementById("arena");

const startBtn = document.getElementById("start-btn");
const stopBtn = document.getElementById("stop-btn");
const resetBtn = document.getElementById("reset-btn");

const roundLabel = document.getElementById("round-label");
const bestLabel = document.getElementById("best-label");
const avgLabel = document.getElementById("avg-label");
const messageEl = document.getElementById("message");

const playArea = document.getElementById("play-area");
const logList = document.getElementById("log");
const logTpl = document.getElementById("log-template");

const panelCard = document.getElementById("panel");
const cards = document.querySelectorAll(".card");

// Basic game state
let totalRounds = 5;
let currentRound = 0;
let best = null;
let times = [];
let waiting = false;
let playing = false;

let appearTimeout = null;
let startTime = 0;

// Helpers
const rnd = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const ms = (n) => `${n} ms`;

// Update the little status chips
function updateLabels() {
  roundLabel.textContent = `🎮 Round: ${currentRound} / ${totalRounds}`;
  bestLabel.textContent = best == null ? `🏆 Best: —` : `🏆 Best: ${ms(best)}`;
  avgLabel.textContent = times.length
    ? `📊 Avg: ${ms(Math.round(times.reduce((a, b) => a + b, 0) / times.length))}`
    : `📊 Avg: —`;
}
updateLabels();

// Set message text + tone class
function setMessage(text, tone = "") {
  messageEl.textContent = text;
  messageEl.className = "muted";
  if (tone) messageEl.classList.add(tone);
}

// Adjust arena height from select (attribute/style change)
function setArenaSize(size) {
  if (size === "small")      playArea.style.height = "280px";
  else if (size === "medium") playArea.style.height = "360px";
  else                        playArea.style.height = "460px";
}

// Remove any existing target
function clearTarget() {
  const t = playArea.querySelector(".target");
  if (t) t.remove();
}

// Create and append a target element at a random position
function placeTarget() {
  clearTarget();
  const target = document.createElement("button");
  target.type = "button";
  target.className = "target";
  target.setAttribute("aria-label", "Reaction target");
  target.textContent = "●";

  const rect = playArea.getBoundingClientRect();
  const x = rnd(0, Math.max(0, rect.width - 56));
  const y = rnd(0, Math.max(0, rect.height - 56));
  target.style.left = `${x}px`;
  target.style.top = `${y}px`;

  target.addEventListener("click", onHit);
  playArea.appendChild(target);
}


function scheduleAppearance() {
  waiting = true;
  const delay = rnd(600, 1800); // random wait before target appears
  appearTimeout = setTimeout(() => {
    placeTarget();
    startTime = performance.now();
    waiting = false;
    setMessage("Click it! 🔥", "good");
  }, delay);
}

function nextRound() {
  currentRound += 1;
  updateLabels();
  if (currentRound > totalRounds) return endGame();
  setMessage("Wait for it…");
  scheduleAppearance();
}


// Log helper using <template> + DocumentFragment + cloneNode
function logResult(tag, text, tone = "") {
  const frag = document.createDocumentFragment();
  const node = logTpl.content.cloneNode(true);
  const li = node.querySelector(".log-item");
  li.querySelector(".tag").textContent = tag;
  const txt = li.querySelector(".txt");
  txt.textContent = text;
  if (tone) txt.classList.add(tone);
  frag.appendChild(li);
  logList.prepend(frag);
}

// Start game via form submit (HTML + JS validation)
form.addEventListener("submit", (e) => {
  e.preventDefault();
  if (!form.checkValidity()) {
    playerInput.setCustomValidity("Enter 3–20 chars, starting with a letter.");
    playerInput.reportValidity();
    return;
  }
  playerInput.setCustomValidity("");

  const name = playerInput.value.trim();
  const rounds = Number(roundsInput.value);
  if (Number.isNaN(rounds) || rounds < 3 || rounds > 10) {
    roundsInput.setCustomValidity("Rounds must be 3–10.");
    roundsInput.reportValidity();
    return;
  }
  roundsInput.setCustomValidity("");

  totalRounds = rounds;
  currentRound = 0;
  best = null;
  times = [];
  updateLabels();
  setArenaSize(arenaSelect.value);

  playing = true;
  startBtn.disabled = true;
  stopBtn.disabled = false;

  // sibling nav demo: pulse the next card
  const nextCard = panelCard.nextElementSibling;
  if (nextCard) {
    nextCard.classList.add("pulse-once");
    setTimeout(() => nextCard.classList.remove("pulse-once"), 300);
  }

  setMessage(`Good luck, ${name}!`);
  logResult("START", `${name} started: ${totalRounds} rounds`);
  nextRound();
});

// Stop (pause) game
stopBtn.addEventListener("click", () => {
  if (!playing) return;
  playing = false;
  startBtn.disabled = false;
  stopBtn.disabled = true;
  clearTimeout(appearTimeout);
  clearTarget();
  setMessage("Game paused.");
  logResult("PAUSE", "Game paused.", "bad");
});

// Reset to initial state (BOM confirm)
resetBtn.addEventListener("click", () => {
  const ok = window.confirm("Reset everything?");
  if (!ok) return;

  playing = false;
  clearTimeout(appearTimeout);
  clearTarget();
  startBtn.disabled = false;
  stopBtn.disabled = true;

  logList.innerHTML = "";
  currentRound = 0;
  totalRounds = Number(roundsInput.value) || 5;
  best = null;
  times = [];
  updateLabels();

  setMessage("Enter your name, choose rounds, and press Start.");
  logResult("RESET", "Board reset.");
});

// Clicks inside arena that are NOT on the target
playArea.addEventListener("click", (e) => {
  if (!playing) return;
  if (e.target.classList.contains("target")) return; // handled in onHit

  if (waiting) {
    logResult("EARLY", "Clicked before target appeared.", "bad");
    setMessage("Too soon! Wait for the target.", "bad");
  } else {
    logResult("MISS", "Clicked outside the target.", "bad");
    setMessage("Missed! Aim for the circle.", "bad");
  }
});


// Successful hit on target
function onHit() {
  if (!playing) return;
  const rt = Math.round(performance.now() - startTime);
  times.push(rt);
  if (best == null || rt < best) best = rt;

  logResult(`R${currentRound}`, `Reaction: ${rt} ms`, "good");
  setMessage(`Nice! ${rt} ms`, "good");
  clearTarget();

  if (currentRound >= totalRounds) {
    endGame();
  } else {
    nextRound();
  }
}

// Wrap up the session
function endGame() {
  playing = false;
  startBtn.disabled = false;
  stopBtn.disabled = true;
  clearTimeout(appearTimeout);
  clearTarget();

  const avg = times.length ? Math.round(times.reduce((a,b)=>a+b,0)/times.length) : "—";
  setMessage(`Done! Best: ${best ?? "—"} ms, Avg: ${avg} ms`);
  logResult("END", `Best ${best ?? "—"} ms • Avg ${avg} ms`);

  // small BOM alert
  setTimeout(() => window.alert("Game over! Check your results on the right."), 50);
}
