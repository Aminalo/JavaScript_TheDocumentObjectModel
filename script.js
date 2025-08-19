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