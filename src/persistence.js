import { CARDS } from './cards.js';
import {
  getCoins,
  getCommonCount,
  getRareCount,
  loadGameStateValues,
} from './gameState.js';
import { getQuantity, loadInventory } from './inventory.js';

export const STORAGE_KEY = 'gachaGameState';
export const SCHEMA_VERSION = 1;

const CARD_IDS = CARDS.map((card) => card.id);

/** @returns {import('./persistence.js').GameStateSnapshot} */
export function getDefaultGameState() {
  return {
    version: SCHEMA_VERSION,
    coins: 10,
    commonCount: 0,
    rareCount: 0,
    inventory: {
      archer: 0,
      swordsman: 0,
      protector: 0,
      mage: 0,
      king: 0,
    },
    lastPull: null,
  };
}

/**
 * @param {unknown} data
 * @returns {ReturnType<typeof getDefaultGameState> | null}
 */
export function validateGameState(data) {
  if (data === null || typeof data !== 'object') {
    return null;
  }

  const snapshot = /** @type {Record<string, unknown>} */ (data);

  if (snapshot.version !== SCHEMA_VERSION) {
    return null;
  }

  if (!isNonNegativeInteger(snapshot.coins)) {
    return null;
  }
  if (!isNonNegativeInteger(snapshot.commonCount)) {
    return null;
  }
  if (!isNonNegativeInteger(snapshot.rareCount)) {
    return null;
  }

  if (snapshot.inventory === null || typeof snapshot.inventory !== 'object') {
    return null;
  }

  const inventory = /** @type {Record<string, unknown>} */ (snapshot.inventory);
  /** @type {Record<string, number>} */
  const validatedInventory = {};

  for (const cardId of CARD_IDS) {
    const quantity = inventory[cardId];
    if (!isNonNegativeInteger(quantity)) {
      return null;
    }
    validatedInventory[cardId] = quantity;
  }

  if (snapshot.lastPull !== null) {
    if (typeof snapshot.lastPull !== 'string' || !CARD_IDS.includes(snapshot.lastPull)) {
      return null;
    }
  }

  return {
    version: SCHEMA_VERSION,
    coins: snapshot.coins,
    commonCount: snapshot.commonCount,
    rareCount: snapshot.rareCount,
    inventory: validatedInventory,
    lastPull: snapshot.lastPull,
  };
}

/**
 * @returns {ReturnType<typeof getDefaultGameState> | null}
 */
export function loadGameState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw === null) {
      return null;
    }
    return validateGameState(JSON.parse(raw));
  } catch {
    return null;
  }
}

/** @param {ReturnType<typeof getDefaultGameState>} snapshot */
export function saveGameState(snapshot) {
  const validated = validateGameState(snapshot);
  if (!validated) {
    return;
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(validated));
}

export function clearGameState() {
  localStorage.removeItem(STORAGE_KEY);
}

/** @param {string | null} lastPullId */
export function collectGameState(lastPullId) {
  return {
    version: SCHEMA_VERSION,
    coins: getCoins(),
    commonCount: getCommonCount(),
    rareCount: getRareCount(),
    inventory: {
      archer: getQuantity('archer'),
      swordsman: getQuantity('swordsman'),
      protector: getQuantity('protector'),
      mage: getQuantity('mage'),
      king: getQuantity('king'),
    },
    lastPull: lastPullId ?? null,
  };
}

/**
 * @param {ReturnType<typeof getDefaultGameState>} snapshot
 * @returns {import('./cards.js').Card | null}
 */
export function applyGameState(snapshot) {
  loadGameStateValues(snapshot.coins, snapshot.commonCount, snapshot.rareCount);
  loadInventory(snapshot.inventory);

  if (snapshot.lastPull === null) {
    return null;
  }

  return CARDS.find((card) => card.id === snapshot.lastPull) ?? null;
}

function isNonNegativeInteger(value) {
  return typeof value === 'number' && Number.isInteger(value) && value >= 0;
}
