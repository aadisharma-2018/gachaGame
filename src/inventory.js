import { CARDS } from './cards.js';

/** @type {Record<string, number>} */
const quantities = Object.fromEntries(CARDS.map((card) => [card.id, 0]));

export function getQuantity(cardId) {
  return quantities[cardId] ?? 0;
}

export function addCard(cardId) {
  if (cardId in quantities) {
    quantities[cardId] += 1;
  }
}

/** @param {Record<string, number>} counts */
export function loadInventory(counts) {
  for (const card of CARDS) {
    quantities[card.id] = counts[card.id] ?? 0;
  }
}

export function resetInventory() {
  for (const card of CARDS) {
    quantities[card.id] = 0;
  }
}
