import { rollRarity } from './pull.js';
import {
  addCoin,
  getCoins,
  getCommonCount,
  getRareCount,
  recordPull,
  spendCoin,
} from './gameState.js';

const pullBtn = document.getElementById('pull-btn');
const resultEl = document.getElementById('result');
const coinBalanceEl = document.getElementById('coin-balance');
const commonCountEl = document.getElementById('common-count');
const rareCountEl = document.getElementById('rare-count');
const coinTimerEl = document.getElementById('coin-timer');

const NOT_ENOUGH_COINS = 'Not enough coins.';
const PASSIVE_INCOME_MS = 60_000;

let nextCoinAt = Date.now() + PASSIVE_INCOME_MS;

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

pullBtn.addEventListener('click', () => {
  if (getCoins() < 1) {
    resultEl.textContent = NOT_ENOUGH_COINS;
    clearResultRarityClasses();
    return;
  }

  spendCoin();
  const { rarity, label } = rollRarity();
  recordPull(rarity);

  resultEl.textContent = label;
  resultEl.classList.remove('rarity-common', 'rarity-rare');
  resultEl.classList.add(rarity === 'rare' ? 'rarity-rare' : 'rarity-common');

  renderStats();
});

renderStats();
renderCoinTimer();

setInterval(() => {
  addCoin();
  renderStats();
  nextCoinAt = Date.now() + PASSIVE_INCOME_MS;
}, PASSIVE_INCOME_MS);

setInterval(renderCoinTimer, 1000);
