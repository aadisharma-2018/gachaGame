/**
 * Roll card rarity: Rare 10% (Math.random() < 0.1), Common otherwise.
 * @returns {{ rarity: 'common' | 'rare', label: 'Common' | 'Rare' }}
 */
export function rollRarity() {
  const isRare = Math.random() < 0.1;
  if (isRare) {
    return { rarity: 'rare', label: 'Rare' };
  }
  return { rarity: 'common', label: 'Common' };
}
