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