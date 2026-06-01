import { CARDS } from './cards.js';
import { addCard, getQuantity } from './inventory.js';
import {
  applyGameState,
  collectGameState,
  getDefaultGameState,
  loadGameState,
  saveGameState,
} from './persistence.js';
import { rollCard } from './pull.js';
import {
  addCoin,
  getCoins,
  getCommonCount,
  getRareCount,
  recordPull,
  spendCoin,
} from './gameState.js';

const pullBtn = document.getElementById('pull-btn');
const inventoryBtn = document.getElementById('inventory-btn');
const resultEl = document.getElementById('result');
const inventoryPanelEl = document.getElementById('inventory-panel');
const inventoryListEl = document.getElementById('inventory-list');
const coinBalanceEl = document.getElementById('coin-balance');
const commonCountEl = document.getElementById('common-count');
const rareCountEl = document.getElementById('rare-count');
const coinTimerEl = document.getElementById('coin-timer');

const NOT_ENOUGH_COINS = 'Not enough coins.';
const PASSIVE_INCOME_MS = 60_000;

let nextCoinAt = Date.now() + PASSIVE_INCOME_MS;
let inventoryOpen = false;
let lastPullCardId = null;

function renderStats() {
  coinBalanceEl.textContent = `Coins: ${getCoins()}`;
  commonCountEl.textContent = `Common: ${getCommonCount()}`;
  rareCountEl.textContent = `Rare: ${getRareCount()}`;
}

function renderCoinTimer() {
  const msLeft = Math.max(0, nextCoinAt - Date.now());
  const totalSec = Math.ceil(msLeft / 1000);
  const min = Math.floor(totalSec / 60);
  const sec = totalSec % 60;
  coinTimerEl.textContent = `Next coin: ${min}:${String(sec).padStart(2, '0')}`;
}

function clearResultRarityClasses() {
  resultEl.classList.remove('rarity-common', 'rarity-rare');
}

function renderDefaultResult() {
  resultEl.textContent = 'Pull to reveal a card';
  clearResultRarityClasses();
}

function renderResult(card) {
  resultEl.innerHTML = `
    <span class="game__result-emoji" aria-hidden="true">${card.emoji}</span>
    <span class="game__result-name">${card.name}</span>
    <span class="game__result-rarity">${card.label}</span>
  `;
  resultEl.classList.remove('rarity-common', 'rarity-rare');
  resultEl.classList.add(card.rarity === 'rare' ? 'rarity-rare' : 'rarity-common');
}

function renderInventory() {
  inventoryListEl.innerHTML = CARDS.map((card) => {
    const quantity = getQuantity(card.id);
    if (quantity === 0) {
      return `
      <li class="game__inventory-item">
        <span class="game__inventory-emoji" aria-hidden="true">?</span>
        <span class="game__inventory-name">???</span>
        <span class="game__inventory-rarity">???</span>
        <span class="game__inventory-qty">× 0</span>
      </li>
    `;
    }
    return `
      <li class="game__inventory-item">
        <span class="game__inventory-emoji" aria-hidden="true">${card.emoji}</span>
        <span class="game__inventory-name">${card.name}</span>
        <span class="game__inventory-rarity">${card.label}</span>
        <span class="game__inventory-qty">× ${quantity}</span>
      </li>
    `;
  }).join('');
}

function setInventoryOpen(open) {
  inventoryOpen = open;
  inventoryPanelEl.hidden = !open;
  if (open) {
    renderInventory();
  }
}

function persistState() {
  saveGameState(collectGameState(lastPullCardId));
}

function initializeFromStorage() {
  const saved = loadGameState();
  const snapshot = saved ?? getDefaultGameState();
  const lastCard = applyGameState(snapshot);
  lastPullCardId = snapshot.lastPull;

  renderStats();
  if (lastCard) {
    renderResult(lastCard);
  } else {
    renderDefaultResult();
  }
  renderCoinTimer();
  renderInventory();
}

pullBtn.addEventListener('click', () => {
  if (getCoins() < 1) {
    resultEl.textContent = NOT_ENOUGH_COINS;
    clearResultRarityClasses();
    return;
  }

  spendCoin();
  const card = rollCard();
  recordPull(card.rarity);
  addCard(card.id);
  lastPullCardId = card.id;

  renderResult(card);
  renderStats();
  if (inventoryOpen) {
    renderInventory();
  }
  persistState();
});

inventoryBtn.addEventListener('click', () => {
  setInventoryOpen(!inventoryOpen);
});

initializeFromStorage();

setInterval(() => {
  addCoin();
  renderStats();
  nextCoinAt = Date.now() + PASSIVE_INCOME_MS;
  persistState();
}, PASSIVE_INCOME_MS);

setInterval(renderCoinTimer, 1000);
