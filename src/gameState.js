const START_COINS = 10;

let coins = START_COINS;
let commonCount = 0;
let rareCount = 0;

export function getCoins() {
  return coins;
}

export function getCommonCount() {
  return commonCount;
}

export function getRareCount() {
  return rareCount;
}

/** Spend 1 coin if available. Returns true when spent. */
export function spendCoin() {
  if (coins < 1) {
    return false;
  }
  coins -= 1;
  return true;
}

export function addCoin() {
  coins += 1;
}

export function recordPull(rarity) {
  if (rarity === 'rare') {
    rareCount += 1;
  } else {
    commonCount += 1;
  }
}
