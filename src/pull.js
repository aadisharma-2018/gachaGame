/**
 * Map a random value in [0, 1) to pull rarity: Rare when value < 0.1, Common otherwise.
 * @param {number} randomValue
 * @returns {{ rarity: 'common' | 'rare', label: 'Common' | 'Rare' }}
 */
export function resolveRarity(randomValue) {
  const isRare = randomValue < 0.1;
  if (isRare) {
    return { rarity: 'rare', label: 'Rare' };
  }
  return { rarity: 'common', label: 'Common' };
}

/**
 * Roll card rarity: Rare 10% (Math.random() < 0.1), Common otherwise.
 * @returns {{ rarity: 'common' | 'rare', label: 'Common' | 'Rare' }}
 */
export function rollRarity() {
  return resolveRarity(Math.random());
}
