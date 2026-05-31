/** @typedef {{ id: string, name: string, rarity: 'common' | 'rare', emoji: string, label: 'Common' | 'Rare' }} Card */

/** @type {Card[]} */
export const CARDS = [
  { id: 'archer', name: 'Archer', rarity: 'common', emoji: '🏹', label: 'Common' },
  { id: 'swordsman', name: 'Swordsman', rarity: 'common', emoji: '⚔️', label: 'Common' },
  { id: 'protector', name: 'Protector', rarity: 'common', emoji: '🛡️', label: 'Common' },
  { id: 'mage', name: 'Mage', rarity: 'rare', emoji: '🪄', label: 'Rare' },
  { id: 'king', name: 'King', rarity: 'rare', emoji: '👑', label: 'Rare' },
];

export const COMMON_CARDS = CARDS.filter((card) => card.rarity === 'common');
export const RARE_CARDS = CARDS.filter((card) => card.rarity === 'rare');

/**
 * Pick a card uniformly from the rarity pool.
 * @param {'common' | 'rare'} rarity
 * @param {number} randomValue — value in [0, 1)
 * @returns {Card}
 */
export function pickCardFromPool(rarity, randomValue) {
  const pool = rarity === 'rare' ? RARE_CARDS : COMMON_CARDS;
  const index = Math.floor(randomValue * pool.length);
  return pool[index];
}
